import type { OAuthProvider } from "@prisma/client";

export interface OAuthAccountData {
  id?: string;
  userId: string;
  provider: OAuthProvider;
  providerAccountId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  scope?: string;
  idToken?: string;
}

export interface RefreshTokenData {
  id?: string;
  userId: string;
  token: string; // Will be hashed before storage
  family: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface SessionData {
  id?: string;
  userId: string;
  refreshTokenId: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
}

export interface IAuthRepo {
  // OAuth Accounts
  createOAuthAccount: (data: OAuthAccountData) => Promise<OAuthAccountData>;
  findOAuthAccount: (
    provider: OAuthProvider,
    providerAccountId: string,
  ) => Promise<OAuthAccountData | null>;
  findOAuthAccountsByUserId: (userId: string) => Promise<OAuthAccountData[]>;
  updateOAuthAccount: (
    id: string,
    data: Partial<OAuthAccountData>,
  ) => Promise<OAuthAccountData>;
  deleteOAuthAccount: (id: string) => Promise<boolean>;

  // Refresh Tokens
  createRefreshToken: (data: RefreshTokenData) => Promise<RefreshTokenData>;
  findRefreshTokenByToken: (token: string) => Promise<RefreshTokenData | null>;
  findRefreshTokensByUserId: (userId: string) => Promise<RefreshTokenData[]>;
  findRefreshTokensByFamily: (family: string) => Promise<RefreshTokenData[]>;
  findActiveRefreshTokens: () => Promise<RefreshTokenData[]>;
  revokeRefreshToken: (
    id: string,
    reason: string,
    replacedBy?: string,
  ) => Promise<boolean>;
  revokeTokenFamily: (family: string, reason: string) => Promise<number>;
  cleanupExpiredTokens: () => Promise<number>;

  // Sessions
  createSession: (data: SessionData) => Promise<SessionData>;
  findSessionByRefreshTokenId: (
    refreshTokenId: string,
  ) => Promise<SessionData | null>;
  findSessionsByUserId: (userId: string) => Promise<SessionData[]>;
  updateSessionActivity: (id: string) => Promise<boolean>;
  deleteSession: (id: string) => Promise<boolean>;
  deleteSessionsByUserId: (userId: string) => Promise<number>;
  cleanupExpiredSessions: () => Promise<number>;
}
