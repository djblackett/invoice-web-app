import {
  ItemsHeaderStyled,
  Col1,
  Col,
} from "@/styles/EditFormItemListStyles.ts";

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
