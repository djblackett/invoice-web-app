import "reflect-metadata";
import { describe, test, expect, beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { InvoiceRevisionService } from "@/services/invoiceRevision.service";
import type {
  IInvoiceRevisionRepo,
  StoredRevision,
} from "@/repositories/InvoiceRevisionRepo";
import type { UserIdAndRole } from "@/constants/types";
import type { InvoiceSnapshot } from "@/services/invoiceDiff";

const mockUser: UserIdAndRole = {
  id: "user1",
  role: "ADMIN",
  username: "a@b.c",
  name: "A",
};

const baseSnapshot = (): InvoiceSnapshot => ({
  clientAddress: { street: "s", city: "c", postCode: "p", country: "k" },
  senderAddress: { street: "s", city: "c", postCode: "p", country: "k" },
  clientEmail: "e",
  clientName: "n",
  createdAt: "2024-01-01",
  description: "d",
  items: [
    { id: "i1", name: "Banner", price: 100, quantity: 2, total: 200 },
  ],
  paymentDue: "2024-02-01",
  paymentTerms: 14,
  status: "pending",
  total: 200,
});

const fakeStored = (snapshot: InvoiceSnapshot, n = 1): StoredRevision => ({
  id: `rev-${n}`,
  invoiceId: "inv-1",
  revisionNumber: n,
  createdAt: new Date("2024-01-01T00:00:00Z"),
  createdById: "user1",
  changeType: "edit",
  restoredFromRevisionId: null,
  message: null,
  snapshot,
  createdBy: { id: "user1", username: "a@b.c", name: "A" },
});

describe("InvoiceRevisionService", () => {
  const mockRepo = mockDeep<IInvoiceRevisionRepo>();
  let service: InvoiceRevisionService;

  beforeEach(() => {
    mockReset(mockRepo);
    service = new InvoiceRevisionService(mockRepo, mockUser);
  });

  test("recordIfChanged writes a revision when the snapshot differs", async () => {
    const latest = fakeStored(baseSnapshot());
    mockRepo.findLatest.mockResolvedValue(latest);
    const changed = {
      ...baseSnapshot(),
      status: "paid",
    };
    mockRepo.create.mockResolvedValue(fakeStored(changed, 2));

    const result = await service.recordIfChanged({
      invoiceId: "inv-1",
      invoice: changed,
      changeType: "edit",
    });

    expect(result).not.toBeNull();
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
    const arg = mockRepo.create.mock.calls[0]![0]!;
    expect(arg.changeType).toBe("edit");
    expect(arg.createdById).toBe("user1");
    expect(arg.snapshot.status).toBe("paid");
  });

  test("recordIfChanged is a no-op on identical snapshots (edit)", async () => {
    mockRepo.findLatest.mockResolvedValue(fakeStored(baseSnapshot()));

    const result = await service.recordIfChanged({
      invoiceId: "inv-1",
      invoice: baseSnapshot(),
      changeType: "edit",
    });

    expect(result).toBeNull();
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  test("recordIfChanged always writes for create/restore even if identical", async () => {
    mockRepo.findLatest.mockResolvedValue(fakeStored(baseSnapshot()));
    mockRepo.create.mockResolvedValue(fakeStored(baseSnapshot(), 2));

    const result = await service.recordIfChanged({
      invoiceId: "inv-1",
      invoice: baseSnapshot(),
      changeType: "restore",
      restoredFromRevisionId: "rev-1",
    });

    expect(result).not.toBeNull();
    expect(mockRepo.create).toHaveBeenCalled();
    const arg = mockRepo.create.mock.calls[0]![0]!;
    expect(arg.changeType).toBe("restore");
    expect(arg.restoredFromRevisionId).toBe("rev-1");
  });

  test("getDiff computes structured diff between two revisions", async () => {
    const before = baseSnapshot();
    const after = { ...baseSnapshot(), status: "paid" };
    mockRepo.findById.mockImplementation(async (id: string) => {
      if (id === "rev-1") return fakeStored(before, 1);
      if (id === "rev-2") return { ...fakeStored(after, 2), id: "rev-2" };
      return null;
    });

    const diff = await service.getDiff("rev-1", "rev-2");

    expect(diff.fromRevisionId).toBe("rev-1");
    expect(diff.toRevisionId).toBe("rev-2");
    expect(diff.fieldChanges).toEqual([
      { field: "status", before: "pending", after: "paid" },
    ]);
  });

  test("listRevisions requires a user context", async () => {
    const svcNoUser = new InvoiceRevisionService(mockRepo, null);
    await expect(svcNoUser.listRevisions("inv-1")).rejects.toThrow(
      "Unauthorized",
    );
  });

  test("getRevision throws NotFound when missing", async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getRevision("missing")).rejects.toThrow(
      "Revision not found",
    );
  });
});
