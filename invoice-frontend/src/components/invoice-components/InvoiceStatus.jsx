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
var styled_components_1 = require("styled-components");
var prop_types_1 = require("prop-types");
var InvoiceStatusBox = styled_components_1.default.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  padding: 13px 23px 12px 24px;\n  border-radius: 6px;\n  height: 40px;\n  width: 104px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  justify-self: end;\n  \n  @media (min-width: 600px) {\n    justify-self: start;\n  }\n\n",
      ],
      [
        "\n  padding: 13px 23px 12px 24px;\n  border-radius: 6px;\n  height: 40px;\n  width: 104px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  justify-self: end;\n  \n  @media (min-width: 600px) {\n    justify-self: start;\n  }\n\n",
      ],
    )),
);
var TextCircleBox = styled_components_1.default.div(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      [
        "\n  display: flex;\n  flex-direction: row;\n  align-items: baseline;\n  justify-content: space-between;\n",
      ],
      [
        "\n  display: flex;\n  flex-direction: row;\n  align-items: baseline;\n  justify-content: space-between;\n",
      ],
    )),
);
var StatusText = styled_components_1.default.p(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      [
        "\n  margin: 0;\n  color: inherit;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n\n  letter-spacing: -0.25px;\n",
      ],
      [
        "\n  margin: 0;\n  color: inherit;\n  font-weight: 700;\n  font-size: 12px;\n  line-height: 15px;\n  /* identical to box height, or 125% */\n\n  letter-spacing: -0.25px;\n",
      ],
    )),
);
var Circle = styled_components_1.default.div(
  templateObject_4 ||
    (templateObject_4 = __makeTemplateObject(
      [
        "\n  border-radius: 50%;\n  height: 8px;\n  width: 8px;\n  margin-right: 4px;\n  background-color: inherit;\n",
      ],
      [
        "\n  border-radius: 50%;\n  height: 8px;\n  width: 8px;\n  margin-right: 4px;\n  background-color: inherit;\n",
      ],
    )),
);
function InvoiceStatus(_a) {
  var text = _a.text,
    statusType = _a.statusType;
  return (
    <InvoiceStatusBox className={statusType}>
      <TextCircleBox>
        <Circle className="circle" />
        <StatusText>{text}</StatusText>
      </TextCircleBox>
    </InvoiceStatusBox>
  );
}
InvoiceStatus.propTypes = {
  text: prop_types_1.default.string.isRequired,
  statusType: prop_types_1.default.string.isRequired,
};
exports.default = InvoiceStatus;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
