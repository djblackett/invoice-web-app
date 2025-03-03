import { render, screen } from "../testUtils";
import { describe, it, expect, vi } from "vitest";
import EditForm from "@/features/invoices/pages/EditForm.tsx";
import { Invoice } from "../../src/types/types";
import { NewInvoiceProvider } from "@/features/invoices/forms/NewInvoiceContextProvider.tsx";

// Mock hooks
vi.mock("../hooks/useResponsive", () => ({
  useResponsive: () => ({
    editPageWidth: 800,
    padding: "20px",
  }),
}));

const mockInvoice: Invoice = {
  id: "INV123456",
  clientEmail: "client@example.com",
  clientName: "Client Name",
  createdAt: new Date().toISOString().substring(0, 10),
  clientAddress: {
    street: "123 Main St",
    city: "Anytown",
    postCode: "12345",
    country: "Country",
  },
  description: "",
  items: [],
  paymentDue: "",
  paymentTerms: 0,
  senderAddress: {
    street: "456 Another St",
    city: "Othertown",
    postCode: "67890",
    country: "Other Country",
  },
  status: "",
  total: 0,
};

describe("EditForm", () => {
  const renderEditForm = (invoice: Invoice) => {
    return render(
      <NewInvoiceProvider initialState={{ isNewInvoiceOpen: true }}>
        <EditForm invoice={invoice} />
      </NewInvoiceProvider>,
    );
  };

  it("renders correctly when invoice is provided", () => {
    renderEditForm(mockInvoice);
    expect(screen.getByText(/Edit/i)).toBeInTheDocument();
    expect(screen.getByText(/Bill From/i)).toBeInTheDocument();
    expect(screen.getByText(/Bill To/i)).toBeInTheDocument();
    expect(screen.getByText(/Save Changes/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
  });

  it("does not render when no invoice is provided", () => {
    // @ts-expect-error - passing null to invoice prop
    const { container } = renderEditForm(null);
    expect(container.firstChild).toBeNull();
  });

  it.skip("hides the modal when isNewInvoiceOpen is false", () => {
    render(
      <NewInvoiceProvider initialState={{ isNewInvoiceOpen: false }}>
        <EditForm invoice={mockInvoice} />
      </NewInvoiceProvider>,
    );
    const darkenScreen = screen.getByTestId("editInvoiceModal");
    expect(darkenScreen).toHaveStyle("visibility: hidden");
  });

  it("displays the modal when isNewInvoiceOpen is true", () => {
    renderEditForm(mockInvoice);
    const darkenScreen = screen.getByTestId("editInvoiceModal");
    expect(darkenScreen).toHaveStyle("visibility: visible");
  });
});
