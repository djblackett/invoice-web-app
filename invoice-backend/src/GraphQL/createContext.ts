import jwt, {
  JwtHeader,
  JwtPayload,
  SigningKeyCallback,
  VerifyErrors,
  VerifyOptions,
} from "jsonwebtoken";
import jwksClient, { SigningKey } from "jwks-rsa";
import { ContextArgs, QueryContext, UserDTO } from "../constants/types";
import { promisify } from "util";
import { sign } from "crypto";

const DEBUG = false;

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
): Promise<string> {
  try {
    console.log("Verifying token:", token);

    // Define the namespace used for custom claims
    const namespace = "https://invoice-web-app.com/";

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

    if (email && typeof email === "string") {
      console.log("Extracted Email:", email);
      return email;
    } else {
      throw new Error("Email claim is missing or invalid");
    }
  } catch (err) {
    console.error("Token verification failed:", err);
    throw err;
  }
}

export async function createContext({
  req,
  connection,
}: ContextArgs): Promise<QueryContext> {
  if (connection) {
    // This is a subscription request

    return { connection };
  }

  // This is a regular request
  // DEBUG && console.log("regular request");
  // DEBUG && console.log("no connection");

  // DEBUG && console.log("Regular request, checking authorization header...");
  const authHeader = req?.headers.authorization;
  try {
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const username = await verifyTokenAndGetEmail(token, options);
      return { username };
    } else {
      return { username: null };
    }
  } catch (e) {
    console.error("error:", e);
    return { username: null };
  }
}
