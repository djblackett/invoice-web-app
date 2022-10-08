/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import FormDropDown from '../components/form-components/FormDropDown';




import React, { useState, useEffect, useLayoutEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
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
  AddressDetailInput, BillText,
  DarkenScreen, EditTitle, ErrorText, FormContainerDarkenModal,
  Input,
  Label,
  ProjectDescription,
  StreetAddressInput
} from "../styles/editStyles";

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
    watch,
    formState: { errors },
    reset
  } = useForm();

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <Input
      className="custom-input"
      onClick={onClick}
      ref={ref}
      defaultValue={value}
    />
  ));

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
    console.log("button pressed");
    e.preventDefault();

    setIsPaymentOpen(true);
    console.log("isPaymentOpen: " + isPaymentOpen);
  };

  const handlePaymentSelect = (e) => {
    setIsPaymentOpen(false);
  }

  // todo add items to newInvoice
  //todo figure out which invoice date goes with what

  const onSubmit = (data) => {
    // console.log(data);


    let newInvoice = {
      // ...invoice,
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
      // createdAt: invoice.createdAt, 
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

    // console.log(newInvoice);
    dispatch(addInvoice(newInvoice));
    setIsNewOpen(false);
    reset();
    // newInvoice = {};
  };

  // console.log(watch("streetAddress"));

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
      // setEditPageWidth(0);
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
    // console.log(items);
  }, []);



              // todo make this input not editable - doesn't have to be a DatePicker component
  return (
    <DarkenScreen style={{ display: isNewOpen ? "block" : "none" }}>
      <FormContainerDarkenModal
        style={{
          width: isNewOpen ? `${editPageWidth}px` : "0px",
          // paddingLeft: `${padding}px`,
          // paddingRight: `${padding}px`,
          padding: padding,
          // paddingTop: "2rem",
        }}
      >
        <EditTitle>
          New Invoice
        </EditTitle>

        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <BillText>Bill From</BillText>
          <FormEntry>
            <Label htmlFor="streetAddress">Street Address</Label>
            <StreetAddressInput
              // defaultValue={invoice.senderAddress.street}
              {...register("streetAddress")}
            />
          </FormEntry>
          <AddressBox>
            <FormEntry>
              <Label htmlFor="city">City</Label>
              <AddressDetailInput
                type="text"
                // defaultValue={invoice.senderAddress.city}
                {...register("city")}
              />
            </FormEntry>

            <FormEntry>
              <Label htmlFor="postalCode">Post Code</Label>
              <AddressDetailInput
                type="text"
                // defaultValue={invoice.senderAddress.postCode}
                {...register("postalCode")}
              />
            </FormEntry>

            <FormEntry>
              <Label htmlFor="country">Country</Label>
              <AddressDetailInput
                type="text"
                // defaultValue={invoice.senderAddress.country}
                {...register("country")}
              />
            </FormEntry>
          </AddressBox>

          {/*   client details */}

          <BillText>Bill To</BillText>
          <FormEntry>
            <Label htmlFor="clientName">Client's Name</Label>
            <Input
              type="text"
              // defaultValue={invoice.clientName}
              {...register("clientName")}
            />
          </FormEntry>
          <FormEntry>
            <Label htmlFor="clientEmail">Client's Email</Label>
            <Input
              // defaultValue={invoice.clientEmail}
              {...register("clientEmail")}
            />
          </FormEntry>
          <FormEntry>
            <Label htmlFor="clientStreetAddress">Street Address</Label>
            <StreetAddressInput
              // defaultValue={invoice.clientAddress.street}
              {...register("clientStreetAddress")}
            />
          </FormEntry>
          <AddressBox>
            <FormEntry>
              <Label htmlFor="clientCity">City</Label>
              <AddressDetailInput
                type="text"
                // defaultValue={invoice.clientAddress.city}
                {...register("clientCity")}
              />
            </FormEntry>

            <FormEntry>
              <Label htmlFor="clientPostalCode">Post Code</Label>
              <AddressDetailInput
                type="text"
                // defaultValue={invoice.clientAddress.postCode}
                {...register("clientPostalCode")}
              />
            </FormEntry>

            <FormEntry>
              <Label htmlFor="country">Country</Label>
              <AddressDetailInput
                type="text"
                // defaultValue={invoice.clientAddress.country}
                {...register("clientCountry")}
              />
            </FormEntry>
          </AddressBox>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "504px",
            }}
          >
            <FormEntry>
              <Label htmlFor="invoiceDate">Invoice Date</Label>

              <DatePicker
                disabled
                customInput={<ExampleCustomInput />}
                selected={startDate}
                value={startDate}
                // onChange={(date) => setStartDate(date)}
                style={{ width: "240px" }}
              />
            </FormEntry>

            <FormEntry>
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <FormDropDown 
                handlePaymentSelect={handlePaymentSelect} 
                isPaymentOpen={isPaymentOpen} 
                handlePaymentClick={handlePaymentClick}
                selectedPaymentOption={Number(selectedPaymentOption)}
                handleChangeSelectedOption={handleChangeSelectedOption}
              />

            </FormEntry>

            {/* include validation with required or other standard HTML validation rules */}
            {/* <Input type="text" {...register('exampleRequired', { required: true })} /> */}
            {/* errors will return when field validation fails  */}
            {/* {errors.exampleRequired && <span>This field is required</span>} */}
          </div>
          <ProjectDescription>
            <Label htmlFor="projectDescription">Project Description</Label>
            <Input
              type="text"
              // defaultValue={invoice.description}
              {...register("projectDescription")}
              style={{ marginBottom: 0, width: "504px" }}
            />
          </ProjectDescription>
          {/* <Input type="submit" style={{ marginLeft: "5px" }} /> */}

          <EditFormItemList
            // invoice={invoice}
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
  // handleClose: PropTypes.func.isRequired,
};

export default NewInvoice;
