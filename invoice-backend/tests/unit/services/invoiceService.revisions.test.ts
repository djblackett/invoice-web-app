import "reflect-metadata";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { InvoiceService } from "@/services/invoice.service";
import { InvoiceRevisionService } from "@/services/invoiceRevision.service";
import type { IInvoiceRepo } from "@/repositories/InvoiceRepo";
import type {
  IInvoiceRevisionRepo,
  StoredRevision,
} from "@/repositories/InvoiceRevisionRepo";
import type { Invoice, UserIdAndRole } from "@/constants/types";
import * as InvoiceUtils from "@/utils/utils";
import type { InvoiceSnapshot } from "@/services/invoiceDiff";

vi.mock("@/utils/utils.ts", () => ({
  validateInvoiceData: vi.fn((x) => x),
  validateInvoiceList: vi.fn((x) => x),
  mapPartialInvoiceToInvoice: vi.fn((x) => x),
}));

const user: UserIdAndRole = {
  id: "user1",
  role: "ADMIN",
  username: "u@e.c",
  name: "U",
};

const invoice: Invoice = {
  id: "inv-1",
  createdById: "user1",
  createdBy: user,
  clientAddress: { street: "s", city: "c", postCode: "p", country: "k" },
  senderAddress: { street: "s", city: "c", postCode: "p", country: "k" },
  clientEmail: "e",
  clientName: "n",
  createdAt: "2024-01-01",
  description: "d",
  items: [{ id: "i1", name: "Banner", price: 100, quantity: 2, total: 200 }],
  paymentDue: "2024-02-01",
  paymentTerms: 14,
  status: "pending",
  total: 200,
};

const fakeStored = (snap: InvoiceSnapshot, n = 1): StoredRevision => ({
  id: `rev-${n}`,
  invoiceId: "inv-1",
  revisionNumber: n,
  createdAt: new Date(),
  createdById: "user1",
  changeType: "edit",
  restoredFromRevisionId: null,
  message: null,
  snapshot: snap,
  createdBy: { id: "user1", username: "u@e.c", name: "U" },
});

describe("InvoiceService (revision integration)", () => {
  const invoiceRepo = mockDeep<IInvoiceRepo>();
  const revisionRepo = mockDeep<IInvoiceRevisionRepo>();
  let svc: InvoiceService;

  beforeEach(() => {
    mockReset(invoiceRepo);
    mockReset(revisionRepo);
    vi.clearAllMocks();
    const revisionService = new InvoiceRevisionService(revisionRepo, user);
    svc = new InvoiceService(invoiceRepo, user, revisionService);
    // Wire validator mocks to pass-through, matching the top-level mock above.
    vi.mocked(InvoiceUtils.validateInvoiceData).mockImplementation(
      (x) => x as Partial<Invoice>,
    );
  });

  test("updateInvoice writes a revision when the state actually changes", async () => {
    invoiceRepo.findById.mockResolvedValue(invoice);
    const updated = { ...invoice, status: "paid", total: 200 };
    invoiceRepo.update.mockResolvedValue(updated);
    revisionRepo.findLatest.mockResolvedValue(null); // no prior history
    revisionRepo.create.mockResolvedValue(
      fakeStored({ ...invoice, status: "paid" } as unknown as InvoiceSnapshot, 1),
    );

    await svc.updateInvoice("inv-1", { status: "paid" });

    expect(invoiceRepo.update).toHaveBeenCalled();
    expect(revisionRepo.create).toHaveBeenCalledTimes(1);
    const arg = revisionRepo.create.mock.calls[0]![0]!;
    expect(arg.changeType).toBe("edit");
    expect(arg.snapshot.status).toBe("paid");
  });

  test("updateInvoice skips writing a revision for a no-op edit", async () => {
    invoiceRepo.findById.mockResolvedValue(invoice);
    invoiceRepo.update.mockResolvedValue(invoice); // same state returned
    revisionRepo.findLatest.mockResolvedValue(
      fakeStored(invoice as unknown as InvoiceSnapshot, 1),
    );

    await svc.updateInvoice("inv-1", { status: "pending" }); // unchanged

    expect(invoiceRepo.update).toHaveBeenCalled();
    expect(revisionRepo.create).not.toHaveBeenCalled();
  });

  test("restoreRevision applies old snapshot and appends a new 'restore' revision", async () => {
    const oldSnapshot: InvoiceSnapshot = {
      clientAddress: invoice.clientAddress!,
      senderAddress: invoice.senderAddress!,
      clientEmail: invoice.clientEmail,
      clientName: invoice.clientName,
      createdAt: invoice.createdAt,
      description: "Old description",
      items: [
        { id: "i1", name: "Banner", price: 50, quantity: 1, total: 50 },
      ],
      paymentDue: invoice.paymentDue,
      paymentTerms: invoice.paymentTerms,
      status: "draft",
      total: 50,
    };

    invoiceRepo.findById.mockResolvedValue(invoice);
    invoiceRepo.update.mockImplementation(async (_id, payload) => ({
      ...invoice,
      ...payload,
      items: payload.items ?? invoice.items,
    }));
    revisionRepo.findById.mockResolvedValue(fakeStored(oldSnapshot, 3));
    revisionRepo.findLatest.mockResolvedValue(
      fakeStored(invoice as unknown as InvoiceSnapshot, 5),
    );
    revisionRepo.create.mockResolvedValue(fakeStored(oldSnapshot, 6));

    const result = await svc.restoreRevision("inv-1", "rev-3");

    expect(invoiceRepo.update).toHaveBeenCalled();
    expect(revisionRepo.create).toHaveBeenCalledTimes(1);
    const arg = revisionRepo.create.mock.calls[0]![0]!;
    expect(arg.changeType).toBe("restore");
    expect(arg.restoredFromRevisionId).toBe("rev-3");
    expect(arg.snapshot.status).toBe("draft");
    // totals recomputed
    expect(arg.snapshot.total).toBe(50);
    // underlying repo.update was called with the restored data
    const updateArg = invoiceRepo.update.mock.calls[0]![1]!;
    expect(updateArg.description).toBe("Old description");
    expect(updateArg.status).toBe("draft");
    expect(result).toBeTruthy();
  });

  test("restoreRevision refuses when revision belongs to a different invoice", async () => {
    invoiceRepo.findById.mockResolvedValue(invoice);
    revisionRepo.findById.mockResolvedValue({
      ...fakeStored({} as InvoiceSnapshot, 3),
      invoiceId: "OTHER",
    });

    await expect(
      svc.restoreRevision("inv-1", "rev-3"),
    ).rejects.toThrow(/does not belong/);
    expect(invoiceRepo.update).not.toHaveBeenCalled();
  });
});
