import type { interfaces } from "inversify";
import { Prisma, type PrismaClient } from "@prisma/client";
import type { UserIdAndRole } from "../constants/types";
import { createTransactionScope } from "../database/transactionScope";
import {
  DEMO_SESSION_USER_PREFIX,
  demoSessionsEnabled,
} from "./demoSessionPolicy";
import {
  DEMO_WORKSPACE_LIMITS,
  exceedsWorkspaceLimits,
  measureWorkspaceUsage,
} from "./demoWorkspaceQuota";

export type DemoWriteKind = "mutation" | "reset";

export class DemoSessionWriteError extends Error {
  constructor(
    public readonly code:
      | "DISABLED"
      | "SESSION_INVALID"
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
  mutationCount: number;
  resetCount: number;
  lastResetAt: Date | null;
  now: Date;
  live: boolean;
}

/**
 * The single coordinated write path for a temporary session. NOT wired to any
 * route or resolver: temporary sessions remain read-only, and `work` resolves
 * the ordinary (still guarded) services from the scope.
 *
 * Lock order, all transaction-scoped:
 *   1. advisory lock 8372402: allocation and cleanup only, never taken here;
 *   2. the DemoSession row, FOR UPDATE: serializes this session's writes and
 *      resets, and conflicts with revocation (UPDATE) and cleanup (DELETE);
 *   3. that workspace's invoice/item/address/revision rows, via the scope.
 * Writes skip lock 1, so they never wait behind (or block) other sessions.
 *
 * One transaction: lock -> revalidate -> budget -> work -> measure -> count.
 * Any failure, including a late counter update, rolls everything back.
 */
export async function runDemoSessionWrite<T>(
  prisma: PrismaClient,
  parent: interfaces.Container,
  user: UserIdAndRole,
  kind: DemoWriteKind,
  work: (scope: interfaces.Container) => Promise<T>,
): Promise<T> {
  const sessionId = user.demoSessionId;
  if (!sessionId) throw new DemoSessionWriteError("SESSION_INVALID");
  if (!demoSessionsEnabled()) throw new DemoSessionWriteError("DISABLED");
  return prisma.$transaction(
    async (tx) => {
      const locked = await tx.$executeRaw`
        SELECT 1 FROM "DemoSession" WHERE "id" = ${sessionId} FOR UPDATE`;
      if (locked !== 1) throw new DemoSessionWriteError("SESSION_INVALID");
      // A separate statement after the lock: its snapshot and clock postdate
      // any wait, so revocation/expiry/cleanup during the wait is observed.
      const [session] = await tx.$queryRaw<LockedSession[]>`
        SELECT s."userId", u."username", u."name", s."mutationCount",
          s."resetCount", s."lastResetAt", clock_timestamp() AS "now",
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

      // The scope's identity comes from the locked row, not the request.
      const result = await work(
        createTransactionScope(parent, tx, {
          id: session.userId,
          username: session.username,
          name: session.name ?? "Demo visitor",
          role: "USER",
          isDemo: true,
          demoSessionId: sessionId,
        }),
      );

      if (
        exceedsWorkspaceLimits(await measureWorkspaceUsage(tx, session.userId))
      )
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
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      maxWait: 5000,
      timeout: 10000,
    },
  );
}
