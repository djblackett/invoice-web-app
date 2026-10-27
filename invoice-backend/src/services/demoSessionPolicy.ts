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

/** The only invoice operations a temporary session may ever perform. */
export type DemoInvoiceOperation =
  | "create"
  | "edit"
  | "pay"
  | "delete"
  | "restore";

interface DemoWriteGrant {
  sessionId: string;
  userId: string;
  operation: DemoInvoiceOperation;
}

/**
 * Opaque proof that the session-write coordinator admitted ONE invoice
 * operation for ONE locked, revalidated session. It carries no readable or
 * writable data: the grant lives in a module-private map keyed by the token's
 * identity, so a copied, forged or deserialized object never matches, and
 * nothing a request supplies can produce one.
 */
declare const demoWriteBrand: unique symbol;
export interface DemoWriteCapability {
  readonly [demoWriteBrand]: true;
}

const grants = new WeakMap<object, DemoWriteGrant>();

/**
 * Coordinator-only (demoSessionWrite.ts). The caller binds the capability
 * into exactly one transaction scope and calls `revoke` when that write's
 * work settles, so the capability never outlives its transaction.
 */
export function issueDemoWriteCapability(grant: DemoWriteGrant) {
  const capability = Object.freeze(
    Object.create(null) as object,
  ) as DemoWriteCapability;
  grants.set(capability, { ...grant });
  return { capability, revoke: () => grants.delete(capability) };
}

/**
 * Ordinary identities pass. A temporary session passes only with a live
 * capability, issued to the same session and user, for one of `operations`.
 * Everything else (no capability, a revoked or foreign one, or an operation
 * outside the grant, such as bulk deletes and user administration) is denied.
 */
export function requireDemoMutationAllowed(
  user: UserIdAndRole | null | undefined,
  capability?: DemoWriteCapability | null,
  ...operations: DemoInvoiceOperation[]
) {
  if (!isTemporaryDemoUser(user)) return;
  const grant = capability ? grants.get(capability) : undefined;
  if (
    grant &&
    grant.sessionId === user?.demoSessionId &&
    grant.userId === user.id &&
    operations.includes(grant.operation)
  )
    return;
  throw new ForbiddenException(
    "Temporary demo sessions are read-only outside coordinated invoice writes",
  );
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
