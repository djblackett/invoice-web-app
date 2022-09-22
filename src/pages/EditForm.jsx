/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import styled from "styled-components";
import React, { useState, useEffect, useLayoutEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { updateInvoice } from "../features/invoices/invoicesSlice";
import { v4 as uuidv4 } from "uuid";

import "../react-datepicker.css";
import AddressBox from "../components/AddressBox";
import { useWindowWidth } from "../hooks/useWindowWidth";
import EditBottomMenu from "../components/EditBottomMenu";
import EditFormItemList from "../components/EditFormItemList";
import FormEntry from "../components/FormEntry";
import FormDropDown from "../components/FormDropDown";

export const EditTitle = styled.h1`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text};
`;

export const FormContainer = styled.div`
  height: 100%;
  /* min-width: 300px; */
  top: 72px;
  bottom: 91px;
  left: 0;
  right: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
  background-size: cover;
  position: absolute;

  display: flex;
  flex-direction: column;
  transition: all 250ms ease-in-out;
  overflow-x: hidden;
  filter: drop-shadow(2px 2px 2px bottom);

  align-self: flex-start;
  z-index: 100;

  max-width: 100%;

  @media (min-width: 768px) {
    padding-left: 5rem;
    padding-right: 2rem;
    padding-top: 1rem;
    padding-bottom: 2rem;
    max-width: 700px;
    /* top: 72px; */
    right: 616px;
    max-height: calc(100vh - 72px);
  }

  @media (min-width: 1200px) {
    left: 90px;
    padding-left: 5rem;
    top: 0px;
    max-height: initial;
  }
`;

// export const FormEntry = styled.div`
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   align-items: flex-start;

//   font-style: ${({ theme }) => theme.font};
// `;

export const BillText = styled.p`
  color: ${({ theme }) => theme.outline};
  font-weight: bold;
  font-size: 0.75rem;
  /* margin: 5px; */
  margin-bottom: 1.5rem;
`;

export const Input = styled.input`
  width: 240px;
  height: 48px;
  border-radius: 4px;
  border-color: ${({ theme }) => theme.formFieldOutline};
  /* outline: none; */
  padding: 17px 20px 16px 20px;
  margin-bottom: 1.5rem;
  font-family: ${({ theme }) => theme.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* margin-left:5px; */
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;
  /* color: #0c0e16; */
  color: ${({ theme }) => theme.textPlain};
  background-color: ${({ theme }) => theme.editButton};

  &:focus {
    border-color: black;
  }

  .custom-input {
    padding: 0;
  }
`;

export const StreetAddressInput = styled(Input)`
  width: 100%;

  @media (min-width: 768px) {
    width: 504px;
  }
`;

export const inputStyles = {
  height: "48px",
  borderRadius: "4px",
  borderColor: ({ theme }) => theme.formFieldOutline,
  /* outline: none; */
  padding: "17px 20px 16px 20px",
  fontFamily: ({ theme }) => theme.font,
  fontStyle: "normal",
  fontWeight: "700",
  fontSize: "12px",
  lineHeight: "15px",
};

export const AddressDetailInput = styled(Input)`
  width: 152px;
`;

export const CountryInput = styled(AddressDetailInput)`
  width: 100%;
  min-width: 100%;

  @media (min-width: 768px) {
    width: initial;
    min-width: initial;
  }
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.greyText};
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
`;

export const DarkenScreen = styled.div`
  /* display: flex;
  align-items: center;
  justify-content: center; */
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 0.5s linear;
`;

export const ProjectDescription = styled(FormEntry)`
  margin-bottom: 0;
  max-width: 100%;
  width: 100%;
  @media (min-width: 768px) {
    width: 504px;
    max-width: initial;
  }
`;

export const LongEntry = styled(Input)`
  max-width: 100%;
  width: 100%;
  @media (min-width: 768px) {
    max-width: initial;
    width: 504px;
  }
`;

const ErrorText = styled.p`
  color: red;

  margin-top: 0;
`;

const ErrorTextInline = styled(ErrorText)`
  position: absolute;
  right: 1.5rem;
`;

export const Select = styled.select`
  width: 240px;
  height: 48px;
  border-radius: 4px;
  border-color: ${({ theme }) => theme.formFieldOutline};
  /* outline: none; */
  padding: 17px 20px 16px 20px;
  margin-bottom: 1.5rem;
  font-family: ${({ theme }) => theme.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* margin-left:5px; */
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;
  /* color: #0c0e16; */
  color: ${({ theme }) => theme.textPlain};
  background-color: ${({ theme }) => theme.editButton};

  &:focus {
    border-color: black;
  }

  .custom-input {
    padding: 0;
  }
`;

export const Option = styled.option`
  padding: 10px;
`;

export const DateAndPaymentContainer = styled.div`
  /* display: contents; */
  display: flex;
  justify-content: space-between;
  max-width: 100%;
  flex-wrap: wrap;
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
    width: 504px;
    max-width: initial;
  }
`;

function EditForm({
  isEditOpen,
  setIsEditOpen,
  handleClose,
  padding,
  setPadding,
  invoice,
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <Input
      style={{ width: editPageWidth < 768 ? "100%" : "initial" }}
      className="custom-input"
      onClick={onClick}
      ref={ref}
      defaultValue={value}
    />
  ));

  const width = useWindowWidth();

  const [editPageWidth, setEditPageWidth] = useState(null);

  const [startDate, setStartDate] = useState(new Date());

  const [items, setItems] = useState(invoice.items || []);

  const [hasEmptyField, setHasEmptyField] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const inputs = document.querySelectorAll("input");
    // console.log(inputs);
    let count = 0;
    for (let i = 0; i < inputs.length; i++) {
      // console.log(inputs.item(i));
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

  //todo figure out which invoice date goes with what

  const onSubmit = (data) => {
    // check for empty fields or items before submitting
    // console.log(data);
    if (hasEmptyField || items.length === 0) {
      console.log("Has an empty field or no items");
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
      createdAt: invoice.createdAt,
      paymentTerms: selectedPaymentOption,
      description: data.projectDescription,
      items: items,
    };

    let total = 0;

    for (let i of items) {
      total += Number(i.total);
    }

    newInvoice.total = total;

    // console.log(newInvoice);
    dispatch(updateInvoice(newInvoice));
    setIsEditOpen(false);
  };

  // console.log(watch("streetAddress"));

  useLayoutEffect(() => {
    if (width > 1200 && isEditOpen) {
      setEditPageWidth(616);
      setPadding("2.5rem 2.5rem 2rem calc(2.5rem + 17px)");
    } else if (width < 1200 && isEditOpen) {
      setEditPageWidth(616);
      setPadding("2.5rem 2.5rem 2.5rem 2.5rem");
    } else if (!isEditOpen) {
      // setEditPageWidth(0);
      setPadding("0px");
    }
  }, [width, padding, isEditOpen]);

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

  const handleChange = (e) => {
    // console.log(e.target);
    if (e.target.value.length === 0 && e.target.defaultValue.length === 0) {
      e.target.style.setProperty("border", "1px solid red");
    } else {
      e.target.style.setProperty("border", "none");
    }
  };

  const [selectedPaymentOption, setSelectedPaymentOption] = useState(
    invoice.paymentTerms || "Net 1 Day"
  );

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handleChangeSelectedOption = (option) => {
    setSelectedPaymentOption(option);
  };

  const handlePaymentClick = (e) => {
    console.log("button pressed");
    e.preventDefault();

    setIsPaymentOpen(true);
    console.log("isPaymentOpen: " + isPaymentOpen);
  };

  const handlePaymentSelect = (e) => {
    setIsPaymentOpen(false);
  };

  // console.log(watch("example")); // watch input value by passing the name of it
  return (
    <DarkenScreen style={{ display: isEditOpen ? "block" : "none" }}>
      <FormContainer
        style={{
          width: isEditOpen ? `${editPageWidth}px` : "0px",
          // paddingLeft: `${padding}px`,
          // paddingRight: `${padding}px`,
          padding: padding,
          // paddingTop: "2rem",
        }}
      >
        <EditTitle>
          Edit <span style={{ color: "#7E88C3" }}>#</span>
          {invoice.id.substring(0, 6)}
        </EditTitle>
        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <BillText>Bill From</BillText>
          <FormEntry>
            <Label
              htmlFor="streetAddress"
              style={{ color: errors.streetAddress ? "red" : "" }}
            >
              Street Address
            </Label>
            <StreetAddressInput
              style={{ border: errors.streetAddress ? "1px solid red" : "" }}
              defaultValue={invoice.senderAddress.street}
              {...register("streetAddress", { required: true })}
            />
          </FormEntry>
          <AddressBox>
            <FormEntry>
              <Label htmlFor="city" style={{ color: errors.city ? "red" : "" }}>
                City
              </Label>
              <AddressDetailInput
                style={{ border: errors.city ? "1px solid red" : "" }}
                onChange={handleChange}
                type="text"
                defaultValue={invoice.senderAddress.city}
                {...register("city", { required: true })}
              />
            </FormEntry>

            <FormEntry>
              <Label
                htmlFor="postalCode"
                style={{ color: errors.postalCode ? "red" : "" }}
              >
                Post Code
              </Label>
              <AddressDetailInput
                style={{ border: errors.postalCode ? "1px solid red" : "" }}
                type="text"
                defaultValue={invoice.senderAddress.postCode}
                {...register("postalCode", { required: true })}
              />
            </FormEntry>

            <FormEntry isLongOnMobile={editPageWidth < 768}>
              <Label
                htmlFor="country"
                style={{ color: errors.country ? "red" : "" }}
              >
                Country
              </Label>
              <CountryInput
                onChange={() => handleChange}
                type="text"
                defaultValue={invoice.senderAddress.country}
                style={{ border: errors.country ? "1px solid red" : "" }}
                {...register("country", { required: true })}
              />
            </FormEntry>
          </AddressBox>

          {/*   client details */}

          <BillText>Bill To</BillText>
          <FormEntry>
            <Label
              htmlFor="clientName"
              style={{ color: errors.clientName ? "red" : "" }}
            >
              Client's Name
            </Label>
            {/* <p className>can't be empty</p> */}
            {errors.clientName?.type === "required" && (
              <ErrorTextInline>can't be empty</ErrorTextInline>
            )}
            <LongEntry
              style={{ border: errors.clientName ? "1px solid red" : "" }}
              type="text"
              defaultValue={invoice.clientName}
              {...register("clientName", { required: true })}
            />
          </FormEntry>
          <FormEntry>
            <Label
              htmlFor="clientEmail"
              style={{ color: errors.clientEmail ? "red" : "" }}
            >
              Client's Email
            </Label>
            <LongEntry
              style={{ border: errors.clientEmail ? "1px solid red" : "" }}
              defaultValue={invoice.clientEmail}
              {...register("clientEmail", { required: true })}
            />
          </FormEntry>
          <FormEntry>
            <Label
              htmlFor="clientStreetAddress"
              style={{ color: errors.clientStreetAddress ? "red" : "" }}
            >
              Street Address
            </Label>
            <StreetAddressInput
              style={{
                border: errors.clientStreetAddress ? "1px solid red" : "",
              }}
              defaultValue={invoice.clientAddress.street}
              {...register("clientStreetAddress", { required: true })}
            />
          </FormEntry>
          <AddressBox>
            <FormEntry>
              <Label
                htmlFor="clientCity"
                style={{ color: errors.clientCity ? "red" : "" }}
              >
                City
              </Label>
              <AddressDetailInput
                style={{
                  border: errors.clientCity ? "1px solid red" : "",
                }}
                type="text"
                defaultValue={invoice.clientAddress.city}
                {...register("clientCity", { required: true })}
              />
            </FormEntry>

            <FormEntry>
              <Label
                htmlFor="clientPostalCode"
                style={{ color: errors.clientPostalCode ? "red" : "" }}
              >
                Post Code
              </Label>
              <AddressDetailInput
                style={{
                  border: errors.clientPostalCode ? "1px solid red" : "",
                }}
                type="text"
                defaultValue={invoice.clientAddress.postCode}
                {...register("clientPostalCode", { required: true })}
              />
            </FormEntry>

            <FormEntry isLongOnMobile={editPageWidth < 768}>
              <Label
                htmlFor="country"
                style={{ color: errors.country ? "red" : "" }}
              >
                Country
              </Label>

              <CountryInput
                style={{
                  border: errors.clientCountry ? "1px solid red" : "",
                }}
                type="text"
                defaultValue={invoice.clientAddress.country}
                {...register("clientCountry", { required: true })}
              />
            </FormEntry>
          </AddressBox>
          <DateAndPaymentContainer>
            <FormEntry
              // style={{ width: editPageWidth < 768 ? "100%" : "240px" }}
              isLongOnMobile={editPageWidth < 768}
            >
              <Label
                htmlFor="invoiceDate"
                // style={{ color: errors.invoiceDate ? "red" : "" }}
              >
                Invoice Date
              </Label>
              <DatePicker
                customInput={<ExampleCustomInput />}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                {...register("invoiceDate", { required: true })}
                style={{
                  // width: editPageWidth < 768 ? "100%" : "240px",
                  width: "100%",
                  border: errors.invoiceDate ? "1px solid red" : "",
                }}
              />
            </FormEntry>

            <FormEntry isLongOnMobile={editPageWidth < 768}>
              <Label
                htmlFor="paymentTerms"
                style={{ color: errors.paymentTerms ? "red" : "" }}
              >
                Payment Terms
              </Label>

              <FormDropDown
                handlePaymentSelect={handlePaymentSelect}
                isPaymentOpen={isPaymentOpen}
                handlePaymentClick={handlePaymentClick}
                selectedPaymentOption={selectedPaymentOption}
                handleChangeSelectedOption={handleChangeSelectedOption}
              />
              {/* <Input
                type="select"
                defaultValue=""
                {...register("paymentTerms", { required: true })}
              /> */}
            </FormEntry>

            {/* include validation with required or other standard HTML validation rules */}
            {/* <Input type="text" {...register('exampleRequired', { required: true })} /> */}
            {/* errors will return when field validation fails  */}
            {/* {errors.exampleRequired && <span>This field is required</span>} */}
          </DateAndPaymentContainer>
          <ProjectDescription>
            <Label
              htmlFor="projectDescription"
              style={{ color: errors.projectDescription ? "red" : "" }}
            >
              Project Description
            </Label>
            <LongEntry
              type="text"
              defaultValue={invoice.description}
              {...register("projectDescription", { required: true })}
              style={{
                border: errors.projectDescription ? "1px solid red" : "",
              }}
            />
          </ProjectDescription>
          {/* <Input type="submit" style={{ marginLeft: "5px" }} /> */}

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
          />
        </form>
      </FormContainer>
    </DarkenScreen>
  );
}

EditForm.propTypes = {
  isEditOpen: PropTypes.bool.isRequired,
  setIsEditOpen: PropTypes.func.isRequired,
  // handleClose: PropTypes.func.isRequired,
};

export default EditForm;
