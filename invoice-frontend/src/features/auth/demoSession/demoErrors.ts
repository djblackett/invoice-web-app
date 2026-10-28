import type { GraphQLFormattedError } from "graphql";
import type { AllocationFailure } from "./sessionApi";

// Stable server codes (Slice 3C): UNAUTHENTICATED/401 and SERVICE_UNAVAILABLE/503
// for the credential, QUOTA_EXCEEDED{quota}, SESSION_BUSY and RESET_COOLDOWN
// {retryAfterSeconds} for writes.
export type DemoErrorKind =
  | "expired" // credential rejected: discard nothing here, offer a new demo
  | "unavailable" // backend could not check the credential: keep it, retry
  | "busy"
  | "attempts"
  | "mutations"
  | "workspace"
  | "resets"
  | "cooldown"
  | "not-found"
  | "invalid"
  | "forbidden"
  | "network" // no response: the outcome is unknown
  | "other";

export interface DemoErrorInfo {
  kind: DemoErrorKind;
  message: string;
  retryAfterSeconds?: number;
}

interface ErrorSource {
  graphQLErrors?: readonly GraphQLFormattedError[];
  networkError?: Error | null;
}

export function formatWait(seconds: number) {
  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

const MESSAGES: Record<
  Exclude<DemoErrorKind, "cooldown" | "invalid">,
  string
> = {
  expired: "Your demo workspace has expired.",
  unavailable:
    "The demo service is temporarily unavailable. Your last change may not have been saved: check your invoices, then try again.",
  busy: "Another change is still being saved. Wait a moment, then try again.",
  attempts:
    "This demo workspace has used all of its change attempts. Choose “Start a new demo” to keep editing.",
  mutations:
    "This demo workspace has used all of its changes. Choose “Start a new demo” to keep editing.",
  workspace:
    "That change would make this demo workspace too large. Remove something first, then try again.",
  resets:
    "This demo workspace has used all of its resets. Choose “Start a new demo” for a fresh set.",
  "not-found":
    "That invoice is no longer in this workspace. It may have been deleted, or the workspace was reset.",
  forbidden: "That action isn't available in a temporary demo.",
  network:
    "We couldn't confirm that change. Your invoices are being refreshed: check them before trying again.",
  other: "That change could not be saved. Please try again.",
};

const QUOTA_KINDS: Record<string, DemoErrorKind> = {
  attempts: "attempts",
  mutations: "mutations",
  workspace: "workspace",
  resets: "resets",
};

function fromCode(
  code: string | undefined,
  extensions: Record<string, unknown> | undefined,
  message: string,
): DemoErrorInfo | null {
  switch (code) {
    case "UNAUTHENTICATED":
      return { kind: "expired", message: MESSAGES.expired };
    case "SERVICE_UNAVAILABLE":
      return { kind: "unavailable", message: MESSAGES.unavailable };
    case "SESSION_BUSY":
      return { kind: "busy", message: MESSAGES.busy };
    case "QUOTA_EXCEEDED": {
      const kind = QUOTA_KINDS[String(extensions?.["quota"])] ?? "other";
      return { kind, message: MESSAGES[kind as keyof typeof MESSAGES] };
    }
    case "RESET_COOLDOWN": {
      const seconds = Number(extensions?.["retryAfterSeconds"]);
      return {
        kind: "cooldown",
        message: Number.isFinite(seconds)
          ? `Reset is cooling down. Try again in ${formatWait(seconds)}.`
          : "Reset is cooling down. Please wait a couple of minutes.",
        ...(Number.isFinite(seconds) ? { retryAfterSeconds: seconds } : {}),
      };
    }
    case "NOT_FOUND":
      return { kind: "not-found", message: MESSAGES["not-found"] };
    case "FORBIDDEN":
      return { kind: "forbidden", message: MESSAGES.forbidden };
    case "BAD_USER_INPUT":
      // The backend words these without echoing user data; show them as is.
      return { kind: "invalid", message: message || MESSAGES.other };
    default:
      return null;
  }
}

/**
 * Maps an Apollo failure to the visitor-facing state. Handles both a 200
 * response carrying GraphQL errors and a non-2xx response whose body Apollo
 * parsed into `networkError.result` (the 401/503 credential failures).
 */
export function classifyDemoError({
  graphQLErrors,
  networkError,
}: ErrorSource): DemoErrorInfo {
  const first = graphQLErrors?.[0];
  if (first) {
    const known = fromCode(
      typeof first.extensions?.["code"] === "string"
        ? first.extensions["code"]
        : undefined,
      first.extensions,
      first.message,
    );
    if (known) return known;
  }
  const network = networkError as
    | (Error & {
        statusCode?: number;
        result?: { errors?: readonly GraphQLFormattedError[] };
      })
    | null
    | undefined;
  if (network) {
    const nested = network.result?.errors?.[0];
    const known = nested
      ? fromCode(
          typeof nested.extensions?.["code"] === "string"
            ? nested.extensions["code"]
            : undefined,
          nested.extensions,
          nested.message,
        )
      : null;
    if (known) return known;
    if (network.statusCode === 401)
      return { kind: "expired", message: MESSAGES.expired };
    if (network.statusCode === 503)
      return { kind: "unavailable", message: MESSAGES.unavailable };
    if (network.statusCode === undefined)
      return { kind: "network", message: MESSAGES.network };
  }
  return { kind: "other", message: MESSAGES.other };
}

export function describeAllocationFailure(failure: AllocationFailure) {
  const wait = failure.retryAfterSeconds
    ? ` Please try again in about ${formatWait(failure.retryAfterSeconds)}.`
    : " Please try again in a few minutes.";
  switch (failure.kind) {
    case "capacity":
      return "All of the demo's private workspaces are in use right now. Please try again in a little while.";
    case "throttled":
      return `Lots of people are starting demos right now.${wait}`;
    case "disabled":
      return "Private demo workspaces aren't available on this site right now.";
    case "unavailable":
      return "We couldn't reach the demo service. Check your connection and try again.";
    default:
      return "A private demo workspace could not be created. Please try again.";
  }
}
