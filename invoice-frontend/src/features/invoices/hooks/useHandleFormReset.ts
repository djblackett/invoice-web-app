import blankDefaultValues from "../forms/defaultValues";
import { useNewInvoiceContext } from "../forms/NewInvoiceContextProvider";
import useFormCaching from "./useFormCaching";

export const useHandleFormReset = () => {
  const { setSelectedPaymentOption, setIsNewInvoiceOpen, methods } =
    useNewInvoiceContext();

  const newInvoiceCache = useFormCaching("cachedNewInvoiceForm");
  const { reset, clearErrors } = methods;

  return () => {
    newInvoiceCache.clearCache();
    setSelectedPaymentOption(1);
    reset(blankDefaultValues);
    clearErrors();
    setIsNewInvoiceOpen(false);
  };
};
