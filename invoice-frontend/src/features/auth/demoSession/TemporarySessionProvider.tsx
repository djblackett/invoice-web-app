import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { toast } from "react-toastify";
import {
  clearFormDrafts,
  getCredential,
  isAdvisorilyExpired,
  loadStoredSession,
  onForeignSessionChange,
} from "./credentialStore";
import { describeAllocationFailure } from "./demoErrors";
import {
  obtainSession,
  type AllocationFailure,
  type AllocationResult,
} from "./sessionApi";

export type SessionPhase =
  | "starting" // no workspace yet: allocating the first one
  | "ready"
  | "expired" // the server (or, advisorily, the clock) says this workspace ended
  | "failed"; // the first allocation failed; nothing is stored

interface State {
  phase: SessionPhase;
  expiresAt: string | null;
  failure: AllocationFailure | null;
  /** True while a new workspace is being allocated. */
  renewing: boolean;
  /** Changes with the credential: Apollo client and its cache are replaced. */
  identity: number;
  /** Changes with the credential AND on reset: routed content is remounted. */
  workspace: number;
}

type Action =
  | { type: "renewing" }
  | { type: "allocated"; expiresAt: string }
  | { type: "allocation-failed"; failure: AllocationFailure }
  | { type: "expired" }
  | { type: "workspace-replaced" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "renewing":
      return { ...state, renewing: true, failure: null };
    case "allocated":
      return {
        phase: "ready",
        expiresAt: action.expiresAt,
        failure: null,
        renewing: false,
        identity: state.identity + 1,
        workspace: state.workspace + 1,
      };
    case "allocation-failed":
      return {
        ...state,
        // A failed first allocation has nothing to fall back on; every other
        // phase keeps what it had (a live workspace, or the expiry notice).
        phase: state.phase === "starting" ? "failed" : state.phase,
        renewing: false,
        failure: action.failure,
      };
    case "expired":
      return state.phase === "ready" ? { ...state, phase: "expired" } : state;
    case "workspace-replaced":
      return { ...state, workspace: state.workspace + 1 };
  }
}

function initialState(): State {
  const stored = loadStoredSession();
  return {
    phase: !stored
      ? "starting"
      : isAdvisorilyExpired(stored)
        ? "expired"
        : "ready",
    expiresAt: stored?.expiresAt ?? null,
    failure: null,
    renewing: false,
    identity: 0,
    workspace: 0,
  };
}

export interface TemporarySession extends State {
  /**
   * Allocates a new workspace. The previous credential is replaced only when
   * allocation succeeds. Resolves true on success; never retries by itself.
   */
  startNew: () => Promise<boolean>;
  /** The server rejected the credential (401/UNAUTHENTICATED). */
  markExpired: () => void;
  /** The workspace's invoices were replaced (reset): drop everything cached. */
  workspaceReplaced: () => void;
}

const TemporarySessionContext = createContext<TemporarySession | null>(null);

/** null outside temporary-session mode (Auth0 users and the shared demo). */
export const useTemporarySession = () => useContext(TemporarySessionContext);

export function TemporarySessionProvider({
  children,
  onWorkspaceChange,
}: {
  children: ReactNode;
  /**
   * Called in the same tick as every workspace swap (new session or reset),
   * before the pages remount: the router's chance to leave routes that name
   * invoice IDs of the workspace being replaced.
   */
  onWorkspaceChange?: () => void;
}) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const changed = useRef(onWorkspaceChange);
  changed.current = onWorkspaceChange;
  const pending = useRef<Promise<boolean> | null>(null);
  const phaseRef = useRef(state.phase);
  phaseRef.current = state.phase;

  const startNew = useCallback(() => {
    // StrictMode replays, double clicks and re-renders share one allocation.
    if (pending.current) return pending.current;
    dispatch({ type: "renewing" });
    const run = obtainSession(getCredential())
      .catch(
        (): AllocationResult => ({
          ok: false,
          failure: { kind: "unavailable" },
        }),
      )
      .then((result) => {
        pending.current = null;
        if (result.ok) {
          // Drafts and cached invoices belong to the workspace being left.
          clearFormDrafts();
          changed.current?.();
          dispatch({ type: "allocated", expiresAt: result.session.expiresAt });
          return true;
        }
        dispatch({ type: "allocation-failed", failure: result.failure });
        // A visitor with a working demo gets a toast; otherwise the screen says it.
        if (phaseRef.current === "ready")
          toast.error(describeAllocationFailure(result.failure), {
            toastId: "demo-session-error",
            autoClose: 6000,
          });
        return false;
      });
    pending.current = run;
    return run;
  }, []);

  // First entry without a stored credential: one allocation attempt. A failure
  // stops at the "failed" screen; only the visitor's button tries again.
  useEffect(() => {
    if (phaseRef.current === "starting") void startNew();
  }, [startNew]);

  // Another tab replaced or removed the credential: this tab's cached
  // invoices belong to a workspace the browser no longer uses.
  useEffect(
    () =>
      onForeignSessionChange((credential) => {
        if (credential !== getCredential()) window.location.reload();
      }),
    [],
  );

  const markExpired = useCallback(() => dispatch({ type: "expired" }), []);
  const workspaceReplaced = useCallback(() => {
    clearFormDrafts();
    changed.current?.();
    dispatch({ type: "workspace-replaced" });
  }, []);

  const value = useMemo<TemporarySession>(
    () => ({ ...state, startNew, markExpired, workspaceReplaced }),
    [state, startNew, markExpired, workspaceReplaced],
  );
  return (
    <TemporarySessionContext.Provider value={value}>
      {children}
    </TemporarySessionContext.Provider>
  );
}
