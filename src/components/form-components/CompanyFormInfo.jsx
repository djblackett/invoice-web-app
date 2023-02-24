import FormEntry from "./FormEntry";
import { AddressDetailInput, CountryInput, Label, StreetAddressInput } from "../../styles/editStyles";
import AddressBox from "./AddressBox";
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LongFormEntry from "./LongFormEntry";
import { useWindowWidth } from "../../hooks/useWindowWidth";
import { useFormContext } from "react-hook-form";

export const CityPostContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  
  @media (min-width: 600px) {
    display: contents;
  }
`;

export function CompanyFormInfo({ isDraft, editPageWidth, invoice }) {

  const width = useWindowWidth();
  const { register, formState: { errors } } = useFormContext();


  const countryChildren = (
    <>
      <Label
        htmlFor="country"
        style={{ color: errors?.country ? "#EC5757" : "" }}
      >
                Country
      </Label>
      <CountryInput
        type="text"
        style={{ border: errors?.country ? "1px solid #EC5757" : "" }}
        defaultValue={invoice? invoice.senderAddress.country : ""}
        { ...register("country", { required: !isDraft, pattern: /^[A-Za-z0-9 ]+$/i, maxLength: 30  }) }
      />
    </>
  );

  return <>
    <LongFormEntry>
      <Label
        htmlFor="streetAddress"
        style={{ color: errors?.streetAddress ? "#EC5757" : "" }}
      >
                Street Address
      </Label>
      <StreetAddressInput
        style={{ border: errors?.streetAddress ? "1px solid #EC5757" : "" }}
        defaultValue={invoice? invoice.senderAddress.street : ""}
        {...register("streetAddress", { required: !isDraft, pattern: /^[A-Za-z0-9 ]+$/i, maxLength: 50  })}
      />
    </LongFormEntry>
    <AddressBox>
      <CityPostContainer>
        <FormEntry>
          <Label htmlFor="city" style={{ color: errors?.city ? "#EC5757" : "" }}>
                    City
          </Label>
          <AddressDetailInput
            style={{ border: errors?.city ? "1px solid #EC5757" : "" }}
            defaultValue={invoice? invoice.senderAddress.city : ""}
            type="text"
            {...register("city", { required: !isDraft, pattern: /^\w+$/i, maxLength: 30  })}
          />
        </FormEntry>

        <FormEntry style={{ justifySelf: "flex-end" }}>
          <Label
            htmlFor="postalCode"
            style={{ color: errors?.postalCode ? "#EC5757" : "" }}
          >
                    Post Code
          </Label>
          <AddressDetailInput
            style={{ border: errors?.postalCode ? "1px solid #EC5757" : "" }}
            type="text"
            defaultValue={invoice? invoice.senderAddress.postCode : ""}
            {...register("postalCode", { required: !isDraft, pattern: /^\w+[\w ]+$/i, maxLength: 10, minLength: 5 })}
          />
        </FormEntry>
      </CityPostContainer>
      { width < 768 && <LongFormEntry isLongOnMobile={editPageWidth < 768}>
        {countryChildren}
      </LongFormEntry>}

      {width >= 768 && <FormEntry>
        {countryChildren}
      </FormEntry>}
    </AddressBox>
  </>;
}

CompanyFormInfo.propTypes = {
  errors: PropTypes.any,
  senderAddress: PropTypes.any,
  useFormRegisterReturn: PropTypes.any,
  onChange: PropTypes.func,
  useFormRegisterReturn1: PropTypes.any,
  useFormRegisterReturn2: PropTypes.any,
  editPageWidth: PropTypes.any,
  onChange1: PropTypes.func,
  useFormRegisterReturn3: PropTypes.any
};