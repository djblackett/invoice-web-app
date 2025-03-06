import{d as e,P as n,a,j as t}from"./index-CquupEEF.js";import{d as s}from"./DateAndPayment-Pe4M0hwg.js";import"./editPageStyles-B5kDS8TJ.js";import"./InvoiceStatus-CXApMny3.js";import"./utilityFunctions-BSBvP2vA.js";import"./SlidingMenu-Dewd4fiG.js";import"./useMutation-CZCbXKN2.js";import"./create-visual-element-C-cvkCrh.js";const d=e.div`
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

  ${o=>o.long&&n`
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
`,p=a.forwardRef(({value:o,onClick:r},i)=>t.jsxs(d,{className:"custom-input",onClick:r,style:{},children:[t.jsx(l,{ref:i,value:o,"data-testid":"invoiceDate",id:"invoiceDate",readOnly:!0}),s]}));p.displayName="CustomDateInput";export{p as default};
