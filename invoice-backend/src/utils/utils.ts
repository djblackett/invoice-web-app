import { ValidationException } from "../config/exception.config";
import {
  CreateUserDTO,
  invoiceListZod,
  invoiceZod,
  ReturnedUser,
  userCreateZod,
  UserDTO,
  UserEntity,
  userZod,
} from "../constants/types";

export const validateInvoiceData = (inputs: unknown) => {
  const validationResult = invoiceZod.safeParse(inputs);

  if (validationResult.success) {
    return validationResult.data;
  } else {
    throw new ValidationException(
      `Validation failed: ${JSON.stringify(validationResult.error.issues)}`,
    );
  }
};

export const validateInvoiceList = (inputs: unknown) => {
  const validationResult = invoiceListZod.safeParse(inputs);

  if (validationResult.success) {
    return validationResult.data;
  } else {
    throw new ValidationException(
      `Validation failed: ${JSON.stringify(validationResult.error.issues)}`,
    );
  }
};

export const validateUserCreate = (inputs: unknown) => {
  const validationResult = userCreateZod.safeParse(inputs);

  if (validationResult.success) {
    return validationResult.data as CreateUserDTO;
  } else {
    throw new ValidationException(
      `Validation failed: ${JSON.stringify(validationResult.error.issues)}`,
    );
  }
};

export const validateReturnedUser = (inputs: unknown) => {
  const validationResult = userZod.safeParse(inputs);

  if (validationResult.success) {
    return validationResult.data as ReturnedUser;
  } else {
    throw new ValidationException(
      `Validation failed: ${JSON.stringify(validationResult.error.issues)}`,
    );
  }
};

export const validateUserList = (inputs: unknown) => {
  const validationResult = userZod.array().safeParse(inputs);

  if (validationResult.success) {
    return validationResult.data as UserDTO[];
  } else {
    throw new ValidationException(
      `Validation failed: ${JSON.stringify(validationResult.error.issues)}`,
    );
  }
};

export function mapUserEntityToDTO(user: UserEntity): UserDTO {
  return {
    name: user.name,
    username: user.username,
  };
}
