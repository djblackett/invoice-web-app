import type { interfaces } from "inversify";
import { Prisma, type PrismaClient } from "@prisma/client";
import TYPES from "../constants/identifiers";
import type { Invoice, UserIdAndRole } from "../constants/types";
import type {
  DbClient,
  RepositoryDatabase,
} from "../database/database.connection";
import { DatabaseConnection } from "../database/prisma.database.connection";
import { createTransactionScope } from "../database/transactionScope";
import {
  claimDemoWriteIssuer,
  DEMO_SESSION_USER_PREFIX,
  demoSessionsEnabled,
  type DemoInvoiceOperation,
  type DemoWriteCapability,
} from "./demoSessionPolicy";
import {
  assertDemoRecordId,
  DEMO_WORKSPACE_LIMITS,
  exceedsWorkspaceLimits,
  measureWorkspaceUsage,
  prepareDemoInvoiceInput,
} from "./demoWorkspaceQuota";

// Claimed as this module loads, so no other module can mint a capability.
const issueDemoWriteCapability = claimDemoWriteIssuer();

export type DemoWriteKind = "mutation" | "reset";

// How long a write may wait for its session's row lock (and any later row
// lock) before failing with SESSION_BUSY. Same-session writes are serialized,
// so a burst would otherwise park pooled connections until the 10 s timeout.
export const DEMO_WRITE_LOCK_WAIT_MS = 2000;

// Two-key advisory locks (key2 = hashtext(session ID)), one class per write
// slot. A separate key space from the allocation/cleanup locks 8372401/2.
const DEMO_WRITE_SLOT_LOCK = 8372403;

export class DemoSessionWriteError extends Error {
  constructor(
    public readonly code:
      | "DISABLED"
      | "SESSION_INVALID"
      | "SESSION_BUSY"
      | "ATTEMPT_BUDGET"
      | "MUTATION_BUDGET"
      | "RESET_ALLOWANCE"
      | "RESET_COOLDOWN"
      | "WORKSPACE_QUOTA",
  ) {
    super(`Demo session write: ${code}`);
  }
}

interface LockedSession {
  userId: string;
  username: string;
  name: string | null;
  attemptCount: number;
  mutationCount: number;
  resetCount: number;
  lastResetAt: Date | null;
  now: Date;
  live: boolean;
}

const isLockTimeout = (e: unknown) =>
  e instanceof Prisma.PrismaClientKnownRequestError &&
  e.code === "P2010" &&
  (e.meta as { code?: unknown } | undefined)?.code === "55P03";

/**
 * Takes a free write slot for the rest of the transaction, never waiting.
 * Advisory locks live in PostgreSQL, so the bound holds across concurrent
 * requests and application instances, and a slot is released on commit,
 * rollback or a dropped connection. A hash collision between two sessions
 * can only cause a spurious, retryable SESSION_BUSY.
 */
async function takeWriteSlot(tx: DbClient, sessionId: string) {
  for (let slot = 0; slot < DEMO_WORKSPACE_LIMITS.concurrentWrites; slot++) {
    const [taken] = await tx.$queryRaw<{ ok: boolean }[]>`
      SELECT pg_try_advisory_xact_lock(
        ${DEMO_WRITE_SLOT_LOCK + slot}::int, hashtext(${sessionId})) AS "ok"`;
    if (taken?.ok) return true;
  }
  return false;
}

type Outcome<T> = { ok: true; value: T } | { ok: false; error: unknown };

/**
 * The single coordinated write path for a temporary session. `work` resolves
 * the ordinary services from the scope. Those services stay closed to the
 * session unless `operation` is given: then, and only after the lock and
 * revalidation, a capability for exactly that operation AND this scope's
 * transaction connection is bound into the scope, and it is revoked as soon
 * as `work` settles.
 *
 * Admission and lock order, all transaction-scoped:
 *   1. advisory lock 8372402: allocation and cleanup only, never taken here;
 *   2. a write slot (advisory, try-only): at most `concurrentWrites` open
 *      writes per session, so a burst cannot occupy the connection pool;
 *   3. the DemoSession row, FOR UPDATE: serializes this session's writes and
 *      resets, and conflicts with revocation (UPDATE) and cleanup (DELETE);
 *   4. that workspace's invoice/item/address/revision rows, via the scope.
 * Writes skip lock 1, so they never wait behind (or block) other sessions.
 *
 * One transaction: slot -> lock -> revalidate -> count the attempt ->
 * SAVEPOINT -> budget -> work -> measure -> count the change. A failure after
 * the savepoint rolls back to it and commits only the attempt, so failed
 * attempts are not free; any earlier failure rolls back everything. Lock
 * waits are bounded by DEMO_WRITE_LOCK_WAIT_MS (`SET LOCAL lock_timeout`).
 */
export async function runDemoSessionWrite<T>(
  prisma: PrismaClient,
  parent: interfaces.Container,
  user: UserIdAndRole,
  kind: DemoWriteKind,
  work: (scope: interfaces.Container) => Promise<T>,
  operation?: DemoInvoiceOperation,
): Promise<T> {
  const sessionId = user.demoSessionId;
  if (!sessionId) throw new DemoSessionWriteError("SESSION_INVALID");
  if (!demoSessionsEnabled()) throw new DemoSessionWriteError("DISABLED");
  // An admitted attempt, after its savepoint: budgets, `work`, quotas, usage.
  const admitted = async (tx: DbClient, session: LockedSession): Promise<T> => {
    if (session.mutationCount >= DEMO_WORKSPACE_LIMITS.mutations)
      throw new DemoSessionWriteError("MUTATION_BUDGET");
    if (kind === "reset") {
      if (session.resetCount >= DEMO_WORKSPACE_LIMITS.resets)
        throw new DemoSessionWriteError("RESET_ALLOWANCE");
      if (
        session.lastResetAt &&
        session.now.getTime() - session.lastResetAt.getTime() <
          DEMO_WORKSPACE_LIMITS.resetCooldownMs
      )
        throw new DemoSessionWriteError("RESET_COOLDOWN");
    }

    // The scope's identity and grant come from the locked row, not the request.
    const scope = createTransactionScope(parent, tx, {
      id: session.userId,
      username: session.username,
      name: session.name ?? "Demo visitor",
      role: "USER",
      isDemo: true,
      demoSessionId: sessionId,
    });
    // Bound to this scope's own connection: the guard refuses the capability
    // anywhere else, including a root-client or another transaction's service.
    const grant = operation
      ? issueDemoWriteCapability({
          sessionId,
          userId: session.userId,
          operation,
          database: scope.get<RepositoryDatabase>(DatabaseConnection),
        })
      : undefined;
    if (grant)
      scope
        .bind<DemoWriteCapability>(TYPES.DemoWriteCapability)
        .toConstantValue(grant.capability);
    let result: T;
    try {
      result = await work(scope);
    } finally {
      grant?.revoke();
    }

    if (exceedsWorkspaceLimits(await measureWorkspaceUsage(tx, session.userId)))
      throw new DemoSessionWriteError("WORKSPACE_QUOTA");
    await tx.demoSession.update({
      where: { id: sessionId },
      data: {
        mutationCount: { increment: 1 },
        ...(kind === "reset"
          ? { resetCount: { increment: 1 }, lastResetAt: session.now }
          : {}),
      },
    });
    return result;
  };
  const outcome = await prisma.$transaction(
    async (tx): Promise<Outcome<T>> => {
      // SET cannot take a bind parameter; the value is a numeric constant.
      await tx.$executeRawUnsafe(
        `SET LOCAL lock_timeout = '${DEMO_WRITE_LOCK_WAIT_MS}ms'`,
      );
      if (!(await takeWriteSlot(tx, sessionId)))
        throw new DemoSessionWriteError("SESSION_BUSY");
      const locked = await tx.$executeRaw`
        SELECT 1 FROM "DemoSession" WHERE "id" = ${sessionId} FOR UPDATE`.catch(
        (e: unknown) => {
          throw isLockTimeout(e)
            ? new DemoSessionWriteError("SESSION_BUSY")
            : e;
        },
      );
      if (locked !== 1) throw new DemoSessionWriteError("SESSION_INVALID");
      // A separate statement after the lock: its snapshot and clock postdate
      // any wait, so revocation/expiry/cleanup during the wait is observed.
      const [session] = await tx.$queryRaw<LockedSession[]>`
        SELECT s."userId", u."username", u."name", s."attemptCount",
          s."mutationCount", s."resetCount", s."lastResetAt",
          clock_timestamp() AS "now",
          (s."revokedAt" IS NULL AND s."expiresAt" > clock_timestamp()) AS "live"
        FROM "DemoSession" s JOIN "User" u ON u."id" = s."userId"
        WHERE s."id" = ${sessionId}`;
      if (!demoSessionsEnabled()) throw new DemoSessionWriteError("DISABLED");
      if (
        !session?.live ||
        session.userId !== user.id ||
        !session.userId.startsWith(DEMO_SESSION_USER_PREFIX)
      )
        throw new DemoSessionWriteError("SESSION_INVALID");
      if (session.attemptCount >= DEMO_WORKSPACE_LIMITS.attempts)
        throw new DemoSessionWriteError("ATTEMPT_BUDGET");
      await tx.$executeRaw`
        UPDATE "DemoSession" SET "attemptCount" = "attemptCount" + 1
        WHERE "id" = ${sessionId}`;
      await tx.$executeRawUnsafe("SAVEPOINT demo_write_attempt");
      try {
        return {
          ok: true,
          value: await admitted(tx, session),
        };
      } catch (error) {
        // Keep only the recorded attempt. If even this fails (the transaction
        // has timed out), the original error propagates and everything,
        // the attempt included, rolls back.
        await tx
          .$executeRawUnsafe("ROLLBACK TO SAVEPOINT demo_write_attempt")
          .catch(() => {
            throw error;
          });
        return { ok: false, error };
      }
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      maxWait: 5000,
      timeout: 10000,
    },
  );
  if (!outcome.ok) throw outcome.error;
  return outcome.value;
}

/** Untrusted request fields, exactly as a resolver would receive them. */
export interface DemoInvoiceRequest {
  invoiceId?: unknown;
  revisionId?: unknown;
  invoice?: unknown;
}

// What each operation needs. Every listed field is required and validated;
// anything else in the request is dropped before the transaction.
const DEMO_REQUEST_FIELDS = {
  create: ["invoice"],
  edit: ["invoiceId", "invoice"],
  pay: ["invoiceId"],
  delete: ["invoiceId"],
  restore: ["invoiceId", "revisionId"],
} as const satisfies Record<
  DemoInvoiceOperation,
  readonly (keyof DemoInvoiceRequest)[]
>;

interface PreparedFields {
  invoiceId: string;
  revisionId: string;
  invoice: Partial<Invoice>;
}

export type PreparedDemoInvoiceRequest<O extends DemoInvoiceOperation> = Pick<
  PreparedFields,
  (typeof DEMO_REQUEST_FIELDS)[O][number]
>;

/**
 * The entry point for temporary-session invoice operations (create, edit,
 * pay, delete, restore). IDs and invoice input are bounded and rebuilt BEFORE
 * any transaction or lock, so oversized or malformed requests cost no pooled
 * connection, and validation never consults another user's records. The
 * coordinator then grants `work` exactly this one operation.
 */
export async function runDemoInvoiceWrite<O extends DemoInvoiceOperation, T>(
  prisma: PrismaClient,
  parent: interfaces.Container,
  user: UserIdAndRole,
  operation: O,
  request: DemoInvoiceRequest,
  work: (
    scope: interfaces.Container,
    prepared: PreparedDemoInvoiceRequest<O>,
  ) => Promise<T>,
): Promise<T> {
  const fields: readonly (keyof PreparedFields)[] =
    // eslint-disable-next-line security/detect-object-injection -- `operation` is a typed union chosen by server code, not request input.
    DEMO_REQUEST_FIELDS[operation];
  const prepared = {
    ...(fields.includes("invoiceId") && {
      invoiceId: assertDemoRecordId("invoiceId", request.invoiceId),
    }),
    ...(fields.includes("revisionId") && {
      revisionId: assertDemoRecordId("revisionId", request.revisionId),
    }),
    ...(fields.includes("invoice") && {
      invoice: prepareDemoInvoiceInput(request.invoice),
    }),
  };
  return runDemoSessionWrite(
    prisma,
    parent,
    user,
    "mutation",
    (scope) => work(scope, prepared as PreparedDemoInvoiceRequest<O>),
    operation,
  );
}
