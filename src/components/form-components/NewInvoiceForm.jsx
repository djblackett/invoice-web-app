/* eslint-disable react/no-unescaped-entities */

import { AddressDetailInput, BillText, CountryInput, ErrorList, ErrorText, Input, Label } from "../../styles/editStyles";
import LongFormEntry from "./LongFormEntry";
import AddressBox from "./AddressBox";
import { CityPostContainer, CompanyFormInfo } from "./CompanyFormInfo";
import FormEntry from "./FormEntry";
import { DateAndPayment } from "./DateAndPayment";
import EditFormItemList from "./EditFormItemList";
import NewInvoiceBottomMenu from "../menus-toolbars/NewInvoiceBottomMenu";
import { FormProvider, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { useWindowWidth } from "../../hooks/useWindowWidth";
import { useEffect, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { addInvoice } from "../../features/invoices/invoicesSlice";
import { convertDateToString } from "../../pages/EditForm";
import { generateId } from "../../utils/utilityFunctions";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import FormErrorList from "./FormErrorList";


export const validationSchema = Yup.object().shape({
  clientName: Yup.string()
    .required("Name is required"),
  clientEmail: Yup.string()
    .email("Email is Invalid")
    .required("Email is required"),
  clientStreetAddress: Yup.string()
    .required("Street address is required"),
  clientCity: Yup.string()
    .required("City is required"),
  clientPostalCode: Yup.string()
    .required("Postal code is required"),
  projectDescription: Yup.string()
    .required("Project description is required"),
  items: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .required("Name is required"),
      quantity: Yup.number().positive().integer()
        .required("Quantity is required"),
      price: Yup.number().positive().max(10000)
        .required("Price is required")
    })
  )
});


export default function NewInvoiceForm({
  editPageWidth,
  startDate,
  setStartDate,
  items,
  setItems,
  setIsNewOpen,
  setSubmitDirty,
  isDraft,
  setIsDraft,
  setSelectedPaymentOption,
  selectedPaymentOption
}) {

  // removed this for debugging
  const formOptions = { resolver: yupResolver(validationSchema) };

  const methods = useForm(
    {
      // formOptions,
      defaultValues: {
        status: "draft",
        city: "",
        country: "",
        postalCode: "",
        streetAddress: "",
        clientName: "",
        clientEmail: "",
        clientStreetAddress: "",
        clientCity: "",
        clientCountry: "",
        clientPostalCode: "",
        projectDescription: "",
        items: [{ id: "", name: "", quantity: "", price: "", total: "" }]
      },
      mode: "onChange"
    }
  );

  const {
    register,
    formState: { errors, isSubmitSuccessful, submitCount, isValid },
    reset,
    control,
    getValues,
    trigger,
    watch,
    setError

  } = methods;

  const width = useWindowWidth();
  const dispatch = useDispatch();

  const watcher = watch();


  const createInvoiceObject = (data) => {
    const newInvoice = {
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
    newInvoice.id = newInvoice.id ? newInvoice.id : generateId();
    newInvoice.paymentTerms = selectedPaymentOption;
    // newInvoice.status = isDraft ?  "draft" : "pending";
    newInvoice.status = data.status;
    const date = new Date(startDate.getTime() + 86400000 * newInvoice.paymentTerms);

    const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
    newInvoice.paymentDue = [year, month, day].join("-");

    console.log("end of newVoice function", newInvoice);
    return newInvoice;
  };


  const onSubmit = (e) => {
    const watcher = watch();
    console.log(errors);

    const data = getValues();

    //trigger validation on fields
    trigger()
      .then(value => {
        if (value){
          console.log("validation success");
          const newInvoice = createInvoiceObject(data);
          dispatch(addInvoice(newInvoice));
          setIsNewOpen(false);
          setSelectedPaymentOption(1);
          setIsDraft(true);
        } else {
          setIsDraft(true);
        }
      });

  };


  const errorStyle = (name) => {
    return { border: errors[name] ? "1px solid #EC5757" : "" };
  };

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  const handlePaymentClick = (e) => {
    setIsPaymentOpen(!isPaymentOpen);
  };
  const handleChangeSelectedOption = (option) => {
    setSelectedPaymentOption(option);
  };

  const handlePaymentSelect = (e) => {
    e.preventDefault();
    setIsPaymentOpen(false);
  };


  const clientCountryChildren = (
    <>
      <Label
        htmlFor="country"
      >
                Country
      </Label>
      <CountryInput
        style={errorStyle("country")}
        type="text"

        {...register("clientCountry", { required: !isDraft })}
      />
    </>
  );




  return (
  // "handleSubmit" will validate your inputs before invoking "onSubmit"
    <FormProvider {...methods}>
      <form>
        {/* register your input into the hook by invoking the "register" function , {required: !isDraft */}

        <BillText>Bill From</BillText>
        <CompanyFormInfo isDraft={isDraft}/>

        {/*   client details */}
        <BillText>Bill To</BillText>
        <LongFormEntry>
          <Label htmlFor="clientName">Client's Name</Label>
          <Input
            type="text"
            long
            style={errorStyle("clientName")}
            {...register("clientName", { required: !isDraft })}
          />
        </LongFormEntry>
        <LongFormEntry>
          <Label htmlFor="clientEmail">Client's Email</Label>
          <Input
            long
            style={errorStyle("clientEmail")}
            {...register("clientEmail", { required: !isDraft })}
          />
        </LongFormEntry>
        <LongFormEntry>
          <Label htmlFor="clientStreetAddress">Street Address</Label>
          <Input
            long
            style={errorStyle("clientStreetAddress")}
            {...register("clientStreetAddress", { required: !isDraft })}
          />
        </LongFormEntry>
        <AddressBox>
          <CityPostContainer>
            <FormEntry>
              <Label htmlFor="clientCity">City</Label>
              <AddressDetailInput
                style={errorStyle("clientCity")}
                type="text"
                {...register("clientCity", { required: !isDraft })}
              />
            </FormEntry>

            <FormEntry>
              <Label htmlFor="clientPostalCode">Post Code</Label>
              <AddressDetailInput
                type="text"
                style={errorStyle("clientPostalCode")}
                {...register("clientPostalCode", { required: !isDraft })}
              />
            </FormEntry>
          </CityPostContainer>


          {width < 768 && <LongFormEntry isLongOnMobile={editPageWidth < 768}>
            {clientCountryChildren}
          </LongFormEntry>}

          {width >= 768 && <FormEntry>
            {clientCountryChildren}
          </FormEntry>}

        </AddressBox>


        <DateAndPayment editPageWidth={editPageWidth} selected={startDate}
          onChange={(date) => setStartDate(date)}
          handlePaymentSelect={handlePaymentSelect} paymentOpen={isPaymentOpen}
          handlePaymentClick={handlePaymentClick} selectedPaymentOption={selectedPaymentOption}
          handleChangeSelectedOption={handleChangeSelectedOption}
          setIsPaymentOpen={setIsPaymentOpen}
        />


        <LongFormEntry isLongOnMobile={editPageWidth < 768}>
          <Label htmlFor="projectDescription">Project Description</Label>
          <Input
            style={errorStyle("projectDescription")}
            type="text"
            long
            {...register("projectDescription", { required: !isDraft })}
          />
        </LongFormEntry>

        <EditFormItemList
          isDraft={isDraft}
          register={register}
        />

        <FormErrorList />
        <NewInvoiceBottomMenu setSubmitDirty={setSubmitDirty} setIsDraft={setIsDraft} setIsOpen={setIsNewOpen}
          saveText={"Save & Send"} closeText={"Discard"}
          justifyCancel={"flex-start"} reset={reset}
          setItems={setItems}
          onSubmit={onSubmit}
          isDraft={isDraft}
        />
      </form>
    </ FormProvider>
  );
}

NewInvoiceForm.propTypes = {
  editPageWidth: PropTypes.number,
  startDate: PropTypes.object.isRequired,
  setStartDate: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  setItems: PropTypes.func.isRequired,
  setIsNewOpen: PropTypes.func.isRequired,
  isSubmitDirty: PropTypes.bool.isRequired,
  setSubmitDirty: PropTypes.func.isRequired,
  isDraft: PropTypes.bool.isRequired,
  setIsDraft: PropTypes.func.isRequired,
  setSelectedPaymentOption: PropTypes.func.isRequired,
  selectedPaymentOption: PropTypes.number.isRequired,
};