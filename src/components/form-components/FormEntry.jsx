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

  width: 45%;

  @media (min-width: 768px) {
    width: 100%;
    max-width: fit-content;
  }
`;

function FormEntry({ className, isLongOnMobile = false, children, isAlwaysLong=false }) {
  const [isDirty, setIsDirty] = useState(false);
  const windowWidth = useWindowWidth();
  const handleChange = () => {
    setIsDirty(true);
  };

  useEffect(() => {

  }, [windowWidth])

  // const width = isLongOnMobile ? "100%" : windowWidth < 768 ? "45%" : "revert";

  return (
    <FormEntryContainer
      onChange={handleChange}
      isDirty={isDirty}
      className={className}
      // style={{ width: isAlwaysLong ? "100%" : width}}
      // style={{width: }}
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
  isAlwaysLong: PropTypes.bool,
};
