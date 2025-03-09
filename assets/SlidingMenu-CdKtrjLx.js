const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/NewInvoiceBottomMenu-BfVgKRrY.js","assets/index-BDPPYVrj.js","assets/index-BgypsdHM.css","assets/InvoiceStatus-CrQ1-WiF.js","assets/CancelButton-C9pGFL25.js","assets/defaultValues-DIrB30ER.js","assets/utilityFunctions-B1AL52ua.js","assets/useMutation-CGX_6LDz.js","assets/editPageStyles-D1VLfA_2.js","assets/create-visual-element-DJVVUq-i.js","assets/DateAndPayment-Dv5Hftmq.js"])))=>i.map(i=>d[i]);
import{a as x,T as Ke,j as l,U as ye,V as ge,W as ti,X as xe,Y as A,Z as B,a0 as Y,a1 as ve,a2 as Z,a3 as st,a4 as z,a5 as Pe,a6 as ei,a7 as ii,a8 as je,a9 as si,aa as lt,ab as ct,ac as jt,ad as ni,d as P,b as rt,R as Ce,f as Te}from"./index-BDPPYVrj.js";import{P as nt,e as k,c as M,f as oi,g as ri}from"./InvoiceStatus-CrQ1-WiF.js";import{L as V,C as we,a as Ct,I as ft,S as Ee,A as ot,b as ai,c as Tt,E as li,B as wt}from"./editPageStyles-D1VLfA_2.js";import{i as I,b as xt,d as ci,e as di,f as De,p as hi,s as ui,m as mi,h as E,j as yt,k as w,l as pi,n as fi,o as yi,q as Et,r as Se,F as Ae,t as Dt,u as gi,v as be,w as Re,x as Le,y as xi,z as St,S as vi,A as Pi,B as $,C as Q,D as J,E as At,G as ji,H as Ci,I as Ti,J as O,K as wi,c as Ei,g as Di,a as Si}from"./create-visual-element-DJVVUq-i.js";class Ai extends x.Component{getSnapshotBeforeUpdate(e){const i=this.props.childRef.current;if(i&&e.isPresent&&!this.props.isPresent){const s=i.offsetParent,o=s instanceof HTMLElement&&s.offsetWidth||0,h=this.props.sizeRef.current;h.height=i.offsetHeight||0,h.width=i.offsetWidth||0,h.top=i.offsetTop,h.left=i.offsetLeft,h.right=o-h.width-h.left}return null}componentDidUpdate(){}render(){return this.props.children}}function bi({children:t,isPresent:e,anchorX:i}){const s=x.useId(),o=x.useRef(null),h=x.useRef({width:0,height:0,top:0,left:0,right:0}),{nonce:n}=x.useContext(Ke);return x.useInsertionEffect(()=>{const{width:r,height:a,top:c,left:d,right:u}=h.current;if(e||!o.current||!r||!a)return;const m=i==="left"?`left: ${d}`:`right: ${u}`;o.current.dataset.motionPopId=s;const p=document.createElement("style");return n&&(p.nonce=n),document.head.appendChild(p),p.sheet&&p.sheet.insertRule(`
          [data-motion-pop-id="${s}"] {
            position: absolute !important;
            width: ${r}px !important;
            height: ${a}px !important;
            ${m}px !important;
            top: ${c}px !important;
          }
        `),()=>{document.head.removeChild(p)}},[e]),l.jsx(Ai,{isPresent:e,childRef:o,sizeRef:h,children:x.cloneElement(t,{ref:o})})}const Ri=({children:t,initial:e,isPresent:i,onExitComplete:s,custom:o,presenceAffectsLayout:h,mode:n,anchorX:r})=>{const a=ye(Li),c=x.useId(),d=x.useCallback(m=>{a.set(m,!0);for(const p of a.values())if(!p)return;s&&s()},[a,s]),u=x.useMemo(()=>({id:c,initial:e,isPresent:i,custom:o,onExitComplete:d,register:m=>(a.set(m,!1),()=>a.delete(m))}),h?[Math.random(),d]:[i,d]);return x.useMemo(()=>{a.forEach((m,p)=>a.set(p,!1))},[i]),x.useEffect(()=>{!i&&!a.size&&s&&s()},[i]),n==="popLayout"&&(t=l.jsx(bi,{isPresent:i,anchorX:r,children:t})),l.jsx(ge.Provider,{value:u,children:t})};function Li(){return new Map}function Be(t=!0){const e=x.useContext(ge);if(e===null)return[!0,null];const{isPresent:i,onExitComplete:s,register:o}=e,h=x.useId();x.useEffect(()=>{t&&o(h)},[t]);const n=x.useCallback(()=>t&&s&&s(h),[h,s,t]);return!i&&s?[!1,n]:[!0]}const K=t=>t.key||"";function bt(t){const e=[];return x.Children.forEach(t,i=>{x.isValidElement(i)&&e.push(i)}),e}const yn=({children:t,custom:e,initial:i=!0,onExitComplete:s,presenceAffectsLayout:o=!0,mode:h="sync",propagate:n=!1,anchorX:r="left"})=>{const[a,c]=Be(n),d=x.useMemo(()=>bt(t),[t]),u=n&&!a?[]:d.map(K),m=x.useRef(!0),p=x.useRef(d),f=ye(()=>new Map),[y,v]=x.useState(d),[g,j]=x.useState(d);ti(()=>{m.current=!1,p.current=d;for(let T=0;T<g.length;T++){const S=K(g[T]);u.includes(S)?f.delete(S):f.get(S)!==!0&&f.set(S,!1)}},[g,u.length,u.join("-")]);const C=[];if(d!==y){let T=[...d];for(let S=0;S<g.length;S++){const N=g[S],at=K(N);u.includes(at)||(T.splice(S,0,N),C.push(N))}return h==="wait"&&C.length&&(T=C),j(bt(T)),v(d),null}const{forceRender:b}=x.useContext(xe);return l.jsx(l.Fragment,{children:g.map(T=>{const S=K(T),N=n&&!a?!1:d===g||u.includes(S),at=()=>{if(f.has(S))f.set(S,!0);else return;let Pt=!0;f.forEach(Je=>{Je||(Pt=!1)}),Pt&&(b==null||b(),j(p.current),n&&(c==null||c()),s&&s())};return l.jsx(Ri,{isPresent:N,initial:!m.current||i?void 0:!1,custom:e,presenceAffectsLayout:o,mode:h,onExitComplete:N?void 0:at,anchorX:r,children:T},S)})})};function Bi(t){if(typeof Proxy>"u")return t;const e=new Map,i=(...s)=>t(...s);return new Proxy(i,{get:(s,o)=>o==="create"?t:(e.has(o)||e.set(o,t(o)),e.get(o))})}function Vi(t){return t==="x"||t==="y"?I[t]?null:(I[t]=!0,()=>{I[t]=!1}):I.x||I.y?null:(I.x=I.y=!0,()=>{I.x=I.y=!1})}function H(t,e,i,s){return xt(t,e,ci(i),s)}const Rt=(t,e)=>Math.abs(t-e);function ki(t,e){const i=Rt(t.x,e.x),s=Rt(t.y,e.y);return Math.sqrt(i**2+s**2)}class Ve{constructor(e,i,{transformPagePoint:s,contextWindow:o,dragSnapToOrigin:h=!1}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const u=ht(this.lastMoveEventInfo,this.history),m=this.startEvent!==null,p=ki(u.offset,{x:0,y:0})>=3;if(!m&&!p)return;const{point:f}=u,{timestamp:y}=A;this.history.push({...f,timestamp:y});const{onStart:v,onMove:g}=this.handlers;m||(v&&v(this.lastMoveEvent,u),this.startEvent=this.lastMoveEvent),g&&g(this.lastMoveEvent,u)},this.handlePointerMove=(u,m)=>{this.lastMoveEvent=u,this.lastMoveEventInfo=dt(m,this.transformPagePoint),B.update(this.updatePoint,!0)},this.handlePointerUp=(u,m)=>{this.end();const{onEnd:p,onSessionEnd:f,resumeAnimation:y}=this.handlers;if(this.dragSnapToOrigin&&y&&y(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const v=ht(u.type==="pointercancel"?this.lastMoveEventInfo:dt(m,this.transformPagePoint),this.history);this.startEvent&&p&&p(u,v),f&&f(u,v)},!di(e))return;this.dragSnapToOrigin=h,this.handlers=i,this.transformPagePoint=s,this.contextWindow=o||window;const n=De(e),r=dt(n,this.transformPagePoint),{point:a}=r,{timestamp:c}=A;this.history=[{...a,timestamp:c}];const{onSessionStart:d}=i;d&&d(e,ht(r,this.history)),this.removeListeners=hi(H(this.contextWindow,"pointermove",this.handlePointerMove),H(this.contextWindow,"pointerup",this.handlePointerUp),H(this.contextWindow,"pointercancel",this.handlePointerUp))}updateHandlers(e){this.handlers=e}end(){this.removeListeners&&this.removeListeners(),Y(this.updatePoint)}}function dt(t,e){return e?{point:e(t.point)}:t}function Lt(t,e){return{x:t.x-e.x,y:t.y-e.y}}function ht({point:t},e){return{point:t,delta:Lt(t,ke(e)),offset:Lt(t,Mi(e)),velocity:Ii(e,.1)}}function Mi(t){return t[0]}function ke(t){return t[t.length-1]}function Ii(t,e){if(t.length<2)return{x:0,y:0};let i=t.length-1,s=null;const o=ke(t);for(;i>=0&&(s=t[i],!(o.timestamp-s.timestamp>ui(e)));)i--;if(!s)return{x:0,y:0};const h=mi(o.timestamp-s.timestamp);if(h===0)return{x:0,y:0};const n={x:(o.x-s.x)/h,y:(o.y-s.y)/h};return n.x===1/0&&(n.x=0),n.y===1/0&&(n.y=0),n}const Me=1e-4,Fi=1-Me,Ni=1+Me,Ie=.01,$i=0-Ie,Oi=0+Ie;function D(t){return t.max-t.min}function Ui(t,e,i){return Math.abs(t-e)<=i}function Bt(t,e,i,s=.5){t.origin=s,t.originPoint=E(e.min,e.max,t.origin),t.scale=D(i)/D(e),t.translate=E(i.min,i.max,t.origin)-t.originPoint,(t.scale>=Fi&&t.scale<=Ni||isNaN(t.scale))&&(t.scale=1),(t.translate>=$i&&t.translate<=Oi||isNaN(t.translate))&&(t.translate=0)}function G(t,e,i,s){Bt(t.x,e.x,i.x,s?s.originX:void 0),Bt(t.y,e.y,i.y,s?s.originY:void 0)}function Vt(t,e,i){t.min=i.min+e.min,t.max=t.min+D(e)}function zi(t,e,i){Vt(t.x,e.x,i.x),Vt(t.y,e.y,i.y)}function kt(t,e,i){t.min=e.min-i.min,t.max=t.min+D(e)}function X(t,e,i){kt(t.x,e.x,i.x),kt(t.y,e.y,i.y)}function qi(t,{min:e,max:i},s){return e!==void 0&&t<e?t=s?E(e,t,s.min):Math.max(t,e):i!==void 0&&t>i&&(t=s?E(i,t,s.max):Math.min(t,i)),t}function Mt(t,e,i){return{min:e!==void 0?t.min+e:void 0,max:i!==void 0?t.max+i-(t.max-t.min):void 0}}function _i(t,{top:e,left:i,bottom:s,right:o}){return{x:Mt(t.x,i,o),y:Mt(t.y,e,s)}}function It(t,e){let i=e.min-t.min,s=e.max-t.max;return e.max-e.min<t.max-t.min&&([i,s]=[s,i]),{min:i,max:s}}function Wi(t,e){return{x:It(t.x,e.x),y:It(t.y,e.y)}}function Hi(t,e){let i=.5;const s=D(t),o=D(e);return o>s?i=yt(e.min,e.max-s,t.min):s>o&&(i=yt(t.min,t.max-o,e.min)),ve(0,1,i)}function Gi(t,e){const i={};return e.min!==void 0&&(i.min=e.min-t.min),e.max!==void 0&&(i.max=e.max-t.min),i}const gt=.35;function Xi(t=gt){return t===!1?t=0:t===!0&&(t=gt),{x:Ft(t,"left","right"),y:Ft(t,"top","bottom")}}function Ft(t,e,i){return{min:Nt(t,e),max:Nt(t,i)}}function Nt(t,e){return typeof t=="number"?t:t[e]||0}function L(t){return[t("x"),t("y")]}const Fe=({current:t})=>t?t.ownerDocument.defaultView:null,Yi=new WeakMap;class Zi{constructor(e){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=w(),this.visualElement=e}start(e,{snapToCursor:i=!1}={}){const{presenceContext:s}=this.visualElement;if(s&&s.isPresent===!1)return;const o=d=>{const{dragSnapToOrigin:u}=this.getProps();u?this.pauseAnimation():this.stopAnimation(),i&&this.snapToCursor(De(d).point)},h=(d,u)=>{const{drag:m,dragPropagation:p,onDragStart:f}=this.getProps();if(m&&!p&&(this.openDragLock&&this.openDragLock(),this.openDragLock=Vi(m),!this.openDragLock))return;this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),L(v=>{let g=this.getAxisMotionValue(v).get()||0;if(st.test(g)){const{projection:j}=this.visualElement;if(j&&j.layout){const C=j.layout.layoutBox[v];C&&(g=D(C)*(parseFloat(g)/100))}}this.originPoint[v]=g}),f&&B.postRender(()=>f(d,u)),Et(this.visualElement,"transform");const{animationState:y}=this.visualElement;y&&y.setActive("whileDrag",!0)},n=(d,u)=>{const{dragPropagation:m,dragDirectionLock:p,onDirectionLock:f,onDrag:y}=this.getProps();if(!m&&!this.openDragLock)return;const{offset:v}=u;if(p&&this.currentDirection===null){this.currentDirection=Qi(v),this.currentDirection!==null&&f&&f(this.currentDirection);return}this.updateAxis("x",u.point,v),this.updateAxis("y",u.point,v),this.visualElement.render(),y&&y(d,u)},r=(d,u)=>this.stop(d,u),a=()=>L(d=>{var u;return this.getAnimationState(d)==="paused"&&((u=this.getAxisMotionValue(d).animation)===null||u===void 0?void 0:u.play())}),{dragSnapToOrigin:c}=this.getProps();this.panSession=new Ve(e,{onSessionStart:o,onStart:h,onMove:n,onSessionEnd:r,resumeAnimation:a},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:c,contextWindow:Fe(this.visualElement)})}stop(e,i){const s=this.isDragging;if(this.cancel(),!s)return;const{velocity:o}=i;this.startAnimation(o);const{onDragEnd:h}=this.getProps();h&&B.postRender(()=>h(e,i))}cancel(){this.isDragging=!1;const{projection:e,animationState:i}=this.visualElement;e&&(e.isAnimationBlocked=!1),this.panSession&&this.panSession.end(),this.panSession=void 0;const{dragPropagation:s}=this.getProps();!s&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),i&&i.setActive("whileDrag",!1)}updateAxis(e,i,s){const{drag:o}=this.getProps();if(!s||!tt(e,o,this.currentDirection))return;const h=this.getAxisMotionValue(e);let n=this.originPoint[e]+s[e];this.constraints&&this.constraints[e]&&(n=qi(n,this.constraints[e],this.elastic[e])),h.set(n)}resolveConstraints(){var e;const{dragConstraints:i,dragElastic:s}=this.getProps(),o=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(e=this.visualElement.projection)===null||e===void 0?void 0:e.layout,h=this.constraints;i&&Z(i)?this.constraints||(this.constraints=this.resolveRefConstraints()):i&&o?this.constraints=_i(o.layoutBox,i):this.constraints=!1,this.elastic=Xi(s),h!==this.constraints&&o&&this.constraints&&!this.hasMutatedConstraints&&L(n=>{this.constraints!==!1&&this.getAxisMotionValue(n)&&(this.constraints[n]=Gi(o.layoutBox[n],this.constraints[n]))})}resolveRefConstraints(){const{dragConstraints:e,onMeasureDragConstraints:i}=this.getProps();if(!e||!Z(e))return!1;const s=e.current,{projection:o}=this.visualElement;if(!o||!o.layout)return!1;const h=pi(s,o.root,this.visualElement.getTransformPagePoint());let n=Wi(o.layout.layoutBox,h);if(i){const r=i(fi(n));this.hasMutatedConstraints=!!r,r&&(n=yi(r))}return n}startAnimation(e){const{drag:i,dragMomentum:s,dragElastic:o,dragTransition:h,dragSnapToOrigin:n,onDragTransitionEnd:r}=this.getProps(),a=this.constraints||{},c=L(d=>{if(!tt(d,i,this.currentDirection))return;let u=a&&a[d]||{};n&&(u={min:0,max:0});const m=o?200:1e6,p=o?40:1e7,f={type:"inertia",velocity:s?e[d]:0,bounceStiffness:m,bounceDamping:p,timeConstant:750,restDelta:1,restSpeed:10,...h,...u};return this.startAxisValueAnimation(d,f)});return Promise.all(c).then(r)}startAxisValueAnimation(e,i){const s=this.getAxisMotionValue(e);return Et(this.visualElement,e),s.start(Se(e,s,0,i,this.visualElement,!1))}stopAnimation(){L(e=>this.getAxisMotionValue(e).stop())}pauseAnimation(){L(e=>{var i;return(i=this.getAxisMotionValue(e).animation)===null||i===void 0?void 0:i.pause()})}getAnimationState(e){var i;return(i=this.getAxisMotionValue(e).animation)===null||i===void 0?void 0:i.state}getAxisMotionValue(e){const i=`_drag${e.toUpperCase()}`,s=this.visualElement.getProps(),o=s[i];return o||this.visualElement.getValue(e,(s.initial?s.initial[e]:void 0)||0)}snapToCursor(e){L(i=>{const{drag:s}=this.getProps();if(!tt(i,s,this.currentDirection))return;const{projection:o}=this.visualElement,h=this.getAxisMotionValue(i);if(o&&o.layout){const{min:n,max:r}=o.layout.layoutBox[i];h.set(e[i]-E(n,r,.5))}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:e,dragConstraints:i}=this.getProps(),{projection:s}=this.visualElement;if(!Z(i)||!s||!this.constraints)return;this.stopAnimation();const o={x:0,y:0};L(n=>{const r=this.getAxisMotionValue(n);if(r&&this.constraints!==!1){const a=r.get();o[n]=Hi({min:a,max:a},this.constraints[n])}});const{transformTemplate:h}=this.visualElement.getProps();this.visualElement.current.style.transform=h?h({},""):"none",s.root&&s.root.updateScroll(),s.updateLayout(),this.resolveConstraints(),L(n=>{if(!tt(n,e,null))return;const r=this.getAxisMotionValue(n),{min:a,max:c}=this.constraints[n];r.set(E(a,c,o[n]))})}addListeners(){if(!this.visualElement.current)return;Yi.set(this.visualElement,this);const e=this.visualElement.current,i=H(e,"pointerdown",a=>{const{drag:c,dragListener:d=!0}=this.getProps();c&&d&&this.start(a)}),s=()=>{const{dragConstraints:a}=this.getProps();Z(a)&&a.current&&(this.constraints=this.resolveRefConstraints())},{projection:o}=this.visualElement,h=o.addEventListener("measure",s);o&&!o.layout&&(o.root&&o.root.updateScroll(),o.updateLayout()),B.read(s);const n=xt(window,"resize",()=>this.scalePositionWithinConstraints()),r=o.addEventListener("didUpdate",({delta:a,hasLayoutChanged:c})=>{this.isDragging&&c&&(L(d=>{const u=this.getAxisMotionValue(d);u&&(this.originPoint[d]+=a[d].translate,u.set(u.get()+a[d].translate))}),this.visualElement.render())});return()=>{n(),i(),h(),r&&r()}}getProps(){const e=this.visualElement.getProps(),{drag:i=!1,dragDirectionLock:s=!1,dragPropagation:o=!1,dragConstraints:h=!1,dragElastic:n=gt,dragMomentum:r=!0}=e;return{...e,drag:i,dragDirectionLock:s,dragPropagation:o,dragConstraints:h,dragElastic:n,dragMomentum:r}}}function tt(t,e,i){return(e===!0||e===t)&&(i===null||i===t)}function Qi(t,e=10){let i=null;return Math.abs(t.y)>e?i="y":Math.abs(t.x)>e&&(i="x"),i}class Ji extends Ae{constructor(e){super(e),this.removeGroupControls=z,this.removeListeners=z,this.controls=new Zi(e)}mount(){const{dragControls:e}=this.node.getProps();e&&(this.removeGroupControls=e.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||z}unmount(){this.removeGroupControls(),this.removeListeners()}}const $t=t=>(e,i)=>{t&&B.postRender(()=>t(e,i))};class Ki extends Ae{constructor(){super(...arguments),this.removePointerDownListener=z}onPointerDown(e){this.session=new Ve(e,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:Fe(this.node)})}createPanHandlers(){const{onPanSessionStart:e,onPanStart:i,onPan:s,onPanEnd:o}=this.node.getProps();return{onSessionStart:$t(e),onStart:$t(i),onMove:s,onEnd:(h,n)=>{delete this.session,o&&B.postRender(()=>o(h,n))}}}mount(){this.removePointerDownListener=H(this.node.current,"pointerdown",e=>this.onPointerDown(e))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}const et={hasAnimatedSinceResize:!0,hasEverUpdated:!1};function Ot(t,e){return e.max===e.min?0:t/(e.max-e.min)*100}const _={correct:(t,e)=>{if(!e.target)return t;if(typeof t=="string")if(Pe.test(t))t=parseFloat(t);else return t;const i=Ot(t,e.target.x),s=Ot(t,e.target.y);return`${i}% ${s}%`}},ts={correct:(t,{treeScale:e,projectionDelta:i})=>{const s=t,o=Dt.parse(t);if(o.length>5)return s;const h=Dt.createTransformer(t),n=typeof o[0]!="number"?1:0,r=i.x.scale*e.x,a=i.y.scale*e.y;o[0+n]/=r,o[1+n]/=a;const c=E(r,a,.5);return typeof o[2+n]=="number"&&(o[2+n]/=c),typeof o[3+n]=="number"&&(o[3+n]/=c),h(o)}};class es extends x.Component{componentDidMount(){const{visualElement:e,layoutGroup:i,switchLayoutGroup:s,layoutId:o}=this.props,{projection:h}=e;ii(is),h&&(i.group&&i.group.add(h),s&&s.register&&o&&s.register(h),h.root.didUpdate(),h.addEventListener("animationComplete",()=>{this.safeToRemove()}),h.setOptions({...h.options,onExitComplete:()=>this.safeToRemove()})),et.hasEverUpdated=!0}getSnapshotBeforeUpdate(e){const{layoutDependency:i,visualElement:s,drag:o,isPresent:h}=this.props,n=s.projection;return n&&(n.isPresent=h,o||e.layoutDependency!==i||i===void 0?n.willUpdate():this.safeToRemove(),e.isPresent!==h&&(h?n.promote():n.relegate()||B.postRender(()=>{const r=n.getStack();(!r||!r.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{projection:e}=this.props.visualElement;e&&(e.root.didUpdate(),je.postRender(()=>{!e.currentAnimation&&e.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:e,layoutGroup:i,switchLayoutGroup:s}=this.props,{projection:o}=e;o&&(o.scheduleCheckAfterUnmount(),i&&i.group&&i.group.remove(o),s&&s.deregister&&s.deregister(o))}safeToRemove(){const{safeToRemove:e}=this.props;e&&e()}render(){return null}}function Ne(t){const[e,i]=Be(),s=x.useContext(xe);return l.jsx(es,{...t,layoutGroup:s,switchLayoutGroup:x.useContext(ei),isPresent:e,safeToRemove:i})}const is={borderRadius:{..._,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:_,borderTopRightRadius:_,borderBottomLeftRadius:_,borderBottomRightRadius:_,boxShadow:ts};function ss(t,e,i){const s=si(t)?t:gi(t);return s.start(Se("",s,e,i)),s.animation}function ns(t){return t instanceof SVGElement&&t.tagName!=="svg"}const os=(t,e)=>t.depth-e.depth;class rs{constructor(){this.children=[],this.isDirty=!1}add(e){be(this.children,e),this.isDirty=!0}remove(e){Re(this.children,e),this.isDirty=!0}forEach(e){this.isDirty&&this.children.sort(os),this.isDirty=!1,this.children.forEach(e)}}function as(t,e){const i=Le.now(),s=({timestamp:o})=>{const h=o-i;h>=e&&(Y(s),t(h-e))};return B.read(s,!0),()=>Y(s)}const $e=["TopLeft","TopRight","BottomLeft","BottomRight"],ls=$e.length,Ut=t=>typeof t=="string"?parseFloat(t):t,zt=t=>typeof t=="number"||Pe.test(t);function cs(t,e,i,s,o,h){o?(t.opacity=E(0,i.opacity!==void 0?i.opacity:1,ds(s)),t.opacityExit=E(e.opacity!==void 0?e.opacity:1,0,hs(s))):h&&(t.opacity=E(e.opacity!==void 0?e.opacity:1,i.opacity!==void 0?i.opacity:1,s));for(let n=0;n<ls;n++){const r=`border${$e[n]}Radius`;let a=qt(e,r),c=qt(i,r);if(a===void 0&&c===void 0)continue;a||(a=0),c||(c=0),a===0||c===0||zt(a)===zt(c)?(t[r]=Math.max(E(Ut(a),Ut(c),s),0),(st.test(c)||st.test(a))&&(t[r]+="%")):t[r]=c}(e.rotate||i.rotate)&&(t.rotate=E(e.rotate||0,i.rotate||0,s))}function qt(t,e){return t[e]!==void 0?t[e]:t.borderRadius}const ds=Oe(0,.5,xi),hs=Oe(.5,.95,z);function Oe(t,e,i){return s=>s<t?0:s>e?1:i(yt(t,e,s))}function _t(t,e){t.min=e.min,t.max=e.max}function R(t,e){_t(t.x,e.x),_t(t.y,e.y)}function Wt(t,e){t.translate=e.translate,t.scale=e.scale,t.originPoint=e.originPoint,t.origin=e.origin}function Ht(t,e,i,s,o){return t-=e,t=St(t,1/i,s),o!==void 0&&(t=St(t,1/o,s)),t}function us(t,e=0,i=1,s=.5,o,h=t,n=t){if(st.test(e)&&(e=parseFloat(e),e=E(n.min,n.max,e/100)-n.min),typeof e!="number")return;let r=E(h.min,h.max,s);t===h&&(r-=e),t.min=Ht(t.min,e,i,r,o),t.max=Ht(t.max,e,i,r,o)}function Gt(t,e,[i,s,o],h,n){us(t,e[i],e[s],e[o],e.scale,h,n)}const ms=["x","scaleX","originX"],ps=["y","scaleY","originY"];function Xt(t,e,i,s){Gt(t.x,e,ms,i?i.x:void 0,s?s.x:void 0),Gt(t.y,e,ps,i?i.y:void 0,s?s.y:void 0)}function Yt(t){return t.translate===0&&t.scale===1}function Ue(t){return Yt(t.x)&&Yt(t.y)}function Zt(t,e){return t.min===e.min&&t.max===e.max}function fs(t,e){return Zt(t.x,e.x)&&Zt(t.y,e.y)}function Qt(t,e){return Math.round(t.min)===Math.round(e.min)&&Math.round(t.max)===Math.round(e.max)}function ze(t,e){return Qt(t.x,e.x)&&Qt(t.y,e.y)}function Jt(t){return D(t.x)/D(t.y)}function Kt(t,e){return t.translate===e.translate&&t.scale===e.scale&&t.originPoint===e.originPoint}class ys{constructor(){this.members=[]}add(e){be(this.members,e),e.scheduleRender()}remove(e){if(Re(this.members,e),e===this.prevLead&&(this.prevLead=void 0),e===this.lead){const i=this.members[this.members.length-1];i&&this.promote(i)}}relegate(e){const i=this.members.findIndex(o=>e===o);if(i===0)return!1;let s;for(let o=i;o>=0;o--){const h=this.members[o];if(h.isPresent!==!1){s=h;break}}return s?(this.promote(s),!0):!1}promote(e,i){const s=this.lead;if(e!==s&&(this.prevLead=s,this.lead=e,e.show(),s)){s.instance&&s.scheduleRender(),e.scheduleRender(),e.resumeFrom=s,i&&(e.resumeFrom.preserveOpacity=!0),s.snapshot&&(e.snapshot=s.snapshot,e.snapshot.latestValues=s.animationValues||s.latestValues),e.root&&e.root.isUpdating&&(e.isLayoutDirty=!0);const{crossfade:o}=e.options;o===!1&&s.hide()}}exitAnimationComplete(){this.members.forEach(e=>{const{options:i,resumingFrom:s}=e;i.onExitComplete&&i.onExitComplete(),s&&s.options.onExitComplete&&s.options.onExitComplete()})}scheduleRender(){this.members.forEach(e=>{e.instance&&e.scheduleRender(!1)})}removeLeadSnapshot(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)}}function gs(t,e,i){let s="";const o=t.x.translate/e.x,h=t.y.translate/e.y,n=(i==null?void 0:i.z)||0;if((o||h||n)&&(s=`translate3d(${o}px, ${h}px, ${n}px) `),(e.x!==1||e.y!==1)&&(s+=`scale(${1/e.x}, ${1/e.y}) `),i){const{transformPerspective:c,rotate:d,rotateX:u,rotateY:m,skewX:p,skewY:f}=i;c&&(s=`perspective(${c}px) ${s}`),d&&(s+=`rotate(${d}deg) `),u&&(s+=`rotateX(${u}deg) `),m&&(s+=`rotateY(${m}deg) `),p&&(s+=`skewX(${p}deg) `),f&&(s+=`skewY(${f}deg) `)}const r=t.x.scale*e.x,a=t.y.scale*e.y;return(r!==1||a!==1)&&(s+=`scale(${r}, ${a})`),s||"none"}const ut=["","X","Y","Z"],xs={visibility:"hidden"},te=1e3;let vs=0;function mt(t,e,i,s){const{latestValues:o}=e;o[t]&&(i[t]=o[t],e.setStaticValue(t,0),s&&(s[t]=0))}function qe(t){if(t.hasCheckedOptimisedAppear=!0,t.root===t)return;const{visualElement:e}=t.options;if(!e)return;const i=wi(e);if(window.MotionHasOptimisedAnimation(i,"transform")){const{layout:o,layoutId:h}=t.options;window.MotionCancelOptimisedAnimation(i,"transform",B,!(o||h))}const{parent:s}=t;s&&!s.hasCheckedOptimisedAppear&&qe(s)}function _e({attachResizeListener:t,defaultParent:e,measureScroll:i,checkIsScrollRoot:s,resetTransform:o}){return class{constructor(n={},r=e==null?void 0:e()){this.id=vs++,this.animationId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(Cs),this.nodes.forEach(Ss),this.nodes.forEach(As),this.nodes.forEach(Ts)},this.resolvedRelativeTargetAt=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=n,this.root=r?r.root||r:this,this.path=r?[...r.path,r]:[],this.parent=r,this.depth=r?r.depth+1:0;for(let a=0;a<this.path.length;a++)this.path[a].shouldResetTransform=!0;this.root===this&&(this.nodes=new rs)}addEventListener(n,r){return this.eventHandlers.has(n)||this.eventHandlers.set(n,new vi),this.eventHandlers.get(n).add(r)}notifyListeners(n,...r){const a=this.eventHandlers.get(n);a&&a.notify(...r)}hasListeners(n){return this.eventHandlers.has(n)}mount(n,r=this.root.hasTreeAnimated){if(this.instance)return;this.isSVG=ns(n),this.instance=n;const{layoutId:a,layout:c,visualElement:d}=this.options;if(d&&!d.current&&d.mount(n),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),r&&(c||a)&&(this.isLayoutDirty=!0),t){let u;const m=()=>this.root.updateBlockedByResize=!1;t(n,()=>{this.root.updateBlockedByResize=!0,u&&u(),u=as(m,250),et.hasAnimatedSinceResize&&(et.hasAnimatedSinceResize=!1,this.nodes.forEach(ie))})}a&&this.root.registerSharedNode(a,this),this.options.animate!==!1&&d&&(a||c)&&this.addEventListener("didUpdate",({delta:u,hasLayoutChanged:m,hasRelativeLayoutChanged:p,layout:f})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const y=this.options.transition||d.getDefaultTransition()||Vs,{onLayoutAnimationStart:v,onLayoutAnimationComplete:g}=d.getProps(),j=!this.targetLayout||!ze(this.targetLayout,f),C=!m&&p;if(this.options.layoutRoot||this.resumeFrom||C||m&&(j||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0),this.setAnimationOrigin(u,C);const b={...Pi(y,"layout"),onPlay:v,onComplete:g};(d.shouldReduceMotion||this.options.layoutRoot)&&(b.delay=0,b.type=!1),this.startAnimation(b)}else m||ie(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=f})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const n=this.getStack();n&&n.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,Y(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(bs),this.animationId++)}getTransformTemplate(){const{visualElement:n}=this.options;return n&&n.getProps().transformTemplate}willUpdate(n=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&qe(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let d=0;d<this.path.length;d++){const u=this.path[d];u.shouldResetTransform=!0,u.updateScroll("snapshot"),u.options.layoutRoot&&u.willUpdate(!1)}const{layoutId:r,layout:a}=this.options;if(r===void 0&&!a)return;const c=this.getTransformTemplate();this.prevTransformTemplateValue=c?c(this.latestValues,""):void 0,this.updateSnapshot(),n&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(ee);return}this.isUpdating||this.nodes.forEach(Es),this.isUpdating=!1,this.nodes.forEach(Ds),this.nodes.forEach(Ps),this.nodes.forEach(js),this.clearAllSnapshots();const r=Le.now();A.delta=ve(0,1e3/60,r-A.timestamp),A.timestamp=r,A.isProcessing=!0,lt.update.process(A),lt.preRender.process(A),lt.render.process(A),A.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,je.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(ws),this.sharedNodes.forEach(Rs)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,B.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){B.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!D(this.snapshot.measuredBox.x)&&!D(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let a=0;a<this.path.length;a++)this.path[a].updateScroll();const n=this.layout;this.layout=this.measure(!1),this.layoutCorrected=w(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:r}=this.options;r&&r.notify("LayoutMeasure",this.layout.layoutBox,n?n.layoutBox:void 0)}updateScroll(n="measure"){let r=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===n&&(r=!1),r){const a=s(this.instance);this.scroll={animationId:this.root.animationId,phase:n,isRoot:a,offset:i(this.instance),wasRoot:this.scroll?this.scroll.isRoot:a}}}resetTransform(){if(!o)return;const n=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,r=this.projectionDelta&&!Ue(this.projectionDelta),a=this.getTransformTemplate(),c=a?a(this.latestValues,""):void 0,d=c!==this.prevTransformTemplateValue;n&&(r||$(this.latestValues)||d)&&(o(this.instance,c),this.shouldResetTransform=!1,this.scheduleRender())}measure(n=!0){const r=this.measurePageBox();let a=this.removeElementScroll(r);return n&&(a=this.removeTransform(a)),ks(a),{animationId:this.root.animationId,measuredBox:r,layoutBox:a,latestValues:{},source:this.id}}measurePageBox(){var n;const{visualElement:r}=this.options;if(!r)return w();const a=r.measureViewportBox();if(!(((n=this.scroll)===null||n===void 0?void 0:n.wasRoot)||this.path.some(Ms))){const{scroll:d}=this.root;d&&(Q(a.x,d.offset.x),Q(a.y,d.offset.y))}return a}removeElementScroll(n){var r;const a=w();if(R(a,n),!((r=this.scroll)===null||r===void 0)&&r.wasRoot)return a;for(let c=0;c<this.path.length;c++){const d=this.path[c],{scroll:u,options:m}=d;d!==this.root&&u&&m.layoutScroll&&(u.wasRoot&&R(a,n),Q(a.x,u.offset.x),Q(a.y,u.offset.y))}return a}applyTransform(n,r=!1){const a=w();R(a,n);for(let c=0;c<this.path.length;c++){const d=this.path[c];!r&&d.options.layoutScroll&&d.scroll&&d!==d.root&&J(a,{x:-d.scroll.offset.x,y:-d.scroll.offset.y}),$(d.latestValues)&&J(a,d.latestValues)}return $(this.latestValues)&&J(a,this.latestValues),a}removeTransform(n){const r=w();R(r,n);for(let a=0;a<this.path.length;a++){const c=this.path[a];if(!c.instance||!$(c.latestValues))continue;At(c.latestValues)&&c.updateSnapshot();const d=w(),u=c.measurePageBox();R(d,u),Xt(r,c.latestValues,c.snapshot?c.snapshot.layoutBox:void 0,d)}return $(this.latestValues)&&Xt(r,this.latestValues),r}setTargetDelta(n){this.targetDelta=n,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(n){this.options={...this.options,...n,crossfade:n.crossfade!==void 0?n.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==A.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(n=!1){var r;const a=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=a.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=a.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=a.isSharedProjectionDirty);const c=!!this.resumingFrom||this!==a;if(!(n||c&&this.isSharedProjectionDirty||this.isProjectionDirty||!((r=this.parent)===null||r===void 0)&&r.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:u,layoutId:m}=this.options;if(!(!this.layout||!(u||m))){if(this.resolvedRelativeTargetAt=A.timestamp,!this.targetDelta&&!this.relativeTarget){const p=this.getClosestProjectingParent();p&&p.layout&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=w(),this.relativeTargetOrigin=w(),X(this.relativeTargetOrigin,this.layout.layoutBox,p.layout.layoutBox),R(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}if(!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=w(),this.targetWithTransforms=w()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),zi(this.target,this.relativeTarget,this.relativeParent.target)):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.layoutBox):R(this.target,this.layout.layoutBox),ji(this.target,this.targetDelta)):R(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget)){this.attemptToResolveRelativeTarget=!1;const p=this.getClosestProjectingParent();p&&!!p.resumingFrom==!!this.resumingFrom&&!p.options.layoutScroll&&p.target&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=w(),this.relativeTargetOrigin=w(),X(this.relativeTargetOrigin,this.target,p.target),R(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}}}getClosestProjectingParent(){if(!(!this.parent||At(this.parent.latestValues)||Ci(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}calcProjection(){var n;const r=this.getLead(),a=!!this.resumingFrom||this!==r;let c=!0;if((this.isProjectionDirty||!((n=this.parent)===null||n===void 0)&&n.isProjectionDirty)&&(c=!1),a&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(c=!1),this.resolvedRelativeTargetAt===A.timestamp&&(c=!1),c)return;const{layout:d,layoutId:u}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(d||u))return;R(this.layoutCorrected,this.layout.layoutBox);const m=this.treeScale.x,p=this.treeScale.y;Ti(this.layoutCorrected,this.treeScale,this.path,a),r.layout&&!r.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(r.target=r.layout.layoutBox,r.targetWithTransforms=w());const{target:f}=r;if(!f){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(Wt(this.prevProjectionDelta.x,this.projectionDelta.x),Wt(this.prevProjectionDelta.y,this.projectionDelta.y)),G(this.projectionDelta,this.layoutCorrected,f,this.latestValues),(this.treeScale.x!==m||this.treeScale.y!==p||!Kt(this.projectionDelta.x,this.prevProjectionDelta.x)||!Kt(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",f))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(n=!0){var r;if((r=this.options.visualElement)===null||r===void 0||r.scheduleRender(),n){const a=this.getStack();a&&a.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=O(),this.projectionDelta=O(),this.projectionDeltaWithTransform=O()}setAnimationOrigin(n,r=!1){const a=this.snapshot,c=a?a.latestValues:{},d={...this.latestValues},u=O();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!r;const m=w(),p=a?a.source:void 0,f=this.layout?this.layout.source:void 0,y=p!==f,v=this.getStack(),g=!v||v.members.length<=1,j=!!(y&&!g&&this.options.crossfade===!0&&!this.path.some(Bs));this.animationProgress=0;let C;this.mixTargetDelta=b=>{const T=b/1e3;se(u.x,n.x,T),se(u.y,n.y,T),this.setTargetDelta(u),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(X(m,this.layout.layoutBox,this.relativeParent.layout.layoutBox),Ls(this.relativeTarget,this.relativeTargetOrigin,m,T),C&&fs(this.relativeTarget,C)&&(this.isProjectionDirty=!1),C||(C=w()),R(C,this.relativeTarget)),y&&(this.animationValues=d,cs(d,c,this.latestValues,T,j,g)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=T},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(n){this.notifyListeners("animationStart"),this.currentAnimation&&this.currentAnimation.stop(),this.resumingFrom&&this.resumingFrom.currentAnimation&&this.resumingFrom.currentAnimation.stop(),this.pendingAnimation&&(Y(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=B.update(()=>{et.hasAnimatedSinceResize=!0,this.currentAnimation=ss(0,te,{...n,onUpdate:r=>{this.mixTargetDelta(r),n.onUpdate&&n.onUpdate(r)},onStop:()=>{},onComplete:()=>{n.onComplete&&n.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const n=this.getStack();n&&n.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(te),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const n=this.getLead();let{targetWithTransforms:r,target:a,layout:c,latestValues:d}=n;if(!(!r||!a||!c)){if(this!==n&&this.layout&&c&&We(this.options.animationType,this.layout.layoutBox,c.layoutBox)){a=this.target||w();const u=D(this.layout.layoutBox.x);a.x.min=n.target.x.min,a.x.max=a.x.min+u;const m=D(this.layout.layoutBox.y);a.y.min=n.target.y.min,a.y.max=a.y.min+m}R(r,a),J(r,d),G(this.projectionDeltaWithTransform,this.layoutCorrected,r,d)}}registerSharedNode(n,r){this.sharedNodes.has(n)||this.sharedNodes.set(n,new ys),this.sharedNodes.get(n).add(r);const c=r.options.initialPromotionConfig;r.promote({transition:c?c.transition:void 0,preserveFollowOpacity:c&&c.shouldPreserveFollowOpacity?c.shouldPreserveFollowOpacity(r):void 0})}isLead(){const n=this.getStack();return n?n.lead===this:!0}getLead(){var n;const{layoutId:r}=this.options;return r?((n=this.getStack())===null||n===void 0?void 0:n.lead)||this:this}getPrevLead(){var n;const{layoutId:r}=this.options;return r?(n=this.getStack())===null||n===void 0?void 0:n.prevLead:void 0}getStack(){const{layoutId:n}=this.options;if(n)return this.root.sharedNodes.get(n)}promote({needsReset:n,transition:r,preserveFollowOpacity:a}={}){const c=this.getStack();c&&c.promote(this,a),n&&(this.projectionDelta=void 0,this.needsReset=!0),r&&this.setOptions({transition:r})}relegate(){const n=this.getStack();return n?n.relegate(this):!1}resetSkewAndRotation(){const{visualElement:n}=this.options;if(!n)return;let r=!1;const{latestValues:a}=n;if((a.z||a.rotate||a.rotateX||a.rotateY||a.rotateZ||a.skewX||a.skewY)&&(r=!0),!r)return;const c={};a.z&&mt("z",n,c,this.animationValues);for(let d=0;d<ut.length;d++)mt(`rotate${ut[d]}`,n,c,this.animationValues),mt(`skew${ut[d]}`,n,c,this.animationValues);n.render();for(const d in c)n.setStaticValue(d,c[d]),this.animationValues&&(this.animationValues[d]=c[d]);n.scheduleRender()}getProjectionStyles(n){var r,a;if(!this.instance||this.isSVG)return;if(!this.isVisible)return xs;const c={visibility:""},d=this.getTransformTemplate();if(this.needsReset)return this.needsReset=!1,c.opacity="",c.pointerEvents=ct(n==null?void 0:n.pointerEvents)||"",c.transform=d?d(this.latestValues,""):"none",c;const u=this.getLead();if(!this.projectionDelta||!this.layout||!u.target){const y={};return this.options.layoutId&&(y.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,y.pointerEvents=ct(n==null?void 0:n.pointerEvents)||""),this.hasProjected&&!$(this.latestValues)&&(y.transform=d?d({},""):"none",this.hasProjected=!1),y}const m=u.animationValues||u.latestValues;this.applyTransformsToTarget(),c.transform=gs(this.projectionDeltaWithTransform,this.treeScale,m),d&&(c.transform=d(m,c.transform));const{x:p,y:f}=this.projectionDelta;c.transformOrigin=`${p.origin*100}% ${f.origin*100}% 0`,u.animationValues?c.opacity=u===this?(a=(r=m.opacity)!==null&&r!==void 0?r:this.latestValues.opacity)!==null&&a!==void 0?a:1:this.preserveOpacity?this.latestValues.opacity:m.opacityExit:c.opacity=u===this?m.opacity!==void 0?m.opacity:"":m.opacityExit!==void 0?m.opacityExit:0;for(const y in jt){if(m[y]===void 0)continue;const{correct:v,applyTo:g,isCSSVariable:j}=jt[y],C=c.transform==="none"?m[y]:v(m[y],u);if(g){const b=g.length;for(let T=0;T<b;T++)c[g[T]]=C}else j?this.options.visualElement.renderState.vars[y]=C:c[y]=C}return this.options.layoutId&&(c.pointerEvents=u===this?ct(n==null?void 0:n.pointerEvents)||"":"none"),c}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(n=>{var r;return(r=n.currentAnimation)===null||r===void 0?void 0:r.stop()}),this.root.nodes.forEach(ee),this.root.sharedNodes.clear()}}}function Ps(t){t.updateLayout()}function js(t){var e;const i=((e=t.resumeFrom)===null||e===void 0?void 0:e.snapshot)||t.snapshot;if(t.isLead()&&t.layout&&i&&t.hasListeners("didUpdate")){const{layoutBox:s,measuredBox:o}=t.layout,{animationType:h}=t.options,n=i.source!==t.layout.source;h==="size"?L(u=>{const m=n?i.measuredBox[u]:i.layoutBox[u],p=D(m);m.min=s[u].min,m.max=m.min+p}):We(h,i.layoutBox,s)&&L(u=>{const m=n?i.measuredBox[u]:i.layoutBox[u],p=D(s[u]);m.max=m.min+p,t.relativeTarget&&!t.currentAnimation&&(t.isProjectionDirty=!0,t.relativeTarget[u].max=t.relativeTarget[u].min+p)});const r=O();G(r,s,i.layoutBox);const a=O();n?G(a,t.applyTransform(o,!0),i.measuredBox):G(a,s,i.layoutBox);const c=!Ue(r);let d=!1;if(!t.resumeFrom){const u=t.getClosestProjectingParent();if(u&&!u.resumeFrom){const{snapshot:m,layout:p}=u;if(m&&p){const f=w();X(f,i.layoutBox,m.layoutBox);const y=w();X(y,s,p.layoutBox),ze(f,y)||(d=!0),u.options.layoutRoot&&(t.relativeTarget=y,t.relativeTargetOrigin=f,t.relativeParent=u)}}}t.notifyListeners("didUpdate",{layout:s,snapshot:i,delta:a,layoutDelta:r,hasLayoutChanged:c,hasRelativeLayoutChanged:d})}else if(t.isLead()){const{onExitComplete:s}=t.options;s&&s()}t.options.transition=void 0}function Cs(t){t.parent&&(t.isProjecting()||(t.isProjectionDirty=t.parent.isProjectionDirty),t.isSharedProjectionDirty||(t.isSharedProjectionDirty=!!(t.isProjectionDirty||t.parent.isProjectionDirty||t.parent.isSharedProjectionDirty)),t.isTransformDirty||(t.isTransformDirty=t.parent.isTransformDirty))}function Ts(t){t.isProjectionDirty=t.isSharedProjectionDirty=t.isTransformDirty=!1}function ws(t){t.clearSnapshot()}function ee(t){t.clearMeasurements()}function Es(t){t.isLayoutDirty=!1}function Ds(t){const{visualElement:e}=t.options;e&&e.getProps().onBeforeLayoutMeasure&&e.notify("BeforeLayoutMeasure"),t.resetTransform()}function ie(t){t.finishAnimation(),t.targetDelta=t.relativeTarget=t.target=void 0,t.isProjectionDirty=!0}function Ss(t){t.resolveTargetDelta()}function As(t){t.calcProjection()}function bs(t){t.resetSkewAndRotation()}function Rs(t){t.removeLeadSnapshot()}function se(t,e,i){t.translate=E(e.translate,0,i),t.scale=E(e.scale,1,i),t.origin=e.origin,t.originPoint=e.originPoint}function ne(t,e,i,s){t.min=E(e.min,i.min,s),t.max=E(e.max,i.max,s)}function Ls(t,e,i,s){ne(t.x,e.x,i.x,s),ne(t.y,e.y,i.y,s)}function Bs(t){return t.animationValues&&t.animationValues.opacityExit!==void 0}const Vs={duration:.45,ease:[.4,0,.1,1]},oe=t=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(t),re=oe("applewebkit/")&&!oe("chrome/")?Math.round:z;function ae(t){t.min=re(t.min),t.max=re(t.max)}function ks(t){ae(t.x),ae(t.y)}function We(t,e,i){return t==="position"||t==="preserve-aspect"&&!Ui(Jt(e),Jt(i),.2)}function Ms(t){var e;return t!==t.root&&((e=t.scroll)===null||e===void 0?void 0:e.wasRoot)}const Is=_e({attachResizeListener:(t,e)=>xt(t,"resize",e),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}),checkIsScrollRoot:()=>!0}),pt={current:void 0},He=_e({measureScroll:t=>({x:t.scrollLeft,y:t.scrollTop}),defaultParent:()=>{if(!pt.current){const t=new Is({});t.mount(window),t.setOptions({layoutScroll:!0}),pt.current=t}return pt.current},resetTransform:(t,e)=>{t.style.transform=e!==void 0?e:"none"},checkIsScrollRoot:t=>window.getComputedStyle(t).position==="fixed"}),Fs={pan:{Feature:Ki},drag:{Feature:Ji,ProjectionNode:He,MeasureLayout:Ne}},Ns={layout:{ProjectionNode:He,MeasureLayout:Ne}},$s=ni({...Si,...Di,...Fs,...Ns},Ei),le=Bi($s),Os=P.div`
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
`,Us=P(Os)`
  width: 100%;

  @media (min-width: 768px) {
    width: 45%;
    max-width: fit-content;
  }
`,Ge=P.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  font-style: ${({theme:t})=>t.font};
  width: 100%;
  z-index: 12;
`;function F({className:t,children:e,style:i}){const s=()=>{};return l.jsx(Ge,{onChange:s,className:t,style:i,children:e})}function q({className:t,isLongOnMobile:e,children:i,style:s}){return e?l.jsx(Us,{className:t,style:{...s},children:i}):l.jsx(Ge,{className:t,children:i})}const zs=P.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  max-width: 100vw;

  @media (min-width: 768px) {
    flex-wrap: nowrap;
    max-width: 100%;
  }
`;function vt({children:t}){return l.jsx(zs,{className:"address-box",children:t})}vt.propTypes={children:nt.node.isRequired};function qs({invoice:t}){var n,r,a,c,d,u;const e=rt(),{formState:{errors:i},register:s}=k(),{isDraft:o}=M(),h=l.jsxs(F,{style:{width:e<768?"100%":""},className:"client-country",children:[l.jsx(V,{htmlFor:"clientCountry",style:{color:i.clientCountry?"#EC5757":""},children:"Country"}),l.jsx(we,{id:"clientCountry",$long:!1,style:{border:i!=null&&i.clientCountry?"1px solid #EC5757":"",width:e<768?"100%":""},type:"text",defaultValue:t?(n=t==null?void 0:t.clientAddress)==null?void 0:n.country:"",...s("clientCountry",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return l.jsxs(l.Fragment,{children:[l.jsxs(F,{className:"client-name",children:[l.jsx(V,{htmlFor:"clientName",style:{color:i.clientName?"#EC5757":""},children:"Client's Name"}),((r=i.clientName)==null?void 0:r.type)==="required"&&l.jsx(Ct,{children:"can't be empty"}),l.jsx(ft,{id:"clientName",$long:!0,style:{border:i.clientName?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientName:"",...s("clientName",{required:!o})})]}),l.jsxs(F,{className:"client-email",children:[l.jsx(V,{htmlFor:"clientEmail",style:{color:i.clientEmail?"#EC5757":""},children:"Client's Email"}),((a=i.clientEmail)==null?void 0:a.type)==="pattern"&&l.jsx(Ct,{style:{position:"absolute",top:"-8px"},children:"Invalid email"}),l.jsx(ft,{id:"clientEmail",$long:!0,style:{border:i.clientEmail?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientEmail:"",...s("clientEmail",{required:!o,pattern:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/})})]}),l.jsxs(F,{className:"client-street-address",children:[l.jsx(V,{htmlFor:"clientStreetAddress",style:{color:i.clientStreetAddress?"#EC5757":""},children:"Street Address"}),l.jsx(Ee,{id:"clientStreetAddress",style:{border:i.clientStreetAddress?"1px solid #EC5757":""},defaultValue:t?(c=t==null?void 0:t.clientAddress)==null?void 0:c.street:"",...s("clientStreetAddress",{required:!o})})]}),l.jsxs(vt,{children:[l.jsxs(q,{className:"clientCity",children:[l.jsx(V,{htmlFor:"clientCity",style:{color:i.clientCity?"#EC5757":""},children:"City"}),l.jsx(ot,{id:"clientCity",style:{border:i.clientCity?"1px solid #EC5757":""},type:"text",defaultValue:t?(d=t==null?void 0:t.clientAddress)==null?void 0:d.city:"",...s("clientCity",{required:!o,pattern:/[\w ]*/i,maxLength:30})})]}),l.jsxs(q,{className:"clientPostalCode",children:[l.jsx(V,{htmlFor:"clientPostalCode",style:{color:i.clientPostalCode?"#EC5757":""},children:"Post Code"}),l.jsx(ot,{id:"clientPostalCode",style:{border:i.clientPostalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(u=t==null?void 0:t.clientAddress)==null?void 0:u.postCode:"",...s("clientPostalCode",{required:!o,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]}),e<768&&l.jsx(F,{className:"client-country",children:h}),e>=768&&l.jsx(q,{className:"client-country",children:h})]})]})}const _s=P.div`
  display: contents;
  width: 100%;
  justify-content: space-between;

  @media (min-width: 350px) {
    display: flex;
  }
  @media (min-width: 600px) {
    display: contents;
  }
`;function Ws({invoice:t}){var n,r,a,c;const e=rt(),{formState:{errors:i},register:s}=k(),{isDraft:o}=M(),h=l.jsxs(F,{style:{width:e<768?"100%":""},className:"company-country",children:[l.jsx(V,{htmlFor:"CompanyCountry",style:{color:i!=null&&i.country?"#EC5757":""},children:"Country"}),l.jsx(we,{id:"CompanyCountry",type:"text",style:{border:i!=null&&i.country?"1px solid #EC5757":"",width:e<768?"100%":""},defaultValue:t?(n=t==null?void 0:t.senderAddress)==null?void 0:n.country:"",...s("country",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return l.jsxs(l.Fragment,{children:[l.jsxs(F,{className:"company-street-address",children:[l.jsx(V,{htmlFor:"streetAddress",style:{color:i!=null&&i.streetAddress?"#EC5757":""},children:"Street Address"}),l.jsx(Ee,{id:"streetAddress",style:{border:i!=null&&i.streetAddress?"1px solid #EC5757":""},defaultValue:t?(r=t==null?void 0:t.senderAddress)==null?void 0:r.street:"",...s("streetAddress",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:50})})]}),l.jsxs(vt,{children:[l.jsxs(_s,{children:[l.jsxs(q,{className:"company-city",children:[l.jsx(V,{htmlFor:"companyCity",style:{color:i!=null&&i.city?"#EC5757":""},children:"City"}),l.jsx(ot,{id:"companyCity",style:{border:i!=null&&i.city?"1px solid #EC5757":""},defaultValue:t?(a=t==null?void 0:t.senderAddress)==null?void 0:a.city:"",type:"text",...s("city",{required:!o,pattern:/[\w ]*/i,maxLength:30})})]}),l.jsxs(q,{style:{justifySelf:"flex-end"},className:"company-postal-code",children:[l.jsx(V,{htmlFor:"CompanyPostalCode",style:{color:i!=null&&i.postalCode?"#EC5757":""},children:"Post Code"}),l.jsx(ot,{id:"CompanyPostalCode",style:{border:i!=null&&i.postalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(c=t==null?void 0:t.senderAddress)==null?void 0:c.postCode:"",...s("postalCode",{required:!o,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]})]}),e<768&&l.jsx(F,{className:"company-country-container",children:h}),e>=768&&l.jsx(q,{className:"company-country-container",children:h})]})]})}function Hs({invoice:t}){const{formState:{errors:e},register:i}=k(),{isDraft:s}=M();return l.jsx(l.Fragment,{children:l.jsxs(F,{className:"project-description",children:[l.jsx(V,{htmlFor:"projectDescription",style:{color:e.projectDescription?"#EC5757":""},children:"Project Description"}),l.jsx(ft,{id:"projectDescription",type:"text",defaultValue:t==null?void 0:t.description,...i("projectDescription",{required:!s}),style:{border:e.projectDescription?"1px solid #EC5757":""}})]})})}const ce=P.div`
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
`,Xe=P.input`
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
`,Gs=P(Xe)`
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
`,Ye=P(Xe).attrs({pattern:"\\d+"})`
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
`,Xs=P(Ye).attrs({pattern:"[0-9.]*"})`
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
`,de=P.p`
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
`;const Ys=P.div`
  display: grid;
  grid-template: 1fr / 220px 62px 116px 61px 49px;
`,he=P.svg`
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
`,W=P.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: fit-content;
  width: fit-content;
`,Zs=P(W)`
  text-align: right;

  @media (min-width: 325px) {
    align-items: flex-start;
    text-align: initial;
  }
`,Qs=P.div`
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
`,ue=l.jsx("path",{d:"M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z",fillRule:"nonzero",className:"deleteIconPath",tabIndex:0}),Js=P.button`
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
`,xn=P.svg`
  width: 11px;
  height: 11px;
`,Ks=P.p`
  color: ${({theme:t})=>t.newItemText};
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  text-align: center;
  letter-spacing: -0.25px;
  margin-left: 0.25rem;
`;function tn({items:t,append:e}){const{clearErrors:i}=k(),{formState:{submitCount:s}}=oi(),o=()=>{e({id:"",name:"",quantity:"",price:"",total:""}),i("itemsError")};return l.jsx(Js,{onClick:o,type:"button",style:{border:s>0&&t.length===0?"1px solid red":"1px solid transparent"},children:l.jsx(Ks,{children:"+ Add New Item"})})}const en=P.div`
  display: grid;
  width: 100%;
  border-radius: 8px;
  grid-template-rows: auto;
  background-color: ${({theme:t})=>t.formBackground};
`,sn=P.div`
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
`,U=P.label`
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
`,it=P(U)`
  justify-self: start;

  @media (min-width: 600px) {
    &.mobile-only-label {
      display: none;
    }
  }
`,nn=P.div`
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
`,on=P.h1`
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
`;function me({index:t,invoice:e}){var r,a,c,d,u,m,p;const{register:i,formState:s}=k(),{errors:o}=s,{isDraft:h}=M(),n=()=>{var f,y,v;return((v=(y=(f=o==null?void 0:o.items)==null?void 0:f[t])==null?void 0:y.quantity)==null?void 0:v.type)==="pattern"};return l.jsxs("div",{style:{position:"relative"},children:[l.jsx(Ye,{...i(`items[${t}].quantity`,{required:!h,max:1e3,pattern:{value:/^[0-9]+$/,message:"Only numbers are allowed"}}),placeholder:"0",inputMode:"numeric",type:"text",style:{border:Array.isArray(o.items)&&((a=(r=o==null?void 0:o.items)==null?void 0:r[t])!=null&&a.quantity)?"1px solid #EC5757":""},defaultValue:e?(d=(c=e==null?void 0:e.items)==null?void 0:c[t])==null?void 0:d.quantity:0}),Array.isArray(o.items)&&n()&&l.jsx("span",{style:{position:"absolute",zIndex:1,top:"100%",left:"0",marginTop:"4px",padding:"6px 8px",backgroundColor:"#f8d7da",color:"#721c24",border:"1px solid #f5c6cb",borderRadius:"4px",whiteSpace:"pre-line",textWrap:"nowrap"},children:(p=(m=(u=o==null?void 0:o.items)==null?void 0:u[t])==null?void 0:m.quantity)==null?void 0:p.message})]})}function pe({index:t,invoice:e}){var r,a,c,d,u,m,p;const{register:i,formState:s}=k(),{errors:o}=s,{isDraft:h}=M(),n=()=>{var f,y,v;return((v=(y=(f=o==null?void 0:o.items)==null?void 0:f[t])==null?void 0:y.price)==null?void 0:v.type)==="pattern"};return l.jsxs("div",{style:{position:"relative"},children:[l.jsx(Xs,{...i(`items[${t}].price`,{required:!h,max:1e5,pattern:{value:/^\$?\d+(,\d{3})*\.?[0-9]?[0-9]?$/,message:"Only numbers are allowed - max 2 decimal places"}}),placeholder:"0.00",inputMode:"numeric",type:"text",defaultValue:e?(a=(r=e==null?void 0:e.items)==null?void 0:r[t])==null?void 0:a.price:0,style:{border:Array.isArray(o.items)&&((d=(c=o==null?void 0:o.items)==null?void 0:c[t])!=null&&d.price)?"1px solid #EC5757":""}}),Array.isArray(o.items)&&n()&&l.jsx("div",{style:{position:"absolute",zIndex:1,top:"100%",left:"0",marginTop:"4px",padding:"6px 8px",backgroundColor:"#f8d7da",color:"#721c24",border:"1px solid #f5c6cb",borderRadius:"4px",whiteSpace:"prewrap"},children:(p=(m=(u=o==null?void 0:o.items)==null?void 0:u[t])==null?void 0:m.price)==null?void 0:p.message})]})}function fe({index:t,invoice:e}){var n,r,a,c;const{register:i,formState:s}=k(),{errors:o}=s,{isDraft:h}=M();return l.jsx(Gs,{...i(`items[${t}].name`,{required:!h}),placeholder:"Item name",defaultValue:e?(r=(n=e==null?void 0:e.items)==null?void 0:n[t])==null?void 0:r.name:"",type:"text",style:{border:Array.isArray(o.items)&&((c=(a=o==null?void 0:o.items)==null?void 0:a[t])!=null&&c.name)?"1px solid #EC5757":""}})}function Ze({invoice:t,isEditOpen:e}){const{formState:i,watch:s,clearErrors:o,setError:h,reset:n}=k(),{fields:r,remove:a,append:c}=ri({name:"items",rules:{required:!0,minLength:1}}),{isSubmitting:d}=i,{isCacheActive:u}=M(),m=s("items",[]),p=rt(),f=x.useRef(!0);x.useEffect(()=>{!r.length&&!f.current?h("myFieldArray",{type:"required",message:"At least one item is required"}):o("myFieldArray"),f.current&&(f.current=!1)},[r,d]),x.useEffect(()=>{localStorage.getItem("cachedEditInvoiceForm")||(t&&e&&!u?n({country:t.senderAddress.country,streetAddress:t.senderAddress.street,city:t.senderAddress.city,postalCode:t.senderAddress.postCode,clientEmail:t.clientEmail,clientName:t.clientName,clientCountry:t.clientAddress.country,clientStreetAddress:t.clientAddress.street,clientCity:t.clientAddress.city,clientPostalCode:t.clientAddress.postCode,description:t.description,paymentDue:t.paymentDue,paymentTerms:t.paymentTerms,status:t.status,total:t.total,items:t.items.map(j=>({id:j.id,name:j.name,quantity:j.quantity,price:j.price,total:j.total}))}):!t&&!u&&!e&&n({items:[{name:"",price:0,quantity:0,total:0}]}))},[t,e,n]);const y=g=>{var j,C;return l.jsxs(ce,{children:[l.jsxs(W,{style:{width:"100%",marginBottom:"1.5rem"},children:[l.jsx(it,{style:{marginBottom:"1rem"},children:"Item Name"}),l.jsx(fe,{index:g,invoice:t})]}),l.jsxs(Qs,{children:[l.jsxs(W,{children:[l.jsx(U,{style:{marginBottom:"0.625rem"},children:"Qty."}),l.jsx(me,{index:g,invoice:t})]}),l.jsxs(W,{children:[l.jsx(U,{style:{marginBottom:"0.625rem"},children:"Price"}),l.jsx(pe,{index:g,invoice:t})]}),l.jsxs(Zs,{style:{width:"fit-content"},children:[l.jsx(U,{style:{marginBottom:"0.625rem"},children:"Total"}),l.jsx(de,{children:(Number((j=m==null?void 0:m[g])==null?void 0:j.quantity)*Number((C=m==null?void 0:m[g])==null?void 0:C.price)).toFixed(2)})]})]}),l.jsxs(W,{children:[l.jsx(U,{style:{marginBottom:"0.625rem"},children:"  "}),l.jsx(he,{name:"removeButton",onClick:()=>a(g),children:ue})]})]})},v=g=>{var j,C;return l.jsx(ce,{children:l.jsxs(Ys,{children:[l.jsx(fe,{index:g,invoice:t}),l.jsx(me,{index:g,invoice:t}),l.jsx(pe,{index:g,invoice:t}),l.jsx(de,{children:(Number((j=m==null?void 0:m[g])==null?void 0:j.quantity)*Number((C=m==null?void 0:m[g])==null?void 0:C.price)).toFixed(2)}),l.jsx(he,{name:"removeButton",onClick:()=>a(g),children:ue})]})})};return l.jsxs(l.Fragment,{children:[l.jsx("ul",{style:{listStyle:"none",marginLeft:"0",paddingLeft:0},children:r.map((g,j)=>l.jsx("li",{"data-testid":"invoice-item",children:l.jsxs("div",{children:[p<600&&y(j),p>=600&&v(j)]})},g.id))}),l.jsx(tn,{append:c,items:t?t.items:[]})]})}Ze.propTypes={isDraft:nt.bool.isRequired,isEditOpen:nt.bool};const rn=({className:t})=>l.jsxs(sn,{className:t,children:[l.jsx(it,{children:"Item Name"}),l.jsx(it,{children:"Qty."}),l.jsx(it,{children:"Price"}),l.jsx(U,{children:"Total"})]});function an({invoice:t,isEditOpen:e=!1}){const{isDraft:i}=M();return l.jsxs(en,{"data-testid":"items-container",children:[l.jsx(on,{children:"Item List"}),l.jsx(rn,{className:"desktop-only-label"}),l.jsx(nn,{children:l.jsx(Ze,{isDraft:i,invoice:t,isEditOpen:e})})]})}const ln=t=>{var i;const e=[];if(!t)return[];for(const s in t)(i=t[s])!=null&&i.type&&e.push(t[s].type);return t.items&&t.items instanceof Array&&t.items.forEach(s=>{s&&typeof s=="object"&&Object.keys(s).forEach(o=>{const h=s[o];h!=null&&h.type&&e.push(h.type)})}),Array.from(new Set(e))};function vn(t,e){var i;if(t){for(const s in t)((i=t[s])==null?void 0:i.type)===e&&delete t[s];t.items&&t.items.forEach(s=>{Object.keys(s).forEach(o=>{var h;((h=s[o])==null?void 0:h.type)===e&&delete s[o]})})}}function Qe({isEditOpen:t}){const{formState:{errors:e}}=k();return l.jsxs(ai,{children:[l.jsx(Tt,{style:{visibility:ln(e).includes("required")&&t?"visible":"hidden"},children:"- All fields must be added"}),l.jsx(Tt,{style:{visibility:e.myFieldArray&&t?"visible":"hidden"},children:"- An item must be added"})]})}Qe.propTypes={isEditOpen:nt.bool.isRequired};const cn=P.form`
  position: relative;
  z-index: 1;
  padding-bottom: 6rem;

  @media (min-width: 325px) {
    padding-bottom: 0;
  }
`,dn=Ce.lazy(()=>Te(()=>import("./NewInvoiceBottomMenu-BfVgKRrY.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9]))),hn=Ce.lazy(()=>Te(()=>import("./DateAndPayment-Dv5Hftmq.js").then(t=>t.D),__vite__mapDeps([10,1,2,8,3,6]))),Pn=()=>{const{isNewInvoiceOpen:t}=M();return l.jsxs(l.Fragment,{children:[l.jsx(li,{children:"New Invoice"}),l.jsxs(cn,{style:{zIndex:1,position:"relative"},children:[l.jsx(wt,{children:"Bill From"}),l.jsx(Ws,{}),l.jsx(wt,{children:"Bill To"}),l.jsx(qs,{}),l.jsx(hn,{}),l.jsx(Hs,{}),l.jsx(an,{}),l.jsx(Qe,{isEditOpen:t}),l.jsx(x.Suspense,{fallback:l.jsx("div",{children:"Loading..."}),children:l.jsx(dn,{closeText:"Discard",justifyCancel:"flex-start"})})]})]})},jn=t=>{const{getValues:e,reset:i}=k(),{isCacheActive:s,setIsCacheActive:o}=M(),h=()=>{const r=e();localStorage.setItem(t,JSON.stringify(r))},n=()=>{localStorage.removeItem(t),o(!1)};return x.useEffect(()=>{const r=localStorage.getItem(t);r&&s&&i(JSON.parse(r))},[i,t]),{cacheFormData:h,clearCache:n}},Cn=({children:t})=>{const e=rt();let i=700;e<=616?i=e:e<=768?i=616:i=700;const s={hidden:{x:`${-i}px`},visible:{x:"0"},exit:{x:`${-i}px`}};return l.jsxs(l.Fragment,{children:[l.jsx(le.div,{initial:{opacity:0},animate:{opacity:.5},exit:{opacity:0},transition:{duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#000",zIndex:1e3,cursor:"pointer"}},"overlay"),l.jsx(le.div,{variants:s,initial:"hidden",animate:"visible",exit:"exit",transition:{type:"tween",duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:`${i}px`,height:"100%",minHeight:"100vh",color:"#ecf0f1",padding:"20px",zIndex:1001,boxShadow:"2px 0 5px rgba(0,0,0,0.3)"},children:t},"sidebar")]})};export{yn as A,Ws as C,Hs as D,an as E,cn as F,Pn as I,Cn as S,qs as a,Qe as b,vn as c,q as d,ln as e,xn as f,jn as u};
