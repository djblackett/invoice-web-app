import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InvoiceStatus from "../InvoiceStatus";

describe("InvoiceStatus", () => {
  it("should render with the correct text", () => {
    render(<InvoiceStatus text="Paid" statusType="paid" />);

    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("should render with pending status", () => {
    render(<InvoiceStatus text="Pending" statusType="pending" />);

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("should render with draft status", () => {
    render(<InvoiceStatus text="Draft" statusType="draft" />);

    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("should apply the correct status class", () => {
    const { container } = render(<InvoiceStatus text="Paid" statusType="paid" />);

    const statusBox = container.querySelector(".paid");
    expect(statusBox).toBeInTheDocument();
  });

  it("should render circle element", () => {
    const { container } = render(<InvoiceStatus text="Paid" statusType="paid" />);

    const circle = container.querySelector(".circle");
    expect(circle).toBeInTheDocument();
  });

  it("should accept custom text", () => {
    render(<InvoiceStatus text="Custom Status" statusType="custom" />);

    expect(screen.getByText("Custom Status")).toBeInTheDocument();
  });

  it("should apply custom statusType as class", () => {
    const { container } = render(
      <InvoiceStatus text="Custom" statusType="custom-type" />,
    );

    const statusBox = container.querySelector(".custom-type");
    expect(statusBox).toBeInTheDocument();
  });

  it("should render text and circle in correct container structure", () => {
    const { container } = render(<InvoiceStatus text="Paid" statusType="paid" />);

    // Check structure: statusBox > TextCircleBox > (Circle + StatusText)
    const statusBox = container.firstChild;
    expect(statusBox).toBeInTheDocument();

    const textCircleBox = statusBox?.firstChild;
    expect(textCircleBox).toBeInTheDocument();

    const circle = textCircleBox?.firstChild;
    expect(circle).toHaveClass("circle");
  });
});
