import styled from "styled-components";
import PropTypes from "prop-types";

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
  
  @media (min-width: 600px) {
    width: 84%;
    justify-self: start;
  }
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
  font-family: "Spartan";
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;
`;

const Circle = styled.div`
  border-radius: 50%;
  height: 8px;
  width: 8px;
  margin-right: 4px;
  background: #33d69f;
`;

function InvoiceStatus({ text, textColor, backgroundColor, isInToolbar }) {
  return (
    <InvoiceStatusBox style={{ backgroundColor: backgroundColor, width: isInToolbar ? "20%" : "revert" }}>
      <TextCircleBox>
        <Circle style={{ backgroundColor: textColor }} />
        <StatusText style={{ color: textColor }}>{text}</StatusText>
      </TextCircleBox>
    </InvoiceStatusBox>
  );
}

InvoiceStatus.propTypes = {
  text: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
    isInToolbar: PropTypes.bool,
};
export default InvoiceStatus;
