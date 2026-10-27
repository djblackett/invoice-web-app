import { describe, expect, it } from "vitest";
import templates from "../../prisma/demoInvoices.json";
import { canonicalDemoRecords } from "../../prisma/demoWorkspace.cjs";

// Screenshot evidence: portfolio-export/screenshots/manifest.md and images
// 02/03/06. Contact fields on the other invoices are illustrative extensions
// of the captured pattern; Juniper Works deliberately remains incomplete.
const businesses = [
  ["RT3080", "Northstar Studio"],
  ["XM9141", "Cedar & Finch"],
  ["RG0314", "Fieldwork Studio"],
  ["RT2080", "Oakline Creative"],
  ["AA1449", "Willow Design Co."],
  ["TY9141", "Harbour Collective"],
  ["FV2353", "Juniper Works"],
] as const;
const senderAddress = {
  street: "18 Example Lane",
  city: "Sampleton",
  postCode: "AB1 2CD",
  country: "United Kingdom",
};
const clientAddress = {
  street: "42 Sample Street",
  city: "Exampleford",
  postCode: "EF3 4GH",
  country: "United Kingdom",
};
const emptyAddress = { street: "", city: "", postCode: "", country: "" };

describe("canonical portfolio demo fixtures", () => {
  it("keeps seven invoice IDs and eleven snapshots, including five on RT3080", () => {
    const records = canonicalDemoRecords();
    expect(templates.map(({ id }) => id)).toEqual(businesses.map(([id]) => id));
    expect(records.map(({ id }) => id)).toEqual(businesses.map(([id]) => id));
    expect(records.map(({ snapshots }) => snapshots.length)).toEqual([
      5, 1, 1, 1, 1, 1, 1,
    ]);
    expect(records.flatMap(({ snapshots }) => snapshots)).toHaveLength(11);
    for (const { invoice, snapshots } of records) {
      expect(snapshots.at(-1)).toEqual(invoice);
    }
  });

  it.each(businesses)(
    "%s uses %s and synthetic contacts in the template, current state and every revision",
    (id, clientName) => {
      const template = templates.find((invoice) => invoice.id === id)!;
      const record = canonicalDemoRecords().find(
        (invoice) => invoice.id === id,
      )!;
      for (const state of [template, record.invoice, ...record.snapshots]) {
        expect(state).toMatchObject({
          clientName,
          clientEmail: id === "FV2353" ? "" : `${id.toLowerCase()}@example.com`,
          senderAddress,
          clientAddress: id === "FV2353" ? emptyAddress : clientAddress,
        });
      }
    },
  );

  it("preserves the existing dates, terms, statuses and totals", () => {
    expect(
      canonicalDemoRecords().map(({ id, invoice }) => [
        id,
        invoice.createdAt,
        invoice.paymentDue,
        invoice.paymentTerms,
        invoice.status,
        invoice.total,
      ]),
    ).toEqual([
      ["RT3080", "2021-08-18", "2021-08-19", 1, "paid", 2101.8],
      ["XM9141", "2021-08-21", "2021-09-20", 30, "pending", 556],
      ["RG0314", "2021-09-24", "2021-10-01", 7, "paid", 14002.33],
      ["RT2080", "2021-10-11", "2021-10-12", 1, "pending", 102.04],
      ["AA1449", "2021-10-7", "2021-10-14", 7, "pending", 4032.33],
      ["TY9141", "2021-10-01", "2021-10-31", 30, "pending", 6155.91],
      ["FV2353", "2021-11-05", "2021-11-12", 7, "draft", 3102.04],
    ]);
    expect(
      canonicalDemoRecords().map(({ invoice }) =>
        invoice.items.map(({ name, quantity, price, total }) => [
          name,
          quantity,
          price,
          total,
        ]),
      ),
    ).toEqual([
      [
        ["Brand Guidelines", 1, 1800.9, 1800.9],
        ["Logo Design", 1, 300.9, 300.9],
      ],
      [
        ["Banner Design", 1, 156, 156],
        ["Email Design", 2, 200, 400],
      ],
      [["Website Redesign", 1, 14002.33, 14002.33]],
      [["Logo Sketches", 1, 102.04, 102.04]],
      [
        ["New Logo", 1, 1532.33, 1532.33],
        ["Brand Guidelines", 1, 2500, 2500],
      ],
      [["Web Design", 1, 6155.91, 6155.91]],
      [["Logo Re-design", 1, 3102.04, 3102.04]],
    ]);
  });

  it("keeps totals consistent in templates, current invoices and all snapshots", () => {
    const records = canonicalDemoRecords();
    for (const state of [
      ...templates,
      ...records.flatMap(({ invoice, snapshots }) => [invoice, ...snapshots]),
    ]) {
      for (const item of state.items) {
        expect(item.total).toBeCloseTo(item.price * item.quantity, 2);
      }
      expect(state.total).toBeCloseTo(
        state.items.reduce((total, item) => total + item.total, 0),
        2,
      );
    }
  });

  it("preserves the progressive RT3080 history and stable item IDs", () => {
    const { snapshots } = canonicalDemoRecords().find(
      ({ id }) => id === "RT3080",
    )!;
    expect(
      snapshots.map(({ status, description, total, items }) => [
        status,
        description,
        total,
        items.length,
      ]),
    ).toEqual([
      ["draft", "Website re-brand (draft)", 1500, 1],
      ["draft", "Website re-brand + logo", 1800.9, 2],
      ["draft", "Website re-brand + logo", 2101.8, 2],
      ["pending", "Website re-brand + logo", 2101.8, 2],
      ["paid", "Website re-brand + logo", 2101.8, 2],
    ]);
    for (const { id, invoice, snapshots: history } of canonicalDemoRecords()) {
      for (const state of [invoice, ...history]) {
        expect(state.items.map(({ id: itemId }) => itemId)).toEqual(
          state.items.map((_item, index) => `demo-${id}-item-${index + 1}`),
        );
      }
    }
  });
});
