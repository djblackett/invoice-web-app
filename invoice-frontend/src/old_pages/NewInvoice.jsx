"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var uuid_1 = require("uuid");
var NewInvoiceForm_1 = require("../components/form-components/NewInvoiceForm");
require("../styles/react-datepicker.css");
var useWindowWidth_1 = require("../hooks/useWindowWidth");
var editStyles_1 = require("../styles/editStyles");
function NewInvoice(_a) {
  var isNewOpen = _a.isNewOpen,
    setIsNewOpen = _a.setIsNewOpen,
    padding = _a.padding,
    setPadding = _a.setPadding;
  var width = (0, useWindowWidth_1.default)();
  // initial state and default values for form
  var _b = (0, react_1.useState)(true),
    isDraft = _b[0],
    setIsDraft = _b[1];
  var _c = (0, react_1.useState)(width),
    editPageWidth = _c[0],
    setEditPageWidth = _c[1];
  var _d = (0, react_1.useState)(new Date()),
    startDate = _d[0],
    setStartDate = _d[1];
  var _e = (0, react_1.useState)([]),
    items = _e[0],
    setItems = _e[1];
  var _f = (0, react_1.useState)(1),
    selectedPaymentOption = _f[0],
    setSelectedPaymentOption = _f[1];
  (0, react_1.useLayoutEffect)(
    function () {
      if (width > 1200 && isNewOpen) {
        setEditPageWidth(616);
        setPadding("2.5rem 2.5rem 2rem calc(2.5rem + 17px)");
      } else if (width < 1200 && width > 325 && isNewOpen) {
        setEditPageWidth(616);
        setPadding("2.5rem 2.5rem 2.5rem 2.5rem");
      } else if (width < 325 && isNewOpen) {
        setEditPageWidth(325);
        setPadding("2rem 1.5rem 2.5rem 1.5rem");
      } else if (!isNewOpen) {
        setEditPageWidth(0);
        setPadding("0px");
      }
    },
    [width, padding, isNewOpen],
  );
  (0, react_1.useLayoutEffect)(function () {
    var newItems = items.map(function (item) {
      return __assign(__assign({}, item), { id: (0, uuid_1.v4)() });
    });
    setItems(newItems);
  }, []);
  return (
    // DarkenScreen appears when newInvoice tab is open
    <editStyles_1.DarkenScreen
      style={{ visibility: isNewOpen ? "visible" : "hidden" }}
    >
      <editStyles_1.FormContainerDarkenModal
        style={{
          width: isNewOpen ? "".concat(editPageWidth, "px") : "0px",
          padding: padding,
        }}
        data-testid="newInvoicePage"
      >
        <editStyles_1.EditTitle>New Invoice</editStyles_1.EditTitle>

        <NewInvoiceForm_1.default
          startDate={startDate}
          setStartDate={setStartDate}
          isNewOpen={isNewOpen}
          setIsNewOpen={setIsNewOpen}
          editPageWidth={editPageWidth}
          isDraft={isDraft}
          setIsDraft={setIsDraft}
          selectedPaymentOption={selectedPaymentOption}
          setSelectedPaymentOption={setSelectedPaymentOption}
        />
      </editStyles_1.FormContainerDarkenModal>
    </editStyles_1.DarkenScreen>
  );
}
NewInvoice.propTypes = {
  isNewOpen: prop_types_1.default.bool.isRequired,
  setIsNewOpen: prop_types_1.default.func.isRequired,
  setPadding: prop_types_1.default.func.isRequired,
  padding: prop_types_1.default.string.isRequired,
};
exports.default = NewInvoice;
