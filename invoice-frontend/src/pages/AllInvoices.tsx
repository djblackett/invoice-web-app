import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { MemoizedAllInvoicesToolbar } from "../components/menus-toolbars/AllInvoicesToolbar";
import EmptyList from "../components/EmptyList";
import { addIdToExistingInvoices } from "../features/invoices/invoicesSlice";
import NewInvoice from "./NewInvoice";
import useWindowWidth from "../hooks/useWindowWidth";
import { AllInvoicesProps } from "../types/types";
import AllInvoicesView from "./AllInvoicesView";
import useInvoices from "../hooks/useInvoices";


const AllInvoicesContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 6.5rem;
  z-index: 5;
  overflow-y: auto;

  @media (min-width: 1200px) {
    padding-right: 48px;
    padding-left: 48px;
  }
`;

function AllInvoices({ setScrollPosition }: AllInvoicesProps) {
  const width = useWindowWidth();
  const dispatch = useDispatch();
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [padding, setPadding] = useState("");
  const { invoiceList, loading, error } = useInvoices();

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
      <MemoizedAllInvoicesToolbar
        invoiceList={invoiceList}
        setIsNewOpen={setIsNewOpen}
      />
      <NewInvoice
        isNewOpen={isNewOpen}
        setIsNewOpen={setIsNewOpen}
        padding={padding}
        setPadding={setPadding}
      />
      <AllInvoicesView
        invoiceList={invoiceList}
        isNewOpen={isNewOpen}
        setIsNewOpen={setIsNewOpen}
        width={width}
        scrollToTop={scrollToTop}
      />

      {invoiceList.length === 0 && <EmptyList />}

      {/* Clear button below is for debugging the empty invoices page - removes them from redux only*/}
      {/* <button onClick={() => dispatch(clearInvoices())}>Clear Invoices</button> */}
    </AllInvoicesContainer>
  );
}

export default AllInvoices;
