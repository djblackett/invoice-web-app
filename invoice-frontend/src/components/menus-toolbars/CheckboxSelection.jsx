"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var prop_types_1 = require("prop-types");
var styled_components_1 = require("styled-components");
var react_redux_1 = require("react-redux");
var Checkbox_1 = require("../buttons/Checkbox");
var filterSlice_1 = require("../../features/invoices/filterSlice");
var CheckboxContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\n"], ["\n\n"])));
var Label = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  cursor: pointer;\n  box-sizing: border-box;\n  margin-left: 0.5rem;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: ", ";\n"], ["\n  cursor: pointer;\n  box-sizing: border-box;\n  margin-left: 0.5rem;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.textPlain;
});
function CheckboxSelection(_a) {
    var option = _a.option;
    var filter = (0, react_redux_1.useSelector)(filterSlice_1.selectFilter);
    var loweredOption = option.toLowerCase();
    var isSelected = filter[loweredOption];
    return (<CheckboxContainer>
      <Label>
        <Checkbox_1.default checked={isSelected}/>
        <span style={{ marginLeft: "13px", fontFamily: "League Spartan", fontWeight: 700 }}>{option}</span>
      </Label>
    </CheckboxContainer>);
}
CheckboxSelection.propTypes = {
    option: prop_types_1.default.string.isRequired,
};
exports.default = CheckboxSelection;
var templateObject_1, templateObject_2;
