import { createInvoiceObject } from "@/features/shared/utils/utilityFunctions";
import { FieldPath, SubmitHandler, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { useNewInvoiceContext } from "../forms/NewInvoiceContextProvider";
import { FormType } from "../types/invoiceTypes";
import {
  errorTypeCollector,
  clearErrorsByType,
  FormErrors,
} from "../utils/errorUtils";
import { useHandleFormReset } from "./useHandleFormReset";
import { v4 as uuidv4 } from "uuid";
import { useAddInvoice } from "./useAddInvoice";

export const useSubmitDraft = () => {
  const { startDate, selectedPaymentOption, methods, setIsCacheActive } =
    useNewInvoiceContext();
  const { trigger, reset, setError, clearErrors, getValues } = methods;
  const { replace } = useFieldArray({
    name: "items",
  });

  const handleFormReset = useHandleFormReset();
  const { handleAddInvoice } = useAddInvoice();

  // Create a new draft invoice (all fields not required)
  const onSubmitDraft: SubmitHandler<FormType> = async () => {
    // Re-calculate errors directly from the current form state
    await trigger();
    const currentErrors = methods.formState.errors;
    const currentErrorTypes = errorTypeCollector(
      currentErrors as unknown as FormErrors,
    );

    // Filter out only non-required errors
    const nonRequiredErrors = currentErrorTypes.filter(
      (errorType) => errorType !== "required",
    );

    if (nonRequiredErrors.length > 0) {
      // There are errors other than "required", so prevent submission.
      toast.error("Please fix the errors before saving as draft", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        toastId: "save-draft-error-toast",
      });

      clearErrorsByType(currentErrors, "required");

      reset(undefined, { keepValues: true });

      // reapply the leftover errors to the form
      for (const key in currentErrors) {
        const errorKey = key as keyof FormType;
        if (currentErrors[errorKey]?.type) {
          setError(errorKey, {
            type: currentErrors[errorKey].type,
            message: currentErrors[errorKey].message,
          });
        }
      }

      if (currentErrors.items) {
        const itemsArray = Array.isArray(currentErrors.items)
          ? currentErrors.items
          : Object.values(currentErrors.items);

        itemsArray.forEach((itemError, index) => {
          if (itemError && typeof itemError === "object") {
            Object.keys(itemError).forEach((fieldName) => {
              const errorDetail = (
                itemError as Record<string, { type: string; message?: string }>
              )[fieldName];

              if (errorDetail?.type) {
                setError(
                  `items[${index}].${fieldName}` as FieldPath<FormType>,
                  {
                    type: errorDetail.type,
                    message: errorDetail.message,
                  },
                );
              }
            });
          }
        });
      }
      return;
    }

    // draft submission is allowed
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

    newInvoice.status = "draft";

    try {
      await handleAddInvoice(newInvoice);

      setIsCacheActive(false);
      handleFormReset();
      replace([{ id: uuidv4(), name: "", quantity: 0, price: 0, total: 0 }]);
    } catch (error) {
      console.error(error);
    }
  };

  return onSubmitDraft;
};
