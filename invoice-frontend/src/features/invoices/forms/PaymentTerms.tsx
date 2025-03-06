import FormEntry from "@/features/invoices/forms/FormEntry.tsx";
import { Label } from "@/styles/editPageStyles.ts";
import PaymentTermsDropdown from "@/features/invoices/forms/PaymentTermsDropdown";
import { Invoice } from "@/features/invoices/types/invoiceTypes.ts";

export function PaymentTerms(props: { invoice: Invoice | undefined }) {
  return (
    <FormEntry isLongOnMobile className="payment-terms">
      <Label htmlFor="paymentTerms">Payment Terms</Label>
      <PaymentTermsDropdown invoice={props.invoice} />
    </FormEntry>
  );
}
