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
exports.DarkenScreen = void 0;
var styled_components_1 = require("styled-components");
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var react_1 = require("react");
var DeleteButton_1 = require("./buttons/DeleteButton");
var invoicesSlice_1 = require("../features/invoices/invoicesSlice");
var CancelButton_1 = require("./buttons/CancelButton");
exports.DarkenScreen = styled_components_1.default.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: fixed;\n  min-height: 100%;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(0, 0, 0, 0.5);\n  z-index: 100;\n",
      ],
      [
        "\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: fixed;\n  min-height: 100%;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(0, 0, 0, 0.5);\n  z-index: 100;\n",
      ],
    )),
);
var ModalContainer = styled_components_1.default.div(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(
      [
        "\n  display: flex;\n  position: absolute;\n  align-items: flex-start;\n  justify-content: center;\n  flex-direction: column;\n  padding: 3rem;\n  background-color: ",
        ";\n  max-width: 480px;\n  border-radius: 8px;\n  box-shadow: 0px 10px 10px -10px rgba(72, 84, 159, 0.100397);\n  margin: 0 1.5rem;\n",
      ],
      [
        "\n  display: flex;\n  position: absolute;\n  align-items: flex-start;\n  justify-content: center;\n  flex-direction: column;\n  padding: 3rem;\n  background-color: ",
        ";\n  max-width: 480px;\n  border-radius: 8px;\n  box-shadow: 0px 10px 10px -10px rgba(72, 84, 159, 0.100397);\n  margin: 0 1.5rem;\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.background;
  },
);
var Confirm = styled_components_1.default.h1(
  templateObject_3 ||
    (templateObject_3 = __makeTemplateObject(
      [
        "\n  font-weight: 700;\n  font-size: 24px;\n  line-height: 32px;\n  /* identical to box height, or 133% */\n  letter-spacing: -0.5px;\n  color: ",
        ";\n  margin: 0;\n  margin-bottom: 13px;\n",
      ],
      [
        "\n  font-weight: 700;\n  font-size: 24px;\n  line-height: 32px;\n  /* identical to box height, or 133% */\n  letter-spacing: -0.5px;\n  color: ",
        ";\n  margin: 0;\n  margin-bottom: 13px;\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.text;
  },
);
var Description = styled_components_1.default.p(
  templateObject_4 ||
    (templateObject_4 = __makeTemplateObject(
      [
        "\n  font-weight: 500;\n  font-size: 12px;\n  line-height: 22px;\n  /* or 183% */\n\n  letter-spacing: 0.25px;\n  color: ",
        ";\n",
      ],
      [
        "\n  font-weight: 500;\n  font-size: 12px;\n  line-height: 22px;\n  /* or 183% */\n\n  letter-spacing: 0.25px;\n  color: ",
        ";\n",
      ],
    )),
  function (_a) {
    var theme = _a.theme;
    return theme.greyText;
  },
);
var ButtonContainer = styled_components_1.default.div(
  templateObject_5 ||
    (templateObject_5 = __makeTemplateObject(
      [
        "\n  display: flex;\n  align-self: flex-end;\n  justify-content: center;\n",
      ],
      [
        "\n  display: flex;\n  align-self: flex-end;\n  justify-content: center;\n",
      ],
    )),
);
function DeleteModal(_a) {
  var isModalOpen = _a.isModalOpen,
    setIsModalOpen = _a.setIsModalOpen,
    invoice = _a.invoice;
  var dispatch = (0, react_redux_1.useDispatch)();
  var navigate = (0, react_router_dom_1.useNavigate)();
  var handleClick = function () {
    navigate("/");
    dispatch((0, invoicesSlice_1.removeInvoice)(invoice.id));
  };
  var closeModal = function () {
    return setIsModalOpen(false);
  };
  return (
    <exports.DarkenScreen style={{ display: isModalOpen ? "flex" : "none" }}>
      <ModalContainer>
        <Confirm>Confirm Deletion</Confirm>
        <Description>
          Are you sure you want to delete invoice #XM9141? This action cannot be
          undone.
        </Description>
        <ButtonContainer>
          <CancelButton_1.default handleClick={closeModal} text="Cancel" />
          <DeleteButton_1.default handleClick={handleClick} />
        </ButtonContainer>
      </ModalContainer>
    </exports.DarkenScreen>
  );
}
exports.default = DeleteModal;
var templateObject_1,
  templateObject_2,
  templateObject_3,
  templateObject_4,
  templateObject_5;
// DeleteModal.propTypes = {
//   isModalOpen: PropTypes.bool,
//   setIsModalOpen: PropTypes.func.isRequired,
//   invoice: PropTypes.object.isRequired,
// };
