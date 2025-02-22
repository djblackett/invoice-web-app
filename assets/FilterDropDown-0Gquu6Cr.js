import{J as c,K as k,P as w,j as t,d as o,S as d,c as y,s as j,T as C}from"./index-BLqIMQFj.js";import{P as v}from"./InvoiceStatus-C3480Up6.js";import{C as $}from"./ClickOutsideProvider-CAS6J0if.js";function a(e=c){const i=e===c?k:w(e);return function(){const{store:n}=i();return n}}const D=a();function S(e=c){const i=e===c?D:a(e);return function(){return i().dispatch}}const z=S(),l=d`
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
`,H=o.input.attrs({type:"checkbox"})`
  // Hide checkbox visually but remain accessible to screen readers.
  // Source: https://polished.js.org/docs/#hidevisually
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
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
`;function P({checked:e=!1,...i}){return t.jsxs(L,{className:"styledCheckbox",checked:e,children:[t.jsx(H,{checked:e,...i,readOnly:!0}),t.jsx(R,{checked:e,children:t.jsx(p,{width:"10",height:"8",viewBox:"0 0 10 8",children:t.jsx("path",{d:"M1.5 4.5l2.124 2.124L8.97 1.28"})})})]})}const F=o.div``,O=o.div`
  cursor: pointer;
  box-sizing: border-box;
  margin-left: 0.5rem;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: ${({theme:e})=>e.textPlain};
`;function h({option:e}){const i=y(j),r=e.toLowerCase(),n=i[r];return t.jsx(F,{children:t.jsxs(O,{children:[t.jsx(P,{checked:n}),t.jsx("span",{style:{marginLeft:"13px",fontFamily:"League Spartan",fontWeight:700},children:e})]})})}h.propTypes={option:v.string.isRequired};const B=o("div")`
  align-self: center;
  box-sizing: border-box;
  background: transparent;
  z-index: 5;
  width: 8px;
  cursor: pointer;
  margin-left: 0;
  position: relative;
  pointer-events: auto;

  @media (min-width: 325px) {
    margin-left: 8px;
  }

  @media (min-width: 350px) {
    margin-left: 16px;
  }
`,I=o("div")`
  width: 8px;
  margin: 0 auto;
  z-index: 10;
  background: transparent;
`,T=o.div.attrs({tabIndex:0})`
  display: flex;
  z-index: -1;
  justify-content: center;
  align-items: center;
  align-self: center;
  box-sizing: border-box;
  width: 12px;
  font-weight: 600;
  font-size: 1.2rem;
  color: ${({theme:e})=>e.text};
  border-radius: 6px;
`,M=o("div")`
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
`,q=o("ul")`
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
`,E=o.li.attrs({})`
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
`,J=o.button`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: ${({theme:e})=>e.background};
  border: none;
  color: ${({theme:e})=>e.text};
  box-sizing: border-box;
  cursor: pointer;
`;function A({icon:e,isOpen:i,setIsFilterOpen:r,options:n}){const u=z(),b=s=>f=>{f.stopPropagation();const m=s.toLowerCase();u(C(m))},g=()=>{r(!1)};return t.jsx(B,{children:t.jsxs(I,{"data-testid":"filterDropDown",children:[t.jsx(T,{children:e}),t.jsx($,{onOutsideClick:g,children:t.jsx(M,{style:{height:i?"130px":0},children:t.jsx(q,{"data-testid":"draft-filter",children:n.map(s=>t.jsx(E,{onClick:b(s),children:t.jsx(J,{children:t.jsx(h,{option:s})})},`${s}-li`))})})})]})})}export{A as default};
