import InputFormItem1 from "./InputFormItem1";
import {
  Col,
  Col1,
  ItemsContainer,
  ItemsHeaderStyled,
  ItemTitle,
  ListContainer,
} from "../../styles/EditFormItemListStyles";
import { Invoice } from "../../types/types";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider";

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

interface ItemsHeaderProps {
  className?: string;
}
export const ItemsHeader = ({ className }: ItemsHeaderProps) => {
  return (
    <ItemsHeaderStyled className={className}>
      <Col1>Item Name</Col1>
      <Col1>Qty.</Col1>
      <Col1>Price</Col1>
      <Col>Total</Col>
    </ItemsHeaderStyled>
  );
};
