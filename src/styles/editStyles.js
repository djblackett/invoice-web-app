import styled, {css} from "styled-components";
import FormEntry from "../components/form-components/FormEntry";

export const EditTitle = styled.h1`
  font-size: 1.5rem;
  color: ${({theme}) => theme.text};
`;
export const FormContainerDarkenModal = styled.div`
  height: 100%;
  top: 72px;
  bottom: 91px;
  left: 0;
  
  width: 100%;
  background-color: ${({theme}) => theme.background};
  //background-size: cover;
  position: fixed;

  display: flex;
  flex-direction: column;
  transition-property: all;
  transition-duration: 250ms;
  transition-timing-function: ease-in-out;
  overflow-x: hidden;
  filter: drop-shadow(2px 2px 2px bottom);

  align-self: flex-start;
  z-index: 50;

  max-width: 100%;

  @media (min-width: 768px) {
    padding-left: 5rem;
    padding-right: 2rem;
    padding-top: 1rem;
    padding-bottom: 2rem;
    max-width: 700px;
    /* top: 72px; */
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
  color: ${({theme}) => theme.outline};
  font-weight: bold;
  font-size: 0.75rem;
  /* margin: 5px; */
  margin-bottom: 1.5rem;
`;


export const Input = styled.input`
  width: 100%;
  height: 48px;
  border-radius: 4px;
  border-color: ${({theme}) => theme.formFieldOutline};
  border-style: solid;
  padding: 17px 20px 16px 20px;
  margin-bottom: 1.5rem;
  font-family: ${({theme}) => theme.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  
  //outline-color: ${({ theme }) => theme.outline};
  caret-color: #7C5DFA;
  outline: none;

  letter-spacing: -0.25px;

  color: ${({theme}) => theme.textPlain};
  background-color: ${({theme}) => theme.inputBackgroundColor};

  &:focus {
    border-color: ${({theme}) => theme.formFieldOutlineFocus};
  }

  .custom-input {
    padding: 0;
  }
  
  ${props => props.long && css`
    width: 100%;
  `}
`;

export const DateButton = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 4px;
  border-color: ${({theme}) => theme.formFieldOutline};
  border-style: solid;
  padding: 0;
  margin-bottom: 1.5rem;
  font-family: ${({theme}) => theme.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;


  letter-spacing: -0.25px;

  color: ${({theme}) => theme.textPlain};
  background-color: ${({theme}) => theme.inputBackgroundColor};

  &:focus {
    border-color: black;
  }

  ${props => props.long && css`
    width: 100%;
  `}
`

export const StreetAddressInput = styled(Input)`
  width: 100%;

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
  width: 100%;
 

  @media (min-width: 768px) {
    width: 152px;
    min-width: revert;
  }
`;

export const Label = styled.label`
  color: ${({theme}) => theme.greyText};
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
`;
export const DarkenScreen = styled.div`
  position: fixed;
  //overflow-y: hidden;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 250ms ease-in-out;
  z-index: 100;
`;

export const LongEntry = styled(Input)`
  max-width: 100%;
  width: 100%;
  @media (min-width: 768px) {
    max-width: initial;
    width: 504px;
  }
`;
export const ErrorText = styled.p`
  color: red;

  margin-top: 0.5rem;
`;
export const ErrorTextInline = styled(ErrorText)`
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

  .react-datepicker__header {
    background-color: ${({theme})=> theme.background};
    color: ${({theme})=> theme.dateText};
    border: none;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .react-datepicker__day, .react-datepicker__month-text, .react-datepicker__quarter-text, .react-datepicker__year-text {
    color: ${({theme})=> theme.dateText};
  }
  
  .react-datepicker__day {
    &:hover {
      background: #7C5DFA;
      color: white;
    }
  }

  .react-datepicker {
    background-color: ${({theme})=> theme.background};
    color: ${({theme})=> theme.dateText};
    border: none;
    box-shadow: ${({theme}) => theme.filterShadow};
    transition: all 250ms ease-in-out;
  }
  
  .react-datepicker__month-year-dropdown {
    background-color: ${({theme})=> theme.background};
    color: ${({theme})=> theme.dateText};
    border: none;
  }

  .react-datepicker__day--selected {
    color: #7C5DFA;
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
    color: ${({theme})=> theme.dateText};
    align-self: center;
    justify-self: center;

    font-family: 'Spartan';
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 15px;
    /* identical to box height, or 125% */

    text-align: center;
    letter-spacing: -0.25px;
    
  }



  .react-datepicker__day--keyboard-selected {
    background-color: rgba(124, 93, 250, 0.5);
    
  }
  
`;