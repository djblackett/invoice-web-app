import styled from "styled-components";
import PropTypes from "prop-types";
import React from "react";
import EditButton from "../buttons/EditButton";
import DeleteButton from "../buttons/DeleteButton";
import MarkAsPaidButton from "../buttons/MarkAsPaidButton";
import {Invoice} from "../../types/types";

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  height: 91px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.background};
  margin-top: 3.5rem;
  order: 2;
  
  @media (min-width: 325px) {
    width: 100%;
    padding: 1.4rem 1.5rem;
  }

  @media (min-width: 600px) {
    order: initial;
    height: initial;
    width: initial;
    position: static;
    margin-top: initial;
    background-color: initial;
  }
`;

type ToolbarButtonsProps = {
    invoice: Invoice;
    isEditOpen: boolean;
    openModal: () => void;
    toggleEditTab: React.Dispatch<React.SetStateAction<boolean>>
}


function ToolbarButtons({ toggleEditTab, invoice, openModal, isEditOpen}: ToolbarButtonsProps) {
  return (
    <ButtonsContainer>
      <EditButton toggleEditTab={toggleEditTab} isEditOpen={isEditOpen}/>
      <DeleteButton handleClick={openModal} />
      <MarkAsPaidButton invoice={invoice} />
    </ButtonsContainer>
  );
}

export default ToolbarButtons;

ToolbarButtons.propTypes = {
  toggleEditTab: PropTypes.func.isRequired,
  // invoice: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
};
