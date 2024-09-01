import { invoiceListZod, invoiceZod } from "./constants/types";

export const validateInvoiceData = (inputs: unknown) => {
  console.log(Array.isArray(inputs) ? 'Data is an array' : 'Data is not an array');
  console.log("Inputs:", inputs);
  const validationResult = invoiceZod.safeParse(inputs);
  console.log(validationResult.success);
  if (validationResult.success) {
    return validationResult.data;
  } else {
     throw new Error(`Validation failed: ${JSON.stringify(validationResult.error.issues)}`);
  }
};

export const validateInvoiceList = (inputs: unknown) => {
  console.log(Array.isArray(inputs) ? 'Data is an array' : 'Data is not an array');
  console.log(JSON.stringify(inputs, null, 2));
  const validationResult = invoiceListZod.safeParse(inputs);

   if (validationResult.success) {
     return validationResult.data;
   } else {
     throw new Error(`Validation failed: ${JSON.stringify(validationResult.error.issues)}`);
  }
};
