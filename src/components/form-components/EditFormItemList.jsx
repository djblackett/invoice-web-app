import styled from "styled-components";
import PropTypes from "prop-types";
import EditFormItem from "./EditFormItem";
import NewItemButton from "../buttons/NewItemButton";
import {addIdToExistingInvoices, addItem} from "../../features/invoices/invoicesSlice";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {useFieldArray, useForm} from "react-hook-form";


const ListContainer = styled.div`
  display: grid;
  width: 100%;
  border-radius: 8px;
  grid-template-rows: auto;
  background-color: ${({ theme }) => theme.background};
`;

export const ItemsHeader = styled.div`
  display: none;

  @media (min-width: 600px) {
    display: grid;
    grid-template: 1fr / 220px 62px 116px 61px 49px;
    color: ${({ theme }) => theme.newItemText};
    margin-top: 1rem;
    padding-left: 0;
    border-radius: 8px 8px 0 0;
    justify-items: start;
  }
`;

export const Col = styled.p`
  color: ${({ theme }) => theme.newItemText};
  width: fit-content;
  margin: 0;
  padding: 0;
  font-family: "Spartan",sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 18px;
  /* identical to box height, or 164% */
  letter-spacing: -0.229167px;
`;

export const Col1 = styled(Col)`
  justify-self: start;
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 504px;
  border-radius: 8px 8px 0 0;
  background-color: ${({ theme }) => theme.background};
  transition: all 250ms ease-in-out;

  @media (min-width: 768px) {
    padding: 0;
    border-radius: initial;
    margin-top: initial;
  }
`;

const ItemTitle = styled.h1`
  font-weight: 700;
  font-size: 18px;
  line-height: 32px;
  /* identical to box height, or 178% */

  letter-spacing: -0.375px;

  color: ${({ theme }) => theme.greyText};

  margin-top: 1rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
`;

function EditFormItemList({ items, setItems}) {

    // boilerplate for if I decide to try to integrate the items list with react-hook-form
    // currently not implemented
    const { control, register } = useForm();
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "form-items", // unique name for your Field Array
    });


    const dispatch = useDispatch();
    const handleAddNewItem = (e) => {
      e.preventDefault();
      setItems([
        ...items,
        { id: uuidv4(), name: "", quantity: 0, price: 0, total: 0 },
      ]);

    dispatch(addIdToExistingInvoices());
  };


  return (
    <ListContainer>
      <ItemTitle>Item List</ItemTitle>
      <ItemsHeader>
        <Col1>Item Name</Col1>
        <Col>Qty.</Col>
        <Col>Price</Col>
        <Col>Total</Col>
      </ItemsHeader>
      <ItemsContainer>
        {items.map((item) => {
            return (
          <EditFormItem
            item={item}
            items={items}
            key={"editItemList-" + item.id}
            setItems={setItems}
          />
        )})}
      </ItemsContainer>
      <NewItemButton handleAddNewItem={handleAddNewItem} />
    </ListContainer>
  );
}

export default EditFormItemList;

EditFormItemList.propTypes = {
  invoice: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  setItems: PropTypes.func.isRequired,
};
