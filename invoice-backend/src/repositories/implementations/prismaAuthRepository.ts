import { injectable, inject } from "inversify";
import type {
  OAuthAccount,
  OAuthProvider,
  PrismaClient,
  RefreshToken,
  Session,
} from "@prisma/client";
import TYPES from "@/constants/identifiers";
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
    const createData: {
      userId: string;
      provider: OAuthProvider;
      providerAccountId: string;
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: Date;
      scope?: string;
      idToken?: string;
    } = {
      userId: data.userId,
      provider: data.provider,
      providerAccountId: data.providerAccountId,
    };
    if (data.accessToken !== undefined) {
      createData.accessToken = data.accessToken;
    }
    if (data.refreshToken !== undefined) {
      createData.refreshToken = data.refreshToken;
    }
    if (data.expiresAt !== undefined) {
      createData.expiresAt = data.expiresAt;
    }
    if (data.scope !== undefined) {
      createData.scope = data.scope;
    }
    if (data.idToken !== undefined) {
      createData.idToken = data.idToken;
    }

    const account = await this.prisma.oAuthAccount.create({
      data: createData,
    });

    return this.mapOAuthAccount(account);
  }

  async findOAuthAccount(
    provider: OAuthProvider,
    providerAccountId: string,
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

  async findOAuthAccountsByUserId(userId: string): Promise<OAuthAccountData[]> {
    const accounts = await this.prisma.oAuthAccount.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return accounts.map((account) => this.mapOAuthAccount(account));
  }

  async updateOAuthAccount(
    id: string,
    data: Partial<OAuthAccountData>,
  ): Promise<OAuthAccountData> {
    const updateData: {
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: Date;
      scope?: string;
      idToken?: string;
    } = {};
    if (data.accessToken !== undefined) {
      updateData.accessToken = data.accessToken;
    }
    if (data.refreshToken !== undefined) {
      updateData.refreshToken = data.refreshToken;
    }
    if (data.expiresAt !== undefined) {
      updateData.expiresAt = data.expiresAt;
    }
    if (data.scope !== undefined) {
      updateData.scope = data.scope;
    }
    if (data.idToken !== undefined) {
      updateData.idToken = data.idToken;
    }

    const account = await this.prisma.oAuthAccount.update({
      where: { id },
      data: updateData,
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
    const createData: {
      userId: string;
      token: string;
      family: string;
      expiresAt: Date;
      userAgent?: string;
      ipAddress?: string;
    } = {
      userId: data.userId,
      token: data.token, // Should already be hashed
      family: data.family,
      expiresAt: data.expiresAt,
    };
    if (data.userAgent !== undefined) {
      createData.userAgent = data.userAgent;
    }
    if (data.ipAddress !== undefined) {
      createData.ipAddress = data.ipAddress;
    }

    const token = await this.prisma.refreshToken.create({
      data: createData,
    });

    return this.mapRefreshToken(token);
  }

  async findRefreshTokenByToken(
    token: string,
  ): Promise<RefreshTokenData | null> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    return refreshToken ? this.mapRefreshToken(refreshToken) : null;
  }

  async findRefreshTokensByUserId(userId: string): Promise<RefreshTokenData[]> {
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

  async findRefreshTokensByFamily(family: string): Promise<RefreshTokenData[]> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { family },
      orderBy: { createdAt: "desc" },
    });

    return tokens.map((token) => this.mapRefreshToken(token));
  }

  async findActiveRefreshTokens(): Promise<RefreshTokenData[]> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    return tokens.map((token) => this.mapRefreshToken(token));
  }

  async revokeRefreshToken(
    id: string,
    reason: string,
    replacedBy?: string,
  ): Promise<boolean> {
    try {
      const updateData: {
        isRevoked: boolean;
        revokedAt: Date;
        revokedReason: string;
        replacedBy?: string;
      } = {
        isRevoked: true,
        revokedAt: new Date(),
        revokedReason: reason,
      };
      if (replacedBy !== undefined) {
        updateData.replacedBy = replacedBy;
      }

      await this.prisma.refreshToken.update({
        where: { id },
        data: updateData,
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
    const createData: {
      userId: string;
      refreshTokenId: string;
      expiresAt: Date;
      userAgent?: string;
      ipAddress?: string;
    } = {
      userId: data.userId,
      refreshTokenId: data.refreshTokenId,
      expiresAt: data.expiresAt,
    };
    if (data.userAgent !== undefined) {
      createData.userAgent = data.userAgent;
    }
    if (data.ipAddress !== undefined) {
      createData.ipAddress = data.ipAddress;
    }

    const session = await this.prisma.session.create({
      data: createData,
    });

    return this.mapSession(session);
  }

  async findSessionByRefreshTokenId(
    refreshTokenId: string,
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
  private mapOAuthAccount(account: OAuthAccount): OAuthAccountData {
    const data: OAuthAccountData = {
      id: account.id,
      userId: account.userId,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
    if (account.accessToken !== null) {
      data.accessToken = account.accessToken;
    }
    if (account.refreshToken !== null) {
      data.refreshToken = account.refreshToken;
    }
    if (account.expiresAt !== null) {
      data.expiresAt = account.expiresAt;
    }
    if (account.scope !== null) {
      data.scope = account.scope;
    }
    if (account.idToken !== null) {
      data.idToken = account.idToken;
    }
    return data;
  }

  private mapRefreshToken(token: RefreshToken): RefreshTokenData {
    const data: RefreshTokenData = {
      id: token.id,
      userId: token.userId,
      token: token.token,
      family: token.family,
      expiresAt: token.expiresAt,
    };
    if (token.userAgent !== null) {
      data.userAgent = token.userAgent;
    }
    if (token.ipAddress !== null) {
      data.ipAddress = token.ipAddress;
    }
    return data;
  }

  private mapSession(session: Session): SessionData {
    const data: SessionData = {
      id: session.id,
      userId: session.userId,
      refreshTokenId: session.refreshTokenId,
      expiresAt: session.expiresAt,
    };
    if (session.userAgent !== null) {
      data.userAgent = session.userAgent;
    }
    if (session.ipAddress !== null) {
      data.ipAddress = session.ipAddress;
    }
    return data;
  }
}
