import{d as n,j as r}from"./index-DMmgDaP9.js";import{P as e}from"./invoice.queries-C6PGV1xI.js";const s=n.button`
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
  flex-shrink: 2;

  @media (min-width: 325px) {
    scale: none;
    margin: 0.25rem;
  }

  &:hover {
    background-color: ${({theme:t})=>t.editButtonHover};
  }
`;function p({handleClick:t,text:o,justifySelf:i}){return r.jsx(s,{style:{justifySelf:i||"auto"},onClick:t,type:"button",children:o})}p.propTypes={handleClick:e.func.isRequired,text:e.string.isRequired,justifySelf:e.string};export{p as C};
