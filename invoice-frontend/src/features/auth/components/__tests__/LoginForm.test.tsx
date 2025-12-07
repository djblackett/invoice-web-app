import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../LoginForm";
import { NewAuthContext } from "../../contexts/NewAuthContext";
import type { ReactNode } from "react";

describe("LoginForm", () => {
  const mockLogin = vi.fn();
  const mockOnSwitchToRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithAuth = (authValue: any, props = {}) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NewAuthContext.Provider value={authValue}>{children}</NewAuthContext.Provider>
    );

    return render(<LoginForm {...props} />, { wrapper });
  };

  it("should render login form with all fields", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("should call login function with email and password on submit", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("should show error when submitting empty form", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Please fill in all fields")).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should show error when email is empty", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(passwordInput, "password123");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Please fill in all fields")).toBeInTheDocument();
    });
  });

  it("should show error when password is empty", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "test@example.com");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Please fill in all fields")).toBeInTheDocument();
    });
  });

  it("should display error message when login fails", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn().mockRejectedValue(new Error("Invalid credentials")),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "wrongpassword");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("should display generic error message when login fails with non-Error", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn().mockRejectedValue("Some string error"),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Login failed")).toBeInTheDocument();
    });
  });

  it("should disable form fields when loading", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /signing in/i });

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it("should show loading text on submit button when loading", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    expect(screen.getByText("Signing in...")).toBeInTheDocument();
  });

  it("should render OAuthButtons component", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
    expect(screen.getByText("Continue with Microsoft")).toBeInTheDocument();
    expect(screen.getByText("Continue with Apple")).toBeInTheDocument();
  });

  it("should render switch to register button when onSwitchToRegister is provided", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue, { onSwitchToRegister: mockOnSwitchToRegister });

    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("should call onSwitchToRegister when sign up link is clicked", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue, { onSwitchToRegister: mockOnSwitchToRegister });

    const signUpLink = screen.getByText("Sign up");
    fireEvent.click(signUpLink);

    expect(mockOnSwitchToRegister).toHaveBeenCalledTimes(1);
  });

  it("should not render switch to register button when onSwitchToRegister is not provided", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    expect(screen.queryByText("Don't have an account?")).not.toBeInTheDocument();
  });

  it("should have proper input attributes for email field", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    const emailInput = screen.getByLabelText("Email");

    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("id", "email");
    expect(emailInput).toHaveAttribute("autoComplete", "email");
    expect(emailInput).toHaveAttribute("placeholder", "you@example.com");
  });

  it("should have proper input attributes for password field", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    const passwordInput = screen.getByLabelText("Password");

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("id", "password");
    expect(passwordInput).toHaveAttribute("autoComplete", "current-password");
    expect(passwordInput).toHaveAttribute("placeholder", "Enter your password");
  });

  it("should clear error message on new submission", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn().mockRejectedValueOnce(new Error("First error")).mockResolvedValueOnce(undefined),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    // First submission - should fail
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("First error")).toBeInTheDocument();
    });

    // Second submission - error should be cleared before new attempt
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText("First error")).not.toBeInTheDocument();
    });
  });
});
