import { StrictMode } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "styled-components";
import { MemoryRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import store from "../../../src/app/store";
import { lightTheme } from "../../../src/features/shared/styles/Themes";
import {
  TemporarySessionProvider,
  useTemporarySession,
} from "../../../src/features/auth/demoSession/TemporarySessionProvider";
import { DemoSessionBoundary } from "../../../src/features/auth/components/DemoSessionBoundary";
import {
  clearStoredSession,
  loadStoredSession,
  saveSession,
  toStoredSession,
} from "../../../src/features/auth/demoSession/credentialStore";

const toasts = vi.hoisted(() => ({ error: vi.fn(), success: vi.fn() }));
vi.mock("react-toastify", () => ({
  toast: toasts,
  ToastContainer: () => null,
}));

const CREDENTIAL = `demo-session-v1.${"a".repeat(64)}`;
const NEW = `demo-session-v1.${"c".repeat(64)}`;
const future = () => new Date(Date.now() + 3600_000).toISOString();
const past = () => new Date(Date.now() - 3600_000).toISOString();
const created = () =>
  new Response(JSON.stringify({ credential: NEW, expiresAt: future() }), {
    status: 201,
  });

const fetchMock = vi.fn();

function Probe() {
  const session = useTemporarySession();
  if (!session) return <p>no session</p>;
  return (
    <>
      <output data-testid="phase">{session.phase}</output>
      <output data-testid="workspace">{session.workspace}</output>
      <button onClick={session.markExpired}>expire</button>
      <button onClick={session.workspaceReplaced}>replace</button>
      <button
        onClick={() => {
          void session.startNew();
        }}
      >
        renew
      </button>
    </>
  );
}

function renderSession(onWorkspaceChange?: () => void, strict = false) {
  const tree = (
    <ReduxProvider store={store}>
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <TemporarySessionProvider onWorkspaceChange={onWorkspaceChange}>
            <DemoSessionBoundary>
              <div>Routed content</div>
            </DemoSessionBoundary>
            <Probe />
          </TemporarySessionProvider>
        </MemoryRouter>
      </ThemeProvider>
    </ReduxProvider>
  );
  return render(strict ? <StrictMode>{tree}</StrictMode> : tree);
}

beforeEach(() => {
  vi.stubEnv("VITE_BACKEND_URL", "http://localhost:8000/graphql");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  vi.clearAllMocks();
  localStorage.clear();
  clearStoredSession();
});
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("temporary session lifecycle", () => {
  it("resumes a stored credential without any request", () => {
    saveSession(toStoredSession(CREDENTIAL, future()));
    renderSession();
    expect(screen.getByText("Routed content")).toBeInTheDocument();
    expect(screen.getByTestId("phase")).toHaveTextContent("ready");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("allocates exactly once on first entry, even under StrictMode, then shows the app", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(created()));
    renderSession(undefined, true);
    expect(
      screen.getByText("Preparing your private demo…"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Routed content")).not.toBeInTheDocument();
    await screen.findByText("Routed content");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(loadStoredSession()?.credential).toBe(NEW);
  });

  it("stops at an explanation when first allocation fails and retries only on request", async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ code: "DEMO_SESSIONS_CAPACITY" }), {
          status: 503,
        }),
      ),
    );
    renderSession();
    await screen.findByText("Your private demo couldn't be started.");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "private workspaces are in use",
    );
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(loadStoredSession()).toBeNull();

    fetchMock.mockImplementation(() => Promise.resolve(created()));
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    await screen.findByText("Routed content");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("shows the expired screen for a clock-expired stored credential without a request", () => {
    saveSession(toStoredSession(CREDENTIAL, past()));
    renderSession();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "This demo workspace has expired.",
    );
    expect(screen.queryByText("Routed content")).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("replaces an expired workspace only when the visitor asks, and swaps the workspace once", async () => {
    saveSession(toStoredSession(CREDENTIAL, future()));
    const onChange = vi.fn();
    localStorage.setItem("cachedNewInvoiceForm", "{}");
    renderSession(onChange);
    act(() => screen.getByRole("button", { name: "expire" }).click());
    expect(screen.getByTestId("phase")).toHaveTextContent("expired");
    expect(fetchMock).not.toHaveBeenCalled(); // never silent

    fetchMock.mockImplementation(() => Promise.resolve(created()));
    fireEvent.click(screen.getByRole("button", { name: "Start a new demo" }));
    await screen.findByText("Routed content");
    expect(loadStoredSession()?.credential).toBe(NEW);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("cachedNewInvoiceForm")).toBeNull();
  });

  it("keeps the expired notice and the old credential when the replacement is refused", async () => {
    saveSession(toStoredSession(CREDENTIAL, future()));
    renderSession();
    act(() => screen.getByRole("button", { name: "expire" }).click());
    fetchMock.mockImplementation(() =>
      Promise.resolve(new Response(null, { status: 429 })),
    );
    fireEvent.click(screen.getByRole("button", { name: "Start a new demo" }));
    await screen.findByText(/Lots of people are starting demos/);
    expect(screen.getByTestId("phase")).toHaveTextContent("expired");
    expect(loadStoredSession()?.credential).toBe(CREDENTIAL);
  });

  it("a refused voluntary new demo leaves a working workspace alone and says why", async () => {
    saveSession(toStoredSession(CREDENTIAL, future()));
    renderSession();
    fetchMock.mockImplementation(() =>
      Promise.resolve(new Response(null, { status: 429 })),
    );
    fireEvent.click(screen.getByRole("button", { name: "renew" }));
    await waitFor(() => expect(toasts.error).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("phase")).toHaveTextContent("ready");
    expect(screen.getByText("Routed content")).toBeInTheDocument();
    expect(loadStoredSession()?.credential).toBe(CREDENTIAL);
  });

  it("a reset remounts content, clears drafts and notifies the router", () => {
    saveSession(toStoredSession(CREDENTIAL, future()));
    localStorage.setItem("cachedEditForm", "{}");
    const onChange = vi.fn();
    renderSession(onChange);
    expect(screen.getByTestId("workspace")).toHaveTextContent("0");
    act(() => screen.getByRole("button", { name: "replace" }).click());
    expect(screen.getByTestId("workspace")).toHaveTextContent("1");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("cachedEditForm")).toBeNull();
    expect(loadStoredSession()?.credential).toBe(CREDENTIAL);
  });

  it("reloads when another tab stores a different credential, and ignores the same one", () => {
    saveSession(toStoredSession(CREDENTIAL, future()));
    const reload = vi.fn();
    vi.stubGlobal("location", { ...window.location, reload });
    renderSession();
    const key = "invoice-web-app:demo-session:v1";
    localStorage.setItem(
      key,
      JSON.stringify(toStoredSession(CREDENTIAL, future())),
    );
    window.dispatchEvent(new StorageEvent("storage", { key }));
    expect(reload).not.toHaveBeenCalled();
    localStorage.setItem(key, JSON.stringify(toStoredSession(NEW, future())));
    window.dispatchEvent(new StorageEvent("storage", { key }));
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
