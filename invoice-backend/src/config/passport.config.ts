import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { VerifyCallback, Profile } from "passport-google-oauth20";
import type { UserIdAndRole } from "../constants/types";
import { Role } from "@prisma/client";

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"] || "",
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"] || "",
      callbackURL:
        process.env["GOOGLE_CALLBACK_URL"] || "/auth/google/callback",
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        // Extract user information from Google profile
        const user: UserIdAndRole = {
          id: profile.id,
          username: profile.emails?.[0]?.value || "",
          name: profile.displayName || profile.name?.givenName || "User",
          role: Role.USER, // Default role for Google users
        };

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    },
  ),
);

// Serialize user for session
passport.serializeUser((user: UserIdAndRole, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user: UserIdAndRole, done) => {
  done(null, user);
});

export default passport;
