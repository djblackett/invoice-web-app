import FormEntry from "./FormEntry";
import {AddressDetailInput, CountryInput, Label, StreetAddressInput} from "../../styles/editStyles";
import AddressBox from "./AddressBox";
import React from "react";
import PropTypes from "prop-types";

export function CompanyFormInfo(props) {
    return <>
        <FormEntry>
            <Label
                htmlFor="streetAddress"
                style={{color: props.errors.streetAddress ? "red" : ""}}
            >
                Street Address
            </Label>
            <StreetAddressInput
                style={{border: props.errors.streetAddress ? "1px solid red" : ""}}
                defaultValue={props.senderAddress.street}
                {...props.useFormRegisterReturn}
            />
        </FormEntry>
        <AddressBox>
            <FormEntry>
                <Label htmlFor="city" style={{color: props.errors.city ? "red" : ""}}>
                    City
                </Label>
                <AddressDetailInput
                    style={{border: props.errors.city ? "1px solid red" : ""}}
                    onChange={props.onChange}
                    type="text"
                    defaultValue={props.senderAddress.city}
                    {...props.useFormRegisterReturn1}
                />
            </FormEntry>

            <FormEntry>
                <Label
                    htmlFor="postalCode"
                    style={{color: props.errors.postalCode ? "red" : ""}}
                >
                    Post Code
                </Label>
                <AddressDetailInput
                    style={{border: props.errors.postalCode ? "1px solid red" : ""}}
                    type="text"
                    defaultValue={props.senderAddress.postCode}
                    {...props.useFormRegisterReturn2}
                />
            </FormEntry>

            <FormEntry isLongOnMobile={props.editPageWidth < 768}>
                <Label
                    htmlFor="country"
                    style={{color: props.errors.country ? "red" : ""}}
                >
                    Country
                </Label>
                <CountryInput
                    onChange={props.onChange1}
                    type="text"
                    defaultValue={props.senderAddress.country}
                    style={{border: props.errors.country ? "1px solid red" : ""}}
                    {...props.useFormRegisterReturn3}
                />
            </FormEntry>
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