/* eslint-disable no-unused-vars */
import InvoiceToolbar from "./InvoiceToolbar";
import React, { useState, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import data from "../data.json";
import styled from "styled-components";
import FullInvoice from "./FullInvoice";
import EditForm from "./EditForm";
import ErrorBoundary from "./ErrorBoundary";
import { useSelector } from "react-redux";
import { selectInvoices } from "../features/invoices/invoicesSlice";
import { useEffect } from "react";
import DeleteModal from "./DeleteModal";

const ViewContainer = styled.div`
  
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 730px;
  /* width: 100%; */
  justify-self: center;
  align-self: center;
  margin-top: 104px;

margin-bottom: 3.25rem;

@media (min-width: 1200px) {
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

`

const Icon = styled.p`
  color: ${({theme}) => theme.outline};
  padding: 0;
  margin: 0;
  font-weight: 900;

`

const GoBack = styled.p`
  font-weight: bold;
  padding:0;
  margin: 0;
  margin-left: 1rem;
`



function ViewInvoice() {

  const data = useSelector(selectInvoices);
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(getInvoiceById(id));
  

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [padding, setPadding] = useState("");

  useEffect(() => {
    setInvoice(getInvoiceById(id));
  }, [data, invoice])

  function getInvoiceById(id) {
  return data.find((invoice) => invoice.id === id);
}

  function toggleEditTab() {
    setIsEditOpen(!isEditOpen);
    }

  // console.log(typeof toggleEditTab);

  // useLayoutEffect(() => {
  //   setInvoice(getInvoiceById(id));
  // }, [id]);

  
  return (

//  {!invoice && <h1>Loading</h1>} 
<ViewContainer>
  <ErrorBoundary>
  <EditForm
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          padding={padding}
          setPadding={setPadding}
          invoice={invoice}
        />
        </ErrorBoundary>
  <GoBackButton onClick={() => navigate(-1)}>
    <Icon>{"<"}</Icon>
    <GoBack>Go back</GoBack>
  </GoBackButton>
  <InvoiceToolbar invoice={invoice} setEdit={toggleEditTab} setIsModalOpen={setIsModalOpen} />
  <FullInvoice invoice={invoice} />
  
  <DeleteModal setIsModalOpen={setIsModalOpen} invoice={invoice} isModalOpen={isModalOpen}/>
  </ViewContainer>
  )
}

export default ViewInvoice;
