import type { JwtPayload, VerifyOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import type { SigningKey } from "jwks-rsa";
import jwksClient from "jwks-rsa";
import type {
  ContextArgs,
  InjectedQueryContext,
  UserIdAndRole,
} from "../constants/types";
import container from "@/config/inversify.config";
import TYPES from "@/constants/identifiers";
import { InvoiceService } from "@/services/invoice.service";
import { UserService } from "@/services/user.service";
import { TokenService } from "@/services/token.service";
import type { PubSub } from "graphql-subscriptions";
import { Role } from "@prisma/client";
import { NODE_ENV } from "@/config/server.config";
import type { Logger } from "@/config/logger.config";
import type { Context } from "graphql-ws";
import type { Request } from "express";

const getLogger = (): Logger => container.get<Logger>(TYPES.Logger);

const client = jwksClient({
  jwksUri: `${process.env["DOMAIN"]}.well-known/jwks.json`,
});

getLogger().info(`Domain: ${process.env["DOMAIN"]}`);
getLogger().info(`Audience: ${process.env["AUDIENCE"]}`);

function getSigningKeyAsync(kid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    client.getSigningKey(
      kid,
      (err: Error | null, key: SigningKey | undefined) => {
        if (err) {
          getLogger().error(`Error fetching signing key: ${err.message}`);
          return reject(err);
        }
        if (!key) {
          const error = new Error("Signing key not found");
          getLogger().error(error.message);
          return reject(error);
        }
        const signingKey = key.getPublicKey();
        resolve(signingKey);
      },
    );
  });
}

const options: VerifyOptions = {
  audience: process.env["AUDIENCE"],
  // Make sure issuer has the trailing "/"
  issuer: process.env["DOMAIN"],
  algorithms: ["RS256"],
};

export async function retrieveUserFromToken(
  token: string,
  options: VerifyOptions,
): Promise<UserIdAndRole | null> {
  // Handle test/CI environment early return
  if (NODE_ENV === "test" || NODE_ENV === "CI") {
    return {
      id: "auth0|12345",
      role: "ADMIN",
      username: "user@example.com",
      name: "user",
    };
  }

  try {
    const payload = await verifyToken(token, options);
    return extractUserFromPayload(payload);
  } catch (err) {
    getLogger().error("Token verification failed: " + String(err));
    throw err;
  }
}

// Helper function to verify token and return payload
// Note: JWT expiration is automatically validated by jwt.verify()
// For token refresh implementation:
// 1. Frontend should implement token refresh using Auth0's refresh token flow
// 2. When a token is near expiration, request a new token from Auth0
// 3. This can be done via Auth0's /oauth/token endpoint with grant_type=refresh_token
async function verifyToken(
  token: string,
  options: VerifyOptions,
): Promise<JwtPayload> {
  const decoded = jwt.decode(token, { complete: true });
  if (!decoded || typeof decoded !== "object" || !decoded.header.kid) {
    throw new Error("Invalid token");
  }

  // Check if token is expired before verification for better error messages
  const payload = decoded.payload as JwtPayload;
  if (payload.exp && payload.exp < Date.now() / 1000) {
    throw new Error("Token has expired");
  }

  const signingKey = await getSigningKeyAsync(decoded.header.kid);
  // jwt.verify will also check expiration, but we check above for clearer error messaging
  return jwt.verify(token, signingKey, options) as JwtPayload;
}

/* eslint-disable security/detect-object-injection */
// Helper function to extract user data from payload
function extractUserFromPayload(payload: JwtPayload): UserIdAndRole {
  const namespace = "invoice-web-app/";
  const emailClaim = `${namespace}email`;
  const roleClaim = `${namespace}roles`;

  const email =
    typeof payload[emailClaim] === "string" ? payload[emailClaim] : "";
  const id = payload.sub ?? "";
  const name = typeof payload.name === "string" ? payload.name : "user";
  const roles = Array.isArray(payload[roleClaim])
    ? (payload[roleClaim] as string[])
    : [];

  if (!email) throw new Error("Email claim is missing or invalid");
  if (!id) throw new Error("Id claim is missing or invalid");

  const role = roles.includes("Admin") ? "ADMIN" : "USER";
  return { id, role, username: email, name };
}
/* eslint-enable security/detect-object-injection */

export async function createContext({
  req,
  connection,
}: ContextArgs): Promise<InjectedQueryContext> {
  getLogger().info("creating context");

  if (connection) {
    // This branch handles subscription requests, which are initiated through WebSocket connections.
    getLogger().info("Subscription request");
    return await createSubscriptionContext(connection);
  }

  if (!req) {
    // This branch handles requests with neither req nor connection (should not happen in normal operation)
    getLogger().warn("No request or connection provided to createContext");
    return { user: null, container };
  }

  // Regular http requests
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      getLogger().info("No user found from token, returning context with null user");
      return { user: null, container };
    }

    getLogger().info(`User from token: ${user.username} (${user.id})`);

    const childContainer = setupContainer(user);
    const services = getServices(childContainer);
    const dbUser = await getOrCreateDbUser(user, services.userService);

    getLogger().info(`DB User: ${dbUser.username}`);

    return {
      user: dbUser,
      ...services,
      container: childContainer,
    };
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error(String(e));
    getLogger().error(`Error in createContext function: ${error.message}`);
    getLogger().error(`Stack trace: ${error.stack}`);
    return { user: null, container };
  }
}

// Helper function to extract Bearer token from Authorization header
function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  return token || null;
}

// Helper function to get user from token (handles test, demo, Auth0, and new tokens)
async function getUserFromToken(token: string): Promise<UserIdAndRole | null> {
  // return dummy users for testing, CI, and demo mode
  if (process.env["NODE_ENV"] === "test" || process.env["NODE_ENV"] === "CI") {
    return {
      id: "auth0|12345",
      role: "ADMIN" as Role,
      username: "user@example.com",
      name: "user",
    };
  }

  const demoUserToken = process.env["DEMO_USER_TOKEN"];
  const demoAdminToken = process.env["DEMO_ADMIN_TOKEN"];

  if (demoUserToken && token === demoUserToken) {
    return {
      id: "demoId",
      role: Role.USER,
      username: "demo-user@example.com",
      name: "demo-user",
    };
  }

  if (demoAdminToken && token === demoAdminToken) {
    return {
      id: "demoAdminId",
      role: Role.ADMIN,
      username: "demo-admin@example.com",
      name: "demo-admin",
    };
  }

  // Check AUTH_SYSTEM environment variable to determine which auth to use
  const authSystem = process.env["AUTH_SYSTEM"] || "auth0";
  getLogger().info(`AUTH_SYSTEM: ${authSystem}`);

  if (authSystem === "new") {
    // Use new token system only
    getLogger().info("Using new token system");
    return getUserFromNewToken(token);
  } else if (authSystem === "dual") {
    // Try new token first, fallback to Auth0
    getLogger().info("Using dual auth system, trying new token first");
    try {
      return getUserFromNewToken(token);
    } catch (error) {
      getLogger().info(
        `New token verification failed, trying Auth0. Reason: ${String(error)}`,
      );
      return await getUserFromAuth0Token(token);
    }
  } else {
    // Default to Auth0 only
    getLogger().info("Using Auth0 token system");
    return await getUserFromAuth0Token(token);
  }
}

// Helper function to verify new JWT tokens
function getUserFromNewToken(token: string): UserIdAndRole {
  try {
    const tokenService = container.get(TokenService);
    const payload = tokenService.verifyAccessToken(token);

    return {
      id: payload.sub,
      role: payload.role,
      username: payload.email,
      name: payload.name,
    };
  } catch (error) {
    getLogger().error("New token verification failed: " + String(error));
    throw error;
  }
}

// Helper function to verify Auth0 tokens (legacy)
async function getUserFromAuth0Token(token: string): Promise<UserIdAndRole> {
  const user = await retrieveUserFromToken(token, options);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

async function getUserFromRequest(req: Request): Promise<UserIdAndRole | null> {
  const authHeader = req.headers.authorization;
  getLogger().info(`Authorization header: ${authHeader ? authHeader.substring(0, 20) + "..." : "missing"}`);

  const token = extractBearerToken(authHeader);

  if (!token) {
    getLogger().info("No bearer token found in authorization header");
    return null;
  }

  getLogger().info(`Token extracted, attempting to verify (first 20 chars): ${token.substring(0, 20)}...`);
  return await getUserFromToken(token);
}

function setupContainer(user: UserIdAndRole) {
  const childContainer = container.createChild({ skipBaseClassChecks: true });
  childContainer.bind<UserIdAndRole>(TYPES.UserContext).toConstantValue(user);

  // Override parent bindings by binding again in child
  // Child bindings take precedence when resolving
  childContainer
    .bind<UserService>(TYPES.UserService)
    .to(UserService)
    .inTransientScope();
  childContainer
    .bind<InvoiceService>(TYPES.InvoiceService)
    .to(InvoiceService)
    .inTransientScope();

  return childContainer;
}

function getServices(childContainer: typeof container) {
  // resolve services from the Inversify child container
  const invoiceService = childContainer.tryGet<InvoiceService>(
    TYPES.InvoiceService,
  );
  const userService = childContainer.tryGet<UserService>(TYPES.UserService);
  const pubsub = childContainer.tryGet<PubSub>(TYPES.PubSub);

  if (!invoiceService) {
    throw new Error("Invoice service not found");
  }

  if (!userService) {
    throw new Error("User service not found");
  }

  if (!pubsub) {
    throw new Error("PubSub not found");
  }

  return { invoiceService, userService, pubsub };
}

async function getOrCreateDbUser(
  user: UserIdAndRole,
  userService: UserService,
) {
  try {
    let dbUser = await userService.getUserByIdSafely(user.id);

    if (!dbUser) {
      getLogger().info("User not found, creating user");
      dbUser = await userService.createUserWithAuth0({
        id: user.id,
        name: user.name,
        username: user.username ?? "",
        role: user.role,
      });
    }

    return dbUser;
  } catch (e: unknown) {
    if (e instanceof Error) {
      getLogger().error(`Error creating user: ${e.message}`);
    } else {
      getLogger().error(`Error creating user: ${String(e)}`);
    }
    throw e;
  }
}

async function createSubscriptionContext(connection: Context) {
  const user = await getUserFromSubscriptionConnection(connection);
  const childContainer = container.createChild({ skipBaseClassChecks: true });

  // Always bind UserContext (even if null) before resolving services that depend on it
  childContainer
    .bind<UserIdAndRole | null>(TYPES.UserContext)
    .toConstantValue(user);

  // Override parent bindings by binding again in child
  // Child bindings take precedence when resolving
  childContainer
    .bind<UserService>(TYPES.UserService)
    .to(UserService)
    .inTransientScope();
  childContainer
    .bind<InvoiceService>(TYPES.InvoiceService)
    .to(InvoiceService)
    .inTransientScope();

  const invoiceService = childContainer.get<InvoiceService>(
    TYPES.InvoiceService,
  );
  const userService = childContainer.get<UserService>(TYPES.UserService);
  const pubsub = childContainer.get<PubSub>(TYPES.PubSub);

  return {
    user,
    invoiceService,
    userService,
    pubsub,
    container: childContainer,
    connection,
  };
}

async function getUserFromSubscriptionConnection(
  connection: Context,
): Promise<UserIdAndRole | null> {
  const authHeader = (connection.connectionParams?.["Authorization"] ||
    connection.connectionParams?.["authorization"]) as string | undefined;

  const token = extractBearerToken(authHeader);

  if (!token) {
    return null;
  }

  try {
    return await getUserFromToken(token);
  } catch (error) {
    getLogger().error("Token verification failed: " + JSON.stringify(error));
    return null;
  }
}
