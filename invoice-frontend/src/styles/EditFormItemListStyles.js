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
exports.ItemTitle =
  exports.ItemsContainer =
  exports.Col1 =
  exports.Col =
  exports.ItemsHeader =
  exports.ListContainer =
    void 0;
var styled_components_1 = require("styled-components");
exports.ListContainer = styled_components_1.default.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  display: grid;\n  width: 100%;\n  border-radius: 8px;\n  grid-template-rows: auto;\n  background-color: ",
        ";\n",
      ],
      [
        "\n  display: grid;\n  width: 100%;\n  border-radius: 8px;\n  grid-template-rows: auto;\n  background-color: ",
        ";\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.formBackground;
  },
);
exports.ItemsHeader = styled_components_1.default.div(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      [
        "\n  display: none;\n\n  @media (min-width: 600px) {\n    display: grid;\n    grid-template: 1fr / 220px 62px 116px 61px 49px;\n    color: ",
        ";\n    margin-top: 1rem;\n    padding-left: 0;\n    border-radius: 8px 8px 0 0;\n    justify-items: flex-start;\n  }\n",
      ],
      [
        "\n  display: none;\n\n  @media (min-width: 600px) {\n    display: grid;\n    grid-template: 1fr / 220px 62px 116px 61px 49px;\n    color: ",
        ";\n    margin-top: 1rem;\n    padding-left: 0;\n    border-radius: 8px 8px 0 0;\n    justify-items: flex-start;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.newItemText;
  },
);
exports.Col = styled_components_1.default.p(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      [
        "\n  color: ",
        ';\n  width: fit-content;\n  margin: 0;\n  padding: 0;\n  font-family: "Spartan", sans-serif;\n  font-style: normal;\n  font-weight: 500;\n  font-size: 11px;\n  line-height: 18px;\n  /* identical to box height, or 164% */\n  letter-spacing: -0.229167px;\n  justify-self: center;\n',
      ],
      [
        "\n  color: ",
        ';\n  width: fit-content;\n  margin: 0;\n  padding: 0;\n  font-family: "Spartan", sans-serif;\n  font-style: normal;\n  font-weight: 500;\n  font-size: 11px;\n  line-height: 18px;\n  /* identical to box height, or 164% */\n  letter-spacing: -0.229167px;\n  justify-self: center;\n',
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.newItemText;
  },
);
exports.Col1 = (0, styled_components_1.default)(exports.Col)(
  templateObject_4 ||
    (templateObject_4 = __makeTemplateObject(
      ["\n  justify-self: start;\n"],
      ["\n  justify-self: start;\n"],
    )),
);
exports.ItemsContainer = styled_components_1.default.div(
  templateObject_5 ||
    (templateObject_5 = __makeTemplateObject(
      [
        "\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: fit-content;\n  border-radius: 8px 8px 0 0;\n  background-color: ",
        ";\n  padding: 0;\n  transition: all 250ms ease-in-out;\n\n  @media (min-width: 768px) {\n    padding: 0;\n    border-radius: initial;\n    margin-top: initial;\n  }\n",
      ],
      [
        "\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: fit-content;\n  border-radius: 8px 8px 0 0;\n  background-color: ",
        ";\n  padding: 0;\n  transition: all 250ms ease-in-out;\n\n  @media (min-width: 768px) {\n    padding: 0;\n    border-radius: initial;\n    margin-top: initial;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.formBackground;
  },
);
exports.ItemTitle = styled_components_1.default.h1(
  templateObject_6 ||
    (templateObject_6 = __makeTemplateObject(
      [
        "\n  font-weight: 700;\n  font-size: 18px;\n  line-height: 32px;\n  /* identical to box height, or 178% */\n  letter-spacing: -0.375px;\n  color: ",
        ";\n  padding: 0;\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n\n  @media (min-width: 768px) {\n    margin-top: 2rem;\n  }\n",
      ],
      [
        "\n  font-weight: 700;\n  font-size: 18px;\n  line-height: 32px;\n  /* identical to box height, or 178% */\n  letter-spacing: -0.375px;\n  color: ",
        ";\n  padding: 0;\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n\n  @media (min-width: 768px) {\n    margin-top: 2rem;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.greyText;
  },
);
var templateObject_1,
  templateObject_2,
  templateObject_3,
  templateObject_4,
  templateObject_5,
  templateObject_6;
