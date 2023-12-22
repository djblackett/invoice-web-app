"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDNumber = exports.InfoGrid = exports.Description = exports.IdAndDescription = exports.TopRow = exports.TopEntry = exports.NamePlusAddress = exports.GenericInvoiceEntry = exports.EmbeddedAddress = exports.BottomEntry = exports.AddressEntry = exports.Address = exports.Card = void 0;
var styled_components_1 = require("styled-components");
var Card = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100%;\n  max-width: 100%;\n  background-color: ", ";\n  display: flex;\n  flex-direction: column;\n  padding: 24px;\n  padding-bottom: 1.5rem;\n  margin: 24px;\n  margin-bottom: calc(3.5rem + 91px);\n  margin-top: 1rem;\n  letter-spacing: -0.25px;\n  line-height: 15px;\n  font-size: 12px;\n  border: 1px solid transparent;\n  border-radius: 8px;\n  box-shadow: 0px 10px 10px -10px rgba(72, 84, 159, 0.100397);\n  transition: width 0.5s ease-in-out;\n\n  &:hover {\n    border: 1px solid ", ";\n  }\n\n  @media (min-width: 768px) {\n    justify-items: center;\n    width: 730px;\n    max-width: initial;\n    align-content: center;\n    padding: 3rem;\n    margin-top: 1.5rem;\n  }\n\n  @media (min-width: 1200px) {\n    max-width: 730px;\n  }\n"], ["\n  width: 100%;\n  max-width: 100%;\n  background-color: ", ";\n  display: flex;\n  flex-direction: column;\n  padding: 24px;\n  padding-bottom: 1.5rem;\n  margin: 24px;\n  margin-bottom: calc(3.5rem + 91px);\n  margin-top: 1rem;\n  letter-spacing: -0.25px;\n  line-height: 15px;\n  font-size: 12px;\n  border: 1px solid transparent;\n  border-radius: 8px;\n  box-shadow: 0px 10px 10px -10px rgba(72, 84, 159, 0.100397);\n  transition: width 0.5s ease-in-out;\n\n  &:hover {\n    border: 1px solid ", ";\n  }\n\n  @media (min-width: 768px) {\n    justify-items: center;\n    width: 730px;\n    max-width: initial;\n    align-content: center;\n    padding: 3rem;\n    margin-top: 1.5rem;\n  }\n\n  @media (min-width: 1200px) {\n    max-width: 730px;\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.background;
}, function (_a) {
    var theme = _a.theme;
    return theme.outline;
});
exports.Card = Card;
var IDNumber = styled_components_1.default.p(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin: 0;\n  font-family: \"Spartan\",sans-serif;\n  font-style: normal;\n  font-weight: 700;\n  font-size: 16px;\n  line-height: 24px;\n  /* identical to box height, or 150% */\n\n  letter-spacing: -0.8px;\n"], ["\n  margin: 0;\n  font-family: \"Spartan\",sans-serif;\n  font-style: normal;\n  font-weight: 700;\n  font-size: 16px;\n  line-height: 24px;\n  /* identical to box height, or 150% */\n\n  letter-spacing: -0.8px;\n"])));
exports.IDNumber = IDNumber;
var TopRow = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: space-between;\n  @media (min-width: 768px) {\n    flex-direction: row;\n  }\n"], ["\n  display: flex;\n\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: space-between;\n  @media (min-width: 768px) {\n    flex-direction: row;\n  }\n"])));
exports.TopRow = TopRow;
var TopEntry = styled_components_1.default.p(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin: 0;\n  color: ", ";\n  font-weight: 500;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n"], ["\n  margin: 0;\n  color: ", ";\n  font-weight: 500;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.greyText;
});
exports.TopEntry = TopEntry;
var GenericInvoiceEntry = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  \n"], ["\n  display: flex;\n  flex-direction: column;\n  \n"])));
exports.GenericInvoiceEntry = GenericInvoiceEntry;
var NamePlusAddress = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  grid-column: 2 / 3;\n  grid-row: 1 / 3;\n"], ["\n  display: flex;\n  flex-direction: column;\n  grid-column: 2 / 3;\n  grid-row: 1 / 3;\n"])));
exports.NamePlusAddress = NamePlusAddress;
var BottomEntry = styled_components_1.default.p(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  margin: 0;\n  margin-top: 8px;\n  font-weight: 700;\n  font-size: 15px;\n  line-height: 20px;\n  /* identical to box height, or 133% */\n\n  letter-spacing: -0.3125px;\n"], ["\n  margin: 0;\n  margin-top: 8px;\n  font-weight: 700;\n  font-size: 15px;\n  line-height: 20px;\n  /* identical to box height, or 133% */\n\n  letter-spacing: -0.3125px;\n"])));
exports.BottomEntry = BottomEntry;
var Description = styled_components_1.default.p(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  margin: 0;\n  padding: 0;\n  color: ", ";\n  font-weight: 500;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n\n  @media (min-width: 768px) {\n    margin-top: 0.3rem;\n  }\n"], ["\n  margin: 0;\n  padding: 0;\n  color: ", ";\n  font-weight: 500;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n\n  @media (min-width: 768px) {\n    margin-top: 0.3rem;\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.greyText;
});
exports.Description = Description;
var Address = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  justify-self: flex-start;\n  display: flex;\n  flex-direction: column;\n"], ["\n  justify-self: flex-start;\n  display: flex;\n  flex-direction: column;\n"])));
exports.Address = Address;
var EmbeddedAddress = (0, styled_components_1.default)(Address)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  margin-top: 0.5rem;\n"], ["\n  margin-top: 0.5rem;\n"])));
exports.EmbeddedAddress = EmbeddedAddress;
var AddressEntry = styled_components_1.default.p(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  color: ", ";\n  margin: 0;\n\n  padding: 0;\n\n  @media (min-width: 768px) {\n    margin-bottom: 0.3rem;\n  }\n"], ["\n  color: ", ";\n  margin: 0;\n\n  padding: 0;\n\n  @media (min-width: 768px) {\n    margin-bottom: 0.3rem;\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.greyText;
});
exports.AddressEntry = AddressEntry;
var IdAndDescription = styled_components_1.default.div(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  margin-bottom: 1.9rem;\n\n  @media (min-width: 768px) {\n    margin: 0;\n  }\n"], ["\n  display: flex;\n  flex-direction: column;\n  margin-bottom: 1.9rem;\n\n  @media (min-width: 768px) {\n    margin: 0;\n  }\n"])));
exports.IdAndDescription = IdAndDescription;
var InfoGrid = styled_components_1.default.div(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  display: grid;\n  grid-template: repeat(2, 65px) / 1fr 1fr;\n\n  margin-top: 1.3rem;\n\n  @media (min-width: 768px) {\n    grid-template: repeat(2, 65px) / 1fr 1fr 1fr;\n    grid-auto-flow: column;\n  }\n"], ["\n  display: grid;\n  grid-template: repeat(2, 65px) / 1fr 1fr;\n\n  margin-top: 1.3rem;\n\n  @media (min-width: 768px) {\n    grid-template: repeat(2, 65px) / 1fr 1fr 1fr;\n    grid-auto-flow: column;\n  }\n"])));
exports.InfoGrid = InfoGrid;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
