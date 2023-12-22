"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = require("styled-components");
var prop_types_1 = require("prop-types");
var Button = styled_components_1.default.button(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: #ec5757;\n  border-radius: 24px;\n  padding: 16px 24px 17px 24px;\n  color: white;\n  border: none;\n  cursor: pointer;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  margin: 0.25rem;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n\n  &:hover {\n    background-color: #ff9797;\n  }\n"], ["\n  background-color: #ec5757;\n  border-radius: 24px;\n  padding: 16px 24px 17px 24px;\n  color: white;\n  border: none;\n  cursor: pointer;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  margin: 0.25rem;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n\n  &:hover {\n    background-color: #ff9797;\n  }\n"])));
function DeleteButton(_a) {
    var handleClick = _a.handleClick;
    return <Button onClick={handleClick} type="button">Delete</Button>;
}
exports.default = DeleteButton;
DeleteButton.propTypes = {
    handleClick: prop_types_1.default.func.isRequired,
};
var templateObject_1;
