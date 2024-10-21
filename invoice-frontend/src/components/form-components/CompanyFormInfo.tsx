import PropTypes from "prop-types";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import FormEntry from "./FormEntry";
import { AddressDetailInput, CountryInput, Label, StreetAddressInput } from "../../styles/editStyles";
import AddressBox from "./AddressBox";
import LongFormEntry from "./LongFormEntry";
import useWindowWidth from "../../hooks/useWindowWidth";
import { Invoice } from "../../types/types";

export const CityPostContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  @media (min-width: 600px) {
    display: contents;
  }
`;

type CompanyFormInfoProps = {
    invoice?: Invoice;
    isDraft: boolean;
}

function CompanyFormInfo({ isDraft, invoice }: CompanyFormInfoProps) {

    const width = useWindowWidth();
    const { formState: { errors }, register } = useFormContext();

    const countryChildren = (
        <LongFormEntry style={{ width: width < 768 ? "100%" : "" }} className="company-country">
            <Label
                htmlFor="country"
                style={{ color: errors?.country ? "#EC5757" : "" }}
            >
                Country
            </Label>
            <CountryInput
                type="text"
                style={{
                    border: errors?.country ? "1px solid #EC5757" : "",
                    width: width < 768 ? "100%" : ""
                }}
                defaultValue={invoice ? invoice.senderAddress.country : ""}
                {...register("country", { required: !isDraft, pattern: /^[A-Za-z0-9 ]+$/i, maxLength: 30 })}
            />
        </LongFormEntry>
    );

    // if (invoice) {
    return (
        <>
            <LongFormEntry className="company-street-address">
                <Label
                    htmlFor="streetAddress"
                    style={{ color: errors?.streetAddress ? "#EC5757" : "" }}
                >
                    Street Address
                </Label>
                <StreetAddressInput
                    style={{ border: errors?.streetAddress ? "1px solid #EC5757" : "" }}
                    defaultValue={invoice ? invoice.senderAddress.street : ""}
                    {...register("streetAddress", { required: !isDraft, pattern: /^[A-Za-z0-9 ]+$/i, maxLength: 50 })}
                />
            </LongFormEntry>
            <AddressBox>
                <CityPostContainer>
                    <FormEntry className="company-city">
                        <Label htmlFor="city" style={{ color: errors?.city ? "#EC5757" : "" }}>
                            City
                        </Label>
                        <AddressDetailInput
                            style={{ border: errors?.city ? "1px solid #EC5757" : "" }}
                            defaultValue={invoice ? invoice.senderAddress.city : ""}
                            type="text"
                            {...register("city", { required: !isDraft, pattern: /^\w+$/i, maxLength: 30 })}
                        />
                    </FormEntry>

                    <FormEntry style={{ justifySelf: "flex-end" }} className="company-postal-code">
                        <Label
                            htmlFor="postalCode"
                            style={{ color: errors?.postalCode ? "#EC5757" : "" }}
                        >
                            Post Code
                        </Label>
                        <AddressDetailInput
                            style={{ border: errors?.postalCode ? "1px solid #EC5757" : "" }}
                            type="text"
                            defaultValue={invoice ? invoice.senderAddress.postCode : ""}
                            {...register("postalCode", {
                                required: !isDraft,
                                pattern: /^\w+[\w ]+$/i,
                                maxLength: 10,
                                minLength: 5
                            })}
                        />
                    </FormEntry>
                </CityPostContainer>
                {width < 768 && <LongFormEntry className="company-country-container">
                    {countryChildren}
                </LongFormEntry>}

                {width >= 768 && (
                    <FormEntry className="company-country-container">
                        {countryChildren}
                    </FormEntry>
                )}
            </AddressBox>
        </>
    );
    // } else {
    //     return null
    // }
}

CompanyFormInfo.propTypes = {
    isDraft: PropTypes.bool.isRequired,
    // invoice: PropTypes.object
};

export default CompanyFormInfo;
