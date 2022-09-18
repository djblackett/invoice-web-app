import styled from "styled-components";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../features/invoices/invoicesSlice";

const ItemContainer = styled.div`
  display: grid;
  width: 100%;
  max-width: 504px;
  height: 72px;
  align-items: center;
  /* border-radius: 8px; */

  /* padding: 1.5rem; */
  padding-top: 0;
  grid-template: auto auto / 1fr 1fr;
  grid-auto-flow: dense;
  /* grid-column: span 5; */

  background-color: ${({ theme }) => theme.background};

  :first-child {
    /* padding-top: 1.5rem; */
  }

  @media (min-width: 768px) {
    /* padding: 2rem; */
    

    // Setting the px of the grid column keeps the form fields lined up. 
    grid-template: 1fr / 220px 62px 116px 61px 45px;
    justify-items: start;
    
    // trying flex instead of grid
    /* display:flex;
    flex-direction: row;
    justify-content: space-between; */
  
  
  }
`;


const Input = styled.input`
  width: 240px;
  height: 48px;
  border-radius: 4px;
  border-color: ${({ theme }) => theme.formFieldOutline};
  /* outline: none; */
  padding: 17px 20px 16px 20px;
  margin-bottom: 1.5rem;
  /* margin-right: 1rem; */
  font-family: ${({ theme }) => theme.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* margin-left:5px; */
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;
  /* color: #0c0e16; */
  color: ${({ theme }) => theme.textPlain};
  background-color: ${({ theme }) => theme.editButton};

  &:focus {
    border-color: black;
  }

  .custom-input {
    padding: 0;
  }
`;

const ItemName = styled(Input)`
  white-space: nowrap;
  justify-self: start;
  width: 204px;
  margin: 0;

  padding-left: 1.25rem;
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
const Quantity = styled(Input)`
  display: none;
  /* justify-self: end; */
  width: 46px;
  margin: 0;
  /* margin-left: 1rem; */
  color: ${({ theme }) => theme.greyText};
  padding: 0;
  font-family: "Spartan";
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */

  text-align: center;
  letter-spacing: -0.25px;

  @media (min-width: 768px) {
    display: inline;
  }
`;

const Price = styled(Quantity)`
  width: 100px;
  padding-left: 1.25rem;
  text-align: left;
`

const Total = styled.p`
  /* text-align: end; */
  /* justify-self: end; */
  align-self: center;
  /* grid-area: 1 / 2 / 2 / 3; */
  height: fit-content;
  font-family: 'Spartan';
font-style: normal;
font-weight: 700;
font-size: 12px;
line-height: 15px;
/* margin-left: 1rem; */
/* identical to box height, or 125% */

color: ${({theme}) => theme.greyText};

letter-spacing: -0.25px;
  @media (min-width: 768px) {
    grid-area: initial;
    text-align: left;
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

export const SVG = styled.svg`
  width: 13px;
  height: 16px;
  justify-self: end;
  cursor: pointer;

`

const deleteIcon = <path d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z" fill="#888EB0" fillRule="nonzero"/>

function EditFormItem({ item, id, items, setItems }) {

  // const [item1, setItem1] = useState({name: item.name, quantity: item.quantity, price: item.price, total: item.total});

  const handleChange = (e) => {
    e.preventDefault();
    const name1 = e.target.name;
    const newItem = {...item, [name1]: e.target.value};
    newItem.total = (newItem.quantity * newItem.price).toFixed(2);
    // setItem1(newItem);
    
    console.log( items);

//     // console.log(item.name);
    // const items2 = items.filter(currentItem => currentItem.id != item.id);
    const items2 = [...items];
    const index = items.indexOf(item);
    console.log(items2);
    items2.splice(index, 1, newItem)
    setItems(items2); 
    console.log("new items Array: " + items2);
  }

  const removeItem = () => {
    const items2 = items.filter(currentItem => currentItem.id != item.id);
    setItems(items2);
  }

  return (
    <ItemContainer>
      
        <MobileHelperContainer>
          <ItemName   name={"name"} onChange={handleChange} value={item.name}/>
          <QuantityPriceContainer>
            <Quantity   name={"quantity"} onChange={handleChange} value={item.quantity}/>
            <Price   name={"price"} onChange={handleChange} value={item.price}/>
          </QuantityPriceContainer>
          <MobileQuantityPrice>
            {item.quantity + " x £ " + Number(item.price).toFixed(2)}
          </MobileQuantityPrice>
        </MobileHelperContainer>
        <Total name={"total"}   onChange={handleChange} value={item.total}>{(item.quantity * item.price).toFixed(2)}</Total>
        <SVG name="removeButton" onClick={removeItem} >{deleteIcon}</SVG>
    
    </ItemContainer>
  );
}

export default EditFormItem;

EditFormItem.propTypes = {
  item: PropTypes.object.isRequired,
  id: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  setItems: PropTypes.func.isRequired,
};


