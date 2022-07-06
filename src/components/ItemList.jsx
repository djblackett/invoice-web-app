import styled from "styled-components";
import PropTypes from "prop-types";

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
  color: black;
`;

const AmountDueTotal = styled.p`
  font-size: 20px;
`;

function ItemList({ invoice }) {
  return (
    <ListContainer>
      <AmountDue>
        <AmountDueTitle>Amount Due</AmountDueTitle>
        <AmountDueTotal>{invoice.total}</AmountDueTotal>{" "}
      </AmountDue>
    </ListContainer>
  );
}

export default ItemList;

ItemList.propTypes = {
  invoice: PropTypes.object.isRequired,
};
