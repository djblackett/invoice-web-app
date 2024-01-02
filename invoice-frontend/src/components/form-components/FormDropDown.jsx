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
var react_1 = require("react");
var styled_components_1 = require("styled-components");
var prop_types_1 = require("prop-types");
var NewItemButton_1 = require("../buttons/NewItemButton");
var Main = styled_components_1.default.div.attrs({
  tabIndex: 0,
})(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  display: inline;\n  z-index: 10;\n  position: relative;\n  box-sizing: border-box;\n  background-color: ",
        ";\n  cursor: pointer;\n  margin-bottom: 30px;\n  outline: none;\n\n  width: 100%;\n  height: 48px;\n  border-radius: 4px;\n\n  border: 1px solid ",
        ";\n\n  @media (min-width: 768px) {\n    width: 240px;\n    max-width: 100%;\n  }\n\n  &:focus,\n  &:hover {\n    border: 1px solid ",
        ";\n  }\n",
      ],
      [
        "\n  display: inline;\n  z-index: 10;\n  position: relative;\n  box-sizing: border-box;\n  background-color: ",
        ";\n  cursor: pointer;\n  margin-bottom: 30px;\n  outline: none;\n\n  width: 100%;\n  height: 48px;\n  border-radius: 4px;\n\n  border: 1px solid ",
        ";\n\n  @media (min-width: 768px) {\n    width: 240px;\n    max-width: 100%;\n  }\n\n  &:focus,\n  &:hover {\n    border: 1px solid ",
        ";\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.inputBackgroundColor;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.formFieldOutline;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.formFieldOutlineFocus;
  },
);
var DropDownHeader = styled_components_1.default.div(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      [
        "\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  box-sizing: border-box;\n  padding-left: 20px;\n  padding-top: 17px;\n  padding-bottom: 16px;\n  padding-right: 1.5rem;\n  background-color: transparent;\n  width: 100%;\n  height: 48px;\n  border-radius: 4px;\n  border-color: ",
        ';\n\n  h2 {\n    writing-mode: horizontal-tb !important;\n    text-rendering: auto;\n    word-spacing: normal;\n    text-transform: none;\n    text-indent: 0;\n    text-shadow: none;\n    display: inline-block;\n    text-align: start;\n    appearance: auto;\n    -webkit-rtl-ordering: logical;\n    cursor: text;\n    padding: 1px 2px;\n    font-family: "League Spartan", sans-serif;\n    font-style: normal;\n    font-weight: 700;\n    font-size: 12px;\n    line-height: 15px;\n    /* identical to box height, or 125% */\n    letter-spacing: -0.25px;\n    margin: 0;\n    transform: translateY(-2px);\n  }\n',
      ],
      [
        "\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  box-sizing: border-box;\n  padding-left: 20px;\n  padding-top: 17px;\n  padding-bottom: 16px;\n  padding-right: 1.5rem;\n  background-color: transparent;\n  width: 100%;\n  height: 48px;\n  border-radius: 4px;\n  border-color: ",
        ';\n\n  h2 {\n    writing-mode: horizontal-tb !important;\n    text-rendering: auto;\n    word-spacing: normal;\n    text-transform: none;\n    text-indent: 0;\n    text-shadow: none;\n    display: inline-block;\n    text-align: start;\n    appearance: auto;\n    -webkit-rtl-ordering: logical;\n    cursor: text;\n    padding: 1px 2px;\n    font-family: "League Spartan", sans-serif;\n    font-style: normal;\n    font-weight: 700;\n    font-size: 12px;\n    line-height: 15px;\n    /* identical to box height, or 125% */\n    letter-spacing: -0.25px;\n    margin: 0;\n    transform: translateY(-2px);\n  }\n',
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.formFieldOutline;
  },
);
var DropDownList = styled_components_1.default.ul(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      [
        "\n  position: absolute;\n  width: 100%;\n  z-index: 100;\n  padding: 0;\n  margin: 0;\n  overflow: hidden;\n  background-color: ",
        ";\n  box-sizing: border-box;\n  height: fit-content;\n  border-radius: 4px;\n  color: ",
        ";\n  font-size: 1.2rem;\n  font-weight: 600;\n  box-shadow: ",
        ";\n  transition: height 250ms ease-in-out;\n\n  &:first-child {\n    padding-top: 0.8em;\n  }\n\n  &:last-child {\n    border: none;\n  }\n",
      ],
      [
        "\n  position: absolute;\n  width: 100%;\n  z-index: 100;\n  padding: 0;\n  margin: 0;\n  overflow: hidden;\n  background-color: ",
        ";\n  box-sizing: border-box;\n  height: fit-content;\n  border-radius: 4px;\n  color: ",
        ";\n  font-size: 1.2rem;\n  font-weight: 600;\n  box-shadow: ",
        ";\n  transition: height 250ms ease-in-out;\n\n  &:first-child {\n    padding-top: 0.8em;\n  }\n\n  &:last-child {\n    border: none;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.paymentTermsBackground;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.text;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.filterShadow;
  },
);
var ListItem = styled_components_1.default.li(
  templateObject_4 ||
    (templateObject_4 = __makeTemplateObject(
      [
        "\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n\n  list-style: none;\n  height: 48px;\n  width: 100%;\n  border-color: ",
        ";\n  cursor: pointer;\n  border-bottom: 1px solid ",
        ";\n  //border-bottom: 1px solid #979797;\n",
      ],
      [
        "\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n\n  list-style: none;\n  height: 48px;\n  width: 100%;\n  border-color: ",
        ";\n  cursor: pointer;\n  border-bottom: 1px solid ",
        ";\n  //border-bottom: 1px solid #979797;\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.formFieldOutline;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.paymentOptionBorder;
  },
);
var ItemButton = styled_components_1.default.button(
  templateObject_5 ||
    (templateObject_5 = __makeTemplateObject(
      [
        "\n  //position: absolute;\n  height: 100%;\n  width: 100%;\n  background-color: ",
        ";\n  border: none;\n  cursor: pointer;\n  outline: none;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: ",
        ";\n  padding: 0.5rem;\n  \n  &:first-child {\n    //padding-top: 0.8em;\n  }\n\n  &:last-child {\n    border: none;\n  }\n\n  &:hover {\n    color: #7c5dfa;\n  }\n",
      ],
      [
        "\n  //position: absolute;\n  height: 100%;\n  width: 100%;\n  background-color: ",
        ";\n  border: none;\n  cursor: pointer;\n  outline: none;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: ",
        ";\n  padding: 0.5rem;\n  \n  &:first-child {\n    //padding-top: 0.8em;\n  }\n\n  &:last-child {\n    border: none;\n  }\n\n  &:hover {\n    color: #7c5dfa;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.paymentTermsBackground;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.textPlain;
  },
);
var options = ["Net 1 Day", "Net 7 Days", "Net 14 Days", "Net 30 Days"];
var arrowDown = (
  <svg width="11" height="7" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 1l4.228 4.228L9.456 1"
      stroke="#7C5DFA"
      strokeWidth="2"
      fill="none"
      fillRule="evenodd"
    />
  </svg>
);
function FormDropDown(_a) {
  var selectedPaymentOption = _a.selectedPaymentOption,
    handleChangeSelectedOption = _a.handleChangeSelectedOption,
    isPaymentOpen = _a.isPaymentOpen,
    handlePaymentClick = _a.handlePaymentClick;
  // const { id } = useParams();
  // const invoice = useSelector(state => selectInvoiceById(state, id));
  // const selectedPaymentOption = invoice?.paymentTerms || 1;
  var _b = (0, react_1.useState)("Net 1 Day"),
    selected = _b[0],
    setSelected = _b[1];
  var onOptionClicked = function (option) {
    return function (e) {
      e.preventDefault();
      handlePaymentClick();
      var num = Number(option.split(" ")[1]);
      handleChangeSelectedOption(num);
    };
  };
  (0, react_1.useEffect)(
    function () {
      if (selectedPaymentOption === 1) {
        setSelected("Net 1 Day");
      } else if (String(selectedPaymentOption).match(/\d+/)) {
        setSelected("Net ".concat(selectedPaymentOption, " Days"));
      }
    },
    [selectedPaymentOption],
  );
  return (
    <Main>
      <DropDownHeader onClick={handlePaymentClick} tabIndex={-1}>
        <h2>{selected}</h2>
        <NewItemButton_1.SVG>{arrowDown}</NewItemButton_1.SVG>
      </DropDownHeader>

      <DropDownList
        style={{ height: isPaymentOpen ? "192px" : 0 }}
        data-testid="dropDownList"
      >
        {options.map(function (option) {
          return (
            <ListItem
              key={"".concat(option, "-li")}
              onClick={onOptionClicked(option)}
              data-testid={"".concat(option, "-testID")}
            >
              <ItemButton key={"".concat(option, "-button")} type="button">
                {options.find(function (term) {
                  return term.includes(String(option));
                })}
              </ItemButton>
            </ListItem>
          );
        })}
      </DropDownList>
    </Main>
  );
}
exports.default = FormDropDown;
FormDropDown.propTypes = {
  isPaymentOpen: prop_types_1.default.bool.isRequired,
  handlePaymentClick: prop_types_1.default.func.isRequired,
  selectedPaymentOption: prop_types_1.default.number.isRequired,
  handleChangeSelectedOption: prop_types_1.default.func.isRequired,
};
var templateObject_1,
  templateObject_2,
  templateObject_3,
  templateObject_4,
  templateObject_5;
