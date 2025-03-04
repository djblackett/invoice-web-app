import { beforeEach, describe, expect, it, vi } from "vitest";
import * as useWindowWidthModule from "@/features/shared/hooks/useWindowWidth.tsx";
import { render, screen } from "@testing-library/react";
import FullInvoice from "@/features/invoices/components/FullInvoice.tsx";
import { Invoice } from "@/features/invoices/types/invoiceTypes.ts";

// Sample invoice data for testing
const sampleInvoice: Invoice = {
  id: "RT3080",
  createdAt: "2021-08-18",
  paymentDue: "2021-08-19",
  description: "Re-branding",
  paymentTerms: 1,
  clientName: "Jensen Huang",
  clientEmail: "jensenh@mail.com",
  status: "paid",
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

describe("FullInvoice Component", () => {
  // beforeEach(() => {
  //   // Restore all mocks before each test to ensure isolation
  //   vi.restoreAllMocks();
  // });

  beforeEach(() => {
    // Mock the useWindowWidth hook to return a fixed width
    vi.spyOn(useWindowWidthModule, "default").mockReturnValue(1024);
    // Render the component with sample invoice data
    render(<FullInvoice invoice={sampleInvoice} loading={false} />);
  });

  it("displays the invoice ID", () => {
    const invoiceId = sampleInvoice.id.substring(0, 6);
    expect(screen.getByText(invoiceId)).toBeInTheDocument();
  });

  it("displays the invoice description", () => {
    expect(screen.getByText(sampleInvoice.description)).toBeInTheDocument();
  });

  it("displays the sender's street address", () => {
    expect(
      screen.getByText(sampleInvoice.senderAddress.street),
    ).toBeInTheDocument();
  });

  it("displays the sender's city", () => {
    expect(
      screen.getByText(sampleInvoice.senderAddress.city),
    ).toBeInTheDocument();
  });

  it("displays the sender's post code", () => {
    expect(
      screen.getByText(sampleInvoice.senderAddress.postCode),
    ).toBeInTheDocument();
  });

  it("displays the country twice", () => {
    expect(
      screen.getAllByText(sampleInvoice.senderAddress.country),
    ).toHaveLength(2);
  });

  it("displays the invoice date", () => {
    expect(screen.getByText(/18 Aug 2021/)).toBeInTheDocument();
  });

  it("displays the payment due date", () => {
    expect(screen.getByText(/19 Aug 2021/)).toBeInTheDocument();
  });

  it("displays the client's name", () => {
    expect(screen.getByText(sampleInvoice.clientName)).toBeInTheDocument();
  });

  it("displays the client's street address", () => {
    expect(
      screen.getByText(sampleInvoice.clientAddress.street),
    ).toBeInTheDocument();
  });

  it("displays the client's city", () => {
    expect(
      screen.getByText(sampleInvoice.clientAddress.city),
    ).toBeInTheDocument();
  });

  it("displays the client's post code", () => {
    expect(
      screen.getByText(sampleInvoice.clientAddress.postCode),
    ).toBeInTheDocument();
  });

  it("displays the client's email", () => {
    expect(screen.getByText(sampleInvoice.clientEmail)).toBeInTheDocument();
  });

  it("displays the item name", () => {
    expect(screen.getByText(sampleInvoice.items[0].name)).toBeInTheDocument();
  });

  it("displays loading indicator when loading is true", () => {
    // Render the component with loading set to true
    // @ts-expect-error - We are intentionally passing null to test the loading state
    render(<FullInvoice invoice={null} loading={true} />);

    // Verify that the loading indicator is displayed
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
