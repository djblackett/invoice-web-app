import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { SVG } from "../buttons/NewItemButton";

const Main = styled("div")`
  z-index: 10;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.inputBackgroundColor};
  cursor: pointer;
  margin-bottom: 30px;

  width: 100%;
  height: 48px;
  border-radius: 4px;

  border: 2px solid ${({ theme }) => theme.formFieldOutline};
  
  @media (min-width: 768px) {
    width: 240px;
  }
`;

const DropDownHeader = styled.div.attrs({
  tabIndex: 0,
})`
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding-left: 20px;
  padding-top: 17px;
  padding-bottom: 16px;
  padding-right: 1.5rem;

  background-color: transparent;


  
  h2 {
    writing-mode: horizontal-tb !important;
    text-rendering: auto;

    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    appearance: auto;
    -webkit-rtl-ordering: logical;
    cursor: text;
    
    padding: 1px 2px;
   

    font-family: "League Spartan", sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 15px;
    /* identical to box height, or 125% */

    letter-spacing: -0.25px;
    
    margin: 0;
    
    transform: translateY(-2px);
  }

  width: 100%;
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

  /* border-color: ${({ theme }) => theme.formFieldOutline}; */
  border-bottom: 1px solid ${({ theme }) => theme.formFieldOutline};
`;

const ItemButton = styled.button`
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.inputBackgroundColor};
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

  &:first-child {
    padding-top: 0.8em;
  }

  &:last-child {
    border: none;
  }

  &:hover {
    color: #7c5dfa;
  }
`;

const options = ["Net 1 Day", "Net 7 Days", "Net 14 Days", "Net 30 Days"];

const arrowDown = (
  <svg width="11" height="7" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 1l4.228 4.228L9.456 1"
      stroke="#7C5DFA"
      strokeWidth="2"
      fill="none"
      fillRule="evenodd"
    />
  </svg>
);

function FormDropDown({
  selectedPaymentOption,
  handleChangeSelectedOption,
  isPaymentOpen,
  handlePaymentClick,
  handlePaymentSelect,
}) {
  const [selected, setSelected] = useState(String(selectedPaymentOption) || "");

  const onOptionClicked = (option) => (e) => {
    e.preventDefault();
    handlePaymentSelect();

    const num = Number(option.split(" ")[1]);
    handleChangeSelectedOption(num);
  };


  useEffect(() => {
    if (selectedPaymentOption === 1) {
      setSelected("Net 1 Day");
    } else if (String(selectedPaymentOption).match(/\d+/)) {
      setSelected(`Net ${selectedPaymentOption} Days`);
    }
  }, [selectedPaymentOption]);

  return (
    <Main>
      <DropDownHeader onClick={handlePaymentClick}>
        <h2>{selected}</h2>
        <SVG>{arrowDown}</SVG>
      </DropDownHeader>
      {isPaymentOpen && (
        <DropDownList>
          {options.map((option, index) => (
            <ListItem key={index + "-li"} onClick={onOptionClicked(option)}>
              <ItemButton key={index}>
                {options.find((term) => term.includes(String(option)))}
              </ItemButton>
            </ListItem>
          ))}
        </DropDownList>
      )}
    </Main>
  );
}

export default FormDropDown;

FormDropDown.propTypes = {
  isPaymentOpen: PropTypes.bool.isRequired,

  handlePaymentClick: PropTypes.func.isRequired,
  handlePaymentSelect: PropTypes.func.isRequired,
  selectedPaymentOption: PropTypes.number,
  handleChangeSelectedOption: PropTypes.func,
};