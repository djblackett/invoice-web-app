import { Quantity } from "@/styles/editFormItemStyles";
import { useFormContext } from "react-hook-form";
import { Invoice } from "../types/invoiceTypes";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider";

interface ItemQuantityProps {
  index: number;
  invoice?: Invoice;
}
function ItemQuantity({ index, invoice }: ItemQuantityProps) {
  const { register, formState } = useFormContext();
  const { errors } = formState;
  const { isDraft } = useNewInvoiceContext();

  const isPatternError = () => {
    if (errors.items && errors.items instanceof Array) {
      return errors.items.some(
        (itemField) =>
          itemField &&
          Object.values(itemField).some(
            (errorDetail) => errorDetail?.type === "pattern",
          ),
      );
    }
    return false;
  };

  return (
    <div style={{ position: "relative" }}>
      <Quantity
        {...register(`items[${index}].quantity`, {
          required: !isDraft,
          max: 1000,
          pattern: {
            value: /^[0-9]+$/,
            message: "Only numbers are allowed",
          },
        })}
        placeholder="0"
        inputMode="numeric"
        type="text"
        style={{
          border:
            Array.isArray(errors.items) && errors?.items?.[index]?.quantity
              ? "1px solid #EC5757"
              : "",
        }}
        defaultValue={invoice ? invoice?.items?.[index]?.quantity : 0}
      />

      {Array.isArray(errors.items) && isPatternError() && (
        <span
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            marginTop: "4px",
            padding: "6px 8px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "4px",
            whiteSpace: "pre-line",
            textWrap: "nowrap",
          }}
        >
          {errors?.items?.[index]?.quantity?.message}
        </span>
      )}
    </div>
  );
}

export default ItemQuantity;
