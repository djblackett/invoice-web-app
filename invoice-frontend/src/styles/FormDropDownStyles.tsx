import styled from "styled-components";

export const Main = styled.div.attrs({
  tabIndex: 0,
})`
  display: inline;
  z-index: 50;
  position: relative;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.inputBackgroundColor};
  cursor: pointer;
  margin-bottom: 30px;
  outline: none;

  width: 100%;
  height: 48px;
  border-radius: 4px;

  border: 1px solid ${({ theme }) => theme.formFieldOutline};

  @media (min-width: 768px) {
    width: 240px;
    max-width: 100%;
  }

  &:focus,
  &:hover {
    border: 1px solid ${({ theme }) => theme.formFieldOutlineFocus};
  }
`;

export const DropDownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding-left: 20px;
  padding-top: 17px;
  padding-bottom: 16px;
  padding-right: 1.5rem;
  background-color: transparent;
  width: 100%;
  height: 48px;
  border-radius: 4px;
  border-color: ${({ theme }) => theme.formFieldOutline};

  h2 {
    writing-mode: horizontal-tb !important;
    text-rendering: auto;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    appearance: auto;
    -webkit-rtl-ordering: logical;
    cursor: text;
    padding: 1px 2px;
    font-weight: 700;
    font-size: 12px;
    line-height: 15px;
    /* identical to box height, or 125% */
    letter-spacing: -0.25px;
    margin: 0;
    transform: translateY(-2px);
    color: ${({ theme }) => theme.text};
  }
`;

export const DropDownList = styled.ul`
  position: absolute;
  width: 100%;
  z-index: 100;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: ${({ theme }) => theme.paymentTermsBackground};
  box-sizing: border-box;
  height: fit-content;
  border-radius: 4px;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  font-weight: 600;
  box-shadow: ${({ theme }) => theme.filterShadow};
  transition: height 250ms ease-in-out;

  &:first-child {
    padding-top: 0.8em;
  }

  &:last-child {
    border: none;
  }
`;

export const ListItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  list-style: none;
  height: 48px;
  width: 100%;
  border-color: ${({ theme }) => theme.formFieldOutline};
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.paymentOptionBorder};
`;

export const ItemButton = styled.button`
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.paymentTermsBackground};
  border: none;
  cursor: pointer;
  outline: none;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: ${({ theme }) => theme.textPlain};
  padding: 0.5rem;

  &:last-child {
    border: none;
  }

  &:hover {
    color: #7c5dfa;
  }
`;
