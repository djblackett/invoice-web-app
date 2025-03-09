import { createInvoiceObject } from "@/features/shared/utils/utilityFunctions";
import { SubmitHandler } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useNewInvoiceContext } from "../forms/NewInvoiceContextProvider";
import { FormType } from "../types/invoiceTypes";
import useFormCaching from "./useFormCaching";
import { useUpdateInvoice } from "./useUpdateInvoice";

export const useSubmitEditedInvoice = () => {
  const { id } = useParams();

  const {
    startDate,
    setIsNewInvoiceOpen,
    selectedPaymentOption,
    methods,
    setIsCacheActive,
  } = useNewInvoiceContext();

  const editInvoiceCache = useFormCaching("cachedEditForm");
  const { trigger } = methods;

  const { handleUpdateInvoice } = useUpdateInvoice();

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
        await handleUpdateInvoice(newInvoice);
        editInvoiceCache.clearCache();
        setIsCacheActive(false);
        setIsNewInvoiceOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return {
    onSubmitUpdate,
  };
};
