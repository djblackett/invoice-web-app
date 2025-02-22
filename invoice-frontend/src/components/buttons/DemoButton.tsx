import { ALL_INVOICES } from "@/graphql/invoice.queries";
import { useAuth } from "@/hooks/useAuth";
import { useApolloClient } from "@apollo/client";
import { flushSync } from "react-dom";
import styled from "styled-components";

const Button = styled.button`
  border-radius: 24px;
  background-color: #7c5dfa;
  color: white;
  font-family: ${({ theme }) => theme.font};
  font-weight: 700;
  margin-left: 1rem;
  height: 44px;
  width: 90px;
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
  }
`;

function DemoButton() {
  const { user, toggleAdmin } = useAuth();
  const apolloClient = useApolloClient();

  const handleClick = () => {
    flushSync(() => toggleAdmin());
    apolloClient.refetchQueries({ include: [ALL_INVOICES] });
    console.log("User role toggled");
  };

  return (
    <>
      <Button onClick={handleClick}>
        {user?.role === 1 ? "Admin" : "User"}
      </Button>
    </>
  );
}

export default DemoButton;
