import type { JwtPayload, VerifyOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import type { SigningKey } from "jwks-rsa";
import jwksClient from "jwks-rsa";
import { Role } from "@prisma/client";
import { NODE_ENV } from "@/config/server.config";
import container from "@/config/inversify.config";
import TYPES from "@/constants/identifiers";
import type { Logger } from "@/config/logger.config";
import type { Context } from "graphql-ws";
import type { Request } from "express";
import type { UserIdAndRole, QueryContext } from "../constants/types";

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
  const namespace = "invoice-web-app/";
  const emailClaim = `${namespace}email`;
  const roleClaim = `${namespace}roles`;

  const email =
    typeof payload[emailClaim] === "string" ? payload[emailClaim] : "";
  const id = payload.sub ?? "";
  const name = typeof payload["name"] === "string" ? payload["name"] : "user";
  const roles = Array.isArray(payload[roleClaim])
    ? (payload[roleClaim] as string[])
    : [];

  if (!email) throw new Error("Email claim is missing or invalid");
  if (!id) throw new Error("Id claim is missing or invalid");

  const role = roles.includes("Admin") ? "ADMIN" : "USER";
  return { id, role, username: email, name };
}

export async function getUserFromRequest(
  req: Request,
): Promise<UserIdAndRole | null> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return null;
  }

  // return dummy users for testing, CI, and demo mode
  if (NODE_ENV === "test" || NODE_ENV === "CI") {
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

export async function getUserFromSubscriptionConnection(
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

/**
 * Verifies a Google JWT token and extracts user information
 * This is a simplified implementation - in production, you should verify
 * the token signature against Google's public keys
 */
export function verifyGoogleToken(
  token: string,
): Promise<UserIdAndRole | null> {
  try {
    // In a real implementation, you would:
    // 1. Verify the token signature against Google's public keys
    // 2. Check the token expiration
    // 3. Validate the audience and issuer

    // For demo purposes, we'll decode without verification
    // DO NOT use this in production!
    const decoded = jwt.decode(token) as JwtPayload | null;

    if (!decoded || !decoded.sub || !decoded["email"]) {
      return Promise.resolve(null);
    }

    const user: UserIdAndRole = {
      id: `google_${decoded.sub}`,
      username: decoded["email"] as string,
      name:
        (decoded["name"] as string) ||
        (decoded["given_name"] as string) ||
        "Google User",
      role: Role.USER,
    };

    return Promise.resolve(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("Google token verification failed: " + errorMessage);
    return Promise.resolve(null);
  }
}

/**
 * Enhanced getUserFromRequest that supports both Auth0 and Google tokens
 */
export async function getUserFromRequestEnhanced(
  req: Request,
): Promise<UserIdAndRole | null> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return null;
  }

  // Check for demo tokens first
  if (NODE_ENV === "test" || NODE_ENV === "CI") {
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

  // Try Google token verification first
  const googleUser = await verifyGoogleToken(token);
  if (googleUser) {
    return googleUser;
  }

  // Fall back to Auth0 token verification
  try {
    const user = await retrieveUserFromToken(token, options);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("Token verification failed: " + errorMessage);
    return null;
  }
}

/**
 * Ensures that the resolver is accessed by an authenticated user.
 *
 * @param context - The GraphQL context containing user information.
 */
export function requireAuth(context: QueryContext): void {
  if (!context.username) {
    throw new Error("You must be logged in to perform this action.");
  }
}
