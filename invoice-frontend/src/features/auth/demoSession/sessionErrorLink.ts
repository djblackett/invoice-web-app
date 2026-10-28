import { ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { Kind, OperationTypeNode } from "graphql";
import { toast } from "react-toastify";
import { classifyDemoError } from "./demoErrors";

interface Handlers {
  /** The server rejected the credential. */
  onExpired: () => void;
  /** A write got no answer, so its outcome is unknown: reload known state. */
  onUnknownOutcome: () => void;
}

/**
 * The one place a temporary session's failures become visitor feedback.
 *
 * - 401/UNAUTHENTICATED anywhere: the workspace ended; the recovery screen
 *   takes over (the operation is NOT replayed against a new workspace).
 * - A failed write: a toast saying why. After a lost response the outcome is
 *   unknown, so known state is refetched and the visitor decides; nothing
 *   here, or anywhere in the client, retries a write.
 * - Failed reads are left to the page that asked (it has its own Retry), so a
 *   blip never wipes a form the visitor is filling in.
 */
export function createSessionErrorLink({
  onExpired,
  onUnknownOutcome,
}: Handlers): ApolloLink {
  return onError(({ operation, graphQLErrors, networkError }) => {
    const info = classifyDemoError({ graphQLErrors, networkError });
    if (info.kind === "expired") {
      onExpired();
      return;
    }
    const isWrite = operation.query.definitions.some(
      (definition) =>
        definition.kind === Kind.OPERATION_DEFINITION &&
        definition.operation === OperationTypeNode.MUTATION,
    );
    if (!isWrite) return;
    toast.error(info.message, {
      toastId: "demo-session-error",
      autoClose: info.kind === "network" ? 8000 : 6000,
    });
    if (info.kind === "network") onUnknownOutcome();
  });
}
