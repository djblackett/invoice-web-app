import styled from "styled-components";
import InvoicePaid from "./InvoicePaid";
import InvoicePending from "./InvoicePending";
import InvoiceDraft from "./InvoiceDraft";

const Card = styled.div`
  height: 134px;
  width: 100%;
  background-color: white;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 43px 43px;
  padding: 24px;
  margin: 24px;
  margin-bottom: 8px;
  margin-top: 8px;
  letter-spacing: -0.25px;
  line-height: 15px;
  font-size: 12px;
  border-radius: 8px;
  box-shadow: 0px 10px 10px -10px rgba(72, 84, 159, 0.100397);

  @media (min-width: 768px) {
    grid-template-rows: 1fr;
    grid-template-columns: repeat(6, auto);
    align-items: center;
    height: 72px;
    width: 100%;
    max-width: initial;
    margin: 8px 48px 8px 48px;
    align-content: center;
  }

  @media (min-width: 1200px) {
    max-width: 730px;
    margin-left: 355px;
    margin-right: 355px;
  }
`;

const IDNumber = styled.p`
  margin: 0;
  font-weight: bold;
`;

const DueDate = styled.p`
  margin: 0;
  color: #888eb0;
`;

const DueDateAmountBox = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: 2 / 1 / 3 / 2;

  @media (min-width: 768px) {
    display: contents;
  }
`;

const InvoiceAmount = styled.p`
  font-weight: bold;
  letter-spacing: -0.8px;
  margin: 0;
  line-height: 24px;
  font-size: 16px;
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
`
const arrowRightSVG = <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/></svg>

function InvoiceCard({invoice}) {

  const invoiceStatus = () => {
    if (invoice.status === "paid") {
      return <InvoicePaid />
    } else if (invoice.status === "pending") {
      return <InvoicePending />
    } else if (invoice.status === "draft") {
      return  <InvoiceDraft />
    }  
  }

  

  const convertedDate = () => {
    const date = invoice.paymentDue.split("-");
    const dateObj = new Date(Date.UTC(date[0], date[1], date[2]));
    return dateObj.toDateString().substring(4);

  };

  return (
    <Card>
      <IDNumber>
        <span style={{ color: "#888eb0" }}>#</span>{invoice.id}
      </IDNumber>
      <DueDateAmountBox>
        <DueDate>Due {convertedDate()}</DueDate>
        <InvoiceAmount>£ {invoice.total}</InvoiceAmount>
      </DueDateAmountBox>
      <CustomerName>{invoice.clientName}</CustomerName>
      {invoiceStatus()}
      <SVGContainer>
      {arrowRightSVG}
      </SVGContainer>
    </Card>
  );
}

export default InvoiceCard;

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