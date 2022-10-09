import React, {useCallback, useEffect, useRef, useState} from "react";
import styled from "styled-components";
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
  //filter: drop-shadow(2px 2px 2px bottom);
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

 
  
`;

const DropDownListContainer = styled("div")`
  position: absolute;
  width: 150px;
  left: -75px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: ${({theme}) => theme.filterShadow};
  transition: height 250ms;
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

export default function FilterDropDown({ icon, isOpen, options, onClickOutside }) {

  // const ref = useRef(null);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (ref.current && !ref.current.contains(event.target)) {
  //       onClickOutside && onClickOutside();
  //     }
  //   };
  //   document.addEventListener('click', handleClickOutside, true);
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside, true);
  //   };
  // }, [ onClickOutside ]);




  const dispatch = useDispatch();
  const clickCallback =  (option) => (e) => {
     e.stopPropagation();
      dispatch(changeFilter(option.toLowerCase()));
    };


  return (
    <Main>
      <DropDownContainer>
        <DropDownHeader>{icon}</DropDownHeader>
        {/*{isOpen && (*/}
          <DropDownListContainer style={{height: isOpen ? "106px" : 0}}>
            <DropDownList >
              {options.map((option, index) => (
                <ListItem key={index + "-li"} onClick={clickCallback(option)}>
                  <ItemButton>
                    <CheckboxSelection option={option} />
                  </ItemButton>
                </ListItem>
              ))}
            </DropDownList>
          </DropDownListContainer>
        {/*)}*/}
      </DropDownContainer>
    </Main>
  );
}

FilterDropDown.propTypes = {
  icon: PropTypes.object,
  handleClick: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
  onClickOutside: PropTypes.func,
};
