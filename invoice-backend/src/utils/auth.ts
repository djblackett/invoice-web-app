import type { QueryContext } from "../constants/types";

/**
 * Ensures that the resolver is accessed by an authenticated user.
 *
 * @param context - The GraphQL context containing user information.
 */
export function requireAuth(context: QueryContext): void {
  if (!context.username) {
    throw new Error("You must be logged in to perform this action.");
  }
}
