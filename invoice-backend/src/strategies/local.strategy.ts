import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import container from "@/config/inversify.config";
import TYPES from "@/constants/identifiers";
import type { IUserRepo } from "@/repositories/userRepo";
import { comparePassword } from "@/utils/crypto.util";
import type { Logger } from "@/config/logger.config";

const logger = container.get<Logger>(TYPES.Logger);

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
      async (email, password, done) => {
        try {
          const userRepo = container.get<IUserRepo>(TYPES.IUserRepo);

          // Find user by email (username field)
          const user = await userRepo.getUserById(email);

          if (!user) {
            logger.warn(`Login attempt for non-existent user: ${email}`);
            return done(null, false, {
              message: "Invalid email or password",
            });
          }

          // Check if user has a password (might be OAuth-only user)
          // Note: This requires accessing the full user entity with passwordHash
          // The current interface doesn't expose passwordHash for security
          // We'll need a separate method for authentication
          const userWithPassword = await userRepo.getUserByIdSafely(user.id);

          if (!userWithPassword) {
            return done(null, false, {
              message: "Invalid email or password",
            });
          }

          // For now, we'll need to add a method to check password
          // This is a temporary implementation until we add the proper method
          // TODO: Add getUserForAuthentication method to IUserRepo

          logger.warn(
            "Password verification not yet implemented - requires getUserForAuthentication method"
          );
          return done(null, false, {
            message: "Authentication not yet fully implemented",
          });

          // Future implementation:
          // const isValidPassword = await comparePassword(password, user.passwordHash);
          //
          // if (!isValidPassword) {
          //   logger.warn(`Failed login attempt for user: ${email}`);
          //   return done(null, false, { message: 'Invalid email or password' });
          // }
          //
          // logger.info(`Successful login for user: ${email}`);
          // return done(null, user);
        } catch (error) {
          logger.error(`Error in local strategy: ${error}`);
          return done(error);
        }
      }
    )
  );
}
