import styled from "styled-components";
import Proptypes from "prop-types";
import React, { forwardRef } from "react";

const Button = styled.button`
  background-color: ${({ theme }) => theme.editButton};
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: ${({ theme }) => theme.greyText};
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.25px;
  scale: 0.85;

  &:hover {
    background-color: ${({ theme }) => theme.editButtonHover};
  }

  &:focus {
    border: 2px solid rgb(18, 22, 243);
    outline: auto;
  }

  @media (min-width: 300px) {
    scale: 1;
    margin-left: 0.25rem;
    flex-grow: 1;
  }
`;

type EditButtonProps = {
  isEditOpen: boolean;
  toggleEditTab: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditButton = forwardRef<HTMLButtonElement, EditButtonProps>(
  ({ toggleEditTab, isEditOpen }, ref) => {
    const handleClick = () => {
      toggleEditTab(!isEditOpen);
    };
    return (
      <Button
        onClick={handleClick}
        ref={ref}
        data-testid="edit-button"
        aria-label="Edit button"
      >
        Edit
      </Button>
    );
  },
);

EditButton.displayName = "EditButton";
export default EditButton;

EditButton.propTypes = {
  toggleEditTab: Proptypes.func.isRequired,
};
