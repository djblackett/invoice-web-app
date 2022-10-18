import styled from "styled-components";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {useWindowWidth} from "../../hooks/useWindowWidth";

export const FormEntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  font-style: ${({ theme }) => theme.font};
  width: 100%;
`;

function LongFormEntry({ className, children}) {
  const [isDirty, setIsDirty] = useState(false);
  const handleChange = () => {
    setIsDirty(true);
  };

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

export default LongFormEntry;

LongFormEntry.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isLongOnMobile: PropTypes.bool,
  isAlwaysLong: PropTypes.bool,
};