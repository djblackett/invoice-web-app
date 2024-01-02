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
var EditButton_1 = require("../buttons/EditButton");
var DeleteButton_1 = require("../buttons/DeleteButton");
var MarkAsPaidButton_1 = require("../buttons/MarkAsPaidButton");
var ButtonsContainer = styled_components_1.default.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  display: flex;\n  flex-direction: row;\n  justify-content: space-evenly;\n  align-items: center;\n  height: 91px;\n  width: 100%;\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: ",
        ";\n  margin-top: 3.5rem;\n  order: 2;\n  \n  @media (min-width: 325px) {\n    width: 100%;\n    padding: 1.4rem 1.5rem;\n  }\n\n  @media (min-width: 600px) {\n    order: initial;\n    height: initial;\n    width: initial;\n    position: static;\n    margin-top: initial;\n    background-color: initial;\n  }\n",
      ],
      [
        "\n  display: flex;\n  flex-direction: row;\n  justify-content: space-evenly;\n  align-items: center;\n  height: 91px;\n  width: 100%;\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: ",
        ";\n  margin-top: 3.5rem;\n  order: 2;\n  \n  @media (min-width: 325px) {\n    width: 100%;\n    padding: 1.4rem 1.5rem;\n  }\n\n  @media (min-width: 600px) {\n    order: initial;\n    height: initial;\n    width: initial;\n    position: static;\n    margin-top: initial;\n    background-color: initial;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.background;
  },
);
function ToolbarButtons(_a) {
  var toggleEditTab = _a.toggleEditTab,
    invoice = _a.invoice,
    openModal = _a.openModal,
    isEditOpen = _a.isEditOpen;
  return (
    <ButtonsContainer>
      <EditButton_1.default
        toggleEditTab={toggleEditTab}
        isEditOpen={isEditOpen}
      />
      <DeleteButton_1.default handleClick={openModal} />
      <MarkAsPaidButton_1.default invoice={invoice} />
    </ButtonsContainer>
  );
}
exports.default = ToolbarButtons;
ToolbarButtons.propTypes = {
  toggleEditTab: prop_types_1.default.func.isRequired,
  // invoice: PropTypes.object.isRequired,
  openModal: prop_types_1.default.func.isRequired,
};
var templateObject_1;
