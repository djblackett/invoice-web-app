import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import passport from "passport";
import { configureAppleStrategy } from "@/strategies/apple.strategy";
import type { Logger } from "@/config/logger.config";

// Mock passport
vi.mock("passport", () => ({
  default: {
    use: vi.fn(),
  },
}));

// Mock container
vi.mock("@/config/inversify.config", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("Apple Strategy", () => {
  let mockLogger: ReturnType<typeof mockDeep<Logger>>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockLogger = mockDeep<Logger>();

    const container = await import("@/config/inversify.config");
    vi.mocked(container.default.get).mockReturnValue(mockLogger);
  });

  describe("configureAppleStrategy", () => {
    it("should configure strategy with valid credentials", () => {
      vi.stubEnv("APPLE_SERVICE_ID", "com.example.app");
      vi.stubEnv("APPLE_TEAM_ID", "TEAM123");
      vi.stubEnv("APPLE_KEY_ID", "KEY123");
      vi.stubEnv("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

      configureAppleStrategy();

      expect(passport.use).toHaveBeenCalledWith(
        "apple",
        expect.objectContaining({
          name: "apple",
        }),
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        "Apple Sign In strategy configured",
      );
    });

    it("should not configure strategy without service ID", () => {
      vi.unstubAllEnvs();
      vi.stubEnv("APPLE_TEAM_ID", "TEAM123");
      vi.stubEnv("APPLE_KEY_ID", "KEY123");
      vi.stubEnv("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

      configureAppleStrategy();

      expect(passport.use).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Apple Sign In not configured"),
      );
    });

    it("should not configure strategy without team ID", () => {
      vi.unstubAllEnvs();
      vi.stubEnv("APPLE_SERVICE_ID", "com.example.app");
      vi.stubEnv("APPLE_KEY_ID", "KEY123");
      vi.stubEnv("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

      configureAppleStrategy();

      expect(passport.use).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Apple Sign In not configured"),
      );
    });

    it("should not configure strategy without key ID", () => {
      vi.unstubAllEnvs();
      vi.stubEnv("APPLE_SERVICE_ID", "com.example.app");
      vi.stubEnv("APPLE_TEAM_ID", "TEAM123");
      vi.stubEnv("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

      configureAppleStrategy();

      expect(passport.use).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Apple Sign In not configured"),
      );
    });

    it("should not configure strategy without private key", () => {
      vi.unstubAllEnvs();
      vi.stubEnv("APPLE_SERVICE_ID", "com.example.app");
      vi.stubEnv("APPLE_TEAM_ID", "TEAM123");
      vi.stubEnv("APPLE_KEY_ID", "KEY123");

      configureAppleStrategy();

      expect(passport.use).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Apple Sign In not configured"),
      );
    });

    it("should call strategy callback with valid profile using sub", () => {
      vi.stubEnv("APPLE_SERVICE_ID", "com.example.app");
      vi.stubEnv("APPLE_TEAM_ID", "TEAM123");
      vi.stubEnv("APPLE_KEY_ID", "KEY123");
      vi.stubEnv("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

      configureAppleStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        sub: "apple-123",
        email: "test@icloud.com",
        email_verified: "true",
        name: { firstName: "John", lastName: "Doe" },
      };

      const done = vi.fn();
      callback(
        {},
        "access-token",
        "refresh-token",
        "id-token",
        mockProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(null, {
        provider: "APPLE",
        providerAccountId: "apple-123",
        email: "test@icloud.com",
        emailVerified: true,
        name: "John Doe",
        accessToken: "access-token",
        refreshToken: "refresh-token",
        idToken: "id-token",
      });
      expect(mockLogger.info).toHaveBeenCalledWith(
        "Apple Sign In callback for user: apple-123",
      );
    });

    it("should call strategy callback with valid profile using id", () => {
      vi.stubEnv("APPLE_SERVICE_ID", "com.example.app");
      vi.stubEnv("APPLE_TEAM_ID", "TEAM123");
      vi.stubEnv("APPLE_KEY_ID", "KEY123");
      vi.stubEnv("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

      configureAppleStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        id: "apple-456",
        email: "test@icloud.com",
        email_verified: true,
        name: { firstName: "Jane", lastName: "Smith" },
      };

      const done = vi.fn();
      callback(
        {},
        "access-token",
        "refresh-token",
        "id-token",
        mockProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          providerAccountId: "apple-456",
        }),
      );
    });

    it("should handle email_verified as boolean true", () => {
      vi.stubEnv("APPLE_SERVICE_ID", "com.example.app");
      vi.stubEnv("APPLE_TEAM_ID", "TEAM123");
      vi.stubEnv("APPLE_KEY_ID", "KEY123");
      vi.stubEnv("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

      configureAppleStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        sub: "apple-123",
        email: "test@icloud.com",
        email_verified: true,
      };

      const done = vi.fn();
      callback(
        {},
        "access-token",
        "refresh-token",
        "id-token",
        mockProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          emailVerified: true,
        }),
      );
    });

    it("should handle email_verified as string 'true'", () => {
      vi.stubEnv("APPLE_SERVICE_ID", "com.example.app");
      vi.stubEnv("APPLE_TEAM_ID", "TEAM123");
      vi.stubEnv("APPLE_KEY_ID", "KEY123");
      vi.stubEnv("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

      configureAppleStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        sub: "apple-123",
        email: "test@icloud.com",
        email_verified: "true",
      };

      const done = vi.fn();
      callback(
        {},
        "access-token",
        "refresh-token",
        "id-token",
        mockProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          emailVerified: true,
        }),
      );
    });

    it("should handle unverified email", () => {
      vi.stubEnv("APPLE_SERVICE_ID", "com.example.app");
      vi.stubEnv("APPLE_TEAM_ID", "TEAM123");
      vi.stubEnv("APPLE_KEY_ID", "KEY123");
      vi.stubEnv("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

      configureAppleStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        sub: "apple-123",
        email: "test@icloud.com",
        email_verified: false,
      };

      const done = vi.fn();
      callback(
        {},
        "access-token",
        "refresh-token",
        "id-token",
        mockProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          emailVerified: false,
        }),
      );
    });

    it("should handle profile with only firstName", () => {
      vi.stubEnv("APPLE_SERVICE_ID", "com.example.app");
      vi.stubEnv("APPLE_TEAM_ID", "TEAM123");
      vi.stubEnv("APPLE_KEY_ID", "KEY123");
      vi.stubEnv("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

      configureAppleStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        sub: "apple-123",
        email: "test@icloud.com",
        email_verified: true,
        name: { firstName: "John" },
      };

      const done = vi.fn();
      callback(
        {},
        "access-token",
        "refresh-token",
        "id-token",
        mockProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          name: "John",
        }),
      );
    });

    it("should handle profile with only lastName", () => {
      vi.stubEnv("APPLE_SERVICE_ID", "com.example.app");
      vi.stubEnv("APPLE_TEAM_ID", "TEAM123");
      vi.stubEnv("APPLE_KEY_ID", "KEY123");
      vi.stubEnv("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

      configureAppleStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        sub: "apple-123",
        email: "test@icloud.com",
        email_verified: true,
        name: { lastName: "Doe" },
      };

      const done = vi.fn();
      callback(
        {},
        "access-token",
        "refresh-token",
        "id-token",
        mockProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          name: "Doe",
        }),
      );
    });

    it("should handle profile without name (subsequent logins)", () => {
      vi.stubEnv("APPLE_SERVICE_ID", "com.example.app");
      vi.stubEnv("APPLE_TEAM_ID", "TEAM123");
      vi.stubEnv("APPLE_KEY_ID", "KEY123");
      vi.stubEnv("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

      configureAppleStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        sub: "apple-123",
        email: "test@icloud.com",
        email_verified: true,
      };

      const done = vi.fn();
      callback(
        {},
        "access-token",
        "refresh-token",
        "id-token",
        mockProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          name: undefined,
        }),
      );
    });

    it("should handle profile without email", () => {
      vi.stubEnv("APPLE_SERVICE_ID", "com.example.app");
      vi.stubEnv("APPLE_TEAM_ID", "TEAM123");
      vi.stubEnv("APPLE_KEY_ID", "KEY123");
      vi.stubEnv("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

      configureAppleStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        sub: "apple-123",
      };

      const done = vi.fn();
      callback(
        {},
        "access-token",
        "refresh-token",
        "id-token",
        mockProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Email not provided by Apple",
        }),
        undefined,
      );
      expect(mockLogger.error).toHaveBeenCalledWith(
        "Apple profile missing email",
      );
    });

    it("should handle errors in callback", () => {
      vi.stubEnv("APPLE_SERVICE_ID", "com.example.app");
      vi.stubEnv("APPLE_TEAM_ID", "TEAM123");
      vi.stubEnv("APPLE_KEY_ID", "KEY123");
      vi.stubEnv("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

      configureAppleStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      // Create a profile that will cause an error
      const mockProfile = null;

      const done = vi.fn();
      callback(
        {},
        "access-token",
        "refresh-token",
        "id-token",
        mockProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(expect.any(Error), undefined);
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("Apple Sign In error"),
      );
    });

    it("should prioritize sub over id for provider account ID", () => {
      vi.stubEnv("APPLE_SERVICE_ID", "com.example.app");
      vi.stubEnv("APPLE_TEAM_ID", "TEAM123");
      vi.stubEnv("APPLE_KEY_ID", "KEY123");
      vi.stubEnv("APPLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----");

      configureAppleStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        sub: "apple-sub-123",
        id: "apple-id-456",
        email: "test@icloud.com",
        email_verified: true,
      };

      const done = vi.fn();
      callback(
        {},
        "access-token",
        "refresh-token",
        "id-token",
        mockProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          providerAccountId: "apple-sub-123",
        }),
      );
    });
  });
});
