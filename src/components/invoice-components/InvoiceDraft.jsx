import InvoiceStatus from "./InvoiceStatus";

function InvoiceDraft() {
  return (
    <InvoiceStatus
      text={"Draft"}
      textColor={"#373B53"}
      backgroundColor={"rgba(55,	59,	83, 0.1)"}
    />
  );
}

export default InvoiceDraft;
