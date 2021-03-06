import styled from "styled-components";
import PropTypes from "prop-types";
import EditFormItem from "./EditFormItem";
import NewItemButton from "./buttons/NewItemButton";
import { addItem } from "../features/invoices/invoicesSlice";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const ListContainer = styled.div`
  display: grid;
  width: 100%;
  max-width: 504px;
  border-radius: 8px;
`;

const ItemsHeader = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: grid;
    /* grid-template: auto / 2fr 1fr 1fr 1fr; */
    grid-template: 1fr / 220px 62px 116px 61px 49px;
    color: ${({ theme }) => theme.greyText};
    /* background-color: ${({ theme }) => theme.editButton}; */
    /* margin-top: 3rem; */
    /* padding: 2rem; */
    padding-left: 0;
    border-radius: 8px 8px 0 0;
    justify-items: start;
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
  max-width: 504px;
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

const ItemTitle = styled.h1`
  font-family: "Spartan";
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 32px;
  /* identical to box height, or 178% */

  letter-spacing: -0.375px;

  color: ${({ theme }) => theme.greyText};

  margin: 0;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

function EditFormItemList({ invoice, items, setItems }) {
  const handleAddNewItem = () => {
    setItems([
      ...items,
      { id: uuidv4(), name: "", quantity: 0, price: 0, total: 0 },
    ]);
  };

  const handleSyncItemFields = (id, name) => {
    let currentItem = items.find((currentItem) => currentItem.id === id);
    // currentItem[name] =
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
        {items.map((item) => (
          <EditFormItem
            item={item}
            items={items}
            key={item.name || item.id}
            id={item.id}
            setItems={setItems}
          />
        ))}
      </ItemsContainer>
      <NewItemButton handleAddNewItem={handleAddNewItem} />
    </ListContainer>
  );
}

export default EditFormItemList;

EditFormItemList.propTypes = {
  invoice: PropTypes.object.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  setItems: PropTypes.func.isRequired,
};
