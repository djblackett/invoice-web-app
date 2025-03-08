import { ClickOutsideProvider } from "@shelf/react-outside-click";
import InvoiceForm from "./InvoiceForm.tsx";
import useFormCaching from "../hooks/useFormCaching.ts";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider.tsx";

export default function InvoiceFormController() {
  const { cacheFormData } = useFormCaching("cachedNewInvoiceForm");
  const { setIsNewInvoiceOpen, setIsCacheActive } = useNewInvoiceContext();

  const handleClose = () => {
    setIsCacheActive(true);
    cacheFormData();
    setIsNewInvoiceOpen(false);
  };
  return (
    <ClickOutsideProvider onOutsideClick={handleClose}>
      <InvoiceForm />
    </ClickOutsideProvider>
  );
}
