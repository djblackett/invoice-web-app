import styled from "styled-components";
import PropTypes from "prop-types";
import DeleteButton from "./buttons/DeleteButton";
import { useDispatch } from "react-redux";
import { removeInvoice } from "../features/invoices/invoicesSlice";

import { useNavigate } from "react-router-dom";
import CancelButton from "./buttons/CancelButton";

export const DarkenScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  min-height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  padding: 3rem;
  background-color: ${({ theme }) => theme.background};
  max-width: 480px;
  border-radius: 8px;
  box-shadow: 0px 10px 10px -10px rgba(72, 84, 159, 0.100397);
  margin: 0 1.5rem;
`;

const Confirm = styled.h1`
  font-family: "Spartan";
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  /* identical to box height, or 133% */

  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.text};
  margin: 0;
  margin-bottom: 13px;
`;

const Description = styled.p`
  font-family: "Spartan";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 22px;
  /* or 183% */

  letter-spacing: 0.25px;
  color: ${({ theme }) => theme.greyText};
`;

const ButtonContainer = styled.div`
  display: flex;
  align-self: flex-end;
  justify-content: center;
`;

function DeleteModal({ isModalOpen, setIsModalOpen, invoice }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch(removeInvoice(invoice.id));
    navigate(-1);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <DarkenScreen style={{ display: isModalOpen ? "flex" : "none" }}>
      <ModalContainer>
        <Confirm>Confirm Deletion</Confirm>
        <Description>
          Are you sure you want to delete invoice #XM9141? This action cannot be
          undone.
        </Description>
        <ButtonContainer>
          <CancelButton handleClick={closeModal} text={"Cancel"} />
          <DeleteButton handleClick={handleClick} />
        </ButtonContainer>
      </ModalContainer>
    </DarkenScreen>
  );
}

export default DeleteModal;

DeleteModal.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func.isRequired,
  invoice: PropTypes.object.isRequired,
};
