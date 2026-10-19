import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { Prisma, PrismaClient, Role } from "@prisma/client";
import { execFileSync } from "node:child_process";
import { randomUUID, generateKeyPairSync, type KeyObject } from "node:crypto";
import { createServer, type Server } from "node:http";
import jwt from "jsonwebtoken";
import { createRequest } from "node-mocks-http";
import type { Request } from "express";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { InjectedQueryContext } from "../../src/constants/types";
import { toSnapshot } from "../../src/services/invoiceDiff";
import { canonicalDemoRecords } from "../../prisma/demoWorkspace.cjs";

// Ordinary red tests intentionally capture the Portfolio v1 contract. Do not
// replace failures with skips/.fails or change production behavior in Slice 4A.
// Real production context, DI, GraphQL, services, repositories and PostgreSQL;
// only the primary Prisma binding is replaced with a disposable-schema client.
const canonicalIds = [
  "AA1449",
  "FV2353",
  "RG0314",
  "RT2080",
  "RT3080",
  "TY9141",
  "XM9141",
];
const demo = {
  id: "demoId",
  username: "demo-user@example.com",
  name: "demo-user",
  role: Role.USER,
};
const userA = {
  id: "auth0|demo-contract-a",
  username: "a@example.test",
  name: "User A",
  role: Role.USER,
};
const userB = {
  id: "auth0|demo-contract-b",
  username: "b@example.test",
  name: "User B",
  role: Role.USER,
};
const admin = {
  id: "auth0|demo-contract-admin",
  username: "manager@example.test",
  name: "Manager",
  role: Role.ADMIN,
};
const include = {
  items: { orderBy: { id: "asc" as const } },
  clientAddress: true,
  senderAddress: true,
};
const address = {
  street: "1 Test Street",
  city: "Halifax",
  postCode: "B3J 1A1",
  country: "Canada",
};
const list =
  "query { allInvoices { id clientName status total createdBy { id } } }";
const operations = {
  getInvoiceById:
    "query($id: String!) { getInvoiceById(id: $id) { id clientName } }",
  editInvoice:
    'mutation($id: String!) { editInvoice(id: $id, clientName: "Demo edit") { id clientName } }',
  markAsPaid: "mutation($id: String!) { markAsPaid(id: $id) { id status } }",
  removeInvoice:
    "mutation($id: String!) { removeInvoice(id: $id) { acknowledged } }",
  invoiceRevisions:
    "query($id: String!) { invoiceRevisions(invoiceId: $id) { id snapshot { clientName } } }",
  invoiceRevision:
    "query($first: String!) { invoiceRevision(id: $first) { id snapshot { clientName } } }",
  invoiceRevisionDiff:
    "query($first: String!, $second: String!) { invoiceRevisionDiff(fromRevisionId: $first, toRevisionId: $second) { fieldChanges { field before after } } }",
  restoreInvoiceRevision:
    "mutation($id: String!, $first: String!) { restoreInvoiceRevision(invoiceId: $id, revisionId: $first) { id clientName } }",
};

function harness(enabled: boolean, seed = false, signedUsers = false) {
  let jwks: Server | undefined;
  let privateKey: KeyObject;
  let issuer = "http://127.0.0.1:1/";
  const schemaName = `demo_contract_${randomUUID().replaceAll("-", "")}`;
  let prisma: PrismaClient;
  let server: ApolloServer<InjectedQueryContext>;
  let createContext: typeof import("../../src/GraphQL/createContext").createContext;
  let schemaUrl: string;

  beforeAll(async () => {
    // Read explicit opt-in before importing any dotenv-loading production module.
    const suppliedUrl = process.env["DATABASE_URL"];
    if (!suppliedUrl)
      throw new Error(
        "Demo tests require an explicit disposable PostgreSQL DATABASE_URL",
      );
    const url = new URL(suppliedUrl);
    if (!["postgresql:", "postgres:"].includes(url.protocol))
      throw new Error("PostgreSQL DATABASE_URL required");
    url.searchParams.set("schema", schemaName);
    schemaUrl = url.toString();
    prisma = new PrismaClient({ datasourceUrl: schemaUrl });
    execFileSync("npx", ["--no-install", "prisma", "migrate", "deploy"], {
      env: { ...process.env, DATABASE_URL: schemaUrl },
      stdio: "pipe",
    });

    if (signedUsers) {
      const keys = generateKeyPairSync("rsa", { modulusLength: 2048 });
      privateKey = keys.privateKey;
      const publicJwk = keys.publicKey.export({ format: "jwk" });
      jwks = createServer((_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            keys: [
              {
                ...publicJwk,
                kid: "demo-contract-key",
                alg: "RS256",
                use: "sig",
              },
            ],
          }),
        );
      });
      await new Promise<void>((resolve) =>
        jwks!.listen(0, "127.0.0.1", resolve),
      );
      const address = jwks.address();
      if (!address || typeof address === "string")
        throw new Error("JWKS listener unavailable");
      issuer = `http://127.0.0.1:${address.port}/`;
    }

    // Both cached server.config.NODE_ENV and the per-request NODE_ENV must be
    // production. Otherwise the existing test/CI ADMIN shortcut masks demo auth.
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("DEMO_MODE", String(enabled));
    vi.stubEnv("DEMO_MODE_ENABLED", undefined); // no invented future flag
    vi.stubEnv("DATABASE_URL", schemaUrl);
    vi.stubEnv("DEMO_DATABASE_URL", schemaUrl); // actual process-wide config path
    vi.stubEnv("DATABASE_URL_DEMO", schemaUrl);
    vi.stubEnv("DOMAIN", issuer);
    vi.stubEnv("AUDIENCE", "urn:demo-contract");
    ({ createContext } = await vi.importActual<
      typeof import("../../src/GraphQL/createContext")
    >("../../src/GraphQL/createContext"));
    const { default: container } = await vi.importActual<
      typeof import("../../src/config/inversify.config")
    >("../../src/config/inversify.config");
    const { default: TYPES } = await vi.importActual<
      typeof import("../../src/constants/identifiers")
    >("../../src/constants/identifiers");
    container.rebind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);
    const { default: typeDefs } = await vi.importActual<
      typeof import("../../src/GraphQL/typeDefs")
    >("../../src/GraphQL/typeDefs");
    const { getResolvers } = await vi.importActual<
      typeof import("../../src/resolvers")
    >("../../src/resolvers");
    server = new ApolloServer<InjectedQueryContext>({
      typeDefs,
      resolvers: getResolvers(),
    });
    await server.start();
  });

  beforeEach(async () => {
    await prisma.invoice.deleteMany();
    await prisma.clientAddress.deleteMany();
    await prisma.senderAddress.deleteMany();
    await prisma.user.deleteMany();
    if (seed) {
      // Execute the package's real seed command, unchanged, in the same schema.
      execFileSync("npx", ["--no-install", "prisma", "db", "seed"], {
        env: { ...process.env, DATABASE_URL: schemaUrl },
        stdio: "pipe",
      });
    } else {
      await prisma.user.createMany({ data: [demo, userA, userB, admin] });
      for (const [id, owner] of [
        ["DM1001", demo],
        ["AA1001", userA],
        ["BB1001", userB],
      ] as const) {
        const invoice = await prisma.invoice.create({
          data: {
            id,
            createdBy: { connect: { id: owner.id } },
            clientName: `${owner.name} current client`,
            clientEmail: owner.username,
            createdAt: "2026-10-01",
            paymentDue: "2026-10-15",
            paymentTerms: 14,
            description: "Demo isolation fixture",
            status: "pending",
            total: 100,
            clientAddress: { create: address },
            senderAddress: { create: address },
            items: {
              create: {
                id: `${id}-item`,
                name: "Design",
                quantity: 1,
                price: 100,
                total: 100,
              },
            },
          },
          include,
        });
        for (const revisionNumber of [1, 2]) {
          await prisma.invoiceRevision.create({
            data: {
              id: `${id}-revision-${revisionNumber}`,
              invoiceId: id,
              revisionNumber,
              createdById: owner.id,
              changeType: revisionNumber === 1 ? "create" : "edit",
              snapshot: {
                ...toSnapshot(invoice),
                clientName:
                  revisionNumber === 1
                    ? `${owner.name} original client`
                    : invoice.clientName,
              } as unknown as Prisma.InputJsonValue,
            },
          });
        }
      }
    }
  });

  afterAll(async () => {
    try {
      await server?.stop();
      if (prisma) {
        try {
          await prisma.$executeRawUnsafe(
            `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
          );
        } finally {
          await prisma.$disconnect();
        }
      }
    } finally {
      if (jwks)
        await new Promise<void>((resolve, reject) =>
          jwks!.close((error) => (error ? reject(error) : resolve())),
        );
      vi.unstubAllEnvs();
      vi.resetModules();
    }
  });

  async function context(token = "demo-token", transport = "HTTP") {
    return transport === "HTTP"
      ? createContext({
          req: createRequest<Request>({
            headers: { authorization: `Bearer ${token}` },
          }),
        })
      : createContext({
          connection: {
            connectionInitReceived: true,
            acknowledged: true,
            subscriptions: {},
            extra: {},
            connectionParams: { Authorization: `Bearer ${token}` },
          },
        });
  }
  async function execute(
    query: string,
    variables: Record<string, unknown> = {},
    token = "demo-token",
    transport = "HTTP",
  ) {
    const response = await server.executeOperation(
      { query, variables },
      { contextValue: await context(token, transport) },
    );
    if (response.body.kind !== "single")
      throw new Error("Expected a single GraphQL response");
    return response.body.singleResult;
  }
  async function state() {
    return {
      invoices: await prisma.invoice.findMany({
        include,
        orderBy: { id: "asc" },
      }),
      revisions: await prisma.invoiceRevision.findMany({
        orderBy: { id: "asc" },
      }),
    };
  }
  function authToken(
    user: typeof userA | typeof admin | typeof demo,
    extraClaims: Record<string, unknown> = {},
  ) {
    return jwt.sign(
      {
        ...extraClaims,
        sub: user.id,
        name: user.name,
        "invoice-web-app/email": user.username,
        "invoice-web-app/roles": user.role === "ADMIN" ? ["Admin"] : [],
      },
      privateKey,
      {
        algorithm: "RS256",
        keyid: "demo-contract-key",
        issuer,
        audience: "urn:demo-contract",
        expiresIn: "5m",
      },
    );
  }
  function reseed() {
    execFileSync("npx", ["--no-install", "prisma", "db", "seed"], {
      env: { ...process.env, DATABASE_URL: schemaUrl },
      stdio: "pipe",
    });
  }
  return { context, execute, state, authToken, reseed, db: () => prisma };
}

describe("production demo disabled", () => {
  const h = harness(false);
  for (const transport of ["HTTP", "WebSocket"]) {
    for (const token of ["demo-token", "demo-token-admin"]) {
      it(`rejects ${token} over ${transport}`, async () => {
        const before = await h.state();
        const ctx = await h.context(token, transport);
        expect.soft(ctx.user ?? null).toBeNull();
        expect(await h.state()).toEqual(before);
      });
    }
  }
});

describe("portfolio demo enabled", () => {
  const h = harness(true);

  it("provisions the anonymous normal demo identity as USER without Auth0 credentials", async () => {
    await h.db().invoice.deleteMany({ where: { createdById: demo.id } });
    await h.db().user.delete({ where: { id: demo.id } });
    const ctx = await h.context();
    expect(ctx.user).toMatchObject({ id: demo.id, role: Role.USER });
    expect(
      await h.db().user.findUnique({ where: { id: demo.id } }),
    ).toMatchObject({ role: Role.USER });
    const { default: TYPES } = await vi.importActual<
      typeof import("../../src/constants/identifiers")
    >("../../src/constants/identifiers");
    expect(ctx.container?.get(TYPES.PrismaClient)).toBe(h.db());
  });

  it("authenticates the WebSocket demo identity as USER", async () => {
    expect((await h.context("demo-token", "WebSocket")).user).toMatchObject({
      id: demo.id,
      role: Role.USER,
    });
  });

  it("keeps demoId a USER when an existing database row has ADMIN role", async () => {
    // HTTP context returns the stored DB user after binding services to the
    // token identity. Demo must remain USER at both boundaries, even on drift.
    await h
      .db()
      .user.update({ where: { id: demo.id }, data: { role: Role.ADMIN } });
    expect((await h.context()).user).toMatchObject({
      id: demo.id,
      role: Role.USER,
    });
  });

  for (const transport of ["HTTP", "WebSocket"]) {
    it(`rejects anonymous Demo Admin escalation over ${transport}`, async () => {
      await h.db().user.deleteMany({ where: { id: "demoAdminId" } });
      const ctx = await h.context("demo-token-admin", transport);
      expect.soft(ctx.user ?? null).toBeNull();
      expect.soft(ctx.user?.role).not.toBe(Role.ADMIN);
      expect(
        await h.db().user.findUnique({ where: { id: "demoAdminId" } }),
      ).toBeNull();
    });
  }

  it.each(["demoId", "demoAdminId"])(
    "rejects the bare identity %s as a bearer credential",
    async (token) => {
      expect((await h.context(token)).user ?? null).toBeNull();
    },
  );

  it("lists only demo-owned invoices in the same database as USER A and USER B", async () => {
    const result = await h.execute(list);
    expect(result.errors).toBeUndefined();
    expect(result.data?.["allInvoices"]).toEqual([
      expect.objectContaining({ id: "DM1001", createdBy: { id: demo.id } }),
    ]);
  });

  it("does not expose real-user invoices through the historical admin token", async () => {
    const before = await h.state();
    const result = await h.execute(list, {}, "demo-token-admin");
    expect.soft(result.data?.["allInvoices"] ?? null).toBeNull();
    expect.soft(result.errors?.length ?? 0).toBeGreaterThan(0);
    expect(await h.state()).toEqual(before);
  });

  it("allows demo-owned read, edit, payment, history and deletion through real context", async () => {
    for (const op of [
      "getInvoiceById",
      "editInvoice",
      "markAsPaid",
      "invoiceRevisions",
      "removeInvoice",
    ] as const) {
      const result = await h.execute(operations[op], { id: "DM1001" });
      expect(result.errors).toBeUndefined();
      expect(result.data?.[op]).toBeTruthy();
      if (op === "editInvoice")
        expect(
          (await h.state()).invoices.find((i) => i.id === "DM1001")?.clientName,
        ).toBe("Demo edit");
      if (op === "markAsPaid")
        expect(
          (await h.state()).invoices.find((i) => i.id === "DM1001")?.status,
        ).toBe("paid");
    }
    expect(
      await h.db().invoice.findUnique({ where: { id: "DM1001" } }),
    ).toBeNull();
    expect(
      await h.db().invoiceRevision.count({ where: { invoiceId: "DM1001" } }),
    ).toBe(0);
    expect(
      await h.db().invoice.count({
        where: { createdById: { in: [userA.id, userB.id] } },
      }),
    ).toBe(2);
  });

  // One demo-specific denial per operation, not another full USER/ADMIN matrix.
  for (const op of Object.keys(operations) as (keyof typeof operations)[]) {
    it(`denies ${op} on USER A data without reads or persisted changes`, async () => {
      const before = await h.state();
      const result = await h.execute(operations[op], {
        id: "AA1001",
        first: "AA1001-revision-1",
        second: "AA1001-revision-2",
      });
      expect.soft(result.data?.[op] ?? null).toBeNull();
      expect
        .soft(result.errors?.map((error) => error.extensions?.["code"]))
        .toEqual(["NOT_FOUND"]);
      expect(await h.state()).toEqual(before);
    });
  }

  it("shares demo-owned edits between independent request contexts", async () => {
    const before = await h.state();
    const edited = await h.execute(operations.editInvoice, { id: "DM1001" });
    expect(edited.errors).toBeUndefined();
    expect(
      (await h.state()).invoices.find((i) => i.id === "DM1001")?.clientName,
    ).toBe("Demo edit");
    // A new request is not a new demo entry. The current backend has no entry
    // boundary or reset operation; those acceptance cases are specified in the
    // audit instead of incorrectly requiring reset on every GraphQL request.
    const result = await h.execute(list);
    expect(result.errors).toBeUndefined();
    expect(result.data?.["allInvoices"]).toEqual([
      expect.objectContaining({ id: "DM1001", clientName: "Demo edit" }),
    ]);
    const after = await h.state();
    expect(
      after.invoices.filter((invoice) => invoice.createdById !== demo.id),
    ).toEqual(
      before.invoices.filter((invoice) => invoice.createdById !== demo.id),
    );
    expect(
      after.revisions.filter((revision) => revision.invoiceId !== "DM1001"),
    ).toEqual(
      before.revisions.filter((revision) => revision.invoiceId !== "DM1001"),
    );
  });
});

describe("canonical demo seed", () => {
  const h = harness(true, true);

  it("provides meaningful sample data and a complete five-revision history", async () => {
    const invoices = await h.db().invoice.findMany({ orderBy: { id: "asc" } });
    expect(invoices.map((invoice) => invoice.id)).toEqual(canonicalIds);
    expect(
      invoices.every(
        (invoice) => invoice.clientName && Number(invoice.total) > 0,
      ),
    ).toBe(true);
    expect(
      [...new Set(invoices.map((invoice) => invoice.status))].sort(),
    ).toEqual(["draft", "paid", "pending"]);
    expect(await h.db().invoiceRevision.count()).toBe(11);
    const current = invoices.find((invoice) => invoice.id === "RT3080")!;
    const latest = await h.db().invoiceRevision.findFirstOrThrow({
      where: { invoiceId: "RT3080" },
      orderBy: { revisionNumber: "desc" },
    });
    expect(latest.revisionNumber).toBe(5);
    expect(latest.snapshot).toMatchObject({
      total: Number(current.total),
      status: current.status,
    });
    console.info("DEMO SEED EVIDENCE", {
      users: await h.db().user.findMany({ select: { id: true, role: true } }),
      invoices: invoices.map((invoice) => ({
        id: invoice.id,
        owner: invoice.createdById,
        status: invoice.status,
        total: Number(invoice.total),
      })),
      revisions: await h.db().invoiceRevision.count(),
      latestRT3080: {
        revisionNumber: latest.revisionNumber,
        owner: latest.createdById,
        snapshot: latest.snapshot,
      },
    });
  });

  it("prepares the dedicated demo USER before any visitor request", async () => {
    expect(
      await h.db().user.findUnique({ where: { id: demo.id } }),
    ).toMatchObject({ id: demo.id, role: Role.USER });
  });

  it("assigns all seven canonical sample invoices and their history to demoId", async () => {
    const invoices = await h.db().invoice.findMany({ orderBy: { id: "asc" } });
    expect(invoices.map((invoice) => invoice.id)).toEqual(canonicalIds);
    expect
      .soft([...new Set(invoices.map((invoice) => invoice.createdById))])
      .toEqual([demo.id]);
    const history = await h.db().invoiceRevision.findMany({
      where: { invoiceId: "RT3080" },
      orderBy: { revisionNumber: "asc" },
    });
    expect(history.map((revision) => revision.revisionNumber)).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect([
      ...new Set(history.map((revision) => revision.createdById)),
    ]).toEqual([demo.id]);
  });

  it("shows the canonical invoices immediately on first anonymous demo entry", async () => {
    const result = await h.execute(list);
    expect(result.errors).toBeUndefined();
    const invoices = result.data?.["allInvoices"] as { id: string }[];
    expect(invoices.map((invoice) => invoice.id).sort()).toEqual(canonicalIds);
  });
});

describe("canonical demo reset", () => {
  const h = harness(true, false, true);
  const reset = "mutation { resetDemoData }";
  async function realState() {
    const state = await h.state();
    const invoices = state.invoices.filter(
      (invoice) => invoice.createdById !== demo.id,
    );
    return {
      users: await h
        .db()
        .user.findMany({
          where: { id: { not: demo.id } },
          orderBy: { id: "asc" },
        }),
      invoices,
      revisions: state.revisions.filter((revision) =>
        invoices.some((invoice) => invoice.id === revision.invoiceId),
      ),
    };
  }
  async function canonicalState() {
    const state = await h.state();
    return {
      invoices: state.invoices
        .filter((invoice) => invoice.createdById === demo.id)
        .map((invoice) => ({
          id: invoice.id,
          owner: invoice.createdById,
          ...toSnapshot(invoice),
        })),
      revisions: state.revisions.filter((revision) =>
        state.invoices.some(
          (invoice) =>
            invoice.id === revision.invoiceId &&
            invoice.createdById === demo.id,
        ),
      ),
    };
  }
  async function allRows() {
    return {
      ...(await h.state()),
      users: await h.db().user.findMany({ orderBy: { id: "asc" } }),
      clients: await h.db().clientAddress.findMany({ orderBy: { id: "asc" } }),
      senders: await h.db().senderAddress.findMany({ orderBy: { id: "asc" } }),
    };
  }
  beforeEach(async () => {
    const result = await h.execute(reset);
    expect(result.errors).toBeUndefined();
    expect(result.data?.["resetDemoData"]).toBe(true);
  });

  it("restores canonical fields, items and revisions after visitor edits, payment, deletion, creation and restore", async () => {
    const canonical = await canonicalState();
    const real = await realState();
    const queries = [
      'mutation { editInvoice(id: "XM9141", clientName: "Visitor", items: [{ name: "Changed", quantity: 2, price: 3 }]) { id } }',
      'mutation { markAsPaid(id: "AA1449") { id } }',
      'mutation { removeInvoice(id: "TY9141") { acknowledged } }',
      'mutation { addInvoice(id: "DD1001", status: "draft", clientName: "Extra visitor invoice") { id } }',
      'mutation { restoreInvoiceRevision(invoiceId: "RT3080", revisionId: "demo-RT3080-revision-1") { id } }',
    ];
    for (const query of queries)
      expect((await h.execute(query)).errors).toBeUndefined();
    expect(await canonicalState()).not.toEqual(canonical);
    expect((await h.execute(reset)).errors).toBeUndefined();
    expect(await canonicalState()).toEqual(canonical);
    expect(await realState()).toEqual(real);
    expect(
      await h.db().invoice.findUnique({ where: { id: "DD1001" } }),
    ).toBeNull();
  });

  it("is idempotent, repairs the stored demo role and does not accumulate addresses or history", async () => {
    const canonical = await canonicalState();
    const real = await realState();
    const clients = await h.db().clientAddress.count();
    const senders = await h.db().senderAddress.count();
    await h
      .db()
      .user.update({ where: { id: demo.id }, data: { role: Role.ADMIN } });
    for (let i = 0; i < 2; i++)
      expect((await h.execute(reset)).errors).toBeUndefined();
    expect(
      await h.db().user.findUnique({ where: { id: demo.id } }),
    ).toMatchObject({ role: Role.USER });
    expect(await canonicalState()).toEqual(canonical);
    expect(await realState()).toEqual(real);
    expect(await h.db().clientAddress.count()).toBe(clients);
    expect(await h.db().senderAddress.count()).toBe(senders);
  });

  it("does not accumulate orphan addresses across repeated create, delete and reset cycles", async () => {
    const canonical = await canonicalState();
    const real = await realState();
    let before = await allRows();
    const counts = async () => ({
      invoices: await h.db().invoice.count(),
      items: await h.db().item.count(),
      revisions: await h.db().invoiceRevision.count(),
      clients: await h.db().clientAddress.count(),
      senders: await h.db().senderAddress.count(),
    });
    const expected = await counts();
    for (let cycle = 0; cycle < 3; cycle++) {
      const created = await h.execute(
        `mutation($client: ClientInfo, $sender: SenderInfo) {
          addInvoice(id: "DD1001", status: "draft", clientAddress: $client,
            senderAddress: $sender, items: [{ name: "Synthetic", quantity: 2, price: 3 }]) { id }
        }`,
        { client: address, sender: address },
      );
      expect(created.errors).toBeUndefined();
      expect(created.data?.["addInvoice"]).toEqual({ id: "DD1001" });
      expect(await counts()).toEqual({
        invoices: expected.invoices + 1,
        items: expected.items + 1,
        revisions: expected.revisions + 1,
        clients: expected.clients + 1,
        senders: expected.senders + 1,
      });
      const deleted = await h.execute(operations.removeInvoice, {
        id: "DD1001",
      });
      expect(deleted.errors).toBeUndefined();
      expect(deleted.data?.["removeInvoice"]).toEqual({ acknowledged: true });
      expect(await allRows()).toEqual(before);
      expect((await h.execute(reset)).errors).toBeUndefined();
      expect(await counts()).toEqual(expected);
      expect(await canonicalState()).toEqual(canonical);
      expect(await realState()).toEqual(real);
      expect(
        await h.db().clientAddress.count({ where: { Invoice: { is: null } } }),
      ).toBe(0);
      expect(
        await h.db().senderAddress.count({ where: { Invoice: { is: null } } }),
      ).toBe(0);
      // Reset generates new canonical address IDs; compare the next deletion
      // against its own complete baseline, not the prior reset's IDs.
      before = await allRows();
    }
  });

  for (const actor of [userA, userB, admin, demo]) {
    it(`rejects reset from normal Auth0 identity ${actor.id} even with matching demoId`, async () => {
      const before = await allRows();
      const result = await h.execute(reset, {}, h.authToken(actor));
      expect(result.errors?.map((error) => error.extensions?.["code"])).toEqual(
        ["FORBIDDEN"],
      );
      expect(await allRows()).toEqual(before);
    });
  }

  it("rejects reset without authentication", async () => {
    const before = await allRows();
    const result = await h.execute(reset, {}, "");
    expect(result.errors?.map((error) => error.extensions?.["code"])).toEqual([
      "FORBIDDEN",
    ]);
    expect(await allRows()).toEqual(before);
  });

  it("refuses a canonical ID owned by a real user without deleting or transferring any rows", async () => {
    await h
      .db()
      .invoice.update({
        where: { id: "RT3080" },
        data: { createdById: userA.id },
      });
    const before = await allRows();
    expect((await h.execute(reset)).errors).toBeDefined();
    expect(await allRows()).toEqual(before);
  });

  it("rolls back the entire reset when a later canonical insert fails", async () => {
    await h.db().invoice.delete({ where: { id: "RT3080" } });
    await h
      .db()
      .item.update({
        where: { id: "AA1001-item" },
        data: { id: "demo-RT3080-item-1" },
      });
    await h
      .db()
      .user.update({ where: { id: demo.id }, data: { role: Role.ADMIN } });
    const before = await allRows();
    expect((await h.execute(reset)).errors).toBeDefined();
    expect(await allRows()).toEqual(before);
  });

  it("reseed uses the same canonical reset while preserving normal-user records", async () => {
    const canonical = await canonicalState();
    const real = await realState();
    expect(
      (await h.execute(operations.editInvoice, { id: "XM9141" })).errors,
    ).toBeUndefined();
    h.reseed();
    h.reseed();
    expect(await canonicalState()).toEqual(canonical);
    expect(await realState()).toEqual(real);
  });

  it("resets on explicit entry over either transport while ordinary requests retain shared edits", async () => {
    const canonical = await canonicalState();
    for (const transport of ["HTTP", "WebSocket"]) {
      expect(
        (await h.execute(operations.editInvoice, { id: "XM9141" })).errors,
      ).toBeUndefined();
      const edited = await h.execute(list);
      expect(edited.data?.["allInvoices"]).toContainEqual(
        expect.objectContaining({ id: "XM9141", clientName: "Demo edit" }),
      );
      const result = await h.execute(reset, {}, "demo-token", transport);
      expect(result.errors).toBeUndefined();
      expect(result.data?.["resetDemoData"]).toBe(true);
      expect(await canonicalState()).toEqual(canonical);
    }
  });

  it("retains stored roles for normal Auth0 users while demo remains USER", async () => {
    await h
      .db()
      .user.update({ where: { id: userB.id }, data: { role: Role.ADMIN } });
    expect((await h.context(h.authToken(userB))).user).toMatchObject({
      id: userB.id,
      role: Role.ADMIN,
    });
    await h
      .db()
      .user.update({ where: { id: demo.id }, data: { role: Role.ADMIN } });
    for (const transport of ["HTTP", "WebSocket"]) {
      expect((await h.context("demo-token", transport)).user).toMatchObject({
        id: demo.id,
        role: Role.USER,
        isDemo: true,
      });
    }
  });
});

describe("Slice 4C adversarial Demo regressions", () => {
  const h = harness(true, false, true);
  const reset = "mutation { resetDemoData }";

  it("ignores signed JWT isDemo claims and rejects reset without any database changes", async () => {
    const before = {
      ...(await h.state()),
      users: await h.db().user.findMany({ orderBy: { id: "asc" } }),
      clients: await h.db().clientAddress.findMany({ orderBy: { id: "asc" } }),
      senders: await h.db().senderAddress.findMany({ orderBy: { id: "asc" } }),
    };
    const token = h.authToken(demo, { isDemo: true, role: "USER" });
    expect(jwt.decode(token)).toMatchObject({ sub: demo.id, isDemo: true });
    const ctx = await h.context(token);
    expect(ctx.user).toMatchObject({ id: demo.id, role: Role.USER });
    expect(ctx.user?.isDemo).not.toBe(true);
    const result = await h.execute(reset, {}, token);
    expect(result.errors?.map((error) => error.extensions?.["code"])).toEqual([
      "FORBIDDEN",
    ]);
    expect({
      ...(await h.state()),
      users: await h.db().user.findMany({ orderBy: { id: "asc" } }),
      clients: await h.db().clientAddress.findMany({ orderBy: { id: "asc" } }),
      senders: await h.db().senderAddress.findMany({ orderBy: { id: "asc" } }),
    }).toEqual(before);
    expect(
      await h.db().invoice.count({ where: { createdById: demo.id } }),
    ).toBe(1);
  });

  it("rejects invoiceAdded with real WebSocket Demo context despite a persisted ADMIN role", async () => {
    await h
      .db()
      .user.update({ where: { id: demo.id }, data: { role: Role.ADMIN } });
    expect(
      await h.db().user.findUnique({ where: { id: demo.id } }),
    ).toMatchObject({ role: Role.ADMIN });
    const ctx = await h.context("demo-token", "WebSocket");
    expect(ctx.user).toMatchObject({
      id: demo.id,
      role: Role.USER,
      isDemo: true,
    });
    const { getInvoiceResolvers } = await vi.importActual<
      typeof import("../../src/resolvers/invoiceResolvers")
    >("../../src/resolvers/invoiceResolvers");
    const subscribe = getInvoiceResolvers().Subscription.invoiceAdded.subscribe;
    const iterator = vi.spyOn(ctx.pubsub!, "asyncIterator");
    expect(() =>
      subscribe(undefined as never, undefined as never, ctx),
    ).toThrowError(
      expect.objectContaining({
        message: "Not authorized to subscribe",
        extensions: { code: "FORBIDDEN" },
      }),
    );
    expect(iterator).not.toHaveBeenCalled();
    iterator.mockRestore();
    expect((await h.context()).user).toMatchObject({
      id: demo.id,
      role: Role.USER,
      isDemo: true,
    });
  });

  it("serializes five concurrent GraphQL resets and restores canonical invoices/history without changing real users", async () => {
    const before = await h.state();
    const realInvoices = before.invoices.filter(
      (invoice) => invoice.createdById !== demo.id,
    );
    const realRevisions = before.revisions.filter((revision) =>
      realInvoices.some((invoice) => invoice.id === revision.invoiceId),
    );
    const realUsers = await h
      .db()
      .user.findMany({
        where: { id: { not: demo.id } },
        orderBy: { id: "asc" },
      });
    await h
      .db()
      .user.update({ where: { id: demo.id }, data: { role: Role.ADMIN } });
    const results = await Promise.all(
      Array.from({ length: 5 }, () => h.execute(reset)),
    );
    for (const result of results) {
      expect(result.errors).toBeUndefined();
      expect(result.data?.["resetDemoData"]).toBe(true);
    }
    const after = await h.state();
    const invoices = after.invoices.filter(
      (invoice) => invoice.createdById === demo.id,
    );
    const records = canonicalDemoRecords();
    expect(records).toHaveLength(7);
    expect(invoices.map((invoice) => invoice.id)).toEqual(
      records.map((record) => record.id).sort(),
    );
    expect(new Set(invoices.map((invoice) => invoice.id)).size).toBe(7);
    const revisions = after.revisions.filter((revision) =>
      invoices.some((invoice) => invoice.id === revision.invoiceId),
    );
    const expectedRevisionCount = records.reduce(
      (count, record) => count + record.snapshots.length,
      0,
    );
    expect(expectedRevisionCount).toBe(11);
    expect(revisions).toHaveLength(expectedRevisionCount);
    for (const record of records) {
      const invoice = invoices.find((invoice) => invoice.id === record.id)!;
      expect(toSnapshot(invoice)).toEqual(record.invoice);
      const history = revisions
        .filter((revision) => revision.invoiceId === record.id)
        .sort((a, b) => a.revisionNumber - b.revisionNumber);
      expect(history.map((revision) => revision.snapshot)).toEqual(
        record.snapshots,
      );
      expect(history.map((revision) => revision.revisionNumber)).toEqual(
        record.snapshots.map((_snapshot, index) => index + 1),
      );
      expect(
        history.every((revision) => revision.createdById === demo.id),
      ).toBe(true);
    }
    expect(
      after.invoices.filter((invoice) => invoice.createdById !== demo.id),
    ).toEqual(realInvoices);
    expect(
      after.revisions.filter((revision) =>
        realInvoices.some((invoice) => invoice.id === revision.invoiceId),
      ),
    ).toEqual(realRevisions);
    expect(
      await h
        .db()
        .user.findMany({
          where: { id: { not: demo.id } },
          orderBy: { id: "asc" },
        }),
    ).toEqual(realUsers);
    expect(
      await h.db().user.findUnique({ where: { id: demo.id } }),
    ).toMatchObject({ role: Role.USER });
  });
});
