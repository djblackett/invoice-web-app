import styled from "styled-components";
import Proptypes from "prop-types";
import React from "react";

const Button = styled.button`
  background-color: var(--colors-edit-button);
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: var(--colors-grey-text);
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  margin: 0.25rem;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;

  &:hover {
    background-color: var(--colors-edit-button-hover);
  }
`;

type EditButtonProps = {
  isEditOpen: boolean;
  toggleEditTab: React.Dispatch<React.SetStateAction<boolean>>;
};

function EditButton({ toggleEditTab, isEditOpen }: EditButtonProps) {
  const handleClick = () => {
    toggleEditTab(!isEditOpen);
  };
  return (
    <Button onClick={handleClick} type="button">
      Edit
    </Button>
  );
}

export default EditButton;

EditButton.propTypes = {
  toggleEditTab: Proptypes.func.isRequired,
};
