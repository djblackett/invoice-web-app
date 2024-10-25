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

  const { methods, isPaymentOpen, handleChangeSelectedOption, handlePaymentClick, onSubmit } = useNewInvoiceForm();

  const {
    startDate,
    setStartDate,
    isDraft,
    setIsDraft,
    isNewInvoiceOpen,
    selectedPaymentOption,
  } = useNewInvoiceContext();

  return (
    <FormProvider {...methods}>
      <form>

        <BillText>Bill From</BillText>
        <CompanyFormInfo isDraft={isDraft} />
        <BillText>Bill To</BillText>
        <ClientFormInfo isDraft={isDraft} />

        <DateAndPayment
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          paymentOpen={isPaymentOpen}
          handlePaymentClick={handlePaymentClick}
          selectedPaymentOption={selectedPaymentOption}
          handleChangeSelectedOption={handleChangeSelectedOption}
        />

        <Description isDraft={isDraft} />
        <EditFormItemList isDraft={isDraft} />

        <FormErrorList isEditOpen={isNewInvoiceOpen} />
        <NewInvoiceBottomMenu
          closeText="Discard"
          justifyCancel="flex-start"
          onSubmit={onSubmit}
        />
      </form>
    </FormProvider>
  );
}
