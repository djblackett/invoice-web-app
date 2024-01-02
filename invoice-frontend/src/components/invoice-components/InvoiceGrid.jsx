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
var styled_components_1 = require("styled-components");
var prop_types_1 = require("prop-types");
var react_1 = require("react");
var FlexContainer = styled_components_1.default.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  min-height: 150px;\n  align-items: center;\n  padding: 0 1.5rem;\n  align-self: center;\n\n  @media (min-width: 768px) {\n    padding: 0 48px;\n  }\n  \n  @media (min-width: 1200px) {\n    padding: 0;\n  }\n",
      ],
      [
        "\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  min-height: 150px;\n  align-items: center;\n  padding: 0 1.5rem;\n  align-self: center;\n\n  @media (min-width: 768px) {\n    padding: 0 48px;\n  }\n  \n  @media (min-width: 1200px) {\n    padding: 0;\n  }\n",
      ],
    )),
);
function InvoiceGrid(_a) {
  var children = _a.children;
  return <FlexContainer>{children}</FlexContainer>;
}
InvoiceGrid.propTypes = {
  children: prop_types_1.default.node.isRequired,
};
exports.default = InvoiceGrid;
var templateObject_1;
