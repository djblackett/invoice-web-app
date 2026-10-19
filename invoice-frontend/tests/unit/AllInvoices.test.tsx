import { cleanup, render, screen } from "../testUtils";
import { describe, it, expect, vi, Mock, afterEach, beforeEach } from "vitest";
import AllInvoices from "@/features/invoices/pages/AllInvoices.tsx";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";

// Mock useAuth0 hook
vi.mock("@/features/auth/hooks/useAuth");

describe("AllInvoices Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("renders the dashboard heading without a shifting welcome banner when authenticated", () => {
    // Mock authenticated user
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: true,
      user: { email: "testuser@example.com" },
      isLoading: false,
    });

    render(<AllInvoices />);

    expect(screen.getByTestId("invoicesTitle")).toBeInTheDocument();
    expect(screen.queryByText(/Welcome/i)).not.toBeInTheDocument();
  });

  it("shows loading text when authentication is loading", () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: true,
    });

    render(<AllInvoices />);

    const loadingText = screen.getByText(/Loading/i);
    expect(loadingText).toBeInTheDocument();
  });

  it("does not render welcome text when not authenticated", () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });

    render(<AllInvoices />);

    const welcomeText = screen.queryByText(/Welcome/i);
    expect(welcomeText).not.toBeInTheDocument();
  });
});
