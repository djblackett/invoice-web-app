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
exports.SVG = void 0;
var styled_components_1 = require("styled-components");
var react_hook_form_1 = require("react-hook-form");
var Button = styled_components_1.default.button(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 48px;\n  border-radius: 10px;\n  background-color: ",
        ";\n  cursor: pointer;\n\n  &:hover {\n    background-color: #dfe3fa;\n  }\n  \n  &:focus {\n    background-color: #dfe3fa;\n  }\n",
      ],
      [
        "\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 48px;\n  border-radius: 10px;\n  background-color: ",
        ";\n  cursor: pointer;\n\n  &:hover {\n    background-color: #dfe3fa;\n  }\n  \n  &:focus {\n    background-color: #dfe3fa;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.editButton;
  },
);
exports.SVG = styled_components_1.default.svg(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      ["\n  width: 11px;\n  height: 11px;\n"],
      ["\n  width: 11px;\n  height: 11px;\n"],
    )),
);
var ButtonText = styled_components_1.default.p(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      [
        "\n  color: ",
        ";\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  text-align: center;\n  letter-spacing: -0.25px;\n  margin-left: 0.25rem;\n",
      ],
      [
        "\n  color: ",
        ";\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  text-align: center;\n  letter-spacing: -0.25px;\n  margin-left: 0.25rem;\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.newItemText;
  },
);
function NewItemButton(_a) {
  var items = _a.items,
    append = _a.append;
  var clearErrors = (0, react_hook_form_1.useFormContext)().clearErrors;
  var submitCount = (0, react_hook_form_1.useForm)().formState.submitCount;
  var handleClick = function () {
    append({ id: "", name: "", quantity: "", price: "", total: "" });
    clearErrors("itemsError");
  };
  return (
    <Button
      onClick={handleClick}
      type="button"
      style={{
        border:
          submitCount > 0 && items.length === 0
            ? "1px solid red"
            : "1px solid transparent",
      }}
    >
      {/* <SVG>{plusIcon}</SVG> */}
      <ButtonText>+ Add New Item</ButtonText>
    </Button>
  );
}
exports.default = NewItemButton;
var templateObject_1, templateObject_2, templateObject_3;
