import styled from "styled-components";
import { useDispatch } from "react-redux";
import { markAsPaid } from "../../features/invoices/invoicesSlice";
import PropTypes from "prop-types";

const Button = styled.button`
  background-color: ${({ theme }) => theme.newButton};
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: white;
  border: none;
  cursor: pointer;
  font-family: "Spartan";
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  margin: 0.25rem;
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;

  &:hover {
    background-color: ${({ theme }) => theme.newButtonHover};
  }
`;
function MarkAsPaidButton({ invoice }) {
  const dispatch = useDispatch();
  const handleClick = () => {
    if (invoice.status === "pending") {
      dispatch(markAsPaid(invoice.id));
    }
  }

  return (
    <Button onClick={handleClick}>
      Mark as Paid
    </Button>
  );
}

export default MarkAsPaidButton;

MarkAsPaidButton.propTypes = {
  invoice: PropTypes.object.isRequired,
};
