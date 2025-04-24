import{j as e,d as r,f as N}from"./index-CNDK3Od4.js";import{P as D}from"./InvoiceStatus-CiDa2GcS.js";import{g as x,c as b}from"./utilityFunctions-CAPD2Jrd.js";import{C,T as $,I as E,a as P,D as B,A as z,b as s,c as k,G as a,d as l,B as i,N as q,E as G}from"./FullInvoiceStyles-O2tzXi9o.js";const L=r.div`
  display: grid;
  width: 100%;
  padding: 1.5rem;
  padding-top: 1.5rem;
  grid-template: auto auto / 1fr 1fr;
  grid-auto-flow: dense;
  background-color: ${({theme:t})=>t.editButton};

  @media (min-width: 768px) {
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    grid-template: 1fr / 2fr 1fr 1fr 1fr;
    justify-items: end;

    :first-child {
      padding-top: 0;
    }

    :last-child {
      padding-bottom: 2rem;
    }
  }
`,w=r.div`
  white-space: nowrap;
  justify-self: flex-start;
  width: fit-content;
  margin: 0;
  padding: 0;
  color: ${({theme:t})=>t.text};
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
`,A=r.p`
  display: none;
  justify-self: end;
  width: fit-content;
  margin: 0;
  color: ${({theme:t})=>t.greyText};
  padding: 0;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */

  text-align: right;
  letter-spacing: -0.25px;

  @media (min-width: 768px) {
    display: inline;
    text-align: center;
    margin-right: 0.5rem;
  }
`,Q=r(A)`
  margin-right: 0;
`,M=r(w)`
  text-align: end;
  justify-self: end;
  align-self: center;
  grid-area: 1 / 2 / 2 / 3;
  @media (min-width: 768px) {
    grid-area: initial;
  }
`,R=r.div`
  display: none;

  @media (min-width: 768px) {
    display: contents;
  }
`,F=r.p`
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

  @media (min-width: 768px) {
    display: none;
  }
`,H=r.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (min-width: 768px) {
    display: contents;
  }
`;function T({item:t}){return e.jsxs(L,{className:"item-container",children:[e.jsxs(H,{className:"mobile-helper-container",children:[e.jsx(w,{className:"item-name",children:t.name}),e.jsxs(R,{className:"quantity-price-container",children:[e.jsx(A,{children:t.quantity}),e.jsxs(Q,{children:["£ ",x(Number(t.price))]})]}),e.jsxs(F,{children:[`${t.quantity} x £ ${Number(t.price).toFixed(2)}`," "]})]}),e.jsxs(M,{children:["£ ",x(Number(t.total))]})]})}T.propTypes={item:D.object.isRequired};const W=r.div`
  display: grid;
  width: 100%;
  border-radius: 8px;
`,S=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  background-color: ${({theme:t})=>t.amountDueBackground};
  padding: 2rem;
  border-radius: 0 0 8px 8px;
`,Y=r.p`
  color: white;
  font-weight: 500;
  font-size: 11px;
  line-height: 18px;
  /* identical to box height, or 164% */
  letter-spacing: -0.229167px;

  .grand-total {
    display: inline;
  }

  .amount-due {
    display: none;
  }

  @media (min-width: 768px) {
    .grand-total {
      display: none;
    }

    .amount-due {
      display: inline;
    }
  }
`,J=r.p`
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  /* identical to box height, or 133% */
  text-align: right;
  letter-spacing: -0.5px;
  color: white;
`,K=r.div`
  display: none;

  @media (min-width: 768px) {
    display: grid;
    grid-template: 1fr / 2fr 1fr 1fr 1fr;
    color: ${({theme:t})=>t.greyText};
    background-color: ${({theme:t})=>t.editButton};
    margin-top: 3rem;
    padding: 2rem;
    border-radius: 8px 8px 0 0;
    justify-items: end;
  }
`,p=r.p`
  width: fit-content;
  margin: 0;
  padding: 0;
  font-weight: 500;
  font-size: 11px;
  line-height: 18px;
  /* identical to box height, or 164% */
  letter-spacing: -0.229167px;
`,O=r(p)`
  justify-self: start;
`,U=r.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 2.5rem;
  border-radius: 8px 8px 0 0;
  background-color: ${({theme:t})=>t.editButton};

  :first-child {
    border-radius: 8px 8px 0 0;
  }

  @media (min-width: 768px) {
    padding: 0;
    border-radius: initial;
    margin-top: initial;
  }
`;let V=0;function I({invoice:t}){var n;return t?e.jsxs(W,{children:[e.jsxs(K,{children:[e.jsx(O,{children:"Item Name"}),e.jsx(p,{children:"QTY."}),e.jsx(p,{children:"Price"}),e.jsx(p,{children:"Total"})]}),e.jsx(U,{children:t&&((n=t==null?void 0:t.items)==null?void 0:n.map(d=>e.jsx(T,{item:d},`itemList-${(d==null?void 0:d.id)||++V}`)))}),e.jsxs(S,{children:[e.jsxs(Y,{children:[e.jsx("span",{className:"amount-due",children:"Amount Due"}),e.jsx("span",{className:"grand-total",children:"Grand Total"})]}),e.jsxs(J,{children:["£ ",x(t==null?void 0:t.total)]})]})]}):null}I.propTypes={};function tt({invoice:t,loading:n}){var h,o,m,g,c,u,f,j,y;const d=N();return n?e.jsx("div",{children:"Loading..."}):e.jsxs(C,{children:[e.jsxs($,{children:[e.jsxs(E,{children:[e.jsxs(P,{children:[e.jsx("span",{style:{color:"#7E88C3"},children:"#"}),(h=t==null?void 0:t.id)==null?void 0:h.substring(0,6)]}),e.jsx(B,{children:t==null?void 0:t.description})]}),e.jsxs(z,{style:{textAlign:d>=768?"right":"left"},children:[e.jsx(s,{children:(o=t==null?void 0:t.senderAddress)==null?void 0:o.street}),e.jsx(s,{children:(m=t==null?void 0:t.senderAddress)==null?void 0:m.city}),e.jsx(s,{children:(g=t==null?void 0:t.senderAddress)==null?void 0:g.postCode}),e.jsx(s,{children:(c=t==null?void 0:t.senderAddress)==null?void 0:c.country})]})]}),e.jsxs(k,{children:[e.jsxs(a,{children:[e.jsx(l,{children:"Invoice Date"}),e.jsxs(i,{children:[" ",b(t==null?void 0:t.createdAt)]})]}),e.jsxs(a,{children:[e.jsx(l,{children:"Payment Due"}),e.jsx(i,{children:b(t==null?void 0:t.paymentDue)})]}),e.jsxs(q,{children:[e.jsxs(a,{children:[e.jsx(l,{children:"Bill To"}),e.jsx(i,{children:t==null?void 0:t.clientName})]}),e.jsxs(G,{children:[e.jsx(s,{children:(u=t==null?void 0:t.clientAddress)==null?void 0:u.street}),e.jsx(s,{children:(f=t==null?void 0:t.clientAddress)==null?void 0:f.city}),e.jsx(s,{children:(j=t==null?void 0:t.clientAddress)==null?void 0:j.postCode}),e.jsx(s,{children:(y=t==null?void 0:t.clientAddress)==null?void 0:y.country})]})]}),e.jsxs(a,{children:[e.jsx(l,{children:"Sent to"}),e.jsx(i,{children:t==null?void 0:t.clientEmail})]})]}),e.jsx(I,{invoice:t})]})}export{tt as default};
