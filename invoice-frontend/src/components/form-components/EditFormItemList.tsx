import InputFormItem1  from "./InputFormItem1";
import {Col, Col1, ItemsContainer, ItemsHeader, ItemTitle, ListContainer} from "../../styles/EditFormItemListStyles";
import {Invoice} from "../../types/types";

type EditFormItemListProps = {
  invoice?: Invoice;
  isDraft: boolean;
  isEditOpen?: boolean;
};

function EditFormItemList({
  isDraft,
  invoice,
  isEditOpen,
}: EditFormItemListProps) {
  return (
    <ListContainer>
      <ItemTitle>Item List</ItemTitle>
      <ItemsHeader>
        <Col1>Item Name</Col1>
        <Col1>Qty.</Col1>
        <Col1>Price</Col1>
        <Col>Total</Col>
      </ItemsHeader>
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
