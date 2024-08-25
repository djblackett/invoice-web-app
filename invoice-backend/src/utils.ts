import { invoiceListZod, invoiceZod } from "./constants/types";

export const validateInvoiceData = (inputs: unknown) => {
  return invoiceZod.parse(inputs);
};

export const validateInvoiceList = (inputs: unknown) => {
  return invoiceListZod.parse(inputs);
};
