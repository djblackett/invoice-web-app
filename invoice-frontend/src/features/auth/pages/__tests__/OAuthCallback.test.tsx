import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { OAuthCallback } from "../OAuthCallback";
import { NewAuthContext } from "../../contexts/NewAuthContext";
import type { ReactNode } from "react";

// Mock Navigate component
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => {
      mockNavigate(to);
      return <div data-testid="navigate">{to}</div>;
    },
  };
});

describe("OAuthCallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear URL params
    delete (window as any).location;
    (window as any).location = { search: "" };
  });

  const renderWithAuth = (authValue: any) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <BrowserRouter>
        <NewAuthContext.Provider value={authValue}>
          {children}
        </NewAuthContext.Provider>
      </BrowserRouter>
    );

    return render(<OAuthCallback />, { wrapper });
  };

  it("should show loading state while processing authentication", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    expect(screen.getByText("Completing sign in...")).toBeInTheDocument();
  });

  it("should redirect to /invoices when authenticated", () => {
    const mockAuthValue = {
      user: {
        id: "user123",
        email: "test@example.com",
        role: "USER" as const,
      },
      isAuthenticated: true,
      isLoading: false,
      accessToken: "token123",
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    expect(mockNavigate).toHaveBeenCalledWith("/invoices");
  });

  it("should not redirect when still loading even if authenticated", () => {
    const mockAuthValue = {
      user: {
        id: "user123",
        email: "test@example.com",
        role: "USER" as const,
      },
      isAuthenticated: true,
      isLoading: true,
      accessToken: "token123",
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    expect(screen.getByText("Completing sign in...")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should display error message when oauth_failed error in URL", () => {
    (window as any).location.search = "?error=oauth_failed";

    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    expect(
      screen.getByText("OAuth authentication failed. Please try again."),
    ).toBeInTheDocument();
    expect(screen.getByText("Return to login")).toBeInTheDocument();
  });

  it("should display custom error message when other error in URL", () => {
    (window as any).location.search = "?error=custom_error_message";

    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    expect(screen.getByText("custom_error_message")).toBeInTheDocument();
    expect(screen.getByText("Return to login")).toBeInTheDocument();
  });

  it("should provide link back to login on error", () => {
    (window as any).location.search = "?error=oauth_failed";

    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    const loginLink = screen.getByText("Return to login");
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest("a")).toHaveAttribute("href", "/login");
  });

  it("should show loading spinner while processing", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    const { container } = renderWithAuth(mockAuthValue);

    // Check for loading spinner (styled div with animation)
    const spinner = container.querySelector('[class*="LoadingSpinner"]');
    expect(spinner).toBeInTheDocument();
  });

  it("should handle authenticated state without redirecting when loading", () => {
    const mockAuthValue = {
      user: {
        id: "user123",
        email: "test@example.com",
        role: "USER" as const,
      },
      isAuthenticated: true,
      isLoading: true,
      accessToken: "token123",
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    expect(screen.getByText("Completing sign in...")).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });
});
