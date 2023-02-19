/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useLayoutEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { addInvoice } from "../features/invoices/invoicesSlice";
import { v4 as uuidv4 } from "uuid";
import { generateId} from "../utils/utilityFunctions";
import NewInvoiceForm from "../components/form-components/NewInvoiceForm";
import "../styles/react-datepicker.css";
import { useWindowWidth } from "../hooks/useWindowWidth";
import {
  DarkenScreen, EditTitle, FormContainerDarkenModal,
} from "../styles/editStyles";
import {convertDateToString} from "./EditForm";



// This component needs help
function NewInvoice({
  isNewOpen,
  setIsNewOpen, padding,
  setPadding,
}) {

  const {
    reset,
    formState: { errors },

  } = useForm();


  // DONE todo make conditionals that change whether fields are required depending on draft or pending state

  // todo check why all fields turn red when there is a form error and why the error text at bottom is not rendering


  const width = useWindowWidth();

  // initial state and default values for form
  const [isDraft, setIsDraft] = useState(true);
  const [isSubmitDirty, setSubmitDirty] = useState(false);
  const [editPageWidth, setEditPageWidth] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(1);
  const [hasEmptyField, setHasEmptyField] = useState(false);



  const dispatch = useDispatch();



  const createInvoiceObject = (data) => {
    let newInvoice = {
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
      items: items,
    };

    let total = 0;

    for (let i of items) {
      total += Number(i.total);
    }

    newInvoice.total = total;
    newInvoice.id = newInvoice.id ? newInvoice.id : generateId();
    newInvoice.paymentTerms = selectedPaymentOption;
    newInvoice.status = isDraft ?  "draft" : "pending";

    const date = new Date(startDate.getTime() + 86400000 * newInvoice.paymentTerms);

    const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
    newInvoice.paymentDue = [year, month, day].join("-");

    return newInvoice
  }

  function resetForm() {
    reset();
    setIsNewOpen(false);

    setItems([]);
    setSelectedPaymentOption(1);
    setSubmitDirty(false);
  }

  const onSubmit = (data) => {
    const newInvoice = createInvoiceObject(data);

    if (!isDraft && hasEmptyField) {
    // if (newInvoice.status === "pending" && hasEmptyField) {
      setSubmitDirty(true);
      console.log(isSubmitDirty);
      return;
    }
    dispatch(addInvoice(newInvoice));
    // resetForm();
    console.log("dispatched")
    reset();
    setIsNewOpen(false);

    setItems([]);
    setSelectedPaymentOption(1);
    setSubmitDirty(false);
  };


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

  useLayoutEffect(() => {
    if (width > 1200 && isNewOpen) {
      setEditPageWidth(616);
      setPadding("2.5rem 2.5rem 2rem calc(2.5rem + 17px)");
    } else if (width < 1200 && width > 325 && isNewOpen) {
      setEditPageWidth(616);
      setPadding("2.5rem 2.5rem 2.5rem 2.5rem");
    } else if (width < 325 && isNewOpen) {
      setEditPageWidth(325);
      setPadding("2rem 1.5rem 2.5rem 1.5rem");
    } else if (!isNewOpen) {
      setEditPageWidth(0);
      setPadding("0px");
    }
  }, [width, padding, isNewOpen]);

  useLayoutEffect(() => {
    const newItems = items.map((item) => {
      return { ...item, id: uuidv4() };
    });
    setItems(newItems);
  }, []);


  return (

    // DarkenScreen appears when newInvoice tab is open
    <DarkenScreen style={{visibility: isNewOpen ? "visible" : "hidden" }}>
      <FormContainerDarkenModal
        style={{
          width: isNewOpen ? `${editPageWidth}px` : "0px",
          padding: padding,
        }}
      >
        <EditTitle>
          New Invoice
        </EditTitle>

        <NewInvoiceForm
            startDate={startDate} setStartDate={setStartDate} setIsNewOpen={setIsNewOpen} onSubmit={onSubmit} setItems={setItems} editPageWidth={editPageWidth} items={items} isSubmitDirty={isSubmitDirty} setSubmitDirty={setSubmitDirty} isDraft={isDraft} setIsDraft={setIsDraft}  selectedPaymentOption={selectedPaymentOption} setSelectedPaymentOption={setSelectedPaymentOption}/>

      </FormContainerDarkenModal>
    </DarkenScreen>
  );
}

NewInvoice.propTypes = {
  isNewOpen: PropTypes.bool.isRequired,
  setIsNewOpen: PropTypes.func.isRequired,
  setPadding: PropTypes.func.isRequired,
  padding: PropTypes.string,
};

export default NewInvoice;
