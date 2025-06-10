import "reflect-metadata";
import { RevisionService } from "@/services/revision.service";
import { describe, expect, beforeEach, test, vi } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { IDatabaseConnection } from "@/database/database.connection";
import prisma from "../../../libs/__mocks__/prisma";
import { UserIdAndRole } from "@/constants/types";
import {
  ValidationException,
  NotFoundException,
} from "@/config/exception.config";

// Mock jsondiffpatch
vi.mock("jsondiffpatch", async () => {
  return {
    create: vi.fn(() => ({
      diff: vi.fn((prev, curr) => ({ changed: true })),
    })),
  };
});

const mockDatabaseConnection = mockDeep<IDatabaseConnection>();
mockDatabaseConnection.getDatabase.mockReturnValue(prisma);

const mockUserContext: UserIdAndRole = {
  id: "user1",
  role: "ADMIN",
  username: "testuser",
  name: "Test User",
};

describe("RevisionService", () => {
  let revisionService: RevisionService;

  beforeEach(() => {
    revisionService = new RevisionService(
      mockDatabaseConnection,
      mockUserContext,
    );
    mockReset(prisma);
    vi.clearAllMocks();

    // default behaviours for this suite
    prisma.invoice.findUnique.mockResolvedValue({ createdById: "user1" });
    prisma.invoiceRevision.findMany.mockResolvedValue([]);
  });

  test("createRevision should throw if not authorized", async () => {
    revisionService = new RevisionService(mockDatabaseConnection, null);
    await expect(
      revisionService.createRevision("inv1", {}, {}, "create"),
    ).rejects.toThrow(ValidationException);
  });

  test("createRevision should create a revision for create type", async () => {
    prisma.invoiceRevision.findFirst.mockResolvedValue(null);
    prisma.invoiceRevision.create.mockResolvedValue({ id: "rev1" });

    await revisionService.createRevision(
      "inv1",
      null,
      { data: "new" },
      "create",
    );

    expect(prisma.invoiceRevision.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        invoiceId: "inv1",
        createdById: "user1",
        revisionNumber: 1,
        changeType: "create",
        jsonDiff: null,
        fullSnapshot: JSON.stringify({ data: "new" }),
      }),
    });
  });

  test("createRevision should compute diff for update", async () => {
    prisma.invoiceRevision.findFirst.mockResolvedValue({ revisionNumber: 1 });
    prisma.invoiceRevision.create.mockResolvedValue({ id: "rev2" });

    await revisionService.createRevision(
      "inv1",
      { old: true },
      { new: true },
      "update",
    );

    expect(prisma.invoiceRevision.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        revisionNumber: 2,
        jsonDiff: JSON.stringify({ changed: true }),
      }),
    });
  });

  test("getInvoiceRevisions should return revisions", async () => {
    prisma.invoice.findUnique.mockResolvedValue({ createdById: "user1" });
    prisma.invoiceRevision.findMany.mockResolvedValue([
      {
        id: "rev1",
        invoiceId: "inv1",
        createdAt: new Date(),
        createdBy: { id: "user1", username: "testuser", name: "Test User" },
        revisionNumber: 1,
        changeType: "create",
        jsonDiff: null,
        fullSnapshot: JSON.stringify({}),
        description: null,
      },
    ]);

    const result = await revisionService.getInvoiceRevisions("inv1");

    expect(result).toHaveLength(1);
    expect(prisma.invoiceRevision.findMany).toHaveBeenCalled();
  });

  test("getInvoiceRevisions should throw if unauthorized", async () => {
    const mockUserContext: UserIdAndRole = {
      id: "user1",
      role: "USER",
      username: "testuser",
      name: "Test User",
    };
    revisionService = new RevisionService(
      mockDatabaseConnection,
      mockUserContext,
    );
    prisma.invoice.findUnique.mockResolvedValue({ createdById: "user2" });
    await expect(
      revisionService.getInvoiceRevisions("inv1"),
    ).rejects.toThrowError(
      new ValidationException(
        "Unauthorized to view revisions for this invoice",
      ),
    );
  });

  test("restoreInvoiceToRevision should restore the invoice", async () => {
    prisma.invoice.findUnique.mockResolvedValue({ createdById: "user1" });
    prisma.invoiceRevision.findUnique.mockResolvedValue({
      id: "rev1",
      fullSnapshot: JSON.stringify({ description: "restored" }),
    });
    prisma.invoice.findUnique.mockResolvedValueOnce({ id: "inv1" });
    prisma.$transaction.mockImplementation(async (cb) => await cb(prisma));

    await revisionService.restoreInvoiceToRevision("inv1", 1);

    expect(prisma.invoice.update).toHaveBeenCalled();
  });

  test("getRevisionDiff should return the diff", async () => {
    prisma.invoice.findUnique.mockResolvedValue({ createdById: "user1" });
    prisma.invoiceRevision.findUnique.mockResolvedValueOnce({
      fullSnapshot: JSON.stringify({ old: true }),
    });
    prisma.invoiceRevision.findUnique.mockResolvedValueOnce({
      fullSnapshot: JSON.stringify({ new: true }),
    });

    const result = await revisionService.getRevisionDiff("inv1", 1, 2);

    expect(result).toEqual({ changed: true });
  });
});
