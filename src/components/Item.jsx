import styled from "styled-components";
import PropTypes from "prop-types";

const ItemContainer = styled.div`
  display: grid;
  width: 100%;
  /* border-radius: 8px; */

  padding: 1.5rem;
  padding-top: 0;
  grid-template: auto auto / 1fr 1fr;
  grid-auto-flow: dense;
  /* grid-column: span 5; */

  background-color: ${({ theme }) => theme.editButton};

  :first-child {
    padding-top: 1.5rem;
  }

  @media (min-width: 768px) {
    padding: 2rem;
    grid-template: 1fr / 2fr 1fr 1fr 1fr;
    justify-items: end;
  }
`;

// same srtyle for Total
const ItemName = styled.p`
  white-space: nowrap;
  justify-self: start;
  width: fit-content;
  margin: 0;
  padding: 0;
  color: ${({ theme }) => theme.text};
  font-family: "Spartan";
  font-style: normal;
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
  font-family: "Spartan";
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */

  text-align: right;
  letter-spacing: -0.25px;

  @media (min-width: 768px) {
    display: inline;
  }
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
  /* justify-content: space-between;
  align-items: center; */
  /* grid-area: 2 / 2 /3 / 3; */

  @media (min-width: 768px) {
    display: contents;
  }
`;

const MobileQuantityPrice = styled.p`
  display: inline;
  grid-area: 2 / 1 / 3 / 2;

  font-family: "Spartan";
  font-style: normal;
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
  justify-content: center;

  @media (min-width: 768px) {
    display: contents;
  }
`;

function Item({ item }) {
  return (
    <ItemContainer>
      <MobileHelperContainer>
        <ItemName>{item.name}</ItemName>
        <QuantityPriceContainer>
          <Quantity>{item.quantity}</Quantity>
          <Quantity>?? {item.price.toFixed(2)}</Quantity>
        </QuantityPriceContainer>
        <MobileQuantityPrice>
          {item.quantity + " x ?? " + item.price.toFixed(2)}{" "}
        </MobileQuantityPrice>
      </MobileHelperContainer>
      <Total>?? {item.total.toFixed(2)}</Total>
    </ItemContainer>
  );
}

export default Item;

Item.propTypes = {
  item: PropTypes.object.isRequired,
};

// {
//         "name": "Brand Guidelines",
//         "quantity": 1,
//         "price": 1800.90,
//         "total": 1800.90
//       }
