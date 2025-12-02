import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import passport from "passport";
import { configureGoogleStrategy } from "@/strategies/google.strategy";
import type { Logger } from "@/config/logger.config";
import type { Profile as GoogleProfile } from "passport-google-oauth20";

// Mock passport
vi.mock("passport", () => ({
  default: {
    use: vi.fn(),
  },
}));

// Mock container - using factory to avoid hoisting issues
vi.mock("@/config/inversify.config", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("Google Strategy", () => {
  let mockLogger: ReturnType<typeof mockDeep<Logger>>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockLogger = mockDeep<Logger>();

    const container = await import("@/config/inversify.config");
    vi.mocked(container.default.get).mockReturnValue(mockLogger);
  });

  describe("configureGoogleStrategy", () => {
    it("should configure strategy with valid credentials", () => {
      vi.stubEnv("GOOGLE_CLIENT_ID", "test-client-id");
      vi.stubEnv("GOOGLE_CLIENT_SECRET", "test-client-secret");

      configureGoogleStrategy();

      expect(passport.use).toHaveBeenCalledWith(
        "google",
        expect.objectContaining({
          name: "google",
        }),
      );
      expect(mockLogger.info).toHaveBeenCalledWith("Google OAuth strategy configured");
    });

    it("should not configure strategy without client ID", () => {
      vi.unstubAllEnvs();
      vi.stubEnv("GOOGLE_CLIENT_SECRET", "test-client-secret");

      configureGoogleStrategy();

      expect(passport.use).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Google OAuth not configured"),
      );
    });

    it("should not configure strategy without client secret", () => {
      vi.unstubAllEnvs();
      vi.stubEnv("GOOGLE_CLIENT_ID", "test-client-id");

      configureGoogleStrategy();

      expect(passport.use).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Google OAuth not configured"),
      );
    });

    it("should call strategy callback with valid profile", () => {
      vi.stubEnv("GOOGLE_CLIENT_ID", "test-client-id");
      vi.stubEnv("GOOGLE_CLIENT_SECRET", "test-client-secret");

      configureGoogleStrategy();

      // Get the strategy callback
      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile: GoogleProfile = {
        id: "google-123",
        displayName: "Test User",
        emails: [{ value: "test@gmail.com", verified: true }],
        photos: [{ value: "https://example.com/photo.jpg" }],
        provider: "google",
        _raw: "",
        _json: {},
      };

      const done = vi.fn();
      callback({}, "access-token", "refresh-token", mockProfile, done);

      expect(done).toHaveBeenCalledWith(null, {
        provider: "GOOGLE",
        providerAccountId: "google-123",
        email: "test@gmail.com",
        emailVerified: true,
        name: "Test User",
        picture: "https://example.com/photo.jpg",
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });
      expect(mockLogger.info).toHaveBeenCalledWith(
        "Google OAuth callback for user: google-123",
      );
    });

    it("should handle profile without email", () => {
      vi.stubEnv("GOOGLE_CLIENT_ID", "test-client-id");
      vi.stubEnv("GOOGLE_CLIENT_SECRET", "test-client-secret");

      configureGoogleStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile: GoogleProfile = {
        id: "google-123",
        displayName: "Test User",
        emails: [],
        provider: "google",
        _raw: "",
        _json: {},
      };

      const done = vi.fn();
      callback({}, "access-token", "refresh-token", mockProfile, done);

      expect(done).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Email not provided by Google",
        }),
        undefined,
      );
      expect(mockLogger.error).toHaveBeenCalledWith("Google profile missing email");
    });

    it("should handle profile without photo", () => {
      vi.stubEnv("GOOGLE_CLIENT_ID", "test-client-id");
      vi.stubEnv("GOOGLE_CLIENT_SECRET", "test-client-secret");

      configureGoogleStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile: GoogleProfile = {
        id: "google-123",
        displayName: "Test User",
        emails: [{ value: "test@gmail.com", verified: true }],
        photos: [],
        provider: "google",
        _raw: "",
        _json: {},
      };

      const done = vi.fn();
      callback({}, "access-token", "refresh-token", mockProfile, done);

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          picture: undefined,
        }),
      );
    });

    it("should handle unverified email", () => {
      vi.stubEnv("GOOGLE_CLIENT_ID", "test-client-id");
      vi.stubEnv("GOOGLE_CLIENT_SECRET", "test-client-secret");

      configureGoogleStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile: GoogleProfile = {
        id: "google-123",
        displayName: "Test User",
        emails: [{ value: "test@gmail.com", verified: false }],
        provider: "google",
        _raw: "",
        _json: {},
      };

      const done = vi.fn();
      callback({}, "access-token", "refresh-token", mockProfile, done);

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          emailVerified: false,
        }),
      );
    });

    it("should handle errors in callback", () => {
      vi.stubEnv("GOOGLE_CLIENT_ID", "test-client-id");
      vi.stubEnv("GOOGLE_CLIENT_SECRET", "test-client-secret");

      configureGoogleStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      // Create a profile that will cause an error
      const mockProfile = null;

      const done = vi.fn();
      callback({}, "access-token", "refresh-token", mockProfile, done);

      expect(done).toHaveBeenCalledWith(expect.any(Error), undefined);
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining("Google OAuth error"));
    });
  });
});
