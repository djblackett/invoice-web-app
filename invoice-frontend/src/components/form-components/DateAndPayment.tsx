import DatePicker from "react-datepicker";
import { forwardRef } from "react";
import PaymentTermsDropdown from "./FormDropDown";
import FormEntry from "./FormEntry";
import { DateAndPaymentContainer, Label } from "../../styles/editStyles";
import { CustomDateBox, DateInput } from "../../styles/DateAndPaymentStyles";

type DateAndPaymentProps = {
  onChange: (date: Date) => void;
  selected: Date;
};

const dateIcon = <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M14 2h-.667V.667A.667.667 0 0012.667 0H12a.667.667 0 00-.667.667V2H4.667V.667A.667.667 0 004 0h-.667a.667.667 0 00-.666.667V2H2C.897 2 0 2.897 0 4v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm.667 12c0 .367-.3.667-.667.667H2A.668.668 0 011.333 14V6.693h13.334V14z" fill="#7E88C3" fillRule="nonzero" opacity=".5" /></svg>;

type CustomInputProps = {
  onClick?: () => never;
  value?: never;
};

const ExampleCustomInput = forwardRef(({ value, onClick }: CustomInputProps, ref) => (
  <CustomDateBox
    className="custom-input"
    onClick={onClick}
    style={{ cursor: "pointer" }}>
    <DateInput
      ref={ref}
      defaultValue={value}
      readOnly
    />
    {dateIcon}
  </CustomDateBox>
));


function DateAndPayment({
  onChange,
  selected, // for DatePicker
}: DateAndPaymentProps) {

  return (
    <DateAndPaymentContainer>
      <FormEntry isLongOnMobile className="invoice-date">
        <Label
          htmlFor="invoiceDate"
        >
          Invoice Date
        </Label>
        <DatePicker
          customInput={<ExampleCustomInput />}
          selected={selected}
          onChange={onChange}
        />
      </FormEntry>

      <FormEntry isLongOnMobile className="payment-terms">
        <Label
          htmlFor="paymentTerms"
        >Payment Terms
        </Label>

        <PaymentTermsDropdown />
      </FormEntry>
    </DateAndPaymentContainer>
  );
}

export default DateAndPayment;
