import { useFormContext } from "react-hook-form";
import FormEntry from "./FormEntry.tsx";
import {
  AddressDetailInput,
  CountryInput,
  ErrorTextInline,
  Label,
  StreetAddressInput,
  Input,
} from "../../../styles/editPageStyles.ts";
import AddressBox from "./AddressBox.tsx";
import LongFormEntry from "./LongFormEntry.tsx";
import useWindowWidth from "../../shared/hooks/useWindowWidth.tsx";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider.tsx";
import { Invoice } from "@/features/invoices/types/invoiceTypes.ts";

type ClientFormInfoProps = {
  invoice?: Invoice;
};

export default function ClientFormInfo({ invoice }: ClientFormInfoProps) {
  const width = useWindowWidth();
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const { isDraft } = useNewInvoiceContext();

  const clientCountry = (
    <LongFormEntry
      style={{ width: width < 768 ? "100%" : "" }}
      className="client-country"
    >
      <Label
        htmlFor="clientCountry"
        style={{ color: errors.clientCountry ? "#EC5757" : "" }}
      >
        Country
      </Label>
      <CountryInput
        id="clientCountry"
        $long={false}
        style={{
          border: errors?.clientCountry ? "1px solid #EC5757" : "",
          width: width < 768 ? "100%" : "",
        }}
        type="text"
        defaultValue={invoice ? invoice?.clientAddress?.country : ""}
        {...register("clientCountry", {
          required: !isDraft,
          pattern: /^[A-Za-z0-9 ]+$/i,
          maxLength: 30,
        })}
      />
    </LongFormEntry>
  );

  return (
    <>
      <LongFormEntry className="client-name">
        <Label
          htmlFor="clientName"
          style={{ color: errors.clientName ? "#EC5757" : "" }}
        >
          Client&apos;s Name
        </Label>
        {errors.clientName?.type === "required" && (
          <ErrorTextInline>can&apos;t be empty</ErrorTextInline>
        )}
        <Input
          id="clientName"
          $long
          style={{ border: errors.clientName ? "1px solid #EC5757" : "" }}
          type="text"
          defaultValue={invoice ? invoice.clientName : ""}
          {...register("clientName", { required: !isDraft })}
        />
      </LongFormEntry>
      <LongFormEntry className="client-email">
        <Label
          htmlFor="clientEmail"
          style={{ color: errors.clientEmail ? "#EC5757" : "" }}
        >
          Client&apos;s Email
        </Label>
        {errors.clientEmail?.type === "pattern" && (
          <ErrorTextInline style={{ position: "absolute", top: "-8px" }}>
            Invalid email
          </ErrorTextInline>
        )}
        <Input
          id="clientEmail"
          $long
          style={{ border: errors.clientEmail ? "1px solid #EC5757" : "" }}
          type="text"
          defaultValue={invoice ? invoice.clientEmail : ""}
          {...register("clientEmail", {
            required: !isDraft,
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
        />
      </LongFormEntry>

      <LongFormEntry className="client-street-address">
        <Label
          htmlFor="clientStreetAddress"
          style={{ color: errors.clientStreetAddress ? "#EC5757" : "" }}
        >
          Street Address
        </Label>
        <StreetAddressInput
          id="clientStreetAddress"
          style={{
            border: errors.clientStreetAddress ? "1px solid #EC5757" : "",
          }}
          defaultValue={invoice ? invoice?.clientAddress?.street : ""}
          {...register("clientStreetAddress", { required: !isDraft })}
        />
      </LongFormEntry>

      <AddressBox>
        <FormEntry className="clientCity">
          <Label
            htmlFor="clientCity"
            style={{ color: errors.clientCity ? "#EC5757" : "" }}
          >
            City
          </Label>
          <AddressDetailInput
            id="clientCity"
            style={{
              border: errors.clientCity ? "1px solid #EC5757" : "",
            }}
            type="text"
            defaultValue={invoice ? invoice?.clientAddress?.city : ""}
            {...register("clientCity", {
              required: !isDraft,
              pattern: /[\w ]*/i,
              maxLength: 30,
            })}
          />
        </FormEntry>

        <FormEntry className="clientPostalCode">
          <Label
            htmlFor="clientPostalCode"
            style={{ color: errors.clientPostalCode ? "#EC5757" : "" }}
          >
            Post Code
          </Label>
          <AddressDetailInput
            id="clientPostalCode"
            style={{
              border: errors.clientPostalCode ? "1px solid #EC5757" : "",
            }}
            type="text"
            defaultValue={invoice ? invoice?.clientAddress?.postCode : ""}
            {...register("clientPostalCode", {
              required: !isDraft,
              pattern: /^\w+[\w ]+$/i,
              maxLength: 10,
              minLength: 5,
            })}
          />
        </FormEntry>

        {width < 768 && (
          <LongFormEntry className="client-country">
            {clientCountry}
          </LongFormEntry>
        )}

        {width >= 768 && (
          <FormEntry className="client-country">{clientCountry}</FormEntry>
        )}
      </AddressBox>
    </>
  );
}
