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
  const handleAddInvoice = async (data: Invoice) => {
    try {
      await addInvoice({
        variables: {
          ...data,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    handleAddInvoice,
  };
};
