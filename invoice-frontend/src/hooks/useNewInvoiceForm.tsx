import { useFieldArray, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import {
  ADD_INVOICE,
  ALL_INVOICES,
  EDIT_INVOICE,
  GET_INVOICE_BY_ID,
} from "../graphql/queries";
import { v4 as uuidv4 } from "uuid";
import { createInvoiceObject } from "../utils/utilityFunctions";
import { FormType } from "../types/types";
import { useNewInvoiceContext } from "../components/form-components/NewInvoiceContextProvider";
import { flushSync } from "react-dom";
import { useParams } from "react-router-dom";

export const useNewInvoiceForm = () => {
  const { id } = useParams();

  const {
    startDate,
    setIsDraft,
    setIsNewInvoiceOpen,
    selectedPaymentOption,
    setSelectedPaymentOption,
    methods,
  } = useNewInvoiceContext();

  const { control, trigger, reset, watch, setError, clearErrors, getValues } =
    methods;

  const { replace } = useFieldArray({
    control,
    name: "items",
  });

  const watcher = watch();

  // Mutation definitions
  const [addInvoice] = useMutation(ADD_INVOICE, {
    refetchQueries: [{ query: ALL_INVOICES }],

    onError: (error) => {
      console.error(error);
    },
  });

  const [updateInvoice] = useMutation(EDIT_INVOICE, {
    update: (cache, { data: { editInvoice } }) => {
      cache.writeQuery({
        query: GET_INVOICE_BY_ID,
        variables: { getInvoiceById: editInvoice.id },
        data: {
          getInvoiceById: editInvoice,
        },
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleFormReset = () => {
    setSelectedPaymentOption(1);
    reset();
    clearErrors();

    setIsNewInvoiceOpen(false);
  };

  // Create a new invoice (all fields required)
  const onSubmit: SubmitHandler<FormType> = async (data) => {
    console.log("Submitting form");
    flushSync(() => setIsDraft(false));

    data = getValues();

    if (!data.items) {
      console.log("No items");
      setError("items", { type: "custom", message: "An item must be added" });
      return;
    }

    const isValid = await trigger();
    if (isValid) {
      const newInvoice = createInvoiceObject(
        data,
        startDate,
        selectedPaymentOption,
      );

      // Ensure quantity and price are numbers
      newInvoice.items = newInvoice.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
      }));

      newInvoice.status = "pending";

      try {
        await addInvoice({
          variables: {
            ...newInvoice,
          },
        });
        handleFormReset();
        replace([{ id: uuidv4(), name: "", quantity: 0, price: 0, total: 0 }]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Create a new draft invoice (all fields not required)
  const onSubmitDraft: SubmitHandler<FormType> = async () => {
    console.log("Submitting draft");
    clearErrors();
    const data = getValues();

    if (!data.items) {
      data.items = [{ id: "", name: "", quantity: 0, price: 0, total: 0 }];
    }

    const newInvoice = createInvoiceObject(
      data,
      startDate,
      selectedPaymentOption,
    );

    // todo - Determine if this is still relevant after refactoring
    // Ensure quantity and price are numbers
    // newInvoice.items = newInvoice.items.map((item) => ({
    //   ...item,
    //   quantity: Number(item.quantity) || 0,
    //   price: Number(item.price) || 0,
    // }));

    newInvoice.status = "draft";

    try {
      await addInvoice({
        variables: {
          ...newInvoice,
        },
      });
      handleFormReset();
      replace([{ id: uuidv4(), name: "", quantity: 0, price: 0, total: 0 }]);
    } catch (error) {
      console.error(error);
    }
    // }
  };

  // Update an existing invoice (all fields required)
  const onSubmitUpdate: SubmitHandler<FormType> = async (data) => {
    console.log("Submitting update");
    const isValid = await trigger();
    if (isValid) {
      const newInvoice = createInvoiceObject(
        data,
        startDate,
        selectedPaymentOption,
      );
      newInvoice.id = String(id);
      newInvoice.status = "pending";
      console.log(id);

      try {
        await updateInvoice({
          variables: {
            ...newInvoice,
          },
        });
        setIsNewInvoiceOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (!watcher.items) {
      setError("items", { type: "custom", message: "An item must be added" });
    } else {
      // Clear error if items are present
      clearErrors("items");
    }
  }, [watcher.items, setError]);

  return {
    methods,
    onSubmit,
    onSubmitDraft,
    onSubmitUpdate,
  };
};
