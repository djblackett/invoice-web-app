import styled from "styled-components";
import PropTypes from "prop-types";
import Item from "./Item";

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
  background-color: #373b53;
  padding: 2rem;
  border-radius: 0 0 8px 8px;
`;

const AmountDueTitle = styled.p`
  color: white;
  font-family: "Spartan";
  font-style: normal;
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
  font-family: "Spartan";
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  /* identical to box height, or 133% */

  text-align: right;
  letter-spacing: -0.5px;
  /* color: ${({ theme }) => theme.text}; */
  color: white;
`;

const ItemsHeader = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: grid;
    grid-template: 1fr / 2fr 1fr 1fr 1fr;
    color: ${({ theme }) => theme.greyText};
    background-color: ${({ theme }) => theme.editButton};
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
  font-family: "Spartan";
  font-style: normal;
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
  /* padding: 2rem;
   */

  margin-top: 2.5rem;
  border-radius: 8px 8px 0 0;
  background-color: ${({ theme }) => theme.editButton};

  @media (min-width: 768px) {
    padding: 0;
    border-radius: initial;
    margin-top: initial;
  }
`;

function ItemList({ invoice }) {
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
          <Item item={item} key={"item-" + item.name} />
        ))}
      </ItemsContainer>
      <AmountDue>
        <AmountDueTitle>
          <span className="amount-due">Amount Due</span>
          <span className="grand-total">Grand Total</span>
        </AmountDueTitle>
        <AmountDueTotal>£ {invoice.total.toFixed(2)}</AmountDueTotal>
      </AmountDue>
    </ListContainer>
  );
}

export default ItemList;

ItemList.propTypes = {
  invoice: PropTypes.object.isRequired,
};
