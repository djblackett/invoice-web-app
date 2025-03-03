import { CustomDateBox, DateInput } from "@/styles/DateAndPaymentStyles";
import { forwardRef } from "react";
import { dateIcon } from "./DateAndPayment";

export type CustomInputProps = {
  onClick?: () => void;
  value?: string;
  onChange?: (value: string) => void;
};

const DateCustomInput = forwardRef(
  ({ value, onClick }: CustomInputProps, ref) => {
    return (
      <CustomDateBox className="custom-input" onClick={onClick} style={{}}>
        <DateInput
          ref={ref}
          value={value}
          data-testid="invoiceDate"
          id="invoiceDate"
          readOnly
        />
        {dateIcon}
      </CustomDateBox>
    );
  },
);

DateCustomInput.displayName = "CustomDateInput";

export default DateCustomInput;
