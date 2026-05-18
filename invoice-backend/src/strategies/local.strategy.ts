import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import container from "@/config/inversify.config";
import TYPES from "@/constants/identifiers";
import type { IUserRepo } from "@/repositories/userRepo";
import type { Logger } from "@/config/logger.config";
import { comparePassword } from "@/utils/crypto.util";

const getLogger = (): Logger => container.get<Logger>(TYPES.Logger);

/**
 * Passport Local Strategy for email/password authentication
 *
 * This strategy is used for traditional username/password login.
 * It validates the user's credentials against the database.
 */
export function configureLocalStrategy() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // Use email instead of username
        passwordField: "password",
      },
      (email, password, done) => {
        void (async () => {
          try {
            const userRepo = container.get<IUserRepo>(TYPES.IUserRepo);

            const user = await userRepo.getUserForAuthentication(email);

            if (!user) {
              getLogger().warn(`Login attempt for non-existent user: ${email}`);
              return done(null, false, {
                message: "Invalid email or password",
              });
            }

            if (!user.passwordHash) {
              return done(null, false, {
                message: "Invalid email or password",
              });
            }

            const isValid = await comparePassword(password, user.passwordHash);
            if (!isValid) {
              getLogger().warn(`Failed login attempt for: ${email}`);
              return done(null, false, {
                message: "Invalid email or password",
              });
            }

            return done(null, {
              id: user.id,
              name: user.name,
              username: user.username,
              role: user.role,
            });
          } catch (error) {
            const message =
              error instanceof Error ? error.message : String(error);
            getLogger().error(`Error in local strategy: ${message}`);
            return done(error as Error);
          }
        })();
      },
    ),
  );
}
