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

  const { isNewInvoiceOpen } = useNewInvoiceContext();

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
