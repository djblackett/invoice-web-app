import{d as o,M as s,j as t,E as r,u as l,N as c,F as d}from"./index-D5T2xZ-E.js";import{V as p}from"./ViewInvoiceStyles-UAWmCpuj.js";const x=o(s)`
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
`,m=o.h1`
  position: relative;
  font-family: ${({theme:i})=>i.font};
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 1.2;
  text-align: center;
  margin-top: 40%;
  margin-left: 0;
  color: ${({theme:i})=>i.text};

  @media (min-width: 768px) {
    margin-top: 20%;
    font-size: 4rem;
  }
`;function g({text:i,testId:n}){return t.jsx(m,{className:"text-animation","data-testid":n,children:i.split(" ").map((a,e)=>t.jsxs(r,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.25,delay:e/6},children:[a," "]},e))})}const h=()=>{const{isAuthenticated:i,isLoading:n,loginWithRedirect:a}=l(),e="Please login to view your invoices";return n?t.jsx("h1",{children:"Loading"}):i?t.jsx(c,{to:"/invoices",replace:!0}):t.jsx(t.Fragment,{children:!i&&t.jsxs(p,{role:"main","aria-labelledby":"welcome-text",style:{marginTop:0},children:[t.jsx(g,{text:e,testId:"welcome-text"}),t.jsx(x,{initial:{x:"-100%",opacity:0},animate:{x:0,opacity:1},transition:{type:"spring",stiffness:100,duration:.5,delay:1},children:t.jsx(d,{whileTap:{scale:.85},onClick:()=>a(),"data-testid":"login-button","aria-label":"login button",children:"Login"})})]})})};export{h as default};
