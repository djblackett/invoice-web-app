import{d as e,P as i,c as a,j as t}from"./index-CNDK3Od4.js";import{d as s}from"./DateAndPayment-Bq1XlRWZ.js";import"./editPageStyles-blYWhQPw.js";import"./InvoiceStatus-CiDa2GcS.js";import"./utilityFunctions-CAPD2Jrd.js";import"./SlidingMenu-DYvAdJON.js";import"./create-visual-element-CxrfZSHm.js";const d=e.div`
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
  cursor: pointer;

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
`,l=e.input`
  color: ${({theme:o})=>o.dateText};
  font-family: ${({theme:o})=>o.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  width: auto;
  flex-shrink: 1;

  &:focus,
  &:hover {
    border-color: ${({theme:o})=>o.formFieldOutlineFocus};
  }
`,c=a.forwardRef(({value:o,onClick:r},n)=>t.jsxs(d,{className:"custom-input",onClick:r,style:{},children:[t.jsx(l,{ref:n,value:o,"data-testid":"invoiceDate",id:"invoiceDate",readOnly:!0}),s]}));c.displayName="CustomDateInput";export{c as default};
