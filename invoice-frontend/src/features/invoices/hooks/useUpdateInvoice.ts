import { useMutation } from "@apollo/client";
import { EDIT_INVOICE, GET_INVOICE_BY_ID } from "../graphql/invoice.queries";
import { Invoice } from "../types/invoiceTypes";

export const useUpdateInvoice = () => {
  const [updateInvoice] = useMutation(EDIT_INVOICE, {
    update: (cache, { data: { editInvoice } }) => {
      cache.writeQuery({
        query: GET_INVOICE_BY_ID,
        variables: { getInvoiceById: editInvoice.id },
        data: {
          getInvoiceById: editInvoice,
        },
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const handleUpdateInvoice = async (data: Invoice) => {
    try {
      await updateInvoice({
        variables: {
          ...data,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    handleUpdateInvoice,
  };
};
