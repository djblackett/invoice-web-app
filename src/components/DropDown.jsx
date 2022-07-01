import React, { useState } from "react";
import styled from "styled-components";
// import IonIcon from "@reacticons/ionicons";
// import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";

const Main = styled("div")`
  align-self: center;
  box-sizing: border-box;
  background: transparent;
  height: 50px;
  z-index: 10;
  /* grid-area: 2 / 1 / 3 / 2; */
  width: 8px;
  cursor: pointer;
  filter: drop-shadow(2px 2px 2px bottom);
  margin-left: 16px;
  position: relative;
  /* margin: 20px 5%; */ /* margin-bottom: 30px; */
  @media (min-width: 600px) {
    /* grid-area: 1 / 2 / 2 / 3;
    justify-self: start; */
    /* margin: 0; */
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
  justify-content: center;
  align-items: center;
  align-self: center;
  box-sizing: border-box;
  height: 50px;
  /* padding: 20px; */
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
  /* background: transparent; */
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
  /* background: transparent; */
  background-color: ${({ theme }) => theme.background};
  /* padding-bottom: 5px; */
  box-sizing: border-box;
  border-radius: 10px;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  font-weight: 600;

  > * {
    &:not(:first-child) {
      /* padding-top: 0.8em; */
      /* border-top: initial; */
      border-top: 1px solid #888eb0;
    }
  }
`;

const ListItem = styled.li.attrs({
  // tabIndex: "0",
})`
  display: flex;

  align-items: center;
  justify-content: center;
  list-style: none;
  padding: 0.5rem;
  cursor: pointer;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
  transition: all 0.2s;

  &:hover {
    filter: brightness(90%);
  }
`;

const ItemButton = styled.button`
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
  border: none;
  color: ${({ theme }) => theme.text};
`;

const options = ["All", "Paid", "Pending", "Draft"];

export default function DropDown({ icon, handleChangeFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  // const [regionState, setRegionState] = useState(null);
  // const [searchParams, setSearchParams] = useSearchParams();

  const toggling = () => setIsOpen(!isOpen);
  const togglingButton = (e) => {
    if (e.charCode === 13 || e.keyCode === 13) {
      setIsOpen(!isOpen);
    }
  };

  const onOptionClicked = (status) => () => {
    // setRegionState(region);
    setIsOpen(false);
    handleChangeFilter(status);
    console.log(status);
    // if (regionState !== "Filter by Region") {
    //   setSearchParams({ region });
    // } else {
    //   setSearchParams({});
    // }
  };

  // todo make the drop down from scratch so I can style it correctly

  // function handleChange(event) {
  //   if (regionState && regionState !== "Filter by Region") {
  //     setSearchParams({ regionState });
  //   } else {
  //     setSearchParams({});
  //   }
  // }

  return (
    <Main>
      <DropDownContainer>
        <DropDownHeader onClick={toggling} onKeyPress={togglingButton}>
          {/* {regionState || "Filter by Region"} */}
          {/* <IonIcon name="chevron-down-outline"></IonIcon> */}
          {icon}
        </DropDownHeader>
        {isOpen && (
          <DropDownListContainer>
            <DropDownList>
              {options.map((option, index) => (
                <ListItem key={index + "-li"} onClick={onOptionClicked(option)}>
                  <ItemButton>{option}</ItemButton>
                </ListItem>
              ))}
            </DropDownList>
          </DropDownListContainer>
        )}
      </DropDownContainer>
    </Main>
  );
}

DropDown.propTypes = {
  icon: PropTypes.object,
  handleChangeFilter: PropTypes.func.isRequired,
};
