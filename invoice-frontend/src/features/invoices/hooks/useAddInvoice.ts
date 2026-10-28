import { useMutation } from "@apollo/client";
import { ADD_INVOICE, ALL_INVOICES } from "../graphql/invoice.queries";
import { Invoice } from "../types/invoiceTypes";

export const useAddInvoice = () => {
  const [addInvoice] = useMutation(ADD_INVOICE, {
    refetchQueries: [{ query: ALL_INVOICES }],

    onError: (error) => {
      console.error(error);
    },
  });
  /** Resolves true only when the server accepted the invoice. */
  const handleAddInvoice = async (data: Invoice) => {
    try {
      const result = await addInvoice({
        variables: {
          ...data,
        },
      });
      return Boolean(result?.data);
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return {
    handleAddInvoice,
  };
};
