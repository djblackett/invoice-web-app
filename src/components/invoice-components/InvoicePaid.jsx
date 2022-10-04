import InvoiceStatus from "./InvoiceStatus";

function InvoicePaid() {
  return (
    <InvoiceStatus
      text={"Paid"}
      textColor={"#33d69f"}
      backgroundColor={"rgba(173, 216, 230, 0.1)"}
    />
  );
}

export default InvoicePaid;
