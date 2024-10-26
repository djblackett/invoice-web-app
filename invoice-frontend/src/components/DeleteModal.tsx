import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import DeleteButton from "./buttons/DeleteButton";
import CancelButton from "./buttons/CancelButton";
import { useMutation } from "@apollo/client";
import { REMOVE_INVOICE, ALL_INVOICES } from "../graphql/queries";
import { ModalContainer, Confirm, ButtonContainer } from "../styles/DeleteModalStyles";
import { DarkenScreen } from "../styles/editStyles";
import { Description } from "../styles/FullInvoiceStyles";


export type DeleteModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function DeleteModal({ isModalOpen, setIsModalOpen }: DeleteModalProps) {
  const navigate = useNavigate();
  const id = useParams();

  const [deleteInvoice] = useMutation(REMOVE_INVOICE, {
    refetchQueries: [{ query: ALL_INVOICES }],
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleClick = async () => {
    await deleteInvoice({
      variables: {
        removeInvoiceId: id
      }
    });

    navigate("/");
    return;
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
          <CancelButton handleClick={closeModal} text="Cancel" />
          <DeleteButton handleClick={handleClick} />
        </ButtonContainer>
      </ModalContainer>
    </DarkenScreen>
  );
}

export default DeleteModal;
