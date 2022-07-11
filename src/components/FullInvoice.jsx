/* eslint-disable no-unused-vars */
import styled from "styled-components";
import InvoicePaid from "./InvoicePaid";
import InvoicePending from "./InvoicePending";
import InvoiceDraft from "./InvoiceDraft";
import PropTypes from "prop-types";
import { useMemo } from "react";
import ItemList from "./ItemList";

const Card = styled.div`
  min-height: 630px;
  width: 100%;
  max-width: 100%;
  background-color: ${({ theme }) => theme.background};
  /* display: grid;s
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 43px 43px; */
  padding: 15px;
  display: flex;
  flex-direction: column;
  padding: 24px;
  margin: 24px;
  margin-bottom: 8px;
  margin-top: 24px;
  letter-spacing: -0.25px;
  line-height: 15px;
  font-size: 12px;
  border-radius: 8px;
  box-shadow: 0px 10px 10px -10px rgba(72, 84, 159, 0.100397);

  transition: width 0.5s ease-in-out;

  &:hover {
    border: 1px solid ${({ theme }) => theme.outline};
  }

  @media (min-width: 768px) {
    justify-items: center;
    /* height: 72px; */
    width: 100%;
    max-width: initial;
    /* margin: 8px 48px 8px 48px; */
    align-content: center;
    padding: 3rem;
  }

  @media (min-width: 1200px) {
    max-width: 730px;
  }
`;

const IDNumber = styled.p`
  margin: 0;
  font-family: "Spartan";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  /* identical to box height, or 150% */

  letter-spacing: -0.8px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TopEntry = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.greyText};

  font-family: "Spartan";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;
`;

const GenericInvoiceEntry = styled.div`
  display: flex;
  flex-direction: column;
  /* grid-area: 2 / 1 / 3 / 2; */

  @media (min-width: 768px) {
    /* display: contents; */
  }
`;

const NamePlusAddress = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: 2 / 3;
  grid-row: 1 / 3;
`;

const BottomEntry = styled.p`
  margin: 0;
  margin-top: 8px;

  font-family: "Spartan";
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 20px;
  /* identical to box height, or 133% */

  letter-spacing: -0.3125px;
`;

const Description = styled.p`
  margin: 0;
  margin-top: 0.3rem;
  padding: 0;
  color: ${({ theme }) => theme.greyText};

  font-family: "Spartan";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;
`;

const Address = styled.div`
  justify-self: flex-start;
  display: flex;
  flex-direction: column;
`;

const EmbeddedAddress = styled(Address)`
  margin-top: 0.5rem;
`;

const AddressEntry = styled.p`
  color: ${({ theme }) => theme.greyText};
  margin: 0;
  margin-bottom: 0.3rem;
  padding: 0;
`;

const CustomerName = styled.p`
  margin: 0;
  color: #888eb0;
  text-align: right;
`;

const SVGContainer = styled.div`
  width: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  display: none;

  @media (min-width: 768px) {
    display: flex;
  }
`;
const arrowRightSVG = (
  <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 1l4 4-4 4"
      stroke="#7C5DFA"
      strokeWidth="2"
      fill="none"
      fillRule="evenodd"
    />
  </svg>
);

const IdAndDescription = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template: repeat(2, 65px) / 1fr 1fr 1fr;
  grid-auto-flow: column;
  margin-top: 1.3rem;
`;

function FullInvoice({ invoice }) {
  // const invoiceStatus = useMemo(() => {
  //   if (invoice.status === "paid") {
  //     return <InvoicePaid />;
  //   } else if (invoice.status === "pending") {
  //     return <InvoicePending />;
  //   } else if (invoice.status === "draft") {
  //     return <InvoiceDraft />;
  //   }
  // }, [invoice.status]);

  const convertedDate = (dateString) => {
    const date = dateString.split("-");
    const dateObj = new Date(Date.UTC(date[0], date[1], date[2]));
    return dateObj.toDateString().substring(4);
  };

  return (
    <Card>
      <TopRow>
        <IdAndDescription>
          <IDNumber>
            <span style={{ color: "#7E88C3" }}>#</span>
            {invoice.id}
          </IDNumber>
          <Description>{invoice.description}</Description>
        </IdAndDescription>
        <Address style={{ textAlign: "right" }}>
          {Object.values(invoice.senderAddress).map((line) => (
            <AddressEntry key={"key" + line}>{line}</AddressEntry>
          ))}
        </Address>
      </TopRow>

      <InfoGrid>
        <GenericInvoiceEntry>
          <TopEntry>Invoice Date</TopEntry>
          <BottomEntry>£ {convertedDate(invoice.createdAt)}</BottomEntry>
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
            {Object.values(invoice.clientAddress).map((line) => (
              <AddressEntry key={"key" + line}>{line}</AddressEntry>
            ))}
          </EmbeddedAddress>
        </NamePlusAddress>
        <GenericInvoiceEntry>
          <TopEntry>Sent to</TopEntry>
          <BottomEntry>{invoice.clientEmail}</BottomEntry>
        </GenericInvoiceEntry>
      </InfoGrid>
      {/* <CustomerName>{invoice.clientName}</CustomerName> */}
      <ItemList invoice={invoice} />
    </Card>
  );
}

FullInvoice.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default FullInvoice;

// {
//     "id": "FV2353",
//     "createdAt": "2021-11-05",
//     "paymentDue": "2021-11-12",
//     "description": "Logo Re-design",
//     "paymentTerms": 7,
//     "clientName": "Anita Wainwright",
//     "clientEmail": "",
//     "status": "draft",
//     "senderAddress": {
//       "street": "19 Union Terrace",
//       "city": "London",
//       "postCode": "E1 3EZ",
//       "country": "United Kingdom"
//     },
//     "clientAddress": {
//       "street": "",
//       "city": "",
//       "postCode": "",
//       "country": ""
//     },
//     "items": [
//       {
//         "name": "Logo Re-design",
//         "quantity": 1,
//         "price": 3102.04,
//         "total": 3102.04
//       }
//     ],
//     "total": 3102.04
//   }
