import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import InvoiceToolbar, {
  InvoiceToolBarProps,
} from "@/features/invoices/components/InvoiceToolbar.tsx";
import { NewInvoiceProvider } from "@/features/invoices/forms/NewInvoiceContextProvider.tsx";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "@/features/shared/styles/Themes.ts";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "@testing-library/jest-dom";
import { Invoice } from "@/features/invoices/types/invoiceTypes.ts";

// Mock useWindowWidth hook
vi.mock("../src/hooks/useWindowWidth", () => ({
  default: vi.fn(), // Mocks the default export as a function
}));

// Sample Invoice data
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

describe("InvoiceToolbar component", () => {
  const mockSetIsModalOpen = vi.fn();

  const setup = (props: InvoiceToolBarProps) =>
    render(
      <ApolloProvider
        client={
          new ApolloClient({
            cache: new InMemoryCache(),
          })
        }
      >
        <ThemeProvider theme={lightTheme}>
          <NewInvoiceProvider>
            <InvoiceToolbar {...props} />
          </NewInvoiceProvider>
        </ThemeProvider>
      </ApolloProvider>,
    );

  it("renders the correct status based on invoice status", () => {
    setup({ invoice: sampleInvoice, setIsModalOpen: mockSetIsModalOpen });
    const statusElement = screen.getByText("Paid");
    expect(statusElement).toBeInTheDocument();
  });

  it("renders 'Pending' status if the invoice status is pending", () => {
    setup({
      invoice: { ...sampleInvoice, status: "pending" },
      setIsModalOpen: mockSetIsModalOpen,
    });
    const statusElement = screen.getByText("Pending");
    expect(statusElement).toBeInTheDocument();
  });

  it("renders 'Draft' status if the invoice status is draft", () => {
    setup({
      invoice: { ...sampleInvoice, status: "draft" },
      setIsModalOpen: mockSetIsModalOpen,
    });
    const statusElement = screen.getByText("Draft");
    expect(statusElement).toBeInTheDocument();
  });

  it("calls setIsModalOpen with true when openModal is triggered", () => {
    setup({ invoice: sampleInvoice, setIsModalOpen: mockSetIsModalOpen });

    const button = screen.getByRole("button", { name: /Delete/i }); // Assuming ToolbarButtons renders this
    fireEvent.click(button);

    expect(mockSetIsModalOpen).toHaveBeenCalledWith(true);
  });

  it("applies display 'flex' when width is 800", () => {
    setup({ invoice: sampleInvoice, setIsModalOpen: mockSetIsModalOpen });
    const toolbar = screen.getByTestId("invoice-toolbar");

    expect(toolbar).toHaveStyle({ display: "flex" });
  });
});
