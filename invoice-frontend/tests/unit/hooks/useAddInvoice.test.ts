import { renderHook, act } from "@testing-library/react-hooks";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { useAddInvoice } from "../../../src/features/invoices/hooks/useAddInvoice";
import { gql, useMutation } from "@apollo/client";
import { Invoice } from "@/features/invoices/types/invoiceTypes";

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

  it("should call addInvoice with the correct variables", async () => {
    addInvoiceMock.mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useAddInvoice());
    const sampleInvoice: Invoice = {
      id: "1",
      total: 100,
      clientAddress: {
        street: "123 Main St",
        city: "New York",
        postCode: "10001",
        country: "USA",
      },
      clientEmail: "client@example.com",
      clientName: "Client Name",
      createdAt: "2023-10-05",
      description: "Test invoice",
      items: [],
      paymentDue: "2023-10-15",
      paymentTerms: 30,
      senderAddress: {
        street: "456 Elm St",
        city: "Los Angeles",
        postCode: "90001",
        country: "USA",
      },
      status: "draft",
    };

    await act(async () => {
      await result.current.handleAddInvoice(sampleInvoice);
    });

    expect(addInvoiceMock).toHaveBeenCalledWith({
      variables: { ...sampleInvoice },
    });
  });

  it("should log errors when addInvoice rejects", async () => {
    const error = new Error("Test error");
    addInvoiceMock.mockRejectedValue(error);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useAddInvoice());
    const sampleInvoice: Invoice = {
      id: "1",
      total: 100,
      clientAddress: {
        street: "Test Street",
        city: "Test City",
        postCode: "00000",
        country: "Test Country",
      },
      clientEmail: "test@example.com",
      clientName: "Test Client",
      createdAt: "2023-10-05",
      description: "Test invoice",
      items: [],
      paymentDue: "2023-10-15",
      paymentTerms: 30,
      senderAddress: {
        street: "Test Sender Street",
        city: "Test Sender City",
        postCode: "11111",
        country: "Test Sender Country",
      },
      status: "draft",
    };

    await act(async () => {
      await result.current.handleAddInvoice(sampleInvoice);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    consoleErrorSpy.mockRestore();
  });
});
