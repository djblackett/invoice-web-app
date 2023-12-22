"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = require("styled-components");
var react_1 = require("react");
var InvoiceStatus_1 = require("./InvoiceStatus");
var utilityFunctions_1 = require("../../utils/utilityFunctions");
var Card = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  height: 134px;\n  width: 100%;\n  background-color: ", ";\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 43px 43px;\n  padding: 24px;\n  margin-bottom: 8px;\n  margin-top: 8px;\n  letter-spacing: -0.25px;\n  line-height: 15px;\n  font-size: 12px;\n  border-radius: 8px;\n  border: 1px solid transparent;\n  box-shadow: 0 10px 10px -10px rgba(72, 84, 159, 0.100397);\n  transition: background-color 0.4s ease-in-out;\n\n  &:hover {\n    border: 1px solid ", ";\n  }\n\n  @media (min-width: 600px) {\n    grid-template-rows: 1fr;\n    \n    // calculations for the grid-template-columns based on design spec\n    // container = 672px  or 624px without padding\n    // 1st box = 87  so 87/624 = 14%\n    //2nd box = 143px so 143/624 = 23%\n    // 3rd 136 so 136/ 624 = \n    // 130 \n    // 124 \n    // 4\n    \n    grid-template-columns: 14% 23% 21.6% 20.8% 19.9% 2%;\n    grid-auto-flow: dense;\n    align-items: center;\n    justify-items: start;\n    height: 72px;\n    margin: 8px 0 8px 0;\n    align-content: center;\n  }\n\n  @media (min-width: 1200px) {\n    width: 100%;\n    margin-left: 0;\n    margin-right: 0;\n  }\n"], ["\n  height: 134px;\n  width: 100%;\n  background-color: ", ";\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 43px 43px;\n  padding: 24px;\n  margin-bottom: 8px;\n  margin-top: 8px;\n  letter-spacing: -0.25px;\n  line-height: 15px;\n  font-size: 12px;\n  border-radius: 8px;\n  border: 1px solid transparent;\n  box-shadow: 0 10px 10px -10px rgba(72, 84, 159, 0.100397);\n  transition: background-color 0.4s ease-in-out;\n\n  &:hover {\n    border: 1px solid ", ";\n  }\n\n  @media (min-width: 600px) {\n    grid-template-rows: 1fr;\n    \n    // calculations for the grid-template-columns based on design spec\n    // container = 672px  or 624px without padding\n    // 1st box = 87  so 87/624 = 14%\n    //2nd box = 143px so 143/624 = 23%\n    // 3rd 136 so 136/ 624 = \n    // 130 \n    // 124 \n    // 4\n    \n    grid-template-columns: 14% 23% 21.6% 20.8% 19.9% 2%;\n    grid-auto-flow: dense;\n    align-items: center;\n    justify-items: start;\n    height: 72px;\n    margin: 8px 0 8px 0;\n    align-content: center;\n  }\n\n  @media (min-width: 1200px) {\n    width: 100%;\n    margin-left: 0;\n    margin-right: 0;\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.background;
}, function (_a) {
    var theme = _a.theme;
    return theme.outline;
});
var IDNumber = styled_components_1.default.p(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin: 0;\n  font-weight: bold;\n  color: ", ";\n"], ["\n  margin: 0;\n  font-weight: bold;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.textPlain;
});
var DueDate = styled_components_1.default.p(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: 0;\n  color: ", ";\n"], ["\n  margin: 0;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.greyText;
});
var DueDateAmountBox = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  grid-area: 2 / 1 / 3 / 2;\n\n  @media (min-width: 600px) {\n    display: contents;\n  }\n"], ["\n  display: flex;\n  flex-direction: column;\n  grid-area: 2 / 1 / 3 / 2;\n\n  @media (min-width: 600px) {\n    display: contents;\n  }\n"])));
var InvoiceAmount = styled_components_1.default.p(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-weight: bold;\n  letter-spacing: -0.8px;\n  margin: 0;\n  line-height: 24px;\n  font-size: 16px;\n  color: ", ";\n"], ["\n  font-weight: bold;\n  letter-spacing: -0.8px;\n  margin: 0;\n  line-height: 24px;\n  font-size: 16px;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.textPlain;
});
var CustomerName = styled_components_1.default.p(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  margin: 0;\n  color: ", ";\n  font-weight: 500;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n\n  text-align: right;\n  letter-spacing: -0.25px;\n\n  @media (min-width: 600px) {\n    grid-column: 3 / 4;\n  }\n"], ["\n  margin: 0;\n  color: ", ";\n  font-weight: 500;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n\n  text-align: right;\n  letter-spacing: -0.25px;\n\n  @media (min-width: 600px) {\n    grid-column: 3 / 4;\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.textPlain;
});
var SVGContainer = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  width: 100%;\n  display: none;\n  justify-content: center;\n  align-items: center;\n\n  @media (min-width: 600px) {\n    display: flex;\n  }\n"], ["\n  width: 100%;\n  display: none;\n  justify-content: center;\n  align-items: center;\n\n  @media (min-width: 600px) {\n    display: flex;\n  }\n"])));
var arrowRightSVG = (<svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/>
  </svg>);
function InvoiceCard(_a) {
    var invoice = _a.invoice;
    var invoiceStatus = (0, react_1.useMemo)(function () {
        if (invoice.status === "paid") {
            return <InvoiceStatus_1.default statusType="paid" text="Paid"/>;
        }
        if (invoice.status === "pending") {
            return <InvoiceStatus_1.default statusType="pending" text="Pending"/>;
        }
        if (invoice.status === "draft") {
            return <InvoiceStatus_1.default statusType="draft" text="Draft"/>;
        }
    }, [invoice]);
    var convertedDate = function () {
        if (invoice.paymentDue) {
            var date = invoice.paymentDue.split("-");
            var dateObj = new Date(Date.UTC(Number(date[0]), Number(date[1]), Number(date[2])));
            var utcDateArr = dateObj.toUTCString().split(" ");
            return "".concat(utcDateArr[1], "  ").concat(utcDateArr[2], " ").concat(utcDateArr[3]);
        }
    };
    return (<Card>
      <IDNumber>
        <span style={{ color: "#7E88C3" }}>#</span>
        {invoice.id.substring(0, 6)}
      </IDNumber>
      <CustomerName>{invoice.clientName}</CustomerName>
      <DueDateAmountBox>
        <DueDate>Due {convertedDate()}</DueDate>

        <InvoiceAmount>£ {(0, utilityFunctions_1.getMoney)(invoice.total)}</InvoiceAmount>
      </DueDateAmountBox>

      {invoiceStatus}
      <SVGContainer>{arrowRightSVG}</SVGContainer>
    </Card>);
}
InvoiceCard.propTypes = {
// invoice: PropTypes.object.isRequired,
};
exports.default = InvoiceCard;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
