import{d as s,M as g,j as t,H as x,R as p,u,a as f,N as h,J as y,K as j,c as v}from"./index-DPd1qPLZ.js";import{V as w}from"./ViewInvoiceStyles-C1lsrj2E.js";const a=s(g)`
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
`,D=s.h1`
  position: relative;
  font-family: ${({theme:e})=>e.font};
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 1.2;
  text-align: center;
  margin-top: 40%;
  margin-left: 0;
  color: ${({theme:e})=>e.text};

  @media (min-width: 768px) {
    margin-top: 20%;
    font-size: 4rem;
  }
`;function b({text:e,testId:n}){return t.jsx(D,{className:"text-animation","data-testid":n,children:e.split(" ").map((o,i)=>t.jsxs(x,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.25,delay:i/6},children:[o," "]},i))})}const L=()=>{const{isAuthenticated:e,isLoading:n,loginWithRedirect:o}=u(),{isDemoMode:i,setIsDemoMode:l}=f(),r="Please login to view your invoices",c="Demo mode activated. Please login to view your invoices",d=()=>{console.log("Demo login triggered"),v.startTransition(()=>l(m=>!m))};return n?t.jsx("h1",{children:"Loading"}):e?t.jsx(h,{to:"/invoices",replace:!0}):t.jsx(t.Fragment,{children:!e&&t.jsxs(w,{role:"main","aria-labelledby":"welcome-text",style:{marginTop:0},children:[t.jsx(b,{text:i?c:r,testId:"welcome-text"}),t.jsx(a,{initial:{x:"-100%",opacity:0},animate:{x:0,opacity:1},transition:{type:"spring",stiffness:100,duration:.5,delay:1},children:t.jsx(y,{whileTap:{scale:.85},onClick:()=>o(),"data-testid":"login-button","aria-label":"login button",children:"Login"})}),t.jsx(a,{initial:{x:"-100%",opacity:0},animate:{x:0,opacity:1},transition:{type:"spring",stiffness:100,duration:.5,delay:1.1},children:t.jsxs(j,{whileTap:{scale:.85},onClick:d,"data-testid":"demo-login-button","aria-label":"demo-login button",children:["Demo mode: ",i?"ON":"OFF"]})})]})})},T=p.memo(L);T.displayName="Login";export{T as default};
