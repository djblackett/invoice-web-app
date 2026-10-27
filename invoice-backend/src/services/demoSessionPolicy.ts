import type { UserIdAndRole } from "../constants/types";
import { ForbiddenException } from "../config/exception.config";

export const DEMO_SESSION_USER_PREFIX = "demo-session:";
export const DEMO_SESSION_TOKEN_PREFIX = "demo-session-v1.";
export const demoSessionsEnabled = () =>
  process.env["DEMO_SESSIONS_ENABLED"] === "true";

export function isReservedDemoUser(id: string): boolean {
  return id === "demoId" || id.startsWith(DEMO_SESSION_USER_PREFIX);
}

export function requireDemoMutationAllowed(
  user: UserIdAndRole | null | undefined,
) {
  if (user?.demoSessionId || user?.id.startsWith(DEMO_SESSION_USER_PREFIX)) {
    throw new ForbiddenException("Temporary demo sessions are read-only");
  }
}
