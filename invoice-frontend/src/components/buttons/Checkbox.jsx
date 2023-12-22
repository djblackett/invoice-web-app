"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var prop_types_1 = require("prop-types");
var styled_components_1 = require("styled-components");
var checkedStyles = (0, styled_components_1.css)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: ", ";\n  border-color: transparent;\n"], ["\n  background-color: ", ";\n  border-color: transparent;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.newButton;
});
var uncheckedStyles = (0, styled_components_1.css)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  background-color: ", ";\n"], ["\n  background-color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.editButtonHover;
});
var CheckboxContainer = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: inline-block;\n  vertical-align: middle;\n  border: 1px solid transparent;\n  border-radius: 2px;\n  ", ";\n\n"], ["\n  display: inline-block;\n  vertical-align: middle;\n  border: 1px solid transparent;\n  border-radius: 2px;\n  ", ";\n\n"])), function (props) { return (props.checked ? checkedStyles : uncheckedStyles); });
var HiddenCheckbox = styled_components_1.default.input.attrs({ type: "checkbox" })(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  // Hide checkbox visually but remain accessible to screen readers.\n  // Source: https://polished.js.org/docs/#hidevisually\n  clip: rect(0 0 0 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  white-space: nowrap;\n  width: 1px;\n"], ["\n  // Hide checkbox visually but remain accessible to screen readers.\n  // Source: https://polished.js.org/docs/#hidevisually\n  clip: rect(0 0 0 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  white-space: nowrap;\n  width: 1px;\n"])));
var Icon = styled_components_1.default.svg(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  stroke: #fff;\n  stroke-width: 2;\n  fill: none;\n  fill-rule: evenodd;\n"], ["\n  stroke: #fff;\n  stroke-width: 2;\n  fill: none;\n  fill-rule: evenodd;\n"])));
var StyledCheckbox = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: inline-block;\n  width: 16px;\n  height: 16px;\n  border-radius: 2px;\n  transition: all 200ms;\n  ", ";\n  ", " {\n    visibility: ", ";\n  }\n"], ["\n  display: inline-block;\n  width: 16px;\n  height: 16px;\n  border-radius: 2px;\n  transition: all 200ms;\n  ", ";\n  ", " {\n    visibility: ", ";\n  }\n"])), function (props) { return (props.checked ? checkedStyles : uncheckedStyles); }, Icon, function (props) { return (props.checked ? "visible" : "hidden"); });
function Checkbox(_a) {
    var className = _a.className, _b = _a.checked, checked = _b === void 0 ? false : _b, props = __rest(_a, ["className", "checked"]);
    return <CheckboxContainer className="styledCheckbox" checked={checked}>
    <HiddenCheckbox checked={checked} {...props} readOnly/>
    <StyledCheckbox checked={checked}>
      <Icon width="10" height="8" viewBox="0 0 10 8">
        <path d="M1.5 4.5l2.124 2.124L8.97 1.28"/>
      </Icon>
    </StyledCheckbox>
  </CheckboxContainer>;
}
exports.default = Checkbox;
Checkbox.propTypes = {
    className: prop_types_1.default.string,
    checked: prop_types_1.default.bool.isRequired,
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
