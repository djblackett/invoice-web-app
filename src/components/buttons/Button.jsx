import styled from "styled-components";
import Proptypes from "prop-types";

const PrimaryButton = styled.button`
  background-color: ${({ theme }) => theme.buttonBackground};
  border-radius: 24px;
  cursor: pointer;
  width: fit-content;
  white-space: nowrap;

  @media (min-width: 1200px) {
    width: 150px;
  }
`;

function Button({ children }) {
  return <PrimaryButton type="button">{children}</PrimaryButton>;
}

Button.propTypes = { children: Proptypes.node };

export default Button;
