import "reflect-metadata";
import { PrismaClient, type Prisma } from "@prisma/client";
import { execFileSync } from "node:child_process";
import {
  createHash,
  generateKeyPairSync,
  randomUUID,
  type KeyObject,
} from "node:crypto";
import { createServer, type Server } from "node:http";
import { createClient } from "graphql-ws";
import WebSocket from "ws";
import jwt from "jsonwebtoken";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  canonicalDemoRecords,
  DEMO_ID,
  resetDemoWorkspace,
} from "../../prisma/demoWorkspace.cjs";
import { toSnapshot } from "../../src/services/invoiceDiff";
import {
  cleanupExpiredDemoSessions,
  cleanupExpiredDemoSessionsReport,
  DEMO_ALLOCATION_CLEANUP_BATCH,
  DEMO_SESSION_CAPACITY,
  DEMO_SESSION_LIFETIME_MS,
  resolveDemoSession,
} from "../../src/services/demoSession.service";
import { DEMO_WORKSPACE_LIMITS } from "../../src/services/demoWorkspaceQuota";

// Slice 3C: temporary-session reset, bounded cleanup and stale-credential
// errors, through the PRODUCTION wiring (`createServer`) with real fetch and
// WebSocket clients, signed local Auth0 tokens and disposable PostgreSQL. Each
// request carries its own X-Forwarded-For so the production per-IP limiter
// never interferes with the assertions.

const schema = `demo_lifecycle_${randomUUID().replaceAll("-", "")}`;
const include = { items: true, clientAddress: true, senderAddress: true };
let prisma: PrismaClient;
let secondClient: PrismaClient;
let jwks: Server;
let realServer: Server;
let baseUrl: string;
let issuer: string;
let privateKey: KeyObject;

const ordinary = {
  id: "auth0|ordinary",
  username: "ordinary@example.test",
  name: "Ordinary",
  role: "USER" as const,
};
const admin = {
  id: "auth0|admin",
  username: "admin@example.test",
  name: "Admin",
};

const FIELDS = `id status clientName paymentTerms total
  items { id name price quantity total }
  clientAddress { street city postCode country }
  senderAddress { street city postCode country }`;
const RESET = "mutation { resetDemoSession }";
const LIST = `{ allInvoices { ${FIELDS} } }`;
const EDIT = `mutation ($id: String, $clientName: String) {
  editInvoice(id: $id, clientName: $clientName) { ${FIELDS} } }`;
const PAY = `mutation ($id: String!) { markAsPaid(id: $id) { ${FIELDS} } }`;
const REMOVE = `mutation ($id: String!) { removeInvoice(id: $id) { acknowledged } }`;
const RESTORE = `mutation ($invoiceId: String!, $revisionId: String!) {
  restoreInvoiceRevision(invoiceId: $invoiceId, revisionId: $revisionId) { ${FIELDS} } }`;
const ADD = `mutation ($clientName: String) {
  addInvoice(clientName: $clientName, status: "draft") { id } }`;

interface GraphQLResult {
  data?: Record<string, unknown> | null;
  errors?: { message: string; extensions?: Record<string, unknown> }[];
}

let clientIp = 0;
const nextIp = () => {
  clientIp++;
  return `10.${(clientIp >> 16) & 255}.${(clientIp >> 8) & 255}.${clientIp & 255}`;
};

async function post(token: string | null, body: unknown, ip = nextIp()) {
  const response = await fetch(`${baseUrl}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "X-Forwarded-For": ip,
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  return {
    status: response.status,
    text,
    body: JSON.parse(text) as GraphQLResult,
  };
}
async function gql(
  token: string | null,
  query: string,
  variables: Record<string, unknown> = {},
): Promise<GraphQLResult> {
  return (await post(token, { query, variables })).body;
}
const failure = (result: GraphQLResult) => {
  expect(result.errors).toHaveLength(1);
  const [error] = result.errors!;
  return {
    // Apollo prefixes errors thrown while building the context when it does
    // not recognise them as its own GraphQLError, which happens under vitest's
    // duplicated `graphql` module (the compiled build is a single CJS copy).
    message: error!.message.replace(/^Context creation failed: /, ""),
    code: error!.extensions?.["code"],
    ...(error!.extensions?.["quota"]
      ? { quota: error!.extensions["quota"] }
      : {}),
  };
};
const code = (result: GraphQLResult) =>
  result.errors ? (failure(result).code as string) : "ok";

function signedToken(
  profile: { id: string; username: string; name: string },
  roles: string[] = [],
) {
  return jwt.sign(
    {
      sub: profile.id,
      name: profile.name,
      "invoice-web-app/email": profile.username,
      "invoice-web-app/roles": roles,
    },
    privateKey,
    {
      algorithm: "RS256",
      keyid: "local-key",
      audience: "urn:temporary-demo",
      issuer,
    },
  );
}

/** A visitor bootstrapped through the real HTTP endpoint. */
async function visitor() {
  const response = await fetch(`${baseUrl}/demo/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Forwarded-For": nextIp(),
    },
    body: "{}",
  });
  expect(response.status).toBe(201);
  const { credential } = (await response.json()) as { credential: string };
  const user = await resolveDemoSession(prisma, credential);
  if (!user) throw new Error("Session rejected");
  return { token: credential, id: user.id, sessionId: user.demoSessionId! };
}
type Visitor = Awaited<ReturnType<typeof visitor>>;

const CANONICAL = canonicalDemoRecords();
const CANONICAL_PREFIXES = CANONICAL.map((r) => r.id).sort();
const CANONICAL_REVISIONS = CANONICAL.reduce(
  (n, r) => n + r.snapshots.length,
  0,
);

const ownInvoice = (userId: string, prefix: string) =>
  prisma.invoice.findFirstOrThrow({
    where: { createdById: userId, id: { startsWith: `${prefix}-` } },
    include,
  });
const session = (userId: string) =>
  prisma.demoSession.findUniqueOrThrow({ where: { userId } });
const counters = async (userId: string) => {
  const { mutationCount, resetCount, lastResetAt, attemptCount } =
    await session(userId);
  return { mutationCount, resetCount, lastResetAt, attemptCount };
};
const orphanAddresses = async () =>
  (await prisma.clientAddress.count({ where: { Invoice: { is: null } } })) +
  (await prisma.senderAddress.count({ where: { Invoice: { is: null } } }));

/** Everything the database holds for one user, by value, sorted by ID. */
async function workspaceOf(userId: string) {
  const invoices = await prisma.invoice.findMany({
    where: { createdById: userId },
    include,
    orderBy: { id: "asc" },
  });
  return {
    invoices,
    revisions: await prisma.invoiceRevision.findMany({
      where: { invoiceId: { in: invoices.map((i) => i.id) } },
      orderBy: { id: "asc" },
    }),
  };
}

/**
 * The canonical content of a workspace with every internal ID removed, so two
 * workspaces (or one before and after a reset) can be compared by content.
 */
async function content(userId: string) {
  const { invoices, revisions } = await workspaceOf(userId);
  const prefix = (id: string) => id.split("-")[0]!;
  const stripItems = (items: { id?: string }[]) =>
    items.map(({ id: _id, ...rest }) => rest);
  return {
    invoices: invoices
      .map((i) => ({
        number: prefix(i.id),
        status: i.status,
        clientName: i.clientName,
        total: i.total.toString(),
        paymentTerms: i.paymentTerms,
        items: stripItems(i.items).map((it) => ({
          name: it.name,
          price: String((it as { price: unknown }).price),
          quantity: (it as { quantity: number }).quantity,
        })),
        clientAddress: i.clientAddress && {
          street: i.clientAddress.street,
          city: i.clientAddress.city,
        },
        senderAddress: i.senderAddress && {
          street: i.senderAddress.street,
          city: i.senderAddress.city,
        },
      }))
      .sort((a, b) => a.number.localeCompare(b.number)),
    revisions: revisions
      .map((r) => {
        const snapshot = r.snapshot as { items: { id?: string }[] };
        return {
          number: prefix(invoices.find((i) => i.id === r.invoiceId)!.id),
          revisionNumber: r.revisionNumber,
          changeType: r.changeType,
          message: r.message,
          createdAt: r.createdAt.toISOString(),
          snapshot: { ...snapshot, items: stripItems(snapshot.items) },
        };
      })
      .sort(
        (a, b) =>
          a.number.localeCompare(b.number) ||
          a.revisionNumber - b.revisionNumber,
      ),
  };
}
const idsOf = async (userId: string) => {
  const { invoices, revisions } = await workspaceOf(userId);
  return {
    invoices: invoices.map((i) => i.id),
    items: invoices.flatMap((i) => i.items.map((it) => it.id)),
    revisions: revisions.map((r) => r.id),
    snapshotItems: revisions.flatMap((r) =>
      (r.snapshot as { items: { id: string }[] }).items.map((it) => it.id),
    ),
  };
};

/** The whole database, minus per-session usage and the cleanup marker. */
async function snapshotDatabase() {
  return {
    users: await prisma.user.findMany({ orderBy: { id: "asc" } }),
    sessions: (
      await prisma.demoSession.findMany({ orderBy: { id: "asc" } })
    ).map(({ attemptCount: _a, cleanupFailedAt: _c, ...s }) => s),
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

function gate<T = void>() {
  let open!: (value: T) => void;
  const opened = new Promise<T>((resolve) => (open = resolve));
  return { opened, open };
}
async function until(condition: () => Promise<boolean>, what: string) {
  const deadline = Date.now() + 10_000;
  while (!(await condition())) {
    if (Date.now() > deadline) throw new Error(`Timed out waiting: ${what}`);
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}
const lockWaiters = async () =>
  (
    await prisma.$queryRaw<{ n: number }[]>`
      SELECT count(*)::int AS n FROM pg_stat_activity
      WHERE datname = current_database() AND wait_event_type = 'Lock'`
  )[0]!.n;

/** Holds the session row lock on another connection, as a write would. */
async function holdSessionLock(userId: string) {
  const locked = gate();
  const released = gate<(tx: Prisma.TransactionClient) => Promise<unknown>>();
  const done = secondClient.$transaction(
    async (tx) => {
      await tx.$executeRaw`
        SELECT 1 FROM "DemoSession" WHERE "userId" = ${userId} FOR UPDATE`;
      locked.open();
      await (
        await released.opened
      )(tx);
    },
    { timeout: 20_000 },
  );
  await locked.opened;
  return async (action: (tx: Prisma.TransactionClient) => Promise<unknown>) => {
    released.open(action);
    await done;
  };
}
/** Fires `requests` queued behind a held session lock, then releases them. */
async function racing<T>(userId: string, requests: (() => Promise<T>)[]) {
  const release = await holdSessionLock(userId);
  const waiting = await lockWaiters();
  const results = Promise.all(requests.map((request) => request()));
  const admitted = Math.min(
    requests.length,
    DEMO_WORKSPACE_LIMITS.concurrentWrites,
  );
  await until(
    async () => (await lockWaiters()) >= waiting + admitted,
    "admitted requests queued on the session lock",
  );
  await release(async () => undefined);
  return results;
}

/** Expires the session on the database clock, keeping the 24-hour check. */
async function expireIn(userId: string, ms: number) {
  await prisma.$executeRaw`
    UPDATE "DemoSession" SET "expiresAt" = t.e, "createdAt" = t.e - interval '24 hours'
    FROM (SELECT date_trunc('milliseconds',
      clock_timestamp() + make_interval(secs => ${ms / 1000}::double precision)) AS e) t
    WHERE "userId" = ${userId}`;
}
const expired = async (userId: string) =>
  (
    await prisma.$queryRaw<{ done: boolean }[]>`
      SELECT "expiresAt" <= clock_timestamp() AS done
      FROM "DemoSession" WHERE "userId" = ${userId}`
  )[0]!.done;
/** Lets the reset cooldown elapse without touching any counter. */
const endCooldown = (userId: string) =>
  prisma.demoSession.update({
    where: { userId },
    data: { lastResetAt: new Date(Date.now() - 3 * 60_000) },
  });

async function withTrigger(
  table: string,
  timing: string,
  body: string,
  run: () => Promise<void>,
) {
  await prisma.$executeRawUnsafe(
    `CREATE FUNCTION slice3c_hook() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN ${body} RETURN COALESCE(NEW, OLD); END $$`,
  );
  await prisma.$executeRawUnsafe(
    `CREATE TRIGGER slice3c_hook ${timing} ON "${table}" FOR EACH ROW EXECUTE FUNCTION slice3c_hook()`,
  );
  try {
    await run();
  } finally {
    await prisma.$executeRawUnsafe(`DROP TRIGGER slice3c_hook ON "${table}"`);
    await prisma.$executeRawUnsafe(`DROP FUNCTION slice3c_hook()`);
  }
}

async function fillCapacity(count: number, { expired = true } = {}) {
  for (let i = 0; i < count; i++) {
    const id = `demo-session:${randomUUID()}`;
    const expiresAt = new Date(
      Date.now() + (expired ? -60_000 + i * 10 : 3_600_000),
    );
    await prisma.user.create({
      data: {
        id,
        username: `${id}@example.invalid`,
        name: "retained",
        demoSession: {
          create: {
            credentialHash: createHash("sha256").update(id).digest("hex"),
            expiresAt,
            createdAt: new Date(expiresAt.getTime() - DEMO_SESSION_LIFETIME_MS),
          },
        },
      },
    });
  }
}

async function seedOrdinary() {
  const { items, clientAddress, senderAddress, ...fields } =
    CANONICAL[1]!.invoice;
  const invoice = await prisma.invoice.create({
    data: {
      ...fields,
      id: "OR0001",
      createdBy: { connect: { id: ordinary.id } },
      items: { create: items.map((i) => ({ ...i, id: randomUUID() })) },
      clientAddress: { create: clientAddress },
      senderAddress: { create: senderAddress },
    },
    include,
  });
  await prisma.invoiceRevision.create({
    data: {
      id: randomUUID(),
      invoiceId: invoice.id,
      createdById: ordinary.id,
      revisionNumber: 1,
      changeType: "create",
      snapshot: toSnapshot(invoice) as unknown as Prisma.InputJsonObject,
    },
  });
}

beforeAll(async () => {
  const supplied = process.env["DATABASE_URL"];
  if (!supplied) throw new Error("Explicit disposable local database required");
  const url = new URL(supplied);
  if (!["127.0.0.1", "localhost", "[::1]"].includes(url.hostname))
    throw new Error("Local PostgreSQL only");
  url.searchParams.set("schema", schema);
  const schemaUrl = url.toString();
  prisma = new PrismaClient({ datasourceUrl: schemaUrl });
  secondClient = new PrismaClient({ datasourceUrl: schemaUrl });
  execFileSync(
    process.execPath,
    ["node_modules/prisma/build/index.js", "migrate", "deploy"],
    { env: { ...process.env, DATABASE_URL: schemaUrl }, stdio: "pipe" },
  );
  const keys = generateKeyPairSync("rsa", { modulusLength: 2048 });
  privateKey = keys.privateKey;
  jwks = createServer((_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        keys: [
          {
            ...keys.publicKey.export({ format: "jwk" }),
            kid: "local-key",
            alg: "RS256",
            use: "sig",
          },
        ],
      }),
    );
  });
  await new Promise<void>((resolve) => jwks.listen(0, "127.0.0.1", resolve));
  issuer = `http://127.0.0.1:${(jwks.address() as { port: number }).port}/`;
  vi.resetModules();
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("DATABASE_URL", schemaUrl);
  vi.stubEnv("DOMAIN", issuer);
  vi.stubEnv("AUDIENCE", "urn:temporary-demo");
  vi.stubEnv("DEMO_MODE", "true");
  vi.stubEnv("CORS_ORIGIN", "http://127.0.0.1:12345");
  const { default: container } = await import(
    "../../src/config/inversify.config"
  );
  const { default: TYPES } = await import("../../src/constants/identifiers");
  container.rebind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);
  const { createServer: createProductionServer } = await import(
    "../../src/server"
  );
  realServer = (await createProductionServer())[1] as Server;
  await new Promise<void>((resolve) =>
    realServer.listen(0, "127.0.0.1", resolve),
  );
  baseUrl = `http://127.0.0.1:${(realServer.address() as { port: number }).port}`;
});
beforeEach(async () => {
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
  await seedOrdinary();
});
afterAll(async () => {
  realServer?.closeAllConnections();
  for (const listener of [jwks, realServer])
    if (listener)
      await new Promise<void>((resolve, reject) =>
        listener.close((e) => (e ? reject(e) : resolve())),
      );
  if (prisma) {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await prisma.$disconnect();
  }
  await secondClient?.$disconnect();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("temporary-session reset", () => {
  it("restores identical canonical content with all-new IDs after edits, payments, restores, creates and deletions, keeping identity, credential and expiry", async () => {
    const v = await visitor();
    const fresh = await content(v.id);
    const freshIds = await idsOf(v.id);
    expect(fresh.invoices.map((i) => i.number)).toEqual(CANONICAL_PREFIXES);
    expect(fresh.revisions).toHaveLength(CANONICAL_REVISIONS);
    const sessionBefore = await session(v.id);

    // Edit, pay, restore, delete and create: every kind of change.
    const rt = await ownInvoice(v.id, "RT3080");
    expect(code(await gql(v.token, EDIT, { id: rt.id, clientName: "X" }))).toBe(
      "ok",
    );
    const pending = await prisma.invoice.findFirstOrThrow({
      where: { createdById: v.id, status: "pending" },
    });
    expect(code(await gql(v.token, PAY, { id: pending.id }))).toBe("ok");
    const firstRevision = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: rt.id, revisionNumber: 1 },
    });
    expect(
      code(
        await gql(v.token, RESTORE, {
          invoiceId: rt.id,
          revisionId: firstRevision.id,
        }),
      ),
    ).toBe("ok");
    const victim = await prisma.invoice.findFirstOrThrow({
      where: { createdById: v.id, id: { not: { startsWith: "RT3080" } } },
    });
    expect(code(await gql(v.token, REMOVE, { id: victim.id }))).toBe("ok");
    expect(code(await gql(v.token, ADD, { clientName: "Added" }))).toBe("ok");
    expect(await content(v.id)).not.toEqual(fresh);
    const usedBefore = await counters(v.id);
    expect(usedBefore.mutationCount).toBe(5);

    const result = await gql(v.token, RESET);
    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({ resetDemoSession: true });

    // Identical canonical content, the familiar visible invoice numbers...
    expect(await content(v.id)).toEqual(fresh);
    // ...but every internal ID is new, and none is shared with the old rows.
    const afterIds = await idsOf(v.id);
    for (const kind of [
      "invoices",
      "items",
      "revisions",
      "snapshotItems",
    ] as const)
      expect(new Set(afterIds[kind]).size).toBeGreaterThan(0);
    for (const kind of ["invoices", "items", "revisions"] as const)
      expect(
        afterIds[kind].filter((id) => freshIds[kind].includes(id)),
      ).toEqual([]);
    expect(
      afterIds.snapshotItems.filter((id) =>
        freshIds.snapshotItems.includes(id),
      ),
    ).toEqual([]);
    // No address leaked or orphaned: seven per side for the visitor, plus the
    // ordinary user's one, however many the edits created and deleted.
    expect(await orphanAddresses()).toBe(0);
    expect(await prisma.clientAddress.count()).toBe(CANONICAL.length + 1);
    expect(await prisma.senderAddress.count()).toBe(CANONICAL.length + 1);

    // Same user, session, credential and expiry; still authenticates.
    const sessionAfter = await session(v.id);
    expect(sessionAfter).toMatchObject({
      id: sessionBefore.id,
      userId: v.id,
      credentialHash: sessionBefore.credentialHash,
      expiresAt: sessionBefore.expiresAt,
      createdAt: sessionBefore.createdAt,
      revokedAt: null,
    });
    expect((await resolveDemoSession(prisma, v.token))?.id).toBe(v.id);
    const list = (await gql(v.token, LIST)).data!["allInvoices"] as unknown[];
    expect(list).toHaveLength(CANONICAL.length);
  });

  it("is isolated from other visitors, ordinary users, the shared demo workspace and the administrator, and two visitors reset independently", async () => {
    await resetDemoWorkspace(prisma); // the legacy shared demo workspace
    const [a, b] = [await visitor(), await visitor()];
    const freshContent = await content(a.id);
    for (const v of [a, b]) {
      const rt = await ownInvoice(v.id, "RT3080");
      await gql(v.token, EDIT, { id: rt.id, clientName: `edited by ${v.id}` });
    }
    const before = {
      ordinary: await workspaceOf(ordinary.id),
      shared: await workspaceOf(DEMO_ID),
      b: await workspaceOf(b.id),
      bCounters: await counters(b.id),
      bSession: await session(b.id),
    };
    expect(code(await gql(a.token, RESET))).toBe("ok");

    expect(await workspaceOf(ordinary.id)).toEqual(before.ordinary);
    expect(await workspaceOf(DEMO_ID)).toEqual(before.shared);
    expect(await workspaceOf(b.id)).toEqual(before.b);
    expect(await counters(b.id)).toEqual(before.bCounters);
    expect(await session(b.id)).toEqual(before.bSession);
    expect(
      (await prisma.invoice.findMany({ where: { createdById: b.id } })).some(
        (i) => i.clientName === `edited by ${b.id}`,
      ),
    ).toBe(true);
    expect((await content(a.id)).invoices).toEqual(freshContent.invoices);

    // B resets independently; A's already-reset state is untouched.
    const aAfter = await workspaceOf(a.id);
    const aCounters = await counters(a.id);
    expect(code(await gql(b.token, RESET))).toBe("ok");
    expect(await workspaceOf(a.id)).toEqual(aAfter);
    expect(await counters(a.id)).toEqual(aCounters);
    expect(await content(b.id)).toEqual(freshContent);
    expect(await workspaceOf(ordinary.id)).toEqual(before.ordinary);
    expect(await workspaceOf(DEMO_ID)).toEqual(before.shared);
    expect(await orphanAddresses()).toBe(0);
    // No ID is shared between any two workspaces.
    const all = [
      ...(await idsOf(a.id)).invoices,
      ...(await idsOf(b.id)).invoices,
      ...(await idsOf(DEMO_ID)).invoices,
      ...(await idsOf(ordinary.id)).invoices,
    ];
    expect(new Set(all).size).toBe(all.length);
  });

  it("is available only to a temporary session: ordinary users, administrators, the shared demo user and anonymous callers are refused with no change", async () => {
    await resetDemoWorkspace(prisma);
    const v = await visitor();
    // Authenticating an administrator provisions its user row; do that first.
    await gql(signedToken(admin, ["Admin"]), LIST);
    const before = await snapshotDatabase();
    const usage = await counters(v.id);
    for (const token of [
      signedToken(ordinary),
      signedToken(admin, ["Admin"]),
      "demo-token",
      null,
    ]) {
      expect(failure(await gql(token, RESET)).code).toBe("FORBIDDEN");
    }
    // A visitor cannot reach the shared reset, or smuggle a target user.
    expect(failure(await gql(v.token, "mutation { resetDemoData }"))).toEqual({
      message: "Temporary demo sessions cannot use this operation",
      code: "FORBIDDEN",
    });
    const targeted = await gql(
      v.token,
      `mutation { resetDemoSession(userId: "${ordinary.id}") }`,
    );
    expect(targeted.errors).toBeDefined();
    expect(targeted.data ?? null).toBeNull();
    // One root field per request, aliases included: no second reset hides.
    const twice = await post(v.token, {
      query: "mutation { a: resetDemoSession b: resetDemoSession }",
    });
    expect(twice.status).toBe(400);
    expect(twice.body.errors?.[0]?.extensions?.["code"]).toBe(
      "SINGLE_MUTATION_REQUIRED",
    );
    expect(await snapshotDatabase()).toEqual(before);
    expect(await counters(v.id)).toEqual(usage);
  });

  it("refuses reset over WebSocket, and never touches the legacy shared reset", async () => {
    const v = await visitor();
    const before = await snapshotDatabase();
    const client = createClient({
      url: baseUrl.replace("http://", "ws://"),
      webSocketImpl: WebSocket,
      retryAttempts: 0,
      connectionParams: { Authorization: `Bearer ${v.token}` },
    });
    const outcome = await new Promise<unknown>((resolve) => {
      client.subscribe(
        { query: RESET },
        {
          next: () => resolve("next"),
          error: (e) => resolve((e as { code?: number }).code),
          complete: () => resolve("completed"),
        },
      );
    });
    await client.dispose();
    expect(outcome).toBe(4403);
    expect(await snapshotDatabase()).toEqual(before);
    expect((await counters(v.id)).resetCount).toBe(0);
  });

  it("enforces the cooldown and lifetime allowance, and a reset consumes budgets but never refunds them", async () => {
    const v = await visitor();
    const rt = async () => (await ownInvoice(v.id, "RT3080")).id;
    // Spend some budget first, so any "refund" would be visible.
    for (let i = 0; i < 3; i++)
      expect(
        code(await gql(v.token, EDIT, { id: await rt(), clientName: `e${i}` })),
      ).toBe("ok");
    const start = await counters(v.id);
    expect(start).toMatchObject({ mutationCount: 3, attemptCount: 3 });

    expect(code(await gql(v.token, RESET))).toBe("ok");
    const first = await counters(v.id);
    expect(first.mutationCount).toBe(start.mutationCount + 1);
    expect(first.attemptCount).toBe(start.attemptCount + 1);
    expect(first.resetCount).toBe(1);
    expect(first.lastResetAt).toBeInstanceOf(Date);

    // Cooldown: refused after admission. The attempt counts; nothing else does.
    const cooling = await post(v.token, { query: RESET });
    expect(cooling.body.errors![0]!.extensions).toMatchObject({
      code: "RESET_COOLDOWN",
    });
    const retry = cooling.body.errors![0]!.extensions!["retryAfterSeconds"];
    expect(retry).toBeGreaterThan(0);
    expect(retry).toBeLessThanOrEqual(120);
    const afterCooling = await counters(v.id);
    expect(afterCooling).toEqual({
      ...first,
      attemptCount: first.attemptCount + 1,
    });

    // Ordinary edits are not subject to the cooldown, and the budget keeps
    // counting up from where the reset left it.
    expect(
      code(await gql(v.token, EDIT, { id: await rt(), clientName: "after" })),
    ).toBe("ok");
    expect((await counters(v.id)).mutationCount).toBe(first.mutationCount + 1);

    // Lifetime allowance: five resets, never refreshed.
    for (let n = 2; n <= DEMO_WORKSPACE_LIMITS.resets; n++) {
      await endCooldown(v.id);
      expect(code(await gql(v.token, RESET))).toBe("ok");
    }
    expect((await counters(v.id)).resetCount).toBe(
      DEMO_WORKSPACE_LIMITS.resets,
    );
    await endCooldown(v.id);
    const before = await workspaceOf(v.id);
    const usage = await counters(v.id);
    expect(failure(await gql(v.token, RESET))).toEqual({
      message: "This demo session has no resets remaining",
      code: "QUOTA_EXCEEDED",
      quota: "resets",
    });
    expect(await workspaceOf(v.id)).toEqual(before);
    expect(await counters(v.id)).toEqual({
      ...usage,
      attemptCount: usage.attemptCount + 1,
    });
    // Neither counter ever went down, across five resets.
    expect((await counters(v.id)).mutationCount).toBeGreaterThanOrEqual(
      first.mutationCount + 1 + (DEMO_WORKSPACE_LIMITS.resets - 1),
    );
  });

  it("counts as one change and one attempt against the lifetime budgets: the last unit is usable, the next is not", async () => {
    const v = await visitor();
    await prisma.demoSession.update({
      where: { userId: v.id },
      data: { mutationCount: DEMO_WORKSPACE_LIMITS.mutations - 1 },
    });
    expect(code(await gql(v.token, RESET))).toBe("ok");
    expect((await counters(v.id)).mutationCount).toBe(
      DEMO_WORKSPACE_LIMITS.mutations,
    );
    await endCooldown(v.id);
    const before = await workspaceOf(v.id);
    expect(failure(await gql(v.token, RESET))).toEqual({
      message: "This demo session has no changes remaining",
      code: "QUOTA_EXCEEDED",
      quota: "mutations",
    });
    const rt = await ownInvoice(v.id, "RT3080");
    expect(
      failure(await gql(v.token, EDIT, { id: rt.id, clientName: "no" })).code,
    ).toBe("QUOTA_EXCEEDED");
    expect(await workspaceOf(v.id)).toEqual(before);

    // The attempt budget: a reset is an attempt like any write.
    const w = await visitor();
    await prisma.demoSession.update({
      where: { userId: w.id },
      data: { attemptCount: DEMO_WORKSPACE_LIMITS.attempts - 1 },
    });
    expect(code(await gql(w.token, RESET))).toBe("ok");
    expect((await counters(w.id)).attemptCount).toBe(
      DEMO_WORKSPACE_LIMITS.attempts,
    );
    await endCooldown(w.id);
    expect(failure(await gql(w.token, RESET))).toMatchObject({
      code: "QUOTA_EXCEEDED",
      quota: "attempts",
    });
    expect((await counters(w.id)).attemptCount).toBe(
      DEMO_WORKSPACE_LIMITS.attempts,
    );
  });

  it("rolls the whole reset back when it fails midway, keeping the old workspace, other visitors and every budget except the one attempt", async () => {
    const a = await visitor();
    const b = await visitor();
    const rt = await ownInvoice(a.id, "RT3080");
    await gql(a.token, EDIT, { id: rt.id, clientName: "before the failure" });
    const world = await snapshotDatabase();
    const aBefore = await workspaceOf(a.id);
    const usage = await counters(a.id);

    // Failure points: after the old rows are gone and several new invoices
    // exist (a revision insert), and while deleting the old invoices.
    for (const [table, timing, body] of [
      [
        "InvoiceRevision",
        "BEFORE INSERT",
        `IF NEW."message" = 'Marked as paid' THEN RAISE EXCEPTION 'injected reset failure'; END IF;`,
      ],
      [
        "Item",
        "BEFORE INSERT",
        `IF NEW."name" = 'Brand Guidelines' THEN RAISE EXCEPTION 'injected reset failure'; END IF;`,
      ],
      [
        "ClientAddress",
        "BEFORE DELETE",
        `RAISE EXCEPTION 'injected reset failure';`,
      ],
    ] as const) {
      const attemptsBefore = (await counters(a.id)).attemptCount;
      await withTrigger(table, timing, body, async () => {
        expect(failure(await gql(a.token, RESET)).code).toBe(
          "INTERNAL_SERVER_ERROR",
        );
      });
      expect(await snapshotDatabase()).toEqual(world);
      expect(await workspaceOf(a.id)).toEqual(aBefore);
      expect(await orphanAddresses()).toBe(0);
      // Only the failed attempt is recorded: no change, no reset, no cooldown.
      expect(await counters(a.id)).toEqual({
        ...usage,
        attemptCount: attemptsBefore + 1,
      });
    }
    // B was never involved.
    expect((await counters(b.id)).attemptCount).toBe(0);
    // The failure did not start the cooldown or spend the allowance.
    expect(code(await gql(a.token, RESET))).toBe("ok");
    expect((await counters(a.id)).resetCount).toBe(1);
  });

  it("serializes a reset with a concurrent edit of the same session: either order ends canonical, with no orphans and no double spend", async () => {
    const v = await visitor();
    const rt = await ownInvoice(v.id, "RT3080");
    const results = await racing(v.id, [
      () => gql(v.token, EDIT, { id: rt.id, clientName: "racing edit" }),
      () => gql(v.token, RESET),
    ]);
    const [edit, reset] = results as [GraphQLResult, GraphQLResult];
    expect(code(reset)).toBe("ok");
    // Reset first: the edit's old invoice ID no longer exists. Edit first:
    // both commit, and the reset then replaces the edited workspace.
    expect(["ok", "NOT_FOUND"]).toContain(code(edit));
    const { invoices, revisions } = await workspaceOf(v.id);
    expect(invoices).toHaveLength(CANONICAL.length);
    expect(revisions).toHaveLength(CANONICAL_REVISIONS);
    expect(invoices.some((i) => i.clientName === "racing edit")).toBe(false);
    expect(await orphanAddresses()).toBe(0);
    const used = await counters(v.id);
    expect(used.resetCount).toBe(1);
    expect(used.mutationCount).toBe(code(edit) === "ok" ? 2 : 1);

    // Two simultaneous resets: one wins, the other meets the cooldown.
    const w = await visitor();
    const both = (await racing(w.id, [
      () => gql(w.token, RESET),
      () => gql(w.token, RESET),
    ])) as GraphQLResult[];
    expect(both.map(code).sort()).toEqual(["RESET_COOLDOWN", "ok"]);
    expect((await counters(w.id)).resetCount).toBe(1);
    expect(await orphanAddresses()).toBe(0);
  });

  it("refuses a reset that was waiting for the session lock when the session expires or is revoked, changing nothing", async () => {
    for (const setup of [
      (tx: Prisma.TransactionClient, userId: string) =>
        tx.$executeRaw`UPDATE "DemoSession" SET "revokedAt" = now() WHERE "userId" = ${userId}`,
      (tx: Prisma.TransactionClient, userId: string) =>
        tx.$executeRaw`
          UPDATE "DemoSession"
          SET "expiresAt" = t.e, "createdAt" = t.e - interval '24 hours'
          FROM (SELECT date_trunc('milliseconds', clock_timestamp()) - interval '1 second' AS e) t
          WHERE "userId" = ${userId}`,
    ]) {
      const v = await visitor();
      const before = await workspaceOf(v.id);
      const release = await holdSessionLock(v.id);
      const waiting = await lockWaiters();
      const queued = gql(v.token, RESET);
      await until(
        async () => (await lockWaiters()) > waiting,
        "reset queued on the session lock",
      );
      await release((tx) => setup(tx, v.id));
      expect(failure(await queued)).toEqual({
        message: "Demo session has expired or is no longer valid",
        code: "UNAUTHENTICATED",
      });
      expect(await workspaceOf(v.id)).toEqual(before);
      const used = await counters(v.id);
      expect(used).toMatchObject({
        mutationCount: 0,
        resetCount: 0,
        attemptCount: 0,
      });
    }
    // And when the feature is switched off while it waits.
    const v = await visitor();
    const before = await workspaceOf(v.id);
    const release = await holdSessionLock(v.id);
    const waiting = await lockWaiters();
    const queued = gql(v.token, RESET);
    await until(
      async () => (await lockWaiters()) > waiting,
      "reset queued on the session lock",
    );
    vi.stubEnv("DEMO_SESSIONS_ENABLED", "false");
    await release(async () => undefined);
    expect(failure(await queued).code).toBe("FORBIDDEN");
    expect(await workspaceOf(v.id)).toEqual(before);
    expect((await counters(v.id)).attemptCount).toBe(0);
  });

  it("is left alone by cleanup while in flight, then reclaimed completely once expired, with no orphans", async () => {
    const [v, bystander] = [await visitor(), await visitor()];
    await expireIn(v.id, 1500);
    const bystanderBefore = await workspaceOf(bystander.id);
    let slept = false;
    await withTrigger(
      "InvoiceRevision",
      "BEFORE INSERT",
      `IF NEW."message" = 'Marked as paid' THEN PERFORM pg_sleep(3.5); END IF;`,
      async () => {
        const reset = gql(v.token, RESET);
        await until(
          async () =>
            (
              await secondClient.$queryRaw<{ n: number }[]>`
                SELECT count(*)::int AS n FROM pg_stat_activity
                WHERE datname = current_database() AND wait_event = 'PgSleep'`
            )[0]!.n > 0,
          "reset to be in flight",
        );
        slept = true;
        await until(() => expired(v.id), "session expiry during the reset");
        // Admitted before expiry: cleanup must not delete it underneath.
        expect(await cleanupExpiredDemoSessions(secondClient)).toBe(0);
        expect(code(await reset)).toBe("ok");
      },
    );
    expect(slept).toBe(true);
    expect((await workspaceOf(v.id)).invoices).toHaveLength(CANONICAL.length);
    expect(await cleanupExpiredDemoSessions(prisma)).toBe(1);
    expect(await prisma.user.count({ where: { id: v.id } })).toBe(0);
    expect(await prisma.invoice.count({ where: { createdById: v.id } })).toBe(
      0,
    );
    expect(await orphanAddresses()).toBe(0);
    expect(await workspaceOf(bystander.id)).toEqual(bystanderBefore);
  });

  it("refuses a reset that races cleanup for a session expiring while it waits, whichever wins the row lock, leaving nothing behind", async () => {
    const [v, bystander] = [await visitor(), await visitor()];
    const bystanderBefore = await workspaceOf(bystander.id);
    const release = await holdSessionLock(v.id);
    const waiting = await lockWaiters();
    // Authenticated while live, then queued on the session row.
    const queued = gql(v.token, RESET);
    await until(
      async () => (await lockWaiters()) > waiting,
      "reset queued on the session lock",
    );
    await release(
      (tx) =>
        tx.$executeRaw`
        UPDATE "DemoSession" SET "expiresAt" = t.e, "createdAt" = t.e - interval '24 hours'
        FROM (SELECT date_trunc('milliseconds', clock_timestamp()) - interval '1 second' AS e) t
        WHERE "userId" = ${v.id}`,
    );
    // Reset and cleanup now contend for the row: reset revalidates after the
    // lock, cleanup skips or deletes. Both orders end the same way.
    const [result] = await Promise.all([
      queued,
      cleanupExpiredDemoSessions(prisma),
    ]);
    expect(failure(result)).toEqual({
      message: "Demo session has expired or is no longer valid",
      code: "UNAUTHENTICATED",
    });
    expect(await cleanupExpiredDemoSessions(prisma)).toBeLessThanOrEqual(1);
    expect(await prisma.user.count({ where: { id: v.id } })).toBe(0);
    expect(await prisma.invoice.count({ where: { createdById: v.id } })).toBe(
      0,
    );
    expect(await prisma.demoSession.count({ where: { userId: v.id } })).toBe(0);
    expect(await orphanAddresses()).toBe(0);
    expect(await workspaceOf(bystander.id)).toEqual(bystanderBefore);
  });
});

describe("automatic cleanup at allocation", () => {
  const allocate = () =>
    fetch(`${baseUrl}/demo/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": nextIp(),
      },
      body: "{}",
    });

  it("lets visitors in when expired workspaces fill every slot, reclaiming bounded batches under concurrency", async () => {
    await fillCapacity(DEMO_SESSION_CAPACITY);
    const responses = await Promise.all([allocate(), allocate(), allocate()]);
    expect(responses.map((r) => r.status)).toEqual([201, 201, 201]);
    expect(await prisma.demoSession.count()).toBe(
      DEMO_SESSION_CAPACITY - 3 * DEMO_ALLOCATION_CLEANUP_BATCH + 3,
    );
    expect(await orphanAddresses()).toBe(0);
  });

  it("reports capacity exhaustion, evicting nothing, while nothing has expired, then recovers as soon as one expires", async () => {
    await fillCapacity(DEMO_SESSION_CAPACITY, { expired: false });
    const before = await snapshotDatabase();
    const full = await allocate();
    expect(full.status).toBe(503);
    expect(await full.json()).toEqual({ code: "DEMO_SESSIONS_CAPACITY" });
    expect(await snapshotDatabase()).toEqual(before);
    // Revoked-but-unexpired sessions are not reclaimed either.
    await prisma.demoSession.updateMany({ data: { revokedAt: new Date() } });
    expect((await allocate()).status).toBe(503);
    expect(await prisma.demoSession.count()).toBe(DEMO_SESSION_CAPACITY);
    // One expiry is enough.
    const [first] = await prisma.demoSession.findMany({ take: 1 });
    await expireIn(first!.userId, 0);
    expect((await allocate()).status).toBe(201);
    expect(await prisma.demoSession.count()).toBe(DEMO_SESSION_CAPACITY);
  });

  it("reclaims only expired sessions, keeping active sessions, ordinary users and shared-demo data unchanged, with no orphan addresses", async () => {
    await resetDemoWorkspace(prisma);
    const [gone, active] = [await visitor(), await visitor()];
    // Give the doomed workspace extra addresses to prove they are reclaimed.
    await gql(gone.token, ADD, { clientName: "extra" });
    await gql(gone.token, REMOVE, {
      id: (await ownInvoice(gone.id, "XM9141")).id,
    });
    await expireIn(gone.id, 0);
    await prisma.demoSession.update({
      where: { userId: active.id },
      data: { revokedAt: new Date() },
    });
    const keep = {
      ordinary: await workspaceOf(ordinary.id),
      shared: await workspaceOf(DEMO_ID),
      active: await workspaceOf(active.id),
      activeSession: await session(active.id),
    };
    const newcomer = await allocate();
    expect(newcomer.status).toBe(201);
    expect(await prisma.user.count({ where: { id: gone.id } })).toBe(0);
    expect(await prisma.demoSession.count({ where: { userId: gone.id } })).toBe(
      0,
    );
    expect(await workspaceOf(ordinary.id)).toEqual(keep.ordinary);
    expect(await workspaceOf(DEMO_ID)).toEqual(keep.shared);
    expect(await workspaceOf(active.id)).toEqual(keep.active);
    expect(await session(active.id)).toEqual(keep.activeSession);
    expect(await orphanAddresses()).toBe(0);
    expect(
      await prisma.item.count({ where: { Invoice: { createdById: gone.id } } }),
    ).toBe(0);
  });

  it("is not blocked by a damaged expired workspace: it stays intact and marked while the others are reclaimed", async () => {
    await fillCapacity(DEMO_SESSION_CAPACITY);
    const [oldest] = await prisma.demoSession.findMany({
      orderBy: { expiresAt: "asc" },
      take: 1,
    });
    // Make the oldest candidate unreclaimable: a foreign revision author.
    await prisma.invoice.create({
      data: {
        id: "dmg-invoice",
        createdBy: { connect: { id: ordinary.id } },
        createdAt: "",
        paymentDue: "",
        description: "",
        paymentTerms: 1,
        clientName: "",
        clientEmail: "",
        status: "draft",
        total: 0,
      },
    });
    await prisma.invoiceRevision.create({
      data: {
        id: randomUUID(),
        invoiceId: "dmg-invoice",
        createdById: oldest!.userId,
        revisionNumber: 1,
        changeType: "create",
        snapshot: {},
      },
    });
    const response = await allocate();
    expect(response.status).toBe(201);
    // The batch examined five; one failed, four were reclaimed, one was added.
    expect(await prisma.demoSession.count()).toBe(
      DEMO_SESSION_CAPACITY - (DEMO_ALLOCATION_CLEANUP_BATCH - 1) + 1,
    );
    const marked = await prisma.demoSession.findUniqueOrThrow({
      where: { id: oldest!.id },
    });
    expect(marked.cleanupFailedAt).toBeInstanceOf(Date);
    // Later passes prefer healthy sessions, leaving the damaged one for last.
    expect(await cleanupExpiredDemoSessions(prisma)).toBe(10);
    expect(await prisma.demoSession.count({ where: { id: oldest!.id } })).toBe(
      1,
    );
    expect(await cleanupExpiredDemoSessionsReport(prisma, 100)).toMatchObject({
      failed: 1,
    });
  });
});

describe("stale temporary credentials over HTTP (N1)", () => {
  const UNAUTHENTICATED = {
    message: "Demo session has expired or is no longer valid",
    code: "UNAUTHENTICATED",
  };

  const operations = [
    LIST,
    RESET,
    `mutation { markAsPaid(id: "x") { id } }`,
    `mutation { editInvoice(id: "x", clientName: "y") { id } }`,
    `mutation { addInvoice(clientName: "y") { id } }`,
    `mutation { removeInvoice(id: "x") { acknowledged } }`,
    `mutation { restoreInvoiceRevision(invoiceId: "x", revisionId: "y") { id } }`,
    "mutation { resetDemoData }",
  ];
  /** Every operation answers 401 UNAUTHENTICATED and reveals nothing. */
  async function expectUnauthenticated(label: string, token: string) {
    for (const query of operations) {
      const response = await post(token, { query });
      expect(response.status, `${label}: ${query}`).toBe(401);
      expect(failure(response.body)).toEqual(UNAUTHENTICATED);
      expect(response.body.data ?? null).toBeNull();
      // Nothing about the credential, its hash or the database leaks.
      expect(response.text).not.toContain(token);
      expect(response.text).not.toMatch(/prisma|postgres|sha256|hash/i);
    }
  }

  it("answers UNAUTHENTICATED (HTTP 401), not INTERNAL_SERVER_ERROR, for expired, revoked, reclaimed, unknown, malformed and feature-disabled credentials, on queries and every mutation", async () => {
    const [expiredV, revokedV, liveV] = [
      await visitor(),
      await visitor(),
      await visitor(),
    ];
    await expireIn(expiredV.id, 0);
    await prisma.demoSession.update({
      where: { userId: revokedV.id },
      data: { revokedAt: new Date() },
    });
    const malformed: [string, string][] = [
      ["unknown", "demo-session-v1." + "0".repeat(64)],
      ["truncated", expiredV.token.slice(0, -1)],
      ["extended", expiredV.token + "x"],
      ["wrong version", "demo-session-v2.abc"],
      ["bare prefix", "demo-session"],
    ];
    const before = await snapshotDatabase();
    for (const [label, token] of [
      ["expired", expiredV.token],
      ["revoked", revokedV.token],
      ...malformed,
    ] as [string, string][])
      await expectUnauthenticated(label, token);
    // Reclaimed: the expired workspace is now physically gone, and the code
    // is the same (a revoked one is not reclaimed until it expires).
    expect(await cleanupExpiredDemoSessions(prisma)).toBe(1);
    expect(await prisma.user.count({ where: { id: expiredV.id } })).toBe(0);
    await expectUnauthenticated("reclaimed", expiredV.token);
    // Feature switched off: every credential, even a live one.
    vi.stubEnv("DEMO_SESSIONS_ENABLED", "false");
    await expectUnauthenticated("disabled", liveV.token);
    vi.stubEnv("DEMO_SESSIONS_ENABLED", "true");
    // The rejected requests created no session, user or workspace and changed
    // nothing but the one reclaimed workspace.
    const after = await snapshotDatabase();
    expect(after.sessions).toHaveLength(before.sessions.length - 1);
    expect(after.users).toHaveLength(before.users.length - 1);
    expect(after.invoices).toEqual(
      before.invoices.filter((i) => i.createdById !== expiredV.id),
    );
    // The live one still works once the feature is back (nothing was revoked).
    expect((await gql(liveV.token, LIST)).errors).toBeUndefined();
  });

  it("answers SERVICE_UNAVAILABLE (HTTP 503), keeping the credential valid, when the session store cannot be reached", async () => {
    const v = await visitor();
    const before = await snapshotDatabase();
    const failing = vi
      .spyOn(prisma, "$queryRaw")
      .mockRejectedValue(new Error("connection refused: password=hunter2"));
    try {
      for (const query of [
        LIST,
        RESET,
        `mutation { markAsPaid(id: "x") { id } }`,
      ]) {
        const response = await post(v.token, { query });
        expect(response.status).toBe(503);
        expect(failure(response.body)).toEqual({
          message: "Demo sessions are temporarily unavailable; try again",
          code: "SERVICE_UNAVAILABLE",
        });
        expect(response.text).not.toMatch(/hunter2|password|connection/i);
        expect(response.text).not.toContain(v.token);
      }
    } finally {
      failing.mockRestore();
    }
    // The credential was never judged invalid: it works as soon as the store
    // is back, and no replacement session was created.
    expect((await gql(v.token, LIST)).errors).toBeUndefined();
    expect(await prisma.demoSession.count()).toBe(1);
    expect(await snapshotDatabase()).toEqual(before);
  });

  it("answers a write that outlives its session with UNAUTHENTICATED, never a replacement session", async () => {
    // Authenticated, then expired while queued: the stable code comes from the
    // write coordinator (covered in demoSessionMutations); a reset is the same.
    const v = await visitor();
    const release = await holdSessionLock(v.id);
    const waiting = await lockWaiters();
    const queued = gql(v.token, RESET);
    await until(
      async () => (await lockWaiters()) > waiting,
      "reset queued on the session lock",
    );
    await release(
      (tx) =>
        tx.$executeRaw`
        UPDATE "DemoSession" SET "expiresAt" = t.e, "createdAt" = t.e - interval '24 hours'
        FROM (SELECT date_trunc('milliseconds', clock_timestamp()) - interval '1 second' AS e) t
        WHERE "userId" = ${v.id}`,
    );
    expect(failure(await queued)).toEqual(UNAUTHENTICATED);
    expect(await prisma.demoSession.count()).toBe(1);
  });

  it("leaves ordinary Auth0, administrator and shared-demo authentication unchanged", async () => {
    // Real tokens still work.
    expect((await gql(signedToken(ordinary), LIST)).errors).toBeUndefined();
    expect(
      (await gql(signedToken(admin, ["Admin"]), LIST)).errors,
    ).toBeUndefined();
    // The legacy demo user still authenticates and still resets its own workspace.
    await resetDemoWorkspace(prisma);
    expect((await gql("demo-token", LIST)).errors).toBeUndefined();
    expect(
      (await gql("demo-token", "mutation { resetDemoData }")).data,
    ).toEqual({ resetDemoData: true });
    // A bad ordinary token keeps its existing behaviour: not rewritten as a
    // demo-session error and not an HTTP 401.
    const bad = await post("not.a.jwt", { query: LIST });
    expect(bad.status).toBe(200);
    expect(failure(bad.body).code).toBe("INTERNAL_SERVER_ERROR");
    // Retired demo credentials never become another identity.
    const retired = await post("demo-retired", { query: LIST });
    expect(retired.status).toBe(200);
    expect(failure(retired.body).code).toBe("INTERNAL_SERVER_ERROR");
    // No credential at all: unchanged too.
    const anonymous = await post(null, { query: LIST });
    expect(failure(anonymous.body).code).toBe("INTERNAL_SERVER_ERROR");
  });
});
