import styled from "styled-components";
import Proptypes from "prop-types";

const PrimaryButton = styled.button`
  background-color: ${({ theme }) => theme.buttonBackground};
  border-radius: 24px;
`;

function Button({ children }) {
  return <PrimaryButton>{children}</PrimaryButton>;
}

Button.propTypes = { children: Proptypes.node };

export default Button;
