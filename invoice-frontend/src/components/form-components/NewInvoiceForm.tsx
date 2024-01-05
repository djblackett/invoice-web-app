import { FormProvider, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BillText, Input, Label } from "../../styles/editStyles";
import LongFormEntry from "./LongFormEntry";
import { CompanyFormInfo } from "./CompanyFormInfo";
import DateAndPayment from "./DateAndPayment";
import EditFormItemList from "./EditFormItemList";
import NewInvoiceBottomMenu from "../menus-toolbars/NewInvoiceBottomMenu";
import { addInvoice } from "../../features/invoices/invoicesSlice";
import { createInvoiceObject } from "../../utils/utilityFunctions";
import FormErrorList from "./FormErrorList";
import ClientFormInfo from "./ClientFormInfo";
import { FormType } from "../../types/types";
import styles from "../../styles/generalFormStyles.module.css";

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
        // todo - refactor so no undefined are necessary here
        const newInvoice = createInvoiceObject(
          data,
          startDate,
          selectedPaymentOption,
          undefined,
          undefined,
        );
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

        <p className={styles.billText}>Bill From</p>
        <CompanyFormInfo isDraft={isDraft} editPageWidth={editPageWidth} />

        {/*   client details */}
        <p className={styles.billText}>Bill To</p>
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

        <LongFormEntry className="project-description">
          <label className={styles.label}
            htmlFor="projectDescription"
            style={{ color: errors.projectDescription ? "#EC5757" : "" }}
          >
            Project Description
          </label>
          <input className={styles.input}
            // $long
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
