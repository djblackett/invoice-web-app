/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import {DateAndPaymentContainer, Input, Label} from "../../styles/editStyles";
import FormEntry from "./FormEntry";
import DatePicker from "react-datepicker";
import FormDropDown from "./FormDropDown";
import React, {forwardRef} from "react";
import PropTypes from "prop-types";
import styled, {css} from "styled-components";


const CustomDateBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 48px;
  border-radius: 4px;
  border-color: ${({theme}) => theme.formFieldOutline};
  border-style: solid;
  padding: 0 20px 0 16px;
  margin-bottom: 1.5rem;
 
  
  //outline-color: ${({ theme }) => theme.outline};
  caret-color: #7C5DFA;
  outline: none;

  letter-spacing: -0.25px;

  color: ${({theme}) => theme.textPlain};
  background-color: ${({theme}) => theme.inputBackgroundColor};

  &:focus {
    border-color: ${({theme}) => theme.formFieldOutlineFocus};
  }

  .custom-input {
    padding: 0;
  }
  
  ${props => props.long && css`
    width: 100%;
  `}
  `;

const DateInput = styled.input`
  color: ${({theme}) => theme.dateText};
  font-family: ${({theme}) => theme.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  background-color: transparent;
  outline: none;
  border: none;
  touch-action: none;
  cursor: pointer;
  
`


export function DateAndPayment(props) {

    const dateIcon = <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M14 2h-.667V.667A.667.667 0 0012.667 0H12a.667.667 0 00-.667.667V2H4.667V.667A.667.667 0 004 0h-.667a.667.667 0 00-.666.667V2H2C.897 2 0 2.897 0 4v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm.667 12c0 .367-.3.667-.667.667H2A.668.668 0 011.333 14V6.693h13.334V14z" fill="#7E88C3" fillRule="nonzero" opacity=".5"/></svg>


    // todo figure out how to get calendar icon inside the datepicker container
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
      <CustomDateBox
          // style={{ width: props.editPageWidth < 600 ? "100%" : "initial" }}
          className="custom-input"
          onClick={onClick}
          style={{cursor: "pointer"}}>
          <DateInput
              ref={ref}
              defaultValue={value}
              readOnly
          />
          {dateIcon}
      </CustomDateBox>
  ));



    return <DateAndPaymentContainer>
        <FormEntry isLongOnMobile>
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

        <FormEntry isLongOnMobile>
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