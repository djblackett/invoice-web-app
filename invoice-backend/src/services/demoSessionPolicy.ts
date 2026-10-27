import type { UserIdAndRole } from "../constants/types";
import { ForbiddenException } from "../config/exception.config";

export const DEMO_SESSION_USER_PREFIX = "demo-session:";
export const DEMO_SESSION_TOKEN_PREFIX = "demo-session-v1.";
export const demoSessionsEnabled = () =>
  process.env["DEMO_SESSIONS_ENABLED"] === "true";

export function isReservedDemoUser(id: string): boolean {
  return id === "demoId" || id.startsWith(DEMO_SESSION_USER_PREFIX);
}

export const isTemporaryDemoUser = (user: UserIdAndRole | null | undefined) =>
  Boolean(user?.demoSessionId || user?.id.startsWith(DEMO_SESSION_USER_PREFIX));

export function requireDemoMutationAllowed(
  user: UserIdAndRole | null | undefined,
) {
  if (isTemporaryDemoUser(user)) {
    throw new ForbiddenException("Temporary demo sessions are read-only");
  }
}

/**
 * Temporary-session writes use HTTP only (the frontend sends only
 * subscriptions over WebSocket). A separate rule from the read-only guard, so
 * enabling coordinated writes later never opens a second write transport.
 */
export function requireHttpForDemoMutation(
  user: UserIdAndRole | null | undefined,
  overWebSocket: boolean,
) {
  if (overWebSocket && isTemporaryDemoUser(user)) {
    throw new ForbiddenException(
      "Temporary demo sessions cannot mutate over WebSocket",
    );
  }
}
