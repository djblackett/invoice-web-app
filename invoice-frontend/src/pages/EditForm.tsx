import { FormProvider } from "react-hook-form";
import "../styles/react-datepicker.css";
import EditBottomMenu from "../components/menus-toolbars/EditBottomMenu";
import {
  BillText,
  DarkenScreen,
  EditTitle,
  FormContainerDarkenModal
} from "../styles/editStyles";
import CompanyFormInfo from "../components/form-components/CompanyFormInfo";
import ClientFormInfo from "../components/form-components/ClientFormInfo";
import DateAndPayment from "../components/form-components/DateAndPayment";
import FormErrorList from "../components/form-components/FormErrorList";
import EditFormItemList from "../components/form-components/EditFormItemList";
import { Invoice } from "../types/types";
import { useResponsive } from "../hooks/useResponsive";
import Description from "../components/form-components/Description";
import { useNewInvoiceForm } from "../hooks/useNewInvoiceForm";
import { useNewInvoiceContext } from "../components/form-components/NewInvoiceContextProvider";


type EditFormProps = {
  invoice: Invoice;
};

function EditForm({
  invoice
}: EditFormProps) {

  const { editPageWidth, padding } = useResponsive();
  const { isNewInvoiceOpen } = useNewInvoiceContext();
  const { methods } = useNewInvoiceForm();

  if (!invoice) {
    return null;
  }

  return (
    <DarkenScreen style={{ visibility: isNewInvoiceOpen ? "visible" : "hidden" }}>
      <FormContainerDarkenModal
        style={{
          width: isNewInvoiceOpen ? `${editPageWidth}px` : 0,
          padding: isNewInvoiceOpen ? padding : 0,
        }}
      >
        <EditTitle>
          Edit <span style={{ color: "#7E88C3" }}>#</span>
          {invoice && invoice.id.substring(0, 6)}
        </EditTitle>

        <FormProvider {...methods}>
          <form style={{ display: "flex", flexDirection: "column" }}>
            <BillText>Bill From</BillText>
            <CompanyFormInfo
              invoice={invoice}
            />
            <BillText>Bill To</BillText>
            <ClientFormInfo
              invoice={invoice}
            />
            <DateAndPayment
              invoice={invoice}

            />
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
    </DarkenScreen>
  );
}

export default EditForm;
