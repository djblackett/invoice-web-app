import InputFormItem1 from "./InputFormItem1";
import {
  Col,
  Col1,
  ItemsContainer,
  ItemsHeader,
  ItemTitle,
  ListContainer,
} from "@/styles/EditFormItemListStyles";
import { Invoice } from "@/types/types";
import styles from "../../styles/editFormItemStyles.module.css";

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
      <h1 className={styles.itemTitle}>Item List</h1>
      <ItemsHeader>
        <p className={styles.columnHeadingFlexStart}>Item Name</p>
        <p className={styles.columnHeadingFlexStart}>Qty.</p>
        <p className={styles.columnHeadingFlexStart}>Price</p>
        <p className={styles.columnHeadingCentered}>Total</p>
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
