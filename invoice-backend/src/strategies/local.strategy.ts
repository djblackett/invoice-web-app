import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import container from "@/config/inversify.config";
import TYPES from "@/constants/identifiers";
import type { IUserRepo } from "@/repositories/userRepo";
import type { Logger } from "@/config/logger.config";

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
      (email, _password, done) => {
        void (async () => {
          try {
            const userRepo = container.get<IUserRepo>(TYPES.IUserRepo);

            const user = await userRepo.getUserById(email);

            if (!user || !user.id) {
              getLogger().warn(`Login attempt for non-existent user: ${email}`);
              return done(null, false, {
                message: "Invalid email or password",
              });
            }

            const userWithPassword = await userRepo.getUserByIdSafely(user.id);

            if (!userWithPassword) {
              return done(null, false, {
                message: "Invalid email or password",
              });
            }

            getLogger().warn(
              "Password verification not yet implemented - requires getUserForAuthentication method",
            );
            return done(null, false, {
              message: "Authentication not yet fully implemented",
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
