import styled, { css } from "styled-components";

export const EditTitle = styled.h1`
  font-size: 1.5rem;
  color: var(--colors-text);
`;

export const FormContainerDarkenModal = styled.div`
  height: 100%;
  top: 72px;
  bottom: 91px;
  left: 0;
  //background-color: var(--colors-form-background);
  background-color: pink;
  position: fixed;
  display: flex;
  flex-direction: column;
  transition-property: all;
  transition-duration: 250ms;
  transition-timing-function: ease-in-out;
  overflow-x: hidden;
  filter: drop-shadow(2px 2px 2px);
  align-self: flex-start;
  z-index: 50;
  max-width: 100%;
border: 3px solid red;

  @media (min-width: 768px) {
    padding-left: 5rem;
    padding-right: 2rem;
    padding-top: 1rem;
    padding-bottom: 2rem;
    max-width: 700px;
    right: 616px;
    max-height: calc(100vh - 72px);
  }

  @media (min-width: 1200px) {
    left: 90px;
    padding-left: 5rem;
    top: 0;
    max-height: initial;
  }
`;

export const BillText = styled.p`
  color: var(--colors-outline);
  font-weight: bold;
  font-size: 0.75rem;
  margin-bottom: 1.5rem;
`;

type InputProps = {
  readonly $long?: boolean;
};

export const Input = styled.input<InputProps>`
  cursor: pointer;
  width: 100%;
  height: 48px;
  border-radius: 4px;
  border: 1px solid var(--colors-form-field-outline);
  padding: 17px 20px 16px 20px;
  margin-bottom: 1.5rem;
  font-family: var(--theme-font),sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  caret-color: #7c5dfa;
  outline: none;

  letter-spacing: -0.25px;

  color: var(--colors-text-plain);
  background-color: var(--colors-input-background);

  &:focus,
  &:hover {
    border-color: var(--colors-form-field-outline-focus);
  }

  .custom-input {
    padding: 0;
  }

  ${(props) =>
    props.$long &&
    css`
      width: 100%;
    `}
`;

export const StreetAddressInput = styled(Input)`
  width: 100%;
  $long: false;
  @media (min-width: 768px) {
    width: 100%;
  }
`;

export const AddressDetailInput = styled(Input)`
  width: 100%;

  @media (min-width: 768px) {
    max-width: 152px;
  }
`;
export const CountryInput = styled(Input)`
  width: max-content;

  @media (min-width: 768px) {
    width: 152px;
    min-width: revert;
  }
`;

export const Label = styled.label`
  color: var(--colors-grey-text);
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
`;
export const DarkenScreen = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 250ms ease-in-out;
  z-index: 100;
`;

export const ErrorList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  //transition: height 300ms ease-in-out; // nice idea but complicated to implement

  &:first-of-type {
    margin-top: 2rem;
  }

  &:last-of-type {
    margin-bottom: 2.8rem;
  }
`;
export const ErrorText = styled.li`
  color: #ec5757;
  margin: 0;
  padding: 0;
`;

export const ErrorTextInline = styled.p`
  color: #ec5757;
  margin: 0;
  padding: 0;
  position: absolute;
  right: 1.5rem;
`;

export const DateAndPaymentContainer = styled.div`
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
    background-color: var(--colors-background);
    color: var(--colors-date-text);
    border: none;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .react-datepicker__day,
  .react-datepicker__month-text,
  .react-datepicker__quarter-text,
  .react-datepicker__year-text {
    color: var(--colors-date-text);
  }

  .react-datepicker__day {
    &:hover {
      background: #7c5dfa;
      color: white;
    }
  }

  .react-datepicker {
    background-color: var(--colors-background);
    color: var(--colors-date-text);
    border: none;
    box-shadow: var(--colors-filter-shadow);
    transition: all 250ms ease-in-out;
  }

  .react-datepicker__month-year-dropdown {
    background-color: var(--colors-background);
    color: var(--colors-date-text);
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
    color: var(--colors-date-text);
    align-self: center;
    justify-self: center;
    font-family: "Spartan", sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 15px;
    /* identical to box height, or 125% */
    letter-spacing: -0.25px;
    text-align: center;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: rgba(124, 93, 250, 0.5);
  }
`;
