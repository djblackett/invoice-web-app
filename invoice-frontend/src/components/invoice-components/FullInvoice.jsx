"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ItemList_1 = require("./ItemList");
var useWindowWidth_1 = require("../../hooks/useWindowWidth");
var utilityFunctions_1 = require("../../utils/utilityFunctions");
var FullInvoiceStyles_1 = require("../../styles/FullInvoiceStyles");
function FullInvoice(_a) {
  var invoice = _a.invoice;
  var width = (0, useWindowWidth_1.default)();
  return (
    <FullInvoiceStyles_1.Card>
      <FullInvoiceStyles_1.TopRow>
        <FullInvoiceStyles_1.IdAndDescription>
          <FullInvoiceStyles_1.IDNumber>
            <span style={{ color: "#7E88C3" }}>#</span>
            {invoice.id.substring(0, 6)}
          </FullInvoiceStyles_1.IDNumber>
          <FullInvoiceStyles_1.Description>
            {invoice.description}
          </FullInvoiceStyles_1.Description>
        </FullInvoiceStyles_1.IdAndDescription>
        <FullInvoiceStyles_1.Address
          style={{ textAlign: width >= 768 ? "right" : "left" }}
        >
          <FullInvoiceStyles_1.AddressEntry>
            {invoice.senderAddress.street}
          </FullInvoiceStyles_1.AddressEntry>
          <FullInvoiceStyles_1.AddressEntry>
            {invoice.senderAddress.city}
          </FullInvoiceStyles_1.AddressEntry>
          <FullInvoiceStyles_1.AddressEntry>
            {invoice.senderAddress.postCode}
          </FullInvoiceStyles_1.AddressEntry>
          <FullInvoiceStyles_1.AddressEntry>
            {invoice.senderAddress.country}
          </FullInvoiceStyles_1.AddressEntry>
        </FullInvoiceStyles_1.Address>
      </FullInvoiceStyles_1.TopRow>

      <FullInvoiceStyles_1.InfoGrid>
        <FullInvoiceStyles_1.GenericInvoiceEntry>
          <FullInvoiceStyles_1.TopEntry>
            Invoice Date
          </FullInvoiceStyles_1.TopEntry>
          <FullInvoiceStyles_1.BottomEntry>
            {" "}
            {(0, utilityFunctions_1.convertedDate)(invoice.createdAt)}
          </FullInvoiceStyles_1.BottomEntry>
        </FullInvoiceStyles_1.GenericInvoiceEntry>
        <FullInvoiceStyles_1.GenericInvoiceEntry>
          <FullInvoiceStyles_1.TopEntry>
            Payment Due
          </FullInvoiceStyles_1.TopEntry>
          <FullInvoiceStyles_1.BottomEntry>
            {(0, utilityFunctions_1.convertedDate)(invoice.paymentDue)}
          </FullInvoiceStyles_1.BottomEntry>
        </FullInvoiceStyles_1.GenericInvoiceEntry>
        <FullInvoiceStyles_1.NamePlusAddress>
          <FullInvoiceStyles_1.GenericInvoiceEntry>
            <FullInvoiceStyles_1.TopEntry>Bill To</FullInvoiceStyles_1.TopEntry>
            <FullInvoiceStyles_1.BottomEntry>
              {invoice.clientName}
            </FullInvoiceStyles_1.BottomEntry>
          </FullInvoiceStyles_1.GenericInvoiceEntry>
          <FullInvoiceStyles_1.EmbeddedAddress>
            <FullInvoiceStyles_1.AddressEntry>
              {invoice.clientAddress.street}
            </FullInvoiceStyles_1.AddressEntry>
            <FullInvoiceStyles_1.AddressEntry>
              {invoice.clientAddress.city}
            </FullInvoiceStyles_1.AddressEntry>
            <FullInvoiceStyles_1.AddressEntry>
              {invoice.clientAddress.postCode}
            </FullInvoiceStyles_1.AddressEntry>
            <FullInvoiceStyles_1.AddressEntry>
              {invoice.clientAddress.country}
            </FullInvoiceStyles_1.AddressEntry>
          </FullInvoiceStyles_1.EmbeddedAddress>
        </FullInvoiceStyles_1.NamePlusAddress>
        <FullInvoiceStyles_1.GenericInvoiceEntry>
          <FullInvoiceStyles_1.TopEntry>Sent to</FullInvoiceStyles_1.TopEntry>
          <FullInvoiceStyles_1.BottomEntry>
            {invoice.clientEmail}
          </FullInvoiceStyles_1.BottomEntry>
        </FullInvoiceStyles_1.GenericInvoiceEntry>
      </FullInvoiceStyles_1.InfoGrid>
      <ItemList_1.default invoice={invoice} />
    </FullInvoiceStyles_1.Card>
  );
}
exports.default = FullInvoice;
