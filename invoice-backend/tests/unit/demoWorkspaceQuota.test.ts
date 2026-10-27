import { describe, expect, it } from "vitest";
import { ValidationException } from "../../src/config/exception.config";
import { randomUUID } from "node:crypto";
import {
  assertDemoInvoiceText,
  assertDemoRecordId,
  DEMO_INPUT_LIMITS,
  DEMO_INVOICE_STATUSES,
  DEMO_TEXT_LIMITS,
  DEMO_WORKSPACE_LIMITS,
  exceedsWorkspaceLimits,
  prepareDemoInvoiceInput,
} from "../../src/services/demoWorkspaceQuota";
import {
  issueDemoWriteCapability,
  requireDemoMutationAllowed,
  requireHttpForDemoMutation,
  type DemoWriteCapability,
} from "../../src/services/demoSessionPolicy";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

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

  it("accepts only the application's statuses, while incomplete drafts keep empty fields", () => {
    expect(DEMO_INVOICE_STATUSES).toEqual(["draft", "pending", "paid"]);
    for (const status of DEMO_INVOICE_STATUSES)
      expect(prepareDemoInvoiceInput({ status }).status).toBe(status);
    for (const status of ["", "Paid", "archived", "void", "x".repeat(16)])
      expect(() => prepareDemoInvoiceInput({ status })).toThrow(
        "status is invalid",
      );
    // An omitted status stays omitted; create then uses the service default.
    expect(prepareDemoInvoiceInput({ clientName: "" })).toEqual({
      clientName: "",
    });
    // The shape the frontend sends for a blank "Save as Draft".
    expect(
      prepareDemoInvoiceInput({
        status: "draft",
        clientName: "",
        clientEmail: "",
        description: "",
        clientAddress: { street: "", city: "", postCode: "", country: "" },
        senderAddress: { street: "", city: "", postCode: "", country: "" },
        items: [{ id: "", name: "", quantity: 0, price: 0, total: 0 }],
        paymentTerms: 30,
      }),
    ).toMatchObject({
      status: "draft",
      items: [{ name: "", quantity: 0, price: 0 }],
    });
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

describe("temporary-session write capability", () => {
  const temporary = {
    id: "demo-session:user",
    demoSessionId: "session",
    name: "Demo visitor",
    role: "USER" as const,
  };
  const ordinary = { id: "auth0|user", name: "User", role: "USER" as const };
  const issue = (overrides = {}) =>
    issueDemoWriteCapability({
      sessionId: "session",
      userId: temporary.id,
      operation: "edit",
      ...overrides,
    });

  it("admits a temporary session only for the granted operation, session and user", () => {
    const { capability } = issue();
    expect(() =>
      requireDemoMutationAllowed(temporary, capability, "edit"),
    ).not.toThrow();
    expect(() =>
      requireDemoMutationAllowed(temporary, capability, "create", "edit"),
    ).not.toThrow();
    for (const other of ["create", "pay", "delete", "restore"] as const)
      expect(() =>
        requireDemoMutationAllowed(temporary, capability, other),
      ).toThrow("read-only");
    // No operations named (bulk deletes, user administration): never admitted.
    expect(() => requireDemoMutationAllowed(temporary, capability)).toThrow(
      "read-only",
    );
    for (const user of [
      { ...temporary, demoSessionId: "another-session" },
      { ...temporary, id: "demo-session:another-user" },
      // The reserved ID alone is still temporary, and has no session to match.
      { id: temporary.id, name: temporary.name, role: temporary.role },
    ])
      expect(() =>
        requireDemoMutationAllowed(user, capability, "edit"),
      ).toThrow("read-only");
  });

  it("is spent on revocation, and cannot be forged, copied or deserialized", () => {
    const { capability, revoke } = issue();
    revoke();
    expect(() =>
      requireDemoMutationAllowed(temporary, capability, "edit"),
    ).toThrow("read-only");
    const live = issue().capability;
    expect(Object.isFrozen(live)).toBe(true);
    expect(Object.keys(live)).toEqual([]);
    for (const forged of [
      {},
      { ...live },
      Object.create(live) as object,
      JSON.parse(JSON.stringify(live)) as object,
      { sessionId: "session", userId: temporary.id, operation: "edit" },
    ])
      expect(() =>
        requireDemoMutationAllowed(
          temporary,
          forged as DemoWriteCapability,
          "edit",
        ),
      ).toThrow("read-only");
    expect(() => requireDemoMutationAllowed(temporary, null, "edit")).toThrow(
      "read-only",
    );
  });

  it("leaves ordinary identities unaffected, with or without a capability", () => {
    expect(() => requireDemoMutationAllowed(ordinary)).not.toThrow();
    expect(() =>
      requireDemoMutationAllowed(ordinary, null, "delete"),
    ).not.toThrow();
    expect(() => requireDemoMutationAllowed(null)).not.toThrow();
  });

  it("is issued only by the session-write coordinator", () => {
    const src = path.resolve(__dirname, "../../src");
    const files = readdirSync(src, { recursive: true, encoding: "utf8" })
      .filter((file) => file.endsWith(".ts"))
      .filter((file) =>
        readFileSync(path.join(src, file), "utf8").includes(
          "issueDemoWriteCapability(",
        ),
      )
      .map((file) => file.replaceAll(path.sep, "/"))
      .sort();
    expect(files).toEqual([
      "services/demoSessionPolicy.ts",
      "services/demoSessionWrite.ts",
    ]);
  });
});
