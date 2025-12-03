import "reflect-metadata";
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import container from "@/config/inversify.config";
import { OAuthService } from "@/services/oauth.service";
import type { Logger } from "@/config/logger.config";
import TYPES from "@/constants/identifiers";
import type { OAuthUserData, OAuthResult } from "@/services/oauth.service";
import {
  googleCallback,
  microsoftCallback,
  appleCallback,
  getLinkedAccounts,
  linkProvider,
} from "../oauth.controller";

// Mock modules
vi.mock("passport");
vi.mock("@/config/inversify.config");

describe("OAuth Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockOAuthService: OAuthService;
  let mockLogger: Logger;

  const mockOAuthUserData: OAuthUserData = {
    provider: "GOOGLE",
    providerAccountId: "google123",
    email: "test@example.com",
    emailVerified: true,
    name: "Test User",
    picture: "https://example.com/pic.jpg",
    accessToken: "oauth-access-token",
    refreshToken: "oauth-refresh-token",
    idToken: "oauth-id-token",
  };

  const mockOAuthResult: OAuthResult = {
    user: {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
      role: "USER",
    },
    tokens: {
      accessToken: "app-access-token",
      refreshToken: "app-refresh-token",
      expiresIn: 3600,
    },
    isNewUser: false,
  };

  beforeEach(() => {
    process.env.FRONTEND_URL = "http://localhost:3000";
    process.env.NODE_ENV = "test";

    mockRequest = {
      headers: {
        "user-agent": "Mozilla/5.0",
      },
      ip: "192.168.1.1",
      user: undefined,
    };

    mockResponse = {
      redirect: vi.fn(),
      cookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    mockNext = vi.fn();

    mockOAuthService = {
      handleOAuthAuthentication: vi.fn().mockResolvedValue(mockOAuthResult),
      getUserOAuthAccounts: vi.fn().mockResolvedValue([]),
    } as unknown as OAuthService;

    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    } as unknown as Logger;

    (container.get as Mock).mockImplementation((type: symbol) => {
      if (type === TYPES.Logger) return mockLogger;
      if (type === OAuthService) return mockOAuthService;
      throw new Error(`Unexpected container.get call for type: ${String(type)}`);
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("googleCallback", () => {
    it("should handle successful Google OAuth authentication", async () => {
      let authenticateCallback:
        | ((err: unknown, user: OAuthUserData | false | undefined) => Promise<void>)
        | undefined;

      (passport.authenticate as Mock).mockImplementation(
        (strategy: string, options: any, callback: any) => {
          authenticateCallback = callback;
          return (req: Request, res: Response, next: NextFunction) => {
            // Immediately invoke callback with success
            if (authenticateCallback) {
              void authenticateCallback(null, mockOAuthUserData);
            }
          };
        },
      );

      googleCallback(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(passport.authenticate).toHaveBeenCalledWith(
        "google",
        { session: false },
        expect.any(Function),
      );

      expect(mockOAuthService.handleOAuthAuthentication).toHaveBeenCalledWith(
        mockOAuthUserData,
        {
          userAgent: "Mozilla/5.0",
          ipAddress: "192.168.1.1",
        },
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        "refreshToken",
        "app-refresh-token",
        {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        },
      );

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        "http://localhost:3000/auth/callback?token=app-access-token&new=false",
      );
    });

    it("should handle new user registration via Google", async () => {
      const newUserResult: OAuthResult = {
        ...mockOAuthResult,
        isNewUser: true,
      };

      (mockOAuthService.handleOAuthAuthentication as Mock).mockResolvedValue(
        newUserResult,
      );

      let authenticateCallback:
        | ((err: unknown, user: OAuthUserData | false | undefined) => Promise<void>)
        | undefined;

      (passport.authenticate as Mock).mockImplementation(
        (strategy: string, options: any, callback: any) => {
          authenticateCallback = callback;
          return (req: Request, res: Response, next: NextFunction) => {
            if (authenticateCallback) {
              void authenticateCallback(null, mockOAuthUserData);
            }
          };
        },
      );

      googleCallback(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        "http://localhost:3000/auth/callback?token=app-access-token&new=true",
      );
    });

    it("should redirect to error page when passport returns error", async () => {
      let authenticateCallback:
        | ((err: unknown, user: OAuthUserData | false | undefined) => Promise<void>)
        | undefined;

      (passport.authenticate as Mock).mockImplementation(
        (strategy: string, options: any, callback: any) => {
          authenticateCallback = callback;
          return (req: Request, res: Response, next: NextFunction) => {
            if (authenticateCallback) {
              void authenticateCallback(new Error("OAuth failed"), undefined);
            }
          };
        },
      );

      googleCallback(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockLogger.error).toHaveBeenCalledWith(
        "Google OAuth error: OAuth failed",
      );

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        "http://localhost:3000/login?error=oauth_failed",
      );
    });

    it("should redirect to error page when user is not returned", async () => {
      let authenticateCallback:
        | ((err: unknown, user: OAuthUserData | false | undefined) => Promise<void>)
        | undefined;

      (passport.authenticate as Mock).mockImplementation(
        (strategy: string, options: any, callback: any) => {
          authenticateCallback = callback;
          return (req: Request, res: Response, next: NextFunction) => {
            if (authenticateCallback) {
              void authenticateCallback(null, false);
            }
          };
        },
      );

      googleCallback(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        "http://localhost:3000/login?error=oauth_failed",
      );
    });

    it("should handle OAuth service errors", async () => {
      (mockOAuthService.handleOAuthAuthentication as Mock).mockRejectedValue(
        new Error("Database error"),
      );

      let authenticateCallback:
        | ((err: unknown, user: OAuthUserData | false | undefined) => Promise<void>)
        | undefined;

      (passport.authenticate as Mock).mockImplementation(
        (strategy: string, options: any, callback: any) => {
          authenticateCallback = callback;
          return (req: Request, res: Response, next: NextFunction) => {
            if (authenticateCallback) {
              void authenticateCallback(null, mockOAuthUserData);
            }
          };
        },
      );

      googleCallback(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockLogger.error).toHaveBeenCalledWith(
        "Google OAuth callback error: Database error",
      );

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        "http://localhost:3000/login?error=oauth_failed",
      );
    });

    it("should set secure cookie in production environment", async () => {
      process.env.NODE_ENV = "production";

      let authenticateCallback:
        | ((err: unknown, user: OAuthUserData | false | undefined) => Promise<void>)
        | undefined;

      (passport.authenticate as Mock).mockImplementation(
        (strategy: string, options: any, callback: any) => {
          authenticateCallback = callback;
          return (req: Request, res: Response, next: NextFunction) => {
            if (authenticateCallback) {
              void authenticateCallback(null, mockOAuthUserData);
            }
          };
        },
      );

      googleCallback(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        "refreshToken",
        "app-refresh-token",
        expect.objectContaining({
          secure: true,
        }),
      );
    });

    it("should handle missing metadata gracefully", async () => {
      mockRequest.headers = {};
      mockRequest.ip = undefined;

      let authenticateCallback:
        | ((err: unknown, user: OAuthUserData | false | undefined) => Promise<void>)
        | undefined;

      (passport.authenticate as Mock).mockImplementation(
        (strategy: string, options: any, callback: any) => {
          authenticateCallback = callback;
          return (req: Request, res: Response, next: NextFunction) => {
            if (authenticateCallback) {
              void authenticateCallback(null, mockOAuthUserData);
            }
          };
        },
      );

      googleCallback(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockOAuthService.handleOAuthAuthentication).toHaveBeenCalledWith(
        mockOAuthUserData,
        {},
      );
    });
  });

  describe("microsoftCallback", () => {
    it("should handle successful Microsoft OAuth authentication", async () => {
      const msUserData: OAuthUserData = {
        ...mockOAuthUserData,
        provider: "MICROSOFT",
        providerAccountId: "ms123",
      };

      let authenticateCallback:
        | ((err: unknown, user: OAuthUserData | false | undefined) => Promise<void>)
        | undefined;

      (passport.authenticate as Mock).mockImplementation(
        (strategy: string, options: any, callback: any) => {
          authenticateCallback = callback;
          return (req: Request, res: Response, next: NextFunction) => {
            if (authenticateCallback) {
              void authenticateCallback(null, msUserData);
            }
          };
        },
      );

      microsoftCallback(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(passport.authenticate).toHaveBeenCalledWith(
        "microsoft",
        { session: false },
        expect.any(Function),
      );

      expect(mockOAuthService.handleOAuthAuthentication).toHaveBeenCalledWith(
        msUserData,
        {
          userAgent: "Mozilla/5.0",
          ipAddress: "192.168.1.1",
        },
      );

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        "http://localhost:3000/auth/callback?token=app-access-token&new=false",
      );
    });

    it("should handle Microsoft OAuth errors", async () => {
      let authenticateCallback:
        | ((err: unknown, user: OAuthUserData | false | undefined) => Promise<void>)
        | undefined;

      (passport.authenticate as Mock).mockImplementation(
        (strategy: string, options: any, callback: any) => {
          authenticateCallback = callback;
          return (req: Request, res: Response, next: NextFunction) => {
            if (authenticateCallback) {
              void authenticateCallback(
                new Error("Microsoft auth failed"),
                undefined,
              );
            }
          };
        },
      );

      microsoftCallback(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockLogger.error).toHaveBeenCalledWith(
        "Microsoft OAuth error: Microsoft auth failed",
      );

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        "http://localhost:3000/login?error=oauth_failed",
      );
    });
  });

  describe("appleCallback", () => {
    it("should handle successful Apple Sign In authentication", async () => {
      const appleUserData: OAuthUserData = {
        ...mockOAuthUserData,
        provider: "APPLE",
        providerAccountId: "apple123",
      };

      let authenticateCallback:
        | ((err: unknown, user: OAuthUserData | false | undefined) => Promise<void>)
        | undefined;

      (passport.authenticate as Mock).mockImplementation(
        (strategy: string, options: any, callback: any) => {
          authenticateCallback = callback;
          return (req: Request, res: Response, next: NextFunction) => {
            if (authenticateCallback) {
              void authenticateCallback(null, appleUserData);
            }
          };
        },
      );

      appleCallback(mockRequest as Request, mockResponse as Response, mockNext);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(passport.authenticate).toHaveBeenCalledWith(
        "apple",
        { session: false },
        expect.any(Function),
      );

      expect(mockOAuthService.handleOAuthAuthentication).toHaveBeenCalledWith(
        appleUserData,
        {
          userAgent: "Mozilla/5.0",
          ipAddress: "192.168.1.1",
        },
      );

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        "http://localhost:3000/auth/callback?token=app-access-token&new=false",
      );
    });

    it("should handle Apple Sign In errors", async () => {
      let authenticateCallback:
        | ((err: unknown, user: OAuthUserData | false | undefined) => Promise<void>)
        | undefined;

      (passport.authenticate as Mock).mockImplementation(
        (strategy: string, options: any, callback: any) => {
          authenticateCallback = callback;
          return (req: Request, res: Response, next: NextFunction) => {
            if (authenticateCallback) {
              void authenticateCallback(new Error("Apple auth failed"), undefined);
            }
          };
        },
      );

      appleCallback(mockRequest as Request, mockResponse as Response, mockNext);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockLogger.error).toHaveBeenCalledWith(
        "Apple Sign In error: Apple auth failed",
      );

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        "http://localhost:3000/login?error=oauth_failed",
      );
    });
  });

  describe("getLinkedAccounts", () => {
    it("should return linked accounts for authenticated user", async () => {
      mockRequest.user = { id: "user-123" };

      const mockAccounts = [
        {
          provider: "GOOGLE" as const,
          createdAt: new Date("2025-01-01"),
          userId: "user-123",
          providerAccountId: "google123",
        },
        {
          provider: "MICROSOFT" as const,
          createdAt: new Date("2025-01-02"),
          userId: "user-123",
          providerAccountId: "ms123",
        },
      ];

      (mockOAuthService.getUserOAuthAccounts as Mock).mockResolvedValue(
        mockAccounts,
      );

      await getLinkedAccounts(mockRequest as Request, mockResponse as Response);

      expect(mockOAuthService.getUserOAuthAccounts).toHaveBeenCalledWith(
        "user-123",
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        accounts: [
          { provider: "GOOGLE", createdAt: new Date("2025-01-01") },
          { provider: "MICROSOFT", createdAt: new Date("2025-01-02") },
        ],
      });
    });

    it("should return 401 when user is not authenticated", async () => {
      mockRequest.user = undefined;

      await getLinkedAccounts(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Not authenticated",
      });
    });

    it("should handle service errors", async () => {
      mockRequest.user = { id: "user-123" };

      (mockOAuthService.getUserOAuthAccounts as Mock).mockRejectedValue(
        new Error("Database error"),
      );

      await getLinkedAccounts(mockRequest as Request, mockResponse as Response);

      expect(mockLogger.error).toHaveBeenCalledWith(
        "Get linked accounts error: Database error",
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("linkProvider", () => {
    it("should return 401 when user is not authenticated", () => {
      mockRequest.user = undefined;

      linkProvider(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Not authenticated",
      });
    });

    it("should return 501 for authenticated user (not yet implemented)", () => {
      mockRequest.user = { id: "user-123" };

      linkProvider(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(501);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Provider linking not yet implemented",
        message:
          "This feature requires authenticated OAuth flow with state parameter",
      });
    });

    it("should handle unexpected errors", () => {
      // Force an error by making user.id non-string
      mockRequest.user = { id: 123 } as any;

      // Mock container.get to throw
      (container.get as Mock).mockImplementation(() => {
        throw new Error("Container error");
      });

      linkProvider(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });
});
