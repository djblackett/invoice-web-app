import styled from "styled-components";
import Proptypes from "prop-types";

const Button = styled.button`
  display: inline;
  background-color: ${({ theme }) => theme.editButton};
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: ${({ theme }) => theme.greyText};
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  //margin: 0.25rem;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  scale: 0.9;
  
  @media (min-width: 325px) {
    scale: none;
    margin: 0.25rem;
  }

  &:hover {
    background-color: ${({ theme }) => theme.editButtonHover};
  }
`;
function CancelButton({ handleClick, text, justifySelf }) {
  return (
    <Button
      style={{ justifySelf: justifySelf ? justifySelf : "auto" }}
      onClick={handleClick}
      type="button"
    >
      {text}
    </Button>
  );
}

export default CancelButton;

CancelButton.propTypes = {
  handleClick: Proptypes.func,
  text: Proptypes.string.isRequired,
  justifySelf: Proptypes.string,
};
