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
import { InvoiceRevisionService } from "@/services/invoiceRevision.service";
import type { PubSub } from "graphql-subscriptions";
import { DemoService } from "../services/demo.service";
import { DEMO_USER } from "../../prisma/demoWorkspace.cjs";
import { NODE_ENV } from "@/config/server.config";
import type { Logger } from "@/config/logger.config";
import type { Context } from "graphql-ws";
import type { Request } from "express";
import type { IUserRepo } from "../repositories/userRepo";

const logger = container.get<Logger>(TYPES.Logger);

const client = jwksClient({
  jwksUri: `${process.env["DOMAIN"]}.well-known/jwks.json`,
});

logger.info(`Domain: ${process.env["DOMAIN"]}`);
logger.info(`Audience: ${process.env["AUDIENCE"]}`);

function getSigningKeyAsync(kid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    client.getSigningKey(
      kid,
      (err: Error | null, key: SigningKey | undefined) => {
        if (err) {
          logger.error(`Error fetching signing key: ${err.message}`);
          console.error("Error fetching signing key:", err);
          logger.error(err.message);
          return reject(err);
        }
        if (!key) {
          const error = new Error("Signing key not found");
          logger.error(error.message);
          console.error(error);
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
  // Demo credentials are handled before the legacy test/CI shortcut too.
  // eslint-disable-next-line security/detect-possible-timing-attacks -- Public demo selector, not a secret credential.
  if (token === "demo-token") {
    return process.env["DEMO_MODE"] === "true"
      ? { ...DEMO_USER, isDemo: true }
      : null;
  }
  // Retired and unrecognized demo credentials never become normal/test admins.
  if (token.startsWith("demo-")) return null;

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
    console.error("Token verification failed:", err);
    throw err;
  }
}

// Helper function to verify token and return payload
async function verifyToken(
  token: string,
  options: VerifyOptions,
): Promise<JwtPayload> {
  const decoded = jwt.decode(token, { complete: true });
  if (!decoded || typeof decoded !== "object" || !decoded.header.kid) {
    throw new Error("Invalid token");
  }
  const signingKey = await getSigningKeyAsync(decoded.header.kid);
  return jwt.verify(token, signingKey, options) as JwtPayload;
}

// Helper function to extract user data from payload
function extractUserFromPayload(payload: JwtPayload): UserIdAndRole {
  const email =
    typeof payload["invoice-web-app/email"] === "string"
      ? payload["invoice-web-app/email"]
      : "";
  const id = payload.sub ?? "";
  const name = typeof payload["name"] === "string" ? payload["name"] : "user";
  const roles = Array.isArray(payload["invoice-web-app/roles"])
    ? (payload["invoice-web-app/roles"] as string[])
    : [];

  if (!email) throw new Error("Email claim is missing or invalid");
  if (!id) throw new Error("Id claim is missing or invalid");

  const role = roles.includes("Admin") ? "ADMIN" : "USER";
  return { id, role, username: email, name };
}

export async function createContext({
  req,
  connection,
}: ContextArgs): Promise<InjectedQueryContext> {
  logger.debug("creating context");

  if (connection) {
    // This branch handles subscription requests, which are initiated through WebSocket connections.
    logger.debug("Subscription request");
    return await createSubscriptionContext(connection);
  }

  if (!req) {
    // This branch handles HTTP requests.
    logger.debug("HTTP request");
    return { user: null, container };
  }

  // Regular http requests
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return { user: null, container };
    }

    const childContainer = setupContainer(user);
    const services = getServices(childContainer);
    const dbUser = await getOrCreateDbUser(user, services.userService);
    const effectiveUser = user.isDemo
      ? { ...dbUser, role: "USER" as const, isDemo: true }
      : dbUser;
    // User API policy follows the returned HTTP identity (including stored role).
    // Keep the existing token-bound invoice/revision services unchanged.
    childContainer
      .rebind<UserService>(TYPES.UserService)
      .toDynamicValue(
        () =>
          new UserService(
            childContainer.get<IUserRepo>(TYPES.IUserRepo),
            effectiveUser,
            logger,
          ),
      );
    services.userService = childContainer.get<UserService>(TYPES.UserService);

    logger.debug("Authenticated user context created");

    return {
      user: effectiveUser,
      ...services,
      container: childContainer,
    };
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error("Error in createContext function:", error.message, error);
    return { user: null, container };
  }
}

async function getUserFromRequest(req: Request): Promise<UserIdAndRole | null> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return null;
  }

  return retrieveUserFromToken(token, options);
}

function setupContainer(user: UserIdAndRole) {
  const childContainer = container.createChild();
  childContainer.bind<UserIdAndRole>(TYPES.UserContext).toConstantValue(user);

  // Rebind dependent services so they pick up the new binding
  childContainer
    .bind<UserService>(TYPES.UserService)
    .to(UserService)
    .inTransientScope();
  childContainer
    .bind<InvoiceService>(TYPES.InvoiceService)
    .to(InvoiceService)
    .inTransientScope();
  childContainer
    .bind<InvoiceRevisionService>(TYPES.InvoiceRevisionService)
    .to(InvoiceRevisionService)
    .inTransientScope();

  childContainer
    .bind<DemoService>(TYPES.DemoService)
    .to(DemoService)
    .inTransientScope();

  return childContainer;
}

function getServices(childContainer: typeof container) {
  // resolve services from the Inversify child container
  const invoiceService = childContainer.tryGet<InvoiceService>(
    TYPES.InvoiceService,
  );
  const userService = childContainer.tryGet<UserService>(TYPES.UserService);
  const invoiceRevisionService = childContainer.tryGet<InvoiceRevisionService>(
    TYPES.InvoiceRevisionService,
  );
  const pubsub = childContainer.tryGet<PubSub>(TYPES.PubSub);
  const demoService = childContainer.get<DemoService>(TYPES.DemoService);

  if (!invoiceService) {
    throw new Error("Invoice service not found");
  }

  if (!userService) {
    throw new Error("User service not found");
  }

  if (!invoiceRevisionService) {
    throw new Error("Invoice revision service not found");
  }

  if (!pubsub) {
    throw new Error("PubSub not found");
  }

  return {
    invoiceService,
    userService,
    invoiceRevisionService,
    pubsub,
    demoService,
  };
}

async function getOrCreateDbUser(
  user: UserIdAndRole,
  userService: UserService,
) {
  try {
    let dbUser = await userService.getUserByIdSafely(user.id);

    if (!dbUser) {
      logger.info("User not found, creating user");
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
      logger.error(`Error creating user: ${e.message}`);
    } else {
      logger.error(`Error creating user: ${String(e)}`);
    }
    throw e;
  }
}

async function createSubscriptionContext(connection: Context) {
  const authHeader = (connection.connectionParams?.["Authorization"] ||
    connection.connectionParams?.["authorization"]) as string | undefined;
  if (!authHeader?.startsWith("Bearer "))
    return { user: null, container, connection };
  try {
    const token = authHeader.split(" ")[1];
    const user = token ? await retrieveUserFromToken(token, options) : null;
    if (!user) return { user: null, container, connection };
    const childContainer = setupContainer(user);
    return {
      user,
      ...getServices(childContainer),
      container: childContainer,
      connection,
    };
  } catch {
    return { user: null, container, connection };
  }
}
