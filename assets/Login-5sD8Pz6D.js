import{d as o,M as s,j as t,F as r,u as l,N as c,H as d}from"./index-BHpCqAvw.js";import{V as x}from"./ViewInvoiceStyles-CdPEFQTT.js";const p=o(s)`
  justify-self: center;
  align-self: center;
  height: fit-content;
  width: fit-content;
  padding: "10px 20px";
  font-size: "16px";
  position: "fixed";
  top: 50%;
  left: 50%;
  transform: translate(-50%);
`,g=o.h1`
  position: relative;
  font-family: ${({theme:i})=>i.font};
  font-size: 64px;
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 1.2;
  text-align: center;
  margin: 20% 0 40px;
  color: ${({theme:i})=>i.text};

  @media (min-width: 1200px) {
    margin-left: 103px;
  }
`;function f({text:i,testId:n}){return t.jsx(g,{className:"text-animation","data-testid":n,children:i.split(" ").map((a,e)=>t.jsxs(r,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.25,delay:e/6},children:[a," "]},e))})}const h=()=>{const{isAuthenticated:i,isLoading:n,loginWithRedirect:a}=l(),e="Please login to view your invoices";return n?t.jsx("h1",{children:"Loading"}):i?t.jsx(c,{to:"/invoices",replace:!0}):t.jsx(t.Fragment,{children:!i&&t.jsxs(x,{role:"main","aria-labelledby":"welcome-text",style:{marginTop:0},children:[t.jsx(f,{text:e,testId:"welcome-text"}),t.jsx(p,{initial:{x:"-100%",opacity:0},animate:{x:0,opacity:1},transition:{type:"spring",stiffness:100,duration:.5,delay:1},children:t.jsx(d,{whileTap:{scale:.85},onClick:()=>a(),"data-testid":"login-button","aria-label":"login button",children:"Login"})})]})})};export{h as default};
