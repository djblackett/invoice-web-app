import{d as r,X as i,r as s,j as t}from"./index-D1B1EIKJ.js";import{dateIcon as a}from"./DateAndPayment-C5cF6siX.js";import"./SlidingMenu-oLsvNsjq.js";import"./invoice.queries-UruHYCCu.js";import"./editPageStyles-DBqYrXBk.js";import"./utilityFunctions-uQjSmZ7Z.js";import"./useMutation-2Q1gDOlO.js";import"./create-visual-element-C2cQkUZK.js";const d=r.div`
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
`,l=r.input`
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
`,p=s.forwardRef(({value:o,onClick:e},n)=>t.jsxs(d,{className:"custom-input",onClick:e,style:{},children:[t.jsx(l,{ref:n,value:o,"data-testid":"invoiceDate"}),a]}));p.displayName="CustomDateInput";export{p as default};
