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
var react_hook_form_1 = require("react-hook-form");
var CancelButton_1 = require("../buttons/CancelButton");
var MenuContainer = styled_components_1.default.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  z-index: 100;\n  width: 100%;\n  max-width: 100vw;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: flex-end;\n  //margin-top: 2.6rem;\n  margin-bottom: 4rem;\n\n  @media (min-width: 768px) {\n    margin-bottom: 0;\n  }\n",
      ],
      [
        "\n  z-index: 100;\n  width: 100%;\n  max-width: 100vw;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: flex-end;\n  //margin-top: 2.6rem;\n  margin-bottom: 4rem;\n\n  @media (min-width: 768px) {\n    margin-bottom: 0;\n  }\n",
      ],
    )),
);
var NewInvoiceButton = styled_components_1.default.input(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      [
        "\n  padding: 0 24px;\n  border-radius: 24px;\n  background-color: #7c5dfa;\n  border: none;\n  height: 44px;\n  //width: 90px;\n  display: inline;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  cursor: pointer;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: #ffffff;\n\n  &:hover {\n    background-color: #9277ff;\n    \n  }\n\n  @media (min-width: 1200px) {\n    height: 48px;\n    width: 138px;\n    padding-right: 1.5rem;\n    padding-left: 1.5rem;\n  }\n",
      ],
      [
        "\n  padding: 0 24px;\n  border-radius: 24px;\n  background-color: #7c5dfa;\n  border: none;\n  height: 44px;\n  //width: 90px;\n  display: inline;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  cursor: pointer;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: #ffffff;\n\n  &:hover {\n    background-color: #9277ff;\n    \n  }\n\n  @media (min-width: 1200px) {\n    height: 48px;\n    width: 138px;\n    padding-right: 1.5rem;\n    padding-left: 1.5rem;\n  }\n",
      ],
    )),
);
function EditBottomMenu(_a) {
  var setIsOpen = _a.setIsOpen,
    saveText = _a.saveText,
    closeText = _a.closeText,
    justifyCancel = _a.justifyCancel,
    onSubmit = _a.onSubmit;
  var reset = (0, react_hook_form_1.useFormContext)().reset;
  var closeMenu = function () {
    setIsOpen(false);
    reset();
    // setItems(invoice.items);
  };
  var handleSubmitClick = function () {
    onSubmit();
  };
  return (
    <MenuContainer>
      <CancelButton_1.default
        handleClick={closeMenu}
        text={closeText}
        justifySelf={justifyCancel}
      />
      <NewInvoiceButton
        type="button"
        value={saveText}
        onClick={handleSubmitClick}
      />
    </MenuContainer>
  );
}
exports.default = EditBottomMenu;
EditBottomMenu.propTypes = {
  setIsOpen: prop_types_1.default.func.isRequired,
  saveText: prop_types_1.default.string.isRequired,
  closeText: prop_types_1.default.string.isRequired,
  // justifyCancel: PropTypes.string,
  // setItems: PropTypes.func,
  // invoice: PropTypes.object,
  onSubmit: prop_types_1.default.func.isRequired,
};
var templateObject_1, templateObject_2;
