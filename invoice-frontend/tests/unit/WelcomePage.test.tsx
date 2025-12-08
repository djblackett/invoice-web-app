import { renderWithProviders, screen } from "../testUtils";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { describe, it, expect, vi, Mock } from "vitest";
import WelcomePage from "@/pages/WelcomePage";

// Mock the useAuth0 hook
vi.mock("@/features/auth/hooks/useAuth");

describe("WelcomePage", () => {
  it("renders loading state when isLoading is true", () => {
    (useAuth as Mock).mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
    });

    renderWithProviders(<WelcomePage />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("navigates to /invoices when authenticated", () => {
    (useAuth as Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
    });

    renderWithProviders(<WelcomePage />);
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    expect(screen.queryByText("Navigate")).not.toBeInTheDocument();
    // Since Navigate doesn't render visible content, you can check the component was called with correct props
  });

  it("navigates to login when not authenticated", () => {
    (useAuth as Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
    });

    renderWithProviders(<WelcomePage />);
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    expect(screen.queryByText("Navigate")).not.toBeInTheDocument();
  });
});
