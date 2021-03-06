import styled from "styled-components";
import PropTypes from "prop-types";

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 504px;
  height: 48px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.greyButton};
  border: none;
`;

export const SVG = styled.svg`
  width: 11px;
  height: 11px;
`;

const ButtonText = styled.p`
  color: ${({ theme }) => theme.greyText};
  font-family: "Spartan";
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */

  text-align: center;
  letter-spacing: -0.25px;
  margin-left: 0.25rem;
`;
const plusIcon = (
  <path
    d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z"
    fill="#7C5DFA"
    fillRule="nonzero"
  />
);

function NewItemButton({ handleAddNewItem }) {
  const handleClick = (e) => {
    e.preventDefault();
    handleAddNewItem();
  };
  return (
    <Button onClick={handleClick}>
      <SVG>{plusIcon}</SVG>
      <ButtonText>Add New Item</ButtonText>
    </Button>
  );
}

export default NewItemButton;

NewItemButton.propTypes = {
  handleAddNewItem: PropTypes.func.isRequired,
};
