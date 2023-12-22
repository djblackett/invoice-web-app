"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = require("styled-components");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var InvoiceItem_1 = require("./InvoiceItem");
var invoicesSlice_1 = require("../../features/invoices/invoicesSlice");
var utilityFunctions_1 = require("../../utils/utilityFunctions");
var ListContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: grid;\n  width: 100%;\n  border-radius: 8px;\n  \n"], ["\n  display: grid;\n  width: 100%;\n  border-radius: 8px;\n  \n"])));
var AmountDue = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 80px;\n  background-color: ", ";\n  padding: 2rem;\n  border-radius: 0 0 8px 8px;\n"], ["\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 80px;\n  background-color: ", ";\n  padding: 2rem;\n  border-radius: 0 0 8px 8px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.amountDueBackground;
});
var AmountDueTitle = styled_components_1.default.p(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: white;\n  font-weight: 500;\n  font-size: 11px;\n  line-height: 18px;\n  /* identical to box height, or 164% */\n  letter-spacing: -0.229167px;\n\n  .grand-total {\n    display: inline;\n  }\n\n  .amount-due {\n    display: none;\n  }\n\n  @media (min-width: 768px) {\n    .grand-total {\n      display: none;\n    }\n\n    .amount-due {\n      display: inline;\n    }\n  }\n"], ["\n  color: white;\n  font-weight: 500;\n  font-size: 11px;\n  line-height: 18px;\n  /* identical to box height, or 164% */\n  letter-spacing: -0.229167px;\n\n  .grand-total {\n    display: inline;\n  }\n\n  .amount-due {\n    display: none;\n  }\n\n  @media (min-width: 768px) {\n    .grand-total {\n      display: none;\n    }\n\n    .amount-due {\n      display: inline;\n    }\n  }\n"])));
var AmountDueTotal = styled_components_1.default.p(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  font-weight: 700;\n  font-size: 24px;\n  line-height: 32px;\n  /* identical to box height, or 133% */\n  text-align: right;\n  letter-spacing: -0.5px;\n  color: white;\n"], ["\n  font-weight: 700;\n  font-size: 24px;\n  line-height: 32px;\n  /* identical to box height, or 133% */\n  text-align: right;\n  letter-spacing: -0.5px;\n  color: white;\n"])));
var ItemsHeader = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: none;\n\n  @media (min-width: 768px) {\n    display: grid;\n    grid-template: 1fr / 2fr 1fr 1fr 1fr;\n    color: ", ";\n    background-color: ", ";\n    margin-top: 3rem;\n    padding: 2rem;\n    border-radius: 8px 8px 0 0;\n    justify-items: end;\n  }\n"], ["\n  display: none;\n\n  @media (min-width: 768px) {\n    display: grid;\n    grid-template: 1fr / 2fr 1fr 1fr 1fr;\n    color: ", ";\n    background-color: ", ";\n    margin-top: 3rem;\n    padding: 2rem;\n    border-radius: 8px 8px 0 0;\n    justify-items: end;\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.greyText;
}, function (_a) {
    var theme = _a.theme;
    return theme.editButton;
});
var Col = styled_components_1.default.p(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  width: fit-content;\n  margin: 0;\n  padding: 0;\n  font-weight: 500;\n  font-size: 11px;\n  line-height: 18px;\n  /* identical to box height, or 164% */\n  letter-spacing: -0.229167px;\n"], ["\n  width: fit-content;\n  margin: 0;\n  padding: 0;\n  font-weight: 500;\n  font-size: 11px;\n  line-height: 18px;\n  /* identical to box height, or 164% */\n  letter-spacing: -0.229167px;\n"])));
var Col1 = (0, styled_components_1.default)(Col)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  justify-self: start;\n"], ["\n  justify-self: start;\n"])));
var ItemsContainer = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  margin-top: 2.5rem;\n  border-radius: 8px 8px 0 0;\n  background-color: ", ";\n\n  @media (min-width: 768px) {\n    padding: 0;\n    border-radius: initial;\n    margin-top: initial;\n  }\n"], ["\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  margin-top: 2.5rem;\n  border-radius: 8px 8px 0 0;\n  background-color: ", ";\n\n  @media (min-width: 768px) {\n    padding: 0;\n    border-radius: initial;\n    margin-top: initial;\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.editButton;
});
var count = 0;
function ItemList(_a) {
    var invoice = _a.invoice;
    var dispatch = (0, react_redux_1.useDispatch)();
    (0, react_1.useLayoutEffect)(function () {
        dispatch((0, invoicesSlice_1.addIdToExistingInvoices)());
    }, []);
    return (<ListContainer>
      <ItemsHeader>
        <Col1>Item Name</Col1>
        <Col>QTY.</Col>
        <Col>Price</Col>
        <Col>Total</Col>
      </ItemsHeader>
      <ItemsContainer>
        {invoice.items.map(function (item) { return (<InvoiceItem_1.default item={item} key={"itemList-".concat(item.id || ++count)}/>); })}
      </ItemsContainer>
      <AmountDue>
        <AmountDueTitle>
          <span className="amount-due">Amount Due</span>
          <span className="grand-total">Grand Total</span>
        </AmountDueTitle>
        <AmountDueTotal>£ {(0, utilityFunctions_1.getMoney)(invoice.total)}</AmountDueTotal>
      </AmountDue>
    </ListContainer>);
}
exports.default = ItemList;
ItemList.propTypes = {
// invoice: PropTypes.object.isRequired,
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
