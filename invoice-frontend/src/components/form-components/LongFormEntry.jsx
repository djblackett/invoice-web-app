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
exports.FormEntryContainer = void 0;
var styled_components_1 = require("styled-components");
var react_1 = require("react");
exports.FormEntryContainer = styled_components_1.default.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  align-items: flex-start;\n  font-style: ",
        ";\n  width: 100%;\n",
      ],
      [
        "\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  align-items: flex-start;\n  font-style: ",
        ";\n  width: 100%;\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.font;
  },
);
function LongFormEntry(_a) {
  var className = _a.className,
    children = _a.children,
    style = _a.style;
  var handleChange = function () {};
  return (
    <exports.FormEntryContainer
      onChange={handleChange}
      className={className}
      style={style}
    >
      {children}
    </exports.FormEntryContainer>
  );
}
exports.default = LongFormEntry;
var templateObject_1;
