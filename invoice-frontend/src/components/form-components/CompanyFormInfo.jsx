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
exports.CompanyFormInfo = exports.CityPostContainer = void 0;
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var styled_components_1 = require("styled-components");
var react_hook_form_1 = require("react-hook-form");
var FormEntry_1 = require("./FormEntry");
var editStyles_1 = require("../../styles/editStyles");
var AddressBox_1 = require("./AddressBox");
var LongFormEntry_1 = require("./LongFormEntry");
var useWindowWidth_1 = require("../../hooks/useWindowWidth");
exports.CityPostContainer = styled_components_1.default.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        "\n  display: flex;\n  width: 100%;\n  justify-content: space-between;\n  \n  @media (min-width: 600px) {\n    display: contents;\n  }\n",
      ],
      [
        "\n  display: flex;\n  width: 100%;\n  justify-content: space-between;\n  \n  @media (min-width: 600px) {\n    display: contents;\n  }\n",
      ],
    )),
);
function CompanyFormInfo(_a) {
  var isDraft = _a.isDraft,
    invoice = _a.invoice;
  var width = (0, useWindowWidth_1.default)();
  var _b = (0, react_hook_form_1.useFormContext)(),
    errors = _b.formState.errors,
    register = _b.register;
  var countryChildren = (
    <LongFormEntry_1.default
      style={{ width: width < 768 ? "100%" : "" }}
      className="company-country"
    >
      <editStyles_1.Label
        htmlFor="country"
        style={{
          color: (
            errors === null || errors === void 0 ? void 0 : errors.country
          )
            ? "#EC5757"
            : "",
        }}
      >
        Country
      </editStyles_1.Label>
      <editStyles_1.CountryInput
        type="text"
        style={{
          border: (
            errors === null || errors === void 0 ? void 0 : errors.country
          )
            ? "1px solid #EC5757"
            : "",
          width: width < 768 ? "100%" : "",
        }}
        defaultValue={invoice ? invoice.senderAddress.country : ""}
        {...register("country", {
          required: !isDraft,
          pattern: /^[A-Za-z0-9 ]+$/i,
          maxLength: 30,
        })}
      />
    </LongFormEntry_1.default>
  );
  return (
    <>
      <LongFormEntry_1.default className="company-street-address">
        <editStyles_1.Label
          htmlFor="streetAddress"
          style={{
            color: (
              errors === null || errors === void 0
                ? void 0
                : errors.streetAddress
            )
              ? "#EC5757"
              : "",
          }}
        >
          Street Address
        </editStyles_1.Label>
        <editStyles_1.StreetAddressInput
          style={{
            border: (
              errors === null || errors === void 0
                ? void 0
                : errors.streetAddress
            )
              ? "1px solid #EC5757"
              : "",
          }}
          defaultValue={invoice ? invoice.senderAddress.street : ""}
          {...register("streetAddress", {
            required: !isDraft,
            pattern: /^[A-Za-z0-9 ]+$/i,
            maxLength: 50,
          })}
        />
      </LongFormEntry_1.default>
      <AddressBox_1.default>
        <exports.CityPostContainer>
          <FormEntry_1.default className="company-city">
            <editStyles_1.Label
              htmlFor="city"
              style={{
                color: (
                  errors === null || errors === void 0 ? void 0 : errors.city
                )
                  ? "#EC5757"
                  : "",
              }}
            >
              City
            </editStyles_1.Label>
            <editStyles_1.AddressDetailInput
              style={{
                border: (
                  errors === null || errors === void 0 ? void 0 : errors.city
                )
                  ? "1px solid #EC5757"
                  : "",
              }}
              defaultValue={invoice ? invoice.senderAddress.city : ""}
              type="text"
              {...register("city", {
                required: !isDraft,
                pattern: /^\w+$/i,
                maxLength: 30,
              })}
            />
          </FormEntry_1.default>

          <FormEntry_1.default
            style={{ justifySelf: "flex-end" }}
            className="company-postal-code"
          >
            <editStyles_1.Label
              htmlFor="postalCode"
              style={{
                color: (
                  errors === null || errors === void 0
                    ? void 0
                    : errors.postalCode
                )
                  ? "#EC5757"
                  : "",
              }}
            >
              Post Code
            </editStyles_1.Label>
            <editStyles_1.AddressDetailInput
              style={{
                border: (
                  errors === null || errors === void 0
                    ? void 0
                    : errors.postalCode
                )
                  ? "1px solid #EC5757"
                  : "",
              }}
              type="text"
              defaultValue={invoice ? invoice.senderAddress.postCode : ""}
              {...register("postalCode", {
                required: !isDraft,
                pattern: /^\w+[\w ]+$/i,
                maxLength: 10,
                minLength: 5,
              })}
            />
          </FormEntry_1.default>
        </exports.CityPostContainer>
        {width < 768 && (
          <LongFormEntry_1.default className="company-country-container">
            {countryChildren}
          </LongFormEntry_1.default>
        )}

        {width >= 768 && (
          <FormEntry_1.default className="company-country-container">
            {countryChildren}
          </FormEntry_1.default>
        )}
      </AddressBox_1.default>
    </>
  );
}
exports.CompanyFormInfo = CompanyFormInfo;
CompanyFormInfo.propTypes = {
  editPageWidth: prop_types_1.default.number.isRequired,
  isDraft: prop_types_1.default.bool.isRequired,
  // invoice: PropTypes.object
};
var templateObject_1;
