import ItemList from "./ItemList";
import useWindowWidth from "../../hooks/useWindowWidth";
import {FullInvoiceProps } from "../../types/types";
import {convertedDate} from "../../utils/utilityFunctions";
import {
  Address,
  AddressEntry, BottomEntry,
  Card,
  Description, EmbeddedAddress, GenericInvoiceEntry,
  IdAndDescription,
  IDNumber, InfoGrid, NamePlusAddress, TopEntry,
  TopRow
} from "../../styles/FullInvoiceStyles";

function FullInvoice({ invoice }: FullInvoiceProps) {
  const width = useWindowWidth();

  return (
    <Card>
      <TopRow>
        <IdAndDescription>
          <IDNumber>
            <span style={{ color: "#7E88C3" }}>#</span>
            {invoice.id.substring(0, 6)}
          </IDNumber>
          <Description>{invoice.description}</Description>
        </IdAndDescription>
        <Address style={{ textAlign: width >= 768 ? "right" : "left" }}>

          <AddressEntry >{invoice.senderAddress.street}</AddressEntry>
          <AddressEntry >{invoice.senderAddress.city}</AddressEntry>
          <AddressEntry >{invoice.senderAddress.postCode}</AddressEntry>
          <AddressEntry >{invoice.senderAddress.country}</AddressEntry>

        </Address>
      </TopRow>

      <InfoGrid>
        <GenericInvoiceEntry>
          <TopEntry>Invoice Date</TopEntry>
          <BottomEntry> {convertedDate(invoice.createdAt)}</BottomEntry>
        </GenericInvoiceEntry>
        <GenericInvoiceEntry>
          <TopEntry>Payment Due</TopEntry>
          <BottomEntry>{convertedDate(invoice.paymentDue)}</BottomEntry>
        </GenericInvoiceEntry>
        <NamePlusAddress>
          <GenericInvoiceEntry>
            <TopEntry>Bill To</TopEntry>
            <BottomEntry>{invoice.clientName}</BottomEntry>
          </GenericInvoiceEntry>
          <EmbeddedAddress>

            <AddressEntry >{invoice.clientAddress.street}</AddressEntry>
            <AddressEntry >{invoice.clientAddress.city}</AddressEntry>
            <AddressEntry >{invoice.clientAddress.postCode}</AddressEntry>
            <AddressEntry >{invoice.clientAddress.country}</AddressEntry>

          </EmbeddedAddress>
        </NamePlusAddress>
        <GenericInvoiceEntry>
          <TopEntry>Sent to</TopEntry>
          <BottomEntry>{invoice.clientEmail}</BottomEntry>
        </GenericInvoiceEntry>
      </InfoGrid>
      <ItemList invoice={invoice} />
    </Card>
  );
}


export default FullInvoice;
