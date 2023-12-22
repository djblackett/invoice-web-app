"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = require("styled-components");
var prop_types_1 = require("prop-types");
var utilityFunctions_1 = require("../../utils/utilityFunctions");
var ItemContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: grid;\n  width: 100%;\n  padding: 1.5rem;\n  padding-top: 0;\n  grid-template: auto auto / 1fr 1fr;\n  grid-auto-flow: dense;\n  background-color: ", ";\n\n  :first-child {\n    padding-top: 1.5rem;\n  }\n\n  @media (min-width: 768px) {\n    padding-left: 2rem;\n    padding-right: 2rem;\n    padding-top: 1rem;\n    padding-bottom: 1rem;\n    grid-template: 1fr / 2fr 1fr 1fr 1fr;\n    justify-items: end;\n\n    :first-child {\n      padding-top: 0;\n    }\n\n    :last-child {\n      padding-bottom: 2rem;\n    }\n  }\n"], ["\n  display: grid;\n  width: 100%;\n  padding: 1.5rem;\n  padding-top: 0;\n  grid-template: auto auto / 1fr 1fr;\n  grid-auto-flow: dense;\n  background-color: ", ";\n\n  :first-child {\n    padding-top: 1.5rem;\n  }\n\n  @media (min-width: 768px) {\n    padding-left: 2rem;\n    padding-right: 2rem;\n    padding-top: 1rem;\n    padding-bottom: 1rem;\n    grid-template: 1fr / 2fr 1fr 1fr 1fr;\n    justify-items: end;\n\n    :first-child {\n      padding-top: 0;\n    }\n\n    :last-child {\n      padding-bottom: 2rem;\n    }\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.editButton;
});
var ItemName = styled_components_1.default.p(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  white-space: nowrap;\n  justify-self: start;\n  width: fit-content;\n  margin: 0;\n  padding: 0;\n  color: ", ";\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n"], ["\n  white-space: nowrap;\n  justify-self: start;\n  width: fit-content;\n  margin: 0;\n  padding: 0;\n  color: ", ";\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.text;
});
// same style used for Price
var Quantity = styled_components_1.default.p(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: none;\n  justify-self: end;\n  width: fit-content;\n  margin: 0;\n  color: ", ";\n  padding: 0;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n\n  text-align: right;\n  letter-spacing: -0.25px;\n\n  @media (min-width: 768px) {\n    display: inline;\n    text-align: center;\n    margin-right: 0.5rem;\n  }\n"], ["\n  display: none;\n  justify-self: end;\n  width: fit-content;\n  margin: 0;\n  color: ", ";\n  padding: 0;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n\n  text-align: right;\n  letter-spacing: -0.25px;\n\n  @media (min-width: 768px) {\n    display: inline;\n    text-align: center;\n    margin-right: 0.5rem;\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.greyText;
});
var Price = (0, styled_components_1.default)(Quantity)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin-right: 0;\n"], ["\n  margin-right: 0;\n"])));
var Total = (0, styled_components_1.default)(ItemName)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  text-align: end;\n  justify-self: end;\n  align-self: center;\n  grid-area: 1 / 2 / 2 / 3;\n  @media (min-width: 768px) {\n    grid-area: initial;\n  }\n"], ["\n  text-align: end;\n  justify-self: end;\n  align-self: center;\n  grid-area: 1 / 2 / 2 / 3;\n  @media (min-width: 768px) {\n    grid-area: initial;\n  }\n"])));
var QuantityPriceContainer = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: none;\n\n  @media (min-width: 768px) {\n    display: contents;\n  }\n"], ["\n  display: none;\n\n  @media (min-width: 768px) {\n    display: contents;\n  }\n"])));
var MobileQuantityPrice = styled_components_1.default.p(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  display: inline;\n  grid-area: 2 / 1 / 3 / 2;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  margin: 0;\n  margin-top: 0.5rem;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: ", ";\n  \n  @media (min-width: 768px) {\n    display: none;\n  }\n"], ["\n  display: inline;\n  grid-area: 2 / 1 / 3 / 2;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  margin: 0;\n  margin-top: 0.5rem;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: ", ";\n  \n  @media (min-width: 768px) {\n    display: none;\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.greyText;
});
var MobileHelperContainer = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n\n  @media (min-width: 768px) {\n    display: contents;\n  }\n"], ["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n\n  @media (min-width: 768px) {\n    display: contents;\n  }\n"])));
function InvoiceItem(_a) {
    var item = _a.item;
    return (<ItemContainer>
      <MobileHelperContainer>
        <ItemName>{item.name}</ItemName>
        <QuantityPriceContainer>
          <Quantity>{item.quantity}</Quantity>
          <Price>£ {(0, utilityFunctions_1.getMoney)(Number(item.price))}</Price>
        </QuantityPriceContainer>
        <MobileQuantityPrice>
          {"".concat(item.quantity, " x \u00A3 ").concat(Number(item.price).toFixed(2))}{" "}
        </MobileQuantityPrice>
      </MobileHelperContainer>
      <Total>£ {(0, utilityFunctions_1.getMoney)(Number(item.total))}</Total>
    </ItemContainer>);
}
exports.default = InvoiceItem;
InvoiceItem.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: prop_types_1.default.object.isRequired,
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
