import InvoiceDashboardPlaceholder from "@/features/invoices/components/InvoiceDashboardPlaceholder";
import { describeAllocationFailure } from "./demoErrors";
import type { TemporarySession } from "./TemporarySessionProvider";

/**
 * The screen shown instead of the routed content whenever the visitor has no
 * usable workspace. Each state names what happened and offers the one safe
 * action: nothing here replays an interrupted change.
 */
export function TemporarySessionRecovery({
  session,
}: {
  session: TemporarySession;
}) {
  const { phase, failure, renewing, startNew } = session;
  const start = () => {
    void startNew();
  };
  if (phase === "expired")
    return (
      <InvoiceDashboardPlaceholder
        error
        message="This demo workspace has expired."
        detail={
          failure
            ? describeAllocationFailure(failure)
            : "Demo workspaces are private and last 24 hours. Anything you were changing was not saved. Start a new demo for a fresh set of sample invoices."
        }
        onRetry={start}
        retryLabel={renewing ? "Starting…" : "Start a new demo"}
        retryDisabled={renewing}
      />
    );
  if (phase === "failed")
    return (
      <InvoiceDashboardPlaceholder
        error
        message="Your private demo couldn't be started."
        detail={failure ? describeAllocationFailure(failure) : undefined}
        onRetry={start}
        retryLabel={renewing ? "Starting…" : "Try again"}
        retryDisabled={renewing}
      />
    );
  return (
    <InvoiceDashboardPlaceholder
      initializing
      message="Preparing your private demo…"
      detail="Setting up a workspace with sample invoices. This can take a moment."
    />
  );
}
