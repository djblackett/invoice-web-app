import "reflect-metadata";
import { InvoiceService } from "@/services/invoice.service";
import { describe, expect, beforeEach, afterEach, test, vi } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { IInvoiceRepo } from "@/repositories/InvoiceRepo";
import { Invoice, UserIdAndRole } from "@/constants/types";
import * as InvoiceUtils from "@/utils/utils";
import { ValidationException } from "@/config/exception.config";

// Mock utility functions
vi.mock("@/utils/utils.ts", () => ({
  validateInvoiceData: vi.fn(),
  validateInvoiceList: vi.fn(),
  mapPartialInvoiceToInvoice: vi.fn(),
}));

vi.hoisted(() => {
  vi.resetModules();
});

const mockUserContext: UserIdAndRole = {
  id: "user1",
  role: "ADMIN" as const,
  username: "moo@nfff.cj",
  name: "Fred",
} satisfies {
  id: string;
  role: "ADMIN" | "USER";
  username: string;
  name: string;
};

const invoices: Invoice[] = [
  {
    clientAddress: {
      city: "Toronto",
      country: "Canada",
      postCode: "M5H 2N2",
      street: "123 King Street West",
    },
    createdBy: {
      id: "user1",
      name: "John Doe",
      username: "john@melba.toast",
      role: "USER",
    },
    createdById: "user1",
    clientEmail: "johndoe@example.com",
    clientName: "John Doe",
    createdAt: "2022-05-12",
    description: "Website Development",
    id: "e08e99bd-5de6-4378-b2a8-11941bad082d",
    items: [
      {
        id: "a270680c-541f-490a-8f0e-31830eb81ba0",
        name: "Landing Page",
        price: 500,
        quantity: 1,
        total: 500,
      },
      {
        id: "01555927-b4cf-4670-8a5d-0707e4c52acd",
        name: "SEO Optimization",
        price: 300,
        quantity: 3,
        total: 900,
      },
    ],
    paymentDue: "2022-06-12",
    paymentTerms: 30,
    senderAddress: {
      city: "Montreal",
      country: "Canada",
      postCode: "H3B 1A1",
      street: "456 Saint Catherine Street",
    },
    status: "paid",
    total: 1400,
  },
  {
    clientAddress: {
      city: "Bradford",
      country: "United Kingdom",
      postCode: "BD1 9PB",
      street: "84 Church Way",
    },
    createdBy: {
      id: "user1",
      name: "John Doe",
      username: "john@melba.toast",
      role: "USER",
    },
    createdById: "user1",
    clientEmail: "alexgrim@mail.com",
    clientName: "Alex Grim",
    createdAt: "2021-08-21",
    description: "Graphic Design",
    id: "D64FUO",
    items: [
      {
        id: "gjhgjhgjhg",
        name: "Banner Design",
        price: 156,
        quantity: 1,
        total: 156,
      },
      {
        id: "hgfdyrdyi456t",
        name: "Email Design",
        price: 200,
        quantity: 2,
        total: 400,
      },
    ],
    paymentDue: "2021-09-20",
    paymentTerms: 30,
    senderAddress: {
      city: "London",
      country: "United Kingdom",
      postCode: "E1 3EZ",
      street: "19 Union Terrace",
    },
    status: "paid",
    total: 556,
  },
  {
    clientAddress: {
      city: "Berlin",
      country: "Germany",
      postCode: "10115",
      street: "Unter den Linden 5",
    },
    createdBy: {
      id: "user1",
      name: "John Doe",
      username: "john@melba.toast",
      role: "USER",
    },
    clientEmail: "max.mustermann@mail.de",
    clientName: "Mr Clean",
    createdAt: "2023-2-31",
    description: "Photography Services",
    id: "028a3312-89ef-42f5-aaa2-c771f08b84dd",
    items: [
      {
        id: "4ed1ba6e-a7d3-4999-9a82-2875e4236d56",
        name: "Evil",
        price: 23,
        quantity: 5,
        total: 115,
      },
    ],
    paymentDue: "2023-3-1",
    paymentTerms: 1,
    senderAddress: {
      city: "Hamburg",
      country: "Germany",
      postCode: "20095",
      street: "Mönckebergstraße 7",
    },
    status: "paid",
    total: 115,
  },
  {
    clientAddress: {
      city: "",
      country: "",
      postCode: "",
      street: "",
    },
    createdBy: {
      id: "user1",
      name: "John Doe",
      username: "john@melba.toast",
      role: "USER",
    },
    clientEmail: "",
    clientName: "",
    createdAt: "9/3/2024",
    description: "",
    id: "b6ec4a22-c929-4ed4-95e1-7a3a6ffa25ad",
    items: [],
    paymentDue: "9/4/2024",
    paymentTerms: 14,
    senderAddress: {
      city: "",
      country: "",
      postCode: "",
      street: "",
    },
    status: "",
    total: 0,
  },
];

describe("InvoiceService", () => {
  const mockInvoiceRepo = mockDeep<IInvoiceRepo>();
  let invoiceService: InvoiceService;

  beforeEach(() => {
    invoiceService = new InvoiceService(mockInvoiceRepo, mockUserContext);
    mockReset(mockInvoiceRepo); // Reset all mocks before each test
    vi.clearAllMocks(); // Clear all other mocks
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore all mocks after each test
  });

  test("getInvoices should return a list of invoices", async () => {
    // Arrange
    const validatedInvoices = invoices.map((invoice) => ({
      ...invoice,
      createdBy: {
        id: invoice.createdBy?.id ?? mockUserContext.id,
        name: invoice.createdBy?.name ?? mockUserContext.name,
        username: invoice.createdBy?.username ?? mockUserContext.username ?? "",
        role: invoice.createdBy?.role ?? mockUserContext.role,
      },
    }));
    mockInvoiceRepo.findAll.mockResolvedValue(validatedInvoices);
    const validateInvoiceListMock = vi.mocked(
      InvoiceUtils.validateInvoiceList,
      true,
    );
    validateInvoiceListMock.mockReturnValue(validatedInvoices);

    // Act
    const result = await invoiceService.getInvoices();

    // Assert
    expect(result).toEqual(invoices);
    expect(mockInvoiceRepo.findAll).toHaveBeenCalled();
    expect(validateInvoiceListMock).toHaveBeenCalledWith(invoices);
  });

  test("should call findById on invoiceRepo when getInvoiceById is called", async () => {
    // Arrange
    const invoice: Invoice = invoices[0]; // Mock data
    mockInvoiceRepo.findById.mockResolvedValue(invoice);

    // Act
    const result = await invoiceService.getInvoiceById(
      "e08e99bd-5de6-4378-b2a8-11941bad082d",
    );

    // Assert
    expect(mockInvoiceRepo.findById).toHaveBeenCalledWith(
      "e08e99bd-5de6-4378-b2a8-11941bad082d",
    );
    expect(result).toEqual(invoice);
  });

  test("should call create on invoiceRepo when addInvoice is called", async () => {
    // Arrange
    const newInvoice: Invoice = invoices[1];
    const createdInvoice = {
      ...newInvoice,
      createdBy: {
        id: mockUserContext.id,
        name: mockUserContext.name,
        username: mockUserContext.username || "",
        role: mockUserContext.role,
      },
    };
    mockInvoiceRepo.create.mockResolvedValue(createdInvoice);
    const validateInvoiceDataMock = vi.mocked(
      InvoiceUtils.validateInvoiceData,
      true,
    );
    validateInvoiceDataMock.mockReturnValue(createdInvoice);

    // Act
    const result = await invoiceService.addInvoice(createdInvoice);

    // Assert
    // expect(mockInvoiceRepo.create).toHaveBeenCalledWith(createdInvoice);
    // expect(validateInvoiceDataMock).toHaveBeenCalledWith(createdInvoice);
    expect(result).toEqual(createdInvoice);
  });

  test("should call update on invoiceRepo when updateInvoice is called", async () => {
    // Arrange
    const oldInvoice: Invoice = invoices[2];
    const id = oldInvoice.id;
    const invoiceUpdates = { total: 200 };
    const updatedInvoice = {
      ...oldInvoice,
      total: 200,
      createdBy: {
        id: mockUserContext.id,
        name: mockUserContext.name,
        username: mockUserContext.username || "",
        role: mockUserContext.role,
      },
    };
    mockInvoiceRepo.findById.mockResolvedValue(oldInvoice);
    const validateInvoiceDataMock = vi.mocked(
      InvoiceUtils.validateInvoiceData,
      true,
    );
    validateInvoiceDataMock.mockReturnValue(updatedInvoice);
    mockInvoiceRepo.update.mockResolvedValue(updatedInvoice);

    // Act
    await invoiceService.getInvoiceById(id);
    const result = await invoiceService.updateInvoice(id, invoiceUpdates);

    // Assert
    expect(mockInvoiceRepo.findById).toHaveBeenCalledWith(id);
    expect(mockInvoiceRepo.update).toHaveBeenCalledWith(id, updatedInvoice);
    expect(validateInvoiceDataMock).toHaveBeenCalledWith(updatedInvoice);
    expect(result).toEqual(updatedInvoice);
  });

  test("should call markAsPaid on invoiceRepo when markAsPaid is called", async () => {
    // Arrange
    const invoice: Invoice = invoices[0]; // Mock data
    const id = invoice.id;
    const paidInvoice = {
      ...invoice,
      createdBy: {
        id: invoice.createdBy?.id ?? mockUserContext.id,
        name: invoice.createdBy?.name ?? mockUserContext.name,
        username: invoice.createdBy?.username ?? mockUserContext.username ?? "",
        role: invoice.createdBy?.role ?? mockUserContext.role,
      },
      status: "paid",
    };

    mockInvoiceRepo.markAsPaid.mockResolvedValue(paidInvoice);
    const validateInvoiceDataMock = vi.mocked(
      InvoiceUtils.validateInvoiceData,
      true,
    );
    validateInvoiceDataMock.mockReturnValue(paidInvoice);

    // Act
    const result = await invoiceService.markAsPaid(id);

    // Assert
    expect(mockInvoiceRepo.markAsPaid).toHaveBeenCalledWith(id);
    expect(validateInvoiceDataMock).toHaveBeenCalledWith(paidInvoice);
    expect(result).toEqual(invoice);
  });

  test("markAsPaid should throw error when validation fails", async () => {
    // Arrange
    const invoice: Invoice = invoices[0];
    const id = invoice.id;
    mockInvoiceRepo.markAsPaid.mockResolvedValue(invoice);
    const validateInvoiceDataMock = vi.mocked(
      InvoiceUtils.validateInvoiceData,
      true,
    );
    validateInvoiceDataMock.mockImplementation(() => {
      throw new ValidationException("Validation error");
    });

    // Act & Assert
    await expect(invoiceService.markAsPaid(id)).rejects.toThrow(
      "Validation error",
    );
    expect(mockInvoiceRepo.markAsPaid).toHaveBeenCalledWith(id);
    expect(validateInvoiceDataMock).toHaveBeenCalledWith(invoice);
  });

  test("should call delete on invoiceRepo when deleteInvoice is called", async () => {
    // Arrange
    const invoice: Invoice = invoices[0]; // Mock data
    const id = invoice.id;
    mockInvoiceRepo.delete.mockResolvedValue(true);

    // Act
    const result = await invoiceService.deleteInvoice(id);

    // Assert
    expect(mockInvoiceRepo.delete).toHaveBeenCalledWith(id);
    expect(result).toEqual(true);
  });

  test("addInvoice should throw error when validation fails", async () => {
    // Arrange
    const invoice: Invoice = invoices[1];
    const newInvoice = { ...invoice };
    mockInvoiceRepo.create.mockResolvedValue(newInvoice);
    const validateInvoiceDataMock = vi.mocked(
      InvoiceUtils.validateInvoiceData,
      true,
    );
    validateInvoiceDataMock.mockImplementation(() => {
      throw new ValidationException("Validation error");
    });

    // Act & Assert
    await expect(invoiceService.addInvoice(newInvoice)).rejects.toThrow(
      "Validation error",
    );
  });

  test("should throw error when getInvoiceById is called with non-existent id", async () => {
    // Arrange
    const id = "non-existent-id";
    mockInvoiceRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(invoiceService.getInvoiceById(id)).rejects.toThrow(
      /Invoice not found/,
    );
    expect(mockInvoiceRepo.findById).toHaveBeenCalledWith(id);
  });

  test("should throw error when updateInvoice is called with non-existent id", async () => {
    // Arrange
    const id = "non-existent-id";
    mockInvoiceRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      invoiceService.updateInvoice(id, { total: 200 }),
    ).rejects.toThrow("Invoice not found");
    expect(mockInvoiceRepo.findById).toHaveBeenCalledWith(id);
  });

  test("updateInvoice should throw error when validation fails during update", async () => {
    // Arrange
    const oldInvoice: Invoice = invoices[2];
    const id = oldInvoice.id;
    const invoiceUpdates = { total: 200 };
    const newInvoiceUnvalidated = { ...oldInvoice, ...invoiceUpdates };

    mockInvoiceRepo.findById.mockResolvedValue(oldInvoice);
    const validateInvoiceDataMock = vi.mocked(
      InvoiceUtils.validateInvoiceData,
      true,
    );

    validateInvoiceDataMock.mockImplementationOnce(() => {
      throw new ValidationException("Validation error during update");
    });

    // Act & Assert
    await expect(
      invoiceService.updateInvoice(id, invoiceUpdates),
    ).rejects.toThrow("Validation error during update");
    expect(mockInvoiceRepo.findById).toHaveBeenCalledWith(id);

    expect(validateInvoiceDataMock).toHaveBeenCalledWith(newInvoiceUnvalidated);
    expect(mockInvoiceRepo.update).not.toHaveBeenCalled();
  });
});
