import styled from "styled-components";

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

function InvoiceStatus({ text, textColor, backgroundColor }) {
  return (
    <InvoiceStatusBox style={{ backgroundColor: backgroundColor }}>
      <TextCircleBox>
        <Circle style={{ backgroundColor: textColor }} />
        <StatusText style={{ color: textColor }}>{text}</StatusText>
      </TextCircleBox>
    </InvoiceStatusBox>
  );
}

export default InvoiceStatus;
