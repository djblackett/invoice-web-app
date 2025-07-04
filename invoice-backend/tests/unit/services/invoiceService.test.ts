import "reflect-metadata";
import { InvoiceService } from "@/services/invoice.service";
import { RevisionService } from "@/services/revision.service";
import { describe, expect, beforeEach, afterEach, test, vi } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { IInvoiceRepo } from "@/repositories/InvoiceRepo";
import { Invoice, UserIdAndRole } from "@/constants/types";
import * as InvoiceUtils from "@/utils/utils";
import { ValidationException } from "@/config/exception.config";
import invoices from "tests/data/invoices";

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

describe("InvoiceService", () => {
  const mockInvoiceRepo = mockDeep<IInvoiceRepo>();
  const mockRevisionService = mockDeep<RevisionService>();
  let invoiceService: InvoiceService;

  beforeEach(() => {
    invoiceService = new InvoiceService(
      mockInvoiceRepo,
      mockRevisionService,
      mockUserContext,
    );
    mockReset(mockInvoiceRepo); // Reset all mocks before each test
    mockReset(mockRevisionService);
    vi.clearAllMocks(); // Clear all other mocks
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore all mocks after each test
  });

  test("getInvoices should return a list of invoices", async () => {
    // Arrange
    const validatedInvoices = invoices.map((invoice) => ({
      ...invoice,
      createdById: invoice.createdById ?? mockUserContext.id,
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
      createdById: newInvoice.createdById ?? mockUserContext.id,
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
    expect(mockRevisionService.createRevision).toHaveBeenCalledWith(
      createdInvoice.id,
      null,
      createdInvoice,
      "create",
      "Initial invoice creation",
    );
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
    validateInvoiceDataMock.mockReturnValue(updatedInvoice as any);
    mockInvoiceRepo.update.mockResolvedValue(updatedInvoice);

    // Act
    await invoiceService.getInvoiceById(id);
    const result = await invoiceService.updateInvoice(id, invoiceUpdates);

    // Assert
    expect(mockRevisionService.createRevision).toHaveBeenCalledWith(
      id,
      oldInvoice,
      updatedInvoice,
      "update",
      "Invoice updated",
    );
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

    mockInvoiceRepo.findById.mockResolvedValue(invoice);
    mockInvoiceRepo.markAsPaid.mockResolvedValue(paidInvoice);
    const validateInvoiceDataMock = vi.mocked(
      InvoiceUtils.validateInvoiceData,
      true,
    );
    validateInvoiceDataMock.mockReturnValue(paidInvoice as any);

    // Act
    const result = await invoiceService.markAsPaid(id);

    // Assert
    expect(mockInvoiceRepo.markAsPaid).toHaveBeenCalledWith(id);
    expect(validateInvoiceDataMock).toHaveBeenCalledWith(paidInvoice);
    expect(result).toEqual(invoice);
    expect(mockRevisionService.createRevision).toHaveBeenCalledWith(
      id,
      invoice,
      paidInvoice,
      "status_change",
      "Marked as paid",
    );
  });

  test("markAsPaid should throw error when validation fails", async () => {
    // Arrange
    const invoice: Invoice = invoices[0];
    const id = invoice.id;
    mockInvoiceRepo.findById.mockResolvedValue(invoice);
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

  test("deleteInvoice should throw error when invoice does not exist", async () => {
    // Arrange
    const id = "non-existent-id";
    mockInvoiceRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(invoiceService.deleteInvoice(id)).rejects.toThrow(
      "Invoice not found",
    );
    expect(mockInvoiceRepo.delete).not.toHaveBeenCalled();
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
    const invoiceUpdates = { total: 200, status: 32 };
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
      // @ts-expect-error - We are testing the error case
      invoiceService.updateInvoice(id, invoiceUpdates),
    ).rejects.toThrow("Validation error during update");
    expect(mockInvoiceRepo.findById).toHaveBeenCalledWith(id);

    expect(validateInvoiceDataMock).toHaveBeenCalledWith(newInvoiceUnvalidated);
    expect(mockInvoiceRepo.update).not.toHaveBeenCalled();
  });
});
