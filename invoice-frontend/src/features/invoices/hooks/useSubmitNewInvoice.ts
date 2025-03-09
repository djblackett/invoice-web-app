import { flushSync } from "react-dom";
import { useNewInvoiceContext } from "../forms/NewInvoiceContextProvider";
import { createInvoiceObject } from "@/features/shared/utils/utilityFunctions";
import { SubmitHandler, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { FormType } from "../types/invoiceTypes";
import { useHandleFormReset } from "./useHandleFormReset";
import { useAddInvoice } from "./useAddInvoice";

export const useSubmitNewInvoice = () => {
  const {
    setIsDraft,
    methods,
    startDate,
    selectedPaymentOption,
    setIsCacheActive,
  } = useNewInvoiceContext();
  const { trigger, setError, getValues } = methods;
  const { replace } = useFieldArray({
    name: "items",
  });

  const handleFormReset = useHandleFormReset();

  const { handleAddInvoice } = useAddInvoice();

  // Create a new invoice (all fields required)
  const onSubmit: SubmitHandler<FormType> = async (data) => {
    // flushSync required due to 3rd party library react-hook-form integration
    flushSync(() => setIsDraft(false));

    data = getValues();

    if (!data.items) {
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
        await handleAddInvoice(newInvoice);

        setIsCacheActive(false);
        handleFormReset();

        replace([{ id: uuidv4(), name: "", quantity: 0, price: 0, total: 0 }]);
      } catch (error) {
        console.error(error);
      }
    }
  };
  return onSubmit;
};
