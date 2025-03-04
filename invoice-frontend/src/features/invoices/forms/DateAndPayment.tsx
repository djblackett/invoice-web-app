import { DateAndPaymentContainer } from "@/styles/editPageStyles.ts";
import { DateComponent } from "@/features/invoices/forms/DateComponent.tsx";
import { PaymentTerms } from "@/features/invoices/forms/PaymentTerms.tsx";
import { Invoice } from "@/features/invoices/types/invoiceTypes.ts";

type DateAndPaymentProps = {
  invoice?: Invoice;
};

function DateAndPayment({ invoice }: DateAndPaymentProps) {
  return (
    <DateAndPaymentContainer>
      <DateComponent invoice={invoice} />
      <PaymentTerms invoice={invoice} />
    </DateAndPaymentContainer>
  );
}

export default DateAndPayment;
