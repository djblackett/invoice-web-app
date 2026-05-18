import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import type { Request, Response } from "express";
import { register, login } from "@/controllers/auth.controller";
import type { IUserRepo } from "@/repositories/userRepo";
import type { IAuthRepo } from "@/repositories/authRepo";
import { AuthService } from "@/services/auth.service";
import type { Logger } from "@/config/logger.config";
import * as cryptoUtil from "@/utils/crypto.util";

// Mock dependencies
vi.mock("@/utils/crypto.util");
vi.mock("@/validators/auth.validator", () => ({
  registerSchema: {},
  loginSchema: {},
  validateRequest: vi.fn(),
}));

vi.mock("@/config/inversify.config", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("Auth Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockUserRepo: ReturnType<typeof mockDeep<IUserRepo>>;
  let mockAuthRepo: ReturnType<typeof mockDeep<IAuthRepo>>;
  let mockAuthService: ReturnType<typeof mockDeep<AuthService>>;
  let mockLogger: ReturnType<typeof mockDeep<Logger>>;

  beforeEach(async () => {
    vi.clearAllMocks();

    mockReq = {
      body: {},
      headers: {},
      ip: "127.0.0.1",
    };

    const jsonMock = vi.fn();
    const statusMock = vi.fn(() => ({ json: jsonMock }));
    const cookieMock = vi.fn();

    mockRes = {
      status: statusMock as any,
      json: jsonMock,
      cookie: cookieMock,
    };

    mockUserRepo = mockDeep<IUserRepo>();
    mockAuthRepo = mockDeep<IAuthRepo>();
    mockAuthService = mockDeep<AuthService>();
    mockLogger = mockDeep<Logger>();

    const container = await import("@/config/inversify.config");
    vi.mocked(container.default.get).mockImplementation((type: any) => {
      const typeStr = type.toString();
      if (typeStr.includes("Logger")) return mockLogger;
      if (typeStr.includes("IUserRepo")) return mockUserRepo;
      if (typeStr.includes("AuthRepo")) return mockAuthRepo;
      if (type === AuthService) return mockAuthService;
      return mockLogger;
    });
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const { validateRequest } = await import("@/validators/auth.validator");
      vi.mocked(validateRequest).mockReturnValue({
        success: true,
        data: {
          email: "test@example.com",
          password: "Password123",
          name: "Test User",
        },
      });

      vi.mocked(cryptoUtil.validatePasswordStrength).mockReturnValue({
        valid: true,
        errors: [],
      });

      vi.mocked(cryptoUtil.hashPassword).mockResolvedValue("hashed-password");

      mockUserRepo.getUserById.mockResolvedValue(null);
      mockUserRepo.createUser.mockResolvedValue({
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "USER",
      });

      mockAuthRepo.createOAuthAccount.mockResolvedValue({
        id: "account-123",
        userId: "user-123",
        provider: "LOCAL",
        providerAccountId: "test@example.com",
      });

      mockAuthService.generateTokenPair.mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        expiresIn: 900,
      });

      mockReq.body = {
        email: "test@example.com",
        password: "Password123",
        name: "Test User",
      };

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.cookie).toHaveBeenCalledWith(
        "refreshToken",
        "refresh-token",
        expect.objectContaining({
          httpOnly: true,
          sameSite: "strict",
        }),
      );
    });

    it("should return 400 for invalid request body", async () => {
      const { validateRequest } = await import("@/validators/auth.validator");
      vi.mocked(validateRequest).mockReturnValue({
        success: false,
        errors: ["Email is required"],
      });

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 for weak password", async () => {
      const { validateRequest } = await import("@/validators/auth.validator");
      vi.mocked(validateRequest).mockReturnValue({
        success: true,
        data: {
          email: "test@example.com",
          password: "weak",
          name: "Test User",
        },
      });

      vi.mocked(cryptoUtil.validatePasswordStrength).mockReturnValue({
        valid: false,
        errors: ["Password too short"],
      });

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should return 409 if user already exists", async () => {
      const { validateRequest } = await import("@/validators/auth.validator");
      vi.mocked(validateRequest).mockReturnValue({
        success: true,
        data: {
          email: "existing@example.com",
          password: "Password123",
          name: "Test User",
        },
      });

      vi.mocked(cryptoUtil.validatePasswordStrength).mockReturnValue({
        valid: true,
        errors: [],
      });

      mockUserRepo.getUserById.mockResolvedValue({
        id: "existing-user",
        email: "existing@example.com",
        name: "Existing User",
        role: "USER",
      });

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(409);
    });

    it("should return 500 if user creation fails", async () => {
      const { validateRequest } = await import("@/validators/auth.validator");
      vi.mocked(validateRequest).mockReturnValue({
        success: true,
        data: {
          email: "test@example.com",
          password: "Password123",
          name: "Test User",
        },
      });

      vi.mocked(cryptoUtil.validatePasswordStrength).mockReturnValue({
        valid: true,
        errors: [],
      });

      vi.mocked(cryptoUtil.hashPassword).mockResolvedValue("hashed-password");

      mockUserRepo.getUserById.mockResolvedValue(null);
      mockUserRepo.createUser.mockResolvedValue({
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: undefined as any, // Missing role
      });

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    it("should handle errors gracefully", async () => {
      const { validateRequest } = await import("@/validators/auth.validator");
      vi.mocked(validateRequest).mockReturnValue({
        success: true,
        data: {
          email: "test@example.com",
          password: "Password123",
          name: "Test User",
        },
      });

      vi.mocked(cryptoUtil.validatePasswordStrength).mockReturnValue({
        valid: true,
        errors: [],
      });

      mockUserRepo.getUserById.mockRejectedValue(new Error("Database error"));

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it("should include user agent and IP in token metadata", async () => {
      const { validateRequest } = await import("@/validators/auth.validator");
      vi.mocked(validateRequest).mockReturnValue({
        success: true,
        data: {
          email: "test@example.com",
          password: "Password123",
          name: "Test User",
        },
      });

      vi.mocked(cryptoUtil.validatePasswordStrength).mockReturnValue({
        valid: true,
        errors: [],
      });

      vi.mocked(cryptoUtil.hashPassword).mockResolvedValue("hashed-password");

      mockUserRepo.getUserById.mockResolvedValue(null);
      mockUserRepo.createUser.mockResolvedValue({
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "USER",
      });

      mockAuthRepo.createOAuthAccount.mockResolvedValue({
        id: "account-123",
        userId: "user-123",
        provider: "LOCAL",
        providerAccountId: "test@example.com",
      });

      mockAuthService.generateTokenPair.mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        expiresIn: 900,
      });

      mockReq.headers = {
        "user-agent": "Mozilla/5.0",
      };
      mockReq.ip = "192.168.1.1";

      await register(mockReq as Request, mockRes as Response);

      expect(mockAuthService.generateTokenPair).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          userAgent: "Mozilla/5.0",
          ipAddress: "192.168.1.1",
        }),
      );
    });

    it("should work without optional name", async () => {
      const { validateRequest } = await import("@/validators/auth.validator");
      vi.mocked(validateRequest).mockReturnValue({
        success: true,
        data: {
          email: "test@example.com",
          password: "Password123",
        },
      });

      vi.mocked(cryptoUtil.validatePasswordStrength).mockReturnValue({
        valid: true,
        errors: [],
      });

      vi.mocked(cryptoUtil.hashPassword).mockResolvedValue("hashed-password");

      mockUserRepo.getUserById.mockResolvedValue(null);
      mockUserRepo.createUser.mockResolvedValue({
        id: "user-123",
        email: "test@example.com",
        name: undefined,
        role: "USER",
      });

      mockAuthRepo.createOAuthAccount.mockResolvedValue({
        id: "account-123",
        userId: "user-123",
        provider: "LOCAL",
        providerAccountId: "test@example.com",
      });

      mockAuthService.generateTokenPair.mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        expiresIn: 900,
      });

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("should set secure cookie in production", async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      const { validateRequest } = await import("@/validators/auth.validator");
      vi.mocked(validateRequest).mockReturnValue({
        success: true,
        data: {
          email: "test@example.com",
          password: "Password123",
          name: "Test User",
        },
      });

      vi.mocked(cryptoUtil.validatePasswordStrength).mockReturnValue({
        valid: true,
        errors: [],
      });

      vi.mocked(cryptoUtil.hashPassword).mockResolvedValue("hashed-password");

      mockUserRepo.getUserById.mockResolvedValue(null);
      mockUserRepo.createUser.mockResolvedValue({
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "USER",
      });

      mockAuthRepo.createOAuthAccount.mockResolvedValue({
        id: "account-123",
        userId: "user-123",
        provider: "LOCAL",
        providerAccountId: "test@example.com",
      });

      mockAuthService.generateTokenPair.mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        expiresIn: 900,
      });

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.cookie).toHaveBeenCalledWith(
        "refreshToken",
        "refresh-token",
        expect.objectContaining({
          secure: true,
        }),
      );

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("login", () => {
    it("should login successfully with correct credentials", async () => {
      const { validateRequest } = await import("@/validators/auth.validator");
      vi.mocked(validateRequest).mockReturnValue({
        success: true,
        data: {
          email: "test@example.com",
          password: "Password123",
        },
      });

      mockUserRepo.getUserForAuthentication.mockResolvedValue({
        id: "user-123",
        name: "Test User",
        username: "test@example.com",
        role: "USER",
        passwordHash: "hashed-password",
      });

      vi.mocked(cryptoUtil.comparePassword).mockResolvedValue(true);

      mockAuthService.generateTokenPair.mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        expiresIn: 900,
      });

      mockReq.body = {
        email: "test@example.com",
        password: "Password123",
      };

      await login(mockReq as Request, mockRes as Response);

      expect(cryptoUtil.comparePassword).toHaveBeenCalledWith(
        "Password123",
        "hashed-password",
      );
      expect(mockRes.cookie).toHaveBeenCalledWith(
        "refreshToken",
        "refresh-token",
        expect.objectContaining({
          httpOnly: true,
          sameSite: "strict",
        }),
      );
    });

    it("should return 401 for wrong password", async () => {
      const { validateRequest } = await import("@/validators/auth.validator");
      vi.mocked(validateRequest).mockReturnValue({
        success: true,
        data: {
          email: "test@example.com",
          password: "WrongPassword123",
        },
      });

      mockUserRepo.getUserForAuthentication.mockResolvedValue({
        id: "user-123",
        name: "Test User",
        username: "test@example.com",
        role: "USER",
        passwordHash: "hashed-password",
      });

      vi.mocked(cryptoUtil.comparePassword).mockResolvedValue(false);

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it("should return 401 for non-existent user", async () => {
      const { validateRequest } = await import("@/validators/auth.validator");
      vi.mocked(validateRequest).mockReturnValue({
        success: true,
        data: {
          email: "nonexistent@example.com",
          password: "Password123",
        },
      });

      mockUserRepo.getUserForAuthentication.mockResolvedValue(null);

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it("should return 401 for OAuth-only user without password", async () => {
      const { validateRequest } = await import("@/validators/auth.validator");
      vi.mocked(validateRequest).mockReturnValue({
        success: true,
        data: {
          email: "oauth@example.com",
          password: "Password123",
        },
      });

      mockUserRepo.getUserForAuthentication.mockResolvedValue({
        id: "user-456",
        name: "OAuth User",
        username: "oauth@example.com",
        role: "USER",
        passwordHash: null,
      });

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(cryptoUtil.comparePassword).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid request body", async () => {
      const { validateRequest } = await import("@/validators/auth.validator");
      vi.mocked(validateRequest).mockReturnValue({
        success: false,
        errors: ["Email is required"],
      });

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
