import { useLayoutEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import NewInvoiceForm from "../components/form-components/NewInvoiceForm";
import "../styles/react-datepicker.css";
import {
  DarkenScreen,
  EditTitle,
  FormContainerDarkenModal,
} from "../styles/editStyles";
import { useResponsive } from "../hooks/useResponsive";
import { useNewInvoiceContext } from "../components/form-components/NewInvoiceContextProvider";

function NewInvoice() {
  const { editPageWidth, padding } = useResponsive();

  const { items, setItems, isNewInvoiceOpen } = useNewInvoiceContext();

  // todo - only necessary for testing local test data without item ids
  // todo - remove later
  useLayoutEffect(() => {
    const newItems = items.map((item) => ({ ...item, id: uuidv4() }));
    setItems(newItems);
  }, []);

  // DarkenScreen appears when newInvoice tab is open
  return (
    <DarkenScreen
      style={{ visibility: isNewInvoiceOpen ? "visible" : "hidden" }}
    >
      <FormContainerDarkenModal
        style={{
          width: isNewInvoiceOpen ? `${editPageWidth}px` : "0px",
          padding,
        }}
        data-testid="newInvoicePage"
      >
        <EditTitle>New Invoice</EditTitle>
        <NewInvoiceForm />
      </FormContainerDarkenModal>
    </DarkenScreen>
  );
}

export default NewInvoice;
