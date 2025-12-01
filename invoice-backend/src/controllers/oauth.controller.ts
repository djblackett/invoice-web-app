import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import container from "@/config/inversify.config";
import { OAuthService } from "@/services/oauth.service";
import type { Logger } from "@/config/logger.config";
import TYPES from "@/constants/identifiers";
import type { OAuthUserData } from "@/services/oauth.service";

const logger = container.get<Logger>(TYPES.Logger);

/**
 * Google OAuth - Initiate authentication
 */
export function googleAuth(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
}

/**
 * Google OAuth - Callback handler
 */
export async function googleCallback(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  passport.authenticate(
    "google",
    { session: false },
    async (err: Error, user: OAuthUserData) => {
      try {
        if (err || !user) {
          logger.error(`Google OAuth error: ${err.message || "No user data"}`);
          return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
          );
        }

        const oauthService = container.get(OAuthService);

        const result = await oauthService.handleOAuthAuthentication(user, {
          userAgent: req.headers["user-agent"],
          ipAddress: req.ip,
        });

        // Set refresh token as httpOnly cookie
        res.cookie("refreshToken", result.tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        // Redirect to frontend with access token in URL (will be extracted and stored in memory)
        const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${result.tokens.accessToken}&new=${result.isNewUser}`;
        return res.redirect(redirectUrl);
      } catch (error) {
        logger.error(`Google OAuth callback error: ${error}`);
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
        );
      }
    },
  )(req, res, next);
}

/**
 * Microsoft OAuth - Initiate authentication
 */
export function microsoftAuth(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("microsoft", {
    scope: ["user.read"],
    session: false,
  })(req, res, next);
}

/**
 * Microsoft OAuth - Callback handler
 */
export async function microsoftCallback(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  passport.authenticate(
    "microsoft",
    { session: false },
    async (err: Error, user: OAuthUserData) => {
      try {
        if (err || !user) {
          logger.error(
            `Microsoft OAuth error: ${err.message || "No user data"}`,
          );
          return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
          );
        }

        const oauthService = container.get(OAuthService);

        const result = await oauthService.handleOAuthAuthentication(user, {
          userAgent: req.headers["user-agent"],
          ipAddress: req.ip,
        });

        // Set refresh token as httpOnly cookie
        res.cookie("refreshToken", result.tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${result.tokens.accessToken}&new=${result.isNewUser}`;
        return res.redirect(redirectUrl);
      } catch (error) {
        logger.error(`Microsoft OAuth callback error: ${error}`);
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
        );
      }
    },
  )(req, res, next);
}

/**
 * Apple Sign In - Initiate authentication
 */
export function appleAuth(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("apple", {
    scope: ["email", "name"],
    session: false,
  })(req, res, next);
}

/**
 * Apple Sign In - Callback handler
 */
export async function appleCallback(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  passport.authenticate(
    "apple",
    { session: false },
    async (err: Error, user: OAuthUserData) => {
      try {
        if (err || !user) {
          logger.error(`Apple Sign In error: ${err.message || "No user data"}`);
          return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
          );
        }

        const oauthService = container.get(OAuthService);

        const result = await oauthService.handleOAuthAuthentication(user, {
          userAgent: req.headers["user-agent"],
          ipAddress: req.ip,
        });

        // Set refresh token as httpOnly cookie
        res.cookie("refreshToken", result.tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${result.tokens.accessToken}&new=${result.isNewUser}`;
        return res.redirect(redirectUrl);
      } catch (error) {
        logger.error(`Apple Sign In callback error: ${error}`);
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
        );
      }
    },
  )(req, res, next);
}

/**
 * Link OAuth provider to authenticated user
 * This would be called when a logged-in user wants to link additional providers
 */
export async function linkProvider(req: Request, res: Response) {
  try {
    // This would require middleware to extract user from access token
    // For now, this is a placeholder
    const userId = (req as any).user?.id; // Would come from auth middleware

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // The actual linking would happen through the OAuth callback
    // with a state parameter indicating this is a link operation
    return res.status(501).json({
      error: "Provider linking not yet implemented",
      message:
        "This feature requires authenticated OAuth flow with state parameter",
    });
  } catch (error) {
    logger.error(`Link provider error: ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get user's linked OAuth accounts
 */
export async function getLinkedAccounts(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const oauthService = container.get(OAuthService);
    const accounts = await oauthService.getUserOAuthAccounts(userId);

    // Return sanitized account data (no tokens)
    const sanitizedAccounts = accounts.map((account) => ({
      provider: account.provider,
      createdAt: (account as any).createdAt,
    }));

    return res.status(200).json({ accounts: sanitizedAccounts });
  } catch (error) {
    logger.error(`Get linked accounts error: ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
}
