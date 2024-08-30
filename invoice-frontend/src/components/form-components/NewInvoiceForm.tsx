import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BillText, Input, Label } from "../../styles/editStyles";
import LongFormEntry from "./LongFormEntry";
import { CompanyFormInfo } from "./CompanyFormInfo";
import DateAndPayment from "./DateAndPayment";
import EditFormItemList from "./EditFormItemList";
import NewInvoiceBottomMenu from "../menus-toolbars/NewInvoiceBottomMenu";
import { createInvoiceObject } from "../../utils/utilityFunctions";
import FormErrorList from "./FormErrorList";
import ClientFormInfo from "./ClientFormInfo";
import { FormType } from "../../types/types";
import { useMutation } from "@apollo/client";
import { ADD_INVOICE, ALL_INVOICES } from "../../graphql/queries";
import { v4 as uuidv4 } from "uuid";

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

  // set form config, especially the default empty form
  const methods = useForm<FormType>({
    mode: "onChange",
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
    // resolver: yupResolver(validationSchema)
  });

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    getValues,
    trigger,
    watch,
    setError,
    control
  } = methods;

  const { update, replace } = useFieldArray({ control, name: "items" });

  const dispatch = useDispatch();
  const watcher = watch();

  const [addInvoice, result] = useMutation(ADD_INVOICE, {
    refetchQueries: [{ query: ALL_INVOICES }],
    onError: (error) => {
      console.log(error);
    },
  });

  // console.log(isSubmitSuccessful)

  const handleFormReset = () => {
    setSelectedPaymentOption(1);
    setIsDraft(true);
    reset();
    replace({ id: uuidv4(), name: "", quantity: 0, price: 0, total: 0 })
    setIsNewOpen(false);
    console.log("handling form reset. Shouuld also close form")
  }
  const onSubmit = async (status: "draft" | "pending") => {
    const data = getValues();
    console.table(data.items);

    // @ts-ignore
    if (!data.items || data.items.length === 0) {
      setError("items", { type: "custom", message: "An item must be added" });
    }

    // trigger validation on fields
    trigger().then(async (value) => {
      if (value) {
        // console.log("validation success");
        // todo - refactor so no undefined are necessary here

        const newInvoice = createInvoiceObject(
          data,
          startDate,
          selectedPaymentOption,
        );

        // This makes sure quantity and price are numbers. react hook form seems to make each additional item wit
        // strings instead
        newInvoice.items = newInvoice.items.map(item => {
          return {
            id: item.id,
            name: item.name,
            quantity: Number(item.quantity),
            price: Number(item.price),
            total: item.total
          }
        });

        newInvoice.status = status;

        console.log("expect pending below");
        console.log(newInvoice.status);
        console.table(newInvoice.items);

        try {
          const addedInvoice = await addInvoice({
            variables: {
              ...newInvoice
            }
          });

          handleFormReset();

          console.log("Results from graphql:")
          console.log(addedInvoice);
          // console.log("Invoice added? After the addInvoice call...")
        } catch (error) {
          console.log(JSON.stringify(error));
          console.log(error);
        }
        // redux being phased out
        // dispatch(addInvoice(newInvoice));

        // setIsNewOpen(false);
        // setSelectedPaymentOption(1);

      } else {
        // setIsDraft(true);
      }
    });
  };

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    setIsDraft(true);
  }, [isSubmitSuccessful]);

  const handlePaymentClick = () => {
    setIsPaymentOpen(!isPaymentOpen);
  };
  const handleChangeSelectedOption = (option: number) => {
    setSelectedPaymentOption(option);
  };


  useEffect(() => {
    // @ts-ignore
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
        <CompanyFormInfo isDraft={isDraft} editPageWidth={editPageWidth} />

        {/*   client details */}
        <BillText>Bill To</BillText>
        <ClientFormInfo isDraft={isDraft} editPageWidth={editPageWidth} />

        <DateAndPayment
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          paymentOpen={isPaymentOpen}
          handlePaymentClick={handlePaymentClick}
          selectedPaymentOption={selectedPaymentOption}
          handleChangeSelectedOption={handleChangeSelectedOption}
        />

        <LongFormEntry className="project-description" >
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
          invoice={undefined}
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
