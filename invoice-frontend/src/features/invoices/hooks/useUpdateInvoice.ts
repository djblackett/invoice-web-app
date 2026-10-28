import { useMutation } from "@apollo/client";
import { EDIT_INVOICE, GET_INVOICE_BY_ID } from "../graphql/invoice.queries";
import { Invoice } from "../types/invoiceTypes";

export const useUpdateInvoice = () => {
  const [updateInvoice] = useMutation<{ editInvoice: Invoice }>(EDIT_INVOICE, {
    update: (cache, { data }) => {
      const { editInvoice } = data as { editInvoice: Invoice };
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
  /** Resolves true only when the server accepted the edit. */
  const handleUpdateInvoice = async (data: Invoice) => {
    try {
      const result = await updateInvoice({
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
    handleUpdateInvoice,
  };
};
