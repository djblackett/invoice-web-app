const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EditForm-CrSyh9ZB.js","assets/index-Bo1oAiba.js","assets/index-BgypsdHM.css","assets/InvoiceStatus-BNE0zJRF.js","assets/SlidingMenu-Ch2QatAH.js","assets/editPageStyles-CR5p9qIm.js","assets/utilityFunctions-BzhXeHDk.js","assets/useMutation-D5_Wo9KX.js","assets/create-visual-element-DNxE0n5E.js","assets/SlidingMenu-agoxPcWL.css","assets/CancelButton-CCQHq0i9.js","assets/NewInvoiceBottomMenuStyles-Cfu8hwSH.js","assets/DateAndPayment-BcUGf4t4.js","assets/DeleteModal-BnE70Oo6.js","assets/FullInvoiceStyles-DnHD_EPf.js","assets/ClickOutsideProvider-DmYfFG7E.js","assets/FullInvoice-BbYK4ubt.js"])))=>i.map(i=>d[i]);
import{a as d,j as t,d as n,Q as p,h as v,b as j,k,l as y,R as u,G as I,f as x}from"./index-Bo1oAiba.js";import{P as g,c as _,I as l,d as B,N as E}from"./InvoiceStatus-BNE0zJRF.js";import{u as T}from"./useMutation-D5_Wo9KX.js";const P=n.button`
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
    margin: 0.25rem;
  }
`,h=d.forwardRef(({toggleEditTab:e,isEditOpen:o},i)=>{const s=()=>{e(!o)};return t.jsx(P,{onClick:s,ref:i,children:"Edit"})});h.displayName="EditButton";h.propTypes={toggleEditTab:g.func.isRequired};const C=n.button`
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
  }
`;function f({handleClick:e}){return t.jsx(C,{onClick:e,type:"button","aria-label":"delete-button",children:"Delete"})}f.propTypes={handleClick:g.func.isRequired};const O=n.button`
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
    margin: 0.25rem;
  }
`;function M({invoice:e,editButtonRef:o}){const i=localStorage.getItem("theme"),[s]=T(v,{onError:r=>{console.error(r.graphQLErrors[0].message)}}),a=async()=>{e.status==="pending"?(await s({variables:{markAsPaidId:e.id}})).data&&p.success("💸 Invoice paid!",{position:"top-center",autoClose:5e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:i||void 0}):(o.current&&o.current.focus(),p.error("Cannot mark drafts as paid",{position:"top-right",autoClose:1e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!1,progress:void 0,theme:i||void 0}))};return t.jsx(t.Fragment,{children:t.jsx(O,{onClick:a,type:"button","data-testid":"mark-as-paid",children:"Mark as Paid"})})}const R=n.div`
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
`;function b({invoice:e,openModal:o}){const{isNewInvoiceOpen:i,setIsNewInvoiceOpen:s}=_(),a=()=>{s(!0)},r=d.useRef(null);return t.jsxs(R,{children:[t.jsx(h,{toggleEditTab:a,isEditOpen:i,ref:r}),t.jsx(f,{handleClick:o}),t.jsx(M,{invoice:e,editButtonRef:r})]})}b.propTypes={openModal:g.func.isRequired};const S=n.div`
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
`,$=n.div`
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
`,D=n.p`
  margin-right: 1rem;
  color: ${({theme:e})=>e.greyText};
`;function L({invoice:e,setIsModalOpen:o}){const i=r=>{r.preventDefault(),p.clearWaitingQueue(),o(!0)},s=d.useMemo(()=>{if(e.status==="paid")return t.jsx(l,{statusType:"paid",text:"Paid"});if(e.status==="pending")return t.jsx(l,{statusType:"pending",text:"Pending"});if(e.status==="draft")return t.jsx(l,{statusType:"draft",text:"Draft"})},[e]),a=j();return t.jsxs(S,{className:"invoice-toolbar","data-testid":"invoice-toolbar",style:{display:a<600?"contents":"flex"},children:[t.jsxs($,{children:[t.jsx(D,{children:"Status"}),s]}),t.jsx(b,{invoice:e,openModal:i})]})}const z=n.div`
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
`,A=n.div`
  align-self: flex-start;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  flex-direction: row;
  cursor: pointer;
  margin-bottom: 2rem;
`,N=n.p`
  color: ${({theme:e})=>e.outline};
  padding: 0;
  margin: 0;
  font-weight: 900;
`,V=n.p`
  font-weight: bold;
  padding: 0;
  margin: 0;
  margin-left: 1rem;

  &:hover {
    color: #7e88c3;
  }
`,F=t.jsx("svg",{width:"7",height:"10",xmlns:"http://www.w3.org/2000/svg",children:t.jsx("path",{d:"M6.342.886L2.114 5.114l4.228 4.228",stroke:"#9277FF",strokeWidth:"2",fill:"none",fillRule:"evenodd"})}),G=u.lazy(()=>x(()=>import("./EditForm-CrSyh9ZB.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12]))),H=u.lazy(()=>x(()=>import("./DeleteModal-BnE70Oo6.js"),__vite__mapDeps([13,1,2,10,3,5,14,15,7]))),Q=u.lazy(()=>x(()=>import("./FullInvoice-BbYK4ubt.js"),__vite__mapDeps([16,1,2,3,6,14])));function W(){const e=k(),[o,i]=d.useState(!1),{id:s}=y(),{data:a,loading:r,error:m}=B(I,{variables:{getInvoiceById:s},fetchPolicy:"cache-and-network"}),c=a==null?void 0:a.getInvoiceById,w=()=>{e("/invoices")};return r?t.jsx("h2",{children:"Loading"}):m?t.jsxs("p",{children:["Error: ",m.message]}):t.jsx(z,{children:t.jsxs(E,{children:[t.jsx(d.Suspense,{fallback:t.jsx("div",{children:"Loading..."}),children:t.jsx(G,{invoice:c})}),t.jsxs(A,{onClick:w,children:[t.jsx(N,{children:F}),t.jsx(V,{children:"Go back"})]}),t.jsx(L,{invoice:c,setIsModalOpen:i}),t.jsx(d.Suspense,{fallback:t.jsx("div",{children:"Loading..."}),children:t.jsx(Q,{invoice:c,loading:r})}),t.jsx(d.Suspense,{fallback:t.jsx("div",{children:"Loading..."}),children:t.jsx(H,{setIsModalOpen:i,isModalOpen:o,invoice:c})})]})})}const J=Object.freeze(Object.defineProperty({__proto__:null,default:W},Symbol.toStringTag,{value:"Module"}));export{f as D,J as V};
