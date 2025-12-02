import { render, screen } from "@testing-library/react";
import InvoiceStatus from "@/features/invoices/components/InvoiceStatus.tsx";
import { describe, it, expect } from "vitest";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "@/features/shared/styles/Themes.ts";

describe("InvoiceStatus", () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
  };

  it("renders status text correctly", () => {
    renderWithTheme(<InvoiceStatus text="Paid" statusType="paid" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("renders with paid status type", () => {
    renderWithTheme(<InvoiceStatus text="Paid" statusType="paid" />);
    const statusBox = screen.getByText("Paid").parentElement?.parentElement;
    expect(statusBox).toHaveClass("paid");
  });

  it("renders with pending status type", () => {
    renderWithTheme(<InvoiceStatus text="Pending" statusType="pending" />);
    const statusBox = screen.getByText("Pending").parentElement?.parentElement;
    expect(statusBox).toHaveClass("pending");
  });

  it("renders with draft status type", () => {
    renderWithTheme(<InvoiceStatus text="Draft" statusType="draft" />);
    const statusBox = screen.getByText("Draft").parentElement?.parentElement;
    expect(statusBox).toHaveClass("draft");
  });

  it("displays status circle indicator", () => {
    const { container } = renderWithTheme(
      <InvoiceStatus text="Paid" statusType="paid" />,
    );
    const circle = container.querySelector(".circle");
    expect(circle).toBeInTheDocument();
  });

  it("has correct structure with text and circle", () => {
    const { container } = renderWithTheme(
      <InvoiceStatus text="Pending" statusType="pending" />,
    );

    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(container.querySelector(".circle")).toBeInTheDocument();
  });

  it("renders different status texts correctly", () => {
    const { rerender } = renderWithTheme(
      <InvoiceStatus text="Paid" statusType="paid" />,
    );
    expect(screen.getByText("Paid")).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={lightTheme}>
        <InvoiceStatus text="Pending" statusType="pending" />
      </ThemeProvider>,
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={lightTheme}>
        <InvoiceStatus text="Draft" statusType="draft" />
      </ThemeProvider>,
    );
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    const { container } = renderWithTheme(
      <InvoiceStatus text="Paid" statusType="paid" />,
    );

    const statusBox = container.querySelector(".paid");
    expect(statusBox).toBeInTheDocument();
  });

  it("renders with proper dimensions", () => {
    const { container } = renderWithTheme(
      <InvoiceStatus text="Paid" statusType="paid" />,
    );

    const statusBox = screen.getByText("Paid").parentElement?.parentElement;
    expect(statusBox).toBeInTheDocument();
  });
});
