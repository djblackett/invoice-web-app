// Browser persistence for a temporary demo-session credential.
//
// The credential is a bearer secret for one disposable workspace. It lives in
// localStorage (so a refresh or a reopened browser resumes the workspace) under
// a namespaced key, never in a URL, a log line or Apollo's cache. The server
// owns expiry, revocation and revalidation: `expiresAt` here is only a hint
// for choosing which screen to show first.

const STORAGE_KEY = "invoice-web-app:demo-session:v1";
// Unsent new-invoice / edit drafts belong to one workspace, so they leave with it.
const DRAFT_KEYS = ["cachedNewInvoiceForm", "cachedEditForm"] as const;
const CREDENTIAL_PATTERN = /^demo-session-v1\.[0-9a-f]{64}$/;
// A browser clock a few minutes fast must not discard a live workspace; past
// this margin we stop trusting the clock less than the server.
const CLOCK_SKEW_MS = 5 * 60 * 1000;

export interface StoredDemoSession {
  credential: string;
  /** ISO timestamp from POST /demo/sessions. Advisory only. */
  expiresAt: string;
  /** The API this credential belongs to; never sent anywhere else. */
  backend: string;
}

const backendOrigin = () => {
  try {
    return new URL(import.meta.env.VITE_BACKEND_URL ?? "").origin;
  } catch {
    return "";
  }
};

// Mirrors storage so the session still works for this page if storage throws
// (blocked or private-mode browsers); it then simply does not survive a reload.
let memory: StoredDemoSession | null = null;

function parse(raw: string | null): StoredDemoSession | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<StoredDemoSession> | null;
    if (
      value &&
      typeof value.credential === "string" &&
      CREDENTIAL_PATTERN.test(value.credential) &&
      typeof value.expiresAt === "string" &&
      Number.isFinite(Date.parse(value.expiresAt)) &&
      value.backend === backendOrigin()
    )
      return { ...value } as StoredDemoSession;
  } catch {
    /* corrupt entry: treated as absent below */
  }
  return null;
}

/** Re-reads storage (another tab may have changed it) and returns a valid entry or null. */
export function loadStoredSession(): StoredDemoSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored = parse(raw);
    if (raw && !stored) localStorage.removeItem(STORAGE_KEY);
    memory = stored;
    return stored;
  } catch {
    return memory;
  }
}

export function saveSession(session: StoredDemoSession) {
  memory = session;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* memory copy still serves this page */
  }
}

export function clearStoredSession() {
  memory = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing persisted to remove */
  }
}

/** The credential the current page should present. Memory only: no storage read per request. */
export function getCredential(): string | null {
  return memory?.credential ?? null;
}

/** Builds the stored form of a freshly allocated session. */
export function toStoredSession(
  credential: string,
  expiresAt: string,
): StoredDemoSession {
  return { credential, expiresAt, backend: backendOrigin() };
}

export function isCredentialShape(value: unknown): value is string {
  return typeof value === "string" && CREDENTIAL_PATTERN.test(value);
}

/** Advisory: true only when the clock says the session ended more than the skew ago. */
export function isAdvisorilyExpired(
  session: Pick<StoredDemoSession, "expiresAt">,
  now = Date.now(),
) {
  return Date.parse(session.expiresAt) + CLOCK_SKEW_MS <= now;
}

/** Unsent form drafts are not portable between workspaces. */
export function clearFormDrafts() {
  for (const key of DRAFT_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* storage unavailable: nothing to clear */
    }
  }
}

/**
 * Calls back when ANOTHER tab replaced or removed the stored credential, with
 * the credential now stored there. Same-tab writes never fire `storage`.
 */
export function onForeignSessionChange(
  callback: (credential: string | null) => void,
) {
  const listener = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    callback(parse(loadRaw())?.credential ?? null);
  };
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
}

function loadRaw() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
