import InvoiceToolbar from "../components/invoice-components/InvoiceToolbar";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FullInvoice from "../components/invoice-components/FullInvoice";
import EditForm from "./EditForm";

import { useSelector } from "react-redux";
import { selectInvoices, selectInvoiceById } from "../features/invoices/invoicesSlice";
import DeleteModal from "../components/DeleteModal";
import { arrowLeft, GoBack, GoBackButton, Icon, ViewContainer } from "../styles/ViewInvoiceStyles";
import PropTypes from "prop-types";
import AllInvoices from "./AllInvoices";

function ViewInvoice({ scrollPosition }) {
  const data = useSelector(selectInvoices);
  const { id } = useParams();
  const invoice = useSelector( state => selectInvoiceById(state, id));
  const navigate = useNavigate();
  // const [invoice, setInvoice] = useState(getInvoiceById(id));
  // const [invoice, setInvoice] = useState(invoice1);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [padding, setPadding] = useState("");
  const [items, setItems] = useState(invoice.items);
  //
  // useEffect(() => {
  //   setInvoice(invoice1);
  // }, [data, invoice]);

  function getInvoiceById(id) {
    return data.find((invoice) => invoice.id === id);
  }

  function toggleEditTab() {
    setIsEditOpen(!isEditOpen);
  }

  function goBack() {

    navigate(-1);
    // window.scrollTo(scrollPosition.x, scrollPosition.y);
  }

  // todo implement loading state when backend is implemented
  return (
    //  {!invoice && <h1>Loading</h1>}
    <ViewContainer>

      <EditForm
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        padding={padding}
        setPadding={setPadding}
        invoice={invoice}
        items={items}

      />
      <GoBackButton onClick={goBack}>
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


ViewInvoice.propTypes = {
  scrollPosition: PropTypes.object,
  setScrollPosition: PropTypes.func
};