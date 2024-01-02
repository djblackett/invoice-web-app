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
var react_1 = require("react");
var styled_components_1 = require("styled-components");
var react_redux_1 = require("react-redux");
var prop_types_1 = require("prop-types");
var CheckboxSelection_1 = require("./CheckboxSelection");
var filterSlice_1 = require("../../features/invoices/filterSlice");
var Main = (0, styled_components_1.default)("div")(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  align-self: center;\n  box-sizing: border-box;\n  background: transparent;\n  z-index: 5;\n  width: 8px;\n  cursor: pointer;\n  margin-left: 0;\n  position: relative;\n\n  @media (min-width: 325px) {\n    margin-left: 8px;\n  }\n\n  @media (min-width: 350px) {\n    margin-left: 16px;\n  }\n",
      ],
      [
        "\n  align-self: center;\n  box-sizing: border-box;\n  background: transparent;\n  z-index: 5;\n  width: 8px;\n  cursor: pointer;\n  margin-left: 0;\n  position: relative;\n\n  @media (min-width: 325px) {\n    margin-left: 8px;\n  }\n\n  @media (min-width: 350px) {\n    margin-left: 16px;\n  }\n",
      ],
    )),
);
var DropDownContainer = (0, styled_components_1.default)("div")(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      [
        "\n  width: 8px;\n  margin: 0 auto;\n  z-index: 10;\n  background: transparent;\n",
      ],
      [
        "\n  width: 8px;\n  margin: 0 auto;\n  z-index: 10;\n  background: transparent;\n",
      ],
    )),
);
var DropDownHeader = styled_components_1.default.div.attrs({
  tabIndex: 0,
})(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      [
        "\n  display: flex;\n  z-index: -1;\n  justify-content: center;\n  align-items: center;\n  align-self: center;\n  box-sizing: border-box;\n  width: 12px;\n  font-weight: 600;\n  font-size: 1.2rem;\n  color: ",
        ";\n  border-radius: 6px;\n\n \n  \n",
      ],
      [
        "\n  display: flex;\n  z-index: -1;\n  justify-content: center;\n  align-items: center;\n  align-self: center;\n  box-sizing: border-box;\n  width: 12px;\n  font-weight: 600;\n  font-size: 1.2rem;\n  color: ",
        ";\n  border-radius: 6px;\n\n \n  \n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.text;
  },
);
var DropDownListContainer = (0, styled_components_1.default)("div")(
  templateObject_4 ||
    (templateObject_4 = __makeTemplateObject(
      [
        "\n  position: absolute;\n  width: 150px;\n  left: -75px;\n  top: 24px;\n  background-color: ",
        ";\n  border-radius: 8px;\n  overflow: hidden;\n  box-shadow: ",
        ";\n  \n  transition: height 250ms;\n\n  @media (min-width: 768px) {\n    left: -130px;\n  }\n",
      ],
      [
        "\n  position: absolute;\n  width: 150px;\n  left: -75px;\n  top: 24px;\n  background-color: ",
        ";\n  border-radius: 8px;\n  overflow: hidden;\n  box-shadow: ",
        ";\n  \n  transition: height 250ms;\n\n  @media (min-width: 768px) {\n    left: -130px;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.background;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.filterShadow;
  },
);
var DropDownList = (0, styled_components_1.default)("ul")(
  templateObject_5 ||
    (templateObject_5 = __makeTemplateObject(
      [
        "\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  padding: 0;\n  padding-top: 12px;\n  padding-bottom: 12px;\n  margin: 0;\n  background-color: ",
        ";\n  box-sizing: border-box;\n  border-radius: 8px;\n  color: ",
        ";\n  font-size: 1.2rem;\n  font-weight: 700;\n",
      ],
      [
        "\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  padding: 0;\n  padding-top: 12px;\n  padding-bottom: 12px;\n  margin: 0;\n  background-color: ",
        ";\n  box-sizing: border-box;\n  border-radius: 8px;\n  color: ",
        ";\n  font-size: 1.2rem;\n  font-weight: 700;\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.background;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.text;
  },
);
var ListItem = styled_components_1.default.li.attrs({})(
  templateObject_6 ||
    (templateObject_6 = __makeTemplateObject(
      [
        "\n  display: flex;\n  flex-grow: 0;\n\n  align-items: center;\n  justify-content: center;\n  list-style: none;\n  padding: 0.5rem;\n \n  width: 100%;\n  background-color: ",
        ";\n\n   &:hover {\n     .styledCheckbox {\n       border-color ",
        ";\n  //box-shadow:0 0 1px 1px #102447;\n  //     border-radius: 3px;\n     }\n   }\n",
      ],
      [
        "\n  display: flex;\n  flex-grow: 0;\n\n  align-items: center;\n  justify-content: center;\n  list-style: none;\n  padding: 0.5rem;\n \n  width: 100%;\n  background-color: ",
        ";\n\n   &:hover {\n     .styledCheckbox {\n       border-color ",
        ";\n  //box-shadow:0 0 1px 1px #102447;\n  //     border-radius: 3px;\n     }\n   }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.background;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.outline;
  },
);
var ItemButton = styled_components_1.default.button(
  templateObject_7 ||
    (templateObject_7 = __makeTemplateObject(
      [
        "\n  display: flex;\n  align-items: center;\n  height: 100%;\n  width: 100%;\n  background-color: ",
        ";\n  border: none;\n  color: ",
        ";\n  box-sizing: border-box;\n  cursor: pointer;\n",
      ],
      [
        "\n  display: flex;\n  align-items: center;\n  height: 100%;\n  width: 100%;\n  background-color: ",
        ";\n  border: none;\n  color: ",
        ";\n  box-sizing: border-box;\n  cursor: pointer;\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.background;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.text;
  },
);
function FilterDropDown(_a) {
  var icon = _a.icon,
    isOpen = _a.isOpen,
    options = _a.options;
  var dispatch = (0, react_redux_1.useDispatch)();
  var clickCallback = function (option) {
    return function (e) {
      e.stopPropagation();
      var lowerCaseOption = option.toLowerCase();
      dispatch((0, filterSlice_1.changeFilter)(lowerCaseOption));
    };
  };
  return (
    <Main>
      <DropDownContainer data-testid="filterDropDown">
        <DropDownHeader>{icon}</DropDownHeader>
        <DropDownListContainer style={{ height: isOpen ? "130px" : 0 }}>
          <DropDownList>
            {options.map(function (option) {
              return (
                <ListItem
                  key={"".concat(option, "-li")}
                  onClick={clickCallback(option)}
                >
                  <ItemButton>
                    <CheckboxSelection_1.default option={option} />
                  </ItemButton>
                </ListItem>
              );
            })}
          </DropDownList>
        </DropDownListContainer>
      </DropDownContainer>
    </Main>
  );
}
exports.default = FilterDropDown;
FilterDropDown.propTypes = {
  // icon: PropTypes.object,
  // handleClick: PropTypes.func,
  isOpen: prop_types_1.default.bool.isRequired,
  // options: PropTypes.array.isRequired,
  // onClickOutside: PropTypes.func,
};
var templateObject_1,
  templateObject_2,
  templateObject_3,
  templateObject_4,
  templateObject_5,
  templateObject_6,
  templateObject_7;
