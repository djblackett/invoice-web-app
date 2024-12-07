import styled from "styled-components";
import { WhiteCircle, NewText } from "../../styles/AllInvoicesToolbarStyles";


const PrimaryButton = styled.div`
   border-radius: 24px;
  background-color: #7c5dfa;
  height: 44px;
  width: 90px;
  display: flex;
  align-items: center;
  margin-left: 18px;
  cursor: pointer;
  padding-left: 0.5rem;

  &:hover {
    background-color: #9277ff;
  }

  @media (min-width: 600px) {
    height: 48px;
    width: 150px;
    padding-right: 1rem;
    margin-left: 40px;
  }

  @media (min-width: 1200px) {
  }
`;

const plusSign = (
  <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z"
      fill="#7C5DFA"
      fillRule="nonzero"
    />
  </svg>
);

interface NewInvoiceButtonProps {
  handleClick: () => void;
}
function NewInvoiceButton({ handleClick }: NewInvoiceButtonProps) {
  return <PrimaryButton onClick={handleClick}><WhiteCircle>{plusSign}</WhiteCircle>
    <NewText>
      New <span className="largeScreenText">Invoice</span>
    </NewText></PrimaryButton>;
}

export default NewInvoiceButton;
