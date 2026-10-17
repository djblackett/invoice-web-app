import styled from "styled-components";
import {
  FieldArrayMethodProps,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Item } from "@/features/invoices/types/invoiceTypes.ts";

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.editButton};
  cursor: pointer;

  &:hover {
    background-color: #dfe3fa;
  }

  &:focus {
    background-color: #dfe3fa;
  }
`;

export const SVG = styled.svg`
  width: 11px;
  height: 11px;
`;

const ButtonText = styled.p`
  color: ${({ theme }) => theme.newItemText};
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  text-align: center;
  letter-spacing: -0.25px;
  margin-left: 0.25rem;
`;

type NewItemInput = Omit<Item, "quantity" | "price" | "total"> & {
  quantity: number | string;
  price: number | string;
  total: number | string;
};

export type NewItemButtonProps = {
  append: (
    value: NewItemInput | NewItemInput[],
    options?: FieldArrayMethodProps,
  ) => void;
  items: Item[];
};

function NewItemButton({ items, append }: NewItemButtonProps) {
  const { clearErrors } = useFormContext();
  const {
    formState: { submitCount },
  } = useForm();

  const handleClick = () => {
    append({ id: "", name: "", quantity: "", price: "", total: "" });
    clearErrors("itemsError");
  };

  return (
    <Button
      data-testid="newItemButton"
      onClick={handleClick}
      type="button"
      style={{
        border:
          submitCount > 0 && items.length === 0
            ? "1px solid red"
            : "1px solid transparent",
      }}
    >
      <ButtonText>+ Add New Item</ButtonText>
    </Button>
  );
}

export default NewItemButton;
