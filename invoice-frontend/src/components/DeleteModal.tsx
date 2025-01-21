import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import DeleteButton from "./buttons/DeleteButton";
import CancelButton from "./buttons/CancelButton";
import { useMutation } from "@apollo/client";
import { REMOVE_INVOICE, ALL_INVOICES } from "../graphql/invoice.queries";
import {
  ModalContainer,
  Confirm,
  ButtonContainer,
} from "../styles/DeleteModalStyles";
import { DarkenScreen } from "../styles/editStyles";
import { Description } from "../styles/FullInvoiceStyles";
import { toast, Theme } from "react-toastify";
import { ClickOutsideProvider } from "@shelf/react-outside-click";
import { Invoice } from "src/types/types";

export type DeleteModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  invoice: Invoice;
};

function DeleteModal({
  isModalOpen,
  setIsModalOpen,
  invoice,
}: DeleteModalProps) {
  const colorMode = localStorage.getItem("theme");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [deleteInvoice] = useMutation(REMOVE_INVOICE, {
    refetchQueries: [{ query: ALL_INVOICES }],
    onCompleted: () => {
      navigate("/");
    },
    onError: (error) => {
      console.log(error.graphQLErrors[0]);
      toast.error("An error occurred!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: (colorMode as Theme) || undefined,
      });
    },
  });

  const handleClick = async () => {
    await deleteInvoice({
      variables: {
        removeInvoiceId: id,
      },
    });
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <DarkenScreen style={{ display: isModalOpen ? "flex" : "none" }}>
      <ClickOutsideProvider onOutsideClick={closeModal}>
        <ModalContainer>
          <Confirm>Confirm Deletion</Confirm>
          <Description>
            {`Are you sure you want to delete invoice #${invoice.id}? This action cannot
            be undone.`}
          </Description>
          <ButtonContainer>
            <CancelButton handleClick={closeModal} text="Cancel" />
            <DeleteButton handleClick={handleClick} />
          </ButtonContainer>
        </ModalContainer>
      </ClickOutsideProvider>
    </DarkenScreen>
  );
}

export default DeleteModal;
