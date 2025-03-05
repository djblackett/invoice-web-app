import jwt, { JwtHeader, JwtPayload, VerifyOptions } from "jsonwebtoken";
import jwksClient, { SigningKey } from "jwks-rsa";
import {
  ContextArgs,
  InjectedQueryContext,
  UserIdAndRole,
} from "../constants/types";
import container from "@/config/inversify.config";
import TYPES from "@/constants/identifiers";
import { InvoiceService } from "@/services/invoice.service";
import { UserService } from "@/services/user.service";
import { PubSub } from "graphql-subscriptions";
import { Role } from "@prisma/client";
import { NODE_ENV } from "@/config/server.config";
import { Logger } from "@/config/logger.config";
import { Context } from "graphql-ws";

const logger = container.get<Logger>(TYPES.Logger);

const client = jwksClient({
  jwksUri: `${process.env.DOMAIN}/.well-known/jwks.json`,
});

function getSigningKeyAsync(kid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    client.getSigningKey(
      kid,
      (err: Error | null, key: SigningKey | undefined) => {
        if (err) {
          console.error("Error fetching signing key:", err);
          return reject(err);
        }
        if (!key) {
          const error = new Error("Signing key not found");
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
  audience: process.env.AUDIENCE,
  issuer: process.env.DOMAIN,
  algorithms: ["RS256"],
};

export async function retrieveUserFromToken(
  token: string,
  options: VerifyOptions,
): Promise<UserIdAndRole> {
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

    if (!decoded || typeof decoded !== "object" || !decoded.header) {
      throw new Error("Invalid token");
    }

    const header = decoded.header as JwtHeader;

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
    let email;

    if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "CI") {
      email = "user@example.com";
    } else {
      email = payload[emailClaim];
    }

    const id = payload.sub;
    const name = payload.name ?? "user";

    // Assign role based on payload or default to USER
    let role: "USER" | "ADMIN";
    const tokenRoleClaim = `${namespace}roles`;
    const tokenRole = payload[tokenRoleClaim];

    if (
      (tokenRole && tokenRole.includes("Admin")) ||
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

  // Regular http requests
  const authHeader = req && req.headers ? req.headers.authorization : undefined;

  try {
    let user;
    if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "CI") {
      user = {
        id: "auth0|12345",
        role: "ADMIN" as Role,
        username: "user@example.com",
        name: "user",
      };
    }
    let token;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      if (token !== "demo-token" && token !== "demo-token-admin") {
        user = await retrieveUserFromToken(token, options);
        if (!user) {
          throw new Error("User not found");
        }
      } else if (token === "demo-token") {
        user = {
          id: "demoId",
          role: Role.USER,
          username: "demo-user@example.com",
          name: "demo-user",
        };
      } else {
        user = {
          id: "demoAdminId",
          role: Role.ADMIN,
          username: "demo-admin@example.com",
          name: "demo-admin",
        };
      }
    }

    const childContainer = container.createChild();
    if (!user) {
      console.warn("User is undefined, cannot proceed with user creation.");
      return { user: null, container: container };
    }
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

    // Resolve services from the child container
    const invoiceService = childContainer.get<InvoiceService>(
      TYPES.InvoiceService,
    );
    const userService = childContainer.get<UserService>(TYPES.UserService);
    const pubsub = childContainer.get<PubSub>(TYPES.PubSub);

    if (!invoiceService) {
      throw new Error("Invoice service not found");
    }

    if (!userService) {
      throw new Error("User service not found");
    }

    if (!pubsub) {
      throw new Error("PubSub not found");
    }

    let dbUser;

    try {
      dbUser = await userService.getUserByIdSafely(user.id);

      if (!dbUser) {
        logger.info("User not found, creating user");
        dbUser = await userService.createUserWithAuth0({
          id: user.id,
          name: user.name,
          username: user.username ?? "",
          role: user.role,
        });
      }
    } catch (e: any) {
      logger.error(`Error creating user: ${e.message}`);
      throw e;
    }

    logger.info(`User: ${dbUser.username}`);

    const returnPayload = {
      user: dbUser,
      invoiceService,
      userService,
      pubsub,
      container: childContainer,
    };

    return returnPayload;
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error("Error in createContext function:", error.message, error);
    return { user: null, container };
  }
}

async function createSubscriptionContext(connection: Context) {
  const authHeader = (connection?.connectionParams?.Authorization ||
    connection?.connectionParams?.authorization) as string | undefined;

  let user = null;
  let token = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    if (token !== "demo-token" && token !== "demo-token-admin") {
      try {
        try {
          user = await retrieveUserFromToken(token, options);
        } catch (error) {
          logger.error("Token verification failed:" + JSON.stringify(error));
          user = null;
        }
      } catch (error) {
        console.error("Subscription token verification failed:", error);
        user = null;
      }
    } else if (token === "demo-token") {
      user = {
        id: "demoId",
        role: Role.USER,
        username: "demo-user@example.com",
        name: "demo-user",
      };
    } else {
      user = {
        id: "demoAdminId",
        role: Role.ADMIN,
        username: "demo-admin@example.com",
        name: "demo-admin",
      };
    }
  }

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
