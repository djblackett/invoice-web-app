import { render, screen } from "@testing-library/react";
import InvoiceItem from "@/features/invoices/components/InvoiceItem.tsx";
import { describe, it, expect } from "vitest";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "@/features/shared/styles/Themes.ts";
import { Item } from "@/features/invoices/types/invoiceTypes";

describe("InvoiceItem", () => {
  const mockItem: Item = {
    name: "Brand Guidelines",
    quantity: 2,
    price: 1800.9,
    total: 3601.8,
  };

  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
  };

  it("renders item name", () => {
    renderWithTheme(<InvoiceItem item={mockItem} />);
    expect(screen.getByText("Brand Guidelines")).toBeInTheDocument();
  });

  it("displays item quantity", () => {
    renderWithTheme(<InvoiceItem item={mockItem} />);
    // Quantity appears in desktop view
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("displays item price with currency symbol", () => {
    renderWithTheme(<InvoiceItem item={mockItem} />);
    // Price appears in multiple places (desktop and mobile)
    const priceElements = screen.getAllByText(/1,?800.90/i);
    expect(priceElements.length).toBeGreaterThan(0);
  });

  it("displays item total with currency symbol", () => {
    renderWithTheme(<InvoiceItem item={mockItem} />);
    expect(screen.getByText(/3,?601.80/i)).toBeInTheDocument();
  });

  it("renders mobile quantity and price format", () => {
    renderWithTheme(<InvoiceItem item={mockItem} />);
    // Mobile format: "2 x £ 1800.90"
    const mobileFormat = screen.getByText(/2 x £ 1800.90/i);
    expect(mobileFormat).toBeInTheDocument();
  });

  it("formats price correctly with two decimal places", () => {
    const itemWithPrice = { ...mockItem, price: 100, total: 200 };
    renderWithTheme(<InvoiceItem item={itemWithPrice} />);
    const priceElements = screen.getAllByText(/100.00/i);
    expect(priceElements.length).toBeGreaterThan(0);
  });

  it("handles single quantity items", () => {
    const singleItem = { ...mockItem, quantity: 1, total: 1800.9 };
    renderWithTheme(<InvoiceItem item={singleItem} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("handles high quantity items", () => {
    const highQuantityItem = { ...mockItem, quantity: 999 };
    renderWithTheme(<InvoiceItem item={highQuantityItem} />);
    expect(screen.getByText("999")).toBeInTheDocument();
  });

  it("displays correct total calculation", () => {
    const item = {
      name: "Website Redesign",
      quantity: 3,
      price: 500.0,
      total: 1500.0,
    };
    renderWithTheme(<InvoiceItem item={item} />);
    expect(screen.getByText(/1,?500.00/i)).toBeInTheDocument();
  });

  it("renders with proper CSS classes", () => {
    const { container } = renderWithTheme(<InvoiceItem item={mockItem} />);

    expect(container.querySelector(".item-container")).toBeInTheDocument();
    expect(container.querySelector(".item-name")).toBeInTheDocument();
    expect(
      container.querySelector(".mobile-helper-container"),
    ).toBeInTheDocument();
  });

  it("handles items with long names", () => {
    const longNameItem = {
      ...mockItem,
      name: "Very Long Item Name That Should Be Displayed Properly",
    };
    renderWithTheme(<InvoiceItem item={longNameItem} />);
    expect(
      screen.getByText("Very Long Item Name That Should Be Displayed Properly"),
    ).toBeInTheDocument();
  });

  it("handles decimal quantities", () => {
    const decimalItem = { ...mockItem, quantity: 2.5 };
    renderWithTheme(<InvoiceItem item={decimalItem} />);
    expect(screen.getByText("2.5")).toBeInTheDocument();
  });

  it("displays zero price items correctly", () => {
    const zeroItem = { ...mockItem, price: 0, total: 0 };
    renderWithTheme(<InvoiceItem item={zeroItem} />);
    const zeroElements = screen.getAllByText(/0.00/i);
    expect(zeroElements.length).toBeGreaterThan(0);
  });
});
