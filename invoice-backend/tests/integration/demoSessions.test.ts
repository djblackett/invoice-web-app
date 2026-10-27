import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { PrismaClient, type Prisma } from "@prisma/client";
import { execFileSync } from "node:child_process";
import {
  createHash,
  generateKeyPairSync,
  randomUUID,
  type KeyObject,
} from "node:crypto";
import { createServer, type Server } from "node:http";
import { createClient, type Client } from "graphql-ws";
import WebSocket from "ws";
import { createRequest } from "node-mocks-http";
import type { Request } from "express";
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
import type { InjectedQueryContext } from "../../src/constants/types";
import {
  canonicalDemoRecords,
  resetDemoWorkspace,
} from "../../prisma/demoWorkspace.cjs";
import { toSnapshot } from "../../src/services/invoiceDiff";
import {
  allocateDemoSession,
  cleanupExpiredDemoSessions,
  resolveDemoSession,
  DEMO_SESSION_CAPACITY,
  DEMO_SESSION_LIFETIME_MS,
} from "../../src/services/demoSession.service";

const schema = `temporary_demo_${randomUUID().replaceAll("-", "")}`;
const include = { items: true, clientAddress: true, senderAddress: true };
let prisma: PrismaClient;
let secondClient: PrismaClient;
let server: ApolloServer<InjectedQueryContext>;
let http: Server;
let jwks: Server;
let realServer: Server;
let endpoint: string;
let wsUrl: string;
let issuer: string;
let privateKey: KeyObject;
let contextFactory: typeof import("../../src/GraphQL/createContext").createContext;
const realUser = {
  id: "auth0|ordinary",
  username: "ordinary@example.test",
  name: "Ordinary",
  role: "USER" as const,
};

async function listen(server: Server) {
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("No local listener");
  return `http://127.0.0.1:${address.port}`;
}
function signedToken(id = realUser.id, admin = false) {
  return jwt.sign(
    {
      sub: id,
      name: realUser.name,
      "invoice-web-app/email": realUser.username,
      "invoice-web-app/roles": admin ? ["Admin"] : [],
      isDemo: true,
      demoSessionId: "untrusted",
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
async function context(token: string, ws = false) {
  return contextFactory(
    ws
      ? {
          connection: {
            connectionInitReceived: true,
            acknowledged: true,
            subscriptions: {},
            extra: {},
            connectionParams: { Authorization: `Bearer ${token}` },
          },
        }
      : {
          req: createRequest<Request>({
            headers: { authorization: `Bearer ${token}` },
          }),
        },
  );
}
async function execute(
  token: string,
  query: string,
  variables: Record<string, unknown> = {},
  ws = false,
) {
  const response = await server.executeOperation(
    { query, variables },
    { contextValue: await context(token, ws) },
  );
  if (response.body.kind !== "single") throw new Error("Unexpected response");
  return response.body.singleResult;
}
async function snapshotDatabase() {
  return {
    users: await prisma.user.findMany({ orderBy: { id: "asc" } }),
    sessions: await prisma.demoSession.findMany({ orderBy: { id: "asc" } }),
    invoices: await prisma.invoice.findMany({
      include,
      orderBy: { id: "asc" },
    }),
    revisions: await prisma.invoiceRevision.findMany({
      orderBy: { id: "asc" },
    }),
    clientAddresses: await prisma.clientAddress.findMany({
      orderBy: { id: "asc" },
    }),
    senderAddresses: await prisma.senderAddress.findMany({
      orderBy: { id: "asc" },
    }),
    gate: await prisma.demoAllocationState.findMany(),
  };
}
async function expire(userId: string) {
  const expiresAt = new Date(Date.now() - 1000);
  await prisma.demoSession.update({
    where: { userId },
    data: {
      expiresAt,
      createdAt: new Date(expiresAt.getTime() - DEMO_SESSION_LIFETIME_MS),
    },
  });
}
async function until(condition: () => boolean) {
  const deadline = Date.now() + 5000;
  while (!condition()) {
    if (Date.now() > deadline) throw new Error("Timed out");
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}
async function identity(credential: string) {
  const user = await resolveDemoSession(prisma, credential);
  if (!user) throw new Error("Session rejected");
  return user;
}
async function fillCapacity(count: number) {
  for (let i = 0; i < count; i++) {
    const id = `demo-session:${randomUUID()}`;
    const expiresAt = new Date(Date.now() - 1000);
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
    {
      env: { ...process.env, DATABASE_URL: schemaUrl },
      stdio: "pipe",
    },
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
  issuer = `${await listen(jwks)}/`;
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
  ({ createContext: contextFactory } = await import(
    "../../src/GraphQL/createContext"
  ));
  const { default: typeDefs } = await import("../../src/GraphQL/typeDefs");
  const { getResolvers } = await import("../../src/resolvers");
  server = new ApolloServer({ typeDefs, resolvers: getResolvers() });
  await server.start();
  const { createApp } = await import("../../src/app");
  http = createServer(await createApp());
  endpoint = `${await listen(http)}/demo/sessions`;
  // The production HTTP+WebSocket wiring (ws + graphql-ws + createContext).
  const { createServer: createProductionServer } = await import(
    "../../src/server"
  );
  realServer = (await createProductionServer())[1] as Server;
  wsUrl = (await listen(realServer)).replace("http://", "ws://");
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
  await prisma.user.create({ data: realUser });
  const record = canonicalDemoRecords()[0]!;
  const { items, clientAddress, senderAddress, ...fields } = record.invoice;
  const invoice = await prisma.invoice.create({
    data: {
      ...fields,
      id: "real-invoice",
      createdBy: { connect: { id: realUser.id } },
      items: { create: items.map((i) => ({ ...i, id: randomUUID() })) },
      clientAddress: { create: clientAddress },
      senderAddress: { create: senderAddress },
    },
    include,
  });
  await prisma.invoiceRevision.create({
    data: {
      id: "real-revision",
      invoiceId: invoice.id,
      createdById: realUser.id,
      revisionNumber: 1,
      changeType: "create",
      snapshot: toSnapshot(invoice) as unknown as Prisma.InputJsonObject,
    },
  });
});
afterAll(async () => {
  await server?.stop();
  realServer?.closeAllConnections();
  for (const listener of [http, jwks, realServer])
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

describe("temporary demo sessions", () => {
  it("allocates simultaneous independent identities and identical canonical content with disjoint IDs, including snapshots", async () => {
    const sessions = await Promise.all([
      allocateDemoSession(prisma),
      allocateDemoSession(secondClient),
    ]);
    expect(sessions[0]!.credential).not.toBe(sessions[1]!.credential);
    const idSets: Set<string>[] = [];
    for (const session of sessions) {
      const user = await identity(session.credential);
      const stored = await prisma.demoSession.findUniqueOrThrow({
        where: { userId: user.id },
      });
      expect(stored.credentialHash).toBe(
        createHash("sha256").update(session.credential).digest("hex"),
      );
      expect(JSON.stringify(await snapshotDatabase())).not.toContain(
        session.credential,
      );
      expect(stored.expiresAt.getTime() - stored.createdAt.getTime()).toBe(
        DEMO_SESSION_LIFETIME_MS,
      );
      const invoices = await prisma.invoice.findMany({
        where: { createdById: user.id },
        include,
      });
      expect(invoices).toHaveLength(7);
      const ids = new Set<string>();
      for (const record of canonicalDemoRecords()) {
        const invoice = invoices.find((i) => i.id.startsWith(`${record.id}-`))!;
        expect(invoice).toBeDefined();
        ids.add(invoice.id);
        const revisions = await prisma.invoiceRevision.findMany({
          where: { invoiceId: invoice.id },
          orderBy: { revisionNumber: "asc" },
        });
        const normalize = (value: unknown) => {
          const snapshot = toSnapshot(value);
          return {
            ...snapshot,
            items: snapshot.items
              .map(({ id: _id, ...i }) => i)
              .sort((a, b) => a.name.localeCompare(b.name)),
          };
        };
        expect(normalize(invoice)).toEqual(normalize(record.invoice));
        expect(revisions).toHaveLength(record.snapshots.length);
        for (const [i, revision] of revisions.entries()) {
          ids.add(revision.id);
          expect(normalize(revision.snapshot)).toEqual(
            normalize(record.snapshots[i]),
          );
          for (const item of toSnapshot(revision.snapshot).items) {
            expect(item.id).not.toMatch(/^demo-/);
            ids.add(item.id);
          }
        }
        expect(toSnapshot(revisions.at(-1)!.snapshot)).toEqual(
          toSnapshot(invoice),
        );
        invoice.items.forEach((i) => ids.add(i.id));
      }
      idSets.push(ids);
    }
    expect([...idSets[0]!].filter((id) => idSets[1]!.has(id))).toEqual([]);
  });

  it("reads each visitor's RT3080 through HTTP and WS contexts, isolating invoices, revisions, diffs and users", async () => {
    const [a, b] = await Promise.all([
      allocateDemoSession(prisma),
      allocateDemoSession(secondClient),
    ]);
    const aUser = await identity(a.credential);
    const bUser = await identity(b.credential);
    const aInvoice = await prisma.invoice.findFirstOrThrow({
      where: { createdById: aUser.id, id: { startsWith: "RT3080-" } },
    });
    const bInvoice = await prisma.invoice.findFirstOrThrow({
      where: { createdById: bUser.id, id: { startsWith: "RT3080-" } },
    });
    const bRevision = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: bInvoice.id },
    });
    const aRevision = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: aInvoice.id },
    });
    const ownedIds = new Map<string, string[]>();
    for (const [credential, userId] of [
      [a.credential, aUser.id],
      [b.credential, bUser.id],
    ] as const)
      ownedIds.set(
        credential,
        (
          await prisma.invoice.findMany({
            where: { createdById: userId },
            select: { id: true },
          })
        )
          .map((i) => i.id)
          .sort(),
      );
    expect(ownedIds.get(a.credential)).toHaveLength(7);
    expect(ownedIds.get(a.credential)).toContain(aInvoice.id);
    expect(ownedIds.get(b.credential)).toContain(bInvoice.id);
    for (const ws of [false, true]) {
      for (const [credential, own, other] of [
        [a.credential, aInvoice.id, bInvoice.id],
        [b.credential, bInvoice.id, aInvoice.id],
      ]) {
        const list = await execute(
          credential!,
          "{ allInvoices { id clientName } }",
          {},
          ws,
        );
        expect(list.errors).toBeUndefined();
        // Exact complete set: no foreign, shared-demo, ordinary or missing IDs.
        expect(
          (list.data?.["allInvoices"] as { id: string }[])
            .map((i) => i.id)
            .sort(),
        ).toEqual(ownedIds.get(credential!));
        const ownResult = await execute(
          credential!,
          "query($id: String!) { getInvoiceById(id: $id) { id clientName } }",
          { id: own },
          ws,
        );
        expect(ownResult.data?.["getInvoiceById"]).toEqual({
          id: own,
          clientName: "Northstar Studio",
        });
        for (const id of [other, "real-invoice", "RT3080"]) {
          const result = await execute(
            credential!,
            "query($id: String!) { getInvoiceById(id: $id) { id } }",
            { id },
            ws,
          );
          expect(result.errors?.[0]?.extensions?.["code"]).toBe("NOT_FOUND");
        }
      }
      for (const id of [bRevision.id, "real-revision"]) {
        const result = await execute(
          a.credential,
          "query($id: String!) { invoiceRevision(id: $id) { id } }",
          { id },
          ws,
        );
        expect(result.errors?.[0]?.extensions?.["code"]).toBe("NOT_FOUND");
      }
      for (const id of [bInvoice.id, "real-invoice"]) {
        const result = await execute(
          a.credential,
          "query($id: String!) { invoiceRevisions(invoiceId: $id) { id } }",
          { id },
          ws,
        );
        expect(result.errors?.[0]?.extensions?.["code"]).toBe("NOT_FOUND");
      }
      const diff = await execute(
        a.credential,
        "query($a: String!, $b: String!) { invoiceRevisionDiff(fromRevisionId: $a, toRevisionId: $b) { fieldChanges { field } } }",
        { a: aRevision.id, b: bRevision.id },
        ws,
      );
      expect(diff.errors?.[0]?.extensions?.["code"]).toBe("NOT_FOUND");
      for (const id of [realUser.id, bUser.id]) {
        const result = await execute(
          a.credential,
          "query($id: String!) { getUserById(id: $id) { id } }",
          { id },
          ws,
        );
        expect(result.errors?.[0]?.extensions?.["code"]).toBe("NOT_FOUND");
      }
      expect(
        (await execute(a.credential, "{ allUsers { id } }", {}, ws)).errors?.[0]
          ?.extensions?.["code"],
      ).toBe("FORBIDDEN");
    }
  });

  it("re-authenticates every operation on one persistent real WebSocket: the admin feed stays denied, and revocation or expiry cuts off access", async () => {
    type Outcome = {
      payloads: number; // results carrying data; a denial is an errors-only result
      data?: Record<string, unknown> | null | undefined;
      errors?: readonly { extensions?: Record<string, unknown> }[] | undefined;
    };
    const operation = (client: Client, query: string) =>
      new Promise<Outcome>((resolve) => {
        const outcome: Outcome = { payloads: 0 };
        client.subscribe(
          { query },
          {
            next: (value) => {
              if (value.data) outcome.payloads++;
              outcome.data = value.data;
              outcome.errors = value.errors;
            },
            error: (errors) =>
              resolve({
                ...outcome,
                errors: Array.isArray(errors) ? errors : [errors as never],
              }),
            complete: () => resolve(outcome),
          },
        );
      });
    for (const ending of ["revoked", "expired"] as const) {
      const session = await allocateDemoSession(prisma);
      const user = await identity(session.credential);
      const owned = (
        await prisma.invoice.findMany({
          where: { createdById: user.id },
          select: { id: true },
        })
      )
        .map((i) => i.id)
        .sort();
      let connections = 0;
      const client = createClient({
        url: wsUrl,
        webSocketImpl: WebSocket,
        lazy: false, // one socket for the whole test, not one per operation
        retryAttempts: 0, // a dropped socket must fail the test, not reconnect
        connectionParams: { Authorization: `Bearer ${session.credential}` },
        on: { connected: () => void connections++ },
      });
      try {
        const list = await operation(client, "{ allInvoices { id } }");
        expect(list.errors).toBeUndefined();
        expect(
          (list.data?.["allInvoices"] as { id: string }[])
            .map((i) => i.id)
            .sort(),
        ).toEqual(owned);
        const feed = await operation(
          client,
          "subscription { invoiceAdded { id } }",
        );
        expect(feed.payloads).toBe(0);
        expect(feed.errors?.[0]?.extensions?.["code"]).toBe("FORBIDDEN");

        if (ending === "revoked")
          await prisma.demoSession.update({
            where: { userId: user.id },
            data: { revokedAt: new Date() },
          });
        else await expire(user.id);

        // Same socket, same connectionParams: the server re-resolves the
        // credential for each operation (graphql-ws calls `context` per subscribe).
        const after = await operation(client, "{ allInvoices { id } }");
        expect(after.data?.["allInvoices"] ?? null).toBeNull();
        expect(after.errors?.length).toBeGreaterThan(0);
        const feedAfter = await operation(
          client,
          "subscription { invoiceAdded { id } }",
        );
        expect(feedAfter.payloads).toBe(0);
        expect(feedAfter.errors?.length).toBeGreaterThan(0);
        expect(connections).toBe(1);
      } finally {
        await client.dispose();
      }
    }
  });

  it("forces USER despite persisted ADMIN and rejects signed Auth0 impersonation of reserved IDs", async () => {
    const session = await allocateDemoSession(prisma);
    const user = await identity(session.credential);
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
    });
    for (const ws of [false, true]) {
      const ctx = await context(session.credential, ws);
      expect(ctx.user).toMatchObject({
        role: "USER",
        isDemo: true,
        demoSessionId: user.demoSessionId,
      });
      expect(await ctx.invoiceService!.getInvoices()).toHaveLength(7);
      expect(
        (await execute(session.credential, "{ allUsers { id } }", {}, ws))
          .errors,
      ).toBeDefined();
      for (const id of [user.id, "demoId", "demo-session:unallocated"])
        expect((await context(signedToken(id, true), ws)).user).toBeNull();
    }
    await expect(
      (await context(session.credential)).userService!.createUserWithAuth0(
        user,
      ),
    ).rejects.toThrow("read-only");
  });

  it("preserves real Auth0 authentication, provisioning and ownership", async () => {
    const session = await allocateDemoSession(prisma);
    const token = signedToken();
    const ctx = await context(token);
    expect(ctx.user).toMatchObject(realUser);
    expect(ctx.user?.isDemo).toBeUndefined();
    expect(ctx.user?.demoSessionId).toBeUndefined();
    expect(await ctx.invoiceService!.getInvoices()).toHaveLength(1);
    const own = await ctx.invoiceService!.getInvoiceById("real-invoice");
    expect(own.createdById).toBe(realUser.id);
    const demoInvoice = await prisma.invoice.findFirstOrThrow({
      where: { createdById: (await identity(session.credential)).id },
    });
    await expect(
      ctx.invoiceService!.getInvoiceById(demoInvoice.id),
    ).rejects.toThrow("Invoice not found");
    const changed = await ctx.invoiceService!.updateInvoice("real-invoice", {
      clientName: "Ordinary edit",
    });
    expect(changed.clientName).toBe("Ordinary edit");
    const adminContext = await context(signedToken(realUser.id, true), true);
    expect(await adminContext.invoiceService!.getInvoices()).toHaveLength(8);
    await prisma.invoice.deleteMany({ where: { createdById: realUser.id } });
    await prisma.user.delete({ where: { id: realUser.id } });
    expect((await context(token)).user?.id).toBe(realUser.id);
  });

  it("rejects invalid, expired, revoked and feature-disabled credentials without sliding expiry", async () => {
    const session = await allocateDemoSession(prisma);
    const user = await identity(session.credential);
    const before = await prisma.demoSession.findUniqueOrThrow({
      where: { userId: user.id },
    });
    for (const ws of [false, true]) {
      for (const bad of [
        "demo-session",
        "demo-session-v2.bad",
        "demo-session-v1." + "0".repeat(64),
        session.credential + "x",
        session.credential.slice(0, -1),
      ]) {
        expect((await context(bad, ws)).user).toBeNull();
      }
      expect((await context(session.credential, ws)).user?.id).toBe(user.id);
    }
    expect(
      await prisma.demoSession.findUnique({ where: { userId: user.id } }),
    ).toEqual(before);
    await prisma.demoSession.update({
      where: { userId: user.id },
      data: { revokedAt: new Date() },
    });
    for (const ws of [false, true])
      expect((await context(session.credential, ws)).user).toBeNull();
    await prisma.demoSession.update({
      where: { userId: user.id },
      data: { revokedAt: null },
    });
    await expire(user.id);
    for (const ws of [false, true])
      expect((await context(session.credential, ws)).user).toBeNull();
    const active = await allocateDemoSession(prisma);
    for (const flag of [undefined, "false", "TRUE", "1", ""]) {
      vi.stubEnv("DEMO_SESSIONS_ENABLED", flag);
      expect((await context(active.credential)).user).toBeNull();
      await expect(allocateDemoSession(prisma)).rejects.toMatchObject({
        code: "DISABLED",
      });
    }
  });

  it("blocks every GraphQL mutation and service mutation for temporary sessions with zero database changes", async () => {
    const session = await allocateDemoSession(prisma);
    const ctx = await context(session.credential);
    const invoice = (await ctx.invoiceService!.getInvoices())[0]!;
    const revision = await prisma.invoiceRevision.findFirstOrThrow({
      where: { invoiceId: invoice.id },
    });
    const before = await snapshotDatabase();
    const { getResolvers } = await import("../../src/resolvers");
    for (const resolver of Object.values(getResolvers().Mutation)) {
      expect(() => resolver({}, {}, ctx)).toThrow("read-only");
    }
    for (const query of [
      `mutation { editInvoice(id: "${invoice.id}", clientName: "Attack") { id } }`,
      `mutation { markAsPaid(id: "${invoice.id}") { id } }`,
      `mutation { removeInvoice(id: "${invoice.id}") { acknowledged } }`,
      `mutation { restoreInvoiceRevision(invoiceId: "${invoice.id}", revisionId: "${revision.id}") { id } }`,
      "mutation { resetDemoData }",
      "mutation { deleteUsers { acknowledged } }",
      "mutation { deleteAllInvoices { acknowledged } }",
    ])
      for (const ws of [false, true]) {
        expect(
          (await execute(session.credential, query, {}, ws)).errors?.[0]
            ?.extensions?.["code"],
        ).toBe("FORBIDDEN");
      }
    const service = ctx.invoiceService!;
    for (const call of [
      () => service.addInvoice(invoice),
      () => service.updateInvoice(invoice.id, {}),
      () => service.deleteInvoice(invoice.id),
      () => service.markAsPaid(invoice.id),
      () => service.restoreRevision(invoice.id, revision.id),
      () => service.deleteAllInvoices(),
      () => service.deleteInvoicesByUserId(),
      () =>
        ctx.invoiceRevisionService!.recordIfChanged({
          invoiceId: invoice.id,
          invoice,
          changeType: "edit",
        }),
    ]) {
      await expect(call()).rejects.toThrow("read-only");
    }
    expect(await snapshotDatabase()).toEqual(before);
  });

  it("denies temporary-session mutations over WebSocket as a separate rule, and bounds request size on both transports before any database work", async () => {
    const session = await allocateDemoSession(prisma);
    const user = await identity(session.credential);
    const own = await prisma.invoice.findFirstOrThrow({
      where: { createdById: user.id },
    });
    const { getResolvers } = await import("../../src/resolvers");
    const wsCtx = await context(session.credential, true);
    // Its own message: this denial must outlive the read-only guard (Slice 3B).
    for (const resolver of Object.values(getResolvers().Mutation))
      expect(() => resolver({}, {}, wsCtx)).toThrow(
        "cannot mutate over WebSocket",
      );
    // Ordinary users keep their WebSocket mutation behaviour.
    const ordinaryEdit = await execute(
      signedToken(),
      `mutation { editInvoice(id: "real-invoice", clientName: "WS edit") { clientName } }`,
      {},
      true,
    );
    expect(ordinaryEdit.errors).toBeUndefined();
    expect(ordinaryEdit.data?.["editInvoice"]).toEqual({
      clientName: "WS edit",
    });
    const before = await snapshotDatabase();

    // Real transport: the same rule through ws + graphql-ws + createContext.
    const client = createClient({
      url: wsUrl,
      webSocketImpl: WebSocket,
      retryAttempts: 0,
      connectionParams: { Authorization: `Bearer ${session.credential}` },
    });
    try {
      const result = await new Promise<{
        errors?: readonly { message: string; extensions?: unknown }[];
      }>((resolve, reject) => {
        let last = {};
        client.subscribe(
          { query: `mutation { markAsPaid(id: "${own.id}") { id } }` },
          {
            next: (value) => (last = value),
            error: reject,
            complete: () => resolve(last),
          },
        );
      });
      expect(result.errors?.[0]).toMatchObject({
        message: "Temporary demo sessions cannot mutate over WebSocket",
        extensions: { code: "FORBIDDEN" },
      });
    } finally {
      await client.dispose();
    }

    // A frame above the bound closes the socket (1009) before graphql-ws
    // parses it; one just below the bound is still processed normally.
    const raw = async (padding: number) => {
      const socket = new WebSocket(wsUrl, "graphql-transport-ws");
      const messages: { type: string }[] = [];
      const closed = new Promise<number>((resolve) =>
        socket.on("close", (code) => resolve(code)),
      );
      socket.on("message", (data) =>
        messages.push(JSON.parse(String(data)) as { type: string }),
      );
      await new Promise((resolve) => socket.on("open", resolve));
      socket.send(
        JSON.stringify({
          type: "connection_init",
          payload: { Authorization: `Bearer ${session.credential}` },
        }),
      );
      await until(() => messages.some((m) => m.type === "connection_ack"));
      socket.send(
        JSON.stringify({
          id: "1",
          type: "subscribe",
          payload: {
            query: `{ allInvoices { id } } #${"x".repeat(padding)}`,
          },
        }),
      );
      const outcome = await Promise.race([
        closed,
        until(() => messages.some((m) => m.type === "complete")).then(
          () => "complete",
        ),
      ]);
      socket.terminate();
      return outcome;
    };
    expect(await raw(90 * 1024)).toBe("complete");
    expect(await raw(150 * 1024)).toBe(1009);

    // HTTP: the JSON parser rejects the body before context creation.
    const oversized = await fetch(wsUrl.replace("ws://", "http://") + "/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.credential}`,
      },
      body: JSON.stringify({
        query: `mutation { editInvoice(id: "${own.id}", clientName: "${"x".repeat(150 * 1024)}") { id } }`,
      }),
    });
    expect(oversized.status).toBeGreaterThanOrEqual(400);
    expect(await oversized.text()).not.toContain('"data"');
    expect(await snapshotDatabase()).toEqual(before);
  });

  it("rolls back users, sessions, invoices, addresses, revisions AND issuance tokens on a late database failure", async () => {
    const before = await snapshotDatabase();
    await prisma.$executeRawUnsafe(
      `CREATE FUNCTION fail_temporary_seed() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW."createdById" LIKE 'demo-session:%' AND NEW."revisionNumber" = 5 THEN RAISE EXCEPTION 'injected seed failure'; END IF; RETURN NEW; END $$`,
    );
    await prisma.$executeRawUnsafe(
      `CREATE TRIGGER fail_temporary_seed BEFORE INSERT ON "InvoiceRevision" FOR EACH ROW EXECUTE FUNCTION fail_temporary_seed()`,
    );
    try {
      await expect(allocateDemoSession(prisma)).rejects.toThrow();
    } finally {
      await prisma.$executeRawUnsafe(
        `DROP TRIGGER fail_temporary_seed ON "InvoiceRevision"`,
      );
      await prisma.$executeRawUnsafe(`DROP FUNCTION fail_temporary_seed()`);
    }
    expect(await snapshotDatabase()).toEqual(before);
    expect(
      (await identity((await allocateDemoSession(prisma)).credential)).role,
    ).toBe("USER");
  });

  it("counts expired/revoked retained sessions and serializes concurrent attempts at capacity", async () => {
    await fillCapacity(DEMO_SESSION_CAPACITY - 1);
    const results = await Promise.allSettled(
      Array.from({ length: 6 }, (_, i) =>
        allocateDemoSession(i % 2 ? secondClient : prisma),
      ),
    );
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(
      results
        .filter((r) => r.status === "rejected")
        .every((r) => r.status === "rejected" && r.reason.code === "CAPACITY"),
    ).toBe(true);
    expect(await prisma.demoSession.count()).toBe(DEMO_SESSION_CAPACITY);
    await prisma.demoSession.updateMany({ data: { revokedAt: new Date() } });
    const before = await snapshotDatabase();
    await expect(allocateDemoSession(secondClient)).rejects.toMatchObject({
      code: "CAPACITY",
    });
    expect(await snapshotDatabase()).toEqual(before);
  });

  it("enforces a durable burst budget across clients and refills from database time", async () => {
    const results = await Promise.allSettled(
      Array.from({ length: 12 }, (_, i) =>
        allocateDemoSession(i % 2 ? secondClient : prisma),
      ),
    );
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(10);
    expect(
      results
        .filter((r) => r.status === "rejected")
        .every(
          (r) => r.status === "rejected" && r.reason.code === "RATE_LIMITED",
        ),
    ).toBe(true);
    await expect(allocateDemoSession(secondClient)).rejects.toMatchObject({
      code: "RATE_LIMITED",
    });
    await prisma.demoAllocationState.update({
      where: { id: 1 },
      data: { tokens: 0, updatedAt: new Date(Date.now() - 61_000) },
    });
    await allocateDemoSession(secondClient);
    await expect(allocateDemoSession(prisma)).rejects.toMatchObject({
      code: "RATE_LIMITED",
    });
  });

  it("cleans only linked expired workspaces, preserves active/shared/ordinary/unlinked data and the durable budget", async () => {
    await resetDemoWorkspace(prisma);
    const [expired, active] = await Promise.all([
      allocateDemoSession(prisma),
      allocateDemoSession(secondClient),
    ]);
    const expiredUser = await identity(expired.credential);
    const activeUser = await identity(active.credential);
    await expire(expiredUser.id);
    await prisma.demoSession.update({
      where: { userId: activeUser.id },
      data: { revokedAt: new Date() },
    });
    await prisma.user.create({
      data: { id: "demo-session:unlinked", username: "unlinked@example.test" },
    });
    await prisma.clientAddress.create({
      data: { street: "unrelated orphan", city: "", postCode: "", country: "" },
    });
    const before = await snapshotDatabase();
    const results = await Promise.all([
      cleanupExpiredDemoSessions(prisma),
      cleanupExpiredDemoSessions(secondClient),
    ]);
    expect(results.sort()).toEqual([0, 1]);
    const after = await snapshotDatabase();
    const deletedInvoices = before.invoices.filter(
      (i) => i.createdById === expiredUser.id,
    );
    const deletedIds = new Set(deletedInvoices.map((i) => i.id));
    expect(after).toEqual({
      ...before,
      users: before.users.filter((u) => u.id !== expiredUser.id),
      sessions: before.sessions.filter((s) => s.userId !== expiredUser.id),
      invoices: before.invoices.filter((i) => !deletedIds.has(i.id)),
      revisions: before.revisions.filter((r) => !deletedIds.has(r.invoiceId)),
      clientAddresses: before.clientAddresses.filter(
        (a) => !deletedInvoices.some((i) => i.clientAddressId === a.id),
      ),
      senderAddresses: before.senderAddresses.filter(
        (a) => !deletedInvoices.some((i) => i.senderAddressId === a.id),
      ),
    });
    expect(
      await prisma.item.count({
        where: { invoiceId: { in: [...deletedIds] } },
      }),
    ).toBe(0);
    expect(await resolveDemoSession(prisma, expired.credential)).toBeNull();
  });

  it("refuses cleanup that would alter a foreign revision author, with complete rollback", async () => {
    const session = await allocateDemoSession(prisma);
    const user = await identity(session.credential);
    await expire(user.id);
    await prisma.invoiceRevision.update({
      where: { id: "real-revision" },
      data: { createdById: user.id },
    });
    const before = await snapshotDatabase();
    await expect(cleanupExpiredDemoSessions(prisma)).rejects.toThrow(
      "foreign revision",
    );
    expect(await snapshotDatabase()).toEqual(before);
  });

  it("rolls back a late cleanup failure, preserving the entire expired workspace and capacity", async () => {
    const session = await allocateDemoSession(prisma);
    const user = await identity(session.credential);
    await expire(user.id);
    const before = await snapshotDatabase();
    await prisma.$executeRawUnsafe(
      `CREATE FUNCTION fail_temporary_cleanup() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF OLD."id" LIKE 'demo-session:%' THEN RAISE EXCEPTION 'injected cleanup failure'; END IF; RETURN OLD; END $$`,
    );
    await prisma.$executeRawUnsafe(
      `CREATE TRIGGER fail_temporary_cleanup BEFORE DELETE ON "User" FOR EACH ROW EXECUTE FUNCTION fail_temporary_cleanup()`,
    );
    try {
      await expect(cleanupExpiredDemoSessions(prisma)).rejects.toThrow();
    } finally {
      await prisma.$executeRawUnsafe(
        `DROP TRIGGER fail_temporary_cleanup ON "User"`,
      );
      await prisma.$executeRawUnsafe(`DROP FUNCTION fail_temporary_cleanup()`);
    }
    expect(await snapshotDatabase()).toEqual(before);
    expect(await cleanupExpiredDemoSessions(secondClient)).toBe(1);
  });

  it("bounds cleanup batches and safely coordinates cleanup with allocations", async () => {
    await fillCapacity(DEMO_SESSION_CAPACITY);
    await prisma.demoAllocationState.update({
      where: { id: 1 },
      data: { tokens: 0, updatedAt: new Date() },
    });
    expect(await cleanupExpiredDemoSessions(prisma)).toBe(10);
    expect(await prisma.demoSession.count()).toBe(90);
    await expect(allocateDemoSession(prisma)).rejects.toMatchObject({
      code: "RATE_LIMITED",
    });
    await prisma.demoAllocationState.update({
      where: { id: 1 },
      data: { tokens: 10 },
    });
    const results = await Promise.all([
      cleanupExpiredDemoSessions(secondClient),
      allocateDemoSession(prisma),
    ]);
    expect(results[0]).toBe(10);
    expect(await prisma.demoSession.count()).toBe(81);
    expect(
      await resolveDemoSession(prisma, results[1].credential),
    ).not.toBeNull();
  });

  it("HTTP bootstrap is disabled by default, validates empty input, hides secrets from caches and applies per-IP throttling", async () => {
    const request = (body: unknown, suffix = "") =>
      fetch(endpoint + suffix, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    vi.stubEnv("DEMO_SESSIONS_ENABLED", undefined);
    const disabled = await request({});
    expect(disabled.status).toBe(404);
    expect(await disabled.json()).toEqual({ code: "DEMO_SESSIONS_DISABLED" });
    expect(await prisma.demoSession.count()).toBe(0);
    vi.stubEnv("DEMO_SESSIONS_ENABLED", "true");
    for (const body of [{ role: "ADMIN", userId: realUser.id }, []])
      expect((await request(body)).status).toBe(400);
    expect((await request({}, "?role=ADMIN")).status).toBe(400);
    const response = await request({});
    expect(response.status).toBe(201);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const result = await response.json();
    expect(Object.keys(result).sort()).toEqual(["credential", "expiresAt"]);
    expect((await context(result.credential)).user?.role).toBe("USER");
    expect((await request({})).status).toBe(201);
    expect((await request({})).status).toBe(429);
    expect(await prisma.demoSession.count()).toBe(2);
  });

  it("never falls through to the legacy test administrator after failed session verification", async () => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "test");
    const { default: container } = await import(
      "../../src/config/inversify.config"
    );
    const { default: TYPES } = await import("../../src/constants/identifiers");
    container.rebind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);
    const { retrieveUserFromToken } = await import(
      "../../src/GraphQL/createContext"
    );
    expect(
      await retrieveUserFromToken("demo-session-v1." + "f".repeat(64), {}),
    ).toBeNull();
    expect(await retrieveUserFromToken("demo-session-bad", {})).toBeNull();
    vi.stubEnv("DEMO_SESSIONS_ENABLED", "false");
    expect(
      await retrieveUserFromToken("demo-session-v1." + "f".repeat(64), {}),
    ).toBeNull();
    vi.stubEnv("DEMO_SESSIONS_ENABLED", "true");
    const session = await allocateDemoSession(prisma);
    const databaseFailure = vi
      .spyOn(prisma, "$queryRaw")
      .mockRejectedValueOnce(new Error("Injected database failure"));
    await expect(retrieveUserFromToken(session.credential, {})).rejects.toThrow(
      "Injected database failure",
    );
    databaseFailure.mockRestore();
    vi.stubEnv("NODE_ENV", "production");
  });
});
