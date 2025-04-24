import{d as t,M as p,m as u,n as x,j as e,k as f,Q as g,aM as h}from"./index-CNDK3Od4.js";import{D as C}from"./ViewInvoice-CltQ3r4X.js";import{C as v}from"./CancelButton-B9xG1w1w.js";import{D as j}from"./editPageStyles-blYWhQPw.js";import{D as b}from"./FullInvoiceStyles-O2tzXi9o.js";import{C as y}from"./ClickOutsideProvider-pOF8gon-.js";import{u as k}from"./ReactToastify-DiOZReGA.js";import"./InvoiceStatus-CiDa2GcS.js";import"./ViewInvoiceStyles-BMPNOa5q.js";const D=t(p)`
  display: flex;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, 0);
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  padding: 3rem;
  background-color: ${({theme:o})=>o.background};
  max-width: 480px;
  border-radius: 8px;
  box-shadow: 0px 10px 10px -10px rgba(72, 84, 159, 0.100397);
  margin: 0 1.5rem;
`,I=t.h1`
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  /* identical to box height, or 133% */
  letter-spacing: -0.5px;
  color: ${({theme:o})=>o.text};
  margin: 0;
  margin-bottom: 13px;
`,M=t.div`
  display: flex;
  align-self: flex-end;
  justify-content: center;
`;function S({isModalOpen:o,setIsModalOpen:n,invoice:i}){const s=localStorage.getItem("theme"),a=u(),{id:l}=x(),[c]=k(h,{refetchQueries:[{query:f}],onCompleted:()=>{a("/")},onError:m=>{console.error(m.graphQLErrors[0]),g.error("An error occurred!",{position:"top-center",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:s||void 0,toastId:"delete-error-toast"})}}),d=async()=>{await c({variables:{removeInvoiceId:l}})},r=()=>n(!1);return e.jsx(j,{style:{display:o?"flex":"none"},children:e.jsx(y,{onOutsideClick:r,children:e.jsxs(D,{children:[e.jsx(I,{children:"Confirm Deletion"}),e.jsx(b,{children:`Are you sure you want to delete invoice #${i.id}? This action cannot
            be undone.`}),e.jsxs(M,{children:[e.jsx(v,{handleClick:r,text:"Cancel",style:{margin:"0.25rem"}}),e.jsx(C,{handleClick:d})]})]})})})}export{S as default};
