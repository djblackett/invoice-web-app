"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_hook_form_1 = require("react-hook-form");
var prop_types_1 = require("prop-types");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var editStyles_1 = require("../../styles/editStyles");
var LongFormEntry_1 = require("./LongFormEntry");
var CompanyFormInfo_1 = require("./CompanyFormInfo");
var DateAndPayment_1 = require("./DateAndPayment");
var EditFormItemList_1 = require("./EditFormItemList");
var NewInvoiceBottomMenu_1 = require("../menus-toolbars/NewInvoiceBottomMenu");
var invoicesSlice_1 = require("../../features/invoices/invoicesSlice");
var utilityFunctions_1 = require("../../utils/utilityFunctions");
var FormErrorList_1 = require("./FormErrorList");
var ClientFormInfo_1 = require("./ClientFormInfo");
function NewInvoiceForm(_a) {
    var editPageWidth = _a.editPageWidth, startDate = _a.startDate, setStartDate = _a.setStartDate, isNewOpen = _a.isNewOpen, setIsNewOpen = _a.setIsNewOpen, isDraft = _a.isDraft, setIsDraft = _a.setIsDraft, setSelectedPaymentOption = _a.setSelectedPaymentOption, selectedPaymentOption = _a.selectedPaymentOption;
    var methods = (0, react_hook_form_1.useForm)({
        mode: "onChange",
        defaultValues: {
            status: "draft",
            city: "",
            country: "",
            postalCode: "",
            streetAddress: "",
            clientName: "",
            clientEmail: "",
            clientStreetAddress: "",
            clientCity: "",
            clientCountry: "",
            clientPostalCode: "",
            projectDescription: "",
            items: [{ id: "", name: "", quantity: 0, price: 0, total: 0 }],
        },
    });
    var register = methods.register, _b = methods.formState, errors = _b.errors, isSubmitSuccessful = _b.isSubmitSuccessful, reset = methods.reset, getValues = methods.getValues, trigger = methods.trigger, watch = methods.watch, setError = methods.setError;
    var dispatch = (0, react_redux_1.useDispatch)();
    var watcher = watch();
    var onSubmit = function () {
        var data = getValues();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (!data.items || data.items.length === 0) {
            setError("items", { type: "custom", message: "An item must be added" });
        }
        // trigger validation on fields
        trigger().then(function (value) {
            if (value) {
                // console.log("validation success");
                // todo - refactor so no undefined are necessary here
                var newInvoice = (0, utilityFunctions_1.createInvoiceObject)(data, startDate, selectedPaymentOption, undefined, undefined);
                dispatch((0, invoicesSlice_1.addInvoice)(newInvoice));
                setIsNewOpen(false);
                setSelectedPaymentOption(1);
                setIsDraft(true);
            }
            else {
                setIsDraft(true);
            }
        });
    };
    var _c = (0, react_1.useState)(false), isPaymentOpen = _c[0], setIsPaymentOpen = _c[1];
    (0, react_1.useEffect)(function () {
        reset();
    }, [isSubmitSuccessful]);
    var handlePaymentClick = function () {
        setIsPaymentOpen(!isPaymentOpen);
    };
    var handleChangeSelectedOption = function (option) {
        setSelectedPaymentOption(option);
    };
    // const handlePaymentSelect = (e: SyntheticEvent) => {
    //   e.preventDefault();
    //   setIsPaymentOpen(false);
    // };
    (0, react_1.useEffect)(function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (!watcher.items || watcher.items.length === 0) {
            setError("items", { type: "custom", message: "An item must be added" });
        }
    }, [watcher.items]);
    return (
    // "handleSubmit" will validate your inputs before invoking "onSubmit"
    <react_hook_form_1.FormProvider {...methods}>
      <form>
        {/* register your input into the hook by invoking the "register" function , {required: !isDraft */}

        <editStyles_1.BillText>Bill From</editStyles_1.BillText>
        <CompanyFormInfo_1.CompanyFormInfo isDraft={isDraft} editPageWidth={editPageWidth}/>

        {/*   client details */}
        <editStyles_1.BillText>Bill To</editStyles_1.BillText>
        <ClientFormInfo_1.default isDraft={isDraft} editPageWidth={editPageWidth}/>

        <DateAndPayment_1.default selected={startDate} onChange={function (date) { return setStartDate(date); }} 
    // handlePaymentSelect={handlePaymentSelect}
    paymentOpen={isPaymentOpen} handlePaymentClick={handlePaymentClick} selectedPaymentOption={selectedPaymentOption} handleChangeSelectedOption={handleChangeSelectedOption}/>

        <LongFormEntry_1.default className="project-description">
          <editStyles_1.Label htmlFor="projectDescription" style={{ color: errors.projectDescription ? "#EC5757" : "" }}>
            Project Description
          </editStyles_1.Label>
          <editStyles_1.Input $long type="text" {...register("projectDescription", { required: !isDraft })} style={{
            border: errors.projectDescription ? "1px solid #EC5757" : "",
        }}/>
        </LongFormEntry_1.default>

        <EditFormItemList_1.default isDraft={isDraft} invoice={undefined}/>

        <FormErrorList_1.default isEditOpen={isNewOpen}/>
        <NewInvoiceBottomMenu_1.default setIsDraft={setIsDraft} setIsOpen={setIsNewOpen} saveText="Save & Send" closeText="Discard" justifyCancel="flex-start" onSubmit={onSubmit}/>
      </form>
    </react_hook_form_1.FormProvider>);
}
exports.default = NewInvoiceForm;
NewInvoiceForm.propTypes = {
    editPageWidth: prop_types_1.default.number.isRequired,
    // startDate: PropTypes.object.isRequired,
    setStartDate: prop_types_1.default.func.isRequired,
    setIsNewOpen: prop_types_1.default.func.isRequired,
    isDraft: prop_types_1.default.bool.isRequired,
    setIsDraft: prop_types_1.default.func.isRequired,
    setSelectedPaymentOption: prop_types_1.default.func.isRequired,
    selectedPaymentOption: prop_types_1.default.number.isRequired,
    isNewOpen: prop_types_1.default.bool.isRequired,
};
