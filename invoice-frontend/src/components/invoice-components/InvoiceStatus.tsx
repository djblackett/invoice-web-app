import styled from "styled-components";
import PropTypes from "prop-types";
import styles from "../../styles/main.module.css"


const InvoiceStatusBox = styled.div`
  padding: 13px 23px 12px 24px;
  border-radius: 6px;
  height: 40px;
  width: 104px;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: end;

  @media (min-width: 600px) {
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
  color: inherit;
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
  background-color: inherit;
`;

export type InvoiceStatusProps = {
  statusType: string;
  text: string;
};

function InvoiceStatus({ text, statusType }: InvoiceStatusProps) {
  return (
    <InvoiceStatusBox className={styles[statusType]}>
      <TextCircleBox>
        <Circle className={styles.circle} />
        <StatusText>{text}</StatusText>
      </TextCircleBox>
    </InvoiceStatusBox>
  );
}

InvoiceStatus.propTypes = {
  text: PropTypes.string.isRequired,
  statusType: PropTypes.string.isRequired,
};
export default InvoiceStatus;
