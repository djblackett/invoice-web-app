import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InvoiceToolbar from "../components/invoice-components/InvoiceToolbar";
import FullInvoice from "../components/invoice-components/FullInvoice";
import EditForm from "./EditForm";
import DeleteModal from "../components/DeleteModal";
import { arrowLeft, GoBack, GoBackButton, Icon, ViewContainer } from "../styles/ViewInvoiceStyles";
import useInvoice from "../hooks/useInvoice";
import { NewInvoiceProvider } from "../components/form-components/NewInvoiceContextProvider";

function ViewInvoice() {
  const { id } = useParams();


  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { invoice, loading, error } = useInvoice();

  const toggleEditTab = () => {
    setIsEditOpen(!isEditOpen);
  };

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
        <EditForm
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          id={id as string}
          invoice={invoice}
        />
        <GoBackButton onClick={goBack}>
          <Icon>{arrowLeft}</Icon>
          <GoBack>Go back</GoBack>
        </GoBackButton>
        <InvoiceToolbar
          invoice={invoice}
          setEdit={toggleEditTab}
          setIsModalOpen={setIsModalOpen}
          isEditOpen={isEditOpen}
        />
        <FullInvoice invoice={invoice} />
        <DeleteModal
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
        />
      </NewInvoiceProvider>
    </ViewContainer>
  );
}

export default ViewInvoice;
