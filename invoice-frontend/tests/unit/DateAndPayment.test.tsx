import { cleanup, render, screen } from "../testUtils";
import DateAndPayment from "@/features/invoices/forms/date/DateAndPayment.tsx";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("DateAndPayment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders DateAndPayment component", () => {
    render(<DateAndPayment />);
    expect(screen.getByText(/Invoice Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Payment Terms/i)).toBeInTheDocument();
  });
});
