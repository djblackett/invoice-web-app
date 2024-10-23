import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApolloClient, useQuery } from "@apollo/client";
import InvoiceToolbar from "../components/invoice-components/InvoiceToolbar";
import FullInvoice from "../components/invoice-components/FullInvoice";
import EditForm from "./EditForm";
import DeleteModal from "../components/DeleteModal";
import { arrowLeft, GoBack, GoBackButton, Icon, ViewContainer } from "../styles/ViewInvoiceStyles";
import { GET_INVOICE_BY_ID } from "../graphql/queries";

function ViewInvoice() {
  const { id } = useParams();
  console.log(id);

  const navigate = useNavigate();
  const apolloClient = useApolloClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const invoice = useQuery(GET_INVOICE_BY_ID, {
    client: apolloClient,
    variables: { getInvoiceByIdId: id }
  });

  console.log(invoice.data);
  const toggleEditTab = () => {
    setIsEditOpen(!isEditOpen);
  };

  const goBack = () => {
    navigate("/");
  };

  if (invoice.loading) {
    return <h2>Loading</h2>;
  }

  if (invoice.error) return <p>Error: {invoice.error.message}</p>;

  return (
    <ViewContainer>
      <EditForm
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        id={id as string}
        invoice={invoice.data.getInvoiceById}
      />
      <GoBackButton onClick={goBack}>
        <Icon>{arrowLeft}</Icon>
        <GoBack>Go back</GoBack>
      </GoBackButton>
      <InvoiceToolbar
        invoice={invoice?.data.getInvoiceById}
        setEdit={toggleEditTab}
        setIsModalOpen={setIsModalOpen}
        isEditOpen={isEditOpen}
      />
      <FullInvoice invoice={invoice.data.getInvoiceById} />
      <DeleteModal
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        id={id as string}
      />
    </ViewContainer>
  );
}

export default ViewInvoice;
