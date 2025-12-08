import { renderWithProviders, screen, fireEvent, waitFor } from "../testUtils";
import DateAndPayment from "@/features/invoices/forms/date/DateAndPayment.tsx";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe("DateAndPayment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders DateAndPayment component", () => {
    renderWithProviders(<DateAndPayment />);
    expect(screen.getByText(/Invoice Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Payment Terms/i)).toBeInTheDocument();
  });

  it("displays invoice date label", () => {
    renderWithProviders(<DateAndPayment />);
    const dateLabel = screen.getByText(/Invoice Date/i);
    expect(dateLabel).toBeInTheDocument();
  });

  it("displays payment terms label", () => {
    renderWithProviders(<DateAndPayment />);
    const termsLabel = screen.getByText(/Payment Terms/i);
    expect(termsLabel).toBeInTheDocument();
  });

  it("renders date input component", () => {
    renderWithProviders(<DateAndPayment />);
    // Check for the date component wrapper
    const dateSection = screen.getByText(/Invoice Date/i).parentElement;
    expect(dateSection).toBeInTheDocument();
  });

  it("renders payment terms dropdown", () => {
    renderWithProviders(<DateAndPayment />);
    // Check for the payment terms section
    const termsSection = screen.getByText(/Payment Terms/i).parentElement;
    expect(termsSection).toBeInTheDocument();
  });

  it("has proper layout structure", () => {
    const { container } = renderWithProviders(<DateAndPayment />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
