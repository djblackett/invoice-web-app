const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EditInvoice-CNeqHhU8.js","assets/index-D-4_CnQ0.js","assets/index-BgypsdHM.css","assets/InvoiceStatus-C7nIYE3L.js","assets/SlidingMenu-DIIB7MHi.js","assets/editPageStyles-DTDH6kVP.js","assets/utilityFunctions-Ul2guwNB.js","assets/useMutation-CPEfX0WL.js","assets/create-visual-element-lAR0r7aN.js","assets/SlidingMenu-agoxPcWL.css","assets/ClickOutsideProvider-pXjcxJT2.js","assets/DeleteModal-8Gy_F61y.js","assets/CancelButton-C2trzFJA.js","assets/FullInvoiceStyles-_8xcfVj7.js","assets/ViewInvoiceStyles-jvhYjpB9.js","assets/FullInvoice-BJJ9VXHp.js"])))=>i.map(i=>d[i]);
import{a,j as t,d,Q as p,h as k,b as v,k as j,l as y,R as u,G as I,f as x}from"./index-D-4_CnQ0.js";import{P as g,c as _,I as l,d as B,N as E}from"./InvoiceStatus-C7nIYE3L.js";import{u as T}from"./useMutation-CPEfX0WL.js";import{V as P,G as C,I as O,a as S,b as M}from"./ViewInvoiceStyles-jvhYjpB9.js";const R=d.button`
  background-color: ${({theme:e})=>e.editButton};
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: ${({theme:e})=>e.greyText};
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.25px;
  scale: 0.85;

  &:hover {
    background-color: ${({theme:e})=>e.editButtonHover};
  }

  &:focus {
    border: 2px solid rgb(18, 22, 243);
    outline: auto;
  }

  @media (min-width: 300px) {
    scale: 1;
    margin-left: 0.25rem;
    flex-grow: 1;
  }
`,h=a.forwardRef(({toggleEditTab:e,isEditOpen:i},o)=>{const n=()=>{e(!i)};return t.jsx(R,{onClick:n,ref:o,children:"Edit"})});h.displayName="EditButton";h.propTypes={toggleEditTab:g.func.isRequired};const $=d.button`
  background-color: #ec5757;
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.25px;
  scale: 0.85;

  &:hover {
    background-color: #ff9797;
  }

  @media (min-width: 300px) {
    scale: 1;
    margin: 0.25rem;
    flex-grow: 1;
  }
`;function m({handleClick:e}){return t.jsx($,{onClick:e,type:"button","aria-label":"delete-button","data-testid":"deleteButton",children:"Delete"})}m.propTypes={handleClick:g.func.isRequired};const D=d.button`
  background-color: ${({theme:e})=>e.newButton};
  border-radius: 24px;
  padding: 16px 19px 17px 19px;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.25px;
  white-space: nowrap;
  scale: 0.85;

  &:hover {
    background-color: ${({theme:e})=>e.newButtonHover};
  }

  @media (min-width: 300px) {
    padding: 16px 24px 17px 24px;
    scale: 1;
    margin-right: 0.25rem;
    flex-grow: 1;
  }
`;function A({invoice:e,editButtonRef:i}){const o=localStorage.getItem("theme"),[n]=T(k,{onError:r=>{console.error(r.graphQLErrors[0].message)}}),s=async()=>{e.status==="pending"?(await n({variables:{markAsPaidId:e.id}})).data&&p.success("💸 Invoice paid!",{position:"top-center",autoClose:5e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:o||void 0,toastId:"mark-as-paid-success-toast"}):(i.current&&i.current.focus(),p.error("Cannot mark drafts as paid",{position:"top-right",autoClose:1e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!1,progress:void 0,theme:o||void 0,toastId:"mark-as-paid-error-toast"}))};return t.jsx(t.Fragment,{children:t.jsx(D,{onClick:s,type:"button","data-testid":"mark-as-paid",children:"Mark as Paid"})})}const L=d.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
`;function b({invoice:e,openModal:i}){const{isNewInvoiceOpen:o,setIsNewInvoiceOpen:n}=_(),s=()=>{n(!0)},r=a.useRef(null);return t.jsxs(L,{children:[t.jsx(h,{toggleEditTab:s,isEditOpen:o,ref:r}),t.jsx(m,{handleClick:i}),t.jsx(A,{invoice:e,editButtonRef:r})]})}b.propTypes={openModal:g.func.isRequired};const N=d.div`
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
`,V=d.div`
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
`,z=d.p`
  margin-right: 1rem;
  color: ${({theme:e})=>e.greyText};
`;function G({invoice:e,setIsModalOpen:i}){const o=r=>{r.preventDefault(),p.clearWaitingQueue(),i(!0)},n=a.useMemo(()=>{if(e.status==="paid")return t.jsx(l,{statusType:"paid",text:"Paid"});if(e.status==="pending")return t.jsx(l,{statusType:"pending",text:"Pending"});if(e.status==="draft")return t.jsx(l,{statusType:"draft",text:"Draft"})},[e]),s=v();return t.jsxs(N,{className:"invoice-toolbar","data-testid":"invoice-toolbar",style:{display:s<600?"contents":"flex"},children:[t.jsxs(V,{children:[t.jsx(z,{children:"Status"}),n]}),t.jsx(b,{invoice:e,openModal:o})]})}const H=u.lazy(()=>x(()=>import("./EditInvoice-CNeqHhU8.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]))),Q=u.lazy(()=>x(()=>import("./DeleteModal-8Gy_F61y.js"),__vite__mapDeps([11,1,2,12,3,5,13,10,7,14]))),q=u.lazy(()=>x(()=>import("./FullInvoice-BJJ9VXHp.js"),__vite__mapDeps([15,1,2,3,6,13])));function F(){const e=j(),[i,o]=a.useState(!1),{id:n}=y(),{data:s,loading:r,error:f}=B(I,{variables:{getInvoiceById:n},fetchPolicy:"cache-and-network"}),c=s==null?void 0:s.getInvoiceById,w=()=>{e("/invoices")};return r?t.jsx("h2",{children:"Loading"}):f?t.jsxs("p",{children:["Error: ",f.message]}):t.jsx(P,{role:"main",children:t.jsxs(E,{children:[t.jsx(a.Suspense,{fallback:t.jsx("div",{children:"Loading..."}),children:t.jsx(H,{invoice:c})}),t.jsxs(C,{onClick:w,children:[t.jsx(O,{children:S}),t.jsx(M,{children:"Go back"})]}),t.jsx(G,{invoice:c,setIsModalOpen:o}),t.jsx(a.Suspense,{fallback:t.jsx("div",{children:"Loading..."}),children:t.jsx(q,{invoice:c,loading:r})}),t.jsx(a.Suspense,{fallback:t.jsx("div",{children:"Loading..."}),children:t.jsx(Q,{setIsModalOpen:o,isModalOpen:i,invoice:c})})]})})}const U=Object.freeze(Object.defineProperty({__proto__:null,default:F},Symbol.toStringTag,{value:"Module"}));export{m as D,U as V};
