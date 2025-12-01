import { injectable, inject } from "inversify";
import type { IUserRepo } from "@/repositories/userRepo";
import type { IAuthRepo } from "@/repositories/authRepo";
import { AuthService } from "@/services/auth.service";
import TYPES from "@/constants/identifiers";
import type { Logger } from "@/config/logger.config";
import container from "@/config/inversify.config";
import { OAuthProvider } from "@prisma/client";

const logger = container.get<Logger>(TYPES.Logger);

export interface OAuthUserData {
  provider: "GOOGLE" | "MICROSOFT" | "APPLE";
  providerAccountId: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  picture?: string;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
}

export interface OAuthResult {
  user: {
    id: string;
    email: string;
    name?: string;
    role: "USER" | "ADMIN";
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  isNewUser: boolean;
}

@injectable()
export class OAuthService {
  constructor(
    @inject(TYPES.IUserRepo) private userRepo: IUserRepo,
    @inject(TYPES.AuthRepo) private authRepo: IAuthRepo,
    @inject(AuthService) private authService: AuthService,
  ) {}

  /**
   * Handle OAuth authentication
   * Creates user if doesn't exist, links OAuth account, generates tokens
   */
  async handleOAuthAuthentication(
    oauthData: OAuthUserData,
    metadata?: { userAgent?: string; ipAddress?: string },
  ): Promise<OAuthResult> {
    // Check if OAuth account already exists
    const existingOAuthAccount = await this.authRepo.findOAuthAccount(
      OAuthProvider[oauthData.provider],
      oauthData.providerAccountId,
    );

    if (existingOAuthAccount) {
      // User already authenticated with this provider before
      return await this.handleExistingOAuthAccount(
        existingOAuthAccount,
        oauthData,
        metadata,
      );
    }

    // Check if user exists with this email
    const existingUser = await this.userRepo.getUserById(oauthData.email);

    if (existingUser) {
      // User exists with email, link OAuth account
      return await this.linkOAuthAccount(existingUser, oauthData, metadata);
    }

    // New user - create account
    return await this.createUserWithOAuth(oauthData, metadata);
  }

  /**
   * Handle existing OAuth account (user returning)
   */
  private async handleExistingOAuthAccount(
    oauthAccount: any,
    oauthData: OAuthUserData,
    metadata?: { userAgent?: string; ipAddress?: string },
  ): Promise<OAuthResult> {
    logger.info(`Existing OAuth account found: ${oauthAccount.userId}`);

    // Get user details
    const user = await this.userRepo.getUserByIdSafely(oauthAccount.userId);

    if (!user) {
      throw new Error("User not found for OAuth account");
    }

    // Update OAuth account tokens if provided
    if (oauthData.accessToken || oauthData.refreshToken) {
      await this.authRepo.updateOAuthAccount(oauthAccount.id, {
        accessToken: oauthData.accessToken,
        refreshToken: oauthData.refreshToken,
        idToken: oauthData.idToken,
      });
    }

    // Generate app tokens
    const tokens = await this.authService.generateTokenPair(
      {
        id: user.id,
        email: user.username,
        name: user.name,
        role: user.role,
      },
      metadata,
    );

    return {
      user: {
        id: user.id,
        email: user.username,
        name: user.name,
        role: user.role,
      },
      tokens,
      isNewUser: false,
    };
  }

  /**
   * Link OAuth account to existing user
   */
  private async linkOAuthAccount(
    existingUser: any,
    oauthData: OAuthUserData,
    metadata?: { userAgent?: string; ipAddress?: string },
  ): Promise<OAuthResult> {
    logger.info(
      `Linking ${oauthData.provider} account to existing user: ${existingUser.id}`,
    );

    // Create OAuth account link
    await this.authRepo.createOAuthAccount({
      userId: existingUser.id,
      provider: OAuthProvider[oauthData.provider],
      providerAccountId: oauthData.providerAccountId,
      accessToken: oauthData.accessToken,
      refreshToken: oauthData.refreshToken,
      idToken: oauthData.idToken,
    });

    // Update user's emailVerified if OAuth provider confirms it
    // This is handled in user update if needed

    // Generate app tokens
    const tokens = await this.authService.generateTokenPair(
      {
        id: existingUser.id,
        email: existingUser.username,
        name: existingUser.name,
        role: existingUser.role,
      },
      metadata,
    );

    return {
      user: {
        id: existingUser.id,
        email: existingUser.username,
        name: existingUser.name,
        role: existingUser.role,
      },
      tokens,
      isNewUser: false,
    };
  }

  /**
   * Create new user with OAuth account
   */
  private async createUserWithOAuth(
    oauthData: OAuthUserData,
    metadata?: { userAgent?: string; ipAddress?: string },
  ): Promise<OAuthResult> {
    logger.info(
      `Creating new user with ${oauthData.provider}: ${oauthData.email}`,
    );

    // Create user
    const user = await this.userRepo.createUser({
      username: oauthData.email,
      name: oauthData.name || oauthData.email.split("@")[0],
      // No password for OAuth users
    });

    // Create OAuth account link
    await this.authRepo.createOAuthAccount({
      userId: user.id,
      provider: OAuthProvider[oauthData.provider],
      providerAccountId: oauthData.providerAccountId,
      accessToken: oauthData.accessToken,
      refreshToken: oauthData.refreshToken,
      idToken: oauthData.idToken,
    });

    // Generate app tokens
    const tokens = await this.authService.generateTokenPair(
      {
        id: user.id,
        email: user.username,
        name: user.name,
        role: user.role,
      },
      metadata,
    );

    return {
      user: {
        id: user.id,
        email: user.username,
        name: user.name,
        role: user.role,
      },
      tokens,
      isNewUser: true,
    };
  }

  /**
   * Link additional OAuth provider to authenticated user
   */
  async linkProviderToUser(
    userId: string,
    oauthData: OAuthUserData,
  ): Promise<void> {
    logger.info(`Linking ${oauthData.provider} to user: ${userId}`);

    // Check if this provider is already linked
    const existingLink = await this.authRepo.findOAuthAccount(
      OAuthProvider[oauthData.provider],
      oauthData.providerAccountId,
    );

    if (existingLink) {
      if (existingLink.userId === userId) {
        throw new Error("This provider is already linked to your account");
      } else {
        throw new Error(
          "This provider is already linked to a different account",
        );
      }
    }

    // Create OAuth account link
    await this.authRepo.createOAuthAccount({
      userId,
      provider: OAuthProvider[oauthData.provider],
      providerAccountId: oauthData.providerAccountId,
      accessToken: oauthData.accessToken,
      refreshToken: oauthData.refreshToken,
      idToken: oauthData.idToken,
    });

    logger.info(`Successfully linked ${oauthData.provider} to user: ${userId}`);
  }

  /**
   * Get all linked OAuth accounts for a user
   */
  async getUserOAuthAccounts(userId: string) {
    return await this.authRepo.findOAuthAccountsByUserId(userId);
  }

  /**
   * Unlink OAuth provider from user
   */
  async unlinkProvider(userId: string, provider: OAuthProvider): Promise<void> {
    const accounts = await this.authRepo.findOAuthAccountsByUserId(userId);
    const accountToRemove = accounts.find((acc) => acc.provider === provider);

    if (!accountToRemove) {
      throw new Error("Provider not linked to this account");
    }

    // Make sure user has at least one way to login
    // Either password or another OAuth provider
    if (accounts.length === 1) {
      // Check if user has password
      const user = await this.userRepo.getUserByIdSafely(userId);
      // Note: We'd need to check if user has passwordHash
      // For now, prevent unlinking if it's the only method
      throw new Error(
        "Cannot unlink the only authentication method. Please set a password first.",
      );
    }

    await this.authRepo.deleteOAuthAccount(accountToRemove.id!);
    logger.info(`Unlinked ${provider} from user: ${userId}`);
  }
}
