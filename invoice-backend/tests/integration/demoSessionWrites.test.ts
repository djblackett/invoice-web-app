import "reflect-metadata";
import { PrismaClient, type Prisma } from "@prisma/client";
import type { interfaces } from "inversify";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { createRequest } from "node-mocks-http";
import type { Request } from "express";
import container from "../../src/config/inversify.config";
import { ValidationException } from "../../src/config/exception.config";
import TYPES from "../../src/constants/identifiers";
import type {
  InvoiceWithCreatedBy,
  UserIdAndRole,
} from "../../src/constants/types";
import {
  DatabaseConnection,
  TransactionDatabaseConnection,
} from "../../src/database/prisma.database.connection";
import { createTransactionScope } from "../../src/database/transactionScope";
import type { IInvoiceRepo } from "../../src/repositories/InvoiceRepo";
import type { IInvoiceRevisionRepo } from "../../src/repositories/InvoiceRevisionRepo";
import type { DemoService } from "../../src/services/demo.service";
import type { InvoiceService } from "../../src/services/invoice.service";
import type { UserService } from "../../src/services/user.service";
import type { RepositoryDatabase } from "../../src/database/database.connection";
import { createContext } from "../../src/GraphQL/createContext";
import { toSnapshot } from "../../src/services/invoiceDiff";
import {
  allocateDemoSession,
  cleanupExpiredDemoSessions,
  resolveDemoSession,
} from "../../src/services/demoSession.service";
import * as demoWrites from "../../src/services/demoSessionWrite";
import {
  DemoSessionWriteError,
  runDemoSessionWrite,
  type DemoWriteKind,
} from "../../src/services/demoSessionWrite";
import { DEMO_WORKSPACE_LIMITS } from "../../src/services/demoWorkspaceQuota";
import { canonicalDemoRecords } from "../../prisma/demoWorkspace.cjs";

// Slice 3A harness. Every `work` below is test-only: it calls the ORDINARY
// repositories resolved from the coordinator's transaction scope. No route or
// resolver reaches runDemoSessionWrite; temporary sessions remain read-only.

// Slice 3B.0 seam: a test that sets `guard.lifted` disables ONLY the service
// read-only guard, so the real InvoiceService sequence can run inside the
// coordinator. Every other test, and every route, keeps the real guard.
const guard = vi.hoisted(() => ({ lifted: false }));
vi.mock("../../src/services/demoSessionPolicy", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("../../src/services/demoSessionPolicy")
    >();
  return {
    ...actual,
    requireDemoMutationAllowed: (
      user: Parameters<typeof actual.requireDemoMutationAllowed>[0],
    ) => (guard.lifted ? undefined : actual.requireDemoMutationAllowed(user)),
  };
});

const schema = `demo_writes_${randomUUID().replaceAll("-", "")}`;
const include = { items: true, clientAddress: true, senderAddress: true };
let prisma: PrismaClient;
let secondClient: PrismaClient;
let schemaUrl: string;
const ordinary = {
  id: "auth0|ordinary-writer",
  username: "ordinary-writer@example.test",
  name: "Ordinary",
  role: "USER" as const,
};

const repos = (scope: interfaces.Container) => ({
  user: scope.get<UserIdAndRole>(TYPES.UserContext),
  invoices: scope.get<IInvoiceRepo>(TYPES.IInvoiceRepo),
  revisions: scope.get<IInvoiceRevisionRepo>(TYPES.IInvoiceRevisionRepo),
});

/** The persistence sequence of InvoiceService.updateInvoice, minus its guard. */
async function editWithRevision(
  scope: interfaces.Container,
  invoiceId: string,
  clientName: string,
) {
  const { user, invoices, revisions } = repos(scope);
  const updated = await invoices.update(invoiceId, { clientName });
  await revisions.create({
    invoiceId,
    createdById: user.id,
    changeType: "edit",
    message: "slice-3a harness",
    snapshot: toSnapshot(updated),
  });
  return updated;
}

/** The persistence sequence of InvoiceService.addInvoice, minus its guard. */
async function createWithRevision(scope: interfaces.Container) {
  const { user, invoices, revisions } = repos(scope);
  const template = canonicalDemoRecords()[0]!.invoice;
  const created = (await invoices.create({
    ...template,
    id: "",
    items: template.items.map(({ id: _id, ...item }) => item),
    createdById: user.id,
    createdBy: undefined,
  } as unknown as InvoiceWithCreatedBy)) as { id: string };
  await revisions.create({
    invoiceId: created.id,
    createdById: user.id,
    changeType: "create",
    message: "slice-3a harness",
    snapshot: toSnapshot(created),
  });
  return created;
}

const write = <T>(
  user: UserIdAndRole,
  work: (scope: interfaces.Container) => Promise<T>,
  { client = prisma, kind = "mutation" as DemoWriteKind } = {},
) => runDemoSessionWrite(client, container, user, kind, work);

function gate() {
  let open!: () => void;
  const opened = new Promise<void>((resolve) => (open = resolve));
  return { opened, open };
}

async function until(condition: () => Promise<boolean>, what: string) {
  const deadline = Date.now() + 8000;
  while (!(await condition())) {
    if (Date.now() > deadline) throw new Error(`Timed out waiting: ${what}`);
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

const lockWaiters = async () =>
  (
    await prisma.$queryRaw<{ n: number }[]>`
      SELECT count(*)::int AS n FROM pg_stat_activity
      WHERE datname = current_database() AND wait_event_type = 'Lock'`
  )[0]!.n;

async function newSession() {
  const { credential } = await allocateDemoSession(prisma);
  const user = await resolveDemoSession(prisma, credential);
  if (!user) throw new Error("Session rejected");
  return user;
}

const ownInvoice = (user: UserIdAndRole, prefix = "RT3080-") =>
  prisma.invoice.findFirstOrThrow({
    where: { createdById: user.id, id: { startsWith: prefix } },
    include,
  });

const usage = (user: UserIdAndRole) =>
  prisma.demoSession.findUniqueOrThrow({
    where: { userId: user.id },
    select: {
      mutationCount: true,
      resetCount: true,
      lastResetAt: true,
    },
  });

/** Moves expiry to `ms` from database time, keeping the 24-hour lifetime check. */
async function expireIn(user: UserIdAndRole, ms: number) {
  await prisma.$executeRaw`
    UPDATE "DemoSession" SET "expiresAt" = t.e, "createdAt" = t.e - interval '24 hours'
    FROM (SELECT date_trunc('milliseconds',
      clock_timestamp() + make_interval(secs => ${ms / 1000}::double precision)) AS e) t
    WHERE "userId" = ${user.id}`;
}

const expired = async (user: UserIdAndRole) =>
  (
    await prisma.$queryRaw<{ done: boolean }[]>`
      SELECT "expiresAt" <= clock_timestamp() AS done
      FROM "DemoSession" WHERE "userId" = ${user.id}`
  )[0]!.done;

async function snapshotDatabase() {
  return {
    users: await prisma.user.findMany({ orderBy: { id: "asc" } }),
    sessions: await prisma.demoSession.findMany({ orderBy: { id: "asc" } }),
    invoices: await prisma.invoice.findMany({
      include,
      orderBy: { id: "asc" },
    }),
    items: await prisma.item.findMany({ orderBy: { id: "asc" } }),
    revisions: await prisma.invoiceRevision.findMany({
      orderBy: { id: "asc" },
    }),
    clientAddresses: await prisma.clientAddress.findMany({
      orderBy: { id: "asc" },
    }),
    senderAddresses: await prisma.senderAddress.findMany({
      orderBy: { id: "asc" },
    }),
  };
}

async function withTrigger(
  table: string,
  timing: string,
  condition: string,
  run: () => Promise<void>,
) {
  await prisma.$executeRawUnsafe(
    `CREATE FUNCTION slice3a_fail() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF ${condition} THEN RAISE EXCEPTION 'injected slice 3A failure'; END IF; RETURN COALESCE(NEW, OLD); END $$`,
  );
  await prisma.$executeRawUnsafe(
    `CREATE TRIGGER slice3a_fail ${timing} ON "${table}" FOR EACH ROW EXECUTE FUNCTION slice3a_fail()`,
  );
  try {
    await run();
  } finally {
    await prisma.$executeRawUnsafe(`DROP TRIGGER slice3a_fail ON "${table}"`);
    await prisma.$executeRawUnsafe(`DROP FUNCTION slice3a_fail()`);
  }
}

beforeAll(async () => {
  const supplied = process.env["DATABASE_URL"];
  if (!supplied) throw new Error("Explicit disposable local database required");
  const url = new URL(supplied);
  if (!["127.0.0.1", "localhost", "[::1]"].includes(url.hostname))
    throw new Error("Local PostgreSQL only");
  url.searchParams.set("schema", schema);
  schemaUrl = url.toString();
  prisma = new PrismaClient({ datasourceUrl: schemaUrl });
  secondClient = new PrismaClient({ datasourceUrl: schemaUrl });
  execFileSync(
    process.execPath,
    ["node_modules/prisma/build/index.js", "migrate", "deploy"],
    { env: { ...process.env, DATABASE_URL: schemaUrl }, stdio: "pipe" },
  );
  container.rebind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);
});
beforeEach(async () => {
  guard.lifted = false;
  vi.stubEnv("DEMO_SESSIONS_ENABLED", "true");
  await prisma.demoSession.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.user.deleteMany();
  await prisma.clientAddress.deleteMany();
  await prisma.senderAddress.deleteMany();
  await prisma.demoAllocationState.update({
    where: { id: 1 },
    data: { tokens: 10, updatedAt: new Date() },
  });
  await prisma.user.create({ data: ordinary });
});
afterAll(async () => {
  if (prisma) {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await prisma.$disconnect();
  }
  await secondClient?.$disconnect();
  vi.unstubAllEnvs();
});

describe("transaction scope", () => {
  it("binds every repository and service to the transaction, and hides the root client", async () => {
    await prisma.$transaction(async (tx) => {
      const scope = createTransactionScope(container, tx, ordinary);
      const connection = scope.get<DatabaseConnection>(DatabaseConnection);
      expect(connection).toBeInstanceOf(TransactionDatabaseConnection);
      expect(() => connection.getDatabase()).toThrow("unavailable");
      expect(() => scope.get(TYPES.PrismaClient)).toThrow("unavailable");
      // A parent-bound service resolved here still receives the scoped connection.
      const demo = scope.get<DemoService>(TYPES.DemoService) as unknown as {
        database: unknown;
      };
      expect(demo.database).toBeInstanceOf(TransactionDatabaseConnection);
    });
  });

  it("propagates one transaction through InvoiceService, InvoiceRevisionService and both repositories", async () => {
    const invoice = await prisma.invoice.create({
      data: {
        ...(({ items, clientAddress, senderAddress, ...fields }) => ({
          ...fields,
          items: { create: items.map(({ id: _id, ...i }) => i) },
          clientAddress: { create: clientAddress },
          senderAddress: { create: senderAddress },
        }))(canonicalDemoRecords()[0]!.invoice),
        status: "pending",
        id: "ordinary-scope",
        createdBy: { connect: { id: ordinary.id } },
      },
    });
    const before = await snapshotDatabase();
    // markAsPaid propagates revision failures; the scope makes it all-or-nothing.
    await withTrigger(
      "InvoiceRevision",
      "BEFORE INSERT",
      `NEW."invoiceId" = 'ordinary-scope'`,
      async () => {
        await expect(
          prisma.$transaction(async (tx) =>
            createTransactionScope(container, tx, ordinary)
              .get<InvoiceService>(TYPES.InvoiceService)
              .markAsPaid(invoice.id),
          ),
        ).rejects.toThrow();
      },
    );
    expect(await snapshotDatabase()).toEqual(before);
    await prisma.$transaction(async (tx) =>
      createTransactionScope(container, tx, ordinary)
        .get<InvoiceService>(TYPES.InvoiceService)
        .markAsPaid(invoice.id),
    );
    expect(
      (await prisma.invoice.findUniqueOrThrow({ where: { id: invoice.id } }))
        .status,
    ).toBe("paid");
    expect(
      await prisma.invoiceRevision.count({ where: { invoiceId: invoice.id } }),
    ).toBe(1);
  });
});

describe("coordinated temporary-session writes (internal harness only)", () => {
  it("commits an invoice edit and its revision together, or rolls both back when the revision write fails", async () => {
    const user = await newSession();
    const invoice = await ownInvoice(user);
    const before = await snapshotDatabase();
    await withTrigger(
      "InvoiceRevision",
      "BEFORE INSERT",
      `NEW."message" = 'slice-3a harness'`,
      async () => {
        await expect(
          write(user, (scope) =>
            editWithRevision(scope, invoice.id, "Must not persist"),
          ),
        ).rejects.toThrow();
      },
    );
    // The repository's own update transaction joined the outer one.
    expect(await snapshotDatabase()).toEqual(before);

    await write(user, (scope) =>
      editWithRevision(scope, invoice.id, "Committed together"),
    );
    expect((await ownInvoice(user)).clientName).toBe("Committed together");
    const latest = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: invoice.id },
      orderBy: { revisionNumber: "desc" },
    });
    expect(latest.revisionNumber).toBe(6);
    expect(toSnapshot(latest.snapshot).clientName).toBe("Committed together");
    expect(await usage(user)).toMatchObject({ mutationCount: 1 });
  });

  it("cannot commit partial work when `work` swallows a failed statement", async () => {
    const user = await newSession();
    const invoice = await ownInvoice(user);
    const before = await snapshotDatabase();
    await withTrigger(
      "InvoiceRevision",
      "BEFORE INSERT",
      `NEW."message" = 'slice-3a harness'`,
      async () => {
        await expect(
          write(user, async (scope) => {
            try {
              await editWithRevision(scope, invoice.id, "Swallowed");
            } catch {
              // Mirrors addInvoice/updateInvoice's best-effort revision catch.
            }
          }),
        ).rejects.toThrow();
      },
    );
    expect(await snapshotDatabase()).toEqual(before);
  });

  it("keeps the ordinary guarded services read-only inside the coordinator", async () => {
    const user = await newSession();
    const invoice = await ownInvoice(user);
    const before = await snapshotDatabase();
    await expect(
      write(user, (scope) =>
        scope
          .get<InvoiceService>(TYPES.InvoiceService)
          .updateInvoice(invoice.id, { clientName: "Guard bypass" }),
      ),
    ).rejects.toThrow("read-only");
    await expect(
      write(user, (scope) =>
        scope
          .get<InvoiceService>(TYPES.InvoiceService)
          .deleteInvoice(invoice.id),
      ),
    ).rejects.toThrow("read-only");
    expect(await snapshotDatabase()).toEqual(before);
  });

  it("runs two sessions concurrently in independent scopes that cannot see or change each other's records", async () => {
    const [a, b] = [await newSession(), await newSession()];
    const [aInvoice, bInvoice] = [await ownInvoice(a), await ownInvoice(b)];
    const holdA = gate();
    const aEntered = gate();
    const aWrite = write(a, async (scope) => {
      await editWithRevision(scope, aInvoice.id, "A edit");
      aEntered.open();
      await holdA.opened; // A keeps its session lock open
      return scope.get<UserIdAndRole>(TYPES.UserContext).id;
    });
    await aEntered.opened;
    // B completes while A is still open: no global serialization.
    const bResult = await write(
      b,
      async (scope) => {
        const invoices = scope.get<InvoiceService>(TYPES.InvoiceService);
        await expect(invoices.getInvoiceById(aInvoice.id)).rejects.toThrow(
          "Invoice not found",
        );
        expect(
          (await invoices.getInvoices()).every((i) => i.createdById === b.id),
        ).toBe(true);
        await editWithRevision(scope, bInvoice.id, "B edit");
        return scope.get<UserIdAndRole>(TYPES.UserContext).id;
      },
      { client: secondClient },
    );
    expect(bResult).toBe(b.id);
    expect((await ownInvoice(a)).clientName).not.toBe("A edit"); // uncommitted
    holdA.open();
    expect(await aWrite).toBe(a.id);
    expect((await ownInvoice(a)).clientName).toBe("A edit");
    expect((await ownInvoice(b)).clientName).toBe("B edit");
    expect(await usage(a)).toMatchObject({ mutationCount: 1 });
    expect(await usage(b)).toMatchObject({ mutationCount: 1 });
    // A scope cannot write through another session's identity either.
    await expect(
      write({ ...a, demoSessionId: b.demoSessionId! }, async () => undefined),
    ).rejects.toMatchObject({ code: "SESSION_INVALID" });
  });

  it("serializes same-session writes so two cannot both pass the invoice quota on stale counts", async () => {
    const user = await newSession();
    const extra = DEMO_WORKSPACE_LIMITS.invoices - 7 - 1; // leave room for one
    for (let i = 0; i < extra; i++)
      await prisma.$transaction((tx) =>
        createWithRevision(createTransactionScope(container, tx, user)),
      );
    expect(
      await prisma.invoice.count({ where: { createdById: user.id } }),
    ).toBe(DEMO_WORKSPACE_LIMITS.invoices - 1);
    const hold = gate();
    const entered = gate();
    const first = write(user, async (scope) => {
      await createWithRevision(scope);
      entered.open();
      await hold.opened;
    });
    await entered.opened;
    const waitingBefore = await lockWaiters();
    const second = write(user, (scope) => createWithRevision(scope), {
      client: secondClient,
    });
    await until(
      async () => (await lockWaiters()) > waitingBefore,
      "second write to queue on the session lock",
    );
    hold.open();
    const results = await Promise.allSettled([first, second]);
    expect(results[0].status).toBe("fulfilled");
    expect(results[1]).toMatchObject({
      status: "rejected",
      reason: { code: "WORKSPACE_QUOTA" },
    });
    expect(
      await prisma.invoice.count({ where: { createdById: user.id } }),
    ).toBe(DEMO_WORKSPACE_LIMITS.invoices);
    expect(await usage(user)).toMatchObject({ mutationCount: 1 });
  });

  it("enforces revision and item quotas from retained rows", async () => {
    const user = await newSession();
    const invoice = await ownInvoice(user);
    const before = await snapshotDatabase();
    const items = Array.from(
      { length: DEMO_WORKSPACE_LIMITS.itemsPerInvoice + 1 },
      (_, i) => ({ name: `Item ${i}`, price: 1, quantity: 1, total: 1 }),
    );
    await expect(
      write(user, (scope) =>
        repos(scope).invoices.update(invoice.id, { items }),
      ),
    ).rejects.toMatchObject({ code: "WORKSPACE_QUOTA" });
    expect(await snapshotDatabase()).toEqual(before);
    await write(user, (scope) =>
      repos(scope).invoices.update(invoice.id, { items: items.slice(1) }),
    );
    expect(await prisma.item.count({ where: { invoiceId: invoice.id } })).toBe(
      DEMO_WORKSPACE_LIMITS.itemsPerInvoice,
    );

    const retained = await prisma.invoiceRevision.count({
      where: { invoice: { createdById: user.id } },
    });
    const latest = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: invoice.id },
      orderBy: { revisionNumber: "desc" },
    });
    await prisma.invoiceRevision.createMany({
      data: Array.from(
        { length: DEMO_WORKSPACE_LIMITS.revisions - retained },
        (_, i) => ({
          invoiceId: invoice.id,
          revisionNumber: latest.revisionNumber + 1 + i,
          changeType: "edit",
          createdById: user.id,
          snapshot: latest.snapshot as Prisma.InputJsonValue,
        }),
      ),
    });
    await expect(
      write(user, (scope) => editWithRevision(scope, invoice.id, "201st")),
    ).rejects.toMatchObject({ code: "WORKSPACE_QUOTA" });
    expect((await ownInvoice(user)).clientName).not.toBe("201st");
    expect(await usage(user)).toMatchObject({ mutationCount: 1 });
  });

  it("allows exactly one of two concurrent writes at the last unit of mutation budget", async () => {
    const user = await newSession();
    await prisma.demoSession.update({
      where: { userId: user.id },
      data: { mutationCount: DEMO_WORKSPACE_LIMITS.mutations - 1 },
    });
    const invoice = await ownInvoice(user);
    const results = await Promise.allSettled([
      write(user, (scope) => editWithRevision(scope, invoice.id, "one")),
      write(user, (scope) => editWithRevision(scope, invoice.id, "two"), {
        client: secondClient,
      }),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(results.find((r) => r.status === "rejected")).toMatchObject({
      reason: { code: "MUTATION_BUDGET" },
    });
    expect(await usage(user)).toMatchObject({
      mutationCount: DEMO_WORKSPACE_LIMITS.mutations,
    });
    expect(
      await prisma.invoiceRevision.count({ where: { invoiceId: invoice.id } }),
    ).toBe(6);
  });

  it("rejects a write that was waiting on the session lock when the session is revoked", async () => {
    const user = await newSession();
    const invoice = await ownInvoice(user);
    // The revoking transaction holds the row lock, so the write's only
    // possible lock order is after the revocation commits. (With several
    // waiters PostgreSQL promises no FIFO order; see the next test.)
    const hold = gate();
    const revoked = gate();
    const revocation = prisma.$transaction(async (tx) => {
      await tx.demoSession.update({
        where: { userId: user.id },
        data: { revokedAt: new Date() },
      });
      revoked.open();
      await hold.opened;
    });
    await revoked.opened;
    const waiting = await lockWaiters();
    let ran = false;
    const queued = write(
      user,
      async (scope) => {
        ran = true;
        return editWithRevision(scope, invoice.id, "after revocation");
      },
      { client: secondClient },
    );
    await until(async () => (await lockWaiters()) > waiting, "queued write");
    hold.open();
    await revocation;
    await expect(queued).rejects.toMatchObject({ code: "SESSION_INVALID" });
    expect(ran).toBe(false);
    expect((await ownInvoice(user)).clientName).toBe(invoice.clientName);
    expect(await usage(user)).toMatchObject({ mutationCount: 0 });
  });

  it("makes revocation wait for an admitted write instead of interrupting it", async () => {
    const user = await newSession();
    const invoice = await ownInvoice(user);
    const hold = gate();
    const entered = gate();
    const admitted = write(user, async (scope) => {
      await editWithRevision(scope, invoice.id, "admitted");
      entered.open();
      await hold.opened;
    });
    await entered.opened;
    const waiting = await lockWaiters();
    let revokedAt: Date | null = null;
    // .then() starts it now: PrismaPromises are lazy until awaited.
    const revoke = prisma.demoSession
      .update({ where: { userId: user.id }, data: { revokedAt: new Date() } })
      .then((row) => void (revokedAt = row.revokedAt));
    await until(async () => (await lockWaiters()) > waiting, "revocation");
    expect(revokedAt).toBeNull(); // blocked behind the admitted write
    hold.open();
    await admitted;
    await revoke;
    expect(revokedAt).toBeInstanceOf(Date);
    expect((await ownInvoice(user)).clientName).toBe("admitted");
    expect(await usage(user)).toMatchObject({ mutationCount: 1 });
    await expect(write(user, async () => undefined)).rejects.toMatchObject({
      code: "SESSION_INVALID",
    });
  });

  it("rejects a write that was waiting on the session lock when the session expires", async () => {
    const user = await newSession();
    const invoice = await ownInvoice(user);
    await expireIn(user, 1500);
    const hold = gate();
    const entered = gate();
    const first = write(user, async (scope) => {
      await editWithRevision(scope, invoice.id, "admitted before expiry");
      entered.open();
      await hold.opened;
    });
    await entered.opened;
    const waiting = await lockWaiters();
    let ran = false;
    const queued = write(
      user,
      async (scope) => {
        ran = true;
        return editWithRevision(scope, invoice.id, "after expiry");
      },
      { client: secondClient },
    );
    await until(async () => (await lockWaiters()) > waiting, "queued write");
    await until(() => expired(user), "database-clock expiry");
    hold.open();
    // Admission is decided once, after the lock; the admitted write completes.
    await first;
    await expect(queued).rejects.toMatchObject({ code: "SESSION_INVALID" });
    expect(ran).toBe(false);
    expect((await ownInvoice(user)).clientName).toBe("admitted before expiry");
    await expect(write(user, async () => undefined)).rejects.toMatchObject({
      code: "SESSION_INVALID",
    });
  });

  it("cleanup skips a workspace with an admitted write, then removes everything that write committed", async () => {
    const [user, bystander] = [await newSession(), await newSession()];
    await expireIn(user, 1500);
    const hold = gate();
    const entered = gate();
    const admitted = write(user, async (scope) => {
      await createWithRevision(scope);
      entered.open();
      await hold.opened;
    });
    await entered.opened;
    await until(() => expired(user), "database-clock expiry");
    const before = await snapshotDatabase();
    expect(await cleanupExpiredDemoSessions(secondClient)).toBe(0);
    expect(await snapshotDatabase()).toEqual(before);
    hold.open();
    await admitted;
    expect(
      await prisma.invoice.count({ where: { createdById: user.id } }),
    ).toBe(8);
    const bystanderBefore = await prisma.invoice.findMany({
      where: { createdById: bystander.id },
      include,
      orderBy: { id: "asc" },
    });
    expect(await cleanupExpiredDemoSessions(prisma)).toBe(1);
    expect(
      await prisma.invoice.count({ where: { createdById: user.id } }),
    ).toBe(0);
    expect(
      await prisma.invoiceRevision.count({ where: { createdById: user.id } }),
    ).toBe(0);
    expect(await prisma.user.count({ where: { id: user.id } })).toBe(0);
    // Including the addresses created by the admitted write: no orphans.
    expect(
      await prisma.clientAddress.count({ where: { Invoice: { is: null } } }),
    ).toBe(0);
    expect(
      await prisma.senderAddress.count({ where: { Invoice: { is: null } } }),
    ).toBe(0);
    expect(
      await prisma.invoice.findMany({
        where: { createdById: bystander.id },
        include,
        orderBy: { id: "asc" },
      }),
    ).toEqual(bystanderBefore);
  });

  it("rejects a write queued behind cleanup without leaving any workspace rows", async () => {
    const user = await newSession();
    await expireIn(user, 0);
    let ran = false;
    let queued: Promise<unknown> | undefined;
    // Slow cleanup's final delete so the write provably queues behind it.
    await prisma.$executeRawUnsafe(
      `CREATE FUNCTION slice3a_slow() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN PERFORM pg_sleep(1); RETURN OLD; END $$`,
    );
    await prisma.$executeRawUnsafe(
      `CREATE TRIGGER slice3a_slow BEFORE DELETE ON "User" FOR EACH ROW EXECUTE FUNCTION slice3a_slow()`,
    );
    try {
      const cleanup = cleanupExpiredDemoSessions(prisma);
      await until(
        async () =>
          (
            await secondClient.$queryRaw<{ n: number }[]>`
              SELECT count(*)::int AS n FROM pg_stat_activity
              WHERE datname = current_database() AND wait_event = 'PgSleep'`
          )[0]!.n > 0,
        "cleanup to hold the session lock",
      );
      queued = write(
        user,
        async () => {
          ran = true;
        },
        { client: secondClient },
      );
      expect(await cleanup).toBe(1);
      await expect(queued).rejects.toMatchObject({
        code: "SESSION_INVALID",
      });
    } finally {
      await queued?.catch(() => undefined);
      await prisma.$executeRawUnsafe(`DROP TRIGGER slice3a_slow ON "User"`);
      await prisma.$executeRawUnsafe(`DROP FUNCTION slice3a_slow()`);
    }
    expect(ran).toBe(false);
    expect(
      await prisma.invoice.count({ where: { createdById: user.id } }),
    ).toBe(0);
    expect(await prisma.demoSession.count()).toBe(0);
  });

  it("rolls back invoice, item, address, revision and usage changes on a deliberate late failure", async () => {
    const user = await newSession();
    const invoice = await ownInvoice(user);
    const before = await snapshotDatabase();
    // The coordinator's usage update is its last statement before commit.
    await withTrigger(
      "DemoSession",
      "BEFORE UPDATE",
      `NEW."mutationCount" <> OLD."mutationCount"`,
      async () => {
        await expect(
          write(user, async (scope) => {
            await createWithRevision(scope);
            await editWithRevision(scope, invoice.id, "late failure");
            await repos(scope).invoices.update(invoice.id, {
              items: [{ name: "Replacement", price: 2, quantity: 2, total: 4 }],
            });
          }),
        ).rejects.toThrow("injected slice 3A failure");
      },
    );
    expect(await snapshotDatabase()).toEqual(before);
  });

  it("enforces reset cooldown and lifetime allowance, and reset never replenishes the mutation budget", async () => {
    const user = await newSession();
    const reset = (scope: interfaces.Container) =>
      // Stand-in for a future workspace restore: replace current invoices.
      repos(scope).invoices.deleteInvoicesByUserId(
        scope.get<UserIdAndRole>(TYPES.UserContext).id,
      );
    await write(user, reset, { kind: "reset" });
    const afterFirst = await usage(user);
    expect(afterFirst).toMatchObject({ mutationCount: 1, resetCount: 1 });
    expect(afterFirst.lastResetAt).toBeInstanceOf(Date);
    await expect(write(user, reset, { kind: "reset" })).rejects.toMatchObject({
      code: "RESET_COOLDOWN",
    });
    expect(await usage(user)).toEqual(afterFirst);
    // Ordinary mutations are not subject to the reset cooldown.
    await write(user, async () => undefined);
    await prisma.demoSession.update({
      where: { userId: user.id },
      data: {
        lastResetAt: new Date(
          afterFirst.lastResetAt!.getTime() -
            DEMO_WORKSPACE_LIMITS.resetCooldownMs,
        ),
      },
    });
    await write(user, reset, { kind: "reset" });
    expect(await usage(user)).toMatchObject({
      mutationCount: 3,
      resetCount: 2,
    });
    await prisma.demoSession.update({
      where: { userId: user.id },
      data: {
        resetCount: DEMO_WORKSPACE_LIMITS.resets,
        lastResetAt: new Date(0),
      },
    });
    await expect(write(user, reset, { kind: "reset" })).rejects.toMatchObject({
      code: "RESET_ALLOWANCE",
    });
    await prisma.demoSession.update({
      where: { userId: user.id },
      data: { resetCount: 0, lastResetAt: null },
    });
    await prisma.demoSession.update({
      where: { userId: user.id },
      data: { mutationCount: DEMO_WORKSPACE_LIMITS.mutations },
    });
    await expect(write(user, reset, { kind: "reset" })).rejects.toMatchObject({
      code: "MUTATION_BUDGET",
    });
  });

  it("fails closed when disabled, for non-session identities, and for mismatched identities", async () => {
    const user = await newSession();
    let ran = false;
    const work = async () => {
      ran = true;
    };
    for (const flag of [undefined, "false", "TRUE", "1", ""]) {
      vi.stubEnv("DEMO_SESSIONS_ENABLED", flag);
      await expect(write(user, work)).rejects.toMatchObject({
        code: "DISABLED",
      });
    }
    vi.stubEnv("DEMO_SESSIONS_ENABLED", "true");
    const { demoSessionId: _sessionId, ...withoutSession } = user;
    for (const identity of [
      ordinary,
      withoutSession,
      { ...user, demoSessionId: randomUUID() },
      { ...user, id: "demo-session:other" },
      { ...ordinary, demoSessionId: user.demoSessionId! },
    ])
      await expect(write(identity, work)).rejects.toBeInstanceOf(
        DemoSessionWriteError,
      );
    expect(ran).toBe(false);
    expect(await usage(user)).toMatchObject({ mutationCount: 0 });
  });
});

describe("Slice 3B.0 mutation safety (internal harness only)", () => {
  const orphans = async () =>
    (
      await prisma.$queryRaw<{ client: number; sender: number }[]>`
        SELECT
          (SELECT count(*)::int FROM "ClientAddress" a WHERE NOT EXISTS
            (SELECT 1 FROM "Invoice" i WHERE i."clientAddressId" = a."id"))
            AS "client",
          (SELECT count(*)::int FROM "SenderAddress" a WHERE NOT EXISTS
            (SELECT 1 FROM "Invoice" i WHERE i."senderAddressId" = a."id"))
            AS "sender"`
    )[0]!;
  const ordinaryRows = () =>
    prisma.invoice.findMany({
      where: { createdById: ordinary.id },
      include: { ...include, revisions: { orderBy: { id: "asc" } } },
      orderBy: { id: "asc" },
    });
  async function ordinaryInvoice(id = "OR0001") {
    const { items, clientAddress, senderAddress, ...fields } =
      canonicalDemoRecords()[1]!.invoice;
    return prisma.invoice.create({
      data: {
        ...fields,
        id,
        createdBy: { connect: { id: ordinary.id } },
        items: { create: items.map((i) => ({ ...i, id: randomUUID() })) },
        clientAddress: { create: clientAddress },
        senderAddress: { create: senderAddress },
      },
      include,
    });
  }
  const template = () => {
    const { items, ...fields } = canonicalDemoRecords()[0]!.invoice;
    return { ...fields, items: items.map(({ id: _item, ...i }) => i) };
  };
  const removeOwn = (user: UserIdAndRole, invoiceId: string) =>
    write(user, (scope) => repos(scope).invoices.delete(invoiceId));
  /** Holds the session row lock from another connection until released. */
  async function holdSessionLock(user: UserIdAndRole) {
    const release = gate();
    const held = gate();
    const holder = secondClient.$transaction(
      async (tx) => {
        await tx.$executeRaw`
          SELECT 1 FROM "DemoSession" WHERE "userId" = ${user.id} FOR UPDATE`;
        held.open();
        await release.opened;
      },
      { timeout: 20_000 },
    );
    await held.opened;
    return async () => {
      release.open();
      await holder;
    };
  }

  describe("D1: address cleanup inside the transaction scope", () => {
    it("deletes a workspace invoice with both addresses, items and revisions, preserving other users' rows", async () => {
      const user = await newSession();
      await ordinaryInvoice();
      const others = await ordinaryRows();
      const target = await ownInvoice(user);
      expect(target.clientAddressId).not.toBeNull();
      expect(target.senderAddressId).not.toBeNull();
      expect(await removeOwn(user, target.id)).toBe(true);
      expect(await prisma.invoice.count({ where: { id: target.id } })).toBe(0);
      expect(await prisma.item.count({ where: { invoiceId: target.id } })).toBe(
        0,
      );
      expect(
        await prisma.invoiceRevision.count({ where: { invoiceId: target.id } }),
      ).toBe(0);
      expect(
        await prisma.clientAddress.count({
          where: { id: target.clientAddressId! },
        }),
      ).toBe(0);
      expect(
        await prisma.senderAddress.count({
          where: { id: target.senderAddressId! },
        }),
      ).toBe(0);
      expect(await orphans()).toEqual({ client: 0, sender: 0 });
      expect(await ordinaryRows()).toEqual(others);
      expect(await usage(user)).toMatchObject({ mutationCount: 1 });
    });

    it("leaves no orphan addresses after repeated create/delete cycles", async () => {
      const user = await newSession();
      await ordinaryInvoice();
      const others = await ordinaryRows();
      const addresses = async () => [
        await prisma.clientAddress.count(),
        await prisma.senderAddress.count(),
      ];
      const baseline = await addresses();
      for (let cycle = 0; cycle < 5; cycle++) {
        const created = await write(user, createWithRevision);
        expect(await addresses()).toEqual(baseline.map((n) => n + 1));
        expect(await removeOwn(user, created.id)).toBe(true);
        expect(await addresses()).toEqual(baseline);
        expect(await orphans()).toEqual({ client: 0, sender: 0 });
      }
      expect(await ordinaryRows()).toEqual(others);
      expect(await usage(user)).toMatchObject({ mutationCount: 10 });
    });

    it("rolls back the invoice, cascades, first address cleanup and usage when the second cleanup fails", async () => {
      const user = await newSession();
      const target = await ownInvoice(user);
      const before = await snapshotDatabase();
      await withTrigger("SenderAddress", "BEFORE DELETE", "TRUE", async () => {
        await expect(removeOwn(user, target.id)).rejects.toThrow(
          "injected slice 3A failure",
        );
      });
      expect(await snapshotDatabase()).toEqual(before);
    });

    it("makes a concurrent attachment of a captured address wait, then fail, without touching its invoice", async () => {
      const user = await newSession();
      const target = await ownInvoice(user);
      const other = await ordinaryInvoice();
      const hold = gate();
      const deleted = gate();
      const deletion = write(user, async (scope) => {
        await repos(scope).invoices.delete(target.id);
        deleted.open();
        await hold.opened;
      });
      await deleted.opened;
      const waiting = await lockWaiters();
      const attach = prisma.$executeRaw`
        UPDATE "Invoice" SET "clientAddressId" = ${target.clientAddressId}
        WHERE "id" = ${other.id}`;
      const attached = attach.then(
        () => "attached",
        (e: unknown) => e,
      );
      await until(async () => (await lockWaiters()) > waiting, "attachment");
      hold.open();
      await deletion;
      expect(String(await attached)).toMatch(/foreign key/i);
      expect(
        await prisma.invoice.findUniqueOrThrow({
          where: { id: other.id },
          include,
        }),
      ).toEqual(other);
      expect(
        await prisma.clientAddress.count({
          where: { id: target.clientAddressId! },
        }),
      ).toBe(0);
      expect(await orphans()).toEqual({ client: 0, sender: 0 });
    });

    it("keeps captured addresses that the same transaction re-attaches before the reference check", async () => {
      const user = await newSession();
      const target = await ownInvoice(user);
      const other = await ordinaryInvoice();
      await prisma.$executeRawUnsafe(`
        CREATE FUNCTION slice3b_transfer() RETURNS trigger AS $$
        BEGIN
          UPDATE "Invoice" SET "clientAddressId" = OLD."clientAddressId",
            "senderAddressId" = OLD."senderAddressId" WHERE id = '${other.id}';
          RETURN OLD;
        END; $$ LANGUAGE plpgsql`);
      await prisma.$executeRawUnsafe(`
        CREATE TRIGGER slice3b_transfer AFTER DELETE ON "Invoice"
        FOR EACH ROW WHEN (OLD."id" = '${target.id}')
        EXECUTE FUNCTION slice3b_transfer()`);
      try {
        expect(await removeOwn(user, target.id)).toBe(true);
      } finally {
        await prisma.$executeRawUnsafe(
          `DROP TRIGGER slice3b_transfer ON "Invoice"`,
        );
        await prisma.$executeRawUnsafe(`DROP FUNCTION slice3b_transfer()`);
      }
      expect(
        await prisma.invoice.findUniqueOrThrow({
          where: { id: other.id },
          include,
        }),
      ).toMatchObject({
        createdById: ordinary.id,
        clientAddressId: target.clientAddressId,
        senderAddressId: target.senderAddressId,
        clientAddress: target.clientAddress,
        senderAddress: target.senderAddress,
      });
    });
  });

  describe("D3: mandatory revisions in coordinated writes", () => {
    it("propagates a non-database revision failure from addInvoice and updateInvoice, committing neither the change nor usage", async () => {
      guard.lifted = true;
      const user = await newSession();
      const invoice = await ownInvoice(user);
      const before = await snapshotDatabase();
      const withFailingHistory = (scope: interfaces.Container) => {
        scope.rebind(TYPES.InvoiceRevisionService).toConstantValue({
          recordIfChanged: () =>
            Promise.reject(new Error("non-database revision failure")),
        });
        return scope.get<InvoiceService>(TYPES.InvoiceService);
      };
      await expect(
        write(user, (scope) =>
          withFailingHistory(scope).updateInvoice(invoice.id, {
            clientName: "Edited without history",
          }),
        ),
      ).rejects.toThrow();
      await expect(
        write(user, (scope) =>
          withFailingHistory(scope).addInvoice(template() as never),
        ),
      ).rejects.toThrow();
      expect(await snapshotDatabase()).toEqual(before);

      // Control: the same service calls commit WITH history when it succeeds.
      await write(user, (scope) =>
        scope
          .get<InvoiceService>(TYPES.InvoiceService)
          .updateInvoice(invoice.id, { clientName: "Edited with history" }),
      );
      const created = await write(user, (scope) =>
        scope
          .get<InvoiceService>(TYPES.InvoiceService)
          .addInvoice(template() as never),
      );
      expect(
        await prisma.invoiceRevision.count({
          where: { invoiceId: invoice.id },
        }),
      ).toBe(6);
      expect(
        await prisma.invoiceRevision.count({
          where: { invoiceId: created.id },
        }),
      ).toBe(1);
      expect(await usage(user)).toMatchObject({ mutationCount: 2 });
    });
  });

  describe("D4/D5: input bounds and server-controlled identifiers", () => {
    it("rejects oversized or malformed input before taking the session lock or touching the database", async () => {
      const { runDemoInvoiceWrite } = demoWrites;
      const user = await newSession();
      const own = await ownInvoice(user);
      const before = await snapshotDatabase();
      const release = await holdSessionLock(user);
      const waiting = await lockWaiters();
      const transactions = vi.spyOn(prisma, "$transaction");
      const item = { name: "Item", price: 10, quantity: 1 };
      const invalid: Parameters<typeof runDemoInvoiceWrite>[3][] = [
        { invoice: { ...template(), items: Array(21).fill(item) } },
        { invoice: { ...template(), clientName: "x".repeat(101) } },
        {
          invoice: {
            ...template(),
            items: [{ ...item, name: "x".repeat(101) }],
          },
        },
        {
          invoice: {
            clientAddress: { ...own.clientAddress!, street: "x".repeat(121) },
          },
        },
        { invoice: { items: [{ ...item, price: Number.NaN }] } },
        { invoice: { items: [{ ...item, price: -1 }] } },
        { invoice: { items: [{ ...item, price: 1e12 }] } },
        { invoice: { items: [{ ...item, quantity: 1.5 }] } },
        { invoice: { items: [{ ...item, quantity: -1 }] } },
        { invoice: { items: [{ ...item, quantity: 1e9 }] } },
        { invoice: { paymentTerms: 1e6 } },
        { invoice: { items: [{ ...item, id: "OR0001-item" }] } },
        { invoice: { items: [{ ...item, id: "x".repeat(10_000) }] } },
        { invoice: { clientName: 42 as never } },
        { invoice: { items: "not-a-list" as never } },
        { invoiceId: "x".repeat(10_000) },
        { invoiceId: own.id, revisionId: "x".repeat(10_000) },
      ];
      let ran = 0;
      try {
        for (const request of invalid) {
          await expect(
            runDemoInvoiceWrite(prisma, container, user, request, async () => {
              ran++;
            }),
          ).rejects.toBeInstanceOf(ValidationException);
        }
        expect(transactions).not.toHaveBeenCalled();
        expect(await lockWaiters()).toBe(waiting);
      } finally {
        transactions.mockRestore();
        await release();
      }
      expect(ran).toBe(0);
      expect(await snapshotDatabase()).toEqual(before);
    });

    it("never lets client IDs collide with, or reveal, another user's invoice or item", async () => {
      guard.lifted = true;
      const { runDemoInvoiceWrite } = demoWrites;
      const user = await newSession();
      const own = await ownInvoice(user);
      const other = await ordinaryInvoice("OR0001");
      const others = await ordinaryRows();
      const visible =
        /^[A-Z]{2}\d{4}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

      // Repository level, even if a caller skipped input preparation.
      const direct = (await write(user, (scope) =>
        repos(scope).invoices.create({
          ...template(),
          id: other.id,
          createdById: user.id,
        } as unknown as InvoiceWithCreatedBy),
      )) as { id: string };
      expect(direct.id).toMatch(visible);

      // Service path through the pre-lock preparation: `id` never arrives.
      const viaService = await runDemoInvoiceWrite(
        prisma,
        container,
        user,
        { invoice: { ...template(), id: other.id } },
        (scope, { invoice }) =>
          scope
            .get<InvoiceService>(TYPES.InvoiceService)
            .addInvoice(invoice as never),
      );
      expect(viaService.id).toMatch(visible);

      // A foreign item ID and an unused one behave identically: a new item
      // with a server ID; the foreign item is untouched.
      for (const foreign of [other.items[0]!.id, randomUUID()]) {
        const edited = await runDemoInvoiceWrite(
          prisma,
          container,
          user,
          {
            invoiceId: own.id,
            invoice: {
              items: [{ id: foreign, name: "Probe", price: 1, quantity: 1 }],
            },
          },
          (scope, { invoiceId, invoice }) =>
            scope
              .get<InvoiceService>(TYPES.InvoiceService)
              .updateInvoice(invoiceId!, invoice!) as Promise<{
              items: { id: string }[];
            }>,
        );
        expect(edited.items).toHaveLength(1);
        expect(edited.items[0]!.id).not.toBe(foreign);
      }
      // A kept item of the visitor's own invoice keeps its ID.
      const current = await ownInvoice(user);
      const kept = await runDemoInvoiceWrite(
        prisma,
        container,
        user,
        {
          invoiceId: own.id,
          invoice: {
            items: [
              { id: current.items[0]!.id, name: "Kept", price: 2, quantity: 1 },
            ],
          },
        },
        (scope, { invoiceId, invoice }) =>
          scope
            .get<InvoiceService>(TYPES.InvoiceService)
            .updateInvoice(invoiceId!, invoice!) as Promise<{
            items: { id: string }[];
          }>,
      );
      expect(kept.items.map((i) => i.id)).toEqual([current.items[0]!.id]);
      expect(await ordinaryRows()).toEqual(others);
      expect(await usage(user)).toMatchObject({ mutationCount: 5 });
    });
  });

  it("D7: resolves UserService against the transaction even when the parent is a request container", async () => {
    const { credential } = await allocateDemoSession(prisma);
    const ctx = await createContext({
      req: createRequest<Request>({
        headers: { authorization: `Bearer ${credential}` },
      }),
    });
    expect(ctx.user?.demoSessionId).toBeTruthy();
    const seen = await runDemoSessionWrite(
      prisma,
      ctx.container!,
      ctx.user!,
      "mutation",
      async (scope) => {
        const tx = scope.get<RepositoryDatabase>(DatabaseConnection).client;
        await tx.user.update({
          where: { id: ctx.user!.id },
          data: { name: "Uncommitted name" },
        });
        // Only the transaction itself can see its uncommitted change.
        const users = scope.get<UserService>(TYPES.UserService);
        return (await users.getUserByIdSafely(ctx.user!.id))?.name;
      },
    );
    expect(seen).toBe("Uncommitted name");
  });

  it("D8: rechecks the feature flag after acquiring the session lock", async () => {
    const user = await newSession();
    const release = await holdSessionLock(user);
    const waiting = await lockWaiters();
    let ran = false;
    const queued = write(
      user,
      async () => {
        ran = true;
      },
      { client: prisma },
    );
    const outcome = queued.then(
      () => "committed",
      (e: unknown) => e,
    );
    try {
      await until(async () => (await lockWaiters()) > waiting, "queued write");
      vi.stubEnv("DEMO_SESSIONS_ENABLED", "false");
    } finally {
      await release();
    }
    expect(await outcome).toMatchObject({ code: "DISABLED" });
    expect(ran).toBe(false);
    expect(await usage(user)).toMatchObject({ mutationCount: 0 });
  });

  it("bounds same-session lock waits so a burst cannot hold a small connection pool", async () => {
    const url = new URL(schemaUrl);
    url.searchParams.set("connection_limit", "2");
    const small = new PrismaClient({ datasourceUrl: url.toString() });
    const [user, neighbour] = [await newSession(), await newSession()];
    const hold = gate();
    const entered = gate();
    const holder = write(user, async () => {
      entered.open();
      await hold.opened;
    });
    try {
      await entered.opened;
      let ran = 0;
      const started = Date.now();
      const burst = await Promise.allSettled(
        Array.from({ length: 4 }, () =>
          write(
            user,
            async () => {
              ran++;
            },
            { client: small },
          ),
        ),
      );
      const burstMs = Date.now() - started;
      expect(
        burst.map((r) => r.status === "rejected" && r.reason.code),
      ).toEqual(Array(4).fill("SESSION_BUSY"));
      expect(ran).toBe(0);
      expect(burstMs).toBeLessThan(4 * 2000 + 2000);
      // The pool is free again for another visitor while the lock is still held.
      await write(neighbour, async () => undefined, { client: small });
      expect(await usage(neighbour)).toMatchObject({ mutationCount: 1 });
    } finally {
      hold.open();
      await holder.catch(() => undefined);
      await small.$disconnect();
    }
    await holder;
    expect(await usage(user)).toMatchObject({ mutationCount: 1 });
  }, 30_000);
});

describe("ordinary users outside any scope (unchanged behaviour)", () => {
  it("still uses independent repository transactions and best-effort revision recording", async () => {
    const scope = container.createChild();
    scope.bind<UserIdAndRole>(TYPES.UserContext).toConstantValue(ordinary);
    const { InvoiceService: Service } = await import(
      "../../src/services/invoice.service"
    );
    const { InvoiceRevisionService } = await import(
      "../../src/services/invoiceRevision.service"
    );
    scope.bind(TYPES.InvoiceService).to(Service);
    scope.bind(TYPES.InvoiceRevisionService).to(InvoiceRevisionService);
    const service = scope.get<InvoiceService>(TYPES.InvoiceService);
    const template = canonicalDemoRecords()[0]!.invoice;
    const created = await service.addInvoice({
      ...template,
      id: "",
      items: template.items.map(({ id: _id, ...item }) => item),
    } as never);
    expect(
      await prisma.invoiceRevision.count({ where: { invoiceId: created.id } }),
    ).toBe(1);
    // Characterization, not endorsement: an ordinary edit still commits when
    // its separate revision write fails (Slice 3B prerequisite in the report).
    await withTrigger(
      "InvoiceRevision",
      "BEFORE INSERT",
      `NEW."invoiceId" = '${created.id}'`,
      async () => {
        const updated = await service.updateInvoice(created.id, {
          clientName: "Ordinary edit",
        });
        expect(updated).toMatchObject({ clientName: "Ordinary edit" });
      },
    );
    expect(
      (await prisma.invoice.findUniqueOrThrow({ where: { id: created.id } }))
        .clientName,
    ).toBe("Ordinary edit");
    expect(
      await prisma.invoiceRevision.count({ where: { invoiceId: created.id } }),
    ).toBe(1);
  });
});
