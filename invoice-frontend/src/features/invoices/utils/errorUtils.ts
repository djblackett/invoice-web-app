import { FieldErrors, FieldValues } from "react-hook-form";

export const errorTypeCollector = (errors) => {
  const errorTypes = [];
  if (!errors) {
    return [];
  }

  // collect errors from the main form fields
  for (const key in errors) {
    if (errors[key]?.type) {
      errorTypes.push(errors[key].type);
    }
  }

  // collect errors from the items array
  if (errors.items && errors.items instanceof Array) {
    errors.items.forEach((itemError) => {
      if (itemError && typeof itemError === "object") {
        Object.keys(itemError).forEach((fieldName) => {
          const errorDetail = itemError[fieldName];
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

  if (errors.items) {
    errors.items.forEach((itemError) => {
      Object.keys(itemError).forEach((key) => {
        if (itemError[key]?.type === type) {
          delete itemError[key];
        }
      });
    });
  }
}
