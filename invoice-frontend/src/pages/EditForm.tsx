import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { yupResolver } from "@hookform/resolvers/yup";
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

import { validationSchema } from "../types/schemas";
import FormErrorList from "../components/form-components/FormErrorList";
import EditFormItemList from "../components/form-components/EditFormItemList";
import {
  convertStringToDate,
  createInvoiceObject,
} from "../utils/utilityFunctions";
import { EDIT_INVOICE } from "../graphql/queries";
import { useMutation } from "@apollo/client";
import { Invoice } from "../types/types";
import { useResponsive } from "../hooks/useResponsive";
import Description from "../components/form-components/Description";

const formOptions = { resolver: yupResolver(validationSchema) };

type EditFormProps = {
  isEditOpen: boolean;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  invoice: Invoice;
};

function EditForm({
  isEditOpen,
  setIsEditOpen,
  id,
  invoice
}: EditFormProps) {


  const methods = useForm({
    ...formOptions,
    mode: "onChange",
  });

  const {
    handleSubmit,
    getValues,
    watch,
    trigger,
    reset,
    setError,
    clearErrors,
  } = methods;

  const watcher = watch();
  const { editPageWidth, padding } = useResponsive();
  const [startDate, setStartDate] = useState(
    convertStringToDate(invoice?.createdAt),
  );
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(
    invoice?.paymentTerms || 1,
  );
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);


  const [editInvoice, result] = useMutation(EDIT_INVOICE);

  // error notification if invoice has no items
  useEffect(() => {
    if (!watcher.items || watcher.items.length === 0) {
      setError("items", { type: "custom", message: "An item must be added" });
    }
  }, [watcher.items]);

  useEffect(() => {
    if (invoice) {
      setSelectedPaymentOption(invoice.paymentTerms);
    }
  }, [invoice]);

  const onSubmit = async () => {
    const data = getValues();
    // alternate check for items
    // returns without submitting invoice
    if (!data.items || data.items.length === 0) {
      setError("items", { type: "custom", message: "An item must be added" });
      return;
    }

    // trigger validation on fields
    trigger().then(async (value) => {
      if (value) {
        const newInvoice = createInvoiceObject(
          data,
          startDate,
          selectedPaymentOption,
          id,
          invoice,
        );

        await editInvoice({
          variables: {
            ...newInvoice
          }
        });

        console.log(result);

        clearErrors();
        setIsEditOpen(false);
        setSelectedPaymentOption(1); // todo check this

        reset();

      }
    });
  };


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
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column" }}>

            {/* register your input into the hook by invoking the "register" function */}

            {/* Company Details */}
            <BillText>Bill From</BillText>
            <CompanyFormInfo
              invoice={invoice}
              isDraft={false}
            />

            {/* //  Client details */}
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
