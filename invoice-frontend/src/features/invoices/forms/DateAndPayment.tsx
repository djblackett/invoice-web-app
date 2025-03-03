import {DateAndPaymentContainer} from "@/styles/editPageStyles.ts";
import {Invoice} from "@/types/types.ts";
import {DateComponent} from "@/features/invoices/forms/DateComponent.tsx";
import {PaymentTerms} from "@/features/invoices/forms/PaymentTerms.tsx";

type DateAndPaymentProps = {
  invoice?: Invoice;
};

function DateAndPayment({ invoice }: DateAndPaymentProps) {
  return (
    <DateAndPaymentContainer>
      <DateComponent selected={startDate} onChange={handleChange}/>
      <PaymentTerms invoice={invoice}/>
    </DateAndPaymentContainer>
  );
}

export default DateAndPayment;
