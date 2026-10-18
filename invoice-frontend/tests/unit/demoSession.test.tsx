import { StrictMode, useState } from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "../../src/features/shared/styles/Themes";
import { DemoSessionBoundary } from "../../src/features/auth/components/DemoSessionBoundary";
import {
  DemoModeProvider,
  useDemoModeContext,
} from "../../src/features/shared/components/DemoModeProvider";
import DemoButton from "../../src/features/shared/components/buttons/DemoButton";
import { RESET_DEMO_DATA } from "../../src/features/auth/graphql/demo.mutations";

const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  clearStore: vi.fn(),
  refetchQueries: vi.fn(),
  reset: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
}));
vi.mock("@apollo/client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@apollo/client")>()),
  useApolloClient: () => mocks,
  useMutation: () => [mocks.reset, { loading: false }],
}));
vi.mock("react-toastify", () => ({
  toast: { success: mocks.success, error: mocks.error },
  ToastContainer: () => null,
}));

function Session() {
  const { isDemoMode, setIsDemoMode } = useDemoModeContext();
  const [visible, setVisible] = useState(true);
  return (
    <>
      <output data-testid="mode">{String(isDemoMode)}</output>
      <button onClick={() => setIsDemoMode(false)}>Leave demo</button>
      <button onClick={() => setIsDemoMode(true)}>Enter demo</button>
      <button onClick={() => setVisible((value) => !value)}>
        Toggle boundary
      </button>
      {visible && (
        <DemoSessionBoundary>
          <div>Canonical invoices ready</div>
        </DemoSessionBoundary>
      )}
    </>
  );
}
beforeEach(() => {
  sessionStorage.clear();
  vi.stubEnv("VITE_DEMO_MODE", "true");
  vi.stubEnv("VITE_BACKEND_URL", "http://localhost:8000/graphql");
  vi.clearAllMocks();
  mocks.mutate.mockResolvedValue({ data: { resetDemoData: true } });
  mocks.reset.mockResolvedValue({ data: { resetDemoData: true } });
  mocks.clearStore.mockResolvedValue(undefined);
  mocks.refetchQueries.mockResolvedValue([]);
});
afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.unstubAllEnvs();
});

describe("deliberate demo entry", () => {
  it("waits for the server reset once, including StrictMode, rerenders and incidental boundary remounts", async () => {
    render(
      <StrictMode>
        <DemoModeProvider>
          <Session />
        </DemoModeProvider>
      </StrictMode>,
    );
    expect(
      screen.queryByText("Canonical invoices ready"),
    ).not.toBeInTheDocument();
    await screen.findByText("Canonical invoices ready");
    expect(mocks.mutate).toHaveBeenCalledExactlyOnceWith({
      mutation: RESET_DEMO_DATA,
    });
    fireEvent.click(screen.getByText("Enter demo")); // already active: no new entry
    fireEvent.click(screen.getByText("Toggle boundary"));
    fireEvent.click(screen.getByText("Toggle boundary"));
    await screen.findByText("Canonical invoices ready");
    expect(mocks.mutate).toHaveBeenCalledTimes(1);
    expect(mocks.clearStore).toHaveBeenCalledTimes(1);
  });

  it("preserves a successfully initialized entry when the provider remounts after reload", async () => {
    const first = render(
      <DemoModeProvider>
        <Session />
      </DemoModeProvider>,
    );
    await screen.findByText("Canonical invoices ready");
    expect(mocks.mutate).toHaveBeenCalledTimes(1);
    first.unmount();
    render(
      <DemoModeProvider>
        <Session />
      </DemoModeProvider>,
    );
    await screen.findByText("Canonical invoices ready");
    expect(mocks.mutate).toHaveBeenCalledTimes(1);
  });

  it("resets again on a deliberate leave-and-enter transition", async () => {
    render(
      <DemoModeProvider>
        <Session />
      </DemoModeProvider>,
    );
    await screen.findByText("Canonical invoices ready");
    fireEvent.click(screen.getByText("Leave demo"));
    fireEvent.click(screen.getByText("Enter demo"));
    await screen.findByText("Canonical invoices ready");
    expect(mocks.mutate).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId("mode")).toHaveTextContent("true");
  });

  it("shows an entry failure and retries explicitly without displaying stale invoices", async () => {
    mocks.mutate.mockRejectedValueOnce(new Error("Unavailable"));
    render(
      <DemoModeProvider>
        <Session />
      </DemoModeProvider>,
    );
    await screen.findByRole("alert");
    expect(
      screen.queryByText("Canonical invoices ready"),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Retry Demo"));
    await screen.findByText("Canonical invoices ready");
    expect(mocks.mutate).toHaveBeenCalledTimes(2);
  });

  it("does not reset in normal mode", () => {
    vi.stubEnv("VITE_DEMO_MODE", "false");
    render(
      <DemoModeProvider>
        <Session />
      </DemoModeProvider>,
    );
    expect(screen.getByText("Canonical invoices ready")).toBeInTheDocument();
    expect(mocks.mutate).not.toHaveBeenCalled();
  });

  it("hides demo entry controls when the deployment has not enabled demo", async () => {
    vi.stubEnv("VITE_DEMO_MODE", "false");
    const { default: Login } = await import(
      "../../src/features/auth/pages/Login"
    );
    render(
      <DemoModeProvider>
        <ThemeProvider theme={lightTheme}>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </ThemeProvider>
      </DemoModeProvider>,
    );
    expect(screen.queryByTestId("demo-login-button")).not.toBeInTheDocument();
  });
});

describe("manual Reset Demo", () => {
  it("resets and refreshes invoice state, with feedback while staying in demo", async () => {
    function Control() {
      const { isDemoMode } = useDemoModeContext();
      return (
        <>
          <output data-testid="mode">{String(isDemoMode)}</output>
          <DemoButton />
        </>
      );
    }
    render(
      <DemoModeProvider>
        <ThemeProvider theme={lightTheme}>
          <Control />
        </ThemeProvider>
      </DemoModeProvider>,
    );
    fireEvent.click(screen.getByText("Reset Demo"));
    await waitFor(() =>
      expect(mocks.success).toHaveBeenCalledWith("Demo invoices restored"),
    );
    expect(mocks.reset).toHaveBeenCalledTimes(1);
    expect(mocks.clearStore).toHaveBeenCalledTimes(1);
    expect(mocks.refetchQueries).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("mode")).toHaveTextContent("true");
  });

  it("reports a reset failure and allows retry", async () => {
    mocks.reset.mockRejectedValueOnce(new Error("Unavailable"));
    render(
      <ThemeProvider theme={lightTheme}>
        <DemoButton />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText("Reset Demo"));
    await waitFor(() => expect(mocks.error).toHaveBeenCalled());
    expect(mocks.clearStore).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Reset Demo"));
    await waitFor(() => expect(mocks.success).toHaveBeenCalled());
    expect(mocks.reset).toHaveBeenCalledTimes(2);
  });
});
