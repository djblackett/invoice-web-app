import { renderWithProviders, screen, fireEvent } from "../testUtils";
import ToolbarButtons from "@/features/invoices/components/ToolbarButtons.tsx";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Invoice } from "@/features/invoices/types/invoiceTypes";

// Mock the useNewInvoiceContext hook
vi.mock("@/features/invoices/forms/NewInvoiceContextProvider", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNewInvoiceContext: () => ({
      isNewInvoiceOpen: false,
      setIsNewInvoiceOpen: vi.fn(),
    }),
  };
});

describe("ToolbarButtons", () => {
  const mockInvoice: Invoice = {
    id: "RT3080",
    createdAt: "2021-08-18",
    paymentDue: "2021-08-19",
    description: "Re-branding",
    paymentTerms: 1,
    clientName: "Jensen Huang",
    clientEmail: "jensenh@mail.com",
    status: "pending",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "106 Kendell Street",
      city: "Sharrington",
      postCode: "NR24 5WQ",
      country: "United Kingdom",
    },
    items: [
      {
        name: "Brand Guidelines",
        quantity: 1,
        price: 1800.9,
        total: 1800.9,
      },
    ],
    total: 1800.9,
  };

  const mockOpenModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all three buttons", () => {
    renderWithProviders(<ToolbarButtons invoice={mockInvoice} openModal={mockOpenModal} />);

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Mark as Paid")).toBeInTheDocument();
  });

  it("calls openModal when delete button is clicked", () => {
    renderWithProviders(<ToolbarButtons invoice={mockInvoice} openModal={mockOpenModal} />);

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });

  it("renders edit button with correct text", () => {
    renderWithProviders(<ToolbarButtons invoice={mockInvoice} openModal={mockOpenModal} />);

    const editButton = screen.getByText("Edit");
    expect(editButton).toBeInTheDocument();
  });

  it("renders delete button with correct text", () => {
    renderWithProviders(<ToolbarButtons invoice={mockInvoice} openModal={mockOpenModal} />);

    const deleteButton = screen.getByText("Delete");
    expect(deleteButton).toBeInTheDocument();
  });

  it("renders mark as paid button with correct text", () => {
    renderWithProviders(<ToolbarButtons invoice={mockInvoice} openModal={mockOpenModal} />);

    const markAsPaidButton = screen.getByText("Mark as Paid");
    expect(markAsPaidButton).toBeInTheDocument();
  });

  it("renders mark as paid button even for paid invoices", () => {
    const paidInvoice = { ...mockInvoice, status: "paid" };
    renderWithProviders(<ToolbarButtons invoice={paidInvoice} openModal={mockOpenModal} />);

    // The button is rendered but the click handler prevents marking paid invoices
    expect(screen.getByText("Mark as Paid")).toBeInTheDocument();
  });

  it("has proper button container structure", () => {
    const { container } = renderWithProviders(
      <ToolbarButtons invoice={mockInvoice} openModal={mockOpenModal} />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it("maintains button order: Edit, Delete, Mark as Paid", () => {
    renderWithProviders(<ToolbarButtons invoice={mockInvoice} openModal={mockOpenModal} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveTextContent("Edit");
    expect(buttons[1]).toHaveTextContent("Delete");
    expect(buttons[2]).toHaveTextContent("Mark as Paid");
  });
});
