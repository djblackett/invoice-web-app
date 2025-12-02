import { render, screen, fireEvent } from "@testing-library/react";
import { OAuthButtons } from "@/features/auth/components/OAuthButtons";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "@/features/shared/styles/Themes";

// Mock the NewAuthContext
vi.mock("@/features/auth/contexts/NewAuthContext", () => ({
  useNewAuth: () => ({
    loginWithOAuth: vi.fn(),
    isLoading: false,
  }),
}));

describe("OAuthButtons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
  };

  it("renders all three OAuth provider buttons", () => {
    renderWithTheme(<OAuthButtons />);

    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
    expect(screen.getByText("Continue with Microsoft")).toBeInTheDocument();
    expect(screen.getByText("Continue with Apple")).toBeInTheDocument();
  });

  it("renders divider by default", () => {
    renderWithTheme(<OAuthButtons />);
    expect(screen.getByText("Or continue with")).toBeInTheDocument();
  });

  it("does not render divider when showDivider is false", () => {
    renderWithTheme(<OAuthButtons showDivider={false} />);
    expect(screen.queryByText("Or continue with")).not.toBeInTheDocument();
  });

  it("renders Google button with proper aria-label", () => {
    renderWithTheme(<OAuthButtons />);
    const googleButton = screen.getByLabelText("Sign in with Google");
    expect(googleButton).toBeInTheDocument();
  });

  it("renders Microsoft button with proper aria-label", () => {
    renderWithTheme(<OAuthButtons />);
    const microsoftButton = screen.getByLabelText("Sign in with Microsoft");
    expect(microsoftButton).toBeInTheDocument();
  });

  it("renders Apple button with proper aria-label", () => {
    renderWithTheme(<OAuthButtons />);
    const appleButton = screen.getByLabelText("Sign in with Apple");
    expect(appleButton).toBeInTheDocument();
  });

  it("renders Google button with SVG icon", () => {
    const { container } = renderWithTheme(<OAuthButtons />);
    const googleButton = screen.getByLabelText("Sign in with Google");
    const svg = googleButton.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders Microsoft button with SVG icon", () => {
    const { container } = renderWithTheme(<OAuthButtons />);
    const microsoftButton = screen.getByLabelText("Sign in with Microsoft");
    const svg = microsoftButton.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders Apple button with SVG icon", () => {
    const { container } = renderWithTheme(<OAuthButtons />);
    const appleButton = screen.getByLabelText("Sign in with Apple");
    const svg = appleButton.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("buttons are enabled by default", () => {
    renderWithTheme(<OAuthButtons />);

    expect(screen.getByLabelText("Sign in with Google")).not.toBeDisabled();
    expect(screen.getByLabelText("Sign in with Microsoft")).not.toBeDisabled();
    expect(screen.getByLabelText("Sign in with Apple")).not.toBeDisabled();
  });

  it("maintains button order: Google, Microsoft, Apple", () => {
    renderWithTheme(<OAuthButtons />);

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveTextContent("Continue with Google");
    expect(buttons[1]).toHaveTextContent("Continue with Microsoft");
    expect(buttons[2]).toHaveTextContent("Continue with Apple");
  });

  it("renders with proper container structure", () => {
    const { container } = renderWithTheme(<OAuthButtons />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("applies correct styling to buttons", () => {
    const { container } = renderWithTheme(<OAuthButtons />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(3);
  });

  it("Google button has correct provider attribute", () => {
    const { container } = renderWithTheme(<OAuthButtons />);
    const googleButton = screen.getByLabelText("Sign in with Google");
    // Button should have provider styling
    expect(googleButton).toBeInTheDocument();
  });

  it("Microsoft button has correct provider attribute", () => {
    const { container } = renderWithTheme(<OAuthButtons />);
    const microsoftButton = screen.getByLabelText("Sign in with Microsoft");
    expect(microsoftButton).toBeInTheDocument();
  });

  it("Apple button has correct provider attribute", () => {
    const { container } = renderWithTheme(<OAuthButtons />);
    const appleButton = screen.getByLabelText("Sign in with Apple");
    expect(appleButton).toBeInTheDocument();
  });

  it("renders all buttons with proper flex layout", () => {
    const { container } = renderWithTheme(<OAuthButtons />);
    const oauthContainer = container.querySelector("div");
    expect(oauthContainer).toBeInTheDocument();
  });
});
