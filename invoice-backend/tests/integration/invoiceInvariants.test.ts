import "reflect-metadata";
import { afterEach, vi } from "vitest";
import * as domainRules from "../../src/services/invoiceDomainRules";
import { ApolloServer } from "@apollo/server";
import { Prisma, PrismaClient, Role } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { InjectedQueryContext } from "../../src/constants/types";
import typeDefs from "../../src/GraphQL/typeDefs";
import { getResolvers } from "../../src/resolvers";
import { DatabaseConnection } from "../../src/database/prisma.database.connection";
import { Logger } from "../../src/config/logger.config";
import { PrismaInvoiceRepository } from "../../src/repositories/implementations/prismaInvoiceRepository";
import { PrismaInvoiceRevisionRepository } from "../../src/repositories/implementations/prismaInvoiceRevisionRepository";
import { InvoiceService } from "../../src/services/invoice.service";
import { InvoiceRevisionService } from "../../src/services/invoiceRevision.service";
import { toSnapshot } from "../../src/services/invoiceDiff";

// Supply only the authenticated identity; schema, resolvers, services,
// repositories, pubsub and PostgreSQL are real. Every invoice belongs to USER.
const user = {
  id: "invariant-user",
  username: "invariant-user@example.test",
  name: "Invariant User",
  role: Role.USER,
};
const schemaName = `invariants_${randomUUID().replaceAll("-", "")}`;
let prisma: PrismaClient;
let server: ApolloServer<InjectedQueryContext>;
let context: InjectedQueryContext;
const address = {
  street: "1 Test Street",
  city: "Halifax",
  postCode: "B3J 1A1",
  country: "Canada",
};
const include = {
  items: { orderBy: { name: "asc" as const } },
  clientAddress: true,
  senderAddress: true,
};
const correctItems = [
  { name: "Design", quantity: 2, price: 125, total: 250 },
  { name: "Hosting", quantity: 4, price: 100, total: 400 },
];
const falseItems = correctItems.map((item) => ({ ...item, total: 1 }));
const base = {
  clientAddress: address,
  senderAddress: address,
  clientEmail: "client@example.test",
  clientName: "Invariant client",
  createdAt: "2026-10-01",
  paymentDue: "2026-10-15",
  paymentTerms: 14,
  description: "Domain invariant fixture",
  status: "pending",
  items: correctItems,
  total: 650,
};
const selection = `id status total clientName clientEmail createdAt paymentDue paymentTerms description
  clientAddress { street city postCode country }
  senderAddress { street city postCode country }
  items { name quantity price total }`;
const add = `mutation($id: String, $total: Float, $items: [ItemInput],
  $clientAddress: ClientInfo, $senderAddress: SenderInfo, $clientEmail: String,
  $clientName: String, $createdAt: String, $paymentDue: String,
  $paymentTerms: Float, $description: String, $status: String) {
  addInvoice(id: $id, total: $total, items: $items, clientAddress: $clientAddress,
    senderAddress: $senderAddress, clientEmail: $clientEmail, clientName: $clientName,
    createdAt: $createdAt, paymentDue: $paymentDue, paymentTerms: $paymentTerms,
    description: $description, status: $status) { ${selection} }
}`;
const edit = `mutation($id: String!, $total: Float, $items: [ItemInput]) {
  editInvoice(id: $id, total: $total, items: $items) { ${selection} }
}`;
const pay = `mutation($id: String!) { markAsPaid(id: $id) { ${selection} } }`;

async function execute(query: string, variables: Record<string, unknown>) {
  const response = await server.executeOperation(
    { query, variables },
    { contextValue: context },
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
// Log actual persisted rows before assertions, including on red runs. Decimal
// JSON serialization retains exact database values; assertions use existing numbers.
function evidence(label: string, value: unknown) {
  console.info(`INVARIANT EVIDENCE ${label}: ${JSON.stringify(value)}`);
}
async function seed(status = "pending", items = correctItems) {
  const invoice = await prisma.invoice.create({
    data: {
      ...base,
      id: "AA1001",
      status,
      total: items.reduce((sum, item) => sum + item.total, 0),
      createdBy: { connect: { id: user.id } },
      clientAddress: { create: address },
      senderAddress: { create: address },
      items: { create: items },
    },
    include,
  });
  await prisma.invoiceRevision.create({
    data: {
      invoiceId: invoice.id,
      revisionNumber: 1,
      createdById: user.id,
      changeType: "create",
      message: "Invoice created",
      snapshot: toSnapshot(invoice) as unknown as Prisma.InputJsonValue,
    },
  });
  return state(invoice.id);
}
function expectMoney(
  returned: unknown,
  persisted: Awaited<ReturnType<typeof state>>,
) {
  const expected = { total: 650, items: correctItems };
  // Soft assertions inspect response AND DB, even when both are wrong.
  expect.soft(returned).toMatchObject({ total: expected.total });
  expect
    .soft(returned)
    .toMatchObject({ items: expect.arrayContaining(expected.items) });
  expect.soft(persisted.invoice).not.toBeNull();
  expect.soft(Number(persisted.invoice?.total)).toBe(650);
  expect
    .soft(
      persisted.invoice?.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price),
        total: Number(item.total),
      })),
    )
    .toEqual(correctItems);
  expect.soft(persisted.invoice?.createdById).toBe(user.id);
}

beforeAll(async () => {
  const suppliedUrl = process.env["DATABASE_URL"];
  if (!suppliedUrl)
    throw new Error(
      "Invoice invariant tests require an explicit disposable DATABASE_URL",
    );
  const url = new URL(suppliedUrl);
  if (!["postgresql:", "postgres:"].includes(url.protocol))
    throw new Error("PostgreSQL DATABASE_URL required");
  url.searchParams.set("schema", schemaName);
  prisma = new PrismaClient({ datasourceUrl: url.toString() });
  execFileSync("npx", ["--no-install", "prisma", "migrate", "deploy"], {
    env: { ...process.env, DATABASE_URL: url.toString() },
    stdio: "pipe",
  });
  const connection = new DatabaseConnection(prisma, new Logger());
  const repo = new PrismaInvoiceRepository(connection);
  const revisionService = new InvoiceRevisionService(
    new PrismaInvoiceRevisionRepository(connection),
    user,
    repo,
  );
  context = {
    user,
    pubsub: new PubSub(),
    invoiceRevisionService: revisionService,
    invoiceService: new InvoiceService(repo, user, revisionService),
  };
  server = new ApolloServer<InjectedQueryContext>({
    typeDefs,
    resolvers: getResolvers(),
  });
  await server.start();
  await prisma.user.create({ data: user });
});
afterAll(async () => {
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
});
beforeEach(async () => {
  await prisma.invoice.deleteMany();
  await prisma.clientAddress.deleteMany();
  await prisma.senderAddress.deleteMany();
});

describe("creation totals", () => {
  for (const { label, input } of [
    {
      label: "recomputes false invoice and item totals",
      input: { ...base, total: 9999, items: falseItems },
    },
    {
      label: "calculates an omitted invoice total",
      input: (({ total: _total, ...rest }) => rest)(base),
    },
    {
      label: "calculates omitted invoice and item totals",
      input: {
        ...(({ total: _total, ...rest }) => rest)(base),
        items: correctItems.map(({ total: _total, ...rest }) => rest),
      },
    },
    { label: "returns and persists already correct totals", input: base },
  ]) {
    it(label, async () => {
      const result = await execute(add, { ...input, id: "AA1001" });
      const persisted = await state("AA1001");
      evidence(label, { result, persisted });
      expect.soft(result.errors).toBeUndefined();
      expectMoney(result.data?.["addInvoice"], persisted);
    });
  }
});
describe("edit totals", () => {
  for (const { label, input } of [
    {
      label: "recomputes false invoice and item totals",
      input: { total: 9999, items: falseItems },
    },
    {
      label: "aggregates correct items despite a stale invoice total",
      input: { total: 300, items: correctItems },
    },
    {
      label: "recalculates an omitted invoice total after items change",
      input: { items: correctItems },
    },
  ]) {
    it(label, async () => {
      // Start with a different, internally consistent amount and matching
      // revision so omission must recalculate the previous total of 300.
      await seed("pending", [
        { name: "Design", quantity: 1, price: 100, total: 100 },
        { name: "Hosting", quantity: 2, price: 100, total: 200 },
      ]);
      const result = await execute(edit, { id: "AA1001", ...input });
      const persisted = await state("AA1001");
      evidence(label, { result, persisted });
      expect.soft(result.errors).toBeUndefined();
      expectMoney(result.data?.["editInvoice"], persisted);
    });
  }
});
describe("invoice IDs", () => {
  for (const { label, input } of [
    { label: "omitted ID", input: {} },
    { label: "empty-string ID", input: { id: "" } },
  ]) {
    it(`generates a non-empty application ID for ${label}`, async () => {
      const result = await execute(add, { ...base, ...input });
      const rows = await prisma.invoice.findMany({ include });
      evidence(label, { result, rows });
      expect.soft(result.errors).toBeUndefined();
      expect.soft(rows).toHaveLength(1);
      expect
        .soft(result.data?.["addInvoice"])
        .toMatchObject({ id: expect.stringMatching(/^[A-Z]{2}[0-9]{4}$/) });
      expect.soft(rows[0]?.id).not.toBe("");
      expect.soft(rows[0]?.id).toMatch(/^[A-Z]{2}[0-9]{4}$/);
      expect
        .soft(result.data?.["addInvoice"])
        .toMatchObject({ id: rows[0]?.id });
      expect.soft(rows[0]?.createdById).toBe(user.id);
    });
    it(`creates two distinct application IDs for ${label}`, async () => {
      const first = await execute(add, { ...base, ...input });
      const second = await execute(add, { ...base, ...input });
      const rows = await prisma.invoice.findMany({ orderBy: { id: "asc" } });
      evidence(`two ${label}`, { first, second, rows });
      expect.soft(first.errors).toBeUndefined();
      expect.soft(second.errors).toBeUndefined();
      expect.soft(rows).toHaveLength(2);
      expect.soft(new Set(rows.map((row) => row.id)).size).toBe(2);
      const firstId = (first.data?.["addInvoice"] as { id?: string } | null)
        ?.id;
      const secondId = (second.data?.["addInvoice"] as { id?: string } | null)
        ?.id;
      expect.soft(firstId).toEqual(expect.stringMatching(/^[A-Z]{2}[0-9]{4}$/));
      expect
        .soft(secondId)
        .toEqual(expect.stringMatching(/^[A-Z]{2}[0-9]{4}$/));
      expect.soft(secondId).not.toBe(firstId);
      expect
        .soft(rows.map((row) => row.id).sort())
        .toEqual([firstId, secondId].sort());
    });
  }
});
describe("status transitions", () => {
  it("rejects draft to paid without changing invoice data or revisions", async () => {
    const before = await seed("draft");
    const result = await execute(pay, { id: "AA1001" });
    const after = await state("AA1001");
    evidence("draft to paid", { result, before, after });
    expect.soft(result.data?.["markAsPaid"] ?? null).toBeNull();
    // Existing markAsPaid resolver wraps domain rejections in this error.
    // No future public error message or status machine is prescribed here.
    expect.soft(result.errors).toEqual([
      expect.objectContaining({
        message: "Invoice could not be marked as paid",
        extensions: expect.objectContaining({ code: "INTERNAL_SERVER_ERROR" }),
      }),
    ]);
    expect.soft(after.invoice).toEqual(before.invoice);
    expect.soft(after.revisions).toEqual(before.revisions);
  });
  it("marks pending paid while preserving ownership and other invoice data", async () => {
    const before = await seed();
    const result = await execute(pay, { id: "AA1001" });
    const after = await state("AA1001");
    evidence("pending to paid", { result, before, after });
    expect.soft(result.errors).toBeUndefined();
    expect.soft(after.invoice).toEqual({ ...before.invoice, status: "paid" });
    expect
      .soft(result.data?.["markAsPaid"])
      .toEqual({ ...base, id: "AA1001", status: "paid" });
  });
  it("appends a paid revision while preserving pending history", async () => {
    const before = await seed();
    const result = await execute(pay, { id: "AA1001" });
    const after = await state("AA1001");
    evidence("paid revision", { result, before, after });
    expect.soft(result.errors).toBeUndefined();
    expect.soft(after.invoice?.status).toBe("paid");
    expect.soft(after.revisions).toHaveLength(2);
    expect.soft(after.revisions.slice(0, 1)).toEqual(before.revisions);
    // Existing revision taxonomy is create/edit/restore; payment is an edit.
    expect.soft(after.revisions[1]).toMatchObject({
      invoiceId: "AA1001",
      revisionNumber: 2,
      createdById: user.id,
      changeType: "edit",
      snapshot: toSnapshot(after.invoice),
    });
  });
});

describe("invoice invariant repair", () => {
  afterEach(() => vi.restoreAllMocks());

  it("records canonical persisted creation totals in the initial revision", async () => {
    const result = await execute(add, {
      ...base,
      id: "AA1001",
      total: 9999,
      items: falseItems,
    });
    const persisted = await state("AA1001");
    evidence("canonical create revision", { result, persisted });
    expect(result.errors).toBeUndefined();
    expectMoney(result.data?.["addInvoice"], persisted);
    expect(persisted.revisions).toHaveLength(1);
    expect(persisted.revisions[0]).toMatchObject({
      createdById: user.id,
      changeType: "create",
      snapshot: toSnapshot(persisted.invoice),
    });
    expect(persisted.revisions[0]?.snapshot).toMatchObject({
      total: 650,
      items: correctItems.map((item) => expect.objectContaining(item)),
    });
  });

  it("records canonical edited totals while preserving the previous snapshot", async () => {
    const before = await seed();
    // Retain item identities to cover in-place reconciliation, as well as the
    // replacement items already exercised by the unchanged Slice 3A cases.
    const items = before.invoice!.items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: 3,
      price: 75.5,
      total: 1,
    }));
    const result = await execute(edit, { id: "AA1001", total: 9999, items });
    const persisted = await state("AA1001");
    evidence("canonical edit revision", { result, persisted });
    expect(result.errors).toBeUndefined();
    expect(result.data?.["editInvoice"]).toMatchObject({
      total: 453,
      items: items.map((item) =>
        expect.objectContaining({
          name: item.name,
          quantity: 3,
          price: 75.5,
          total: 226.5,
        }),
      ),
    });
    expect(Number(persisted.invoice?.total)).toBe(453);
    expect(
      persisted.invoice?.items.map((item) => ({
        id: item.id,
        total: Number(item.total),
      })),
    ).toEqual(items.map((item) => ({ id: item.id, total: 226.5 })));
    expect(persisted.revisions).toHaveLength(2);
    expect(persisted.revisions[0]).toEqual(before.revisions[0]);
    expect(persisted.revisions[1]).toMatchObject({
      createdById: user.id,
      changeType: "edit",
      snapshot: toSnapshot(persisted.invoice),
    });
  });

  it("retries a generated ID collision without overwriting the existing invoice", async () => {
    const before = await seed();
    const generator = vi
      .spyOn(domainRules, "generateInvoiceId")
      .mockReturnValueOnce("AA1001")
      .mockReturnValueOnce("BB2002");
    const result = await execute(add, { ...base });
    const persisted = await state("BB2002");
    evidence("generated ID collision retry", {
      result,
      persisted,
      existing: await state("AA1001"),
    });
    expect(result.errors).toBeUndefined();
    expect(result.data?.["addInvoice"]).toMatchObject({ id: "BB2002" });
    expect(generator).toHaveBeenCalledTimes(2);
    expectMoney(result.data?.["addInvoice"], persisted);
    expect(await state("AA1001")).toEqual(before);
    expect(await prisma.invoice.count()).toBe(2);
    expect(await prisma.clientAddress.count()).toBe(2);
    expect(await prisma.senderAddress.count()).toBe(2);
    expect(await prisma.item.count()).toBe(4);
    expect(persisted.revisions).toHaveLength(1);
  });

  it("stops after five generated ID collisions without partial inserts", async () => {
    const before = await seed();
    const generator = vi
      .spyOn(domainRules, "generateInvoiceId")
      .mockReturnValue("AA1001");
    const result = await execute(add, { ...base, id: "" });
    const persisted = await state("AA1001");
    evidence("exhausted ID collisions", { result, persisted });
    expect(result.data?.["addInvoice"] ?? null).toBeNull();
    expect(result.errors).toEqual([
      expect.objectContaining({
        message: "Failed to add invoice",
        extensions: expect.objectContaining({ code: "INTERNAL_SERVER_ERROR" }),
      }),
    ]);
    expect(generator).toHaveBeenCalledTimes(5);
    expect(persisted).toEqual(before);
    expect(await prisma.invoice.count()).toBe(1);
    expect(await prisma.clientAddress.count()).toBe(1);
    expect(await prisma.senderAddress.count()).toBe(1);
    expect(await prisma.item.count()).toBe(2);
  });

  it("rejects a duplicate client ID without generating a replacement", async () => {
    const before = await seed();
    const generator = vi.spyOn(domainRules, "generateInvoiceId");
    const result = await execute(add, { ...base, id: "AA1001" });
    expect(result.data?.["addInvoice"] ?? null).toBeNull();
    expect(result.errors).toHaveLength(1);
    expect(generator).not.toHaveBeenCalled();
    expect(await state("AA1001")).toEqual(before);
    expect(await prisma.invoice.count()).toBe(1);
    expect(await prisma.clientAddress.count()).toBe(1);
    expect(await prisma.senderAddress.count()).toBe(1);
    expect(await prisma.item.count()).toBe(2);
  });

  it("preserves supplied existing-format IDs without broad new validation", async () => {
    const generator = vi.spyOn(domainRules, "generateInvoiceId");
    const result = await execute(add, { ...base, id: "legacy-invoice-7" });
    expect(result.errors).toBeUndefined();
    expect(result.data?.["addInvoice"]).toMatchObject({
      id: "legacy-invoice-7",
    });
    expect((await state("legacy-invoice-7")).invoice?.id).toBe(
      "legacy-invoice-7",
    );
    expect(generator).not.toHaveBeenCalled();
  });

  it("rejects a repeated payment without appending a duplicate paid revision", async () => {
    await seed();
    const first = await execute(pay, { id: "AA1001" });
    const beforeRepeat = await state("AA1001");
    const second = await execute(pay, { id: "AA1001" });
    const afterRepeat = await state("AA1001");
    evidence("repeated payment", { first, second, beforeRepeat, afterRepeat });
    expect(first.errors).toBeUndefined();
    expect(beforeRepeat.invoice?.status).toBe("paid");
    expect(beforeRepeat.revisions).toHaveLength(2);
    expect(second.data?.["markAsPaid"] ?? null).toBeNull();
    expect(second.errors).toHaveLength(1);
    expect(afterRepeat).toEqual(beforeRepeat);
  });
});
