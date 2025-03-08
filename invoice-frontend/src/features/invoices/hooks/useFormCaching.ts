import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

/* ChatGPT provided this custom hook */

const useFormCaching = (cacheKey: string) => {
  const { watch, getValues, reset } = useFormContext();
  const formValues = watch();
  const [isCacheEnabled, setIsCacheEnabled] = useState(true);

  // Auto-save effect: Only runs when caching is enabled.
  useEffect(() => {
    if (isCacheEnabled) {
      localStorage.setItem(cacheKey, JSON.stringify(formValues));
    }
  }, [formValues, isCacheEnabled, cacheKey]);

  // Function to manually cache form data (if needed)
  const cacheFormData = () => {
    const currentValues = getValues();
    localStorage.setItem(cacheKey, JSON.stringify(currentValues));
  };

  // Clear cache and disable auto-caching temporarily
  const clearCache = () => {
    localStorage.removeItem(cacheKey);
    setIsCacheEnabled(false);
    setTimeout(() => setIsCacheEnabled(true), 1000);
  };

  // Restore cache on mount
  useEffect(() => {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      reset(JSON.parse(cachedData));
    }
  }, [reset, cacheKey]);

  return { cacheFormData, clearCache };
};

export default useFormCaching;
