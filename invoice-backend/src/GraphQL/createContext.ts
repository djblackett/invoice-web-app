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

const DEBUG = false;

const client = jwksClient({
  jwksUri: "https://dev-n4e4qk7s3kbzusrs.us.auth0.com/.well-known/jwks.json",
});

// Promisify the getSigningKey function
const getSigningKeyAsync = promisify(client.getSigningKey);

async function getSigningKey(header: JwtHeader): Promise<string> {
  try {
    const key: SigningKey | undefined = await getSigningKeyAsync(header.kid);
    if (key) {
      return key.getPublicKey();
    }
    throw new Error("Unable to retrieve signing key: Not found");
  } catch (err: any) {
    throw new Error(`Unable to retrieve signing key: ${err.message}`);
  }
}

const options: VerifyOptions = {
  audience: "https://invoice-web-app/",
  issuer: "https://dev-n4e4qk7s3kbzusrs.us.auth0.com/",
  algorithms: ["RS256"],
};

// Function to verify token and extract email
async function verifyTokenAndGetEmail(
  token: string,
  options: VerifyOptions,
): Promise<string> {
  try {
    console.log("Verifying token:", token);

    // Decode the token to get the header
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded !== "object") {
      throw new Error("Invalid token");
    }

    const header = decoded.header as JwtHeader;

    // Retrieve the signing key
    const signingKey = await getSigningKey(header);

    // Verify the token
    const payload = jwt.verify(token, signingKey, options) as JwtPayload;

    console.log("Decoded payload:", payload);

    // Extract the email
    if (payload.email && typeof payload.email === "string") {
      return payload.email;
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
