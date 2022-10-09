/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */





import React, { useState, useEffect, useLayoutEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { addInvoice } from "../features/invoices/invoicesSlice";
import { v4 as uuidv4 } from "uuid";

import "../styles/react-datepicker.css";
import AddressBox from "../components/form-components/AddressBox";
import { useWindowWidth } from "../hooks/useWindowWidth";

import EditFormItemList from "../components/form-components/EditFormItemList";
import FormEntry from "../components/form-components/FormEntry";

import NewInvoiceBottomMenu from "../components/menus-toolbars/NewInvoiceBottomMenu";
import {
  AddressDetailInput, BillText, CountryInput,
  DarkenScreen, EditTitle, ErrorText, FormContainerDarkenModal,
  Input,
  Label,
} from "../styles/editStyles";
import LongFormEntry from "../components/form-components/LongFormEntry";
import {CityPostContainer} from "../components/form-components/CompanyFormInfo";
import {DateAndPayment} from "../components/form-components/DateAndPayment";
import {convertDateToString} from "./EditForm";

const generateId = () => {
    const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let res = "";
    for(let i = 0; i < 2; i++) {
      let rnd = Math.floor(Math.random() * list.length);
      res = res + list.charAt(rnd);
    }

  for(let i = 0; i < 4; i++) {
    res = res + String(Math.floor(Math.random() * 9));

  }
    return res;
}

function NewInvoice({
  isNewOpen,
  setIsNewOpen,
  handleClose,
  padding,
  setPadding,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const width = useWindowWidth();

  const [isDraft, setIsDraft] = useState(false);
  const [isSubmitDirty, setSubmitDirty] = useState(false);

  const [editPageWidth, setEditPageWidth] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const [startDate, setStartDate] = useState(new Date());

  const [items, setItems] = useState([]);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(1);
  const handleChangeSelectedOption = (option) => {
    setSelectedPaymentOption(option);
  }
  const [hasEmptyField, setHasEmptyField] = useState(false);
  const dispatch = useDispatch();

   const handlePaymentClick = (e) => {
    e.preventDefault();
    setIsPaymentOpen(true);
  };

  const handlePaymentSelect = (e) => {
    setIsPaymentOpen(false);
  }

  const onSubmit = (data) => {

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
    newInvoice.paymentTerms = selectedPaymentOption,
    newInvoice.status = isDraft ?  "draft" : "pending";

    if (newInvoice.status === "pending" && hasEmptyField) {
      setSubmitDirty(true);
      return;
    }

    const date = new Date(startDate.getTime() + 86400000 * newInvoice.paymentTerms);

    const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
    newInvoice.paymentDue = [year, month, day].join("-");


    dispatch(addInvoice(newInvoice));
    setIsNewOpen(false);
    reset();
    setItems([]);
    setSelectedPaymentOption(1);
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
    } else if (width < 1200 && isNewOpen) {
      setEditPageWidth(616);
      setPadding("2.5rem 2.5rem 2.5rem 2.5rem");
    } else if (!isNewOpen) {
      setEditPageWidth(0);
      setPadding("0px");
    }
  }, [width, padding, isNewOpen]);

  useEffect(() => {
    const closeOnEscapeKey = (e) => (e.key === "Escape" ? handleClose() : null);
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [handleClose]);

  useLayoutEffect(() => {
    const newItems = items.map((item) => {
      return { ...item, id: uuidv4() };
    });
    setItems(newItems);
  }, []);

  const companyCountryChildren = (
      <>
        <Label
            htmlFor="country"
            style={{color: errors.country ? "red" : ""}}
        >
          Country
        </Label>
        <CountryInput
            type="text"

            style={{border: errors.country ? "1px solid red" : ""}}
            {...register("clientCountry")}
        />
      </>
  );

  const clientCountryChildren = (
      <>
        <Label
            htmlFor="country"
            style={{color: errors.clientCountry ? "red" : ""}}
        >
          Country
        </Label>
        <CountryInput
            style={{
              border: errors.clientCountry ? "1px solid red" : "",
            }}
            type="text"

            {...register("country")}
        />
      </>
  );


  return (
    <DarkenScreen style={{visibility: isNewOpen ? "visible" : "hidden" }}>
      <FormContainerDarkenModal
        style={{
          width: isNewOpen ? `${editPageWidth}px` : "0px",
          padding: padding,
          // transition: "width 3s linear",
        }}
      >
        <EditTitle>
          New Invoice
        </EditTitle>

        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <BillText>Bill From</BillText>
          <LongFormEntry>
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
                long
              {...register("streetAddress")}
            />
          </LongFormEntry>
          <AddressBox>
            <CityPostContainer>
            <FormEntry>
              <Label htmlFor="city">City</Label>
              <AddressDetailInput
                type="text"
                {...register("city")}
              />
            </FormEntry>

            <FormEntry>
              <Label htmlFor="postalCode">Post Code</Label>
              <AddressDetailInput
                type="text"
                {...register("postalCode")}
              />
            </FormEntry>
            </CityPostContainer>
            { width < 768 && <LongFormEntry isLongOnMobile={editPageWidth < 768}>
              {companyCountryChildren}
            </LongFormEntry>}

            {width >= 768 && <FormEntry>
              {companyCountryChildren}
            </FormEntry>}
          </AddressBox>

          {/*   client details */}

          <BillText>Bill To</BillText>
          <LongFormEntry>
            <Label htmlFor="clientName">Client's Name</Label>
            <Input
              type="text"
              long
              {...register("clientName")}
            />
          </LongFormEntry>
          <LongFormEntry>
            <Label htmlFor="clientEmail">Client's Email</Label>
            <Input
                long
              {...register("clientEmail")}
            />
          </LongFormEntry>
          <LongFormEntry>
            <Label htmlFor="clientStreetAddress">Street Address</Label>
            <Input
                long
              {...register("clientStreetAddress")}
            />
          </LongFormEntry>
          <AddressBox>
          <CityPostContainer>
            <FormEntry>
              <Label htmlFor="clientCity">City</Label>
              <AddressDetailInput
                type="text"
                {...register("clientCity")}
              />
            </FormEntry>

            <FormEntry>
              <Label htmlFor="clientPostalCode">Post Code</Label>
              <AddressDetailInput
                type="text"
                {...register("clientPostalCode")}
              />
            </FormEntry>
          </CityPostContainer>


            { width < 768 && <LongFormEntry isLongOnMobile={editPageWidth < 768}>
              {clientCountryChildren}
            </LongFormEntry>}

            {width >= 768 && <FormEntry>
              {clientCountryChildren}
            </FormEntry>}

          </AddressBox>


          <DateAndPayment editPageWidth={editPageWidth} selected={startDate} onChange={(date) => setStartDate(date)}
                          handlePaymentSelect={handlePaymentSelect} paymentOpen={isPaymentOpen}
                          handlePaymentClick={handlePaymentClick} selectedPaymentOption={selectedPaymentOption}
                          handleChangeSelectedOption={handleChangeSelectedOption}/>


          <LongFormEntry isLongOnMobile={editPageWidth < 768}>
            <Label htmlFor="projectDescription">Project Description</Label>
            <Input
              type="text"
              long
              {...register("projectDescription")}
              // style={{ marginBottom: 0, width: "504px" }}
            />
          </LongFormEntry>

          <EditFormItemList
            items={items}
            setItems={setItems}
          />

          {isSubmitDirty && <ErrorText>- All fields must be added</ErrorText>}
          {(isSubmitDirty && items.length === 0) && <ErrorText>- An item must be added</ErrorText>}

          <NewInvoiceBottomMenu setSubmitDirty={setSubmitDirty} setIsDraft={setIsDraft} setIsOpen={setIsNewOpen} saveText={"Save & Send"} closeText={"Discard"} justifyCancel={"flex-start"}/>
        </form>
      </FormContainerDarkenModal>
    </DarkenScreen>
  );
}

NewInvoice.propTypes = {
  isNewOpen: PropTypes.bool.isRequired,
  setIsNewOpen: PropTypes.func.isRequired,
};

export default NewInvoice;
