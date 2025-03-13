import { ClickOutsideProvider } from "@shelf/react-outside-click";
import useFormCaching from "../../hooks/useFormCaching.ts";
import { useNewInvoiceContext } from "../NewInvoiceContextProvider.tsx";
import EditForm from "./EditForm.tsx";
import { Invoice } from "../../types/invoiceTypes.ts";

interface EditFormProps {
  invoice: Invoice;
}

export default function EditFormController({ invoice }: EditFormProps) {
  const { cacheFormData } = useFormCaching("cachedEditForm");
  const { setIsNewInvoiceOpen, setIsCacheActive } = useNewInvoiceContext();

  const handleClose = () => {
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
