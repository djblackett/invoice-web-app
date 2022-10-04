import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
// import IonIcon from "@reacticons/ionicons";
// import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import CheckboxSelection from "./CheckboxSelection";
import { useDispatch } from "react-redux";
import { changeFilter } from "../../features/invoices/filterSlice";

const Main = styled("div")`
  align-self: center;
  box-sizing: border-box;
  background: transparent;
  height: 50px;
  z-index: 5;

  width: 8px;
  cursor: pointer;
  filter: drop-shadow(2px 2px 2px bottom);
  margin-left: 16px;
  position: relative;

  @media (min-width: 600px) {
  }

  @media (min-width: 900px) {
    /* grid-area: 1 / 3 / 2 / 4; */
  }

  @media (min-width: 1200px) {
    /* justify-self: end; */
    /* grid-area: 1 / 3 / 2 / 5; */
    /* margin: 0; */
    /* width: 250px; */
  }
`;

const DropDownContainer = styled("div")`
  width: 8px;
  margin: 0 auto;
  z-index: 10;
  filter: drop-shadow(2px 2px 2px bottom);
  background: transparent;
`;

const DropDownHeader = styled.div.attrs({
  tabIndex: "0",
})`
  display: flex;
  z-index: -1;
  justify-content: center;
  align-items: center;
  align-self: center;
  box-sizing: border-box;
  height: 50px;
  width: 12px;
  font-weight: 600;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
  border-radius: 6px;

  color: ${({ theme }) => theme.text};
  /* background-color: ${({ theme }) => theme.background}; */
`;

const DropDownListContainer = styled("div")`
  position: absolute;
  width: 150px;
  left: -75px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  overflow: hidden;
  filter: drop-shadow(2px 2px 2px gray);
`;

const DropDownList = styled("ul")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0;
  margin: 0;

  background-color: ${({ theme }) => theme.background};
  box-sizing: border-box;
  border-radius: 10px;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  font-weight: 600;
`;

const ListItem = styled.li.attrs({})`
  display: flex;

  align-items: center;
  justify-content: center;
  list-style: none;
  padding: 0.5rem;
  cursor: pointer;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
  transition: all 0.2s;

  /* &:hover {
    filter: brightness(90%);
  } */
`;

const ItemButton = styled.button`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
  border: none;
  color: ${({ theme }) => theme.text};
  box-sizing: border-box;
`;

const OptionLabel = styled.label`
  margin-left: 0.5rem;
  font-family: "Spartan";
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;
  color: ${({ theme }) => theme.textPlain};
`;

export default function FilterDropDown({ icon, handleClick, isOpen, options }) {
  // const [isOpen, setIsOpen] = useState(false);

  // const toggling = () => setIsOpen(!isOpen);
  // const togglingButton = (e) => {
  //   if (e.charCode === 13 || e.keyCode === 13) {
  //     setIsOpen(!isOpen);
  //   }
  // };

  useEffect(() => {
    // console.log(isOpen);
  }, [isOpen]);

  const dispatch = useDispatch();
  const onOptionClicked = (option) => () => {
    // handleChangeFilter(status);
    dispatch(changeFilter(option.toLowerCase()));
    // console.log(option + "line 153");
  };

  const clickCallback = useCallback(
    (option) => () => {
      // handleChangeFilter(status);
      dispatch(changeFilter(option.toLowerCase()));
      // console.log(option);
    },
    []
  );

  // todo make the drop down from scratch so I can style it correctly

  return (
    <Main>
      <DropDownContainer>
        <DropDownHeader onClick={handleClick}>{icon}</DropDownHeader>
        {isOpen && (
          <DropDownListContainer>
            <DropDownList>
              {options.map((option, index) => (
                <ListItem key={index + "-li"} onClick={clickCallback(option)}>
                  <ItemButton>
                    <CheckboxSelection option={option} />
                  </ItemButton>
                </ListItem>
              ))}
            </DropDownList>
          </DropDownListContainer>
        )}
      </DropDownContainer>
    </Main>
  );
}

FilterDropDown.propTypes = {
  icon: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
};
