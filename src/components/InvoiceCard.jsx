import styled from "styled-components";

const Card = styled.div`
  height: 134px;
  max-width: 90%;
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

const InvoiceStatusBox = styled.div`
  padding: 13px 23px 12px 24px;
  background-color: rgba(173, 216, 230, 0.2);
  border-radius: 8px;
  height: 40px;
  width: 104px;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: end;
`;

const TextCircleBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`;

const StatusText = styled.p`
  margin: 0;
  color: #33d69f;
  font-weight: bold;
  margin-left: 4px;
`;

const Circle = styled.div`
  border-radius: 50%;
  height: 8px;
  width: 8px;
  margin-right: 4px;
  background: #33d69f;
`;

function InvoiceCard() {
  return (
    <Card>
      <IDNumber>
        <span style={{ color: "#888eb0" }}>#</span>43209
      </IDNumber>
      <DueDateAmountBox>
        <DueDate>Due 28 August 2022</DueDate>
        <InvoiceAmount>$ 2400.32</InvoiceAmount>
      </DueDateAmountBox>
      <CustomerName>Jensen Huang</CustomerName>
      <InvoiceStatusBox>
        <TextCircleBox>
          <Circle />
          <StatusText>Paid</StatusText>
        </TextCircleBox>
      </InvoiceStatusBox>
    </Card>
  );
}

export default InvoiceCard;
