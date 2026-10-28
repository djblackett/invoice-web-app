import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearFormDrafts,
  clearStoredSession,
  getCredential,
  isAdvisorilyExpired,
  loadStoredSession,
  onForeignSessionChange,
  saveSession,
  toStoredSession,
} from "../../../src/features/auth/demoSession/credentialStore";

const KEY = "invoice-web-app:demo-session:v1";
const CREDENTIAL = `demo-session-v1.${"a".repeat(64)}`;
const OTHER = `demo-session-v1.${"b".repeat(64)}`;
const future = () => new Date(Date.now() + 3600_000).toISOString();

beforeEach(() => {
  vi.stubEnv("VITE_BACKEND_URL", "http://localhost:8000/graphql");
  localStorage.clear();
  clearStoredSession();
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("credential store", () => {
  it("round-trips a session under the namespaced key and serves it from memory", () => {
    saveSession(toStoredSession(CREDENTIAL, future()));
    expect(localStorage.getItem(KEY)).toContain(CREDENTIAL);
    expect(loadStoredSession()?.credential).toBe(CREDENTIAL);
    expect(getCredential()).toBe(CREDENTIAL);
    // Nothing else in storage carries the secret.
    expect(Object.keys(localStorage).filter((key) => key !== KEY)).toEqual([]);
  });

  it.each([
    ["not JSON", "{nope"],
    ["wrong shape", JSON.stringify({ credential: "demo-token" })],
    [
      "malformed credential",
      JSON.stringify({
        credential: "demo-session-v1.short",
        expiresAt: future(),
        backend: "http://localhost:8000",
      }),
    ],
    [
      "unparseable expiry",
      JSON.stringify({
        credential: CREDENTIAL,
        expiresAt: "soon",
        backend: "http://localhost:8000",
      }),
    ],
    [
      "another backend",
      JSON.stringify({
        credential: CREDENTIAL,
        expiresAt: future(),
        backend: "https://elsewhere.example",
      }),
    ],
  ])("treats %s as absent and removes it", (_name, raw) => {
    localStorage.setItem(KEY, raw);
    expect(loadStoredSession()).toBeNull();
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(getCredential()).toBeNull();
  });

  it("clears the credential from storage and memory", () => {
    saveSession(toStoredSession(CREDENTIAL, future()));
    clearStoredSession();
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(getCredential()).toBeNull();
  });

  it("keeps working for this page when storage throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    saveSession(toStoredSession(CREDENTIAL, future()));
    expect(getCredential()).toBe(CREDENTIAL);
    expect(loadStoredSession()?.credential).toBe(CREDENTIAL);
  });

  it("treats the clock as advisory: a few minutes past expiry is still sent to the server", () => {
    const now = Date.parse("2026-10-27T12:00:00Z");
    const at = (offsetMs: number) => ({
      expiresAt: new Date(now + offsetMs).toISOString(),
    });
    expect(isAdvisorilyExpired(at(60_000), now)).toBe(false);
    expect(isAdvisorilyExpired(at(-60_000), now)).toBe(false);
    expect(isAdvisorilyExpired(at(-10 * 60_000), now)).toBe(true);
  });

  it("clears only form drafts", () => {
    localStorage.setItem("cachedNewInvoiceForm", "{}");
    localStorage.setItem("cachedEditForm", "{}");
    localStorage.setItem("theme", "dark");
    clearFormDrafts();
    expect(localStorage.getItem("cachedNewInvoiceForm")).toBeNull();
    expect(localStorage.getItem("cachedEditForm")).toBeNull();
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("reports the credential another tab stored, or null when it was removed", () => {
    const seen: (string | null)[] = [];
    const stop = onForeignSessionChange((credential) => seen.push(credential));
    localStorage.setItem(KEY, JSON.stringify(toStoredSession(OTHER, future())));
    window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
    localStorage.removeItem(KEY);
    window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
    window.dispatchEvent(new StorageEvent("storage", { key: "theme" }));
    stop();
    window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
    expect(seen).toEqual([OTHER, null]);
  });
});
