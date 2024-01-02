import React, { ReactElement, SyntheticEvent } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import CheckboxSelection from "./CheckboxSelection";
import { changeFilter } from "../../features/invoices/filterSlice";
import { StatusKey } from "../../types/types";

const Main = styled("div")`
  align-self: center;
  box-sizing: border-box;
  background: transparent;
  z-index: 5;
  width: 8px;
  cursor: pointer;
  margin-left: 0;
  position: relative;

  @media (min-width: 325px) {
    margin-left: 8px;
  }

  @media (min-width: 350px) {
    margin-left: 16px;
  }
`;

const DropDownContainer = styled("div")`
  width: 8px;
  margin: 0 auto;
  z-index: 10;
  background: transparent;
`;

const DropDownHeader = styled.div.attrs({
  tabIndex: 0,
})`
  display: flex;
  z-index: -1;
  justify-content: center;
  align-items: center;
  align-self: center;
  box-sizing: border-box;
  width: 12px;
  font-weight: 600;
  font-size: 1.2rem;
  color: var(--colors-text);
  border-radius: 6px;
`;

const DropDownListContainer = styled("div")`
  position: absolute;
  width: 150px;
  left: -75px;
  top: 24px;
  background-color: var(--colors-background);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var("--colors-filter-shadow");

  transition: height 250ms;

  @media (min-width: 768px) {
    left: -130px;
  }
`;

const DropDownList = styled("ul")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0;
  padding-top: 12px;
  padding-bottom: 12px;
  margin: 0;
  background-color: var(--colors-background);
  box-sizing: border-box;
  border-radius: 8px;
  color: var(--colors-text);
  font-size: 1.2rem;
  font-weight: 700;
`;

const ListItem = styled.li.attrs({})`
  display: flex;
  flex-grow: 0;

  align-items: center;
  justify-content: center;
  list-style: none;
  padding: 0.5rem;
 
  width: 100%;
  background-color: var(--colors-background);

   &:hover {
     .styledCheckbox {
       border-color var("--colors-outline");
  //box-shadow:0 0 1px 1px #102447;
  //     border-radius: 3px;
     }
   }
`;

const ItemButton = styled.button`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: var(--colors-background);
  border: none;
  color: var(--colors-text);
  box-sizing: border-box;
  cursor: pointer;
`;

// type Options = {
//   options: string[];
// }

type FilterDropDownProps = {
  icon: ReactElement;
  isOpen: boolean;
  options: string[];
};

export default function FilterDropDown({
  icon,
  isOpen,
  options,
}: FilterDropDownProps) {
  const dispatch = useDispatch();

  const clickCallback = (option: string) => (e: SyntheticEvent) => {
    e.stopPropagation();
    const lowerCaseOption = option.toLowerCase() as StatusKey;
    dispatch(changeFilter(lowerCaseOption));
  };

  return (
    <Main>
      <DropDownContainer data-testid="filterDropDown">
        <DropDownHeader>{icon}</DropDownHeader>
        <DropDownListContainer style={{ height: isOpen ? "130px" : 0 }}>
          <DropDownList>
            {options.map((option: string) => (
              <ListItem key={`${option}-li`} onClick={clickCallback(option)}>
                <ItemButton>
                  <CheckboxSelection option={option} />
                </ItemButton>
              </ListItem>
            ))}
          </DropDownList>
        </DropDownListContainer>
      </DropDownContainer>
    </Main>
  );
}

FilterDropDown.propTypes = {
  // icon: PropTypes.object,
  // handleClick: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  // options: PropTypes.array.isRequired,
  // onClickOutside: PropTypes.func,
};
