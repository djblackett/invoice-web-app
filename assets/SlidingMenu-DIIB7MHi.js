const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/NewInvoiceBottomMenu-CGui52_A.js","assets/index-D-4_CnQ0.js","assets/index-BgypsdHM.css","assets/InvoiceStatus-C7nIYE3L.js","assets/CancelButton-C2trzFJA.js","assets/NewInvoiceBottomMenuStyles-xAP06SqH.js","assets/editPageStyles-DTDH6kVP.js","assets/utilityFunctions-Ul2guwNB.js","assets/useMutation-CPEfX0WL.js","assets/create-visual-element-lAR0r7aN.js","assets/DateAndPayment-Czw4Th08.js"])))=>i.map(i=>d[i]);
import{a as v,T as mi,j as c,U as Ae,V as be,W as pi,X as Re,Y as L,Z as I,a0 as et,a1 as Le,a2 as st,a3 as dt,a4 as X,a5 as Ve,a6 as fi,a7 as yi,a8 as Be,a9 as gi,aa as pt,ab as ft,ac as Rt,ad as xi,d as P,b as mt,l as vi,g as Pi,ae as ji,G as Ci,af as Ti,ag as wi,R as Ie,f as ke}from"./index-D-4_CnQ0.js";import{P as ht,e as F,c as U,f as Ei,g as Me}from"./InvoiceStatus-C7nIYE3L.js";import{L as M,C as Fe,a as Lt,I as Ct,S as Ne,A as ut,b as Di,c as Vt,E as Si,B as Bt}from"./editPageStyles-DTDH6kVP.js";import{c as yt,v as It}from"./utilityFunctions-Ul2guwNB.js";import{u as kt}from"./useMutation-CPEfX0WL.js";import{i as O,b as Et,d as Ai,e as bi,f as Oe,p as Ri,s as Li,m as Vi,h as D,j as Tt,k as E,l as Bi,n as Ii,o as ki,q as Mt,r as $e,F as Ue,t as Ft,u as Mi,v as qe,w as ze,x as _e,y as Fi,z as Nt,S as Ni,A as Oi,B as W,C as nt,D as ot,E as Ot,G as $i,H as Ui,I as qi,J as G,K as zi,c as _i,g as Wi,a as Gi}from"./create-visual-element-lAR0r7aN.js";class Hi extends v.Component{getSnapshotBeforeUpdate(e){const i=this.props.childRef.current;if(i&&e.isPresent&&!this.props.isPresent){const s=i.offsetParent,o=s instanceof HTMLElement&&s.offsetWidth||0,u=this.props.sizeRef.current;u.height=i.offsetHeight||0,u.width=i.offsetWidth||0,u.top=i.offsetTop,u.left=i.offsetLeft,u.right=o-u.width-u.left}return null}componentDidUpdate(){}render(){return this.props.children}}function Xi({children:t,isPresent:e,anchorX:i}){const s=v.useId(),o=v.useRef(null),u=v.useRef({width:0,height:0,top:0,left:0,right:0}),{nonce:n}=v.useContext(mi);return v.useInsertionEffect(()=>{const{width:r,height:a,top:l,left:h,right:d}=u.current;if(e||!o.current||!r||!a)return;const m=i==="left"?`left: ${h}`:`right: ${d}`;o.current.dataset.motionPopId=s;const p=document.createElement("style");return n&&(p.nonce=n),document.head.appendChild(p),p.sheet&&p.sheet.insertRule(`
          [data-motion-pop-id="${s}"] {
            position: absolute !important;
            width: ${r}px !important;
            height: ${a}px !important;
            ${m}px !important;
            top: ${l}px !important;
          }
        `),()=>{document.head.removeChild(p)}},[e]),c.jsx(Hi,{isPresent:e,childRef:o,sizeRef:u,children:v.cloneElement(t,{ref:o})})}const Yi=({children:t,initial:e,isPresent:i,onExitComplete:s,custom:o,presenceAffectsLayout:u,mode:n,anchorX:r})=>{const a=Ae(Zi),l=v.useId(),h=v.useCallback(m=>{a.set(m,!0);for(const p of a.values())if(!p)return;s&&s()},[a,s]),d=v.useMemo(()=>({id:l,initial:e,isPresent:i,custom:o,onExitComplete:h,register:m=>(a.set(m,!1),()=>a.delete(m))}),u?[Math.random(),h]:[i,h]);return v.useMemo(()=>{a.forEach((m,p)=>a.set(p,!1))},[i]),v.useEffect(()=>{!i&&!a.size&&s&&s()},[i]),n==="popLayout"&&(t=c.jsx(Xi,{isPresent:i,anchorX:r,children:t})),c.jsx(be.Provider,{value:d,children:t})};function Zi(){return new Map}function We(t=!0){const e=v.useContext(be);if(e===null)return[!0,null];const{isPresent:i,onExitComplete:s,register:o}=e,u=v.useId();v.useEffect(()=>{t&&o(u)},[t]);const n=v.useCallback(()=>t&&s&&s(u),[u,s,t]);return!i&&s?[!1,n]:[!0]}const rt=t=>t.key||"";function $t(t){const e=[];return v.Children.forEach(t,i=>{v.isValidElement(i)&&e.push(i)}),e}const Nn=({children:t,custom:e,initial:i=!0,onExitComplete:s,presenceAffectsLayout:o=!0,mode:u="sync",propagate:n=!1,anchorX:r="left"})=>{const[a,l]=We(n),h=v.useMemo(()=>$t(t),[t]),d=n&&!a?[]:h.map(rt),m=v.useRef(!0),p=v.useRef(h),f=Ae(()=>new Map),[g,y]=v.useState(h),[x,T]=v.useState(h);pi(()=>{m.current=!1,p.current=h;for(let C=0;C<x.length;C++){const S=rt(x[C]);d.includes(S)?f.delete(S):f.get(S)!==!0&&f.set(S,!1)}},[x,d.length,d.join("-")]);const w=[];if(h!==g){let C=[...h];for(let S=0;S<x.length;S++){const q=x[S],j=rt(q);d.includes(j)||(C.splice(S,0,q),w.push(q))}return u==="wait"&&w.length&&(C=w),T($t(C)),y(h),null}const{forceRender:A}=v.useContext(Re);return c.jsx(c.Fragment,{children:x.map(C=>{const S=rt(C),q=n&&!a?!1:h===x||d.includes(S),j=()=>{if(f.has(S))f.set(S,!0);else return;let z=!0;f.forEach(R=>{R||(z=!1)}),z&&(A==null||A(),T(p.current),n&&(l==null||l()),s&&s())};return c.jsx(Yi,{isPresent:q,initial:!m.current||i?void 0:!1,custom:e,presenceAffectsLayout:o,mode:u,onExitComplete:q?void 0:j,anchorX:r,children:C},S)})})};function Qi(t){if(typeof Proxy>"u")return t;const e=new Map,i=(...s)=>t(...s);return new Proxy(i,{get:(s,o)=>o==="create"?t:(e.has(o)||e.set(o,t(o)),e.get(o))})}function Ji(t){return t==="x"||t==="y"?O[t]?null:(O[t]=!0,()=>{O[t]=!1}):O.x||O.y?null:(O.x=O.y=!0,()=>{O.x=O.y=!1})}function J(t,e,i,s){return Et(t,e,Ai(i),s)}const Ut=(t,e)=>Math.abs(t-e);function Ki(t,e){const i=Ut(t.x,e.x),s=Ut(t.y,e.y);return Math.sqrt(i**2+s**2)}class Ge{constructor(e,i,{transformPagePoint:s,contextWindow:o,dragSnapToOrigin:u=!1}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const d=xt(this.lastMoveEventInfo,this.history),m=this.startEvent!==null,p=Ki(d.offset,{x:0,y:0})>=3;if(!m&&!p)return;const{point:f}=d,{timestamp:g}=L;this.history.push({...f,timestamp:g});const{onStart:y,onMove:x}=this.handlers;m||(y&&y(this.lastMoveEvent,d),this.startEvent=this.lastMoveEvent),x&&x(this.lastMoveEvent,d)},this.handlePointerMove=(d,m)=>{this.lastMoveEvent=d,this.lastMoveEventInfo=gt(m,this.transformPagePoint),I.update(this.updatePoint,!0)},this.handlePointerUp=(d,m)=>{this.end();const{onEnd:p,onSessionEnd:f,resumeAnimation:g}=this.handlers;if(this.dragSnapToOrigin&&g&&g(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const y=xt(d.type==="pointercancel"?this.lastMoveEventInfo:gt(m,this.transformPagePoint),this.history);this.startEvent&&p&&p(d,y),f&&f(d,y)},!bi(e))return;this.dragSnapToOrigin=u,this.handlers=i,this.transformPagePoint=s,this.contextWindow=o||window;const n=Oe(e),r=gt(n,this.transformPagePoint),{point:a}=r,{timestamp:l}=L;this.history=[{...a,timestamp:l}];const{onSessionStart:h}=i;h&&h(e,xt(r,this.history)),this.removeListeners=Ri(J(this.contextWindow,"pointermove",this.handlePointerMove),J(this.contextWindow,"pointerup",this.handlePointerUp),J(this.contextWindow,"pointercancel",this.handlePointerUp))}updateHandlers(e){this.handlers=e}end(){this.removeListeners&&this.removeListeners(),et(this.updatePoint)}}function gt(t,e){return e?{point:e(t.point)}:t}function qt(t,e){return{x:t.x-e.x,y:t.y-e.y}}function xt({point:t},e){return{point:t,delta:qt(t,He(e)),offset:qt(t,ts(e)),velocity:es(e,.1)}}function ts(t){return t[0]}function He(t){return t[t.length-1]}function es(t,e){if(t.length<2)return{x:0,y:0};let i=t.length-1,s=null;const o=He(t);for(;i>=0&&(s=t[i],!(o.timestamp-s.timestamp>Li(e)));)i--;if(!s)return{x:0,y:0};const u=Vi(o.timestamp-s.timestamp);if(u===0)return{x:0,y:0};const n={x:(o.x-s.x)/u,y:(o.y-s.y)/u};return n.x===1/0&&(n.x=0),n.y===1/0&&(n.y=0),n}const Xe=1e-4,is=1-Xe,ss=1+Xe,Ye=.01,ns=0-Ye,os=0+Ye;function b(t){return t.max-t.min}function rs(t,e,i){return Math.abs(t-e)<=i}function zt(t,e,i,s=.5){t.origin=s,t.originPoint=D(e.min,e.max,t.origin),t.scale=b(i)/b(e),t.translate=D(i.min,i.max,t.origin)-t.originPoint,(t.scale>=is&&t.scale<=ss||isNaN(t.scale))&&(t.scale=1),(t.translate>=ns&&t.translate<=os||isNaN(t.translate))&&(t.translate=0)}function K(t,e,i,s){zt(t.x,e.x,i.x,s?s.originX:void 0),zt(t.y,e.y,i.y,s?s.originY:void 0)}function _t(t,e,i){t.min=i.min+e.min,t.max=t.min+b(e)}function as(t,e,i){_t(t.x,e.x,i.x),_t(t.y,e.y,i.y)}function Wt(t,e,i){t.min=e.min-i.min,t.max=t.min+b(e)}function tt(t,e,i){Wt(t.x,e.x,i.x),Wt(t.y,e.y,i.y)}function ls(t,{min:e,max:i},s){return e!==void 0&&t<e?t=s?D(e,t,s.min):Math.max(t,e):i!==void 0&&t>i&&(t=s?D(i,t,s.max):Math.min(t,i)),t}function Gt(t,e,i){return{min:e!==void 0?t.min+e:void 0,max:i!==void 0?t.max+i-(t.max-t.min):void 0}}function cs(t,{top:e,left:i,bottom:s,right:o}){return{x:Gt(t.x,i,o),y:Gt(t.y,e,s)}}function Ht(t,e){let i=e.min-t.min,s=e.max-t.max;return e.max-e.min<t.max-t.min&&([i,s]=[s,i]),{min:i,max:s}}function ds(t,e){return{x:Ht(t.x,e.x),y:Ht(t.y,e.y)}}function hs(t,e){let i=.5;const s=b(t),o=b(e);return o>s?i=Tt(e.min,e.max-s,t.min):s>o&&(i=Tt(t.min,t.max-o,e.min)),Le(0,1,i)}function us(t,e){const i={};return e.min!==void 0&&(i.min=e.min-t.min),e.max!==void 0&&(i.max=e.max-t.min),i}const wt=.35;function ms(t=wt){return t===!1?t=0:t===!0&&(t=wt),{x:Xt(t,"left","right"),y:Xt(t,"top","bottom")}}function Xt(t,e,i){return{min:Yt(t,e),max:Yt(t,i)}}function Yt(t,e){return typeof t=="number"?t:t[e]||0}function B(t){return[t("x"),t("y")]}const Ze=({current:t})=>t?t.ownerDocument.defaultView:null,ps=new WeakMap;class fs{constructor(e){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=E(),this.visualElement=e}start(e,{snapToCursor:i=!1}={}){const{presenceContext:s}=this.visualElement;if(s&&s.isPresent===!1)return;const o=h=>{const{dragSnapToOrigin:d}=this.getProps();d?this.pauseAnimation():this.stopAnimation(),i&&this.snapToCursor(Oe(h).point)},u=(h,d)=>{const{drag:m,dragPropagation:p,onDragStart:f}=this.getProps();if(m&&!p&&(this.openDragLock&&this.openDragLock(),this.openDragLock=Ji(m),!this.openDragLock))return;this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),B(y=>{let x=this.getAxisMotionValue(y).get()||0;if(dt.test(x)){const{projection:T}=this.visualElement;if(T&&T.layout){const w=T.layout.layoutBox[y];w&&(x=b(w)*(parseFloat(x)/100))}}this.originPoint[y]=x}),f&&I.postRender(()=>f(h,d)),Mt(this.visualElement,"transform");const{animationState:g}=this.visualElement;g&&g.setActive("whileDrag",!0)},n=(h,d)=>{const{dragPropagation:m,dragDirectionLock:p,onDirectionLock:f,onDrag:g}=this.getProps();if(!m&&!this.openDragLock)return;const{offset:y}=d;if(p&&this.currentDirection===null){this.currentDirection=ys(y),this.currentDirection!==null&&f&&f(this.currentDirection);return}this.updateAxis("x",d.point,y),this.updateAxis("y",d.point,y),this.visualElement.render(),g&&g(h,d)},r=(h,d)=>this.stop(h,d),a=()=>B(h=>{var d;return this.getAnimationState(h)==="paused"&&((d=this.getAxisMotionValue(h).animation)===null||d===void 0?void 0:d.play())}),{dragSnapToOrigin:l}=this.getProps();this.panSession=new Ge(e,{onSessionStart:o,onStart:u,onMove:n,onSessionEnd:r,resumeAnimation:a},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:l,contextWindow:Ze(this.visualElement)})}stop(e,i){const s=this.isDragging;if(this.cancel(),!s)return;const{velocity:o}=i;this.startAnimation(o);const{onDragEnd:u}=this.getProps();u&&I.postRender(()=>u(e,i))}cancel(){this.isDragging=!1;const{projection:e,animationState:i}=this.visualElement;e&&(e.isAnimationBlocked=!1),this.panSession&&this.panSession.end(),this.panSession=void 0;const{dragPropagation:s}=this.getProps();!s&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),i&&i.setActive("whileDrag",!1)}updateAxis(e,i,s){const{drag:o}=this.getProps();if(!s||!at(e,o,this.currentDirection))return;const u=this.getAxisMotionValue(e);let n=this.originPoint[e]+s[e];this.constraints&&this.constraints[e]&&(n=ls(n,this.constraints[e],this.elastic[e])),u.set(n)}resolveConstraints(){var e;const{dragConstraints:i,dragElastic:s}=this.getProps(),o=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(e=this.visualElement.projection)===null||e===void 0?void 0:e.layout,u=this.constraints;i&&st(i)?this.constraints||(this.constraints=this.resolveRefConstraints()):i&&o?this.constraints=cs(o.layoutBox,i):this.constraints=!1,this.elastic=ms(s),u!==this.constraints&&o&&this.constraints&&!this.hasMutatedConstraints&&B(n=>{this.constraints!==!1&&this.getAxisMotionValue(n)&&(this.constraints[n]=us(o.layoutBox[n],this.constraints[n]))})}resolveRefConstraints(){const{dragConstraints:e,onMeasureDragConstraints:i}=this.getProps();if(!e||!st(e))return!1;const s=e.current,{projection:o}=this.visualElement;if(!o||!o.layout)return!1;const u=Bi(s,o.root,this.visualElement.getTransformPagePoint());let n=ds(o.layout.layoutBox,u);if(i){const r=i(Ii(n));this.hasMutatedConstraints=!!r,r&&(n=ki(r))}return n}startAnimation(e){const{drag:i,dragMomentum:s,dragElastic:o,dragTransition:u,dragSnapToOrigin:n,onDragTransitionEnd:r}=this.getProps(),a=this.constraints||{},l=B(h=>{if(!at(h,i,this.currentDirection))return;let d=a&&a[h]||{};n&&(d={min:0,max:0});const m=o?200:1e6,p=o?40:1e7,f={type:"inertia",velocity:s?e[h]:0,bounceStiffness:m,bounceDamping:p,timeConstant:750,restDelta:1,restSpeed:10,...u,...d};return this.startAxisValueAnimation(h,f)});return Promise.all(l).then(r)}startAxisValueAnimation(e,i){const s=this.getAxisMotionValue(e);return Mt(this.visualElement,e),s.start($e(e,s,0,i,this.visualElement,!1))}stopAnimation(){B(e=>this.getAxisMotionValue(e).stop())}pauseAnimation(){B(e=>{var i;return(i=this.getAxisMotionValue(e).animation)===null||i===void 0?void 0:i.pause()})}getAnimationState(e){var i;return(i=this.getAxisMotionValue(e).animation)===null||i===void 0?void 0:i.state}getAxisMotionValue(e){const i=`_drag${e.toUpperCase()}`,s=this.visualElement.getProps(),o=s[i];return o||this.visualElement.getValue(e,(s.initial?s.initial[e]:void 0)||0)}snapToCursor(e){B(i=>{const{drag:s}=this.getProps();if(!at(i,s,this.currentDirection))return;const{projection:o}=this.visualElement,u=this.getAxisMotionValue(i);if(o&&o.layout){const{min:n,max:r}=o.layout.layoutBox[i];u.set(e[i]-D(n,r,.5))}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:e,dragConstraints:i}=this.getProps(),{projection:s}=this.visualElement;if(!st(i)||!s||!this.constraints)return;this.stopAnimation();const o={x:0,y:0};B(n=>{const r=this.getAxisMotionValue(n);if(r&&this.constraints!==!1){const a=r.get();o[n]=hs({min:a,max:a},this.constraints[n])}});const{transformTemplate:u}=this.visualElement.getProps();this.visualElement.current.style.transform=u?u({},""):"none",s.root&&s.root.updateScroll(),s.updateLayout(),this.resolveConstraints(),B(n=>{if(!at(n,e,null))return;const r=this.getAxisMotionValue(n),{min:a,max:l}=this.constraints[n];r.set(D(a,l,o[n]))})}addListeners(){if(!this.visualElement.current)return;ps.set(this.visualElement,this);const e=this.visualElement.current,i=J(e,"pointerdown",a=>{const{drag:l,dragListener:h=!0}=this.getProps();l&&h&&this.start(a)}),s=()=>{const{dragConstraints:a}=this.getProps();st(a)&&a.current&&(this.constraints=this.resolveRefConstraints())},{projection:o}=this.visualElement,u=o.addEventListener("measure",s);o&&!o.layout&&(o.root&&o.root.updateScroll(),o.updateLayout()),I.read(s);const n=Et(window,"resize",()=>this.scalePositionWithinConstraints()),r=o.addEventListener("didUpdate",({delta:a,hasLayoutChanged:l})=>{this.isDragging&&l&&(B(h=>{const d=this.getAxisMotionValue(h);d&&(this.originPoint[h]+=a[h].translate,d.set(d.get()+a[h].translate))}),this.visualElement.render())});return()=>{n(),i(),u(),r&&r()}}getProps(){const e=this.visualElement.getProps(),{drag:i=!1,dragDirectionLock:s=!1,dragPropagation:o=!1,dragConstraints:u=!1,dragElastic:n=wt,dragMomentum:r=!0}=e;return{...e,drag:i,dragDirectionLock:s,dragPropagation:o,dragConstraints:u,dragElastic:n,dragMomentum:r}}}function at(t,e,i){return(e===!0||e===t)&&(i===null||i===t)}function ys(t,e=10){let i=null;return Math.abs(t.y)>e?i="y":Math.abs(t.x)>e&&(i="x"),i}class gs extends Ue{constructor(e){super(e),this.removeGroupControls=X,this.removeListeners=X,this.controls=new fs(e)}mount(){const{dragControls:e}=this.node.getProps();e&&(this.removeGroupControls=e.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||X}unmount(){this.removeGroupControls(),this.removeListeners()}}const Zt=t=>(e,i)=>{t&&I.postRender(()=>t(e,i))};class xs extends Ue{constructor(){super(...arguments),this.removePointerDownListener=X}onPointerDown(e){this.session=new Ge(e,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:Ze(this.node)})}createPanHandlers(){const{onPanSessionStart:e,onPanStart:i,onPan:s,onPanEnd:o}=this.node.getProps();return{onSessionStart:Zt(e),onStart:Zt(i),onMove:s,onEnd:(u,n)=>{delete this.session,o&&I.postRender(()=>o(u,n))}}}mount(){this.removePointerDownListener=J(this.node.current,"pointerdown",e=>this.onPointerDown(e))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}const lt={hasAnimatedSinceResize:!0,hasEverUpdated:!1};function Qt(t,e){return e.max===e.min?0:t/(e.max-e.min)*100}const Z={correct:(t,e)=>{if(!e.target)return t;if(typeof t=="string")if(Ve.test(t))t=parseFloat(t);else return t;const i=Qt(t,e.target.x),s=Qt(t,e.target.y);return`${i}% ${s}%`}},vs={correct:(t,{treeScale:e,projectionDelta:i})=>{const s=t,o=Ft.parse(t);if(o.length>5)return s;const u=Ft.createTransformer(t),n=typeof o[0]!="number"?1:0,r=i.x.scale*e.x,a=i.y.scale*e.y;o[0+n]/=r,o[1+n]/=a;const l=D(r,a,.5);return typeof o[2+n]=="number"&&(o[2+n]/=l),typeof o[3+n]=="number"&&(o[3+n]/=l),u(o)}};class Ps extends v.Component{componentDidMount(){const{visualElement:e,layoutGroup:i,switchLayoutGroup:s,layoutId:o}=this.props,{projection:u}=e;yi(js),u&&(i.group&&i.group.add(u),s&&s.register&&o&&s.register(u),u.root.didUpdate(),u.addEventListener("animationComplete",()=>{this.safeToRemove()}),u.setOptions({...u.options,onExitComplete:()=>this.safeToRemove()})),lt.hasEverUpdated=!0}getSnapshotBeforeUpdate(e){const{layoutDependency:i,visualElement:s,drag:o,isPresent:u}=this.props,n=s.projection;return n&&(n.isPresent=u,o||e.layoutDependency!==i||i===void 0?n.willUpdate():this.safeToRemove(),e.isPresent!==u&&(u?n.promote():n.relegate()||I.postRender(()=>{const r=n.getStack();(!r||!r.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{projection:e}=this.props.visualElement;e&&(e.root.didUpdate(),Be.postRender(()=>{!e.currentAnimation&&e.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:e,layoutGroup:i,switchLayoutGroup:s}=this.props,{projection:o}=e;o&&(o.scheduleCheckAfterUnmount(),i&&i.group&&i.group.remove(o),s&&s.deregister&&s.deregister(o))}safeToRemove(){const{safeToRemove:e}=this.props;e&&e()}render(){return null}}function Qe(t){const[e,i]=We(),s=v.useContext(Re);return c.jsx(Ps,{...t,layoutGroup:s,switchLayoutGroup:v.useContext(fi),isPresent:e,safeToRemove:i})}const js={borderRadius:{...Z,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:Z,borderTopRightRadius:Z,borderBottomLeftRadius:Z,borderBottomRightRadius:Z,boxShadow:vs};function Cs(t,e,i){const s=gi(t)?t:Mi(t);return s.start($e("",s,e,i)),s.animation}function Ts(t){return t instanceof SVGElement&&t.tagName!=="svg"}const ws=(t,e)=>t.depth-e.depth;class Es{constructor(){this.children=[],this.isDirty=!1}add(e){qe(this.children,e),this.isDirty=!0}remove(e){ze(this.children,e),this.isDirty=!0}forEach(e){this.isDirty&&this.children.sort(ws),this.isDirty=!1,this.children.forEach(e)}}function Ds(t,e){const i=_e.now(),s=({timestamp:o})=>{const u=o-i;u>=e&&(et(s),t(u-e))};return I.read(s,!0),()=>et(s)}const Je=["TopLeft","TopRight","BottomLeft","BottomRight"],Ss=Je.length,Jt=t=>typeof t=="string"?parseFloat(t):t,Kt=t=>typeof t=="number"||Ve.test(t);function As(t,e,i,s,o,u){o?(t.opacity=D(0,i.opacity!==void 0?i.opacity:1,bs(s)),t.opacityExit=D(e.opacity!==void 0?e.opacity:1,0,Rs(s))):u&&(t.opacity=D(e.opacity!==void 0?e.opacity:1,i.opacity!==void 0?i.opacity:1,s));for(let n=0;n<Ss;n++){const r=`border${Je[n]}Radius`;let a=te(e,r),l=te(i,r);if(a===void 0&&l===void 0)continue;a||(a=0),l||(l=0),a===0||l===0||Kt(a)===Kt(l)?(t[r]=Math.max(D(Jt(a),Jt(l),s),0),(dt.test(l)||dt.test(a))&&(t[r]+="%")):t[r]=l}(e.rotate||i.rotate)&&(t.rotate=D(e.rotate||0,i.rotate||0,s))}function te(t,e){return t[e]!==void 0?t[e]:t.borderRadius}const bs=Ke(0,.5,Fi),Rs=Ke(.5,.95,X);function Ke(t,e,i){return s=>s<t?0:s>e?1:i(Tt(t,e,s))}function ee(t,e){t.min=e.min,t.max=e.max}function V(t,e){ee(t.x,e.x),ee(t.y,e.y)}function ie(t,e){t.translate=e.translate,t.scale=e.scale,t.originPoint=e.originPoint,t.origin=e.origin}function se(t,e,i,s,o){return t-=e,t=Nt(t,1/i,s),o!==void 0&&(t=Nt(t,1/o,s)),t}function Ls(t,e=0,i=1,s=.5,o,u=t,n=t){if(dt.test(e)&&(e=parseFloat(e),e=D(n.min,n.max,e/100)-n.min),typeof e!="number")return;let r=D(u.min,u.max,s);t===u&&(r-=e),t.min=se(t.min,e,i,r,o),t.max=se(t.max,e,i,r,o)}function ne(t,e,[i,s,o],u,n){Ls(t,e[i],e[s],e[o],e.scale,u,n)}const Vs=["x","scaleX","originX"],Bs=["y","scaleY","originY"];function oe(t,e,i,s){ne(t.x,e,Vs,i?i.x:void 0,s?s.x:void 0),ne(t.y,e,Bs,i?i.y:void 0,s?s.y:void 0)}function re(t){return t.translate===0&&t.scale===1}function ti(t){return re(t.x)&&re(t.y)}function ae(t,e){return t.min===e.min&&t.max===e.max}function Is(t,e){return ae(t.x,e.x)&&ae(t.y,e.y)}function le(t,e){return Math.round(t.min)===Math.round(e.min)&&Math.round(t.max)===Math.round(e.max)}function ei(t,e){return le(t.x,e.x)&&le(t.y,e.y)}function ce(t){return b(t.x)/b(t.y)}function de(t,e){return t.translate===e.translate&&t.scale===e.scale&&t.originPoint===e.originPoint}class ks{constructor(){this.members=[]}add(e){qe(this.members,e),e.scheduleRender()}remove(e){if(ze(this.members,e),e===this.prevLead&&(this.prevLead=void 0),e===this.lead){const i=this.members[this.members.length-1];i&&this.promote(i)}}relegate(e){const i=this.members.findIndex(o=>e===o);if(i===0)return!1;let s;for(let o=i;o>=0;o--){const u=this.members[o];if(u.isPresent!==!1){s=u;break}}return s?(this.promote(s),!0):!1}promote(e,i){const s=this.lead;if(e!==s&&(this.prevLead=s,this.lead=e,e.show(),s)){s.instance&&s.scheduleRender(),e.scheduleRender(),e.resumeFrom=s,i&&(e.resumeFrom.preserveOpacity=!0),s.snapshot&&(e.snapshot=s.snapshot,e.snapshot.latestValues=s.animationValues||s.latestValues),e.root&&e.root.isUpdating&&(e.isLayoutDirty=!0);const{crossfade:o}=e.options;o===!1&&s.hide()}}exitAnimationComplete(){this.members.forEach(e=>{const{options:i,resumingFrom:s}=e;i.onExitComplete&&i.onExitComplete(),s&&s.options.onExitComplete&&s.options.onExitComplete()})}scheduleRender(){this.members.forEach(e=>{e.instance&&e.scheduleRender(!1)})}removeLeadSnapshot(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)}}function Ms(t,e,i){let s="";const o=t.x.translate/e.x,u=t.y.translate/e.y,n=(i==null?void 0:i.z)||0;if((o||u||n)&&(s=`translate3d(${o}px, ${u}px, ${n}px) `),(e.x!==1||e.y!==1)&&(s+=`scale(${1/e.x}, ${1/e.y}) `),i){const{transformPerspective:l,rotate:h,rotateX:d,rotateY:m,skewX:p,skewY:f}=i;l&&(s=`perspective(${l}px) ${s}`),h&&(s+=`rotate(${h}deg) `),d&&(s+=`rotateX(${d}deg) `),m&&(s+=`rotateY(${m}deg) `),p&&(s+=`skewX(${p}deg) `),f&&(s+=`skewY(${f}deg) `)}const r=t.x.scale*e.x,a=t.y.scale*e.y;return(r!==1||a!==1)&&(s+=`scale(${r}, ${a})`),s||"none"}const vt=["","X","Y","Z"],Fs={visibility:"hidden"},he=1e3;let Ns=0;function Pt(t,e,i,s){const{latestValues:o}=e;o[t]&&(i[t]=o[t],e.setStaticValue(t,0),s&&(s[t]=0))}function ii(t){if(t.hasCheckedOptimisedAppear=!0,t.root===t)return;const{visualElement:e}=t.options;if(!e)return;const i=zi(e);if(window.MotionHasOptimisedAnimation(i,"transform")){const{layout:o,layoutId:u}=t.options;window.MotionCancelOptimisedAnimation(i,"transform",I,!(o||u))}const{parent:s}=t;s&&!s.hasCheckedOptimisedAppear&&ii(s)}function si({attachResizeListener:t,defaultParent:e,measureScroll:i,checkIsScrollRoot:s,resetTransform:o}){return class{constructor(n={},r=e==null?void 0:e()){this.id=Ns++,this.animationId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(Us),this.nodes.forEach(Gs),this.nodes.forEach(Hs),this.nodes.forEach(qs)},this.resolvedRelativeTargetAt=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=n,this.root=r?r.root||r:this,this.path=r?[...r.path,r]:[],this.parent=r,this.depth=r?r.depth+1:0;for(let a=0;a<this.path.length;a++)this.path[a].shouldResetTransform=!0;this.root===this&&(this.nodes=new Es)}addEventListener(n,r){return this.eventHandlers.has(n)||this.eventHandlers.set(n,new Ni),this.eventHandlers.get(n).add(r)}notifyListeners(n,...r){const a=this.eventHandlers.get(n);a&&a.notify(...r)}hasListeners(n){return this.eventHandlers.has(n)}mount(n,r=this.root.hasTreeAnimated){if(this.instance)return;this.isSVG=Ts(n),this.instance=n;const{layoutId:a,layout:l,visualElement:h}=this.options;if(h&&!h.current&&h.mount(n),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),r&&(l||a)&&(this.isLayoutDirty=!0),t){let d;const m=()=>this.root.updateBlockedByResize=!1;t(n,()=>{this.root.updateBlockedByResize=!0,d&&d(),d=Ds(m,250),lt.hasAnimatedSinceResize&&(lt.hasAnimatedSinceResize=!1,this.nodes.forEach(me))})}a&&this.root.registerSharedNode(a,this),this.options.animate!==!1&&h&&(a||l)&&this.addEventListener("didUpdate",({delta:d,hasLayoutChanged:m,hasRelativeLayoutChanged:p,layout:f})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const g=this.options.transition||h.getDefaultTransition()||Js,{onLayoutAnimationStart:y,onLayoutAnimationComplete:x}=h.getProps(),T=!this.targetLayout||!ei(this.targetLayout,f),w=!m&&p;if(this.options.layoutRoot||this.resumeFrom||w||m&&(T||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0),this.setAnimationOrigin(d,w);const A={...Oi(g,"layout"),onPlay:y,onComplete:x};(h.shouldReduceMotion||this.options.layoutRoot)&&(A.delay=0,A.type=!1),this.startAnimation(A)}else m||me(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=f})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const n=this.getStack();n&&n.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,et(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(Xs),this.animationId++)}getTransformTemplate(){const{visualElement:n}=this.options;return n&&n.getProps().transformTemplate}willUpdate(n=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&ii(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let h=0;h<this.path.length;h++){const d=this.path[h];d.shouldResetTransform=!0,d.updateScroll("snapshot"),d.options.layoutRoot&&d.willUpdate(!1)}const{layoutId:r,layout:a}=this.options;if(r===void 0&&!a)return;const l=this.getTransformTemplate();this.prevTransformTemplateValue=l?l(this.latestValues,""):void 0,this.updateSnapshot(),n&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(ue);return}this.isUpdating||this.nodes.forEach(_s),this.isUpdating=!1,this.nodes.forEach(Ws),this.nodes.forEach(Os),this.nodes.forEach($s),this.clearAllSnapshots();const r=_e.now();L.delta=Le(0,1e3/60,r-L.timestamp),L.timestamp=r,L.isProcessing=!0,pt.update.process(L),pt.preRender.process(L),pt.render.process(L),L.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,Be.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(zs),this.sharedNodes.forEach(Ys)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,I.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){I.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!b(this.snapshot.measuredBox.x)&&!b(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let a=0;a<this.path.length;a++)this.path[a].updateScroll();const n=this.layout;this.layout=this.measure(!1),this.layoutCorrected=E(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:r}=this.options;r&&r.notify("LayoutMeasure",this.layout.layoutBox,n?n.layoutBox:void 0)}updateScroll(n="measure"){let r=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===n&&(r=!1),r){const a=s(this.instance);this.scroll={animationId:this.root.animationId,phase:n,isRoot:a,offset:i(this.instance),wasRoot:this.scroll?this.scroll.isRoot:a}}}resetTransform(){if(!o)return;const n=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,r=this.projectionDelta&&!ti(this.projectionDelta),a=this.getTransformTemplate(),l=a?a(this.latestValues,""):void 0,h=l!==this.prevTransformTemplateValue;n&&(r||W(this.latestValues)||h)&&(o(this.instance,l),this.shouldResetTransform=!1,this.scheduleRender())}measure(n=!0){const r=this.measurePageBox();let a=this.removeElementScroll(r);return n&&(a=this.removeTransform(a)),Ks(a),{animationId:this.root.animationId,measuredBox:r,layoutBox:a,latestValues:{},source:this.id}}measurePageBox(){var n;const{visualElement:r}=this.options;if(!r)return E();const a=r.measureViewportBox();if(!(((n=this.scroll)===null||n===void 0?void 0:n.wasRoot)||this.path.some(tn))){const{scroll:h}=this.root;h&&(nt(a.x,h.offset.x),nt(a.y,h.offset.y))}return a}removeElementScroll(n){var r;const a=E();if(V(a,n),!((r=this.scroll)===null||r===void 0)&&r.wasRoot)return a;for(let l=0;l<this.path.length;l++){const h=this.path[l],{scroll:d,options:m}=h;h!==this.root&&d&&m.layoutScroll&&(d.wasRoot&&V(a,n),nt(a.x,d.offset.x),nt(a.y,d.offset.y))}return a}applyTransform(n,r=!1){const a=E();V(a,n);for(let l=0;l<this.path.length;l++){const h=this.path[l];!r&&h.options.layoutScroll&&h.scroll&&h!==h.root&&ot(a,{x:-h.scroll.offset.x,y:-h.scroll.offset.y}),W(h.latestValues)&&ot(a,h.latestValues)}return W(this.latestValues)&&ot(a,this.latestValues),a}removeTransform(n){const r=E();V(r,n);for(let a=0;a<this.path.length;a++){const l=this.path[a];if(!l.instance||!W(l.latestValues))continue;Ot(l.latestValues)&&l.updateSnapshot();const h=E(),d=l.measurePageBox();V(h,d),oe(r,l.latestValues,l.snapshot?l.snapshot.layoutBox:void 0,h)}return W(this.latestValues)&&oe(r,this.latestValues),r}setTargetDelta(n){this.targetDelta=n,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(n){this.options={...this.options,...n,crossfade:n.crossfade!==void 0?n.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==L.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(n=!1){var r;const a=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=a.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=a.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=a.isSharedProjectionDirty);const l=!!this.resumingFrom||this!==a;if(!(n||l&&this.isSharedProjectionDirty||this.isProjectionDirty||!((r=this.parent)===null||r===void 0)&&r.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:d,layoutId:m}=this.options;if(!(!this.layout||!(d||m))){if(this.resolvedRelativeTargetAt=L.timestamp,!this.targetDelta&&!this.relativeTarget){const p=this.getClosestProjectingParent();p&&p.layout&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=E(),this.relativeTargetOrigin=E(),tt(this.relativeTargetOrigin,this.layout.layoutBox,p.layout.layoutBox),V(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}if(!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=E(),this.targetWithTransforms=E()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),as(this.target,this.relativeTarget,this.relativeParent.target)):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.layoutBox):V(this.target,this.layout.layoutBox),$i(this.target,this.targetDelta)):V(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget)){this.attemptToResolveRelativeTarget=!1;const p=this.getClosestProjectingParent();p&&!!p.resumingFrom==!!this.resumingFrom&&!p.options.layoutScroll&&p.target&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=E(),this.relativeTargetOrigin=E(),tt(this.relativeTargetOrigin,this.target,p.target),V(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}}}getClosestProjectingParent(){if(!(!this.parent||Ot(this.parent.latestValues)||Ui(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}calcProjection(){var n;const r=this.getLead(),a=!!this.resumingFrom||this!==r;let l=!0;if((this.isProjectionDirty||!((n=this.parent)===null||n===void 0)&&n.isProjectionDirty)&&(l=!1),a&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(l=!1),this.resolvedRelativeTargetAt===L.timestamp&&(l=!1),l)return;const{layout:h,layoutId:d}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(h||d))return;V(this.layoutCorrected,this.layout.layoutBox);const m=this.treeScale.x,p=this.treeScale.y;qi(this.layoutCorrected,this.treeScale,this.path,a),r.layout&&!r.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(r.target=r.layout.layoutBox,r.targetWithTransforms=E());const{target:f}=r;if(!f){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(ie(this.prevProjectionDelta.x,this.projectionDelta.x),ie(this.prevProjectionDelta.y,this.projectionDelta.y)),K(this.projectionDelta,this.layoutCorrected,f,this.latestValues),(this.treeScale.x!==m||this.treeScale.y!==p||!de(this.projectionDelta.x,this.prevProjectionDelta.x)||!de(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",f))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(n=!0){var r;if((r=this.options.visualElement)===null||r===void 0||r.scheduleRender(),n){const a=this.getStack();a&&a.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=G(),this.projectionDelta=G(),this.projectionDeltaWithTransform=G()}setAnimationOrigin(n,r=!1){const a=this.snapshot,l=a?a.latestValues:{},h={...this.latestValues},d=G();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!r;const m=E(),p=a?a.source:void 0,f=this.layout?this.layout.source:void 0,g=p!==f,y=this.getStack(),x=!y||y.members.length<=1,T=!!(g&&!x&&this.options.crossfade===!0&&!this.path.some(Qs));this.animationProgress=0;let w;this.mixTargetDelta=A=>{const C=A/1e3;pe(d.x,n.x,C),pe(d.y,n.y,C),this.setTargetDelta(d),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(tt(m,this.layout.layoutBox,this.relativeParent.layout.layoutBox),Zs(this.relativeTarget,this.relativeTargetOrigin,m,C),w&&Is(this.relativeTarget,w)&&(this.isProjectionDirty=!1),w||(w=E()),V(w,this.relativeTarget)),g&&(this.animationValues=h,As(h,l,this.latestValues,C,T,x)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=C},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(n){this.notifyListeners("animationStart"),this.currentAnimation&&this.currentAnimation.stop(),this.resumingFrom&&this.resumingFrom.currentAnimation&&this.resumingFrom.currentAnimation.stop(),this.pendingAnimation&&(et(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=I.update(()=>{lt.hasAnimatedSinceResize=!0,this.currentAnimation=Cs(0,he,{...n,onUpdate:r=>{this.mixTargetDelta(r),n.onUpdate&&n.onUpdate(r)},onStop:()=>{},onComplete:()=>{n.onComplete&&n.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const n=this.getStack();n&&n.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(he),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const n=this.getLead();let{targetWithTransforms:r,target:a,layout:l,latestValues:h}=n;if(!(!r||!a||!l)){if(this!==n&&this.layout&&l&&ni(this.options.animationType,this.layout.layoutBox,l.layoutBox)){a=this.target||E();const d=b(this.layout.layoutBox.x);a.x.min=n.target.x.min,a.x.max=a.x.min+d;const m=b(this.layout.layoutBox.y);a.y.min=n.target.y.min,a.y.max=a.y.min+m}V(r,a),ot(r,h),K(this.projectionDeltaWithTransform,this.layoutCorrected,r,h)}}registerSharedNode(n,r){this.sharedNodes.has(n)||this.sharedNodes.set(n,new ks),this.sharedNodes.get(n).add(r);const l=r.options.initialPromotionConfig;r.promote({transition:l?l.transition:void 0,preserveFollowOpacity:l&&l.shouldPreserveFollowOpacity?l.shouldPreserveFollowOpacity(r):void 0})}isLead(){const n=this.getStack();return n?n.lead===this:!0}getLead(){var n;const{layoutId:r}=this.options;return r?((n=this.getStack())===null||n===void 0?void 0:n.lead)||this:this}getPrevLead(){var n;const{layoutId:r}=this.options;return r?(n=this.getStack())===null||n===void 0?void 0:n.prevLead:void 0}getStack(){const{layoutId:n}=this.options;if(n)return this.root.sharedNodes.get(n)}promote({needsReset:n,transition:r,preserveFollowOpacity:a}={}){const l=this.getStack();l&&l.promote(this,a),n&&(this.projectionDelta=void 0,this.needsReset=!0),r&&this.setOptions({transition:r})}relegate(){const n=this.getStack();return n?n.relegate(this):!1}resetSkewAndRotation(){const{visualElement:n}=this.options;if(!n)return;let r=!1;const{latestValues:a}=n;if((a.z||a.rotate||a.rotateX||a.rotateY||a.rotateZ||a.skewX||a.skewY)&&(r=!0),!r)return;const l={};a.z&&Pt("z",n,l,this.animationValues);for(let h=0;h<vt.length;h++)Pt(`rotate${vt[h]}`,n,l,this.animationValues),Pt(`skew${vt[h]}`,n,l,this.animationValues);n.render();for(const h in l)n.setStaticValue(h,l[h]),this.animationValues&&(this.animationValues[h]=l[h]);n.scheduleRender()}getProjectionStyles(n){var r,a;if(!this.instance||this.isSVG)return;if(!this.isVisible)return Fs;const l={visibility:""},h=this.getTransformTemplate();if(this.needsReset)return this.needsReset=!1,l.opacity="",l.pointerEvents=ft(n==null?void 0:n.pointerEvents)||"",l.transform=h?h(this.latestValues,""):"none",l;const d=this.getLead();if(!this.projectionDelta||!this.layout||!d.target){const g={};return this.options.layoutId&&(g.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,g.pointerEvents=ft(n==null?void 0:n.pointerEvents)||""),this.hasProjected&&!W(this.latestValues)&&(g.transform=h?h({},""):"none",this.hasProjected=!1),g}const m=d.animationValues||d.latestValues;this.applyTransformsToTarget(),l.transform=Ms(this.projectionDeltaWithTransform,this.treeScale,m),h&&(l.transform=h(m,l.transform));const{x:p,y:f}=this.projectionDelta;l.transformOrigin=`${p.origin*100}% ${f.origin*100}% 0`,d.animationValues?l.opacity=d===this?(a=(r=m.opacity)!==null&&r!==void 0?r:this.latestValues.opacity)!==null&&a!==void 0?a:1:this.preserveOpacity?this.latestValues.opacity:m.opacityExit:l.opacity=d===this?m.opacity!==void 0?m.opacity:"":m.opacityExit!==void 0?m.opacityExit:0;for(const g in Rt){if(m[g]===void 0)continue;const{correct:y,applyTo:x,isCSSVariable:T}=Rt[g],w=l.transform==="none"?m[g]:y(m[g],d);if(x){const A=x.length;for(let C=0;C<A;C++)l[x[C]]=w}else T?this.options.visualElement.renderState.vars[g]=w:l[g]=w}return this.options.layoutId&&(l.pointerEvents=d===this?ft(n==null?void 0:n.pointerEvents)||"":"none"),l}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(n=>{var r;return(r=n.currentAnimation)===null||r===void 0?void 0:r.stop()}),this.root.nodes.forEach(ue),this.root.sharedNodes.clear()}}}function Os(t){t.updateLayout()}function $s(t){var e;const i=((e=t.resumeFrom)===null||e===void 0?void 0:e.snapshot)||t.snapshot;if(t.isLead()&&t.layout&&i&&t.hasListeners("didUpdate")){const{layoutBox:s,measuredBox:o}=t.layout,{animationType:u}=t.options,n=i.source!==t.layout.source;u==="size"?B(d=>{const m=n?i.measuredBox[d]:i.layoutBox[d],p=b(m);m.min=s[d].min,m.max=m.min+p}):ni(u,i.layoutBox,s)&&B(d=>{const m=n?i.measuredBox[d]:i.layoutBox[d],p=b(s[d]);m.max=m.min+p,t.relativeTarget&&!t.currentAnimation&&(t.isProjectionDirty=!0,t.relativeTarget[d].max=t.relativeTarget[d].min+p)});const r=G();K(r,s,i.layoutBox);const a=G();n?K(a,t.applyTransform(o,!0),i.measuredBox):K(a,s,i.layoutBox);const l=!ti(r);let h=!1;if(!t.resumeFrom){const d=t.getClosestProjectingParent();if(d&&!d.resumeFrom){const{snapshot:m,layout:p}=d;if(m&&p){const f=E();tt(f,i.layoutBox,m.layoutBox);const g=E();tt(g,s,p.layoutBox),ei(f,g)||(h=!0),d.options.layoutRoot&&(t.relativeTarget=g,t.relativeTargetOrigin=f,t.relativeParent=d)}}}t.notifyListeners("didUpdate",{layout:s,snapshot:i,delta:a,layoutDelta:r,hasLayoutChanged:l,hasRelativeLayoutChanged:h})}else if(t.isLead()){const{onExitComplete:s}=t.options;s&&s()}t.options.transition=void 0}function Us(t){t.parent&&(t.isProjecting()||(t.isProjectionDirty=t.parent.isProjectionDirty),t.isSharedProjectionDirty||(t.isSharedProjectionDirty=!!(t.isProjectionDirty||t.parent.isProjectionDirty||t.parent.isSharedProjectionDirty)),t.isTransformDirty||(t.isTransformDirty=t.parent.isTransformDirty))}function qs(t){t.isProjectionDirty=t.isSharedProjectionDirty=t.isTransformDirty=!1}function zs(t){t.clearSnapshot()}function ue(t){t.clearMeasurements()}function _s(t){t.isLayoutDirty=!1}function Ws(t){const{visualElement:e}=t.options;e&&e.getProps().onBeforeLayoutMeasure&&e.notify("BeforeLayoutMeasure"),t.resetTransform()}function me(t){t.finishAnimation(),t.targetDelta=t.relativeTarget=t.target=void 0,t.isProjectionDirty=!0}function Gs(t){t.resolveTargetDelta()}function Hs(t){t.calcProjection()}function Xs(t){t.resetSkewAndRotation()}function Ys(t){t.removeLeadSnapshot()}function pe(t,e,i){t.translate=D(e.translate,0,i),t.scale=D(e.scale,1,i),t.origin=e.origin,t.originPoint=e.originPoint}function fe(t,e,i,s){t.min=D(e.min,i.min,s),t.max=D(e.max,i.max,s)}function Zs(t,e,i,s){fe(t.x,e.x,i.x,s),fe(t.y,e.y,i.y,s)}function Qs(t){return t.animationValues&&t.animationValues.opacityExit!==void 0}const Js={duration:.45,ease:[.4,0,.1,1]},ye=t=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(t),ge=ye("applewebkit/")&&!ye("chrome/")?Math.round:X;function xe(t){t.min=ge(t.min),t.max=ge(t.max)}function Ks(t){xe(t.x),xe(t.y)}function ni(t,e,i){return t==="position"||t==="preserve-aspect"&&!rs(ce(e),ce(i),.2)}function tn(t){var e;return t!==t.root&&((e=t.scroll)===null||e===void 0?void 0:e.wasRoot)}const en=si({attachResizeListener:(t,e)=>Et(t,"resize",e),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}),checkIsScrollRoot:()=>!0}),jt={current:void 0},oi=si({measureScroll:t=>({x:t.scrollLeft,y:t.scrollTop}),defaultParent:()=>{if(!jt.current){const t=new en({});t.mount(window),t.setOptions({layoutScroll:!0}),jt.current=t}return jt.current},resetTransform:(t,e)=>{t.style.transform=e!==void 0?e:"none"},checkIsScrollRoot:t=>window.getComputedStyle(t).position==="fixed"}),sn={pan:{Feature:xs},drag:{Feature:gs,ProjectionNode:oi,MeasureLayout:Qe}},nn={layout:{ProjectionNode:oi,MeasureLayout:Qe}},on=xi({...Gi,...Wi,...sn,...nn},_i),ve=Qi(on),rn=P.div`
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
`,an=P(rn)`
  width: 100%;

  @media (min-width: 768px) {
    width: 45%;
    max-width: fit-content;
  }
`,ri=P.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  font-style: ${({theme:t})=>t.font};
  width: 100%;
  z-index: 12;
`;function $({className:t,children:e,style:i}){const s=()=>{};return c.jsx(ri,{onChange:s,className:t,style:i,children:e})}function Y({className:t,isLongOnMobile:e,children:i,style:s}){return e?c.jsx(an,{className:t,style:{...s},children:i}):c.jsx(ri,{className:t,children:i})}const ln=P.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  max-width: 100vw;

  @media (min-width: 768px) {
    flex-wrap: nowrap;
    max-width: 100%;
  }
`;function Dt({children:t}){return c.jsx(ln,{className:"address-box",children:t})}Dt.propTypes={children:ht.node.isRequired};function cn({invoice:t}){var n,r,a,l,h,d;const e=mt(),{formState:{errors:i},register:s}=F(),{isDraft:o}=U(),u=c.jsxs($,{style:{width:e<768?"100%":""},className:"client-country",children:[c.jsx(M,{htmlFor:"clientCountry",style:{color:i.clientCountry?"#EC5757":""},children:"Country"}),c.jsx(Fe,{id:"clientCountry",$long:!1,style:{border:i!=null&&i.clientCountry?"1px solid #EC5757":"",width:e<768?"100%":""},type:"text",defaultValue:t?(n=t==null?void 0:t.clientAddress)==null?void 0:n.country:"",...s("clientCountry",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return c.jsxs(c.Fragment,{children:[c.jsxs($,{className:"client-name",children:[c.jsx(M,{htmlFor:"clientName",style:{color:i.clientName?"#EC5757":""},children:"Client's Name"}),((r=i.clientName)==null?void 0:r.type)==="required"&&c.jsx(Lt,{children:"can't be empty"}),c.jsx(Ct,{id:"clientName",$long:!0,style:{border:i.clientName?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientName:"",...s("clientName",{required:!o})})]}),c.jsxs($,{className:"client-email",children:[c.jsx(M,{htmlFor:"clientEmail",style:{color:i.clientEmail?"#EC5757":""},children:"Client's Email"}),((a=i.clientEmail)==null?void 0:a.type)==="pattern"&&c.jsx(Lt,{style:{position:"absolute",top:"-8px"},children:"Invalid email"}),c.jsx(Ct,{id:"clientEmail",$long:!0,style:{border:i.clientEmail?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientEmail:"",...s("clientEmail",{required:!o,pattern:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/})})]}),c.jsxs($,{className:"client-street-address",children:[c.jsx(M,{htmlFor:"clientStreetAddress",style:{color:i.clientStreetAddress?"#EC5757":""},children:"Street Address"}),c.jsx(Ne,{id:"clientStreetAddress",style:{border:i.clientStreetAddress?"1px solid #EC5757":""},defaultValue:t?(l=t==null?void 0:t.clientAddress)==null?void 0:l.street:"",...s("clientStreetAddress",{required:!o})})]}),c.jsxs(Dt,{children:[c.jsxs(Y,{className:"clientCity",children:[c.jsx(M,{htmlFor:"clientCity",style:{color:i.clientCity?"#EC5757":""},children:"City"}),c.jsx(ut,{id:"clientCity",style:{border:i.clientCity?"1px solid #EC5757":""},type:"text",defaultValue:t?(h=t==null?void 0:t.clientAddress)==null?void 0:h.city:"",...s("clientCity",{required:!o,pattern:/[\w ]*/i,maxLength:30})})]}),c.jsxs(Y,{className:"clientPostalCode",children:[c.jsx(M,{htmlFor:"clientPostalCode",style:{color:i.clientPostalCode?"#EC5757":""},children:"Post Code"}),c.jsx(ut,{id:"clientPostalCode",style:{border:i.clientPostalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(d=t==null?void 0:t.clientAddress)==null?void 0:d.postCode:"",...s("clientPostalCode",{required:!o,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]}),e<768&&c.jsx($,{className:"client-country",children:u}),e>=768&&c.jsx(Y,{className:"client-country",children:u})]})]})}const dn=P.div`
  display: contents;
  width: 100%;
  justify-content: space-between;

  @media (min-width: 350px) {
    display: flex;
  }
  @media (min-width: 600px) {
    display: contents;
  }
`;function hn({invoice:t}){var n,r,a,l;const e=mt(),{formState:{errors:i},register:s}=F(),{isDraft:o}=U(),u=c.jsxs($,{style:{width:e<768?"100%":""},className:"company-country",children:[c.jsx(M,{htmlFor:"CompanyCountry",style:{color:i!=null&&i.country?"#EC5757":""},children:"Country"}),c.jsx(Fe,{id:"CompanyCountry",type:"text",style:{border:i!=null&&i.country?"1px solid #EC5757":"",width:e<768?"100%":""},defaultValue:t?(n=t==null?void 0:t.senderAddress)==null?void 0:n.country:"",...s("country",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return c.jsxs(c.Fragment,{children:[c.jsxs($,{className:"company-street-address",children:[c.jsx(M,{htmlFor:"streetAddress",style:{color:i!=null&&i.streetAddress?"#EC5757":""},children:"Street Address"}),c.jsx(Ne,{id:"streetAddress",style:{border:i!=null&&i.streetAddress?"1px solid #EC5757":""},defaultValue:t?(r=t==null?void 0:t.senderAddress)==null?void 0:r.street:"",...s("streetAddress",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:50})})]}),c.jsxs(Dt,{children:[c.jsxs(dn,{children:[c.jsxs(Y,{className:"company-city",children:[c.jsx(M,{htmlFor:"companyCity",style:{color:i!=null&&i.city?"#EC5757":""},children:"City"}),c.jsx(ut,{id:"companyCity",style:{border:i!=null&&i.city?"1px solid #EC5757":""},defaultValue:t?(a=t==null?void 0:t.senderAddress)==null?void 0:a.city:"",type:"text",...s("city",{required:!o,pattern:/[\w ]*/i,maxLength:30})})]}),c.jsxs(Y,{style:{justifySelf:"flex-end"},className:"company-postal-code",children:[c.jsx(M,{htmlFor:"CompanyPostalCode",style:{color:i!=null&&i.postalCode?"#EC5757":""},children:"Post Code"}),c.jsx(ut,{id:"CompanyPostalCode",style:{border:i!=null&&i.postalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(l=t==null?void 0:t.senderAddress)==null?void 0:l.postCode:"",...s("postalCode",{required:!o,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]})]}),e<768&&c.jsx($,{className:"company-country-container",children:u}),e>=768&&c.jsx(Y,{className:"company-country-container",children:u})]})]})}function un({invoice:t}){const{formState:{errors:e},register:i}=F(),{isDraft:s}=U();return c.jsx(c.Fragment,{children:c.jsxs($,{className:"project-description",children:[c.jsx(M,{htmlFor:"projectDescription",style:{color:e.projectDescription?"#EC5757":""},children:"Project Description"}),c.jsx(Ct,{id:"projectDescription",type:"text",defaultValue:t==null?void 0:t.description,...i("projectDescription",{required:!s}),style:{border:e.projectDescription?"1px solid #EC5757":""}})]})})}const Pe=P.div`
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
`,ai=P.input`
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
`,mn=P(ai)`
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
`,li=P(ai).attrs({pattern:"\\d+"})`
  min-width: 60px;
  width: auto;
  max-width: 64px;
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
  flex-grow: 1;

  @media (min-width: 325px) {
    max-width: 64px;
    min-width: 0;
  }

  @media (min-width: 400px) {
    max-width: 100px;
  }

  @media (min-width: 600px) {
    text-align: center;
    width: 46px;
    max-width: 46px;
    display: inline;
    padding: 0;
  }
`,pn=P(li).attrs({pattern:"[0-9.]*"})`
  width: 80px;
  width: fit-content;
  padding-left: 1.25rem;
  text-align: left;

  @media (min-width: 325px) {
    width: auto;
    min-width: 100px;
    max-width: 120px;
  }

  @media (min-width: 400px) {
    max-width: 150px;
  }

  @media (min-width: 600px) {
    width: 100px;
    text-align: center;
    padding: 0;
  }
`,je=P.p`
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
`;P.div`
  display: none;

  @media (min-width: 600px) {
    display: contents;
  }
`;P.p`
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
`;const fn=P.div`
  display: grid;
  grid-template: 1fr / 220px 62px 116px 61px 49px;
`,Ce=P.svg`
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
`,Q=P.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: fit-content;
  width: fit-content;
`,yn=P(Q)`
  text-align: right;

  @media (min-width: 325px) {
    align-items: flex-start;
    text-align: initial;
  }
`,gn=P.div`
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
`,Te=c.jsx("path",{d:"M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z",fillRule:"nonzero",className:"deleteIconPath",tabIndex:0}),xn=P.button`
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
`,$n=P.svg`
  width: 11px;
  height: 11px;
`,vn=P.p`
  color: ${({theme:t})=>t.newItemText};
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  text-align: center;
  letter-spacing: -0.25px;
  margin-left: 0.25rem;
`;function Pn({items:t,append:e}){const{clearErrors:i}=F(),{formState:{submitCount:s}}=Ei(),o=()=>{e({id:"",name:"",quantity:"",price:"",total:""}),i("itemsError")};return c.jsx(xn,{onClick:o,type:"button",style:{border:s>0&&t.length===0?"1px solid red":"1px solid transparent"},children:c.jsx(vn,{children:"+ Add New Item"})})}const jn=P.div`
  display: grid;
  width: 100%;
  border-radius: 8px;
  grid-template-rows: auto;
  background-color: ${({theme:t})=>t.formBackground};
`,Cn=P.div`
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
`,H=P.label`
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
`,ct=P(H)`
  justify-self: start;

  @media (min-width: 600px) {
    &.mobile-only-label {
      display: none;
    }
  }
`,Tn=P.div`
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
`,wn=P.h1`
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
`;function we({index:t,invoice:e}){var r,a,l,h,d,m,p;const{register:i,formState:s}=F(),{errors:o}=s,{isDraft:u}=U(),n=()=>{var f,g,y;return((y=(g=(f=o==null?void 0:o.items)==null?void 0:f[t])==null?void 0:g.quantity)==null?void 0:y.type)==="pattern"};return c.jsxs("div",{style:{position:"relative"},children:[c.jsx(li,{...i(`items[${t}].quantity`,{required:!u,max:1e3,pattern:{value:/^[0-9]+$/,message:"Only numbers are allowed"}}),placeholder:"0",inputMode:"numeric",type:"text",style:{border:Array.isArray(o.items)&&((a=(r=o==null?void 0:o.items)==null?void 0:r[t])!=null&&a.quantity)?"1px solid #EC5757":""},defaultValue:e?(h=(l=e==null?void 0:e.items)==null?void 0:l[t])==null?void 0:h.quantity:0}),Array.isArray(o.items)&&n()&&c.jsx("span",{style:{position:"absolute",top:"100%",left:"0",marginTop:"4px",padding:"6px 8px",backgroundColor:"#f8d7da",color:"#721c24",border:"1px solid #f5c6cb",borderRadius:"4px",whiteSpace:"pre-line",textWrap:"nowrap"},children:(p=(m=(d=o==null?void 0:o.items)==null?void 0:d[t])==null?void 0:m.quantity)==null?void 0:p.message})]})}function Ee({index:t,invoice:e}){var r,a,l,h,d,m,p;const{register:i,formState:s}=F(),{errors:o}=s,{isDraft:u}=U(),n=()=>{var f,g,y;return((y=(g=(f=o==null?void 0:o.items)==null?void 0:f[t])==null?void 0:g.price)==null?void 0:y.type)==="pattern"};return c.jsxs("div",{style:{position:"relative"},children:[c.jsx(pn,{...i(`items[${t}].price`,{required:!u,max:1e5,pattern:{value:/^\$?\d+(,\d{3})*\.?[0-9]?[0-9]?$/,message:"Only numbers are allowed - max 2 decimal places"}}),placeholder:"0.00",inputMode:"numeric",type:"text",defaultValue:e?(a=(r=e==null?void 0:e.items)==null?void 0:r[t])==null?void 0:a.price:0,style:{border:Array.isArray(o.items)&&((h=(l=o==null?void 0:o.items)==null?void 0:l[t])!=null&&h.price)?"1px solid #EC5757":""}}),Array.isArray(o.items)&&n()&&c.jsx("div",{style:{position:"absolute",top:"100%",left:"0",marginTop:"4px",padding:"6px 8px",backgroundColor:"#f8d7da",color:"#721c24",border:"1px solid #f5c6cb",borderRadius:"4px",whiteSpace:"prewrap"},children:(p=(m=(d=o==null?void 0:o.items)==null?void 0:d[t])==null?void 0:m.price)==null?void 0:p.message})]})}function De({index:t,invoice:e}){var n,r,a,l;const{register:i,formState:s}=F(),{errors:o}=s,{isDraft:u}=U();return c.jsx(mn,{...i(`items[${t}].name`,{required:!u}),placeholder:"Item name",defaultValue:e?(r=(n=e==null?void 0:e.items)==null?void 0:n[t])==null?void 0:r.name:"",type:"text",style:{border:Array.isArray(o.items)&&((l=(a=o==null?void 0:o.items)==null?void 0:a[t])!=null&&l.name)?"1px solid #EC5757":""}})}function ci({invoice:t,isEditOpen:e}){const{formState:i,watch:s,clearErrors:o,setError:u,reset:n}=F(),{fields:r,remove:a,append:l}=Me({name:"items",rules:{required:!0,minLength:1}}),{isSubmitting:h}=i,d=s("items",[]),m=mt(),p=v.useRef(!0);v.useEffect(()=>{!r.length&&!p.current?u("myFieldArray",{type:"required",message:"At least one item is required"}):o("myFieldArray"),p.current&&(p.current=!1)},[r,h]),v.useEffect(()=>{localStorage.getItem("cachedEditInvoiceForm")||t&&e&&n({items:t.items.map(x=>({id:x.id,name:x.name,quantity:x.quantity,price:x.price,total:x.total}))})},[t,e,n]);const f=y=>{var x,T;return c.jsxs(Pe,{children:[c.jsxs(Q,{style:{width:"100%",marginBottom:"1.5rem"},children:[c.jsx(ct,{style:{marginBottom:"1rem"},children:"Item Name"}),c.jsx(De,{index:y,invoice:t})]}),c.jsxs(gn,{children:[c.jsxs(Q,{children:[c.jsx(H,{style:{marginBottom:"0.625rem"},children:"Qty."}),c.jsx(we,{index:y,invoice:t})]}),c.jsxs(Q,{children:[c.jsx(H,{style:{marginBottom:"0.625rem"},children:"Price"}),c.jsx(Ee,{index:y,invoice:t})]}),c.jsxs(yn,{style:{width:"fit-content"},children:[c.jsx(H,{style:{marginBottom:"0.625rem"},children:"Total"}),c.jsx(je,{children:(Number((x=d==null?void 0:d[y])==null?void 0:x.quantity)*Number((T=d==null?void 0:d[y])==null?void 0:T.price)).toFixed(2)})]})]}),c.jsxs(Q,{children:[c.jsx(H,{style:{marginBottom:"0.625rem"},children:"  "}),c.jsx(Ce,{name:"removeButton",onClick:()=>a(y),children:Te})]})]})},g=y=>{var x,T;return c.jsx(Pe,{children:c.jsxs(fn,{children:[c.jsx(De,{index:y,invoice:t}),c.jsx(we,{index:y,invoice:t}),c.jsx(Ee,{index:y,invoice:t}),c.jsx(je,{children:(Number((x=d==null?void 0:d[y])==null?void 0:x.quantity)*Number((T=d==null?void 0:d[y])==null?void 0:T.price)).toFixed(2)}),c.jsx(Ce,{name:"removeButton",onClick:()=>a(y),children:Te})]})})};return c.jsxs(c.Fragment,{children:[c.jsx("ul",{style:{listStyle:"none",marginLeft:"0",paddingLeft:0},children:r.map((y,x)=>c.jsx("li",{"data-testid":"invoice-item",children:c.jsxs("div",{children:[m<600&&f(x),m>=600&&g(x)]})},y.id))}),c.jsx(Pn,{append:l,items:t?t.items:[]})]})}ci.propTypes={isDraft:ht.bool.isRequired,isEditOpen:ht.bool};const En=({className:t})=>c.jsxs(Cn,{className:t,children:[c.jsx(ct,{children:"Item Name"}),c.jsx(ct,{children:"Qty."}),c.jsx(ct,{children:"Price"}),c.jsx(H,{children:"Total"})]});function Dn({invoice:t,isEditOpen:e=!1}){const{isDraft:i}=U();return c.jsxs(jn,{"data-testid":"items-container",children:[c.jsx(wn,{children:"Item List"}),c.jsx(En,{className:"desktop-only-label"}),c.jsx(Tn,{children:c.jsx(ci,{isDraft:i,invoice:t,isEditOpen:e})})]})}const Sn={items:[{name:"",price:0,quantity:0,total:0,id:""}],country:"",streetAddress:"",city:"",postalCode:"",clientCountry:"",clientName:"",clientEmail:"",clientStreetAddress:"",clientCity:"",clientPostalCode:"",projectDescription:""},Se=t=>{const{watch:e,getValues:i,reset:s}=F(),o=e(),[u,n]=v.useState(!0);v.useEffect(()=>{u&&localStorage.setItem(t,JSON.stringify(o))},[o,u,t]);const r=()=>{const l=i();localStorage.setItem(t,JSON.stringify(l))},a=()=>{localStorage.removeItem(t),n(!1),setTimeout(()=>n(!0),1e3)};return v.useEffect(()=>{const l=localStorage.getItem(t);l&&s(JSON.parse(l))},[s,t]),{cacheFormData:r,clearCache:a}},Un=()=>{const{id:t}=vi(),{startDate:e,setIsDraft:i,setIsNewInvoiceOpen:s,selectedPaymentOption:o,setSelectedPaymentOption:u,methods:n}=U(),{control:r,trigger:a,reset:l,watch:h,setError:d,clearErrors:m,getValues:p}=n,{replace:f}=Me({control:r,name:"items"}),g=h(),y=Se("cachedEditForm"),x=Se("cachedNewInvoiceForm"),[T]=kt(ji,{refetchQueries:[{query:Pi}],onError:j=>{console.error(j)}}),[w]=kt(Ti,{update:(j,{data:{editInvoice:z}})=>{j.writeQuery({query:Ci,variables:{getInvoiceById:z.id},data:{getInvoiceById:z}})},onError:j=>{console.error(j)}}),A=()=>{x.clearCache(),u(1),l(Sn),m(),s(!1)},C=async j=>{if(wi.flushSync(()=>i(!1)),j=p(),!j.items){d("items",{type:"custom",message:"An item must be added"});return}if(await a()){const R=yt(j,e,o);R.items=R.items.map(k=>({...k,quantity:Number(k.quantity),price:Number(k.price)})),R.status="pending";try{await T({variables:{...R}}),A(),f([{id:It(),name:"",quantity:0,price:0,total:0}])}catch(k){console.error(k)}}},S=async()=>{var At;const j=n.formState.errors,R=di(j).filter(N=>N!=="required");if(R.length>0){console.error("Draft submission blocked due to errors:",R),An(j,"required"),l(void 0,{keepValues:!0});for(const N in j)(At=j[N])!=null&&At.type&&d(N,{type:j[N].type,message:j[N].message});j.items&&(Array.isArray(j.items)?j.items:Object.values(j.items)).forEach((it,ui)=>{it&&typeof it=="object"&&Object.keys(it).forEach(bt=>{const _=it[bt];console.log("errorDetail",_),_!=null&&_.type&&d(`items[${ui}].${bt}`,{type:_.type,message:_.message})})});return}m();const k=p();k.items||(k.items=[{id:"",name:"",quantity:0,price:0,total:0}]);const St=yt(k,e,o);St.status="draft";try{await T({variables:{...St}}),A(),f([{id:It(),name:"",quantity:0,price:0,total:0}])}catch(N){console.error(N)}},q=async j=>{if(await a()){const R=yt(j,e,o);R.id=String(t),R.status="pending";try{await w({variables:{...R}}),y.clearCache(),s(!1)}catch(k){console.error(k)}}};return v.useEffect(()=>{g.items?m("items"):d("items",{type:"custom",message:"An item must be added"})},[g.items,d]),{methods:n,onSubmit:C,onSubmitDraft:S,onSubmitUpdate:q}},di=t=>{var i;const e=[];if(!t)return[];for(const s in t)(i=t[s])!=null&&i.type&&e.push(t[s].type);return t.items&&t.items instanceof Array&&t.items.forEach(s=>{s&&typeof s=="object"&&Object.keys(s).forEach(o=>{const u=s[o];u!=null&&u.type&&e.push(u.type)})}),Array.from(new Set(e))};function An(t,e){var i;if(t){for(const s in t)((i=t[s])==null?void 0:i.type)===e&&delete t[s];t.items&&t.items.forEach(s=>{Object.keys(s).forEach(o=>{var u;((u=s[o])==null?void 0:u.type)===e&&delete s[o]})})}}function hi({isEditOpen:t}){const{formState:{errors:e}}=F();return c.jsxs(Di,{children:[c.jsx(Vt,{style:{visibility:di(e).includes("required")&&t?"visible":"hidden"},children:"- All fields must be added"}),c.jsx(Vt,{style:{visibility:e.myFieldArray&&t?"visible":"hidden"},children:"- An item must be added"})]})}hi.propTypes={isEditOpen:ht.bool.isRequired};const bn=P.form`
  position: relative;
  z-index: 1;
  padding-bottom: 6rem;

  @media (min-width: 325px) {
    padding-bottom: 0;
  }
`,Rn=Ie.lazy(()=>ke(()=>import("./NewInvoiceBottomMenu-CGui52_A.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9]))),Ln=Ie.lazy(()=>ke(()=>import("./DateAndPayment-Czw4Th08.js").then(t=>t.D),__vite__mapDeps([10,1,2,6,3,7]))),qn=()=>{const{isNewInvoiceOpen:t}=U();return c.jsxs(c.Fragment,{children:[c.jsx(Si,{children:"New Invoice"}),c.jsxs(bn,{style:{zIndex:1,position:"relative"},children:[c.jsx(Bt,{children:"Bill From"}),c.jsx(hn,{}),c.jsx(Bt,{children:"Bill To"}),c.jsx(cn,{}),c.jsx(Ln,{}),c.jsx(un,{}),c.jsx(Dn,{}),c.jsx(hi,{isEditOpen:t}),c.jsx(v.Suspense,{fallback:c.jsx("div",{children:"Loading..."}),children:c.jsx(Rn,{closeText:"Discard",justifyCancel:"flex-start"})})]})]})},zn=({children:t})=>{const e=mt();let i=700;e<=616?i=e:e<=768?i=616:i=700;const s={hidden:{x:`${-i}px`},visible:{x:"0"},exit:{x:`${-i}px`}};return c.jsxs(c.Fragment,{children:[c.jsx(ve.div,{initial:{opacity:0},animate:{opacity:.5},exit:{opacity:0},transition:{duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#000",zIndex:1e3,cursor:"pointer"}},"overlay"),c.jsx(ve.div,{variants:s,initial:"hidden",animate:"visible",exit:"exit",transition:{type:"tween",duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:`${i}px`,height:"100%",minHeight:"100vh",color:"#ecf0f1",padding:"20px",zIndex:1001,boxShadow:"2px 0 5px rgba(0,0,0,0.3)"},children:t},"sidebar")]})};export{Nn as A,hn as C,un as D,Dn as E,bn as F,qn as I,zn as S,cn as a,hi as b,Un as c,Y as d,$n as e,Se as u};
