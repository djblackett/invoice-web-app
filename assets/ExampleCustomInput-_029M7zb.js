import{d as e,aA as i,r as a,j as t}from"./index-DMmgDaP9.js";import{dateIcon as s}from"./DateAndPayment-CV4MT27D.js";import"./utilityFunctions-DQfLIsuu.js";import"./useResponsive-CGpDLrY-.js";import"./invoice.queries-C6PGV1xI.js";import"./editPageStyles-BxKiKXiI.js";import"./useMutation-TRz-KUgB.js";const l=e.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 48px;
  border-radius: 4px;
  border-color: ${({theme:o})=>o.formFieldOutline};
  border-style: solid;
  padding: 0 20px 0 16px;
  margin-bottom: 1.5rem;
  caret-color: #7c5dfa;
  outline: none;
  border-width: 1px;

  letter-spacing: -0.25px;

  color: ${({theme:o})=>o.textPlain};
  background-color: ${({theme:o})=>o.inputBackgroundColor};

  &:focus,
  &:hover {
    border-color: ${({theme:o})=>o.formFieldOutlineFocus};
  }

  .custom-input {
    padding: 0;
  }

  ${o=>o.long&&i`
      width: 100%;
    `}
`,d=e.input`
  color: ${({theme:o})=>o.dateText};
  font-family: ${({theme:o})=>o.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  background-color: transparent;
  outline: none;
  border: none;
  touch-action: none;
  cursor: pointer;

  &:focus,
  &:hover {
    border-color: ${({theme:o})=>o.formFieldOutlineFocus};
  }
`,c=a.forwardRef(({value:o,onClick:r},n)=>t.jsxs(l,{className:"custom-input",onClick:r,style:{cursor:"pointer"},children:[t.jsx(d,{ref:n,defaultValue:o,"data-testid":"invoiceDate"}),s]}));c.displayName="CustomDateInput";export{c as default};
