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

const FadeOutText = styled.span`
  font-size: x-large;
  font-weight: 700;
  opacity: 1;
  transition: all 2 2 2;
`;

// todo - make welcome text fade out
const FadeOut = () => {
  return <FadeOutText>Welcome {user?.email}</FadeOutText>;
};

function AllInvoices() {
  const width = useWindowWidth();
  const { invoiceList, loading, error } = useInvoices();

  const text = "Please login to view your invoices";
  const text2 = "Click here...";

  // const [removeInvoices] = useMutation(DELETE_ALL_INVOICES, {
  //   refetchQueries: [{ query: ALL_INVOICES }],
  // });

  // const clearInvoices = () => {
  //   removeInvoices();
  // };

  const { isAuthenticated, user, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  return (
    <AllInvoicesContainer>
      {!isAuthenticated && (
        <>
          <TextAnimation text={text} />
          <SlidingComponent
            initial={{ x: "-100%", opacity: 0 }} // Start off-screen to the left
            animate={{ x: 0, opacity: 1 }} // Animate to original position
            transition={{
              type: "spring",
              stiffness: 100,
              duration: 0.5,
              delay: 1,
            }} // Customize the animation
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              position: "fixed", // Fixed position to stay relative to the viewport
              top: "48%", // Adjust as needed
              left: "48%", // Start from the left
            }}
          >
            <LoginLogoutButton
              whileTap={{ scale: 0.85 }}
              onClick={() => loginWithRedirect()}
            >
              Login
            </LoginLogoutButton>
          </SlidingComponent>
        </>
      )}
      {isAuthenticated && (
        <>
          <NewInvoiceProvider>
            <MemoizedAllInvoicesToolbar invoiceList={invoiceList} />
            <NewInvoice />
          </NewInvoiceProvider>
          <h1>Welcome {user?.email}</h1>
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
