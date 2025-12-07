import { useMutation } from "@apollo/client";
import { ADD_INVOICE, ALL_INVOICES } from "../graphql/invoice.queries";
import { Invoice } from "../types/invoiceTypes";
import { toast } from "react-toastify";
import { useNewInvoiceContext } from "../forms/NewInvoiceContextProvider.tsx";

export const useAddInvoice = () => {
  const { setIsNewInvoiceOpen } = useNewInvoiceContext();
  const [addInvoice] = useMutation(ADD_INVOICE, {
    refetchQueries: [{ query: ALL_INVOICES }],

    onError: (error) => {
      toast.error(error.message || "Failed to add invoice. Please try again.");
    },
    onCompleted: () => {
      toast.success("Invoice created successfully!");
      // Ensure any modal/sidebar is closed once the mutation succeeds
      setIsNewInvoiceOpen(false);
    },
  });
  const handleAddInvoice = async (data: Invoice) => {
    try {
      await addInvoice({
        variables: {
          ...data,
        },
      });
    } catch (error) {
      // Error already handled by onError callback
      // Just log for debugging if needed
      if (import.meta.env.DEV) {
        console.error(error);
      }
    }
  };

  return {
    handleAddInvoice,
  };
};
