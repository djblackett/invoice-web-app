import passport from "passport";
import { Strategy as AppleStrategy } from "passport-apple";
import container from "@/config/inversify.config";
import type { Logger } from "@/config/logger.config";
import TYPES from "@/constants/identifiers";

const getLogger = (): Logger => container.get<Logger>(TYPES.Logger);

/**
 * Configure Apple Sign In Strategy
 *
 * Setup instructions:
 * 1. Go to https://developer.apple.com/account
 * 2. Navigate to Certificates, Identifiers & Profiles
 * 3. Create App ID: Enable "Sign in with Apple"
 * 4. Create Service ID:
 *    - Identifier: com.yourdomain.web
 *    - Configure "Sign in with Apple"
 *    - Add Return URLs: http://localhost:8000/auth/apple/callback
 * 5. Create Private Key:
 *    - Enable "Sign in with Apple"
 *    - Download .p8 file (CANNOT be re-downloaded!)
 *    - Note the Key ID
 * 6. Get Team ID from membership page
 * 7. Add all values to .env
 *
 * IMPORTANT: Apple only sends name and email on FIRST authentication
 * Must cache this data immediately!
 */
export function configureAppleStrategy() {
  if (
    !process.env.APPLE_SERVICE_ID ||
    !process.env.APPLE_TEAM_ID ||
    !process.env.APPLE_KEY_ID ||
    !process.env.APPLE_PRIVATE_KEY
  ) {
    getLogger().warn(
      "Apple Sign In not configured - APPLE_SERVICE_ID, APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_PRIVATE_KEY required",
    );
    return;
  }

  passport.use(
    "apple",
    new AppleStrategy(
      {
        clientID: process.env.APPLE_SERVICE_ID,
        teamID: process.env.APPLE_TEAM_ID,
        keyID: process.env.APPLE_KEY_ID,
        privateKeyString: process.env.APPLE_PRIVATE_KEY,
        callbackURL: "/auth/apple/callback",
        scope: ["email", "name"],
        passReqToCallback: true,
      },
      (
        _req,
        accessToken,
        refreshToken,
        idToken,
        profile: {
          sub?: string;
          id?: string;
          email?: string;
          email_verified?: string | boolean;
          name?: { firstName?: string; lastName?: string };
        },
        done,
      ) => {
        try {
          getLogger().info(
            `Apple Sign In callback for user: ${profile.sub || profile.id}`,
          );

          // Apple profile structure
          // WARNING: name and email are only provided on FIRST authentication!
          const email = profile.email;
          const emailVerified =
            profile.email_verified === "true" ||
            profile.email_verified === true;

          // Name is only provided on first sign-in
          let name: string | undefined;
          if (profile.name) {
            // profile.name is an object: { firstName, lastName }
            const firstName = profile.name.firstName || "";
            const lastName = profile.name.lastName || "";
            name = `${firstName} ${lastName}`.trim() || undefined;
          }

          if (!email) {
            getLogger().error("Apple profile missing email");
            return done(new Error("Email not provided by Apple"), undefined);
          }

          // Pass profile data to the controller
          const userData = {
            provider: "APPLE" as const,
            providerAccountId: profile.sub || profile.id,
            email,
            emailVerified,
            name,
            accessToken,
            refreshToken,
            idToken, // Apple uses ID token
          };

          done(null, userData);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          getLogger().error(`Apple Sign In error: ${message}`);
          done(error as Error, undefined);
        }
      },
    ),
  );

  getLogger().info("Apple Sign In strategy configured");
}
