import styled from "styled-components";

export const ItemContainer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-top: 0;
  grid-template: auto auto / 1fr 1fr;
  grid-auto-flow: dense;
  background-color: ${({theme}) => theme.formBackground };
  margin-bottom: 3rem;
  
  @media (min-width: 600px) {
    height: 72px;
    width: 100%;
    display: grid;
    
    // Setting the px of the grid column keeps the form fields lined up.
    grid-template: 1fr / 220px 62px 116px 61px 45px;
    justify-items: start;
    margin-bottom: initial;
  }
`;

const Input = styled.input`
  width: 240px;
  height: 48px;
  border-radius: 4px;
  border-color: ${({theme}) => theme.formFieldOutline};
  border-style: solid;
  border-width: 1px;
  outline: none;
  padding: 17px 20px 16px 20px;
  margin-bottom: 1.5rem;
  font-family: ${({theme}) => theme.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: ${({theme}) => theme.textPlain};
  background-color: ${({theme}) => theme.inputBackgroundColor};
  cursor: pointer;

  &:focus, &:hover {
    border-color: ${({theme}) => theme.formFieldOutlineFocus};
  }

  .custom-input {
    padding: 0;
  }
`;
export const ItemName = styled(Input)`
  white-space: nowrap;
  justify-self: start;
  width: 100%;
  margin: 0;
  padding-left: 1.25rem;
  color: ${({theme}) => theme.text};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;

  @media (min-width: 600px) {
    width: 204px;
  }
`;


export const Quantity = styled(Input).attrs(
    {pattern: "\\d+"}
)`
  width: 46px;
  margin: 0;
  color: ${({theme}) => theme.textPlain};
  padding: 0;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  text-align: center;
  letter-spacing: -0.25px;

  @media (min-width: 600px) {
    display: inline;
  }
`;

export const Price = styled(Quantity).attrs(
    {pattern: "[0-9.]*"}
)`
  width: 100px;
  padding-left: 1.25rem;
  text-align: left;
`;
export const Total = styled.p`
  min-width: 40px;
  align-self: center;
  height: fit-content;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: ${({theme}) => theme.greyText};
  
  @media (min-width: 325px) {
    min-width: 60px;
  }
  
  @media (min-width: 600px) {
    grid-area: initial;
    text-align: left;
  }
`;


export const QuantityPriceContainer = styled.div`
  display: none;

  @media (min-width: 600px) {
    display: contents;
  }
`;
export const MobileQuantityPrice = styled.p`
  display: inline;
  grid-area: 2 / 1 / 3 / 2;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  margin: 0;
  margin-top: 0.5rem;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: ${({theme}) => theme.greyText};
  
  @media (min-width: 600px) {
    display: none;
  }
`;

export const MobileHelperContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 600px) {
    display: contents;
  }
`;
export const SVG = styled.svg`
  width: 13px;
  height: 16px;
  justify-self: end;
  cursor: pointer;
  outline: none;

  .deleteIconPath {
    fill: #888eb0;
    outline: none;
    &:hover {
      fill: red;
    }
    
    &:focus {
      fill: red;
    }
  }
`;
export const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: fit-content;
  width: fit-content;
`;

export const SmallBoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80%;
  align-items: center;
`;

export const deleteIcon = (
    <path
        d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
        fillRule="nonzero"
        className="deleteIconPath"
        tabIndex={0}
    />
);