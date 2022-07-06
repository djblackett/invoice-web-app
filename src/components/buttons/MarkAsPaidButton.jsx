import styled from "styled-components";

const Button = styled.button`
  background-color: ${({ theme }) => theme.newButton};
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: white;
  border: none;
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
function MarkAsPaidButton() {
  return <Button>Mark as Paid</Button>;
}

export default MarkAsPaidButton;
