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
exports.deleteIcon =
  exports.SmallBoxContainer =
  exports.TotalBox =
  exports.Box =
  exports.SVG =
  exports.MobileHelperContainer =
  exports.MobileQuantityPrice =
  exports.QuantityPriceContainer =
  exports.Total =
  exports.Price =
  exports.Quantity =
  exports.ItemName =
  exports.ItemContainer =
    void 0;
var styled_components_1 = require("styled-components");
exports.ItemContainer = styled_components_1.default.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  display: flex;\n  width: 100%;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  padding-top: 0;\n  grid-template: auto auto / 1fr 1fr;\n  grid-auto-flow: dense;\n  background-color: ",
        ";\n  margin-bottom: 3rem;\n  \n  @media (min-width: 600px) {\n    height: 72px;\n    width: 100%;\n    display: grid;\n    \n    // Setting the px of the grid column keeps the form fields lined up.\n    grid-template: 1fr / 220px 62px 116px 61px 45px;\n    justify-items: start;\n    margin-bottom: initial;\n  }\n",
      ],
      [
        "\n  display: flex;\n  width: 100%;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  padding-top: 0;\n  grid-template: auto auto / 1fr 1fr;\n  grid-auto-flow: dense;\n  background-color: ",
        ";\n  margin-bottom: 3rem;\n  \n  @media (min-width: 600px) {\n    height: 72px;\n    width: 100%;\n    display: grid;\n    \n    // Setting the px of the grid column keeps the form fields lined up.\n    grid-template: 1fr / 220px 62px 116px 61px 45px;\n    justify-items: start;\n    margin-bottom: initial;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.formBackground;
  },
);
var Input = styled_components_1.default.input(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      [
        "\n  width: 240px;\n  height: 48px;\n  border-radius: 4px;\n  border: 1px solid ",
        ";\n  //border-style: solid;\n  //border-width: 1px;\n  outline: none;\n  padding: 17px 20px 16px 20px;\n  margin-bottom: 1.5rem;\n  font-family: ",
        ";\n  font-style: normal;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: ",
        ";\n  background-color: ",
        ";\n  cursor: pointer;\n\n  &:focus, &:hover {\n    border-color: ",
        ";\n  }\n\n  .custom-input {\n    padding: 0;\n  }\n",
      ],
      [
        "\n  width: 240px;\n  height: 48px;\n  border-radius: 4px;\n  border: 1px solid ",
        ";\n  //border-style: solid;\n  //border-width: 1px;\n  outline: none;\n  padding: 17px 20px 16px 20px;\n  margin-bottom: 1.5rem;\n  font-family: ",
        ";\n  font-style: normal;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: ",
        ";\n  background-color: ",
        ";\n  cursor: pointer;\n\n  &:focus, &:hover {\n    border-color: ",
        ";\n  }\n\n  .custom-input {\n    padding: 0;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.formFieldOutline;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.font;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.textPlain;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.inputBackgroundColor;
  },
  function (_a) {
    var theme = _a.theme;
    return theme.formFieldOutlineFocus;
  },
);
exports.ItemName = (0, styled_components_1.default)(Input)(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      [
        "\n  white-space: nowrap;\n  justify-self: start;\n  width: 100%;\n  margin: 0;\n  padding-left: 1.25rem;\n  color: ",
        ";\n  font-style: normal;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  \n  border: ",
        ";\n  \n\n  @media (min-width: 600px) {\n    width: 204px;\n  }\n",
      ],
      [
        "\n  white-space: nowrap;\n  justify-self: start;\n  width: 100%;\n  margin: 0;\n  padding-left: 1.25rem;\n  color: ",
        ";\n  font-style: normal;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  \n  border: ",
        ";\n  \n\n  @media (min-width: 600px) {\n    width: 204px;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.text;
  },
  function (props) {
    return props.invalid ? "1px solid red" : "";
  },
);
exports.Quantity = (0, styled_components_1.default)(Input).attrs({
  pattern: "\\d+",
})(
  templateObject_4 ||
    (templateObject_4 = __makeTemplateObject(
      [
        "\n  width: 64px;\n  margin: 0;\n  color: ",
        ";\n  padding: 0;\n  padding-left: 1.25rem;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  text-align: left;\n  letter-spacing: -0.25px;\n\n  @media (min-width: 600px) {\n    text-align: center;\n    width: 46px;\n    display: inline;\n    padding: 0;\n  }\n",
      ],
      [
        "\n  width: 64px;\n  margin: 0;\n  color: ",
        ";\n  padding: 0;\n  padding-left: 1.25rem;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  text-align: left;\n  letter-spacing: -0.25px;\n\n  @media (min-width: 600px) {\n    text-align: center;\n    width: 46px;\n    display: inline;\n    padding: 0;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.textPlain;
  },
);
exports.Price = (0, styled_components_1.default)(exports.Quantity).attrs({
  pattern: "[0-9.]*",
})(
  templateObject_5 ||
    (templateObject_5 = __makeTemplateObject(
      [
        "\n  width: 80px;\n  padding-left: 1.25rem;\n  text-align: left;\n\n  @media (min-width: 325px) {\n    width: 100px;\n    padding-left: 1.25rem;\n    text-align: left;\n  }\n",
      ],
      [
        "\n  width: 80px;\n  padding-left: 1.25rem;\n  text-align: left;\n\n  @media (min-width: 325px) {\n    width: 100px;\n    padding-left: 1.25rem;\n    text-align: left;\n  }\n",
      ],
    )),
);
exports.Total = styled_components_1.default.p(
  templateObject_6 ||
    (templateObject_6 = __makeTemplateObject(
      [
        "\n  min-width: 40px;\n  align-self: center;\n  height: fit-content;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: ",
        ";\n  \n  @media (min-width: 325px) {\n    \n  }\n  \n  @media (min-width: 600px) {\n    grid-area: initial;\n    text-align: center;\n    min-width: 60px;\n  }\n",
      ],
      [
        "\n  min-width: 40px;\n  align-self: center;\n  height: fit-content;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: ",
        ";\n  \n  @media (min-width: 325px) {\n    \n  }\n  \n  @media (min-width: 600px) {\n    grid-area: initial;\n    text-align: center;\n    min-width: 60px;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.greyText;
  },
);
exports.QuantityPriceContainer = styled_components_1.default.div(
  templateObject_7 ||
    (templateObject_7 = __makeTemplateObject(
      [
        "\n  display: none;\n\n  @media (min-width: 600px) {\n    display: contents;\n  }\n",
      ],
      [
        "\n  display: none;\n\n  @media (min-width: 600px) {\n    display: contents;\n  }\n",
      ],
    )),
);
exports.MobileQuantityPrice = styled_components_1.default.p(
  templateObject_8 ||
    (templateObject_8 = __makeTemplateObject(
      [
        "\n  display: inline;\n  grid-area: 2 / 1 / 3 / 2;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  margin: 0;\n  margin-top: 0.5rem;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: ",
        ";\n  \n  @media (min-width: 600px) {\n    display: none;\n  }\n",
      ],
      [
        "\n  display: inline;\n  grid-area: 2 / 1 / 3 / 2;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  margin: 0;\n  margin-top: 0.5rem;\n  /* identical to box height, or 125% */\n  letter-spacing: -0.25px;\n  color: ",
        ";\n  \n  @media (min-width: 600px) {\n    display: none;\n  }\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.greyText;
  },
);
exports.MobileHelperContainer = styled_components_1.default.div(
  templateObject_9 ||
    (templateObject_9 = __makeTemplateObject(
      [
        "\n  //display: flex;\n  //flex-direction: column;\n  //justify-content: center;\n  display: grid;\n  grid-template: 1fr / 220px 62px 116px 61px 49px;;\n\n  //@media (min-width: 600px) {\n    //display: contents;\n  //}\n",
      ],
      [
        "\n  //display: flex;\n  //flex-direction: column;\n  //justify-content: center;\n  display: grid;\n  grid-template: 1fr / 220px 62px 116px 61px 49px;;\n\n  //@media (min-width: 600px) {\n    //display: contents;\n  //}\n",
      ],
    )),
);
exports.SVG = styled_components_1.default.svg(
  templateObject_10 ||
    (templateObject_10 = __makeTemplateObject(
      [
        "\n  width: 13px;\n  height: 16px;\n  justify-self: end;\n  align-self: center;\n  cursor: pointer;\n  outline: none;\n\n  .deleteIconPath {\n    fill: #888eb0;\n    outline: none;\n    &:hover {\n      fill: red;\n    }\n    \n    &:focus {\n      fill: red;\n    }\n  }\n",
      ],
      [
        "\n  width: 13px;\n  height: 16px;\n  justify-self: end;\n  align-self: center;\n  cursor: pointer;\n  outline: none;\n\n  .deleteIconPath {\n    fill: #888eb0;\n    outline: none;\n    &:hover {\n      fill: red;\n    }\n    \n    &:focus {\n      fill: red;\n    }\n  }\n",
      ],
    )),
);
exports.Box = styled_components_1.default.div(
  templateObject_11 ||
    (templateObject_11 = __makeTemplateObject(
      [
        "\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  height: fit-content;\n  width: fit-content;\n",
      ],
      [
        "\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  height: fit-content;\n  width: fit-content;\n",
      ],
    )),
);
exports.TotalBox = (0, styled_components_1.default)(exports.Box)(
  templateObject_12 ||
    (templateObject_12 = __makeTemplateObject(
      [
        "\ntext-align: right;\n  align-items: flex-end;\n  @media (min-width: 325px) {\n    align-items: flex-start;\n    text-align: initial;\n  }\n",
      ],
      [
        "\ntext-align: right;\n  align-items: flex-end;\n  @media (min-width: 325px) {\n    align-items: flex-start;\n    text-align: initial;\n  }\n",
      ],
    )),
);
exports.SmallBoxContainer = styled_components_1.default.div(
  templateObject_13 ||
    (templateObject_13 = __makeTemplateObject(
      [
        "\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  width: 80%;\n  align-items: center;\n\n  @media (min-width: 325px) {\n    width: 90%;\n  }\n  \n  @media (min-width: 600px) {\n    width: 80%;\n  }\n",
      ],
      [
        "\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  width: 80%;\n  align-items: center;\n\n  @media (min-width: 325px) {\n    width: 90%;\n  }\n  \n  @media (min-width: 600px) {\n    width: 80%;\n  }\n",
      ],
    )),
);
exports.deleteIcon = (
  <path
    d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
    fillRule="nonzero"
    className="deleteIconPath"
    tabIndex={0}
  />
);
var templateObject_1,
  templateObject_2,
  templateObject_3,
  templateObject_4,
  templateObject_5,
  templateObject_6,
  templateObject_7,
  templateObject_8,
  templateObject_9,
  templateObject_10,
  templateObject_11,
  templateObject_12,
  templateObject_13;