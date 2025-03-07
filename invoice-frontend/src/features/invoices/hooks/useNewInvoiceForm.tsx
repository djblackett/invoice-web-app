import {
  useFieldArray,
  SubmitHandler,
  FieldErrors,
  FieldValues,
} from "react-hook-form";
import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import {
  ADD_INVOICE,
  ALL_INVOICES,
  EDIT_INVOICE,
  GET_INVOICE_BY_ID,
} from "../graphql/invoice.queries.ts";
import { v4 as uuidv4 } from "uuid";
import { createInvoiceObject } from "../../shared/utils/utilityFunctions.ts";
import { useNewInvoiceContext } from "../forms/NewInvoiceContextProvider.tsx";
import { flushSync } from "react-dom";
import { useParams } from "react-router-dom";
import { FormType } from "@/features/invoices/types/invoiceTypes.ts";

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
    // flushSync required due to react-hook-form integration
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
    // Need to filter errors to avoid triggering the required=true errors but still show other errors

    // const otherErrors = errorTypes.filter((error) => error !== "required");
    // if (otherErrors.length > 0) {
    // }

    // Trigger validation to update errors
    // await trigger();

    // Re-calculate errors directly from the current form state
    const currentErrors = methods.formState.errors;
    const currentErrorTypes = errorTypeCollector(currentErrors);

    console.log("currentErrors", currentErrors);
    console.log(currentErrorTypes);
    // Filter out only non-required errors
    const nonRequiredErrors = currentErrorTypes.filter(
      (errorType) => errorType !== "required",
    );

    if (nonRequiredErrors.length > 0) {
      // There are errors other than "required", so prevent submission.
      console.error(
        "Draft submission blocked due to errors:",
        nonRequiredErrors,
      );
      clearErrorsByType(currentErrors, "required");
      reset(undefined, { keepValues: true });

      // reapply the leftover errors to the form

      for (const key in currentErrors) {
        if (currentErrors[key]?.type) {
          setError(key, {
            type: currentErrors[key].type,
            message: currentErrors[key].message,
          });
        }
      }

      // if (currentErrors.items) {
      //   currentErrors.items.forEach((itemError, index) => {
      //     if (itemError?.type) {
      //       setError(`items[${index}]`, {
      //         type: itemError.type,
      //         message: itemError.message,
      //       });
      //     }
      //   });
      // }

      if (currentErrors.items) {
        currentErrors.items.forEach((itemError, index) => {
          // Iterate over all keys in the item error object (e.g., "price", "quantity", etc.)
          for (const key in itemError) {
            if (itemError[key]?.type) {
              setError(`items[${index}].${key}`, {
                type: itemError[key].type,
                message: itemError[key].message,
              });
            }
          }
        });
      }

      // errors.forEach((errorType) => {
      //   setError(errorType, { type: errorType });
      // });

      // console.log("currentErrors", currentErrors);
      return;
    }

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
  };

  // Update an existing invoice (all fields required)
  const onSubmitUpdate: SubmitHandler<FormType> = async (data) => {
    const isValid = await trigger();
    if (isValid) {
      const newInvoice = createInvoiceObject(
        data,
        startDate,
        selectedPaymentOption,
      );
      newInvoice.id = String(id);
      newInvoice.status = "pending";

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

// function errorTypeCollector(errors: FieldErrors<FieldValues>) {
//   const errorTypes: string[] = [];
//   if (!errors?.items) {
//     return [];
//   }

//   errors.items.forEach((itemError: any) => {
//     Object.keys(itemError).forEach((key) => {
//       if (itemError[key]?.type) {
//         errorTypes.push(itemError[key].type);
//         console.log(itemError[key].type);
//       }
//     });
//   });
//   // console.log(errorTypes);
//   return errorTypes;
// }

const errorTypeCollector = (errors: FieldErrors<FieldValues>) => {
  const errorTypes: string[] = [];
  if (!errors) {
    return [];
  }

  // *******************

  //  must iterate through items array and and those errors too!!!
  // *********************

  for (const key in errors) {
    if (errors[key]?.type) {
      errorTypes.push(errors[key].type);
    }
  }

  if (errors.items) {
    errors.items.forEach((itemError) => {
      Object.keys(itemError).forEach((key) => {
        if (itemError[key]?.type) {
          errorTypes.push(itemError[key].type);
        }
      });
    });
  }

  console.log(errorTypes);
  return errorTypes;
};

function clearErrorsByType(errors: FieldErrors<FieldValues>, type: string) {
  if (!errors) {
    return;
  }

  for (const key in errors) {
    if (errors[key]?.type === type) {
      delete errors[key];
    }
  }

  if (errors.items) {
    errors.items.forEach((itemError) => {
      Object.keys(itemError).forEach((key) => {
        if (itemError[key]?.type === type) {
          delete itemError[key];
        }
      });
    });
  }
}
