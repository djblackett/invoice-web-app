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
var react_redux_1 = require("react-redux");
var react_toastify_1 = require("react-toastify");
var invoicesSlice_1 = require("../../features/invoices/invoicesSlice");
require("react-toastify/dist/ReactToastify.css");
var useWindowWidth_1 = require("../../hooks/useWindowWidth");
var Button = styled_components_1.default.button(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  background-color: ",
        ";\n  border-radius: 24px;\n  padding: 16px 24px 17px 24px;\n  color: white;\n  border: none;\n  cursor: pointer;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  margin: 0.25rem;\n  /* identical to box height, or 125% */\n\n  letter-spacing: -0.25px;\n  white-space: nowrap;\n\n  &:hover {\n    background-color: ",
        ";\n  }\n",
      ],
      [
        "\n  background-color: ",
        ";\n  border-radius: 24px;\n  padding: 16px 24px 17px 24px;\n  color: white;\n  border: none;\n  cursor: pointer;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  margin: 0.25rem;\n  /* identical to box height, or 125% */\n\n  letter-spacing: -0.25px;\n  white-space: nowrap;\n\n  &:hover {\n    background-color: ",
        ";\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.newButton;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.newButtonHover;
  },
);
function MarkAsPaidButton(_a) {
  var invoice = _a.invoice;
  var colorMode = localStorage.getItem("theme");
  var width = (0, useWindowWidth_1.default)();
  var theme = (0, styled_components_1.useTheme)();
  var dispatch = (0, react_redux_1.useDispatch)();
  var handleClick = function () {
    if (invoice.status === "pending") {
      dispatch((0, invoicesSlice_1.markAsPaid)(invoice.id));
      react_toastify_1.toast.success("💸 Invoice paid!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: colorMode || undefined,
      });
    }
  };
  return (
    <>
      <Button onClick={handleClick} type="button">
        Mark as Paid
      </Button>
      <react_toastify_1.ToastContainer
        style={{
          marginTop: width > 1200 ? 0 : "72px",
          backgroundColor: theme.background,
        }}
      />
    </>
  );
}
exports.default = MarkAsPaidButton;
var templateObject_1;
