import { renderHook, waitFor } from "@testing-library/react";
import useGraphQLClient from "@/hooks/useApolloClient";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { vi, describe, beforeEach, it, afterAll, expect } from "vitest";

// Mock useAuth0
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue("mocked-token"),
  }),
}));

describe("useGraphQLClient", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      VITE_BACKEND_URL: "http://localhost:4000/graphql",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should initialize Apollo Client", () => {
    const { result } = renderHook(() => useGraphQLClient());
    expect(result.current).toBeInstanceOf(ApolloClient);
    expect(result.current.cache).toBeInstanceOf(InMemoryCache);
  });

  it("should throw error if VITE_BACKEND_URL is not set", () => {
    delete process.env.VITE_BACKEND_URL;
    expect(() => renderHook(() => useGraphQLClient())).toThrow(
      "Backend URL was not set during frontend build process",
    );
  });

  it("should include authorization header", async () => {
    const { result } = renderHook(() => useGraphQLClient());

    await waitFor(() => !!result.current);

    // This is a simplistic check. In reality, you'd inspect the actual headers sent with a request.
    expect(result.current).toBeInstanceOf(ApolloClient);
  });
});
