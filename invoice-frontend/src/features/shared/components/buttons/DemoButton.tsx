import { ALL_INVOICES } from "@/features/invoices/graphql/invoice.queries.ts";
import { useApolloClient, useMutation } from "@apollo/client";
import {
  RESET_DEMO_DATA,
  RESET_DEMO_SESSION,
} from "../../../auth/graphql/demo.mutations";
import { useTemporarySession } from "../../../auth/demoSession/TemporarySessionProvider";
import { toast } from "react-toastify";
import styled from "styled-components";

const Button = styled.button`
  border-radius: 24px;
  background-color: #7c5dfa;
  color: white;
  font-family: ${({ theme }) => theme.font};
  font-weight: 700;
  margin-left: 8px;
  height: 44px;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 12px;
  border: none;

  &:hover {
    background-color: #9277ff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  @media (min-width: 1200px) {
    width: calc(100% - 16px);
    margin-left: 0;
    justify-self: flex-end;
    margin-bottom: 1rem;
  }
`;

function DemoButton({ disabled = false }: { disabled?: boolean }) {
  return useTemporarySession() ? (
    <TemporaryResetButton disabled={disabled} />
  ) : (
    <SharedDemoResetButton disabled={disabled} />
  );
}

// Resets the visitor's OWN workspace. A failure (cooldown, no resets left, a
// busy session, a lost response) changes nothing locally: the existing
// workspace stays on screen and the error link explains why.
function TemporaryResetButton({ disabled }: { disabled: boolean }) {
  const apolloClient = useApolloClient();
  const session = useTemporarySession();
  const [reset, { loading }] = useMutation<{ resetDemoSession: boolean }>(
    RESET_DEMO_SESSION,
    // The error link owns the feedback; the promise must not also throw.
    { onError: () => {} },
  );

  const handleClick = async () => {
    if (
      !window.confirm(
        "Reset your demo workspace to the sample invoices? Your changes will be lost.",
      )
    )
      return;
    const result = await reset();
    if (result.data?.resetDemoSession !== true) return;
    // Every invoice and revision ID was replaced: nothing cached or open
    // can still be valid, so start over from the dashboard.
    await apolloClient.clearStore();
    // Also returns to the dashboard, so no page queries an obsolete invoice ID.
    session?.workspaceReplaced();
    toast.success("Demo invoices restored", { toastId: "demo-reset-success" });
  };

  return (
    <Button
      onClick={() => {
        void handleClick();
      }}
      disabled={disabled || loading}
    >
      {loading ? "Resetting…" : "Reset Demo"}
    </Button>
  );
}

function SharedDemoResetButton({ disabled }: { disabled: boolean }) {
  const apolloClient = useApolloClient();
  const [reset, { loading }] = useMutation<{ resetDemoData: boolean }>(
    RESET_DEMO_DATA,
  );

  const handleClick = async () => {
    try {
      const result = await reset();
      if (result.data?.resetDemoData !== true) throw new Error("Reset failed");
      await apolloClient.clearStore();
      await apolloClient.refetchQueries({ include: [ALL_INVOICES] });
      toast.success("Demo invoices restored");
    } catch {
      toast.error("Demo could not be reset. Please try again.");
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          void handleClick();
        }}
        disabled={disabled || loading}
      >
        {loading ? "Resetting…" : "Reset Demo"}
      </Button>
    </>
  );
}

export default DemoButton;
