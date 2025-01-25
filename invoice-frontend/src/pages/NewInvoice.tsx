import NewInvoiceForm from "../components/form-components/NewInvoiceForm";
import "../styles/react-datepicker.css";
import { EditTitle, FormContainerDarkenModal } from "../styles/editPageStyles";
import { useNewInvoiceContext } from "../components/form-components/NewInvoiceContextProvider";
import Sidebar from "@/animation/SlidingMenu";
import { AnimatePresence } from "motion/react";

function NewInvoice() {
  const { isNewInvoiceOpen } = useNewInvoiceContext();

  // DarkenScreen appears when newInvoice tab is open
  return (
    <>
      <AnimatePresence>
        {isNewInvoiceOpen ? (
          <Sidebar key="sidebar-parent">
            <FormContainerDarkenModal data-testid="newInvoicePage">
              <EditTitle>New Invoice</EditTitle>
              <NewInvoiceForm />
            </FormContainerDarkenModal>
          </Sidebar>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default NewInvoice;
