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
import { useFormContext } from "react-hook-form";

export function ClientFormInfo({ invoice, isDraft, editPageWidth }) {

  const width = useWindowWidth();

  const { formState: { errors }, register } = useFormContext();
  const countryChildren = (
    <>
      <Label
        htmlFor="country"
        style={{ color: errors.clientCountry ? "#EC5757" : "" }}
      >
                Country
      </Label>
      <CountryInput
        style={{
          border: errors.clientCountry ? "1px solid #EC5757" : "",
        }}
        type="text"
        defaultValue={invoice ? invoice.clientAddress.country : ""}
        {...register("clientCountry", { required: !isDraft })}
      />
    </>
  );

  return <>
    <LongFormEntry isLongOnMobile={editPageWidth < 768}>
      <Label
        htmlFor="clientName"
        style={{ color: errors.clientName ? "#EC5757" : "" }}
      >
        {"Client's Name"}
      </Label>
      {errors.clientName?.type === "required" && (
        <ErrorTextInline>{"can't be empty"}</ErrorTextInline>
      )}
      <Input
        long
        style={{ border: errors.clientName ? "1px solid #EC5757" : "" }}
        type="text"
        defaultValue={invoice ? invoice.clientName : ""}
        {...register("clientName", { required: !isDraft })}
      />
    </LongFormEntry>
    <LongFormEntry isLongOnMobile={editPageWidth < 768}>
      <Label
        htmlFor="clientEmail"
        style={{ color: errors.clientEmail ? "#EC5757" : "" }}
      >
        {"Client's Email"}
      </Label>
      {errors.clientEmail?.type === "pattern" && (
        <ErrorTextInline style={{ position: "absolute", top: "-8px" }}>{"Invalid email"}</ErrorTextInline>
      )}
      <Input
        long
        style={{ border: errors.clientEmail ? "1px solid #EC5757" : "" }}
        defaultValue={invoice ? invoice.clientEmail : ""}
        {...register("clientEmail", { required: !isDraft })}
      />
    </LongFormEntry>

    <LongFormEntry isLongOnMobile={editPageWidth < 768}>
      <Label
        htmlFor="clientStreetAddress"
        style={{ color: errors.clientStreetAddress ? "#EC5757" : "" }}
      >
                Street Address
      </Label>
      <StreetAddressInput
        style={{
          border: errors.clientStreetAddress ? "1px solid #EC5757" : "",
        }}
        defaultValue={invoice ? invoice.clientAddress.street : ""}
        {...register("clientStreetAddress", { required: !isDraft })}
      />
    </LongFormEntry>

    <AddressBox>
      <FormEntry>
        <Label
          htmlFor="clientCity"
          style={{ color: errors.clientCity ? "#EC5757" : "" }}
        >
                    City
        </Label>
        <AddressDetailInput
          style={{
            border: errors.clientCity ? "1px solid #EC5757" : "",
          }}
          type="text"
          defaultValue={invoice ? invoice.clientAddress.city : ""}
          {...register("clientCity", { required: !isDraft })}
        />
      </FormEntry>

      <FormEntry>
        <Label
          htmlFor="clientPostalCode"
          style={{ color: errors.clientPostalCode ? "#EC5757" : "" }}
        >
                    Post Code
        </Label>
        <AddressDetailInput
          style={{
            border: errors.clientPostalCode ? "1px solid #EC5757" : "",
          }}
          type="text"
          defaultValue={invoice ? invoice.clientAddress.postCode : ""}
          {...register("clientPostalCode", { required: !isDraft, minLength: 5 })}
        />
      </FormEntry>

      { width < 768 && <LongFormEntry isLongOnMobile={editPageWidth < 768}>
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