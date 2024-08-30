/* eslint-disable @typescript-eslint/no-unsafe-return */
import DatePicker from "react-datepicker";
import React, { forwardRef } from "react";
import styled, { css } from "styled-components";
import FormDropDown from "./FormDropDown";
import FormEntry from "./FormEntry";
import { DateAndPaymentContainer, Label } from "../../styles/editStyles";

interface DateBox {
  className?: string;
  long?: boolean;
}

const CustomDateBox = styled.div<DateBox>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 48px;
  border-radius: 4px;
  border-color: ${({ theme }) => theme.formFieldOutline};
  border-style: solid;
  padding: 0 20px 0 16px;
  margin-bottom: 1.5rem;
  caret-color: #7C5DFA;
  outline: none;
  border-width: 1px;

  letter-spacing: -0.25px;

  color: ${({ theme }) => theme.textPlain};
  background-color: ${({ theme }) => theme.inputBackgroundColor};

  &:focus, &:hover {
    border-color: ${({ theme }) => theme.formFieldOutlineFocus};
  }

  .custom-input {
    padding: 0;
  }

  ${props => props.long && css`
    width: 100%;
  `}

  `;

interface DateInputProps {
  className?: string,
  ref: React.ForwardedRef<unknown>
}

const DateInput = styled.input<DateInputProps>`
  color: ${({ theme }) => theme.dateText};
  font-family: ${({ theme }) => theme.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  background-color: transparent;
  outline: none;
  border: none;
  touch-action: none;
  cursor: pointer;

  &:focus, &:hover {
    border-color: ${({ theme }) => theme.formFieldOutlineFocus};
  }
`;

type DateAndPaymentProps = {
  handleChangeSelectedOption: (option: number) => void;
  handlePaymentClick: () => void;
  onChange: (date: Date) => void;
  paymentOpen: boolean;
  // handlePaymentSelect: (e: SyntheticEvent) => void,
  selected: Date;
  selectedPaymentOption: number;
  // setIsPaymentOpen: React.Dispatch<React.SetStateAction<boolean>>
};

function DateAndPayment({
  handleChangeSelectedOption,
  handlePaymentClick,
  onChange,
  paymentOpen,
  selectedPaymentOption,
  selected, // for DatePicker
}: DateAndPaymentProps) {

  const dateIcon = <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M14 2h-.667V.667A.667.667 0 0012.667 0H12a.667.667 0 00-.667.667V2H4.667V.667A.667.667 0 004 0h-.667a.667.667 0 00-.666.667V2H2C.897 2 0 2.897 0 4v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm.667 12c0 .367-.3.667-.667.667H2A.668.668 0 011.333 14V6.693h13.334V14z" fill="#7E88C3" fillRule="nonzero" opacity=".5" /></svg>;

  type CustomInputProps = {
    onClick?: () => never;
    value?: never;
  };

  // todo - come back and figure out the unstable nested components warning
  // value and onCLick are not passed to component, so removed from forwardRef
  // eslint-disable-next-line react/display-name,react/no-unstable-nested-components
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
        // todo - make sure this CSS is applied in some other way
        // style={{
        //   width: "100%",
        // }}
        />
      </FormEntry>

      <FormEntry isLongOnMobile className="payment-terms">
        <Label
          htmlFor="paymentTerms"
        >Payment Terms
        </Label>

        <FormDropDown
          isPaymentOpen={paymentOpen}
          handlePaymentClick={handlePaymentClick}
          selectedPaymentOption={selectedPaymentOption}
          handleChangeSelectedOption={handleChangeSelectedOption}
        />
      </FormEntry>
    </DateAndPaymentContainer>
  );
}

export default DateAndPayment;
