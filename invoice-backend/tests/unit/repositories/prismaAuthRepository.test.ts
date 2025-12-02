import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { PrismaAuthRepository } from "@/repositories/implementations/prismaAuthRepository";
import type { PrismaClient } from "@prisma/client";

describe("PrismaAuthRepository", () => {
  let repository: PrismaAuthRepository;
  let mockPrisma: ReturnType<typeof mockDeep<PrismaClient>>;

  beforeEach(() => {
    mockPrisma = mockDeep<PrismaClient>();
    repository = new PrismaAuthRepository(mockPrisma);
  });

  describe("OAuth Accounts", () => {
    describe("createOAuthAccount", () => {
      it("should create OAuth account with minimal data", async () => {
        const accountData = {
          userId: "user-123",
          provider: "GOOGLE" as const,
          providerAccountId: "google-123",
        };

        const mockAccount = {
          id: "account-123",
          ...accountData,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          scope: null,
          idToken: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPrisma.oAuthAccount.create.mockResolvedValue(mockAccount);

        const result = await repository.createOAuthAccount(accountData);

        expect(result.userId).toBe(accountData.userId);
        expect(result.provider).toBe(accountData.provider);
        expect(mockPrisma.oAuthAccount.create).toHaveBeenCalledWith({
          data: accountData,
        });
      });

      it("should create OAuth account with all optional fields", async () => {
        const accountData = {
          userId: "user-123",
          provider: "GOOGLE" as const,
          providerAccountId: "google-123",
          accessToken: "access-token",
          refreshToken: "refresh-token",
          expiresAt: new Date(),
          scope: "profile email",
          idToken: "id-token",
        };

        const mockAccount = {
          id: "account-123",
          ...accountData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPrisma.oAuthAccount.create.mockResolvedValue(mockAccount);

        await repository.createOAuthAccount(accountData);

        expect(mockPrisma.oAuthAccount.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            accessToken: "access-token",
            refreshToken: "refresh-token",
            scope: "profile email",
            idToken: "id-token",
          }),
        });
      });
    });

    describe("findOAuthAccount", () => {
      it("should find OAuth account by provider and providerAccountId", async () => {
        const mockAccount = {
          id: "account-123",
          userId: "user-123",
          provider: "GOOGLE" as const,
          providerAccountId: "google-123",
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          scope: null,
          idToken: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPrisma.oAuthAccount.findUnique.mockResolvedValue(mockAccount);

        const result = await repository.findOAuthAccount("GOOGLE", "google-123");

        expect(result).toBeDefined();
        expect(result?.userId).toBe("user-123");
      });

      it("should return null if account not found", async () => {
        mockPrisma.oAuthAccount.findUnique.mockResolvedValue(null);

        const result = await repository.findOAuthAccount("GOOGLE", "nonexistent");

        expect(result).toBeNull();
      });
    });

    describe("findOAuthAccountsByUserId", () => {
      it("should find all OAuth accounts for a user", async () => {
        const mockAccounts = [
          {
            id: "account-1",
            userId: "user-123",
            provider: "GOOGLE" as const,
            providerAccountId: "google-123",
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            scope: null,
            idToken: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "account-2",
            userId: "user-123",
            provider: "MICROSOFT" as const,
            providerAccountId: "ms-456",
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            scope: null,
            idToken: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        mockPrisma.oAuthAccount.findMany.mockResolvedValue(mockAccounts);

        const result = await repository.findOAuthAccountsByUserId("user-123");

        expect(result).toHaveLength(2);
        expect(result[0].provider).toBe("GOOGLE");
        expect(result[1].provider).toBe("MICROSOFT");
      });

      it("should return empty array if no accounts found", async () => {
        mockPrisma.oAuthAccount.findMany.mockResolvedValue([]);

        const result = await repository.findOAuthAccountsByUserId("user-123");

        expect(result).toHaveLength(0);
      });
    });
  });

  describe("Refresh Tokens", () => {
    describe("createRefreshToken", () => {
      it("should create refresh token", async () => {
        const tokenData = {
          userId: "user-123",
          token: "hashed-token",
          family: "family-123",
          expiresAt: new Date(),
        };

        const mockToken = {
          id: "token-123",
          ...tokenData,
          createdAt: new Date(),
          revokedAt: null,
          revokedReason: null,
          replacedBy: null,
          userAgent: null,
          ipAddress: null,
        };

        mockPrisma.refreshToken.create.mockResolvedValue(mockToken);

        const result = await repository.createRefreshToken(tokenData);

        expect(result.userId).toBe("user-123");
        expect(result.token).toBe("hashed-token");
      });

      it("should create refresh token with metadata", async () => {
        const tokenData = {
          userId: "user-123",
          token: "hashed-token",
          family: "family-123",
          expiresAt: new Date(),
          userAgent: "Mozilla/5.0",
          ipAddress: "192.168.1.1",
        };

        const mockToken = {
          id: "token-123",
          ...tokenData,
          createdAt: new Date(),
          revokedAt: null,
          revokedReason: null,
          replacedBy: null,
        };

        mockPrisma.refreshToken.create.mockResolvedValue(mockToken);

        await repository.createRefreshToken(tokenData);

        expect(mockPrisma.refreshToken.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            userAgent: "Mozilla/5.0",
            ipAddress: "192.168.1.1",
          }),
        });
      });
    });

    describe("findRefreshTokenByToken", () => {
      it("should find token by hash", async () => {
        const mockToken = {
          id: "token-123",
          userId: "user-123",
          token: "hashed-token",
          family: "family-123",
          expiresAt: new Date(),
          createdAt: new Date(),
          revokedAt: null,
          revokedReason: null,
          replacedBy: null,
          userAgent: null,
          ipAddress: null,
        };

        mockPrisma.refreshToken.findUnique.mockResolvedValue(mockToken);

        const result = await repository.findRefreshTokenByToken("hashed-token");

        expect(result).toBeDefined();
        expect(result?.id).toBe("token-123");
      });

      it("should return null if token not found", async () => {
        mockPrisma.refreshToken.findUnique.mockResolvedValue(null);

        const result = await repository.findRefreshTokenByToken("nonexistent");

        expect(result).toBeNull();
      });
    });

    describe("findActiveRefreshTokens", () => {
      it("should find all active (non-revoked) tokens", async () => {
        const mockTokens = [
          {
            id: "token-1",
            userId: "user-123",
            token: "hash-1",
            family: "family-1",
            expiresAt: new Date(Date.now() + 1000000),
            createdAt: new Date(),
            revokedAt: null,
            revokedReason: null,
            replacedBy: null,
            userAgent: null,
            ipAddress: null,
          },
          {
            id: "token-2",
            userId: "user-456",
            token: "hash-2",
            family: "family-2",
            expiresAt: new Date(Date.now() + 1000000),
            createdAt: new Date(),
            revokedAt: null,
            revokedReason: null,
            replacedBy: null,
            userAgent: null,
            ipAddress: null,
          },
        ];

        mockPrisma.refreshToken.findMany.mockResolvedValue(mockTokens);

        const result = await repository.findActiveRefreshTokens();

        expect(result).toHaveLength(2);
        expect(mockPrisma.refreshToken.findMany).toHaveBeenCalledWith({
          where: {
            isRevoked: false,
            expiresAt: { gt: expect.any(Date) },
          },
          orderBy: { createdAt: "desc" },
        });
      });
    });

    describe("revokeRefreshToken", () => {
      it("should revoke a token", async () => {
        mockPrisma.refreshToken.update.mockResolvedValue({} as any);

        const result = await repository.revokeRefreshToken("token-123", "User logout");

        expect(result).toBe(true);
        expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith({
          where: { id: "token-123" },
          data: expect.objectContaining({
            revokedReason: "User logout",
          }),
        });
      });

      it("should mark token as replaced when replacedById provided", async () => {
        mockPrisma.refreshToken.update.mockResolvedValue({} as any);

        await repository.revokeRefreshToken("token-123", "Rotated", "new-token-123");

        expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith({
          where: { id: "token-123" },
          data: expect.objectContaining({
            replacedBy: "new-token-123",
          }),
        });
      });

      it("should return false on error", async () => {
        mockPrisma.refreshToken.update.mockRejectedValue(new Error("DB error"));

        const result = await repository.revokeRefreshToken("token-123", "reason");

        expect(result).toBe(false);
      });
    });

    describe("revokeTokenFamily", () => {
      it("should revoke all tokens in a family", async () => {
        mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 3 });

        await repository.revokeTokenFamily("family-123", "Security breach");

        expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith({
          where: {
            family: "family-123",
            isRevoked: false,
          },
          data: expect.objectContaining({
            isRevoked: true,
            revokedReason: "Security breach",
          }),
        });
      });
    });
  });

  describe("Sessions", () => {
    describe("createSession", () => {
      it("should create a session", async () => {
        const sessionData = {
          userId: "user-123",
          expiresAt: new Date(),
        };

        const mockSession = {
          id: "session-123",
          ...sessionData,
          createdAt: new Date(),
        };

        mockPrisma.session.create.mockResolvedValue(mockSession);

        const result = await repository.createSession(sessionData);

        expect(result.userId).toBe("user-123");
        expect(result.id).toBe("session-123");
      });
    });

    describe("findSessionByRefreshTokenId", () => {
      it("should find session by refresh token ID", async () => {
        const mockSession = {
          id: "session-123",
          userId: "user-123",
          refreshTokenId: "token-123",
          expiresAt: new Date(),
          createdAt: new Date(),
          lastActivityAt: new Date(),
        };

        mockPrisma.session.findUnique.mockResolvedValue(mockSession);

        const result = await repository.findSessionByRefreshTokenId("token-123");

        expect(result?.id).toBe("session-123");
        expect(mockPrisma.session.findUnique).toHaveBeenCalledWith({
          where: { refreshTokenId: "token-123" },
        });
      });

      it("should return null if session not found", async () => {
        mockPrisma.session.findUnique.mockResolvedValue(null);

        const result = await repository.findSessionByRefreshTokenId("nonexistent");

        expect(result).toBeNull();
      });
    });

    describe("deleteSession", () => {
      it("should delete a session", async () => {
        mockPrisma.session.delete.mockResolvedValue({} as any);

        const result = await repository.deleteSession("session-123");

        expect(result).toBe(true);
        expect(mockPrisma.session.delete).toHaveBeenCalledWith({
          where: { id: "session-123" },
        });
      });

      it("should return false on error", async () => {
        mockPrisma.session.delete.mockRejectedValue(new Error("Not found"));

        const result = await repository.deleteSession("nonexistent");

        expect(result).toBe(false);
      });
    });
  });

  describe("Cleanup", () => {
    it("should cleanup expired tokens", async () => {
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 5 });

      await repository.cleanupExpiredTokens();

      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: {
          expiresAt: { lt: expect.any(Date) },
        },
      });
    });

    it("should cleanup expired sessions", async () => {
      mockPrisma.session.deleteMany.mockResolvedValue({ count: 3 });

      await repository.cleanupExpiredSessions();

      expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith({
        where: {
          expiresAt: { lt: expect.any(Date) },
        },
      });
    });
  });
});
