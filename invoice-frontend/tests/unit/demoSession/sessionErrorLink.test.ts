import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ApolloLink,
  Observable,
  execute,
  gql,
  type FetchResult,
} from "@apollo/client";
import { GraphQLError } from "graphql";
import { createSessionErrorLink } from "../../../src/features/auth/demoSession/sessionErrorLink";

const toasts = vi.hoisted(() => ({ error: vi.fn() }));
vi.mock("react-toastify", () => ({ toast: toasts }));

const MUTATION = gql`
  mutation M {
    markAsPaid(id: "x") {
      id
    }
  }
`;
const QUERY = gql`
  query Q {
    allInvoices {
      id
    }
  }
`;

function run(
  query: typeof QUERY,
  outcome: { errors?: GraphQLError[]; network?: Error },
) {
  const onExpired = vi.fn();
  const onUnknownOutcome = vi.fn();
  const terminal = new ApolloLink(
    () =>
      new Observable<FetchResult>((observer) => {
        if (outcome.network) observer.error(outcome.network);
        else {
          observer.next({ errors: outcome.errors, data: null });
          observer.complete();
        }
      }),
  );
  const link = ApolloLink.from([
    createSessionErrorLink({ onExpired, onUnknownOutcome }),
    terminal,
  ]);
  return new Promise<{
    onExpired: typeof onExpired;
    onUnknownOutcome: typeof onUnknownOutcome;
  }>((resolve) => {
    const finish = () => resolve({ onExpired, onUnknownOutcome });
    execute(link, { query }).subscribe({
      next: finish,
      error: finish,
      complete: finish,
    });
  });
}

const code = (value: string, extensions: Record<string, unknown> = {}) =>
  new GraphQLError("m", { extensions: { code: value, ...extensions } });

afterEach(() => vi.clearAllMocks());

describe("session error link", () => {
  it("hands an expired credential to the recovery screen, from a read or a write", async () => {
    for (const query of [QUERY, MUTATION]) {
      const { onExpired } = await run(query, {
        errors: [code("UNAUTHENTICATED")],
      });
      expect(onExpired).toHaveBeenCalledTimes(1);
    }
    expect(toasts.error).not.toHaveBeenCalled();
  });

  it("explains a refused write with a toast and does nothing else", async () => {
    const { onExpired, onUnknownOutcome } = await run(MUTATION, {
      errors: [code("QUOTA_EXCEEDED", { quota: "mutations" })],
    });
    expect(toasts.error).toHaveBeenCalledWith(
      expect.stringContaining("used all of its changes"),
      expect.objectContaining({ toastId: "demo-session-error" }),
    );
    expect(onExpired).not.toHaveBeenCalled();
    expect(onUnknownOutcome).not.toHaveBeenCalled();
  });

  it("refreshes known state after a lost write response, and never replays it", async () => {
    const { onUnknownOutcome } = await run(MUTATION, {
      network: new TypeError("Failed to fetch"),
    });
    expect(onUnknownOutcome).toHaveBeenCalledTimes(1);
    expect(toasts.error).toHaveBeenCalledWith(
      expect.stringContaining("couldn't confirm"),
      expect.anything(),
    );
  });

  it("leaves failed reads to the page that asked", async () => {
    const { onExpired, onUnknownOutcome } = await run(QUERY, {
      network: new TypeError("Failed to fetch"),
    });
    expect(onExpired).not.toHaveBeenCalled();
    expect(onUnknownOutcome).not.toHaveBeenCalled();
    expect(toasts.error).not.toHaveBeenCalled();
  });
});
