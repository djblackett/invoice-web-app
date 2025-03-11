import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { useUpdateInvoice } from "../../../src/features/invoices/hooks/useUpdateInvoice";
import { GET_INVOICE_BY_ID } from "../../../src/features/invoices/graphql/invoice.queries";
import {
  useMutation,
  DataProxy,
  FetchResult,
  MutationHookOptions,
} from "@apollo/client";
import { Invoice } from "../../../src/features/invoices/types/invoiceTypes";

vi.mock("@apollo/client", () => {
  return {
    useMutation: vi.fn(),
    gql: vi.fn(),
  };
});

describe("useUpdateInvoice", () => {
  let mockUpdateInvoice: (options: {
    variables: Partial<Invoice>; //{ id: string; amount: number; description: string };
  }) => Promise<void>;
  let capturedUpdateCallback:
    | ((
        cache: DataProxy,
        mutationResult: FetchResult<{
          editInvoice: Partial<Invoice>;
        }>,
        context?: unknown,
      ) => void)
    | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateInvoice = vi.fn(() => Promise.resolve());
    // Capture the update callback provided in the hook configuration.
    (useMutation as unknown as Mock).mockImplementation(
      (
        _: unknown,
        config: MutationHookOptions<
          { editInvoice: Partial<Invoice> },
          Partial<Invoice>
        >,
      ) => {
        capturedUpdateCallback = config.update as
          | ((
              cache: DataProxy,
              mutationResult: FetchResult<{ editInvoice: Partial<Invoice> }>,
              context?: unknown,
            ) => void)
          | undefined;
        return [mockUpdateInvoice];
      },
    );
  });

  it("should call updateInvoice mutation with the provided variables", async () => {
    const sampleInvoice: Invoice = {
      id: "123",
      total: 150,
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
    const { result } = renderHook(() => useUpdateInvoice());
    await act(async () => {
      await result.current.handleUpdateInvoice(sampleInvoice);
    });
    expect(mockUpdateInvoice).toHaveBeenCalledWith({
      variables: { ...sampleInvoice },
    });
  });

  it("should update the cache correctly in the update callback", () => {
    const fakeCache = {
      writeQuery: vi.fn(),
      readQuery: vi.fn(),
      readFragment: vi.fn(),
      writeFragment: vi.fn(),
    };
    const fakeEditInvoice = {
      id: "123",
      amount: 150,
      description: "Test invoice",
    };
    const payload = { data: { editInvoice: fakeEditInvoice } };

    // Manually invoke the update callback, asserting it is defined.
    if (!capturedUpdateCallback)
      throw new Error("Update callback is undefined");
    capturedUpdateCallback(fakeCache, payload);
    expect(fakeCache.writeQuery).toHaveBeenCalledWith({
      query: GET_INVOICE_BY_ID,
      variables: { getInvoiceById: fakeEditInvoice.id },
      data: { getInvoiceById: fakeEditInvoice },
    });
  });
});
