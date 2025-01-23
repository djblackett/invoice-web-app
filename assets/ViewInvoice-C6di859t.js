const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EditForm-BEJtpsCr.js","assets/index-DMmgDaP9.js","assets/index-CiReAC79.css","assets/invoice.queries-C6PGV1xI.js","assets/useResponsive-CGpDLrY-.js","assets/editPageStyles-BxKiKXiI.js","assets/utilityFunctions-DQfLIsuu.js","assets/useMutation-TRz-KUgB.js","assets/useResponsive-Bj78kJkR.css","assets/CancelButton-Bzz0eLq7.js","assets/NewInvoiceBottomMenuStyles-CxzmnRO-.js","assets/DateAndPayment-CV4MT27D.js","assets/DeleteModal--tv_Q5LM.js","assets/FullInvoiceStyles-DZvA_leK.js","assets/ClickOutsideProvider-0y8ZMxMH.js","assets/FullInvoice-Cfzkfq95.js"])))=>i.map(i=>d[i]);
import{d as o,r as d,j as t,Q as p,a as j,R as u,_ as g,c as v,e as k}from"./index-DMmgDaP9.js";import{P as x,M as y,u as I,I as l,a as _,N as B,G as E}from"./invoice.queries-C6PGV1xI.js";import{u as T}from"./useMutation-TRz-KUgB.js";const P=o.button`
  background-color: ${({theme:e})=>e.editButton};
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: ${({theme:e})=>e.greyText};
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  margin: 0.25rem;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;

  &:hover {
    background-color: ${({theme:e})=>e.editButtonHover};
  }

  &:focus {
    border: 2px solid rgb(18, 22, 243);
  }
`,h=d.forwardRef(({toggleEditTab:e,isEditOpen:n},i)=>{const s=()=>{e(!n)};return t.jsx(P,{onClick:s,ref:i,children:"Edit"})});h.displayName="EditButton";h.propTypes={toggleEditTab:x.func.isRequired};const C=o.button`
  background-color: #ec5757;
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  margin: 0.25rem;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;

  &:hover {
    background-color: #ff9797;
  }
`;function m({handleClick:e}){return t.jsx(C,{onClick:e,type:"button","aria-label":"delete-button",children:"Delete"})}m.propTypes={handleClick:x.func.isRequired};const O=o.button`
  background-color: ${({theme:e})=>e.newButton};
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  margin: 0.25rem;
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;
  white-space: nowrap;

  &:hover {
    background-color: ${({theme:e})=>e.newButtonHover};
  }
`;function M({invoice:e,editButtonRef:n}){const i=localStorage.getItem("theme"),[s]=T(y,{onError:r=>{console.log(r.graphQLErrors[0].message)}}),a=async()=>{e.status==="pending"?(await s({variables:{markAsPaidId:e.id}})).data&&p.success("💸 Invoice paid!",{position:"top-center",autoClose:5e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:i||void 0}):(n.current&&(n.current.focus(),console.log("ref:",n.current)),p.error("Cannot mark drafts as paid",{position:"top-right",autoClose:1e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!1,progress:void 0,theme:i||void 0}))};return t.jsx(t.Fragment,{children:t.jsx(O,{onClick:a,type:"button","data-testid":"mark-as-paid",children:"Mark as Paid"})})}const S=o.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  height: 91px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({theme:e})=>e.background};
  margin-top: 3.5rem;
  order: 2;

  @media (min-width: 325px) {
    width: 100%;
    padding: 1.4rem 1.5rem;
  }

  @media (min-width: 600px) {
    order: initial;
    height: initial;
    width: initial;
    position: static;
    margin-top: initial;
    background-color: initial;
  }
`;function b({invoice:e,openModal:n}){const{isNewInvoiceOpen:i,setIsNewInvoiceOpen:s}=I(),a=()=>{s(!0)},r=d.useRef(null);return t.jsxs(S,{children:[t.jsx(h,{toggleEditTab:a,isEditOpen:i,ref:r}),t.jsx(m,{handleClick:n}),t.jsx(M,{invoice:e,editButtonRef:r})]})}b.propTypes={openModal:x.func.isRequired};const $=o.div`
  height: 88px;
  display: contents;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 10px -10px rgba(72, 84, 159, 0.100397);
  width: 100%;
  z-index: 1;

  @media (min-width: 600px) {
    display: flex;
    flex-direction: row;
    background-color: ${({theme:e})=>e.background};
    border-radius: 8px;
  }

  @media (min-width: 1200px) {
    max-width: 730px;
  }
`,R=o.div`
  display: flex;
  height: 91px;
  width: 100%;
  padding: 10px 20px;
  justify-content: space-between;
  align-items: center;
  background-color: ${({theme:e})=>e.background};
  border-radius: 8px;

  @media (min-width: 600px) {
    background-color: initial;
    justify-content: flex-start;
  }
`,D=o.p`
  margin-right: 1rem;
  color: ${({theme:e})=>e.greyText};
`;function L({invoice:e,setIsModalOpen:n}){const i=r=>{r.preventDefault(),p.clearWaitingQueue(),n(!0)},s=d.useMemo(()=>{if(e.status==="paid")return t.jsx(l,{statusType:"paid",text:"Paid"});if(e.status==="pending")return t.jsx(l,{statusType:"pending",text:"Pending"});if(e.status==="draft")return t.jsx(l,{statusType:"draft",text:"Draft"})},[e]),a=j();return t.jsxs($,{className:"invoice-toolbar","data-testid":"invoice-toolbar",style:{display:a<600?"contents":"flex"},children:[t.jsxs(R,{children:[t.jsx(D,{children:"Status"}),s]}),t.jsx(b,{invoice:e,openModal:i})]})}const z=o.div`
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-self: center;
  align-self: center;
  margin-top: 104px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  @media (min-width: 325px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  @media (min-width: 768px) {
    max-width: 730px;
    padding-left: 0;
    padding-right: 0;
  }

  @media (min-width: 1200px) {
    margin-top: 4rem;
  }
`,A=o.div`
  align-self: flex-start;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  flex-direction: row;
  cursor: pointer;
  margin-bottom: 2rem;
`,N=o.p`
  color: ${({theme:e})=>e.outline};
  padding: 0;
  margin: 0;
  font-weight: 900;
`,V=o.p`
  font-weight: bold;
  padding: 0;
  margin: 0;
  margin-left: 1rem;

  &:hover {
    color: #7e88c3;
  }
`,F=t.jsx("svg",{width:"7",height:"10",xmlns:"http://www.w3.org/2000/svg",children:t.jsx("path",{d:"M6.342.886L2.114 5.114l4.228 4.228",stroke:"#9277FF",strokeWidth:"2",fill:"none",fillRule:"evenodd"})}),G=u.lazy(()=>g(()=>import("./EditForm-BEJtpsCr.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]))),H=u.lazy(()=>g(()=>import("./DeleteModal--tv_Q5LM.js"),__vite__mapDeps([12,1,2,9,3,5,13,14,7]))),Q=u.lazy(()=>g(()=>import("./FullInvoice-Cfzkfq95.js"),__vite__mapDeps([15,1,2,3,6,13])));function W(){const e=v(),[n,i]=d.useState(!1),{id:s}=k(),{data:a,loading:r,error:f}=_(E,{variables:{getInvoiceById:s},fetchPolicy:"cache-and-network"}),c=a==null?void 0:a.getInvoiceById,w=()=>{e("/invoices")};return r?t.jsx("h2",{children:"Loading"}):f?t.jsxs("p",{children:["Error: ",f.message]}):t.jsx(z,{children:t.jsxs(B,{children:[t.jsx(d.Suspense,{fallback:t.jsx("div",{children:"Loading..."}),children:t.jsx(G,{invoice:c})}),t.jsxs(A,{onClick:w,children:[t.jsx(N,{children:F}),t.jsx(V,{children:"Go back"})]}),t.jsx(L,{invoice:c,setIsModalOpen:i}),t.jsx(d.Suspense,{fallback:t.jsx("div",{children:"Loading..."}),children:t.jsx(Q,{invoice:c,loading:r})}),t.jsx(d.Suspense,{fallback:t.jsx("div",{children:"Loading..."}),children:t.jsx(H,{setIsModalOpen:i,isModalOpen:n,invoice:c})})]})})}const J=Object.freeze(Object.defineProperty({__proto__:null,default:W},Symbol.toStringTag,{value:"Module"}));export{m as D,J as V};
