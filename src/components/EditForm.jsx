/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import styled from "styled-components";
import React, { useState, useEffect, useLayoutEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";
// import { DarkenScreen } from "./DeleteModal";

import "../react-datepicker.css";
import AddressBox from "./AddressBox";
import { useWindowWidth } from "../hooks/useWindowWidth";
import EditBottomMenu from "./EditBottomMenu";

const EditTitle = styled.h1`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text};
`;

const FormContainer = styled.div`
  height: 100%;
  /* min-width: 300px; */
  max-width: 700px;
  left: 0;
  right: 616px;
  background-color: ${({ theme }) => theme.background};
  background-size: cover;
  position: absolute;
  padding-left: 5rem;
  padding-right: 2rem;
  padding-top: 1rem;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
  transition: all 250ms ease-in-out;
  overflow-x: hidden;
  filter: drop-shadow(2px 2px 2px bottom);

  align-self: flex-start;

  @media (min-width: 768px) {
    top: 72px;
    max-height: calc(100vh - 72px);
  }

  @media (min-width: 1200px) {
    left: 90px;
    padding-left: 5rem;
    top: 0px;
    max-height: initial;
  }
`;

const FormEntry = styled.div`
  display: flex;
  flex-direction: column;

  align-items: flex-start;
  margin: 5px;
  font-style: ${({ theme }) => theme.font};
`;

const BillText = styled.p`
  color: ${({ theme }) => theme.outline};
  font-weight: bold;
  font-size: 0.75rem;
  margin: 5px;
`;

const Input = styled.input`
  max-width: 504px;
  height: 48px;
  border-radius: 4px;
  border-color: ${({ theme }) => theme.formFieldOutline};
  /* outline: none; */
  padding: 17px 20px 16px 20px;
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

const inputStyles = {
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

const AddressDetailInput = styled(Input)`
  max-width: 9.5rem;
`;

const Label = styled.label`
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

function EditForm({ isEditOpen, setIsEditOpen, handleClose, padding, setPadding, invoice }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
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

  const [editPageWidth, setEditPageWidth] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const onSubmit = (data) => console.log(data);

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

  // console.log(watch("example")); // watch input value by passing the name of it
  return (
    <DarkenScreen style={{display: isEditOpen ? "block" : "none"}}>
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
          Edit <span style={{ color: "#7E88C3" }}>#</span>XM9141
        </EditTitle>
        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <BillText>Bill From</BillText>
          <FormEntry>
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              defaultValue={invoice.senderAddress.street}
              {...register("streetAddress")}
            />
          </FormEntry>
          <AddressBox>
            <FormEntry>
              <Label htmlFor="city">City</Label>
              <AddressDetailInput
                type="text"
                defaultValue={invoice.senderAddress.city}
                {...register("city")}
              />
            </FormEntry>

            <FormEntry>
              <Label htmlFor="postalCode">Post Code</Label>
              <AddressDetailInput
                type="text"
                defaultValue={invoice.senderAddress.postCode}
                {...register("postalCode")}
              />
            </FormEntry>

            <FormEntry>
              <Label htmlFor="country">Country</Label>
              <AddressDetailInput
                type="text"
                defaultValue={invoice.senderAddress.country}
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
              defaultValue={invoice.clientName}
              {...register("clientName")}
            />
          </FormEntry>
          <FormEntry>
            <Label htmlFor="clientEmail">Client's Email</Label>
            <Input
              defaultValue={invoice.clientEmail}
              {...register("clientEmail")}
            />
          </FormEntry>
          <FormEntry>
            <Label htmlFor="clientStreetAddress">Street Address</Label>
            <Input
              defaultValue={invoice.clientAddress.street}
              {...register("clientStreetAddress")}
            />
          </FormEntry>
          <AddressBox>
            <FormEntry>
              <Label htmlFor="clientCity">City</Label>
              <AddressDetailInput
                type="text"
                defaultValue={invoice.clientAddress.city}
                {...register("clientCity")}
              />
            </FormEntry>

            <FormEntry>
              <Label htmlFor="clientPostalCode">Post Code</Label>
              <AddressDetailInput
                type="text"
                defaultValue={invoice.clientAddress.postCode}
                {...register("clientPostalCode")}
              />
            </FormEntry>

            <FormEntry>
              <Label htmlFor="country">Country</Label>
              <AddressDetailInput
                type="text"
                defaultValue={invoice.clientAddress.country}
                {...register("clientCountry")}
              />
            </FormEntry>
          </AddressBox>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <FormEntry>
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <DatePicker
                customInput={<ExampleCustomInput />}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </FormEntry>

            <FormEntry>
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input
                type="select"
                defaultValue=""
                {...register("paymentTerms")}
              />
            </FormEntry>

            {/* include validation with required or other standard HTML validation rules */}
            {/* <Input type="text" {...register('exampleRequired', { required: true })} /> */}
            {/* errors will return when field validation fails  */}
            {/* {errors.exampleRequired && <span>This field is required</span>} */}
          </div>
          <FormEntry>
            <Label htmlFor="projectDescription">Project Description</Label>
            <Input
              type="text"
              defaultValue={invoice.description}
              {...register("projectDescription")}
            />
          </FormEntry>
          <Input type="submit" style={{ marginLeft: "5px" }} />
          
        </form>
        <EditBottomMenu setIsEditOpen={setIsEditOpen}/>
      </FormContainer>
    </DarkenScreen>
  );
}

EditForm.propTypes = {
  isEditOpen: PropTypes.bool.isRequired,
  setIsEditOpen: PropTypes.func.isRequired
  // handleClose: PropTypes.func.isRequired,
};

export default EditForm;
