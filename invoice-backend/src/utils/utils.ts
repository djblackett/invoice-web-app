import { Role } from "@prisma/client";
import { ValidationException } from "@/config/exception.config";
import {
  CreateUserDTO,
  Invoice,
  InvoiceWithCreatedBy,
  ReturnedUser,
  UserDTO,
  UserEntity,
} from "@/constants/types";
import {
  invoiceListZod,
  invoiceZod,
  userCreateZod,
  userZod,
} from "@/constants/zodSchemas";

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
    name: user.name ?? "",
    username: user.username,
  };
}

export function mapPartialInvoiceToInvoice(
  invoice: Partial<Invoice>,
): InvoiceWithCreatedBy {
  if (
    !invoice.createdBy ||
    !invoice.createdBy.id ||
    !invoice.createdBy.username ||
    !invoice.createdById
  ) {
    throw new ValidationException("Invalid User data in invoice");
  }

  try {
    const invoiceWithDefaultValues: InvoiceWithCreatedBy = {
      id: invoice.id ?? "",
      clientEmail: invoice.clientEmail ?? "",
      clientName: invoice.clientName ?? "",
      description: invoice.description ?? "",
      createdAt: invoice.createdAt ?? new Date().toISOString(),
      createdBy: {
        id: invoice.createdBy.id,
        name: invoice.createdBy.name ?? "",
        username: invoice.createdBy.username,
        role: invoice.createdBy.role ?? Role.USER,
      },
      createdById: invoice.createdById,
      status: invoice.status ?? "draft",
      paymentDue: invoice.paymentDue ?? new Date().toISOString(),
      paymentTerms: invoice.paymentTerms ?? 0,
      clientAddress: {
        street: invoice.clientAddress?.street ?? "",
        city: invoice.clientAddress?.city ?? "",
        postCode: invoice.clientAddress?.postCode ?? "",
        country: invoice.clientAddress?.country ?? "",
      },
      senderAddress: {
        street: invoice.senderAddress?.street ?? "",
        city: invoice.senderAddress?.city ?? "",
        postCode: invoice.senderAddress?.postCode ?? "",
        country: invoice.senderAddress?.country ?? "",
      },
      items:
        invoice.items?.map((item) => ({
          id: item.id ?? "",
          name: item.name ?? "",
          price: item.price ?? 0,
          quantity: item.quantity ?? 0,
          total: item.total ?? 0,
        })) ?? [],
      total: invoice.total ?? 0,
    };

    return invoiceWithDefaultValues;
  } catch (e) {
    console.error(e);
    throw new ValidationException("Failed to map invoice data");
  }
}
