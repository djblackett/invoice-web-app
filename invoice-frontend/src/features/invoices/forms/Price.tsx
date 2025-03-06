import { Price } from "@/styles/editFormItemStyles";
import { isDraft } from "@reduxjs/toolkit";
import { useFormContext } from "react-hook-form";
import { Invoice } from "../types/invoiceTypes";

interface ItemPriceProps {
  index: number;
  invoice?: Invoice;
}

function ItemPrice({ index, invoice }: ItemPriceProps) {
  const { register, formState } = useFormContext();
  const { errors } = formState;
  return (
    <div style={{ position: "relative" }}>
      <Price
        {...register(`items[${index}].price`, {
          required: !isDraft,
          max: 100000,
          pattern: {
            value: /^\$?\d+(,\d{3})*\.?[0-9]?[0-9]?$/,
            message: "Only numbers are allowed - max 2 decimal places",
          },
        })}
        placeholder="0.00"
        inputMode="numeric"
        type="text"
        defaultValue={invoice ? invoice?.items?.[index]?.price : 0}
        style={{
          border:
            Array.isArray(errors.items) && errors?.items?.[index]?.price
              ? "1px solid #EC5757"
              : "",
        }}
      />
      {Array.isArray(errors.items) && errors?.items?.[index]?.price && (
        <div
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
            // whiteSpace: "nowrap",
            textWrap: "balance",
          }}
        >
          {errors?.items?.[index]?.price?.message}
        </div>
      )}
    </div>
  );
}

export default ItemPrice;
