import { useEffect, useState, type ReactNode } from "react";
import { useApolloClient } from "@apollo/client";
import { useDemoModeContext } from "../../shared/components/DemoModeProvider";
import { RESET_DEMO_DATA } from "../graphql/demo.mutations";

type DemoSessionState = {
  ready: boolean;
  error: boolean;
  retry: () => void;
};

export function DemoSessionBoundary({
  children,
}: {
  children: ReactNode | ((state: DemoSessionState) => ReactNode);
}) {
  const client = useApolloClient();
  const { isDemoMode, demoEntryId, initializeDemo } = useDemoModeContext();
  const [ready, setReady] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!isDemoMode) return;
    let mounted = true;
    setError(false);
    initializeDemo(async () => {
      const result = await client.mutate<{ resetDemoData: boolean }>({
        mutation: RESET_DEMO_DATA,
      });
      if (result.data?.resetDemoData !== true)
        throw new Error("Demo reset failed");
      await client.clearStore();
    })
      .then(() => {
        if (mounted) setReady(demoEntryId);
      })
      .catch(() => {
        if (mounted) setError(true);
      });
    return () => {
      mounted = false;
    };
  }, [client, isDemoMode, demoEntryId, initializeDemo, retry]);

  const isReady = !isDemoMode || ready === demoEntryId;
  const retryDemo = () => setRetry((value) => value + 1);
  // The shell can stay mounted while query/mutation screens remain gated.
  if (typeof children === "function")
    return children({ ready: isReady, error, retry: retryDemo });
  if (isReady) return children;
  if (error)
    return (
      <div role="alert">
        Demo could not be initialized.{" "}
        <button onClick={retryDemo}>Retry Demo</button>
      </div>
    );
  return <p role="status">Preparing demo invoices…</p>;
}
