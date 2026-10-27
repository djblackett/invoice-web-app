import { describe, expect, it } from "vitest";
import {
  assertDemoInvoiceText,
  DEMO_TEXT_LIMITS,
  DEMO_WORKSPACE_LIMITS,
  exceedsWorkspaceLimits,
} from "../../src/services/demoWorkspaceQuota";

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
