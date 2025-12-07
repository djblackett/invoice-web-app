import { ClickOutsideProvider } from "@shelf/react-outside-click";
import { useEffect, useState } from "react";
import useFormCaching from "../../hooks/useFormCaching.ts";
import { useNewInvoiceContext } from "../NewInvoiceContextProvider.tsx";
import EditForm from "./EditForm.tsx";
import { Invoice } from "../../types/invoiceTypes.ts";

interface EditFormProps {
  invoice: Invoice;
}

export default function EditFormController({ invoice }: EditFormProps) {
  const { cacheFormData } = useFormCaching("cachedEditForm");
  const {
    setIsNewInvoiceOpen,
    setIsCacheActive,
    isNewInvoiceOpen,
  } = useNewInvoiceContext();

  // Prevent the initial click that opens the modal from instantly closing it
  const [canClose, setCanClose] = useState(false);
  useEffect(() => {
    if (isNewInvoiceOpen) {
      const timer = setTimeout(() => setCanClose(true), 50);
      return () => clearTimeout(timer);
    }
    setCanClose(false);
  }, [isNewInvoiceOpen]);

  const handleClose = () => {
    if (!canClose) return;
    setIsCacheActive(true);
    cacheFormData();
    setIsNewInvoiceOpen(false);
  };

  return (
    <ClickOutsideProvider onOutsideClick={handleClose}>
      <EditForm invoice={invoice} />
    </ClickOutsideProvider>
  );
}
