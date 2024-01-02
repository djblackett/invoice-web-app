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
var useWindowWidth_1 = require("../../hooks/useWindowWidth");
var ToolbarButtons_1 = require("../menus-toolbars/ToolbarButtons");
var InvoiceStatus_1 = require("./InvoiceStatus");
var Toolbar = styled_components_1.default.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  height: 88px;\n\n  display: contents;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: center;\n\n  width: 100%;\n  z-index: 1;\n\n  @media (min-width: 600px) {\n    display: flex;\n    \n    flex-direction: row;\n    background-color: ",
        ";\n    border-radius: 8px;\n  }\n  \n  @media (min-width: 1200px) {\n    max-width: 730px;\n  }\n\n  box-shadow: 0 10px 10px -10px rgba(72, 84, 159, 0.100397);\n",
      ],
      [
        "\n  height: 88px;\n\n  display: contents;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: center;\n\n  width: 100%;\n  z-index: 1;\n\n  @media (min-width: 600px) {\n    display: flex;\n    \n    flex-direction: row;\n    background-color: ",
        ";\n    border-radius: 8px;\n  }\n  \n  @media (min-width: 1200px) {\n    max-width: 730px;\n  }\n\n  box-shadow: 0 10px 10px -10px rgba(72, 84, 159, 0.100397);\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.background;
  },
);
var StatusContainer = styled_components_1.default.div(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      [
        "\n  display: flex;\n  height: 91px;\n  width: 100%;\n  padding: 10px 20px;\n  justify-content: space-between;\n  align-items: center;\n  background-color: ",
        ";\n  border-radius: 8px;\n\n  @media (min-width: 600px) {\n    background-color: initial;\n    justify-content: flex-start;\n  }\n",
      ],
      [
        "\n  display: flex;\n  height: 91px;\n  width: 100%;\n  padding: 10px 20px;\n  justify-content: space-between;\n  align-items: center;\n  background-color: ",
        ";\n  border-radius: 8px;\n\n  @media (min-width: 600px) {\n    background-color: initial;\n    justify-content: flex-start;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.background;
  },
);
var StatusText = styled_components_1.default.p(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      ["\n  margin-right: 1rem;\n  color: ", ";\n"],
      ["\n  margin-right: 1rem;\n  color: ", ";\n"],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.greyText;
  },
);
function InvoiceToolbar(_a) {
  var invoice = _a.invoice,
    isEditOpen = _a.isEditOpen,
    setEdit = _a.setEdit,
    setIsModalOpen = _a.setIsModalOpen;
  var openModal = function () {
    return setIsModalOpen(true);
  };
  var invoiceStatus = (0, react_1.useMemo)(
    function () {
      if (invoice.status === "paid") {
        return <InvoiceStatus_1.default statusType="paid" text="Paid" />;
      }
      if (invoice.status === "pending") {
        return <InvoiceStatus_1.default statusType="pending" text="Pending" />;
      }
      if (invoice.status === "draft") {
        return <InvoiceStatus_1.default statusType="draft" text="Draft" />;
      }
    },
    [invoice],
  );
  var width = (0, useWindowWidth_1.default)();
  return (
    <Toolbar
      className="invoice-toolbar"
      style={{
        display: width < 600 ? "contents" : "flex",
      }}
    >
      <StatusContainer>
        <StatusText>Status</StatusText>
        {invoiceStatus}
      </StatusContainer>
      <ToolbarButtons_1.default
        toggleEditTab={setEdit}
        isEditOpen={isEditOpen}
        invoice={invoice}
        openModal={openModal}
      />
    </Toolbar>
  );
}
exports.default = InvoiceToolbar;
InvoiceToolbar.propTypes = {
  // invoice: Proptypes.object.isRequired,
  setEdit: prop_types_1.default.func.isRequired,
  isEditOpen: prop_types_1.default.bool.isRequired,
  setIsModalOpen: prop_types_1.default.func.isRequired,
  // setItems: Proptypes.func,
  // isEditOpen: Proptypes.bool.isRequired,
};
var templateObject_1, templateObject_2, templateObject_3;
