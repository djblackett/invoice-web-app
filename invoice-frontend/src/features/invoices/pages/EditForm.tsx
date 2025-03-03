import { FormProvider } from "react-hook-form";
import "../../../styles/react-datepicker.css";
import EditBottomMenu from "../forms/EditBottomMenu.tsx";
import {
  BillText,
  EditTitle,
  FormContainerDarkenModal,
} from "../../../styles/editPageStyles.ts";
import CompanyFormInfo from "../forms/CompanyFormInfo.tsx";
import ClientFormInfo from "../forms/ClientFormInfo.tsx";
import DateAndPayment from "../forms/DateAndPayment.tsx";
import FormErrorList from "../forms/FormErrorList.tsx";
import EditFormItemList from "../forms/EditFormItemList.tsx";
import { Invoice } from "../../../types/types.ts";

import Description from "../forms/Description.tsx";
import { useNewInvoiceForm } from "../hooks/useNewInvoiceForm.tsx";
import { useNewInvoiceContext } from "../forms/NewInvoiceContextProvider.tsx";
import { AnimatePresence } from "motion/react";
import Sidebar from "@/features/shared/animations/SlidingMenu.tsx";

type EditFormProps = {
  invoice: Invoice;
};

function EditForm({ invoice }: EditFormProps) {
  const { isNewInvoiceOpen } = useNewInvoiceContext();
  const { methods } = useNewInvoiceForm();

  if (!invoice) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isNewInvoiceOpen ? (
          <Sidebar key="sidebar-edit-parent">
            <FormContainerDarkenModal data-testid="editInvoiceModal">
              <EditTitle>
                Edit <span style={{ color: "#7E88C3" }}>#</span>
                {invoice && invoice.id.substring(0, 6)}
              </EditTitle>
              <FormProvider {...methods}>
                <form style={{ display: "flex", flexDirection: "column" }}>
                  <BillText>Bill From</BillText>
                  <CompanyFormInfo invoice={invoice} />
                  <BillText>Bill To</BillText>
                  <ClientFormInfo invoice={invoice} />
                  <DateAndPayment invoice={invoice} />
                  <Description invoice={invoice} />
                  <EditFormItemList
                    invoice={invoice}
                    isEditOpen={isNewInvoiceOpen}
                  />
                  <FormErrorList isEditOpen={isNewInvoiceOpen} />
                  <EditBottomMenu
                    saveText="Save Changes"
                    closeText="Cancel"
                    justifyCancel=""
                  />
                </form>
              </FormProvider>
            </FormContainerDarkenModal>
          </Sidebar>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default EditForm;
