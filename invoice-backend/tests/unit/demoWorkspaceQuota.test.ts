import { describe, expect, it } from "vitest";
import { ValidationException } from "../../src/config/exception.config";
import { randomUUID } from "node:crypto";
import {
  assertDemoInvoiceText,
  assertDemoRecordId,
  DEMO_INPUT_LIMITS,
  DEMO_TEXT_LIMITS,
  DEMO_WORKSPACE_LIMITS,
  exceedsWorkspaceLimits,
  prepareDemoInvoiceInput,
} from "../../src/services/demoWorkspaceQuota";
import {
  requireDemoMutationAllowed,
  requireHttpForDemoMutation,
} from "../../src/services/demoSessionPolicy";

const address = {
  street: "1 Main",
  city: "Halifax",
  postCode: "B3H",
  country: "CA",
};

describe("temporary workspace quota policy", () => {
  it("keeps the agreed Phase 1 resource limits", () => {
    expect(DEMO_WORKSPACE_LIMITS).toMatchObject({
      invoices: 30,
      revisions: 200,
      itemsPerInvoice: 20,
    });
  });

  it("allows usage AT each limit and rejects usage beyond any limit", () => {
    const atLimit = {
      invoices: DEMO_WORKSPACE_LIMITS.invoices,
      revisions: DEMO_WORKSPACE_LIMITS.revisions,
      maxItemsPerInvoice: DEMO_WORKSPACE_LIMITS.itemsPerInvoice,
    };
    expect(exceedsWorkspaceLimits(atLimit)).toBe(false);
    for (const key of Object.keys(atLimit) as (keyof typeof atLimit)[])
      expect(
        exceedsWorkspaceLimits({ ...atLimit, [key]: atLimit[key] + 1 }),
      ).toBe(true);
  });

  it("accepts text at each bound and names the first oversized field", () => {
    const at = (n: number) => "x".repeat(n);
    const invoice = {
      clientName: at(DEMO_TEXT_LIMITS.clientName),
      description: at(DEMO_TEXT_LIMITS.description),
      clientAddress: { ...address, street: at(DEMO_TEXT_LIMITS.street) },
      senderAddress: address,
      items: [
        {
          name: at(DEMO_TEXT_LIMITS.itemName),
          price: 1,
          quantity: 1,
          total: 1,
        },
      ],
    };
    expect(() => assertDemoInvoiceText(invoice)).not.toThrow();
    expect(() =>
      assertDemoInvoiceText({ ...invoice, description: at(501) }),
    ).toThrow("description exceeds 500 characters");
    expect(() =>
      assertDemoInvoiceText({
        ...invoice,
        senderAddress: { ...address, country: at(61) },
      }),
    ).toThrow("senderAddress.country exceeds 60 characters");
    expect(() =>
      assertDemoInvoiceText({
        ...invoice,
        items: [...invoice.items, { ...invoice.items[0]!, name: at(101) }],
      }),
    ).toThrow("items.1.name exceeds 100 characters");
  });

  it("ignores absent fields so partial updates validate only what they change", () => {
    expect(() => assertDemoInvoiceText({})).not.toThrow();
    expect(() => assertDemoInvoiceText({ clientName: "ok" })).not.toThrow();
  });
});

describe("temporary-session input preparation (before any transaction)", () => {
  const item = { name: "Logo", price: 10, quantity: 2 };

  it("rebuilds input from an allowlist: no invoice ID, totals or ownership fields", () => {
    const itemId = randomUUID();
    const prepared = prepareDemoInvoiceInput({
      id: "OR0001",
      total: 999,
      createdById: "auth0|someone-else",
      createdBy: { id: "auth0|someone-else", role: "ADMIN" },
      clientAddressId: "1",
      clientName: "Client",
      paymentTerms: 30,
      clientAddress: { street: "1 Main", unexpected: "x" },
      items: [
        { ...item, id: itemId, total: 999 },
        { ...item, id: "" },
      ],
    });
    expect(prepared).toEqual({
      clientName: "Client",
      paymentTerms: 30,
      // Omitted address fields stay omitted, so an edit keeps stored values.
      clientAddress: { street: "1 Main" },
      items: [
        { ...item, id: itemId, total: undefined },
        { ...item, total: undefined },
      ],
    });
    expect(prepareDemoInvoiceInput({})).toEqual({});
  });

  it("accepts every numeric and list bound exactly, and rejects one beyond", () => {
    const L = DEMO_INPUT_LIMITS;
    const atLimit = {
      paymentTerms: L.paymentTerms,
      items: Array.from(
        { length: DEMO_WORKSPACE_LIMITS.itemsPerInvoice },
        () => ({ name: "x", price: L.price, quantity: L.quantity }),
      ),
    };
    expect(() => prepareDemoInvoiceInput(atLimit)).not.toThrow();
    for (const beyond of [
      { paymentTerms: L.paymentTerms + 1 },
      { items: [...atLimit.items, item] },
      { items: [{ ...item, price: L.price + 0.01 }] },
      { items: [{ ...item, quantity: L.quantity + 1 }] },
    ])
      expect(() => prepareDemoInvoiceInput(beyond)).toThrow(
        ValidationException,
      );
  });

  it.each([
    ["NaN price", { items: [{ ...item, price: Number.NaN }] }],
    ["infinite price", { items: [{ ...item, price: Infinity }] }],
    ["negative price", { items: [{ ...item, price: -1 }] }],
    ["string price", { items: [{ ...item, price: "10" }] }],
    ["fractional quantity", { items: [{ ...item, quantity: 1.5 }] }],
    ["negative quantity", { items: [{ ...item, quantity: -1 }] }],
    ["fractional payment terms", { paymentTerms: 14.5 }],
    ["non-UUID item ID", { items: [{ ...item, id: "OR0001-item" }] }],
    ["non-string item ID", { items: [{ ...item, id: 7 }] }],
    ["non-text field", { clientName: 42 }],
    ["non-object address", { senderAddress: "1 Main" }],
    ["non-list items", { items: "Logo" }],
    ["non-object item", { items: ["Logo"] }],
    [
      "oversized text",
      { clientEmail: "x".repeat(DEMO_TEXT_LIMITS.clientEmail + 1) },
    ],
    ["non-object input", "invoice"],
  ])("rejects %s", (_label, input) => {
    expect(() => prepareDemoInvoiceInput(input)).toThrow(ValidationException);
  });

  it("names only the offending field, never the submitted value", () => {
    const secret = "y".repeat(DEMO_TEXT_LIMITS.clientName + 1);
    expect(() => prepareDemoInvoiceInput({ clientName: secret })).toThrow(
      "clientName exceeds 100 characters",
    );
    expect(() =>
      prepareDemoInvoiceInput({ items: [{ ...item, id: "AB1234" }] }),
    ).toThrow("items.0.id is invalid");
  });

  it("bounds record IDs by length and character set", () => {
    const visible = `RT3080-${randomUUID()}`;
    expect(assertDemoRecordId("invoiceId", visible)).toBe(visible);
    expect(assertDemoRecordId("revisionId", randomUUID())).toBeTruthy();
    for (const bad of [
      "",
      "x".repeat(DEMO_INPUT_LIMITS.recordIdLength + 1),
      "RT3080' OR '1'='1",
      "RT3080/../x",
      undefined,
      42,
    ])
      expect(() => assertDemoRecordId("invoiceId", bad)).toThrow(
        "invoiceId is invalid",
      );
  });
});

describe("temporary-session transport policy", () => {
  const unmarked = {
    id: "demo-session:abc",
    name: "Demo visitor",
    role: "USER" as const,
  };
  const temporary = { ...unmarked, demoSessionId: "session" };
  const ordinary = { id: "auth0|user", name: "User", role: "USER" as const };

  it("denies WebSocket mutations to temporary sessions only, independently of the read-only guard", () => {
    expect(() => requireHttpForDemoMutation(temporary, true)).toThrow(
      "cannot mutate over WebSocket",
    );
    // The reserved ID alone is enough, without the session marker.
    expect(() => requireHttpForDemoMutation(unmarked, true)).toThrow(
      "cannot mutate over WebSocket",
    );
    expect(() => requireHttpForDemoMutation(temporary, false)).not.toThrow();
    expect(() => requireHttpForDemoMutation(ordinary, true)).not.toThrow();
    expect(() => requireHttpForDemoMutation(null, true)).not.toThrow();
    expect(() => requireDemoMutationAllowed(temporary)).toThrow("read-only");
    expect(() => requireDemoMutationAllowed(ordinary)).not.toThrow();
  });
});
