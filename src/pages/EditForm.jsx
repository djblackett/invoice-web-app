/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

import React, {useEffect, useLayoutEffect, useState} from "react";
import {useForm} from "react-hook-form";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {updateInvoice} from "../features/invoices/invoicesSlice";
import {v4 as uuidv4} from "uuid";

import "../styles/react-datepicker.css";
import {useWindowWidth} from "../hooks/useWindowWidth";
import EditBottomMenu from "../components/menus-toolbars/EditBottomMenu";
import EditFormItemList from "../components/form-components/EditFormItemList";
import {
  BillText,
  DarkenScreen,
  EditTitle,
  ErrorText,
  FormContainerDarkenModal, Input,
  Label,
} from "../styles/editStyles";
import {CompanyFormInfo} from "../components/form-components/CompanyFormInfo";
import {ClientFormInfo} from "../components/form-components/ClientFormInfo";
import {DateAndPayment} from "../components/form-components/DateAndPayment";
import LongFormEntry from "../components/form-components/LongFormEntry";


export const convertDateToString = date => {
  const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  return [year, month, day].join("-");
}

export const convertStringToDate = (str) => {
  if (!str) {
    return new Date();
  }
   const dateArray = str.split("-");
   return new Date(Date.UTC(dateArray[0], dateArray[1], dateArray[2]));

}

function EditForm({
  isEditOpen,
  setIsEditOpen,
  padding,
  setPadding,
  invoice,
}) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const width = useWindowWidth();
  const [editPageWidth, setEditPageWidth] = useState(0);
  const [startDate, setStartDate] = useState(convertStringToDate(invoice.createdAt));
  const [items, setItems] = useState(invoice.items || []);
  const [hasEmptyField, setHasEmptyField] = useState(false);
  const dispatch = useDispatch();
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(
      invoice.paymentTerms || 1
  );

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // checks for empty form inputs on every render
  useEffect(() => {
    const inputs = document.querySelectorAll("input");
    let count = 0;
    for (let i = 0; i < inputs.length; i++) {
      if (
        inputs.item(i).value.length === 0 &&
        inputs.item(i).defaultValue.length === 0
      ) {
        count++;
        break;
      }
    }

    if (count > 0) {
      setHasEmptyField(true);
    } else {
      setHasEmptyField(false);
    }
  });


  // submit form logic
  const onSubmit = (data) => {

    // check for empty fields or items before submitting
    if (hasEmptyField || items.length === 0) {
      return;
    }

    // build updated invoice from form data
    const newInvoice = {
      ...invoice,
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
      paymentTerms: selectedPaymentOption,
      description: data.projectDescription,
      items: items,
      status: "pending",
    };

    // recalculate the total for invoice
    let total = 0;
    for (let i of items) {
      total += Number(i.total);
    }
    newInvoice.total = total;

    const date = new Date(startDate.getTime() + 86400000 * newInvoice.paymentTerms);

    const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
    newInvoice.paymentDue = [year, month, day].join("-");

    dispatch(updateInvoice(newInvoice));
    setIsEditOpen(false);
  };

  useLayoutEffect(() => {
    if (width > 1200 && isEditOpen) {
      setEditPageWidth(616);
      setPadding("2.5rem 2.5rem 2rem calc(2.5rem + 17px)");
    } else if (width < 1200 && isEditOpen) {
      setEditPageWidth(616);
      setPadding("2.5rem 2.5rem 2.5rem 2.5rem");
    }

    else if (width < 600 && isEditOpen) {
      setEditPageWidth(width);
      setPadding("1.5rem 1.5rem 1.5rem 1.5rem");
    }

    else if (!isEditOpen) {
      setEditPageWidth(0);
      // setPadding("0px");
    }
  }, [width, padding, isEditOpen]);


  // gives unique ids to all invoice items
  useLayoutEffect(() => {
    const newItems = items.map((item) => {
      return { ...item, id: uuidv4() };
    });
    setItems(newItems);
  }, []);

  // form validation -- adds red border for empty elements
  const handleChange = (e) => {
    if (e.target.value.length === 0 && e.target.defaultValue.length === 0) {
      e.target.style.setProperty("border", "1px solid red");
    } else {
      e.target.style.setProperty("border", "none");
    }
  };

  // sets the payment option after change
  const handleChangeSelectedOption = (option) => {
    setSelectedPaymentOption(option);
  };

  // handles the payment dropdown upon click
  const handlePaymentClick = (e) => {
    setIsPaymentOpen(!isPaymentOpen);
  };

  // todo is this redundant now that the above toggles?
  // closes payment dropdown once an option is selected
  const handlePaymentSelect = () => {
    setIsPaymentOpen(false);
  };


  return (
    <DarkenScreen style={{visibility: isEditOpen ? "visible" : "hidden"}}>
      <FormContainerDarkenModal
          style={{
            width: isEditOpen ? `${editPageWidth}px` : 0,
            padding: isEditOpen ? padding : 0,
          }}
      >
        <EditTitle>
          Edit <span style={{color: "#7E88C3"}}>#</span>
          {invoice.id.substring(0, 6)}
        </EditTitle>

        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}

        <form onSubmit={handleSubmit(onSubmit)} style={{display: "flex", flexDirection: "column"}}>
          {/* register your input into the hook by invoking the "register" function */}
          <BillText>Bill From</BillText>
          <CompanyFormInfo errors={errors} senderAddress={invoice.senderAddress}
                           useFormRegisterReturn={register("streetAddress", {required: true, pattern: /^[A-Za-z0-9 ]+$/i, maxLength: 50})} onChange={handleChange}
                           useFormRegisterReturn1={register("city", {required: true, pattern: /^\w+$/i, maxLength: 30})}
                           useFormRegisterReturn2={register("postalCode", {required: true, pattern: /^\w+[\w ]+$/i, maxLength: 10, minLength: 5})}
                           editPageWidth={editPageWidth} onChange1={() => handleChange}
                           useFormRegisterReturn3={register("country", {required: true, pattern: /^[A-Za-z0-9 ]+$/i, maxLength: 30})}/>

          {/* //  Client details */}

          <BillText>Bill To</BillText>
          <ClientFormInfo errors={errors} clientName={invoice.clientName}
                          useFormRegisterReturn={register("clientName", {required: true})}
                          clientEmail={invoice.clientEmail}
                          useFormRegisterReturn1={register("clientEmail", {required: true})}
                          clientAddress={invoice.clientAddress}
                          useFormRegisterReturn2={register("clientStreetAddress", {required: true})}
                          useFormRegisterReturn3={register("clientCity", {required: true})}
                          useFormRegisterReturn4={register("clientPostalCode", {required: true})}
                          editPageWidth={editPageWidth}
                          useFormRegisterReturn5={register("clientCountry", {required: true})}/>

          <DateAndPayment editPageWidth={editPageWidth} selected={startDate} onChange={(date) => setStartDate(date)}
                          handlePaymentSelect={handlePaymentSelect} paymentOpen={isPaymentOpen}
                          handlePaymentClick={handlePaymentClick} selectedPaymentOption={selectedPaymentOption}
                          handleChangeSelectedOption={handleChangeSelectedOption}/>

          <LongFormEntry isLongOnMobile={editPageWidth < 768}>
            <Label
                htmlFor="projectDescription"
                style={{color: errors.projectDescription ? "red" : ""}}
            >
              Project Description
            </Label>
            <Input
                long
                type="text"
                defaultValue={invoice.description}
                error={!!errors?.title}
                {...register("projectDescription", {required: true})}
                style={{
                  border: errors.projectDescription ? "1px solid red" : "",
                }}
            />
          </LongFormEntry>

          <EditFormItemList
              invoice={invoice}
              items={items}
              setItems={setItems}
          />

          {hasEmptyField && <ErrorText>- All fields must be added</ErrorText>}
          {items.length === 0 && <ErrorText>- An item must be added</ErrorText>}

          <EditBottomMenu
              setIsOpen={setIsEditOpen}
              saveText={"Save Changes"}
              closeText={"Cancel"}
              setItems={setItems}
              invoice={invoice}
          />
        </form>
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
