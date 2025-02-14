import{d as o,M as s,j as t,S as r,u as l,N as c,U as d}from"./index-BOeL8XZv.js";const x=o(s)`
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
`,p=o.div`
  position: relative;
  font-family: sans-serif;
  font-size: 60px;
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.2;
  text-align: center;
  margin: 100px 0 40px;
  color: ${({theme:i})=>i.text};

  @media (min-width: 1200px) {
    margin-left: 103px;
  }
`;function g({text:i,testId:e}){return t.jsx(p,{className:"text-animation","data-testid":e,children:i.split(" ").map((a,n)=>t.jsxs(r,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.25,delay:n/6},children:[a," "]},n))})}const u=()=>{const{isAuthenticated:i,isLoading:e,loginWithRedirect:a}=l(),n="Please login to view your invoices";return e?t.jsx("h1",{children:"Loading"}):i?t.jsx(c,{to:"/invoices",replace:!0}):t.jsx(t.Fragment,{children:!i&&t.jsxs(t.Fragment,{children:[t.jsx(g,{text:n,testId:"welcome-text"}),t.jsx(x,{initial:{x:"-100%",opacity:0},animate:{x:0,opacity:1},transition:{type:"spring",stiffness:100,duration:.5,delay:1},children:t.jsx(d,{whileTap:{scale:.85},onClick:()=>a(),"data-testid":"login-button",children:"Login"})})]})})};export{u as default};
