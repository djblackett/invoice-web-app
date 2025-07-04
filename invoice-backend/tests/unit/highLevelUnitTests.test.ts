import { createServer } from "../../src/server";
import type { Express } from "express";
import { describe, afterAll, beforeEach, it, expect, beforeAll } from "vitest";
import {
  setupTestDatabase,
  type TestDatabaseConfig,
  bindPrismaToContainer,
} from "../integration/test-database-setup";
import { Invoice } from "../../src/constants/types";
import {
  wipeInvoices,
  createInvoice,
  applyPayment,
  getInvoice,
} from "../utils/graphqlTestUtils";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "file:.dev.db";

const baseInvoice: Invoice = {
  id: "INV-123456789",
  createdAt: "2023-01-01",
  paymentDue: "2023-01-15",
  description: "Website Design",
  paymentTerms: 14,
  clientName: "John Doe",
  clientEmail: "john.doe@example.com",
  status: "pending",
  senderAddress: {
    street: "123 Main St",
    city: "Anytown",
    postCode: "12345",
    country: "USA",
  },
  clientAddress: {
    street: "456 Side St",
    city: "Othertown",
    postCode: "67890",
    country: "USA",
  },
  items: [
    {
      id: "item-1",
      name: "Design Work",
      quantity: 1,
      price: 100,
      total: 100,
    },
  ],
  total: 100,
  amountPaid: 0, // Initial amount paid
  payments: [], // Initial empty payments array
};

let app: Express;
let token = "dummy-token";
let db: TestDatabaseConfig;
let currentInvoiceId = "";

describe("applyPayment resolvers - integration", () => {
  beforeAll(async () => {
    db = await setupTestDatabase();
    bindPrismaToContainer(db.prisma);
    [app] = (await createServer()) as [Express];
  });

  beforeEach(async () => {
    await db.prisma.user.upsert({
      where: { id: "auth0|12345" },
      update: {},
      create: {
        id: "auth0|12345",
        username: "user@example.com",
        name: "user",
        role: "ADMIN",
      },
    });

    await wipeInvoices(app, token);

    currentInvoiceId = `INV-${Date.now()}`;
    await createInvoice(app, token, { ...baseInvoice, id: currentInvoiceId });
  });

  afterAll(async () => {
    await wipeInvoices(app, token);
    await db.cleanup();
  });

  describe("basic behavior", () => {
    it("should record a partial payment", async () => {
      await applyPayment(app, token, currentInvoiceId, 50);

      const invoice = await (
        await getInvoice(app, token, currentInvoiceId)
      ).data;
      expect(invoice.getInvoiceById.amountPaid).toBe(50);
      expect(invoice.getInvoiceById.payments).toHaveLength(1);
    });

    it("should mark invoice paid when settled", async () => {
      await applyPayment(app, token, currentInvoiceId, 80);
      const { data } = await applyPayment(app, token, currentInvoiceId, 20);
      expect(data.applyPayment.status).toBe("paid");
    });
  });

  describe("multiple payments", () => {
    it("should accumulate multiple partial payments", async () => {
      const steps = [30, 30, 40];
      for (const amt of steps) {
        await applyPayment(app, token, currentInvoiceId, amt);
      }
      const invoice = (await getInvoice(app, token, currentInvoiceId)).data;
      expect(invoice.getInvoiceById.amountPaid).toBe(100);
      expect(invoice.getInvoiceById.payments).toHaveLength(3);
    });
  });

  describe("guard rails", () => {
    it("should reject over-payments", async () => {
      await applyPayment(app, token, currentInvoiceId, 90);
      const resp = await applyPayment(app, token, currentInvoiceId, 20);
      expect(resp.data).toBeNull();
      expect(resp.errors?.[0].message).toMatch(
        /Payment exceeds remaining balance/i,
      );
    });

    it("should reject payments on non-existent invoices", async () => {
      const resp = await applyPayment(app, token, "INV-999999", 50);
      expect(resp.data).toBeNull();
      expect(resp.errors?.[0].message).toMatch(/not found/i);
    });

    it("should reject payments on draft invoices", async () => {
      const draftId = `INV-DRAFT-${Date.now()}`;
      const draftInvoice = { ...baseInvoice, id: draftId, status: "draft" };
      await createInvoice(app, token, draftInvoice);

      const resp = await applyPayment(app, token, draftInvoice.id, 50);
      expect(resp.data).toBeNull();
      expect(resp.errors?.[0].message).toMatch(
        /Cannot make payment on invoice with status draft/i,
      );
    });

    it("should reject payments on archived invoices", async () => {
      const archivedId = `INV-ARCH-${Date.now()}`;
      const archivedInvoice = {
        ...baseInvoice,
        id: archivedId,
        status: "archived",
      };
      await createInvoice(app, token, archivedInvoice);

      const resp = await applyPayment(app, token, archivedInvoice.id, 50);
      expect(resp.data).toBeNull();
      expect(resp.errors?.[0].message).toMatch(
        /Cannot make payment on invoice with status archived/i,
      );
    });
  });

  describe("invalid amounts", () => {
    it("rejects negative payment values", async () => {
      const resp = await applyPayment(app, token, currentInvoiceId, -50);
      expect(resp.data).toBeNull();
      expect(resp.errors?.[0].message).toMatch(
        /Payment amount must be positive/i,
      );
    });

    it("rejects zero payment values", async () => {
      const resp = await applyPayment(app, token, currentInvoiceId, 0);
      expect(resp.data).toBeNull();
      expect(resp.errors?.[0].message).toMatch(/Payment amount cannot be 0/i);
    });

    it("rejects non-numeric (string) payment values", async () => {
      const resp = await applyPayment(
        app,
        token,
        currentInvoiceId,
        "invalid" as unknown as number,
      );
      expect(resp.data).toBeUndefined();
      expect(resp.errors?.[0].message).toMatch(
        /Float cannot represent non numeric value/i,
      );
    });
  });
});
