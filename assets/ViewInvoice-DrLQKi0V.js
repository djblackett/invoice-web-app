const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EditInvoice-ClLEDToj.js","assets/index-BirL1DeV.js","assets/index-BgypsdHM.css","assets/InvoiceStatus-BUfEMt-8.js","assets/SlidingMenu-BvxVGajx.js","assets/editPageStyles-BSnjQR3W.js","assets/create-visual-element-NcukZ5ps.js","assets/SlidingMenu-agoxPcWL.css","assets/ClickOutsideProvider-DwVlAV23.js","assets/DeleteModal-B14VdE0I.js","assets/CancelButton-fzfTMpzT.js","assets/FullInvoiceStyles-BFr052vv.js","assets/ReactToastify-mJQ9ADjW.js","assets/ReactToastify-CZOjr4-t.css","assets/ViewInvoiceStyles-pVBDlOwH.js","assets/FullInvoice-D9Q8t9_S.js","assets/utilityFunctions-BhPDxbxW.js"])))=>i.map(i=>d[i]);
import{c as a,j as e,d,Q as p,l as v,f as k,m as y,n as I,R as u,G as _,h as x}from"./index-BirL1DeV.js";import{P as g,b as B,I as l,c as E,N as T}from"./InvoiceStatus-BUfEMt-8.js";import{u as C}from"./ReactToastify-mJQ9ADjW.js";import{V as P,G as O,I as S,a as M,b as R}from"./ViewInvoiceStyles-pVBDlOwH.js";const $=d.button`
  background-color: ${({theme:t})=>t.editButton};
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: ${({theme:t})=>t.greyText};
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.25px;
  scale: 0.85;

  &:hover {
    background-color: ${({theme:t})=>t.editButtonHover};
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
`,h=a.forwardRef(({toggleEditTab:t,isEditOpen:i},o)=>{const r=()=>{t(!i)};return e.jsx($,{onClick:r,ref:o,"data-testid":"edit-button","aria-label":"Edit button",children:"Edit"})});h.displayName="EditButton";h.propTypes={toggleEditTab:g.func.isRequired};const D=d.button`
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
`;function b({handleClick:t}){return e.jsx(D,{onClick:t,type:"button","aria-label":"delete-button","data-testid":"deleteButton",children:"Delete"})}b.propTypes={handleClick:g.func.isRequired};const j=d.button`
  background-color: ${({theme:t})=>t.newButton};
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
    background-color: ${({theme:t})=>t.newButtonHover};
  }

  @media (min-width: 300px) {
    padding: 16px 24px 17px 24px;
    scale: 1;
    margin-right: 0.25rem;
    flex-grow: 1;
  }
`;function A({invoice:t,editButtonRef:i}){const o=localStorage.getItem("theme"),[r]=C(v,{onError:n=>{console.error(n.graphQLErrors[0].message)}}),s=async()=>{t.status==="pending"?(await r({variables:{markAsPaidId:t.id}})).data&&p.success("💸 Invoice paid!",{position:"top-center",autoClose:5e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:o||void 0,toastId:"mark-as-paid-success-toast"}):(i.current&&i.current.focus(),p.error("Cannot mark drafts as paid",{position:"top-right",autoClose:1e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!1,progress:void 0,theme:o||void 0,toastId:"mark-as-paid-error-toast"}))};return e.jsx(e.Fragment,{children:e.jsx(j,{onClick:s,type:"button","data-testid":"mark-as-paid",children:"Mark as Paid"})})}const L=d.div`
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
  background-color: ${({theme:t})=>t.background};
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
`;function w({invoice:t,openModal:i}){const{isNewInvoiceOpen:o,setIsNewInvoiceOpen:r}=B(),s=()=>{r(!0)},n=a.useRef(null);return e.jsxs(L,{children:[e.jsx(h,{toggleEditTab:s,isEditOpen:o,ref:n}),e.jsx(b,{handleClick:i}),e.jsx(A,{invoice:t,editButtonRef:n})]})}w.propTypes={openModal:g.func.isRequired};const N=d.div`
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
    background-color: ${({theme:t})=>t.background};
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
  background-color: ${({theme:t})=>t.background};
  border-radius: 8px;

  @media (min-width: 600px) {
    background-color: initial;
    justify-content: flex-start;
  }
`,z=d.p`
  margin-right: 1rem;
  color: ${({theme:t})=>t.greyText};
`;function G({invoice:t,setIsModalOpen:i}){const o=n=>{n.preventDefault(),p.clearWaitingQueue(),i(!0)},r=a.useMemo(()=>{if(t.status==="paid")return e.jsx(l,{statusType:"paid",text:"Paid"});if(t.status==="pending")return e.jsx(l,{statusType:"pending",text:"Pending"});if(t.status==="draft")return e.jsx(l,{statusType:"draft",text:"Draft"})},[t]),s=k();return e.jsxs(N,{className:"invoice-toolbar","data-testid":"invoice-toolbar",style:{display:s<600?"contents":"flex"},children:[e.jsxs(V,{children:[e.jsx(z,{children:"Status"}),r]}),e.jsx(w,{invoice:t,openModal:o})]})}const H=u.lazy(()=>x(()=>import("./EditInvoice-ClLEDToj.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8]))),Q=u.lazy(()=>x(()=>import("./DeleteModal-B14VdE0I.js"),__vite__mapDeps([9,1,2,10,3,5,11,8,12,13,14]))),q=u.lazy(()=>x(()=>import("./FullInvoice-D9Q8t9_S.js"),__vite__mapDeps([15,1,2,3,16,11])));function F(){const t=y(),[i,o]=a.useState(!1),{id:r}=I(),{data:s,loading:n,error:m}=E(_,{variables:{getInvoiceById:r},fetchPolicy:"cache-and-network"}),c=s==null?void 0:s.getInvoiceById,f=()=>{t("/invoices")};return n?e.jsx("h2",{children:"Loading"}):m?e.jsxs(e.Fragment,{children:[e.jsxs("p",{style:{marginTop:"8rem",marginBottom:"2rem",textAlign:"center"},children:["Error: ",m.message," ",e.jsx("br",{}),"Invoice may have been deleted ",e.jsx("br",{})]}),e.jsx(j,{onClick:f,children:"Go back"})]}):e.jsx(P,{role:"main",children:e.jsxs(T,{children:[e.jsx(a.Suspense,{fallback:e.jsx("div",{style:{position:"absolute",top:"4rem",alignSelf:"center",justifySelf:"flex-start"},children:"Loading..."}),children:e.jsx(H,{invoice:c})}),e.jsxs(O,{onClick:f,children:[e.jsx(S,{children:M}),e.jsx(R,{children:"Go back"})]}),e.jsx(G,{invoice:c,setIsModalOpen:o}),e.jsx(a.Suspense,{fallback:e.jsx("div",{children:"Loading..."}),children:e.jsx(q,{invoice:c,loading:n})}),e.jsx(a.Suspense,{fallback:e.jsx("div",{children:"Loading..."}),children:e.jsx(Q,{setIsModalOpen:o,isModalOpen:i,invoice:c})})]})})}const U=Object.freeze(Object.defineProperty({__proto__:null,default:F},Symbol.toStringTag,{value:"Module"}));export{b as D,U as V};
