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
import { PrismaClient, Role } from "@prisma/client";
import { NODE_ENV } from "@/config/server.config";

const client = jwksClient({
  jwksUri: "https://dev-n4e4qk7s3kbzusrs.us.auth0.com/.well-known/jwks.json",
});

/**
 * Promisified function to retrieve the signing key as a string.
 * @param kid - The Key ID from the JWT header.
 * @returns A promise that resolves to the public key string.
 */

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
  audience: "https://invoice-web-app/",
  issuer: "https://dev-n4e4qk7s3kbzusrs.us.auth0.com/",
  algorithms: ["RS256"],
};

/**
 * Verifies a JWT and extracts the user's email from a custom namespaced claim.
 * @param token - The JWT string to verify.
 * @param options - Verification options including audience, issuer, and algorithms.
 * @returns A promise that resolves to the user's email.
 */
export async function verifyTokenAndGetEmail(
  token: string,
  options: VerifyOptions,
): Promise<UserIdAndRole> {
  console.error("verifyTokenAndGetEmail- NODE_ENV:", NODE_ENV);
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
    if (payload.role === "Admin" || NODE_ENV === "test" || NODE_ENV === "CI") {
      role = "ADMIN";
    } else if (payload.role === "User") {
      role = "USER";
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
  testPrisma,
}: ContextArgs): Promise<InjectedQueryContext> {
  if (connection) {
    // This is a subscription request
    return { connection };
  }
  const authHeader = req?.headers.authorization;
  try {
    let user;
    if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "CI") {
      user = {
        id: "auth0|12345",
        role: "ADMIN" as Role,
        username: "user@example.com",
        name: "user",
      };

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        user = await verifyTokenAndGetEmail(token, options);
      }
      const childContainer = container.createChild();

      childContainer
        .bind<UserIdAndRole>(TYPES.UserContext)
        .toConstantValue(user);

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
          dbUser = await userService.createUserWithAuth0({
            id: user.id,
            name: user.name,
            username: user.username ?? "",
            role: user.role,
          });
        }
      } catch (e) {
        console.error("User creation failed:", e);
        throw e;
      }

      // console.log("User created:", dbUser);

      const returnPayload = {
        user: dbUser,
        invoiceService,
        userService,
        pubsub,
        container: childContainer,
      };

      // console.log("Context created:", returnPayload);
      // console.log("At end of createContext. UserService:", userService);
      return returnPayload;
    } else {
      return { user: null, container };
    }
  } catch (e) {
    console.error("error:", e);
    return { user: null, container };
  }
}
