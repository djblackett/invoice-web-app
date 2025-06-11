import "reflect-metadata";
import { RevisionService, InvoiceRevisionData, RevisionFilters } from "../../../src/services/revision.service";
import { describe, expect, beforeEach, afterEach, test, vi } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { IDatabaseConnection } from "../../../src/database/database.connection";
import { UserIdAndRole } from "../../../src/constants/types";
import { ValidationException, NotFoundException } from "../../../src/config/exception.config";

// Mock jsondiffpatch
const mockDiffPatcher = {
  diff: vi.fn(),
  create: vi.fn()
};

vi.mock("jsondiffpatch", () => ({
  create: vi.fn(() => mockDiffPatcher)
}));

const mockUserContext: UserIdAndRole = {
  id: "user1",
  role: "ADMIN" as const,
  username: "admin@test.com",
  name: "Admin User",
};

const mockRegularUserContext: UserIdAndRole = {
  id: "user2",
  role: "USER" as const,
  username: "user@test.com",
  name: "Regular User",
};

const mockInvoiceData = {
  id: "invoice1",
  description: "Test Invoice",
  clientEmail: "client@test.com",
  clientName: "Test Client",
  paymentDue: "2024-01-15",
  paymentTerms: 30,
  status: "pending",
  total: 1000,
  items: [
    {
      id: "item1",
      name: "Test Item",
      price: 1000,
      quantity: 1,
      total: 1000
    }
  ],
  clientAddress: {
    street: "123 Test St",
    city: "Test City",
    postCode: "12345",
    country: "Test Country"
  },
  senderAddress: {
    street: "456 Sender St",
    city: "Sender City",
    postCode: "67890",
    country: "Sender Country"
  }
};

const mockRevisionData: InvoiceRevisionData = {
  id: "revision1",
  invoiceId: "invoice1",
  createdAt: new Date("2024-01-01"),
  createdBy: {
    id: "user1",
    username: "admin@test.com",
    name: "Admin User"
  },
  revisionNumber: 1,
  changeType: "create",
  description: "Initial invoice creation",
  jsonDiff: null,
  fullSnapshot: mockInvoiceData
};

describe("RevisionService", () => {
  const mockDatabaseConnection = mockDeep<IDatabaseConnection>();
  const mockPrisma = {
    invoiceRevision: {
      findFirst: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn()
    },
    invoice: {
      findUnique: vi.fn(),
      update: vi.fn()
    },
    item: {
      deleteMany: vi.fn()
    },
    $transaction: vi.fn()
  };

  let revisionService: RevisionService;

  beforeEach(() => {
    mockDatabaseConnection.getDatabase.mockReturnValue(mockPrisma as any);
    revisionService = new RevisionService(mockDatabaseConnection, mockUserContext);
    
    // Reset all mocks
    mockReset(mockDatabaseConnection);
    vi.clearAllMocks();
    mockDiffPatcher.diff.mockClear();
    mockDiffPatcher.create.mockClear();
    
    // Setup default mock returns
    mockDatabaseConnection.getDatabase.mockReturnValue(mockPrisma as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createRevision", () => {
    test("should create a revision for a new invoice", async () => {
      // Arrange
      mockPrisma.invoiceRevision.findFirst.mockResolvedValue(null);
      mockPrisma.invoiceRevision.create.mockResolvedValue({
        id: "revision1",
        invoiceId: "invoice1",
        createdById: "user1",
        revisionNumber: 1,
        changeType: "create",
        jsonDiff: null,
        fullSnapshot: JSON.stringify(mockInvoiceData),
        description: "Initial invoice creation"
      });

      // Act
      await revisionService.createRevision(
        "invoice1",
        null,
        mockInvoiceData,
        "create",
        "Initial invoice creation"
      );

      // Assert
      expect(mockPrisma.invoiceRevision.findFirst).toHaveBeenCalledWith({
        where: { invoiceId: "invoice1" },
        orderBy: { revisionNumber: 'desc' }
      });
      expect(mockPrisma.invoiceRevision.create).toHaveBeenCalledWith({
        data: {
          invoiceId: "invoice1",
          createdById: "user1",
          revisionNumber: 1,
          changeType: "create",
          jsonDiff: null,
          fullSnapshot: JSON.stringify(mockInvoiceData),
          description: "Initial invoice creation"
        }
      });
    });

    test("should create a revision for an updated invoice with diff", async () => {
      // Arrange
      const previousData = { ...mockInvoiceData, total: 500 };
      const currentData = { ...mockInvoiceData, total: 1000 };
      const mockDiff = { total: [500, 1000] };

      mockPrisma.invoiceRevision.findFirst.mockResolvedValue({
        revisionNumber: 1
      });
      mockDiffPatcher.diff.mockReturnValue(mockDiff);
      mockPrisma.invoiceRevision.create.mockResolvedValue({
        id: "revision2",
        invoiceId: "invoice1",
        createdById: "user1",
        revisionNumber: 2,
        changeType: "update",
        jsonDiff: JSON.stringify(mockDiff),
        fullSnapshot: JSON.stringify(currentData),
        description: "Invoice updated"
      });

      // Act
      await revisionService.createRevision(
        "invoice1",
        previousData,
        currentData,
        "update",
        "Invoice updated"
      );

      // Assert
      expect(mockDiffPatcher.diff).toHaveBeenCalledWith(previousData, currentData);
      expect(mockPrisma.invoiceRevision.create).toHaveBeenCalledWith({
        data: {
          invoiceId: "invoice1",
          createdById: "user1",
          revisionNumber: 2,
          changeType: "update",
          jsonDiff: JSON.stringify(mockDiff),
          fullSnapshot: JSON.stringify(currentData),
          description: "Invoice updated"
        }
      });
    });

    test("should throw ValidationException when user context is null", async () => {
      // Arrange
      const revisionServiceWithoutUser = new RevisionService(mockDatabaseConnection, null);

      // Act & Assert
      await expect(
        revisionServiceWithoutUser.createRevision(
          "invoice1",
          null,
          mockInvoiceData,
          "create"
        )
      ).rejects.toThrow(ValidationException);
    });
  });

  describe("getInvoiceRevisions", () => {
    test("should return revisions for an invoice owned by the user", async () => {
      // Arrange
      mockPrisma.invoice.findUnique.mockResolvedValue({
        createdById: "user1"
      });
      mockPrisma.invoiceRevision.findMany.mockResolvedValue([
        {
          id: "revision1",
          invoiceId: "invoice1",
          createdAt: new Date("2024-01-01"),
          createdBy: {
            id: "user1",
            username: "admin@test.com",
            name: "Admin User"
          },
          revisionNumber: 1,
          changeType: "create",
          description: "Initial creation",
          jsonDiff: null,
          fullSnapshot: JSON.stringify(mockInvoiceData)
        }
      ]);

      // Act
      const result = await revisionService.getInvoiceRevisions("invoice1");

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: "revision1",
        invoiceId: "invoice1",
        createdAt: new Date("2024-01-01"),
        createdBy: {
          id: "user1",
          username: "admin@test.com",
          name: "Admin User"
        },
        revisionNumber: 1,
        changeType: "create",
        description: "Initial creation",
        jsonDiff: null,
        fullSnapshot: mockInvoiceData
      });
    });

    test("should return revisions for admin user regardless of ownership", async () => {
      // Arrange
      mockPrisma.invoice.findUnique.mockResolvedValue({
        createdById: "user2"
      });
      mockPrisma.invoiceRevision.findMany.mockResolvedValue([
        {
          id: "revision1",
          invoiceId: "invoice1",
          createdAt: new Date("2024-01-01"),
          createdBy: {
            id: "user2",
            username: "user@test.com",
            name: "Regular User"
          },
          revisionNumber: 1,
          changeType: "create",
          description: null,
          jsonDiff: null,
          fullSnapshot: JSON.stringify(mockInvoiceData)
        }
      ]);

      // Act
      const result = await revisionService.getInvoiceRevisions("invoice1");

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].createdBy.id).toBe("user2");
    });

    test("should throw ValidationException for non-admin user accessing other's invoice", async () => {
      // Arrange
      const regularUserService = new RevisionService(mockDatabaseConnection, mockRegularUserContext);
      mockDatabaseConnection.getDatabase.mockReturnValue(mockPrisma as any);
      
      mockPrisma.invoice.findUnique.mockResolvedValue({
        createdById: "user1" // Different from user2
      });

      // Act & Assert
      await expect(
        regularUserService.getInvoiceRevisions("invoice1")
      ).rejects.toThrow(ValidationException);
    });

    test("should throw NotFoundException when invoice doesn't exist", async () => {
      // Arrange
      mockPrisma.invoice.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        revisionService.getInvoiceRevisions("nonexistent")
      ).rejects.toThrow(NotFoundException);
    });

    test("should apply filters correctly", async () => {
      // Arrange
      const filters: RevisionFilters = {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-31"),
        userId: "user1",
        changeType: "update"
      };

      mockPrisma.invoice.findUnique.mockResolvedValue({
        createdById: "user1"
      });
      mockPrisma.invoiceRevision.findMany.mockResolvedValue([]);

      // Act
      await revisionService.getInvoiceRevisions("invoice1", filters);

      // Assert
      expect(mockPrisma.invoiceRevision.findMany).toHaveBeenCalledWith({
        where: {
          invoiceId: "invoice1",
          createdAt: {
            gte: filters.startDate,
            lte: filters.endDate
          },
          createdById: "user1",
          changeType: "update"
        },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              name: true
            }
          }
        },
        orderBy: { revisionNumber: 'desc' }
      });
    });
  });

  describe("restoreInvoiceToRevision", () => {
    test("should restore invoice to specified revision", async () => {
      // Arrange
      const targetRevision = {
        id: "revision1",
        invoiceId: "invoice1",
        revisionNumber: 1,
        fullSnapshot: JSON.stringify(mockInvoiceData)
      };

      const currentInvoice = {
        ...mockInvoiceData,
        items: [mockInvoiceData.items[0]],
        clientAddress: mockInvoiceData.clientAddress,
        senderAddress: mockInvoiceData.senderAddress,
        createdBy: {
          id: "user1",
          username: "admin@test.com",
          name: "Admin User"
        }
      };

      mockPrisma.invoice.findUnique
        .mockResolvedValueOnce({ createdById: "user1" }) // First call for permission check
        .mockResolvedValueOnce(currentInvoice); // Second call for current data

      mockPrisma.invoiceRevision.findUnique.mockResolvedValue(targetRevision);
      
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        return await callback({
          item: { deleteMany: vi.fn() },
          invoice: { 
            update: vi.fn().mockResolvedValue({
              ...currentInvoice,
              ...mockInvoiceData
            })
          }
        });
      });
      
      mockPrisma.$transaction.mockImplementation(mockTransaction);

      // Act
      const result = await revisionService.restoreInvoiceToRevision("invoice1", 1);

      // Assert
      expect(mockPrisma.invoiceRevision.findUnique).toHaveBeenCalledWith({
        where: {
          invoiceId_revisionNumber: {
            invoiceId: "invoice1",
            revisionNumber: 1
          }
        }
      });
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    test("should throw NotFoundException when revision doesn't exist", async () => {
      // Arrange
      mockPrisma.invoice.findUnique.mockResolvedValue({ createdById: "user1" });
      mockPrisma.invoiceRevision.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        revisionService.restoreInvoiceToRevision("invoice1", 999)
      ).rejects.toThrow(NotFoundException);
    });

    test("should throw ValidationException for unauthorized user", async () => {
      // Arrange
      const regularUserService = new RevisionService(mockDatabaseConnection, mockRegularUserContext);
      mockDatabaseConnection.getDatabase.mockReturnValue(mockPrisma as any);
      
      mockPrisma.invoice.findUnique.mockResolvedValue({ createdById: "user1" });

      // Act & Assert
      await expect(
        regularUserService.restoreInvoiceToRevision("invoice1", 1)
      ).rejects.toThrow(ValidationException);
    });
  });

  describe("getRevisionDiff", () => {
    test("should return diff between two revisions", async () => {
      // Arrange
      const fromRevision = {
        fullSnapshot: JSON.stringify({ ...mockInvoiceData, total: 500 })
      };
      const toRevision = {
        fullSnapshot: JSON.stringify({ ...mockInvoiceData, total: 1000 })
      };
      const expectedDiff = { total: [500, 1000] };

      mockPrisma.invoice.findUnique.mockResolvedValue({ createdById: "user1" });
      mockPrisma.invoiceRevision.findUnique
        .mockResolvedValueOnce(fromRevision)
        .mockResolvedValueOnce(toRevision);
      mockDiffPatcher.diff.mockReturnValue(expectedDiff);

      // Act
      const result = await revisionService.getRevisionDiff("invoice1", 1, 2);

      // Assert
      expect(mockPrisma.invoiceRevision.findUnique).toHaveBeenCalledTimes(2);
      expect(mockDiffPatcher.diff).toHaveBeenCalledWith(
        { ...mockInvoiceData, total: 500 },
        { ...mockInvoiceData, total: 1000 }
      );
      expect(result).toEqual(expectedDiff);
    });

    test("should throw NotFoundException when revision doesn't exist", async () => {
      // Arrange
      mockPrisma.invoice.findUnique.mockResolvedValue({ createdById: "user1" });
      mockPrisma.invoiceRevision.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ fullSnapshot: JSON.stringify(mockInvoiceData) });

      // Act & Assert
      await expect(
        revisionService.getRevisionDiff("invoice1", 1, 2)
      ).rejects.toThrow(NotFoundException);
    });

    test("should throw ValidationException for unauthorized user", async () => {
      // Arrange
      const regularUserService = new RevisionService(mockDatabaseConnection, mockRegularUserContext);
      mockDatabaseConnection.getDatabase.mockReturnValue(mockPrisma as any);
      
      mockPrisma.invoice.findUnique.mockResolvedValue({ createdById: "user1" });

      // Act & Assert
      await expect(
        regularUserService.getRevisionDiff("invoice1", 1, 2)
      ).rejects.toThrow(ValidationException);
    });
  });

  describe("authorization", () => {
    test("should throw ValidationException when user context is null", async () => {
      // Arrange
      const serviceWithoutUser = new RevisionService(mockDatabaseConnection, null);

      // Act & Assert
      await expect(
        serviceWithoutUser.getInvoiceRevisions("invoice1")
      ).rejects.toThrow(ValidationException);

      await expect(
        serviceWithoutUser.restoreInvoiceToRevision("invoice1", 1)
      ).rejects.toThrow(ValidationException);

      await expect(
        serviceWithoutUser.getRevisionDiff("invoice1", 1, 2)
      ).rejects.toThrow(ValidationException);
    });
  });
});
