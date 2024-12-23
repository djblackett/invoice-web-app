import styled from "styled-components";
import Proptypes from "prop-types";
import React, { forwardRef } from "react";

const Button = styled.button`
  background-color: ${({ theme }) => theme.editButton};
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: ${({ theme }) => theme.greyText};
  /* outline: auto; */
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  margin: 0.25rem;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;

  &:hover {
    background-color: ${({ theme }) => theme.editButtonHover};
  }

  &:focus {
    border: 2px solid rgb(18, 22, 243);
    /* background-color: aquamarine; */
  }
`;

type EditButtonProps = {
  isEditOpen: boolean;
  toggleEditTab: React.Dispatch<React.SetStateAction<boolean>>;
  // editButton: React.MutableRefObject<HTMLButtonElement | null>;
};

const EditButton = forwardRef(
  ({ toggleEditTab, isEditOpen }: EditButtonProps, ref) => {
    const handleClick = () => {
      toggleEditTab(!isEditOpen);
    };
    return (
      <Button onClick={handleClick} ref={ref}>
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
