import InvoiceStatus from "./InvoiceStatus";

function InvoicePending() {
  return (
    <InvoiceStatus
      text={"Pending"}
      textColor={"#FF8F00"}
      backgroundColor={"rgba(255,	143,	0, 0.1)"}
    />
  );
}

export default InvoicePending;
