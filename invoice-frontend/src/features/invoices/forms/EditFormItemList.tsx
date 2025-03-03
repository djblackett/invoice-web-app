import InputFormItem from "./InputFormItem.tsx";
import {
  ItemsContainer,
  ItemTitle,
  ListContainer,
} from "../../../styles/EditFormItemListStyles.ts";
import { Invoice } from "../../../types/types.ts";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider.tsx";
import { ItemsHeader } from "./ItemsHeader.tsx";

type EditFormItemListProps = {
  invoice?: Invoice;
  isEditOpen?: boolean;
};

function EditFormItemList({
  invoice,
  isEditOpen = false,
}: EditFormItemListProps) {
  const { isDraft } = useNewInvoiceContext();
  return (
    <ListContainer data-testid="items-container">
      <ItemTitle>Item List</ItemTitle>
      <ItemsHeader className="desktop-only-label" />
      <ItemsContainer>
        <InputFormItem
          isDraft={isDraft}
          invoice={invoice}
          isEditOpen={isEditOpen}
        />
      </ItemsContainer>
    </ListContainer>
  );
}

export default EditFormItemList;
