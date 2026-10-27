import {
  GraphQLError,
  Kind,
  OperationTypeNode,
  type FragmentDefinitionNode,
  type OperationDefinitionNode,
  type SelectionNode,
} from "graphql";
import type { UserIdAndRole } from "../constants/types";
import type { RepositoryDatabase } from "../database/database.connection";
import { ForbiddenException } from "../config/exception.config";

export const DEMO_SESSION_USER_PREFIX = "demo-session:";
export const DEMO_SESSION_TOKEN_PREFIX = "demo-session-v1.";
export const demoSessionsEnabled = () =>
  process.env["DEMO_SESSIONS_ENABLED"] === "true";

/** Every bearer token routed to temporary-session resolution. */
export const isTemporaryDemoToken = (token: string) =>
  token.startsWith("demo-session");

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
  // The coordinator's transaction, as the scope's repositories hold it.
  database: RepositoryDatabase;
}

/**
 * Opaque proof that the session-write coordinator admitted ONE invoice
 * operation for ONE locked, revalidated session, inside ONE transaction. It
 * carries no readable or writable data: the grant lives in a module-private
 * map keyed by the token's identity, so a copied, forged or deserialized
 * object never matches, and nothing a request supplies can produce one.
 */
declare const demoWriteBrand: unique symbol;
export interface DemoWriteCapability {
  readonly [demoWriteBrand]: true;
}

const grants = new WeakMap<object, DemoWriteGrant>();

function issueDemoWriteCapability(grant: DemoWriteGrant) {
  const capability = Object.freeze(
    Object.create(null) as object,
  ) as DemoWriteCapability;
  grants.set(capability, { ...grant });
  return { capability, revoke: () => grants.delete(capability) };
}

let issuerClaimed = false;

/**
 * Hands the capability issuer to the session-write coordinator, once per
 * process: demoSessionWrite.ts claims it as it loads, so later callers get an
 * error, and a module that claimed first would stop the coordinator (and the
 * server) from loading. This guards against accidental in-process misuse; it
 * does not sandbox server code, which could reach the database directly.
 */
export function claimDemoWriteIssuer() {
  if (issuerClaimed) throw new Error("Demo write issuer already claimed");
  issuerClaimed = true;
  return issueDemoWriteCapability;
}

/**
 * Ordinary identities pass. A temporary session passes only with a live
 * capability, issued to the same session and user, for one of `operations`,
 * and only when every database the caller is about to use (`writesThrough`:
 * its repositories' connections) is the transaction the grant was issued
 * in. So a capability moved into a root-client or another transaction's
 * service authorizes nothing. Everything else (no capability, a revoked or
 * foreign one, or an operation outside the grant, such as bulk deletes and
 * user administration) is denied.
 */
export function requireDemoMutationAllowed(
  user: UserIdAndRole | null | undefined,
  capability?: DemoWriteCapability | null,
  writesThrough: readonly RepositoryDatabase[] = [],
  ...operations: DemoInvoiceOperation[]
) {
  if (!isTemporaryDemoUser(user)) return;
  const grant = capability ? grants.get(capability) : undefined;
  if (
    grant &&
    grant.sessionId === user?.demoSessionId &&
    grant.userId === user.id &&
    operations.includes(grant.operation) &&
    writesThrough.length > 0 &&
    writesThrough.every((database) => database === grant.database)
  )
    return;
  throw new ForbiddenException(
    "Temporary demo sessions are read-only outside coordinated invoice writes",
  );
}

/** Root fields an operation selects, through any fragments, stopping past `max`. */
function rootFieldCount(
  selections: readonly SelectionNode[],
  fragment: (name: string) => FragmentDefinitionNode | undefined,
  max: number,
): number {
  let count = 0;
  for (const selection of selections) {
    if (count > max) break;
    if (selection.kind === Kind.FIELD) count++;
    else
      count += rootFieldCount(
        selection.kind === Kind.INLINE_FRAGMENT
          ? selection.selectionSet.selections
          : (fragment(selection.name.value)?.selectionSet.selections ?? []),
        fragment,
        max - count,
      );
  }
  return count;
}

/**
 * A temporary session's mutation request may select exactly ONE root field,
 * so one HTTP request (one per-IP allowance) costs at most one coordinated
 * transaction. Aliases, repeated fields and fragment spreads all count, and
 * `@skip`/`@include` are ignored, so no document shape hides a second field.
 * Checked before execution (Apollo plugin) and again by the mutation wrapper.
 */
export function requireSingleDemoMutation(
  user: UserIdAndRole | null | undefined,
  operation: OperationDefinitionNode | undefined,
  fragment: (name: string) => FragmentDefinitionNode | undefined,
) {
  if (!isTemporaryDemoUser(user)) return;
  if (
    operation &&
    (operation.operation !== OperationTypeNode.MUTATION ||
      rootFieldCount(operation.selectionSet.selections, fragment, 1) === 1)
  )
    return;
  throw new GraphQLError(
    "Temporary demo sessions may run one mutation per request",
    {
      extensions: { code: "SINGLE_MUTATION_REQUIRED", http: { status: 400 } },
    },
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
