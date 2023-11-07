import styled from "styled-components";
import PropTypes from "prop-types";

const AddressDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  max-width: 100vw;

  @media (min-width: 768px) {
    flex-wrap: nowrap;
    max-width: 100%;
  }
`;

function AddressBox({ children }) {
  return <AddressDetails className="address-box">{children}</AddressDetails>;
}

AddressBox.propTypes = {
  children: PropTypes.node,
};
export default AddressBox;
