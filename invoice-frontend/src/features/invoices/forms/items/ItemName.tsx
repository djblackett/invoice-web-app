import { ItemName as Name } from "@/styles/editFormItemStyles.tsx";
import { useFormContext } from "react-hook-form";
import { FormType, Invoice } from "../../types/invoiceTypes.ts";
import { useNewInvoiceContext } from "../NewInvoiceContextProvider.tsx";

interface ItemNameProps {
  index: number;
  invoice?: Invoice;
}

function ItemName({ index, invoice }: ItemNameProps) {
  const { register, formState } = useFormContext<FormType>();
  const { errors } = formState;
  const itemError = errors.items?.[index];
  const { isDraft } = useNewInvoiceContext();

  return (
    <Name
      {...register(`items.${index}.name`, { required: !isDraft })}
      placeholder="Item name"
      defaultValue={invoice ? invoice?.items?.[index]?.name : ""}
      type="text"
      style={{
        border:
          Array.isArray(errors.items) && itemError?.name
            ? "1px solid #EC5757"
            : "",
      }}
    />
  );
}

export default ItemName;
