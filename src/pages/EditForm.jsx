/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { updateInvoice } from "../features/invoices/invoicesSlice";
import { v4 as uuidv4 } from "uuid";
import "../styles/react-datepicker.css";
import { useWindowWidth } from "../hooks/useWindowWidth";
import EditBottomMenu from "../components/menus-toolbars/EditBottomMenu";
import {
  BillText,
  DarkenScreen,
  EditTitle,
  ErrorText,
  FormContainerDarkenModal, Input,
  Label,
} from "../styles/editStyles";
import { CompanyFormInfo } from "../components/form-components/CompanyFormInfo";
import { ClientFormInfo } from "../components/form-components/ClientFormInfo";
import { DateAndPayment } from "../components/form-components/DateAndPayment";
import LongFormEntry from "../components/form-components/LongFormEntry";
import { validationSchema } from "../components/form-components/NewInvoiceForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputFormItem1 } from "../components/form-components/InputFormItem1";
import { useParams } from "react-router-dom";


const formOptions = { resolver: yupResolver(validationSchema) };
export const convertDateToString = date => {
  const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  return [year, month, day].join("-");
};

export const convertStringToDate = (str) => {
  if (!str) {
    return new Date();
  }
  const dateArray = str.split("-");
  return new Date(Date.UTC(dateArray[0], dateArray[1], dateArray[2]));

};

function EditForm({
  isEditOpen,
  setIsEditOpen,
  padding,
  setPadding,
  invoice,
}) {


  const methods = useForm(
    { formOptions }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, submitCount },
    getValues,
    watch,
    trigger,
    reset,
    setError,
  } = methods;

  const width = useWindowWidth();
  const { id } = useParams();
  const [editPageWidth, setEditPageWidth] = useState(0);
  const [startDate, setStartDate] = useState(convertStringToDate(invoice.createdAt));
  const [hasEmptyField, setHasEmptyField] = useState(false);
  const dispatch = useDispatch();
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(
    invoice.paymentTerms || 1
  );

  const watcher = watch();

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);


  const createInvoiceObject = (data) => {
    const newInvoice = {
      id: id,
      clientName: data.clientName,
      clientAddress: {
        city: data.clientCity,
        country: data.clientCountry,
        postCode: data.clientPostalCode,
        street: data.clientStreetAddress,
      },
      senderAddress: {
        city: data.city,
        country: data.country,
        postCode: data.postalCode,
        street: data.streetAddress,
      },
      clientEmail: data.clientEmail,
      createdAt: convertDateToString(startDate),
      description: data.projectDescription,
      items: [...data.items],
    };

    let invoiceTotal = 0;

    let items = newInvoice.items;

    for (let i = 0; i < items.length; i++) {
      items[i].total = (Number(items[i].quantity) * Number(items[i].price)).toFixed(2);
      invoiceTotal += Number(items[i].total);
      if (!items[i].id) {
        items[i].id = uuidv4();
      }
    }

    newInvoice.total = invoiceTotal;
    // newInvoice.id = newInvoice.id ? newInvoice.id : generateId();
    newInvoice.paymentTerms = selectedPaymentOption;
    // newInvoice.status = isDraft ?  "draft" : "pending";
    newInvoice.status = invoice.status;
    const date = new Date(startDate.getTime() + 86400000 * newInvoice.paymentTerms);

    const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
    newInvoice.paymentDue = [year, month, day].join("-");

    console.log("end of newVoice function", newInvoice);
    return newInvoice;
  };


  useEffect(() => {
    if (!watcher.items || watcher.items.length === 0) {
      setError("items", { type: "custom", message: "An item must be added" });
    }
  }, [watcher.items]);

  const onSubmit = (e) => {
    const watcher = watch();
    console.log(watcher);

    const data = getValues();

    if (!data.items || data.items.length === 0) {
      setError("items", { type: "custom", message: "An item must be added" });
      // trigger();
      return;
    }

    //trigger validation on fields
    trigger()
      .then(value => {
        if (value){
          console.log("validation success");
          const newInvoice = createInvoiceObject(data);
          dispatch(updateInvoice(newInvoice));
          setIsEditOpen(false);
          setSelectedPaymentOption(1);
          console.log(newInvoice);
          reset();
        }
      });

  };

  // old submit form logic
  // const onSubmit = (data) => {
  //
  //   // check for empty fields or items before submitting
  //   if (hasEmptyField || items.length === 0) {
  //     return;
  //   }
  //
  //   // build updated invoice from form data
  //   const newInvoice = {
  //     ...invoice,
  //     clientName: data.clientName,
  //     clientAddress: {
  //       city: data.clientCity,
  //       country: data.clientCountry,
  //       postCode: data.clientPostalCode,
  //       street: data.clientStreetAddress,
  //     },
  //     senderAddress: {
  //       city: data.city,
  //       country: data.country,
  //       postCode: data.postalCode,
  //       street: data.streetAddress,
  //     },
  //     clientEmail: data.clientEmail,
  //     createdAt: convertDateToString(startDate),
  //     paymentTerms: selectedPaymentOption,
  //     description: data.projectDescription,
  //     items: items,
  //     status: "pending",
  //   };
  //
  //   // recalculate the total for invoice
  //   let total = 0;
  //   for (let i of items) {
  //     total += Number(i.total);
  //   }
  //   newInvoice.total = total;
  //
  //   const date = new Date(startDate.getTime() + 86400000 * newInvoice.paymentTerms);
  //
  //   const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  //   newInvoice.paymentDue = [year, month, day].join("-");
  //
  //   dispatch(updateInvoice(newInvoice));
  //   setIsEditOpen(false);
  // };

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
  const handleChangeSelectedOption = (option) => {
    setSelectedPaymentOption(option);
  };

  // handles the payment dropdown upon click
  const handlePaymentClick = (e) => {
    setIsPaymentOpen(!isPaymentOpen);
  };

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
          {invoice.id.substring(0, 6)}
        </EditTitle>

        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column" }}>

            {/* register your input into the hook by invoking the "register" function */}

            {/* Company Details */}
            <BillText>Bill From</BillText>
            <CompanyFormInfo errors={errors} senderAddress={invoice.senderAddress}
              invoice={invoice}
              editPageWidth={editPageWidth}/>

            {/* //  Client details */}
            <BillText>Bill To</BillText>
            <ClientFormInfo
              editPageWidth={editPageWidth} invoice={invoice}/>

            <DateAndPayment editPageWidth={editPageWidth} selected={startDate} onChange={(date) => setStartDate(date)}
              paymentOpen={isPaymentOpen}
              handlePaymentClick={handlePaymentClick} selectedPaymentOption={selectedPaymentOption}
              handleChangeSelectedOption={handleChangeSelectedOption}/>

            <LongFormEntry isLongOnMobile={editPageWidth < 768}>
              <Label
                htmlFor="projectDescription"
                style={{ color: errors.projectDescription ? "red" : "" }}
              >
              Project Description
              </Label>
              <Input
                long
                type="text"
                defaultValue={invoice.description}
                error={!!errors?.title}
                {...register("projectDescription", { required: true })}
                style={{
                  border: errors.projectDescription ? "1px solid red" : "",
                }}
              />
            </LongFormEntry>

            <InputFormItem1 invoice={invoice} isEditOpen={ isEditOpen }/>

            <ErrorText style={{ marginTop: "2rem", display: submitCount > 0 ? "block" : "none" }}>- All fields must be added</ErrorText>
            { errors.items && <ErrorText >- An item must be added</ErrorText>
            }

            <EditBottomMenu
              setIsOpen={setIsEditOpen}
              saveText={"Save Changes"}
              closeText={"Cancel"}
              invoice={invoice}
              onSubmit={onSubmit}
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
  handleClose: PropTypes.func,
  invoice: PropTypes.object,
  padding: PropTypes.string,
  setPadding: PropTypes.func,
};

export default EditForm;
