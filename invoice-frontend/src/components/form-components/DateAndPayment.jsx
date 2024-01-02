"use strict";
var __makeTemplateObject =
  (this && this.__makeTemplateObject) ||
  function (cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, "raw", { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
  };
Object.defineProperty(exports, "__esModule", { value: true });
var react_datepicker_1 = require("react-datepicker");
var react_1 = require("react");
var styled_components_1 = require("styled-components");
var FormDropDown_1 = require("./FormDropDown");
var FormEntry_1 = require("./FormEntry");
var editStyles_1 = require("../../styles/editStyles");
var CustomDateBox = styled_components_1.default.div(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      [
        "\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  width: 100%;\n  height: 48px;\n  border-radius: 4px;\n  border-color: ",
        ";\n  border-style: solid;\n  padding: 0 20px 0 16px;\n  margin-bottom: 1.5rem;\n  caret-color: #7C5DFA;\n  outline: none;\n  border-width: 1px;\n\n  letter-spacing: -0.25px;\n\n  color: ",
        ";\n  background-color: ",
        ";\n\n  &:focus, &:hover {\n    border-color: ",
        ";\n  }\n\n  .custom-input {\n    padding: 0;\n  }\n  \n  ",
        "\n  \n  ",
      ],
      [
        "\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  width: 100%;\n  height: 48px;\n  border-radius: 4px;\n  border-color: ",
        ";\n  border-style: solid;\n  padding: 0 20px 0 16px;\n  margin-bottom: 1.5rem;\n  caret-color: #7C5DFA;\n  outline: none;\n  border-width: 1px;\n\n  letter-spacing: -0.25px;\n\n  color: ",
        ";\n  background-color: ",
        ";\n\n  &:focus, &:hover {\n    border-color: ",
        ";\n  }\n\n  .custom-input {\n    padding: 0;\n  }\n  \n  ",
        "\n  \n  ",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.formFieldOutline;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.textPlain;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.inputBackgroundColor;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.formFieldOutlineFocus;
  },
  function (props) {
    return (
      props.long &&
      (0, styled_components_1.css)(
        templateObject_1 ||
          (templateObject_1 = __makeTemplateObject(
            ["\n    width: 100%;\n  "],
            ["\n    width: 100%;\n  "],
          )),
      )
    );
  },
);
var DateInput = styled_components_1.default.input(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      [
        "\n  color: ",
        ";\n  font-family: ",
        ";\n  font-style: normal;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  background-color: transparent;\n  outline: none;\n  border: none;\n  touch-action: none;\n  cursor: pointer;\n\n  &:focus, &:hover {\n    border-color: ",
        ";\n  }\n",
      ],
      [
        "\n  color: ",
        ";\n  font-family: ",
        ";\n  font-style: normal;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  background-color: transparent;\n  outline: none;\n  border: none;\n  touch-action: none;\n  cursor: pointer;\n\n  &:focus, &:hover {\n    border-color: ",
        ";\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.dateText;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.font;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.formFieldOutlineFocus;
  },
);
function DateAndPayment(_a) {
  var handleChangeSelectedOption = _a.handleChangeSelectedOption,
    handlePaymentClick = _a.handlePaymentClick,
    onChange = _a.onChange,
    paymentOpen = _a.paymentOpen,
    selectedPaymentOption = _a.selectedPaymentOption,
    selected = _a.selected;
  var dateIcon = (
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 2h-.667V.667A.667.667 0 0012.667 0H12a.667.667 0 00-.667.667V2H4.667V.667A.667.667 0 004 0h-.667a.667.667 0 00-.666.667V2H2C.897 2 0 2.897 0 4v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm.667 12c0 .367-.3.667-.667.667H2A.668.668 0 011.333 14V6.693h13.334V14z"
        fill="#7E88C3"
        fillRule="nonzero"
        opacity=".5"
      />
    </svg>
  );
  // todo - come back and figure out the unstable nested components warning
  // value and onCLick are not passed to component, so removed from forwardRef
  // eslint-disable-next-line react/display-name,react/no-unstable-nested-components
  var ExampleCustomInput = (0, react_1.forwardRef)(function (_a, ref) {
    var value = _a.value,
      onClick = _a.onClick;
    return (
      <CustomDateBox
        className="custom-input"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <DateInput ref={ref} defaultValue={value} readOnly />
        {dateIcon}
      </CustomDateBox>
    );
  });
  return (
    <editStyles_1.DateAndPaymentContainer>
      <FormEntry_1.default isLongOnMobile className="invoice-date">
        <editStyles_1.Label htmlFor="invoiceDate">
          Invoice Date
        </editStyles_1.Label>
        <react_datepicker_1.default
          customInput={<ExampleCustomInput />}
          selected={selected}
          onChange={onChange}
        />
      </FormEntry_1.default>

      <FormEntry_1.default isLongOnMobile className="payment-terms">
        <editStyles_1.Label htmlFor="paymentTerms">
          Payment Terms
        </editStyles_1.Label>

        <FormDropDown_1.default
          isPaymentOpen={paymentOpen}
          handlePaymentClick={handlePaymentClick}
          selectedPaymentOption={selectedPaymentOption}
          handleChangeSelectedOption={handleChangeSelectedOption}
        />
      </FormEntry_1.default>
    </editStyles_1.DateAndPaymentContainer>
  );
}
exports.default = DateAndPayment;
var templateObject_1, templateObject_2, templateObject_3;
