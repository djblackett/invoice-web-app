const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/NewInvoiceBottomMenu-CroRim3x.js","assets/index-6PDlD84C.js","assets/index-BgypsdHM.css","assets/InvoiceStatus-BlNF5Z0r.js","assets/CancelButton-DmZOB1wS.js","assets/NewInvoiceBottomMenuStyles-BmP-BBwz.js","assets/SlidingMenu-D22l86Ct.js","assets/editPageStyles-AcdAxv9b.js","assets/utilityFunctions-D51lqgtl.js","assets/useMutation-3ITlW0t2.js","assets/create-visual-element-Bw0axXRL.js","assets/SlidingMenu-agoxPcWL.css","assets/DateAndPayment-CKk_NJBW.js"])))=>i.map(i=>d[i]);
import{j as e,R as s,a,d,f as t}from"./index-6PDlD84C.js";import{c as n,F as c}from"./InvoiceStatus-BlNF5Z0r.js";import{B as o,F as m,E as l}from"./editPageStyles-AcdAxv9b.js";import{u as x,C as p,a as j,D as v,E as u,F as I,A as f,S as h}from"./SlidingMenu-D22l86Ct.js";import"./utilityFunctions-D51lqgtl.js";import"./useMutation-3ITlW0t2.js";import"./create-visual-element-Bw0axXRL.js";const F=s.lazy(()=>t(()=>import("./NewInvoiceBottomMenu-CroRim3x.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]))),E=s.lazy(()=>t(()=>import("./DateAndPayment-CKk_NJBW.js").then(i=>i.a),__vite__mapDeps([12,1,2,7,3,8,6,9,10,11]))),_=d.form`
  position: relative;
  z-index: 1;
  padding-bottom: 6rem;

  @media (min-width: 325px) {
    padding-bottom: 0;
  }
`;function w(){const{methods:i}=x(),{isNewInvoiceOpen:r}=n();return e.jsx(c,{...i,children:e.jsxs(_,{style:{zIndex:1,position:"relative"},children:[e.jsx(o,{children:"Bill From"}),e.jsx(p,{}),e.jsx(o,{children:"Bill To"}),e.jsx(j,{}),e.jsx(E,{}),e.jsx(v,{}),e.jsx(u,{}),e.jsx(I,{isEditOpen:r}),e.jsx(a.Suspense,{fallback:e.jsx("div",{children:"Loading..."}),children:e.jsx(F,{closeText:"Discard",justifyCancel:"flex-start"})})]})})}function g(){const{isNewInvoiceOpen:i}=n();return e.jsx(e.Fragment,{children:e.jsx(f,{children:i?e.jsx(h,{children:e.jsxs(m,{"data-testid":"newInvoicePage",children:[e.jsx(l,{children:"New Invoice"}),e.jsx(w,{})]})},"sidebar-parent"):null})})}export{g as default};
