import{j as n,d as p}from"./index-DPd1qPLZ.js";import{P as e}from"./InvoiceStatus-nCRc6NUy.js";const s=p.button`
  display: inline;
  background-color: ${({theme:t})=>t.editButton};
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: ${({theme:t})=>t.greyText};
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  scale: 0.9;
  flex-shrink: 1;
  flex-grow: 1;
  width: auto;
  max-width: 150px;
  max-height: 48px;
  margin-left: 0.25rem;

  @media (min-width: 325px) {
    scale: 1;
    margin-left: 0;
  }

  &:hover {
    background-color: ${({theme:t})=>t.editButtonHover};
  }
`;function a({handleClick:t,text:i,justifySelf:o,style:r}){return n.jsx(s,{style:{justifySelf:o||"auto",...r},onClick:t,type:"button",children:i})}a.propTypes={handleClick:e.func.isRequired,text:e.string.isRequired,justifySelf:e.string};export{a as C};
