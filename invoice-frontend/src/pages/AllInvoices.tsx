import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { MemoizedAllInvoicesToolbar } from "../components/menus-toolbars/AllInvoicesToolbar";
import { addIdToExistingInvoices } from "../features/invoices/invoicesSlice";
import NewInvoice from "./NewInvoice";
import useWindowWidth from "../hooks/useWindowWidth";
import { AllInvoicesProps } from "../types/types";
import AllInvoicesView from "../components/AllInvoicesView";
import useInvoices from "../hooks/useInvoices";
import { AllInvoicesContainer } from "../styles/AllInvoicesStyles";
import { NewInvoiceProvider } from "../components/form-components/NewInvoiceContextProvider";
import { useMutation } from "@apollo/client";
import { DELETE_ALL_INVOICES } from "src/graphql/queries";


function AllInvoices({ setScrollPosition }: AllInvoicesProps) {
  const width = useWindowWidth();
  const dispatch = useDispatch();
  const { invoiceList, loading, error } = useInvoices();

  const [removeInvoices] = useMutation(DELETE_ALL_INVOICES);

  const clearInvoices = () => {
    removeInvoices();
  }

  const scrollToTop = () => {
    if (setScrollPosition) {
      setScrollPosition({ x: window.scrollX, y: window.scrollY });
    }
    window.scrollTo(0, 0);
  };

  // This is necessary for dev environments where sample data may be loaded locally in which the invoices do not have ids.
  // Will be removed for production release
  useEffect(() => {
    if (invoiceList.length > 0) {
      dispatch(addIdToExistingInvoices());
    }
  }, [dispatch, invoiceList]);

  if (loading) return <h2>Loading</h2>;
  if (error) return <h1>{error.message}</h1>;


  return (
    <AllInvoicesContainer>
      <NewInvoiceProvider>
        <MemoizedAllInvoicesToolbar
          invoiceList={invoiceList}
        />
        <NewInvoice />
      </NewInvoiceProvider>
      <AllInvoicesView
        invoiceList={invoiceList}
        width={width}
        scrollToTop={scrollToTop}
      />

      {/* Clear button below is for debugging the empty invoices page - removes them from redux only*/}
      <button onClick={clearInvoices}>Clear Invoices</button>
    </AllInvoicesContainer>
  );
}

export default AllInvoices;
