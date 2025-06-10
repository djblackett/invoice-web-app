import { MockProxy, mock } from "vitest-mock-extended";
import { getRevisionResolvers } from "@/resolvers/revisionResolvers";
import { RevisionService } from "@/services/revision.service";
import { GraphQLError } from "graphql";
import { InjectedQueryContext, UserIdAndRole } from "@/constants/types";
import { NotFoundException, ValidationException } from "@/config/exception.config";
import { beforeEach, describe, it, expect } from "vitest";

let revisionServiceMock: MockProxy<RevisionService>;
let revisionResolvers: ReturnType<typeof getRevisionResolvers>;
let mockContext: MockProxy<InjectedQueryContext>;

beforeEach(() => {
  revisionServiceMock = mock<RevisionService>();

  const mockUser: UserIdAndRole = {
    id: "user1",
    role: "ADMIN",
    username: "user1",
    name: "User One",
  };

  mockContext = mock<InjectedQueryContext>({
    user: mockUser,
    revisionService: revisionServiceMock,
  });

  revisionResolvers = getRevisionResolvers();
});

describe("Query.getInvoiceRevisions", () => {
  it("should return revisions", async () => {
    const args = { invoiceId: "inv1" };
    const mockRevisions = [{ id: "rev1", createdAt: new Date().toISOString() }];
    revisionServiceMock.getInvoiceRevisions.mockResolvedValue(mockRevisions as any);

    const result = await revisionResolvers.Query.getInvoiceRevisions({}, args, mockContext);

    expect(result).toEqual(mockRevisions);
  });

  it("should handle NotFoundException", async () => {
    const args = { invoiceId: "inv1" };
    revisionServiceMock.getInvoiceRevisions.mockRejectedValue(new NotFoundException("Not found"));

    await expect(revisionResolvers.Query.getInvoiceRevisions({}, args, mockContext)).rejects.toThrow(GraphQLError);
  });
});

describe("Query.getRevisionDiff", () => {
  it("should return diff", async () => {
    const args = { invoiceId: "inv1", fromRevision: 1, toRevision: 2 };
    revisionServiceMock.getRevisionDiff.mockResolvedValue({ diff: true });

    const result = await revisionResolvers.Query.getRevisionDiff({}, args, mockContext);

    expect(result.diff).toBe(JSON.stringify({ diff: true }));
  });
});

describe("Mutation.restoreInvoiceToRevision", () => {
  it("should restore invoice", async () => {
    const args = { invoiceId: "inv1", revisionNumber: 1 };
    revisionServiceMock.restoreInvoiceToRevision.mockResolvedValue({ id: "inv1" });

    const result = await revisionResolvers.Mutation.restoreInvoiceToRevision({}, args, mockContext);

    expect(result).toEqual({ id: "inv1" });
  });
});
