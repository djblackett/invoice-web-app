import styled from "styled-components";
import PropTypes from "prop-types";
import { SyntheticEvent } from "react";

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
  letter-spacing: -0.25px;
  scale: 0.85;

  &:hover {
    background-color: #ff9797;
  }

  @media (min-width: 300px) {
    scale: 1;
    margin: 0.25rem;
  }
`;

type DeleteProps = {
  handleClick: (e: SyntheticEvent) => void;
};

function DeleteButton({ handleClick }: DeleteProps) {
  return (
    <Button onClick={handleClick} type="button" aria-label="delete-button">
      Delete
    </Button>
  );
}

export default DeleteButton;

DeleteButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
};
