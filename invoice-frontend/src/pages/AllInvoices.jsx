"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var styled_components_1 = require("styled-components");
var client_1 = require("@apollo/client");
var AllInvoicesToolbar_1 = require("../components/menus-toolbars/AllInvoicesToolbar");
var InvoiceGrid_1 = require("../components/invoice-components/InvoiceGrid");
var InvoiceCard_1 = require("../components/invoice-components/InvoiceCard");
var EmptyList_1 = require("../components/EmptyList");
var invoicesSlice_1 = require("../features/invoices/invoicesSlice");
var filterSlice_1 = require("../features/invoices/filterSlice");
var NewInvoice_1 = require("./NewInvoice");
var useWindowWidth_1 = require("../hooks/useWindowWidth");
var queries_1 = require("../graphql/queries");
var AllInvoicesContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  margin-bottom: 6.5rem;\n  z-index: 5;\n  overflow-y: auto;\n\n  @media (min-width: 1200px) {\n    padding-right: 48px;\n    padding-left: 48px;\n  }\n"], ["\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  margin-bottom: 6.5rem;\n  z-index: 5;\n  overflow-y: auto;\n\n  @media (min-width: 1200px) {\n    padding-right: 48px;\n    padding-left: 48px;\n  }\n"])));
function AllInvoices(_a) {
    var setScrollPosition = _a.setScrollPosition;
    var filter = (0, react_redux_1.useSelector)(filterSlice_1.selectFilter);
    var dispatch = (0, react_redux_1.useDispatch)();
    // const data = useSelector(selectInvoices);
    var invoiceResults = (0, client_1.useQuery)(queries_1.ALL_INVOICES);
    var _b = (0, react_1.useState)([]), invoiceList = _b[0], setInvoiceList = _b[1];
    var width = (0, useWindowWidth_1.default)();
    var _c = (0, react_1.useState)(false), isNewOpen = _c[0], setIsNewOpen = _c[1];
    var _d = (0, react_1.useState)(""), padding = _d[0], setPadding = _d[1];
    var linkStyleMobile = {
        width: "100%",
        textDecoration: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };
    var linkStyleDesktop = {
        width: "50%",
        minWidth: "730px",
        textDecoration: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };
    var scrollToTop = function () {
        setScrollPosition({ x: window.scrollX, y: window.scrollY });
        window.scrollTo(0, 0);
    };
    (0, react_1.useEffect)(function () {
        if (invoiceResults.data) {
            dispatch((0, invoicesSlice_1.addIdToExistingInvoices)());
        }
    }, [dispatch]);
    // Because the filter menu has 3 checkboxes, there are many cases to consider
    // All of them checked is the same as none of them checked - Nobody really wants an empty list
    (0, react_1.useEffect)(function () {
        var _a, _b;
        if (invoiceResults.data) {
            setInvoiceList((_b = (_a = invoiceResults === null || invoiceResults === void 0 ? void 0 : invoiceResults.data) === null || _a === void 0 ? void 0 : _a.allInvoices) === null || _b === void 0 ? void 0 : _b.filter(function (invoice) {
                if (!filter.draft && !filter.pending && !filter.paid) {
                    return true;
                }
                if (filter.draft && filter.pending && filter.paid) {
                    return true;
                }
                if (filter.draft && filter.paid) {
                    return invoice.status === "paid" || invoice.status === "draft";
                }
                if (filter.draft && filter.pending) {
                    return invoice.status === "pending" || invoice.status === "draft";
                }
                if (filter.pending && filter.paid) {
                    return invoice.status === "paid" || invoice.status === "pending";
                }
                if (filter.paid) {
                    return invoice.status === "paid";
                }
                if (filter.pending) {
                    return invoice.status === "pending";
                }
                if (filter.draft) {
                    return invoice.status === "draft";
                }
            }));
        }
    }, [filter, invoiceResults.data]);
    if (invoiceResults.loading) {
        return <h2>Loading</h2>;
    }
    if (invoiceResults.error) {
        return <h1>{invoiceResults.error.message}</h1>;
    }
    return (<AllInvoicesContainer>
      <AllInvoicesToolbar_1.MemoizedAllInvoicesToolbar invoiceList={invoiceList} setIsNewOpen={setIsNewOpen}/>
      <NewInvoice_1.default isNewOpen={isNewOpen} setIsNewOpen={setIsNewOpen} padding={padding} setPadding={setPadding}/>
      {invoiceList.length > 0 && (<InvoiceGrid_1.default>
          {invoiceList.map(function (invoice) { return (<react_router_dom_1.Link key={"".concat(invoice.id, "-link")} to={"/".concat(invoice.id)} style={width < 1200 ? linkStyleMobile : linkStyleDesktop} onClick={scrollToTop}>
              <InvoiceCard_1.default invoice={invoice} key={invoice.id}/>
            </react_router_dom_1.Link>); })}

          {invoiceList.length === 0 && <EmptyList_1.default />}
        </InvoiceGrid_1.default>)}

      {invoiceList.length === 0 && <EmptyList_1.default />}

      {/* Clear button is for debugging the empty invoices page */}
      {/* <button onClick={() => dispatch(clearInvoices())}>Clear Invoices</button> */}
    </AllInvoicesContainer>);
}
exports.default = AllInvoices;
var templateObject_1;
