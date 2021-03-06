import styled from "styled-components";
import { useDispatch } from "react-redux";
import { removeInvoice } from "../../features/invoices/invoicesSlice";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";

const Button = styled.button`
  background-color: #ec5757;
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
    background-color: #ff9797;
  }
`;
function DeleteButton({ invoice, handleClick }) {
  return <Button onClick={handleClick}>Delete</Button>;
}

export default DeleteButton;

DeleteButton.propTypes = {
  invoice: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
};
