import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InvoiceToolbar from "../components/invoice-components/InvoiceToolbar";
import FullInvoice from "../components/invoice-components/FullInvoice";
import EditForm from "./EditForm";
import DeleteModal from "../components/DeleteModal";
import {
  arrowLeft,
  GoBack,
  GoBackButton,
  Icon,
  ViewContainer,
} from "../styles/ViewInvoiceStyles";
import { NewInvoiceProvider } from "../components/form-components/NewInvoiceContextProvider";
import { useQuery } from "@apollo/client";
import { GET_INVOICE_BY_ID } from "../graphql/queries";

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
    navigate("/");
  };

  if (loading) {
    return <h2>Loading</h2>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <ViewContainer>
      <NewInvoiceProvider>
        <EditForm invoice={invoice} />
        <GoBackButton onClick={goBack}>
          <Icon>{arrowLeft}</Icon>
          <GoBack>Go back</GoBack>
        </GoBackButton>
        <InvoiceToolbar invoice={invoice} setIsModalOpen={setIsModalOpen} />
        <FullInvoice invoice={invoice} loading={loading} />
        <DeleteModal
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          invoice={invoice}
        />
      </NewInvoiceProvider>
    </ViewContainer>
  );
}

export default ViewInvoice;
