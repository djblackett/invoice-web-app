import{J as c,K as k,P as w,j as t,d as o,S as d,c as C,s as j,T as y}from"./index-Vii2wdos.js";import{P as $}from"./InvoiceStatus-dDJvJ6wS.js";import{C as v}from"./ClickOutsideProvider-BhYE0xpk.js";function a(e=c){const n=e===c?k:w(e);return function(){const{store:i}=n();return i}}const D=a();function S(e=c){const n=e===c?D:a(e);return function(){return n().dispatch}}const z=S(),l=d`
  background-color: ${({theme:e})=>e.newButton};
  border-color: transparent;
`,x=d`
  background-color: ${({theme:e})=>e.editButtonHover};
`,L=o.div`
  display: inline-block;
  vertical-align: middle;
  border: 1px solid transparent;
  border-radius: 2px;
  ${e=>e.checked?l:x};
`,p=o.svg`
  stroke: #fff;
  stroke-width: 2;
  fill: none;
  fill-rule: evenodd;
`,R=o.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 2px;
  transition: all 200ms;
  ${e=>e.checked?l:x};
  ${p} {
    visibility: ${e=>e.checked?"visible":"hidden"};
  }
`;function F({checked:e=!1,...n}){return t.jsx(L,{className:"styledCheckbox",checked:e,...n,children:t.jsx(R,{checked:e,children:t.jsx(p,{width:"10",height:"8",viewBox:"0 0 10 8",children:t.jsx("path",{d:"M1.5 4.5l2.124 2.124L8.97 1.28"})})})})}const P=o.div``,B=o.div`
  cursor: pointer;
  box-sizing: border-box;
  margin-left: 0.5rem;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: ${({theme:e})=>e.textPlain};
`;function h({option:e}){const n=C(j),r=e.toLowerCase(),i=n[r];return t.jsx(P,{children:t.jsxs(B,{children:[t.jsx(F,{checked:i}),t.jsx("span",{style:{marginLeft:"13px",fontFamily:"League Spartan",fontWeight:700},children:e})]})})}h.propTypes={option:$.string.isRequired};const H=o.div`
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
`,I=o.button`
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
`,O=o("div")`
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
`,T=o("ul")`
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
`,M=o.li.attrs({})`
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
`,q=o.button`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: ${({theme:e})=>e.background};
  border: none;
  color: ${({theme:e})=>e.text};
  box-sizing: border-box;
  cursor: pointer;
`;function N({icon:e,isOpen:n,setIsFilterOpen:r,options:i}){const u=z(),b=s=>f=>{f.stopPropagation();const m=s.toLowerCase();u(y(m))},g=()=>{r(!1)};return t.jsxs(H,{children:[t.jsx(I,{"data-testid":"filterDropDown",tabIndex:0,"aria-label":"Filter invoices",children:e}),t.jsx(v,{onOutsideClick:g,children:t.jsx(O,{style:{height:n?"130px":0},children:t.jsx(T,{"data-testid":"draft-filter",children:i.map(s=>t.jsx(M,{children:t.jsx(q,{onClick:b(s),children:t.jsx(h,{option:s})})},`${s}-li`))})})})]})}export{N as default};
