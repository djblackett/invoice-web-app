import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "../testUtils";
import Login from "@/features/auth/pages/Login";

// Mock auth hooks
vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock("@/config/config", () => ({
  BACKEND_URL: "http://localhost:4000",
  VITE_BACKEND_URL: "http://localhost:4000",
  VITE_AUDIENCE: "https://invoice-web-app/",
  VITE_SCOPE: "openid profile email",
  VITE_DOMAIN: "test.auth0.com",
  VITE_CLIENT_ID: "test-client-id",
  VITE_REDIRECT_URI: "http://localhost:5173",
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Authentication Flow Integration Tests", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VITE_BACKEND_URL", "http://localhost:4000");
  });

  it("should render login page with welcome message", () => {
    render(<Login />);

    expect(screen.getByTestId("welcome-text")).toBeInTheDocument();
  });

  it("should display login button when not authenticated", () => {
    render(<Login />);

    const loginButton = screen.getByTestId("login-button");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveTextContent("Login");
  });

  it("should have clickable login button", () => {
    render(<Login />);

    const loginButton = screen.getByTestId("login-button");
    expect(loginButton).toBeEnabled();
  });

  it("should display application branding", () => {
    render(<Login />);

    const welcomeText = screen.getByTestId("welcome-text");
    expect(welcomeText).toBeInTheDocument();
  });

  it("should have proper layout structure", () => {
    const { container } = render(<Login />);

    expect(container.firstChild).toBeInTheDocument();
  });
});
