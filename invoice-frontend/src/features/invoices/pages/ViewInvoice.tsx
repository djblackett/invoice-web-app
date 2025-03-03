import { Suspense, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InvoiceToolbar from "../components/InvoiceToolbar.tsx";
import {
  arrowLeft,
  GoBack,
  GoBackButton,
  Icon,
  ViewContainer,
} from "../../../styles/ViewInvoiceStyles.tsx";
import { NewInvoiceProvider } from "../../../components/form-components/NewInvoiceContextProvider.tsx";
import { useQuery } from "@apollo/client";
import { GET_INVOICE_BY_ID } from "../graphql/invoice.queries.ts";
import React from "react";

const EditForm = React.lazy(() => import("./EditForm.tsx"));
const DeleteModal = React.lazy(() => import("../components/DeleteModal.tsx"));
const FullInvoice = React.lazy(
  () => import("../components/FullInvoice.tsx"),
);

function ViewInvoice() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();

  const { data, loading, error } = useQuery(GET_INVOICE_BY_ID, {
    variables: { getInvoiceById: id },
    fetchPolicy: "cache-and-network",
  });

  const invoice = data?.getInvoiceById;

  const goBack = () => {
    navigate("/invoices");
  };

  if (loading) {
    return <h2>Loading</h2>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <ViewContainer role="main">
      <NewInvoiceProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <EditForm invoice={invoice} />
        </Suspense>
        <GoBackButton onClick={goBack}>
          <Icon>{arrowLeft}</Icon>
          <GoBack>Go back</GoBack>
        </GoBackButton>
        <InvoiceToolbar invoice={invoice} setIsModalOpen={setIsModalOpen} />
        <Suspense fallback={<div>Loading...</div>}>
          <FullInvoice invoice={invoice} loading={loading} />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <DeleteModal
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
            invoice={invoice}
          />
        </Suspense>
      </NewInvoiceProvider>
    </ViewContainer>
  );
}

export default ViewInvoice;
