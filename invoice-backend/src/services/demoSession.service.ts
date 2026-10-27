import { createHash, randomBytes, randomUUID } from "node:crypto";
import { Prisma, type PrismaClient } from "@prisma/client";
import { canonicalDemoRecords } from "../../prisma/demoWorkspace.cjs";
import type { UserIdAndRole } from "../constants/types";
import {
  DEMO_SESSION_TOKEN_PREFIX,
  DEMO_SESSION_USER_PREFIX,
  demoSessionsEnabled,
} from "./demoSessionPolicy";

export const DEMO_SESSION_LIFETIME_MS = 24 * 60 * 60 * 1000;
export const DEMO_SESSION_CAPACITY = 100;
export const DEMO_ALLOCATION_BURST = 10;
export const DEMO_ALLOCATION_REFILL_MS = 60_000;

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

export async function allocateDemoSession(prisma: PrismaClient) {
  if (!demoSessionsEnabled()) throw new DemoSessionError("DISABLED");
  const credential =
    DEMO_SESSION_TOKEN_PREFIX + randomBytes(32).toString("hex");
  const userId = DEMO_SESSION_USER_PREFIX + randomUUID();
  return prisma.$transaction(
    async (tx) => {
      await lockWorkspaces(tx);
      if (!demoSessionsEnabled()) throw new DemoSessionError("DISABLED");
      const now = await databaseNow(tx);
      // Count ALL retained sessions, including expired and revoked ones.
      if ((await tx.demoSession.count()) >= DEMO_SESSION_CAPACITY)
        throw new DemoSessionError("CAPACITY");
      const gate = await tx.demoAllocationState.findUniqueOrThrow({
        where: { id: 1 },
      });
      const tokens = Math.min(
        DEMO_ALLOCATION_BURST,
        gate.tokens +
          Math.max(0, now.getTime() - gate.updatedAt.getTime()) /
            DEMO_ALLOCATION_REFILL_MS,
      );
      if (tokens < 1) throw new DemoSessionError("RATE_LIMITED");
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
      for (const record of canonicalDemoRecords()) {
        const invoiceId = `${record.id}-${randomUUID()}`;
        // One mapping across current items AND historical-only items. Never leave
        // a canonical/shared item ID inside an otherwise isolated snapshot.
        const itemIds = new Map<string, string>();
        const remap = (snapshot: typeof record.invoice) => ({
          ...snapshot,
          items: snapshot.items.map((item) => {
            let id = itemIds.get(item.id);
            if (!id) {
              id = randomUUID();
              itemIds.set(item.id, id);
            }
            return { ...item, id };
          }),
        });
        const { items, clientAddress, senderAddress, ...fields } = remap(
          record.invoice,
        );
        await tx.invoice.create({
          data: {
            ...fields,
            id: invoiceId,
            createdBy: { connect: { id: userId } },
            items: { create: items },
            clientAddress: { create: clientAddress },
            senderAddress: { create: senderAddress },
          },
        });
        await tx.invoiceRevision.createMany({
          data: record.snapshots.map((snapshot, index) => ({
            id: randomUUID(),
            invoiceId,
            revisionNumber: index + 1,
            createdById: userId,
            changeType: index === 0 ? "create" : "edit",
            message:
              record.id === "RT3080"
                ? ([
                    "Initial draft created",
                    "Added logo design deliverable",
                    "Increased brand guidelines price",
                    "Sent to client, pending payment",
                    "Marked as paid",
                  ].at(index) ?? "Invoice created")
                : "Invoice created",
            createdAt: new Date(Date.UTC(2021, 7, 18, 12, index)),
            snapshot: remap(snapshot) as unknown as Prisma.InputJsonObject,
          })),
        });
      }
      return { credential, expiresAt: session.expiresAt };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      maxWait: 5000,
      timeout: 15000,
    },
  );
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

// Operator/service primitive only; no public cleanup route or scheduled worker.
// Same lock as allocation; one bounded batch, entirely transactional.
export async function cleanupExpiredDemoSessions(
  prisma: PrismaClient,
): Promise<number> {
  return prisma.$transaction(
    async (tx) => {
      await lockWorkspaces(tx);
      const now = await databaseNow(tx);
      const sessions = await tx.demoSession.findMany({
        where: { expiresAt: { lte: now } },
        orderBy: { expiresAt: "asc" },
        take: 10,
      });
      for (const session of sessions) {
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
          throw new Error(
            "Demo user referenced by a foreign revision; cleanup refused",
          );
        const invoices = await tx.invoice.findMany({
          where: { createdById: session.userId },
          select: { clientAddressId: true, senderAddressId: true },
        });
        await tx.invoice.deleteMany({ where: { createdById: session.userId } });
        await tx.clientAddress.deleteMany({
          where: {
            id: {
              in: invoices.flatMap((i) =>
                i.clientAddressId === null ? [] : [i.clientAddressId],
              ),
            },
            Invoice: { is: null },
          },
        });
        await tx.senderAddress.deleteMany({
          where: {
            id: {
              in: invoices.flatMap((i) =>
                i.senderAddressId === null ? [] : [i.senderAddressId],
              ),
            },
            Invoice: { is: null },
          },
        });
        await tx.demoSession.delete({ where: { id: session.id } });
        await tx.user.delete({ where: { id: session.userId } });
      }
      return sessions.length;
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      maxWait: 5000,
      timeout: 15000,
    },
  );
}
