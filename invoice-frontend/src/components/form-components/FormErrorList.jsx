"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_hook_form_1 = require("react-hook-form");
var prop_types_1 = require("prop-types");
var editStyles_1 = require("../../styles/editStyles");
function FormErrorList(_a) {
  var isEditOpen = _a.isEditOpen;
  var errors = (0, react_hook_form_1.useFormContext)().formState.errors;
  var isFieldErrors = function () {
    return Object.keys(errors).find(function (item) {
      return item !== "myFieldArray" && item !== "items";
    });
  };
  return (
    <editStyles_1.ErrorList>
      <editStyles_1.ErrorText
        style={{
          display:
            (isFieldErrors() || errors.items) && isEditOpen ? "block" : "none",
        }}
      >
        - All fields must be added
      </editStyles_1.ErrorText>
      <editStyles_1.ErrorText
        style={{
          display: errors.myFieldArray && isEditOpen ? "block" : "none",
        }}
      >
        - An item must be added
      </editStyles_1.ErrorText>
    </editStyles_1.ErrorList>
  );
}
exports.default = FormErrorList;
FormErrorList.propTypes = {
  isEditOpen: prop_types_1.default.bool.isRequired,
};
