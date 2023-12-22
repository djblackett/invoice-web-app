"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_redux_1 = require("react-redux");
var InvoiceToolbar_1 = require("../components/invoice-components/InvoiceToolbar");
var FullInvoice_1 = require("../components/invoice-components/FullInvoice");
var EditForm_1 = require("./EditForm");
var invoicesSlice_1 = require("../features/invoices/invoicesSlice");
var DeleteModal_1 = require("../components/DeleteModal");
var ViewInvoiceStyles_1 = require("../styles/ViewInvoiceStyles");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ViewInvoice(_a) {
    var scrollPosition = _a.scrollPosition;
    var id = (0, react_router_dom_1.useParams)().id;
    var invoice = (0, react_redux_1.useSelector)(function (state) { return (0, invoicesSlice_1.selectInvoiceById)(state, id); });
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = (0, react_1.useState)(false), isEditOpen = _b[0], setIsEditOpen = _b[1];
    var _c = (0, react_1.useState)(false), isModalOpen = _c[0], setIsModalOpen = _c[1];
    var _d = (0, react_1.useState)(""), padding = _d[0], setPadding = _d[1];
    var toggleEditTab = function () {
        setIsEditOpen(!isEditOpen);
    };
    var goBack = function () {
        navigate("/");
        // window.scrollTo(scrollPosition.x, scrollPosition.y);
    };
    // todo implement loading state when backend is implemented
    return (
    //  {!invoice && <h1>Loading</h1>}
    <ViewInvoiceStyles_1.ViewContainer>

      <EditForm_1.default isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen} padding={padding} setPadding={setPadding}/>
      <ViewInvoiceStyles_1.GoBackButton onClick={goBack}>
        <ViewInvoiceStyles_1.Icon>{ViewInvoiceStyles_1.arrowLeft}</ViewInvoiceStyles_1.Icon>
        <ViewInvoiceStyles_1.GoBack>Go back</ViewInvoiceStyles_1.GoBack>
      </ViewInvoiceStyles_1.GoBackButton>
      <InvoiceToolbar_1.default invoice={invoice} setEdit={toggleEditTab} setIsModalOpen={setIsModalOpen} isEditOpen={isEditOpen}/>
      <FullInvoice_1.default invoice={invoice}/>
      <DeleteModal_1.default setIsModalOpen={setIsModalOpen} invoice={invoice} isModalOpen={isModalOpen}/>
    </ViewInvoiceStyles_1.ViewContainer>);
}
exports.default = ViewInvoice;
// ViewInvoice.propTypes = {
//   scrollPosition: PropTypes.object,
//   setScrollPosition: PropTypes.func
// };
