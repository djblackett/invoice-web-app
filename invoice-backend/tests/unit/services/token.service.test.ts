import { describe, it, expect, beforeEach, vi } from "vitest";
import { TokenService } from "@/services/token.service";
import jwt from "jsonwebtoken";
import { generateKeyPairSync } from "crypto";

describe("TokenService", () => {
  let tokenService: TokenService;
  let privateKey: string;
  let publicKey: string;

  beforeEach(() => {
    // Generate a test RSA key pair
    const { privateKey: privKey, publicKey: pubKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    privateKey = privKey;
    publicKey = pubKey;

    // Set environment variables with base64-encoded keys
    vi.stubEnv("JWT_PRIVATE_KEY", Buffer.from(privateKey).toString("base64"));
    vi.stubEnv("JWT_PUBLIC_KEY", Buffer.from(publicKey).toString("base64"));
    vi.stubEnv("JWT_ISSUER", "test-issuer");
    vi.stubEnv("JWT_ACCESS_TOKEN_EXPIRY", "15m");

    tokenService = new TokenService();
  });

  describe("constructor", () => {
    it("should initialize with environment variables", () => {
      expect(tokenService).toBeDefined();
    });

    it("should throw error when JWT_PRIVATE_KEY is missing", () => {
      vi.unstubAllEnvs();
      expect(() => new TokenService()).toThrow("JWT keys not configured");
    });

    it("should throw error when JWT_PUBLIC_KEY is missing", () => {
      vi.unstubAllEnvs();
      vi.stubEnv("JWT_PRIVATE_KEY", Buffer.from(privateKey).toString("base64"));
      expect(() => new TokenService()).toThrow("JWT keys not configured");
    });

    it("should use default values when optional env vars are missing", () => {
      vi.unstubAllEnvs();
      vi.stubEnv("JWT_PRIVATE_KEY", Buffer.from(privateKey).toString("base64"));
      vi.stubEnv("JWT_PUBLIC_KEY", Buffer.from(publicKey).toString("base64"));
      const service = new TokenService();
      expect(service).toBeDefined();
    });
  });

  describe("signAccessToken", () => {
    it("should sign a valid access token", () => {
      const payload = {
        sub: "user-123",
        email: "test@example.com",
        role: "USER" as const,
      };

      const token = tokenService.signAccessToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
    });

    it("should sign a token with optional name field", () => {
      const payload = {
        sub: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "USER" as const,
      };

      const token = tokenService.signAccessToken(payload);
      const decoded = jwt.decode(token) as any;

      expect(decoded.name).toBe("Test User");
    });

    it("should sign a token for ADMIN role", () => {
      const payload = {
        sub: "admin-123",
        email: "admin@example.com",
        role: "ADMIN" as const,
      };

      const token = tokenService.signAccessToken(payload);
      const decoded = jwt.decode(token) as any;

      expect(decoded.role).toBe("ADMIN");
    });

    it("should include issuer in token", () => {
      const payload = {
        sub: "user-123",
        email: "test@example.com",
        role: "USER" as const,
      };

      const token = tokenService.signAccessToken(payload);
      const decoded = jwt.decode(token) as any;

      expect(decoded.iss).toBe("test-issuer");
    });

    it("should include expiration in token", () => {
      const payload = {
        sub: "user-123",
        email: "test@example.com",
        role: "USER" as const,
      };

      const token = tokenService.signAccessToken(payload);
      const decoded = jwt.decode(token) as any;

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });

  describe("verifyAccessToken", () => {
    it("should verify a valid token", () => {
      const payload = {
        sub: "user-123",
        email: "test@example.com",
        role: "USER" as const,
      };

      const token = tokenService.signAccessToken(payload);
      const verified = tokenService.verifyAccessToken(token);

      expect(verified.sub).toBe(payload.sub);
      expect(verified.email).toBe(payload.email);
      expect(verified.role).toBe(payload.role);
    });

    it("should throw error for invalid token", () => {
      expect(() => tokenService.verifyAccessToken("invalid.token.here")).toThrow("Invalid token");
    });

    it("should throw error for expired token", () => {
      const payload = {
        sub: "user-123",
        email: "test@example.com",
        role: "USER" as const,
      };

      // Create an expired token
      const expiredToken = jwt.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "-1s", // Already expired
        issuer: "test-issuer",
      });

      expect(() => tokenService.verifyAccessToken(expiredToken)).toThrow("Token has expired");
    });

    it("should throw error for token with wrong issuer", () => {
      const payload = {
        sub: "user-123",
        email: "test@example.com",
        role: "USER" as const,
      };

      const wrongIssuerToken = jwt.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "15m",
        issuer: "wrong-issuer",
      });

      expect(() => tokenService.verifyAccessToken(wrongIssuerToken)).toThrow("Invalid token");
    });

    it("should throw error for token signed with wrong key", () => {
      const { privateKey: wrongPrivateKey } = generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
      });

      const payload = {
        sub: "user-123",
        email: "test@example.com",
        role: "USER" as const,
      };

      const wrongKeyToken = jwt.sign(payload, wrongPrivateKey, {
        algorithm: "RS256",
        expiresIn: "15m",
        issuer: "test-issuer",
      });

      expect(() => tokenService.verifyAccessToken(wrongKeyToken)).toThrow("Invalid token");
    });
  });

  describe("getPublicJWKS", () => {
    it("should return JWKS format", () => {
      const jwks = tokenService.getPublicJWKS();

      expect(jwks).toBeDefined();
      expect(jwks.keys).toBeInstanceOf(Array);
      expect(jwks.keys).toHaveLength(1);
    });

    it("should return valid JWK structure", () => {
      const jwks = tokenService.getPublicJWKS();
      const key = jwks.keys[0];

      expect(key.kty).toBe("RSA");
      expect(key.use).toBe("sig");
      expect(key.kid).toBe("main-key");
      expect(key.n).toBeDefined();
      expect(key.e).toBeDefined();
      expect(typeof key.n).toBe("string");
      expect(typeof key.e).toBe("string");
    });
  });

  describe("getPublicKey", () => {
    it("should return public key in PEM format", () => {
      const pubKey = tokenService.getPublicKey();

      expect(pubKey).toBeDefined();
      expect(typeof pubKey).toBe("string");
      expect(pubKey).toContain("BEGIN PUBLIC KEY");
      expect(pubKey).toContain("END PUBLIC KEY");
    });
  });

  describe("decodeToken", () => {
    it("should decode a valid token without verification", () => {
      const payload = {
        sub: "user-123",
        email: "test@example.com",
        role: "USER" as const,
      };

      const token = tokenService.signAccessToken(payload);
      const decoded = tokenService.decodeToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.sub).toBe(payload.sub);
      expect(decoded?.email).toBe(payload.email);
      expect(decoded?.role).toBe(payload.role);
    });

    it("should decode an expired token", () => {
      const payload = {
        sub: "user-123",
        email: "test@example.com",
        role: "USER" as const,
      };

      const expiredToken = jwt.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "-1s",
        issuer: "test-issuer",
      });

      const decoded = tokenService.decodeToken(expiredToken);

      expect(decoded).toBeDefined();
      expect(decoded?.sub).toBe(payload.sub);
    });

    it("should return null for invalid token", () => {
      const decoded = tokenService.decodeToken("not.a.valid.token.at.all");

      expect(decoded).toBeNull();
    });

    it("should return null for malformed token", () => {
      const decoded = tokenService.decodeToken("malformed");

      expect(decoded).toBeNull();
    });
  });
});
