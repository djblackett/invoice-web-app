import { describe, it, expect, beforeEach, vi } from "vitest";
import { mock, mockDeep } from "vitest-mock-extended";
import { AuthService } from "@/services/auth.service";
import { TokenService } from "@/services/token.service";
import type { IAuthRepo, RefreshTokenData } from "@/repositories/authRepo";
import * as cryptoUtil from "@/utils/crypto.util";

// Mock crypto utility functions
vi.mock("@/utils/crypto.util", async () => {
  const actual = await vi.importActual("@/utils/crypto.util");
  return {
    ...actual,
    generateSecureToken: vi.fn(),
    generateTokenFamily: vi.fn(),
    hashToken: vi.fn(),
    compareToken: vi.fn(),
  };
});

describe("AuthService", () => {
  let authService: AuthService;
  let mockAuthRepo: ReturnType<typeof mockDeep<IAuthRepo>>;
  let mockTokenService: ReturnType<typeof mockDeep<TokenService>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthRepo = mockDeep<IAuthRepo>();
    mockTokenService = mockDeep<TokenService>();

    vi.stubEnv("JWT_REFRESH_TOKEN_EXPIRY", "30d");

    authService = new AuthService(mockAuthRepo, mockTokenService);
  });

  describe("constructor", () => {
    it("should initialize with default expiry", () => {
      vi.unstubAllEnvs();
      const service = new AuthService(mockAuthRepo, mockTokenService);
      expect(service).toBeDefined();
    });

    it("should parse expiry in days", () => {
      vi.unstubAllEnvs();
      vi.stubEnv("JWT_REFRESH_TOKEN_EXPIRY", "7d");
      const service = new AuthService(mockAuthRepo, mockTokenService);
      expect(service).toBeDefined();
    });

    it("should parse expiry in hours", () => {
      vi.stubEnv("JWT_REFRESH_TOKEN_EXPIRY", "24h");
      const service = new AuthService(mockAuthRepo, mockTokenService);
      expect(service).toBeDefined();
    });

    it("should parse expiry in minutes", () => {
      vi.stubEnv("JWT_REFRESH_TOKEN_EXPIRY", "30m");
      const service = new AuthService(mockAuthRepo, mockTokenService);
      expect(service).toBeDefined();
    });

    it("should throw error for invalid expiry format", () => {
      vi.stubEnv("JWT_REFRESH_TOKEN_EXPIRY", "invalid");
      expect(() => new AuthService(mockAuthRepo, mockTokenService)).toThrow("Invalid expiry format");
    });
  });

  describe("generateTokenPair", () => {
    beforeEach(() => {
      vi.mocked(cryptoUtil.generateSecureToken).mockReturnValue("secure-token-123");
      vi.mocked(cryptoUtil.generateTokenFamily).mockReturnValue("family-123");
      vi.mocked(cryptoUtil.hashToken).mockResolvedValue("hashed-token");
      mockTokenService.signAccessToken.mockReturnValue("access-token-jwt");
      mockAuthRepo.createRefreshToken.mockResolvedValue({
        id: "token-id",
        userId: "user-123",
        token: "hashed-token",
        family: "family-123",
        expiresAt: new Date(),
        createdAt: new Date(),
        revokedAt: null,
        replacedBy: null,
        userAgent: null,
        ipAddress: null,
        revokedReason: null,
      });
    });

    it("should generate token pair for USER", async () => {
      const user = {
        id: "user-123",
        email: "test@example.com",
        role: "USER" as const,
      };

      const result = await authService.generateTokenPair(user);

      expect(result.accessToken).toBe("access-token-jwt");
      expect(result.refreshToken).toBe("secure-token-123");
      expect(result.expiresIn).toBe(900);
      expect(mockTokenService.signAccessToken).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
    });

    it("should generate token pair for ADMIN", async () => {
      const user = {
        id: "admin-123",
        email: "admin@example.com",
        role: "ADMIN" as const,
      };

      const result = await authService.generateTokenPair(user);

      expect(result.accessToken).toBe("access-token-jwt");
      expect(mockTokenService.signAccessToken).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
    });

    it("should generate token pair with optional name", async () => {
      const user = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "USER" as const,
      };

      await authService.generateTokenPair(user);

      expect(mockTokenService.signAccessToken).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    });

    it("should store refresh token with metadata", async () => {
      const user = {
        id: "user-123",
        email: "test@example.com",
        role: "USER" as const,
      };
      const metadata = {
        userAgent: "Mozilla/5.0",
        ipAddress: "192.168.1.1",
      };

      await authService.generateTokenPair(user, metadata);

      expect(mockAuthRepo.createRefreshToken).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: user.id,
          token: "hashed-token",
          family: "family-123",
          userAgent: metadata.userAgent,
          ipAddress: metadata.ipAddress,
        }),
      );
    });

    it("should store refresh token without metadata", async () => {
      const user = {
        id: "user-123",
        email: "test@example.com",
        role: "USER" as const,
      };

      await authService.generateTokenPair(user);

      expect(mockAuthRepo.createRefreshToken).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: user.id,
          token: "hashed-token",
          family: "family-123",
        }),
      );
    });

    it("should generate secure tokens", async () => {
      const user = {
        id: "user-123",
        email: "test@example.com",
        role: "USER" as const,
      };

      await authService.generateTokenPair(user);

      expect(cryptoUtil.generateSecureToken).toHaveBeenCalledWith(32);
      expect(cryptoUtil.generateTokenFamily).toHaveBeenCalled();
      expect(cryptoUtil.hashToken).toHaveBeenCalledWith("secure-token-123");
    });
  });

  describe("refreshAccessToken", () => {
    const validToken: RefreshTokenData = {
      id: "token-id",
      userId: "user-123",
      token: "hashed-token",
      family: "family-123",
      expiresAt: new Date(Date.now() + 1000000),
      createdAt: new Date(),
      revokedAt: null,
      replacedBy: null,
      userAgent: null,
      ipAddress: null,
      revokedReason: null,
    };

    beforeEach(() => {
      vi.mocked(cryptoUtil.generateSecureToken).mockReturnValue("new-secure-token");
      vi.mocked(cryptoUtil.hashToken).mockResolvedValue("new-hashed-token");
      mockTokenService.signAccessToken.mockReturnValue("new-access-token");
    });

    it("should refresh access token with valid refresh token", async () => {
      vi.mocked(cryptoUtil.compareToken).mockResolvedValue(true);
      mockAuthRepo.findActiveRefreshTokens.mockResolvedValue([validToken]);
      mockAuthRepo.findRefreshTokenByToken.mockResolvedValue(validToken);
      mockAuthRepo.createRefreshToken.mockResolvedValue({
        ...validToken,
        id: "new-token-id",
        token: "new-hashed-token",
      });

      const result = await authService.refreshAccessToken("refresh-token");

      expect(result.accessToken).toBe("new-access-token");
      expect(result.refreshToken).toBe("new-secure-token");
      expect(mockAuthRepo.revokeRefreshToken).toHaveBeenCalledWith(
        "token-id",
        "Rotated",
        "new-token-id",
      );
    });

    it("should throw error for invalid refresh token", async () => {
      vi.mocked(cryptoUtil.compareToken).mockResolvedValue(false);
      mockAuthRepo.findActiveRefreshTokens.mockResolvedValue([validToken]);

      await expect(authService.refreshAccessToken("invalid-token")).rejects.toThrow(
        "Invalid refresh token",
      );
    });

    it("should throw error for expired refresh token", async () => {
      const expiredToken = {
        ...validToken,
        expiresAt: new Date(Date.now() - 1000),
      };

      vi.mocked(cryptoUtil.compareToken).mockResolvedValue(true);
      mockAuthRepo.findActiveRefreshTokens.mockResolvedValue([expiredToken]);

      await expect(authService.refreshAccessToken("expired-token")).rejects.toThrow(
        "Refresh token expired",
      );
    });

    it("should throw error when token not found in database", async () => {
      vi.mocked(cryptoUtil.compareToken).mockResolvedValue(true);
      mockAuthRepo.findActiveRefreshTokens.mockResolvedValue([validToken]);
      mockAuthRepo.findRefreshTokenByToken.mockResolvedValue(null);

      await expect(authService.refreshAccessToken("token")).rejects.toThrow("Token not found");
    });

    it("should detect token reuse and revoke family", async () => {
      const reusedToken = {
        ...validToken,
        replacedBy: "another-token-id",
      };

      vi.mocked(cryptoUtil.compareToken).mockResolvedValue(true);
      mockAuthRepo.findActiveRefreshTokens.mockResolvedValue([reusedToken]);
      mockAuthRepo.findRefreshTokenByToken.mockResolvedValue(reusedToken);

      await expect(authService.refreshAccessToken("reused-token")).rejects.toThrow(
        "Token reuse detected",
      );

      expect(mockAuthRepo.revokeTokenFamily).toHaveBeenCalledWith(
        "family-123",
        "Token reuse detected - potential security breach",
      );
    });

    it("should include metadata in new token", async () => {
      vi.mocked(cryptoUtil.compareToken).mockResolvedValue(true);
      mockAuthRepo.findActiveRefreshTokens.mockResolvedValue([validToken]);
      mockAuthRepo.findRefreshTokenByToken.mockResolvedValue(validToken);
      mockAuthRepo.createRefreshToken.mockResolvedValue({
        ...validToken,
        id: "new-token-id",
      });

      const metadata = {
        userAgent: "Mozilla/5.0",
        ipAddress: "192.168.1.1",
      };

      await authService.refreshAccessToken("token", metadata);

      expect(mockAuthRepo.createRefreshToken).toHaveBeenCalledWith(
        expect.objectContaining({
          userAgent: metadata.userAgent,
          ipAddress: metadata.ipAddress,
        }),
      );
    });

    it("should throw error when token id is missing", async () => {
      const tokenWithoutId = {
        ...validToken,
        id: undefined,
      };

      vi.mocked(cryptoUtil.compareToken).mockResolvedValue(true);
      mockAuthRepo.findActiveRefreshTokens.mockResolvedValue([validToken]);
      mockAuthRepo.findRefreshTokenByToken.mockResolvedValue(tokenWithoutId as any);
      mockAuthRepo.createRefreshToken.mockResolvedValue({
        ...validToken,
        id: "new-token-id",
      });

      await expect(authService.refreshAccessToken("token")).rejects.toThrow(
        "Missing refresh token id for rotation",
      );
    });
  });

  describe("revokeRefreshToken", () => {
    const validToken: RefreshTokenData = {
      id: "token-id",
      userId: "user-123",
      token: "hashed-token",
      family: "family-123",
      expiresAt: new Date(Date.now() + 1000000),
      createdAt: new Date(),
      revokedAt: null,
      replacedBy: null,
      userAgent: null,
      ipAddress: null,
      revokedReason: null,
    };

    it("should revoke valid refresh token", async () => {
      vi.mocked(cryptoUtil.compareToken).mockResolvedValue(true);
      mockAuthRepo.findActiveRefreshTokens.mockResolvedValue([validToken]);

      await authService.revokeRefreshToken("refresh-token");

      expect(mockAuthRepo.revokeRefreshToken).toHaveBeenCalledWith("token-id", "User logout");
    });

    it("should throw error for non-existent token", async () => {
      vi.mocked(cryptoUtil.compareToken).mockResolvedValue(false);
      mockAuthRepo.findActiveRefreshTokens.mockResolvedValue([validToken]);

      await expect(authService.revokeRefreshToken("invalid-token")).rejects.toThrow(
        "Refresh token not found",
      );
    });

    it("should throw error when token has no id", async () => {
      const tokenWithoutId = {
        ...validToken,
        id: undefined,
      };

      vi.mocked(cryptoUtil.compareToken).mockResolvedValue(true);
      mockAuthRepo.findActiveRefreshTokens.mockResolvedValue([tokenWithoutId as any]);

      await expect(authService.revokeRefreshToken("token")).rejects.toThrow(
        "Missing token id for revocation",
      );
    });

    it("should find correct token among multiple tokens", async () => {
      const token1 = { ...validToken, id: "token-1", token: "hash-1" };
      const token2 = { ...validToken, id: "token-2", token: "hash-2" };
      const token3 = { ...validToken, id: "token-3", token: "hash-3" };

      vi.mocked(cryptoUtil.compareToken)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      mockAuthRepo.findActiveRefreshTokens.mockResolvedValue([token1, token2, token3]);

      await authService.revokeRefreshToken("token-to-revoke");

      expect(mockAuthRepo.revokeRefreshToken).toHaveBeenCalledWith("token-2", "User logout");
    });
  });

  describe("revokeAllUserTokens", () => {
    it("should revoke all user tokens", async () => {
      const tokens: RefreshTokenData[] = [
        {
          id: "token-1",
          userId: "user-123",
          token: "hash-1",
          family: "family-1",
          expiresAt: new Date(),
          createdAt: new Date(),
          revokedAt: null,
          replacedBy: null,
          userAgent: null,
          ipAddress: null,
          revokedReason: null,
        },
        {
          id: "token-2",
          userId: "user-123",
          token: "hash-2",
          family: "family-2",
          expiresAt: new Date(),
          createdAt: new Date(),
          revokedAt: null,
          replacedBy: null,
          userAgent: null,
          ipAddress: null,
          revokedReason: null,
        },
      ];

      mockAuthRepo.findRefreshTokensByUserId.mockResolvedValue(tokens);
      mockAuthRepo.revokeRefreshToken.mockResolvedValue(true);

      const count = await authService.revokeAllUserTokens("user-123");

      expect(count).toBe(2);
      expect(mockAuthRepo.revokeRefreshToken).toHaveBeenCalledTimes(2);
    });

    it("should handle empty token list", async () => {
      mockAuthRepo.findRefreshTokensByUserId.mockResolvedValue([]);

      const count = await authService.revokeAllUserTokens("user-123");

      expect(count).toBe(0);
      expect(mockAuthRepo.revokeRefreshToken).not.toHaveBeenCalled();
    });

    it("should skip tokens without id", async () => {
      const tokens: RefreshTokenData[] = [
        {
          id: undefined as any,
          userId: "user-123",
          token: "hash-1",
          family: "family-1",
          expiresAt: new Date(),
          createdAt: new Date(),
          revokedAt: null,
          replacedBy: null,
          userAgent: null,
          ipAddress: null,
          revokedReason: null,
        },
        {
          id: "token-2",
          userId: "user-123",
          token: "hash-2",
          family: "family-2",
          expiresAt: new Date(),
          createdAt: new Date(),
          revokedAt: null,
          replacedBy: null,
          userAgent: null,
          ipAddress: null,
          revokedReason: null,
        },
      ];

      mockAuthRepo.findRefreshTokensByUserId.mockResolvedValue(tokens);
      mockAuthRepo.revokeRefreshToken.mockResolvedValue(true);

      const count = await authService.revokeAllUserTokens("user-123");

      expect(count).toBe(1);
      expect(mockAuthRepo.revokeRefreshToken).toHaveBeenCalledTimes(1);
    });

    it("should count only successful revocations", async () => {
      const tokens: RefreshTokenData[] = [
        {
          id: "token-1",
          userId: "user-123",
          token: "hash-1",
          family: "family-1",
          expiresAt: new Date(),
          createdAt: new Date(),
          revokedAt: null,
          replacedBy: null,
          userAgent: null,
          ipAddress: null,
          revokedReason: null,
        },
        {
          id: "token-2",
          userId: "user-123",
          token: "hash-2",
          family: "family-2",
          expiresAt: new Date(),
          createdAt: new Date(),
          revokedAt: null,
          replacedBy: null,
          userAgent: null,
          ipAddress: null,
          revokedReason: null,
        },
      ];

      mockAuthRepo.findRefreshTokensByUserId.mockResolvedValue(tokens);
      mockAuthRepo.revokeRefreshToken
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      const count = await authService.revokeAllUserTokens("user-123");

      expect(count).toBe(1);
    });
  });

  describe("verifyAccessToken", () => {
    it("should verify and return JWT payload", () => {
      const payload = {
        sub: "user-123",
        email: "test@example.com",
        role: "USER" as const,
        iat: 1234567890,
        exp: 1234567890,
      };

      mockTokenService.verifyAccessToken.mockReturnValue(payload);

      const result = authService.verifyAccessToken("access-token");

      expect(result).toEqual(payload);
      expect(mockTokenService.verifyAccessToken).toHaveBeenCalledWith("access-token");
    });
  });

  describe("cleanupExpiredTokens", () => {
    it("should cleanup expired tokens and sessions", async () => {
      mockAuthRepo.cleanupExpiredTokens.mockResolvedValue();
      mockAuthRepo.cleanupExpiredSessions.mockResolvedValue();

      await authService.cleanupExpiredTokens();

      expect(mockAuthRepo.cleanupExpiredTokens).toHaveBeenCalled();
      expect(mockAuthRepo.cleanupExpiredSessions).toHaveBeenCalled();
    });
  });
});
