"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = require("styled-components");
var prop_types_1 = require("prop-types");
var react_1 = require("react");
var AddressDetails = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  flex-wrap: wrap;\n\n  max-width: 100vw;\n\n  @media (min-width: 768px) {\n    flex-wrap: nowrap;\n    max-width: 100%;\n  }\n"], ["\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  flex-wrap: wrap;\n\n  max-width: 100vw;\n\n  @media (min-width: 768px) {\n    flex-wrap: nowrap;\n    max-width: 100%;\n  }\n"])));
function AddressBox(_a) {
    var children = _a.children;
    return <AddressDetails className="address-box">{children}</AddressDetails>;
}
AddressBox.propTypes = {
    children: prop_types_1.default.node.isRequired
};
exports.default = AddressBox;
var templateObject_1;
