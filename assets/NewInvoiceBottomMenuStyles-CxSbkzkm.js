import{d as t}from"./index-CquupEEF.js";const o=t.div`
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-top: 2.6rem;
  margin-bottom: 4rem;
  align-self: center;
  transform: scale(0.9);

  @media (min-width: 325px) {
    justify-content: space-between;
    transform: scale(1);
  }

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`,e=t.input`
  border-radius: 24px;
  background-color: #7c5dfa;
  border: none;
  height: 44px;
  width: 90px;
  display: flex;
  flex-shrink: 1;
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

  @media (min-width: 1200px) {
    height: 48px;
    width: 138px;
  }

  &:hover {
    background-color: #9277ff;
  }
`,r=t(e)`
  background-color: #373b53;
  color: #888eb0;
  margin-right: 8px;
  width: 133px;
  padding-left: 16px;
  padding-right: 16px;

  &:hover {
    background-color: #0c0e16;
  }
`,a=t(e)`
  background-color: ${({theme:i})=>i.buttonBackground};
  border-radius: 24px;
  cursor: pointer;
  width: fit-content;
  white-space: nowrap;
  width: 133px;

  @media (min-width: 1200px) {
    width: 150px;
  }
`,d=t.div`
  display: contents;

  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
  }
`;export{o as M,a as S,d as a,r as b};
