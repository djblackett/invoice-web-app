import "reflect-metadata";
import { beforeEach, describe, expect, test, vi } from "vitest";
import prisma from "../../libs/__mocks__/prisma";
import {
  prismaErrorHandler,
  PrismaInvoiceRepository,
} from "../../src/repositories/implementations/prismaInvoiceRepository";
import { DatabaseConnectionMock } from "./database.connection.mock";
import { IDatabaseConnection } from "../../src/database/database.connection";
import { Invoice } from "@prisma/client";
import {
  Invoice as DomainInvoice,
  InvoiceWithCreatedBy,
} from "../../src/constants/types";
import {
  Decimal,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";
import { PrismaUserRepository } from "@/repositories/implementations/prismaUserRepo";
import { send } from "process";

vi.mock("../../libs/prisma");

const mockInvoiceParams: InvoiceWithCreatedBy = {
  id: "D64FUO",
  createdAt: "2021-08-21",
  createdBy: {
    id: "user1",
    name: "John Doe",
    username: "john@melba.toast",
    role: "USER",
  },
  createdById: "user1",
  paymentDue: "2021-09-20",
  description: "Graphic Design",
  paymentTerms: 30,
  clientName: "Alex Grim",
  clientEmail: "alexgrim@mail.com",
  status: "pending",
  senderAddress: {
    street: "19 Union Terrace",
    city: "London",
    postCode: "E1 3EZ",
    country: "United Kingdom",
  },
  clientAddress: {
    street: "84 Church Way",
    city: "Bradford",
    postCode: "BD1 9PB",
    country: "United Kingdom",
  },
  senderAddressId: "4",
  clientAddressId: "1",
  items: [
    {
      id: "gjhgjhgjhg",
      name: "Banner Design",
      quantity: 1,
      price: 156,
      total: 156,
    },
    {
      name: "Email Design",
      quantity: 2,
      price: 200,
      total: 400,
      id: "hgfdyrdyi456t",
    },
  ],
  total: 556.0,
};

const mockInvoicePrismaResponse = {
  id: "D64FUO",
  createdAt: "2021-08-21",
  createdBy: {
    id: "user1",
    name: "John Doe",
    username: "john@melba.toast",
    role: "USER",
  },
  // createdById: "user1",
  paymentDue: "2021-09-20",
  description: "Graphic Design",
  paymentTerms: 30,
  clientName: "Alex Grim",
  clientEmail: "alexgrim@mail.com",
  status: "pending",
  // senderAddressId: 4,
  // clientAddressId: 1,
  senderAddress: {
    street: "19 Union Terrace",
    city: "London",
    postCode: "E1 3EZ",
    country: "United Kingdom",
  },
  clientAddress: {
    street: "84 Church Way",
    city: "Bradford",
    postCode: "BD1 9PB",
    country: "United Kingdom",
  },
  items: [
    {
      name: "Banner Design",
      quantity: 1,
      price: 156,
      total: 156,
    },
    {
      name: "Email Design",
      quantity: 2,
      price: 200,
      total: 400,
    },
  ],
  total: 100.5,
};

const mockResponseWithIds = {
  ...mockInvoicePrismaResponse,
  createdBy: {
    id: "user1",
    name: "John Doe",
    username: "john@melba.toast",
    role: "USER",
  },
  clientAddressId: 1,
  senderAddressId: 4,
  total: new Decimal(mockInvoicePrismaResponse.total),
};

const mockRepo = new PrismaInvoiceRepository(
  new DatabaseConnectionMock() as IDatabaseConnection,
);

const mockUserRepo = new PrismaUserRepository(
  new DatabaseConnectionMock() as IDatabaseConnection,
);

describe("Prisma Query: createInvoice", () => {
  beforeEach(async () => {
    prisma.user.create.mockResolvedValue({
      id: "user1",
      name: "John Doe",
      username: "john@melba.toast",
      role: "USER",
      passwordHash: "password",
    });

    // Mock the user retrieval (e.g., findUnique or findFirst)
    prisma.user.findUnique.mockResolvedValue({
      id: "user1",
      name: "John Doe",
      username: "user1@moo.com",
      role: "USER",
      passwordHash: "password",
    });

    const user = {
      id: "user1",
      role: "USER",
      username: "user1@moo.com",
      name: "John Doe",
      passwordHash: "password",
    };

    await mockUserRepo.createUser({ ...user });
  });

  test("should return invoice object with matching properties", async () => {
    prisma.invoice.create.mockResolvedValue({
      ...mockInvoicePrismaResponse,
      total: new Decimal(mockInvoicePrismaResponse.total),
    });

    prisma.user.create.mockResolvedValue({
      id: "user1",
      name: "John Doe",
      username: "john@melba.toast",
      role: "USER",
      passwordHash: "password",
    });

    // Mock the user retrieval (e.g., findUnique or findFirst)
    prisma.user.findUnique.mockResolvedValue({
      id: "user1",
      name: "John Doe",
      username: "user1@moo.com",
      role: "USER",
      passwordHash: "password",
    });

    const user = {
      id: "user1",
      role: "USER",
      username: "user1@moo.com",
      name: "John Doe",
      passwordHash: "password",
    };

    await mockUserRepo.createUser({ ...user });
    const createdInvoice = await mockRepo.create(mockInvoiceParams);

    expect(createdInvoice).toStrictEqual(mockInvoicePrismaResponse);
  });

  test("should throw error when invoice ID already exists", async () => {
    // Mock the implementation to throw a unique ID error
    prisma.invoice.create.mockRejectedValue(
      new PrismaClientKnownRequestError(
        "Unique constraint failed on the fields: (`id`)",
        {
          code: "P2002",
          clientVersion: "5.19.1",
        },
      ),
    );

    // Expect the create method to reject with the correct error
    await expect(mockRepo.create(mockInvoiceParams)).rejects.toThrow();
    await expect(mockRepo.create(mockInvoiceParams)).rejects.toThrowError(
      /Unique constraint failed on the fields: \(`id`\)/,
    );
  });

  test("should throw error: Failed to create invoice", async () => {
    // Mock the implementation to throw a specific error once
    prisma.invoice.create.mockImplementation(() => {
      throw new Error("Failed to create invoice");
    });

    // Expect the create method to reject with the correct error
    await expect(mockRepo.create(mockInvoiceParams)).rejects.toThrowError(
      "Failed to create invoice",
    );
  });

  // Cannot figure our proper types for this with Prisma's autogenerated types
  test("should create an invoice with missing optional fields", async () => {
    // Create incomplete invoice params by omitting `clientEmail`
    const incompleteInvoiceParams: Partial<DomainInvoice> = {
      ...mockInvoiceParams,
      total: new Decimal(mockInvoicePrismaResponse.total),
      clientEmail: undefined,
    };

    // The expected response should match the default value set by the `create` method
    const expectedResponse: Partial<Invoice> = {
      ...mockInvoicePrismaResponse,
      total: Number(mockInvoicePrismaResponse.total),
      clientEmail: "", // `create` method sets it to an empty string if undefined
    };

    // Mock the `prisma.invoice.create` method to return the expected response
    prisma.invoice.create.mockResolvedValue(
      expectedResponse as unknown as Invoice,
    );

    // Call the `create` method of the repository
    const createdInvoice = await mockRepo.create(incompleteInvoiceParams);

    // Validate that the `clientEmail` was set to an empty string
    expect((createdInvoice as Invoice).clientEmail).toBe("");
    // Ensure the entire object matches the expected response
    expect(createdInvoice).toStrictEqual(expectedResponse);
  });
});

describe("Prisma Query: findAll", () => {
  test("should return an array of invoices", async () => {
    const mockInvoices: Invoice[] = [
      {
        ...mockResponseWithIds,
        id: "D64FUO",
      },
      {
        ...mockResponseWithIds,
        id: "D64FUP",
      },
    ];

    prisma.invoice.findMany.mockResolvedValue(mockInvoices);

    const invoices = await mockRepo.findAll();

    expect(invoices).toStrictEqual(mockInvoices);
  });

  test("should return an empty array if no invoices are found", async () => {
    prisma.invoice.findMany.mockResolvedValue([]);

    const invoices = await mockRepo.findAll();

    expect(invoices).toStrictEqual([]);
  });

  test("should throw an error if an error occurs", async () => {
    prisma.invoice.findMany.mockRejectedValue(new Error("Database error"));

    await expect(mockRepo.findAll()).rejects.toThrowError("Database error");
  });
});

describe("Prisma Query: findById", () => {
  test("should return an invoice object if found", async () => {
    const mockInvoice: Invoice = {
      ...mockResponseWithIds,
      id: "D64FUO",
    };

    prisma.invoice.findUniqueOrThrow.mockResolvedValue(mockInvoice);

    const invoice = await mockRepo.findById("D64FUO");

    expect(invoice).toStrictEqual(mockInvoice);
  });

  test("should throw error if no invoice is found", async () => {
    prisma.invoice.findUniqueOrThrow.mockRejectedValue(
      new PrismaClientKnownRequestError("Invoice not found", {
        code: "P2025",
        clientVersion: "5.19.0",
      }),
    );

    await expect(mockRepo.findById("FG86SE")).rejects.toThrowError(
      /Invoice not found/,
    );
  });

  test("should throw an error if an error occurs", async () => {
    prisma.invoice.findUniqueOrThrow.mockRejectedValue(
      new Error("Database error"),
    );

    await expect(mockRepo.findById("D64FUO")).rejects.toThrowError(
      "Database error",
    );
  });
});

describe("Prisma Query: updateInvoice", () => {
  test("should return the updated invoice object", async () => {
    const mockInvoiceInput: DomainInvoice = {
      ...mockInvoiceParams,
      id: "D64FUO",
      // total: new Decimal(mockInvoicePrismaResponse.total),
    };

    const mockInvoice: Invoice = {
      ...mockResponseWithIds,
      id: "D64FUO",
      clientName: "Dr. Evil",

      // total: new Decimal(mockInvoicePrismaResponse.total),
    };

    prisma.$transaction.mockImplementation(async (callback) => {
      await callback(prisma);
      return mockInvoice;
    });

    prisma.item.deleteMany.mockResolvedValue({ count: 1 });
    prisma.invoice.update.mockResolvedValue(mockInvoice);
    prisma.invoice.findUnique.mockResolvedValue(mockInvoice);

    const updatedInvoice = await mockRepo.update("D64FUO", {
      ...mockInvoiceInput,
      clientName: "Dr. Evil",
    });
    console.log(updatedInvoice);

    // Eslint is interfering with the tests
    // None of the tests rely on 'this' so this rule can be safely ignored
    expect(updatedInvoice.clientName).toStrictEqual("Dr. Evil");

    expect(prisma.$transaction).toHaveBeenCalled();

    expect(prisma.item.deleteMany).toHaveBeenCalledWith({
      where: { invoiceId: "D64FUO" },
    });

    expect(prisma.invoice.update).toHaveBeenCalled();
  });

  test("should throw error if no invoice is found", async () => {
    prisma.$transaction.mockRejectedValue(
      new PrismaClientKnownRequestError("Invoice not found", {
        code: "P2025",
        clientVersion: "5.19.1",
      }),
    );

    await expect(
      mockRepo.update("D64F3E", mockInvoicePrismaResponse),
    ).rejects.toThrowError(/Invoice not found/);
  });

  test("should throw an error if an error occurs", async () => {
    prisma.$transaction.mockRejectedValue(new Error("Database error"));

    await expect(
      mockRepo.update("D64FDS", mockInvoicePrismaResponse),
    ).rejects.toThrowError("Database error");
  });

  test("should handle update when items are not provided", async () => {
    const mockInvoice: Invoice = {
      ...mockResponseWithIds,
      id: "D64FUO",
    };

    const invoiceUpdates = {
      clientName: "Updated Client",
    };

    prisma.$transaction.mockImplementation(async (callback) => {
      await callback(prisma);
      return { ...mockInvoice, ...invoiceUpdates };
    });

    prisma.invoice.update.mockResolvedValue({
      ...mockInvoice,
      ...invoiceUpdates,
    });
    prisma.invoice.findUnique.mockResolvedValue(mockInvoice);

    const updatedInvoice = await mockRepo.update("D64FUO", invoiceUpdates);

    expect(updatedInvoice.clientName).toStrictEqual("Updated Client");

    expect(prisma.$transaction).toHaveBeenCalled();

    expect(prisma.invoice.update).toHaveBeenCalled();

    expect(prisma.item.deleteMany).not.toHaveBeenCalled();
  });

  test("should throw error if prisma.invoice.update fails", async () => {
    const invoiceUpdates = {
      clientName: "Updated Client",
    };

    prisma.$transaction.mockRejectedValue(new Error("Transaction failed"));

    await expect(
      mockRepo.update("D64FUO", invoiceUpdates),
    ).rejects.toThrowError("Database error: Transaction failed");

    expect(prisma.$transaction).toHaveBeenCalled();
  });
});

describe("Prisma Query: deleteInvoice", () => {
  test("should return true when invoice is successfully deleted", async () => {
    // @ts-expect-error Stumped by this TS error - it's like it's using stale cached type defs
    prisma.invoice.delete.mockResolvedValue(true);

    const deletedInvoice = await mockRepo.delete("D64FUO");

    expect(deletedInvoice).toStrictEqual(true);
  });

  test("should throw error if no invoice is found", async () => {
    prisma.invoice.delete.mockRejectedValue(
      new PrismaClientKnownRequestError("Invoice not found", {
        code: "P2025",
        clientVersion: "5.19.1",
      }),
    );

    await expect(mockRepo.delete("D64F3E")).rejects.toThrowError(
      /Invoice not found/,
    );
  });

  test("should throw an error if an error occurs", async () => {
    prisma.invoice.delete.mockRejectedValue(new Error("Database error"));

    await expect(mockRepo.delete("D64FDS")).rejects.toThrowError(
      "Database error",
    );
  });

  test("should handle delete when invoice has related items", async () => {
    // const id = "D64FUO";

    // prisma.invoice.delete.mockResolvedValue(true);

    const deletedInvoice = await mockRepo.delete("D64FUO");

    expect(deletedInvoice).toStrictEqual(true);

    expect(prisma.invoice.delete).toHaveBeenCalledWith({
      where: { id: "D64FUO" },
    });
  });
});

describe("Prisma Query: markAsPaid", () => {
  test("should return the updated invoice object", async () => {
    const mockInvoice: Invoice = {
      ...mockResponseWithIds,
      id: "D64FUO",
      total: new Decimal(mockInvoicePrismaResponse.total),
      status: "paid",
    };

    prisma.invoice.update.mockResolvedValue(mockInvoice);

    const updatedInvoice = await mockRepo.markAsPaid("D64FUO");
    const expected = { ...mockInvoice };
    expect(updatedInvoice).toStrictEqual(expected);
  });

  test("should throw error if no invoice is found", async () => {
    prisma.invoice.update.mockRejectedValue(
      new PrismaClientKnownRequestError("Invoice not found", {
        code: "P2025",
        clientVersion: "5.19.1",
      }),
    );

    await expect(mockRepo.markAsPaid("D64F3E")).rejects.toThrowError(
      /Invoice not found/,
    );
  });

  test("should throw an error if an error occurs", async () => {
    prisma.invoice.update.mockRejectedValue(new Error("Database error"));

    await expect(mockRepo.markAsPaid("D64FDS")).rejects.toThrowError(
      "Database error",
    );
  });
});

describe("Prisma Query: createInvoice", () => {
  // Existing tests...

  beforeEach(async () => {
    prisma.user.create.mockResolvedValue({
      id: "user1",
      name: "John Doe",
      username: "john@melba.toast",
      role: "USER",
      passwordHash: "password",
    });

    // Mock the user retrieval (e.g., findUnique or findFirst)
    prisma.user.findUnique.mockResolvedValue({
      id: "user1",
      name: "John Doe",
      username: "user1@moo.com",
      role: "USER",
      passwordHash: "password",
    });

    const user = {
      id: "user1",
      role: "USER",
      username: "user1@moo.com",
      name: "John Doe",
      passwordHash: "password",
    };

    await mockUserRepo.createUser({ ...user });
  });

  test("should handle create when items are empty", async () => {
    const invoiceWithoutItems: DomainInvoice = {
      ...mockInvoiceParams,
      items: [],
    };

    const expectedResponse = {
      ...mockInvoicePrismaResponse,
      items: [],
      total: Number(0),
    };

    prisma.invoice.create.mockResolvedValue(
      expectedResponse as unknown as Invoice,
    );

    const createdInvoice = await mockRepo.create(invoiceWithoutItems);

    expect(createdInvoice).toStrictEqual(expectedResponse);

    expect(prisma.invoice.create).toHaveBeenCalled();
  });

  test("should handle create when optional fields are missing", async () => {
    const incompleteInvoiceParams: Partial<DomainInvoice> = {
      id: "D64FUO",
    };

    const expectedResponse = {
      ...mockInvoicePrismaResponse,
      id: "D64FUO",
      clientEmail: "",
      clientName: "",
      // createdAt: expect.any(String),
      // paymentDue: expect.any(String),
      description: "",
      paymentTerms: 14,
      status: "",
      total: 0,
      clientAddress: {
        street: "",
        city: "",
        postCode: "",
        country: "",
      },
      senderAddress: {
        street: "",
        city: "",
        postCode: "",
        country: "",
      },
      items: [],
    };

    prisma.invoice.create.mockResolvedValue(
      expectedResponse as unknown as Invoice,
    );

    const createdInvoice = await mockRepo.create(incompleteInvoiceParams);

    expect(createdInvoice).toStrictEqual(expectedResponse);

    expect(prisma.invoice.create).toHaveBeenCalled();
  });
});

describe("Error Handling in prismaErrorHandler", () => {
  test("should throw 'Unique constraint failed' error for code P2002", () => {
    const error = new PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "5.19.1",
      },
    );

    expect(() => prismaErrorHandler(error)).toThrowError(
      "Unique constraint failed on the fields: (`id`)",
    );
  });

  test("should throw 'Invoice not found' error for code P2025", () => {
    const error = new PrismaClientKnownRequestError("Invoice not found", {
      code: "P2025",
      clientVersion: "5.19.1",
    });

    expect(() => prismaErrorHandler(error)).toThrowError("Invoice not found");
  });

  test("should throw 'Database error' for other errors", () => {
    const error = new Error("Some other error");

    expect(() => prismaErrorHandler(error)).toThrowError(
      "Database error: Some other error",
    );
  });
});
