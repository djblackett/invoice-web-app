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
import type { PubSub } from "graphql-subscriptions";
import { Role } from "@prisma/client";
import { NODE_ENV } from "@/config/server.config";
import type { Logger } from "@/config/logger.config";
import type { Context } from "graphql-ws";
import type { Request } from "express";

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
  if (NODE_ENV === "test" || NODE_ENV === "CI") {
    return {
      id: "auth0|12345",
      role: "ADMIN",
      username: "user@example.com",
      name: "user",
    };
  }

  try {
    // Define the namespace used for custom claims
    const namespace = "invoice-web-app/";

    // Decode the token to extract the header
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || typeof decoded !== "object") {
      throw new Error("Invalid token");
    }

    const header = decoded.header;

    if (!header.kid) {
      throw new Error("Invalid Token: no header.kid");
    }

    // Retrieve the signing key as a string
    const signingKey = await getSigningKeyAsync(header.kid);

    // Verify the token's signature and claims
    const payload = jwt.verify(token, signingKey, options) as JwtPayload;

    // Construct the fully qualified claim name
    const emailClaim = `${namespace}email`;

    // Extract the email from the custom claim
    let email: string;

    if (
      process.env["NODE_ENV"] === "test" ||
      process.env["NODE_ENV"] === "CI"
    ) {
      email = "user@example.com";
    } else {
      email =
        typeof payload[emailClaim] === "string" ? payload[emailClaim] : "";
    }

    const id = payload.sub;
    const name = typeof payload["name"] === "string" ? payload["name"] : "user";

    // Assign role based on payload or default to USER
    let role: "USER" | "ADMIN";
    const tokenRoleClaim = `${namespace}roles`;
    const tokenRole = Array.isArray(payload[tokenRoleClaim])
      ? (payload[tokenRoleClaim] as string[])
      : [];

    if (
      tokenRole.includes("Admin") ||
      NODE_ENV === "test" ||
      NODE_ENV === "CI"
    ) {
      role = "ADMIN";
    } else {
      role = "USER";
    }

    if (!email || typeof email !== "string") {
      throw new Error("Email claim is missing or invalid");
    }

    if (!id || typeof id !== "string") {
      throw new Error("Id claim is missing or invalid");
    }

    return {
      id,
      role,
      username: email,
      name,
    };
  } catch (err) {
    console.error("Token verification failed:", err);
    throw err;
  }
}

export async function createContext({
  req,
  connection,
}: ContextArgs): Promise<InjectedQueryContext> {
  logger.info("creating context");

  if (connection) {
    // This branch handles subscription requests, which are initiated through WebSocket connections.
    logger.info("Subscription request");
    return await createSubscriptionContext(connection);
  }

  if (!req) {
    // This branch handles HTTP requests.
    logger.info("HTTP request");
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

    logger.info(`User: ${dbUser.username}`);

    return {
      user: dbUser,
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

  // return dummy users for testing, CI, and demo mode
  if (process.env["NODE_ENV"] === "test" || process.env["NODE_ENV"] === "CI") {
    return {
      id: "auth0|12345",
      role: "ADMIN" as Role,
      username: "user@example.com",
      name: "user",
    };
  }

  if (token === "demo-token") {
    return {
      id: "demoId",
      role: Role.USER,
      username: "demo-user@example.com",
      name: "demo-user",
    };
  }

  if (token === "demo-token-admin") {
    return {
      id: "demoAdminId",
      role: Role.ADMIN,
      username: "demo-admin@example.com",
      name: "demo-admin",
    };
  }

  // return standard user
  const user = await retrieveUserFromToken(token, options);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
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
  const user = await getUserFromSubscriptionConnection(connection);
  const childContainer = container.createChild();

  if (user) {
    childContainer.bind<UserIdAndRole>(TYPES.UserContext).toConstantValue(user);
  }

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

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  if (token === "demo-token") {
    return {
      id: "demoId",
      role: Role.USER,
      username: "demo-user@example.com",
      name: "demo-user",
    };
  }

  if (token === "demo-token-admin") {
    return {
      id: "demoAdminId",
      role: Role.ADMIN,
      username: "demo-admin@example.com",
      name: "demo-admin",
    };
  }
  try {
    if (!token) {
      return null;
    }
    return await retrieveUserFromToken(token, options);
  } catch (error) {
    logger.error("Token verification failed:" + JSON.stringify(error));
    return null;
  }
}
