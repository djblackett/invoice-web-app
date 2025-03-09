import { FieldErrors, FieldValues } from "react-hook-form";

export interface ErrorDetail {
  type?: string;
}

export interface ItemError {
  [field: string]: ErrorDetail;
}

export interface FormErrors {
  [key: string]: ErrorDetail | unknown;
  items?: ItemError[];
}

export const errorTypeCollector = (errors: FormErrors): string[] => {
  const errorTypes: string[] = [];
  if (!errors) {
    return [];
  }

  // collect errors from the main form fields
  for (const key in errors) {
    if ((errors[key] as ErrorDetail)?.type) {
      errorTypes.push((errors[key] as ErrorDetail).type as string);
    }
  }

  // collect errors from the items array
  if (errors.items && errors.items instanceof Array) {
    errors.items.forEach((itemError: ItemError) => {
      if (itemError && typeof itemError === "object") {
        Object.keys(itemError).forEach((fieldName) => {
          const errorDetail: ErrorDetail = itemError[fieldName];
          if (errorDetail?.type) {
            errorTypes.push(errorDetail.type);
          }
        });
      }
    });
  }

  return Array.from(new Set(errorTypes));
};

export function clearErrorsByType(
  errors: FieldErrors<FieldValues>,
  type: string,
) {
  if (!errors) {
    return;
  }

  for (const key in errors) {
    if (errors[key]?.type === type) {
      delete errors[key];
    }
  }

  if (Array.isArray(errors.items)) {
    errors.items.forEach((itemError: ItemError) => {
      Object.keys(itemError).forEach((key: string) => {
        if (itemError[key]?.type === type) {
          delete itemError[key];
        }
      });
    });
  }
}
