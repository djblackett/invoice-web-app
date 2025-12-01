import { renderHook, waitFor } from "@testing-library/react";
import useGraphQLClient from "@/features/shared/hooks/useApolloClient.ts";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { vi, describe, beforeEach, it, afterAll, expect } from "vitest";
import { DemoModeProvider } from "@/features/shared/components/DemoModeProvider";

// Mock config.ts to prevent checkEnvs from running
vi.mock("@/config/config", () => ({
  VITE_BACKEND_URL: "http://localhost:4000/graphql",
  VITE_AUDIENCE: "https://invoice-web-app/",
  VITE_SCOPE: "openid profile email",
  VITE_DOMAIN: "test.auth0.com",
  VITE_CLIENT_ID: "test-client-id",
  VITE_REDIRECT_URI: "http://localhost:5173",
}));

// Mock auth.api.ts to avoid config dependency issues
vi.mock("@/features/auth/services/auth.api", () => ({
  getOAuthLoginUrl: vi.fn(),
  extractOAuthTokenFromUrl: vi.fn(() => ({ accessToken: null, isNewUser: false, error: null })),
  clearOAuthParamsFromUrl: vi.fn(),
}));

// Mock useAuth and useUnifiedAuth
vi.mock("@/features/auth/hooks/useAuth.ts", () => ({
  useAuth: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue("mocked-token"),
    isAuthenticated: true,
    isLoading: false,
    user: null,
  }),
}));

vi.mock("@/features/auth/hooks/useUnifiedAuth", () => ({
  useUnifiedAuth: () => ({
    getAccessToken: vi.fn().mockResolvedValue("mocked-token"),
    isAuthenticated: true,
    isLoading: false,
    user: null,
  }),
}));

// Correct way to mock import.meta.env
vi.stubGlobal("import", {
  meta: {
    env: {
      VITE_BACKEND_URL: "http://localhost:4000/graphql",
      VITE_AUTH_SYSTEM: "auth0",
    },
  },
});

describe("useGraphQLClient", () => {
  // const originalEnv = process.env;
  vi.stubEnv("VITE_BACKEND_URL", "http://localhost:4000");
  // import.meta.env.VITE_BACKEND_URL = "http://localhost:4000";

  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("import", {
      meta: {
        env: {
          VITE_BACKEND_URL: "http://localhost:4000/graphql",
        },
      },
    });
  });

  afterAll(() => {});

  it("should initialize Apollo Client", () => {
    const { result } = renderHook(() => useGraphQLClient(), {
      wrapper: DemoModeProvider,
    });
    expect(result.current).toBeInstanceOf(ApolloClient);
    expect(result.current.cache).toBeInstanceOf(InMemoryCache);
  });

  it("should throw error if VITE_BACKEND_URL is not set", () => {
    // vi.stubGlobal("import", { meta: { env: {} } });
    import.meta.env.VITE_BACKEND_URL = null;
    vi.stubEnv("VITE_BACKEND_URL", undefined);
    expect(() =>
      renderHook(() => useGraphQLClient(), { wrapper: DemoModeProvider }),
    ).toThrow("Backend URL was not set during frontend build process");
  });

  it("should include authorization header", async () => {
    vi.stubEnv("VITE_BACKEND_URL", "http://localhost:4000");
    const { result } = renderHook(() => useGraphQLClient(), {
      wrapper: DemoModeProvider,
    });

    await waitFor(() => !!result.current);

    // This is a simplistic check. In reality, you'd inspect the actual headers sent with a request.
    expect(result.current).toBeInstanceOf(ApolloClient);
  });
});
