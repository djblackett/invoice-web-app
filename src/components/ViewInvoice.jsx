import InvoiceToolbar from "./InvoiceToolbar";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import data from "../data.json";
import styled from "styled-components";
import FullInvoice from "./FullInvoice";
import EditForm from "./EditForm";
import ErrorBoundary from "./ErrorBoundary";


const ViewContainer = styled.div`
  
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 730px;
  justify-self: center;
  align-self: center;

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

`

const Icon = styled.p`
  color: ${({theme}) => theme.outline};
  padding: 0;
  margin: 0;
  font-weight: 900;

`

const GoBack = styled.p`
  font-weight: bold;
  margin-left: 1rem;
`

function getInvoiceById(id) {
  return data.find((invoice) => invoice.id === id);
}

function ViewInvoice() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(getInvoiceById(id));

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [padding, setPadding] = useState(0);

  function toggleEditTab() {
    if (isEditOpen) {
      setIsEditOpen(false);
    } else {
      setIsEditOpen(true);
    }

    console.log("xin meow")
  }

  // console.log(typeof toggleEditTab);

  useEffect(() => {
    setInvoice(getInvoiceById(id));
  }, [id]);

  
  return (

//  {!invoice && <h1>Loading</h1>} 
<ViewContainer>
  <ErrorBoundary>
  <EditForm
          isEditOpen={isEditOpen}
          // handleClose={handleClose}
          padding={padding}
          setPadding={setPadding}
          invoice={invoice}
        />
        </ErrorBoundary>
  <GoBackButton onClick={() => navigate(-1)}>
    <Icon>{"<"}</Icon>
    <GoBack>Go back</GoBack>
  </GoBackButton>
  <InvoiceToolbar invoice={invoice} setEdit={toggleEditTab}/>
  <FullInvoice invoice={invoice} />
  
  </ViewContainer>
  )
}

export default ViewInvoice;
