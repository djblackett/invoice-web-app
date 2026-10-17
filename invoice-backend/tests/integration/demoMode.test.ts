import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { Prisma, PrismaClient, Role } from "@prisma/client";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
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

function harness(enabled: boolean, seed = false) {
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

    // Both cached server.config.NODE_ENV and the per-request NODE_ENV must be
    // production. Otherwise the existing test/CI ADMIN shortcut masks demo auth.
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("DEMO_MODE", String(enabled));
    vi.stubEnv("DEMO_MODE_ENABLED", undefined); // no invented future flag
    vi.stubEnv("DATABASE_URL", schemaUrl);
    vi.stubEnv("DEMO_DATABASE_URL", schemaUrl); // actual process-wide config path
    vi.stubEnv("DATABASE_URL_DEMO", schemaUrl);
    vi.stubEnv("DOMAIN", "http://127.0.0.1:1/");
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
  ) {
    const response = await server.executeOperation(
      { query, variables },
      { contextValue: await context(token) },
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
  return { context, execute, state, db: () => prisma };
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
