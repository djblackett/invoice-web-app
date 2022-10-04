import styled from "styled-components";
import PropTypes from "prop-types";
import { useState } from "react";

const FormEntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;

  font-style: ${({ theme }) => theme.font};

  /* width: fit-content; */

  @media (min-width: 768px) {
    width: initial;
    max-width: fit-content;
  }
`;

function FormEntry({ className, isLongOnMobile = false, children }) {
  const [isDirty, setIsDirty] = useState(false);
  const handleChange = () => {
    setIsDirty(true);
  };
  return (
    <FormEntryContainer
      onChange={handleChange}
      isDirty={isDirty}
      className={className}
      style={{ width: isLongOnMobile ? "100%" : "revert" }}
    >
      {children}
    </FormEntryContainer>
  );
}

export default FormEntry;

FormEntry.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isLongOnMobile: PropTypes.bool,
};
