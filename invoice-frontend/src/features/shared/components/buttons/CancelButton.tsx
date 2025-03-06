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
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  scale: 0.9;
  flex-shrink: 1;
  flex-grow: 1;
  width: auto;
  max-width: 150px;
  margin-left: 0.25rem;

  @media (min-width: 325px) {
    scale: 1;
    margin-left: 0;
  }

  &:hover {
    background-color: ${({ theme }) => theme.editButtonHover};
  }
`;

type CancelButtonProps = {
  handleClick: () => void;
  justifySelf?: string;
  text: string;
};
function CancelButton({ handleClick, text, justifySelf }: CancelButtonProps) {
  return (
    <Button
      style={{ justifySelf: justifySelf || "auto" }}
      onClick={handleClick}
      type="button"
    >
      {text}
    </Button>
  );
}

export default CancelButton;

CancelButton.propTypes = {
  handleClick: Proptypes.func.isRequired,
  text: Proptypes.string.isRequired,
  justifySelf: Proptypes.string,
};
