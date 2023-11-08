import styled from "styled-components";
import  PropTypes  from "prop-types";

const Button = styled.button`
  background-color: #ec5757;
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  margin: 0.25rem;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;

  &:hover {
    background-color: #ff9797;
  }
`;

type DeleteProps = {
    handleClick: () => void;
}
function DeleteButton({ handleClick }: DeleteProps) {
    return <Button onClick={handleClick} type="button">Delete</Button>;
}

export default DeleteButton;

DeleteButton.propTypes = {
    handleClick: PropTypes.func.isRequired,
};
