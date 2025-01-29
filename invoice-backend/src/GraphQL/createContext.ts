import jwt, { JwtHeader, JwtPayload, VerifyOptions } from "jsonwebtoken";
import jwksClient, { SigningKey } from "jwks-rsa";
import {
  ContextArgs,
  InjectedQueryContext,
  UserDTO,
  UserIdAndRole,
} from "../constants/types";
import container from "@/config/inversify.config";
import TYPES from "@/constants/identifiers";
import { InvoiceService } from "@/services/invoice.service";
import { UserService } from "@/services/user.service";
import { PubSub } from "graphql-subscriptions";

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
async function verifyTokenAndGetEmail(
  token: string,
  options: VerifyOptions,
): Promise<UserIdAndRole> {
  try {
    console.log("Verifying token:", token);

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

    console.log("Decoded payload:", payload);

    // Construct the fully qualified claim name
    const emailClaim = `${namespace}email`;

    // Extract the email from the custom claim
    const email = payload[emailClaim];
    // const user = payload as UserDTO;
    const id = payload.sub;
    const name = payload.name ?? "Dude";

    // Assign role based on payload or default to USER
    const role: "USER" | "ADMIN" = (payload as any).role || "USER";

    if (id && role && email) {
      return {
        id,
        role,
        username: email,
        name,
      };
    } else {
      throw new Error("Id claim is missing or invalid");
    }
  } catch (err) {
    console.error("Token verification failed:", err);
    throw err;
  }
}

export async function createContext({
  req,
  connection,
}: ContextArgs): Promise<InjectedQueryContext> {
  if (connection) {
    // This is a subscription request
    return { connection };
  }
  const authHeader = req?.headers.authorization;
  try {
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const user = await verifyTokenAndGetEmail(token, options);

      const childContainer = container.createChild();

      childContainer
        .bind<UserIdAndRole>(TYPES.UserContext)
        .toConstantValue(user);

      // Resolve services from the child container
      const invoiceService = childContainer.get<InvoiceService>(
        TYPES.InvoiceService,
      );
      const userService = childContainer.get<UserService>(TYPES.UserService);
      const pubsub = childContainer.get<PubSub>(TYPES.PubSub);

      if (!invoiceService || !userService || !pubsub) {
        console.error("Service not found in context");
        throw new Error("Context creation failed");
      }

      let newUser;

      try {
        const result = await userService.getUserSafely(user.id);

        if (!result) {
          newUser = await userService.createUserWithAuth0({
            id: user.id,
            name: user.name,
            username: user.username ?? "",
            role: user.role,
          });

          console.log("Created new user:", newUser);
        }
      } catch (e) {
        console.error("error:", e);
      }

      return {
        user: newUser ?? user,
        invoiceService,
        userService,
        pubsub,
        container: childContainer,
      };
    } else {
      return { user: null, container };
    }
  } catch (e) {
    console.error("error:", e);
    return { user: null, container };
  }
}
