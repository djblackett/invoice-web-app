import { FormProvider } from "react-hook-form";
import "../styles/react-datepicker.css";
import EditBottomMenu from "../components/menus-toolbars/EditBottomMenu";
import {
  BillText,
  EditTitle,
  FormContainerDarkenModal,
} from "../styles/editPageStyles";
import CompanyFormInfo from "../components/form-components/CompanyFormInfo";
import ClientFormInfo from "../components/form-components/ClientFormInfo";
import DateAndPayment from "../components/form-components/DateAndPayment";
import FormErrorList from "../components/form-components/FormErrorList";
import EditFormItemList from "../components/form-components/EditFormItemList";
import { Invoice } from "../types/types";

import Description from "../components/form-components/Description";
import { useNewInvoiceForm } from "../hooks/useNewInvoiceForm";
import { useNewInvoiceContext } from "../components/form-components/NewInvoiceContextProvider";
import { AnimatePresence } from "motion/react";
import Sidebar from "@/animation/SlidingMenu";

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
