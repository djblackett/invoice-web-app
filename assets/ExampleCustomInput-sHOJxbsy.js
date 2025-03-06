import{d as e,P as n,a,j as t}from"./index-hC3IUwHf.js";import{d as s}from"./DateAndPayment-BGWgbU8v.js";import"./editPageStyles-D8sThVb-.js";import"./InvoiceStatus-DV__EEB-.js";import"./utilityFunctions-Bwv666i-.js";import"./SlidingMenu-DPurnokm.js";import"./useMutation-DRhLMdq6.js";import"./create-visual-element-d7h6aj2v.js";const d=e.div`
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
