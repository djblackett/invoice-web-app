import { ReactElement, SyntheticEvent } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import CheckboxSelection from "./CheckboxSelection.tsx";
import { changeFilter } from "../store/filterSlice.ts";
import { ClickOutsideProvider } from "@shelf/react-outside-click";
import { StatusKey } from "@/features/invoices/types/invoiceTypes.ts";

const Main = styled.div`
  align-self: center;
  box-sizing: border-box;
  background: transparent;
  z-index: 5;
  width: 8px;
  cursor: pointer;
  margin-left: 0;
  position: relative;
  pointer-events: auto;
  border: none;

  @media (min-width: 325px) {
    margin-left: 8px;
  }

  @media (min-width: 350px) {
    margin-left: 16px;
  }
`;

const DropDownContainer = styled.button`
  width: 8px;
  margin: 0 auto;
  z-index: 10;
  background: transparent;
  border: none;
  display: flex;
  z-index: -1;
  justify-content: center;
  align-items: center;
  align-self: center;
  box-sizing: border-box;
  width: 1.5rem;
  font-weight: 600;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
  border-radius: 6px;
`;

// const DropDownHeader = styled.span.attrs({})`
//   display: flex;
//   z-index: -1;
//   justify-content: center;
//   align-items: center;
//   align-self: center;
//   box-sizing: border-box;
//   width: 12px;
//   font-weight: 600;
//   font-size: 1.2rem;
//   color: ${({ theme }) => theme.text};
//   border-radius: 6px;
// `;

const DropDownListContainer = styled("div")`
  position: absolute;
  width: 150px;
  left: -75px;
  top: 24px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.filterShadow};

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
  background-color: ${({ theme }) => theme.background};
  box-sizing: border-box;
  border-radius: 8px;
  color: ${({ theme }) => theme.text};
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
  background-color: ${({ theme }) => theme.background};

  &:hover {
    .styledCheckbox {
      border-color: ${({ theme }) => theme.outline};
    }
  }
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
  cursor: pointer;
`;

type FilterDropDownProps = {
  icon: ReactElement;
  isOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  options: string[];
};

export default function FilterDropDown({
  icon,
  isOpen,
  setIsFilterOpen,
  options,
}: FilterDropDownProps) {
  const dispatch = useDispatch();

  const clickCallback = (option: string) => (e: SyntheticEvent) => {
    e.stopPropagation();
    const lowerCaseOption = option.toLowerCase() as StatusKey;
    dispatch(changeFilter(lowerCaseOption));
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  return (
    <Main>
      <DropDownContainer
        data-testid="filterDropDown"
        tabIndex={0}
        aria-label="Filter invoices"
      >
        {icon}
      </DropDownContainer>
      <ClickOutsideProvider onOutsideClick={closeFilter}>
        <DropDownListContainer style={{ height: isOpen ? "130px" : 0 }}>
          <DropDownList data-testid="draft-filter">
            {options.map((option: string) => (
              <ListItem key={`${option}-li`}>
                <ItemButton onClick={clickCallback(option)}>
                  <CheckboxSelection option={option} />
                </ItemButton>
              </ListItem>
            ))}
          </DropDownList>
        </DropDownListContainer>
      </ClickOutsideProvider>
    </Main>
  );
}
