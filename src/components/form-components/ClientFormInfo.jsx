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

const emailRegex = "/(?:[a-z0-9!#$%&'*+\\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+\\/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\n" +
    "\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\n" +
    "\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:\n" +
    "(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])/";
const CountryChildren = ({ invoice, isDraft }) => {

  const { register, formState: errors } = useFormContext();
  return (
    <>
      <Label
        htmlFor="clientCountry"
        style={{ color: errors.clientCountry ? "#EC5757" : "" }}

      >
        Country
      </Label>
      <Input
        style={{
          border: errors?.clientCountry ? "1px solid #EC5757" : ""

        }}
        type="text"
        defaultValue={invoice ? invoice.clientAddress.country : ""}
        {...register("clientCountry", { required: !isDraft })}
      />
    </>
  );
};

CountryChildren.propTypes = {
  invoice: PropTypes.object,
  isDraft: PropTypes.bool,
};

export function ClientFormInfo({ invoice, isDraft, editPageWidth }) {

  const width = useWindowWidth();
  const { formState: { errors }, register } = useFormContext();

  const clientCountry = (
    <LongFormEntry style={{ width: width < 768 ? "100%" : "" }}>
      <Label
        htmlFor="clientCountry"
        style={{ color: errors.clientCountry ? "#EC5757" : "" }}

      >
    Country
      </Label>
      <CountryInput
        style={{
          border: errors?.clientCountry ? "1px solid #EC5757" : "",
          width: width < 768 ? "100%" : ""

        }}
        type="text"
        defaultValue={invoice ? invoice.clientAddress.country : ""}
        {...register("clientCountry", { required: !isDraft })}
      />
    </LongFormEntry>
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
        type="text"
        defaultValue={invoice ? invoice.clientEmail : ""}
        {...register("clientEmail", { required: !isDraft, pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })}
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
        {clientCountry}
      </LongFormEntry>}

      {width >= 768 && <FormEntry>
        {clientCountry}
      </FormEntry>}

      {/*// todo figure out the layout for mobile - hook-form doesn't like the way I set this up */}

    </AddressBox>
  </>;
}

ClientFormInfo.propTypes = {
  editPageWidth: PropTypes.any,
  invoice: PropTypes.object,
  isDraft: PropTypes.bool
};
