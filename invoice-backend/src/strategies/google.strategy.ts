import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Profile as GoogleProfile } from "passport-google-oauth20";
import container from "@/config/inversify.config";
import type { Logger } from "@/config/logger.config";
import TYPES from "@/constants/identifiers";

const logger = container.get<Logger>(TYPES.Logger);

/**
 * Configure Google OAuth 2.0 Strategy
 *
 * Setup instructions:
 * 1. Go to https://console.cloud.google.com
 * 2. Create a new project or select existing
 * 3. Enable Google+ API
 * 4. Create OAuth 2.0 credentials
 * 5. Add authorized redirect URIs:
 *    - Development: http://localhost:8000/auth/google/callback
 *    - Production: https://yourdomain.com/auth/google/callback
 * 6. Copy Client ID and Client Secret to .env
 */
export function configureGoogleStrategy() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    logger.warn(
      "Google OAuth not configured - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET required"
    );
    return;
  }

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"],
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile: GoogleProfile, done) => {
        try {
          logger.info(`Google OAuth callback for user: ${profile.id}`);

          // Extract profile data
          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : undefined;
          const emailVerified =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].verified
              : false;
          const name = profile.displayName;
          const picture =
            profile.photos && profile.photos.length > 0
              ? profile.photos[0].value
              : undefined;

          if (!email) {
            logger.error("Google profile missing email");
            return done(new Error("Email not provided by Google"), undefined);
          }

          // Pass profile data to the controller via the user object
          // The controller will handle user creation/linking
          const userData = {
            provider: "GOOGLE" as const,
            providerAccountId: profile.id,
            email,
            emailVerified,
            name,
            picture,
            accessToken,
            refreshToken,
          };

          return done(null, userData);
        } catch (error) {
          logger.error(`Google OAuth error: ${error}`);
          return done(error as Error, undefined);
        }
      }
    )
  );

  logger.info("Google OAuth strategy configured");
}
