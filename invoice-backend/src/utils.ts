import { invoiceListZod, invoiceZod } from "./constants/types";

export const validateInvoiceData = (inputs: unknown) => {
  const validationResult = invoiceZod.safeParse(inputs);

  if (validationResult.success) {
    return validationResult.data;
  } else {
    throw new Error(
      `Validation failed: ${JSON.stringify(validationResult.error.issues)}`,
    );
  }
};

export const validateInvoiceList = (inputs: unknown) => {
  const validationResult = invoiceListZod.safeParse(inputs);

  if (validationResult.success) {
    return validationResult.data;
  } else {
    throw new Error(
      `Validation failed: ${JSON.stringify(validationResult.error.issues)}`,
    );
  }
};
