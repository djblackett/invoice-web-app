import { render, screen } from "../testUtils";
import { describe, it, expect, vi, Mock } from "vitest";
import AllInvoices from "../../src/pages/AllInvoices";
import { useAuth0 } from "@auth0/auth0-react";

// Mock useAuth0 hook
vi.mock("@auth0/auth0-react");

describe("AllInvoices Component", () => {
  it("renders welcome text with correct font-weight when authenticated", () => {
    // Mock authenticated user
    (useAuth0 as Mock).mockReturnValue({
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
    (useAuth0 as Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: true,
    });

    render(<AllInvoices />);

    const loadingText = screen.getByText(/Loading/i);
    expect(loadingText).toBeInTheDocument();
  });

  it("does not render welcome text when not authenticated", () => {
    (useAuth0 as Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });

    render(<AllInvoices />);

    const welcomeText = screen.queryByText(/Welcome/i);
    expect(welcomeText).not.toBeInTheDocument();
  });
});
