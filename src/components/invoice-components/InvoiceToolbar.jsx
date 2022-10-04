import styled from "styled-components";
import Proptypes from "prop-types";
import InvoicePaid from "./InvoicePaid";
import InvoicePending from "./InvoicePending";
import InvoiceDraft from "./InvoiceDraft";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { removeInvoice } from "../../features/invoices/invoicesSlice";
import { useWindowWidth } from "../../hooks/useWindowWidth";

import EditButton from "../buttons/EditButton";
import DeleteButton from "../buttons/DeleteButton";
import MarkAsPaidButton from "../buttons/MarkAsPaidButton";
import ToolbarButtons from "../menus-toolbars/ToolbarButtons";

const Toolbar = styled.div`
  height: 88px;

  display: contents;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  z-index: 1;

  @media (min-width: 768px) {
    display: flex;
    width: 730px;
    flex-direction: row;
    background-color: ${({ theme }) => theme.background};
    border-radius: 8px;
  }

  box-shadow: 0px 10px 10px -10px rgba(72, 84, 159, 0.100397);
`;

const StatusContainer = styled.div`
  display: flex;
  height: 91px;
  width: 100%;
  padding: 10px 20px;
  /* display: contents; */
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  border-radius: 8px;

  @media (min-width: 768px) {
    background-color: initial;
    justify-content: flex-start;
  }
`;

const StatusText = styled.p`
  margin-right: 1rem;
  color: ${({ theme }) => theme.greyText};
`;

function InvoiceToolbar({
  invoice,
  setEdit,
  setIsModalOpen,
  setItems,
  isEditOpen,
}) {
  const [invoiceStatus, setInvoiceStatus] = useState(null);

  const openModal = () => setIsModalOpen(true);

  useEffect(() => {
    if (invoice.status === "paid") {
      setInvoiceStatus(<InvoicePaid />);
    } else if (invoice.status === "pending") {
      setInvoiceStatus(<InvoicePending />);
    } else if (invoice.status === "draft") {
      setInvoiceStatus(<InvoiceDraft />);
    }
  }, [invoice]);

  const dispatch = useDispatch();
  const width = useWindowWidth();

  return (
    <Toolbar
      className="invoice-toolbar"
      style={{
        display: isEditOpen ? "none" : width < 768 ? "contents" : "flex",
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
  invoice: Proptypes.object.isRequired,
  setEdit: Proptypes.func.isRequired,
  setIsModalOpen: Proptypes.func.isRequired,
  setItems: Proptypes.func,
  isEditOpen: Proptypes.bool.isRequired,
};
