import "reflect-metadata";
import { describe, test, expect, beforeEach } from "vitest";
import { mock, MockProxy } from "vitest-mock-extended";
import { getInvoiceRevisionResolvers } from "@/resolvers/invoiceRevisionResolvers";
import type { InjectedQueryContext } from "@/constants/types";
import type { InvoiceService } from "@/services/invoice.service";
import type { InvoiceRevisionService } from "@/services/invoiceRevision.service";
import type { InvoiceSnapshot } from "@/services/invoiceDiff";

const snapshot: InvoiceSnapshot = {
  clientAddress: { street: "s", city: "c", postCode: "p", country: "k" },
  senderAddress: { street: "s", city: "c", postCode: "p", country: "k" },
  clientEmail: "e",
  clientName: "n",
  createdAt: "2024-01-01",
  description: "d",
  items: [],
  paymentDue: "2024-02-01",
  paymentTerms: 14,
  status: "pending",
  total: 0,
};

describe("invoice revision resolvers", () => {
  let invoiceService: MockProxy<InvoiceService>;
  let revisionService: MockProxy<InvoiceRevisionService>;
  let context: InjectedQueryContext;
  const resolvers = getInvoiceRevisionResolvers();

  beforeEach(() => {
    invoiceService = mock<InvoiceService>();
    revisionService = mock<InvoiceRevisionService>();
    context = {
      user: { id: "user1", role: "ADMIN", username: "u@e.c", name: "U" },
      invoiceService,
      invoiceRevisionService: revisionService,
    };
  });

  test("Query.invoiceRevisions returns a serialized list", async () => {
    invoiceService.getInvoiceById.mockResolvedValue({ id: "inv-1" });
    revisionService.listRevisions.mockResolvedValue([
      {
        id: "rev-1",
        invoiceId: "inv-1",
        revisionNumber: 1,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        createdById: "user1",
        changeType: "create",
        restoredFromRevisionId: null,
        message: "Invoice created",
        snapshot,
        createdBy: { id: "user1", username: "u@e.c", name: "U" },
      },
    ]);

    const out = await resolvers.Query.invoiceRevisions(
      {},
      { invoiceId: "inv-1" },
      context,
    );

    expect(Array.isArray(out)).toBe(true);
    expect(out[0]).toMatchObject({
      id: "rev-1",
      revisionNumber: 1,
      changeType: "create",
      message: "Invoice created",
    });
    expect(typeof out[0].createdAt).toBe("string");
  });

  test("Mutation.restoreInvoiceRevision delegates to InvoiceService.restoreRevision", async () => {
    invoiceService.restoreRevision.mockResolvedValue({ id: "inv-1" });

    await resolvers.Mutation.restoreInvoiceRevision(
      {},
      { invoiceId: "inv-1", revisionId: "rev-3" },
      context,
    );

    expect(invoiceService.restoreRevision).toHaveBeenCalledWith(
      "inv-1",
      "rev-3",
    );
  });
});
