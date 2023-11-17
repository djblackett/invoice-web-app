import { FormProvider, useForm} from "react-hook-form";
import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { BillText, Input, Label } from "../../styles/editStyles";
import LongFormEntry from "./LongFormEntry";
import { CompanyFormInfo } from "./CompanyFormInfo";
import DateAndPayment from "./DateAndPayment";
import EditFormItemList from "./EditFormItemList";
import NewInvoiceBottomMenu from "../menus-toolbars/NewInvoiceBottomMenu";
import { addInvoice } from "../../features/invoices/invoicesSlice";
import { convertDateToString } from "../../pages/EditForm";
import { generateId } from "../../utils/utilityFunctions";
import FormErrorList from "./FormErrorList";
import ClientFormInfo from "./ClientFormInfo";
import { validationSchema } from "../../types/schemas";
import { Invoice } from "../../types/types";

type NewInvoiceFormProps = {
  editPageWidth: number;
  isDraft: boolean;
  isNewOpen: boolean;
  selectedPaymentOption: number;
  setIsDraft: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPaymentOption: React.Dispatch<React.SetStateAction<number>>;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  startDate: Date;
};

export default function NewInvoiceForm({
  editPageWidth,
  startDate,
  setStartDate,
  isNewOpen,
  setIsNewOpen,
  isDraft,
  setIsDraft,
  setSelectedPaymentOption,
  selectedPaymentOption,
}: NewInvoiceFormProps) {

  type FormType = {
    city: string;
    clientCity: string;
    clientCountry: string;
    clientEmail: string;
    clientName: string;
    clientPostalCode: string;
    clientStreetAddress: string;
    country: string;
    items: [
      {
        id: string;
        name: string;
        price: number;
        quantity: number;
        total: number;
      },
    ];
    postalCode: string;
    projectDescription: string;
    status: string;
    streetAddress: string;
  };

  const methods = useForm<FormType>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
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
      items: [{ id: "", name: "", quantity: 0, price: 0, total: 0 }],
    },
  });

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    getValues,
    trigger,
    watch,
    setError,
  } = methods;

  const dispatch = useDispatch();

  const watcher = watch();

  const createInvoiceObject = (data: FormType) => {
    const newInvoice: Invoice = {
      id: "",
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
      paymentDue: "",
      paymentTerms: 0,
      status: "",
      total: 0,
    };

    let invoiceTotal = 0;

    const { items } = newInvoice;

    for (let i = 0; i < items.length; i++) {
      items[i].total = items[i].quantity * items[i].price;
      invoiceTotal += Number(items[i].total);
      if (!items[i].id) {
        items[i].id = uuidv4();
      }
    }

    newInvoice.total = invoiceTotal;
    newInvoice.id = newInvoice.id ? newInvoice.id : generateId();
    newInvoice.paymentTerms = selectedPaymentOption;
    newInvoice.status = data.status;
    const date = new Date(
      startDate.getTime() + 86400000 * newInvoice.paymentTerms,
    );

    const [month, day, year] = [
      date.getMonth(),
      date.getDate(),
      date.getFullYear(),
    ];
    newInvoice.paymentDue = [year, month, day].join("-");

    // console.log("end of newInvoice function", newInvoice);
    return newInvoice;
  };

  const onSubmit = () => {
    const data = getValues();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (!data.items || data.items.length === 0) {
      setError("items", { type: "custom", message: "An item must be added" });
    }

    // trigger validation on fields
    trigger().then((value) => {
      if (value) {
        // console.log("validation success");
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

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  const handlePaymentClick = () => {
    setIsPaymentOpen(!isPaymentOpen);
  };
  const handleChangeSelectedOption = (option: number) => {
    setSelectedPaymentOption(option);
  };

  // const handlePaymentSelect = (e: SyntheticEvent) => {
  //   e.preventDefault();
  //   setIsPaymentOpen(false);
  // };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (!watcher.items || watcher.items.length === 0) {
      setError("items", { type: "custom", message: "An item must be added" });
    }
  }, [watcher.items]);

  return (
    // "handleSubmit" will validate your inputs before invoking "onSubmit"
    <FormProvider {...methods}>
      <form>
        {/* register your input into the hook by invoking the "register" function , {required: !isDraft */}

        <BillText>Bill From</BillText>
        <CompanyFormInfo isDraft={isDraft} editPageWidth={editPageWidth} invoice={null} />

        {/*   client details */}
        <BillText>Bill To</BillText>
        <ClientFormInfo isDraft={isDraft} editPageWidth={editPageWidth} />

        <DateAndPayment
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          // handlePaymentSelect={handlePaymentSelect}
          paymentOpen={isPaymentOpen}
          handlePaymentClick={handlePaymentClick}
          selectedPaymentOption={selectedPaymentOption}
          handleChangeSelectedOption={handleChangeSelectedOption}
          // setIsPaymentOpen={setIsPaymentOpen}
        />

        {/* todo - find way to avoid passing undefined here */}
        <LongFormEntry className="project-description" style={undefined}>
          <Label
            htmlFor="projectDescription"
            style={{ color: errors.projectDescription ? "#EC5757" : "" }}
          >
            Project Description
          </Label>
          <Input
            $long
            type="text"
            {...register("projectDescription", { required: !isDraft })}
            style={{
              border: errors.projectDescription ? "1px solid #EC5757" : "",
            }}
          />
        </LongFormEntry>

        <EditFormItemList
          isDraft={isDraft}
          // register={register}
          // todo - these unused props are messy. Must retweak type definitions to be more flexible
        />

        <FormErrorList isEditOpen={isNewOpen} />
        <NewInvoiceBottomMenu
          setIsDraft={setIsDraft}
          setIsOpen={setIsNewOpen}
          saveText="Save & Send"
          closeText="Discard"
          justifyCancel="flex-start"
          onSubmit={onSubmit}
        />
      </form>
    </FormProvider>
  );
}

NewInvoiceForm.propTypes = {
  editPageWidth: PropTypes.number.isRequired,
  // startDate: PropTypes.object.isRequired,
  setStartDate: PropTypes.func.isRequired,
  setIsNewOpen: PropTypes.func.isRequired,
  isDraft: PropTypes.bool.isRequired,
  setIsDraft: PropTypes.func.isRequired,
  setSelectedPaymentOption: PropTypes.func.isRequired,
  selectedPaymentOption: PropTypes.number.isRequired,
  isNewOpen: PropTypes.bool.isRequired,
};
