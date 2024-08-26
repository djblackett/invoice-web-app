/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {useApolloClient, useQuery} from "@apollo/client";
import InvoiceToolbar from "../components/invoice-components/InvoiceToolbar";
import FullInvoice from "../components/invoice-components/FullInvoice";
import EditForm from "./EditForm";
import DeleteModal from "../components/DeleteModal";
import { arrowLeft, GoBack, GoBackButton, Icon, ViewContainer } from "../styles/ViewInvoiceStyles";
import { ScrollPosition } from "../types/types";
import { GET_INVOICE_BY_ID } from "../graphql/queries";

export type ViewInvoiceProps = {
  scrollPosition: ScrollPosition
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ViewInvoice({ scrollPosition }: ViewInvoiceProps) {
  const { id } = useParams();
  console.log(id);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
  // const invoice = useSelector( (state: ReduxInvoiceState) => selectInvoiceById(state, id)) as Invoice;
  const navigate = useNavigate();
  const apolloClient = useApolloClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [padding, setPadding] = useState("");

  const invoice = useQuery(GET_INVOICE_BY_ID, {
      client: apolloClient,
      variables: {getInvoiceByIdId: id}
  });

  console.log(invoice.data);
  const toggleEditTab = () => {
    setIsEditOpen(!isEditOpen);
  };

  const goBack = () => {
    navigate("/");
    // window.scrollTo(scrollPosition.x, scrollPosition.y);
  };


  if (invoice.loading) {
    return <h2>Loading</h2>;
  }

  if (invoice.error) return <p>Error: {invoice.error.message}</p>;
  if (!invoice.data) return <p>Error:</p>;
  return (
    <ViewContainer>

      <EditForm
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        padding={padding}
        setPadding={setPadding}
        id={id}
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
        id={id}
      />
    </ViewContainer>
  );
}

export default ViewInvoice;


// ViewInvoice.propTypes = {
//   scrollPosition: PropTypes.object,
//   setScrollPosition: PropTypes.func
// };
