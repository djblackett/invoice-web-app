/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import {DateAndPaymentContainer, Input, Label} from "../../styles/editStyles";
import FormEntry from "./FormEntry";
import DatePicker from "react-datepicker";
import FormDropDown from "./FormDropDown";
import React, {forwardRef} from "react";
import PropTypes from "prop-types";

export function DateAndPayment(props) {


  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
      <Input
          style={{ width: props.editPageWidth < 768 ? "100%" : "initial" }}
          className="custom-input"
          onClick={onClick}
          ref={ref}
          defaultValue={value}
      />
  ));

    return <DateAndPaymentContainer>
        <FormEntry
            isLongOnMobile={props.editPageWidth < 768}
        >
            <Label
                htmlFor="invoiceDate"
            >
                Invoice Date
            </Label>
            <DatePicker

                customInput={<ExampleCustomInput/>}
                selected={props.selected}
                onChange={props.onChange}
                style={{
                    width: "100%",
                }}
            />
        </FormEntry>

        <FormEntry isLongOnMobile={props.editPageWidth < 768}>
            <Label
                htmlFor="paymentTerms"
            >
                Payment Terms
            </Label>

            <FormDropDown
                handlePaymentSelect={props.handlePaymentSelect}
                isPaymentOpen={props.paymentOpen}
                handlePaymentClick={props.handlePaymentClick}
                selectedPaymentOption={props.selectedPaymentOption}
                handleChangeSelectedOption={props.handleChangeSelectedOption}
            />
        </FormEntry>
    </DateAndPaymentContainer>;
}

DateAndPayment.propTypes = {
  editPageWidth: PropTypes.any,
  selected: PropTypes.any,
  onChange: PropTypes.func,
  useFormRegisterReturn: PropTypes.any,
  errors: PropTypes.any,
  handlePaymentSelect: PropTypes.func,
  paymentOpen: PropTypes.bool,
  handlePaymentClick: PropTypes.func,
  selectedPaymentOption: PropTypes.any,
  handleChangeSelectedOption: PropTypes.func
};