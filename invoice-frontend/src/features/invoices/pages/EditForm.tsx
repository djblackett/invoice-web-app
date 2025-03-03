import { FormProvider } from "react-hook-form";
import "../../../styles/react-datepicker.css";
import EditBottomMenu from "../../../components/menus-toolbars/EditBottomMenu.tsx";
import {
  BillText,
  EditTitle,
  FormContainerDarkenModal,
} from "../../../styles/editPageStyles.ts";
import CompanyFormInfo from "../../../components/form-components/CompanyFormInfo.tsx";
import ClientFormInfo from "../../../components/form-components/ClientFormInfo.tsx";
import DateAndPayment from "../../../components/form-components/DateAndPayment.tsx";
import FormErrorList from "../../../components/form-components/FormErrorList.tsx";
import EditFormItemList from "../../../components/form-components/EditFormItemList.tsx";
import { Invoice } from "../../../types/types.ts";

import Description from "../../../components/form-components/Description.tsx";
import { useNewInvoiceForm } from "../hooks/useNewInvoiceForm.tsx";
import { useNewInvoiceContext } from "../../../components/form-components/NewInvoiceContextProvider.tsx";
import { AnimatePresence } from "motion/react";
import Sidebar from "@/animation/SlidingMenu.tsx";

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
