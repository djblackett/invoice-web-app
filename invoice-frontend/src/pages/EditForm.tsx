import React, { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import PropTypes from "prop-types";
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
import {
  convertStringToDate,
} from "../utils/utilityFunctions";
import { Invoice } from "../types/types";
import { useResponsive } from "../hooks/useResponsive";
import Description from "../components/form-components/Description";
import { useEditInvoiceForm } from "../hooks/useEditInvoiceForm";


type EditFormProps = {
  isEditOpen: boolean;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  invoice: Invoice;
};

function EditForm({
  isEditOpen,
  setIsEditOpen,
  invoice
}: EditFormProps) {

  const { editPageWidth, padding } = useResponsive();

  // todo - are these useState hooks necessary?
  const [startDate, setStartDate] = useState(
    convertStringToDate(invoice?.createdAt),
  );
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(
    invoice?.paymentTerms || 1,
  );
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const onClose = () => {
    setIsEditOpen(false);
    setSelectedPaymentOption(1);
    reset();
  };

  const { methods, onSubmit } = useEditInvoiceForm({
    invoice,
    onClose,
    startDate,
    selectedPaymentOption,
  });

  const {
    reset,
  } = methods;

  useEffect(() => {
    if (invoice) {
      setSelectedPaymentOption(invoice.paymentTerms);
    }
  }, [invoice]);

  // sets the payment option after change
  const handleChangeSelectedOption = (option: number) => {
    setSelectedPaymentOption(option);
  };

  // handles the payment dropdown upon click
  const handlePaymentClick = () => {
    setIsPaymentOpen(!isPaymentOpen);
  };

  // this shouldn't be possible, but better safe than sorry
  if (!invoice) {
    return null;
  }

  return (
    <DarkenScreen style={{ visibility: isEditOpen ? "visible" : "hidden" }}>
      <FormContainerDarkenModal
        style={{
          width: isEditOpen ? `${editPageWidth}px` : 0,
          padding: isEditOpen ? padding : 0,
        }}
      >
        <EditTitle>
          Edit <span style={{ color: "#7E88C3" }}>#</span>
          {invoice && invoice.id.substring(0, 6)}
        </EditTitle>

        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column" }}>
            <BillText>Bill From</BillText>
            <CompanyFormInfo
              invoice={invoice}
              isDraft={false}
            />
            <BillText>Bill To</BillText>
            <ClientFormInfo
              invoice={invoice}
              isDraft={false}
            />
            <DateAndPayment
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              paymentOpen={isPaymentOpen}
              handlePaymentClick={handlePaymentClick}
              selectedPaymentOption={selectedPaymentOption}
              handleChangeSelectedOption={handleChangeSelectedOption}
            />
            <Description invoice={invoice} />
            <EditFormItemList
              invoice={invoice}
              isEditOpen={isEditOpen}
              isDraft={false}
            />
            <FormErrorList isEditOpen={isEditOpen} />
            <EditBottomMenu
              setIsOpen={setIsEditOpen}
              saveText="Save Changes"
              closeText="Cancel"
              onSubmit={onSubmit}
              justifyCancel=""
            />
          </form>
        </FormProvider>
      </FormContainerDarkenModal>
    </DarkenScreen>
  );
}

EditForm.propTypes = {
  isEditOpen: PropTypes.bool.isRequired,
  setIsEditOpen: PropTypes.func.isRequired,
};

export default EditForm;
