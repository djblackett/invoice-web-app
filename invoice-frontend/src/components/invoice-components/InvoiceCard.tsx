import styled from "styled-components";
import { useMemo } from "react";
import InvoiceStatus from "./InvoiceStatus";
import { getMoney } from "../../utils/utilityFunctions";
import { Invoice } from "../../types/types";
import * as m from "motion/react-m";

const Card = styled(m.div)`
  min-height: 134px;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 43px 43px;
  padding: 24px 12px;
  margin-bottom: 8px;
  margin-top: 8px;
  letter-spacing: -0.25px;
  line-height: 15px;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  box-shadow: 0 10px 10px -10px rgba(72, 84, 159, 0.100397);
  transition: background-color 0.4s ease-in-out;

  &:hover {
    border: 1px solid ${({ theme }) => theme.outline};
  }

  @media (min-width: 300px) {
    padding: 24px;
  }

  @media (min-width: 600px) {
    grid-template-rows: 1fr;

    // calculations for the grid-template-columns based on design spec
    // container = 672px  or 624px without padding
    // 1st box = 87  so 87/624 = 14%
    //2nd box = 143px so 143/624 = 23%
    // 3rd 136 so 136/ 624 = 21.7ish%
    // 130 / 624 = 20.8%
    // 124 / 624 = 19.9%
    // 12 / 624 = 2%

    grid-template-columns: 14% 23% 21.6% 20.8% 19.9% 2%;
    grid-template-columns: 14fr 23fr 21.6fr 20.8fr 19.9fr 2fr;
    grid-auto-flow: dense;
    align-items: center;
    justify-items: start;
    min-height: 72px;
    margin: 8px 0 8px 0;
    align-content: center;
  }

  @media (min-width: 1200px) {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
`;

const IDNumber = styled.p`
  margin: 0;
  font-weight: bold;
  color: ${({ theme }) => theme.textPlain};
`;

const DueDate = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.greyText};
`;

const DueDateAmountBox = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: 2 / 1 / 3 / 2;

  @media (min-width: 600px) {
    display: contents;
  }
`;

const InvoiceAmount = styled.p`
  font-weight: bold;
  letter-spacing: -0.8px;
  margin: 0;
  line-height: 24px;
  font-size: 16px;
  color: ${({ theme }) => theme.textPlain};
`;

const CustomerName = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textPlain};
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */

  text-align: right;
  letter-spacing: -0.25px;

  @media (min-width: 600px) {
    grid-column: 3 / 4;
  }
`;

const SVGContainer = styled.div`
  width: 100%;
  display: none;
  justify-content: center;
  align-items: center;

  @media (min-width: 600px) {
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

export type InvoiceCardProps = {
  invoice: Invoice;
};

function InvoiceCard({ invoice }: InvoiceCardProps) {
  const invoiceStatus = useMemo(() => {
    if (invoice.status === "paid") {
      return <InvoiceStatus statusType="paid" text="Paid" />;
    }
    if (invoice.status === "pending") {
      return <InvoiceStatus statusType="pending" text="Pending" />;
    }
    if (invoice.status === "draft") {
      return <InvoiceStatus statusType="draft" text="Draft" />;
    }
  }, [invoice]);

  const convertedDate = () => {
    if (invoice.paymentDue) {
      const date = invoice.paymentDue.split("-");
      const dateObj = new Date(
        Date.UTC(Number(date[0]), Number(date[1]) - 1, Number(date[2])),
      );
      const utcDateArr = dateObj.toUTCString().split(" ");
      return `${utcDateArr[1]}  ${utcDateArr[2]} ${utcDateArr[3]}`;
    }
  };

  return (
    <Card
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
      }}
    >
      <IDNumber>
        <span style={{ color: "#7E88C3" }}>#</span>
        {invoice.id.substring(0, 6)}
      </IDNumber>
      <CustomerName>{invoice.clientName}</CustomerName>
      <DueDateAmountBox>
        <DueDate>Due {convertedDate()}</DueDate>

        <InvoiceAmount>£ {getMoney(invoice.total)}</InvoiceAmount>
      </DueDateAmountBox>

      {invoiceStatus}
      <SVGContainer>{arrowRightSVG}</SVGContainer>
    </Card>
  );
}

export default InvoiceCard;
