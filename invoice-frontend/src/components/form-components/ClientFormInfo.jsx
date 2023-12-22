"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var react_hook_form_1 = require("react-hook-form");
var FormEntry_1 = require("./FormEntry");
var editStyles_1 = require("../../styles/editStyles");
var AddressBox_1 = require("./AddressBox");
var LongFormEntry_1 = require("./LongFormEntry");
var useWindowWidth_1 = require("../../hooks/useWindowWidth");
function ClientFormInfo(_a) {
    var _b, _c;
    var invoice = _a.invoice, isDraft = _a.isDraft;
    // console.log("ClientForm - isDraft:", isDraft);
    var width = (0, useWindowWidth_1.default)();
    var _d = (0, react_hook_form_1.useFormContext)(), errors = _d.formState.errors, register = _d.register;
    var clientCountry = (<LongFormEntry_1.default style={{ width: width < 768 ? "100%" : "" }} className="client-country">
      <editStyles_1.Label htmlFor="clientCountry" style={{ color: errors.clientCountry ? "#EC5757" : "" }}>
    Country
      </editStyles_1.Label>
      <editStyles_1.CountryInput $long={false} style={{
            border: (errors === null || errors === void 0 ? void 0 : errors.clientCountry) ? "1px solid #EC5757" : "",
            width: width < 768 ? "100%" : ""
        }} type="text" defaultValue={invoice ? invoice.clientAddress.country : ""} {...register("clientCountry", { required: !isDraft, pattern: /^[A-Za-z0-9 ]+$/i, maxLength: 30 })}/>
    </LongFormEntry_1.default>);
    return <>
    <LongFormEntry_1.default className="client-name">
      <editStyles_1.Label htmlFor="clientName" style={{ color: errors.clientName ? "#EC5757" : "" }}>
                Client&apos;s Name
      </editStyles_1.Label>
      {((_b = errors.clientName) === null || _b === void 0 ? void 0 : _b.type) === "required" && (<editStyles_1.ErrorTextInline>can&apos;t be empty</editStyles_1.ErrorTextInline>)}
      <editStyles_1.Input $long style={{ border: errors.clientName ? "1px solid #EC5757" : "" }} type="text" defaultValue={invoice ? invoice.clientName : ""} {...register("clientName", { required: !isDraft })}/>
    </LongFormEntry_1.default>
    <LongFormEntry_1.default className="client-email">
      <editStyles_1.Label htmlFor="clientEmail" style={{ color: errors.clientEmail ? "#EC5757" : "" }}>
                Client&apos;s Email
      </editStyles_1.Label>
      {((_c = errors.clientEmail) === null || _c === void 0 ? void 0 : _c.type) === "pattern" && (<editStyles_1.ErrorTextInline style={{ position: "absolute", top: "-8px" }}>Invalid email</editStyles_1.ErrorTextInline>)}
      <editStyles_1.Input $long style={{ border: errors.clientEmail ? "1px solid #EC5757" : "" }} type="text" defaultValue={invoice ? invoice.clientEmail : ""} {...register("clientEmail", { required: !isDraft, pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })}/>
    </LongFormEntry_1.default>

    <LongFormEntry_1.default className="client-street-address">
      <editStyles_1.Label htmlFor="clientStreetAddress" style={{ color: errors.clientStreetAddress ? "#EC5757" : "" }}>
                Street Address
      </editStyles_1.Label>
      <editStyles_1.StreetAddressInput style={{
            border: errors.clientStreetAddress ? "1px solid #EC5757" : "",
        }} defaultValue={invoice ? invoice.clientAddress.street : ""} {...register("clientStreetAddress", { required: !isDraft })}/>
    </LongFormEntry_1.default>

    <AddressBox_1.default>
      <FormEntry_1.default className="client-city">
        <editStyles_1.Label htmlFor="clientCity" style={{ color: errors.clientCity ? "#EC5757" : "" }}>
                    City
        </editStyles_1.Label>
        <editStyles_1.AddressDetailInput style={{
            border: errors.clientCity ? "1px solid #EC5757" : "",
        }} type="text" defaultValue={invoice ? invoice.clientAddress.city : ""} {...register("clientCity", { required: !isDraft, pattern: /^\w+$/i, maxLength: 30 })}/>
      </FormEntry_1.default>

      <FormEntry_1.default className="client-postal-code">
        <editStyles_1.Label htmlFor="clientPostalCode" style={{ color: errors.clientPostalCode ? "#EC5757" : "" }}>
                    Post Code
        </editStyles_1.Label>
        <editStyles_1.AddressDetailInput style={{
            border: errors.clientPostalCode ? "1px solid #EC5757" : "",
        }} type="text" defaultValue={invoice ? invoice.clientAddress.postCode : ""} {...register("clientPostalCode", { required: !isDraft, pattern: /^\w+[\w ]+$/i, maxLength: 10, minLength: 5 })}/>
      </FormEntry_1.default>


      {width < 768 && <LongFormEntry_1.default className="client-country">
        {clientCountry}
      </LongFormEntry_1.default>}

      {width >= 768 && <FormEntry_1.default className="client-country">
        {clientCountry}
      </FormEntry_1.default>}

      {/* // todo figure out the layout for mobile - hook-form doesn't like the way I set this up */}

    </AddressBox_1.default>
  </>;
}
exports.default = ClientFormInfo;
ClientFormInfo.propTypes = {
    editPageWidth: prop_types_1.default.number.isRequired,
    // invoice: PropTypes.object.isRequired,
    isDraft: prop_types_1.default.bool.isRequired
};
