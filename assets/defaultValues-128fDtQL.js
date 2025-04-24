import{d as i}from"./index-CNDK3Od4.js";const x=i.div`
  width: 100%;
  max-width: 100vw;
  min-width: 100vw;
  position: absolute;

  left: -26px;
  /* right: -32px; */
  bottom: -1.8rem;
  display: flex;
  height: 91px;

  flex-direction: row;
  align-items: center;
  justify-content: center;

  padding-left: 0;
  padding-right: 0;
  margin-bottom: 4rem;
  margin-left: 0;
  margin-right: 0;

  transform: scale(0.9);

  @media (min-width: 325px) {
    position: static;
    justify-content: space-between;
    transform: scale(1);
    left: 0;
    right: 0;
    bottom: initial;
    max-width: 100%;
    min-width: 100vw;
    margin-bottom: 2rem;
    margin-left: -32px;
    padding-left: 8px;
    padding-right: 8px;
    padding-bottom: 2rem;
  }

  @media (min-width: 400px) {
    min-width: auto;
    margin-left: 0;
  }

  @media (min-width: 768px) {
    margin-bottom: 0;
    min-width: auto;
    margin-left: 0;
  }
`,m=i.input`
  border-radius: 24px;
  background-color: #7c5dfa;
  border: none;
  height: 48px;
  width: 90px;
  display: flex;
  flex-shrink: 1;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: #ffffff;
  scale: 0.9;

  @media (min-width: 325px) {
    scale: 1;
  }

  @media (min-width: 1200px) {
    height: 48px;
    width: 138px;
  }

  &:hover {
    background-color: #9277ff;
  }
`,g=i(m)`
  background-color: #373b53;
  color: #888eb0;
  margin-right: 8px;
  margin-left: 8px;
  width: min-content;
  max-width: 150px;
  padding: 16px 24px 17px 24px;
  flex-grow: 1;

  &:hover {
    background-color: #0c0e16;
  }
`,h=i(m)`
  background-color: ${({theme:t})=>t.buttonBackground};
  border-radius: 24px;
  cursor: pointer;
  white-space: nowrap;
  width: auto;
  max-width: 150px;
  flex-grow: 1;
  padding: 16px 24px 17px 24px;
  /* margin-right: -32px; */

  @media (min-width: 325px) {
    margin-right: 0;
  }

  @media (min-width: 1200px) {
    width: 150px;
  }
`,f=i.div`
  display: contents;

  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
  }
`,u={items:[{name:"",price:0,quantity:0,total:0,id:""}],country:"",streetAddress:"",city:"",postalCode:"",clientCountry:"",clientName:"",clientEmail:"",clientStreetAddress:"",clientCity:"",clientPostalCode:"",projectDescription:""},w=t=>{var n,r,a,d,o,s,l,p;return{country:(n=t.senderAddress)==null?void 0:n.country,streetAddress:(r=t.senderAddress)==null?void 0:r.street,city:(a=t.senderAddress)==null?void 0:a.city,postalCode:(d=t.senderAddress)==null?void 0:d.postCode,clientEmail:t.clientEmail,clientName:t.clientName,clientCountry:(o=t.clientAddress)==null?void 0:o.country,clientStreetAddress:(s=t.clientAddress)==null?void 0:s.street,clientCity:(l=t.clientAddress)==null?void 0:l.city,clientPostalCode:(p=t.clientAddress)==null?void 0:p.postCode,projectDescription:t.description,paymentDue:t.paymentDue,paymentTerms:t.paymentTerms,status:t.status,total:t.total,items:t.items.map(e=>({id:e.id,name:e.name,quantity:e.quantity,price:e.price,total:e.total}))}};export{x as M,f as S,g as a,u as b,h as c,w as i};
