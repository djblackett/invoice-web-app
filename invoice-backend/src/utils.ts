import { invoiceZod } from "./constants/types";

export const validateInvoiceData = (inputs: unknown) => {
  return invoiceZod.parse(inputs);
};
