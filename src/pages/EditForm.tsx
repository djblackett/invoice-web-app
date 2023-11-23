/* eslint-disable react/display-name */
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FormProvider, useForm} from "react-hook-form";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {yupResolver} from "@hookform/resolvers/yup";
import {useParams} from "react-router-dom";
import {selectInvoiceById, updateInvoice} from "../features/invoices/invoicesSlice";
import "../styles/react-datepicker.css";
import useWindowWidth from "../hooks/useWindowWidth";
import EditBottomMenu from "../components/menus-toolbars/EditBottomMenu";
import {
  BillText,
  DarkenScreen,
  EditTitle,
  FormContainerDarkenModal, Input,
  Label,
} from "../styles/editStyles";
import {CompanyFormInfo} from "../components/form-components/CompanyFormInfo";
import ClientFormInfo from "../components/form-components/ClientFormInfo";
import DateAndPayment from "../components/form-components/DateAndPayment";
import LongFormEntry from "../components/form-components/LongFormEntry";
import {validationSchema} from "../types/schemas";
import FormErrorList from "../components/form-components/FormErrorList";
import EditFormItemList from "../components/form-components/EditFormItemList";
import { convertStringToDate, createInvoiceObject} from "../utils/utilityFunctions";
import { ReduxInvoiceState } from "../types/types";


const formOptions = {resolver: yupResolver(validationSchema)};

type EditFormProps = {
  isEditOpen: boolean;
  padding: string;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPadding: React.Dispatch<React.SetStateAction<string>>;
}

function EditForm({
  isEditOpen,
  setIsEditOpen,
  padding,
  setPadding,
}: EditFormProps) {

  const methods = useForm(
    {
      ...formOptions,
      mode: "onChange"
    },
  );

  const {
    register,
    handleSubmit,
    formState: {errors},
    getValues,
    watch,
    trigger,
    reset,
    setError,
    clearErrors
  } = methods;

  const width = useWindowWidth();
  const { id } = useParams();
  const dispatch = useDispatch();
  const watcher = watch();

  const invoice = useSelector((state: ReduxInvoiceState) => selectInvoiceById(state, id));
  const [editPageWidth, setEditPageWidth] = useState(0);
  const [startDate, setStartDate] = useState(convertStringToDate(invoice?.createdAt));
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(invoice?.paymentTerms || 1);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

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


  const onSubmit = () => {
    const data = getValues();
    // alternate check for items
    // returns without submitting invoice
    if (!data.items || data.items.length === 0) {
      setError("items", { type: "custom", message: "An item must be added" });
      return;
    }

    // trigger validation on fields
    trigger()
      .then(value => {
        if (value){
          // console.log("validation success");
          const newInvoice = createInvoiceObject(data, startDate, selectedPaymentOption, id);
          console.log(data.items);
          dispatch(updateInvoice(newInvoice));

          clearErrors();
          setIsEditOpen(false);
          setSelectedPaymentOption(1); // todo check this
          // console.log(newInvoice);
          reset();
          console.log("Form reset");
        }
      });

  };

  // calculates width and padding of editForm depending on window width and whether the edit tab is open
  useLayoutEffect(() => {
    if (width > 1200 && isEditOpen) {
      setEditPageWidth(616);
      setPadding("2.5rem 2.5rem 2rem calc(2.5rem + 17px)");
    } else if (width < 1200 && width > 325 && isEditOpen) {
      setEditPageWidth(616);
      setPadding("2.5rem 2.5rem 2.5rem 2.5rem");
    } else if (width < 325 && isEditOpen) {
      setEditPageWidth(325);
      setPadding("2rem 1.5rem 2.5rem 1.5rem");
    } else if (width < 600 && isEditOpen) {
      setEditPageWidth(width);
      setPadding("1.5rem 1.5rem 1.5rem 1.5rem");
    } else if (!isEditOpen) {
      setEditPageWidth(0);
    }
  }, [width, padding, isEditOpen]);


  // sets the payment option after change
  const handleChangeSelectedOption = (option : number) => {
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
              editPageWidth={editPageWidth}
              isDraft={false}
            />

            {/* //  Client details */}
            <BillText>Bill To</BillText>
            <ClientFormInfo
              editPageWidth={editPageWidth} invoice={invoice} isDraft={false}/>

            <DateAndPayment selected={startDate} onChange={(date) => setStartDate(date)}
              paymentOpen={isPaymentOpen}
              handlePaymentClick={handlePaymentClick} selectedPaymentOption={selectedPaymentOption}
              handleChangeSelectedOption={handleChangeSelectedOption}/>

            <LongFormEntry className="project-description">
              <Label
                htmlFor="projectDescription"
                style={{ color: errors.projectDescription ? "#EC5757" : "" }}
              >
              Project Description
              </Label>
              <Input
                // long
                type="text"
                defaultValue={invoice?.description}
                {...register("projectDescription", { required: true })}
                style={{
                  border: errors.projectDescription ? "1px solid #EC5757" : "",
                }}
              />
            </LongFormEntry>

            <EditFormItemList invoice={invoice} isEditOpen={ isEditOpen } isDraft={ false } />


            <FormErrorList isEditOpen={isEditOpen}/>

            <EditBottomMenu
              setIsOpen={setIsEditOpen}
              saveText="Save Changes"
              closeText="Cancel"
              // invoice={invoice}
              onSubmit={onSubmit}
              justifyCancel=""/>
          </form>
        </FormProvider>
      </FormContainerDarkenModal>
    </DarkenScreen>
  );
}

EditForm.propTypes = {
  isEditOpen: PropTypes.bool.isRequired,
  setIsEditOpen: PropTypes.func.isRequired,
  // handleClose: PropTypes.func,
  // invoice: PropTypes.object,
  // padding: PropTypes.string,
  // setPadding: PropTypes.func,
};

export default EditForm;
