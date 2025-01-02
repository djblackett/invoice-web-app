import { MemoizedAllInvoicesToolbar } from "../components/menus-toolbars/AllInvoicesToolbar";
import NewInvoice from "./NewInvoice";
import useWindowWidth from "../hooks/useWindowWidth";
import AllInvoicesView from "../components/AllInvoicesView";
import useInvoices from "../hooks/useInvoices";
import { AllInvoicesContainer } from "../styles/AllInvoicesStyles";
import { NewInvoiceProvider } from "../components/form-components/NewInvoiceContextProvider";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import { LoginLogoutButton } from "src/components/menus-toolbars/Header";
import TextAnimation from "src/components/text/AnimatedText";
import { SlidingComponent } from "src/components/buttons/AnimatedButton";
import { useEffect, useState } from "react";

const FadeOutText = styled.h1`
  font-size: x-large;
  margin: 8px;
  padding: 0;
  font-weight: 700;
  opacity: 1;
  transition: all 1s ease-in;
  text-align: center;
  /* overflow: hidden; */

  @media (min-width: 1200px) {
    /* padding-right: 48px;
    padding-left: 48px; */
    /* margin-bottom: 16px; */
  }
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
      // setHeight("0px");
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

  const text = "Please login to view your invoices";
  // const text2 = "Click here...";

  // const [removeInvoices] = useMutation(DELETE_ALL_INVOICES, {
  //   refetchQueries: [{ query: ALL_INVOICES }],
  // });

  // const clearInvoices = () => {
  //   removeInvoices();
  // };

  const { isAuthenticated, user, isLoading, loginWithRedirect } = useAuth0();

  // if (isLoading) {
  //   return <h1>Loading</h1>;
  // }

  return (
    <AllInvoicesContainer>
      {!isAuthenticated && (
        <>
          <TextAnimation text={text} data-testid="welcome-text" />
          <SlidingComponent
            initial={{ x: "-100%", opacity: 0 }} // Start off-screen to the left
            animate={{ x: 0, opacity: 1 }} // Animate to original position
            transition={{
              type: "spring",
              stiffness: 100,
              duration: 0.5,
              delay: 1,
            }}
          >
            <LoginLogoutButton
              whileTap={{ scale: 0.85 }}
              onClick={() => loginWithRedirect()}
              data-testid="login-button"
            >
              Login
            </LoginLogoutButton>
          </SlidingComponent>
        </>
      )}
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
