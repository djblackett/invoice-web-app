import { FormProvider } from "react-hook-form";
import { BillText } from "../../styles/editStyles";
import CompanyFormInfo from "./CompanyFormInfo";
import DateAndPayment from "./DateAndPayment";
import EditFormItemList from "./EditFormItemList";
import NewInvoiceBottomMenu from "../menus-toolbars/NewInvoiceBottomMenu";
import FormErrorList from "./FormErrorList";
import ClientFormInfo from "./ClientFormInfo";
import Description from "./Description";
import { useNewInvoiceForm } from "../../hooks/useNewInvoiceForm";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider";


export default function NewInvoiceForm() {

  const { methods } = useNewInvoiceForm();

  const {
    isNewInvoiceOpen,
  } = useNewInvoiceContext();

  return (
    <FormProvider {...methods}>
      <form>

        <BillText>Bill From</BillText>
        <CompanyFormInfo />
        <BillText>Bill To</BillText>
        <ClientFormInfo />

        <DateAndPayment />

        <Description />
        <EditFormItemList />

        <FormErrorList isEditOpen={isNewInvoiceOpen} />
        <NewInvoiceBottomMenu
          closeText="Discard"
          justifyCancel="flex-start"
        />
      </form>
    </FormProvider>
  );
}
