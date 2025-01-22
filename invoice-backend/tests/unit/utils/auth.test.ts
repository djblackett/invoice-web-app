import { describe, it, expect } from "vitest";
import { requireAuth } from "../../../src/utils/auth";

describe("requireAuth", () => {
  it("does not throw if username is provided", () => {
    expect(() => requireAuth({ username: "testUser" })).not.toThrow();
  });

  it("throws if username is missing", () => {
    expect(() => requireAuth({} as any)).toThrow(
      "You must be logged in to perform this action.",
    );
  });
});
