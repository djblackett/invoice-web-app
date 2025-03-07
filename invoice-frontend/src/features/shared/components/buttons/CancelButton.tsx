import styled from "styled-components";
import Proptypes from "prop-types";
import { style } from "motion/react-m";

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
  max-height: 48px;
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
  style?: React.CSSProperties;
};
function CancelButton({
  handleClick,
  text,
  justifySelf,
  style,
}: CancelButtonProps) {
  return (
    <Button
      style={{ justifySelf: justifySelf || "auto", ...style }}
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
