import { MemoizedAllInvoicesToolbar } from "../components/menus-toolbars/AllInvoicesToolbar";
import NewInvoice from "./NewInvoice";
import useWindowWidth from "../hooks/useWindowWidth";
import AllInvoicesView from "../components/AllInvoicesView";
import useInvoices from "../hooks/useInvoices";
import { AllInvoicesContainer } from "../styles/AllInvoicesStyles";
import { NewInvoiceProvider } from "../components/form-components/NewInvoiceContextProvider";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import styled from "styled-components";

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

  const { isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  return (
    <AllInvoicesContainer>
      {!isAuthenticated && (
        <>
          <TextAnimation text={text} />{" "}
          {/* <SlowTextAnimation text={text2} className="click-here" /> */}
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

const AnimatedText = styled.div`
  font-family: sans-serif;
  font-size: 60px;
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.2;
  text-align: center;
  margin: 100px 0 40px;
  color: ${({ theme }) => theme.text};
`;

type TextAnimationProps = {
  text: string;
  className?: string;
};

function TextAnimation({ text }: TextAnimationProps) {
  return (
    <AnimatedText className="text-animation">
      {text.split(" ").map((el, i) => (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.25,
            delay: i / 6,
          }}
          key={i}
        >
          {el}{" "}
        </motion.span>
      ))}
    </AnimatedText>
  );
}

function SlowTextAnimation({ text }: TextAnimationProps) {
  return (
    <AnimatedText className="text-animation">
      {text.split("").map((el, i) => (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.25,
            delay: i / 10,
          }}
          key={i}
        >
          {el}{" "}
        </motion.span>
      ))}
    </AnimatedText>
  );
}
