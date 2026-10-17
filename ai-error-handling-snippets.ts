
// 1. invoice-backend/src/config/exception.config.ts

export class BaseException extends Error {
  public statusCode: number;

  constructor(type: string, statusCode: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = type;
    this.statusCode = statusCode;
  }
}

export class InternalServerException extends BaseException {
  constructor(message: string) {
    super("InternalServerException", 500, message);
  }
}

export class NotFoundException extends BaseException {
  constructor(message: string) {
    super("NotFoundException", 404, message);
  }
}

export class BadRequestException extends BaseException {
  constructor(message: string) {
    super("BadRequestException", 400, message);
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message: string) {
    super("UnauthorizedException", 401, message);
  }
}

export class ForbiddenException extends BaseException {
  constructor(message: string) {
    super("ForbiddenException", 403, message);
  }
}

export class ValidationException extends BaseException {
  constructor(message: string) {
    super("ValidationException", 400, message);
  }
}

// 2. invoice-backend/src/services/invoice.service.ts

class InvoiceServiceSnippet {
  addInvoice = async (invoice: Invoice) => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    try {
      const invoiceWithUserInfo = {
        ...invoice,
        createdById: this.userContext.id,
        createdBy: {
          id: this.userContext.id,
          name: this.userContext.name,
          username: this.userContext.username ?? "",
          role: this.userContext.role,
        },
      };

      const fullInvoice = mapPartialInvoiceToInvoice(invoiceWithUserInfo);
      const createdInvoice = await this.invoiceRepo.create(fullInvoice);
      const validatedData = validateInvoiceData(createdInvoice);

      return validatedData;
    } catch (e) {
      this.logger.error(String(e));
      if (e instanceof ValidationException) {
        throw e;
      } else if (e instanceof NotFoundException) {
        throw e;
      } else {
        throw new InternalServerException("Internal server error");
      }
    }
  };

  getInvoiceById = async (
    invoiceId: string,
  ): Promise<Partial<Invoice> | null> => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }
    const { role, id } = this.userContext;

    if (!id || !role) {
      throw new ValidationException("Unauthorized");
    }

    if (role === "ADMIN") {
      try {
        const result = await this.invoiceRepo.findById(invoiceId);
        if (!result) {
          this.logger.error("role = ADMIN - Invoice not found");
          throw new NotFoundException("Invoice not found");
        }
        return result;
      } catch (e) {
        this.logger.error(String(e));
        if (e instanceof ValidationException) {
          throw e;
        }
        if (e instanceof NotFoundException) {
          throw e;
        }
        throw new InternalServerException("Internal server error");
      }
    } else {
      try {
        const result = await this.invoiceRepo.findByUserIdAndInvoiceId(
          id,
          role,
          invoiceId,
        );
        if (!result) {
          this.logger.error("role = USER - Invoice not found");
          throw new NotFoundException("Invoice not found");
        }
        return result;
      } catch (e) {
        this.logger.error(String(e));
        if (e instanceof ValidationException) {
          throw e;
        }
        if (e instanceof NotFoundException) {
          throw e;
        }
        throw new InternalServerException("Internal server error");
      }
    }
  };

  markAsPaid = async (id: string) => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }
    try {
      const result = await this.invoiceRepo.markAsPaid(id);
      return validateInvoiceData(result);
    } catch (e) {
      this.logger.error(String(e));
      if (e instanceof ValidationException) {
        throw e;
      }
      throw new InternalServerException("Internal server error");
    }
  };

  private userContext: any;
  private invoiceRepo: any;
  private logger: any;
}

// 3. invoice-backend/src/resolvers/invoiceResolvers.ts

export const invoiceResolverSnippets = {
  addInvoice: async (
    _root: object,
    args: InvoiceCreateArgs,
    context: InjectedQueryContext,
  ) => {
    const { invoiceService, pubsub } = context;
    if (!invoiceService || !pubsub) {
      throw new GraphQLError("Internal server error", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
    try {
      const newInvoice = await invoiceService.addInvoice(args);
      await pubsub.publish("INVOICE_ADDED", { invoiceAdded: newInvoice });
      return newInvoice;
    } catch (error) {
      getLogger().error(String(error));
      throw new GraphQLError("Failed to add invoice", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  },

  getInvoiceById: async (
    _root: object,
    args: GetInvoiceByIdArgs,
    context: InjectedQueryContext,
  ) => {
    const { invoiceService } = context;
    if (!invoiceService) {
      throw new GraphQLError(
        "Internal server error: invoiceService doesn't exist",
        {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        },
      );
    }
    try {
      const result = await invoiceService.getInvoiceById(args.id);
      if (!result) {
        throw new NotFoundException("Invoice not found");
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }
      getLogger().error(String(error));
      throw new GraphQLError("Failed to retrieve invoice", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  },

  markAsPaid: async (
    _root: unknown,
    args: MarkAsPaidArgs,
    context: InjectedQueryContext,
  ) => {
    const { invoiceService } = context;
    if (!invoiceService) {
      throw new GraphQLError("Internal server error", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
    try {
      const result = await invoiceService.markAsPaid(args.id);
      return result;
    } catch (error) {
      getLogger().error(String(error));
      if (error instanceof NotFoundException) {
        throw new GraphQLError("Invoice not found", {
          extensions: {
            code: "NOT_FOUND",
            invalidArgs: args.id,
          },
        });
      }
      throw new GraphQLError("Invoice could not be marked as paid", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  },
};

// 4. invoice-frontend/src/features/invoices/hooks/useAddInvoice.ts

export const useAddInvoiceSnippet = () => {
  const { setIsNewInvoiceOpen } = useNewInvoiceContext();
  const [addInvoice] = useMutation(ADD_INVOICE, {
    refetchQueries: [{ query: ALL_INVOICES }],

    onError: (error) => {
      toast.error(error.message || "Failed to add invoice. Please try again.");
    },
    onCompleted: () => {
      toast.success("Invoice created successfully!");
      // Ensure any modal/sidebar is closed once the mutation succeeds
      setIsNewInvoiceOpen(false);
    },
  });
  const handleAddInvoice = async (data: Invoice) => {
    try {
      await addInvoice({
        variables: {
          ...data,
        },
      });
    } catch (error) {
      // Error already handled by onError callback
      // Just log for debugging if needed
      if (import.meta.env.DEV) {
        console.error(error);
      }
    }
  };

  return {
    handleAddInvoice,
  };
};

// 5. Existing resolver test style

import { MockProxy, mock, mockDeep } from "vitest-mock-extended";
import { getInvoiceResolvers } from "../../../src/resolvers/invoiceResolvers";
import { InvoiceService } from "../../../src/services/invoice.service";
import { PubSub } from "graphql-subscriptions";
import { GraphQLError } from "graphql";
import { beforeEach, describe, it, expect, vi, test } from "vitest";

let invoiceServiceMock: MockProxy<InvoiceService>;
let pubsubMock: MockProxy<PubSub>;
let invoiceResolvers: ReturnType<typeof getInvoiceResolvers>;
let mockContext: MockProxy<InjectedQueryContext>;

beforeEach(() => {
  invoiceServiceMock = mock<InvoiceService>();
  pubsubMock = mock<PubSub>();

  const mockUser: UserIdAndRole = {
    id: "user1",
    role: "ADMIN",
    username: "user1",
    name: "User One",
  };

  mockContext = mock<InjectedQueryContext>({
    user: mockUser,
    invoiceService: invoiceServiceMock,
    pubsub: pubsubMock,
  });

  invoiceResolvers = getInvoiceResolvers();
});

describe("Mutation.addInvoice", () => {
  it("should handle validation errors", async () => {
    const validationError = new ValidationException("Invalid invoice data");

    invoiceServiceMock.addInvoice.mockRejectedValue(validationError);

    await expect(
      invoiceResolvers.Mutation.addInvoice({}, args, mockContext),
    ).rejects.toThrow(GraphQLError);

    try {
      await invoiceResolvers.Mutation.addInvoice({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Failed to add invoice");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });

  it("should handle internal server errors", async () => {
    invoiceServiceMock.addInvoice.mockRejectedValue(
      new Error("Database error"),
    );

    await expect(
      invoiceResolvers.Mutation.addInvoice({}, args, mockContext),
    ).rejects.toThrow(GraphQLError);

    try {
      await invoiceResolvers.Mutation.addInvoice({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Failed to add invoice");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });
});

// 6. Existing frontend hook test style

import { cleanup } from "@testing-library/react-hooks";
import { afterEach, Mock } from "vitest";
import { act } from "react";
import { useAddInvoice } from "../../../src/features/invoices/hooks/useAddInvoice";
import { useMutation } from "@apollo/client";
import { renderHook } from "@testing-library/react";

vi.mock("@/features/invoices/forms/NewInvoiceContextProvider.tsx", () => ({
  useNewInvoiceContext: () => ({
    setIsNewInvoiceOpen: vi.fn(),
  }),
}));

vi.mock("@apollo/client", () => ({
  useMutation: vi.fn(),
  gql: vi.fn(),
}));

describe("useAddInvoice hook", () => {
  const addInvoiceMock = vi.fn();

  beforeEach(() => {
    addInvoiceMock.mockReset();
    (useMutation as unknown as Mock).mockReturnValue([addInvoiceMock]);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should log errors when addInvoice rejects", async () => {
    const error = new Error("Test error");
    addInvoiceMock.mockRejectedValue(error);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useAddInvoice());

    await act(async () => {
      await result.current.handleAddInvoice(sampleInvoice);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    consoleErrorSpy.mockRestore();
  });
});
