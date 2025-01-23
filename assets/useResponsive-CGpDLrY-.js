import{d as a,j as e,a as K,r as E,e as ht,aC as yt}from"./index-DMmgDaP9.js";import{P as Q,c as F,u as M,d as ft,e as dt,A as gt,f as jt,G as wt,E as bt}from"./invoice.queries-C6PGV1xI.js";import{L as g,C as mt,S as ct,A as Z,a as Ct,b as v,c as tt,I as Y}from"./editPageStyles-BxKiKXiI.js";import{c as U,v as et}from"./utilityFunctions-DQfLIsuu.js";import{u as st}from"./useMutation-TRz-KUgB.js";const Et=a.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  font-style: ${({theme:t})=>t.font};
  width: 45%;

  @media (min-width: 768px) {
    width: 100%;
    max-width: fit-content;
  }
`,At=a(Et)`
  width: 100%;

  @media (min-width: 768px) {
    width: 45%;
    max-width: fit-content;
  }
`,pt=a.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  font-style: ${({theme:t})=>t.font};
  width: 100%;
`;function C({className:t,children:r,style:s}){const n=()=>{};return e.jsx(pt,{onChange:n,className:t,style:s,children:r})}function q({className:t,isLongOnMobile:r,children:s,style:n}){return r?e.jsx(At,{className:t,style:{...n},children:s}):e.jsx(pt,{className:t,children:s})}const It=a.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  max-width: 100vw;

  @media (min-width: 768px) {
    flex-wrap: nowrap;
    max-width: 100%;
  }
`;function X({children:t}){return e.jsx(It,{className:"address-box",children:t})}X.propTypes={children:Q.node.isRequired};const Nt=a.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  @media (min-width: 600px) {
    display: contents;
  }
`;function Ht({invoice:t}){var u,m,j,f;const r=K(),{formState:{errors:s},register:n}=F(),{isDraft:o}=M(),p=e.jsxs(C,{style:{width:r<768?"100%":""},className:"company-country",children:[e.jsx(g,{htmlFor:"country",style:{color:s!=null&&s.country?"#EC5757":""},children:"Country"}),e.jsx(mt,{type:"text",style:{border:s!=null&&s.country?"1px solid #EC5757":"",width:r<768?"100%":""},defaultValue:t?(u=t==null?void 0:t.senderAddress)==null?void 0:u.country:"",...n("country",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return e.jsxs(e.Fragment,{children:[e.jsxs(C,{className:"company-street-address",children:[e.jsx(g,{htmlFor:"streetAddress",style:{color:s!=null&&s.streetAddress?"#EC5757":""},children:"Street Address"}),e.jsx(ct,{style:{border:s!=null&&s.streetAddress?"1px solid #EC5757":""},defaultValue:t?(m=t==null?void 0:t.senderAddress)==null?void 0:m.street:"",...n("streetAddress",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:50})})]}),e.jsxs(X,{children:[e.jsxs(Nt,{children:[e.jsxs(q,{className:"company-city",children:[e.jsx(g,{htmlFor:"city",style:{color:s!=null&&s.city?"#EC5757":""},children:"City"}),e.jsx(Z,{style:{border:s!=null&&s.city?"1px solid #EC5757":""},defaultValue:t?(j=t==null?void 0:t.senderAddress)==null?void 0:j.city:"",type:"text",...n("city",{required:!o,pattern:/[\w ]*/i,maxLength:30})})]}),e.jsxs(q,{style:{justifySelf:"flex-end"},className:"company-postal-code",children:[e.jsx(g,{htmlFor:"postalCode",style:{color:s!=null&&s.postalCode?"#EC5757":""},children:"Post Code"}),e.jsx(Z,{style:{border:s!=null&&s.postalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(f=t==null?void 0:t.senderAddress)==null?void 0:f.postCode:"",...n("postalCode",{required:!o,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]})]}),r<768&&e.jsx(C,{className:"company-country-container",children:p}),r>=768&&e.jsx(q,{className:"company-country-container",children:p})]})]})}const rt=a.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-top: 0;
  grid-template: auto auto / 1fr 1fr;
  grid-auto-flow: dense;
  background-color: ${({theme:t})=>t.formBackground};
  margin-bottom: 3rem;

  @media (min-width: 600px) {
    height: 72px;
    width: 100%;
    display: grid;

    // Setting the px of the grid column keeps the form fields lined up.
    grid-template: 1fr / 220px 62px 116px 61px 45px;
    justify-items: start;
    margin-bottom: initial;
  }
`,xt=a.input`
  width: 240px;
  height: 48px;
  border-radius: 4px;
  border: 1px solid ${({theme:t})=>t.formFieldOutline};
  outline: none;
  padding: 17px 20px 16px 20px;
  margin-bottom: 1.5rem;
  font-family: ${({theme:t})=>t.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: ${({theme:t})=>t.textPlain};
  background-color: ${({theme:t})=>t.inputBackgroundColor};
  cursor: pointer;

  &:focus,
  &:hover {
    border-color: ${({theme:t})=>t.formFieldOutlineFocus};
  }

  .custom-input {
    padding: 0;
  }
`,it=a(xt)`
  white-space: nowrap;
  justify-self: start;
  width: 100%;
  margin: 0;
  padding-left: 1.25rem;
  color: ${({theme:t})=>t.text};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;

  border: ${t=>t.invalid?"1px solid red":""};

  @media (min-width: 600px) {
    width: 204px;
  }
`,J=a(xt).attrs({pattern:"\\d+"})`
  width: 64px;
  margin: 0;
  color: ${({theme:t})=>t.textPlain};
  padding: 0;
  padding-left: 1.25rem;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  text-align: left;
  letter-spacing: -0.25px;

  @media (min-width: 600px) {
    text-align: center;
    width: 46px;
    display: inline;
    padding: 0;
  }
`,nt=a(J).attrs({pattern:"[0-9.]*"})`
  width: 80px;
  padding-left: 1.25rem;
  text-align: left;

  @media (min-width: 325px) {
    width: 100px;
    padding-left: 1.25rem;
    text-align: left;
  }
`,lt=a.p`
  min-width: 40px;
  align-self: center;
  height: fit-content;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: ${({theme:t})=>t.greyText};

  @media (min-width: 325px) {
  }

  @media (min-width: 600px) {
    grid-area: initial;
    text-align: center;
    min-width: 60px;
  }
`;a.div`
  display: none;

  @media (min-width: 600px) {
    display: contents;
  }
`;a.p`
  display: inline;
  grid-area: 2 / 1 / 3 / 2;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  margin: 0;
  margin-top: 0.5rem;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: ${({theme:t})=>t.greyText};

  @media (min-width: 600px) {
    display: none;
  }
`;const qt=a.div`
  display: grid;
  grid-template: 1fr / 220px 62px 116px 61px 49px;
`,at=a.svg`
  width: 13px;
  height: 16px;
  justify-self: end;
  align-self: center;
  cursor: pointer;
  outline: none;

  .deleteIconPath {
    fill: #888eb0;
    outline: none;
    &:hover {
      fill: red;
    }

    &:focus {
      fill: red;
    }
  }
`,R=a.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: fit-content;
  width: fit-content;
`,Ft=a(R)`
  text-align: right;
  @media (min-width: 325px) {
    align-items: flex-start;
    text-align: initial;
  }
`,St=a.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80%;
  align-items: center;

  @media (min-width: 325px) {
    width: 90%;
  }

  @media (min-width: 600px) {
    width: 80%;
  }
`,ot=e.jsx("path",{d:"M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z",fillRule:"nonzero",className:"deleteIconPath",tabIndex:0}),$t=a.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  border-radius: 10px;
  background-color: ${({theme:t})=>t.editButton};
  cursor: pointer;

  &:hover {
    background-color: #dfe3fa;
  }

  &:focus {
    background-color: #dfe3fa;
  }
`,Qt=a.svg`
  width: 11px;
  height: 11px;
`,Vt=a.p`
  color: ${({theme:t})=>t.newItemText};
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  text-align: center;
  letter-spacing: -0.25px;
  margin-left: 0.25rem;
`;function Lt({items:t,append:r}){const{clearErrors:s}=F(),{formState:{submitCount:n}}=ft(),o=()=>{r({id:"",name:"",quantity:"",price:"",total:""}),s("itemsError")};return e.jsx($t,{onClick:o,type:"button",style:{border:n>0&&t.length===0?"1px solid red":"1px solid transparent"},children:e.jsx(Vt,{children:"+ Add New Item"})})}const Bt=a.div`
  display: grid;
  width: 100%;
  border-radius: 8px;
  grid-template-rows: auto;
  background-color: ${({theme:t})=>t.formBackground};
`,Pt=a.div`
  display: none;
  @media (min-width: 600px) {
    display: grid;
    grid-template: 1fr / 220px 62px 116px 61px 49px;
    color: ${({theme:t})=>t.newItemText};
    margin-top: 1rem;
    padding-left: 0;
    border-radius: 8px 8px 0 0;
    justify-items: flex-start;
  }
`,N=a.label`
  color: ${({theme:t})=>t.newItemText};
  width: fit-content;
  margin: 0;
  padding: 0;
  font-family: "Spartan", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 18px;
  /* identical to box height, or 164% */
  letter-spacing: -0.229167px;
  justify-self: center;

  @media (min-width: 600px) {
    &.mobile-only-label {
      display: none;
    }
  }
`,H=a(N)`
  justify-self: start;

  @media (min-width: 600px) {
    &.mobile-only-label {
      display: none;
    }
  }
`,kt=a.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  border-radius: 8px 8px 0 0;
  background-color: ${({theme:t})=>t.formBackground};
  padding: 0;
  transition: all 250ms ease-in-out;

  @media (min-width: 768px) {
    padding: 0;
    border-radius: initial;
    margin-top: initial;
  }
`,Tt=a.h1`
  font-weight: 700;
  font-size: 18px;
  line-height: 32px;
  /* identical to box height, or 178% */
  letter-spacing: -0.375px;
  color: ${({theme:t})=>t.greyText};
  padding: 0;
  margin-top: 1rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-top: 2rem;
  }
`;function ut({isDraft:t,invoice:r,isEditOpen:s}){const{formState:n,register:o,watch:p,clearErrors:u,setError:m,resetField:j}=F(),{fields:f,remove:A,append:b}=dt({name:"items",rules:{required:!0,minLength:1}}),{errors:l,isSubmitting:W}=n,x=p("items",[]),I=p(),S=K(),$=E.useRef(!0);E.useEffect(()=>{!f.length&&!$.current?m("myFieldArray",{type:"required",message:"At least one item is required"}):u("myFieldArray"),$.current&&($.current=!1)},[f,W]),E.useEffect(()=>{r&&s&&r.items.forEach(i=>{b({id:i.id,name:i.name,quantity:i.quantity,price:i.price,total:i.total})}),s||setTimeout(()=>{j("items")},200)},[r,s]),E.useEffect(()=>{(!I.items||I.items.length===0)&&m("items",{type:"custom",message:"An item must be added"})},[I.items]);const _=i=>{var w,d,h,c,y,V,L,B,P,k,T,z,D,O;return e.jsxs(rt,{children:[e.jsxs(R,{style:{width:"100%",marginBottom:"1.5rem"},children:[e.jsx(H,{style:{marginBottom:"1rem"},children:"Item Name"}),e.jsx(it,{...o(`items[${i}].name`,{required:!t}),placeholder:"Item name",defaultValue:r?(d=(w=r==null?void 0:r.items)==null?void 0:w[i])==null?void 0:d.name:"",type:"text",style:{border:Array.isArray(l.items)&&((c=(h=l==null?void 0:l.items)==null?void 0:h[i])!=null&&c.name)?"1px solid #EC5757":""}})]}),e.jsxs(St,{children:[e.jsxs(R,{children:[e.jsx(N,{style:{marginBottom:"0.625rem"},children:"Qty."}),e.jsx(J,{...o(`items[${i}].quantity`,{required:!t,max:100}),placeholder:"0",type:"text",style:{border:Array.isArray(l.items)&&((V=(y=l==null?void 0:l.items)==null?void 0:y[i])!=null&&V.quantity)?"1px solid #EC5757":""},defaultValue:r?(B=(L=r==null?void 0:r.items)==null?void 0:L[i])==null?void 0:B.quantity:""})]}),e.jsxs(R,{children:[e.jsx(N,{style:{marginBottom:"0.625rem"},children:"Price"}),e.jsx(nt,{...o(`items[${i}].price`,{required:!t,max:1e5}),placeholder:"0.00",type:"text",defaultValue:r?(k=(P=r==null?void 0:r.items)==null?void 0:P[i])==null?void 0:k.price:"",style:{border:Array.isArray(l.items)&&((z=(T=l==null?void 0:l.items)==null?void 0:T[i])!=null&&z.price)?"1px solid #EC5757":""}})]}),e.jsxs(Ft,{style:{width:"fit-content"},children:[e.jsx(N,{style:{marginBottom:"0.625rem"},children:"Total"}),e.jsx(lt,{children:(Number((D=x==null?void 0:x[i])==null?void 0:D.quantity)*Number((O=x==null?void 0:x[i])==null?void 0:O.price)).toFixed(2)})]})]}),e.jsxs(R,{children:[e.jsx(N,{style:{marginBottom:"0.625rem"},children:"  "}),e.jsx(at,{name:"removeButton",onClick:()=>A(i),children:ot})]})]})},G=i=>{var w,d,h,c,y,V,L,B,P,k,T,z,D,O;return e.jsx(rt,{children:e.jsxs(qt,{children:[e.jsx(it,{...o(`items[${i}].name`,{required:!t}),placeholder:"Item name",defaultValue:r?(d=(w=r==null?void 0:r.items)==null?void 0:w[i])==null?void 0:d.name:"",type:"text",style:{border:Array.isArray(l.items)&&((c=(h=l==null?void 0:l.items)==null?void 0:h[i])!=null&&c.name)?"1px solid #EC5757":""}}),e.jsx(J,{...o(`items[${i}].quantity`,{required:!t,max:100}),placeholder:"0",type:"text",style:{border:Array.isArray(l.items)&&((V=(y=l==null?void 0:l.items)==null?void 0:y[i])!=null&&V.quantity)?"1px solid #EC5757":""},defaultValue:r?(B=(L=r==null?void 0:r.items)==null?void 0:L[i])==null?void 0:B.quantity:0}),e.jsx(nt,{...o(`items[${i}].price`,{required:!t,max:1e5}),placeholder:"0.00",type:"text",defaultValue:r?(k=(P=r==null?void 0:r.items)==null?void 0:P[i])==null?void 0:k.price:0,style:{border:Array.isArray(l.items)&&((z=(T=l==null?void 0:l.items)==null?void 0:T[i])!=null&&z.price)?"1px solid #EC5757":""}}),e.jsx(lt,{children:(Number((D=x==null?void 0:x[i])==null?void 0:D.quantity)*Number((O=x==null?void 0:x[i])==null?void 0:O.price)).toFixed(2)}),e.jsx(at,{name:"removeButton",onClick:()=>A(i),children:ot})]})})};return e.jsxs(e.Fragment,{children:[e.jsx("ul",{style:{listStyle:"none",marginLeft:"0",paddingLeft:0},children:f.map((i,w)=>e.jsx("li",{"data-testid":"invoice-item",children:e.jsxs("div",{children:[S<600&&_(w),S>=600&&G(w)]})},i.id))}),e.jsx(Lt,{append:b,items:r?r.items:[]})]})}ut.propTypes={isDraft:Q.bool.isRequired,isEditOpen:Q.bool};const zt=({className:t})=>e.jsxs(Pt,{className:t,children:[e.jsx(H,{children:"Item Name"}),e.jsx(H,{children:"Qty."}),e.jsx(H,{children:"Price"}),e.jsx(N,{children:"Total"})]});function Zt({invoice:t,isEditOpen:r=!1}){const{isDraft:s}=M();return e.jsxs(Bt,{"data-testid":"items-container",children:[e.jsx(Tt,{children:"Item List"}),e.jsx(zt,{className:"desktop-only-label"}),e.jsx(kt,{children:e.jsx(ut,{isDraft:s,invoice:t,isEditOpen:r})})]})}function Dt({isEditOpen:t}){const{formState:{errors:r}}=F(),s=()=>Object.keys(r).find(n=>n!=="myFieldArray"&&n!=="items");return e.jsxs(Ct,{children:[e.jsx(v,{style:{display:(s()||r.items)&&t?"block":"none"},children:"- All fields must be added"}),e.jsx(v,{style:{display:r.myFieldArray&&t?"block":"none"},children:"- An item must be added"})]})}Dt.propTypes={isEditOpen:Q.bool.isRequired};function Gt({invoice:t}){var u,m,j,f,A,b;const r=K(),{formState:{errors:s},register:n}=F(),{isDraft:o}=M(),p=e.jsxs(C,{style:{width:r<768?"100%":""},className:"client-country",children:[e.jsx(g,{htmlFor:"clientCountry",style:{color:s.clientCountry?"#EC5757":""},children:"Country"}),e.jsx(mt,{$long:!1,style:{border:s!=null&&s.clientCountry?"1px solid #EC5757":"",width:r<768?"100%":""},type:"text",defaultValue:t?(u=t==null?void 0:t.clientAddress)==null?void 0:u.country:"",...n("clientCountry",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return e.jsxs(e.Fragment,{children:[e.jsxs(C,{className:"client-name",children:[e.jsx(g,{htmlFor:"clientName",style:{color:s.clientName?"#EC5757":""},children:"Client's Name"}),((m=s.clientName)==null?void 0:m.type)==="required"&&e.jsx(tt,{children:"can't be empty"}),e.jsx(Y,{$long:!0,style:{border:s.clientName?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientName:"",...n("clientName",{required:!o})})]}),e.jsxs(C,{className:"client-email",children:[e.jsx(g,{htmlFor:"clientEmail",style:{color:s.clientEmail?"#EC5757":""},children:"Client's Email"}),((j=s.clientEmail)==null?void 0:j.type)==="pattern"&&e.jsx(tt,{style:{position:"absolute",top:"-8px"},children:"Invalid email"}),e.jsx(Y,{$long:!0,style:{border:s.clientEmail?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientEmail:"",...n("clientEmail",{required:!o,pattern:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/})})]}),e.jsxs(C,{className:"client-street-address",children:[e.jsx(g,{htmlFor:"clientStreetAddress",style:{color:s.clientStreetAddress?"#EC5757":""},children:"Street Address"}),e.jsx(ct,{style:{border:s.clientStreetAddress?"1px solid #EC5757":""},defaultValue:t?(f=t==null?void 0:t.clientAddress)==null?void 0:f.street:"",...n("clientStreetAddress",{required:!o})})]}),e.jsxs(X,{children:[e.jsxs(q,{className:"client-city",children:[e.jsx(g,{htmlFor:"clientCity",style:{color:s.clientCity?"#EC5757":""},children:"City"}),e.jsx(Z,{style:{border:s.clientCity?"1px solid #EC5757":""},type:"text",defaultValue:t?(A=t==null?void 0:t.clientAddress)==null?void 0:A.city:"",...n("clientCity",{required:!o,pattern:/[\w ]*/i,maxLength:30})})]}),e.jsxs(q,{className:"client-postal-code",children:[e.jsx(g,{htmlFor:"clientPostalCode",style:{color:s.clientPostalCode?"#EC5757":""},children:"Post Code"}),e.jsx(Z,{style:{border:s.clientPostalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(b=t==null?void 0:t.clientAddress)==null?void 0:b.postCode:"",...n("clientPostalCode",{required:!o,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]}),r<768&&e.jsx(C,{className:"client-country",children:p}),r>=768&&e.jsx(q,{className:"client-country",children:p})]})]})}function Ut({invoice:t}){const{formState:{errors:r},register:s}=F(),{isDraft:n}=M();return e.jsx(e.Fragment,{children:e.jsxs(C,{className:"project-description",children:[e.jsx(g,{htmlFor:"projectDescription",style:{color:r.projectDescription?"#EC5757":""},children:"Project Description"}),e.jsx(Y,{type:"text",defaultValue:t==null?void 0:t.description,...s("projectDescription",{required:!n}),style:{border:r.projectDescription?"1px solid #EC5757":""}})]})})}const Yt=()=>{const{id:t}=ht(),{startDate:r,setIsDraft:s,setIsNewInvoiceOpen:n,selectedPaymentOption:o,setSelectedPaymentOption:p,methods:u}=M(),{control:m,trigger:j,reset:f,watch:A,setError:b,clearErrors:l,getValues:W}=u,{replace:x}=dt({control:m,name:"items"}),I=A(),[S]=st(jt,{refetchQueries:[{query:gt}],onError:d=>{console.error(d)}}),[$]=st(bt,{update:(d,{data:{editInvoice:h}})=>{d.writeQuery({query:wt,variables:{getInvoiceById:h.id},data:{getInvoiceById:h}})},onError:d=>{console.error(d)}}),_=()=>{p(1),f(),l(),n(!1)},G=async d=>{if(console.log("Submitting form"),yt.flushSync(()=>s(!1)),d=W(),!d.items){console.log("No items"),b("items",{type:"custom",message:"An item must be added"});return}if(await j()){const c=U(d,r,o);c.items=c.items.map(y=>({...y,quantity:Number(y.quantity),price:Number(y.price)})),c.status="pending";try{await S({variables:{...c}}),_(),x([{id:et(),name:"",quantity:0,price:0,total:0}])}catch(y){console.error(y)}}},i=async()=>{console.log("Submitting draft"),l();const d=W();d.items||(d.items=[{id:"",name:"",quantity:0,price:0,total:0}]);const h=U(d,r,o);h.status="draft";try{await S({variables:{...h}}),_(),x([{id:et(),name:"",quantity:0,price:0,total:0}])}catch(c){console.error(c)}},w=async d=>{if(console.log("Submitting update"),await j()){const c=U(d,r,o);c.id=String(t),c.status="pending",console.log(t);try{await $({variables:{...c}}),n(!1)}catch(y){console.error(y)}}};return E.useEffect(()=>{I.items?l("items"):b("items",{type:"custom",message:"An item must be added"})},[I.items,b]),{methods:u,onSubmit:G,onSubmitDraft:i,onSubmitUpdate:w}},Jt=()=>{const[t,r]=E.useState(!1),[s,n]=E.useState(0),[o,p]=E.useState("");return E.useEffect(()=>{const u=()=>{const m=window.innerWidth;r(m<600),m>1200?(n(616),p("2.5rem 2.5rem 2rem calc(2.5rem + 17px)")):m<1200&&m>325?(n(616),p("2.5rem")):m<325?(n(325),p("2rem 1.5rem 2.5rem")):m<600&&(n(m),p("1.5rem"))};return window.addEventListener("resize",u),u(),()=>window.removeEventListener("resize",u)},[]),{isMobile:t,editPageWidth:s,padding:o}};export{Ht as C,Ut as D,Zt as E,Dt as F,Qt as S,Gt as a,Jt as b,q as c,Yt as u};
