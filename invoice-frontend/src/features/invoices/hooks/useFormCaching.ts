import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useNewInvoiceContext } from "../forms/NewInvoiceContextProvider";

/* ChatGPT provided this custom hook, but I had to fix several parts of it */

const useFormCaching = (cacheKey: string) => {
  const { getValues, reset } = useFormContext();
  const { isCacheActive, setIsCacheActive } = useNewInvoiceContext();

  const cacheFormData = () => {
    const currentValues = getValues();
    localStorage.setItem(cacheKey, JSON.stringify(currentValues));
  };

  const clearCache = () => {
    localStorage.removeItem(cacheKey);
    setIsCacheActive(false);
  };

  // Restore cache on mount if cache is active
  useEffect(() => {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData && isCacheActive) {
      reset(JSON.parse(cachedData));
    }
  }, [reset, cacheKey]);

  return { cacheFormData, clearCache };
};

export default useFormCaching;
