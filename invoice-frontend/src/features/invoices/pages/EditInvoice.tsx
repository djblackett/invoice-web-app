import { FormProvider } from "react-hook-form";
import "../../../styles/react-datepicker.css";
import { FormContainerDarkenModal } from "../../../styles/editPageStyles.ts";
import { useNewInvoiceContext } from "../forms/NewInvoiceContextProvider.tsx";
import { AnimatePresence } from "motion/react";
import Sidebar from "@/features/shared/animations/SlidingMenu.tsx";
import { Invoice } from "@/features/invoices/types/invoiceTypes.ts";
import EditFormController from "../forms/EditFormController.tsx";

type EditFormProps = {
  invoice: Invoice;
};

function EditInvoice({ invoice }: EditFormProps) {
  const { isNewInvoiceOpen, methods } = useNewInvoiceContext();

  if (!invoice) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isNewInvoiceOpen ? (
          <Sidebar key="sidebar-edit-parent">
            <FormContainerDarkenModal data-testid="editInvoiceModal">
              <FormProvider {...methods}>
                <EditFormController invoice={invoice} />
              </FormProvider>
            </FormContainerDarkenModal>
          </Sidebar>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default EditInvoice;
