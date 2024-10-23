import { FormProvider } from "react-hook-form";
import PropTypes from "prop-types";
import React from "react";
import { BillText } from "../../styles/editStyles";
import CompanyFormInfo from "./CompanyFormInfo";
import DateAndPayment from "./DateAndPayment";
import EditFormItemList from "./EditFormItemList";
import NewInvoiceBottomMenu from "../menus-toolbars/NewInvoiceBottomMenu";

import FormErrorList from "./FormErrorList";
import ClientFormInfo from "./ClientFormInfo";
import Description from "./Description";
import { useNewInvoiceForm } from "../../hooks/useNewInvoiceForm";

type NewInvoiceFormProps = {
  editPageWidth: number;
  isDraft: boolean;
  isNewOpen: boolean;
  selectedPaymentOption: number;
  setIsDraft: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPaymentOption: React.Dispatch<React.SetStateAction<number>>;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  startDate: Date;
};

export default function NewInvoiceForm({
  startDate,
  setStartDate,
  isNewOpen,
  setIsNewOpen,
  isDraft,
  setIsDraft,
  setSelectedPaymentOption,
  selectedPaymentOption,
}: NewInvoiceFormProps) {

  const { methods, isPaymentOpen, handleChangeSelectedOption, handlePaymentClick, onSubmit } = useNewInvoiceForm({
    startDate,
    setStartDate,
    isDraft,
    setIsDraft,
    setIsNewOpen,
    selectedPaymentOption,
    setSelectedPaymentOption,
  });

  return (
    // "handleSubmit" will validate your inputs before invoking "onSubmit"
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

        <FormErrorList isEditOpen={isNewOpen} />
        <NewInvoiceBottomMenu
          setIsDraft={setIsDraft}
          setIsOpen={setIsNewOpen}
          saveText="Save & Send"
          closeText="Discard"
          justifyCancel="flex-start"
          onSubmit={onSubmit}
        />
      </form>
    </FormProvider>
  );
}

NewInvoiceForm.propTypes = {
  editPageWidth: PropTypes.number.isRequired,
  // startDate: PropTypes.object.isRequired,
  setStartDate: PropTypes.func.isRequired,
  setIsNewOpen: PropTypes.func.isRequired,
  isDraft: PropTypes.bool.isRequired,
  setIsDraft: PropTypes.func.isRequired,
  setSelectedPaymentOption: PropTypes.func.isRequired,
  selectedPaymentOption: PropTypes.number.isRequired,
  isNewOpen: PropTypes.bool.isRequired,
};
