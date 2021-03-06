import styled from "styled-components";
import Proptypes from "prop-types";
import InvoicePaid from "./InvoicePaid";
import InvoicePending from "./InvoicePending";
import InvoiceDraft from "./InvoiceDraft";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { removeInvoice } from "../features/invoices/invoicesSlice";

import EditButton from "./buttons/EditButton";
import DeleteButton from "./buttons/DeleteButton";
import MarkAsPaidButton from "./buttons/MarkAsPaidButton";
import ToolbarButtons from "./ToolbarButtons";

const Toolbar = styled.div`
  height: 88px;
  background-color: ${({ theme }) => theme.background};
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  width: 100%;

  @media (min-width: 768px) {
    width: 730px;
  }

  box-shadow: 0px 10px 10px -10px rgba(72, 84, 159, 0.100397);
`;

const StatusContainer = styled.div`
  display: contents;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const StatusText = styled.p`
  margin-right: 1rem;
  color: ${({ theme }) => theme.greyText};
`;

function InvoiceToolbar({ invoice, setEdit, setIsModalOpen }) {
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

  return (
    <Toolbar>
      <StatusContainer>
        <StatusText>Status</StatusText>
        {invoiceStatus}
      </StatusContainer>
      <ToolbarButtons
        toggleEditTab={setEdit}
        invoice={invoice}
        openModal={openModal}
      />
    </Toolbar>
  );
}

export default InvoiceToolbar;

InvoiceToolbar.propTypes = {
  invoice: Proptypes.object.isRequired,
  setEdit: Proptypes.func.isRequired,
  setIsModalOpen: Proptypes.func.isRequired,
};
