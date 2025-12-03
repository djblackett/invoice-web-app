import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  validateRequest,
} from "../auth.validator";

describe("Auth Validators", () => {
  describe("registerSchema", () => {
    it("should validate valid registration data", () => {
      const validData = {
        email: "test@example.com",
        password: "Password123",
        name: "Test User",
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should reject invalid email", () => {
      const invalidData = {
        email: "invalid-email",
        password: "Password123",
        name: "Test User",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Invalid email");
      }
    });

    it("should reject password shorter than 8 characters", () => {
      const invalidData = {
        email: "test@example.com",
        password: "Pass1",
        name: "Test User",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("at least 8 characters");
      }
    });

    it("should reject password without uppercase letter", () => {
      const invalidData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("uppercase letter");
      }
    });

    it("should reject password without lowercase letter", () => {
      const invalidData = {
        email: "test@example.com",
        password: "PASSWORD123",
        name: "Test User",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("lowercase letter");
      }
    });

    it("should reject password without number", () => {
      const invalidData = {
        email: "test@example.com",
        password: "PasswordABC",
        name: "Test User",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("number");
      }
    });

    it("should reject empty name", () => {
      const invalidData = {
        email: "test@example.com",
        password: "Password123",
        name: "",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Name is required");
      }
    });

    it("should reject name longer than 100 characters", () => {
      const invalidData = {
        email: "test@example.com",
        password: "Password123",
        name: "a".repeat(101),
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Name is too long");
      }
    });

    it("should accept name exactly 100 characters", () => {
      const validData = {
        email: "test@example.com",
        password: "Password123",
        name: "a".repeat(100),
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("should reject missing fields", () => {
      const invalidData = {
        email: "test@example.com",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe("loginSchema", () => {
    it("should validate valid login data", () => {
      const validData = {
        email: "test@example.com",
        password: "anypassword",
      };

      const result = loginSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should reject invalid email", () => {
      const invalidData = {
        email: "invalid-email",
        password: "anypassword",
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Invalid email");
      }
    });

    it("should reject empty password", () => {
      const invalidData = {
        email: "test@example.com",
        password: "",
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Password is required");
      }
    });

    it("should accept any non-empty password (no validation on login)", () => {
      const validData = {
        email: "test@example.com",
        password: "weak",
      };

      const result = loginSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("should reject missing fields", () => {
      const invalidData = {
        email: "test@example.com",
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe("refreshTokenSchema", () => {
    it("should validate valid refresh token", () => {
      const validData = {
        refreshToken: "valid-refresh-token-string",
      };

      const result = refreshTokenSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should reject empty refresh token", () => {
      const invalidData = {
        refreshToken: "",
      };

      const result = refreshTokenSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Refresh token is required");
      }
    });

    it("should reject missing refresh token", () => {
      const invalidData = {};

      const result = refreshTokenSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe("forgotPasswordSchema", () => {
    it("should validate valid email", () => {
      const validData = {
        email: "test@example.com",
      };

      const result = forgotPasswordSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should reject invalid email", () => {
      const invalidData = {
        email: "invalid-email",
      };

      const result = forgotPasswordSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Invalid email");
      }
    });

    it("should reject missing email", () => {
      const invalidData = {};

      const result = forgotPasswordSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("should validate valid reset password data", () => {
      const validData = {
        token: "valid-reset-token",
        password: "NewPassword123",
      };

      const result = resetPasswordSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should reject empty token", () => {
      const invalidData = {
        token: "",
        password: "NewPassword123",
      };

      const result = resetPasswordSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Reset token is required");
      }
    });

    it("should reject weak password", () => {
      const invalidData = {
        token: "valid-reset-token",
        password: "weak",
      };

      const result = resetPasswordSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.length).toBeGreaterThan(0);
      }
    });

    it("should reject password without uppercase", () => {
      const invalidData = {
        token: "valid-reset-token",
        password: "password123",
      };

      const result = resetPasswordSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("uppercase letter");
      }
    });

    it("should reject missing fields", () => {
      const invalidData = {
        token: "valid-reset-token",
      };

      const result = resetPasswordSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe("verifyEmailSchema", () => {
    it("should validate valid verification token", () => {
      const validData = {
        token: "valid-verification-token",
      };

      const result = verifyEmailSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should reject empty token", () => {
      const invalidData = {
        token: "",
      };

      const result = verifyEmailSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain(
          "Verification token is required",
        );
      }
    });

    it("should reject missing token", () => {
      const invalidData = {};

      const result = verifyEmailSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe("validateRequest helper", () => {
    it("should return success with valid data", () => {
      const validData = {
        email: "test@example.com",
        password: "anypassword",
      };

      const result = validateRequest(loginSchema, validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should return failure with error messages for invalid data", () => {
      const invalidData = {
        email: "invalid-email",
        password: "",
      };

      const result = validateRequest(loginSchema, invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeInstanceOf(Array);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors[0]).toBe("Invalid email address");
      }
    });

    it("should return all error messages for multiple validation failures", () => {
      const invalidData = {
        email: "invalid-email",
        password: "weak",
        name: "",
      };

      const result = validateRequest(registerSchema, invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(1);
      }
    });

    it("should handle completely invalid input", () => {
      const invalidData = null;

      const result = validateRequest(loginSchema, invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeInstanceOf(Array);
      }
    });

    it("should handle extra fields gracefully", () => {
      const dataWithExtraFields = {
        email: "test@example.com",
        password: "anypassword",
        extraField: "should be ignored",
      };

      const result = validateRequest(loginSchema, dataWithExtraFields);

      expect(result.success).toBe(true);
      if (result.success) {
        // Extra fields should be stripped
        expect(result.data).not.toHaveProperty("extraField");
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle unicode characters in name", () => {
      const validData = {
        email: "test@example.com",
        password: "Password123",
        name: "José María 中文",
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("should handle special characters in password", () => {
      const validData = {
        email: "test@example.com",
        password: "P@ssw0rd!#$",
        name: "Test User",
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("should handle email with plus addressing", () => {
      const validData = {
        email: "test+tag@example.com",
        password: "Password123",
        name: "Test User",
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("should handle email with subdomain", () => {
      const validData = {
        email: "test@subdomain.example.com",
        password: "Password123",
        name: "Test User",
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("should reject email without domain", () => {
      const invalidData = {
        email: "test@",
        password: "Password123",
        name: "Test User",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("should reject email without @", () => {
      const invalidData = {
        email: "testexample.com",
        password: "Password123",
        name: "Test User",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });
});
