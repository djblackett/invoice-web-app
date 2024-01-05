import styled from "styled-components";
import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import InvoiceItem from "./InvoiceItem";
import { addIdToExistingInvoices } from "../../features/invoices/invoicesSlice";
import { getMoney } from "../../utils/utilityFunctions";
import { Invoice } from "../../types/types";

const ListContainer = styled.div`
  display: grid;
  width: 100%;
  border-radius: 8px;
`;

const AmountDue = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  background-color: var(--colors-amount-due-background);
  padding: 2rem;
  border-radius: 0 0 8px 8px;
`;

const AmountDueTitle = styled.p`
  color: white;
  font-weight: 500;
  font-size: 11px;
  line-height: 18px;
  /* identical to box height, or 164% */
  letter-spacing: -0.229167px;

  .grand-total {
    display: inline;
  }

  .amount-due {
    display: none;
  }

  @media (min-width: 768px) {
    .grand-total {
      display: none;
    }

    .amount-due {
      display: inline;
    }
  }
`;

const AmountDueTotal = styled.p`
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  /* identical to box height, or 133% */
  text-align: right;
  letter-spacing: -0.5px;
  color: white;
`;

const ItemsHeader = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: grid;
    grid-template: 1fr / 2fr 1fr 1fr 1fr;
    color: var(--colors-grey-text);
    background-color: var(--colors-edit-button);
    margin-top: 3rem;
    padding: 2rem;
    border-radius: 8px 8px 0 0;
    justify-items: end;
  }
`;

const Col = styled.p`
  width: fit-content;
  margin: 0;
  padding: 0;
  font-weight: 500;
  font-size: 11px;
  line-height: 18px;
  /* identical to box height, or 164% */
  letter-spacing: -0.229167px;
`;

const Col1 = styled(Col)`
  justify-self: start;
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 2.5rem;
  border-radius: 8px 8px 0 0;
  background-color: var(--colors-edit-button);

  @media (min-width: 768px) {
    padding: 0;
    border-radius: initial;
    margin-top: initial;
  }
`;

let count = 0;

type ItemListProps = {
  invoice: Invoice;
};

function ItemList({ invoice }: ItemListProps) {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(addIdToExistingInvoices());
  }, []);

  return (
    <ListContainer>
      <ItemsHeader>
        <Col1>Item Name</Col1>
        <Col>QTY.</Col>
        <Col>Price</Col>
        <Col>Total</Col>
      </ItemsHeader>
      <ItemsContainer>
        {invoice.items.map((item) => (
          <InvoiceItem item={item} key={`itemList-${item.id || ++count}`} />
        ))}
      </ItemsContainer>
      <AmountDue>
        <AmountDueTitle>
          <span className="amount-due">Amount Due</span>
          <span className="grand-total">Grand Total</span>
        </AmountDueTitle>
        <AmountDueTotal>£ {getMoney(invoice.total)}</AmountDueTotal>
      </AmountDue>
    </ListContainer>
  );
}

export default ItemList;

ItemList.propTypes = {
  // invoice: PropTypes.object.isRequired,
};
