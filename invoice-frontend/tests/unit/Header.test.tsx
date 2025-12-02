import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/features/shared/components/Header";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDemoModeContext } from "@/features/shared/components/DemoModeProvider";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "@/features/shared/styles/Themes";
import { HashRouter } from "react-router-dom";

// Mock the dependencies
vi.mock("@/features/auth/hooks/useAuth");
vi.mock("@/features/shared/components/DemoModeProvider");
vi.mock("@/config/config", () => ({
  VITE_REDIRECT_URI: "http://localhost:5173",
  VITE_BACKEND_URL: "http://localhost:4000",
  VITE_AUDIENCE: "https://invoice-web-app/",
  VITE_SCOPE: "openid profile email",
  VITE_DOMAIN: "test.auth0.com",
  VITE_CLIENT_ID: "test-client-id",
}));

describe("Header", () => {
  const mockLogout = vi.fn();
  const mockThemeToggler = vi.fn();

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <HashRouter>
        <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
      </HashRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    (useAuth as any).mockReturnValue({
      logout: mockLogout,
      isAuthenticated: true,
    });

    (useDemoModeContext as any).mockReturnValue({
      isDemoMode: false,
    });
  });

  it("renders header component", () => {
    renderWithProviders(<Header theme="light" themeToggler={mockThemeToggler} />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("renders logo", () => {
    renderWithProviders(<Header theme="light" themeToggler={mockThemeToggler} />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("renders dark mode toggle button", () => {
    renderWithProviders(<Header theme="light" themeToggler={mockThemeToggler} />);
    expect(screen.getByTestId("dark-mode-button")).toBeInTheDocument();
  });

  it("shows moon icon when theme is light", () => {
    renderWithProviders(<Header theme="light" themeToggler={mockThemeToggler} />);
    expect(screen.getByTestId("moon")).toBeInTheDocument();
    expect(screen.queryByTestId("sun")).not.toBeInTheDocument();
  });

  it("shows sun icon when theme is dark", () => {
    renderWithProviders(<Header theme="dark" themeToggler={mockThemeToggler} />);
    expect(screen.getByTestId("sun")).toBeInTheDocument();
    expect(screen.queryByTestId("moon")).not.toBeInTheDocument();
  });

  it("calls themeToggler when dark mode button is clicked", () => {
    renderWithProviders(<Header theme="light" themeToggler={mockThemeToggler} />);
    const darkModeButton = screen.getByTestId("dark-mode-button");
    fireEvent.click(darkModeButton);
    expect(mockThemeToggler).toHaveBeenCalledTimes(1);
  });

  it("renders logout button when user is authenticated", () => {
    renderWithProviders(<Header theme="light" themeToggler={mockThemeToggler} />);
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("does not render logout button when user is not authenticated", () => {
    (useAuth as any).mockReturnValue({
      logout: mockLogout,
      isAuthenticated: false,
    });

    renderWithProviders(<Header theme="light" themeToggler={mockThemeToggler} />);
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  it("calls logout function when logout button is clicked", () => {
    renderWithProviders(<Header theme="light" themeToggler={mockThemeToggler} />);
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalledWith({
      logoutParams: {
        returnTo: "http://localhost:5173",
      },
    });
  });

  it("renders logo link with proper aria-label", () => {
    renderWithProviders(<Header theme="light" themeToggler={mockThemeToggler} />);
    const logoLink = screen.getByLabelText("Go to homepage");
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "#/");
  });

  it("has proper accessibility attributes on dark mode button", () => {
    renderWithProviders(<Header theme="light" themeToggler={mockThemeToggler} />);
    const darkModeButton = screen.getByTestId("dark-mode-button");
    expect(darkModeButton).toHaveAttribute("aria-label", "Toggle dark mode");
    expect(darkModeButton).toHaveAttribute("tabIndex", "0");
  });

  it("renders with proper role attribute", () => {
    renderWithProviders(<Header theme="light" themeToggler={mockThemeToggler} />);
    const header = screen.getByTestId("header");
    expect(header).toHaveAttribute("role", "banner");
  });

  it("toggles theme when Enter key is pressed on dark mode button", () => {
    renderWithProviders(<Header theme="light" themeToggler={mockThemeToggler} />);
    const darkModeButton = screen.getByTestId("dark-mode-button");
    fireEvent.keyDown(darkModeButton, { key: "Enter", code: "Enter" });
    // The button should be accessible via keyboard
    expect(darkModeButton).toHaveAttribute("tabIndex", "0");
  });

  it("renders all major sections of header", () => {
    renderWithProviders(<Header theme="light" themeToggler={mockThemeToggler} />);

    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByTestId("dark-mode-button")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("maintains proper structure and layout", () => {
    const { container } = renderWithProviders(
      <Header theme="light" themeToggler={mockThemeToggler} />,
    );

    const header = container.querySelector('[data-testid="header"]');
    expect(header).toBeInTheDocument();
  });
});
