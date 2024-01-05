import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import React from "react";
import DeleteButton from "./buttons/DeleteButton";
import CancelButton from "./buttons/CancelButton";
import { Invoice } from "@/types/types";
import {useMutation} from "@apollo/client";
import {ALL_INVOICES, REMOVE_INVOICE} from "@/graphql/queries";
import allInvoices from "@/components/AllInvoices";

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
  z-index: 100;
`;

const ModalContainer = styled.div`
  display: flex;
  position: absolute;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  padding: 3rem;
  background-color: var(--colors-background);
  max-width: 480px;
  border-radius: 8px;
  box-shadow: 0px 10px 10px -10px rgba(72, 84, 159, 0.100397);
  margin: 0 1.5rem;
`;

const Confirm = styled.h1`
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  /* identical to box height, or 133% */
  letter-spacing: -0.5px;
  color: var(--colors-text);
  margin: 0;
  margin-bottom: 13px;
`;

const Description = styled.p`
  font-weight: 500;
  font-size: 12px;
  line-height: 22px;
  /* or 183% */

  letter-spacing: 0.25px;
  color: var(--colors-grey-text);
`;

const ButtonContainer = styled.div`
  display: flex;
  align-self: flex-end;
  justify-content: center;
`;

export type DeleteModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
};

function DeleteModal({
  isModalOpen,
  setIsModalOpen,
    id
}: DeleteModalProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [deleteInvoice, result] = useMutation(REMOVE_INVOICE, {
    refetchQueries: [{query: ALL_INVOICES}],
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

    router.push("/");
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

// DeleteModal.propTypes = {
//   isModalOpen: PropTypes.bool,
//   setIsModalOpen: PropTypes.func.isRequired,
//   invoice: PropTypes.object.isRequired,
// };
