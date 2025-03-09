import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const useItemValidation = () => {
  const { setError, clearErrors, watch } = useFormContext();
  const watcher = watch();

  useEffect(() => {
    if (!watcher.items) {
      setError("items", { type: "custom", message: "An item must be added" });
    } else {
      // Clear error if items are present
      clearErrors("items");
    }
  }, [watcher.items, setError]);
};

export default useItemValidation;
