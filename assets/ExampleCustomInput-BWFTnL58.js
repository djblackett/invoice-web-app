import{P as i,d as e,c as a,j as t}from"./index-DPd1qPLZ.js";import{d as s}from"./DateAndPayment-31rNoTPe.js";import"./editPageStyles-C4V02GEE.js";import"./InvoiceStatus-nCRc6NUy.js";import"./utilityFunctions-CAPD2Jrd.js";import"./SlidingMenu-BD3Ghkle.js";import"./create-visual-element-D-S0tcFb.js";const d=e.div`
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
