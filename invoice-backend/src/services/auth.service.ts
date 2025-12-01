import { injectable, inject } from "inversify";
import type { IAuthRepo } from "@/repositories/authRepo";
import { TokenService, type JWTPayload } from "@/services/token.service";
import {
  generateSecureToken,
  generateTokenFamily,
  hashToken,
  compareToken,
} from "@/utils/crypto.util";
import { TYPES } from "@/constants/types";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Access token expiry in seconds
}

export interface RefreshTokenMetadata {
  userAgent?: string;
  ipAddress?: string;
}

@injectable()
export class AuthService {
  private refreshTokenExpiry: number;

  constructor(
    @inject(TYPES.AuthRepo) private authRepo: IAuthRepo,
    @inject(TokenService) private tokenService: TokenService
  ) {
    // Parse refresh token expiry (e.g., "30d" -> 30 days in milliseconds)
    const expiryString = process.env.JWT_REFRESH_TOKEN_EXPIRY || "30d";
    this.refreshTokenExpiry = this.parseExpiry(expiryString);
  }

  /**
   * Parse expiry string (e.g., "30d", "7d", "1h") to milliseconds
   */
  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([dhm])$/);
    if (!match) {
      throw new Error(`Invalid expiry format: ${expiry}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case "d":
        return value * 24 * 60 * 60 * 1000; // days
      case "h":
        return value * 60 * 60 * 1000; // hours
      case "m":
        return value * 60 * 1000; // minutes
      default:
        return value;
    }
  }

  /**
   * Generate a new access token + refresh token pair
   */
  async generateTokenPair(
    user: { id: string; email: string; name?: string; role: "USER" | "ADMIN" },
    metadata?: RefreshTokenMetadata
  ): Promise<TokenPair> {
    // Generate access token (JWT)
    const accessToken = this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Generate refresh token (opaque)
    const refreshToken = generateSecureToken(32);
    const tokenFamily = generateTokenFamily();
    const hashedToken = await hashToken(refreshToken);

    // Store refresh token in database
    await this.authRepo.createRefreshToken({
      userId: user.id,
      token: hashedToken,
      family: tokenFamily,
      expiresAt: new Date(Date.now() + this.refreshTokenExpiry),
      userAgent: metadata?.userAgent,
      ipAddress: metadata?.ipAddress,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes (in seconds)
    };
  }

  /**
   * Refresh access token using a refresh token
   * Implements automatic token rotation for security
   */
  async refreshAccessToken(
    refreshToken: string,
    metadata?: RefreshTokenMetadata
  ): Promise<TokenPair> {
    // Find all tokens in database to check against
    const allTokens = await this.findValidRefreshTokens();

    // Find matching token (need to compare hashes)
    let matchedToken: any = null;
    for (const token of allTokens) {
      if (await compareToken(refreshToken, token.token)) {
        matchedToken = token;
        break;
      }
    }

    if (!matchedToken) {
      throw new Error("Invalid refresh token");
    }

    // Check if token is expired
    if (new Date() > new Date(matchedToken.expiresAt)) {
      throw new Error("Refresh token expired");
    }

    // Check if token was already used (potential security breach)
    const tokenDetails = await this.authRepo.findRefreshTokenByToken(
      matchedToken.token
    );

    if (!tokenDetails) {
      throw new Error("Token not found");
    }

    if (tokenDetails.replacedBy) {
      // Token reuse detected! Revoke entire family
      await this.authRepo.revokeTokenFamily(
        matchedToken.family,
        "Token reuse detected - potential security breach"
      );
      throw new Error(
        "Token reuse detected. All tokens in this family have been revoked."
      );
    }

    // Get user details (you'll need to implement getUserById in userRepo)
    // For now, we'll need to fetch from the token's userId
    // This is a simplified version - you'd want to fetch full user details
    const user = {
      id: matchedToken.userId,
      email: "", // Fetch from user repo
      role: "USER" as const, // Fetch from user repo
    };

    // Generate new token pair
    const newRefreshToken = generateSecureToken(32);
    const hashedNewToken = await hashToken(newRefreshToken);

    // Create new refresh token with same family
    const newToken = await this.authRepo.createRefreshToken({
      userId: matchedToken.userId,
      token: hashedNewToken,
      family: matchedToken.family,
      expiresAt: new Date(Date.now() + this.refreshTokenExpiry),
      userAgent: metadata?.userAgent,
      ipAddress: metadata?.ipAddress,
    });

    // Revoke old token (mark as replaced)
    await this.authRepo.revokeRefreshToken(
      tokenDetails.id!,
      "Rotated",
      newToken.id
    );

    // Generate new access token
    // NOTE: You'll need to fetch full user details from user repository
    const accessToken = this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900, // 15 minutes
    };
  }

  /**
   * Revoke a refresh token (logout)
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const allTokens = await this.findValidRefreshTokens();

    // Find matching token
    for (const token of allTokens) {
      if (await compareToken(refreshToken, token.token)) {
        await this.authRepo.revokeRefreshToken(token.id!, "User logout");
        return;
      }
    }

    throw new Error("Refresh token not found");
  }

  /**
   * Revoke all refresh tokens for a user (logout from all devices)
   */
  async revokeAllUserTokens(userId: string): Promise<number> {
    const tokens = await this.authRepo.findRefreshTokensByUserId(userId);
    let revokedCount = 0;

    for (const token of tokens) {
      const success = await this.authRepo.revokeRefreshToken(
        token.id!,
        "User logout from all devices"
      );
      if (success) revokedCount++;
    }

    return revokedCount;
  }

  /**
   * Verify and decode an access token
   */
  verifyAccessToken(token: string): JWTPayload {
    return this.tokenService.verifyAccessToken(token);
  }

  /**
   * Clean up expired tokens (call this periodically, e.g., via cron job)
   */
  async cleanupExpiredTokens(): Promise<void> {
    await this.authRepo.cleanupExpiredTokens();
    await this.authRepo.cleanupExpiredSessions();
  }

  /**
   * Helper to find all valid (non-revoked, non-expired) refresh tokens
   * Used for token comparison during refresh
   */
  private async findValidRefreshTokens() {
    // This is a simplified approach - in production you might want to
    // implement a more efficient search strategy
    // For now, we'll just get tokens from the database directly
    // A better approach would be to index tokens by a hash prefix

    // This method needs to be implemented more efficiently
    // For now, returning empty array as placeholder
    return [];
  }
}
