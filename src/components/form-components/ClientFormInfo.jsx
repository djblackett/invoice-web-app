import FormEntry from "./FormEntry";
import {
    AddressDetailInput,
    CountryInput,
    ErrorTextInline,
    Label,
    LongEntry,
    StreetAddressInput
} from "../../styles/editStyles";
import AddressBox from "./AddressBox";
import React from "react";
import PropTypes from "prop-types";

export function ClientFormInfo(props) {
    return <>
        <FormEntry>
            <Label
                htmlFor="clientName"
                style={{color: props.errors.clientName ? "red" : ""}}
            >
                {"Client's Name"}
            </Label>
            {props.errors.clientName?.type === "required" && (
                <ErrorTextInline>{"can't be empty"}</ErrorTextInline>
            )}
            <LongEntry
                style={{border: props.errors.clientName ? "1px solid red" : ""}}
                type="text"
                defaultValue={props.defaultValue}
                {...props.useFormRegisterReturn}
            />
        </FormEntry>
        <FormEntry>
            <Label
                htmlFor="clientEmail"
                style={{color: props.errors.clientEmail ? "red" : ""}}
            >
                {"Client's Email"}
            </Label>
            <LongEntry
                style={{border: props.errors.clientEmail ? "1px solid red" : ""}}
                defaultValue={props.defaultValue1}
                {...props.useFormRegisterReturn1}
            />
        </FormEntry>
        <FormEntry>
            <Label
                htmlFor="clientStreetAddress"
                style={{color: props.errors.clientStreetAddress ? "red" : ""}}
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
        </FormEntry>
        <AddressBox>
            <FormEntry>
                <Label
                    htmlFor="clientCity"
                    style={{color: props.errors.clientCity ? "red" : ""}}
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
                    style={{color: props.errors.clientPostalCode ? "red" : ""}}
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

            <FormEntry isLongOnMobile={props.editPageWidth < 768}>
                <Label
                    htmlFor="country"
                    style={{color: props.errors.country ? "red" : ""}}
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
            </FormEntry>
        </AddressBox>
    </>;
}


ClientFormInfo.propTypes = {
    errors: PropTypes.any,
    defaultValue: PropTypes.any,
    useFormRegisterReturn: PropTypes.any,
    defaultValue1: PropTypes.any,
    useFormRegisterReturn1: PropTypes.any,
    clientAddress: PropTypes.any,
    useFormRegisterReturn2: PropTypes.any,
    useFormRegisterReturn3: PropTypes.any,
    useFormRegisterReturn4: PropTypes.any,
    editPageWidth: PropTypes.any,
    useFormRegisterReturn5: PropTypes.any
};