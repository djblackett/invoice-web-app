import styled from "styled-components";
import PropTypes from "prop-types";
import React, {JSX} from "react";

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 150px;
  align-items: center;
  padding: 0 1.5rem;
  align-self: center;

  @media (min-width: 768px) {
    padding: 0 48px;
  }
  
  @media (min-width: 1200px) {
    padding: 0;
  }
`;

export type InvoiceGridProps = {
  children: React.ReactNode
}

function InvoiceGrid({ children } :InvoiceGridProps) {
    return <FlexContainer>{children}</FlexContainer>;
}

InvoiceGrid.propTypes = {
    children: PropTypes.node,
};
export default InvoiceGrid;
