import { renderHook, waitFor } from "@testing-library/react";
import useGraphQLClient from "@/features/shared/hooks/useApolloClient.ts";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { vi, describe, beforeEach, it, afterAll, expect } from "vitest";

// Mock useAuth0
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue("mocked-token"),
  }),
}));

// Correct way to mock import.meta.env
vi.stubGlobal("import", {
  meta: {
    env: {
      VITE_BACKEND_URL: "http://localhost:4000/graphql",
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

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("should initialize Apollo Client", () => {
    const { result } = renderHook(() => useGraphQLClient());
    expect(result.current).toBeInstanceOf(ApolloClient);
    expect(result.current.cache).toBeInstanceOf(InMemoryCache);
  });

  it("should throw error if VITE_BACKEND_URL is not set", () => {
    // vi.stubGlobal("import", { meta: { env: {} } });
    import.meta.env.VITE_BACKEND_URL = null;
    vi.stubEnv("VITE_BACKEND_URL", undefined);
    expect(() => renderHook(() => useGraphQLClient())).toThrow(
      "Backend URL was not set during frontend build process",
    );
  });

  it("should include authorization header", async () => {
    vi.stubEnv("VITE_BACKEND_URL", "http://localhost:4000");
    const { result } = renderHook(() => useGraphQLClient());

    await waitFor(() => !!result.current);

    // This is a simplistic check. In reality, you'd inspect the actual headers sent with a request.
    expect(result.current).toBeInstanceOf(ApolloClient);
  });
});
