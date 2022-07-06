import styled from "styled-components";
import Proptypes from "prop-types";
import InvoicePaid from "./InvoicePaid";
import InvoicePending from "./InvoicePending";
import InvoiceDraft from "./InvoiceDraft";
import { useMemo } from "react";

import EditButton from "./buttons/EditButton";
import DeleteButton from "./buttons/DeleteButton";
import MarkAsPaidButton from "./buttons/MarkAsPaidButton";

const Toolbar = styled.div`
  height: 88px;
  background-color: ${({ theme }) => theme.background};
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;

  /* @media (min-width: 1000px) { */
  width: 730px;
  /* } */

  box-shadow: 0px 10px 10px -10px rgba(72, 84, 159, 0.100397);
`;

const StatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusText = styled.p`
  margin-right: 1rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

function InvoiceToolbar({ invoice, setEdit }) {
  const invoiceStatus = useMemo(() => {
    if (invoice.status === "paid") {
      return <InvoicePaid />;
    } else if (invoice.status === "pending") {
      return <InvoicePending />;
    } else if (invoice.status === "draft") {
      return <InvoiceDraft />;
    }
  }, [invoice.status]);

  console.log(typeof setEdit);

  return (
    <Toolbar>
      <StatusContainer>
        <StatusText>Status</StatusText>
        {invoiceStatus}
      </StatusContainer>
      <ButtonsContainer>
        <EditButton toggleEditTab={setEdit} />
        <DeleteButton />
        <MarkAsPaidButton />
      </ButtonsContainer>
    </Toolbar>
  );
}

export default InvoiceToolbar;

InvoiceToolbar.propTypes = {
  invoice: Proptypes.object.isRequired,
  setEdit: Proptypes.func.isRequired,
};
