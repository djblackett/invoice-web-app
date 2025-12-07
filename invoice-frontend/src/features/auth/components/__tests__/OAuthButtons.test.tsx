import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OAuthButtons } from "../OAuthButtons";
import { NewAuthContext } from "../../contexts/NewAuthContext";
import type { ReactNode } from "react";

describe("OAuthButtons", () => {
  const mockLoginWithOAuth = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithAuth = (authValue: any) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NewAuthContext.Provider value={authValue}>{children}</NewAuthContext.Provider>
    );

    return render(<OAuthButtons />, { wrapper });
  };

  it("should render all three OAuth buttons", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: mockLoginWithOAuth,
    };

    renderWithAuth(mockAuthValue);

    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
    expect(screen.getByText("Continue with Microsoft")).toBeInTheDocument();
    expect(screen.getByText("Continue with Apple")).toBeInTheDocument();
  });

  it("should render divider by default", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: mockLoginWithOAuth,
    };

    renderWithAuth(mockAuthValue);

    expect(screen.getByText("Or continue with")).toBeInTheDocument();
  });

  it("should not render divider when showDivider is false", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: mockLoginWithOAuth,
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <NewAuthContext.Provider value={mockAuthValue}>{children}</NewAuthContext.Provider>
    );

    render(<OAuthButtons showDivider={false} />, { wrapper });

    expect(screen.queryByText("Or continue with")).not.toBeInTheDocument();
  });

  it("should call loginWithOAuth with google when Google button clicked", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: mockLoginWithOAuth,
    };

    renderWithAuth(mockAuthValue);

    const googleButton = screen.getByText("Continue with Google");
    fireEvent.click(googleButton);

    expect(mockLoginWithOAuth).toHaveBeenCalledWith("google");
    expect(mockLoginWithOAuth).toHaveBeenCalledTimes(1);
  });

  it("should call loginWithOAuth with microsoft when Microsoft button clicked", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: mockLoginWithOAuth,
    };

    renderWithAuth(mockAuthValue);

    const microsoftButton = screen.getByText("Continue with Microsoft");
    fireEvent.click(microsoftButton);

    expect(mockLoginWithOAuth).toHaveBeenCalledWith("microsoft");
    expect(mockLoginWithOAuth).toHaveBeenCalledTimes(1);
  });

  it("should call loginWithOAuth with apple when Apple button clicked", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: mockLoginWithOAuth,
    };

    renderWithAuth(mockAuthValue);

    const appleButton = screen.getByText("Continue with Apple");
    fireEvent.click(appleButton);

    expect(mockLoginWithOAuth).toHaveBeenCalledWith("apple");
    expect(mockLoginWithOAuth).toHaveBeenCalledTimes(1);
  });

  it("should disable all buttons when isLoading is true", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: mockLoginWithOAuth,
    };

    renderWithAuth(mockAuthValue);

    const googleButton = screen.getByText("Continue with Google").closest("button");
    const microsoftButton = screen
      .getByText("Continue with Microsoft")
      .closest("button");
    const appleButton = screen.getByText("Continue with Apple").closest("button");

    expect(googleButton).toBeDisabled();
    expect(microsoftButton).toBeDisabled();
    expect(appleButton).toBeDisabled();
  });

  it("should not call loginWithOAuth when buttons are disabled", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: mockLoginWithOAuth,
    };

    renderWithAuth(mockAuthValue);

    const googleButton = screen.getByText("Continue with Google");
    fireEvent.click(googleButton);

    expect(mockLoginWithOAuth).not.toHaveBeenCalled();
  });

  it("should have proper aria-labels for accessibility", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: mockLoginWithOAuth,
    };

    renderWithAuth(mockAuthValue);

    expect(screen.getByLabelText("Sign in with Google")).toBeInTheDocument();
    expect(screen.getByLabelText("Sign in with Microsoft")).toBeInTheDocument();
    expect(screen.getByLabelText("Sign in with Apple")).toBeInTheDocument();
  });

  it("should render Google logo SVG", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: mockLoginWithOAuth,
    };

    const { container } = renderWithAuth(mockAuthValue);

    const googleButton = screen.getByText("Continue with Google").closest("button");
    const svg = googleButton?.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "20");
    expect(svg).toHaveAttribute("height", "20");
  });

  it("should render Microsoft logo SVG", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: mockLoginWithOAuth,
    };

    const { container } = renderWithAuth(mockAuthValue);

    const microsoftButton = screen
      .getByText("Continue with Microsoft")
      .closest("button");
    const svg = microsoftButton?.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "20");
  });

  it("should render Apple logo SVG", () => {
    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      loginWithOAuth: mockLoginWithOAuth,
    };

    const { container } = renderWithAuth(mockAuthValue);

    const appleButton = screen.getByText("Continue with Apple").closest("button");
    const svg = appleButton?.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "20");
  });
});
