import { render, screen, fireEvent } from "../testUtils";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

vi.mock("@/hooks/useAuth");

describe("Login Component", () => {
  const mockLoginWithRedirect = vi.fn();

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
