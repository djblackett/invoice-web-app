import styled from "styled-components";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useWindowWidth } from "../../hooks/useWindowWidth";

export const FormEntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  font-style: ${({ theme }) => theme.font};
  width: 45%;

  @media (min-width: 768px) {
    width: 100%;
    max-width: fit-content;
  }
`;

const OppositeWidthContainer = styled(FormEntryContainer)`
  width: 100%;

  @media (min-width: 768px) {
    width: 45%;
    max-width: fit-content;
  }
`;

// todo double check the mobile layout here
function FormEntry({ className, isLongOnMobile = false, children }) {
  const [isDirty, setIsDirty] = useState(false);
  const windowWidth = useWindowWidth();
  const handleChange = () => {
    setIsDirty(true);
  };

  // mobile view gets a longer component, hence the awkward naming scheme here
  if (isLongOnMobile) {
    return (
      <OppositeWidthContainer
        onChange={handleChange}
        isDirty={isDirty}
        className={className}
      >
        {children}
      </OppositeWidthContainer>
    );
  }

  else {
    return (
      <FormEntryContainer
        onChange={handleChange}
        isDirty={isDirty}
        className={className}
      >
        {children}
      </FormEntryContainer>
    );
  }
}

export default FormEntry;

FormEntry.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isLongOnMobile: PropTypes.bool,
  isAlwaysLong: PropTypes.bool,
};
