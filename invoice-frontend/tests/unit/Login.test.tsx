import { render, screen, fireEvent } from "../testUtils";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import { describe, it, expect, vi, beforeEach, Mock, beforeAll } from "vitest";

vi.mock("@/hooks/useAuth");
// Mock the configuration module before importing the module that uses it.
vi.mock("@/config/config", () => ({
  BACKEND_URL: "http://localhost:4000",
}));

describe("Login Component", () => {
  const mockLoginWithRedirect = vi.fn();
  // Object.defineProperty(import.meta, "env", {
  //   value: {
  //     VITE_REDIRECT_URI: "http://localhost:3000",
  //     VITE_SOME_KEY: "testValue",
  //     // include any other VITE_ variables your tests need
  //   },
  //   configurable: true,
  // });

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
    render(<Login />);
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
