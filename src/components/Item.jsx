import styled from "styled-components";
import PropTypes from "prop-types";

const ItemContainer = styled.div`
  display: grid;
  width: 100%;
  /* border-radius: 8px; */
  padding: 2rem;
  padding-top: 0;
  /* grid-column: span 5; */
  grid-template: 1fr / 2fr 1fr 1fr 1fr;
  justify-items: end;
  background-color: ${({ theme }) => theme.editButton};
`;

// same srtyle for Total
const ItemName = styled.p`
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
`;

const Total = styled(ItemName)`
  text-align: end;
  justify-self: end;
`;

function Item({ item }) {
  console.log(item);
  return (
    <ItemContainer>
      <ItemName>{item.name}</ItemName>
      <Quantity>{item.quantity}</Quantity>
      <Quantity>£ {item.price.toFixed(2)}</Quantity>
      <Total>£ {item.total.toFixed(2)}</Total>
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
