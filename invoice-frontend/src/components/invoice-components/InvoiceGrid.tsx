import styled from "styled-components";
import PropTypes from "prop-types";
import React from "react";
import * as m from "motion/react-m";

const FlexContainer = styled(m.div)`
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
  children: React.ReactNode;
};

function InvoiceGrid({ children }: InvoiceGridProps) {
  return (
    <FlexContainer
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
      }}
    >
      {children}
    </FlexContainer>
  );
}

InvoiceGrid.propTypes = {
  children: PropTypes.node.isRequired,
};
export default InvoiceGrid;
