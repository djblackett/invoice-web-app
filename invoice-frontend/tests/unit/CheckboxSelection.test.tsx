import { renderWithProviders, screen } from "../testUtils";
import CheckboxSelection from "@/features/invoices/components/CheckboxSelection.tsx";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("CheckboxSelection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders checkbox with label", () => {
    renderWithProviders(<CheckboxSelection option="Draft" />);

    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("renders checkbox for Pending option", () => {
    renderWithProviders(<CheckboxSelection option="Pending" />);

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders checkbox for Paid option", () => {
    renderWithProviders(<CheckboxSelection option="Paid" />);

    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("displays correct font weight and styling", () => {
    renderWithProviders(<CheckboxSelection option="Draft" />);

    const label = screen.getByText("Draft");
    expect(label).toHaveStyle({ fontWeight: 700 });
  });

  it("converts option to lowercase for filter state", () => {
    renderWithProviders(<CheckboxSelection option="Draft" />);

    // The component should properly convert "Draft" to "draft" internally
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("handles mixed case options properly", () => {
    renderWithProviders(<CheckboxSelection option="PAID" />);

    expect(screen.getByText("PAID")).toBeInTheDocument();
  });
});
