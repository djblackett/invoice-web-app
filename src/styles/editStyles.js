import styled from "styled-components";
import FormEntry from "../components/form-components/FormEntry";

export const EditTitle = styled.h1`
  font-size: 1.5rem;
  color: ${({theme}) => theme.text};
`;
export const FormContainer = styled.div`
  height: 100%;
  /* min-width: 300px; */
  top: 72px;
  bottom: 91px;
  left: 0;
  right: 0;
  width: 100%;
  background-color: ${({theme}) => theme.background};
  background-size: cover;
  position: absolute;

  display: flex;
  flex-direction: column;
  transition: all 250ms ease-in-out;
  overflow-x: hidden;
  filter: drop-shadow(2px 2px 2px bottom);

  align-self: flex-start;
  z-index: 1000;

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
    top: 0px;
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
  width: 240px;
  height: 48px;
  border-radius: 4px;
  border-color: ${({theme}) => theme.formFieldOutline};
  border-style: solid;
  /* outline: none; */
  padding: 17px 20px 16px 20px;
  margin-bottom: 1.5rem;
  font-family: ${({theme}) => theme.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* margin-left:5px; */
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;
  /* color: #0c0e16; */
  color: ${({theme}) => theme.textPlain};
  background-color: ${({theme}) => theme.inputBackgroundColor};

  &:focus {
    border-color: black;
  }

  .custom-input {
    padding: 0;
  }
`;
export const StreetAddressInput = styled(Input)`
  width: 100%;

  @media (min-width: 768px) {
    width: 504px;
  }
`;
export const inputStyles = {
    height: "48px",
    borderRadius: "4px",
    borderColor: ({theme}) => theme.formFieldOutline,
    /* outline: none; */
    padding: "17px 20px 16px 20px",
    fontFamily: ({theme}) => theme.font,
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: "12px",
    lineHeight: "15px",
};
export const AddressDetailInput = styled(Input)`
  width: 152px;
`;
export const CountryInput = styled(AddressDetailInput)`
  width: 100%;
  /* min-width: 100%; */

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
  /* display: flex;
  align-items: center;
  justify-content: center; */
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 0.5s linear;
  z-index: 100;
`;
export const ProjectDescription = styled(FormEntry)`
  margin-bottom: 0;
  max-width: 100%;
  width: 100%;
  @media (min-width: 768px) {
    width: 504px;
    max-width: initial;
  }
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

  margin-top: 0;
`;
export const ErrorTextInline = styled(ErrorText)`
  position: absolute;
  right: 1.5rem;
`;
export const Select = styled.select`
  width: 240px;
  height: 48px;
  border-radius: 4px;
  border-color: ${({theme}) => theme.formFieldOutline};
  /* outline: none; */
  padding: 17px 20px 16px 20px;
  margin-bottom: 1.5rem;
  font-family: ${({theme}) => theme.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* margin-left:5px; */
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;
  /* color: #0c0e16; */
  color: ${({theme}) => theme.textPlain};
  background-color: ${({theme}) => theme.editButton};

  &:focus {
    border-color: black;
  }

  .custom-input {
    padding: 0;
  }
`;
export const Option = styled.option`
  padding: 10px;
`;
export const DateAndPaymentContainer = styled.div`
  /* display: contents; */
  display: flex;
  justify-content: space-between;
  max-width: 100%;
  flex-wrap: wrap;
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
    width: 504px;
    max-width: initial;
    flex-wrap: nowrap;
  }
`;