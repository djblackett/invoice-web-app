import styled from "styled-components";
import PropTypes from "prop-types";
import React from "react";

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

export type AddressBoxProps = {
    children: React.ReactNode
}

function AddressBox({ children }: AddressBoxProps) {
    return <AddressDetails className="address-box">{children}</AddressDetails>;
}

AddressBox.propTypes = {
    children: PropTypes.node.isRequired
};
export default AddressBox;
