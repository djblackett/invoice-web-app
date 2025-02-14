import{d as t,M as x,g as m,h as u,j as e,Q as f}from"./index-BOeL8XZv.js";import{D as g}from"./ViewInvoice-Bt1ox5ZJ.js";import{C as h}from"./CancelButton-C5rfgmuH.js";import{A as C,R as b}from"./invoice.queries-ClMKVYNv.js";import{D as v}from"./editPageStyles-Cepnq2zK.js";import{D as j}from"./FullInvoiceStyles-D_ZpwR7o.js";import{C as y}from"./ClickOutsideProvider-DIYwishr.js";import{u as k}from"./useMutation-CpYCfBmO.js";t.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  min-height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;const D=t(x)`
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
`;t.p`
  font-weight: 500;
  font-size: 12px;
  line-height: 22px;
  /* or 183% */

  letter-spacing: 0.25px;
  color: ${({theme:o})=>o.greyText};
`;const M=t.div`
  display: flex;
  align-self: flex-end;
  justify-content: center;
`;function N({isModalOpen:o,setIsModalOpen:n,invoice:i}){const s=localStorage.getItem("theme"),a=m(),{id:l}=u(),[c]=k(b,{refetchQueries:[{query:C}],onCompleted:()=>{a("/")},onError:p=>{console.log(p.graphQLErrors[0]),f.error("An error occurred!",{position:"top-center",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:s||void 0})}}),d=async()=>{await c({variables:{removeInvoiceId:l}})},r=()=>n(!1);return e.jsx(v,{style:{display:o?"flex":"none"},children:e.jsx(y,{onOutsideClick:r,children:e.jsxs(D,{children:[e.jsx(I,{children:"Confirm Deletion"}),e.jsx(j,{children:`Are you sure you want to delete invoice #${i.id}? This action cannot
            be undone.`}),e.jsxs(M,{children:[e.jsx(h,{handleClick:r,text:"Cancel"}),e.jsx(g,{handleClick:d})]})]})})})}export{N as default};
