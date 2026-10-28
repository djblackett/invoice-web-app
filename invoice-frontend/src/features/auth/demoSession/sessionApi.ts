import {
  isCredentialShape,
  loadStoredSession,
  saveSession,
  toStoredSession,
  isAdvisorilyExpired,
  type StoredDemoSession,
} from "./credentialStore";

export type AllocationFailureKind =
  | "capacity" // every workspace slot is in use (503 DEMO_SESSIONS_CAPACITY)
  | "throttled" // too many new demos right now (429)
  | "disabled" // the backend is not offering temporary workspaces (404)
  | "unavailable" // backend or network trouble; nothing was created that we know of
  | "unknown";

export interface AllocationFailure {
  kind: AllocationFailureKind;
  retryAfterSeconds?: number;
}

export type AllocationResult =
  | { ok: true; session: StoredDemoSession }
  | { ok: false; failure: AllocationFailure };

const ALLOCATION_TIMEOUT_MS = 15_000;
const LOCK_NAME = "invoice-web-app:demo-session-allocation";

function allocationUrl() {
  // The GraphQL endpoint is VITE_BACKEND_URL itself; the allocation route is
  // an absolute path on the same origin.
  return new URL("/demo/sessions", import.meta.env.VITE_BACKEND_URL).href;
}

function retryAfter(response: Response) {
  const header =
    response.headers.get("Retry-After") ??
    response.headers.get("RateLimit-Reset");
  const seconds = Number(header);
  return Number.isFinite(seconds) && seconds > 0
    ? { retryAfterSeconds: Math.ceil(seconds) }
    : {};
}

async function errorCode(response: Response) {
  try {
    const body = (await response.json()) as { code?: unknown };
    return typeof body.code === "string" ? body.code : undefined;
  } catch {
    return undefined;
  }
}

/**
 * One POST /demo/sessions. Never retried here: a timeout leaves it unknown
 * whether the server created a workspace, and only the visitor may choose to
 * try again. Nothing here logs the response.
 */
export async function allocateSession(): Promise<AllocationResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ALLOCATION_TIMEOUT_MS);
  try {
    const response = await fetch(allocationUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      cache: "no-store",
      credentials: "omit",
      signal: controller.signal,
    });
    if (response.status === 201) {
      const body = (await response.json()) as {
        credential?: unknown;
        expiresAt?: unknown;
      };
      if (
        isCredentialShape(body.credential) &&
        typeof body.expiresAt === "string" &&
        Number.isFinite(Date.parse(body.expiresAt))
      )
        return {
          ok: true,
          session: toStoredSession(body.credential, body.expiresAt),
        };
      return { ok: false, failure: { kind: "unknown" } };
    }
    if (response.status === 429)
      return {
        ok: false,
        failure: { kind: "throttled", ...retryAfter(response) },
      };
    if (response.status === 404)
      return { ok: false, failure: { kind: "disabled" } };
    if (response.status === 503) {
      const code = await errorCode(response);
      return {
        ok: false,
        failure: {
          kind: code === "DEMO_SESSIONS_CAPACITY" ? "capacity" : "unavailable",
        },
      };
    }
    return { ok: false, failure: { kind: "unknown" } };
  } catch {
    return { ok: false, failure: { kind: "unavailable" } };
  } finally {
    clearTimeout(timer);
  }
}

const withAllocationLock = <T>(work: () => Promise<T>): Promise<T> =>
  typeof navigator !== "undefined" && navigator.locks
    ? navigator.locks.request(LOCK_NAME, work)
    : work();

/**
 * Returns a workspace for this browser, creating at most one.
 *
 * `replacing` is the credential this page is giving up (null on first entry).
 * Under a cross-tab lock the stored entry is re-read first: if another tab
 * already stored a different, plausibly live credential, that one is adopted
 * instead of allocating a second workspace. The new credential is stored only
 * after allocation succeeds, so a failed attempt never discards the old one.
 */
export function obtainSession(
  replacing: string | null,
): Promise<AllocationResult> {
  return withAllocationLock(async () => {
    const stored = loadStoredSession();
    if (
      stored &&
      stored.credential !== replacing &&
      !isAdvisorilyExpired(stored)
    )
      return { ok: true as const, session: stored };
    const result = await allocateSession();
    if (result.ok) saveSession(result.session);
    return result;
  });
}
