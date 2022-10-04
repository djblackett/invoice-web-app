/* eslint-disable no-unused-vars */
import InvoiceToolbar from "../components/invoice-components/InvoiceToolbar";
import React, { useState, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import data from "../data.json";
import styled from "styled-components";
import FullInvoice from "../components/invoice-components/FullInvoice";
import EditForm from "./EditForm";
import ErrorBoundary from "../components/ErrorBoundary";
import { useSelector } from "react-redux";
import { selectInvoices } from "../features/invoices/invoicesSlice";
import { useEffect } from "react";
import DeleteModal from "../components/DeleteModal";

const ViewContainer = styled.div`
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* max-width: 730px; */
  width: 100%;
  justify-self: center;
  align-self: center;
  margin-top: 104px;
  padding-left: 1.5rem;
  padding-right: 1.5rem;

  /* margin-bottom: 3.25rem; */
  /* position: relative; */

  @media (min-width: 768px) {
    max-width: 730px;
    padding-left: 0;
    padding-right: 0;
  }

  @media (min-width: 1200px) {
    /* width: 730px; */
    margin-top: 4rem;
  }
`;

const GoBackButton = styled.div`
  align-self: flex-start;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  flex-direction: row;
  cursor: pointer;
  margin-bottom: 2rem;
`;

const Icon = styled.p`
  color: ${({ theme }) => theme.outline};
  padding: 0;
  margin: 0;
  font-weight: 900;
`;

const GoBack = styled.p`
  font-weight: bold;
  padding: 0;
  margin: 0;
  margin-left: 1rem;
`;

const arrowLeft = (
  <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.342.886L2.114 5.114l4.228 4.228"
      stroke="#9277FF"
      strokeWidth="2"
      fill="none"
      fillRule="evenodd"
    />
  </svg>
);

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
