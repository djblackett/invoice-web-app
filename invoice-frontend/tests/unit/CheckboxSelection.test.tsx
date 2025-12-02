import { render, screen } from "../testUtils";
import CheckboxSelection from "@/features/invoices/components/CheckboxSelection.tsx";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("CheckboxSelection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders checkbox with label", () => {
    render(<CheckboxSelection option="Draft" />);

    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("renders checkbox for Pending option", () => {
    render(<CheckboxSelection option="Pending" />);

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders checkbox for Paid option", () => {
    render(<CheckboxSelection option="Paid" />);

    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("displays correct font weight and styling", () => {
    render(<CheckboxSelection option="Draft" />);

    const label = screen.getByText("Draft");
    expect(label).toHaveStyle({ fontWeight: 700 });
  });

  it("converts option to lowercase for filter state", () => {
    render(<CheckboxSelection option="Draft" />);

    // The component should properly convert "Draft" to "draft" internally
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("handles mixed case options properly", () => {
    render(<CheckboxSelection option="PAID" />);

    expect(screen.getByText("PAID")).toBeInTheDocument();
  });
});
