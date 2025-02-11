import{d as r,X as i,r as s,j as t}from"./index-DJHl-HbE.js";import{dateIcon as a}from"./DateAndPayment-D60nOwXu.js";import"./SlidingMenu-DgoQQFBU.js";import"./invoice.queries-kXq_As9r.js";import"./editPageStyles-CR1zy3sT.js";import"./utilityFunctions-DRkDlRDd.js";import"./useMutation-QZ_RZSM4.js";import"./create-visual-element-CdEOPpzg.js";const d=r.div`
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
