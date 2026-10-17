import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DemoAuthProvider } from "../../src/features/auth/components/DemoAuthProvider";
import { useAuth } from "../../src/features/auth/hooks/useAuth";
import {
  DemoModeProvider,
  useDemoModeContext,
} from "../../src/features/shared/components/DemoModeProvider";
import { Role } from "../../src/features/users/types/userTypes";

// Avoid mounting the full invoice app or contacting Auth0. Production demo
// state/providers and config remain real; no shared frontend harness changes.
vi.mock("../../src/features/auth/components/Auth0ProviderWrapper", () => ({
  Auth0ProviderWrapper: () => <div data-testid="auth0-provider" />,
}));
vi.mock("../../src/app/App", () => ({
  default: () => <div data-testid="demo-app" />,
}));

function AuthProbe() {
  const auth = useAuth();
  return (
    <>
      <output data-testid="identity">
        {auth.isAuthenticated ? auth.user?.id : "anonymous"}
      </output>
      <output data-testid="role">{auth.user?.role}</output>
      <button onClick={() => auth.loginWithRedirect()}>Demo login</button>
      <button onClick={() => auth.toggleAdmin()}>
        Historical admin toggle
      </button>
    </>
  );
}

beforeEach(() => {
  vi.stubEnv("VITE_BACKEND_URL", "http://localhost:8000/graphql");
  for (const key of [
    "VITE_AUDIENCE",
    "VITE_SCOPE",
    "VITE_DOMAIN",
    "VITE_CLIENT_ID",
    "VITE_REDIRECT_URI",
  ]) {
    vi.stubEnv(key, undefined);
  }
});
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("demo initialization contract", () => {
  it("loads build-time demo config without Auth0 environment values", async () => {
    vi.stubEnv("VITE_DEMO_MODE", "true");
    const config = await import("../../src/config/config");
    expect(config.isDemoMode).toBe(true);
    expect(config.VITE_DOMAIN).toBeUndefined();
    expect(config.VITE_CLIENT_ID).toBeUndefined();
  });

  it("allows runtime demo entry without requiring Auth0 config at module load", async () => {
    vi.stubEnv("VITE_DEMO_MODE", "false");
    // AppWrapper imports config before a visitor can use the runtime toggle.
    await expect(import("../../src/config/config")).resolves.toBeDefined();
  });

  it("selects the demo provider on a build-time demo boot", async () => {
    vi.stubEnv("VITE_DEMO_MODE", "true");
    const { default: AppWrapper } = await import("../../src/app/AppWrapper");
    // resetModules also recreates React contexts; use the same module instance
    // as this freshly imported AppWrapper rather than the static probe provider.
    const { DemoModeProvider: BootDemoProvider } = await import(
      "../../src/features/shared/components/DemoModeProvider"
    );
    render(
      <BootDemoProvider>
        <AppWrapper />
      </BootDemoProvider>,
    );
    expect(screen.queryByTestId("auth0-provider")).not.toBeInTheDocument();
    expect(screen.getByTestId("demo-app")).toBeInTheDocument();
  });

  it("logs in as the normal demo USER without an Auth0 provider or network login", async () => {
    render(
      <DemoAuthProvider>
        <AuthProbe />
      </DemoAuthProvider>,
    );
    fireEvent.click(screen.getByText("Demo login"));
    expect(screen.getByTestId("identity")).toHaveTextContent("demoId");
    expect(screen.getByTestId("role")).toHaveTextContent(String(Role.USER));
  });

  it("authenticates the normal USER when runtime demo state is entered", () => {
    function RuntimeEntry() {
      const { isDemoMode, setIsDemoMode } = useDemoModeContext();
      return isDemoMode ? (
        <DemoAuthProvider>
          <AuthProbe />
        </DemoAuthProvider>
      ) : (
        <button onClick={() => setIsDemoMode(true)}>Enter demo</button>
      );
    }
    render(
      <DemoModeProvider>
        <RuntimeEntry />
      </DemoModeProvider>,
    );
    fireEvent.click(screen.getByText("Enter demo"));
    expect(screen.getByTestId("identity")).toHaveTextContent("demoId");
    expect(screen.getByTestId("role")).toHaveTextContent(String(Role.USER));
  });

  it("never grants ADMIN through the historical anonymous role toggle", () => {
    render(
      <DemoAuthProvider>
        <AuthProbe />
      </DemoAuthProvider>,
    );
    fireEvent.click(screen.getByText("Demo login"));
    fireEvent.click(screen.getByText("Historical admin toggle"));
    expect.soft(screen.getByTestId("identity")).toHaveTextContent("demoId");
    expect(screen.getByTestId("role")).not.toHaveTextContent(
      String(Role.ADMIN),
    );
  });
});
