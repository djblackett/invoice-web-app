import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  allocateSession,
  obtainSession,
} from "../../../src/features/auth/demoSession/sessionApi";
import {
  clearStoredSession,
  getCredential,
  loadStoredSession,
  saveSession,
  toStoredSession,
} from "../../../src/features/auth/demoSession/credentialStore";

const CREDENTIAL = `demo-session-v1.${"a".repeat(64)}`;
const OTHER = `demo-session-v1.${"b".repeat(64)}`;
const NEW = `demo-session-v1.${"c".repeat(64)}`;
const future = () => new Date(Date.now() + 3600_000).toISOString();

const respond = (status: number, body?: unknown, headers?: HeadersInit) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers,
  });

const fetchMock = vi.fn();
beforeEach(() => {
  vi.stubEnv("VITE_BACKEND_URL", "http://localhost:8000/graphql");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  localStorage.clear();
  clearStoredSession();
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("allocateSession", () => {
  it("POSTs an empty JSON object to the allocation route, with no cookies or credentials", async () => {
    const expiresAt = future();
    fetchMock.mockResolvedValue(respond(201, { credential: NEW, expiresAt }));
    const result = await allocateSession();
    expect(result).toMatchObject({
      ok: true,
      session: { credential: NEW, expiresAt },
    });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("http://localhost:8000/demo/sessions");
    expect(init.method).toBe("POST");
    expect(init.body).toBe("{}");
    expect(init.credentials).toBe("omit");
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
    expect(url).not.toContain(NEW);
  });

  it.each([
    [404, { code: "DEMO_SESSIONS_DISABLED" }, undefined, "disabled"],
    [429, { code: "DEMO_SESSIONS_RATE_LIMITED" }, undefined, "throttled"],
    [503, { code: "DEMO_SESSIONS_CAPACITY" }, undefined, "capacity"],
    [503, { code: "DEMO_SESSIONS_UNAVAILABLE" }, undefined, "unavailable"],
    [500, undefined, undefined, "unknown"],
  ])("maps HTTP %i %j to %s", async (status, body, headers, kind) => {
    fetchMock.mockResolvedValue(respond(status, body, headers));
    expect(await allocateSession()).toEqual({
      ok: false,
      failure: { kind },
    });
  });

  it("carries Retry-After for throttling", async () => {
    fetchMock.mockResolvedValue(
      respond(429, undefined, { "Retry-After": "90" }),
    );
    expect(await allocateSession()).toEqual({
      ok: false,
      failure: { kind: "throttled", retryAfterSeconds: 90 },
    });
  });

  it("reports a network failure as unavailable, without retrying", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    expect(await allocateSession()).toEqual({
      ok: false,
      failure: { kind: "unavailable" },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rejects a malformed success body instead of storing it", async () => {
    fetchMock.mockResolvedValue(
      respond(201, { credential: "demo-token", expiresAt: future() }),
    );
    expect(await allocateSession()).toEqual({
      ok: false,
      failure: { kind: "unknown" },
    });
  });
});

describe("obtainSession", () => {
  it("stores the new credential only after allocation succeeds", async () => {
    fetchMock.mockResolvedValue(
      respond(201, { credential: NEW, expiresAt: future() }),
    );
    const result = await obtainSession(null);
    expect(result.ok).toBe(true);
    expect(loadStoredSession()?.credential).toBe(NEW);
    expect(getCredential()).toBe(NEW);
  });

  it("keeps the credential being replaced when allocation fails", async () => {
    saveSession(toStoredSession(CREDENTIAL, future()));
    fetchMock.mockResolvedValue(
      respond(503, { code: "DEMO_SESSIONS_CAPACITY" }),
    );
    const result = await obtainSession(CREDENTIAL);
    expect(result).toEqual({ ok: false, failure: { kind: "capacity" } });
    expect(loadStoredSession()?.credential).toBe(CREDENTIAL);
  });

  it("adopts a different live credential another tab stored instead of allocating", async () => {
    saveSession(toStoredSession(OTHER, future()));
    const result = await obtainSession(CREDENTIAL);
    expect(result).toMatchObject({ ok: true, session: { credential: OTHER } });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("allocates when the stored credential is the one being replaced", async () => {
    saveSession(toStoredSession(CREDENTIAL, future()));
    fetchMock.mockResolvedValue(
      respond(201, { credential: NEW, expiresAt: future() }),
    );
    await obtainSession(CREDENTIAL);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(loadStoredSession()?.credential).toBe(NEW);
  });
});
