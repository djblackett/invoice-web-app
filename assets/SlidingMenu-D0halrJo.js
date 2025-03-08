const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/NewInvoiceBottomMenu-DT31go4U.js","assets/index-lFVNx2pn.js","assets/index-BgypsdHM.css","assets/InvoiceStatus-BJDuQ3FI.js","assets/CancelButton-DxT8SWiv.js","assets/NewInvoiceBottomMenuStyles-CtQEzfs0.js","assets/editPageStyles-Bd0hSPyG.js","assets/utilityFunctions-CaS5rWOM.js","assets/ReactToastify-BIBqiZBK.js","assets/ReactToastify-CZOjr4-t.css","assets/create-visual-element-CGFK4PtV.js","assets/DateAndPayment-BkT9FPyq.js"])))=>i.map(i=>d[i]);
import{a as v,T as pi,j as c,U as be,V as Re,W as fi,X as Le,Y as R,Z as I,a0 as it,a1 as Ve,a2 as nt,a3 as ht,a4 as G,a5 as Ie,a6 as yi,a7 as gi,a8 as Be,a9 as xi,aa as ft,ab as yt,ac as Lt,ad as vi,d as P,b as pt,l as Pi,g as ji,ae as Ci,G as wi,af as Ti,Q as Ei,ag as Di,R as ke,f as Me}from"./index-lFVNx2pn.js";import{P as ut,e as M,c as U,f as Si,g as Fe}from"./InvoiceStatus-BJDuQ3FI.js";import{L as k,C as Ne,a as Vt,I as wt,S as Oe,A as mt,b as Ai,c as It,E as bi,B as Bt}from"./editPageStyles-Bd0hSPyG.js";import{c as gt,v as kt}from"./utilityFunctions-CaS5rWOM.js";import{u as Mt}from"./ReactToastify-BIBqiZBK.js";import{i as O,b as Dt,d as Ri,e as Li,f as $e,p as Vi,s as Ii,m as Bi,h as D,j as Tt,k as E,l as ki,n as Mi,o as Fi,q as Ft,r as Ue,F as qe,t as Nt,u as Ni,v as ze,w as _e,x as We,y as Oi,z as Ot,S as $i,A as Ui,B as _,C as ot,D as rt,E as $t,G as qi,H as zi,I as _i,J as W,K as Wi,c as Hi,g as Gi,a as Xi}from"./create-visual-element-CGFK4PtV.js";class Yi extends v.Component{getSnapshotBeforeUpdate(e){const i=this.props.childRef.current;if(i&&e.isPresent&&!this.props.isPresent){const s=i.offsetParent,o=s instanceof HTMLElement&&s.offsetWidth||0,u=this.props.sizeRef.current;u.height=i.offsetHeight||0,u.width=i.offsetWidth||0,u.top=i.offsetTop,u.left=i.offsetLeft,u.right=o-u.width-u.left}return null}componentDidUpdate(){}render(){return this.props.children}}function Zi({children:t,isPresent:e,anchorX:i}){const s=v.useId(),o=v.useRef(null),u=v.useRef({width:0,height:0,top:0,left:0,right:0}),{nonce:n}=v.useContext(pi);return v.useInsertionEffect(()=>{const{width:r,height:a,top:l,left:h,right:d}=u.current;if(e||!o.current||!r||!a)return;const m=i==="left"?`left: ${h}`:`right: ${d}`;o.current.dataset.motionPopId=s;const p=document.createElement("style");return n&&(p.nonce=n),document.head.appendChild(p),p.sheet&&p.sheet.insertRule(`
          [data-motion-pop-id="${s}"] {
            position: absolute !important;
            width: ${r}px !important;
            height: ${a}px !important;
            ${m}px !important;
            top: ${l}px !important;
          }
        `),()=>{document.head.removeChild(p)}},[e]),c.jsx(Yi,{isPresent:e,childRef:o,sizeRef:u,children:v.cloneElement(t,{ref:o})})}const Qi=({children:t,initial:e,isPresent:i,onExitComplete:s,custom:o,presenceAffectsLayout:u,mode:n,anchorX:r})=>{const a=be(Ji),l=v.useId(),h=v.useCallback(m=>{a.set(m,!0);for(const p of a.values())if(!p)return;s&&s()},[a,s]),d=v.useMemo(()=>({id:l,initial:e,isPresent:i,custom:o,onExitComplete:h,register:m=>(a.set(m,!1),()=>a.delete(m))}),u?[Math.random(),h]:[i,h]);return v.useMemo(()=>{a.forEach((m,p)=>a.set(p,!1))},[i]),v.useEffect(()=>{!i&&!a.size&&s&&s()},[i]),n==="popLayout"&&(t=c.jsx(Zi,{isPresent:i,anchorX:r,children:t})),c.jsx(Re.Provider,{value:d,children:t})};function Ji(){return new Map}function He(t=!0){const e=v.useContext(Re);if(e===null)return[!0,null];const{isPresent:i,onExitComplete:s,register:o}=e,u=v.useId();v.useEffect(()=>{t&&o(u)},[t]);const n=v.useCallback(()=>t&&s&&s(u),[u,s,t]);return!i&&s?[!1,n]:[!0]}const at=t=>t.key||"";function Ut(t){const e=[];return v.Children.forEach(t,i=>{v.isValidElement(i)&&e.push(i)}),e}const $n=({children:t,custom:e,initial:i=!0,onExitComplete:s,presenceAffectsLayout:o=!0,mode:u="sync",propagate:n=!1,anchorX:r="left"})=>{const[a,l]=He(n),h=v.useMemo(()=>Ut(t),[t]),d=n&&!a?[]:h.map(at),m=v.useRef(!0),p=v.useRef(h),f=be(()=>new Map),[g,y]=v.useState(h),[x,T]=v.useState(h);fi(()=>{m.current=!1,p.current=h;for(let C=0;C<x.length;C++){const S=at(x[C]);d.includes(S)?f.delete(S):f.get(S)!==!0&&f.set(S,!1)}},[x,d.length,d.join("-")]);const w=[];if(h!==g){let C=[...h];for(let S=0;S<x.length;S++){const q=x[S],Y=at(q);d.includes(Y)||(C.splice(S,0,q),w.push(q))}return u==="wait"&&w.length&&(C=w),T(Ut(C)),y(h),null}const{forceRender:b}=v.useContext(Le);return c.jsx(c.Fragment,{children:x.map(C=>{const S=at(C),q=n&&!a?!1:h===x||d.includes(S),Y=()=>{if(f.has(S))f.set(S,!0);else return;let j=!0;f.forEach(z=>{z||(j=!1)}),j&&(b==null||b(),T(p.current),n&&(l==null||l()),s&&s())};return c.jsx(Qi,{isPresent:q,initial:!m.current||i?void 0:!1,custom:e,presenceAffectsLayout:o,mode:u,onExitComplete:q?void 0:Y,anchorX:r,children:C},S)})})};function Ki(t){if(typeof Proxy>"u")return t;const e=new Map,i=(...s)=>t(...s);return new Proxy(i,{get:(s,o)=>o==="create"?t:(e.has(o)||e.set(o,t(o)),e.get(o))})}function ts(t){return t==="x"||t==="y"?O[t]?null:(O[t]=!0,()=>{O[t]=!1}):O.x||O.y?null:(O.x=O.y=!0,()=>{O.x=O.y=!1})}function K(t,e,i,s){return Dt(t,e,Ri(i),s)}const qt=(t,e)=>Math.abs(t-e);function es(t,e){const i=qt(t.x,e.x),s=qt(t.y,e.y);return Math.sqrt(i**2+s**2)}class Ge{constructor(e,i,{transformPagePoint:s,contextWindow:o,dragSnapToOrigin:u=!1}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const d=vt(this.lastMoveEventInfo,this.history),m=this.startEvent!==null,p=es(d.offset,{x:0,y:0})>=3;if(!m&&!p)return;const{point:f}=d,{timestamp:g}=R;this.history.push({...f,timestamp:g});const{onStart:y,onMove:x}=this.handlers;m||(y&&y(this.lastMoveEvent,d),this.startEvent=this.lastMoveEvent),x&&x(this.lastMoveEvent,d)},this.handlePointerMove=(d,m)=>{this.lastMoveEvent=d,this.lastMoveEventInfo=xt(m,this.transformPagePoint),I.update(this.updatePoint,!0)},this.handlePointerUp=(d,m)=>{this.end();const{onEnd:p,onSessionEnd:f,resumeAnimation:g}=this.handlers;if(this.dragSnapToOrigin&&g&&g(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const y=vt(d.type==="pointercancel"?this.lastMoveEventInfo:xt(m,this.transformPagePoint),this.history);this.startEvent&&p&&p(d,y),f&&f(d,y)},!Li(e))return;this.dragSnapToOrigin=u,this.handlers=i,this.transformPagePoint=s,this.contextWindow=o||window;const n=$e(e),r=xt(n,this.transformPagePoint),{point:a}=r,{timestamp:l}=R;this.history=[{...a,timestamp:l}];const{onSessionStart:h}=i;h&&h(e,vt(r,this.history)),this.removeListeners=Vi(K(this.contextWindow,"pointermove",this.handlePointerMove),K(this.contextWindow,"pointerup",this.handlePointerUp),K(this.contextWindow,"pointercancel",this.handlePointerUp))}updateHandlers(e){this.handlers=e}end(){this.removeListeners&&this.removeListeners(),it(this.updatePoint)}}function xt(t,e){return e?{point:e(t.point)}:t}function zt(t,e){return{x:t.x-e.x,y:t.y-e.y}}function vt({point:t},e){return{point:t,delta:zt(t,Xe(e)),offset:zt(t,is(e)),velocity:ss(e,.1)}}function is(t){return t[0]}function Xe(t){return t[t.length-1]}function ss(t,e){if(t.length<2)return{x:0,y:0};let i=t.length-1,s=null;const o=Xe(t);for(;i>=0&&(s=t[i],!(o.timestamp-s.timestamp>Ii(e)));)i--;if(!s)return{x:0,y:0};const u=Bi(o.timestamp-s.timestamp);if(u===0)return{x:0,y:0};const n={x:(o.x-s.x)/u,y:(o.y-s.y)/u};return n.x===1/0&&(n.x=0),n.y===1/0&&(n.y=0),n}const Ye=1e-4,ns=1-Ye,os=1+Ye,Ze=.01,rs=0-Ze,as=0+Ze;function A(t){return t.max-t.min}function ls(t,e,i){return Math.abs(t-e)<=i}function _t(t,e,i,s=.5){t.origin=s,t.originPoint=D(e.min,e.max,t.origin),t.scale=A(i)/A(e),t.translate=D(i.min,i.max,t.origin)-t.originPoint,(t.scale>=ns&&t.scale<=os||isNaN(t.scale))&&(t.scale=1),(t.translate>=rs&&t.translate<=as||isNaN(t.translate))&&(t.translate=0)}function tt(t,e,i,s){_t(t.x,e.x,i.x,s?s.originX:void 0),_t(t.y,e.y,i.y,s?s.originY:void 0)}function Wt(t,e,i){t.min=i.min+e.min,t.max=t.min+A(e)}function cs(t,e,i){Wt(t.x,e.x,i.x),Wt(t.y,e.y,i.y)}function Ht(t,e,i){t.min=e.min-i.min,t.max=t.min+A(e)}function et(t,e,i){Ht(t.x,e.x,i.x),Ht(t.y,e.y,i.y)}function ds(t,{min:e,max:i},s){return e!==void 0&&t<e?t=s?D(e,t,s.min):Math.max(t,e):i!==void 0&&t>i&&(t=s?D(i,t,s.max):Math.min(t,i)),t}function Gt(t,e,i){return{min:e!==void 0?t.min+e:void 0,max:i!==void 0?t.max+i-(t.max-t.min):void 0}}function hs(t,{top:e,left:i,bottom:s,right:o}){return{x:Gt(t.x,i,o),y:Gt(t.y,e,s)}}function Xt(t,e){let i=e.min-t.min,s=e.max-t.max;return e.max-e.min<t.max-t.min&&([i,s]=[s,i]),{min:i,max:s}}function us(t,e){return{x:Xt(t.x,e.x),y:Xt(t.y,e.y)}}function ms(t,e){let i=.5;const s=A(t),o=A(e);return o>s?i=Tt(e.min,e.max-s,t.min):s>o&&(i=Tt(t.min,t.max-o,e.min)),Ve(0,1,i)}function ps(t,e){const i={};return e.min!==void 0&&(i.min=e.min-t.min),e.max!==void 0&&(i.max=e.max-t.min),i}const Et=.35;function fs(t=Et){return t===!1?t=0:t===!0&&(t=Et),{x:Yt(t,"left","right"),y:Yt(t,"top","bottom")}}function Yt(t,e,i){return{min:Zt(t,e),max:Zt(t,i)}}function Zt(t,e){return typeof t=="number"?t:t[e]||0}function V(t){return[t("x"),t("y")]}const Qe=({current:t})=>t?t.ownerDocument.defaultView:null,ys=new WeakMap;class gs{constructor(e){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=E(),this.visualElement=e}start(e,{snapToCursor:i=!1}={}){const{presenceContext:s}=this.visualElement;if(s&&s.isPresent===!1)return;const o=h=>{const{dragSnapToOrigin:d}=this.getProps();d?this.pauseAnimation():this.stopAnimation(),i&&this.snapToCursor($e(h).point)},u=(h,d)=>{const{drag:m,dragPropagation:p,onDragStart:f}=this.getProps();if(m&&!p&&(this.openDragLock&&this.openDragLock(),this.openDragLock=ts(m),!this.openDragLock))return;this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),V(y=>{let x=this.getAxisMotionValue(y).get()||0;if(ht.test(x)){const{projection:T}=this.visualElement;if(T&&T.layout){const w=T.layout.layoutBox[y];w&&(x=A(w)*(parseFloat(x)/100))}}this.originPoint[y]=x}),f&&I.postRender(()=>f(h,d)),Ft(this.visualElement,"transform");const{animationState:g}=this.visualElement;g&&g.setActive("whileDrag",!0)},n=(h,d)=>{const{dragPropagation:m,dragDirectionLock:p,onDirectionLock:f,onDrag:g}=this.getProps();if(!m&&!this.openDragLock)return;const{offset:y}=d;if(p&&this.currentDirection===null){this.currentDirection=xs(y),this.currentDirection!==null&&f&&f(this.currentDirection);return}this.updateAxis("x",d.point,y),this.updateAxis("y",d.point,y),this.visualElement.render(),g&&g(h,d)},r=(h,d)=>this.stop(h,d),a=()=>V(h=>{var d;return this.getAnimationState(h)==="paused"&&((d=this.getAxisMotionValue(h).animation)===null||d===void 0?void 0:d.play())}),{dragSnapToOrigin:l}=this.getProps();this.panSession=new Ge(e,{onSessionStart:o,onStart:u,onMove:n,onSessionEnd:r,resumeAnimation:a},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:l,contextWindow:Qe(this.visualElement)})}stop(e,i){const s=this.isDragging;if(this.cancel(),!s)return;const{velocity:o}=i;this.startAnimation(o);const{onDragEnd:u}=this.getProps();u&&I.postRender(()=>u(e,i))}cancel(){this.isDragging=!1;const{projection:e,animationState:i}=this.visualElement;e&&(e.isAnimationBlocked=!1),this.panSession&&this.panSession.end(),this.panSession=void 0;const{dragPropagation:s}=this.getProps();!s&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),i&&i.setActive("whileDrag",!1)}updateAxis(e,i,s){const{drag:o}=this.getProps();if(!s||!lt(e,o,this.currentDirection))return;const u=this.getAxisMotionValue(e);let n=this.originPoint[e]+s[e];this.constraints&&this.constraints[e]&&(n=ds(n,this.constraints[e],this.elastic[e])),u.set(n)}resolveConstraints(){var e;const{dragConstraints:i,dragElastic:s}=this.getProps(),o=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(e=this.visualElement.projection)===null||e===void 0?void 0:e.layout,u=this.constraints;i&&nt(i)?this.constraints||(this.constraints=this.resolveRefConstraints()):i&&o?this.constraints=hs(o.layoutBox,i):this.constraints=!1,this.elastic=fs(s),u!==this.constraints&&o&&this.constraints&&!this.hasMutatedConstraints&&V(n=>{this.constraints!==!1&&this.getAxisMotionValue(n)&&(this.constraints[n]=ps(o.layoutBox[n],this.constraints[n]))})}resolveRefConstraints(){const{dragConstraints:e,onMeasureDragConstraints:i}=this.getProps();if(!e||!nt(e))return!1;const s=e.current,{projection:o}=this.visualElement;if(!o||!o.layout)return!1;const u=ki(s,o.root,this.visualElement.getTransformPagePoint());let n=us(o.layout.layoutBox,u);if(i){const r=i(Mi(n));this.hasMutatedConstraints=!!r,r&&(n=Fi(r))}return n}startAnimation(e){const{drag:i,dragMomentum:s,dragElastic:o,dragTransition:u,dragSnapToOrigin:n,onDragTransitionEnd:r}=this.getProps(),a=this.constraints||{},l=V(h=>{if(!lt(h,i,this.currentDirection))return;let d=a&&a[h]||{};n&&(d={min:0,max:0});const m=o?200:1e6,p=o?40:1e7,f={type:"inertia",velocity:s?e[h]:0,bounceStiffness:m,bounceDamping:p,timeConstant:750,restDelta:1,restSpeed:10,...u,...d};return this.startAxisValueAnimation(h,f)});return Promise.all(l).then(r)}startAxisValueAnimation(e,i){const s=this.getAxisMotionValue(e);return Ft(this.visualElement,e),s.start(Ue(e,s,0,i,this.visualElement,!1))}stopAnimation(){V(e=>this.getAxisMotionValue(e).stop())}pauseAnimation(){V(e=>{var i;return(i=this.getAxisMotionValue(e).animation)===null||i===void 0?void 0:i.pause()})}getAnimationState(e){var i;return(i=this.getAxisMotionValue(e).animation)===null||i===void 0?void 0:i.state}getAxisMotionValue(e){const i=`_drag${e.toUpperCase()}`,s=this.visualElement.getProps(),o=s[i];return o||this.visualElement.getValue(e,(s.initial?s.initial[e]:void 0)||0)}snapToCursor(e){V(i=>{const{drag:s}=this.getProps();if(!lt(i,s,this.currentDirection))return;const{projection:o}=this.visualElement,u=this.getAxisMotionValue(i);if(o&&o.layout){const{min:n,max:r}=o.layout.layoutBox[i];u.set(e[i]-D(n,r,.5))}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:e,dragConstraints:i}=this.getProps(),{projection:s}=this.visualElement;if(!nt(i)||!s||!this.constraints)return;this.stopAnimation();const o={x:0,y:0};V(n=>{const r=this.getAxisMotionValue(n);if(r&&this.constraints!==!1){const a=r.get();o[n]=ms({min:a,max:a},this.constraints[n])}});const{transformTemplate:u}=this.visualElement.getProps();this.visualElement.current.style.transform=u?u({},""):"none",s.root&&s.root.updateScroll(),s.updateLayout(),this.resolveConstraints(),V(n=>{if(!lt(n,e,null))return;const r=this.getAxisMotionValue(n),{min:a,max:l}=this.constraints[n];r.set(D(a,l,o[n]))})}addListeners(){if(!this.visualElement.current)return;ys.set(this.visualElement,this);const e=this.visualElement.current,i=K(e,"pointerdown",a=>{const{drag:l,dragListener:h=!0}=this.getProps();l&&h&&this.start(a)}),s=()=>{const{dragConstraints:a}=this.getProps();nt(a)&&a.current&&(this.constraints=this.resolveRefConstraints())},{projection:o}=this.visualElement,u=o.addEventListener("measure",s);o&&!o.layout&&(o.root&&o.root.updateScroll(),o.updateLayout()),I.read(s);const n=Dt(window,"resize",()=>this.scalePositionWithinConstraints()),r=o.addEventListener("didUpdate",({delta:a,hasLayoutChanged:l})=>{this.isDragging&&l&&(V(h=>{const d=this.getAxisMotionValue(h);d&&(this.originPoint[h]+=a[h].translate,d.set(d.get()+a[h].translate))}),this.visualElement.render())});return()=>{n(),i(),u(),r&&r()}}getProps(){const e=this.visualElement.getProps(),{drag:i=!1,dragDirectionLock:s=!1,dragPropagation:o=!1,dragConstraints:u=!1,dragElastic:n=Et,dragMomentum:r=!0}=e;return{...e,drag:i,dragDirectionLock:s,dragPropagation:o,dragConstraints:u,dragElastic:n,dragMomentum:r}}}function lt(t,e,i){return(e===!0||e===t)&&(i===null||i===t)}function xs(t,e=10){let i=null;return Math.abs(t.y)>e?i="y":Math.abs(t.x)>e&&(i="x"),i}class vs extends qe{constructor(e){super(e),this.removeGroupControls=G,this.removeListeners=G,this.controls=new gs(e)}mount(){const{dragControls:e}=this.node.getProps();e&&(this.removeGroupControls=e.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||G}unmount(){this.removeGroupControls(),this.removeListeners()}}const Qt=t=>(e,i)=>{t&&I.postRender(()=>t(e,i))};class Ps extends qe{constructor(){super(...arguments),this.removePointerDownListener=G}onPointerDown(e){this.session=new Ge(e,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:Qe(this.node)})}createPanHandlers(){const{onPanSessionStart:e,onPanStart:i,onPan:s,onPanEnd:o}=this.node.getProps();return{onSessionStart:Qt(e),onStart:Qt(i),onMove:s,onEnd:(u,n)=>{delete this.session,o&&I.postRender(()=>o(u,n))}}}mount(){this.removePointerDownListener=K(this.node.current,"pointerdown",e=>this.onPointerDown(e))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}const ct={hasAnimatedSinceResize:!0,hasEverUpdated:!1};function Jt(t,e){return e.max===e.min?0:t/(e.max-e.min)*100}const Q={correct:(t,e)=>{if(!e.target)return t;if(typeof t=="string")if(Ie.test(t))t=parseFloat(t);else return t;const i=Jt(t,e.target.x),s=Jt(t,e.target.y);return`${i}% ${s}%`}},js={correct:(t,{treeScale:e,projectionDelta:i})=>{const s=t,o=Nt.parse(t);if(o.length>5)return s;const u=Nt.createTransformer(t),n=typeof o[0]!="number"?1:0,r=i.x.scale*e.x,a=i.y.scale*e.y;o[0+n]/=r,o[1+n]/=a;const l=D(r,a,.5);return typeof o[2+n]=="number"&&(o[2+n]/=l),typeof o[3+n]=="number"&&(o[3+n]/=l),u(o)}};class Cs extends v.Component{componentDidMount(){const{visualElement:e,layoutGroup:i,switchLayoutGroup:s,layoutId:o}=this.props,{projection:u}=e;gi(ws),u&&(i.group&&i.group.add(u),s&&s.register&&o&&s.register(u),u.root.didUpdate(),u.addEventListener("animationComplete",()=>{this.safeToRemove()}),u.setOptions({...u.options,onExitComplete:()=>this.safeToRemove()})),ct.hasEverUpdated=!0}getSnapshotBeforeUpdate(e){const{layoutDependency:i,visualElement:s,drag:o,isPresent:u}=this.props,n=s.projection;return n&&(n.isPresent=u,o||e.layoutDependency!==i||i===void 0?n.willUpdate():this.safeToRemove(),e.isPresent!==u&&(u?n.promote():n.relegate()||I.postRender(()=>{const r=n.getStack();(!r||!r.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{projection:e}=this.props.visualElement;e&&(e.root.didUpdate(),Be.postRender(()=>{!e.currentAnimation&&e.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:e,layoutGroup:i,switchLayoutGroup:s}=this.props,{projection:o}=e;o&&(o.scheduleCheckAfterUnmount(),i&&i.group&&i.group.remove(o),s&&s.deregister&&s.deregister(o))}safeToRemove(){const{safeToRemove:e}=this.props;e&&e()}render(){return null}}function Je(t){const[e,i]=He(),s=v.useContext(Le);return c.jsx(Cs,{...t,layoutGroup:s,switchLayoutGroup:v.useContext(yi),isPresent:e,safeToRemove:i})}const ws={borderRadius:{...Q,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:Q,borderTopRightRadius:Q,borderBottomLeftRadius:Q,borderBottomRightRadius:Q,boxShadow:js};function Ts(t,e,i){const s=xi(t)?t:Ni(t);return s.start(Ue("",s,e,i)),s.animation}function Es(t){return t instanceof SVGElement&&t.tagName!=="svg"}const Ds=(t,e)=>t.depth-e.depth;class Ss{constructor(){this.children=[],this.isDirty=!1}add(e){ze(this.children,e),this.isDirty=!0}remove(e){_e(this.children,e),this.isDirty=!0}forEach(e){this.isDirty&&this.children.sort(Ds),this.isDirty=!1,this.children.forEach(e)}}function As(t,e){const i=We.now(),s=({timestamp:o})=>{const u=o-i;u>=e&&(it(s),t(u-e))};return I.read(s,!0),()=>it(s)}const Ke=["TopLeft","TopRight","BottomLeft","BottomRight"],bs=Ke.length,Kt=t=>typeof t=="string"?parseFloat(t):t,te=t=>typeof t=="number"||Ie.test(t);function Rs(t,e,i,s,o,u){o?(t.opacity=D(0,i.opacity!==void 0?i.opacity:1,Ls(s)),t.opacityExit=D(e.opacity!==void 0?e.opacity:1,0,Vs(s))):u&&(t.opacity=D(e.opacity!==void 0?e.opacity:1,i.opacity!==void 0?i.opacity:1,s));for(let n=0;n<bs;n++){const r=`border${Ke[n]}Radius`;let a=ee(e,r),l=ee(i,r);if(a===void 0&&l===void 0)continue;a||(a=0),l||(l=0),a===0||l===0||te(a)===te(l)?(t[r]=Math.max(D(Kt(a),Kt(l),s),0),(ht.test(l)||ht.test(a))&&(t[r]+="%")):t[r]=l}(e.rotate||i.rotate)&&(t.rotate=D(e.rotate||0,i.rotate||0,s))}function ee(t,e){return t[e]!==void 0?t[e]:t.borderRadius}const Ls=ti(0,.5,Oi),Vs=ti(.5,.95,G);function ti(t,e,i){return s=>s<t?0:s>e?1:i(Tt(t,e,s))}function ie(t,e){t.min=e.min,t.max=e.max}function L(t,e){ie(t.x,e.x),ie(t.y,e.y)}function se(t,e){t.translate=e.translate,t.scale=e.scale,t.originPoint=e.originPoint,t.origin=e.origin}function ne(t,e,i,s,o){return t-=e,t=Ot(t,1/i,s),o!==void 0&&(t=Ot(t,1/o,s)),t}function Is(t,e=0,i=1,s=.5,o,u=t,n=t){if(ht.test(e)&&(e=parseFloat(e),e=D(n.min,n.max,e/100)-n.min),typeof e!="number")return;let r=D(u.min,u.max,s);t===u&&(r-=e),t.min=ne(t.min,e,i,r,o),t.max=ne(t.max,e,i,r,o)}function oe(t,e,[i,s,o],u,n){Is(t,e[i],e[s],e[o],e.scale,u,n)}const Bs=["x","scaleX","originX"],ks=["y","scaleY","originY"];function re(t,e,i,s){oe(t.x,e,Bs,i?i.x:void 0,s?s.x:void 0),oe(t.y,e,ks,i?i.y:void 0,s?s.y:void 0)}function ae(t){return t.translate===0&&t.scale===1}function ei(t){return ae(t.x)&&ae(t.y)}function le(t,e){return t.min===e.min&&t.max===e.max}function Ms(t,e){return le(t.x,e.x)&&le(t.y,e.y)}function ce(t,e){return Math.round(t.min)===Math.round(e.min)&&Math.round(t.max)===Math.round(e.max)}function ii(t,e){return ce(t.x,e.x)&&ce(t.y,e.y)}function de(t){return A(t.x)/A(t.y)}function he(t,e){return t.translate===e.translate&&t.scale===e.scale&&t.originPoint===e.originPoint}class Fs{constructor(){this.members=[]}add(e){ze(this.members,e),e.scheduleRender()}remove(e){if(_e(this.members,e),e===this.prevLead&&(this.prevLead=void 0),e===this.lead){const i=this.members[this.members.length-1];i&&this.promote(i)}}relegate(e){const i=this.members.findIndex(o=>e===o);if(i===0)return!1;let s;for(let o=i;o>=0;o--){const u=this.members[o];if(u.isPresent!==!1){s=u;break}}return s?(this.promote(s),!0):!1}promote(e,i){const s=this.lead;if(e!==s&&(this.prevLead=s,this.lead=e,e.show(),s)){s.instance&&s.scheduleRender(),e.scheduleRender(),e.resumeFrom=s,i&&(e.resumeFrom.preserveOpacity=!0),s.snapshot&&(e.snapshot=s.snapshot,e.snapshot.latestValues=s.animationValues||s.latestValues),e.root&&e.root.isUpdating&&(e.isLayoutDirty=!0);const{crossfade:o}=e.options;o===!1&&s.hide()}}exitAnimationComplete(){this.members.forEach(e=>{const{options:i,resumingFrom:s}=e;i.onExitComplete&&i.onExitComplete(),s&&s.options.onExitComplete&&s.options.onExitComplete()})}scheduleRender(){this.members.forEach(e=>{e.instance&&e.scheduleRender(!1)})}removeLeadSnapshot(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)}}function Ns(t,e,i){let s="";const o=t.x.translate/e.x,u=t.y.translate/e.y,n=(i==null?void 0:i.z)||0;if((o||u||n)&&(s=`translate3d(${o}px, ${u}px, ${n}px) `),(e.x!==1||e.y!==1)&&(s+=`scale(${1/e.x}, ${1/e.y}) `),i){const{transformPerspective:l,rotate:h,rotateX:d,rotateY:m,skewX:p,skewY:f}=i;l&&(s=`perspective(${l}px) ${s}`),h&&(s+=`rotate(${h}deg) `),d&&(s+=`rotateX(${d}deg) `),m&&(s+=`rotateY(${m}deg) `),p&&(s+=`skewX(${p}deg) `),f&&(s+=`skewY(${f}deg) `)}const r=t.x.scale*e.x,a=t.y.scale*e.y;return(r!==1||a!==1)&&(s+=`scale(${r}, ${a})`),s||"none"}const Pt=["","X","Y","Z"],Os={visibility:"hidden"},ue=1e3;let $s=0;function jt(t,e,i,s){const{latestValues:o}=e;o[t]&&(i[t]=o[t],e.setStaticValue(t,0),s&&(s[t]=0))}function si(t){if(t.hasCheckedOptimisedAppear=!0,t.root===t)return;const{visualElement:e}=t.options;if(!e)return;const i=Wi(e);if(window.MotionHasOptimisedAnimation(i,"transform")){const{layout:o,layoutId:u}=t.options;window.MotionCancelOptimisedAnimation(i,"transform",I,!(o||u))}const{parent:s}=t;s&&!s.hasCheckedOptimisedAppear&&si(s)}function ni({attachResizeListener:t,defaultParent:e,measureScroll:i,checkIsScrollRoot:s,resetTransform:o}){return class{constructor(n={},r=e==null?void 0:e()){this.id=$s++,this.animationId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(zs),this.nodes.forEach(Xs),this.nodes.forEach(Ys),this.nodes.forEach(_s)},this.resolvedRelativeTargetAt=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=n,this.root=r?r.root||r:this,this.path=r?[...r.path,r]:[],this.parent=r,this.depth=r?r.depth+1:0;for(let a=0;a<this.path.length;a++)this.path[a].shouldResetTransform=!0;this.root===this&&(this.nodes=new Ss)}addEventListener(n,r){return this.eventHandlers.has(n)||this.eventHandlers.set(n,new $i),this.eventHandlers.get(n).add(r)}notifyListeners(n,...r){const a=this.eventHandlers.get(n);a&&a.notify(...r)}hasListeners(n){return this.eventHandlers.has(n)}mount(n,r=this.root.hasTreeAnimated){if(this.instance)return;this.isSVG=Es(n),this.instance=n;const{layoutId:a,layout:l,visualElement:h}=this.options;if(h&&!h.current&&h.mount(n),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),r&&(l||a)&&(this.isLayoutDirty=!0),t){let d;const m=()=>this.root.updateBlockedByResize=!1;t(n,()=>{this.root.updateBlockedByResize=!0,d&&d(),d=As(m,250),ct.hasAnimatedSinceResize&&(ct.hasAnimatedSinceResize=!1,this.nodes.forEach(pe))})}a&&this.root.registerSharedNode(a,this),this.options.animate!==!1&&h&&(a||l)&&this.addEventListener("didUpdate",({delta:d,hasLayoutChanged:m,hasRelativeLayoutChanged:p,layout:f})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const g=this.options.transition||h.getDefaultTransition()||tn,{onLayoutAnimationStart:y,onLayoutAnimationComplete:x}=h.getProps(),T=!this.targetLayout||!ii(this.targetLayout,f),w=!m&&p;if(this.options.layoutRoot||this.resumeFrom||w||m&&(T||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0),this.setAnimationOrigin(d,w);const b={...Ui(g,"layout"),onPlay:y,onComplete:x};(h.shouldReduceMotion||this.options.layoutRoot)&&(b.delay=0,b.type=!1),this.startAnimation(b)}else m||pe(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=f})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const n=this.getStack();n&&n.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,it(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(Zs),this.animationId++)}getTransformTemplate(){const{visualElement:n}=this.options;return n&&n.getProps().transformTemplate}willUpdate(n=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&si(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let h=0;h<this.path.length;h++){const d=this.path[h];d.shouldResetTransform=!0,d.updateScroll("snapshot"),d.options.layoutRoot&&d.willUpdate(!1)}const{layoutId:r,layout:a}=this.options;if(r===void 0&&!a)return;const l=this.getTransformTemplate();this.prevTransformTemplateValue=l?l(this.latestValues,""):void 0,this.updateSnapshot(),n&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(me);return}this.isUpdating||this.nodes.forEach(Hs),this.isUpdating=!1,this.nodes.forEach(Gs),this.nodes.forEach(Us),this.nodes.forEach(qs),this.clearAllSnapshots();const r=We.now();R.delta=Ve(0,1e3/60,r-R.timestamp),R.timestamp=r,R.isProcessing=!0,ft.update.process(R),ft.preRender.process(R),ft.render.process(R),R.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,Be.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(Ws),this.sharedNodes.forEach(Qs)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,I.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){I.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!A(this.snapshot.measuredBox.x)&&!A(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let a=0;a<this.path.length;a++)this.path[a].updateScroll();const n=this.layout;this.layout=this.measure(!1),this.layoutCorrected=E(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:r}=this.options;r&&r.notify("LayoutMeasure",this.layout.layoutBox,n?n.layoutBox:void 0)}updateScroll(n="measure"){let r=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===n&&(r=!1),r){const a=s(this.instance);this.scroll={animationId:this.root.animationId,phase:n,isRoot:a,offset:i(this.instance),wasRoot:this.scroll?this.scroll.isRoot:a}}}resetTransform(){if(!o)return;const n=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,r=this.projectionDelta&&!ei(this.projectionDelta),a=this.getTransformTemplate(),l=a?a(this.latestValues,""):void 0,h=l!==this.prevTransformTemplateValue;n&&(r||_(this.latestValues)||h)&&(o(this.instance,l),this.shouldResetTransform=!1,this.scheduleRender())}measure(n=!0){const r=this.measurePageBox();let a=this.removeElementScroll(r);return n&&(a=this.removeTransform(a)),en(a),{animationId:this.root.animationId,measuredBox:r,layoutBox:a,latestValues:{},source:this.id}}measurePageBox(){var n;const{visualElement:r}=this.options;if(!r)return E();const a=r.measureViewportBox();if(!(((n=this.scroll)===null||n===void 0?void 0:n.wasRoot)||this.path.some(sn))){const{scroll:h}=this.root;h&&(ot(a.x,h.offset.x),ot(a.y,h.offset.y))}return a}removeElementScroll(n){var r;const a=E();if(L(a,n),!((r=this.scroll)===null||r===void 0)&&r.wasRoot)return a;for(let l=0;l<this.path.length;l++){const h=this.path[l],{scroll:d,options:m}=h;h!==this.root&&d&&m.layoutScroll&&(d.wasRoot&&L(a,n),ot(a.x,d.offset.x),ot(a.y,d.offset.y))}return a}applyTransform(n,r=!1){const a=E();L(a,n);for(let l=0;l<this.path.length;l++){const h=this.path[l];!r&&h.options.layoutScroll&&h.scroll&&h!==h.root&&rt(a,{x:-h.scroll.offset.x,y:-h.scroll.offset.y}),_(h.latestValues)&&rt(a,h.latestValues)}return _(this.latestValues)&&rt(a,this.latestValues),a}removeTransform(n){const r=E();L(r,n);for(let a=0;a<this.path.length;a++){const l=this.path[a];if(!l.instance||!_(l.latestValues))continue;$t(l.latestValues)&&l.updateSnapshot();const h=E(),d=l.measurePageBox();L(h,d),re(r,l.latestValues,l.snapshot?l.snapshot.layoutBox:void 0,h)}return _(this.latestValues)&&re(r,this.latestValues),r}setTargetDelta(n){this.targetDelta=n,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(n){this.options={...this.options,...n,crossfade:n.crossfade!==void 0?n.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==R.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(n=!1){var r;const a=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=a.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=a.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=a.isSharedProjectionDirty);const l=!!this.resumingFrom||this!==a;if(!(n||l&&this.isSharedProjectionDirty||this.isProjectionDirty||!((r=this.parent)===null||r===void 0)&&r.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:d,layoutId:m}=this.options;if(!(!this.layout||!(d||m))){if(this.resolvedRelativeTargetAt=R.timestamp,!this.targetDelta&&!this.relativeTarget){const p=this.getClosestProjectingParent();p&&p.layout&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=E(),this.relativeTargetOrigin=E(),et(this.relativeTargetOrigin,this.layout.layoutBox,p.layout.layoutBox),L(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}if(!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=E(),this.targetWithTransforms=E()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),cs(this.target,this.relativeTarget,this.relativeParent.target)):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.layoutBox):L(this.target,this.layout.layoutBox),qi(this.target,this.targetDelta)):L(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget)){this.attemptToResolveRelativeTarget=!1;const p=this.getClosestProjectingParent();p&&!!p.resumingFrom==!!this.resumingFrom&&!p.options.layoutScroll&&p.target&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=E(),this.relativeTargetOrigin=E(),et(this.relativeTargetOrigin,this.target,p.target),L(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}}}getClosestProjectingParent(){if(!(!this.parent||$t(this.parent.latestValues)||zi(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}calcProjection(){var n;const r=this.getLead(),a=!!this.resumingFrom||this!==r;let l=!0;if((this.isProjectionDirty||!((n=this.parent)===null||n===void 0)&&n.isProjectionDirty)&&(l=!1),a&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(l=!1),this.resolvedRelativeTargetAt===R.timestamp&&(l=!1),l)return;const{layout:h,layoutId:d}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(h||d))return;L(this.layoutCorrected,this.layout.layoutBox);const m=this.treeScale.x,p=this.treeScale.y;_i(this.layoutCorrected,this.treeScale,this.path,a),r.layout&&!r.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(r.target=r.layout.layoutBox,r.targetWithTransforms=E());const{target:f}=r;if(!f){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(se(this.prevProjectionDelta.x,this.projectionDelta.x),se(this.prevProjectionDelta.y,this.projectionDelta.y)),tt(this.projectionDelta,this.layoutCorrected,f,this.latestValues),(this.treeScale.x!==m||this.treeScale.y!==p||!he(this.projectionDelta.x,this.prevProjectionDelta.x)||!he(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",f))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(n=!0){var r;if((r=this.options.visualElement)===null||r===void 0||r.scheduleRender(),n){const a=this.getStack();a&&a.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=W(),this.projectionDelta=W(),this.projectionDeltaWithTransform=W()}setAnimationOrigin(n,r=!1){const a=this.snapshot,l=a?a.latestValues:{},h={...this.latestValues},d=W();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!r;const m=E(),p=a?a.source:void 0,f=this.layout?this.layout.source:void 0,g=p!==f,y=this.getStack(),x=!y||y.members.length<=1,T=!!(g&&!x&&this.options.crossfade===!0&&!this.path.some(Ks));this.animationProgress=0;let w;this.mixTargetDelta=b=>{const C=b/1e3;fe(d.x,n.x,C),fe(d.y,n.y,C),this.setTargetDelta(d),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(et(m,this.layout.layoutBox,this.relativeParent.layout.layoutBox),Js(this.relativeTarget,this.relativeTargetOrigin,m,C),w&&Ms(this.relativeTarget,w)&&(this.isProjectionDirty=!1),w||(w=E()),L(w,this.relativeTarget)),g&&(this.animationValues=h,Rs(h,l,this.latestValues,C,T,x)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=C},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(n){this.notifyListeners("animationStart"),this.currentAnimation&&this.currentAnimation.stop(),this.resumingFrom&&this.resumingFrom.currentAnimation&&this.resumingFrom.currentAnimation.stop(),this.pendingAnimation&&(it(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=I.update(()=>{ct.hasAnimatedSinceResize=!0,this.currentAnimation=Ts(0,ue,{...n,onUpdate:r=>{this.mixTargetDelta(r),n.onUpdate&&n.onUpdate(r)},onStop:()=>{},onComplete:()=>{n.onComplete&&n.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const n=this.getStack();n&&n.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(ue),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const n=this.getLead();let{targetWithTransforms:r,target:a,layout:l,latestValues:h}=n;if(!(!r||!a||!l)){if(this!==n&&this.layout&&l&&oi(this.options.animationType,this.layout.layoutBox,l.layoutBox)){a=this.target||E();const d=A(this.layout.layoutBox.x);a.x.min=n.target.x.min,a.x.max=a.x.min+d;const m=A(this.layout.layoutBox.y);a.y.min=n.target.y.min,a.y.max=a.y.min+m}L(r,a),rt(r,h),tt(this.projectionDeltaWithTransform,this.layoutCorrected,r,h)}}registerSharedNode(n,r){this.sharedNodes.has(n)||this.sharedNodes.set(n,new Fs),this.sharedNodes.get(n).add(r);const l=r.options.initialPromotionConfig;r.promote({transition:l?l.transition:void 0,preserveFollowOpacity:l&&l.shouldPreserveFollowOpacity?l.shouldPreserveFollowOpacity(r):void 0})}isLead(){const n=this.getStack();return n?n.lead===this:!0}getLead(){var n;const{layoutId:r}=this.options;return r?((n=this.getStack())===null||n===void 0?void 0:n.lead)||this:this}getPrevLead(){var n;const{layoutId:r}=this.options;return r?(n=this.getStack())===null||n===void 0?void 0:n.prevLead:void 0}getStack(){const{layoutId:n}=this.options;if(n)return this.root.sharedNodes.get(n)}promote({needsReset:n,transition:r,preserveFollowOpacity:a}={}){const l=this.getStack();l&&l.promote(this,a),n&&(this.projectionDelta=void 0,this.needsReset=!0),r&&this.setOptions({transition:r})}relegate(){const n=this.getStack();return n?n.relegate(this):!1}resetSkewAndRotation(){const{visualElement:n}=this.options;if(!n)return;let r=!1;const{latestValues:a}=n;if((a.z||a.rotate||a.rotateX||a.rotateY||a.rotateZ||a.skewX||a.skewY)&&(r=!0),!r)return;const l={};a.z&&jt("z",n,l,this.animationValues);for(let h=0;h<Pt.length;h++)jt(`rotate${Pt[h]}`,n,l,this.animationValues),jt(`skew${Pt[h]}`,n,l,this.animationValues);n.render();for(const h in l)n.setStaticValue(h,l[h]),this.animationValues&&(this.animationValues[h]=l[h]);n.scheduleRender()}getProjectionStyles(n){var r,a;if(!this.instance||this.isSVG)return;if(!this.isVisible)return Os;const l={visibility:""},h=this.getTransformTemplate();if(this.needsReset)return this.needsReset=!1,l.opacity="",l.pointerEvents=yt(n==null?void 0:n.pointerEvents)||"",l.transform=h?h(this.latestValues,""):"none",l;const d=this.getLead();if(!this.projectionDelta||!this.layout||!d.target){const g={};return this.options.layoutId&&(g.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,g.pointerEvents=yt(n==null?void 0:n.pointerEvents)||""),this.hasProjected&&!_(this.latestValues)&&(g.transform=h?h({},""):"none",this.hasProjected=!1),g}const m=d.animationValues||d.latestValues;this.applyTransformsToTarget(),l.transform=Ns(this.projectionDeltaWithTransform,this.treeScale,m),h&&(l.transform=h(m,l.transform));const{x:p,y:f}=this.projectionDelta;l.transformOrigin=`${p.origin*100}% ${f.origin*100}% 0`,d.animationValues?l.opacity=d===this?(a=(r=m.opacity)!==null&&r!==void 0?r:this.latestValues.opacity)!==null&&a!==void 0?a:1:this.preserveOpacity?this.latestValues.opacity:m.opacityExit:l.opacity=d===this?m.opacity!==void 0?m.opacity:"":m.opacityExit!==void 0?m.opacityExit:0;for(const g in Lt){if(m[g]===void 0)continue;const{correct:y,applyTo:x,isCSSVariable:T}=Lt[g],w=l.transform==="none"?m[g]:y(m[g],d);if(x){const b=x.length;for(let C=0;C<b;C++)l[x[C]]=w}else T?this.options.visualElement.renderState.vars[g]=w:l[g]=w}return this.options.layoutId&&(l.pointerEvents=d===this?yt(n==null?void 0:n.pointerEvents)||"":"none"),l}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(n=>{var r;return(r=n.currentAnimation)===null||r===void 0?void 0:r.stop()}),this.root.nodes.forEach(me),this.root.sharedNodes.clear()}}}function Us(t){t.updateLayout()}function qs(t){var e;const i=((e=t.resumeFrom)===null||e===void 0?void 0:e.snapshot)||t.snapshot;if(t.isLead()&&t.layout&&i&&t.hasListeners("didUpdate")){const{layoutBox:s,measuredBox:o}=t.layout,{animationType:u}=t.options,n=i.source!==t.layout.source;u==="size"?V(d=>{const m=n?i.measuredBox[d]:i.layoutBox[d],p=A(m);m.min=s[d].min,m.max=m.min+p}):oi(u,i.layoutBox,s)&&V(d=>{const m=n?i.measuredBox[d]:i.layoutBox[d],p=A(s[d]);m.max=m.min+p,t.relativeTarget&&!t.currentAnimation&&(t.isProjectionDirty=!0,t.relativeTarget[d].max=t.relativeTarget[d].min+p)});const r=W();tt(r,s,i.layoutBox);const a=W();n?tt(a,t.applyTransform(o,!0),i.measuredBox):tt(a,s,i.layoutBox);const l=!ei(r);let h=!1;if(!t.resumeFrom){const d=t.getClosestProjectingParent();if(d&&!d.resumeFrom){const{snapshot:m,layout:p}=d;if(m&&p){const f=E();et(f,i.layoutBox,m.layoutBox);const g=E();et(g,s,p.layoutBox),ii(f,g)||(h=!0),d.options.layoutRoot&&(t.relativeTarget=g,t.relativeTargetOrigin=f,t.relativeParent=d)}}}t.notifyListeners("didUpdate",{layout:s,snapshot:i,delta:a,layoutDelta:r,hasLayoutChanged:l,hasRelativeLayoutChanged:h})}else if(t.isLead()){const{onExitComplete:s}=t.options;s&&s()}t.options.transition=void 0}function zs(t){t.parent&&(t.isProjecting()||(t.isProjectionDirty=t.parent.isProjectionDirty),t.isSharedProjectionDirty||(t.isSharedProjectionDirty=!!(t.isProjectionDirty||t.parent.isProjectionDirty||t.parent.isSharedProjectionDirty)),t.isTransformDirty||(t.isTransformDirty=t.parent.isTransformDirty))}function _s(t){t.isProjectionDirty=t.isSharedProjectionDirty=t.isTransformDirty=!1}function Ws(t){t.clearSnapshot()}function me(t){t.clearMeasurements()}function Hs(t){t.isLayoutDirty=!1}function Gs(t){const{visualElement:e}=t.options;e&&e.getProps().onBeforeLayoutMeasure&&e.notify("BeforeLayoutMeasure"),t.resetTransform()}function pe(t){t.finishAnimation(),t.targetDelta=t.relativeTarget=t.target=void 0,t.isProjectionDirty=!0}function Xs(t){t.resolveTargetDelta()}function Ys(t){t.calcProjection()}function Zs(t){t.resetSkewAndRotation()}function Qs(t){t.removeLeadSnapshot()}function fe(t,e,i){t.translate=D(e.translate,0,i),t.scale=D(e.scale,1,i),t.origin=e.origin,t.originPoint=e.originPoint}function ye(t,e,i,s){t.min=D(e.min,i.min,s),t.max=D(e.max,i.max,s)}function Js(t,e,i,s){ye(t.x,e.x,i.x,s),ye(t.y,e.y,i.y,s)}function Ks(t){return t.animationValues&&t.animationValues.opacityExit!==void 0}const tn={duration:.45,ease:[.4,0,.1,1]},ge=t=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(t),xe=ge("applewebkit/")&&!ge("chrome/")?Math.round:G;function ve(t){t.min=xe(t.min),t.max=xe(t.max)}function en(t){ve(t.x),ve(t.y)}function oi(t,e,i){return t==="position"||t==="preserve-aspect"&&!ls(de(e),de(i),.2)}function sn(t){var e;return t!==t.root&&((e=t.scroll)===null||e===void 0?void 0:e.wasRoot)}const nn=ni({attachResizeListener:(t,e)=>Dt(t,"resize",e),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}),checkIsScrollRoot:()=>!0}),Ct={current:void 0},ri=ni({measureScroll:t=>({x:t.scrollLeft,y:t.scrollTop}),defaultParent:()=>{if(!Ct.current){const t=new nn({});t.mount(window),t.setOptions({layoutScroll:!0}),Ct.current=t}return Ct.current},resetTransform:(t,e)=>{t.style.transform=e!==void 0?e:"none"},checkIsScrollRoot:t=>window.getComputedStyle(t).position==="fixed"}),on={pan:{Feature:Ps},drag:{Feature:vs,ProjectionNode:ri,MeasureLayout:Je}},rn={layout:{ProjectionNode:ri,MeasureLayout:Je}},an=vi({...Xi,...Gi,...on,...rn},Hi),Pe=Ki(an),ln=P.div`
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
`,cn=P(ln)`
  width: 100%;

  @media (min-width: 768px) {
    width: 45%;
    max-width: fit-content;
  }
`,ai=P.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  font-style: ${({theme:t})=>t.font};
  width: 100%;
  z-index: 12;
`;function $({className:t,children:e,style:i}){const s=()=>{};return c.jsx(ai,{onChange:s,className:t,style:i,children:e})}function X({className:t,isLongOnMobile:e,children:i,style:s}){return e?c.jsx(cn,{className:t,style:{...s},children:i}):c.jsx(ai,{className:t,children:i})}const dn=P.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  max-width: 100vw;

  @media (min-width: 768px) {
    flex-wrap: nowrap;
    max-width: 100%;
  }
`;function St({children:t}){return c.jsx(dn,{className:"address-box",children:t})}St.propTypes={children:ut.node.isRequired};function hn({invoice:t}){var n,r,a,l,h,d;const e=pt(),{formState:{errors:i},register:s}=M(),{isDraft:o}=U(),u=c.jsxs($,{style:{width:e<768?"100%":""},className:"client-country",children:[c.jsx(k,{htmlFor:"clientCountry",style:{color:i.clientCountry?"#EC5757":""},children:"Country"}),c.jsx(Ne,{id:"clientCountry",$long:!1,style:{border:i!=null&&i.clientCountry?"1px solid #EC5757":"",width:e<768?"100%":""},type:"text",defaultValue:t?(n=t==null?void 0:t.clientAddress)==null?void 0:n.country:"",...s("clientCountry",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return c.jsxs(c.Fragment,{children:[c.jsxs($,{className:"client-name",children:[c.jsx(k,{htmlFor:"clientName",style:{color:i.clientName?"#EC5757":""},children:"Client's Name"}),((r=i.clientName)==null?void 0:r.type)==="required"&&c.jsx(Vt,{children:"can't be empty"}),c.jsx(wt,{id:"clientName",$long:!0,style:{border:i.clientName?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientName:"",...s("clientName",{required:!o})})]}),c.jsxs($,{className:"client-email",children:[c.jsx(k,{htmlFor:"clientEmail",style:{color:i.clientEmail?"#EC5757":""},children:"Client's Email"}),((a=i.clientEmail)==null?void 0:a.type)==="pattern"&&c.jsx(Vt,{style:{position:"absolute",top:"-8px"},children:"Invalid email"}),c.jsx(wt,{id:"clientEmail",$long:!0,style:{border:i.clientEmail?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientEmail:"",...s("clientEmail",{required:!o,pattern:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/})})]}),c.jsxs($,{className:"client-street-address",children:[c.jsx(k,{htmlFor:"clientStreetAddress",style:{color:i.clientStreetAddress?"#EC5757":""},children:"Street Address"}),c.jsx(Oe,{id:"clientStreetAddress",style:{border:i.clientStreetAddress?"1px solid #EC5757":""},defaultValue:t?(l=t==null?void 0:t.clientAddress)==null?void 0:l.street:"",...s("clientStreetAddress",{required:!o})})]}),c.jsxs(St,{children:[c.jsxs(X,{className:"clientCity",children:[c.jsx(k,{htmlFor:"clientCity",style:{color:i.clientCity?"#EC5757":""},children:"City"}),c.jsx(mt,{id:"clientCity",style:{border:i.clientCity?"1px solid #EC5757":""},type:"text",defaultValue:t?(h=t==null?void 0:t.clientAddress)==null?void 0:h.city:"",...s("clientCity",{required:!o,pattern:/[\w ]*/i,maxLength:30})})]}),c.jsxs(X,{className:"clientPostalCode",children:[c.jsx(k,{htmlFor:"clientPostalCode",style:{color:i.clientPostalCode?"#EC5757":""},children:"Post Code"}),c.jsx(mt,{id:"clientPostalCode",style:{border:i.clientPostalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(d=t==null?void 0:t.clientAddress)==null?void 0:d.postCode:"",...s("clientPostalCode",{required:!o,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]}),e<768&&c.jsx($,{className:"client-country",children:u}),e>=768&&c.jsx(X,{className:"client-country",children:u})]})]})}const un=P.div`
  display: contents;
  width: 100%;
  justify-content: space-between;

  @media (min-width: 350px) {
    display: flex;
  }
  @media (min-width: 600px) {
    display: contents;
  }
`;function mn({invoice:t}){var n,r,a,l;const e=pt(),{formState:{errors:i},register:s}=M(),{isDraft:o}=U(),u=c.jsxs($,{style:{width:e<768?"100%":""},className:"company-country",children:[c.jsx(k,{htmlFor:"CompanyCountry",style:{color:i!=null&&i.country?"#EC5757":""},children:"Country"}),c.jsx(Ne,{id:"CompanyCountry",type:"text",style:{border:i!=null&&i.country?"1px solid #EC5757":"",width:e<768?"100%":""},defaultValue:t?(n=t==null?void 0:t.senderAddress)==null?void 0:n.country:"",...s("country",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return c.jsxs(c.Fragment,{children:[c.jsxs($,{className:"company-street-address",children:[c.jsx(k,{htmlFor:"streetAddress",style:{color:i!=null&&i.streetAddress?"#EC5757":""},children:"Street Address"}),c.jsx(Oe,{id:"streetAddress",style:{border:i!=null&&i.streetAddress?"1px solid #EC5757":""},defaultValue:t?(r=t==null?void 0:t.senderAddress)==null?void 0:r.street:"",...s("streetAddress",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:50})})]}),c.jsxs(St,{children:[c.jsxs(un,{children:[c.jsxs(X,{className:"company-city",children:[c.jsx(k,{htmlFor:"companyCity",style:{color:i!=null&&i.city?"#EC5757":""},children:"City"}),c.jsx(mt,{id:"companyCity",style:{border:i!=null&&i.city?"1px solid #EC5757":""},defaultValue:t?(a=t==null?void 0:t.senderAddress)==null?void 0:a.city:"",type:"text",...s("city",{required:!o,pattern:/[\w ]*/i,maxLength:30})})]}),c.jsxs(X,{style:{justifySelf:"flex-end"},className:"company-postal-code",children:[c.jsx(k,{htmlFor:"CompanyPostalCode",style:{color:i!=null&&i.postalCode?"#EC5757":""},children:"Post Code"}),c.jsx(mt,{id:"CompanyPostalCode",style:{border:i!=null&&i.postalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(l=t==null?void 0:t.senderAddress)==null?void 0:l.postCode:"",...s("postalCode",{required:!o,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]})]}),e<768&&c.jsx($,{className:"company-country-container",children:u}),e>=768&&c.jsx(X,{className:"company-country-container",children:u})]})]})}function pn({invoice:t}){const{formState:{errors:e},register:i}=M(),{isDraft:s}=U();return c.jsx(c.Fragment,{children:c.jsxs($,{className:"project-description",children:[c.jsx(k,{htmlFor:"projectDescription",style:{color:e.projectDescription?"#EC5757":""},children:"Project Description"}),c.jsx(wt,{id:"projectDescription",type:"text",defaultValue:t==null?void 0:t.description,...i("projectDescription",{required:!s}),style:{border:e.projectDescription?"1px solid #EC5757":""}})]})})}const je=P.div`
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
`,li=P.input`
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
`,fn=P(li)`
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
`,ci=P(li).attrs({pattern:"\\d+"})`
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
`,yn=P(ci).attrs({pattern:"[0-9.]*"})`
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
`,Ce=P.p`
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
`;const gn=P.div`
  display: grid;
  grid-template: 1fr / 220px 62px 116px 61px 49px;
`,we=P.svg`
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
`,J=P.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: fit-content;
  width: fit-content;
`,xn=P(J)`
  text-align: right;

  @media (min-width: 325px) {
    align-items: flex-start;
    text-align: initial;
  }
`,vn=P.div`
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
`,Te=c.jsx("path",{d:"M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z",fillRule:"nonzero",className:"deleteIconPath",tabIndex:0}),Pn=P.button`
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
`,qn=P.svg`
  width: 11px;
  height: 11px;
`,jn=P.p`
  color: ${({theme:t})=>t.newItemText};
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  text-align: center;
  letter-spacing: -0.25px;
  margin-left: 0.25rem;
`;function Cn({items:t,append:e}){const{clearErrors:i}=M(),{formState:{submitCount:s}}=Si(),o=()=>{e({id:"",name:"",quantity:"",price:"",total:""}),i("itemsError")};return c.jsx(Pn,{onClick:o,type:"button",style:{border:s>0&&t.length===0?"1px solid red":"1px solid transparent"},children:c.jsx(jn,{children:"+ Add New Item"})})}const wn=P.div`
  display: grid;
  width: 100%;
  border-radius: 8px;
  grid-template-rows: auto;
  background-color: ${({theme:t})=>t.formBackground};
`,Tn=P.div`
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
`,dt=P(H)`
  justify-self: start;

  @media (min-width: 600px) {
    &.mobile-only-label {
      display: none;
    }
  }
`,En=P.div`
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
`,Dn=P.h1`
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
`;function Ee({index:t,invoice:e}){var r,a,l,h,d,m,p;const{register:i,formState:s}=M(),{errors:o}=s,{isDraft:u}=U(),n=()=>{var f,g,y;return((y=(g=(f=o==null?void 0:o.items)==null?void 0:f[t])==null?void 0:g.quantity)==null?void 0:y.type)==="pattern"};return c.jsxs("div",{style:{position:"relative"},children:[c.jsx(ci,{...i(`items[${t}].quantity`,{required:!u,max:1e3,pattern:{value:/^[0-9]+$/,message:"Only numbers are allowed"}}),placeholder:"0",inputMode:"numeric",type:"text",style:{border:Array.isArray(o.items)&&((a=(r=o==null?void 0:o.items)==null?void 0:r[t])!=null&&a.quantity)?"1px solid #EC5757":""},defaultValue:e?(h=(l=e==null?void 0:e.items)==null?void 0:l[t])==null?void 0:h.quantity:0}),Array.isArray(o.items)&&n()&&c.jsx("span",{style:{position:"absolute",zIndex:1,top:"100%",left:"0",marginTop:"4px",padding:"6px 8px",backgroundColor:"#f8d7da",color:"#721c24",border:"1px solid #f5c6cb",borderRadius:"4px",whiteSpace:"pre-line",textWrap:"nowrap"},children:(p=(m=(d=o==null?void 0:o.items)==null?void 0:d[t])==null?void 0:m.quantity)==null?void 0:p.message})]})}function De({index:t,invoice:e}){var r,a,l,h,d,m,p;const{register:i,formState:s}=M(),{errors:o}=s,{isDraft:u}=U(),n=()=>{var f,g,y;return((y=(g=(f=o==null?void 0:o.items)==null?void 0:f[t])==null?void 0:g.price)==null?void 0:y.type)==="pattern"};return c.jsxs("div",{style:{position:"relative"},children:[c.jsx(yn,{...i(`items[${t}].price`,{required:!u,max:1e5,pattern:{value:/^\$?\d+(,\d{3})*\.?[0-9]?[0-9]?$/,message:"Only numbers are allowed - max 2 decimal places"}}),placeholder:"0.00",inputMode:"numeric",type:"text",defaultValue:e?(a=(r=e==null?void 0:e.items)==null?void 0:r[t])==null?void 0:a.price:0,style:{border:Array.isArray(o.items)&&((h=(l=o==null?void 0:o.items)==null?void 0:l[t])!=null&&h.price)?"1px solid #EC5757":""}}),Array.isArray(o.items)&&n()&&c.jsx("div",{style:{position:"absolute",zIndex:1,top:"100%",left:"0",marginTop:"4px",padding:"6px 8px",backgroundColor:"#f8d7da",color:"#721c24",border:"1px solid #f5c6cb",borderRadius:"4px",whiteSpace:"prewrap"},children:(p=(m=(d=o==null?void 0:o.items)==null?void 0:d[t])==null?void 0:m.price)==null?void 0:p.message})]})}function Se({index:t,invoice:e}){var n,r,a,l;const{register:i,formState:s}=M(),{errors:o}=s,{isDraft:u}=U();return c.jsx(fn,{...i(`items[${t}].name`,{required:!u}),placeholder:"Item name",defaultValue:e?(r=(n=e==null?void 0:e.items)==null?void 0:n[t])==null?void 0:r.name:"",type:"text",style:{border:Array.isArray(o.items)&&((l=(a=o==null?void 0:o.items)==null?void 0:a[t])!=null&&l.name)?"1px solid #EC5757":""}})}function di({invoice:t,isEditOpen:e}){const{formState:i,watch:s,clearErrors:o,setError:u,reset:n}=M(),{fields:r,remove:a,append:l}=Fe({name:"items",rules:{required:!0,minLength:1}}),{isSubmitting:h}=i,d=s("items",[]),m=pt(),p=v.useRef(!0);v.useEffect(()=>{!r.length&&!p.current?u("myFieldArray",{type:"required",message:"At least one item is required"}):o("myFieldArray"),p.current&&(p.current=!1)},[r,h]),v.useEffect(()=>{localStorage.getItem("cachedEditInvoiceForm")||t&&e&&n({items:t.items.map(x=>({id:x.id,name:x.name,quantity:x.quantity,price:x.price,total:x.total}))})},[t,e,n]);const f=y=>{var x,T;return c.jsxs(je,{children:[c.jsxs(J,{style:{width:"100%",marginBottom:"1.5rem"},children:[c.jsx(dt,{style:{marginBottom:"1rem"},children:"Item Name"}),c.jsx(Se,{index:y,invoice:t})]}),c.jsxs(vn,{children:[c.jsxs(J,{children:[c.jsx(H,{style:{marginBottom:"0.625rem"},children:"Qty."}),c.jsx(Ee,{index:y,invoice:t})]}),c.jsxs(J,{children:[c.jsx(H,{style:{marginBottom:"0.625rem"},children:"Price"}),c.jsx(De,{index:y,invoice:t})]}),c.jsxs(xn,{style:{width:"fit-content"},children:[c.jsx(H,{style:{marginBottom:"0.625rem"},children:"Total"}),c.jsx(Ce,{children:(Number((x=d==null?void 0:d[y])==null?void 0:x.quantity)*Number((T=d==null?void 0:d[y])==null?void 0:T.price)).toFixed(2)})]})]}),c.jsxs(J,{children:[c.jsx(H,{style:{marginBottom:"0.625rem"},children:"  "}),c.jsx(we,{name:"removeButton",onClick:()=>a(y),children:Te})]})]})},g=y=>{var x,T;return c.jsx(je,{children:c.jsxs(gn,{children:[c.jsx(Se,{index:y,invoice:t}),c.jsx(Ee,{index:y,invoice:t}),c.jsx(De,{index:y,invoice:t}),c.jsx(Ce,{children:(Number((x=d==null?void 0:d[y])==null?void 0:x.quantity)*Number((T=d==null?void 0:d[y])==null?void 0:T.price)).toFixed(2)}),c.jsx(we,{name:"removeButton",onClick:()=>a(y),children:Te})]})})};return c.jsxs(c.Fragment,{children:[c.jsx("ul",{style:{listStyle:"none",marginLeft:"0",paddingLeft:0},children:r.map((y,x)=>c.jsx("li",{"data-testid":"invoice-item",children:c.jsxs("div",{children:[m<600&&f(x),m>=600&&g(x)]})},y.id))}),c.jsx(Cn,{append:l,items:t?t.items:[]})]})}di.propTypes={isDraft:ut.bool.isRequired,isEditOpen:ut.bool};const Sn=({className:t})=>c.jsxs(Tn,{className:t,children:[c.jsx(dt,{children:"Item Name"}),c.jsx(dt,{children:"Qty."}),c.jsx(dt,{children:"Price"}),c.jsx(H,{children:"Total"})]});function An({invoice:t,isEditOpen:e=!1}){const{isDraft:i}=U();return c.jsxs(wn,{"data-testid":"items-container",children:[c.jsx(Dn,{children:"Item List"}),c.jsx(Sn,{className:"desktop-only-label"}),c.jsx(En,{children:c.jsx(di,{isDraft:i,invoice:t,isEditOpen:e})})]})}const bn={items:[{name:"",price:0,quantity:0,total:0,id:""}],country:"",streetAddress:"",city:"",postalCode:"",clientCountry:"",clientName:"",clientEmail:"",clientStreetAddress:"",clientCity:"",clientPostalCode:"",projectDescription:""},Ae=t=>{const{watch:e,getValues:i,reset:s}=M(),o=e(),[u,n]=v.useState(!0);v.useEffect(()=>{u&&localStorage.setItem(t,JSON.stringify(o))},[o,u,t]);const r=()=>{const l=i();localStorage.setItem(t,JSON.stringify(l))},a=()=>{localStorage.removeItem(t),n(!1),setTimeout(()=>n(!0),1e3)};return v.useEffect(()=>{const l=localStorage.getItem(t);l&&s(JSON.parse(l))},[s,t]),{cacheFormData:r,clearCache:a}},zn=()=>{const{id:t}=Pi(),{startDate:e,setIsDraft:i,setIsNewInvoiceOpen:s,selectedPaymentOption:o,setSelectedPaymentOption:u,methods:n}=U(),{control:r,trigger:a,reset:l,watch:h,setError:d,clearErrors:m,getValues:p}=n,{replace:f}=Fe({control:r,name:"items"}),g=h(),y=Ae("cachedEditForm"),x=Ae("cachedNewInvoiceForm"),T=localStorage.getItem("theme"),[w]=Mt(Ci,{refetchQueries:[{query:ji}],onError:j=>{console.error(j)}}),[b]=Mt(Ti,{update:(j,{data:{editInvoice:z}})=>{j.writeQuery({query:wi,variables:{getInvoiceById:z.id},data:{getInvoiceById:z}})},onError:j=>{console.error(j)}}),C=()=>{x.clearCache(),u(1),l(bn),m(),s(!1)},S=async j=>{if(Di.flushSync(()=>i(!1)),j=p(),!j.items){d("items",{type:"custom",message:"An item must be added"});return}if(await a()){const F=gt(j,e,o);F.items=F.items.map(B=>({...B,quantity:Number(B.quantity),price:Number(B.price)})),F.status="pending";try{await w({variables:{...F}}),C(),f([{id:kt(),name:"",quantity:0,price:0,total:0}])}catch(B){console.error(B)}}},q=async()=>{var bt;await a();const j=n.formState.errors;if(hi(j).filter(N=>N!=="required").length>0){Ei.error("Please fix the errors before saving as draft",{position:"top-right",autoClose:2e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!1,progress:void 0,theme:T||void 0,toastId:"save-draft-error-toast"}),Rn(j,"required"),l(void 0,{keepValues:!0});for(const N in j)(bt=j[N])!=null&&bt.type&&d(N,{type:j[N].type,message:j[N].message});j.items&&(Array.isArray(j.items)?j.items:Object.values(j.items)).forEach((st,mi)=>{st&&typeof st=="object"&&Object.keys(st).forEach(Rt=>{const Z=st[Rt];Z!=null&&Z.type&&d(`items[${mi}].${Rt}`,{type:Z.type,message:Z.message})})});return}m();const B=p();B.items||(B.items=[{id:"",name:"",quantity:0,price:0,total:0}]);const At=gt(B,e,o);At.status="draft";try{await w({variables:{...At}}),C(),f([{id:kt(),name:"",quantity:0,price:0,total:0}])}catch(N){console.error(N)}},Y=async j=>{if(await a()){const F=gt(j,e,o);F.id=String(t),F.status="pending";try{await b({variables:{...F}}),y.clearCache(),s(!1)}catch(B){console.error(B)}}};return v.useEffect(()=>{g.items?m("items"):d("items",{type:"custom",message:"An item must be added"})},[g.items,d]),{methods:n,onSubmit:S,onSubmitDraft:q,onSubmitUpdate:Y}},hi=t=>{var i;const e=[];if(!t)return[];for(const s in t)(i=t[s])!=null&&i.type&&e.push(t[s].type);return t.items&&t.items instanceof Array&&t.items.forEach(s=>{s&&typeof s=="object"&&Object.keys(s).forEach(o=>{const u=s[o];u!=null&&u.type&&e.push(u.type)})}),Array.from(new Set(e))};function Rn(t,e){var i;if(t){for(const s in t)((i=t[s])==null?void 0:i.type)===e&&delete t[s];t.items&&t.items.forEach(s=>{Object.keys(s).forEach(o=>{var u;((u=s[o])==null?void 0:u.type)===e&&delete s[o]})})}}function ui({isEditOpen:t}){const{formState:{errors:e}}=M();return c.jsxs(Ai,{children:[c.jsx(It,{style:{visibility:hi(e).includes("required")&&t?"visible":"hidden"},children:"- All fields must be added"}),c.jsx(It,{style:{visibility:e.myFieldArray&&t?"visible":"hidden"},children:"- An item must be added"})]})}ui.propTypes={isEditOpen:ut.bool.isRequired};const Ln=P.form`
  position: relative;
  z-index: 1;
  padding-bottom: 6rem;

  @media (min-width: 325px) {
    padding-bottom: 0;
  }
`,Vn=ke.lazy(()=>Me(()=>import("./NewInvoiceBottomMenu-DT31go4U.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]))),In=ke.lazy(()=>Me(()=>import("./DateAndPayment-BkT9FPyq.js").then(t=>t.D),__vite__mapDeps([11,1,2,6,3,7]))),_n=()=>{const{isNewInvoiceOpen:t}=U();return c.jsxs(c.Fragment,{children:[c.jsx(bi,{children:"New Invoice"}),c.jsxs(Ln,{style:{zIndex:1,position:"relative"},children:[c.jsx(Bt,{children:"Bill From"}),c.jsx(mn,{}),c.jsx(Bt,{children:"Bill To"}),c.jsx(hn,{}),c.jsx(In,{}),c.jsx(pn,{}),c.jsx(An,{}),c.jsx(ui,{isEditOpen:t}),c.jsx(v.Suspense,{fallback:c.jsx("div",{children:"Loading..."}),children:c.jsx(Vn,{closeText:"Discard",justifyCancel:"flex-start"})})]})]})},Wn=({children:t})=>{const e=pt();let i=700;e<=616?i=e:e<=768?i=616:i=700;const s={hidden:{x:`${-i}px`},visible:{x:"0"},exit:{x:`${-i}px`}};return c.jsxs(c.Fragment,{children:[c.jsx(Pe.div,{initial:{opacity:0},animate:{opacity:.5},exit:{opacity:0},transition:{duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#000",zIndex:1e3,cursor:"pointer"}},"overlay"),c.jsx(Pe.div,{variants:s,initial:"hidden",animate:"visible",exit:"exit",transition:{type:"tween",duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:`${i}px`,height:"100%",minHeight:"100vh",color:"#ecf0f1",padding:"20px",zIndex:1001,boxShadow:"2px 0 5px rgba(0,0,0,0.3)"},children:t},"sidebar")]})};export{$n as A,mn as C,pn as D,An as E,Ln as F,_n as I,Wn as S,hn as a,ui as b,zn as c,X as d,qn as e,Ae as u};
