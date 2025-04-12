import { render, screen, fireEvent } from "../testUtils";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import MemoizedLogin from "@/features/auth/pages/Login.tsx";
import Login from "@/features/auth/pages/Login.tsx";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi, beforeEach, Mock, beforeAll } from "vitest";

vi.mock("@/features/auth/hooks/useAuth");
// Mock the configuration module before importing the module that uses it.
vi.mock("@/config/config", () => ({
  BACKEND_URL: "http://localhost:4000",
}));

describe("Login Component", () => {
  const mockLoginWithRedirect = vi.fn();

  beforeAll(() => {
    vi.stubEnv("VITE_BACKEND_URL", "http://localhost:4000");
    import.meta.env.VITE_BACKEND_URL = "http://localhost:4000";
  });

  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      loginWithRedirect: mockLoginWithRedirect,
    });
  });

  it("displays loading when isLoading is true", () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      loginWithRedirect: mockLoginWithRedirect,
    });
    render(<Login />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("redirects to /invoices when authenticated", () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      loginWithRedirect: mockLoginWithRedirect,
    });
    render(
      <MemoryRouter>
        <MemoizedLogin />
      </MemoryRouter>,
    );
    expect(
      screen.queryByText("Please login to view your invoices"),
    ).not.toBeInTheDocument();
  });

  it("shows login prompt and button when not authenticated", () => {
    render(<Login />);
    expect(screen.getByTestId("welcome-text")).toBeInTheDocument();
    const loginButton = screen.getByTestId("login-button");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveTextContent("Login");
  });

  it("calls loginWithRedirect on login button click", () => {
    render(<Login />);
    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);
    expect(mockLoginWithRedirect).toHaveBeenCalled();
  });
});
