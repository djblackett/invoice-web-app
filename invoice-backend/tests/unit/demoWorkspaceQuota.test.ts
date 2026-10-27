import { describe, expect, it, vi } from "vitest";
import { parse, type FragmentDefinitionNode } from "graphql";
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
  claimDemoWriteIssuer,
  requireDemoMutationAllowed,
  requireHttpForDemoMutation,
  requireSingleDemoMutation,
  type DemoWriteCapability,
} from "../../src/services/demoSessionPolicy";
import type { RepositoryDatabase } from "../../src/database/database.connection";
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
    // Slice 3B.2 admission: failures count, and the attempt bound sits above
    // the change budget so ordinary mistakes never exhaust it first.
    expect(DEMO_WORKSPACE_LIMITS.attempts).toBe(400);
    expect(DEMO_WORKSPACE_LIMITS.attempts).toBeGreaterThan(
      DEMO_WORKSPACE_LIMITS.mutations,
    );
    expect(DEMO_WORKSPACE_LIMITS.concurrentWrites).toBe(2);
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

  it("rejects a repeated nonempty item ID (any case, any number of repeats), but not distinct or blank IDs", () => {
    const [a, b] = [randomUUID(), randomUUID()];
    expect(
      prepareDemoInvoiceInput({
        items: [
          { ...item, id: a },
          { ...item, id: b },
          { ...item, id: "" },
          { ...item, id: "" },
          { ...item },
        ],
      }).items,
    ).toHaveLength(5);
    for (const [items, field] of [
      [
        [
          { ...item, id: a, price: 10 },
          { ...item, id: a, price: 20 },
        ],
        "items.1.id",
      ],
      [
        [
          { ...item, id: a, quantity: 1 },
          { ...item, id: a, quantity: 3 },
        ],
        "items.1.id",
      ],
      [
        [
          { ...item, id: a },
          { ...item, id: b },
          { ...item, id: a },
          { ...item, id: a },
        ],
        "items.2.id",
      ],
      [
        [
          { ...item, id: a },
          { ...item, id: a.toUpperCase() },
        ],
        "items.1.id",
      ],
    ] as const)
      expect(() => prepareDemoInvoiceInput({ items })).toThrow(
        new ValidationException(`${field} is duplicated`),
      );
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
  // This module graph never loads the coordinator, so the test can claim.
  const issueDemoWriteCapability = claimDemoWriteIssuer();
  const database = {} as RepositoryDatabase;
  const otherDatabase = {} as RepositoryDatabase;
  const issue = (overrides = {}) =>
    issueDemoWriteCapability({
      sessionId: "session",
      userId: temporary.id,
      operation: "edit",
      database,
      ...overrides,
    });

  it("admits a temporary session only for the granted operation, session, user and transaction", () => {
    const { capability } = issue();
    expect(() =>
      requireDemoMutationAllowed(temporary, capability, [database], "edit"),
    ).not.toThrow();
    expect(() =>
      requireDemoMutationAllowed(
        temporary,
        capability,
        [database, database],
        "create",
        "edit",
      ),
    ).not.toThrow();
    for (const other of ["create", "pay", "delete", "restore"] as const)
      expect(() =>
        requireDemoMutationAllowed(temporary, capability, [database], other),
      ).toThrow("read-only");
    // No operations named (bulk deletes, user administration): never admitted.
    expect(() =>
      requireDemoMutationAllowed(temporary, capability, [database]),
    ).toThrow("read-only");
    for (const user of [
      { ...temporary, demoSessionId: "another-session" },
      { ...temporary, id: "demo-session:another-user" },
      // The reserved ID alone is still temporary, and has no session to match.
      { id: temporary.id, name: temporary.name, role: temporary.role },
    ])
      expect(() =>
        requireDemoMutationAllowed(user, capability, [database], "edit"),
      ).toThrow("read-only");
    // Any database other than the grant's transaction, or none at all.
    for (const writesThrough of [
      [],
      [otherDatabase],
      [database, otherDatabase],
      [{ ...database } as RepositoryDatabase],
    ])
      expect(() =>
        requireDemoMutationAllowed(
          temporary,
          capability,
          writesThrough,
          "edit",
        ),
      ).toThrow("read-only");
  });

  it("is spent on revocation, and cannot be forged, copied or deserialized", () => {
    const { capability, revoke } = issue();
    revoke();
    expect(() =>
      requireDemoMutationAllowed(temporary, capability, [database], "edit"),
    ).toThrow("read-only");
    const live = issue().capability;
    expect(Object.isFrozen(live)).toBe(true);
    expect(Object.keys(live)).toEqual([]);
    for (const forged of [
      {},
      { ...live },
      Object.create(live) as object,
      JSON.parse(JSON.stringify(live)) as object,
      {
        sessionId: "session",
        userId: temporary.id,
        operation: "edit",
        database,
      },
    ])
      expect(() =>
        requireDemoMutationAllowed(
          temporary,
          forged as DemoWriteCapability,
          [database],
          "edit",
        ),
      ).toThrow("read-only");
    expect(() =>
      requireDemoMutationAllowed(temporary, null, [database], "edit"),
    ).toThrow("read-only");
  });

  it("leaves ordinary identities unaffected, with or without a capability", () => {
    expect(() => requireDemoMutationAllowed(ordinary)).not.toThrow();
    expect(() =>
      requireDemoMutationAllowed(ordinary, null, [], "delete"),
    ).not.toThrow();
    expect(() => requireDemoMutationAllowed(null)).not.toThrow();
  });

  it("hands its issuer out once, so the coordinator either owns it or cannot load", async () => {
    expect(() => claimDemoWriteIssuer()).toThrow("already claimed");
    vi.resetModules();
    // Once the coordinator has loaded, nothing else can claim the issuer...
    await import("../../src/services/demoSessionWrite");
    const policy = await import("../../src/services/demoSessionPolicy");
    expect(() => policy.claimDemoWriteIssuer()).toThrow("already claimed");
    vi.resetModules();
    // ...and a module that claimed first stops the coordinator from loading.
    (
      await import("../../src/services/demoSessionPolicy")
    ).claimDemoWriteIssuer();
    await expect(import("../../src/services/demoSessionWrite")).rejects.toThrow(
      "already claimed",
    );
    vi.resetModules();
  });

  it("is claimed only by the session-write coordinator", () => {
    const src = path.resolve(__dirname, "../../src");
    const files = readdirSync(src, { recursive: true, encoding: "utf8" })
      .filter((file) => file.endsWith(".ts"))
      .filter((file) =>
        readFileSync(path.join(src, file), "utf8").includes(
          "claimDemoWriteIssuer(",
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

describe("temporary-session single-mutation rule", () => {
  const temporary = {
    id: "demo-session:user",
    demoSessionId: "session",
    name: "Demo visitor",
    role: "USER" as const,
  };
  const ordinary = { id: "auth0|user", name: "User", role: "USER" as const };
  const check = (
    user: typeof temporary | typeof ordinary | null,
    source: string,
    operationName?: string,
  ) => {
    const document = parse(source);
    const operations = document.definitions.filter(
      (d) => d.kind === "OperationDefinition",
    );
    const operation = operationName
      ? operations.find((o) => o.name?.value === operationName)
      : operations[0];
    requireSingleDemoMutation(user, operation, (name) =>
      document.definitions.find(
        (d): d is FragmentDefinitionNode =>
          d.kind === "FragmentDefinition" && d.name.value === name,
      ),
    );
  };
  const refused = "Temporary demo sessions may run one mutation per request";

  it("admits exactly one root mutation field, however it is spelled", () => {
    for (const source of [
      'mutation { markAsPaid(id: "a") { id } }',
      'mutation { paid: markAsPaid(id: "a") { id } }',
      'mutation { ...F } fragment F on Mutation { markAsPaid(id: "a") { id } }',
      'mutation { ... on Mutation { markAsPaid(id: "a") { id } } }',
      // Many fields BELOW the single root field are fine.
      'mutation { editInvoice(id: "a") { id items { id name } total } }',
    ])
      expect(() => check(temporary, source)).not.toThrow();
  });

  it("counts aliases, repeats, fragments, inline fragments, directives and __typename", () => {
    for (const source of [
      'mutation { a: markAsPaid(id: "a") { id } b: markAsPaid(id: "a") { id } }',
      'mutation { markAsPaid(id: "a") { id } markAsPaid(id: "a") { id } }',
      'mutation { markAsPaid(id: "a") { id } __typename }',
      'mutation { ...F ...F } fragment F on Mutation { markAsPaid(id: "a") { id } }',
      'mutation { ...F } fragment F on Mutation { a: markAsPaid(id: "a") { id } ...G } fragment G on Mutation { b: removeInvoice(id: "a") { acknowledged } }',
      'mutation { ... on Mutation { a: markAsPaid(id: "a") { id } } ... { b: markAsPaid(id: "a") { id } } }',
      'mutation { a: markAsPaid(id: "a") @skip(if: true) { id } b: markAsPaid(id: "a") { id } }',
      `mutation { ${Array.from({ length: 300 }, (_, i) => `m${i}: markAsPaid(id: "a") { id }`).join(" ")} }`,
    ])
      expect(() => check(temporary, source)).toThrow(refused);
  });

  it("judges only the selected operation, fails closed without one, and leaves queries and ordinary users alone", () => {
    const two =
      'mutation Two { a: markAsPaid(id: "a") { id } b: markAsPaid(id: "a") { id } }';
    const one = 'mutation One { markAsPaid(id: "a") { id } }';
    expect(() => check(temporary, `${one} ${two}`, "One")).not.toThrow();
    expect(() => check(temporary, `${one} ${two}`, "Two")).toThrow(refused);
    expect(() =>
      requireSingleDemoMutation(temporary, undefined, () => undefined),
    ).toThrow(refused);
    expect(() =>
      check(temporary, "{ allInvoices { id } a: allInvoices { id } }"),
    ).not.toThrow();
    for (const user of [ordinary, null])
      expect(() => check(user, two)).not.toThrow();
  });
});
