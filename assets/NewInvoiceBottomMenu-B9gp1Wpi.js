import{b as x,j as e}from"./index-D5T2xZ-E.js";import{e as S,c as h,P as t}from"./InvoiceStatus-B_uNhklQ.js";import{C as j}from"./CancelButton-DfU5G90I.js";import{M as b,S as w,a as y,b as D}from"./NewInvoiceBottomMenuStyles-C6MpPUBZ.js";import{c as I,u as N,d as k}from"./SlidingMenu-BV479-BV.js";import"./editPageStyles-8CkNNUZa.js";import"./utilityFunctions-Cvv3Mn6A.js";import"./ReactToastify-PWHrxTTo.js";import"./create-visual-element-CIJEEXC4.js";function F({closeText:s,justifyCancel:o}){const{clearErrors:a,handleSubmit:n}=S(),{setIsNewInvoiceOpen:r,setStartDate:i,setSelectedPaymentOption:c,setIsCacheActive:u,methods:m}=h(),{reset:l}=m,{onSubmit:p,onSubmitDraft:f}=I(),{clearCache:d}=N("cachedNewInvoiceForm"),v=()=>{u(!1),d(),a(),r(!1),l(k),i(new Date),c(1)},C=x();return e.jsxs(b,{children:[e.jsx(j,{handleClick:v,text:s,justifySelf:o||""}),e.jsxs(w,{children:[e.jsx(y,{type:"button",value:C>325?"Save as draft":"Draft",onClick:f}),e.jsx(D,{type:"button",value:"Save",onClick:n(p)})]})]})}F.propTypes={closeText:t.string.isRequired,justifyCancel:t.string};export{F as default};
