import { useEffect } from "react";
import DatePicker from "react-datepicker";
import PaymentTermsDropdown from "./FormDropDown.tsx";
import FormEntry from "./FormEntry.tsx";
import { DateAndPaymentContainer, Label } from "../../../styles/editPageStyles.ts";
import { Invoice } from "@/types/types.ts";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider.tsx";
import { convertStringToDate } from "@/features/shared/utils/utilityFunctions.ts";
import CustomInputWrapper from "./LazyCustomInputWrapper.tsx";

type DateAndPaymentProps = {
  invoice?: Invoice;
};

// TODO - fix this component and clean it up
export const dateIcon = (
  <svg
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "16px", height: "16px", flexShrink: 0 }}
    preserveAspectRatio="xMidYMid meet"
    className="responsive-svg"
  >
    <path
      d="M14 2h-.667V.667A.667.667 0 0012.667 0H12a.667.667 0 00-.667.667V2H4.667V.667A.667.667 0 004 0h-.667a.667.667 0 00-.666.667V2H2C.897 2 0 2.897 0 4v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm.667 12c0 .367-.3.667-.667.667H2A.668.668 0 011.333 14V6.693h13.334V14z"
      fill="#7E88C3"
      fillRule="nonzero"
      opacity=".5"
    />
  </svg>
);

function DateAndPayment({ invoice }: DateAndPaymentProps) {
  const { startDate, setStartDate } = useNewInvoiceContext();
  // const [startDate, setStartDate] = useState(new Date());

  const handleChange = (date: Date | null) => {
    if (date) {
      setStartDate(date);
    }
  };

  // Optional: Initialize date from invoice if needed

  useEffect(() => {
    if (invoice) {
      const date = convertStringToDate(invoice.createdAt);
      setStartDate(date);
    }
  }, [invoice]);

  return (
    <DateAndPaymentContainer>
      <FormEntry isLongOnMobile className="invoice-date">
        <Label htmlFor="invoiceDate">Invoice Date</Label>
        <DatePicker
          data-testid="visible-date"
          popperProps={{ strategy: "fixed" }}
          fixedHeight={true}
          customInput={<CustomInputWrapper />}
          selected={startDate}
          onChange={handleChange}
        />
      </FormEntry>

      <FormEntry isLongOnMobile className="payment-terms">
        <Label htmlFor="paymentTerms">Payment Terms</Label>
        <PaymentTermsDropdown invoice={invoice} />
      </FormEntry>
    </DateAndPaymentContainer>
  );
}

export default DateAndPayment;
