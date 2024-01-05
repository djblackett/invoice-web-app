import React, { useState } from "react";
import {useApolloClient, useQuery} from "@apollo/client";
import { useRouter } from "next/navigation";
import InvoiceToolbar from "../components/invoice-components/InvoiceToolbar";
import FullInvoice from "../components/invoice-components/FullInvoice";
import EditForm from "@/old_pages/EditForm";
import DeleteModal from "../components/DeleteModal";
import {
  arrowLeft,
} from "@/styles/ViewInvoiceStyles";
import { GET_INVOICE_BY_ID } from "@/graphql/queries";
import styles from "../styles/viewInvoice.module.css";

function ViewInvoice({id}: {id: string}) {

  // const invoice = useSelector( (state: ReduxInvoiceState) => selectInvoiceById(state, id)) as Invoice;
  const router = useRouter();
  const apolloClient = useApolloClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [padding, setPadding] = useState("");

  const invoice = useQuery(GET_INVOICE_BY_ID, {
      client: apolloClient,
      variables: {id: id}
  });

  // todo - remove following line after fully replacing redux with graphql
  // const selectInvoice = useSelector((state: ReduxInvoiceState) => selectInvoiceById(state, id))

  const toggleEditTab = () => {
    setIsEditOpen(!isEditOpen);
  };

  const goBack = () => {
    router.push("/");
    // window.scrollTo(scrollPosition.x, scrollPosition.y);
  };

  if (invoice.loading) {
    return <h2>Loading</h2>;
  }

  if (invoice.data) {
      return (
          <div className={styles.viewContainer}>
              <EditForm
                  isEditOpen={isEditOpen}
                  setIsEditOpen={setIsEditOpen}
                  padding={padding}
                  setPadding={setPadding}
                  id={id}
                  invoice={invoice.data.getInvoiceById}
              />
              <div className={styles.goBackButton} onClick={goBack}>
                  <p className={styles.icon}>{arrowLeft}</p>
                  <p className={styles.goBack}>Go back</p>
              </div>
              <InvoiceToolbar
                  invoice={invoice.data.getInvoiceById}
                  setEdit={toggleEditTab}
                  setIsModalOpen={setIsModalOpen}
                  isEditOpen={isEditOpen}
              />
              <FullInvoice invoice={invoice.data.getInvoiceById}/>
              <DeleteModal
                  setIsModalOpen={setIsModalOpen}
                  isModalOpen={isModalOpen}
                  id={id}
              />
          </div>
      );
  }

  if (invoice.error) {
      return invoice.error.message
  }
}

export default ViewInvoice;

// ViewInvoice.propTypes = {
//   scrollPosition: PropTypes.object,
//   setScrollPosition: PropTypes.func
// };
