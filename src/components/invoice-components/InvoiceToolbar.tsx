import styled from "styled-components";
import Proptypes from "prop-types";
import React, { useMemo } from "react";
import useWindowWidth from "../../hooks/useWindowWidth";
import ToolbarButtons from "../menus-toolbars/ToolbarButtons";
import InvoiceStatus from "./InvoiceStatus";
import {Invoice, Item} from "../../types/types";

const Toolbar = styled.div`
  height: 88px;

  display: contents;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  z-index: 1;

  @media (min-width: 600px) {
    display: flex;
    
    flex-direction: row;
    background-color: ${({ theme }) => theme.background};
    border-radius: 8px;
  }
  
  @media (min-width: 1200px) {
    max-width: 730px;
  }

  box-shadow: 0 10px 10px -10px rgba(72, 84, 159, 0.100397);
`;

const StatusContainer = styled.div`
  display: flex;
  height: 91px;
  width: 100%;
  padding: 10px 20px;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  border-radius: 8px;

  @media (min-width: 600px) {
    background-color: initial;
    justify-content: flex-start;
  }
`;

const StatusText = styled.p`
  margin-right: 1rem;
  color: ${({ theme }) => theme.greyText};
`;

export type InvoiceToolBarProps = {
  invoice: Invoice;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
}


function InvoiceToolbar({
  invoice,
  setEdit,
  setIsModalOpen,
  setItems,
}: InvoiceToolBarProps) {

  const openModal = () => setIsModalOpen(true);

  const invoiceStatus = useMemo(() => {
    if (invoice.status === "paid") {
      return <InvoiceStatus statusType="paid" text="Paid"/>;
    } if (invoice.status === "pending") {
      return <InvoiceStatus statusType="pending" text="Pending"/>;
    } if (invoice.status === "draft") {
      return <InvoiceStatus statusType="draft" text="Draft"/>;
    }
  }, [invoice]);

  const width = useWindowWidth();

  return (
    <Toolbar
      className="invoice-toolbar"
      style={{
        display: width < 600 ? "contents" : "flex"
      }}
    >
      <StatusContainer>
        <StatusText>Status</StatusText>
        {invoiceStatus}
      </StatusContainer>
      <ToolbarButtons
        toggleEditTab={setEdit}
        invoice={invoice}
        openModal={openModal}
        setItems={setItems}
      />
    </Toolbar>
  );
}

export default InvoiceToolbar;

InvoiceToolbar.propTypes = {
  // invoice: Proptypes.object.isRequired,
  setEdit: Proptypes.func.isRequired,
  setIsModalOpen: Proptypes.func.isRequired,
  // setItems: Proptypes.func,
  // isEditOpen: Proptypes.bool.isRequired,
};
