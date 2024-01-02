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
exports.arrowLeft =
  exports.GoBack =
  exports.Icon =
  exports.GoBackButton =
  exports.ViewContainer =
    void 0;
var styled_components_1 = require("styled-components");
var react_1 = require("react");
exports.ViewContainer = styled_components_1.default.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  z-index: 5;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 100%;\n  justify-self: center;\n  align-self: center;\n  margin-top: 104px;\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n  \n  @media (min-width: 325px) {\n    padding-left: 1.5rem;\n    padding-right: 1.5rem;\n  }\n\n  @media (min-width: 768px) {\n    max-width: 730px;\n    padding-left: 0;\n    padding-right: 0;\n  }\n\n  @media (min-width: 1200px) {\n    margin-top: 4rem;\n  }\n",
      ],
      [
        "\n  z-index: 5;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 100%;\n  justify-self: center;\n  align-self: center;\n  margin-top: 104px;\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n  \n  @media (min-width: 325px) {\n    padding-left: 1.5rem;\n    padding-right: 1.5rem;\n  }\n\n  @media (min-width: 768px) {\n    max-width: 730px;\n    padding-left: 0;\n    padding-right: 0;\n  }\n\n  @media (min-width: 1200px) {\n    margin-top: 4rem;\n  }\n",
      ],
    )),
);
exports.GoBackButton = styled_components_1.default.div(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      [
        "\n  align-self: flex-start;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  border: none;\n  flex-direction: row;\n  cursor: pointer;\n  margin-bottom: 2rem;\n",
      ],
      [
        "\n  align-self: flex-start;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  border: none;\n  flex-direction: row;\n  cursor: pointer;\n  margin-bottom: 2rem;\n",
      ],
    )),
);
exports.Icon = styled_components_1.default.p(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      ["\n  color: ", ";\n  padding: 0;\n  margin: 0;\n  font-weight: 900;\n"],
      ["\n  color: ", ";\n  padding: 0;\n  margin: 0;\n  font-weight: 900;\n"],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.outline;
  },
);
exports.GoBack = styled_components_1.default.p(
  templateObject_4 ||
    (templateObject_4 = __makeTemplateObject(
      [
        "\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n  margin-left: 1rem;\n  \n  &:hover {\n    color: #7E88C3;\n  }\n",
      ],
      [
        "\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n  margin-left: 1rem;\n  \n  &:hover {\n    color: #7E88C3;\n  }\n",
      ],
    )),
);
exports.arrowLeft = (
  <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.342.886L2.114 5.114l4.228 4.228"
      stroke="#9277FF"
      strokeWidth="2"
      fill="none"
      fillRule="evenodd"
    />
  </svg>
);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
