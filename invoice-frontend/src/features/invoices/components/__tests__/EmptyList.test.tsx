import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import EmptyList from "../EmptyList";

const mockTheme = {
  text: "#000000",
  greyText: "#666666",
};

describe("EmptyList", () => {
  const renderWithTheme = () => {
    return render(
      <ThemeProvider theme={mockTheme}>
        <EmptyList />
      </ThemeProvider>,
    );
  };

  it("should render the main heading", () => {
    renderWithTheme();

    expect(screen.getByText("There is nothing here")).toBeInTheDocument();
  });

  it("should render the description text", () => {
    renderWithTheme();

    expect(screen.getByText(/Create a new invoice by clicking/i)).toBeInTheDocument();
    expect(screen.getByText(/and get started/i)).toBeInTheDocument();
  });

  it("should render 'New' button text", () => {
    renderWithTheme();

    const newText = screen.getByText("New");
    expect(newText).toBeInTheDocument();
    expect(newText).toHaveClass("newInvoice");
  });

  it("should render 'Invoice' text with responsive class", () => {
    renderWithTheme();

    const invoiceText = screen.getByText("Invoice");
    expect(invoiceText).toBeInTheDocument();
    expect(invoiceText).toHaveClass("newInvoiceLargeOnly");
  });

  it("should render the SVG illustration", () => {
    const { container } = renderWithTheme();

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "242");
    expect(svg).toHaveAttribute("height", "200");
  });

  it("should render with correct structure", () => {
    const { container } = renderWithTheme();

    // Check main container
    const mainContainer = container.firstChild;
    expect(mainContainer).toBeInTheDocument();

    // Check SVG container
    const svgContainer = container.querySelector("svg");
    expect(svgContainer).toBeInTheDocument();
  });

  it("should apply theme colors correctly", () => {
    renderWithTheme();

    const heading = screen.getByText("There is nothing here");
    expect(heading).toBeInTheDocument();
  });
});
