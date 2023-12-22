"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = require("styled-components");
var prop_types_1 = require("prop-types");
var react_hook_form_1 = require("react-hook-form");
var react_dom_1 = require("react-dom");
var CancelButton_1 = require("../buttons/CancelButton");
var MenuContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100%;\n  max-width: 100vw;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  margin-top: 2.6rem;\n  margin-bottom: 4rem;\n  align-self: center;\n  transform: scale(.90);\n  \n  @media (min-width: 325px) {\n    justify-content: space-between;\n    transform: scale(1);\n  }\n  \n  @media (min-width: 768px) {\n    margin-bottom: 0;\n  }\n"], ["\n  width: 100%;\n  max-width: 100vw;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  margin-top: 2.6rem;\n  margin-bottom: 4rem;\n  align-self: center;\n  transform: scale(.90);\n  \n  @media (min-width: 325px) {\n    justify-content: space-between;\n    transform: scale(1);\n  }\n  \n  @media (min-width: 768px) {\n    margin-bottom: 0;\n  }\n"])));
var NewInvoiceButton = styled_components_1.default.input(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  border-radius: 24px;\n  background-color: #7c5dfa;\n  border: none;\n  height: 44px;\n  width: 90px;\n  display: flex;\n  flex-shrink: 1;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  cursor: pointer;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: #ffffff;\n\n  @media (min-width: 1200px) {\n    height: 48px;\n    width: 138px;\n  }\n\n  &:hover {\n    background-color: #9277ff;\n  }\n"], ["\n  border-radius: 24px;\n  background-color: #7c5dfa;\n  border: none;\n  height: 44px;\n  width: 90px;\n  display: flex;\n  flex-shrink: 1;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  cursor: pointer;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: #ffffff;\n\n  @media (min-width: 1200px) {\n    height: 48px;\n    width: 138px;\n  }\n\n  &:hover {\n    background-color: #9277ff;\n  }\n"])));
var SaveDraft = (0, styled_components_1.default)(NewInvoiceButton)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  background-color: #373b53;\n  color: #888eb0;\n  margin-right: 8px;\n  width: 133px;\n\n  &:hover {\n    background-color: #0c0e16;\n  }\n"], ["\n  background-color: #373b53;\n  color: #888eb0;\n  margin-right: 8px;\n  width: 133px;\n\n  &:hover {\n    background-color: #0c0e16;\n  }\n"])));
var SaveAndDraftContainer = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: contents;\n\n  @media (min-width: 768px) {\n    display: flex;\n    flex-direction: row;\n  }\n"], ["\n  display: contents;\n\n  @media (min-width: 768px) {\n    display: flex;\n    flex-direction: row;\n  }\n"])));
function NewInvoiceBottomMenu(_a) {
    var setIsDraft = _a.setIsDraft, setIsOpen = _a.setIsOpen, saveText = _a.saveText, closeText = _a.closeText, justifyCancel = _a.justifyCancel, onSubmit = _a.onSubmit;
    var _b = (0, react_hook_form_1.useFormContext)(), clearErrors = _b.clearErrors, setValue = _b.setValue, reset = _b.reset;
    var closeMenu = function () {
        clearErrors();
        setIsOpen(false);
        reset();
    };
    var setToDraft = function () {
        (0, react_dom_1.flushSync)(function () {
            setIsDraft(true);
            setValue("status", "draft");
        });
        onSubmit();
    };
    var setToPending = function () {
        (0, react_dom_1.flushSync)(function () {
            setIsDraft(false);
            setValue("status", "pending");
        });
        onSubmit();
    };
    return (<MenuContainer>
      <CancelButton_1.default handleClick={closeMenu} text={closeText} justifySelf={justifyCancel}/>
      <SaveAndDraftContainer>
        <SaveDraft type="button" value="Save as draft" onClick={setToDraft}/>
        <NewInvoiceButton type="button" value={saveText} onClick={setToPending}/>
      </SaveAndDraftContainer>
    </MenuContainer>);
}
exports.default = NewInvoiceBottomMenu;
NewInvoiceBottomMenu.propTypes = {
    setIsDraft: prop_types_1.default.func.isRequired,
    setIsOpen: prop_types_1.default.func.isRequired,
    saveText: prop_types_1.default.string.isRequired,
    closeText: prop_types_1.default.string.isRequired,
    justifyCancel: prop_types_1.default.string.isRequired,
    onSubmit: prop_types_1.default.func.isRequired
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
