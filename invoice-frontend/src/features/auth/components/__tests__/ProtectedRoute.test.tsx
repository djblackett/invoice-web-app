import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
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

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithAuth = (authValue: any, props = {}) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <BrowserRouter>
        <NewAuthContext.Provider value={authValue}>
          {children}
        </NewAuthContext.Provider>
      </BrowserRouter>
    );

    return render(
      <ProtectedRoute {...props}>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
      { wrapper },
    );
  };

  it("should render children when authenticated", () => {
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

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should redirect to /login when not authenticated and requireAuth is true", () => {
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

    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("should show loading state when isLoading is true", () => {
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

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("should show loading spinner when isLoading is true", () => {
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

    const spinner = container.querySelector('[class*="LoadingSpinner"]');
    expect(spinner).toBeInTheDocument();
  });

  it("should render children when requireAuth is false, regardless of auth state", () => {
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

    renderWithAuth(mockAuthValue, { requireAuth: false });

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should not redirect when loading, even if not authenticated", () => {
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

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should not redirect when loading, even if authenticated", () => {
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

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("should render complex children when authenticated", () => {
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

    const wrapper = ({ children }: { children: ReactNode }) => (
      <BrowserRouter>
        <NewAuthContext.Provider value={mockAuthValue}>
          {children}
        </NewAuthContext.Provider>
      </BrowserRouter>
    );

    render(
      <ProtectedRoute>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back!</p>
          <button>Click me</button>
        </div>
      </ProtectedRoute>,
      { wrapper },
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Welcome back!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("should handle requireAuth=true explicitly", () => {
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

    renderWithAuth(mockAuthValue, { requireAuth: true });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
