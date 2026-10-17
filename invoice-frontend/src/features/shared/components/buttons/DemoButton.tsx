import { ALL_INVOICES } from "@/features/invoices/graphql/invoice.queries.ts";
import { useApolloClient, useMutation } from "@apollo/client";
import { RESET_DEMO_DATA } from "../../../auth/graphql/demo.mutations";
import { toast } from "react-toastify";
import styled from "styled-components";

const Button = styled.button`
  border-radius: 24px;
  background-color: #7c5dfa;
  color: white;
  font-family: ${({ theme }) => theme.font};
  font-weight: 700;
  margin-left: 1rem;
  height: 44px;
  min-width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding-left: 0.5rem;
  border: none;

  &:hover {
    background-color: #9277ff;
  }

  @media (min-width: 1200px) {
    margin-left: 0;
    justify-self: flex-end;
    margin-bottom: 1rem;
  }
`;

function DemoButton() {
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
      <Button onClick={handleClick} disabled={loading}>
        {loading ? "Resetting…" : "Reset Demo"}
      </Button>
    </>
  );
}

export default DemoButton;
