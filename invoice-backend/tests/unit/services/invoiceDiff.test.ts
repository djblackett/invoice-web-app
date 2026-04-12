import "reflect-metadata";
import { describe, test, expect } from "vitest";
import {
  diffSnapshots,
  snapshotsEqual,
  toSnapshot,
  withRecomputedTotals,
  type InvoiceSnapshot,
} from "@/services/invoiceDiff";

const baseSnapshot = (): InvoiceSnapshot => ({
  clientAddress: {
    street: "84 Church Way",
    city: "Bradford",
    postCode: "BD1 9PB",
    country: "UK",
  },
  senderAddress: {
    street: "19 Union Terrace",
    city: "London",
    postCode: "E1 3EZ",
    country: "UK",
  },
  clientEmail: "a@b.com",
  clientName: "Alex Grim",
  createdAt: "2021-08-21",
  description: "Design",
  items: [
    { id: "i1", name: "Banner", price: 100, quantity: 2, total: 200 },
    { id: "i2", name: "Email", price: 50, quantity: 1, total: 50 },
  ],
  paymentDue: "2021-09-20",
  paymentTerms: 30,
  status: "pending",
  total: 250,
});

const ids = { fromRevisionId: "a", toRevisionId: "b" };

describe("diffSnapshots", () => {
  test("no-op: identical snapshots produce no changes", () => {
    const s = baseSnapshot();
    const diff = diffSnapshots(s, baseSnapshot(), ids);
    expect(diff.fieldChanges).toHaveLength(0);
    expect(diff.addressChanges).toHaveLength(0);
    expect(diff.itemChanges).toHaveLength(0);
    expect(snapshotsEqual(s, baseSnapshot())).toBe(true);
  });

  test("scalar field change captured with before/after", () => {
    const before = baseSnapshot();
    const after = { ...baseSnapshot(), status: "paid" };
    const diff = diffSnapshots(before, after, ids);
    expect(diff.fieldChanges).toEqual([
      { field: "status", before: "pending", after: "paid" },
    ]);
  });

  test("monetary change on total reported with numbers", () => {
    const before = baseSnapshot();
    const after = { ...baseSnapshot(), total: 999.5 };
    const diff = diffSnapshots(before, after, ids);
    expect(diff.fieldChanges).toContainEqual({
      field: "total",
      before: 250,
      after: 999.5,
    });
  });

  test("address changes are grouped under the address field", () => {
    const before = baseSnapshot();
    const after = baseSnapshot();
    after.clientAddress.street = "1 New Road";
    after.clientAddress.city = "Leeds";
    const diff = diffSnapshots(before, after, ids);
    expect(diff.addressChanges).toHaveLength(1);
    expect(diff.addressChanges[0]?.field).toBe("clientAddress");
    expect(diff.addressChanges[0]?.changes).toEqual(
      expect.arrayContaining([
        { key: "street", before: "84 Church Way", after: "1 New Road" },
        { key: "city", before: "Bradford", after: "Leeds" },
      ]),
    );
  });

  test("item added / removed / modified, matched by stable id", () => {
    const before = baseSnapshot();
    const after = baseSnapshot();
    after.items = [
      { id: "i1", name: "Banner", price: 120, quantity: 2, total: 240 }, // modified price
      { id: "i3", name: "Logo", price: 500, quantity: 1, total: 500 }, // added
      // i2 removed
    ];
    const diff = diffSnapshots(before, after, ids);
    const byKind = Object.fromEntries(
      diff.itemChanges.map((c) => [c.changeType, c]),
    );
    expect(byKind["modified"]?.itemKey).toBe("i1");
    expect(byKind["modified"]?.fieldChanges).toEqual(
      expect.arrayContaining([
        { field: "price", before: 100, after: 120 },
        { field: "total", before: 200, after: 240 },
      ]),
    );
    expect(byKind["added"]?.itemKey).toBe("i3");
    expect(byKind["removed"]?.itemKey).toBe("i2");
  });

  test("item without stable id falls back to name matching (not treated as remove+add)", () => {
    const before = baseSnapshot();
    before.items = [
      { id: "", name: "Banner", price: 100, quantity: 2, total: 200 },
    ];
    const after = baseSnapshot();
    after.items = [
      { id: "", name: "Banner", price: 150, quantity: 2, total: 300 },
    ];
    const diff = diffSnapshots(before, after, ids);
    expect(diff.itemChanges).toHaveLength(1);
    expect(diff.itemChanges[0]?.changeType).toBe("modified");
    expect(diff.itemChanges[0]?.fieldChanges).toEqual(
      expect.arrayContaining([
        { field: "price", before: 100, after: 150 },
        { field: "total", before: 200, after: 300 },
      ]),
    );
  });

  test("initial revision (from=null) lists every present field as added", () => {
    const after = baseSnapshot();
    const diff = diffSnapshots(null, after, {
      fromRevisionId: null,
      toRevisionId: "x",
    });
    // At minimum: status, total, clientEmail, etc. are present and reported
    expect(diff.fieldChanges.find((c) => c.field === "status")).toBeTruthy();
    // Items should be flagged as added
    expect(diff.itemChanges.every((c) => c.changeType === "added")).toBe(true);
    // Addresses reported as additions
    expect(diff.addressChanges.length).toBeGreaterThan(0);
  });
});

describe("toSnapshot", () => {
  test("normalizes Prisma-like input with Decimal total", () => {
    const prismaResult = {
      clientAddress: { street: "s", city: "c", postCode: "p", country: "k" },
      senderAddress: { street: "s", city: "c", postCode: "p", country: "k" },
      clientEmail: "e",
      clientName: "n",
      createdAt: "2024-01-01",
      description: "d",
      paymentDue: "2024-02-01",
      paymentTerms: 14,
      status: "pending",
      items: [
        { id: "x", name: "thing", price: { toNumber: () => 10 }, quantity: 2, total: { toNumber: () => 20 } },
      ],
      total: { toNumber: () => 20 },
    };
    const snap = toSnapshot(prismaResult);
    expect(snap.total).toBe(20);
    expect(snap.items[0]?.price).toBe(10);
    expect(snap.items[0]?.total).toBe(20);
  });
});

describe("withRecomputedTotals", () => {
  test("recomputes line totals and the invoice total from scratch", () => {
    const snap = baseSnapshot();
    snap.items = [
      { id: "a", name: "x", price: 10, quantity: 3, total: 999 }, // stale total
      { id: "b", name: "y", price: 7.5, quantity: 2, total: 0 }, // stale
    ];
    snap.total = 12345; // stale
    const fixed = withRecomputedTotals(snap);
    expect(fixed.items[0]?.total).toBe(30);
    expect(fixed.items[1]?.total).toBe(15);
    expect(fixed.total).toBe(45);
  });
});
