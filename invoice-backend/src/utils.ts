import {
  CreateUserArgsUnhashedPassword,
  invoiceListZod,
  invoiceZod,
  ReturnedUser,
  userCreateZod,
  userZod,
} from "./constants/types";

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

export const validateUserCreate = (inputs: unknown) => {
  const validationResult = userCreateZod.safeParse(inputs);

  if (validationResult.success) {
    return validationResult.data as CreateUserArgsUnhashedPassword;
  } else {
    throw new Error(
      `Validation failed: ${JSON.stringify(validationResult.error.issues)}`,
    );
  }
};

export const validateReturnedUser = (inputs: unknown) => {
  const validationResult = userZod.safeParse(inputs);

  if (validationResult.success) {
    return validationResult.data as ReturnedUser;
  } else {
    throw new Error(
      `Validation failed: ${JSON.stringify(validationResult.error.issues)}`,
    );
  }
};

export const validateUserList = (inputs: unknown) => {
  const validationResult = userZod.array().safeParse(inputs);

  if (validationResult.success) {
    return validationResult.data as ReturnedUser[];
  } else {
    throw new Error(
      `Validation failed: ${JSON.stringify(validationResult.error.issues)}`,
    );
  }
};
