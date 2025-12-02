import { describe, it, expect } from "vitest";
import {
  hashPassword,
  comparePassword,
  hashToken,
  compareToken,
  generateSecureToken,
  generateTokenFamily,
  validatePasswordStrength,
} from "@/utils/crypto.util";

describe("crypto.util", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const password = "TestPassword123";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50); // bcrypt hashes are long
    });

    it("should generate different hashes for same password", async () => {
      const password = "TestPassword123";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2); // Different salts
    });

    it("should handle empty password", async () => {
      const hash = await hashPassword("");
      expect(hash).toBeDefined();
    });

    it("should handle special characters", async () => {
      const password = "P@ssw0rd!#$%^&*()";
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();
    });
  });

  describe("comparePassword", () => {
    it("should return true for correct password", async () => {
      const password = "TestPassword123";
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(password, hash);

      expect(isMatch).toBe(true);
    });

    it("should return false for incorrect password", async () => {
      const password = "TestPassword123";
      const wrongPassword = "WrongPassword456";
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(wrongPassword, hash);

      expect(isMatch).toBe(false);
    });

    it("should return false for empty password against valid hash", async () => {
      const password = "TestPassword123";
      const hash = await hashPassword(password);
      const isMatch = await comparePassword("", hash);

      expect(isMatch).toBe(false);
    });

    it("should handle case sensitivity", async () => {
      const password = "TestPassword123";
      const hash = await hashPassword(password);
      const isMatch = await comparePassword("testpassword123", hash);

      expect(isMatch).toBe(false);
    });
  });

  describe("hashToken", () => {
    it("should hash a token", async () => {
      const token = "my-secret-token-12345";
      const hash = await hashToken(token);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
      expect(hash).not.toBe(token);
    });

    it("should generate different hashes for same token", async () => {
      const token = "my-secret-token-12345";
      const hash1 = await hashToken(token);
      const hash2 = await hashToken(token);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("compareToken", () => {
    it("should return true for correct token", async () => {
      const token = "my-secret-token-12345";
      const hash = await hashToken(token);
      const isMatch = await compareToken(token, hash);

      expect(isMatch).toBe(true);
    });

    it("should return false for incorrect token", async () => {
      const token = "my-secret-token-12345";
      const wrongToken = "wrong-token-67890";
      const hash = await hashToken(token);
      const isMatch = await compareToken(wrongToken, hash);

      expect(isMatch).toBe(false);
    });

    it("should be timing-safe", async () => {
      const token = "my-secret-token-12345";
      const hash = await hashToken(token);

      // Both should take similar time (bcrypt is timing-safe)
      const start1 = Date.now();
      await compareToken("a", hash);
      const time1 = Date.now() - start1;

      const start2 = Date.now();
      await compareToken("aaaaaaaaaaaaaaaaaaaa", hash);
      const time2 = Date.now() - start2;

      // Times should be similar (within an order of magnitude)
      // This is a basic check - bcrypt handles timing attacks internally
      expect(Math.abs(time1 - time2)).toBeLessThan(1000);
    });
  });

  describe("generateSecureToken", () => {
    it("should generate a token with default length", () => {
      const token = generateSecureToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("should generate a token with custom length", () => {
      const token = generateSecureToken(16);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("should generate different tokens each time", () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      const token3 = generateSecureToken();

      expect(token1).not.toBe(token2);
      expect(token2).not.toBe(token3);
      expect(token1).not.toBe(token3);
    });

    it("should generate URL-safe tokens", () => {
      const token = generateSecureToken();

      // base64url should not contain +, /, or =
      expect(token).not.toContain("+");
      expect(token).not.toContain("/");
      expect(token).not.toContain("=");
    });

    it("should handle small lengths", () => {
      const token = generateSecureToken(1);
      expect(token).toBeDefined();
      expect(token.length).toBeGreaterThan(0);
    });

    it("should handle large lengths", () => {
      const token = generateSecureToken(128);
      expect(token).toBeDefined();
      expect(token.length).toBeGreaterThan(100);
    });
  });

  describe("generateTokenFamily", () => {
    it("should generate a token family identifier", () => {
      const family = generateTokenFamily();

      expect(family).toBeDefined();
      expect(typeof family).toBe("string");
      expect(family.length).toBe(32); // 16 bytes = 32 hex chars
    });

    it("should generate different families each time", () => {
      const family1 = generateTokenFamily();
      const family2 = generateTokenFamily();
      const family3 = generateTokenFamily();

      expect(family1).not.toBe(family2);
      expect(family2).not.toBe(family3);
      expect(family1).not.toBe(family3);
    });

    it("should generate hex strings", () => {
      const family = generateTokenFamily();

      // Should only contain hex characters (0-9, a-f)
      expect(/^[0-9a-f]+$/.test(family)).toBe(true);
    });
  });

  describe("validatePasswordStrength", () => {
    it("should accept a strong password", () => {
      const result = validatePasswordStrength("StrongP@ss123");

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject password shorter than 8 characters", () => {
      const result = validatePasswordStrength("Pass1");

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must be at least 8 characters long");
    });

    it("should reject password without uppercase letter", () => {
      const result = validatePasswordStrength("password123");

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one uppercase letter");
    });

    it("should reject password without lowercase letter", () => {
      const result = validatePasswordStrength("PASSWORD123");

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one lowercase letter");
    });

    it("should reject password without number", () => {
      const result = validatePasswordStrength("PasswordOnly");

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one number");
    });

    it("should return multiple errors for weak password", () => {
      const result = validatePasswordStrength("weak");

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors).toContain("Password must be at least 8 characters long");
      expect(result.errors).toContain("Password must contain at least one uppercase letter");
      expect(result.errors).toContain("Password must contain at least one number");
    });

    it("should accept password with special characters", () => {
      const result = validatePasswordStrength("P@ssw0rd!");

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should handle empty password", () => {
      const result = validatePasswordStrength("");

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should accept exactly 8 character strong password", () => {
      const result = validatePasswordStrength("Pass1234");

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept very long password", () => {
      const result = validatePasswordStrength("VeryLongPassword123WithLotsOfCharacters");

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
