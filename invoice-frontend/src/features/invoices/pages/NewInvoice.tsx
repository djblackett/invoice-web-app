import NewInvoiceForm from "../forms/NewInvoiceForm.tsx";
import "../../../styles/react-datepicker.css";
import { EditTitle, FormContainerDarkenModal } from "../../../styles/editPageStyles.ts";
import { useNewInvoiceContext } from "../forms/NewInvoiceContextProvider.tsx";
import Sidebar from "@/features/shared/animations/SlidingMenu.tsx";
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
