import styled from "styled-components";

import PropTypes from "prop-types";

// const AddressContainer = styled.div`
//   display: flex;
//   flex-direction: column;
// `;

const AddressDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  max-width: 100vw;
  @media (min-width: 768px) {
    max-width: 504px;
  }
`;

function AddressBox({ children }) {
  return <AddressDetails>{children}</AddressDetails>;
}

AddressBox.propTypes = {
  children: PropTypes.node,
};
export default AddressBox;
