import { describe, expect, it } from "vitest";
import type { GraphQLFormattedError } from "graphql";
import {
  classifyDemoError,
  describeAllocationFailure,
  formatWait,
} from "../../../src/features/auth/demoSession/demoErrors";

const gql = (
  code: string,
  extensions: Record<string, unknown> = {},
  message = "server message",
): GraphQLFormattedError => ({ message, extensions: { code, ...extensions } });

const http = (statusCode: number, errors?: GraphQLFormattedError[]) =>
  Object.assign(new Error("Response not successful"), {
    statusCode,
    result: errors ? { errors } : undefined,
  });

describe("classifyDemoError", () => {
  it.each([
    ["UNAUTHENTICATED", {}, "expired"],
    ["SERVICE_UNAVAILABLE", {}, "unavailable"],
    ["SESSION_BUSY", {}, "busy"],
    ["QUOTA_EXCEEDED", { quota: "attempts" }, "attempts"],
    ["QUOTA_EXCEEDED", { quota: "mutations" }, "mutations"],
    ["QUOTA_EXCEEDED", { quota: "workspace" }, "workspace"],
    ["QUOTA_EXCEEDED", { quota: "resets" }, "resets"],
    ["NOT_FOUND", {}, "not-found"],
    ["FORBIDDEN", {}, "forbidden"],
    ["BAD_USER_INPUT", {}, "invalid"],
    ["INTERNAL_SERVER_ERROR", {}, "other"],
  ])("GraphQL %s %j -> %s", (code, extensions, kind) => {
    expect(
      classifyDemoError({ graphQLErrors: [gql(code, extensions)] }).kind,
    ).toBe(kind);
  });

  it("explains a reset cooldown with the wait", () => {
    const info = classifyDemoError({
      graphQLErrors: [gql("RESET_COOLDOWN", { retryAfterSeconds: 95 })],
    });
    expect(info).toMatchObject({ kind: "cooldown", retryAfterSeconds: 95 });
    expect(info.message).toContain("2 minutes");
  });

  it("recognises the credential failures Apollo reports as HTTP errors", () => {
    expect(
      classifyDemoError({
        networkError: http(401, [gql("UNAUTHENTICATED")]),
      }).kind,
    ).toBe("expired");
    expect(classifyDemoError({ networkError: http(401) }).kind).toBe("expired");
    expect(
      classifyDemoError({
        networkError: http(503, [gql("SERVICE_UNAVAILABLE")]),
      }).kind,
    ).toBe("unavailable");
    expect(classifyDemoError({ networkError: http(503) }).kind).toBe(
      "unavailable",
    );
  });

  it("treats a lost response as an unknown outcome", () => {
    expect(
      classifyDemoError({ networkError: new TypeError("Failed to fetch") })
        .kind,
    ).toBe("network");
  });

  it("passes validation messages through and never invents detail otherwise", () => {
    expect(
      classifyDemoError({
        graphQLErrors: [gql("BAD_USER_INPUT", {}, "clientName is too long")],
      }).message,
    ).toBe("clientName is too long");
    expect(classifyDemoError({ networkError: http(500) }).kind).toBe("other");
  });
});

describe("messages", () => {
  it("formats waits", () => {
    expect(formatWait(1)).toBe("1 second");
    expect(formatWait(45)).toBe("45 seconds");
    expect(formatWait(61)).toBe("2 minutes");
  });

  it.each([
    "capacity",
    "throttled",
    "disabled",
    "unavailable",
    "unknown",
  ] as const)("describes %s allocation failures", (kind) => {
    expect(describeAllocationFailure({ kind }).length).toBeGreaterThan(10);
  });
});
