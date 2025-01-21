import { beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import * as useWindowWidthModule from "../../src/hooks/useWindowWidth";
import { Invoice } from "../../src/types/types";
import { render, screen } from "@testing-library/react";
import FullInvoice from "../../src/components/invoice-components/FullInvoice";

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
  beforeEach(() => {
    // Restore all mocks before each test to ensure isolation
    vi.restoreAllMocks();
  });

  it("renders the invoice correctly", () => {
    // Mock the useWindowWidth hook to return a fixed width
    vi.spyOn(useWindowWidthModule, "default").mockReturnValue(1024);

    // Render the component with sample invoice data
    render(<FullInvoice invoice={sampleInvoice} loading={false} />);

    // Verify that the invoice ID is displayed
    const invoiceId = `${sampleInvoice.id.substring(0, 6)}`;
    expect(screen.getByText(invoiceId)).toBeInTheDocument();

    // Verify that the description is displayed
    expect(screen.getByText(sampleInvoice.description)).toBeInTheDocument();

    // Verify that the sender's address is displayed
    expect(
      screen.getByText(sampleInvoice.senderAddress.street),
    ).toBeInTheDocument();
    expect(
      screen.getByText(sampleInvoice.senderAddress.city),
    ).toBeInTheDocument();
    expect(
      screen.getByText(sampleInvoice.senderAddress.postCode),
    ).toBeInTheDocument();

    // Verify that the country is displayed twice (once for sender and once for client)
    expect(
      screen.getAllByText(sampleInvoice.senderAddress.country),
    ).toHaveLength(2);

    // Verify that the invoice date is displayed correctly
    // const invoiceDate = convertedDate(sampleInvoice.createdAt);
    expect(screen.getByText(/18 Aug 2021/)).toBeInTheDocument();

    // Verify that the payment due date is displayed correctly
    // const paymentDueDate = convertedDate(sampleInvoice.paymentDue);
    expect(screen.getByText(/19 Aug 2021/)).toBeInTheDocument();

    // Verify that the client's name is displayed
    expect(screen.getByText(sampleInvoice.clientName)).toBeInTheDocument();

    // Verify that the client's address is displayed
    expect(
      screen.getByText(sampleInvoice.clientAddress.street),
    ).toBeInTheDocument();
    expect(
      screen.getByText(sampleInvoice.clientAddress.city),
    ).toBeInTheDocument();
    expect(
      screen.getByText(sampleInvoice.clientAddress.postCode),
    ).toBeInTheDocument();

    // Verify that the client's email is displayed
    expect(screen.getByText(sampleInvoice.clientEmail)).toBeInTheDocument();

    // Verify that the item name is displayed
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
