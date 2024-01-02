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
/* eslint-disable react/display-name */
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var prop_types_1 = require("prop-types");
var react_redux_1 = require("react-redux");
var yup_1 = require("@hookform/resolvers/yup");
var react_router_dom_1 = require("react-router-dom");
var invoicesSlice_1 = require("../features/invoices/invoicesSlice");
require("../styles/react-datepicker.css");
var useWindowWidth_1 = require("../hooks/useWindowWidth");
var EditBottomMenu_1 = require("../components/menus-toolbars/EditBottomMenu");
var editStyles_1 = require("../styles/editStyles");
var CompanyFormInfo_1 = require("../components/form-components/CompanyFormInfo");
var ClientFormInfo_1 = require("../components/form-components/ClientFormInfo");
var DateAndPayment_1 = require("../components/form-components/DateAndPayment");
var LongFormEntry_1 = require("../components/form-components/LongFormEntry");
var schemas_1 = require("../types/schemas");
var FormErrorList_1 = require("../components/form-components/FormErrorList");
var EditFormItemList_1 = require("../components/form-components/EditFormItemList");
var utilityFunctions_1 = require("../utils/utilityFunctions");
var formOptions = {
  resolver: (0, yup_1.yupResolver)(schemas_1.validationSchema),
};
function EditForm(_a) {
  var isEditOpen = _a.isEditOpen,
    setIsEditOpen = _a.setIsEditOpen,
    padding = _a.padding,
    setPadding = _a.setPadding;
  var methods = (0, react_hook_form_1.useForm)(
    __assign(__assign({}, formOptions), { mode: "onChange" }),
  );
  var register = methods.register,
    handleSubmit = methods.handleSubmit,
    errors = methods.formState.errors,
    getValues = methods.getValues,
    watch = methods.watch,
    trigger = methods.trigger,
    reset = methods.reset,
    setError = methods.setError,
    clearErrors = methods.clearErrors;
  var width = (0, useWindowWidth_1.default)();
  var id = (0, react_router_dom_1.useParams)().id;
  var dispatch = (0, react_redux_1.useDispatch)();
  var watcher = watch();
  var invoice = (0, react_redux_1.useSelector)(function (state) {
    return (0, invoicesSlice_1.selectInvoiceById)(state, id);
  });
  var _b = (0, react_1.useState)(0),
    editPageWidth = _b[0],
    setEditPageWidth = _b[1];
  var _c = (0, react_1.useState)(
      (0, utilityFunctions_1.convertStringToDate)(
        invoice === null || invoice === void 0 ? void 0 : invoice.createdAt,
      ),
    ),
    startDate = _c[0],
    setStartDate = _c[1];
  var _d = (0, react_1.useState)(
      (invoice === null || invoice === void 0
        ? void 0
        : invoice.paymentTerms) || 1,
    ),
    selectedPaymentOption = _d[0],
    setSelectedPaymentOption = _d[1];
  var _e = (0, react_1.useState)(false),
    isPaymentOpen = _e[0],
    setIsPaymentOpen = _e[1];
  // error notification if invoice has no items
  (0, react_1.useEffect)(
    function () {
      if (!watcher.items || watcher.items.length === 0) {
        setError("items", { type: "custom", message: "An item must be added" });
      }
    },
    [watcher.items],
  );
  (0, react_1.useEffect)(
    function () {
      if (invoice) {
        setSelectedPaymentOption(invoice.paymentTerms);
      }
    },
    [invoice],
  );
  var onSubmit = function () {
    var data = getValues();
    // alternate check for items
    // returns without submitting invoice
    if (!data.items || data.items.length === 0) {
      setError("items", { type: "custom", message: "An item must be added" });
      return;
    }
    // trigger validation on fields
    trigger().then(function (value) {
      if (value) {
        // console.log("validation success");
        var newInvoice = (0, utilityFunctions_1.createInvoiceObject)(
          data,
          startDate,
          selectedPaymentOption,
          id,
          invoice,
        );
        // console.log(data.items);
        dispatch((0, invoicesSlice_1.updateInvoice)(newInvoice));
        clearErrors();
        setIsEditOpen(false);
        setSelectedPaymentOption(1); // todo check this
        // console.log(newInvoice);
        reset();
        // console.log("Form reset");
      }
    });
  };
  // calculates width and padding of editForm depending on window width and whether the edit tab is open
  (0, react_1.useLayoutEffect)(
    function () {
      if (width > 1200 && isEditOpen) {
        setEditPageWidth(616);
        setPadding("2.5rem 2.5rem 2rem calc(2.5rem + 17px)");
      } else if (width < 1200 && width > 325 && isEditOpen) {
        setEditPageWidth(616);
        setPadding("2.5rem 2.5rem 2.5rem 2.5rem");
      } else if (width < 325 && isEditOpen) {
        setEditPageWidth(325);
        setPadding("2rem 1.5rem 2.5rem 1.5rem");
      } else if (width < 600 && isEditOpen) {
        setEditPageWidth(width);
        setPadding("1.5rem 1.5rem 1.5rem 1.5rem");
      } else if (!isEditOpen) {
        setEditPageWidth(0);
      }
    },
    [width, padding, isEditOpen],
  );
  // sets the payment option after change
  var handleChangeSelectedOption = function (option) {
    setSelectedPaymentOption(option);
  };
  // handles the payment dropdown upon click
  var handlePaymentClick = function () {
    setIsPaymentOpen(!isPaymentOpen);
  };
  // this shouldn't be possible, but better safe than sorry
  if (!invoice) {
    return null;
  }
  return (
    <editStyles_1.DarkenScreen
      style={{ visibility: isEditOpen ? "visible" : "hidden" }}
    >
      <editStyles_1.FormContainerDarkenModal
        style={{
          width: isEditOpen ? "".concat(editPageWidth, "px") : 0,
          padding: isEditOpen ? padding : 0,
        }}
      >
        <editStyles_1.EditTitle>
          Edit <span style={{ color: "#7E88C3" }}>#</span>
          {invoice && invoice.id.substring(0, 6)}
        </editStyles_1.EditTitle>

        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <react_hook_form_1.FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* register your input into the hook by invoking the "register" function */}

            {/* Company Details */}
            <editStyles_1.BillText>Bill From</editStyles_1.BillText>
            <CompanyFormInfo_1.CompanyFormInfo
              invoice={invoice}
              editPageWidth={editPageWidth}
              isDraft={false}
            />

            {/* //  Client details */}
            <editStyles_1.BillText>Bill To</editStyles_1.BillText>
            <ClientFormInfo_1.default
              editPageWidth={editPageWidth}
              invoice={invoice}
              isDraft={false}
            />

            <DateAndPayment_1.default
              selected={startDate}
              onChange={function (date) {
                return setStartDate(date);
              }}
              paymentOpen={isPaymentOpen}
              handlePaymentClick={handlePaymentClick}
              selectedPaymentOption={selectedPaymentOption}
              handleChangeSelectedOption={handleChangeSelectedOption}
            />

            <LongFormEntry_1.default className="project-description">
              <editStyles_1.Label
                htmlFor="projectDescription"
                style={{ color: errors.projectDescription ? "#EC5757" : "" }}
              >
                Project Description
              </editStyles_1.Label>
              <editStyles_1.Input
                // long
                type="text"
                defaultValue={
                  invoice === null || invoice === void 0
                    ? void 0
                    : invoice.description
                }
                {...register("projectDescription", { required: true })}
                style={{
                  border: errors.projectDescription ? "1px solid #EC5757" : "",
                }}
              />
            </LongFormEntry_1.default>

            <EditFormItemList_1.default
              invoice={invoice}
              isEditOpen={isEditOpen}
              isDraft={false}
            />

            <FormErrorList_1.default isEditOpen={isEditOpen} />

            <EditBottomMenu_1.default
              setIsOpen={setIsEditOpen}
              saveText="Save Changes"
              closeText="Cancel"
              // invoice={invoice}
              onSubmit={onSubmit}
              justifyCancel=""
            />
          </form>
        </react_hook_form_1.FormProvider>
      </editStyles_1.FormContainerDarkenModal>
    </editStyles_1.DarkenScreen>
  );
}
EditForm.propTypes = {
  isEditOpen: prop_types_1.default.bool.isRequired,
  setIsEditOpen: prop_types_1.default.func.isRequired,
  // handleClose: PropTypes.func,
  // invoice: PropTypes.object,
  // padding: PropTypes.string,
  // setPadding: PropTypes.func,
};
exports.default = EditForm;
