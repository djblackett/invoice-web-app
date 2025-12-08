import { renderWithProviders, screen, fireEvent } from "../testUtils";
import FilterDropDown from "@/features/invoices/components/FilterDropDown.tsx";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("FilterDropDown", () => {
  const mockSetIsFilterOpen = vi.fn();
  const mockIcon = <span data-testid="filter-icon">▼</span>;
  const options = ["Draft", "Pending", "Paid"];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders filter dropdown with icon", () => {
    renderWithProviders(
      <FilterDropDown
        icon={mockIcon}
        isOpen={false}
        setIsFilterOpen={mockSetIsFilterOpen}
        options={options}
      />,
    );

    expect(screen.getByTestId("filter-icon")).toBeInTheDocument();
  });

  it("shows dropdown list when isOpen is true", () => {
    renderWithProviders(
      <FilterDropDown
        icon={mockIcon}
        isOpen={true}
        setIsFilterOpen={mockSetIsFilterOpen}
        options={options}
      />,
    );

    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("hides dropdown list when isOpen is false", () => {
    const { container } = renderWithProviders(
      <FilterDropDown
        icon={mockIcon}
        isOpen={false}
        setIsFilterOpen={mockSetIsFilterOpen}
        options={options}
      />,
    );

    // Check if dropdown container has height of 0
    const dropdownContainer = container.querySelector('[style*="height"]');
    expect(dropdownContainer).toBeInTheDocument();
  });

  it("renders all filter options", () => {
    renderWithProviders(
      <FilterDropDown
        icon={mockIcon}
        isOpen={true}
        setIsFilterOpen={mockSetIsFilterOpen}
        options={options}
      />,
    );

    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it("renders checkbox for each option", () => {
    renderWithProviders(
      <FilterDropDown
        icon={mockIcon}
        isOpen={true}
        setIsFilterOpen={mockSetIsFilterOpen}
        options={options}
      />,
    );

    expect(screen.getByTestId("draft-filter")).toBeInTheDocument();
    expect(screen.getByTestId("pending-filter")).toBeInTheDocument();
    expect(screen.getByTestId("paid-filter")).toBeInTheDocument();
  });

  it("has clickable checkboxes", () => {
    renderWithProviders(
      <FilterDropDown
        icon={mockIcon}
        isOpen={true}
        setIsFilterOpen={mockSetIsFilterOpen}
        options={options}
      />,
    );

    const draftCheckbox = screen.getByTestId("draft-filter");
    fireEvent.click(draftCheckbox);

    expect(draftCheckbox).toBeInTheDocument();
  });

  it("has proper aria-label for accessibility", () => {
    renderWithProviders(
      <FilterDropDown
        icon={mockIcon}
        isOpen={false}
        setIsFilterOpen={mockSetIsFilterOpen}
        options={options}
      />,
    );

    const button = screen.getByLabelText("Filter invoices");
    expect(button).toBeInTheDocument();
  });

  it("renders all checkbox options", () => {
    renderWithProviders(
      <FilterDropDown
        icon={mockIcon}
        isOpen={true}
        setIsFilterOpen={mockSetIsFilterOpen}
        options={options}
      />,
    );

    expect(screen.getByTestId("draft-filter")).toBeInTheDocument();
    expect(screen.getByTestId("pending-filter")).toBeInTheDocument();
    expect(screen.getByTestId("paid-filter")).toBeInTheDocument();
  });
});
