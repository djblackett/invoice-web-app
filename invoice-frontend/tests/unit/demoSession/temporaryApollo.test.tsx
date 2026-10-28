import type { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { gql } from "@apollo/client";
import useGraphQLClient from "../../../src/features/shared/hooks/useApolloClient";
import { DemoModeProvider } from "../../../src/features/shared/components/DemoModeProvider";
import { DemoAuthProvider } from "../../../src/features/auth/components/DemoAuthProvider";
import {
  TemporarySessionProvider,
  useTemporarySession,
} from "../../../src/features/auth/demoSession/TemporarySessionProvider";
import {
  clearStoredSession,
  saveSession,
  toStoredSession,
} from "../../../src/features/auth/demoSession/credentialStore";

const ws = vi.hoisted(() => ({ createClient: vi.fn(() => ({})) }));
vi.mock("graphql-ws", () => ({ createClient: ws.createClient }));
vi.mock("react-toastify", () => ({ toast: { error: vi.fn() } }));

const CREDENTIAL = `demo-session-v1.${"a".repeat(64)}`;
const QUERY = gql`
  query Q {
    allInvoices {
      id
    }
  }
`;
const fetchMock = vi.fn();

const wrap = (temporary: boolean) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <DemoModeProvider>
      <DemoAuthProvider>
        {temporary ? (
          <TemporarySessionProvider>{children}</TemporarySessionProvider>
        ) : (
          children
        )}
      </DemoAuthProvider>
    </DemoModeProvider>
  );
  Wrapper.displayName = "TestWrapper";
  return Wrapper;
};

beforeEach(() => {
  vi.stubEnv("VITE_BACKEND_URL", "http://localhost:8000");
  vi.stubEnv("VITE_DEMO_MODE", "true");
  sessionStorage.clear();
  localStorage.clear();
  clearStoredSession();
  fetchMock.mockReset();
  fetchMock.mockImplementation(() =>
    Promise.resolve(
      new Response(JSON.stringify({ data: { allInvoices: [] } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ),
  );
  vi.stubGlobal("fetch", fetchMock);
  ws.createClient.mockClear();
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const sentAuthorization = () =>
  (fetchMock.mock.calls[0] as [string, RequestInit])[1].headers as Record<
    string,
    string
  >;

describe("Apollo client in temporary-session mode", () => {
  it("presents the private credential, never the shared demo token, and builds no WebSocket", async () => {
    saveSession(
      toStoredSession(
        CREDENTIAL,
        new Date(Date.now() + 3600_000).toISOString(),
      ),
    );
    const { result } = renderHook(() => useGraphQLClient(), {
      wrapper: wrap(true),
    });
    await result.current.query({ query: QUERY });
    expect(sentAuthorization()["authorization"]).toBe(`Bearer ${CREDENTIAL}`);
    expect(ws.createClient).not.toHaveBeenCalled();
  });

  it("replaces the client, and its cache, only when the identity changes", async () => {
    const credential = `demo-session-v1.${"a".repeat(64)}`;
    const next = `demo-session-v1.${"d".repeat(64)}`;
    saveSession(
      toStoredSession(
        credential,
        new Date(Date.now() + 3600_000).toISOString(),
      ),
    );
    const { result, rerender } = renderHook(
      () => ({ client: useGraphQLClient(), session: useTemporarySession() }),
      { wrapper: wrap(true) },
    );
    const first = result.current.client;
    await first.query({ query: QUERY });
    expect(Object.keys(first.cache.extract()).length).toBeGreaterThan(0);
    rerender();
    expect(result.current.client).toBe(first); // stable while the identity is

    fetchMock.mockImplementationOnce(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            credential: next,
            expiresAt: new Date(Date.now() + 3600_000).toISOString(),
          }),
          { status: 201 },
        ),
      ),
    );
    await act(async () => {
      await result.current.session?.startNew();
    });
    const second = result.current.client;
    expect(second).not.toBe(first);
    expect(Object.keys(second.cache.extract())).toEqual([]);
    fetchMock.mockClear();
    await second.query({ query: QUERY });
    expect(sentAuthorization()["authorization"]).toBe(`Bearer ${next}`);
  });

  it("is unchanged outside temporary mode: shared demo token and WebSocket link", async () => {
    const { result } = renderHook(() => useGraphQLClient(), {
      wrapper: wrap(false),
    });
    await result.current.query({ query: QUERY });
    expect(sentAuthorization()["authorization"]).toBe("Bearer demo-token");
    expect(ws.createClient).toHaveBeenCalledTimes(1);
  });
});
