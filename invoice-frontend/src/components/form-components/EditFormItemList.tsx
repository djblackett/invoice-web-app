import InputFormItem1 from "./InputFormItem1";
import {
  ItemsContainer,
  ItemTitle,
  ListContainer,
} from "../../styles/EditFormItemListStyles";
import { Invoice } from "../../types/types";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider";
import { ItemsHeader } from "./ItemsHeader";

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
        <InputFormItem1
          isDraft={isDraft}
          invoice={invoice}
          isEditOpen={isEditOpen}
        />
      </ItemsContainer>
    </ListContainer>
  );
}

export default EditFormItemList;
