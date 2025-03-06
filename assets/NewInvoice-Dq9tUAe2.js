const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/NewInvoiceBottomMenu-WXf1zqpf.js","assets/index-BWbkvAE2.js","assets/index-BgypsdHM.css","assets/InvoiceStatus-CWJt63NW.js","assets/CancelButton-NaRJCHAX.js","assets/NewInvoiceBottomMenuStyles-C1Epmk70.js","assets/SlidingMenu-CTFhOy2r.js","assets/editPageStyles-DNCNkdgu.js","assets/utilityFunctions-tWiID03q.js","assets/useMutation-_I7cgxcJ.js","assets/create-visual-element-BIsVhxay.js","assets/SlidingMenu-agoxPcWL.css","assets/DateAndPayment-B0ktL3vs.js"])))=>i.map(i=>d[i]);
import{j as e,R as s,a,d,f as t}from"./index-BWbkvAE2.js";import{c as n,F as c}from"./InvoiceStatus-CWJt63NW.js";import{B as o,F as m,E as l}from"./editPageStyles-DNCNkdgu.js";import{u as x,C as p,a as j,D as v,E as u,F as I,A as f,S as h}from"./SlidingMenu-CTFhOy2r.js";import"./utilityFunctions-tWiID03q.js";import"./useMutation-_I7cgxcJ.js";import"./create-visual-element-BIsVhxay.js";const F=s.lazy(()=>t(()=>import("./NewInvoiceBottomMenu-WXf1zqpf.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]))),E=s.lazy(()=>t(()=>import("./DateAndPayment-B0ktL3vs.js").then(i=>i.a),__vite__mapDeps([12,1,2,7,3,8,6,9,10,11]))),_=d.form`
  position: relative;
  z-index: 1;
  padding-bottom: 6rem;

  @media (min-width: 325px) {
    padding-bottom: 0;
  }
`;function w(){const{methods:i}=x(),{isNewInvoiceOpen:r}=n();return e.jsx(c,{...i,children:e.jsxs(_,{style:{zIndex:1,position:"relative"},children:[e.jsx(o,{children:"Bill From"}),e.jsx(p,{}),e.jsx(o,{children:"Bill To"}),e.jsx(j,{}),e.jsx(E,{}),e.jsx(v,{}),e.jsx(u,{}),e.jsx(I,{isEditOpen:r}),e.jsx(a.Suspense,{fallback:e.jsx("div",{children:"Loading..."}),children:e.jsx(F,{closeText:"Discard",justifyCancel:"flex-start"})})]})})}function g(){const{isNewInvoiceOpen:i}=n();return e.jsx(e.Fragment,{children:e.jsx(f,{children:i?e.jsx(h,{children:e.jsxs(m,{"data-testid":"newInvoicePage",children:[e.jsx(l,{children:"New Invoice"}),e.jsx(w,{})]})},"sidebar-parent"):null})})}export{g as default};
