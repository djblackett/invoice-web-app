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
exports.FormEntryContainer = void 0;
var styled_components_1 = require("styled-components");
var react_1 = require("react");
exports.FormEntryContainer = styled_components_1.default.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  align-items: flex-start;\n  font-style: ",
        ";\n  width: 45%;\n\n  @media (min-width: 768px) {\n    width: 100%;\n    max-width: fit-content;\n  }\n",
      ],
      [
        "\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  align-items: flex-start;\n  font-style: ",
        ";\n  width: 45%;\n\n  @media (min-width: 768px) {\n    width: 100%;\n    max-width: fit-content;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.font;
  },
);
var OppositeWidthContainer = (0, styled_components_1.default)(
  exports.FormEntryContainer,
)(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      [
        "\n  width: 100%;\n\n  @media (min-width: 768px) {\n    width: 45%;\n    max-width: fit-content;\n  }\n",
      ],
      [
        "\n  width: 100%;\n\n  @media (min-width: 768px) {\n    width: 45%;\n    max-width: fit-content;\n  }\n",
      ],
    )),
);
// todo double check the mobile layout here
function FormEntry(_a) {
  // const [isDirty, setIsDirty] = useState(false);
  // const handleChange = () => {
  //   setIsDirty(true);
  // };
  var className = _a.className,
    isLongOnMobile = _a.isLongOnMobile,
    children = _a.children,
    style = _a.style;
  // const renderChildren = () => React.Children.map(children, (child) => React.cloneElement(child, {
  //   isDirty,
  // }));
  // mobile view gets a longer component, hence the awkward naming scheme here
  if (isLongOnMobile) {
    return (
      <OppositeWidthContainer
        // onChange={handleChange}
        // isDirty={isDirty}
        className={className}
        style={__assign({}, style)}
      >
        {children}
      </OppositeWidthContainer>
    );
  }
  return (
    <exports.FormEntryContainer
      // onChange={handleChange}
      // isDirty={isDirty}
      className={className}
    >
      {children}
    </exports.FormEntryContainer>
  );
}
FormEntry.defaultProps = {
  isLongOnMobile: false,
  style: {},
};
exports.default = FormEntry;
var templateObject_1, templateObject_2;
