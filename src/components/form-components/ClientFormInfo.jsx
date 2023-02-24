import FormEntry from "./FormEntry";
import {
  AddressDetailInput,
  CountryInput,
  ErrorTextInline,
  Label,
  StreetAddressInput,
  Input
} from "../../styles/editStyles";
import AddressBox from "./AddressBox";
import React from "react";
import PropTypes from "prop-types";
import LongFormEntry from "./LongFormEntry";
import { useWindowWidth } from "../../hooks/useWindowWidth";

export function ClientFormInfo(props) {

  const width = useWindowWidth();
  const countryChildren = (
    <>
      <Label
        htmlFor="country"
        style={{ color: props.errors.clientCountry ? "red" : "" }}
      >
                Country
      </Label>
      <CountryInput
        style={{
          border: props.errors.clientCountry ? "1px solid red" : "",
        }}
        type="text"
        defaultValue={props.clientAddress.country}
        {...props.useFormRegisterReturn5}
      />
    </>
  );

  return <>
    <LongFormEntry isLongOnMobile={props.editPageWidth < 768}>
      <Label
        htmlFor="clientName"
        style={{ color: props.errors.clientName ? "red" : "" }}
      >
        {"Client's Name"}
      </Label>
      {props.errors.clientName?.type === "required" && (
        <ErrorTextInline>{"can't be empty"}</ErrorTextInline>
      )}
      <Input
        long
        style={{ border: props.errors.clientName ? "1px solid red" : "" }}
        type="text"
        defaultValue={props.clientName}
        {...props.useFormRegisterReturn}
      />
    </LongFormEntry>
    <LongFormEntry isLongOnMobile={props.editPageWidth < 768}>
      <Label
        htmlFor="clientEmail"
        style={{ color: props.errors.clientEmail ? "red" : "" }}
      >
        {"Client's Email"}
      </Label>
      {props.errors.clientEmail?.type === "pattern" && (
        <ErrorTextInline style={{ position: "absolute", top: "-8px" }}>{"Invalid email"}</ErrorTextInline>
      )}
      <Input
        long
        style={{ border: props.errors.clientEmail ? "1px solid red" : "" }}
        defaultValue={props.clientEmail}
        {...props.useFormRegisterReturn1}
      />
    </LongFormEntry>

    <LongFormEntry isLongOnMobile={props.editPageWidth < 768}>
      <Label
        htmlFor="clientStreetAddress"
        style={{ color: props.errors.clientStreetAddress ? "red" : "" }}
      >
                Street Address
      </Label>
      <StreetAddressInput
        style={{
          border: props.errors.clientStreetAddress ? "1px solid red" : "",
        }}
        defaultValue={props.clientAddress.street}
        {...props.useFormRegisterReturn2}
      />
    </LongFormEntry>

    <AddressBox>
      <FormEntry>
        <Label
          htmlFor="clientCity"
          style={{ color: props.errors.clientCity ? "red" : "" }}
        >
                    City
        </Label>
        <AddressDetailInput
          style={{
            border: props.errors.clientCity ? "1px solid red" : "",
          }}
          type="text"
          defaultValue={props.clientAddress.city}
          {...props.useFormRegisterReturn3}
        />
      </FormEntry>

      <FormEntry>
        <Label
          htmlFor="clientPostalCode"
          style={{ color: props.errors.clientPostalCode ? "red" : "" }}
        >
                    Post Code
        </Label>
        <AddressDetailInput
          style={{
            border: props.errors.clientPostalCode ? "1px solid red" : "",
          }}
          type="text"
          defaultValue={props.clientAddress.postCode}
          {...props.useFormRegisterReturn4}
        />
      </FormEntry>

      { width < 768 && <LongFormEntry isLongOnMobile={props.editPageWidth < 768}>
        {countryChildren}
      </LongFormEntry>}

      {width >= 768 && <FormEntry>
        {countryChildren}
      </FormEntry>}
    </AddressBox>
  </>;
}


ClientFormInfo.propTypes = {
  errors: PropTypes.any,
  clientName: PropTypes.any,
  useFormRegisterReturn: PropTypes.any,
  clientEmail: PropTypes.any,
  useFormRegisterReturn1: PropTypes.any,
  clientAddress: PropTypes.any,
  useFormRegisterReturn2: PropTypes.any,
  useFormRegisterReturn3: PropTypes.any,
  useFormRegisterReturn4: PropTypes.any,
  editPageWidth: PropTypes.any,
  useFormRegisterReturn5: PropTypes.any
};