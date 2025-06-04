import { MockProxy, mock } from "vitest-mock-extended";
import { getInvoiceResolvers } from "../../../src/resolvers/invoiceResolvers";
import { InvoiceService } from "../../../src/services/invoice.service";
import { PubSub } from "graphql-subscriptions";
import { GraphQLError } from "graphql";
import {
  Invoice,
  InvoiceCreateArgs,
  GetInvoiceByIdArgs,
  MarkAsPaidArgs,
  InjectedQueryContext,
  UserIdAndRole,
  InvoiceWithCreatedBy,
} from "../../../src/constants/types";
import {
  InternalServerException,
  NotFoundException,
  ValidationException,
} from "../../../src/config/exception.config";
import { beforeEach, describe, it, expect, vi, test } from "vitest";

let invoiceServiceMock: MockProxy<InvoiceService>;
let pubsubMock: MockProxy<PubSub>;
let invoiceResolvers: ReturnType<typeof getInvoiceResolvers>;
let mockContext: MockProxy<InjectedQueryContext>;

beforeEach(() => {
  invoiceServiceMock = mock<InvoiceService>();
  pubsubMock = mock<PubSub>();

  // Create a mock user if necessary
  const mockUser: UserIdAndRole = {
    id: "user1",
    role: "ADMIN",
    username: "user1",
    name: "User One",
  };

  // Initialize the mock context with mocked services and user
  mockContext = mock<InjectedQueryContext>({
    user: mockUser,
    invoiceService: invoiceServiceMock,
    pubsub: pubsubMock,
  });

  invoiceResolvers = getInvoiceResolvers();
});

describe("Query.allInvoices", () => {
  it("should return a list of invoices", async () => {
    const mockInvoices: Invoice[] = [
      {
        id: "1",
        clientAddress: {
          city: "CityA",
          country: "CountryA",
          postCode: "12345",
          street: "Street A",
        },
        clientEmail: "clientA@example.com",
        clientName: "Client A",
        createdAt: "2021-01-01",
        description: "Invoice A",
        items: [],
        paymentDue: "2021-01-15",
        paymentTerms: 14,
        senderAddress: {
          city: "CityB",
          country: "CountryB",
          postCode: "54321",
          street: "Street B",
        },
        status: "pending",
        total: 100.0,
      },
      {
        id: "2",
        clientAddress: {
          city: "CityC",
          country: "CountryC",
          postCode: "67890",
          street: "Street C",
        },
        clientEmail: "clientB@example.com",
        clientName: "Client B",
        createdAt: "2021-02-01",
        description: "Invoice B",
        items: [],
        paymentDue: "2021-02-15",
        paymentTerms: 14,
        senderAddress: {
          city: "CityD",
          country: "CountryD",
          postCode: "09876",
          street: "Street D",
        },
        status: "paid",
        total: 200.0,
      },
    ];

    invoiceServiceMock.getInvoices.mockResolvedValue(mockInvoices);

    // Invoke the resolver with mock context
    const result = await invoiceResolvers.Query.allInvoices(
      {}, // _root
      {}, // _parent
      mockContext, // context
    );

    expect(result).toEqual(mockInvoices);
    expect(invoiceServiceMock.getInvoices).toHaveBeenCalled();
  });

  it("should handle no invoices", async () => {
    invoiceServiceMock.getInvoices.mockResolvedValue([]);

    // Invoke the resolver with mock context
    const result = await invoiceResolvers.Query.allInvoices(
      {}, // _root
      {}, // _parent
      mockContext, // context
    );

    expect(result).toEqual([]);
    expect(invoiceServiceMock.getInvoices).toHaveBeenCalled();
  });

  it("should handle internal server errors", async () => {
    invoiceServiceMock.getInvoices.mockRejectedValue(
      new InternalServerException("Internal server error"),
    );

    await expect(
      invoiceResolvers.Query.allInvoices({}, {}, {}),
    ).rejects.toThrow(GraphQLError);

    try {
      await invoiceResolvers.Query.allInvoices({}, {}, {});
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Failed to retrieve invoices");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });
});

describe("Query.getInvoiceById", () => {
  it("should return the invoice when found", async () => {
    const args: GetInvoiceByIdArgs = { id: "1" };
    const mockInvoice: Invoice = {
      id: "1",
      clientAddress: {
        city: "CityA",
        country: "CountryA",
        postCode: "12345",
        street: "Street A",
      },
      clientEmail: "clientA@example.com",
      clientName: "Client A",
      createdAt: "2021-01-01",
      description: "Invoice A",
      items: [],
      paymentDue: "2021-01-15",
      paymentTerms: 14,
      senderAddress: {
        city: "CityB",
        country: "CountryB",
        postCode: "54321",
        street: "Street B",
      },
      status: "pending",
      total: 100.0,
    };

    invoiceServiceMock.getInvoiceById.mockResolvedValue(mockInvoice);

    // Invoke the resolver with mock context
    const result = await invoiceResolvers.Query.getInvoiceById(
      {}, // _root
      args,
      mockContext, // context
    );

    // console.log(result);

    expect(result).toEqual(mockInvoice);
    expect(invoiceServiceMock.getInvoiceById).toHaveBeenCalledWith(args.id);
  });

  it("should handle NotFoundException", async () => {
    const args: GetInvoiceByIdArgs = { id: "nonexistent" };

    invoiceServiceMock.getInvoiceById.mockRejectedValue(
      new NotFoundException("Invoice not found"),
    );

    await expect(
      invoiceResolvers.Query.getInvoiceById({}, args, mockContext),
    ).rejects.toThrow(GraphQLError);

    try {
      await invoiceResolvers.Query.getInvoiceById({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Invoice not found");
      expect(error.extensions.code).toBe("NOT_FOUND");
    }
  });

  it("should handle internal server errors", async () => {
    const args: GetInvoiceByIdArgs = { id: "1" };

    invoiceServiceMock.getInvoiceById.mockRejectedValue(
      new Error("Database error"),
    );

    await expect(
      invoiceResolvers.Query.getInvoiceById({}, args, mockContext),
    ).rejects.toThrow(GraphQLError);

    try {
      await invoiceResolvers.Query.getInvoiceById({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Failed to retrieve invoice");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });
});

describe("Mutation.addInvoice", () => {
  it("should add a new invoice", async () => {
    const args: InvoiceWithCreatedBy = {
      createdBy: {
        id: "user1",
        role: "ADMIN",
        username: "user1",
        name: "User One",
      },
      createdById: "user1",
      clientAddress: {
        city: "CityE",
        country: "CountryE",
        postCode: "11111",
        street: "Street E",
      },
      clientEmail: "clientE@example.com",
      clientName: "Client E",
      createdAt: "2021-03-01",
      description: "Invoice E",
      id: "5",
      items: [],
      paymentDue: "2021-03-15",
      paymentTerms: 14,
      senderAddress: {
        city: "CityF",
        country: "CountryF",
        postCode: "22222",
        street: "Street F",
      },
      status: "pending",
      total: 150.0,
    };

    const newInvoice: InvoiceWithCreatedBy = {
      ...args,
    };

    invoiceServiceMock.addInvoice.mockResolvedValue(newInvoice as any);

    const result = await invoiceResolvers.Mutation.addInvoice(
      {},
      args as InvoiceCreateArgs,
      mockContext,
    );

    expect(result).toEqual(newInvoice);
    expect(invoiceServiceMock.addInvoice).toHaveBeenCalledWith(args);
    expect(pubsubMock.publish).toHaveBeenCalledWith("INVOICE_ADDED", {
      invoiceAdded: newInvoice,
    });
  });

  it("should handle validation errors", async () => {
    const args: InvoiceCreateArgs = {
      clientAddress: { city: "", country: "", postCode: "", street: "" },
      clientEmail: "",
      clientName: "",
      createdAt: "",
      description: "",
      id: "",
      items: [],
      paymentDue: "",
      paymentTerms: -1,
      senderAddress: { city: "", country: "", postCode: "", street: "" },
      status: "",
      total: -100.0,
    };

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
    const args: InvoiceCreateArgs = {
      clientAddress: {
        city: "CityE",
        country: "CountryE",
        postCode: "11111",
        street: "Street E",
      },
      clientEmail: "clientE@example.com",
      clientName: "Client E",
      createdAt: "2021-03-01",
      description: "Invoice E",
      id: "5",
      items: [],
      paymentDue: "2021-03-15",
      paymentTerms: 14,
      senderAddress: {
        city: "CityF",
        country: "CountryF",
        postCode: "22222",
        street: "Street F",
      },
      status: "pending",
      total: 150.0,
    };

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

describe("Mutation.editInvoice", () => {
  it("should edit an existing invoice", async () => {
    const args: Partial<Invoice> = {
      id: "1",
      total: 200.0,
    };

    const updatedInvoice: Invoice = {
      id: "1",
      clientAddress: {
        city: "CityA",
        country: "CountryA",
        postCode: "12345",
        street: "Street A",
      },
      clientEmail: "clientA@example.com",
      clientName: "Client A",
      createdAt: "2021-01-01",
      description: "Invoice A",
      items: [],
      paymentDue: "2021-01-15",
      paymentTerms: 14,
      senderAddress: {
        city: "CityB",
        country: "CountryB",
        postCode: "54321",
        street: "Street B",
      },
      status: "pending",
      total: 200.0,
    };

    invoiceServiceMock.updateInvoice.mockResolvedValue(updatedInvoice);

    const { id, ...update } = args;

    const result = await invoiceResolvers.Mutation.editInvoice(
      {},
      args,
      mockContext,
    );

    expect(result).toEqual(updatedInvoice);
    expect(invoiceServiceMock.updateInvoice).toHaveBeenCalledWith(id, update);
  });

  it("should handle missing invoice id", async () => {
    const args: Partial<Invoice> = {
      total: 200.0,
    };

    await expect(
      invoiceResolvers.Mutation.editInvoice({}, args, mockContext),
    ).rejects.toThrow(GraphQLError);

    try {
      await invoiceResolvers.Mutation.editInvoice({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Invoice id is required");
      expect(error.extensions.code).toBe("BAD_USER_INPUT");
      expect(error.extensions.invalidArgs).toEqual(args);
    }
  });

  it("should handle internal server errors", async () => {
    const args: Partial<Invoice> = {
      id: "1",
      total: 200.0,
    };

    invoiceServiceMock.updateInvoice.mockRejectedValue(
      new Error("Database error"),
    );

    await expect(
      invoiceResolvers.Mutation.editInvoice({}, args, mockContext),
    ).rejects.toThrow(GraphQLError);

    try {
      await invoiceResolvers.Mutation.editInvoice({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Failed to update invoice");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });
});

describe("Mutation.removeInvoice", () => {
  it("should remove an existing invoice", async () => {
    const args: GetInvoiceByIdArgs = { id: "1" };
    const removedInvoice: Invoice = {
      id: "1",
      clientAddress: {
        city: "CityA",
        country: "CountryA",
        postCode: "12345",
        street: "Street A",
      },
      clientEmail: "clientA@example.com",
      clientName: "Client A",
      createdAt: "2021-01-01",
      description: "Invoice A",
      items: [],
      paymentDue: "2021-01-15",
      paymentTerms: 14,
      senderAddress: {
        city: "CityB",
        country: "CountryB",
        postCode: "54321",
        street: "Street B",
      },
      status: "pending",
      total: 100.0,
    };

    invoiceServiceMock.deleteInvoice.mockResolvedValue(removedInvoice as any);

    const result = await invoiceResolvers.Mutation.removeInvoice(
      {},
      args,
      mockContext,
    );

    expect(result).toEqual(removedInvoice);
    expect(invoiceServiceMock.deleteInvoice).toHaveBeenCalledWith(args.id);
  });

  it("should handle NotFoundException", async () => {
    const args: GetInvoiceByIdArgs = { id: "nonexistent" };

    invoiceServiceMock.deleteInvoice.mockRejectedValue(
      new NotFoundException("Invoice not found"),
    );
    try {
      await invoiceResolvers.Mutation.removeInvoice({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Invoice not found");
      expect(error.extensions.code).toBe("NOT_FOUND");
      expect(error.extensions.invalidArgs).toBe(args.id);
    }
  });

  it("should handle internal server errors", async () => {
    const args: GetInvoiceByIdArgs = { id: "1" };

    invoiceServiceMock.deleteInvoice.mockRejectedValue(
      new Error("Database error"),
    );

    await expect(
      invoiceResolvers.Mutation.removeInvoice({}, args, mockContext),
    ).rejects.toThrow(GraphQLError);

    try {
      await invoiceResolvers.Mutation.removeInvoice({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Invoice could not be removed");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });
});

describe("Mutation.markAsPaid", () => {
  it("should mark an invoice as paid", async () => {
    const args: MarkAsPaidArgs = { id: "1" };
    const updatedInvoice: Invoice = {
      id: "1",
      clientAddress: {
        city: "CityA",
        country: "CountryA",
        postCode: "12345",
        street: "Street A",
      },
      clientEmail: "clientA@example.com",
      clientName: "Client A",
      createdAt: "2021-01-01",
      description: "Invoice A",
      items: [],
      paymentDue: "2021-01-15",
      paymentTerms: 14,
      senderAddress: {
        city: "CityB",
        country: "CountryB",
        postCode: "54321",
        street: "Street B",
      },
      status: "paid",
      total: 100.0,
    };

    invoiceServiceMock.markAsPaid.mockResolvedValue(updatedInvoice as any);

    const result = await invoiceResolvers.Mutation.markAsPaid(
      {},
      args,
      mockContext,
    );

    expect(result).toEqual(updatedInvoice);
    expect(invoiceServiceMock.markAsPaid).toHaveBeenCalledWith(args.id);
  });

  it("should handle NotFoundException", async () => {
    const args: MarkAsPaidArgs = { id: "nonexistent" };

    invoiceServiceMock.markAsPaid.mockRejectedValue(
      new NotFoundException("Invoice not found"),
    );

    await expect(
      invoiceResolvers.Mutation.markAsPaid({}, args, mockContext),
    ).rejects.toThrow(GraphQLError);

    try {
      await invoiceResolvers.Mutation.markAsPaid({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Invoice not found");
      expect(error.extensions.code).toBe("NOT_FOUND");
      expect(error.extensions.invalidArgs).toBe(args.id);
    }
  });

  it("should handle internal server errors", async () => {
    const args: MarkAsPaidArgs = { id: "1" };

    invoiceServiceMock.markAsPaid.mockRejectedValue(
      new Error("Database error"),
    );

    await expect(
      invoiceResolvers.Mutation.markAsPaid({}, args, mockContext),
    ).rejects.toThrow(GraphQLError);

    try {
      await invoiceResolvers.Mutation.markAsPaid({}, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Invoice could not be marked as paid");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });
});

describe("Subscription.invoiceAdded", () => {
  it("should subscribe to invoiceAdded events", async () => {
    const asyncIteratorMock = {
      next: vi.fn(),
      return: vi.fn(),
      throw: vi.fn(),
      [Symbol.asyncIterator]: function () {
        return this;
      },
    };

    pubsubMock.asyncIterator.mockReturnValue(asyncIteratorMock);

    const result = await invoiceResolvers.Subscription.invoiceAdded.subscribe(
      undefined as never,
      undefined as never,
      mockContext,
    );

    expect(result).toBe(asyncIteratorMock);
    expect(pubsubMock.asyncIterator).toHaveBeenCalledWith("INVOICE_ADDED");
  });
});
