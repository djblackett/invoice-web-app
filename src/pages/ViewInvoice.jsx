import InvoiceToolbar from "../components/invoice-components/InvoiceToolbar";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import FullInvoice from "../components/invoice-components/FullInvoice";
import EditForm from "./EditForm";

import {useSelector} from "react-redux";
import {selectInvoices} from "../features/invoices/invoicesSlice";
import DeleteModal from "../components/DeleteModal";
import {arrowLeft, GoBack, GoBackButton, Icon, ViewContainer} from "../styles/ViewInvoiceStyles";

function ViewInvoice() {
  const data = useSelector(selectInvoices);
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(getInvoiceById(id));

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [padding, setPadding] = useState("");
  const [items, setItems] = useState(invoice.items);

  useEffect(() => {
    setInvoice(getInvoiceById(id));
  }, [data, invoice]);

  function getInvoiceById(id) {
    return data.find((invoice) => invoice.id === id);
  }

  function toggleEditTab() {
    setIsEditOpen(!isEditOpen);
  }

  return (
    //  {!invoice && <h1>Loading</h1>}
    <ViewContainer>
      {/* <ErrorBoundary> */}
      <EditForm
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        padding={padding}
        setPadding={setPadding}
        invoice={invoice}
        items={items}

      />
      {/* </ErrorBoundary> */}
      <GoBackButton onClick={() => navigate(-1)}>
        <Icon>{arrowLeft}</Icon>
        <GoBack>Go back</GoBack>
      </GoBackButton>
      <InvoiceToolbar
        invoice={invoice}
        setEdit={toggleEditTab}
        setIsModalOpen={setIsModalOpen}
        setItems={setItems}
        isEditOpen={isEditOpen}
      />
      <FullInvoice invoice={invoice} />

      <DeleteModal
        setIsModalOpen={setIsModalOpen}
        invoice={invoice}
        isModalOpen={isModalOpen}
      />
    </ViewContainer>
  );
}

export default ViewInvoice;
