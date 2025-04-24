import{j as t,d as o,P as d,g as f,s as m,S as k,T as w}from"./index-DPd1qPLZ.js";import{P as j}from"./InvoiceStatus-nCRc6NUy.js";import{C as y}from"./ClickOutsideProvider-xB6iMLMS.js";const l=d`
  background-color: ${({theme:e})=>e.newButton};
  border-color: transparent;
`,c=d`
  background-color: ${({theme:e})=>e.editButtonHover};
`,C=o.div`
  display: inline-block;
  vertical-align: middle;
  border: 1px solid transparent;
  border-radius: 2px;
  ${e=>e.checked?l:c};
`,a=o.svg`
  stroke: #fff;
  stroke-width: 2;
  fill: none;
  fill-rule: evenodd;
`,v=o.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 2px;
  transition: all 200ms;
  ${e=>e.checked?l:c};
  ${a} {
    visibility: ${e=>e.checked?"visible":"hidden"};
  }
`;function $({checked:e=!1,...n}){return t.jsx(C,{className:"styledCheckbox",checked:e,...n,children:t.jsx(v,{checked:e,children:t.jsx(a,{width:"10",height:"8",viewBox:"0 0 10 8",children:t.jsx("path",{d:"M1.5 4.5l2.124 2.124L8.97 1.28"})})})})}const z=o.div``,D=o.div`
  cursor: pointer;
  box-sizing: border-box;
  margin-left: 0.5rem;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: ${({theme:e})=>e.textPlain};
`;function x({option:e}){const n=f(m),r=e.toLowerCase(),s=n[r];return t.jsx(z,{children:t.jsxs(D,{children:[t.jsx($,{checked:s}),t.jsx("span",{style:{marginLeft:"13px",fontFamily:"League Spartan",fontWeight:700},children:e})]})})}x.propTypes={option:j.string.isRequired};const L=o.div`
  align-self: center;
  box-sizing: border-box;
  background: transparent;
  z-index: 5;
  width: 8px;
  cursor: pointer;
  margin-left: 0;
  position: relative;
  pointer-events: auto;
  border: none;

  @media (min-width: 325px) {
    margin-left: 8px;
  }

  @media (min-width: 350px) {
    margin-left: 16px;
  }
`,S=o.button`
  width: 8px;
  margin: 0 auto;
  z-index: 10;
  background: transparent;
  border: none;
  display: flex;
  z-index: -1;
  justify-content: center;
  align-items: center;
  align-self: center;
  box-sizing: border-box;
  width: 1.5rem;
  font-weight: 600;
  font-size: 1.2rem;
  color: ${({theme:e})=>e.text};
  border-radius: 6px;
`,F=o("div")`
  position: absolute;
  width: 150px;
  left: -75px;
  top: 24px;
  background-color: ${({theme:e})=>e.background};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({theme:e})=>e.filterShadow};
  transition: height 250ms;

  @media (min-width: 768px) {
    left: -130px;
  }
`,P=o("ul")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0;
  padding-top: 12px;
  padding-bottom: 12px;
  margin: 0;
  background-color: ${({theme:e})=>e.background};
  box-sizing: border-box;
  border-radius: 8px;
  color: ${({theme:e})=>e.text};
  font-size: 1.2rem;
  font-weight: 700;
`,B=o.li.attrs({})`
  display: flex;
  flex-grow: 0;
  align-items: center;
  justify-content: center;
  list-style: none;
  padding: 0.5rem;

  width: 100%;
  background-color: ${({theme:e})=>e.background};

  &:hover {
    .styledCheckbox {
      border-color: ${({theme:e})=>e.outline};
    }
  }
`,I=o.button`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: ${({theme:e})=>e.background};
  border: none;
  color: ${({theme:e})=>e.text};
  box-sizing: border-box;
  cursor: pointer;
`;function R({icon:e,isOpen:n,setIsFilterOpen:r,options:s}){const p=k(),h=i=>g=>{g.stopPropagation();const u=i.toLowerCase();p(w(u))},b=()=>{r(!1)};return t.jsxs(L,{children:[t.jsx(S,{"data-testid":"filterDropdown",tabIndex:0,"aria-label":"Filter invoices",children:e}),t.jsx(y,{onOutsideClick:b,children:t.jsx(F,{style:{height:n?"130px":0},children:t.jsx(P,{"data-testid":"draft-filter",children:s.map(i=>t.jsx(B,{children:t.jsx(I,{onClick:h(i),"data-testid":`${i.toLowerCase()}-checkbox`,children:t.jsx(x,{option:i})})},`${i}-li`))})})})]})}export{R as default};
