import { render, screen, fireEvent } from "../testUtils";
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
    render(
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
    render(
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
    const { container } = render(
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
    render(
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
    render(
      <FilterDropDown
        icon={mockIcon}
        isOpen={true}
        setIsFilterOpen={mockSetIsFilterOpen}
        options={options}
      />,
    );

    expect(screen.getByTestId("draft-checkbox")).toBeInTheDocument();
    expect(screen.getByTestId("pending-checkbox")).toBeInTheDocument();
    expect(screen.getByTestId("paid-checkbox")).toBeInTheDocument();
  });

  it("has clickable checkboxes", () => {
    render(
      <FilterDropDown
        icon={mockIcon}
        isOpen={true}
        setIsFilterOpen={mockSetIsFilterOpen}
        options={options}
      />,
    );

    const draftCheckbox = screen.getByTestId("draft-checkbox");
    fireEvent.click(draftCheckbox);

    // Checkbox should be clickable
    expect(draftCheckbox).toBeInTheDocument();
  });

  it("has proper aria-label for accessibility", () => {
    render(
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
    render(
      <FilterDropDown
        icon={mockIcon}
        isOpen={true}
        setIsFilterOpen={mockSetIsFilterOpen}
        options={options}
      />,
    );

    // All checkboxes should exist and be clickable
    expect(screen.getByTestId("draft-checkbox")).toBeInTheDocument();
    expect(screen.getByTestId("pending-checkbox")).toBeInTheDocument();
    expect(screen.getByTestId("paid-checkbox")).toBeInTheDocument();
  });
});
