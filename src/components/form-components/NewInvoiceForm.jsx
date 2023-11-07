/* eslint-disable react/no-unescaped-entities */

import {  BillText, Input, Label } from "../../styles/editStyles";
import LongFormEntry from "./LongFormEntry";
import { CompanyFormInfo } from "./CompanyFormInfo";
import { DateAndPayment } from "./DateAndPayment";
import EditFormItemList from "./EditFormItemList";
import NewInvoiceBottomMenu from "../menus-toolbars/NewInvoiceBottomMenu";
import { FormProvider, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { useWindowWidth } from "../../hooks/useWindowWidth";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { addInvoice } from "../../features/invoices/invoicesSlice";
import { convertDateToString } from "../../pages/EditForm";
import { generateId } from "../../utils/utilityFunctions";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import FormErrorList from "./FormErrorList";
import { ClientFormInfo } from "./ClientFormInfo";


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
  clientCountry: Yup.string()
    .required("Country is required"),
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
  isNewOpen,
  setIsNewOpen,
  isDraft,
  setIsDraft,
  setSelectedPaymentOption,
  selectedPaymentOption
}) {

  // removed this for debugging
  const formOptions = { resolver: yupResolver(validationSchema) };

  const methods = useForm(
    {
      mode: "onChange",
      formOptions,
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
    }
  );

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
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
    newInvoice.status = data.status;
    const date = new Date(startDate.getTime() + 86400000 * newInvoice.paymentTerms);

    const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
    newInvoice.paymentDue = [year, month, day].join("-");

    // console.log("end of newInvoice function", newInvoice);
    return newInvoice;
  };


  const onSubmit = (e) => {
    const watcher = watch();
    // console.log(errors);

    const data = getValues();

    if (!data.items || data.items.length === 0) {
      setError("items", { type: "custom", message: "An item must be added" });
      // trigger();
      // return;
    }

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

  useEffect(() => {
    if (!watcher.items || watcher.items.length === 0) {
      setError("items", { type: "custom", message: "An item must be added" });
    }
  }, [watcher.items]);


  // console.log("isDraft", isDraft);


  return (
  // "handleSubmit" will validate your inputs before invoking "onSubmit"
    <FormProvider {...methods}>
      <form>
        {/* register your input into the hook by invoking the "register" function , {required: !isDraft */}

        <BillText>Bill From</BillText>
        <CompanyFormInfo isDraft={isDraft} editPageWidth={editPageWidth} />

        {/*   client details */}
        <BillText>Bill To</BillText>
        <ClientFormInfo  isDraft={isDraft} editPageWidth={editPageWidth} />

        <DateAndPayment editPageWidth={editPageWidth} selected={startDate}
          onChange={(date) => setStartDate(date)}
          handlePaymentSelect={handlePaymentSelect} paymentOpen={isPaymentOpen}
          handlePaymentClick={handlePaymentClick} selectedPaymentOption={selectedPaymentOption}
          handleChangeSelectedOption={handleChangeSelectedOption}
          setIsPaymentOpen={setIsPaymentOpen}
        />


        <LongFormEntry isLongOnMobile={editPageWidth < 768}>
          <Label htmlFor="projectDescription"
            style={{ color: errors.projectDescription ? "#EC5757" : "" }}
          >
            Project Description
          </Label>
          <Input
            long
            type="text"
            {...register("projectDescription", { required: !isDraft })}
            style={{
              border: errors.projectDescription ? "1px solid #EC5757" : ""
            }}
          />
        </LongFormEntry>

        <EditFormItemList
          isDraft={isDraft}
          register={register}
          errorStyle={errorStyle}/>

        <FormErrorList isEditOpen={isNewOpen}/>
        <NewInvoiceBottomMenu setIsDraft={setIsDraft} setIsOpen={setIsNewOpen}
          saveText={"Save & Send"} closeText={"Discard"}
          justifyCancel={"flex-start"} reset={reset}
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
  setIsNewOpen: PropTypes.func.isRequired,
  isDraft: PropTypes.bool.isRequired,
  setIsDraft: PropTypes.func.isRequired,
  setSelectedPaymentOption: PropTypes.func.isRequired,
  selectedPaymentOption: PropTypes.number.isRequired,
  isNewOpen: PropTypes.bool.isRequired
};
