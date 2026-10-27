import "reflect-metadata";
import { PrismaClient, type Prisma } from "@prisma/client";
import { execFileSync } from "node:child_process";
import { generateKeyPairSync, randomUUID, type KeyObject } from "node:crypto";
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
  resetDemoWorkspace,
} from "../../prisma/demoWorkspace.cjs";
import { toSnapshot } from "../../src/services/invoiceDiff";
import { resolveDemoSession } from "../../src/services/demoSession.service";

// Slice 3B.1: temporary-session invoice mutations through the PRODUCTION
// wiring (`createServer`: express + Apollo over HTTP, ws + graphql-ws), with
// real fetch/WebSocket clients, signed local Auth0 tokens and disposable
// PostgreSQL. Each request carries its own X-Forwarded-For so the production
// per-IP limiter (100 per 15 minutes) never interferes with the assertions.

const schema = `demo_mutations_${randomUUID().replaceAll("-", "")}`;
const include = { items: true, clientAddress: true, senderAddress: true };
let prisma: PrismaClient;
let secondClient: PrismaClient;
let jwks: Server;
let realServer: Server;
let baseUrl: string;
let issuer: string;
let privateKey: KeyObject;
let revisionRepoPrototype: { findLatest: (...args: unknown[]) => unknown };

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

const FIELDS = `id status clientName clientEmail description createdAt paymentDue
  paymentTerms total items { id name price quantity total }
  clientAddress { street city postCode country }
  senderAddress { street city postCode country }`;
const VARS = `$id: String, $clientName: String, $clientEmail: String,
  $createdAt: String, $description: String, $paymentDue: String,
  $paymentTerms: Float, $status: String, $total: Float, $items: [ItemInput],
  $clientAddress: ClientInfo, $senderAddress: SenderInfo`;
const ARGS = `id: $id, clientName: $clientName, clientEmail: $clientEmail,
  createdAt: $createdAt, description: $description, paymentDue: $paymentDue,
  paymentTerms: $paymentTerms, status: $status, total: $total, items: $items,
  clientAddress: $clientAddress, senderAddress: $senderAddress`;
// The same documents the frontend sends (invoice.queries.ts).
const ADD = `mutation (${VARS}) { addInvoice(${ARGS}) { ${FIELDS} } }`;
const EDIT = `mutation (${VARS}) { editInvoice(${ARGS}) { ${FIELDS} } }`;
const PAY = `mutation ($id: String!) { markAsPaid(id: $id) { ${FIELDS} } }`;
const REMOVE = `mutation ($id: String!) { removeInvoice(id: $id) { acknowledged } }`;
const RESTORE = `mutation ($invoiceId: String!, $revisionId: String!) {
  restoreInvoiceRevision(invoiceId: $invoiceId, revisionId: $revisionId) { ${FIELDS} } }`;
const LIST = `{ allInvoices { ${FIELDS} } }`;
const GET = `query ($id: String!) { getInvoiceById(id: $id) { ${FIELDS} } }`;
const REVISIONS = `query ($id: String!) { invoiceRevisions(invoiceId: $id) {
  id invoiceId revisionNumber changeType restoredFromRevisionId message
  createdBy { id }
  snapshot { status clientName description total items { id name price quantity total } } } }`;
const DIFF = `query ($from: String, $to: String!) {
  invoiceRevisionDiff(fromRevisionId: $from, toRevisionId: $to) {
    fieldChanges { field before after } itemChanges { itemKey changeType }
    addressChanges { field } } }`;

const VISIBLE_ID =
  /^[A-Z]{2}\d{4}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

interface GraphQLResult {
  data?: Record<string, unknown> | null;
  errors?: { message: string; extensions?: Record<string, unknown> }[];
}
interface InvoiceResult {
  id: string;
  status: string;
  clientName: string;
  total: number;
  items: { id: string; name: string; price: number; quantity: number }[];
}
interface RevisionResult {
  id: string;
  revisionNumber: number;
  changeType: string;
  restoredFromRevisionId: string | null;
  message: string | null;
  createdBy: { id: string } | null;
  snapshot: {
    status: string;
    clientName: string;
    total: number;
    items: { id: string; name: string; price: number; quantity: number }[];
  };
}

let clientIp = 0;
const nextIp = () => {
  clientIp++;
  return `10.${(clientIp >> 16) & 255}.${(clientIp >> 8) & 255}.${clientIp & 255}`;
};

async function gql(
  token: string,
  query: string,
  variables: Record<string, unknown> = {},
): Promise<GraphQLResult> {
  const response = await fetch(`${baseUrl}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Forwarded-For": nextIp(),
    },
    body: JSON.stringify({ query, variables }),
  });
  return (await response.json()) as GraphQLResult;
}
const byId = (invoice: InvoiceResult) => ({
  ...invoice,
  items: [...invoice.items].sort((x, y) => x.id.localeCompare(y.id)),
});
const ok = <T>(result: GraphQLResult, field: string): T => {
  expect(result.errors).toBeUndefined();
  return result.data![field] as T;
};
const failure = (result: GraphQLResult) => {
  expect(result.data?.[Object.keys(result.data ?? {})[0] ?? ""] ?? null).toBe(
    null,
  );
  expect(result.errors).toHaveLength(1);
  const [error] = result.errors!;
  return {
    message: error!.message,
    code: error!.extensions?.["code"],
    ...(error!.extensions?.["quota"]
      ? { quota: error!.extensions["quota"] }
      : {}),
  };
};

/** Over the real WebSocket transport; resolves with the final result. */
async function wsExecute(
  token: string,
  query: string,
  variables: Record<string, unknown> = {},
): Promise<GraphQLResult> {
  const client = createClient({
    url: baseUrl.replace("http://", "ws://"),
    webSocketImpl: WebSocket,
    retryAttempts: 0,
    connectionParams: { Authorization: `Bearer ${token}` },
  });
  try {
    return await new Promise<GraphQLResult>((resolve, reject) => {
      let last: GraphQLResult = {};
      client.subscribe(
        { query, variables },
        {
          next: (value) => (last = value as unknown as GraphQLResult),
          error: reject,
          complete: () => resolve(last),
        },
      );
    });
  } finally {
    await client.dispose();
  }
}

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
  return { token: credential, id: user.id };
}

const ownInvoice = (userId: string, prefix: string) =>
  prisma.invoice.findFirstOrThrow({
    where: { createdById: userId, id: { startsWith: `${prefix}-` } },
    include,
  });
const usage = async (userId: string) =>
  (
    await prisma.demoSession.findUniqueOrThrow({
      where: { userId },
      select: { mutationCount: true },
    })
  ).mutationCount;
const counts = async (userId: string) => ({
  invoices: await prisma.invoice.count({ where: { createdById: userId } }),
  revisions: await prisma.invoiceRevision.count({
    where: { invoice: { createdById: userId } },
  }),
});
const orphanAddresses = async () =>
  (await prisma.clientAddress.count({ where: { Invoice: { is: null } } })) +
  (await prisma.senderAddress.count({ where: { Invoice: { is: null } } }));

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
const rowsOf = async (userId: string) =>
  (await snapshotDatabase()).invoices.filter((i) => i.createdById === userId);

const frontendInvoice = (overrides: Record<string, unknown> = {}) => ({
  id: "AB1234", // client-generated by the frontend; must be ignored
  clientName: "Visitor Client",
  clientEmail: "client@example.test",
  createdAt: "2026-10-27",
  description: "Brand refresh",
  paymentDue: "2026-11-26",
  paymentTerms: 30,
  status: "pending",
  total: 1, // recomputed by the server
  items: [
    { id: randomUUID(), name: "Logo", price: 150.5, quantity: 2, total: 1 },
  ],
  clientAddress: {
    street: "1 Client St",
    city: "Halifax",
    postCode: "B3H 1A1",
    country: "Canada",
  },
  senderAddress: {
    street: "2 Sender Rd",
    city: "Dartmouth",
    postCode: "B2Y 1A1",
    country: "Canada",
  },
  ...overrides,
});
// What the frontend's "Save as Draft" sends for a blank form.
const blankDraft = () => ({
  id: "CD5678",
  clientName: "",
  clientEmail: "",
  createdAt: "2026-10-27",
  description: "",
  paymentDue: "2026-11-26",
  paymentTerms: 30,
  status: "draft",
  total: 0,
  items: [{ id: "", name: "", quantity: 0, price: 0, total: 0 }],
  clientAddress: { street: "", city: "", postCode: "", country: "" },
  senderAddress: { street: "", city: "", postCode: "", country: "" },
});

function gate<T = void>() {
  let open!: (value: T) => void;
  const opened = new Promise<T>((resolve) => (open = resolve));
  return { opened, open };
}
async function until(condition: () => Promise<boolean>, what: string) {
  const deadline = Date.now() + 8000;
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

/**
 * Holds the session row lock on another connection, as a concurrent write
 * would. `release(action)` runs `action` inside the holder before commit.
 */
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

/** Fires `requests` while the session is locked, then releases them together. */
async function racing<T>(userId: string, requests: (() => Promise<T>)[]) {
  const release = await holdSessionLock(userId);
  const waiting = await lockWaiters();
  const results = Promise.all(requests.map((request) => request()));
  await until(
    async () => (await lockWaiters()) >= waiting + requests.length,
    "all requests queued on the session lock",
  );
  await release(async () => undefined);
  return results;
}

async function seedOrdinary() {
  const { items, clientAddress, senderAddress, ...fields } =
    canonicalDemoRecords()[1]!.invoice;
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
  return invoice;
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
  ({
    PrismaInvoiceRevisionRepository: { prototype: revisionRepoPrototype },
  } = (await import(
    "../../src/repositories/implementations/prismaInvoiceRevisionRepository"
  )) as unknown as {
    PrismaInvoiceRevisionRepository: {
      prototype: typeof revisionRepoPrototype;
    };
  });
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

describe("temporary-session invoice mutations over HTTP", () => {
  it("lets two visitors independently create, edit and re-read invoices, including incomplete drafts", async () => {
    const [a, b] = [await visitor(), await visitor()];
    const others = await rowsOf(ordinary.id);

    const aCreated = ok<InvoiceResult>(
      await gql(a.token, ADD, frontendInvoice()),
      "addInvoice",
    );
    const bDraft = ok<InvoiceResult>(
      await gql(b.token, ADD, blankDraft()),
      "addInvoice",
    );
    // Server-generated IDs in the visible six-character format; client IDs
    // and totals are ignored, and the draft keeps its empty fields.
    expect(aCreated.id).toMatch(VISIBLE_ID);
    expect(bDraft.id).toMatch(VISIBLE_ID);
    expect(aCreated.id.startsWith("AB1234")).toBe(false);
    expect(aCreated).toMatchObject({ status: "pending", total: 301 });
    expect(bDraft).toMatchObject({ status: "draft", clientName: "", total: 0 });

    // Edit like the frontend: keep the first item by ID, add one with a new
    // client UUID (which becomes a server ID).
    const added = randomUUID();
    const aEdited = ok<InvoiceResult>(
      await gql(
        a.token,
        EDIT,
        frontendInvoice({
          id: aCreated.id,
          clientName: "Renamed Client",
          items: [
            { ...aCreated.items[0], price: 100, quantity: 3 },
            { id: added, name: "Icons", price: 25, quantity: 4, total: 0 },
          ],
        }),
      ),
      "editInvoice",
    );
    const kept = aEdited.items.find((item) => item.name === "Logo")!;
    const icons = aEdited.items.find((item) => item.name === "Icons")!;
    expect(kept.id).toBe(aCreated.items[0]!.id);
    expect(icons.id).not.toBe(added);
    expect(aEdited).toMatchObject({ clientName: "Renamed Client", total: 400 });
    // Completing the draft.
    ok(
      await gql(
        b.token,
        EDIT,
        frontendInvoice({ id: bDraft.id, items: bDraft.items }),
      ),
      "editInvoice",
    );

    // Refreshing returns the persisted state, and each list is the visitor's own.
    expect(
      byId(
        ok<InvoiceResult>(
          await gql(a.token, GET, { id: aCreated.id }),
          "getInvoiceById",
        ),
      ),
    ).toEqual(byId(aEdited));
    const bRefreshed = ok<InvoiceResult>(
      await gql(b.token, GET, { id: bDraft.id }),
      "getInvoiceById",
    );
    expect(bRefreshed).toMatchObject({
      status: "pending",
      clientName: "Visitor Client",
    });
    const aList = ok<InvoiceResult[]>(await gql(a.token, LIST), "allInvoices");
    const bList = ok<InvoiceResult[]>(await gql(b.token, LIST), "allInvoices");
    expect(aList).toHaveLength(8);
    expect(bList).toHaveLength(8);
    expect(aList.map((i) => i.id)).not.toContain(bDraft.id);
    expect(bList.map((i) => i.id)).not.toContain(aCreated.id);
    expect(failure(await gql(a.token, GET, { id: bDraft.id }))).toMatchObject({
      code: "NOT_FOUND",
    });

    // Required history, authored by the visitor.
    const history = ok<RevisionResult[]>(
      await gql(a.token, REVISIONS, { id: aCreated.id }),
      "invoiceRevisions",
    );
    expect(history.map((r) => [r.revisionNumber, r.changeType])).toEqual([
      [2, "edit"],
      [1, "create"],
    ]);
    expect(history.every((r) => r.createdBy?.id === a.id)).toBe(true);
    expect(history[0]!.snapshot.clientName).toBe("Renamed Client");

    // Only recognized statuses; the rejection changes nothing.
    const before = await snapshotDatabase();
    for (const status of ["archived", "PAID", ""])
      expect(
        failure(await gql(a.token, EDIT, { id: aCreated.id, status })),
      ).toEqual({ message: "status is invalid", code: "BAD_USER_INPUT" });
    expect(await snapshotDatabase()).toEqual(before);
    expect([await usage(a.id), await usage(b.id)]).toEqual([2, 2]);
    expect(await rowsOf(ordinary.id)).toEqual(others);
  });

  it("marks only pending invoices paid, with history, and leaves rejected attempts uncounted", async () => {
    const v = await visitor();
    const pending = await ownInvoice(v.id, "XM9141");
    const paid = ok<InvoiceResult>(
      await gql(v.token, PAY, { id: pending.id }),
      "markAsPaid",
    );
    expect(paid.status).toBe("paid");
    const [latest] = ok<RevisionResult[]>(
      await gql(v.token, REVISIONS, { id: pending.id }),
      "invoiceRevisions",
    );
    expect(latest).toMatchObject({
      revisionNumber: 2,
      changeType: "edit",
      message: "Marked as paid",
      snapshot: { status: "paid" },
    });

    const before = await snapshotDatabase();
    const draft = await ownInvoice(v.id, "FV2353");
    for (const id of [pending.id, draft.id])
      expect(failure(await gql(v.token, PAY, { id }))).toEqual({
        message: "Only pending invoices can be marked as paid",
        code: "BAD_USER_INPUT",
      });
    expect(await snapshotDatabase()).toEqual(before);
    expect(await usage(v.id)).toBe(1);
  });

  it("compares revisions and restores one consistently, appending an accurate restore revision", async () => {
    const v = await visitor();
    const invoice = await ownInvoice(v.id, "RT3080");
    const history = ok<RevisionResult[]>(
      await gql(v.token, REVISIONS, { id: invoice.id }),
      "invoiceRevisions",
    );
    expect(history).toHaveLength(5);
    const first = history.at(-1)!;
    const head = history[0]!;
    expect(first.snapshot).toMatchObject({ status: "draft" });
    const diff = ok<{ fieldChanges: { field: string }[] }>(
      await gql(v.token, DIFF, { from: first.id, to: head.id }),
      "invoiceRevisionDiff",
    );
    expect(diff.fieldChanges.map((c) => c.field)).toContain("status");

    const currentIds = new Set(invoice.items.map((i) => i.id));
    const restored = ok<InvoiceResult>(
      await gql(v.token, RESTORE, {
        invoiceId: invoice.id,
        revisionId: first.id,
      }),
      "restoreInvoiceRevision",
    );
    // Details and items match the snapshot; surviving items keep their IDs.
    expect(restored).toMatchObject({
      status: first.snapshot.status,
      clientName: first.snapshot.clientName,
      total: first.snapshot.total,
    });
    expect(
      restored.items.map(({ name, price, quantity }) => ({
        name,
        price,
        quantity,
      })),
    ).toEqual(
      first.snapshot.items.map(({ name, price, quantity }) => ({
        name,
        price,
        quantity,
      })),
    );
    restored.items.forEach((item, i) => {
      const source = first.snapshot.items[i]!.id;
      if (currentIds.has(source)) expect(item.id).toBe(source);
      else expect(currentIds.has(item.id)).toBe(false);
    });
    expect(
      byId(
        ok<InvoiceResult>(
          await gql(v.token, GET, { id: invoice.id }),
          "getInvoiceById",
        ),
      ),
    ).toEqual(byId(restored));
    const after = ok<RevisionResult[]>(
      await gql(v.token, REVISIONS, { id: invoice.id }),
      "invoiceRevisions",
    );
    expect(after).toHaveLength(6);
    expect(after[0]).toMatchObject({
      revisionNumber: 6,
      changeType: "restore",
      restoredFromRevisionId: first.id,
      message: "Restored from revision #1",
      createdBy: { id: v.id },
      snapshot: { status: "draft", total: first.snapshot.total },
    });
    // Earlier history is untouched.
    expect(after.slice(1)).toEqual(history);
    ok(
      await gql(v.token, DIFF, { from: head.id, to: after[0]!.id }),
      "invoiceRevisionDiff",
    );

    // A revision of the visitor's OTHER invoice is refused, without changes.
    const other = await ownInvoice(v.id, "XM9141");
    const otherRevision = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: other.id },
    });
    const before = await snapshotDatabase();
    expect(
      failure(
        await gql(v.token, RESTORE, {
          invoiceId: invoice.id,
          revisionId: otherRevision.id,
        }),
      ),
    ).toEqual({
      message: "Revision does not belong to this invoice",
      code: "BAD_USER_INPUT",
    });
    expect(await snapshotDatabase()).toEqual(before);
    expect(await usage(v.id)).toBe(1);
  });

  it("deletes invoices with their items, revisions and both addresses, leaving no orphans", async () => {
    const v = await visitor();
    const baseline = await orphanAddresses();
    const created = ok<InvoiceResult>(
      await gql(v.token, ADD, frontendInvoice()),
      "addInvoice",
    );
    const sample = await ownInvoice(v.id, "RT3080");
    const addresses = async () => ({
      client: await prisma.clientAddress.count(),
      sender: await prisma.senderAddress.count(),
    });
    const beforeDelete = await addresses();
    for (const id of [created.id, sample.id])
      expect(
        ok<{ acknowledged: boolean }>(
          await gql(v.token, REMOVE, { id }),
          "removeInvoice",
        ),
      ).toEqual({ acknowledged: true });

    expect(await addresses()).toEqual({
      client: beforeDelete.client - 2,
      sender: beforeDelete.sender - 2,
    });
    expect(await orphanAddresses()).toBe(baseline);
    for (const id of [created.id, sample.id]) {
      expect(await prisma.item.count({ where: { invoiceId: id } })).toBe(0);
      expect(
        await prisma.invoiceRevision.count({ where: { invoiceId: id } }),
      ).toBe(0);
      expect(failure(await gql(v.token, GET, { id }))).toMatchObject({
        code: "NOT_FOUND",
      });
    }
    expect(ok<unknown[]>(await gql(v.token, LIST), "allInvoices")).toHaveLength(
      6,
    );
    // Deleting again is indistinguishable from an ID that never existed.
    const missing = failure(
      await gql(v.token, REMOVE, { id: `ZZ9999-${randomUUID()}` }),
    );
    expect(failure(await gql(v.token, REMOVE, { id: sample.id }))).toEqual(
      missing,
    );
    expect(missing).toEqual({
      message: "Invoice not found",
      code: "NOT_FOUND",
    });
    expect(await usage(v.id)).toBe(3);
  });

  it("rejects foreign invoice, revision and item IDs exactly like missing ones, without changes", async () => {
    const [a, b] = [await visitor(), await visitor()];
    const aInvoice = await ownInvoice(a.id, "RT3080");
    const aRevision = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: aInvoice.id },
    });
    const real = await prisma.invoice.findUniqueOrThrow({
      where: { id: "OR0001" },
      include,
    });
    const realRevision = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: real.id },
    });
    const bInvoice = await ownInvoice(b.id, "RT3080");
    const bRevision = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: bInvoice.id },
    });
    const before = await snapshotDatabase();

    const missingInvoice = `ZZ9999-${randomUUID()}`;
    for (const [query, variables] of [
      [EDIT, (id: string) => ({ id, clientName: "Probe" })],
      [PAY, (id: string) => ({ id })],
      [REMOVE, (id: string) => ({ id })],
      [RESTORE, (id: string) => ({ invoiceId: id, revisionId: bRevision.id })],
    ] as const) {
      const expected = failure(
        await gql(b.token, query, variables(missingInvoice)),
      );
      expect(expected).toEqual({
        message: "Invoice not found",
        code: "NOT_FOUND",
      });
      for (const foreign of [aInvoice.id, real.id])
        expect(failure(await gql(b.token, query, variables(foreign)))).toEqual(
          expected,
        );
    }
    const missingRevision = failure(
      await gql(b.token, RESTORE, {
        invoiceId: bInvoice.id,
        revisionId: randomUUID(),
      }),
    );
    expect(missingRevision).toEqual({
      message: "Revision not found",
      code: "NOT_FOUND",
    });
    for (const revisionId of [aRevision.id, realRevision.id])
      expect(
        failure(
          await gql(b.token, RESTORE, { invoiceId: bInvoice.id, revisionId }),
        ),
      ).toEqual(missingRevision);
    for (const id of ["../RT3080", "x".repeat(65), "RT3080 OR 1=1"])
      expect(failure(await gql(b.token, PAY, { id }))).toEqual({
        message: "invoiceId is invalid",
        code: "BAD_USER_INPUT",
      });
    expect(await snapshotDatabase()).toEqual(before);
    expect(await usage(b.id)).toBe(0);

    // Foreign item IDs are ignored like unused ones: new server-ID items,
    // and the foreign rows stay exactly as they were.
    const probes = [aInvoice.items[0]!.id, real.items[0]!.id, randomUUID()];
    const edited = ok<InvoiceResult>(
      await gql(b.token, EDIT, {
        id: bInvoice.id,
        items: probes.map((id) => ({
          id,
          name: "Probe",
          price: 1,
          quantity: 1,
        })),
      }),
      "editInvoice",
    );
    expect(edited.items).toHaveLength(3);
    for (const item of edited.items) expect(probes).not.toContain(item.id);
    const bIds = new Set((await rowsOf(b.id)).map((invoice) => invoice.id));
    const notB = (state: Awaited<ReturnType<typeof snapshotDatabase>>) => ({
      invoices: state.invoices.filter((row) => !bIds.has(row.id)),
      items: state.items.filter((row) => !bIds.has(row.invoiceId)),
      revisions: state.revisions.filter((row) => !bIds.has(row.invoiceId)),
    });
    expect(notB(await snapshotDatabase())).toEqual(notB(before));
    expect(await usage(b.id)).toBe(1);
  });
});

describe("temporary-session quotas over HTTP", () => {
  it("accepts the 30th invoice and rejects the 31st with a full rollback", async () => {
    const v = await visitor();
    for (let i = 0; i < 23; i++)
      ok(
        await gql(v.token, ADD, frontendInvoice({ clientName: `C${i}` })),
        "addInvoice",
      );
    expect(await counts(v.id)).toMatchObject({ invoices: 30 });
    const before = await snapshotDatabase();
    expect(failure(await gql(v.token, ADD, frontendInvoice()))).toEqual({
      message: "This change would exceed the demo workspace limits",
      code: "QUOTA_EXCEEDED",
      quota: "workspace",
    });
    expect(await snapshotDatabase()).toEqual(before);
    expect(await usage(v.id)).toBe(23);
  });

  it("accepts 20 items, rejects 21 before any lock, and rejects a restore that would exceed 20", async () => {
    const v = await visitor();
    const invoice = await ownInvoice(v.id, "RT2080");
    const items = (n: number) =>
      Array.from({ length: n }, (_, i) => ({
        name: `Item ${i}`,
        price: 1,
        quantity: 1,
      }));
    expect(
      ok<InvoiceResult>(
        await gql(v.token, EDIT, { id: invoice.id, items: items(20) }),
        "editInvoice",
      ).items,
    ).toHaveLength(20);
    const before = await snapshotDatabase();
    expect(
      failure(await gql(v.token, EDIT, { id: invoice.id, items: items(21) })),
    ).toEqual({ message: "items exceeds 20 entries", code: "BAD_USER_INPUT" });
    expect(await snapshotDatabase()).toEqual(before);

    // Restore carries no input: only the post-write measurement can catch it.
    const latest = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: invoice.id },
      orderBy: { revisionNumber: "desc" },
    });
    const oversized = await prisma.invoiceRevision.create({
      data: {
        invoiceId: invoice.id,
        revisionNumber: latest.revisionNumber + 1,
        createdById: v.id,
        changeType: "edit",
        snapshot: {
          ...(latest.snapshot as Prisma.JsonObject),
          items: items(21).map((i) => ({ ...i, id: randomUUID(), total: 1 })),
        },
      },
    });
    const withOversized = await snapshotDatabase();
    expect(
      failure(
        await gql(v.token, RESTORE, {
          invoiceId: invoice.id,
          revisionId: oversized.id,
        }),
      ),
    ).toMatchObject({ code: "QUOTA_EXCEEDED", quota: "workspace" });
    expect(await snapshotDatabase()).toEqual(withOversized);
    expect(await usage(v.id)).toBe(1);
  });

  it("accepts the 200th retained revision and rejects the 201st", async () => {
    const v = await visitor();
    const invoice = await ownInvoice(v.id, "TY9141");
    const latest = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: invoice.id },
      orderBy: { revisionNumber: "desc" },
    });
    const missing = 199 - (await counts(v.id)).revisions;
    await prisma.invoiceRevision.createMany({
      data: Array.from({ length: missing }, (_, i) => ({
        invoiceId: invoice.id,
        revisionNumber: latest.revisionNumber + 1 + i,
        createdById: v.id,
        changeType: "edit",
        snapshot: latest.snapshot as Prisma.InputJsonObject,
      })),
    });
    ok(
      await gql(v.token, EDIT, { id: invoice.id, clientName: "200th" }),
      "editInvoice",
    );
    expect(await counts(v.id)).toMatchObject({ revisions: 200 });
    const before = await snapshotDatabase();
    expect(
      failure(
        await gql(v.token, EDIT, { id: invoice.id, clientName: "201st" }),
      ),
    ).toMatchObject({ code: "QUOTA_EXCEEDED", quota: "workspace" });
    expect(await snapshotDatabase()).toEqual(before);
    // Deleting frees capacity and is still permitted at the revision cap.
    ok(await gql(v.token, REMOVE, { id: invoice.id }), "removeInvoice");
    expect(await usage(v.id)).toBe(2);
  });

  it("allows the 200th mutation and refuses every operation after it", async () => {
    const v = await visitor();
    await prisma.demoSession.update({
      where: { userId: v.id },
      data: { mutationCount: 199 },
    });
    const invoice = await ownInvoice(v.id, "AA1449");
    ok(await gql(v.token, PAY, { id: invoice.id }), "markAsPaid");
    expect(await usage(v.id)).toBe(200);
    const revision = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: invoice.id },
    });
    const before = await snapshotDatabase();
    const exhausted = {
      message: "This demo session has no changes remaining",
      code: "QUOTA_EXCEEDED",
      quota: "mutations",
    };
    for (const [query, variables] of [
      [ADD, frontendInvoice()],
      [EDIT, { id: invoice.id, clientName: "Over budget" }],
      [PAY, { id: (await ownInvoice(v.id, "XM9141")).id }],
      [REMOVE, { id: invoice.id }],
      [RESTORE, { invoiceId: invoice.id, revisionId: revision.id }],
    ] as const)
      expect(failure(await gql(v.token, query, variables))).toEqual(exhausted);
    expect(await snapshotDatabase()).toEqual(before);
  });
});

describe("temporary-session concurrency over HTTP", () => {
  it("cannot exceed the mutation budget with simultaneous requests", async () => {
    const v = await visitor();
    await prisma.demoSession.update({
      where: { userId: v.id },
      data: { mutationCount: 197 },
    });
    const invoice = await ownInvoice(v.id, "RT2080");
    const revisions = (await counts(v.id)).revisions;
    const results = await racing(
      v.id,
      Array.from(
        { length: 6 },
        (_, i) => () =>
          gql(v.token, EDIT, { id: invoice.id, clientName: `Racer ${i}` }),
      ),
    );
    const succeeded = results.filter((r) => !r.errors);
    expect(succeeded).toHaveLength(3);
    for (const r of results.filter((r) => r.errors))
      expect(failure(r)).toMatchObject({ quota: "mutations" });
    expect(await usage(v.id)).toBe(200);
    expect((await counts(v.id)).revisions).toBe(revisions + 3);
    expect(
      succeeded.map(
        (r) => (r.data!["editInvoice"] as InvoiceResult).clientName,
      ),
    ).toContain((await ownInvoice(v.id, "RT2080")).clientName);
  });

  it("cannot exceed the invoice cap with simultaneous creates, and rolled-back creates leave no rows", async () => {
    const v = await visitor();
    const template = await ownInvoice(v.id, "TY9141");
    for (let i = 0; i < 21; i++)
      await prisma.invoice.create({
        data: {
          id: `PD${String(i).padStart(4, "0")}-${randomUUID()}`,
          createdById: v.id,
          createdAt: template.createdAt,
          paymentDue: template.paymentDue,
          description: "padding",
          paymentTerms: 1,
          clientName: "padding",
          clientEmail: "",
          status: "draft",
          total: 0,
        },
      });
    expect(await counts(v.id)).toMatchObject({ invoices: 28 });
    const addresses = await prisma.clientAddress.count();
    const results = await racing(
      v.id,
      Array.from(
        { length: 5 },
        (_, i) => () =>
          gql(v.token, ADD, frontendInvoice({ clientName: `Racer ${i}` })),
      ),
    );
    expect(results.filter((r) => !r.errors)).toHaveLength(2);
    for (const r of results.filter((r) => r.errors))
      expect(failure(r)).toMatchObject({ quota: "workspace" });
    expect(await counts(v.id)).toMatchObject({ invoices: 30 });
    expect(await prisma.clientAddress.count()).toBe(addresses + 2);
    expect(await usage(v.id)).toBe(2);
  });

  it("runs different visitors' simultaneous writes independently", async () => {
    const [a, b] = [await visitor(), await visitor()];
    const [aInvoice, bInvoice] = [
      await ownInvoice(a.id, "XM9141"),
      await ownInvoice(b.id, "XM9141"),
    ];
    const results = await Promise.all(
      Array.from({ length: 8 }, (_, i) =>
        i % 2
          ? gql(a.token, EDIT, { id: aInvoice.id, clientName: `A${i}` })
          : gql(b.token, EDIT, { id: bInvoice.id, clientName: `B${i}` }),
      ),
    );
    expect(results.filter((r) => r.errors)).toEqual([]);
    expect([await usage(a.id), await usage(b.id)]).toEqual([4, 4]);
    expect((await ownInvoice(a.id, "XM9141")).clientName).toMatch(/^A/);
    expect((await ownInvoice(b.id, "XM9141")).clientName).toMatch(/^B/);
  });
});

describe("temporary-session failure handling over HTTP", () => {
  it("rolls back every operation completely when revision recording fails with a non-database error", async () => {
    const v = await visitor();
    const pending = await ownInvoice(v.id, "RT2080");
    const restoreTarget = await ownInvoice(v.id, "RT3080");
    const firstRevision = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: restoreTarget.id, revisionNumber: 1 },
    });
    const before = await snapshotDatabase();
    const failing = vi
      .spyOn(revisionRepoPrototype, "findLatest")
      .mockRejectedValue(new Error("non-database revision failure"));
    const generic = {
      message: "Demo invoice operation failed",
      code: "INTERNAL_SERVER_ERROR",
    };
    try {
      for (const [query, variables] of [
        [ADD, frontendInvoice()],
        [EDIT, { id: pending.id, clientName: "Without history" }],
        [PAY, { id: pending.id }],
        [
          RESTORE,
          { invoiceId: restoreTarget.id, revisionId: firstRevision.id },
        ],
      ] as const)
        expect(failure(await gql(v.token, query, variables))).toEqual(generic);
      expect(failing).toHaveBeenCalledTimes(4);
    } finally {
      failing.mockRestore();
    }
    expect(await snapshotDatabase()).toEqual(before);
    // Control: the same edit succeeds once history can be recorded.
    ok(
      await gql(v.token, EDIT, { id: pending.id, clientName: "With history" }),
      "editInvoice",
    );
    expect(await usage(v.id)).toBe(1);
  });

  it("refuses writes queued behind the session lock once the session is revoked, expires or the feature is disabled, and reports a busy session", async () => {
    const invalid = {
      message: "Demo session has expired or is no longer valid",
      code: "UNAUTHENTICATED",
    };
    for (const [setup, expected] of [
      [
        (tx: Prisma.TransactionClient, userId: string) =>
          tx.$executeRaw`UPDATE "DemoSession" SET "revokedAt" = now() WHERE "userId" = ${userId}`,
        invalid,
      ],
      [
        (tx: Prisma.TransactionClient, userId: string) =>
          tx.$executeRaw`
            UPDATE "DemoSession"
            SET "expiresAt" = t.e, "createdAt" = t.e - interval '24 hours'
            FROM (SELECT date_trunc('milliseconds', clock_timestamp()) - interval '1 second' AS e) t
            WHERE "userId" = ${userId}`,
        invalid,
      ],
      [
        async () => vi.stubEnv("DEMO_SESSIONS_ENABLED", "false"),
        {
          message: "Temporary demo sessions are disabled",
          code: "FORBIDDEN",
        },
      ],
    ] as const) {
      vi.stubEnv("DEMO_SESSIONS_ENABLED", "true");
      const v = await visitor();
      const invoice = await ownInvoice(v.id, "XM9141");
      const before = await rowsOf(v.id);
      const release = await holdSessionLock(v.id);
      const waiting = await lockWaiters();
      const queued = gql(v.token, PAY, { id: invoice.id });
      await until(
        async () => (await lockWaiters()) > waiting,
        "write queued on the session lock",
      );
      await release((tx) => setup(tx, v.id));
      expect(failure(await queued)).toEqual(expected);
      expect(await rowsOf(v.id)).toEqual(before);
      expect(await usage(v.id)).toBe(0);
    }

    vi.stubEnv("DEMO_SESSIONS_ENABLED", "true");
    const v = await visitor();
    const invoice = await ownInvoice(v.id, "XM9141");
    const release = await holdSessionLock(v.id);
    try {
      expect(failure(await gql(v.token, PAY, { id: invoice.id }))).toEqual({
        message: "Another change to this demo is in progress; try again",
        code: "SESSION_BUSY",
      });
    } finally {
      await release(async () => undefined);
    }
    expect((await ownInvoice(v.id, "XM9141")).status).toBe("pending");
    expect(await usage(v.id)).toBe(0);
  });
});

describe("temporary-session isolation and transport boundaries", () => {
  it("never publishes temporary-visitor activity to the administrator invoiceAdded feed", async () => {
    const received: string[] = [];
    const feed = createClient({
      url: baseUrl.replace("http://", "ws://"),
      webSocketImpl: WebSocket,
      retryAttempts: 0,
      connectionParams: {
        Authorization: `Bearer ${signedToken(admin, ["Admin"])}`,
      },
    });
    const ordinaryToken = signedToken(ordinary);
    try {
      feed.subscribe(
        { query: "subscription { invoiceAdded { clientName } }" },
        {
          next: (value) =>
            received.push(
              (value.data as { invoiceAdded: { clientName: string } })
                .invoiceAdded.clientName,
            ),
          error: (e) => received.push(`error: ${String(e)}`),
          complete: () => undefined,
        },
      );
      // The ordinary user's event proves the feed is live before visitors act.
      await until(async () => {
        if (!received.length)
          ok(
            await gql(
              ordinaryToken,
              ADD,
              frontendInvoice({ id: "", clientName: "Sentinel 1" }),
            ),
            "addInvoice",
          );
        await new Promise((resolve) => setTimeout(resolve, 50));
        return received.length > 0;
      }, "feed delivers an ordinary event");

      const v = await visitor();
      const created = ok<InvoiceResult>(
        await gql(
          v.token,
          ADD,
          frontendInvoice({ clientName: "Visitor event" }),
        ),
        "addInvoice",
      );
      ok(
        await gql(v.token, EDIT, {
          id: created.id,
          clientName: "Visitor edit",
        }),
        "editInvoice",
      );
      ok(await gql(v.token, PAY, { id: created.id }), "markAsPaid");
      const firstRevision = await prisma.invoiceRevision.findFirstOrThrow({
        where: { invoiceId: created.id, revisionNumber: 1 },
      });
      ok(
        await gql(v.token, RESTORE, {
          invoiceId: created.id,
          revisionId: firstRevision.id,
        }),
        "restoreInvoiceRevision",
      );
      ok(await gql(v.token, REMOVE, { id: created.id }), "removeInvoice");
      ok(
        await gql(
          ordinaryToken,
          ADD,
          frontendInvoice({ id: "", clientName: "Sentinel 2" }),
        ),
        "addInvoice",
      );
      await until(
        async () => received.includes("Sentinel 2"),
        "second ordinary event",
      );
      // In-memory delivery is ordered: any visitor event would precede it.
      expect(received.filter((name) => !name.startsWith("Sentinel"))).toEqual(
        [],
      );
      expect(received.at(-1)).toBe("Sentinel 2");

      // Visitors cannot subscribe to the feed either.
      const denied = await wsExecute(
        v.token,
        "subscription { invoiceAdded { id } }",
      );
      expect(denied.errors?.[0]?.extensions?.["code"]).toBe("FORBIDDEN");
    } finally {
      await feed.dispose();
    }
  });

  it("keeps all five operations forbidden over WebSocket", async () => {
    const v = await visitor();
    const invoice = await ownInvoice(v.id, "XM9141");
    const revision = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: invoice.id },
    });
    const before = await snapshotDatabase();
    for (const [query, variables] of [
      [ADD, frontendInvoice()],
      [EDIT, { id: invoice.id, clientName: "Over WS" }],
      [PAY, { id: invoice.id }],
      [REMOVE, { id: invoice.id }],
      [RESTORE, { invoiceId: invoice.id, revisionId: revision.id }],
    ] as const)
      expect(failure(await wsExecute(v.token, query, variables))).toEqual({
        message: "Temporary demo sessions cannot mutate over WebSocket",
        code: "FORBIDDEN",
      });
    expect(await snapshotDatabase()).toEqual(before);
  });

  it("keeps every unapproved mutation forbidden over HTTP, including fields without a resolver", async () => {
    const v = await visitor();
    const before = await snapshotDatabase();
    for (const query of [
      "mutation { resetDemoData }",
      "mutation { deleteAllInvoices { acknowledged } }",
      `mutation { deleteInvoicesByUserId(userId: "${v.id}") { acknowledged } }`,
      `mutation { createUser(username: "new@example.test", password: "secret") { id } }`,
      "mutation { deleteUsers { acknowledged } }",
      "mutation { deleteUsersKeepAdmins { acknowledged } }",
      `mutation { login(username: "x", password: "y") { token } }`,
    ])
      expect(failure(await gql(v.token, query))).toEqual({
        message: "Temporary demo sessions cannot use this operation",
        code: "FORBIDDEN",
      });
    expect(await snapshotDatabase()).toEqual(before);
  });

  it("stays off by default: with the flag unset, credentials and bootstrap are refused and nothing changes", async () => {
    const v = await visitor();
    const invoice = await ownInvoice(v.id, "XM9141");
    vi.stubEnv("DEMO_SESSIONS_ENABLED", undefined);
    const before = await snapshotDatabase();
    const result = await gql(v.token, PAY, { id: invoice.id });
    expect(result.errors).toBeDefined();
    expect(result.data?.["markAsPaid"] ?? null).toBe(null);
    const bootstrap = await fetch(`${baseUrl}/demo/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": nextIp(),
      },
      body: "{}",
    });
    expect(bootstrap.status).toBe(404);
    expect(await snapshotDatabase()).toEqual(before);
  });

  it("leaves ordinary Auth0 and shared-demo writes unchanged, including explicit IDs and the admin feed path", async () => {
    const token = signedToken(ordinary);
    const created = ok<InvoiceResult>(
      await gql(token, ADD, frontendInvoice({ id: "OR7777" })),
      "addInvoice",
    );
    // Ordinary users keep their client-chosen ID (existing behaviour).
    expect(created.id).toBe("OR7777");
    ok(
      await gql(token, EDIT, { id: created.id, clientName: "Edited" }),
      "editInvoice",
    );
    ok(await gql(token, PAY, { id: created.id }), "markAsPaid");
    const revision = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: created.id, revisionNumber: 1 },
    });
    expect(
      ok<InvoiceResult>(
        await gql(token, RESTORE, {
          invoiceId: created.id,
          revisionId: revision.id,
        }),
        "restoreInvoiceRevision",
      ).clientName,
    ).toBe("Visitor Client");
    ok(await gql(token, REMOVE, { id: created.id }), "removeInvoice");

    // Shared demo: same token, same canonical workspace, same reset.
    const v = await visitor();
    const visitorRows = await rowsOf(v.id);
    await resetDemoWorkspace(prisma);
    ok(
      await gql("demo-token", EDIT, {
        id: "RT3080",
        clientName: "Shared edit",
      }),
      "editInvoice",
    );
    expect(
      ok<InvoiceResult>(
        await gql("demo-token", GET, { id: "RT3080" }),
        "getInvoiceById",
      ).clientName,
    ).toBe("Shared edit");
    expect(
      ok<boolean>(
        await gql("demo-token", "mutation { resetDemoData }"),
        "resetDemoData",
      ),
    ).toBe(true);
    expect(
      ok<InvoiceResult>(
        await gql("demo-token", GET, { id: "RT3080" }),
        "getInvoiceById",
      ).clientName,
    ).not.toBe("Shared edit");
    expect(await rowsOf(v.id)).toEqual(visitorRows);
    expect(await usage(v.id)).toBe(0);
  });
});
