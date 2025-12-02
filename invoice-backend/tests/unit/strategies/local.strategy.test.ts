import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import passport from "passport";
import { configureLocalStrategy } from "@/strategies/local.strategy";
import type { Logger } from "@/config/logger.config";
import type { IUserRepo } from "@/repositories/userRepo";

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

describe("Local Strategy", () => {
  let mockLogger: ReturnType<typeof mockDeep<Logger>>;
  let mockUserRepo: ReturnType<typeof mockDeep<IUserRepo>>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockLogger = mockDeep<Logger>();
    mockUserRepo = mockDeep<IUserRepo>();

    const container = await import("@/config/inversify.config");
    vi.mocked(container.default.get).mockImplementation((type: symbol) => {
      // Return appropriate mock based on type
      if (type.toString().includes("Logger")) {
        return mockLogger;
      }
      if (type.toString().includes("IUserRepo")) {
        return mockUserRepo;
      }
      return mockUserRepo; // Default to userRepo
    });
  });

  describe("configureLocalStrategy", () => {
    it("should configure local strategy", () => {
      configureLocalStrategy();

      expect(passport.use).toHaveBeenCalled();
      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[0] as any;

      expect(strategy.name).toBe("local");
      expect(strategy._usernameField).toBe("email");
      expect(strategy._passwordField).toBe("password");
    });

    it("should return error for non-existent user", async () => {
      configureLocalStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[0] as any;
      const verify = strategy._verify;

      mockUserRepo.getUserById.mockResolvedValue(null);

      const done = vi.fn();
      verify("nonexistent@test.com", "password123", done);

      // Wait for async execution
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Login attempt for non-existent user"),
      );
      expect(done).toHaveBeenCalledWith(null, false, {
        message: "Invalid email or password",
      });
    });

    it("should return error when user has no id", async () => {
      configureLocalStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[0] as any;
      const verify = strategy._verify;

      mockUserRepo.getUserById.mockResolvedValue({
        id: undefined as any,
        email: "test@test.com",
        name: "Test User",
        role: "USER",
      });

      const done = vi.fn();
      verify("test@test.com", "password123", done);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(done).toHaveBeenCalledWith(null, false, {
        message: "Invalid email or password",
      });
    });

    it("should return error when getUserByIdSafely returns null", async () => {
      configureLocalStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[0] as any;
      const verify = strategy._verify;

      mockUserRepo.getUserById.mockResolvedValue({
        id: "user-123",
        email: "test@test.com",
        name: "Test User",
        role: "USER",
      });
      mockUserRepo.getUserByIdSafely.mockResolvedValue(null);

      const done = vi.fn();
      verify("test@test.com", "password123", done);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(done).toHaveBeenCalledWith(null, false, {
        message: "Invalid email or password",
      });
    });

    it("should warn about unimplemented password verification", async () => {
      configureLocalStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[0] as any;
      const verify = strategy._verify;

      mockUserRepo.getUserById.mockResolvedValue({
        id: "user-123",
        email: "test@test.com",
        name: "Test User",
        role: "USER",
      });
      mockUserRepo.getUserByIdSafely.mockResolvedValue({
        id: "user-123",
        email: "test@test.com",
        name: "Test User",
        role: "USER",
      });

      const done = vi.fn();
      verify("test@test.com", "password123", done);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Password verification not yet implemented"),
      );
      expect(done).toHaveBeenCalledWith(null, false, {
        message: "Authentication not yet fully implemented",
      });
    });

    it("should handle repository errors", async () => {
      configureLocalStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[0] as any;
      const verify = strategy._verify;

      const testError = new Error("Database connection failed");
      mockUserRepo.getUserById.mockRejectedValue(testError);

      const done = vi.fn();
      verify("test@test.com", "password123", done);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("Error in local strategy"),
      );
      expect(done).toHaveBeenCalledWith(testError);
    });

    it("should handle non-Error exceptions", async () => {
      configureLocalStrategy();

      const strategyCall = vi.mocked(passport.use).mock.calls[0];
      const strategy = strategyCall[0] as any;
      const verify = strategy._verify;

      mockUserRepo.getUserById.mockRejectedValue("String error");

      const done = vi.fn();
      verify("test@test.com", "password123", done);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("String error"),
      );
      expect(done).toHaveBeenCalled();
    });
  });
});
