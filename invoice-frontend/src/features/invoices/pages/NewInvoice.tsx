import InvoiceFormController from "../forms/InvoiceFormController.tsx";
import "../../../styles/react-datepicker.css";
import { FormContainerDarkenModal } from "../../../styles/editPageStyles.ts";
import { useNewInvoiceContext } from "../forms/NewInvoiceContextProvider.tsx";
import Sidebar from "@/features/shared/animations/SlidingMenu.tsx";
import { AnimatePresence } from "motion/react";
import { FormProvider } from "react-hook-form";

function NewInvoice() {
  const { isNewInvoiceOpen, methods } = useNewInvoiceContext();

  // DarkenScreen appears when newInvoice tab is open
  return (
    <>
      <AnimatePresence>
        {isNewInvoiceOpen ? (
          <Sidebar key="sidebar-parent">
            <FormContainerDarkenModal data-testid="newInvoicePage">
              <FormProvider {...methods}>
                <InvoiceFormController />
              </FormProvider>
            </FormContainerDarkenModal>
          </Sidebar>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default NewInvoice;
