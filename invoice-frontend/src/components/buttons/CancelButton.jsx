"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = require("styled-components");
var prop_types_1 = require("prop-types");
var Button = styled_components_1.default.button(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline;\n  background-color: ", ";\n  border-radius: 24px;\n  padding: 16px 24px 17px 24px;\n  color: ", ";\n  border: none;\n  cursor: pointer;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  scale: 0.9;\n  \n  @media (min-width: 325px) {\n    scale: none;\n    margin: 0.25rem;\n  }\n\n  &:hover {\n    background-color: ", ";\n  }\n"], ["\n  display: inline;\n  background-color: ", ";\n  border-radius: 24px;\n  padding: 16px 24px 17px 24px;\n  color: ", ";\n  border: none;\n  cursor: pointer;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  scale: 0.9;\n  \n  @media (min-width: 325px) {\n    scale: none;\n    margin: 0.25rem;\n  }\n\n  &:hover {\n    background-color: ", ";\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.editButton;
}, function (_a) {
    var theme = _a.theme;
    return theme.greyText;
}, function (_a) {
    var theme = _a.theme;
    return theme.editButtonHover;
});
function CancelButton(_a) {
    var handleClick = _a.handleClick, text = _a.text, justifySelf = _a.justifySelf;
    return (<Button style={{ justifySelf: justifySelf || "auto" }} onClick={handleClick} type="button">
      {text}
    </Button>);
}
exports.default = CancelButton;
CancelButton.propTypes = {
    handleClick: prop_types_1.default.func.isRequired,
    text: prop_types_1.default.string.isRequired,
    justifySelf: prop_types_1.default.string
};
var templateObject_1;
