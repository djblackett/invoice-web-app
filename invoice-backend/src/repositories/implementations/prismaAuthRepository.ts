import { injectable, inject } from "inversify";
import type { PrismaClient, OAuthProvider } from "@prisma/client";
import { TYPES } from "@/constants/types";
import type {
  IAuthRepo,
  OAuthAccountData,
  RefreshTokenData,
  SessionData,
} from "@/repositories/authRepo";

@injectable()
export class PrismaAuthRepository implements IAuthRepo {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  // OAuth Accounts
  async createOAuthAccount(data: OAuthAccountData): Promise<OAuthAccountData> {
    const account = await this.prisma.oAuthAccount.create({
      data: {
        userId: data.userId,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        scope: data.scope,
        idToken: data.idToken,
      },
    });

    return this.mapOAuthAccount(account);
  }

  async findOAuthAccount(
    provider: OAuthProvider,
    providerAccountId: string
  ): Promise<OAuthAccountData | null> {
    const account = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
    });

    return account ? this.mapOAuthAccount(account) : null;
  }

  async findOAuthAccountsByUserId(
    userId: string
  ): Promise<OAuthAccountData[]> {
    const accounts = await this.prisma.oAuthAccount.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return accounts.map((account) => this.mapOAuthAccount(account));
  }

  async updateOAuthAccount(
    id: string,
    data: Partial<OAuthAccountData>
  ): Promise<OAuthAccountData> {
    const account = await this.prisma.oAuthAccount.update({
      where: { id },
      data: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        scope: data.scope,
        idToken: data.idToken,
      },
    });

    return this.mapOAuthAccount(account);
  }

  async deleteOAuthAccount(id: string): Promise<boolean> {
    try {
      await this.prisma.oAuthAccount.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  // Refresh Tokens
  async createRefreshToken(data: RefreshTokenData): Promise<RefreshTokenData> {
    const token = await this.prisma.refreshToken.create({
      data: {
        userId: data.userId,
        token: data.token, // Should already be hashed
        family: data.family,
        expiresAt: data.expiresAt,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
      },
    });

    return this.mapRefreshToken(token);
  }

  async findRefreshTokenByToken(
    token: string
  ): Promise<RefreshTokenData | null> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    return refreshToken ? this.mapRefreshToken(refreshToken) : null;
  }

  async findRefreshTokensByUserId(
    userId: string
  ): Promise<RefreshTokenData[]> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    return tokens.map((token) => this.mapRefreshToken(token));
  }

  async findRefreshTokensByFamily(
    family: string
  ): Promise<RefreshTokenData[]> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { family },
      orderBy: { createdAt: "desc" },
    });

    return tokens.map((token) => this.mapRefreshToken(token));
  }

  async revokeRefreshToken(
    id: string,
    reason: string,
    replacedBy?: string
  ): Promise<boolean> {
    try {
      await this.prisma.refreshToken.update({
        where: { id },
        data: {
          isRevoked: true,
          revokedAt: new Date(),
          revokedReason: reason,
          replacedBy,
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async revokeTokenFamily(family: string, reason: string): Promise<number> {
    const result = await this.prisma.refreshToken.updateMany({
      where: {
        family,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });

    return result.count;
  }

  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return result.count;
  }

  // Sessions
  async createSession(data: SessionData): Promise<SessionData> {
    const session = await this.prisma.session.create({
      data: {
        userId: data.userId,
        refreshTokenId: data.refreshTokenId,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        expiresAt: data.expiresAt,
      },
    });

    return this.mapSession(session);
  }

  async findSessionByRefreshTokenId(
    refreshTokenId: string
  ): Promise<SessionData | null> {
    const session = await this.prisma.session.findUnique({
      where: { refreshTokenId },
    });

    return session ? this.mapSession(session) : null;
  }

  async findSessionsByUserId(userId: string): Promise<SessionData[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      orderBy: { lastActive: "desc" },
    });

    return sessions.map((session) => this.mapSession(session));
  }

  async updateSessionActivity(id: string): Promise<boolean> {
    try {
      await this.prisma.session.update({
        where: { id },
        data: {
          lastActive: new Date(),
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteSession(id: string): Promise<boolean> {
    try {
      await this.prisma.session.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteSessionsByUserId(userId: string): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: { userId },
    });

    return result.count;
  }

  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return result.count;
  }

  // Helper mappers
  private mapOAuthAccount(account: any): OAuthAccountData {
    return {
      id: account.id,
      userId: account.userId,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      accessToken: account.accessToken ?? undefined,
      refreshToken: account.refreshToken ?? undefined,
      expiresAt: account.expiresAt ?? undefined,
      scope: account.scope ?? undefined,
      idToken: account.idToken ?? undefined,
    };
  }

  private mapRefreshToken(token: any): RefreshTokenData {
    return {
      id: token.id,
      userId: token.userId,
      token: token.token,
      family: token.family,
      expiresAt: token.expiresAt,
      userAgent: token.userAgent ?? undefined,
      ipAddress: token.ipAddress ?? undefined,
    };
  }

  private mapSession(session: any): SessionData {
    return {
      id: session.id,
      userId: session.userId,
      refreshTokenId: session.refreshTokenId,
      userAgent: session.userAgent ?? undefined,
      ipAddress: session.ipAddress ?? undefined,
      expiresAt: session.expiresAt,
    };
  }
}
