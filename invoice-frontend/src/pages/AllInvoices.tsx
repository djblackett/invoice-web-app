import { MemoizedAllInvoicesToolbar } from "../components/menus-toolbars/AllInvoicesToolbar";
import NewInvoice from "./NewInvoice";
import useWindowWidth from "../hooks/useWindowWidth";
import AllInvoicesView from "../components/AllInvoicesView";
import useInvoices from "../hooks/useInvoices";
import { AllInvoicesContainer } from "../styles/AllInvoicesStyles";
import { NewInvoiceProvider } from "../components/form-components/NewInvoiceContextProvider";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import { useEffect, useState } from "react";

const FadeOutText = styled.h1`
  font-size: x-large;
  margin: 8px;
  padding: 0;
  font-weight: 700;
  opacity: 1;
  transition: all 1s ease-in;
  text-align: center;
`;

type FadeOutProps = {
  username: string | undefined;
  className: string;
};

// todo - make welcome text fade out
const FadeOut = ({ username, className }: FadeOutProps) => {
  const [height, setHeight] = useState("32px");
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    setTimeout(() => {
      setOpacity(0);
    }, 3000);
  }, []);
  return (
    <FadeOutText
      className={className}
      style={{ height: height, opacity: opacity }}
    >
      Welcome {username}
    </FadeOutText>
  );
};

function AllInvoices() {
  const width = useWindowWidth();
  const { invoiceList, loading, error } = useInvoices();

  // const [removeInvoices] = useMutation(DELETE_ALL_INVOICES, {
  //   refetchQueries: [{ query: ALL_INVOICES }],
  // });

  // const clearInvoices = () => {
  //   removeInvoices();
  // };

  const { isAuthenticated, user, isLoading } = useAuth0();

  console.log("isAuthenticated", isAuthenticated);

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  return (
    <AllInvoicesContainer>
      {isAuthenticated && (
        <>
          <NewInvoiceProvider>
            <MemoizedAllInvoicesToolbar
              invoiceList={invoiceList}
              data-testid="invoices-toolbar"
            />
            <NewInvoice />
          </NewInvoiceProvider>
          <FadeOut className="welcome-text" username={user?.email}></FadeOut>
          <AllInvoicesView
            invoiceList={invoiceList}
            width={width}
            loading={loading}
            error={error}
          />
        </>
      )}
      {/* Clear button below is for debugging the empty invoices page */}
      {/* <button onClick={clearInvoices}>Clear Invoices</button> */}
    </AllInvoicesContainer>
  );
}

export default AllInvoices;
