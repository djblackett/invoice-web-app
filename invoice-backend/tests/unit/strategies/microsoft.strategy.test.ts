import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import passport from "passport";
import { configureMicrosoftStrategy } from "@/strategies/microsoft.strategy";
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

describe("Microsoft Strategy", () => {
  let mockLogger: ReturnType<typeof mockDeep<Logger>>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockLogger = mockDeep<Logger>();

    const container = await import("@/config/inversify.config");
    vi.mocked(container.default.get).mockReturnValue(mockLogger);
  });

  describe("configureMicrosoftStrategy", () => {
    it("should configure strategy with valid credentials", () => {
      vi.stubEnv("MICROSOFT_CLIENT_ID", "test-client-id");
      vi.stubEnv("MICROSOFT_CLIENT_SECRET", "test-client-secret");

      configureMicrosoftStrategy();

      expect(passport.use).toHaveBeenCalledWith(
        "microsoft",
        expect.objectContaining({
          name: "microsoft",
        }),
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        "Microsoft OAuth strategy configured",
      );
    });

    it("should not configure strategy without client ID", () => {
      vi.unstubAllEnvs();
      vi.stubEnv("MICROSOFT_CLIENT_SECRET", "test-client-secret");

      configureMicrosoftStrategy();

      expect(passport.use).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Microsoft OAuth not configured"),
      );
    });

    it("should not configure strategy without client secret", () => {
      vi.unstubAllEnvs();
      vi.stubEnv("MICROSOFT_CLIENT_ID", "test-client-id");

      configureMicrosoftStrategy();

      expect(passport.use).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Microsoft OAuth not configured"),
      );
    });

    it("should call strategy callback with valid profile using emails array", () => {
      vi.stubEnv("MICROSOFT_CLIENT_ID", "test-client-id");
      vi.stubEnv("MICROSOFT_CLIENT_SECRET", "test-client-secret");

      configureMicrosoftStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        id: "ms-123",
        displayName: "Test User",
        emails: [{ value: "test@outlook.com" }],
      };

      const done = vi.fn();
      callback("access-token", "refresh-token", mockProfile, done);

      expect(done).toHaveBeenCalledWith(null, {
        provider: "MICROSOFT",
        providerAccountId: "ms-123",
        email: "test@outlook.com",
        emailVerified: true,
        name: "Test User",
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });
      expect(mockLogger.info).toHaveBeenCalledWith(
        "Microsoft OAuth callback for user: ms-123",
      );
    });

    it("should call strategy callback with valid profile using upn", () => {
      vi.stubEnv("MICROSOFT_CLIENT_ID", "test-client-id");
      vi.stubEnv("MICROSOFT_CLIENT_SECRET", "test-client-secret");

      configureMicrosoftStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        id: "ms-123",
        displayName: "Test User",
        upn: "test@contoso.com",
      };

      const done = vi.fn();
      callback("access-token", "refresh-token", mockProfile, done);

      expect(done).toHaveBeenCalledWith(null, {
        provider: "MICROSOFT",
        providerAccountId: "ms-123",
        email: "test@contoso.com",
        emailVerified: true,
        name: "Test User",
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });
    });

    it("should call strategy callback with valid profile using userPrincipalName", () => {
      vi.stubEnv("MICROSOFT_CLIENT_ID", "test-client-id");
      vi.stubEnv("MICROSOFT_CLIENT_SECRET", "test-client-secret");

      configureMicrosoftStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        id: "ms-123",
        displayName: "Test User",
        userPrincipalName: "test@microsoft.com",
      };

      const done = vi.fn();
      callback("access-token", "refresh-token", mockProfile, done);

      expect(done).toHaveBeenCalledWith(null, {
        provider: "MICROSOFT",
        providerAccountId: "ms-123",
        email: "test@microsoft.com",
        emailVerified: true,
        name: "Test User",
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });
    });

    it("should prioritize emails array over upn and userPrincipalName", () => {
      vi.stubEnv("MICROSOFT_CLIENT_ID", "test-client-id");
      vi.stubEnv("MICROSOFT_CLIENT_SECRET", "test-client-secret");

      configureMicrosoftStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        id: "ms-123",
        displayName: "Test User",
        emails: [{ value: "primary@outlook.com" }],
        upn: "secondary@contoso.com",
        userPrincipalName: "tertiary@microsoft.com",
      };

      const done = vi.fn();
      callback("access-token", "refresh-token", mockProfile, done);

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          email: "primary@outlook.com",
        }),
      );
    });

    it("should handle profile without email", () => {
      vi.stubEnv("MICROSOFT_CLIENT_ID", "test-client-id");
      vi.stubEnv("MICROSOFT_CLIENT_SECRET", "test-client-secret");

      configureMicrosoftStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        id: "ms-123",
        displayName: "Test User",
      };

      const done = vi.fn();
      callback("access-token", "refresh-token", mockProfile, done);

      expect(done).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Email not provided by Microsoft",
        }),
        undefined,
      );
      expect(mockLogger.error).toHaveBeenCalledWith(
        "Microsoft profile missing email",
      );
    });

    it("should handle profile with empty emails array", () => {
      vi.stubEnv("MICROSOFT_CLIENT_ID", "test-client-id");
      vi.stubEnv("MICROSOFT_CLIENT_SECRET", "test-client-secret");

      configureMicrosoftStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        id: "ms-123",
        displayName: "Test User",
        emails: [],
      };

      const done = vi.fn();
      callback("access-token", "refresh-token", mockProfile, done);

      expect(done).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Email not provided by Microsoft",
        }),
        undefined,
      );
    });

    it("should handle errors in callback", () => {
      vi.stubEnv("MICROSOFT_CLIENT_ID", "test-client-id");
      vi.stubEnv("MICROSOFT_CLIENT_SECRET", "test-client-secret");

      configureMicrosoftStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      // Create a profile that will cause an error
      const mockProfile = null;

      const done = vi.fn();
      callback("access-token", "refresh-token", mockProfile, done);

      expect(done).toHaveBeenCalledWith(expect.any(Error), undefined);
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("Microsoft OAuth error"),
      );
    });

    it("should always set emailVerified to true for Microsoft accounts", () => {
      vi.stubEnv("MICROSOFT_CLIENT_ID", "test-client-id");
      vi.stubEnv("MICROSOFT_CLIENT_SECRET", "test-client-secret");

      configureMicrosoftStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[1] as any;
      const callback = strategy._verify;

      const mockProfile = {
        id: "ms-123",
        displayName: "Test User",
        emails: [{ value: "test@outlook.com" }],
      };

      const done = vi.fn();
      callback("access-token", "refresh-token", mockProfile, done);

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          emailVerified: true,
        }),
      );
    });
  });
});
