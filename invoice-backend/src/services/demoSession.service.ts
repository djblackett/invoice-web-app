import { createHash, randomBytes, randomUUID } from "node:crypto";
import { Prisma, type PrismaClient } from "@prisma/client";
import type { UserIdAndRole } from "../constants/types";
import {
  DEMO_SESSION_TOKEN_PREFIX,
  DEMO_SESSION_USER_PREFIX,
  demoSessionsEnabled,
} from "./demoSessionPolicy";
import { clearWorkspace, insertCanonicalWorkspace } from "./demoWorkspaceData";

export const DEMO_SESSION_LIFETIME_MS = 24 * 60 * 60 * 1000;
export const DEMO_SESSION_CAPACITY = 100;
export const DEMO_ALLOCATION_BURST = 10;
export const DEMO_ALLOCATION_REFILL_MS = 60_000;
// Expired workspaces reclaimed at the start of each allocation attempt, and by
// one explicit operator pass. Bounds the work (and the global lock hold time).
export const DEMO_ALLOCATION_CLEANUP_BATCH = 5;
export const DEMO_OPERATOR_CLEANUP_BATCH = 10;

export class DemoSessionError extends Error {
  constructor(public readonly code: "DISABLED" | "CAPACITY" | "RATE_LIMITED") {
    super(`Demo session allocation: ${code}`);
  }
}

const hashCredential = (credential: string) =>
  createHash("sha256").update(credential).digest("hex");

// Separate statement after lock acquisition: transaction-start time can be stale
// after waiting. PostgreSQL is the clock authority across application instances.
async function databaseNow(tx: Prisma.TransactionClient): Promise<Date> {
  const [row] = await tx.$queryRaw<
    { now: Date }[]
  >`SELECT clock_timestamp() AS now`;
  if (!row) throw new Error("Database clock unavailable");
  return row.now;
}

async function lockWorkspaces(tx: Prisma.TransactionClient) {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(8372402)`;
}

type AllocationOutcome =
  | { ok: true; credential: string; expiresAt: Date }
  | { ok: false; code: "CAPACITY" | "RATE_LIMITED" };

/**
 * Allocation is also the cleanup trigger (there is no worker): after taking the
 * global lock it first reclaims up to DEMO_ALLOCATION_CLEANUP_BATCH expired
 * workspaces, then applies the capacity and rate checks to what remains. A
 * refused allocation still commits that cleanup (the outcome is returned, not
 * thrown), so a capacity or rate refusal never discards reclaimed space. Any
 * unexpected database failure rolls everything back, cleanup included.
 */
export async function allocateDemoSession(prisma: PrismaClient) {
  if (!demoSessionsEnabled()) throw new DemoSessionError("DISABLED");
  const credential =
    DEMO_SESSION_TOKEN_PREFIX + randomBytes(32).toString("hex");
  const userId = DEMO_SESSION_USER_PREFIX + randomUUID();
  const outcome = await prisma.$transaction(
    async (tx): Promise<AllocationOutcome> => {
      await lockWorkspaces(tx);
      if (!demoSessionsEnabled()) throw new DemoSessionError("DISABLED");
      const now = await databaseNow(tx);
      await reclaimExpiredSessions(tx, DEMO_ALLOCATION_CLEANUP_BATCH);
      // Count ALL retained sessions, including expired and revoked ones that
      // cleanup has not reached (revoked-but-unexpired are never reclaimed).
      if ((await tx.demoSession.count()) >= DEMO_SESSION_CAPACITY)
        return { ok: false, code: "CAPACITY" };
      const gate = await tx.demoAllocationState.findUniqueOrThrow({
        where: { id: 1 },
      });
      const tokens = Math.min(
        DEMO_ALLOCATION_BURST,
        gate.tokens +
          Math.max(0, now.getTime() - gate.updatedAt.getTime()) /
            DEMO_ALLOCATION_REFILL_MS,
      );
      if (tokens < 1) return { ok: false, code: "RATE_LIMITED" };
      await tx.demoAllocationState.update({
        where: { id: 1 },
        data: { tokens: tokens - 1, updatedAt: now },
      });
      await tx.user.create({
        data: {
          id: userId,
          username: `${userId}@example.invalid`,
          name: "Demo visitor",
          role: "USER",
        },
      });
      const session = await tx.demoSession.create({
        data: {
          userId,
          credentialHash: hashCredential(credential),
          createdAt: now,
          expiresAt: new Date(now.getTime() + DEMO_SESSION_LIFETIME_MS),
        },
      });
      await insertCanonicalWorkspace(tx, userId);
      return { ok: true, credential, expiresAt: session.expiresAt };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      maxWait: 5000,
      timeout: 15000,
    },
  );
  if (!outcome.ok) throw new DemoSessionError(outcome.code);
  return { credential: outcome.credential, expiresAt: outcome.expiresAt };
}

export async function resolveDemoSession(
  prisma: PrismaClient,
  credential: string,
): Promise<UserIdAndRole | null> {
  if (
    !demoSessionsEnabled() ||
    !/^demo-session-v1\.[0-9a-f]{64}$/.test(credential)
  )
    return null;
  // One DB statement enforces expiry/revocation and loads the linked identity.
  const rows = await prisma.$queryRaw<
    { id: string; userId: string; username: string; name: string | null }[]
  >`
    SELECT s."id", s."userId", u."username", u."name"
    FROM "DemoSession" s JOIN "User" u ON u."id" = s."userId"
    WHERE s."credentialHash" = ${hashCredential(credential)}
      AND s."revokedAt" IS NULL AND s."expiresAt" > clock_timestamp()
  `;
  const row = rows[0];
  if (!row?.userId.startsWith(DEMO_SESSION_USER_PREFIX)) return null;
  return {
    id: row.userId,
    username: row.username,
    name: row.name ?? "Demo visitor",
    role: "USER",
    isDemo: true,
    demoSessionId: row.id,
  };
}

export interface ReclaimResult {
  /** Workspaces fully deleted in this pass. */
  reclaimed: number;
  /** Candidates that failed and were left intact, marked for later retry. */
  failed: number;
}

/**
 * Reclaims at most `limit` expired workspaces inside the caller's transaction,
 * which must already hold the global lock 8372402 (allocation or operator
 * cleanup; lock order: global, then each session row, then its data rows).
 *
 * Candidates are sessions whose database-clock expiry has passed, locked with
 * FOR UPDATE SKIP LOCKED: a session with an admitted write or reset is left
 * for a later pass, never deleted underneath it, and this pass never waits on
 * a write while holding the global lock. Revoked sessions that have not
 * expired are never candidates. Never-failed candidates come first, oldest
 * expiry first.
 *
 * Each workspace is reclaimed under its own savepoint. A damaged one (foreign
 * revision author, unexpected ownership, a failing delete) is rolled back
 * intact and marked with `cleanupFailedAt`, which sorts it behind every
 * healthy candidate, so it cannot starve the others. Only a failure that
 * aborts the whole transaction (timeout, lost connection) propagates.
 */
export async function reclaimExpiredSessions(
  tx: Prisma.TransactionClient,
  limit: number,
): Promise<ReclaimResult> {
  const sessions = await tx.$queryRaw<{ id: string; userId: string }[]>`
    SELECT "id", "userId" FROM "DemoSession"
    WHERE "expiresAt" <= clock_timestamp()
    ORDER BY "cleanupFailedAt" ASC NULLS FIRST, "expiresAt" ASC
    LIMIT ${limit}
    FOR UPDATE SKIP LOCKED`;
  const result: ReclaimResult = { reclaimed: 0, failed: 0 };
  for (const session of sessions) {
    await tx.$executeRawUnsafe("SAVEPOINT demo_cleanup_session");
    try {
      await reclaimWorkspace(tx, session);
      await tx.$executeRawUnsafe("RELEASE SAVEPOINT demo_cleanup_session");
      result.reclaimed++;
    } catch (error) {
      // If the rollback itself fails the transaction is unusable: propagate.
      await tx
        .$executeRawUnsafe("ROLLBACK TO SAVEPOINT demo_cleanup_session")
        .catch(() => {
          throw error;
        });
      // The session ID is not a credential. Nothing else is logged.
      console.error(
        `Demo workspace cleanup failed for session ${session.id}:`,
        error instanceof Error ? error.message : "unknown error",
      );
      await tx.$executeRaw`
        UPDATE "DemoSession" SET "cleanupFailedAt" = clock_timestamp()
        WHERE "id" = ${session.id}`;
      result.failed++;
    }
  }
  return result;
}

async function reclaimWorkspace(
  tx: Prisma.TransactionClient,
  session: { id: string; userId: string },
) {
  if (!session.userId.startsWith(DEMO_SESSION_USER_PREFIX))
    throw new Error("Invalid demo ownership");
  // Deleting a user would otherwise SET NULL on foreign revision authors.
  const foreignRevision = await tx.invoiceRevision.findFirst({
    where: {
      createdById: session.userId,
      invoice: { createdById: { not: session.userId } },
    },
    select: { id: true },
  });
  if (foreignRevision)
    throw new Error("Demo user referenced by a foreign revision");
  await clearWorkspace(tx, session.userId);
  await tx.demoSession.delete({ where: { id: session.id } });
  await tx.user.delete({ where: { id: session.userId } });
}

/**
 * Explicit operator cleanup (scripts/cleanup-demo-sessions.cjs); no public
 * route and no worker calls it. One bounded, transactional pass under the same
 * global lock as allocation. Works whether or not temporary sessions are
 * enabled, so an operator can drain expired data after switching them off.
 */
export async function cleanupExpiredDemoSessionsReport(
  prisma: PrismaClient,
  limit = DEMO_OPERATOR_CLEANUP_BATCH,
): Promise<ReclaimResult> {
  // Never unbounded, whatever the caller passes.
  const bounded = Math.min(
    Math.max(1, Math.trunc(limit) || 1),
    DEMO_SESSION_CAPACITY,
  );
  return prisma.$transaction(
    async (tx) => {
      await lockWorkspaces(tx);
      return reclaimExpiredSessions(tx, bounded);
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      maxWait: 5000,
      timeout: 15000,
    },
  );
}

export async function cleanupExpiredDemoSessions(
  prisma: PrismaClient,
  limit = DEMO_OPERATOR_CLEANUP_BATCH,
): Promise<number> {
  return (await cleanupExpiredDemoSessionsReport(prisma, limit)).reclaimed;
}
