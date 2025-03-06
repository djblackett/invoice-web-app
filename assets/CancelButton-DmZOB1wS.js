import{j as r,d as n}from"./index-6PDlD84C.js";import{P as e}from"./InvoiceStatus-BlNF5Z0r.js";const s=n.button`
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
  margin-left: 0.25rem;

  @media (min-width: 325px) {
    scale: 1;
    margin-left: 0;
  }

  &:hover {
    background-color: ${({theme:t})=>t.editButtonHover};
  }
`;function p({handleClick:t,text:o,justifySelf:i}){return r.jsx(s,{style:{justifySelf:i||"auto"},onClick:t,type:"button",children:o})}p.propTypes={handleClick:e.func.isRequired,text:e.string.isRequired,justifySelf:e.string};export{p as C};
