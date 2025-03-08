import { ItemName as Name } from "@/styles/editFormItemStyles.tsx";
import { useFormContext } from "react-hook-form";
import { Invoice } from "../types/invoiceTypes";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider";

interface ItemNameProps {
  index: number;
  invoice?: Invoice;
}

function ItemName({ index, invoice }: ItemNameProps) {
  const { register, formState } = useFormContext();
  const { errors } = formState;
  const { isDraft } = useNewInvoiceContext();

  return (
    <Name
      {...register(`items[${index}].name`, { required: !isDraft })}
      placeholder="Item name"
      defaultValue={invoice ? invoice?.items?.[index]?.name : ""}
      type="text"
      style={{
        border:
          Array.isArray(errors.items) && errors?.items?.[index]?.name
            ? "1px solid #EC5757"
            : "",
      }}
    />
  );
}

export default ItemName;
