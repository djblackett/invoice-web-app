import { cleanup, render, screen } from "../testUtils";
import { describe, it, expect, vi, afterEach } from "vitest";
import EditInvoice from "@/features/invoices/pages/EditInvoice";
import { NewInvoiceProvider } from "@/features/invoices/forms/NewInvoiceContextProvider.tsx";
import { Invoice } from "@/features/invoices/types/invoiceTypes.ts";

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
        <EditInvoice invoice={invoice} />
      </NewInvoiceProvider>,
    );
  };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should render the edit title", async () => {
    renderEditForm(mockInvoice);
    expect(await screen.findByTestId("edit-title")).toBeInTheDocument();
  });

  it("should render the bill from text", async () => {
    renderEditForm(mockInvoice);
    expect(await screen.findByText(/Bill From/i)).toBeInTheDocument();
  });

  it("should render the bill to text", async () => {
    renderEditForm(mockInvoice);
    expect(await screen.findByText(/Bill To/i)).toBeInTheDocument();
  });

  it("should render the save changes button", async () => {
    renderEditForm(mockInvoice);
    expect(await screen.findByText(/Save Changes/i)).toBeInTheDocument();
  });

  it("should render the cancel button", async () => {
    renderEditForm(mockInvoice);
    expect(await screen.findByText(/Cancel/i)).toBeInTheDocument();
  });

  it("does not render when no invoice is provided", () => {
    // @ts-expect-error - passing null to invoice prop
    const { container } = renderEditForm(null);
    expect(container.firstChild).toBeNull();
  });

  it("displays the modal when isNewInvoiceOpen is true", async () => {
    renderEditForm(mockInvoice);
    const darkenScreen = await screen.findByTestId("editInvoiceModal");
    console.log(darkenScreen);
    expect(darkenScreen).toHaveStyle("visibility: visible");
  });
});
