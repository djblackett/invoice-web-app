import { MemoizedAllInvoicesToolbar } from "../components/menus-toolbars/AllInvoicesToolbar";
import NewInvoice from "./NewInvoice";
import useWindowWidth from "../hooks/useWindowWidth";
import AllInvoicesView from "../components/AllInvoicesView";
import useInvoices from "../hooks/useInvoices";
import { AllInvoicesContainer } from "../styles/AllInvoicesStyles";
import { NewInvoiceProvider } from "../components/form-components/NewInvoiceContextProvider";
import { useMutation } from "@apollo/client";
import { ALL_INVOICES, DELETE_ALL_INVOICES } from "src/graphql/queries";
import { useAuth0 } from "@auth0/auth0-react";

function AllInvoices() {
  const width = useWindowWidth();
  const { invoiceList, loading, error } = useInvoices();

  const [removeInvoices] = useMutation(DELETE_ALL_INVOICES, {
    refetchQueries: [{ query: ALL_INVOICES }],
  });

  const clearInvoices = () => {
    removeInvoices();
  };

  const { isAuthenticated, user } = useAuth0();

  return (
    <AllInvoicesContainer>
      <NewInvoiceProvider>
        <MemoizedAllInvoicesToolbar invoiceList={invoiceList} />
        <NewInvoice />
      </NewInvoiceProvider>
      {isAuthenticated && <h1>Welcome {user?.email}</h1>}
      <AllInvoicesView
        invoiceList={invoiceList}
        width={width}
        loading={loading}
        error={error}
      />

      {/* Clear button below is for debugging the empty invoices page - removes them from redux only*/}
      <button onClick={clearInvoices}>Clear Invoices</button>
    </AllInvoicesContainer>
  );
}

export default AllInvoices;
