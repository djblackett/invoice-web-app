import styled from "styled-components";
import {
  FieldArray,
  FieldArrayMethodProps,
  FieldValues,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Item } from "../../types/types";

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  border-radius: 10px;
  background-color: var("colors-edit-button");
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
  color: var("--colors-new-item-text");
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  text-align: center;
  letter-spacing: -0.25px;
  margin-left: 0.25rem;
`;

// may use this in design later
// const plusIcon = (
//     <path
//         d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z"
//         fill="#7C5DFA"
//         fillRule="nonzero"
//     />
// );

export type NewItemButtonProps = {
  append: (
    value: FieldArray<FieldValues, string> | FieldArray<FieldValues, string>[],
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
      onClick={handleClick}
      type="button"
      style={{
        border:
          submitCount > 0 && items.length === 0
            ? "1px solid red"
            : "1px solid transparent",
      }}
    >
      {/* <SVG>{plusIcon}</SVG> */}
      <ButtonText>+ Add New Item</ButtonText>
    </Button>
  );
}

export default NewItemButton;
