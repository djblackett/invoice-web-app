import "reflect-metadata";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { OAuthService, type OAuthUserData, type OAuthResult } from "../oauth.service";
import type { IUserRepo } from "@/repositories/userRepo";
import type { IAuthRepo, OAuthAccountData } from "@/repositories/authRepo";
import { AuthService } from "../auth.service";
import type { Logger } from "@/config/logger.config";
import { OAuthProvider } from "@prisma/client";
import type { UserIdAndRole } from "@/constants/types";

describe("OAuthService", () => {
  let oauthService: OAuthService;
  let mockUserRepo: IUserRepo;
  let mockAuthRepo: IAuthRepo;
  let mockAuthService: AuthService;
  let mockLogger: Logger;

  const mockTokens = {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    expiresIn: 3600,
  };

  const mockOAuthData: OAuthUserData = {
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

  beforeEach(() => {
    mockUserRepo = {
      getUserByUsername: vi.fn(),
      getUserByIdSafely: vi.fn(),
      createUser: vi.fn(),
    } as unknown as IUserRepo;

    mockAuthRepo = {
      findOAuthAccount: vi.fn(),
      findOAuthAccountsByUserId: vi.fn(),
      createOAuthAccount: vi.fn(),
      updateOAuthAccount: vi.fn(),
      deleteOAuthAccount: vi.fn(),
    } as unknown as IAuthRepo;

    mockAuthService = {
      generateTokenPair: vi.fn().mockResolvedValue(mockTokens),
    } as unknown as AuthService;

    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    } as unknown as Logger;

    oauthService = new OAuthService(
      mockUserRepo,
      mockAuthRepo,
      mockAuthService,
      mockLogger,
    );
  });

  describe("handleOAuthAuthentication", () => {
    describe("when OAuth account exists (returning user)", () => {
      it("should return user and tokens for existing OAuth account", async () => {
        const existingOAuthAccount: OAuthAccountData = {
          id: "oauth-account-id",
          userId: "user-123",
          provider: OAuthProvider.GOOGLE,
          providerAccountId: "google123",
          accessToken: "old-token",
        };

        const existingUser: UserIdAndRole = {
          id: "user-123",
          username: "test@example.com",
          name: "Test User",
          role: "USER",
        };

        (mockAuthRepo.findOAuthAccount as Mock).mockResolvedValue(existingOAuthAccount);
        (mockUserRepo.getUserByIdSafely as Mock).mockResolvedValue(existingUser);

        const result = await oauthService.handleOAuthAuthentication(mockOAuthData);

        expect(result).toEqual({
          user: {
            id: "user-123",
            email: "test@example.com",
            name: "Test User",
            role: "USER",
          },
          tokens: mockTokens,
          isNewUser: false,
        });

        expect(mockAuthRepo.findOAuthAccount).toHaveBeenCalledWith(
          OAuthProvider.GOOGLE,
          "google123",
        );
        expect(mockUserRepo.getUserByIdSafely).toHaveBeenCalledWith("user-123");
      });

      it("should update OAuth account tokens if provided", async () => {
        const existingOAuthAccount: OAuthAccountData = {
          id: "oauth-account-id",
          userId: "user-123",
          provider: OAuthProvider.GOOGLE,
          providerAccountId: "google123",
        };

        const existingUser: UserIdAndRole = {
          id: "user-123",
          username: "test@example.com",
          role: "USER",
        };

        (mockAuthRepo.findOAuthAccount as Mock).mockResolvedValue(existingOAuthAccount);
        (mockUserRepo.getUserByIdSafely as Mock).mockResolvedValue(existingUser);

        await oauthService.handleOAuthAuthentication(mockOAuthData);

        expect(mockAuthRepo.updateOAuthAccount).toHaveBeenCalledWith(
          "oauth-account-id",
          {
            accessToken: "oauth-access-token",
            refreshToken: "oauth-refresh-token",
            idToken: "oauth-id-token",
          },
        );
      });

      it("should throw error if user not found for OAuth account", async () => {
        const existingOAuthAccount: OAuthAccountData = {
          id: "oauth-account-id",
          userId: "user-123",
          provider: OAuthProvider.GOOGLE,
          providerAccountId: "google123",
        };

        (mockAuthRepo.findOAuthAccount as Mock).mockResolvedValue(existingOAuthAccount);
        (mockUserRepo.getUserByIdSafely as Mock).mockResolvedValue(null);

        await expect(
          oauthService.handleOAuthAuthentication(mockOAuthData),
        ).rejects.toThrow("User not found for OAuth account");
      });

      it("should throw error if user missing required fields", async () => {
        const existingOAuthAccount: OAuthAccountData = {
          id: "oauth-account-id",
          userId: "user-123",
          provider: OAuthProvider.GOOGLE,
          providerAccountId: "google123",
        };

        const invalidUser = {
          id: "user-123",
          username: null,
          role: "USER",
        } as unknown as UserIdAndRole;

        (mockAuthRepo.findOAuthAccount as Mock).mockResolvedValue(existingOAuthAccount);
        (mockUserRepo.getUserByIdSafely as Mock).mockResolvedValue(invalidUser);

        await expect(
          oauthService.handleOAuthAuthentication(mockOAuthData),
        ).rejects.toThrow("User missing required fields (username or role)");
      });
    });

    describe("when user exists with email (linking OAuth)", () => {
      it("should link OAuth account to existing user", async () => {
        const existingUser: UserIdAndRole = {
          id: "user-123",
          username: "test@example.com",
          name: "Test User",
          role: "USER",
        };

        (mockAuthRepo.findOAuthAccount as Mock).mockResolvedValue(null);
        (mockUserRepo.getUserByUsername as Mock).mockResolvedValue(existingUser);

        const result = await oauthService.handleOAuthAuthentication(mockOAuthData);

        expect(result).toEqual({
          user: {
            id: "user-123",
            email: "test@example.com",
            name: "Test User",
            role: "USER",
          },
          tokens: mockTokens,
          isNewUser: false,
        });

        expect(mockAuthRepo.createOAuthAccount).toHaveBeenCalledWith({
          userId: "user-123",
          provider: OAuthProvider.GOOGLE,
          providerAccountId: "google123",
          accessToken: "oauth-access-token",
          refreshToken: "oauth-refresh-token",
          idToken: "oauth-id-token",
        });
      });

      it("should work for Microsoft provider", async () => {
        const msOAuthData: OAuthUserData = {
          ...mockOAuthData,
          provider: "MICROSOFT",
          providerAccountId: "ms123",
        };

        const existingUser: UserIdAndRole = {
          id: "user-123",
          username: "test@example.com",
          role: "USER",
        };

        (mockAuthRepo.findOAuthAccount as Mock).mockResolvedValue(null);
        (mockUserRepo.getUserByUsername as Mock).mockResolvedValue(existingUser);

        await oauthService.handleOAuthAuthentication(msOAuthData);

        expect(mockAuthRepo.createOAuthAccount).toHaveBeenCalledWith(
          expect.objectContaining({
            provider: OAuthProvider.MICROSOFT,
            providerAccountId: "ms123",
          }),
        );
      });

      it("should work for Apple provider", async () => {
        const appleOAuthData: OAuthUserData = {
          ...mockOAuthData,
          provider: "APPLE",
          providerAccountId: "apple123",
        };

        const existingUser: UserIdAndRole = {
          id: "user-123",
          username: "test@example.com",
          role: "USER",
        };

        (mockAuthRepo.findOAuthAccount as Mock).mockResolvedValue(null);
        (mockUserRepo.getUserByUsername as Mock).mockResolvedValue(existingUser);

        await oauthService.handleOAuthAuthentication(appleOAuthData);

        expect(mockAuthRepo.createOAuthAccount).toHaveBeenCalledWith(
          expect.objectContaining({
            provider: OAuthProvider.APPLE,
            providerAccountId: "apple123",
          }),
        );
      });
    });

    describe("when creating new user (new registration)", () => {
      it("should create new user with OAuth account", async () => {
        const newUser = {
          id: "new-user-id",
          username: "test@example.com",
          name: "Test User",
          role: "USER",
        };

        (mockAuthRepo.findOAuthAccount as Mock).mockResolvedValue(null);
        (mockUserRepo.getUserByUsername as Mock).mockResolvedValue(null);
        (mockUserRepo.createUser as Mock).mockResolvedValue(newUser);

        const result = await oauthService.handleOAuthAuthentication(mockOAuthData);

        expect(result).toEqual({
          user: {
            id: "new-user-id",
            email: "test@example.com",
            name: "Test User",
            role: "USER",
          },
          tokens: mockTokens,
          isNewUser: true,
        });

        expect(mockUserRepo.createUser).toHaveBeenCalledWith({
          username: "test@example.com",
          name: "Test User",
          passwordHash: "",
        });

        expect(mockAuthRepo.createOAuthAccount).toHaveBeenCalledWith({
          userId: "new-user-id",
          provider: OAuthProvider.GOOGLE,
          providerAccountId: "google123",
          accessToken: "oauth-access-token",
          refreshToken: "oauth-refresh-token",
          idToken: "oauth-id-token",
        });
      });

      it("should create user with name from email if name not provided", async () => {
        const oauthDataNoName: OAuthUserData = {
          ...mockOAuthData,
          name: undefined,
        };

        const newUser = {
          id: "new-user-id",
          username: "test@example.com",
          role: "USER",
        };

        (mockAuthRepo.findOAuthAccount as Mock).mockResolvedValue(null);
        (mockUserRepo.getUserByUsername as Mock).mockResolvedValue(null);
        (mockUserRepo.createUser as Mock).mockResolvedValue(newUser);

        await oauthService.handleOAuthAuthentication(oauthDataNoName);

        expect(mockUserRepo.createUser).toHaveBeenCalledWith({
          username: "test@example.com",
          name: "test",
          passwordHash: "",
        });
      });

      it("should pass metadata to token generation", async () => {
        const newUser = {
          id: "new-user-id",
          username: "test@example.com",
          role: "USER",
        };

        const metadata = {
          userAgent: "Mozilla/5.0",
          ipAddress: "192.168.1.1",
        };

        (mockAuthRepo.findOAuthAccount as Mock).mockResolvedValue(null);
        (mockUserRepo.getUserByUsername as Mock).mockResolvedValue(null);
        (mockUserRepo.createUser as Mock).mockResolvedValue(newUser);

        await oauthService.handleOAuthAuthentication(mockOAuthData, metadata);

        expect(mockAuthService.generateTokenPair).toHaveBeenCalledWith(
          expect.any(Object),
          metadata,
        );
      });
    });
  });

  describe("linkProviderToUser", () => {
    it("should link new provider to existing user", async () => {
      (mockAuthRepo.findOAuthAccount as Mock).mockResolvedValue(null);

      await oauthService.linkProviderToUser("user-123", mockOAuthData);

      expect(mockAuthRepo.createOAuthAccount).toHaveBeenCalledWith({
        userId: "user-123",
        provider: OAuthProvider.GOOGLE,
        providerAccountId: "google123",
        accessToken: "oauth-access-token",
        refreshToken: "oauth-refresh-token",
        idToken: "oauth-id-token",
      });
    });

    it("should throw error if provider already linked to same user", async () => {
      const existingLink: OAuthAccountData = {
        id: "link-id",
        userId: "user-123",
        provider: OAuthProvider.GOOGLE,
        providerAccountId: "google123",
      };

      (mockAuthRepo.findOAuthAccount as Mock).mockResolvedValue(existingLink);

      await expect(
        oauthService.linkProviderToUser("user-123", mockOAuthData),
      ).rejects.toThrow("This provider is already linked to your account");
    });

    it("should throw error if provider linked to different user", async () => {
      const existingLink: OAuthAccountData = {
        id: "link-id",
        userId: "different-user",
        provider: OAuthProvider.GOOGLE,
        providerAccountId: "google123",
      };

      (mockAuthRepo.findOAuthAccount as Mock).mockResolvedValue(existingLink);

      await expect(
        oauthService.linkProviderToUser("user-123", mockOAuthData),
      ).rejects.toThrow("This provider is already linked to a different account");
    });
  });

  describe("getUserOAuthAccounts", () => {
    it("should return all OAuth accounts for user", async () => {
      const accounts: OAuthAccountData[] = [
        {
          id: "account-1",
          userId: "user-123",
          provider: OAuthProvider.GOOGLE,
          providerAccountId: "google123",
        },
        {
          id: "account-2",
          userId: "user-123",
          provider: OAuthProvider.MICROSOFT,
          providerAccountId: "ms123",
        },
      ];

      (mockAuthRepo.findOAuthAccountsByUserId as Mock).mockResolvedValue(accounts);

      const result = await oauthService.getUserOAuthAccounts("user-123");

      expect(result).toEqual(accounts);
      expect(mockAuthRepo.findOAuthAccountsByUserId).toHaveBeenCalledWith("user-123");
    });
  });

  describe("unlinkProvider", () => {
    it("should unlink provider from user", async () => {
      const accounts: OAuthAccountData[] = [
        {
          id: "account-1",
          userId: "user-123",
          provider: OAuthProvider.GOOGLE,
          providerAccountId: "google123",
        },
        {
          id: "account-2",
          userId: "user-123",
          provider: OAuthProvider.MICROSOFT,
          providerAccountId: "ms123",
        },
      ];

      (mockAuthRepo.findOAuthAccountsByUserId as Mock).mockResolvedValue(accounts);

      await oauthService.unlinkProvider("user-123", OAuthProvider.GOOGLE);

      expect(mockAuthRepo.deleteOAuthAccount).toHaveBeenCalledWith("account-1");
    });

    it("should throw error if provider not linked", async () => {
      const accounts: OAuthAccountData[] = [
        {
          id: "account-1",
          userId: "user-123",
          provider: OAuthProvider.GOOGLE,
          providerAccountId: "google123",
        },
      ];

      (mockAuthRepo.findOAuthAccountsByUserId as Mock).mockResolvedValue(accounts);

      await expect(
        oauthService.unlinkProvider("user-123", OAuthProvider.MICROSOFT),
      ).rejects.toThrow("Provider not linked to this account");
    });

    it("should throw error if trying to unlink the only auth method", async () => {
      const accounts: OAuthAccountData[] = [
        {
          id: "account-1",
          userId: "user-123",
          provider: OAuthProvider.GOOGLE,
          providerAccountId: "google123",
        },
      ];

      (mockAuthRepo.findOAuthAccountsByUserId as Mock).mockResolvedValue(accounts);

      await expect(
        oauthService.unlinkProvider("user-123", OAuthProvider.GOOGLE),
      ).rejects.toThrow("Cannot unlink the only authentication method");
    });

    it("should throw error if OAuth account id is missing", async () => {
      const accounts: OAuthAccountData[] = [
        {
          userId: "user-123",
          provider: OAuthProvider.GOOGLE,
          providerAccountId: "google123",
        },
        {
          id: "account-2",
          userId: "user-123",
          provider: OAuthProvider.MICROSOFT,
          providerAccountId: "ms123",
        },
      ];

      (mockAuthRepo.findOAuthAccountsByUserId as Mock).mockResolvedValue(accounts);

      await expect(
        oauthService.unlinkProvider("user-123", OAuthProvider.GOOGLE),
      ).rejects.toThrow("OAuth account id missing; cannot unlink provider");
    });
  });
});
