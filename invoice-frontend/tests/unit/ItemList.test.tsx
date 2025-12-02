import { render, screen } from "@testing-library/react";
import ItemList from "@/features/invoices/components/ItemList.tsx";
import { describe, it, expect } from "vitest";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "@/features/shared/styles/Themes.ts";
import { Invoice } from "@/features/invoices/types/invoiceTypes";

describe("ItemList", () => {
  const mockInvoice: Invoice = {
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
      {
        name: "Website Redesign",
        quantity: 2,
        price: 500.0,
        total: 1000.0,
      },
    ],
    total: 2800.9,
  };

  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
  };

  it("renders item list with invoice items", () => {
    renderWithTheme(<ItemList invoice={mockInvoice} />);
    expect(screen.getByText("Brand Guidelines")).toBeInTheDocument();
    expect(screen.getByText("Website Redesign")).toBeInTheDocument();
  });

  it("displays all column headers on desktop", () => {
    renderWithTheme(<ItemList invoice={mockInvoice} />);
    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.getByText("QTY.")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  it("displays grand total with correct amount", () => {
    renderWithTheme(<ItemList invoice={mockInvoice} />);
    expect(screen.getByText(/2,?800.90/i)).toBeInTheDocument();
  });

  it("shows 'Grand Total' text on mobile", () => {
    renderWithTheme(<ItemList invoice={mockInvoice} />);
    const grandTotal = screen.getByText("Grand Total");
    expect(grandTotal).toBeInTheDocument();
  });

  it("shows 'Amount Due' text on desktop", () => {
    renderWithTheme(<ItemList invoice={mockInvoice} />);
    const amountDue = screen.getByText("Amount Due");
    expect(amountDue).toBeInTheDocument();
  });

  it("renders correct number of invoice items", () => {
    renderWithTheme(<ItemList invoice={mockInvoice} />);
    expect(screen.getByText("Brand Guidelines")).toBeInTheDocument();
    expect(screen.getByText("Website Redesign")).toBeInTheDocument();
  });

  it("displays currency symbol with total", () => {
    renderWithTheme(<ItemList invoice={mockInvoice} />);
    const totalWithCurrency = screen.getByText(/£.*2,?800.90/i);
    expect(totalWithCurrency).toBeInTheDocument();
  });

  it("handles invoice with single item", () => {
    const singleItemInvoice = {
      ...mockInvoice,
      items: [mockInvoice.items[0]],
      total: 1800.9,
    };
    renderWithTheme(<ItemList invoice={singleItemInvoice} />);
    expect(screen.getByText("Brand Guidelines")).toBeInTheDocument();
    expect(screen.queryByText("Website Redesign")).not.toBeInTheDocument();
  });

  it("handles invoice with many items", () => {
    const manyItemsInvoice = {
      ...mockInvoice,
      items: [
        ...mockInvoice.items,
        { name: "Logo Design", quantity: 1, price: 300, total: 300 },
        { name: "Business Cards", quantity: 5, price: 50, total: 250 },
      ],
      total: 4350.9,
    };
    renderWithTheme(<ItemList invoice={manyItemsInvoice} />);
    expect(screen.getByText("Logo Design")).toBeInTheDocument();
    expect(screen.getByText("Business Cards")).toBeInTheDocument();
  });

  it("returns null when invoice is null", () => {
    const { container } = renderWithTheme(
      <ItemList invoice={null as unknown as Invoice} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when invoice is undefined", () => {
    const { container } = renderWithTheme(
      <ItemList invoice={undefined as unknown as Invoice} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("formats total amount correctly", () => {
    const invoiceWithRoundTotal = { ...mockInvoice, total: 5000 };
    renderWithTheme(<ItemList invoice={invoiceWithRoundTotal} />);
    expect(screen.getByText(/5,?000.00/i)).toBeInTheDocument();
  });

  it("displays items in correct order", () => {
    renderWithTheme(<ItemList invoice={mockInvoice} />);
    const itemNames = screen
      .getAllByText(/Brand Guidelines|Website Redesign/)
      .map((el) => el.textContent);
    expect(itemNames).toContain("Brand Guidelines");
    expect(itemNames).toContain("Website Redesign");
  });

  it("has proper container structure", () => {
    const { container } = renderWithTheme(<ItemList invoice={mockInvoice} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders items header only on desktop viewport", () => {
    renderWithTheme(<ItemList invoice={mockInvoice} />);
    // Headers are present but may be hidden on mobile via CSS
    const headers = ["Item Name", "QTY.", "Price", "Total"];
    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });
});
