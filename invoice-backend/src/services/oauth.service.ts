import { injectable, inject } from "inversify";
import type { IUserRepo } from "@/repositories/userRepo";
import type { IAuthRepo } from "@/repositories/authRepo";
import { AuthService } from "@/services/auth.service";
import TYPES from "@/constants/identifiers";
import type { Logger } from "@/config/logger.config";
import { OAuthProvider } from "@prisma/client";
import type { OAuthAccountData } from "@/repositories/authRepo";
import type { UserIdAndRole } from "@/constants/types";

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
    @inject(TYPES.Logger) private logger: Logger,
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
    const existingUser = await this.userRepo.getUserByUsername(oauthData.email);

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
    oauthAccount: OAuthAccountData,
    oauthData: OAuthUserData,
    metadata?: { userAgent?: string; ipAddress?: string },
  ): Promise<OAuthResult> {
    this.logger.info(`Existing OAuth account found: ${oauthAccount.userId}`);

    // Get user details
    const user = await this.userRepo.getUserByIdSafely(oauthAccount.userId);

    if (!user) {
      throw new Error("User not found for OAuth account");
    }

    // Update OAuth account tokens if provided
    if ((oauthData.accessToken || oauthData.refreshToken) && oauthAccount.id) {
      const updateData: Partial<OAuthAccountData> = {};
      if (oauthData.accessToken !== undefined) {
        updateData.accessToken = oauthData.accessToken;
      }
      if (oauthData.refreshToken !== undefined) {
        updateData.refreshToken = oauthData.refreshToken;
      }
      if (oauthData.idToken !== undefined) {
        updateData.idToken = oauthData.idToken;
      }
      await this.authRepo.updateOAuthAccount(oauthAccount.id, updateData);
    }

    // Generate app tokens
    if (!user.username || !user.role) {
      throw new Error("User missing required fields (username or role)");
    }

    const tokenPayload: {
      id: string;
      email: string;
      name?: string;
      role: "USER" | "ADMIN";
    } = {
      id: user.id,
      email: user.username,
      role: user.role,
    };
    if (user.name !== undefined) {
      tokenPayload.name = user.name;
    }

    const tokens = await this.authService.generateTokenPair(
      tokenPayload,
      metadata,
    );

    const userResult: {
      id: string;
      email: string;
      name?: string;
      role: "USER" | "ADMIN";
    } = {
      id: user.id,
      email: user.username,
      role: user.role,
    };
    if (user.name !== undefined) {
      userResult.name = user.name;
    }

    return {
      user: userResult,
      tokens,
      isNewUser: false,
    };
  }

  /**
   * Link OAuth account to existing user
   */
  private async linkOAuthAccount(
    existingUser: UserIdAndRole,
    oauthData: OAuthUserData,
    metadata?: { userAgent?: string; ipAddress?: string },
  ): Promise<OAuthResult> {
    this.logger.info(
      `Linking ${oauthData.provider} account to existing user: ${existingUser.id}`,
    );

    // Create OAuth account link
    const oauthAccountData: OAuthAccountData = {
      userId: existingUser.id,
      provider: OAuthProvider[oauthData.provider],
      providerAccountId: oauthData.providerAccountId,
    };
    if (oauthData.accessToken !== undefined) {
      oauthAccountData.accessToken = oauthData.accessToken;
    }
    if (oauthData.refreshToken !== undefined) {
      oauthAccountData.refreshToken = oauthData.refreshToken;
    }
    if (oauthData.idToken !== undefined) {
      oauthAccountData.idToken = oauthData.idToken;
    }
    await this.authRepo.createOAuthAccount(oauthAccountData);

    // Update user's emailVerified if OAuth provider confirms it
    // This is handled in user update if needed

    // Generate app tokens
    if (!existingUser.username || !existingUser.role) {
      throw new Error("User missing required fields (username or role)");
    }

    const tokenPayload: {
      id: string;
      email: string;
      name?: string;
      role: "USER" | "ADMIN";
    } = {
      id: existingUser.id,
      email: existingUser.username,
      role: existingUser.role,
    };
    if (existingUser.name !== undefined) {
      tokenPayload.name = existingUser.name;
    }

    const tokens = await this.authService.generateTokenPair(
      tokenPayload,
      metadata,
    );

    const userResult: {
      id: string;
      email: string;
      name?: string;
      role: "USER" | "ADMIN";
    } = {
      id: existingUser.id,
      email: existingUser.username,
      role: existingUser.role,
    };
    if (existingUser.name !== undefined) {
      userResult.name = existingUser.name;
    }

    return {
      user: userResult,
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
    this.logger.info(
      `Creating new user with ${oauthData.provider}: ${oauthData.email}`,
    );

    // Create user (OAuth users don't have passwords, so we need to pass empty string)
    const user = await this.userRepo.createUser({
      username: oauthData.email,
      name: oauthData.name || oauthData.email.split("@")[0] || oauthData.email,
      passwordHash: "", // OAuth users don't have password
    });

    // Create OAuth account link
    const oauthAccountData: OAuthAccountData = {
      userId: user.id,
      provider: OAuthProvider[oauthData.provider],
      providerAccountId: oauthData.providerAccountId,
    };
    if (oauthData.accessToken !== undefined) {
      oauthAccountData.accessToken = oauthData.accessToken;
    }
    if (oauthData.refreshToken !== undefined) {
      oauthAccountData.refreshToken = oauthData.refreshToken;
    }
    if (oauthData.idToken !== undefined) {
      oauthAccountData.idToken = oauthData.idToken;
    }
    await this.authRepo.createOAuthAccount(oauthAccountData);

    // Generate app tokens
    if (!user.username || !user.role) {
      throw new Error("User missing required fields (username or role)");
    }

    const tokenPayload: {
      id: string;
      email: string;
      name?: string;
      role: "USER" | "ADMIN";
    } = {
      id: user.id,
      email: user.username,
      role: user.role,
    };
    if (user.name !== undefined) {
      tokenPayload.name = user.name;
    }

    const tokens = await this.authService.generateTokenPair(
      tokenPayload,
      metadata,
    );

    const userResult: {
      id: string;
      email: string;
      name?: string;
      role: "USER" | "ADMIN";
    } = {
      id: user.id,
      email: user.username,
      role: user.role,
    };
    if (user.name !== undefined) {
      userResult.name = user.name;
    }

    return {
      user: userResult,
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
    this.logger.info(`Linking ${oauthData.provider} to user: ${userId}`);

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
    const oauthAccountData: OAuthAccountData = {
      userId,
      provider: OAuthProvider[oauthData.provider],
      providerAccountId: oauthData.providerAccountId,
    };
    if (oauthData.accessToken !== undefined) {
      oauthAccountData.accessToken = oauthData.accessToken;
    }
    if (oauthData.refreshToken !== undefined) {
      oauthAccountData.refreshToken = oauthData.refreshToken;
    }
    if (oauthData.idToken !== undefined) {
      oauthAccountData.idToken = oauthData.idToken;
    }
    await this.authRepo.createOAuthAccount(oauthAccountData);

    this.logger.info(`Successfully linked ${oauthData.provider} to user: ${userId}`);
  }

  /**
   * Get all linked OAuth accounts for a user
   */
  async getUserOAuthAccounts(userId: string): Promise<OAuthAccountData[]> {
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
      throw new Error(
        "Cannot unlink the only authentication method. Please set a password first.",
      );
    }

    if (!accountToRemove.id) {
      throw new Error("OAuth account id missing; cannot unlink provider");
    }

    await this.authRepo.deleteOAuthAccount(accountToRemove.id);
    this.logger.info(`Unlinked ${provider} from user: ${userId}`);
  }
}
