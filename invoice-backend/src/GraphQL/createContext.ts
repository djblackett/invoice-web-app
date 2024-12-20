/* eslint-disable @typescript-eslint/no-unused-expressions */
import jwt, {
  JwtHeader,
  JwtPayload,
  SigningKeyCallback,
  VerifyErrors,
  VerifyOptions,
} from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { ContextArgs, QueryContext, UserDTO } from "../constants/types";

const DEBUG = false;

const client = jwksClient({
  jwksUri: "dev-n4e4qk7s3kbzusrs.us.auth0.com/.well-known/jwks.json",
});

function getKey(header: JwtHeader, cb: SigningKeyCallback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key?.getPublicKey();
    cb(null, signingKey);
  });
}

const options: VerifyOptions = {
  audience: "loNmHPxISIwdG530C4nTgEP5lWFVusZW",
  issuer: "dev-n4e4qk7s3kbzusrs.us.auth0.com",
  algorithms: ["RS256"],
};

function verifyTokenAndGetEmail(
  token: string,
  options: VerifyOptions,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    console.log(token);
    jwt.verify(
      token,
      getKey,
      options,
      (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
        if (err) {
          return reject(err);
        }

        // Ensure decoded is an object (JwtPayload) and has an email property
        if (
          typeof decoded === "object" &&
          decoded !== null &&
          "email" in decoded
        ) {
          const email = (decoded as JwtPayload).email;

          if (typeof email === "string") {
            return resolve(email);
          } else {
            return reject(new Error("Email claim is not a string"));
          }
        } else {
          return reject(new Error("Decoded token does not contain email"));
        }
      },
    );
  });
}

export async function createContext({
  req,
  connection,
}: ContextArgs): Promise<QueryContext> {
  if (connection) {
    // This is a subscription request
    DEBUG && console.log(connection);
    return { connection };
  }

  // This is a regular request
  // DEBUG && console.log("regular request");
  // DEBUG && console.log("no connection");

  // DEBUG && console.log("Regular request, checking authorization header...");
  const authHeader = req?.headers.authorization;
  try {
    if (authHeader && authHeader.startsWith("Bearer")) {
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
