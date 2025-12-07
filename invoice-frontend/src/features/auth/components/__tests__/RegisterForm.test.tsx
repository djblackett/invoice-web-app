import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "../RegisterForm";
import { NewAuthContext } from "../../contexts/NewAuthContext";
import type { ReactNode } from "react";

describe("RegisterForm", () => {
  const mockRegister = vi.fn();
  const mockOnSwitchToLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithAuth = (authValue: any, props = {}) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NewAuthContext.Provider value={authValue}>{children}</NewAuthContext.Provider>
    );

    return render(<RegisterForm {...props} />, { wrapper });
  };

  it("should render registration form with all fields", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByText("Sign up to get started")).toBeInTheDocument();
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  it("should call register function with valid data on submit", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    await userEvent.type(screen.getByLabelText("Full Name"), "John Doe");
    await userEvent.type(screen.getByLabelText("Email"), "john@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "Password123!");
    await userEvent.type(screen.getByLabelText("Confirm Password"), "Password123!");

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "john@example.com",
        "Password123!",
        "John Doe",
      );
    });
  });

  it("should show error when submitting empty form", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Please fill in all fields")).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should show error when passwords do not match", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    await userEvent.type(screen.getByLabelText("Full Name"), "John Doe");
    await userEvent.type(screen.getByLabelText("Email"), "john@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "Password123!");
    await userEvent.type(screen.getByLabelText("Confirm Password"), "DifferentPassword!");

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should show error when password is too short", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    await userEvent.type(screen.getByLabelText("Full Name"), "John Doe");
    await userEvent.type(screen.getByLabelText("Email"), "john@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "Pass1!");
    await userEvent.type(screen.getByLabelText("Confirm Password"), "Pass1!");

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 8 characters"),
      ).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should show error when password missing uppercase", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    await userEvent.type(screen.getByLabelText("Full Name"), "John Doe");
    await userEvent.type(screen.getByLabelText("Email"), "john@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123!");
    await userEvent.type(screen.getByLabelText("Confirm Password"), "password123!");

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Password must contain at least one uppercase letter"),
      ).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should show error when password missing lowercase", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    await userEvent.type(screen.getByLabelText("Full Name"), "John Doe");
    await userEvent.type(screen.getByLabelText("Email"), "john@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "PASSWORD123!");
    await userEvent.type(screen.getByLabelText("Confirm Password"), "PASSWORD123!");

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Password must contain at least one lowercase letter"),
      ).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should show error when password missing number", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    await userEvent.type(screen.getByLabelText("Full Name"), "John Doe");
    await userEvent.type(screen.getByLabelText("Email"), "john@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "Password!");
    await userEvent.type(screen.getByLabelText("Confirm Password"), "Password!");

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Password must contain at least one number"),
      ).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should show error when password missing special character", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    await userEvent.type(screen.getByLabelText("Full Name"), "John Doe");
    await userEvent.type(screen.getByLabelText("Email"), "john@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "Password123");
    await userEvent.type(screen.getByLabelText("Confirm Password"), "Password123");

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Password must contain at least one special character"),
      ).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should display success message when registration succeeds", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister.mockResolvedValue(undefined),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    await userEvent.type(screen.getByLabelText("Full Name"), "John Doe");
    await userEvent.type(screen.getByLabelText("Email"), "john@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "Password123!");
    await userEvent.type(screen.getByLabelText("Confirm Password"), "Password123!");

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Account created successfully!"),
      ).toBeInTheDocument();
    });
  });

  it("should display error message when registration fails", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn().mockRejectedValue(new Error("Email already exists")),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    await userEvent.type(screen.getByLabelText("Full Name"), "John Doe");
    await userEvent.type(screen.getByLabelText("Email"), "john@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "Password123!");
    await userEvent.type(screen.getByLabelText("Confirm Password"), "Password123!");

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
    });
  });

  it("should disable form fields when loading", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    expect(screen.getByLabelText("Full Name")).toBeDisabled();
    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Password")).toBeDisabled();
    expect(screen.getByLabelText("Confirm Password")).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /creating account/i }),
    ).toBeDisabled();
  });

  it("should show password hint", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    expect(
      screen.getByText(/Must be 8\+ characters with uppercase, lowercase, number/i),
    ).toBeInTheDocument();
  });

  it("should render OAuthButtons component", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
    expect(screen.getByText("Continue with Microsoft")).toBeInTheDocument();
    expect(screen.getByText("Continue with Apple")).toBeInTheDocument();
  });

  it("should render switch to login button when onSwitchToLogin is provided", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue, { onSwitchToLogin: mockOnSwitchToLogin });

    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("should call onSwitchToLogin when sign in link is clicked", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue, { onSwitchToLogin: mockOnSwitchToLogin });

    const signInLink = screen.getByText("Sign in");
    fireEvent.click(signInLink);

    expect(mockOnSwitchToLogin).toHaveBeenCalledTimes(1);
  });

  it("should have proper input attributes", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    const nameInput = screen.getByLabelText("Full Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    expect(nameInput).toHaveAttribute("type", "text");
    expect(nameInput).toHaveAttribute("autoComplete", "name");

    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("autoComplete", "email");

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("autoComplete", "new-password");

    expect(confirmPasswordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("autoComplete", "new-password");
  });

  it("should clear error and success messages on new submission", async () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: vi
        .fn()
        .mockRejectedValueOnce(new Error("First error"))
        .mockResolvedValueOnce(undefined),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: vi.fn(),
    };

    renderWithAuth(mockAuthValue);

    await userEvent.type(screen.getByLabelText("Full Name"), "John Doe");
    await userEvent.type(screen.getByLabelText("Email"), "john@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "Password123!");
    await userEvent.type(screen.getByLabelText("Confirm Password"), "Password123!");

    // First submission - should fail
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("First error")).toBeInTheDocument();
    });

    // Second submission - error should be cleared
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.queryByText("First error")).not.toBeInTheDocument();
    });
  });
});
