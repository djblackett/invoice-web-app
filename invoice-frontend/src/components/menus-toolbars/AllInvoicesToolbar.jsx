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
exports.MemoizedAllInvoicesToolbar = void 0;
var styled_components_1 = require("styled-components");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var FilterDropDown_1 = require("./FilterDropDown");
var filterSlice_1 = require("../../features/invoices/filterSlice");
var useWindowWidth_1 = require("../../hooks/useWindowWidth");
var GridContainer = styled_components_1.default.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  display: grid;\n  height: 100%;\n  grid-template-rows: auto;\n  grid-template-columns: 1fr 1fr;\n  margin-top: 104px;\n  margin-bottom: 25px;\n  z-index: 1;\n  padding-left: 18px;\n  padding-right: 18px;\n  width: 100%;\n\n  @media (min-width: 325px) {\n    padding-left: 24px;\n    padding-right: 24px;\n    width: 100%;\n  }\n\n  @media (min-width: 600px) {\n    width: 100%;\n  }\n\n  @media (min-width: 768px) {\n    padding-left: 48px;\n    padding-right: 48px;\n  }\n\n\n  @media (min-width: 1200px) {\n    min-width: 730px;\n    max-width: 50%;\n    padding: 0;\n    justify-self: center;\n    margin-top: 72px;\n    height: 59px;\n    margin-bottom: 65px;\n  }\n",
      ],
      [
        "\n  display: grid;\n  height: 100%;\n  grid-template-rows: auto;\n  grid-template-columns: 1fr 1fr;\n  margin-top: 104px;\n  margin-bottom: 25px;\n  z-index: 1;\n  padding-left: 18px;\n  padding-right: 18px;\n  width: 100%;\n\n  @media (min-width: 325px) {\n    padding-left: 24px;\n    padding-right: 24px;\n    width: 100%;\n  }\n\n  @media (min-width: 600px) {\n    width: 100%;\n  }\n\n  @media (min-width: 768px) {\n    padding-left: 48px;\n    padding-right: 48px;\n  }\n\n\n  @media (min-width: 1200px) {\n    min-width: 730px;\n    max-width: 50%;\n    padding: 0;\n    justify-self: center;\n    margin-top: 72px;\n    height: 59px;\n    margin-bottom: 65px;\n  }\n",
      ],
    )),
);
var TitleBox = styled_components_1.default.div(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      [
        "\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n\n  @media (min-width: 768px) {\n    margin-left: 0;\n  }\n\n  @media (min-width: 1200px) {\n    margin-left: 0;\n  }\n",
      ],
      [
        "\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n\n  @media (min-width: 768px) {\n    margin-left: 0;\n  }\n\n  @media (min-width: 1200px) {\n    margin-left: 0;\n  }\n",
      ],
    )),
);
var Title = styled_components_1.default.h1(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      ["\n  margin: 0;\n  font-size: 2rem;\n"],
      ["\n  margin: 0;\n  font-size: 2rem;\n"],
    )),
);
var InvoicesLeft = styled_components_1.default.p(
  templateObject_4 ||
    (templateObject_4 = __makeTemplateObject(
      [
        "\n  margin: 0;\n\n  color: ",
        ";\n\n  .wideScreenText {\n    display: none;\n  }\n\n  @media (min-width: 768px) {\n    margin-top: 4px;\n\n    .wideScreenText {\n      display: inline;\n    }\n  }\n",
      ],
      [
        "\n  margin: 0;\n\n  color: ",
        ";\n\n  .wideScreenText {\n    display: none;\n  }\n\n  @media (min-width: 768px) {\n    margin-top: 4px;\n\n    .wideScreenText {\n      display: inline;\n    }\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.greyText;
  },
);
var ControlBox = styled_components_1.default.div(
  templateObject_5 ||
    (templateObject_5 = __makeTemplateObject(
      [
        "\n  display: flex;\n  justify-self: end;\n  flex-direction: row;\n  align-items: center;\n  justify-content: flex-end;\n\n  .largeScreenText {\n    display: none;\n  }\n\n  @media (min-width: 600px) {\n    margin-right: 0;\n    width: 308px;\n\n    .largeScreenText {\n      display: inline;\n      white-space: nowrap;\n    }\n  }\n\n  @media (min-width: 1200px) {\n    margin-right: 0;\n    justify-content: flex-end;\n  }\n",
      ],
      [
        "\n  display: flex;\n  justify-self: end;\n  flex-direction: row;\n  align-items: center;\n  justify-content: flex-end;\n\n  .largeScreenText {\n    display: none;\n  }\n\n  @media (min-width: 600px) {\n    margin-right: 0;\n    width: 308px;\n\n    .largeScreenText {\n      display: inline;\n      white-space: nowrap;\n    }\n  }\n\n  @media (min-width: 1200px) {\n    margin-right: 0;\n    justify-content: flex-end;\n  }\n",
      ],
    )),
);
var NewInvoiceButton = styled_components_1.default.div(
  templateObject_6 ||
    (templateObject_6 = __makeTemplateObject(
      [
        "\n  border-radius: 24px;\n  background-color: #7c5dfa;\n  height: 44px;\n  width: 90px;\n  display: flex;\n  align-items: center;\n  margin-left: 18px;\n  cursor: pointer;\n  padding-left: 0.5rem;\n\n  &:hover {\n    background-color: #9277ff;\n  }\n\n  @media (min-width: 600px) {\n    height: 48px;\n    width: 150px;\n    padding-right: 1rem;\n    margin-left: 40px;\n  }\n\n  @media (min-width: 1200px) {\n  }\n",
      ],
      [
        "\n  border-radius: 24px;\n  background-color: #7c5dfa;\n  height: 44px;\n  width: 90px;\n  display: flex;\n  align-items: center;\n  margin-left: 18px;\n  cursor: pointer;\n  padding-left: 0.5rem;\n\n  &:hover {\n    background-color: #9277ff;\n  }\n\n  @media (min-width: 600px) {\n    height: 48px;\n    width: 150px;\n    padding-right: 1rem;\n    margin-left: 40px;\n  }\n\n  @media (min-width: 1200px) {\n  }\n",
      ],
    )),
);
var arrowDownSVG = (
  <svg
    width="11"
    height="7"
    cursor="pointer"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1l4.228 4.228L9.456 1"
      stroke="#7C5DFA"
      strokeWidth="2"
      fill="none"
      fillRule="evenodd"
    />
  </svg>
);
var WhiteCircle = styled_components_1.default.div(
  templateObject_7 ||
    (templateObject_7 = __makeTemplateObject(
      [
        "\n  background-color: white;\n  border-radius: 50%;\n  height: 32px;\n  width: 32px;\n  margin: 8px;\n  margin-left: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n",
      ],
      [
        "\n  background-color: white;\n  border-radius: 50%;\n  height: 32px;\n  width: 32px;\n  margin: 8px;\n  margin-left: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n",
      ],
    )),
);
var NewText = styled_components_1.default.p(
  templateObject_8 ||
    (templateObject_8 = __makeTemplateObject(
      [
        "\n  color: white;\n  font-weight: bold;\n  letter-spacing: -0.25px;\n  white-space: nowrap;\n",
      ],
      [
        "\n  color: white;\n  font-weight: bold;\n  letter-spacing: -0.25px;\n  white-space: nowrap;\n",
      ],
    )),
);
var Filter = styled_components_1.default.p(
  templateObject_9 ||
    (templateObject_9 = __makeTemplateObject(
      [
        "\n  font-weight: bold;\n  margin: 0;\n  cursor: pointer;\n  white-space: nowrap;\n\n  .wideScreenText {\n    display: none;\n  }\n\n  @media (min-width: 768px) {\n    .wideScreenText {\n      display: inline;\n    }\n  }\n",
      ],
      [
        "\n  font-weight: bold;\n  margin: 0;\n  cursor: pointer;\n  white-space: nowrap;\n\n  .wideScreenText {\n    display: none;\n  }\n\n  @media (min-width: 768px) {\n    .wideScreenText {\n      display: inline;\n    }\n  }\n",
      ],
    )),
);
var FilterButton = styled_components_1.default.div(
  templateObject_10 ||
    (templateObject_10 = __makeTemplateObject(
      [
        "\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 50px;\n  width: fit-content;\n  cursor: pointer;\n  flex-direction: column;\n\n  @media (min-width: 325px) {\n    flex-direction: row;\n  }\n",
      ],
      [
        "\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 50px;\n  width: fit-content;\n  cursor: pointer;\n  flex-direction: column;\n\n  @media (min-width: 325px) {\n    flex-direction: row;\n  }\n",
      ],
    )),
);
var plusSignSVG = (
  <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z"
      fill="#7C5DFA"
      fillRule="nonzero"
    />
  </svg>
);
function AllInvoicesToolbar(_a) {
  var invoiceList = _a.invoiceList,
    setIsNewOpen = _a.setIsNewOpen;
  var _b = (0, react_1.useState)(false),
    isOpen = _b[0],
    setIsOpen = _b[1];
  var _c = (0, react_1.useState)("total"),
    filterText = _c[0],
    setFilterText = _c[1];
  var width = (0, useWindowWidth_1.default)();
  var openNewInvoice = function () {
    setIsNewOpen(true);
  };
  var toggling = function () {
    setIsOpen(!isOpen);
  };
  var filter = (0, react_redux_1.useSelector)(filterSlice_1.selectFilter);
  (0, react_1.useEffect)(
    function () {
      if (filter.pending && !filter.draft && !filter.paid) {
        setFilterText("pending");
      } else if (!filter.pending && filter.draft && !filter.paid) {
        setFilterText("draft");
      } else if (!filter.pending && !filter.draft && filter.paid) {
        setFilterText("paid");
      } else {
        setFilterText("total");
      }
    },
    [filter],
  );
  var invoiceNumber = width < 768 ? "No " : "no ";
  return (
    <GridContainer>
      <TitleBox>
        <Title data-testid="invoicesTitle">Invoices</Title>
        <InvoicesLeft>
          <span className="wideScreenText">There are </span>
          {invoiceList.length || invoiceNumber}{" "}
          <span className="wideScreenText"> {filterText} </span>
          invoices
        </InvoicesLeft>
      </TitleBox>
      <ControlBox>
        <FilterButton onClick={toggling} data-testid="filterButton">
          <Filter>
            Filter <span className="wideScreenText">by status</span>
          </Filter>
          <FilterDropDown_1.default
            icon={arrowDownSVG}
            isOpen={isOpen}
            options={["Draft", "Pending", "Paid"]}
          />
        </FilterButton>
        <NewInvoiceButton
          onClick={openNewInvoice}
          data-testid="newInvoiceButton"
        >
          <WhiteCircle>{plusSignSVG}</WhiteCircle>
          <NewText>
            New <span className="largeScreenText">Invoice</span>
          </NewText>
        </NewInvoiceButton>
      </ControlBox>
    </GridContainer>
  );
}
// AllInvoicesToolbar.propTypes = {
//   handleChangeFilter: PropTypes.func,
//   invoiceList: PropTypes.array.isRequired,
//   setIsNewOpen: PropTypes.func,
// };
exports.default = AllInvoicesToolbar;
exports.MemoizedAllInvoicesToolbar = react_1.default.memo(AllInvoicesToolbar);
var templateObject_1,
  templateObject_2,
  templateObject_3,
  templateObject_4,
  templateObject_5,
  templateObject_6,
  templateObject_7,
  templateObject_8,
  templateObject_9,
  templateObject_10;
