import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useNewInvoiceContext } from "../forms/NewInvoiceContextProvider";

/* ChatGPT provided this custom hook */

const useFormCaching = () => {
  const { getValues } = useFormContext();
  const { methods } = useNewInvoiceContext();
  const { reset } = methods;

  //   Restore cached form data on mount
  useEffect(() => {
    const cachedData = localStorage.getItem("cachedForm");
    if (cachedData) {
      reset(JSON.parse(cachedData));
    }
  }, [reset]);

  // Example function to cache form values
  const cacheFormData = () => {
    const currentValues = getValues();
    localStorage.setItem("cachedForm", JSON.stringify(currentValues));
  };

  const clearCache = () => {
    localStorage.removeItem("cachedForm");
  };

  return { cacheFormData, clearCache };
};

export default useFormCaching;
