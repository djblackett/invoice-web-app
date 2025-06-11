import { MockProxy, mock } from "vitest-mock-extended";
import { getRevisionResolvers, GetInvoiceRevisionsArgs, GetRevisionDiffArgs, RestoreInvoiceArgs } from "../../../src/resolvers/revisionResolvers";
import { RevisionService } from "../../../src/services/revision.service";
import { GraphQLError } from "graphql";
import { InjectedQueryContext, UserIdAndRole } from "../../../src/constants/types";
import { NotFoundException, ValidationException } from "../../../src/config/exception.config";
import { beforeEach, describe, it, expect, vi, test } from "vitest";

let revisionServiceMock: MockProxy<RevisionService>;
let revisionResolvers: ReturnType<typeof getRevisionResolvers>;
let mockContext: MockProxy<InjectedQueryContext>;

const mockUser: UserIdAndRole = {
  id: "user1",
  role: "ADMIN",
  username: "admin@test.com",
  name: "Admin User",
};

const mockRevisionData = {
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
  fullSnapshot: {
    id: "invoice1",
    description: "Test Invoice",
    total: 1000
  }
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
  items: [],
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
  },
  createdBy: {
    id: "user1",
    username: "admin@test.com",
    name: "Admin User",
    role: "ADMIN"
  }
};

beforeEach(() => {
  revisionServiceMock = mock<RevisionService>();
  
  mockContext = mock<InjectedQueryContext>({
    user: mockUser,
    revisionService: revisionServiceMock,
  });

  revisionResolvers = getRevisionResolvers();
});

describe("Query.getInvoiceRevisions", () => {
  test("should return list of invoice revisions", async () => {
    // Arrange
    const args: GetInvoiceRevisionsArgs = {
      invoiceId: "invoice1"
    };

    const mockRevisions = [mockRevisionData];
    revisionServiceMock.getInvoiceRevisions.mockResolvedValue(mockRevisions);

    // Act
    const result = await revisionResolvers.Query.getInvoiceRevisions(
      {},
      args,
      mockContext
    );

    // Assert
    expect(revisionServiceMock.getInvoiceRevisions).toHaveBeenCalledWith("invoice1", undefined);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      ...mockRevisionData,
      createdAt: mockRevisionData.createdAt.toISOString(),
      jsonDiff: null,
      fullSnapshot: JSON.stringify(mockRevisionData.fullSnapshot)
    });
  });

  test("should return filtered invoice revisions", async () => {
    // Arrange
    const args: GetInvoiceRevisionsArgs = {
      invoiceId: "invoice1",
      filters: {
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        userId: "user1",
        changeType: "update"
      }
    };

    const mockRevisions = [mockRevisionData];
    revisionServiceMock.getInvoiceRevisions.mockResolvedValue(mockRevisions);

    // Act
    const result = await revisionResolvers.Query.getInvoiceRevisions(
      {},
      args,
      mockContext
    );

    // Assert
    expect(revisionServiceMock.getInvoiceRevisions).toHaveBeenCalledWith("invoice1", {
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      userId: "user1",
      changeType: "update"
    });
    expect(result).toHaveLength(1);
  });

  test("should handle revisions with jsonDiff", async () => {
    // Arrange
    const args: GetInvoiceRevisionsArgs = {
      invoiceId: "invoice1"
    };

    const revisionWithDiff = {
      ...mockRevisionData,
      jsonDiff: { total: [500, 1000] }
    };

    revisionServiceMock.getInvoiceRevisions.mockResolvedValue([revisionWithDiff]);

    // Act
    const result = await revisionResolvers.Query.getInvoiceRevisions(
      {},
      args,
      mockContext
    );

    // Assert
    expect(result[0].jsonDiff).toBe(JSON.stringify({ total: [500, 1000] }));
  });

  test("should throw GraphQLError when revisionService is missing", async () => {
    // Arrange
    const args: GetInvoiceRevisionsArgs = {
      invoiceId: "invoice1"
    };

    const contextWithoutService = mock<InjectedQueryContext>({
      user: mockUser,
      revisionService: undefined,
    });

    // Act & Assert
    await expect(
      revisionResolvers.Query.getInvoiceRevisions({}, args, contextWithoutService)
    ).rejects.toThrow(GraphQLError);

    try {
      await revisionResolvers.Query.getInvoiceRevisions({}, args, contextWithoutService);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Internal server error: revisionService doesn't exist");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });

  test("should handle NotFoundException", async () => {
    // Arrange
    const args: GetInvoiceRevisionsArgs = {
      invoiceId: "nonexistent"
    };

    revisionServiceMock.getInvoiceRevisions.mockRejectedValue(
      new NotFoundException("Invoice not found")
    );

    // Act & Assert
    await expect(
      revisionResolvers.Query.getInvoiceRevisions({}, args, mockContext)
    ).rejects.toThrow(GraphQLError);

    try {
      await revisionResolvers.Query.getInvoiceRevisions({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Invoice not found");
      expect(error.extensions.code).toBe("NOT_FOUND");
    }
  });

  test("should handle ValidationException", async () => {
    // Arrange
    const args: GetInvoiceRevisionsArgs = {
      invoiceId: "invoice1"
    };

    revisionServiceMock.getInvoiceRevisions.mockRejectedValue(
      new ValidationException("Unauthorized")
    );

    // Act & Assert
    await expect(
      revisionResolvers.Query.getInvoiceRevisions({}, args, mockContext)
    ).rejects.toThrow(GraphQLError);

    try {
      await revisionResolvers.Query.getInvoiceRevisions({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Unauthorized");
      expect(error.extensions.code).toBe("UNAUTHORIZED");
    }
  });

  test("should handle internal server errors", async () => {
    // Arrange
    const args: GetInvoiceRevisionsArgs = {
      invoiceId: "invoice1"
    };

    revisionServiceMock.getInvoiceRevisions.mockRejectedValue(
      new Error("Database error")
    );

    // Act & Assert
    await expect(
      revisionResolvers.Query.getInvoiceRevisions({}, args, mockContext)
    ).rejects.toThrow(GraphQLError);

    try {
      await revisionResolvers.Query.getInvoiceRevisions({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Failed to retrieve invoice revisions");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });
});

describe("Query.getRevisionDiff", () => {
  test("should return diff between two revisions", async () => {
    // Arrange
    const args: GetRevisionDiffArgs = {
      invoiceId: "invoice1",
      fromRevision: 1,
      toRevision: 2
    };

    const mockDiff = { total: [500, 1000] };
    revisionServiceMock.getRevisionDiff.mockResolvedValue(mockDiff);

    // Act
    const result = await revisionResolvers.Query.getRevisionDiff(
      {},
      args,
      mockContext
    );

    // Assert
    expect(revisionServiceMock.getRevisionDiff).toHaveBeenCalledWith("invoice1", 1, 2);
    expect(result).toEqual({
      fromRevision: 1,
      toRevision: 2,
      diff: JSON.stringify(mockDiff)
    });
  });

  test("should throw GraphQLError when revisionService is missing", async () => {
    // Arrange
    const args: GetRevisionDiffArgs = {
      invoiceId: "invoice1",
      fromRevision: 1,
      toRevision: 2
    };

    const contextWithoutService = mock<InjectedQueryContext>({
      user: mockUser,
      revisionService: undefined,
    });

    // Act & Assert
    await expect(
      revisionResolvers.Query.getRevisionDiff({}, args, contextWithoutService)
    ).rejects.toThrow(GraphQLError);

    try {
      await revisionResolvers.Query.getRevisionDiff({}, args, contextWithoutService);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Internal server error: revisionService doesn't exist");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });

  test("should handle NotFoundException", async () => {
    // Arrange
    const args: GetRevisionDiffArgs = {
      invoiceId: "invoice1",
      fromRevision: 1,
      toRevision: 999
    };

    revisionServiceMock.getRevisionDiff.mockRejectedValue(
      new NotFoundException("One or both revisions not found")
    );

    // Act & Assert
    await expect(
      revisionResolvers.Query.getRevisionDiff({}, args, mockContext)
    ).rejects.toThrow(GraphQLError);

    try {
      await revisionResolvers.Query.getRevisionDiff({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("One or both revisions not found");
      expect(error.extensions.code).toBe("NOT_FOUND");
    }
  });

  test("should handle ValidationException", async () => {
    // Arrange
    const args: GetRevisionDiffArgs = {
      invoiceId: "invoice1",
      fromRevision: 1,
      toRevision: 2
    };

    revisionServiceMock.getRevisionDiff.mockRejectedValue(
      new ValidationException("Unauthorized")
    );

    // Act & Assert
    await expect(
      revisionResolvers.Query.getRevisionDiff({}, args, mockContext)
    ).rejects.toThrow(GraphQLError);

    try {
      await revisionResolvers.Query.getRevisionDiff({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Unauthorized");
      expect(error.extensions.code).toBe("UNAUTHORIZED");
    }
  });

  test("should handle internal server errors", async () => {
    // Arrange
    const args: GetRevisionDiffArgs = {
      invoiceId: "invoice1",
      fromRevision: 1,
      toRevision: 2
    };

    revisionServiceMock.getRevisionDiff.mockRejectedValue(
      new Error("Database error")
    );

    // Act & Assert
    await expect(
      revisionResolvers.Query.getRevisionDiff({}, args, mockContext)
    ).rejects.toThrow(GraphQLError);

    try {
      await revisionResolvers.Query.getRevisionDiff({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Failed to get revision diff");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });
});

describe("Mutation.restoreInvoiceToRevision", () => {
  test("should restore invoice to specified revision", async () => {
    // Arrange
    const args: RestoreInvoiceArgs = {
      invoiceId: "invoice1",
      revisionNumber: 1
    };

    revisionServiceMock.restoreInvoiceToRevision.mockResolvedValue(mockInvoiceData);

    // Act
    const result = await revisionResolvers.Mutation.restoreInvoiceToRevision(
      {},
      args,
      mockContext
    );

    // Assert
    expect(revisionServiceMock.restoreInvoiceToRevision).toHaveBeenCalledWith("invoice1", 1);
    expect(result).toEqual(mockInvoiceData);
  });

  test("should throw GraphQLError when revisionService is missing", async () => {
    // Arrange
    const args: RestoreInvoiceArgs = {
      invoiceId: "invoice1",
      revisionNumber: 1
    };

    const contextWithoutService = mock<InjectedQueryContext>({
      user: mockUser,
      revisionService: undefined,
    });

    // Act & Assert
    await expect(
      revisionResolvers.Mutation.restoreInvoiceToRevision({}, args, contextWithoutService)
    ).rejects.toThrow(GraphQLError);

    try {
      await revisionResolvers.Mutation.restoreInvoiceToRevision({}, args, contextWithoutService);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Internal server error: revisionService doesn't exist");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });

  test("should handle NotFoundException", async () => {
    // Arrange
    const args: RestoreInvoiceArgs = {
      invoiceId: "nonexistent",
      revisionNumber: 1
    };

    revisionServiceMock.restoreInvoiceToRevision.mockRejectedValue(
      new NotFoundException("Invoice not found")
    );

    // Act & Assert
    await expect(
      revisionResolvers.Mutation.restoreInvoiceToRevision({}, args, mockContext)
    ).rejects.toThrow(GraphQLError);

    try {
      await revisionResolvers.Mutation.restoreInvoiceToRevision({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Invoice not found");
      expect(error.extensions.code).toBe("NOT_FOUND");
    }
  });

  test("should handle ValidationException", async () => {
    // Arrange
    const args: RestoreInvoiceArgs = {
      invoiceId: "invoice1",
      revisionNumber: 1
    };

    revisionServiceMock.restoreInvoiceToRevision.mockRejectedValue(
      new ValidationException("Unauthorized")
    );

    // Act & Assert
    await expect(
      revisionResolvers.Mutation.restoreInvoiceToRevision({}, args, mockContext)
    ).rejects.toThrow(GraphQLError);

    try {
      await revisionResolvers.Mutation.restoreInvoiceToRevision({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Unauthorized");
      expect(error.extensions.code).toBe("UNAUTHORIZED");
    }
  });

  test("should handle internal server errors", async () => {
    // Arrange
    const args: RestoreInvoiceArgs = {
      invoiceId: "invoice1",
      revisionNumber: 1
    };

    revisionServiceMock.restoreInvoiceToRevision.mockRejectedValue(
      new Error("Database error")
    );

    // Act & Assert
    await expect(
      revisionResolvers.Mutation.restoreInvoiceToRevision({}, args, mockContext)
    ).rejects.toThrow(GraphQLError);

    try {
      await revisionResolvers.Mutation.restoreInvoiceToRevision({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Failed to restore invoice to revision");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });
});

describe("Edge cases and error handling", () => {
  test("should handle empty revision list", async () => {
    // Arrange
    const args: GetInvoiceRevisionsArgs = {
      invoiceId: "invoice1"
    };

    revisionServiceMock.getInvoiceRevisions.mockResolvedValue([]);

    // Act
    const result = await revisionResolvers.Query.getInvoiceRevisions(
      {},
      args,
      mockContext
    );

    // Assert
    expect(result).toEqual([]);
  });

  test("should handle null diff result", async () => {
    // Arrange
    const args: GetRevisionDiffArgs = {
      invoiceId: "invoice1",
      fromRevision: 1,
      toRevision: 2
    };

    revisionServiceMock.getRevisionDiff.mockResolvedValue(null);

    // Act
    const result = await revisionResolvers.Query.getRevisionDiff(
      {},
      args,
      mockContext
    );

    // Assert
    expect(result).toEqual({
      fromRevision: 1,
      toRevision: 2,
      diff: "null"
    });
  });

  test("should handle partial filters", async () => {
    // Arrange
    const args: GetInvoiceRevisionsArgs = {
      invoiceId: "invoice1",
      filters: {
        startDate: "2024-01-01",
        changeType: "update"
        // endDate and userId not provided
      }
    };

    revisionServiceMock.getInvoiceRevisions.mockResolvedValue([]);

    // Act
    await revisionResolvers.Query.getInvoiceRevisions(
      {},
      args,
      mockContext
    );

    // Assert
    expect(revisionServiceMock.getInvoiceRevisions).toHaveBeenCalledWith("invoice1", {
      startDate: new Date("2024-01-01"),
      changeType: "update"
    });
  });
});
