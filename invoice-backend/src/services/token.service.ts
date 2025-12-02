import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import { createPublicKey, type JsonWebKey } from "crypto";

/**
 * JWT Payload structure
 */
export interface JWTPayload {
  sub: string; // User ID
  email: string;
  name?: string;
  role: "USER" | "ADMIN";
  iat?: number;
  exp?: number;
}

/**
 * JWKS (JSON Web Key Set) format for public key distribution
 */
export interface JWKS {
  keys: Array<{
    kty: string;
    use: string;
    kid: string;
    n: string;
    e: string;
  }>;
}

@injectable()
export class TokenService {
  private privateKey: string;
  private publicKey: string;
  private issuer: string;
  private accessTokenExpiry: string;

  constructor() {
    // Load configuration from environment variables
    this.privateKey = this.decodeKey(process.env["JWT_PRIVATE_KEY"]);
    this.publicKey = this.decodeKey(process.env["JWT_PUBLIC_KEY"]);
    this.issuer = process.env["JWT_ISSUER"] || "http://localhost:8000";
    this.accessTokenExpiry = process.env["JWT_ACCESS_TOKEN_EXPIRY"] || "15m";
  }

  /**
   * Decode base64-encoded key from environment variable
   */
  private decodeKey(encodedKey: string | undefined): string {
    if (!encodedKey) {
      throw new Error(
        "JWT keys not configured. Run 'yarn tsx scripts/generate-rsa-keys.ts'",
      );
    }

    try {
      return Buffer.from(encodedKey, "base64").toString("utf-8");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Invalid JWT key encoding. Expected base64-encoded PEM. ${message}`,
      );
    }
  }

  /**
   * Sign a JWT access token with RS256
   */
  signAccessToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
    return jwt.sign(payload, this.privateKey, {
      algorithm: "RS256",
      expiresIn: this.accessTokenExpiry,
      issuer: this.issuer,
    } as jwt.SignOptions);
  }

  /**
   * Verify and decode a JWT access token
   */
  verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.publicKey, {
        algorithms: ["RS256"],
        issuer: this.issuer,
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token has expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid token");
      } else {
        throw new Error("Token verification failed");
      }
    }
  }

  /**
   * Get public key in JWKS (JSON Web Key Set) format
   * This endpoint allows external services to verify our JWTs
   */
  getPublicJWKS(): JWKS {
    const publicKeyObject = createPublicKey(this.publicKey);
    const exported = publicKeyObject.export({ format: "jwk" });
    if (!this.isJsonWebKey(exported)) {
      throw new Error("Failed to export public key in JWK format");
    }
    const jwk = exported;
    const modulus = typeof jwk.n === "string" ? jwk.n : "";
    const exponent = typeof jwk.e === "string" ? jwk.e : "";

    return {
      keys: [
        {
          kty: jwk.kty || "RSA",
          use: "sig",
          kid: "main-key", // Key ID - useful when rotating keys
          n: modulus,
          e: exponent,
        },
      ],
    };
  }

  /**
   * Get raw public key (PEM format)
   */
  getPublicKey(): string {
    return this.publicKey;
  }

  private isJsonWebKey(value: unknown): value is JsonWebKey {
    return typeof value === "object" && value !== null && "kty" in value;
  }

  /**
   * Decode a JWT without verification (useful for debugging)
   * WARNING: Do not use for authentication - always verify tokens!
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch {
      return null;
    }
  }
}
