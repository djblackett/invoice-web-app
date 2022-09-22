import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const Main = styled("div")`
  /* display: flex;
  align-items: center; */
  z-index: 10;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.editButton};
  cursor: pointer;
  /* filter: drop-shadow(3px 3px 3px ${({ theme }) => theme.shadow}); */
  /* margin: 20px 5%; */
  margin-bottom: 30px;

  width: 100%;
  height: 48px;
  border-radius: 4px;
  /* border-color: ; */
  border: 2px solid ${({ theme }) => theme.formFieldOutline};
  /* outline: none; */
  /* padding: 17px 20px 16px 20px; */

  @media (min-width: 768px) {
    width: 240px;
  }
`;

const DropDownHeader = styled.div.attrs({
  tabIndex: 0,
})`
  /* display: flex;
  justify-content: space-between;
  align-items: flex-start; */
  box-sizing: border-box;
  padding: 0.4rem;
  padding-left: 20px;
  padding-top: 17px;
  padding-bottom: 16px;

  background-color: transparent;

  font-family: "Spartan";
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;

  width: 240px;
  height: 48px;
  border-radius: 4px;
  border-color: ${({ theme }) => theme.formFieldOutline};
`;

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  background-color: ${({ theme }) => theme.editButton};
  /* padding-bottom: 5px; */
  box-sizing: border-box;
  height: fit-content;
  border-radius: 4px;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  font-weight: 600;
  /* filter: drop-shadow(4px, 4px, 4px, black); */
  filter: drop-shadow(2px 2px 2px gray);

  &:first-child {
    padding-top: 0.8em;
  }

  &:last-child {
    border: none;
  }
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;

  list-style: none;
  height: 48px;
  width: 100%;
  border-color: ${({ theme }) => theme.formFieldOutline};
  cursor: pointer;
  /* background-color: ${({ theme }) => theme.background}; */

  &:hover {
    filter: brightness(80%);
  }

  border-color: ${({ theme }) => theme.formFieldOutline};
  border-bottom: 1px solid;
`;

const ItemButton = styled.button`
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.editButton};
  border: none;
  cursor: pointer;

  font-family: "Spartan";
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;

  color: ${({ theme }) => theme.textPlain};

  &:hover {
    color: #7c5dfa;
  }
`;

const options = ["Net 1 Day", "Net 7 Days", "Net 14 Days", "Net 30 Days"];

function FormDropDown({
  selectedPaymentOption,
  handleChangeSelectedOption,
  isPaymentOpen,
  handlePaymentClick,
  handlePaymentSelect,
}) {
  const [selected, setSelected] = useState("Net 1 Day");

  const onOptionClicked = (option) => (e) => {
    e.preventDefault();
    handlePaymentSelect();
    setSelected(option);
    handleChangeSelectedOption(option);
  };

  return (
    <Main>
      {/* <DropDownContainer> */}
      <DropDownHeader onClick={handlePaymentClick}>
        {selectedPaymentOption}
      </DropDownHeader>
      {isPaymentOpen && (
        <DropDownList>
          {options.map((option, index) => (
            <ListItem key={index + "-li"} onClick={onOptionClicked(option)}>
              <ItemButton key={index}>{option}</ItemButton>
            </ListItem>
          ))}
        </DropDownList>
      )}
      {/* </DropDownContainer> */}
    </Main>
  );
}

export default FormDropDown;

FormDropDown.propTypes = {
  isPaymentOpen: PropTypes.bool.isRequired,

  handlePaymentClick: PropTypes.func.isRequired,
  handlePaymentSelect: PropTypes.func.isRequired,
  selectedPaymentOption: PropTypes.string,
  handleChangeSelectedOption: PropTypes.func,
};
