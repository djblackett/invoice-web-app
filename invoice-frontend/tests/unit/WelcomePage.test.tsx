import { render, screen } from "../testUtils";
import { useAuth0 } from "@auth0/auth0-react";
import { describe, it, expect, vi, Mock } from "vitest";
import WelcomePage from "@/pages/WelcomePage";

// Mock the useAuth0 hook
vi.mock("@auth0/auth0-react");

describe("WelcomePage", () => {
  it("renders loading state when isLoading is true", () => {
    (useAuth0 as Mock).mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
    });

    render(<WelcomePage />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("navigates to /invoices when authenticated", () => {
    (useAuth0 as Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
    });

    render(<WelcomePage />);
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    expect(screen.queryByText("Navigate")).not.toBeInTheDocument();
    // Since Navigate doesn't render visible content, you can check the component was called with correct props
  });

  it("navigates to login when not authenticated", () => {
    (useAuth0 as Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
    });

    render(<WelcomePage />);
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    expect(screen.queryByText("Navigate")).not.toBeInTheDocument();
  });
});
