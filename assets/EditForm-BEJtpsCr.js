import{j as s}from"./index-DMmgDaP9.js";import{P as r,c as a,u as d,F as j}from"./invoice.queries-C6PGV1xI.js";import{u as m,b as f,C as h,a as C,D as y,E as F,F as E}from"./useResponsive-CGpDLrY-.js";import{C as I}from"./CancelButton-Bzz0eLq7.js";import{M as T,S as b}from"./NewInvoiceBottomMenuStyles-CxzmnRO-.js";import{D as g,F as v,E as D,B as l}from"./editPageStyles-BxKiKXiI.js";import S from"./DateAndPayment-CV4MT27D.js";import"./utilityFunctions-DQfLIsuu.js";import"./useMutation-TRz-KUgB.js";function x({saveText:e,closeText:i,justifyCancel:n}){const{reset:t}=a(),{setIsNewInvoiceOpen:o}=d(),c=()=>{o(!1),t()},{handleSubmit:p}=a(),{onSubmitUpdate:u}=m();return s.jsxs(T,{children:[s.jsx(I,{handleClick:c,text:i,justifySelf:n}),s.jsx(b,{type:"button",value:e,onClick:p(u)})]})}x.propTypes={saveText:r.string.isRequired,closeText:r.string.isRequired};function L({invoice:e}){const{editPageWidth:i,padding:n}=f(),{isNewInvoiceOpen:t}=d(),{methods:o}=m();return e?s.jsx(g,{style:{visibility:t?"visible":"hidden"},children:s.jsxs(v,{"data-testid":"editInvoiceModal",style:{width:t?`${i}px`:0,padding:t?n:0},children:[s.jsxs(D,{children:["Edit ",s.jsx("span",{style:{color:"#7E88C3"},children:"#"}),e&&e.id.substring(0,6)]}),s.jsx(j,{...o,children:s.jsxs("form",{style:{display:"flex",flexDirection:"column"},children:[s.jsx(l,{children:"Bill From"}),s.jsx(h,{invoice:e}),s.jsx(l,{children:"Bill To"}),s.jsx(C,{invoice:e}),s.jsx(S,{invoice:e}),s.jsx(y,{invoice:e}),s.jsx(F,{invoice:e,isEditOpen:t}),s.jsx(E,{isEditOpen:t}),s.jsx(x,{saveText:"Save Changes",closeText:"Cancel",justifyCancel:""})]})})]})}):null}export{L as default};
