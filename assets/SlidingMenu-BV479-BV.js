const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/NewInvoiceBottomMenu-B9gp1Wpi.js","assets/index-D5T2xZ-E.js","assets/index-BgypsdHM.css","assets/InvoiceStatus-B_uNhklQ.js","assets/CancelButton-DfU5G90I.js","assets/NewInvoiceBottomMenuStyles-C6MpPUBZ.js","assets/editPageStyles-8CkNNUZa.js","assets/utilityFunctions-Cvv3Mn6A.js","assets/ReactToastify-PWHrxTTo.js","assets/ReactToastify-CZOjr4-t.css","assets/create-visual-element-CIJEEXC4.js","assets/DateAndPayment-CA-mqyEh.js"])))=>i.map(i=>d[i]);
import{a as v,T as fs,j as c,U as Re,V as Le,W as ys,X as Ve,Y as R,Z as I,a0 as st,a1 as Ie,a2 as ot,a3 as ut,a4 as H,a5 as Be,a6 as gs,a7 as xs,a8 as ke,a9 as vs,aa as yt,ab as gt,ac as Vt,ad as Cs,d as P,b as ft,l as Ps,g as js,ae as Ts,G as Es,af as ws,Q as Ds,ag as As,R as Me,f as Fe}from"./index-D5T2xZ-E.js";import{P as mt,e as F,c as M,f as Ss,g as Ne}from"./InvoiceStatus-B_uNhklQ.js";import{L as k,C as Oe,a as It,I as Et,S as $e,A as pt,b as bs,c as Bt,E as Rs,B as kt}from"./editPageStyles-8CkNNUZa.js";import{c as xt,v as Mt}from"./utilityFunctions-Cvv3Mn6A.js";import{u as Ft}from"./ReactToastify-PWHrxTTo.js";import{i as $,b as At,d as Ls,e as Vs,f as Ue,p as Is,s as Bs,m as ks,h as D,j as wt,k as w,l as Ms,n as Fs,o as Ns,q as Nt,r as qe,F as ze,t as Ot,u as Os,v as _e,w as We,x as He,y as $s,z as $t,S as Us,A as qs,B as z,C as rt,D as at,E as Ut,G as zs,H as _s,I as Ws,J as _,K as Hs,c as Gs,g as Xs,a as Ys}from"./create-visual-element-CIJEEXC4.js";class Zs extends v.Component{getSnapshotBeforeUpdate(e){const s=this.props.childRef.current;if(s&&e.isPresent&&!this.props.isPresent){const i=s.offsetParent,o=i instanceof HTMLElement&&i.offsetWidth||0,h=this.props.sizeRef.current;h.height=s.offsetHeight||0,h.width=s.offsetWidth||0,h.top=s.offsetTop,h.left=s.offsetLeft,h.right=o-h.width-h.left}return null}componentDidUpdate(){}render(){return this.props.children}}function Qs({children:t,isPresent:e,anchorX:s}){const i=v.useId(),o=v.useRef(null),h=v.useRef({width:0,height:0,top:0,left:0,right:0}),{nonce:n}=v.useContext(fs);return v.useInsertionEffect(()=>{const{width:r,height:a,top:l,left:d,right:u}=h.current;if(e||!o.current||!r||!a)return;const m=s==="left"?`left: ${d}`:`right: ${u}`;o.current.dataset.motionPopId=i;const p=document.createElement("style");return n&&(p.nonce=n),document.head.appendChild(p),p.sheet&&p.sheet.insertRule(`
          [data-motion-pop-id="${i}"] {
            position: absolute !important;
            width: ${r}px !important;
            height: ${a}px !important;
            ${m}px !important;
            top: ${l}px !important;
          }
        `),()=>{document.head.removeChild(p)}},[e]),c.jsx(Zs,{isPresent:e,childRef:o,sizeRef:h,children:v.cloneElement(t,{ref:o})})}const Js=({children:t,initial:e,isPresent:s,onExitComplete:i,custom:o,presenceAffectsLayout:h,mode:n,anchorX:r})=>{const a=Re(Ks),l=v.useId(),d=v.useCallback(m=>{a.set(m,!0);for(const p of a.values())if(!p)return;i&&i()},[a,i]),u=v.useMemo(()=>({id:l,initial:e,isPresent:s,custom:o,onExitComplete:d,register:m=>(a.set(m,!1),()=>a.delete(m))}),h?[Math.random(),d]:[s,d]);return v.useMemo(()=>{a.forEach((m,p)=>a.set(p,!1))},[s]),v.useEffect(()=>{!s&&!a.size&&i&&i()},[s]),n==="popLayout"&&(t=c.jsx(Qs,{isPresent:s,anchorX:r,children:t})),c.jsx(Le.Provider,{value:u,children:t})};function Ks(){return new Map}function Ge(t=!0){const e=v.useContext(Le);if(e===null)return[!0,null];const{isPresent:s,onExitComplete:i,register:o}=e,h=v.useId();v.useEffect(()=>{t&&o(h)},[t]);const n=v.useCallback(()=>t&&i&&i(h),[h,i,t]);return!s&&i?[!1,n]:[!0]}const lt=t=>t.key||"";function qt(t){const e=[];return v.Children.forEach(t,s=>{v.isValidElement(s)&&e.push(s)}),e}const Un=({children:t,custom:e,initial:s=!0,onExitComplete:i,presenceAffectsLayout:o=!0,mode:h="sync",propagate:n=!1,anchorX:r="left"})=>{const[a,l]=Ge(n),d=v.useMemo(()=>qt(t),[t]),u=n&&!a?[]:d.map(lt),m=v.useRef(!0),p=v.useRef(d),f=Re(()=>new Map),[y,x]=v.useState(d),[g,C]=v.useState(d);ys(()=>{m.current=!1,p.current=d;for(let E=0;E<g.length;E++){const A=lt(g[E]);u.includes(A)?f.delete(A):f.get(A)!==!0&&f.set(A,!1)}},[g,u.length,u.join("-")]);const j=[];if(d!==y){let E=[...d];for(let A=0;A<g.length;A++){const q=g[A],X=lt(q);u.includes(X)||(E.splice(A,0,q),j.push(q))}return h==="wait"&&j.length&&(E=j),C(qt(E)),x(d),null}const{forceRender:S}=v.useContext(Ve);return c.jsx(c.Fragment,{children:g.map(E=>{const A=lt(E),q=n&&!a?!1:d===g||u.includes(A),X=()=>{if(f.has(A))f.set(A,!0);else return;let it=!0;f.forEach(T=>{T||(it=!1)}),it&&(S==null||S(),C(p.current),n&&(l==null||l()),i&&i())};return c.jsx(Js,{isPresent:q,initial:!m.current||s?void 0:!1,custom:e,presenceAffectsLayout:o,mode:h,onExitComplete:q?void 0:X,anchorX:r,children:E},A)})})};function ti(t){if(typeof Proxy>"u")return t;const e=new Map,s=(...i)=>t(...i);return new Proxy(s,{get:(i,o)=>o==="create"?t:(e.has(o)||e.set(o,t(o)),e.get(o))})}function ei(t){return t==="x"||t==="y"?$[t]?null:($[t]=!0,()=>{$[t]=!1}):$.x||$.y?null:($.x=$.y=!0,()=>{$.x=$.y=!1})}function K(t,e,s,i){return At(t,e,Ls(s),i)}const zt=(t,e)=>Math.abs(t-e);function si(t,e){const s=zt(t.x,e.x),i=zt(t.y,e.y);return Math.sqrt(s**2+i**2)}class Xe{constructor(e,s,{transformPagePoint:i,contextWindow:o,dragSnapToOrigin:h=!1}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const u=Ct(this.lastMoveEventInfo,this.history),m=this.startEvent!==null,p=si(u.offset,{x:0,y:0})>=3;if(!m&&!p)return;const{point:f}=u,{timestamp:y}=R;this.history.push({...f,timestamp:y});const{onStart:x,onMove:g}=this.handlers;m||(x&&x(this.lastMoveEvent,u),this.startEvent=this.lastMoveEvent),g&&g(this.lastMoveEvent,u)},this.handlePointerMove=(u,m)=>{this.lastMoveEvent=u,this.lastMoveEventInfo=vt(m,this.transformPagePoint),I.update(this.updatePoint,!0)},this.handlePointerUp=(u,m)=>{this.end();const{onEnd:p,onSessionEnd:f,resumeAnimation:y}=this.handlers;if(this.dragSnapToOrigin&&y&&y(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const x=Ct(u.type==="pointercancel"?this.lastMoveEventInfo:vt(m,this.transformPagePoint),this.history);this.startEvent&&p&&p(u,x),f&&f(u,x)},!Vs(e))return;this.dragSnapToOrigin=h,this.handlers=s,this.transformPagePoint=i,this.contextWindow=o||window;const n=Ue(e),r=vt(n,this.transformPagePoint),{point:a}=r,{timestamp:l}=R;this.history=[{...a,timestamp:l}];const{onSessionStart:d}=s;d&&d(e,Ct(r,this.history)),this.removeListeners=Is(K(this.contextWindow,"pointermove",this.handlePointerMove),K(this.contextWindow,"pointerup",this.handlePointerUp),K(this.contextWindow,"pointercancel",this.handlePointerUp))}updateHandlers(e){this.handlers=e}end(){this.removeListeners&&this.removeListeners(),st(this.updatePoint)}}function vt(t,e){return e?{point:e(t.point)}:t}function _t(t,e){return{x:t.x-e.x,y:t.y-e.y}}function Ct({point:t},e){return{point:t,delta:_t(t,Ye(e)),offset:_t(t,ii(e)),velocity:ni(e,.1)}}function ii(t){return t[0]}function Ye(t){return t[t.length-1]}function ni(t,e){if(t.length<2)return{x:0,y:0};let s=t.length-1,i=null;const o=Ye(t);for(;s>=0&&(i=t[s],!(o.timestamp-i.timestamp>Bs(e)));)s--;if(!i)return{x:0,y:0};const h=ks(o.timestamp-i.timestamp);if(h===0)return{x:0,y:0};const n={x:(o.x-i.x)/h,y:(o.y-i.y)/h};return n.x===1/0&&(n.x=0),n.y===1/0&&(n.y=0),n}const Ze=1e-4,oi=1-Ze,ri=1+Ze,Qe=.01,ai=0-Qe,li=0+Qe;function b(t){return t.max-t.min}function ci(t,e,s){return Math.abs(t-e)<=s}function Wt(t,e,s,i=.5){t.origin=i,t.originPoint=D(e.min,e.max,t.origin),t.scale=b(s)/b(e),t.translate=D(s.min,s.max,t.origin)-t.originPoint,(t.scale>=oi&&t.scale<=ri||isNaN(t.scale))&&(t.scale=1),(t.translate>=ai&&t.translate<=li||isNaN(t.translate))&&(t.translate=0)}function tt(t,e,s,i){Wt(t.x,e.x,s.x,i?i.originX:void 0),Wt(t.y,e.y,s.y,i?i.originY:void 0)}function Ht(t,e,s){t.min=s.min+e.min,t.max=t.min+b(e)}function di(t,e,s){Ht(t.x,e.x,s.x),Ht(t.y,e.y,s.y)}function Gt(t,e,s){t.min=e.min-s.min,t.max=t.min+b(e)}function et(t,e,s){Gt(t.x,e.x,s.x),Gt(t.y,e.y,s.y)}function hi(t,{min:e,max:s},i){return e!==void 0&&t<e?t=i?D(e,t,i.min):Math.max(t,e):s!==void 0&&t>s&&(t=i?D(s,t,i.max):Math.min(t,s)),t}function Xt(t,e,s){return{min:e!==void 0?t.min+e:void 0,max:s!==void 0?t.max+s-(t.max-t.min):void 0}}function ui(t,{top:e,left:s,bottom:i,right:o}){return{x:Xt(t.x,s,o),y:Xt(t.y,e,i)}}function Yt(t,e){let s=e.min-t.min,i=e.max-t.max;return e.max-e.min<t.max-t.min&&([s,i]=[i,s]),{min:s,max:i}}function mi(t,e){return{x:Yt(t.x,e.x),y:Yt(t.y,e.y)}}function pi(t,e){let s=.5;const i=b(t),o=b(e);return o>i?s=wt(e.min,e.max-i,t.min):i>o&&(s=wt(t.min,t.max-o,e.min)),Ie(0,1,s)}function fi(t,e){const s={};return e.min!==void 0&&(s.min=e.min-t.min),e.max!==void 0&&(s.max=e.max-t.min),s}const Dt=.35;function yi(t=Dt){return t===!1?t=0:t===!0&&(t=Dt),{x:Zt(t,"left","right"),y:Zt(t,"top","bottom")}}function Zt(t,e,s){return{min:Qt(t,e),max:Qt(t,s)}}function Qt(t,e){return typeof t=="number"?t:t[e]||0}function V(t){return[t("x"),t("y")]}const Je=({current:t})=>t?t.ownerDocument.defaultView:null,gi=new WeakMap;class xi{constructor(e){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=w(),this.visualElement=e}start(e,{snapToCursor:s=!1}={}){const{presenceContext:i}=this.visualElement;if(i&&i.isPresent===!1)return;const o=d=>{const{dragSnapToOrigin:u}=this.getProps();u?this.pauseAnimation():this.stopAnimation(),s&&this.snapToCursor(Ue(d).point)},h=(d,u)=>{const{drag:m,dragPropagation:p,onDragStart:f}=this.getProps();if(m&&!p&&(this.openDragLock&&this.openDragLock(),this.openDragLock=ei(m),!this.openDragLock))return;this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),V(x=>{let g=this.getAxisMotionValue(x).get()||0;if(ut.test(g)){const{projection:C}=this.visualElement;if(C&&C.layout){const j=C.layout.layoutBox[x];j&&(g=b(j)*(parseFloat(g)/100))}}this.originPoint[x]=g}),f&&I.postRender(()=>f(d,u)),Nt(this.visualElement,"transform");const{animationState:y}=this.visualElement;y&&y.setActive("whileDrag",!0)},n=(d,u)=>{const{dragPropagation:m,dragDirectionLock:p,onDirectionLock:f,onDrag:y}=this.getProps();if(!m&&!this.openDragLock)return;const{offset:x}=u;if(p&&this.currentDirection===null){this.currentDirection=vi(x),this.currentDirection!==null&&f&&f(this.currentDirection);return}this.updateAxis("x",u.point,x),this.updateAxis("y",u.point,x),this.visualElement.render(),y&&y(d,u)},r=(d,u)=>this.stop(d,u),a=()=>V(d=>{var u;return this.getAnimationState(d)==="paused"&&((u=this.getAxisMotionValue(d).animation)===null||u===void 0?void 0:u.play())}),{dragSnapToOrigin:l}=this.getProps();this.panSession=new Xe(e,{onSessionStart:o,onStart:h,onMove:n,onSessionEnd:r,resumeAnimation:a},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:l,contextWindow:Je(this.visualElement)})}stop(e,s){const i=this.isDragging;if(this.cancel(),!i)return;const{velocity:o}=s;this.startAnimation(o);const{onDragEnd:h}=this.getProps();h&&I.postRender(()=>h(e,s))}cancel(){this.isDragging=!1;const{projection:e,animationState:s}=this.visualElement;e&&(e.isAnimationBlocked=!1),this.panSession&&this.panSession.end(),this.panSession=void 0;const{dragPropagation:i}=this.getProps();!i&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),s&&s.setActive("whileDrag",!1)}updateAxis(e,s,i){const{drag:o}=this.getProps();if(!i||!ct(e,o,this.currentDirection))return;const h=this.getAxisMotionValue(e);let n=this.originPoint[e]+i[e];this.constraints&&this.constraints[e]&&(n=hi(n,this.constraints[e],this.elastic[e])),h.set(n)}resolveConstraints(){var e;const{dragConstraints:s,dragElastic:i}=this.getProps(),o=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(e=this.visualElement.projection)===null||e===void 0?void 0:e.layout,h=this.constraints;s&&ot(s)?this.constraints||(this.constraints=this.resolveRefConstraints()):s&&o?this.constraints=ui(o.layoutBox,s):this.constraints=!1,this.elastic=yi(i),h!==this.constraints&&o&&this.constraints&&!this.hasMutatedConstraints&&V(n=>{this.constraints!==!1&&this.getAxisMotionValue(n)&&(this.constraints[n]=fi(o.layoutBox[n],this.constraints[n]))})}resolveRefConstraints(){const{dragConstraints:e,onMeasureDragConstraints:s}=this.getProps();if(!e||!ot(e))return!1;const i=e.current,{projection:o}=this.visualElement;if(!o||!o.layout)return!1;const h=Ms(i,o.root,this.visualElement.getTransformPagePoint());let n=mi(o.layout.layoutBox,h);if(s){const r=s(Fs(n));this.hasMutatedConstraints=!!r,r&&(n=Ns(r))}return n}startAnimation(e){const{drag:s,dragMomentum:i,dragElastic:o,dragTransition:h,dragSnapToOrigin:n,onDragTransitionEnd:r}=this.getProps(),a=this.constraints||{},l=V(d=>{if(!ct(d,s,this.currentDirection))return;let u=a&&a[d]||{};n&&(u={min:0,max:0});const m=o?200:1e6,p=o?40:1e7,f={type:"inertia",velocity:i?e[d]:0,bounceStiffness:m,bounceDamping:p,timeConstant:750,restDelta:1,restSpeed:10,...h,...u};return this.startAxisValueAnimation(d,f)});return Promise.all(l).then(r)}startAxisValueAnimation(e,s){const i=this.getAxisMotionValue(e);return Nt(this.visualElement,e),i.start(qe(e,i,0,s,this.visualElement,!1))}stopAnimation(){V(e=>this.getAxisMotionValue(e).stop())}pauseAnimation(){V(e=>{var s;return(s=this.getAxisMotionValue(e).animation)===null||s===void 0?void 0:s.pause()})}getAnimationState(e){var s;return(s=this.getAxisMotionValue(e).animation)===null||s===void 0?void 0:s.state}getAxisMotionValue(e){const s=`_drag${e.toUpperCase()}`,i=this.visualElement.getProps(),o=i[s];return o||this.visualElement.getValue(e,(i.initial?i.initial[e]:void 0)||0)}snapToCursor(e){V(s=>{const{drag:i}=this.getProps();if(!ct(s,i,this.currentDirection))return;const{projection:o}=this.visualElement,h=this.getAxisMotionValue(s);if(o&&o.layout){const{min:n,max:r}=o.layout.layoutBox[s];h.set(e[s]-D(n,r,.5))}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:e,dragConstraints:s}=this.getProps(),{projection:i}=this.visualElement;if(!ot(s)||!i||!this.constraints)return;this.stopAnimation();const o={x:0,y:0};V(n=>{const r=this.getAxisMotionValue(n);if(r&&this.constraints!==!1){const a=r.get();o[n]=pi({min:a,max:a},this.constraints[n])}});const{transformTemplate:h}=this.visualElement.getProps();this.visualElement.current.style.transform=h?h({},""):"none",i.root&&i.root.updateScroll(),i.updateLayout(),this.resolveConstraints(),V(n=>{if(!ct(n,e,null))return;const r=this.getAxisMotionValue(n),{min:a,max:l}=this.constraints[n];r.set(D(a,l,o[n]))})}addListeners(){if(!this.visualElement.current)return;gi.set(this.visualElement,this);const e=this.visualElement.current,s=K(e,"pointerdown",a=>{const{drag:l,dragListener:d=!0}=this.getProps();l&&d&&this.start(a)}),i=()=>{const{dragConstraints:a}=this.getProps();ot(a)&&a.current&&(this.constraints=this.resolveRefConstraints())},{projection:o}=this.visualElement,h=o.addEventListener("measure",i);o&&!o.layout&&(o.root&&o.root.updateScroll(),o.updateLayout()),I.read(i);const n=At(window,"resize",()=>this.scalePositionWithinConstraints()),r=o.addEventListener("didUpdate",({delta:a,hasLayoutChanged:l})=>{this.isDragging&&l&&(V(d=>{const u=this.getAxisMotionValue(d);u&&(this.originPoint[d]+=a[d].translate,u.set(u.get()+a[d].translate))}),this.visualElement.render())});return()=>{n(),s(),h(),r&&r()}}getProps(){const e=this.visualElement.getProps(),{drag:s=!1,dragDirectionLock:i=!1,dragPropagation:o=!1,dragConstraints:h=!1,dragElastic:n=Dt,dragMomentum:r=!0}=e;return{...e,drag:s,dragDirectionLock:i,dragPropagation:o,dragConstraints:h,dragElastic:n,dragMomentum:r}}}function ct(t,e,s){return(e===!0||e===t)&&(s===null||s===t)}function vi(t,e=10){let s=null;return Math.abs(t.y)>e?s="y":Math.abs(t.x)>e&&(s="x"),s}class Ci extends ze{constructor(e){super(e),this.removeGroupControls=H,this.removeListeners=H,this.controls=new xi(e)}mount(){const{dragControls:e}=this.node.getProps();e&&(this.removeGroupControls=e.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||H}unmount(){this.removeGroupControls(),this.removeListeners()}}const Jt=t=>(e,s)=>{t&&I.postRender(()=>t(e,s))};class Pi extends ze{constructor(){super(...arguments),this.removePointerDownListener=H}onPointerDown(e){this.session=new Xe(e,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:Je(this.node)})}createPanHandlers(){const{onPanSessionStart:e,onPanStart:s,onPan:i,onPanEnd:o}=this.node.getProps();return{onSessionStart:Jt(e),onStart:Jt(s),onMove:i,onEnd:(h,n)=>{delete this.session,o&&I.postRender(()=>o(h,n))}}}mount(){this.removePointerDownListener=K(this.node.current,"pointerdown",e=>this.onPointerDown(e))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}const dt={hasAnimatedSinceResize:!0,hasEverUpdated:!1};function Kt(t,e){return e.max===e.min?0:t/(e.max-e.min)*100}const Q={correct:(t,e)=>{if(!e.target)return t;if(typeof t=="string")if(Be.test(t))t=parseFloat(t);else return t;const s=Kt(t,e.target.x),i=Kt(t,e.target.y);return`${s}% ${i}%`}},ji={correct:(t,{treeScale:e,projectionDelta:s})=>{const i=t,o=Ot.parse(t);if(o.length>5)return i;const h=Ot.createTransformer(t),n=typeof o[0]!="number"?1:0,r=s.x.scale*e.x,a=s.y.scale*e.y;o[0+n]/=r,o[1+n]/=a;const l=D(r,a,.5);return typeof o[2+n]=="number"&&(o[2+n]/=l),typeof o[3+n]=="number"&&(o[3+n]/=l),h(o)}};class Ti extends v.Component{componentDidMount(){const{visualElement:e,layoutGroup:s,switchLayoutGroup:i,layoutId:o}=this.props,{projection:h}=e;xs(Ei),h&&(s.group&&s.group.add(h),i&&i.register&&o&&i.register(h),h.root.didUpdate(),h.addEventListener("animationComplete",()=>{this.safeToRemove()}),h.setOptions({...h.options,onExitComplete:()=>this.safeToRemove()})),dt.hasEverUpdated=!0}getSnapshotBeforeUpdate(e){const{layoutDependency:s,visualElement:i,drag:o,isPresent:h}=this.props,n=i.projection;return n&&(n.isPresent=h,o||e.layoutDependency!==s||s===void 0?n.willUpdate():this.safeToRemove(),e.isPresent!==h&&(h?n.promote():n.relegate()||I.postRender(()=>{const r=n.getStack();(!r||!r.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{projection:e}=this.props.visualElement;e&&(e.root.didUpdate(),ke.postRender(()=>{!e.currentAnimation&&e.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:e,layoutGroup:s,switchLayoutGroup:i}=this.props,{projection:o}=e;o&&(o.scheduleCheckAfterUnmount(),s&&s.group&&s.group.remove(o),i&&i.deregister&&i.deregister(o))}safeToRemove(){const{safeToRemove:e}=this.props;e&&e()}render(){return null}}function Ke(t){const[e,s]=Ge(),i=v.useContext(Ve);return c.jsx(Ti,{...t,layoutGroup:i,switchLayoutGroup:v.useContext(gs),isPresent:e,safeToRemove:s})}const Ei={borderRadius:{...Q,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:Q,borderTopRightRadius:Q,borderBottomLeftRadius:Q,borderBottomRightRadius:Q,boxShadow:ji};function wi(t,e,s){const i=vs(t)?t:Os(t);return i.start(qe("",i,e,s)),i.animation}function Di(t){return t instanceof SVGElement&&t.tagName!=="svg"}const Ai=(t,e)=>t.depth-e.depth;class Si{constructor(){this.children=[],this.isDirty=!1}add(e){_e(this.children,e),this.isDirty=!0}remove(e){We(this.children,e),this.isDirty=!0}forEach(e){this.isDirty&&this.children.sort(Ai),this.isDirty=!1,this.children.forEach(e)}}function bi(t,e){const s=He.now(),i=({timestamp:o})=>{const h=o-s;h>=e&&(st(i),t(h-e))};return I.read(i,!0),()=>st(i)}const ts=["TopLeft","TopRight","BottomLeft","BottomRight"],Ri=ts.length,te=t=>typeof t=="string"?parseFloat(t):t,ee=t=>typeof t=="number"||Be.test(t);function Li(t,e,s,i,o,h){o?(t.opacity=D(0,s.opacity!==void 0?s.opacity:1,Vi(i)),t.opacityExit=D(e.opacity!==void 0?e.opacity:1,0,Ii(i))):h&&(t.opacity=D(e.opacity!==void 0?e.opacity:1,s.opacity!==void 0?s.opacity:1,i));for(let n=0;n<Ri;n++){const r=`border${ts[n]}Radius`;let a=se(e,r),l=se(s,r);if(a===void 0&&l===void 0)continue;a||(a=0),l||(l=0),a===0||l===0||ee(a)===ee(l)?(t[r]=Math.max(D(te(a),te(l),i),0),(ut.test(l)||ut.test(a))&&(t[r]+="%")):t[r]=l}(e.rotate||s.rotate)&&(t.rotate=D(e.rotate||0,s.rotate||0,i))}function se(t,e){return t[e]!==void 0?t[e]:t.borderRadius}const Vi=es(0,.5,$s),Ii=es(.5,.95,H);function es(t,e,s){return i=>i<t?0:i>e?1:s(wt(t,e,i))}function ie(t,e){t.min=e.min,t.max=e.max}function L(t,e){ie(t.x,e.x),ie(t.y,e.y)}function ne(t,e){t.translate=e.translate,t.scale=e.scale,t.originPoint=e.originPoint,t.origin=e.origin}function oe(t,e,s,i,o){return t-=e,t=$t(t,1/s,i),o!==void 0&&(t=$t(t,1/o,i)),t}function Bi(t,e=0,s=1,i=.5,o,h=t,n=t){if(ut.test(e)&&(e=parseFloat(e),e=D(n.min,n.max,e/100)-n.min),typeof e!="number")return;let r=D(h.min,h.max,i);t===h&&(r-=e),t.min=oe(t.min,e,s,r,o),t.max=oe(t.max,e,s,r,o)}function re(t,e,[s,i,o],h,n){Bi(t,e[s],e[i],e[o],e.scale,h,n)}const ki=["x","scaleX","originX"],Mi=["y","scaleY","originY"];function ae(t,e,s,i){re(t.x,e,ki,s?s.x:void 0,i?i.x:void 0),re(t.y,e,Mi,s?s.y:void 0,i?i.y:void 0)}function le(t){return t.translate===0&&t.scale===1}function ss(t){return le(t.x)&&le(t.y)}function ce(t,e){return t.min===e.min&&t.max===e.max}function Fi(t,e){return ce(t.x,e.x)&&ce(t.y,e.y)}function de(t,e){return Math.round(t.min)===Math.round(e.min)&&Math.round(t.max)===Math.round(e.max)}function is(t,e){return de(t.x,e.x)&&de(t.y,e.y)}function he(t){return b(t.x)/b(t.y)}function ue(t,e){return t.translate===e.translate&&t.scale===e.scale&&t.originPoint===e.originPoint}class Ni{constructor(){this.members=[]}add(e){_e(this.members,e),e.scheduleRender()}remove(e){if(We(this.members,e),e===this.prevLead&&(this.prevLead=void 0),e===this.lead){const s=this.members[this.members.length-1];s&&this.promote(s)}}relegate(e){const s=this.members.findIndex(o=>e===o);if(s===0)return!1;let i;for(let o=s;o>=0;o--){const h=this.members[o];if(h.isPresent!==!1){i=h;break}}return i?(this.promote(i),!0):!1}promote(e,s){const i=this.lead;if(e!==i&&(this.prevLead=i,this.lead=e,e.show(),i)){i.instance&&i.scheduleRender(),e.scheduleRender(),e.resumeFrom=i,s&&(e.resumeFrom.preserveOpacity=!0),i.snapshot&&(e.snapshot=i.snapshot,e.snapshot.latestValues=i.animationValues||i.latestValues),e.root&&e.root.isUpdating&&(e.isLayoutDirty=!0);const{crossfade:o}=e.options;o===!1&&i.hide()}}exitAnimationComplete(){this.members.forEach(e=>{const{options:s,resumingFrom:i}=e;s.onExitComplete&&s.onExitComplete(),i&&i.options.onExitComplete&&i.options.onExitComplete()})}scheduleRender(){this.members.forEach(e=>{e.instance&&e.scheduleRender(!1)})}removeLeadSnapshot(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)}}function Oi(t,e,s){let i="";const o=t.x.translate/e.x,h=t.y.translate/e.y,n=(s==null?void 0:s.z)||0;if((o||h||n)&&(i=`translate3d(${o}px, ${h}px, ${n}px) `),(e.x!==1||e.y!==1)&&(i+=`scale(${1/e.x}, ${1/e.y}) `),s){const{transformPerspective:l,rotate:d,rotateX:u,rotateY:m,skewX:p,skewY:f}=s;l&&(i=`perspective(${l}px) ${i}`),d&&(i+=`rotate(${d}deg) `),u&&(i+=`rotateX(${u}deg) `),m&&(i+=`rotateY(${m}deg) `),p&&(i+=`skewX(${p}deg) `),f&&(i+=`skewY(${f}deg) `)}const r=t.x.scale*e.x,a=t.y.scale*e.y;return(r!==1||a!==1)&&(i+=`scale(${r}, ${a})`),i||"none"}const Pt=["","X","Y","Z"],$i={visibility:"hidden"},me=1e3;let Ui=0;function jt(t,e,s,i){const{latestValues:o}=e;o[t]&&(s[t]=o[t],e.setStaticValue(t,0),i&&(i[t]=0))}function ns(t){if(t.hasCheckedOptimisedAppear=!0,t.root===t)return;const{visualElement:e}=t.options;if(!e)return;const s=Hs(e);if(window.MotionHasOptimisedAnimation(s,"transform")){const{layout:o,layoutId:h}=t.options;window.MotionCancelOptimisedAnimation(s,"transform",I,!(o||h))}const{parent:i}=t;i&&!i.hasCheckedOptimisedAppear&&ns(i)}function os({attachResizeListener:t,defaultParent:e,measureScroll:s,checkIsScrollRoot:i,resetTransform:o}){return class{constructor(n={},r=e==null?void 0:e()){this.id=Ui++,this.animationId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(_i),this.nodes.forEach(Yi),this.nodes.forEach(Zi),this.nodes.forEach(Wi)},this.resolvedRelativeTargetAt=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=n,this.root=r?r.root||r:this,this.path=r?[...r.path,r]:[],this.parent=r,this.depth=r?r.depth+1:0;for(let a=0;a<this.path.length;a++)this.path[a].shouldResetTransform=!0;this.root===this&&(this.nodes=new Si)}addEventListener(n,r){return this.eventHandlers.has(n)||this.eventHandlers.set(n,new Us),this.eventHandlers.get(n).add(r)}notifyListeners(n,...r){const a=this.eventHandlers.get(n);a&&a.notify(...r)}hasListeners(n){return this.eventHandlers.has(n)}mount(n,r=this.root.hasTreeAnimated){if(this.instance)return;this.isSVG=Di(n),this.instance=n;const{layoutId:a,layout:l,visualElement:d}=this.options;if(d&&!d.current&&d.mount(n),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),r&&(l||a)&&(this.isLayoutDirty=!0),t){let u;const m=()=>this.root.updateBlockedByResize=!1;t(n,()=>{this.root.updateBlockedByResize=!0,u&&u(),u=bi(m,250),dt.hasAnimatedSinceResize&&(dt.hasAnimatedSinceResize=!1,this.nodes.forEach(fe))})}a&&this.root.registerSharedNode(a,this),this.options.animate!==!1&&d&&(a||l)&&this.addEventListener("didUpdate",({delta:u,hasLayoutChanged:m,hasRelativeLayoutChanged:p,layout:f})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const y=this.options.transition||d.getDefaultTransition()||en,{onLayoutAnimationStart:x,onLayoutAnimationComplete:g}=d.getProps(),C=!this.targetLayout||!is(this.targetLayout,f),j=!m&&p;if(this.options.layoutRoot||this.resumeFrom||j||m&&(C||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0),this.setAnimationOrigin(u,j);const S={...qs(y,"layout"),onPlay:x,onComplete:g};(d.shouldReduceMotion||this.options.layoutRoot)&&(S.delay=0,S.type=!1),this.startAnimation(S)}else m||fe(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=f})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const n=this.getStack();n&&n.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,st(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(Qi),this.animationId++)}getTransformTemplate(){const{visualElement:n}=this.options;return n&&n.getProps().transformTemplate}willUpdate(n=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&ns(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let d=0;d<this.path.length;d++){const u=this.path[d];u.shouldResetTransform=!0,u.updateScroll("snapshot"),u.options.layoutRoot&&u.willUpdate(!1)}const{layoutId:r,layout:a}=this.options;if(r===void 0&&!a)return;const l=this.getTransformTemplate();this.prevTransformTemplateValue=l?l(this.latestValues,""):void 0,this.updateSnapshot(),n&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(pe);return}this.isUpdating||this.nodes.forEach(Gi),this.isUpdating=!1,this.nodes.forEach(Xi),this.nodes.forEach(qi),this.nodes.forEach(zi),this.clearAllSnapshots();const r=He.now();R.delta=Ie(0,1e3/60,r-R.timestamp),R.timestamp=r,R.isProcessing=!0,yt.update.process(R),yt.preRender.process(R),yt.render.process(R),R.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,ke.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(Hi),this.sharedNodes.forEach(Ji)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,I.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){I.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!b(this.snapshot.measuredBox.x)&&!b(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let a=0;a<this.path.length;a++)this.path[a].updateScroll();const n=this.layout;this.layout=this.measure(!1),this.layoutCorrected=w(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:r}=this.options;r&&r.notify("LayoutMeasure",this.layout.layoutBox,n?n.layoutBox:void 0)}updateScroll(n="measure"){let r=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===n&&(r=!1),r){const a=i(this.instance);this.scroll={animationId:this.root.animationId,phase:n,isRoot:a,offset:s(this.instance),wasRoot:this.scroll?this.scroll.isRoot:a}}}resetTransform(){if(!o)return;const n=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,r=this.projectionDelta&&!ss(this.projectionDelta),a=this.getTransformTemplate(),l=a?a(this.latestValues,""):void 0,d=l!==this.prevTransformTemplateValue;n&&(r||z(this.latestValues)||d)&&(o(this.instance,l),this.shouldResetTransform=!1,this.scheduleRender())}measure(n=!0){const r=this.measurePageBox();let a=this.removeElementScroll(r);return n&&(a=this.removeTransform(a)),sn(a),{animationId:this.root.animationId,measuredBox:r,layoutBox:a,latestValues:{},source:this.id}}measurePageBox(){var n;const{visualElement:r}=this.options;if(!r)return w();const a=r.measureViewportBox();if(!(((n=this.scroll)===null||n===void 0?void 0:n.wasRoot)||this.path.some(nn))){const{scroll:d}=this.root;d&&(rt(a.x,d.offset.x),rt(a.y,d.offset.y))}return a}removeElementScroll(n){var r;const a=w();if(L(a,n),!((r=this.scroll)===null||r===void 0)&&r.wasRoot)return a;for(let l=0;l<this.path.length;l++){const d=this.path[l],{scroll:u,options:m}=d;d!==this.root&&u&&m.layoutScroll&&(u.wasRoot&&L(a,n),rt(a.x,u.offset.x),rt(a.y,u.offset.y))}return a}applyTransform(n,r=!1){const a=w();L(a,n);for(let l=0;l<this.path.length;l++){const d=this.path[l];!r&&d.options.layoutScroll&&d.scroll&&d!==d.root&&at(a,{x:-d.scroll.offset.x,y:-d.scroll.offset.y}),z(d.latestValues)&&at(a,d.latestValues)}return z(this.latestValues)&&at(a,this.latestValues),a}removeTransform(n){const r=w();L(r,n);for(let a=0;a<this.path.length;a++){const l=this.path[a];if(!l.instance||!z(l.latestValues))continue;Ut(l.latestValues)&&l.updateSnapshot();const d=w(),u=l.measurePageBox();L(d,u),ae(r,l.latestValues,l.snapshot?l.snapshot.layoutBox:void 0,d)}return z(this.latestValues)&&ae(r,this.latestValues),r}setTargetDelta(n){this.targetDelta=n,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(n){this.options={...this.options,...n,crossfade:n.crossfade!==void 0?n.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==R.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(n=!1){var r;const a=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=a.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=a.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=a.isSharedProjectionDirty);const l=!!this.resumingFrom||this!==a;if(!(n||l&&this.isSharedProjectionDirty||this.isProjectionDirty||!((r=this.parent)===null||r===void 0)&&r.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:u,layoutId:m}=this.options;if(!(!this.layout||!(u||m))){if(this.resolvedRelativeTargetAt=R.timestamp,!this.targetDelta&&!this.relativeTarget){const p=this.getClosestProjectingParent();p&&p.layout&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=w(),this.relativeTargetOrigin=w(),et(this.relativeTargetOrigin,this.layout.layoutBox,p.layout.layoutBox),L(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}if(!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=w(),this.targetWithTransforms=w()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),di(this.target,this.relativeTarget,this.relativeParent.target)):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.layoutBox):L(this.target,this.layout.layoutBox),zs(this.target,this.targetDelta)):L(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget)){this.attemptToResolveRelativeTarget=!1;const p=this.getClosestProjectingParent();p&&!!p.resumingFrom==!!this.resumingFrom&&!p.options.layoutScroll&&p.target&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=w(),this.relativeTargetOrigin=w(),et(this.relativeTargetOrigin,this.target,p.target),L(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}}}getClosestProjectingParent(){if(!(!this.parent||Ut(this.parent.latestValues)||_s(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}calcProjection(){var n;const r=this.getLead(),a=!!this.resumingFrom||this!==r;let l=!0;if((this.isProjectionDirty||!((n=this.parent)===null||n===void 0)&&n.isProjectionDirty)&&(l=!1),a&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(l=!1),this.resolvedRelativeTargetAt===R.timestamp&&(l=!1),l)return;const{layout:d,layoutId:u}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(d||u))return;L(this.layoutCorrected,this.layout.layoutBox);const m=this.treeScale.x,p=this.treeScale.y;Ws(this.layoutCorrected,this.treeScale,this.path,a),r.layout&&!r.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(r.target=r.layout.layoutBox,r.targetWithTransforms=w());const{target:f}=r;if(!f){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(ne(this.prevProjectionDelta.x,this.projectionDelta.x),ne(this.prevProjectionDelta.y,this.projectionDelta.y)),tt(this.projectionDelta,this.layoutCorrected,f,this.latestValues),(this.treeScale.x!==m||this.treeScale.y!==p||!ue(this.projectionDelta.x,this.prevProjectionDelta.x)||!ue(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",f))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(n=!0){var r;if((r=this.options.visualElement)===null||r===void 0||r.scheduleRender(),n){const a=this.getStack();a&&a.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=_(),this.projectionDelta=_(),this.projectionDeltaWithTransform=_()}setAnimationOrigin(n,r=!1){const a=this.snapshot,l=a?a.latestValues:{},d={...this.latestValues},u=_();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!r;const m=w(),p=a?a.source:void 0,f=this.layout?this.layout.source:void 0,y=p!==f,x=this.getStack(),g=!x||x.members.length<=1,C=!!(y&&!g&&this.options.crossfade===!0&&!this.path.some(tn));this.animationProgress=0;let j;this.mixTargetDelta=S=>{const E=S/1e3;ye(u.x,n.x,E),ye(u.y,n.y,E),this.setTargetDelta(u),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(et(m,this.layout.layoutBox,this.relativeParent.layout.layoutBox),Ki(this.relativeTarget,this.relativeTargetOrigin,m,E),j&&Fi(this.relativeTarget,j)&&(this.isProjectionDirty=!1),j||(j=w()),L(j,this.relativeTarget)),y&&(this.animationValues=d,Li(d,l,this.latestValues,E,C,g)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=E},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(n){this.notifyListeners("animationStart"),this.currentAnimation&&this.currentAnimation.stop(),this.resumingFrom&&this.resumingFrom.currentAnimation&&this.resumingFrom.currentAnimation.stop(),this.pendingAnimation&&(st(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=I.update(()=>{dt.hasAnimatedSinceResize=!0,this.currentAnimation=wi(0,me,{...n,onUpdate:r=>{this.mixTargetDelta(r),n.onUpdate&&n.onUpdate(r)},onStop:()=>{},onComplete:()=>{n.onComplete&&n.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const n=this.getStack();n&&n.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(me),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const n=this.getLead();let{targetWithTransforms:r,target:a,layout:l,latestValues:d}=n;if(!(!r||!a||!l)){if(this!==n&&this.layout&&l&&rs(this.options.animationType,this.layout.layoutBox,l.layoutBox)){a=this.target||w();const u=b(this.layout.layoutBox.x);a.x.min=n.target.x.min,a.x.max=a.x.min+u;const m=b(this.layout.layoutBox.y);a.y.min=n.target.y.min,a.y.max=a.y.min+m}L(r,a),at(r,d),tt(this.projectionDeltaWithTransform,this.layoutCorrected,r,d)}}registerSharedNode(n,r){this.sharedNodes.has(n)||this.sharedNodes.set(n,new Ni),this.sharedNodes.get(n).add(r);const l=r.options.initialPromotionConfig;r.promote({transition:l?l.transition:void 0,preserveFollowOpacity:l&&l.shouldPreserveFollowOpacity?l.shouldPreserveFollowOpacity(r):void 0})}isLead(){const n=this.getStack();return n?n.lead===this:!0}getLead(){var n;const{layoutId:r}=this.options;return r?((n=this.getStack())===null||n===void 0?void 0:n.lead)||this:this}getPrevLead(){var n;const{layoutId:r}=this.options;return r?(n=this.getStack())===null||n===void 0?void 0:n.prevLead:void 0}getStack(){const{layoutId:n}=this.options;if(n)return this.root.sharedNodes.get(n)}promote({needsReset:n,transition:r,preserveFollowOpacity:a}={}){const l=this.getStack();l&&l.promote(this,a),n&&(this.projectionDelta=void 0,this.needsReset=!0),r&&this.setOptions({transition:r})}relegate(){const n=this.getStack();return n?n.relegate(this):!1}resetSkewAndRotation(){const{visualElement:n}=this.options;if(!n)return;let r=!1;const{latestValues:a}=n;if((a.z||a.rotate||a.rotateX||a.rotateY||a.rotateZ||a.skewX||a.skewY)&&(r=!0),!r)return;const l={};a.z&&jt("z",n,l,this.animationValues);for(let d=0;d<Pt.length;d++)jt(`rotate${Pt[d]}`,n,l,this.animationValues),jt(`skew${Pt[d]}`,n,l,this.animationValues);n.render();for(const d in l)n.setStaticValue(d,l[d]),this.animationValues&&(this.animationValues[d]=l[d]);n.scheduleRender()}getProjectionStyles(n){var r,a;if(!this.instance||this.isSVG)return;if(!this.isVisible)return $i;const l={visibility:""},d=this.getTransformTemplate();if(this.needsReset)return this.needsReset=!1,l.opacity="",l.pointerEvents=gt(n==null?void 0:n.pointerEvents)||"",l.transform=d?d(this.latestValues,""):"none",l;const u=this.getLead();if(!this.projectionDelta||!this.layout||!u.target){const y={};return this.options.layoutId&&(y.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,y.pointerEvents=gt(n==null?void 0:n.pointerEvents)||""),this.hasProjected&&!z(this.latestValues)&&(y.transform=d?d({},""):"none",this.hasProjected=!1),y}const m=u.animationValues||u.latestValues;this.applyTransformsToTarget(),l.transform=Oi(this.projectionDeltaWithTransform,this.treeScale,m),d&&(l.transform=d(m,l.transform));const{x:p,y:f}=this.projectionDelta;l.transformOrigin=`${p.origin*100}% ${f.origin*100}% 0`,u.animationValues?l.opacity=u===this?(a=(r=m.opacity)!==null&&r!==void 0?r:this.latestValues.opacity)!==null&&a!==void 0?a:1:this.preserveOpacity?this.latestValues.opacity:m.opacityExit:l.opacity=u===this?m.opacity!==void 0?m.opacity:"":m.opacityExit!==void 0?m.opacityExit:0;for(const y in Vt){if(m[y]===void 0)continue;const{correct:x,applyTo:g,isCSSVariable:C}=Vt[y],j=l.transform==="none"?m[y]:x(m[y],u);if(g){const S=g.length;for(let E=0;E<S;E++)l[g[E]]=j}else C?this.options.visualElement.renderState.vars[y]=j:l[y]=j}return this.options.layoutId&&(l.pointerEvents=u===this?gt(n==null?void 0:n.pointerEvents)||"":"none"),l}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(n=>{var r;return(r=n.currentAnimation)===null||r===void 0?void 0:r.stop()}),this.root.nodes.forEach(pe),this.root.sharedNodes.clear()}}}function qi(t){t.updateLayout()}function zi(t){var e;const s=((e=t.resumeFrom)===null||e===void 0?void 0:e.snapshot)||t.snapshot;if(t.isLead()&&t.layout&&s&&t.hasListeners("didUpdate")){const{layoutBox:i,measuredBox:o}=t.layout,{animationType:h}=t.options,n=s.source!==t.layout.source;h==="size"?V(u=>{const m=n?s.measuredBox[u]:s.layoutBox[u],p=b(m);m.min=i[u].min,m.max=m.min+p}):rs(h,s.layoutBox,i)&&V(u=>{const m=n?s.measuredBox[u]:s.layoutBox[u],p=b(i[u]);m.max=m.min+p,t.relativeTarget&&!t.currentAnimation&&(t.isProjectionDirty=!0,t.relativeTarget[u].max=t.relativeTarget[u].min+p)});const r=_();tt(r,i,s.layoutBox);const a=_();n?tt(a,t.applyTransform(o,!0),s.measuredBox):tt(a,i,s.layoutBox);const l=!ss(r);let d=!1;if(!t.resumeFrom){const u=t.getClosestProjectingParent();if(u&&!u.resumeFrom){const{snapshot:m,layout:p}=u;if(m&&p){const f=w();et(f,s.layoutBox,m.layoutBox);const y=w();et(y,i,p.layoutBox),is(f,y)||(d=!0),u.options.layoutRoot&&(t.relativeTarget=y,t.relativeTargetOrigin=f,t.relativeParent=u)}}}t.notifyListeners("didUpdate",{layout:i,snapshot:s,delta:a,layoutDelta:r,hasLayoutChanged:l,hasRelativeLayoutChanged:d})}else if(t.isLead()){const{onExitComplete:i}=t.options;i&&i()}t.options.transition=void 0}function _i(t){t.parent&&(t.isProjecting()||(t.isProjectionDirty=t.parent.isProjectionDirty),t.isSharedProjectionDirty||(t.isSharedProjectionDirty=!!(t.isProjectionDirty||t.parent.isProjectionDirty||t.parent.isSharedProjectionDirty)),t.isTransformDirty||(t.isTransformDirty=t.parent.isTransformDirty))}function Wi(t){t.isProjectionDirty=t.isSharedProjectionDirty=t.isTransformDirty=!1}function Hi(t){t.clearSnapshot()}function pe(t){t.clearMeasurements()}function Gi(t){t.isLayoutDirty=!1}function Xi(t){const{visualElement:e}=t.options;e&&e.getProps().onBeforeLayoutMeasure&&e.notify("BeforeLayoutMeasure"),t.resetTransform()}function fe(t){t.finishAnimation(),t.targetDelta=t.relativeTarget=t.target=void 0,t.isProjectionDirty=!0}function Yi(t){t.resolveTargetDelta()}function Zi(t){t.calcProjection()}function Qi(t){t.resetSkewAndRotation()}function Ji(t){t.removeLeadSnapshot()}function ye(t,e,s){t.translate=D(e.translate,0,s),t.scale=D(e.scale,1,s),t.origin=e.origin,t.originPoint=e.originPoint}function ge(t,e,s,i){t.min=D(e.min,s.min,i),t.max=D(e.max,s.max,i)}function Ki(t,e,s,i){ge(t.x,e.x,s.x,i),ge(t.y,e.y,s.y,i)}function tn(t){return t.animationValues&&t.animationValues.opacityExit!==void 0}const en={duration:.45,ease:[.4,0,.1,1]},xe=t=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(t),ve=xe("applewebkit/")&&!xe("chrome/")?Math.round:H;function Ce(t){t.min=ve(t.min),t.max=ve(t.max)}function sn(t){Ce(t.x),Ce(t.y)}function rs(t,e,s){return t==="position"||t==="preserve-aspect"&&!ci(he(e),he(s),.2)}function nn(t){var e;return t!==t.root&&((e=t.scroll)===null||e===void 0?void 0:e.wasRoot)}const on=os({attachResizeListener:(t,e)=>At(t,"resize",e),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}),checkIsScrollRoot:()=>!0}),Tt={current:void 0},as=os({measureScroll:t=>({x:t.scrollLeft,y:t.scrollTop}),defaultParent:()=>{if(!Tt.current){const t=new on({});t.mount(window),t.setOptions({layoutScroll:!0}),Tt.current=t}return Tt.current},resetTransform:(t,e)=>{t.style.transform=e!==void 0?e:"none"},checkIsScrollRoot:t=>window.getComputedStyle(t).position==="fixed"}),rn={pan:{Feature:Pi},drag:{Feature:Ci,ProjectionNode:as,MeasureLayout:Ke}},an={layout:{ProjectionNode:as,MeasureLayout:Ke}},ln=Cs({...Ys,...Xs,...rn,...an},Gs),Pe=ti(ln),cn=P.div`
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
`,dn=P(cn)`
  width: 100%;

  @media (min-width: 768px) {
    width: 45%;
    max-width: fit-content;
  }
`,ls=P.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  font-style: ${({theme:t})=>t.font};
  width: 100%;
  z-index: 12;
`;function U({className:t,children:e,style:s}){const i=()=>{};return c.jsx(ls,{onChange:i,className:t,style:s,children:e})}function G({className:t,isLongOnMobile:e,children:s,style:i}){return e?c.jsx(dn,{className:t,style:{...i},children:s}):c.jsx(ls,{className:t,children:s})}const hn=P.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  max-width: 100vw;

  @media (min-width: 768px) {
    flex-wrap: nowrap;
    max-width: 100%;
  }
`;function St({children:t}){return c.jsx(hn,{className:"address-box",children:t})}St.propTypes={children:mt.node.isRequired};function un({invoice:t}){var n,r,a,l,d,u;const e=ft(),{formState:{errors:s},register:i}=F(),{isDraft:o}=M(),h=c.jsxs(U,{style:{width:e<768?"100%":""},className:"client-country",children:[c.jsx(k,{htmlFor:"clientCountry",style:{color:s.clientCountry?"#EC5757":""},children:"Country"}),c.jsx(Oe,{id:"clientCountry",$long:!1,style:{border:s!=null&&s.clientCountry?"1px solid #EC5757":"",width:e<768?"100%":""},type:"text",defaultValue:t?(n=t==null?void 0:t.clientAddress)==null?void 0:n.country:"",...i("clientCountry",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return c.jsxs(c.Fragment,{children:[c.jsxs(U,{className:"client-name",children:[c.jsx(k,{htmlFor:"clientName",style:{color:s.clientName?"#EC5757":""},children:"Client's Name"}),((r=s.clientName)==null?void 0:r.type)==="required"&&c.jsx(It,{children:"can't be empty"}),c.jsx(Et,{id:"clientName",$long:!0,style:{border:s.clientName?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientName:"",...i("clientName",{required:!o})})]}),c.jsxs(U,{className:"client-email",children:[c.jsx(k,{htmlFor:"clientEmail",style:{color:s.clientEmail?"#EC5757":""},children:"Client's Email"}),((a=s.clientEmail)==null?void 0:a.type)==="pattern"&&c.jsx(It,{style:{position:"absolute",top:"-8px"},children:"Invalid email"}),c.jsx(Et,{id:"clientEmail",$long:!0,style:{border:s.clientEmail?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientEmail:"",...i("clientEmail",{required:!o,pattern:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/})})]}),c.jsxs(U,{className:"client-street-address",children:[c.jsx(k,{htmlFor:"clientStreetAddress",style:{color:s.clientStreetAddress?"#EC5757":""},children:"Street Address"}),c.jsx($e,{id:"clientStreetAddress",style:{border:s.clientStreetAddress?"1px solid #EC5757":""},defaultValue:t?(l=t==null?void 0:t.clientAddress)==null?void 0:l.street:"",...i("clientStreetAddress",{required:!o})})]}),c.jsxs(St,{children:[c.jsxs(G,{className:"clientCity",children:[c.jsx(k,{htmlFor:"clientCity",style:{color:s.clientCity?"#EC5757":""},children:"City"}),c.jsx(pt,{id:"clientCity",style:{border:s.clientCity?"1px solid #EC5757":""},type:"text",defaultValue:t?(d=t==null?void 0:t.clientAddress)==null?void 0:d.city:"",...i("clientCity",{required:!o,pattern:/[\w ]*/i,maxLength:30})})]}),c.jsxs(G,{className:"clientPostalCode",children:[c.jsx(k,{htmlFor:"clientPostalCode",style:{color:s.clientPostalCode?"#EC5757":""},children:"Post Code"}),c.jsx(pt,{id:"clientPostalCode",style:{border:s.clientPostalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(u=t==null?void 0:t.clientAddress)==null?void 0:u.postCode:"",...i("clientPostalCode",{required:!o,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]}),e<768&&c.jsx(U,{className:"client-country",children:h}),e>=768&&c.jsx(G,{className:"client-country",children:h})]})]})}const mn=P.div`
  display: contents;
  width: 100%;
  justify-content: space-between;

  @media (min-width: 350px) {
    display: flex;
  }
  @media (min-width: 600px) {
    display: contents;
  }
`;function pn({invoice:t}){var n,r,a,l;const e=ft(),{formState:{errors:s},register:i}=F(),{isDraft:o}=M(),h=c.jsxs(U,{style:{width:e<768?"100%":""},className:"company-country",children:[c.jsx(k,{htmlFor:"CompanyCountry",style:{color:s!=null&&s.country?"#EC5757":""},children:"Country"}),c.jsx(Oe,{id:"CompanyCountry",type:"text",style:{border:s!=null&&s.country?"1px solid #EC5757":"",width:e<768?"100%":""},defaultValue:t?(n=t==null?void 0:t.senderAddress)==null?void 0:n.country:"",...i("country",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return c.jsxs(c.Fragment,{children:[c.jsxs(U,{className:"company-street-address",children:[c.jsx(k,{htmlFor:"streetAddress",style:{color:s!=null&&s.streetAddress?"#EC5757":""},children:"Street Address"}),c.jsx($e,{id:"streetAddress",style:{border:s!=null&&s.streetAddress?"1px solid #EC5757":""},defaultValue:t?(r=t==null?void 0:t.senderAddress)==null?void 0:r.street:"",...i("streetAddress",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:50})})]}),c.jsxs(St,{children:[c.jsxs(mn,{children:[c.jsxs(G,{className:"company-city",children:[c.jsx(k,{htmlFor:"companyCity",style:{color:s!=null&&s.city?"#EC5757":""},children:"City"}),c.jsx(pt,{id:"companyCity",style:{border:s!=null&&s.city?"1px solid #EC5757":""},defaultValue:t?(a=t==null?void 0:t.senderAddress)==null?void 0:a.city:"",type:"text",...i("city",{required:!o,pattern:/[\w ]*/i,maxLength:30})})]}),c.jsxs(G,{style:{justifySelf:"flex-end"},className:"company-postal-code",children:[c.jsx(k,{htmlFor:"CompanyPostalCode",style:{color:s!=null&&s.postalCode?"#EC5757":""},children:"Post Code"}),c.jsx(pt,{id:"CompanyPostalCode",style:{border:s!=null&&s.postalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(l=t==null?void 0:t.senderAddress)==null?void 0:l.postCode:"",...i("postalCode",{required:!o,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]})]}),e<768&&c.jsx(U,{className:"company-country-container",children:h}),e>=768&&c.jsx(G,{className:"company-country-container",children:h})]})]})}function fn({invoice:t}){const{formState:{errors:e},register:s}=F(),{isDraft:i}=M();return c.jsx(c.Fragment,{children:c.jsxs(U,{className:"project-description",children:[c.jsx(k,{htmlFor:"projectDescription",style:{color:e.projectDescription?"#EC5757":""},children:"Project Description"}),c.jsx(Et,{id:"projectDescription",type:"text",defaultValue:t==null?void 0:t.description,...s("projectDescription",{required:!i}),style:{border:e.projectDescription?"1px solid #EC5757":""}})]})})}const je=P.div`
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
`,cs=P.input`
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
`,yn=P(cs)`
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
`,ds=P(cs).attrs({pattern:"\\d+"})`
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
`,gn=P(ds).attrs({pattern:"[0-9.]*"})`
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
`,Te=P.p`
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
`;const xn=P.div`
  display: grid;
  grid-template: 1fr / 220px 62px 116px 61px 49px;
`,Ee=P.svg`
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
`,vn=P(J)`
  text-align: right;

  @media (min-width: 325px) {
    align-items: flex-start;
    text-align: initial;
  }
`,Cn=P.div`
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
`,we=c.jsx("path",{d:"M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z",fillRule:"nonzero",className:"deleteIconPath",tabIndex:0}),Pn=P.button`
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
`,zn=P.svg`
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
`;function Tn({items:t,append:e}){const{clearErrors:s}=F(),{formState:{submitCount:i}}=Ss(),o=()=>{e({id:"",name:"",quantity:"",price:"",total:""}),s("itemsError")};return c.jsx(Pn,{onClick:o,type:"button",style:{border:i>0&&t.length===0?"1px solid red":"1px solid transparent"},children:c.jsx(jn,{children:"+ Add New Item"})})}const En=P.div`
  display: grid;
  width: 100%;
  border-radius: 8px;
  grid-template-rows: auto;
  background-color: ${({theme:t})=>t.formBackground};
`,wn=P.div`
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
`,W=P.label`
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
`,ht=P(W)`
  justify-self: start;

  @media (min-width: 600px) {
    &.mobile-only-label {
      display: none;
    }
  }
`,Dn=P.div`
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
`,An=P.h1`
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
`;function De({index:t,invoice:e}){var r,a,l,d,u,m,p;const{register:s,formState:i}=F(),{errors:o}=i,{isDraft:h}=M(),n=()=>{var f,y,x;return((x=(y=(f=o==null?void 0:o.items)==null?void 0:f[t])==null?void 0:y.quantity)==null?void 0:x.type)==="pattern"};return c.jsxs("div",{style:{position:"relative"},children:[c.jsx(ds,{...s(`items[${t}].quantity`,{required:!h,max:1e3,pattern:{value:/^[0-9]+$/,message:"Only numbers are allowed"}}),placeholder:"0",inputMode:"numeric",type:"text",style:{border:Array.isArray(o.items)&&((a=(r=o==null?void 0:o.items)==null?void 0:r[t])!=null&&a.quantity)?"1px solid #EC5757":""},defaultValue:e?(d=(l=e==null?void 0:e.items)==null?void 0:l[t])==null?void 0:d.quantity:0}),Array.isArray(o.items)&&n()&&c.jsx("span",{style:{position:"absolute",zIndex:1,top:"100%",left:"0",marginTop:"4px",padding:"6px 8px",backgroundColor:"#f8d7da",color:"#721c24",border:"1px solid #f5c6cb",borderRadius:"4px",whiteSpace:"pre-line",textWrap:"nowrap"},children:(p=(m=(u=o==null?void 0:o.items)==null?void 0:u[t])==null?void 0:m.quantity)==null?void 0:p.message})]})}function Ae({index:t,invoice:e}){var r,a,l,d,u,m,p;const{register:s,formState:i}=F(),{errors:o}=i,{isDraft:h}=M(),n=()=>{var f,y,x;return((x=(y=(f=o==null?void 0:o.items)==null?void 0:f[t])==null?void 0:y.price)==null?void 0:x.type)==="pattern"};return c.jsxs("div",{style:{position:"relative"},children:[c.jsx(gn,{...s(`items[${t}].price`,{required:!h,max:1e5,pattern:{value:/^\$?\d+(,\d{3})*\.?[0-9]?[0-9]?$/,message:"Only numbers are allowed - max 2 decimal places"}}),placeholder:"0.00",inputMode:"numeric",type:"text",defaultValue:e?(a=(r=e==null?void 0:e.items)==null?void 0:r[t])==null?void 0:a.price:0,style:{border:Array.isArray(o.items)&&((d=(l=o==null?void 0:o.items)==null?void 0:l[t])!=null&&d.price)?"1px solid #EC5757":""}}),Array.isArray(o.items)&&n()&&c.jsx("div",{style:{position:"absolute",zIndex:1,top:"100%",left:"0",marginTop:"4px",padding:"6px 8px",backgroundColor:"#f8d7da",color:"#721c24",border:"1px solid #f5c6cb",borderRadius:"4px",whiteSpace:"prewrap"},children:(p=(m=(u=o==null?void 0:o.items)==null?void 0:u[t])==null?void 0:m.price)==null?void 0:p.message})]})}function Se({index:t,invoice:e}){var n,r,a,l;const{register:s,formState:i}=F(),{errors:o}=i,{isDraft:h}=M();return c.jsx(yn,{...s(`items[${t}].name`,{required:!h}),placeholder:"Item name",defaultValue:e?(r=(n=e==null?void 0:e.items)==null?void 0:n[t])==null?void 0:r.name:"",type:"text",style:{border:Array.isArray(o.items)&&((l=(a=o==null?void 0:o.items)==null?void 0:a[t])!=null&&l.name)?"1px solid #EC5757":""}})}function hs({invoice:t,isEditOpen:e}){const{formState:s,watch:i,clearErrors:o,setError:h,reset:n}=F(),{fields:r,remove:a,append:l}=Ne({name:"items",rules:{required:!0,minLength:1}}),{isSubmitting:d}=s,{isCacheActive:u}=M(),m=i("items",[]),p=ft(),f=v.useRef(!0);v.useEffect(()=>{!r.length&&!f.current?h("myFieldArray",{type:"required",message:"At least one item is required"}):o("myFieldArray"),f.current&&(f.current=!1)},[r,d]),v.useEffect(()=>{localStorage.getItem("cachedEditInvoiceForm")||(t&&e&&!u?n({country:t.senderAddress.country,streetAddress:t.senderAddress.street,city:t.senderAddress.city,postalCode:t.senderAddress.postCode,clientEmail:t.clientEmail,clientName:t.clientName,clientCountry:t.clientAddress.country,clientStreetAddress:t.clientAddress.street,clientCity:t.clientAddress.city,clientPostalCode:t.clientAddress.postCode,description:t.description,paymentDue:t.paymentDue,paymentTerms:t.paymentTerms,status:t.status,total:t.total,items:t.items.map(C=>({id:C.id,name:C.name,quantity:C.quantity,price:C.price,total:C.total}))}):!t&&!u&&!e&&n({items:[{name:"",price:0,quantity:0,total:0}]}))},[t,e,n]);const y=g=>{var C,j;return c.jsxs(je,{children:[c.jsxs(J,{style:{width:"100%",marginBottom:"1.5rem"},children:[c.jsx(ht,{style:{marginBottom:"1rem"},children:"Item Name"}),c.jsx(Se,{index:g,invoice:t})]}),c.jsxs(Cn,{children:[c.jsxs(J,{children:[c.jsx(W,{style:{marginBottom:"0.625rem"},children:"Qty."}),c.jsx(De,{index:g,invoice:t})]}),c.jsxs(J,{children:[c.jsx(W,{style:{marginBottom:"0.625rem"},children:"Price"}),c.jsx(Ae,{index:g,invoice:t})]}),c.jsxs(vn,{style:{width:"fit-content"},children:[c.jsx(W,{style:{marginBottom:"0.625rem"},children:"Total"}),c.jsx(Te,{children:(Number((C=m==null?void 0:m[g])==null?void 0:C.quantity)*Number((j=m==null?void 0:m[g])==null?void 0:j.price)).toFixed(2)})]})]}),c.jsxs(J,{children:[c.jsx(W,{style:{marginBottom:"0.625rem"},children:"  "}),c.jsx(Ee,{name:"removeButton",onClick:()=>a(g),children:we})]})]})},x=g=>{var C,j;return c.jsx(je,{children:c.jsxs(xn,{children:[c.jsx(Se,{index:g,invoice:t}),c.jsx(De,{index:g,invoice:t}),c.jsx(Ae,{index:g,invoice:t}),c.jsx(Te,{children:(Number((C=m==null?void 0:m[g])==null?void 0:C.quantity)*Number((j=m==null?void 0:m[g])==null?void 0:j.price)).toFixed(2)}),c.jsx(Ee,{name:"removeButton",onClick:()=>a(g),children:we})]})})};return c.jsxs(c.Fragment,{children:[c.jsx("ul",{style:{listStyle:"none",marginLeft:"0",paddingLeft:0},children:r.map((g,C)=>c.jsx("li",{"data-testid":"invoice-item",children:c.jsxs("div",{children:[p<600&&y(C),p>=600&&x(C)]})},g.id))}),c.jsx(Tn,{append:l,items:t?t.items:[]})]})}hs.propTypes={isDraft:mt.bool.isRequired,isEditOpen:mt.bool};const Sn=({className:t})=>c.jsxs(wn,{className:t,children:[c.jsx(ht,{children:"Item Name"}),c.jsx(ht,{children:"Qty."}),c.jsx(ht,{children:"Price"}),c.jsx(W,{children:"Total"})]});function bn({invoice:t,isEditOpen:e=!1}){const{isDraft:s}=M();return c.jsxs(En,{"data-testid":"items-container",children:[c.jsx(An,{children:"Item List"}),c.jsx(Sn,{className:"desktop-only-label"}),c.jsx(Dn,{children:c.jsx(hs,{isDraft:s,invoice:t,isEditOpen:e})})]})}const Rn={items:[{name:"",price:0,quantity:0,total:0,id:""}],country:"",streetAddress:"",city:"",postalCode:"",clientCountry:"",clientName:"",clientEmail:"",clientStreetAddress:"",clientCity:"",clientPostalCode:"",projectDescription:""},_n=t=>{var e,s,i,o,h,n,r,a;return{country:(e=t.senderAddress)==null?void 0:e.country,streetAddress:(s=t.senderAddress)==null?void 0:s.street,city:(i=t.senderAddress)==null?void 0:i.city,postalCode:(o=t.senderAddress)==null?void 0:o.postCode,clientEmail:t.clientEmail,clientName:t.clientName,clientCountry:(h=t.clientAddress)==null?void 0:h.country,clientStreetAddress:(n=t.clientAddress)==null?void 0:n.street,clientCity:(r=t.clientAddress)==null?void 0:r.city,clientPostalCode:(a=t.clientAddress)==null?void 0:a.postCode,projectDescription:t.description,paymentDue:t.paymentDue,paymentTerms:t.paymentTerms,status:t.status,total:t.total,items:t.items.map(l=>({id:l.id,name:l.name,quantity:l.quantity,price:l.price,total:l.total}))}},be=t=>{const{getValues:e,reset:s}=F(),{isCacheActive:i,setIsCacheActive:o}=M(),h=()=>{const r=e();localStorage.setItem(t,JSON.stringify(r))},n=()=>{localStorage.removeItem(t),o(!1)};return v.useEffect(()=>{const r=localStorage.getItem(t);r&&i&&s(JSON.parse(r))},[s,t]),{cacheFormData:h,clearCache:n}},Wn=()=>{const{id:t}=Ps(),{startDate:e,setIsDraft:s,setIsNewInvoiceOpen:i,selectedPaymentOption:o,setSelectedPaymentOption:h,methods:n,setIsCacheActive:r}=M(),{control:a,trigger:l,reset:d,watch:u,setError:m,clearErrors:p,getValues:f}=n,{replace:y}=Ne({control:a,name:"items"}),x=u(),g=be("cachedEditForm"),C=be("cachedNewInvoiceForm"),j=localStorage.getItem("theme"),[S]=Ft(Ts,{refetchQueries:[{query:js}],onError:T=>{console.error(T)}}),[E]=Ft(ws,{update:(T,{data:{editInvoice:Y}})=>{T.writeQuery({query:Es,variables:{getInvoiceById:Y.id},data:{getInvoiceById:Y}})},onError:T=>{console.error(T)}}),A=()=>{C.clearCache(),h(1),d(Rn),p(),i(!1)},q=async T=>{if(As.flushSync(()=>s(!1)),T=f(),!T.items){m("items",{type:"custom",message:"An item must be added"});return}if(await l()){const N=xt(T,e,o);N.items=N.items.map(B=>({...B,quantity:Number(B.quantity),price:Number(B.price)})),N.status="pending";try{await S({variables:{...N}}),r(!1),A(),y([{id:Mt(),name:"",quantity:0,price:0,total:0}])}catch(B){console.error(B)}}},X=async()=>{var Rt;await l();const T=n.formState.errors;if(us(T).filter(O=>O!=="required").length>0){Ds.error("Please fix the errors before saving as draft",{position:"top-right",autoClose:2e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!1,progress:void 0,theme:j||void 0,toastId:"save-draft-error-toast"}),Ln(T,"required"),d(void 0,{keepValues:!0});for(const O in T)(Rt=T[O])!=null&&Rt.type&&m(O,{type:T[O].type,message:T[O].message});T.items&&(Array.isArray(T.items)?T.items:Object.values(T.items)).forEach((nt,ps)=>{nt&&typeof nt=="object"&&Object.keys(nt).forEach(Lt=>{const Z=nt[Lt];Z!=null&&Z.type&&m(`items[${ps}].${Lt}`,{type:Z.type,message:Z.message})})});return}p();const B=f();B.items||(B.items=[{id:"",name:"",quantity:0,price:0,total:0}]);const bt=xt(B,e,o);bt.status="draft";try{await S({variables:{...bt}}),r(!1),A(),y([{id:Mt(),name:"",quantity:0,price:0,total:0}])}catch(O){console.error(O)}},it=async T=>{if(await l()){const N=xt(T,e,o);N.id=String(t),N.status="pending";try{await E({variables:{...N}}),g.clearCache(),r(!1),i(!1)}catch(B){console.error(B)}}};return v.useEffect(()=>{x.items?p("items"):m("items",{type:"custom",message:"An item must be added"})},[x.items,m]),{methods:n,onSubmit:q,onSubmitDraft:X,onSubmitUpdate:it}},us=t=>{var s;const e=[];if(!t)return[];for(const i in t)(s=t[i])!=null&&s.type&&e.push(t[i].type);return t.items&&t.items instanceof Array&&t.items.forEach(i=>{i&&typeof i=="object"&&Object.keys(i).forEach(o=>{const h=i[o];h!=null&&h.type&&e.push(h.type)})}),Array.from(new Set(e))};function Ln(t,e){var s;if(t){for(const i in t)((s=t[i])==null?void 0:s.type)===e&&delete t[i];t.items&&t.items.forEach(i=>{Object.keys(i).forEach(o=>{var h;((h=i[o])==null?void 0:h.type)===e&&delete i[o]})})}}function ms({isEditOpen:t}){const{formState:{errors:e}}=F();return c.jsxs(bs,{children:[c.jsx(Bt,{style:{visibility:us(e).includes("required")&&t?"visible":"hidden"},children:"- All fields must be added"}),c.jsx(Bt,{style:{visibility:e.myFieldArray&&t?"visible":"hidden"},children:"- An item must be added"})]})}ms.propTypes={isEditOpen:mt.bool.isRequired};const Vn=P.form`
  position: relative;
  z-index: 1;
  padding-bottom: 6rem;

  @media (min-width: 325px) {
    padding-bottom: 0;
  }
`,In=Me.lazy(()=>Fe(()=>import("./NewInvoiceBottomMenu-B9gp1Wpi.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]))),Bn=Me.lazy(()=>Fe(()=>import("./DateAndPayment-CA-mqyEh.js").then(t=>t.D),__vite__mapDeps([11,1,2,6,3,7]))),Hn=()=>{const{isNewInvoiceOpen:t}=M();return c.jsxs(c.Fragment,{children:[c.jsx(Rs,{children:"New Invoice"}),c.jsxs(Vn,{style:{zIndex:1,position:"relative"},children:[c.jsx(kt,{children:"Bill From"}),c.jsx(pn,{}),c.jsx(kt,{children:"Bill To"}),c.jsx(un,{}),c.jsx(Bn,{}),c.jsx(fn,{}),c.jsx(bn,{}),c.jsx(ms,{isEditOpen:t}),c.jsx(v.Suspense,{fallback:c.jsx("div",{children:"Loading..."}),children:c.jsx(In,{closeText:"Discard",justifyCancel:"flex-start"})})]})]})},Gn=({children:t})=>{const e=ft();let s=700;e<=616?s=e:e<=768?s=616:s=700;const i={hidden:{x:`${-s}px`},visible:{x:"0"},exit:{x:`${-s}px`}};return c.jsxs(c.Fragment,{children:[c.jsx(Pe.div,{initial:{opacity:0},animate:{opacity:.5},exit:{opacity:0},transition:{duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#000",zIndex:1e3,cursor:"pointer"}},"overlay"),c.jsx(Pe.div,{variants:i,initial:"hidden",animate:"visible",exit:"exit",transition:{type:"tween",duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:`${s}px`,height:"100%",minHeight:"100vh",color:"#ecf0f1",padding:"20px",zIndex:1001,boxShadow:"2px 0 5px rgba(0,0,0,0.3)"},children:t},"sidebar")]})};export{Un as A,pn as C,fn as D,bn as E,Vn as F,Hn as I,Gn as S,un as a,ms as b,Wn as c,Rn as d,G as e,zn as f,_n as i,be as u};
