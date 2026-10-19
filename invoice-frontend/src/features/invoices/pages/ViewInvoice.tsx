import { Invoice } from "../types/invoiceTypes";
import { Suspense, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InvoiceToolbar from "../components/InvoiceToolbar.tsx";
import {
  arrowLeft,
  GoBack,
  GoBackButton,
  Icon,
  ViewContainer,
} from "../styles/ViewInvoiceStyles.tsx";
import { NewInvoiceProvider } from "../forms/NewInvoiceContextProvider.tsx";
import { useQuery } from "@apollo/client";
import { GET_INVOICE_BY_ID } from "../graphql/invoice.queries.ts";
import React from "react";
import { Button } from "@/features/shared/components/buttons/MarkAsPaidButton.tsx";

import InvoiceContentStatus from "../components/InvoiceContentStatus";

const EditInvoice = React.lazy(() => import("./EditInvoice.tsx"));
const DeleteModal = React.lazy(() => import("../components/DeleteModal.tsx"));
const FullInvoice = React.lazy(() => import("../components/FullInvoice.tsx"));
const RevisionHistoryPanel = React.lazy(
  () => import("@/features/revisions/components/RevisionHistoryPanel.tsx"),
);

function ViewInvoice() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { id } = useParams();

  const { data, loading, error } = useQuery<{ getInvoiceById: Invoice }>(
    GET_INVOICE_BY_ID,
    {
      variables: { getInvoiceById: id },
      fetchPolicy: "cache-and-network",
    },
  );

  const invoice = data?.getInvoiceById as Invoice;

  const goBack = () => {
    void navigate("/invoices");
  };

  if (loading) {
    return (
      <ViewContainer>
        <InvoiceContentStatus />
      </ViewContainer>
    );
  }

  if (error) {
    return (
      <>
        <p
          style={{
            marginTop: "8rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Error: {error.message} <br />
          Invoice may have been deleted <br />
        </p>
        <Button onClick={goBack}>Go back</Button>
      </>
    );
  }

  return (
    <ViewContainer role="main">
      <NewInvoiceProvider>
        <Suspense
          fallback={
            <div
              style={{
                position: "absolute",
                top: "4rem",
                alignSelf: "center",
                justifySelf: "flex-start",
              }}
            >
              Loading...
            </div>
          }
        >
          <EditInvoice invoice={invoice} />
        </Suspense>
        <GoBackButton onClick={goBack}>
          <Icon>{arrowLeft}</Icon>
          <GoBack>Go back</GoBack>
        </GoBackButton>
        <InvoiceToolbar
          invoice={invoice}
          setIsModalOpen={setIsModalOpen}
          setIsHistoryOpen={setIsHistoryOpen}
        />
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
        {isHistoryOpen && invoice?.id && (
          <Suspense fallback={<div>Loading history…</div>}>
            <RevisionHistoryPanel
              invoiceId={invoice.id}
              open={isHistoryOpen}
              onClose={() => setIsHistoryOpen(false)}
            />
          </Suspense>
        )}
      </NewInvoiceProvider>
    </ViewContainer>
  );
}

export default ViewInvoice;
