import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { Prisma, PrismaClient, Role } from "@prisma/client";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type {
  InjectedQueryContext,
  UserIdAndRole,
} from "../../src/constants/types";
import typeDefs from "../../src/GraphQL/typeDefs";
import { getResolvers } from "../../src/resolvers";
import { DatabaseConnection } from "../../src/database/prisma.database.connection";
import { Logger } from "../../src/config/logger.config";
import { PrismaInvoiceRepository } from "../../src/repositories/implementations/prismaInvoiceRepository";
import { PrismaInvoiceRevisionRepository } from "../../src/repositories/implementations/prismaInvoiceRevisionRepository";
import { InvoiceService } from "../../src/services/invoice.service";
import { InvoiceRevisionService } from "../../src/services/invoiceRevision.service";
import { toSnapshot } from "../../src/services/invoiceDiff";

// Deliberately bypass authentication only: the production test-mode context
// supplies one ADMIN identity and would hide USER authorization defects.
// Apollo still validates/executes the production schema and resolvers; services,
// repositories and PostgreSQL are real. No authorization method is mocked.
const userA = {
  id: "authz-user-a",
  username: "authz-a@example.test",
  name: "User A",
  role: Role.USER,
};
const userB = {
  id: "authz-user-b",
  username: "authz-b@example.test",
  name: "User B",
  role: Role.USER,
};
const admin = {
  id: "authz-admin",
  username: "authz-admin@example.test",
  name: "Admin",
  role: Role.ADMIN,
};
const schemaName = `authz_${randomUUID().replaceAll("-", "")}`;
let prisma: PrismaClient;
let server: ApolloServer<InjectedQueryContext>;
let connection: DatabaseConnection;
let revisions: Record<string, [string, string]>;

const address = {
  street: "1 Test Street",
  city: "Halifax",
  postCode: "B3J 1A1",
  country: "Canada",
};
const include = {
  items: { orderBy: { id: "asc" as const } },
  clientAddress: true,
  senderAddress: true,
};

function context(user: UserIdAndRole): InjectedQueryContext {
  const invoiceRevisionService = new InvoiceRevisionService(
    new PrismaInvoiceRevisionRepository(connection),
    user,
  );
  return {
    user,
    invoiceRevisionService,
    invoiceService: new InvoiceService(
      new PrismaInvoiceRepository(connection),
      user,
      invoiceRevisionService,
    ),
  };
}

async function execute(
  user: UserIdAndRole,
  query: string,
  variables: Record<string, unknown>,
) {
  const response = await server.executeOperation(
    { query, variables },
    { contextValue: context(user) },
  );
  if (response.body.kind !== "single")
    throw new Error("Expected a single GraphQL response");
  return response.body.singleResult;
}

async function state(id: string) {
  return {
    invoice: await prisma.invoice.findUnique({ where: { id }, include }),
    revisions: await prisma.invoiceRevision.findMany({
      where: { invoiceId: id },
      orderBy: { revisionNumber: "asc" },
    }),
  };
}

const operations = {
  getInvoiceById:
    "query($id: String!) { getInvoiceById(id: $id) { id clientName status } }",
  editInvoice:
    'mutation($id: String!) { editInvoice(id: $id, clientName: "Edited client") { id clientName } }',
  markAsPaid: "mutation($id: String!) { markAsPaid(id: $id) { id status } }",
  removeInvoice:
    "mutation($id: String!) { removeInvoice(id: $id) { acknowledged } }",
  invoiceRevisions:
    "query($id: String!) { invoiceRevisions(invoiceId: $id) { id invoiceId revisionNumber snapshot { clientName } } }",
  invoiceRevision:
    "query($first: String!) { invoiceRevision(id: $first) { id invoiceId snapshot { clientName } } }",
  invoiceRevisionDiff:
    "query($first: String!, $second: String!) { invoiceRevisionDiff(fromRevisionId: $first, toRevisionId: $second) { fromRevisionId toRevisionId fieldChanges { field before after } } }",
  restoreInvoiceRevision:
    "mutation($id: String!, $first: String!) { restoreInvoiceRevision(invoiceId: $id, revisionId: $first) { id clientName status } }",
};
type Operation = keyof typeof operations;

function variables(id: string) {
  const [first, second] = revisions[id]!;
  return { id, first, second };
}

beforeAll(async () => {
  // Require explicit opt-in to a disposable PostgreSQL database. Never fall
  // back to localhost or load a developer .env file in this harness.
  const suppliedUrl = process.env["DATABASE_URL"];
  if (!suppliedUrl)
    throw new Error(
      "Authorization integration tests require an explicit isolated DATABASE_URL",
    );
  const url = new URL(suppliedUrl);
  if (!["postgresql:", "postgres:"].includes(url.protocol))
    throw new Error("PostgreSQL DATABASE_URL required");
  url.searchParams.set("schema", schemaName);
  prisma = new PrismaClient({ datasourceUrl: url.toString() });
  // Both migration process and application repositories use this exact schema.
  execFileSync("npx", ["--no-install", "prisma", "migrate", "deploy"], {
    env: { ...process.env, DATABASE_URL: url.toString() },
    stdio: "pipe",
  });
  connection = new DatabaseConnection(prisma, new Logger());
  server = new ApolloServer<InjectedQueryContext>({
    typeDefs,
    resolvers: getResolvers(),
  });
  await server.start();
  await prisma.user.createMany({ data: [userA, userB, admin] });
});

afterAll(async () => {
  await server?.stop();
  if (prisma) {
    try {
      // Only this suite's generated schema is removed, including on red runs.
      await prisma.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
      );
    } finally {
      await prisma.$disconnect();
    }
  }
});

beforeEach(async () => {
  await prisma.invoice.deleteMany();
  await prisma.clientAddress.deleteMany();
  await prisma.senderAddress.deleteMany();
  revisions = {};
  for (const [id, owner] of [
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
        description: "Authorization fixture",
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
    const snapshot = toSnapshot(invoice);
    const first = await prisma.invoiceRevision.create({
      data: {
        invoiceId: id,
        revisionNumber: 1,
        createdById: owner.id,
        changeType: "create",
        snapshot: {
          ...snapshot,
          clientName: `${owner.name} original client`,
        } as unknown as Prisma.InputJsonValue,
      },
    });
    const second = await prisma.invoiceRevision.create({
      data: {
        invoiceId: id,
        revisionNumber: 2,
        createdById: owner.id,
        changeType: "edit",
        snapshot: snapshot as unknown as Prisma.InputJsonValue,
      },
    });
    revisions[id] = [first.id, second.id];
  }
});

describe("USER A accessing USER B", () => {
  for (const operation of Object.keys(operations) as Operation[]) {
    it(`denies ${operation} without exposing or changing USER B data`, async () => {
      const before = await state("BB1001");
      const result = await execute(
        userA,
        operations[operation],
        variables("BB1001"),
      );
      const after = await state("BB1001");
      // Soft assertions retain DB evidence even when GraphQL unexpectedly succeeds.
      expect.soft(result.data?.[operation] ?? null).toBeNull();
      if (operation === "removeInvoice") {
        // Separate boundary and error-contract assertions: deletion is already
        // blocked, although its NOT_FOUND policy contract is currently broken.
        expect.soft(result.errors?.length).toBeGreaterThan(0);
      } else {
        expect.soft(result.errors).toEqual([
          expect.objectContaining({
            message: ["invoiceRevision", "invoiceRevisionDiff"].includes(
              operation,
            )
              ? "Revision not found"
              : "Invoice not found",
            extensions: expect.objectContaining({ code: "NOT_FOUND" }),
          }),
        ]);
      }
      expect.soft(after).toEqual(before);
    });
  }

  it("returns NOT_FOUND for cross-user removeInvoice", async () => {
    const result = await execute(
      userA,
      operations.removeInvoice,
      variables("BB1001"),
    );
    expect(result.errors).toEqual([
      expect.objectContaining({
        message: "Invoice not found",
        extensions: expect.objectContaining({ code: "NOT_FOUND" }),
      }),
    ]);
  });
});

for (const { label, actor, id, owner } of [
  {
    label: "USER A accessing own invoice",
    actor: userA,
    id: "AA1001",
    owner: userA,
  },
  { label: "ADMIN accessing USER B", actor: admin, id: "BB1001", owner: userB },
]) {
  describe(label, () => {
    for (const operation of Object.keys(operations) as Operation[]) {
      it(`allows ${operation} and preserves ownership`, async () => {
        const before = await state(id);
        const result = await execute(
          actor,
          operations[operation],
          variables(id),
        );
        const after = await state(id);
        const value = result.data?.[operation];
        expect.soft(result.errors).toBeUndefined();
        if (operation === "removeInvoice") {
          expect.soft(value).toEqual({ acknowledged: true });
          expect.soft(after.invoice).toBeNull();
          expect.soft(after.revisions).toEqual([]);
          return;
        }
        expect.soft(after.invoice?.createdById).toBe(owner.id);
        switch (operation) {
          case "getInvoiceById":
            expect(value).toEqual({
              id,
              clientName: `${owner.name} current client`,
              status: "pending",
            });
            break;
          case "editInvoice":
            expect(value).toEqual({ id, clientName: "Edited client" });
            expect(after.invoice?.clientName).toBe("Edited client");
            expect(after.revisions).toHaveLength(3);
            expect(after.revisions[2]).toMatchObject({
              changeType: "edit",
              createdById: actor.id,
            });
            break;
          case "markAsPaid":
            expect(value).toEqual({ id, status: "paid" });
            expect(after.invoice?.status).toBe("paid");
            break;
          case "invoiceRevisions":
            expect(value).toEqual(
              [2, 1].map((revisionNumber) => ({
                id: revisions[id]![revisionNumber - 1],
                invoiceId: id,
                revisionNumber,
                snapshot: {
                  clientName: `${owner.name} ${revisionNumber === 1 ? "original" : "current"} client`,
                },
              })),
            );
            break;
          case "invoiceRevision":
            expect(value).toEqual({
              id: revisions[id]![0],
              invoiceId: id,
              snapshot: { clientName: `${owner.name} original client` },
            });
            break;
          case "invoiceRevisionDiff":
            expect(value).toEqual({
              fromRevisionId: revisions[id]![0],
              toRevisionId: revisions[id]![1],
              fieldChanges: [
                {
                  field: "clientName",
                  before: `${owner.name} original client`,
                  after: `${owner.name} current client`,
                },
              ],
            });
            break;
          case "restoreInvoiceRevision":
            expect(value).toEqual({
              id,
              clientName: `${owner.name} original client`,
              status: "pending",
            });
            expect(after.invoice?.clientName).toBe(
              `${owner.name} original client`,
            );
            expect(after.revisions).toHaveLength(3);
            expect(after.revisions.slice(0, 2)).toEqual(before.revisions);
            expect(after.revisions[2]).toMatchObject({
              changeType: "restore",
              createdById: actor.id,
              restoredFromRevisionId: revisions[id]![0],
            });
            break;
        }
        if (
          [
            "getInvoiceById",
            "invoiceRevisions",
            "invoiceRevision",
            "invoiceRevisionDiff",
          ].includes(operation)
        ) {
          expect(after).toEqual(before);
        }
      });
    }
  });
}
