import { cleanup, render, screen } from "../testUtils";
import { describe, it, expect, vi, Mock, afterEach, beforeEach } from "vitest";
import AllInvoices from "@/features/invoices/pages/AllInvoices.tsx";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { before } from "node:test";

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

  it("renders welcome text with correct font-weight when authenticated", () => {
    // Mock authenticated user
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: true,
      user: { email: "testuser@example.com" },
      isLoading: false,
    });

    render(<AllInvoices />);

    const welcomeText = screen.getByText(/Welcome testuser@example.com/i);
    expect(welcomeText).toBeInTheDocument();
    expect(welcomeText).toHaveStyle("font-weight: 700");
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
