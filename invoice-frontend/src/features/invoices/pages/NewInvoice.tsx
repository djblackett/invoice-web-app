import NewInvoiceForm from "../forms/NewInvoiceForm.tsx";
import "../../../styles/react-datepicker.css";
import {
  EditTitle,
  FormContainerDarkenModal,
} from "../../../styles/editPageStyles.ts";
import { useNewInvoiceContext } from "../forms/NewInvoiceContextProvider.tsx";
import Sidebar from "@/features/shared/animations/SlidingMenu.tsx";
import { AnimatePresence } from "motion/react";
import { ClickOutsideProvider } from "@shelf/react-outside-click";

function NewInvoice() {
  const { isNewInvoiceOpen, setIsNewInvoiceOpen } = useNewInvoiceContext();

  // DarkenScreen appears when newInvoice tab is open
  return (
    <>
      <ClickOutsideProvider onOutsideClick={() => setIsNewInvoiceOpen(false)}>
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
      </ClickOutsideProvider>
    </>
  );
}

export default NewInvoice;
