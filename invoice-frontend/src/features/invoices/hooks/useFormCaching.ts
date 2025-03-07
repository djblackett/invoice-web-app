import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

/* ChatGPT provided this custom hook */

const useFormCaching = () => {
  const { getValues, reset } = useFormContext();

  // Restore cached form data on mount
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

  return { cacheFormData };
};

export default useFormCaching;
