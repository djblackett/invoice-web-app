import passport from "passport";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import type { Profile as MicrosoftProfile } from "passport-microsoft";
import container from "@/config/inversify.config";
import type { Logger } from "@/config/logger.config";
import TYPES from "@/constants/identifiers";

const logger = container.get<Logger>(TYPES.Logger);

/**
 * Configure Microsoft OAuth 2.0 Strategy
 *
 * Setup instructions:
 * 1. Go to https://portal.azure.com
 * 2. Navigate to Azure Active Directory → App registrations
 * 3. Click "New registration"
 * 4. Configure:
 *    - Name: Your App Name
 *    - Supported accounts: Personal + organizational Microsoft accounts
 *    - Redirect URI: http://localhost:8000/auth/microsoft/callback
 * 5. Copy Application (client) ID
 * 6. Create client secret: Certificates & secrets → New client secret
 * 7. Add API permissions: Microsoft Graph → User.Read
 */
export function configureMicrosoftStrategy() {
  if (
    !process.env.MICROSOFT_CLIENT_ID ||
    !process.env.MICROSOFT_CLIENT_SECRET
  ) {
    logger.warn(
      "Microsoft OAuth not configured - MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET required"
    );
    return;
  }

  passport.use(
    "microsoft",
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: "/auth/microsoft/callback",
        scope: ["user.read"],
        passReqToCallback: true,
      },
      async (
        req,
        accessToken,
        refreshToken,
        profile: MicrosoftProfile,
        done
      ) => {
        try {
          logger.info(`Microsoft OAuth callback for user: ${profile.id}`);

          // Extract profile data
          // Microsoft profile structure can vary
          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : (profile as any).upn || // UPN (User Principal Name) as fallback
                (profile as any).userPrincipalName;
          const name = profile.displayName;

          if (!email) {
            logger.error("Microsoft profile missing email");
            return done(new Error("Email not provided by Microsoft"), undefined);
          }

          // Pass profile data to the controller
          const userData = {
            provider: "MICROSOFT" as const,
            providerAccountId: profile.id,
            email,
            emailVerified: true, // Microsoft accounts are verified
            name,
            accessToken,
            refreshToken,
          };

          return done(null, userData);
        } catch (error) {
          logger.error(`Microsoft OAuth error: ${error}`);
          return done(error as Error, undefined);
        }
      }
    )
  );

  logger.info("Microsoft OAuth strategy configured");
}
