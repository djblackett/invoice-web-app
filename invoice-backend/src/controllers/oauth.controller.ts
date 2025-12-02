import type { Request, Response, NextFunction, RequestHandler } from "express";
import passport from "passport";
import container from "@/config/inversify.config";
import { OAuthService } from "@/services/oauth.service";
import type { Logger } from "@/config/logger.config";
import TYPES from "@/constants/identifiers";
import type { OAuthUserData } from "@/services/oauth.service";

const getLogger = (): Logger => container.get<Logger>(TYPES.Logger);

const asRequestHandler = (
  handler: unknown,
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return handler as RequestHandler;
};

const getUserIdFromRequest = (req: Request): string | undefined => {
  const user = (req as { user?: { id?: string } }).user;
  return typeof user?.id === "string" ? user.id : undefined;
};

/**
 * Google OAuth - Initiate authentication
 */
export function googleAuth(req: Request, res: Response, next: NextFunction) {
  const handler = asRequestHandler(
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    }),
  );
  handler(req, res, next);
}

/**
 * Google OAuth - Callback handler
 */
export function googleCallback(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const handler = asRequestHandler(
    passport.authenticate(
      "google",
      { session: false },
      async (err: unknown, user: OAuthUserData | false | undefined) => {
        try {
          if (err || !user) {
            const message =
              err instanceof Error
                ? err.message
                : typeof err === "string"
                  ? err
                  : "Unknown error";
            getLogger().error(`Google OAuth error: ${message}`);
            return res.redirect(
              `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
            );
          }

          const oauthService = container.get(OAuthService);

          const metadata: { userAgent?: string; ipAddress?: string } = {};
          if (req.headers["user-agent"] !== undefined) {
            metadata.userAgent = req.headers["user-agent"];
          }
          if (req.ip !== undefined) {
            metadata.ipAddress = req.ip;
          }

          const result = await oauthService.handleOAuthAuthentication(
            user,
            metadata,
          );

          res.cookie("refreshToken", result.tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          });

          const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${result.tokens.accessToken}&new=${result.isNewUser}`;
          return res.redirect(redirectUrl);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          getLogger().error(`Google OAuth callback error: ${message}`);
          return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
          );
        }
      },
    ),
  );
  handler(req, res, next);
}

/**
 * Microsoft OAuth - Initiate authentication
 */
export function microsoftAuth(req: Request, res: Response, next: NextFunction) {
  const handler = asRequestHandler(
    passport.authenticate("microsoft", {
      scope: ["user.read"],
      session: false,
    }),
  );
  handler(req, res, next);
}

/**
 * Microsoft OAuth - Callback handler
 */
export function microsoftCallback(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const handler = asRequestHandler(
    passport.authenticate(
      "microsoft",
      { session: false },
      async (err: unknown, user: OAuthUserData | false | undefined) => {
        try {
          if (err || !user) {
            const message =
              err instanceof Error
                ? err.message
                : typeof err === "string"
                  ? err
                  : "Unknown error";
            getLogger().error(`Microsoft OAuth error: ${message}`);
            return res.redirect(
              `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
            );
          }

          const oauthService = container.get(OAuthService);

          const metadata: { userAgent?: string; ipAddress?: string } = {};
          if (req.headers["user-agent"] !== undefined) {
            metadata.userAgent = req.headers["user-agent"];
          }
          if (req.ip !== undefined) {
            metadata.ipAddress = req.ip;
          }

          const result = await oauthService.handleOAuthAuthentication(
            user,
            metadata,
          );

          res.cookie("refreshToken", result.tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });

          const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${result.tokens.accessToken}&new=${result.isNewUser}`;
          return res.redirect(redirectUrl);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          getLogger().error(`Microsoft OAuth callback error: ${message}`);
          return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
          );
        }
      },
    ),
  );
  handler(req, res, next);
}

/**
 * Apple Sign In - Initiate authentication
 */
export function appleAuth(req: Request, res: Response, next: NextFunction) {
  const handler = asRequestHandler(
    passport.authenticate("apple", {
      scope: ["email", "name"],
      session: false,
    }),
  );
  handler(req, res, next);
}

/**
 * Apple Sign In - Callback handler
 */
export function appleCallback(req: Request, res: Response, next: NextFunction) {
  const handler = asRequestHandler(
    passport.authenticate(
      "apple",
      { session: false },
      async (err: unknown, user: OAuthUserData | false | undefined) => {
        try {
          if (err || !user) {
            const message =
              err instanceof Error
                ? err.message
                : typeof err === "string"
                  ? err
                  : "Unknown error";
            getLogger().error(`Apple Sign In error: ${message}`);
            return res.redirect(
              `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
            );
          }

          const oauthService = container.get(OAuthService);

          const metadata: { userAgent?: string; ipAddress?: string } = {};
          if (req.headers["user-agent"] !== undefined) {
            metadata.userAgent = req.headers["user-agent"];
          }
          if (req.ip !== undefined) {
            metadata.ipAddress = req.ip;
          }

          const result = await oauthService.handleOAuthAuthentication(
            user,
            metadata,
          );

          res.cookie("refreshToken", result.tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });

          const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${result.tokens.accessToken}&new=${result.isNewUser}`;
          return res.redirect(redirectUrl);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          getLogger().error(`Apple Sign In callback error: ${message}`);
          return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
          );
        }
      },
    ),
  );
  handler(req, res, next);
}

/**
 * Link OAuth provider to authenticated user
 * This would be called when a logged-in user wants to link additional providers
 */
export function linkProvider(req: Request, res: Response) {
  try {
    // This would require middleware to extract user from access token
    // For now, this is a placeholder
    const userId = getUserIdFromRequest(req); // Would come from auth middleware

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
    const message = error instanceof Error ? error.message : String(error);
    getLogger().error(`Link provider error: ${message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get user's linked OAuth accounts
 */
export async function getLinkedAccounts(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const oauthService = container.get(OAuthService);
    const accounts = await oauthService.getUserOAuthAccounts(userId);

    // Return sanitized account data (no tokens)
    const sanitizedAccounts = accounts.map(({ provider, createdAt }) => ({
      provider,
      createdAt,
    }));

    return res.status(200).json({ accounts: sanitizedAccounts });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    getLogger().error(`Get linked accounts error: ${message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
}
