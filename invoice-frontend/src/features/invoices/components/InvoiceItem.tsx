import styled from "styled-components";
import PropTypes from "prop-types";
import { getMoney } from "../../shared/utils/utilityFunctions.ts";

import { Item } from "@/features/invoices/types/invoiceTypes.ts";

const ItemContainer = styled.div`
  display: grid;
  width: 100%;
  padding: 1.5rem;
  padding-top: 1.5rem;
  grid-template: auto auto / 1fr 1fr;
  grid-auto-flow: dense;
  background-color: ${({ theme }) => theme.editButton};

  @media (min-width: 768px) {
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    grid-template: 1fr / 2fr 1fr 1fr 1fr;
    justify-items: end;

    :first-child {
      padding-top: 0;
    }

    :last-child {
      padding-bottom: 2rem;
    }
  }
`;

const ItemName = styled.div`
  white-space: nowrap;
  justify-self: flex-start;
  width: fit-content;
  margin: 0;
  padding: 0;
  color: ${({ theme }) => theme.text};
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
`;

// same style used for Price
const Quantity = styled.p`
  display: none;
  justify-self: end;
  width: fit-content;
  margin: 0;
  color: ${({ theme }) => theme.greyText};
  padding: 0;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */

  text-align: right;
  letter-spacing: -0.25px;

  @media (min-width: 768px) {
    display: inline;
    text-align: center;
    margin-right: 0.5rem;
  }
`;

const Price = styled(Quantity)`
  margin-right: 0;
`;

const Total = styled(ItemName)`
  text-align: end;
  justify-self: end;
  align-self: center;
  grid-area: 1 / 2 / 2 / 3;
  @media (min-width: 768px) {
    grid-area: initial;
  }
`;

const QuantityPriceContainer = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: contents;
  }
`;

const MobileQuantityPrice = styled.p`
  display: inline;
  grid-area: 2 / 1 / 3 / 2;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  margin: 0;
  margin-top: 0.5rem;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: ${({ theme }) => theme.greyText};

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileHelperContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (min-width: 768px) {
    display: contents;
  }
`;

export type ItemProps = {
  item: Item;
};

function InvoiceItem({ item }: ItemProps) {
  return (
    <ItemContainer className="item-container">
      <MobileHelperContainer className="mobile-helper-container">
        <ItemName className="item-name">{item.name}</ItemName>
        <QuantityPriceContainer className="quantity-price-container">
          <Quantity>{item.quantity}</Quantity>
          <Price>£ {getMoney(Number(item.price))}</Price>
        </QuantityPriceContainer>
        <MobileQuantityPrice>
          {`${item.quantity} x £ ${Number(item.price).toFixed(2)}`}{" "}
        </MobileQuantityPrice>
      </MobileHelperContainer>
      <Total>£ {getMoney(Number(item.total))}</Total>
    </ItemContainer>
  );
}

export default InvoiceItem;

InvoiceItem.propTypes = {
  item: PropTypes.object.isRequired,
};
