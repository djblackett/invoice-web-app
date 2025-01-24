import{d as e,X as r}from"./index-CztSajze.js";const i=e.h1`
  font-size: 1.5rem;
  color: ${({theme:t})=>t.text};
`,n=e.div`
  height: 100%;
  top: 72px;
  bottom: 91px;
  left: 0;
  width: 100%;
  margin-top: 72px;
  background-color: ${({theme:t})=>t.formBackground};
  position: fixed;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  filter: drop-shadow(2px 2px 2px bottom);
  align-self: flex-start;
  z-index: 50;
  max-width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 1rem;
  padding-bottom: 2rem;

  @media (min-width: 768px) {
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 1rem;
    padding-bottom: 2rem;
    max-width: 700px;
    margin-top: 0;
    right: 616px;
    max-height: calc(100vh - 72px);
  }

  @media (min-width: 1200px) {
    left: 90px;
    padding-left: 5rem;
    top: 0;
    max-height: initial;
  }
`,d=e.p`
  color: ${({theme:t})=>t.outline};
  font-weight: bold;
  font-size: 0.75rem;
  margin-bottom: 1.5rem;
`,o=e.input`
  cursor: pointer;
  width: 100%;
  height: 48px;
  border-radius: 4px;
  border: 1px solid ${({theme:t})=>t.formFieldOutline};
  padding: 17px 20px 16px 20px;
  margin-bottom: 1.5rem;
  font-family: ${({theme:t})=>t.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  caret-color: #7c5dfa;
  outline: none;

  letter-spacing: -0.25px;

  color: ${({theme:t})=>t.textPlain};
  background-color: ${({theme:t})=>t.inputBackgroundColor};

  &:focus,
  &:hover {
    border-color: ${({theme:t})=>t.formFieldOutlineFocus};
  }

  .custom-input {
    padding: 0;
  }

  ${t=>t.$long&&r`
      width: 100%;
    `}
`,c=e(o)`
  width: 100%;
  $long: false;

  @media (min-width: 768px) {
    width: 100%;
  }
`,p=e(o)`
  width: 100%;

  @media (min-width: 768px) {
    max-width: 152px;
  }
`,l=e(o)`
  width: max-content;

  @media (min-width: 768px) {
    width: 152px;
    min-width: revert;
  }
`,s=e.label`
  color: ${({theme:t})=>t.greyText};
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
`,m=e.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 250ms ease-in-out;
  z-index: 100;
`,x=e.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  &:first-of-type {
    margin-top: 2rem;
  }

  &:last-of-type {
    margin-bottom: 2.8rem;
  }
`,g=e.li`
  color: #ec5757;
  margin: 0;
  padding: 0;
`,h=e.p`
  color: #ec5757;
  margin: 0;
  padding: 0;
  position: absolute;
  right: 1.5rem;
`,f=e.div`
  display: flex;
  justify-content: space-between;
  max-width: 100%;
  flex-wrap: wrap;
  flex-direction: column;
  z-index: 60;

  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    max-width: initial;
    flex-wrap: nowrap;
  }

  // section targets the react-date-picker component to apply theming

  .react-datepicker__header {
    background-color: ${({theme:t})=>t.background};
    color: ${({theme:t})=>t.dateText};
    border: none;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .react-datepicker__day,
  .react-datepicker__month-text,
  .react-datepicker__quarter-text,
  .react-datepicker__year-text {
    color: ${({theme:t})=>t.dateText};
  }

  .react-datepicker__day {
    &:hover {
      background: #7c5dfa;
      color: white;
    }
  }

  .react-datepicker {
    background-color: ${({theme:t})=>t.background};
    color: ${({theme:t})=>t.dateText};
    border: none;
    box-shadow: ${({theme:t})=>t.filterShadow};
    transition: all 250ms ease-in-out;
  }

  .react-datepicker__month-year-dropdown {
    background-color: ${({theme:t})=>t.background};
    color: ${({theme:t})=>t.dateText};
    border: none;
  }

  .react-datepicker__day--selected {
    color: #7c5dfa;
    background-color: transparent;
    font-weight: bold;
  }

  .react-datepicker__day-names {
    display: none;
  }

  .react-datepicker__triangle {
    display: none;
  }

  .react-datepicker__current-month {
    color: ${({theme:t})=>t.dateText};
    align-self: center;
    justify-self: center;
    font-family: "Spartan", sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 15px;

    letter-spacing: -0.25px;
    text-align: center;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: rgba(124, 93, 250, 0.5);
  }
`;export{p as A,d as B,l as C,m as D,i as E,n as F,o as I,s as L,c as S,x as a,g as b,h as c,f as d};