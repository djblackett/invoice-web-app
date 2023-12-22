"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateAndPaymentContainer = exports.ErrorTextInline = exports.ErrorText = exports.ErrorList = exports.DarkenScreen = exports.Label = exports.CountryInput = exports.AddressDetailInput = exports.StreetAddressInput = exports.Input = exports.BillText = exports.FormContainerDarkenModal = exports.EditTitle = void 0;
var styled_components_1 = require("styled-components");
exports.EditTitle = styled_components_1.default.h1(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  font-size: 1.5rem;\n  color: ", ";\n"], ["\n  font-size: 1.5rem;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.text;
});
exports.FormContainerDarkenModal = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  height: 100%;\n  top: 72px;\n  bottom: 91px;\n  left: 0;\n  width: 100%;\n  background-color: ", ";\n  position: fixed;\n  display: flex;\n  flex-direction: column;\n  transition-property: all;\n  transition-duration: 250ms;\n  transition-timing-function: ease-in-out;\n  overflow-x: hidden;\n  filter: drop-shadow(2px 2px 2px bottom);\n  align-self: flex-start;\n  z-index: 50;\n  max-width: 100%;\n\n  @media (min-width: 768px) {\n    padding-left: 5rem;\n    padding-right: 2rem;\n    padding-top: 1rem;\n    padding-bottom: 2rem;\n    max-width: 700px;\n    right: 616px;\n    max-height: calc(100vh - 72px);\n  }\n\n  @media (min-width: 1200px) {\n    left: 90px;\n    padding-left: 5rem;\n    top: 0;\n    max-height: initial;\n  }\n"], ["\n  height: 100%;\n  top: 72px;\n  bottom: 91px;\n  left: 0;\n  width: 100%;\n  background-color: ", ";\n  position: fixed;\n  display: flex;\n  flex-direction: column;\n  transition-property: all;\n  transition-duration: 250ms;\n  transition-timing-function: ease-in-out;\n  overflow-x: hidden;\n  filter: drop-shadow(2px 2px 2px bottom);\n  align-self: flex-start;\n  z-index: 50;\n  max-width: 100%;\n\n  @media (min-width: 768px) {\n    padding-left: 5rem;\n    padding-right: 2rem;\n    padding-top: 1rem;\n    padding-bottom: 2rem;\n    max-width: 700px;\n    right: 616px;\n    max-height: calc(100vh - 72px);\n  }\n\n  @media (min-width: 1200px) {\n    left: 90px;\n    padding-left: 5rem;\n    top: 0;\n    max-height: initial;\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.formBackground;
});
exports.BillText = styled_components_1.default.p(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: ", ";\n  font-weight: bold;\n  font-size: 0.75rem;\n  margin-bottom: 1.5rem;\n"], ["\n  color: ", ";\n  font-weight: bold;\n  font-size: 0.75rem;\n  margin-bottom: 1.5rem;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.outline;
});
exports.Input = styled_components_1.default.input(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  cursor: pointer;\n  width: 100%;\n  height: 48px;\n  border-radius: 4px;\n  border: 1px solid ", ";\n  padding: 17px 20px 16px 20px;\n  margin-bottom: 1.5rem;\n  font-family: ", ";\n  font-style: normal;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  caret-color: #7C5DFA;\n  outline: none;\n\n  letter-spacing: -0.25px;\n\n  color: ", ";\n  background-color: ", ";\n\n  &:focus, &:hover {\n    border-color: ", ";\n  }\n\n  .custom-input {\n    padding: 0;\n  }\n  \n  ", "\n"], ["\n  cursor: pointer;\n  width: 100%;\n  height: 48px;\n  border-radius: 4px;\n  border: 1px solid ", ";\n  padding: 17px 20px 16px 20px;\n  margin-bottom: 1.5rem;\n  font-family: ", ";\n  font-style: normal;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  caret-color: #7C5DFA;\n  outline: none;\n\n  letter-spacing: -0.25px;\n\n  color: ", ";\n  background-color: ", ";\n\n  &:focus, &:hover {\n    border-color: ", ";\n  }\n\n  .custom-input {\n    padding: 0;\n  }\n  \n  ", "\n"])), function (_a) {
    var theme = _a.theme;
    return theme.formFieldOutline;
}, function (_a) {
    var theme = _a.theme;
    return theme.font;
}, function (_a) {
    var theme = _a.theme;
    return theme.textPlain;
}, function (_a) {
    var theme = _a.theme;
    return theme.inputBackgroundColor;
}, function (_a) {
    var theme = _a.theme;
    return theme.formFieldOutlineFocus;
}, function (props) { return props.$long && (0, styled_components_1.css)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    width: 100%;\n  "], ["\n    width: 100%;\n  "]))); });
exports.StreetAddressInput = (0, styled_components_1.default)(exports.Input)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  width: 100%;\n  $long: false;\n  @media (min-width: 768px) {\n    width: 100%;\n  }\n"], ["\n  width: 100%;\n  $long: false;\n  @media (min-width: 768px) {\n    width: 100%;\n  }\n"])));
exports.AddressDetailInput = (0, styled_components_1.default)(exports.Input)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  width: 100%;\n  \n  @media (min-width: 768px) {\n    max-width: 152px;\n  }\n"], ["\n  width: 100%;\n  \n  @media (min-width: 768px) {\n    max-width: 152px;\n  }\n"])));
exports.CountryInput = (0, styled_components_1.default)(exports.Input)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  width: max-content;\n \n\n  @media (min-width: 768px) {\n    width: 152px;\n    min-width: revert;\n  }\n"], ["\n  width: max-content;\n \n\n  @media (min-width: 768px) {\n    width: 152px;\n    min-width: revert;\n  }\n"])));
exports.Label = styled_components_1.default.label(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  color: ", ";\n  margin-bottom: 0.5rem;\n  font-size: 0.75rem;\n"], ["\n  color: ", ";\n  margin-bottom: 0.5rem;\n  font-size: 0.75rem;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.greyText;
});
exports.DarkenScreen = styled_components_1.default.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(0, 0, 0, 0.5);\n  transition: all 250ms ease-in-out;\n  z-index: 100;\n"], ["\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(0, 0, 0, 0.5);\n  transition: all 250ms ease-in-out;\n  z-index: 100;\n"])));
exports.ErrorList = styled_components_1.default.ul(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  //transition: height 300ms ease-in-out; // nice idea but complicated to implement\n\n  &:first-of-type {\n    margin-top: 2rem;\n  }\n\n  &:last-of-type {\n    margin-bottom: 2.8rem;\n  }\n\n"], ["\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  //transition: height 300ms ease-in-out; // nice idea but complicated to implement\n\n  &:first-of-type {\n    margin-top: 2rem;\n  }\n\n  &:last-of-type {\n    margin-bottom: 2.8rem;\n  }\n\n"])));
exports.ErrorText = styled_components_1.default.li(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  color: #EC5757;\n  margin: 0;\n  padding: 0;\n"], ["\n  color: #EC5757;\n  margin: 0;\n  padding: 0;\n"])));
exports.ErrorTextInline = styled_components_1.default.p(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  color: #EC5757;\n  margin: 0;\n  padding: 0;\n  position: absolute;\n  right: 1.5rem;\n"], ["\n  color: #EC5757;\n  margin: 0;\n  padding: 0;\n  position: absolute;\n  right: 1.5rem;\n"])));
exports.DateAndPaymentContainer = styled_components_1.default.div(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  max-width: 100%;\n  flex-wrap: wrap;\n  flex-direction: column;\n  z-index: 60;\n  \n  @media (min-width: 768px) {\n    display: flex;\n    justify-content: space-between;\n    flex-direction: row;\n    width: 100%;\n    max-width: initial;\n    flex-wrap: nowrap;\n  }\n\n  // section targets the react-date-picker component to apply theming \n  .react-datepicker__header {\n    background-color: ", ";\n    color: ", ";\n    border: none;\n    padding-top: 1.5rem;\n    padding-bottom: 1.5rem;\n  }\n\n  .react-datepicker__day, .react-datepicker__month-text, .react-datepicker__quarter-text, .react-datepicker__year-text {\n    color: ", ";\n  }\n  \n  .react-datepicker__day {\n    &:hover {\n      background: #7C5DFA;\n      color: white;\n    }\n  }\n\n  .react-datepicker {\n    background-color: ", ";\n    color: ", ";\n    border: none;\n    box-shadow: ", ";\n    transition: all 250ms ease-in-out;\n  }\n  \n  .react-datepicker__month-year-dropdown {\n    background-color: ", ";\n    color: ", ";\n    border: none;\n  }\n\n  .react-datepicker__day--selected {\n    color: #7C5DFA;\n    background-color: transparent;\n    font-weight: bold;\n  }\n\n  .react-datepicker__day-names {\n    display: none;\n  }\n\n  .react-datepicker__triangle {\n    display: none;\n  }\n\n  .react-datepicker__current-month {\n    color: ", ";\n    align-self: center;\n    justify-self: center;\n    font-family: 'Spartan',sans-serif;\n    font-style: normal;\n    font-weight: 700;\n    font-size: 12px;\n    line-height: 15px;\n    /* identical to box height, or 125% */\n    letter-spacing: -0.25px;\n    text-align: center;\n  }\n  \n  .react-datepicker__day--keyboard-selected {\n    background-color: rgba(124, 93, 250, 0.5);\n  }\n"], ["\n  display: flex;\n  justify-content: space-between;\n  max-width: 100%;\n  flex-wrap: wrap;\n  flex-direction: column;\n  z-index: 60;\n  \n  @media (min-width: 768px) {\n    display: flex;\n    justify-content: space-between;\n    flex-direction: row;\n    width: 100%;\n    max-width: initial;\n    flex-wrap: nowrap;\n  }\n\n  // section targets the react-date-picker component to apply theming \n  .react-datepicker__header {\n    background-color: ", ";\n    color: ", ";\n    border: none;\n    padding-top: 1.5rem;\n    padding-bottom: 1.5rem;\n  }\n\n  .react-datepicker__day, .react-datepicker__month-text, .react-datepicker__quarter-text, .react-datepicker__year-text {\n    color: ", ";\n  }\n  \n  .react-datepicker__day {\n    &:hover {\n      background: #7C5DFA;\n      color: white;\n    }\n  }\n\n  .react-datepicker {\n    background-color: ", ";\n    color: ", ";\n    border: none;\n    box-shadow: ", ";\n    transition: all 250ms ease-in-out;\n  }\n  \n  .react-datepicker__month-year-dropdown {\n    background-color: ", ";\n    color: ", ";\n    border: none;\n  }\n\n  .react-datepicker__day--selected {\n    color: #7C5DFA;\n    background-color: transparent;\n    font-weight: bold;\n  }\n\n  .react-datepicker__day-names {\n    display: none;\n  }\n\n  .react-datepicker__triangle {\n    display: none;\n  }\n\n  .react-datepicker__current-month {\n    color: ", ";\n    align-self: center;\n    justify-self: center;\n    font-family: 'Spartan',sans-serif;\n    font-style: normal;\n    font-weight: 700;\n    font-size: 12px;\n    line-height: 15px;\n    /* identical to box height, or 125% */\n    letter-spacing: -0.25px;\n    text-align: center;\n  }\n  \n  .react-datepicker__day--keyboard-selected {\n    background-color: rgba(124, 93, 250, 0.5);\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.background;
}, function (_a) {
    var theme = _a.theme;
    return theme.dateText;
}, function (_a) {
    var theme = _a.theme;
    return theme.dateText;
}, function (_a) {
    var theme = _a.theme;
    return theme.background;
}, function (_a) {
    var theme = _a.theme;
    return theme.dateText;
}, function (_a) {
    var theme = _a.theme;
    return theme.filterShadow;
}, function (_a) {
    var theme = _a.theme;
    return theme.background;
}, function (_a) {
    var theme = _a.theme;
    return theme.dateText;
}, function (_a) {
    var theme = _a.theme;
    return theme.dateText;
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
