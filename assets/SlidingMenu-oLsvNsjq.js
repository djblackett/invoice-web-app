import{r as P,Z as ai,j as d,$ as Ae,a0 as be,a1 as li,a2 as Re,a3 as k,a4 as rt,a5 as L,a6 as Le,a7 as lt,a8 as pt,a9 as z,aa as Ve,ab as ci,ac as di,ad as Be,ae as ui,af as vt,ag as Pt,ah as Bt,ai as hi,d as T,a as xt,e as mi,aj as fi}from"./index-D1B1EIKJ.js";import{P as yt,c as W,u as at,d as pi,e as Ie,A as yi,f as gi,G as xi,E as vi}from"./invoice.queries-UruHYCCu.js";import{L as M,C as ke,S as Me,A as gt,a as Pi,b as It,c as kt,I as St}from"./editPageStyles-DBqYrXBk.js";import{c as jt,v as Mt}from"./utilityFunctions-uQjSmZ7Z.js";import{u as Ft}from"./useMutation-2Q1gDOlO.js";import{i as F,b as Lt,d as ji,e as Ci,f as Fe,p as Ti,s as Ei,m as wi,h as A,j as At,k as S,l as Di,n as Si,o as Nt,q as Ne,r as Ai,F as $e,t as $t,u as bi,v as Oe,w as Ue,x as qe,y as Ri,z as Ot,S as Li,A as Vi,B as O,C as ct,D as dt,E as Ut,G as Bi,H as Ii,I as ki,J as U,K as Mi,c as Fi,a as Ni,g as $i}from"./create-visual-element-C2cQkUZK.js";class Oi extends P.Component{getSnapshotBeforeUpdate(e){const i=this.props.childRef.current;if(i&&e.isPresent&&!this.props.isPresent){const s=this.props.sizeRef.current;s.height=i.offsetHeight||0,s.width=i.offsetWidth||0,s.top=i.offsetTop,s.left=i.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function Ui({children:t,isPresent:e}){const i=P.useId(),s=P.useRef(null),a=P.useRef({width:0,height:0,top:0,left:0}),{nonce:m}=P.useContext(ai);return P.useInsertionEffect(()=>{const{width:n,height:o,top:r,left:l}=a.current;if(e||!s.current||!n||!o)return;s.current.dataset.motionPopId=i;const c=document.createElement("style");return m&&(c.nonce=m),document.head.appendChild(c),c.sheet&&c.sheet.insertRule(`
          [data-motion-pop-id="${i}"] {
            position: absolute !important;
            width: ${n}px !important;
            height: ${o}px !important;
            top: ${r}px !important;
            left: ${l}px !important;
          }
        `),()=>{document.head.removeChild(c)}},[e]),d.jsx(Oi,{isPresent:e,childRef:s,sizeRef:a,children:P.cloneElement(t,{ref:s})})}const qi=({children:t,initial:e,isPresent:i,onExitComplete:s,custom:a,presenceAffectsLayout:m,mode:n})=>{const o=Ae(zi),r=P.useId(),l=P.useCallback(u=>{o.set(u,!0);for(const h of o.values())if(!h)return;s&&s()},[o,s]),c=P.useMemo(()=>({id:r,initial:e,isPresent:i,custom:a,onExitComplete:l,register:u=>(o.set(u,!1),()=>o.delete(u))}),m?[Math.random(),l]:[i,l]);return P.useMemo(()=>{o.forEach((u,h)=>o.set(h,!1))},[i]),P.useEffect(()=>{!i&&!o.size&&s&&s()},[i]),n==="popLayout"&&(t=d.jsx(Ui,{isPresent:i,children:t})),d.jsx(be.Provider,{value:c,children:t})};function zi(){return new Map}function ze(t=!0){const e=P.useContext(be);if(e===null)return[!0,null];const{isPresent:i,onExitComplete:s,register:a}=e,m=P.useId();P.useEffect(()=>{t&&a(m)},[t]);const n=P.useCallback(()=>t&&s&&s(m),[m,s,t]);return!i&&s?[!1,n]:[!0]}const ut=t=>t.key||"";function qt(t){const e=[];return P.Children.forEach(t,i=>{P.isValidElement(i)&&e.push(i)}),e}const jn=({children:t,custom:e,initial:i=!0,onExitComplete:s,presenceAffectsLayout:a=!0,mode:m="sync",propagate:n=!1})=>{const[o,r]=ze(n),l=P.useMemo(()=>qt(t),[t]),c=n&&!o?[]:l.map(ut),u=P.useRef(!0),h=P.useRef(l),f=Ae(()=>new Map),[y,g]=P.useState(l),[x,E]=P.useState(l);li(()=>{u.current=!1,h.current=l;for(let v=0;v<x.length;v++){const C=ut(x[v]);c.includes(C)?f.delete(C):f.get(C)!==!0&&f.set(C,!1)}},[x,c.length,c.join("-")]);const w=[];if(l!==y){let v=[...l];for(let C=0;C<x.length;C++){const j=x[C],b=ut(j);c.includes(b)||(v.splice(C,0,j),w.push(j))}m==="wait"&&w.length&&(v=w),E(qt(v)),g(l);return}const{forceRender:p}=P.useContext(Re);return d.jsx(d.Fragment,{children:x.map(v=>{const C=ut(v),j=n&&!o?!1:l===x||c.includes(C),b=()=>{if(f.has(C))f.set(C,!0);else return;let D=!0;f.forEach(R=>{R||(D=!1)}),D&&(p==null||p(),E(h.current),n&&(r==null||r()),s&&s())};return d.jsx(qi,{isPresent:j,initial:!u.current||i?void 0:!1,custom:j?void 0:e,presenceAffectsLayout:a,mode:m,onExitComplete:j?void 0:b,children:v},C)})})};function _i(t){if(typeof Proxy>"u")return t;const e=new Map,i=(...s)=>t(...s);return new Proxy(i,{get:(s,a)=>a==="create"?t:(e.has(a)||e.set(a,t(a)),e.get(a))})}function Wi(t){return t==="x"||t==="y"?F[t]?null:(F[t]=!0,()=>{F[t]=!1}):F.x||F.y?null:(F.x=F.y=!0,()=>{F.x=F.y=!1})}function st(t,e,i,s){return Lt(t,e,ji(i),s)}const zt=(t,e)=>Math.abs(t-e);function Gi(t,e){const i=zt(t.x,e.x),s=zt(t.y,e.y);return Math.sqrt(i**2+s**2)}class _e{constructor(e,i,{transformPagePoint:s,contextWindow:a,dragSnapToOrigin:m=!1}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const u=Tt(this.lastMoveEventInfo,this.history),h=this.startEvent!==null,f=Gi(u.offset,{x:0,y:0})>=3;if(!h&&!f)return;const{point:y}=u,{timestamp:g}=L;this.history.push({...y,timestamp:g});const{onStart:x,onMove:E}=this.handlers;h||(x&&x(this.lastMoveEvent,u),this.startEvent=this.lastMoveEvent),E&&E(this.lastMoveEvent,u)},this.handlePointerMove=(u,h)=>{this.lastMoveEvent=u,this.lastMoveEventInfo=Ct(h,this.transformPagePoint),k.update(this.updatePoint,!0)},this.handlePointerUp=(u,h)=>{this.end();const{onEnd:f,onSessionEnd:y,resumeAnimation:g}=this.handlers;if(this.dragSnapToOrigin&&g&&g(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const x=Tt(u.type==="pointercancel"?this.lastMoveEventInfo:Ct(h,this.transformPagePoint),this.history);this.startEvent&&f&&f(u,x),y&&y(u,x)},!Ci(e))return;this.dragSnapToOrigin=m,this.handlers=i,this.transformPagePoint=s,this.contextWindow=a||window;const n=Fe(e),o=Ct(n,this.transformPagePoint),{point:r}=o,{timestamp:l}=L;this.history=[{...r,timestamp:l}];const{onSessionStart:c}=i;c&&c(e,Tt(o,this.history)),this.removeListeners=Ti(st(this.contextWindow,"pointermove",this.handlePointerMove),st(this.contextWindow,"pointerup",this.handlePointerUp),st(this.contextWindow,"pointercancel",this.handlePointerUp))}updateHandlers(e){this.handlers=e}end(){this.removeListeners&&this.removeListeners(),rt(this.updatePoint)}}function Ct(t,e){return e?{point:e(t.point)}:t}function _t(t,e){return{x:t.x-e.x,y:t.y-e.y}}function Tt({point:t},e){return{point:t,delta:_t(t,We(e)),offset:_t(t,Hi(e)),velocity:Xi(e,.1)}}function Hi(t){return t[0]}function We(t){return t[t.length-1]}function Xi(t,e){if(t.length<2)return{x:0,y:0};let i=t.length-1,s=null;const a=We(t);for(;i>=0&&(s=t[i],!(a.timestamp-s.timestamp>Ei(e)));)i--;if(!s)return{x:0,y:0};const m=wi(a.timestamp-s.timestamp);if(m===0)return{x:0,y:0};const n={x:(a.x-s.x)/m,y:(a.y-s.y)/m};return n.x===1/0&&(n.x=0),n.y===1/0&&(n.y=0),n}const Ge=1e-4,Yi=1-Ge,Zi=1+Ge,He=.01,Ki=0-He,Qi=0+He;function V(t){return t.max-t.min}function Ji(t,e,i){return Math.abs(t-e)<=i}function Wt(t,e,i,s=.5){t.origin=s,t.originPoint=A(e.min,e.max,t.origin),t.scale=V(i)/V(e),t.translate=A(i.min,i.max,t.origin)-t.originPoint,(t.scale>=Yi&&t.scale<=Zi||isNaN(t.scale))&&(t.scale=1),(t.translate>=Ki&&t.translate<=Qi||isNaN(t.translate))&&(t.translate=0)}function nt(t,e,i,s){Wt(t.x,e.x,i.x,s?s.originX:void 0),Wt(t.y,e.y,i.y,s?s.originY:void 0)}function Gt(t,e,i){t.min=i.min+e.min,t.max=t.min+V(e)}function ts(t,e,i){Gt(t.x,e.x,i.x),Gt(t.y,e.y,i.y)}function Ht(t,e,i){t.min=e.min-i.min,t.max=t.min+V(e)}function ot(t,e,i){Ht(t.x,e.x,i.x),Ht(t.y,e.y,i.y)}function es(t,{min:e,max:i},s){return e!==void 0&&t<e?t=s?A(e,t,s.min):Math.max(t,e):i!==void 0&&t>i&&(t=s?A(i,t,s.max):Math.min(t,i)),t}function Xt(t,e,i){return{min:e!==void 0?t.min+e:void 0,max:i!==void 0?t.max+i-(t.max-t.min):void 0}}function is(t,{top:e,left:i,bottom:s,right:a}){return{x:Xt(t.x,i,a),y:Xt(t.y,e,s)}}function Yt(t,e){let i=e.min-t.min,s=e.max-t.max;return e.max-e.min<t.max-t.min&&([i,s]=[s,i]),{min:i,max:s}}function ss(t,e){return{x:Yt(t.x,e.x),y:Yt(t.y,e.y)}}function ns(t,e){let i=.5;const s=V(t),a=V(e);return a>s?i=At(e.min,e.max-s,t.min):s>a&&(i=At(t.min,t.max-a,e.min)),Le(0,1,i)}function os(t,e){const i={};return e.min!==void 0&&(i.min=e.min-t.min),e.max!==void 0&&(i.max=e.max-t.min),i}const bt=.35;function rs(t=bt){return t===!1?t=0:t===!0&&(t=bt),{x:Zt(t,"left","right"),y:Zt(t,"top","bottom")}}function Zt(t,e,i){return{min:Kt(t,e),max:Kt(t,i)}}function Kt(t,e){return typeof t=="number"?t:t[e]||0}function I(t){return[t("x"),t("y")]}const Xe=({current:t})=>t?t.ownerDocument.defaultView:null,as=new WeakMap;class ls{constructor(e){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=S(),this.visualElement=e}start(e,{snapToCursor:i=!1}={}){const{presenceContext:s}=this.visualElement;if(s&&s.isPresent===!1)return;const a=c=>{const{dragSnapToOrigin:u}=this.getProps();u?this.pauseAnimation():this.stopAnimation(),i&&this.snapToCursor(Fe(c).point)},m=(c,u)=>{const{drag:h,dragPropagation:f,onDragStart:y}=this.getProps();if(h&&!f&&(this.openDragLock&&this.openDragLock(),this.openDragLock=Wi(h),!this.openDragLock))return;this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),I(x=>{let E=this.getAxisMotionValue(x).get()||0;if(pt.test(E)){const{projection:w}=this.visualElement;if(w&&w.layout){const p=w.layout.layoutBox[x];p&&(E=V(p)*(parseFloat(E)/100))}}this.originPoint[x]=E}),y&&k.postRender(()=>y(c,u)),Nt(this.visualElement,"transform");const{animationState:g}=this.visualElement;g&&g.setActive("whileDrag",!0)},n=(c,u)=>{const{dragPropagation:h,dragDirectionLock:f,onDirectionLock:y,onDrag:g}=this.getProps();if(!h&&!this.openDragLock)return;const{offset:x}=u;if(f&&this.currentDirection===null){this.currentDirection=cs(x),this.currentDirection!==null&&y&&y(this.currentDirection);return}this.updateAxis("x",u.point,x),this.updateAxis("y",u.point,x),this.visualElement.render(),g&&g(c,u)},o=(c,u)=>this.stop(c,u),r=()=>I(c=>{var u;return this.getAnimationState(c)==="paused"&&((u=this.getAxisMotionValue(c).animation)===null||u===void 0?void 0:u.play())}),{dragSnapToOrigin:l}=this.getProps();this.panSession=new _e(e,{onSessionStart:a,onStart:m,onMove:n,onSessionEnd:o,resumeAnimation:r},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:l,contextWindow:Xe(this.visualElement)})}stop(e,i){const s=this.isDragging;if(this.cancel(),!s)return;const{velocity:a}=i;this.startAnimation(a);const{onDragEnd:m}=this.getProps();m&&k.postRender(()=>m(e,i))}cancel(){this.isDragging=!1;const{projection:e,animationState:i}=this.visualElement;e&&(e.isAnimationBlocked=!1),this.panSession&&this.panSession.end(),this.panSession=void 0;const{dragPropagation:s}=this.getProps();!s&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),i&&i.setActive("whileDrag",!1)}updateAxis(e,i,s){const{drag:a}=this.getProps();if(!s||!ht(e,a,this.currentDirection))return;const m=this.getAxisMotionValue(e);let n=this.originPoint[e]+s[e];this.constraints&&this.constraints[e]&&(n=es(n,this.constraints[e],this.elastic[e])),m.set(n)}resolveConstraints(){var e;const{dragConstraints:i,dragElastic:s}=this.getProps(),a=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(e=this.visualElement.projection)===null||e===void 0?void 0:e.layout,m=this.constraints;i&&lt(i)?this.constraints||(this.constraints=this.resolveRefConstraints()):i&&a?this.constraints=is(a.layoutBox,i):this.constraints=!1,this.elastic=rs(s),m!==this.constraints&&a&&this.constraints&&!this.hasMutatedConstraints&&I(n=>{this.constraints!==!1&&this.getAxisMotionValue(n)&&(this.constraints[n]=os(a.layoutBox[n],this.constraints[n]))})}resolveRefConstraints(){const{dragConstraints:e,onMeasureDragConstraints:i}=this.getProps();if(!e||!lt(e))return!1;const s=e.current,{projection:a}=this.visualElement;if(!a||!a.layout)return!1;const m=Di(s,a.root,this.visualElement.getTransformPagePoint());let n=ss(a.layout.layoutBox,m);if(i){const o=i(Si(n));this.hasMutatedConstraints=!!o,o&&(n=Ai(o))}return n}startAnimation(e){const{drag:i,dragMomentum:s,dragElastic:a,dragTransition:m,dragSnapToOrigin:n,onDragTransitionEnd:o}=this.getProps(),r=this.constraints||{},l=I(c=>{if(!ht(c,i,this.currentDirection))return;let u=r[c]||{};n&&(u={min:0,max:0});const h=a?200:1e6,f=a?40:1e7,y={type:"inertia",velocity:s?e[c]:0,bounceStiffness:h,bounceDamping:f,timeConstant:750,restDelta:1,restSpeed:10,...m,...u};return this.startAxisValueAnimation(c,y)});return Promise.all(l).then(o)}startAxisValueAnimation(e,i){const s=this.getAxisMotionValue(e);return Nt(this.visualElement,e),s.start(Ne(e,s,0,i,this.visualElement,!1))}stopAnimation(){I(e=>this.getAxisMotionValue(e).stop())}pauseAnimation(){I(e=>{var i;return(i=this.getAxisMotionValue(e).animation)===null||i===void 0?void 0:i.pause()})}getAnimationState(e){var i;return(i=this.getAxisMotionValue(e).animation)===null||i===void 0?void 0:i.state}getAxisMotionValue(e){const i=`_drag${e.toUpperCase()}`,s=this.visualElement.getProps(),a=s[i];return a||this.visualElement.getValue(e,(s.initial?s.initial[e]:void 0)||0)}snapToCursor(e){I(i=>{const{drag:s}=this.getProps();if(!ht(i,s,this.currentDirection))return;const{projection:a}=this.visualElement,m=this.getAxisMotionValue(i);if(a&&a.layout){const{min:n,max:o}=a.layout.layoutBox[i];m.set(e[i]-A(n,o,.5))}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:e,dragConstraints:i}=this.getProps(),{projection:s}=this.visualElement;if(!lt(i)||!s||!this.constraints)return;this.stopAnimation();const a={x:0,y:0};I(n=>{const o=this.getAxisMotionValue(n);if(o&&this.constraints!==!1){const r=o.get();a[n]=ns({min:r,max:r},this.constraints[n])}});const{transformTemplate:m}=this.visualElement.getProps();this.visualElement.current.style.transform=m?m({},""):"none",s.root&&s.root.updateScroll(),s.updateLayout(),this.resolveConstraints(),I(n=>{if(!ht(n,e,null))return;const o=this.getAxisMotionValue(n),{min:r,max:l}=this.constraints[n];o.set(A(r,l,a[n]))})}addListeners(){if(!this.visualElement.current)return;as.set(this.visualElement,this);const e=this.visualElement.current,i=st(e,"pointerdown",r=>{const{drag:l,dragListener:c=!0}=this.getProps();l&&c&&this.start(r)}),s=()=>{const{dragConstraints:r}=this.getProps();lt(r)&&r.current&&(this.constraints=this.resolveRefConstraints())},{projection:a}=this.visualElement,m=a.addEventListener("measure",s);a&&!a.layout&&(a.root&&a.root.updateScroll(),a.updateLayout()),k.read(s);const n=Lt(window,"resize",()=>this.scalePositionWithinConstraints()),o=a.addEventListener("didUpdate",({delta:r,hasLayoutChanged:l})=>{this.isDragging&&l&&(I(c=>{const u=this.getAxisMotionValue(c);u&&(this.originPoint[c]+=r[c].translate,u.set(u.get()+r[c].translate))}),this.visualElement.render())});return()=>{n(),i(),m(),o&&o()}}getProps(){const e=this.visualElement.getProps(),{drag:i=!1,dragDirectionLock:s=!1,dragPropagation:a=!1,dragConstraints:m=!1,dragElastic:n=bt,dragMomentum:o=!0}=e;return{...e,drag:i,dragDirectionLock:s,dragPropagation:a,dragConstraints:m,dragElastic:n,dragMomentum:o}}}function ht(t,e,i){return(e===!0||e===t)&&(i===null||i===t)}function cs(t,e=10){let i=null;return Math.abs(t.y)>e?i="y":Math.abs(t.x)>e&&(i="x"),i}class ds extends $e{constructor(e){super(e),this.removeGroupControls=z,this.removeListeners=z,this.controls=new ls(e)}mount(){const{dragControls:e}=this.node.getProps();e&&(this.removeGroupControls=e.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||z}unmount(){this.removeGroupControls(),this.removeListeners()}}const Qt=t=>(e,i)=>{t&&k.postRender(()=>t(e,i))};class us extends $e{constructor(){super(...arguments),this.removePointerDownListener=z}onPointerDown(e){this.session=new _e(e,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:Xe(this.node)})}createPanHandlers(){const{onPanSessionStart:e,onPanStart:i,onPan:s,onPanEnd:a}=this.node.getProps();return{onSessionStart:Qt(e),onStart:Qt(i),onMove:s,onEnd:(m,n)=>{delete this.session,a&&k.postRender(()=>a(m,n))}}}mount(){this.removePointerDownListener=st(this.node.current,"pointerdown",e=>this.onPointerDown(e))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}const mt={hasAnimatedSinceResize:!0,hasEverUpdated:!1};function Jt(t,e){return e.max===e.min?0:t/(e.max-e.min)*100}const tt={correct:(t,e)=>{if(!e.target)return t;if(typeof t=="string")if(Ve.test(t))t=parseFloat(t);else return t;const i=Jt(t,e.target.x),s=Jt(t,e.target.y);return`${i}% ${s}%`}},hs={correct:(t,{treeScale:e,projectionDelta:i})=>{const s=t,a=$t.parse(t);if(a.length>5)return s;const m=$t.createTransformer(t),n=typeof a[0]!="number"?1:0,o=i.x.scale*e.x,r=i.y.scale*e.y;a[0+n]/=o,a[1+n]/=r;const l=A(o,r,.5);return typeof a[2+n]=="number"&&(a[2+n]/=l),typeof a[3+n]=="number"&&(a[3+n]/=l),m(a)}};class ms extends P.Component{componentDidMount(){const{visualElement:e,layoutGroup:i,switchLayoutGroup:s,layoutId:a}=this.props,{projection:m}=e;di(fs),m&&(i.group&&i.group.add(m),s&&s.register&&a&&s.register(m),m.root.didUpdate(),m.addEventListener("animationComplete",()=>{this.safeToRemove()}),m.setOptions({...m.options,onExitComplete:()=>this.safeToRemove()})),mt.hasEverUpdated=!0}getSnapshotBeforeUpdate(e){const{layoutDependency:i,visualElement:s,drag:a,isPresent:m}=this.props,n=s.projection;return n&&(n.isPresent=m,a||e.layoutDependency!==i||i===void 0?n.willUpdate():this.safeToRemove(),e.isPresent!==m&&(m?n.promote():n.relegate()||k.postRender(()=>{const o=n.getStack();(!o||!o.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{projection:e}=this.props.visualElement;e&&(e.root.didUpdate(),Be.postRender(()=>{!e.currentAnimation&&e.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:e,layoutGroup:i,switchLayoutGroup:s}=this.props,{projection:a}=e;a&&(a.scheduleCheckAfterUnmount(),i&&i.group&&i.group.remove(a),s&&s.deregister&&s.deregister(a))}safeToRemove(){const{safeToRemove:e}=this.props;e&&e()}render(){return null}}function Ye(t){const[e,i]=ze(),s=P.useContext(Re);return d.jsx(ms,{...t,layoutGroup:s,switchLayoutGroup:P.useContext(ci),isPresent:e,safeToRemove:i})}const fs={borderRadius:{...tt,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:tt,borderTopRightRadius:tt,borderBottomLeftRadius:tt,borderBottomRightRadius:tt,boxShadow:hs};function ps(t,e,i){const s=ui(t)?t:bi(t);return s.start(Ne("",s,e,i)),s.animation}function ys(t){return t instanceof SVGElement&&t.tagName!=="svg"}const gs=(t,e)=>t.depth-e.depth;class xs{constructor(){this.children=[],this.isDirty=!1}add(e){Oe(this.children,e),this.isDirty=!0}remove(e){Ue(this.children,e),this.isDirty=!0}forEach(e){this.isDirty&&this.children.sort(gs),this.isDirty=!1,this.children.forEach(e)}}function vs(t,e){const i=qe.now(),s=({timestamp:a})=>{const m=a-i;m>=e&&(rt(s),t(m-e))};return k.read(s,!0),()=>rt(s)}const Ze=["TopLeft","TopRight","BottomLeft","BottomRight"],Ps=Ze.length,te=t=>typeof t=="string"?parseFloat(t):t,ee=t=>typeof t=="number"||Ve.test(t);function js(t,e,i,s,a,m){a?(t.opacity=A(0,i.opacity!==void 0?i.opacity:1,Cs(s)),t.opacityExit=A(e.opacity!==void 0?e.opacity:1,0,Ts(s))):m&&(t.opacity=A(e.opacity!==void 0?e.opacity:1,i.opacity!==void 0?i.opacity:1,s));for(let n=0;n<Ps;n++){const o=`border${Ze[n]}Radius`;let r=ie(e,o),l=ie(i,o);if(r===void 0&&l===void 0)continue;r||(r=0),l||(l=0),r===0||l===0||ee(r)===ee(l)?(t[o]=Math.max(A(te(r),te(l),s),0),(pt.test(l)||pt.test(r))&&(t[o]+="%")):t[o]=l}(e.rotate||i.rotate)&&(t.rotate=A(e.rotate||0,i.rotate||0,s))}function ie(t,e){return t[e]!==void 0?t[e]:t.borderRadius}const Cs=Ke(0,.5,Ri),Ts=Ke(.5,.95,z);function Ke(t,e,i){return s=>s<t?0:s>e?1:i(At(t,e,s))}function se(t,e){t.min=e.min,t.max=e.max}function B(t,e){se(t.x,e.x),se(t.y,e.y)}function ne(t,e){t.translate=e.translate,t.scale=e.scale,t.originPoint=e.originPoint,t.origin=e.origin}function oe(t,e,i,s,a){return t-=e,t=Ot(t,1/i,s),a!==void 0&&(t=Ot(t,1/a,s)),t}function Es(t,e=0,i=1,s=.5,a,m=t,n=t){if(pt.test(e)&&(e=parseFloat(e),e=A(n.min,n.max,e/100)-n.min),typeof e!="number")return;let o=A(m.min,m.max,s);t===m&&(o-=e),t.min=oe(t.min,e,i,o,a),t.max=oe(t.max,e,i,o,a)}function re(t,e,[i,s,a],m,n){Es(t,e[i],e[s],e[a],e.scale,m,n)}const ws=["x","scaleX","originX"],Ds=["y","scaleY","originY"];function ae(t,e,i,s){re(t.x,e,ws,i?i.x:void 0,s?s.x:void 0),re(t.y,e,Ds,i?i.y:void 0,s?s.y:void 0)}function le(t){return t.translate===0&&t.scale===1}function Qe(t){return le(t.x)&&le(t.y)}function ce(t,e){return t.min===e.min&&t.max===e.max}function Ss(t,e){return ce(t.x,e.x)&&ce(t.y,e.y)}function de(t,e){return Math.round(t.min)===Math.round(e.min)&&Math.round(t.max)===Math.round(e.max)}function Je(t,e){return de(t.x,e.x)&&de(t.y,e.y)}function ue(t){return V(t.x)/V(t.y)}function he(t,e){return t.translate===e.translate&&t.scale===e.scale&&t.originPoint===e.originPoint}class As{constructor(){this.members=[]}add(e){Oe(this.members,e),e.scheduleRender()}remove(e){if(Ue(this.members,e),e===this.prevLead&&(this.prevLead=void 0),e===this.lead){const i=this.members[this.members.length-1];i&&this.promote(i)}}relegate(e){const i=this.members.findIndex(a=>e===a);if(i===0)return!1;let s;for(let a=i;a>=0;a--){const m=this.members[a];if(m.isPresent!==!1){s=m;break}}return s?(this.promote(s),!0):!1}promote(e,i){const s=this.lead;if(e!==s&&(this.prevLead=s,this.lead=e,e.show(),s)){s.instance&&s.scheduleRender(),e.scheduleRender(),e.resumeFrom=s,i&&(e.resumeFrom.preserveOpacity=!0),s.snapshot&&(e.snapshot=s.snapshot,e.snapshot.latestValues=s.animationValues||s.latestValues),e.root&&e.root.isUpdating&&(e.isLayoutDirty=!0);const{crossfade:a}=e.options;a===!1&&s.hide()}}exitAnimationComplete(){this.members.forEach(e=>{const{options:i,resumingFrom:s}=e;i.onExitComplete&&i.onExitComplete(),s&&s.options.onExitComplete&&s.options.onExitComplete()})}scheduleRender(){this.members.forEach(e=>{e.instance&&e.scheduleRender(!1)})}removeLeadSnapshot(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)}}function bs(t,e,i){let s="";const a=t.x.translate/e.x,m=t.y.translate/e.y,n=(i==null?void 0:i.z)||0;if((a||m||n)&&(s=`translate3d(${a}px, ${m}px, ${n}px) `),(e.x!==1||e.y!==1)&&(s+=`scale(${1/e.x}, ${1/e.y}) `),i){const{transformPerspective:l,rotate:c,rotateX:u,rotateY:h,skewX:f,skewY:y}=i;l&&(s=`perspective(${l}px) ${s}`),c&&(s+=`rotate(${c}deg) `),u&&(s+=`rotateX(${u}deg) `),h&&(s+=`rotateY(${h}deg) `),f&&(s+=`skewX(${f}deg) `),y&&(s+=`skewY(${y}deg) `)}const o=t.x.scale*e.x,r=t.y.scale*e.y;return(o!==1||r!==1)&&(s+=`scale(${o}, ${r})`),s||"none"}const $={type:"projectionFrame",totalNodes:0,resolvedTargetDeltas:0,recalculatedProjection:0},et=typeof window<"u"&&window.MotionDebug!==void 0,Et=["","X","Y","Z"],Rs={visibility:"hidden"},me=1e3;let Ls=0;function wt(t,e,i,s){const{latestValues:a}=e;a[t]&&(i[t]=a[t],e.setStaticValue(t,0),s&&(s[t]=0))}function ti(t){if(t.hasCheckedOptimisedAppear=!0,t.root===t)return;const{visualElement:e}=t.options;if(!e)return;const i=Mi(e);if(window.MotionHasOptimisedAnimation(i,"transform")){const{layout:a,layoutId:m}=t.options;window.MotionCancelOptimisedAnimation(i,"transform",k,!(a||m))}const{parent:s}=t;s&&!s.hasCheckedOptimisedAppear&&ti(s)}function ei({attachResizeListener:t,defaultParent:e,measureScroll:i,checkIsScrollRoot:s,resetTransform:a}){return class{constructor(n={},o=e==null?void 0:e()){this.id=Ls++,this.animationId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,et&&($.totalNodes=$.resolvedTargetDeltas=$.recalculatedProjection=0),this.nodes.forEach(Is),this.nodes.forEach($s),this.nodes.forEach(Os),this.nodes.forEach(ks),et&&window.MotionDebug.record($)},this.resolvedRelativeTargetAt=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=n,this.root=o?o.root||o:this,this.path=o?[...o.path,o]:[],this.parent=o,this.depth=o?o.depth+1:0;for(let r=0;r<this.path.length;r++)this.path[r].shouldResetTransform=!0;this.root===this&&(this.nodes=new xs)}addEventListener(n,o){return this.eventHandlers.has(n)||this.eventHandlers.set(n,new Li),this.eventHandlers.get(n).add(o)}notifyListeners(n,...o){const r=this.eventHandlers.get(n);r&&r.notify(...o)}hasListeners(n){return this.eventHandlers.has(n)}mount(n,o=this.root.hasTreeAnimated){if(this.instance)return;this.isSVG=ys(n),this.instance=n;const{layoutId:r,layout:l,visualElement:c}=this.options;if(c&&!c.current&&c.mount(n),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),o&&(l||r)&&(this.isLayoutDirty=!0),t){let u;const h=()=>this.root.updateBlockedByResize=!1;t(n,()=>{this.root.updateBlockedByResize=!0,u&&u(),u=vs(h,250),mt.hasAnimatedSinceResize&&(mt.hasAnimatedSinceResize=!1,this.nodes.forEach(pe))})}r&&this.root.registerSharedNode(r,this),this.options.animate!==!1&&c&&(r||l)&&this.addEventListener("didUpdate",({delta:u,hasLayoutChanged:h,hasRelativeLayoutChanged:f,layout:y})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const g=this.options.transition||c.getDefaultTransition()||Ws,{onLayoutAnimationStart:x,onLayoutAnimationComplete:E}=c.getProps(),w=!this.targetLayout||!Je(this.targetLayout,y),p=!h&&f;if(this.options.layoutRoot||this.resumeFrom&&this.resumeFrom.instance||p||h&&(w||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0),this.setAnimationOrigin(u,p);const v={...Vi(g,"layout"),onPlay:x,onComplete:E};(c.shouldReduceMotion||this.options.layoutRoot)&&(v.delay=0,v.type=!1),this.startAnimation(v)}else h||pe(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=y})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const n=this.getStack();n&&n.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,rt(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(Us),this.animationId++)}getTransformTemplate(){const{visualElement:n}=this.options;return n&&n.getProps().transformTemplate}willUpdate(n=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&ti(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let c=0;c<this.path.length;c++){const u=this.path[c];u.shouldResetTransform=!0,u.updateScroll("snapshot"),u.options.layoutRoot&&u.willUpdate(!1)}const{layoutId:o,layout:r}=this.options;if(o===void 0&&!r)return;const l=this.getTransformTemplate();this.prevTransformTemplateValue=l?l(this.latestValues,""):void 0,this.updateSnapshot(),n&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(fe);return}this.isUpdating||this.nodes.forEach(Fs),this.isUpdating=!1,this.nodes.forEach(Ns),this.nodes.forEach(Vs),this.nodes.forEach(Bs),this.clearAllSnapshots();const o=qe.now();L.delta=Le(0,1e3/60,o-L.timestamp),L.timestamp=o,L.isProcessing=!0,vt.update.process(L),vt.preRender.process(L),vt.render.process(L),L.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,Be.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(Ms),this.sharedNodes.forEach(qs)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,k.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){k.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure())}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let r=0;r<this.path.length;r++)this.path[r].updateScroll();const n=this.layout;this.layout=this.measure(!1),this.layoutCorrected=S(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:o}=this.options;o&&o.notify("LayoutMeasure",this.layout.layoutBox,n?n.layoutBox:void 0)}updateScroll(n="measure"){let o=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===n&&(o=!1),o){const r=s(this.instance);this.scroll={animationId:this.root.animationId,phase:n,isRoot:r,offset:i(this.instance),wasRoot:this.scroll?this.scroll.isRoot:r}}}resetTransform(){if(!a)return;const n=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,o=this.projectionDelta&&!Qe(this.projectionDelta),r=this.getTransformTemplate(),l=r?r(this.latestValues,""):void 0,c=l!==this.prevTransformTemplateValue;n&&(o||O(this.latestValues)||c)&&(a(this.instance,l),this.shouldResetTransform=!1,this.scheduleRender())}measure(n=!0){const o=this.measurePageBox();let r=this.removeElementScroll(o);return n&&(r=this.removeTransform(r)),Gs(r),{animationId:this.root.animationId,measuredBox:o,layoutBox:r,latestValues:{},source:this.id}}measurePageBox(){var n;const{visualElement:o}=this.options;if(!o)return S();const r=o.measureViewportBox();if(!(((n=this.scroll)===null||n===void 0?void 0:n.wasRoot)||this.path.some(Hs))){const{scroll:c}=this.root;c&&(ct(r.x,c.offset.x),ct(r.y,c.offset.y))}return r}removeElementScroll(n){var o;const r=S();if(B(r,n),!((o=this.scroll)===null||o===void 0)&&o.wasRoot)return r;for(let l=0;l<this.path.length;l++){const c=this.path[l],{scroll:u,options:h}=c;c!==this.root&&u&&h.layoutScroll&&(u.wasRoot&&B(r,n),ct(r.x,u.offset.x),ct(r.y,u.offset.y))}return r}applyTransform(n,o=!1){const r=S();B(r,n);for(let l=0;l<this.path.length;l++){const c=this.path[l];!o&&c.options.layoutScroll&&c.scroll&&c!==c.root&&dt(r,{x:-c.scroll.offset.x,y:-c.scroll.offset.y}),O(c.latestValues)&&dt(r,c.latestValues)}return O(this.latestValues)&&dt(r,this.latestValues),r}removeTransform(n){const o=S();B(o,n);for(let r=0;r<this.path.length;r++){const l=this.path[r];if(!l.instance||!O(l.latestValues))continue;Ut(l.latestValues)&&l.updateSnapshot();const c=S(),u=l.measurePageBox();B(c,u),ae(o,l.latestValues,l.snapshot?l.snapshot.layoutBox:void 0,c)}return O(this.latestValues)&&ae(o,this.latestValues),o}setTargetDelta(n){this.targetDelta=n,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(n){this.options={...this.options,...n,crossfade:n.crossfade!==void 0?n.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==L.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(n=!1){var o;const r=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=r.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=r.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=r.isSharedProjectionDirty);const l=!!this.resumingFrom||this!==r;if(!(n||l&&this.isSharedProjectionDirty||this.isProjectionDirty||!((o=this.parent)===null||o===void 0)&&o.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:u,layoutId:h}=this.options;if(!(!this.layout||!(u||h))){if(this.resolvedRelativeTargetAt=L.timestamp,!this.targetDelta&&!this.relativeTarget){const f=this.getClosestProjectingParent();f&&f.layout&&this.animationProgress!==1?(this.relativeParent=f,this.forceRelativeParentToResolveTarget(),this.relativeTarget=S(),this.relativeTargetOrigin=S(),ot(this.relativeTargetOrigin,this.layout.layoutBox,f.layout.layoutBox),B(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}if(!(!this.relativeTarget&&!this.targetDelta)){if(this.target||(this.target=S(),this.targetWithTransforms=S()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),ts(this.target,this.relativeTarget,this.relativeParent.target)):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.layoutBox):B(this.target,this.layout.layoutBox),Bi(this.target,this.targetDelta)):B(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget){this.attemptToResolveRelativeTarget=!1;const f=this.getClosestProjectingParent();f&&!!f.resumingFrom==!!this.resumingFrom&&!f.options.layoutScroll&&f.target&&this.animationProgress!==1?(this.relativeParent=f,this.forceRelativeParentToResolveTarget(),this.relativeTarget=S(),this.relativeTargetOrigin=S(),ot(this.relativeTargetOrigin,this.target,f.target),B(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}et&&$.resolvedTargetDeltas++}}}getClosestProjectingParent(){if(!(!this.parent||Ut(this.parent.latestValues)||Ii(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}calcProjection(){var n;const o=this.getLead(),r=!!this.resumingFrom||this!==o;let l=!0;if((this.isProjectionDirty||!((n=this.parent)===null||n===void 0)&&n.isProjectionDirty)&&(l=!1),r&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(l=!1),this.resolvedRelativeTargetAt===L.timestamp&&(l=!1),l)return;const{layout:c,layoutId:u}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(c||u))return;B(this.layoutCorrected,this.layout.layoutBox);const h=this.treeScale.x,f=this.treeScale.y;ki(this.layoutCorrected,this.treeScale,this.path,r),o.layout&&!o.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(o.target=o.layout.layoutBox,o.targetWithTransforms=S());const{target:y}=o;if(!y){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(ne(this.prevProjectionDelta.x,this.projectionDelta.x),ne(this.prevProjectionDelta.y,this.projectionDelta.y)),nt(this.projectionDelta,this.layoutCorrected,y,this.latestValues),(this.treeScale.x!==h||this.treeScale.y!==f||!he(this.projectionDelta.x,this.prevProjectionDelta.x)||!he(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",y)),et&&$.recalculatedProjection++}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(n=!0){var o;if((o=this.options.visualElement)===null||o===void 0||o.scheduleRender(),n){const r=this.getStack();r&&r.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=U(),this.projectionDelta=U(),this.projectionDeltaWithTransform=U()}setAnimationOrigin(n,o=!1){const r=this.snapshot,l=r?r.latestValues:{},c={...this.latestValues},u=U();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!o;const h=S(),f=r?r.source:void 0,y=this.layout?this.layout.source:void 0,g=f!==y,x=this.getStack(),E=!x||x.members.length<=1,w=!!(g&&!E&&this.options.crossfade===!0&&!this.path.some(_s));this.animationProgress=0;let p;this.mixTargetDelta=v=>{const C=v/1e3;ye(u.x,n.x,C),ye(u.y,n.y,C),this.setTargetDelta(u),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(ot(h,this.layout.layoutBox,this.relativeParent.layout.layoutBox),zs(this.relativeTarget,this.relativeTargetOrigin,h,C),p&&Ss(this.relativeTarget,p)&&(this.isProjectionDirty=!1),p||(p=S()),B(p,this.relativeTarget)),g&&(this.animationValues=c,js(c,l,this.latestValues,C,w,E)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=C},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(n){this.notifyListeners("animationStart"),this.currentAnimation&&this.currentAnimation.stop(),this.resumingFrom&&this.resumingFrom.currentAnimation&&this.resumingFrom.currentAnimation.stop(),this.pendingAnimation&&(rt(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=k.update(()=>{mt.hasAnimatedSinceResize=!0,this.currentAnimation=ps(0,me,{...n,onUpdate:o=>{this.mixTargetDelta(o),n.onUpdate&&n.onUpdate(o)},onComplete:()=>{n.onComplete&&n.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const n=this.getStack();n&&n.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(me),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const n=this.getLead();let{targetWithTransforms:o,target:r,layout:l,latestValues:c}=n;if(!(!o||!r||!l)){if(this!==n&&this.layout&&l&&ii(this.options.animationType,this.layout.layoutBox,l.layoutBox)){r=this.target||S();const u=V(this.layout.layoutBox.x);r.x.min=n.target.x.min,r.x.max=r.x.min+u;const h=V(this.layout.layoutBox.y);r.y.min=n.target.y.min,r.y.max=r.y.min+h}B(o,r),dt(o,c),nt(this.projectionDeltaWithTransform,this.layoutCorrected,o,c)}}registerSharedNode(n,o){this.sharedNodes.has(n)||this.sharedNodes.set(n,new As),this.sharedNodes.get(n).add(o);const l=o.options.initialPromotionConfig;o.promote({transition:l?l.transition:void 0,preserveFollowOpacity:l&&l.shouldPreserveFollowOpacity?l.shouldPreserveFollowOpacity(o):void 0})}isLead(){const n=this.getStack();return n?n.lead===this:!0}getLead(){var n;const{layoutId:o}=this.options;return o?((n=this.getStack())===null||n===void 0?void 0:n.lead)||this:this}getPrevLead(){var n;const{layoutId:o}=this.options;return o?(n=this.getStack())===null||n===void 0?void 0:n.prevLead:void 0}getStack(){const{layoutId:n}=this.options;if(n)return this.root.sharedNodes.get(n)}promote({needsReset:n,transition:o,preserveFollowOpacity:r}={}){const l=this.getStack();l&&l.promote(this,r),n&&(this.projectionDelta=void 0,this.needsReset=!0),o&&this.setOptions({transition:o})}relegate(){const n=this.getStack();return n?n.relegate(this):!1}resetSkewAndRotation(){const{visualElement:n}=this.options;if(!n)return;let o=!1;const{latestValues:r}=n;if((r.z||r.rotate||r.rotateX||r.rotateY||r.rotateZ||r.skewX||r.skewY)&&(o=!0),!o)return;const l={};r.z&&wt("z",n,l,this.animationValues);for(let c=0;c<Et.length;c++)wt(`rotate${Et[c]}`,n,l,this.animationValues),wt(`skew${Et[c]}`,n,l,this.animationValues);n.render();for(const c in l)n.setStaticValue(c,l[c]),this.animationValues&&(this.animationValues[c]=l[c]);n.scheduleRender()}getProjectionStyles(n){var o,r;if(!this.instance||this.isSVG)return;if(!this.isVisible)return Rs;const l={visibility:""},c=this.getTransformTemplate();if(this.needsReset)return this.needsReset=!1,l.opacity="",l.pointerEvents=Pt(n==null?void 0:n.pointerEvents)||"",l.transform=c?c(this.latestValues,""):"none",l;const u=this.getLead();if(!this.projectionDelta||!this.layout||!u.target){const g={};return this.options.layoutId&&(g.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,g.pointerEvents=Pt(n==null?void 0:n.pointerEvents)||""),this.hasProjected&&!O(this.latestValues)&&(g.transform=c?c({},""):"none",this.hasProjected=!1),g}const h=u.animationValues||u.latestValues;this.applyTransformsToTarget(),l.transform=bs(this.projectionDeltaWithTransform,this.treeScale,h),c&&(l.transform=c(h,l.transform));const{x:f,y}=this.projectionDelta;l.transformOrigin=`${f.origin*100}% ${y.origin*100}% 0`,u.animationValues?l.opacity=u===this?(r=(o=h.opacity)!==null&&o!==void 0?o:this.latestValues.opacity)!==null&&r!==void 0?r:1:this.preserveOpacity?this.latestValues.opacity:h.opacityExit:l.opacity=u===this?h.opacity!==void 0?h.opacity:"":h.opacityExit!==void 0?h.opacityExit:0;for(const g in Bt){if(h[g]===void 0)continue;const{correct:x,applyTo:E}=Bt[g],w=l.transform==="none"?h[g]:x(h[g],u);if(E){const p=E.length;for(let v=0;v<p;v++)l[E[v]]=w}else l[g]=w}return this.options.layoutId&&(l.pointerEvents=u===this?Pt(n==null?void 0:n.pointerEvents)||"":"none"),l}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(n=>{var o;return(o=n.currentAnimation)===null||o===void 0?void 0:o.stop()}),this.root.nodes.forEach(fe),this.root.sharedNodes.clear()}}}function Vs(t){t.updateLayout()}function Bs(t){var e;const i=((e=t.resumeFrom)===null||e===void 0?void 0:e.snapshot)||t.snapshot;if(t.isLead()&&t.layout&&i&&t.hasListeners("didUpdate")){const{layoutBox:s,measuredBox:a}=t.layout,{animationType:m}=t.options,n=i.source!==t.layout.source;m==="size"?I(u=>{const h=n?i.measuredBox[u]:i.layoutBox[u],f=V(h);h.min=s[u].min,h.max=h.min+f}):ii(m,i.layoutBox,s)&&I(u=>{const h=n?i.measuredBox[u]:i.layoutBox[u],f=V(s[u]);h.max=h.min+f,t.relativeTarget&&!t.currentAnimation&&(t.isProjectionDirty=!0,t.relativeTarget[u].max=t.relativeTarget[u].min+f)});const o=U();nt(o,s,i.layoutBox);const r=U();n?nt(r,t.applyTransform(a,!0),i.measuredBox):nt(r,s,i.layoutBox);const l=!Qe(o);let c=!1;if(!t.resumeFrom){const u=t.getClosestProjectingParent();if(u&&!u.resumeFrom){const{snapshot:h,layout:f}=u;if(h&&f){const y=S();ot(y,i.layoutBox,h.layoutBox);const g=S();ot(g,s,f.layoutBox),Je(y,g)||(c=!0),u.options.layoutRoot&&(t.relativeTarget=g,t.relativeTargetOrigin=y,t.relativeParent=u)}}}t.notifyListeners("didUpdate",{layout:s,snapshot:i,delta:r,layoutDelta:o,hasLayoutChanged:l,hasRelativeLayoutChanged:c})}else if(t.isLead()){const{onExitComplete:s}=t.options;s&&s()}t.options.transition=void 0}function Is(t){et&&$.totalNodes++,t.parent&&(t.isProjecting()||(t.isProjectionDirty=t.parent.isProjectionDirty),t.isSharedProjectionDirty||(t.isSharedProjectionDirty=!!(t.isProjectionDirty||t.parent.isProjectionDirty||t.parent.isSharedProjectionDirty)),t.isTransformDirty||(t.isTransformDirty=t.parent.isTransformDirty))}function ks(t){t.isProjectionDirty=t.isSharedProjectionDirty=t.isTransformDirty=!1}function Ms(t){t.clearSnapshot()}function fe(t){t.clearMeasurements()}function Fs(t){t.isLayoutDirty=!1}function Ns(t){const{visualElement:e}=t.options;e&&e.getProps().onBeforeLayoutMeasure&&e.notify("BeforeLayoutMeasure"),t.resetTransform()}function pe(t){t.finishAnimation(),t.targetDelta=t.relativeTarget=t.target=void 0,t.isProjectionDirty=!0}function $s(t){t.resolveTargetDelta()}function Os(t){t.calcProjection()}function Us(t){t.resetSkewAndRotation()}function qs(t){t.removeLeadSnapshot()}function ye(t,e,i){t.translate=A(e.translate,0,i),t.scale=A(e.scale,1,i),t.origin=e.origin,t.originPoint=e.originPoint}function ge(t,e,i,s){t.min=A(e.min,i.min,s),t.max=A(e.max,i.max,s)}function zs(t,e,i,s){ge(t.x,e.x,i.x,s),ge(t.y,e.y,i.y,s)}function _s(t){return t.animationValues&&t.animationValues.opacityExit!==void 0}const Ws={duration:.45,ease:[.4,0,.1,1]},xe=t=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(t),ve=xe("applewebkit/")&&!xe("chrome/")?Math.round:z;function Pe(t){t.min=ve(t.min),t.max=ve(t.max)}function Gs(t){Pe(t.x),Pe(t.y)}function ii(t,e,i){return t==="position"||t==="preserve-aspect"&&!Ji(ue(e),ue(i),.2)}function Hs(t){var e;return t!==t.root&&((e=t.scroll)===null||e===void 0?void 0:e.wasRoot)}const Xs=ei({attachResizeListener:(t,e)=>Lt(t,"resize",e),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}),checkIsScrollRoot:()=>!0}),Dt={current:void 0},si=ei({measureScroll:t=>({x:t.scrollLeft,y:t.scrollTop}),defaultParent:()=>{if(!Dt.current){const t=new Xs({});t.mount(window),t.setOptions({layoutScroll:!0}),Dt.current=t}return Dt.current},resetTransform:(t,e)=>{t.style.transform=e!==void 0?e:"none"},checkIsScrollRoot:t=>window.getComputedStyle(t).position==="fixed"}),Ys={pan:{Feature:us},drag:{Feature:ds,ProjectionNode:si,MeasureLayout:Ye}},Zs={layout:{ProjectionNode:si,MeasureLayout:Ye}},Ks=hi({...Ni,...$i,...Ys,...Zs},Fi),je=_i(Ks),Qs=T.div`
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
`,Js=T(Qs)`
  width: 100%;

  @media (min-width: 768px) {
    width: 45%;
    max-width: fit-content;
  }
`,ni=T.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  font-style: ${({theme:t})=>t.font};
  width: 100%;
  z-index: 12;
`;function N({className:t,children:e,style:i}){const s=()=>{};return d.jsx(ni,{onChange:s,className:t,style:i,children:e})}function _({className:t,isLongOnMobile:e,children:i,style:s}){return e?d.jsx(Js,{className:t,style:{...s},children:i}):d.jsx(ni,{className:t,children:i})}const tn=T.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  max-width: 100vw;

  @media (min-width: 768px) {
    flex-wrap: nowrap;
    max-width: 100%;
  }
`;function Vt({children:t}){return d.jsx(tn,{className:"address-box",children:t})}Vt.propTypes={children:yt.node.isRequired};const en=T.div`
  display: contents;
  width: 100%;
  justify-content: space-between;

  @media (min-width: 350px) {
    display: flex;
  }
  @media (min-width: 600px) {
    display: contents;
  }
`;function Tn({invoice:t}){var n,o,r,l;const e=xt(),{formState:{errors:i},register:s}=W(),{isDraft:a}=at(),m=d.jsxs(N,{style:{width:e<768?"100%":""},className:"company-country",children:[d.jsx(M,{htmlFor:"country",style:{color:i!=null&&i.country?"#EC5757":""},children:"Country"}),d.jsx(ke,{type:"text",style:{border:i!=null&&i.country?"1px solid #EC5757":"",width:e<768?"100%":""},defaultValue:t?(n=t==null?void 0:t.senderAddress)==null?void 0:n.country:"",...s("country",{required:!a,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return d.jsxs(d.Fragment,{children:[d.jsxs(N,{className:"company-street-address",children:[d.jsx(M,{htmlFor:"streetAddress",style:{color:i!=null&&i.streetAddress?"#EC5757":""},children:"Street Address"}),d.jsx(Me,{style:{border:i!=null&&i.streetAddress?"1px solid #EC5757":""},defaultValue:t?(o=t==null?void 0:t.senderAddress)==null?void 0:o.street:"",...s("streetAddress",{required:!a,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:50})})]}),d.jsxs(Vt,{children:[d.jsxs(en,{children:[d.jsxs(_,{className:"company-city",children:[d.jsx(M,{htmlFor:"city",style:{color:i!=null&&i.city?"#EC5757":""},children:"City"}),d.jsx(gt,{style:{border:i!=null&&i.city?"1px solid #EC5757":""},defaultValue:t?(r=t==null?void 0:t.senderAddress)==null?void 0:r.city:"",type:"text",...s("city",{required:!a,pattern:/[\w ]*/i,maxLength:30})})]}),d.jsxs(_,{style:{justifySelf:"flex-end"},className:"company-postal-code",children:[d.jsx(M,{htmlFor:"postalCode",style:{color:i!=null&&i.postalCode?"#EC5757":""},children:"Post Code"}),d.jsx(gt,{style:{border:i!=null&&i.postalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(l=t==null?void 0:t.senderAddress)==null?void 0:l.postCode:"",...s("postalCode",{required:!a,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]})]}),e<768&&d.jsx(N,{className:"company-country-container",children:m}),e>=768&&d.jsx(_,{className:"company-country-container",children:m})]})]})}const Ce=T.div`
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
`,oi=T.input`
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
`,Te=T(oi)`
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
`,Rt=T(oi).attrs({pattern:"\\d+"})`
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
`,Ee=T(Rt).attrs({pattern:"[0-9.]*"})`
  width: 80px;
  padding-left: 1.25rem;
  text-align: left;

  @media (min-width: 325px) {
    width: 100px;
    padding-left: 1.25rem;
    text-align: left;
  }
`,we=T.p`
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
`;T.div`
  display: none;

  @media (min-width: 600px) {
    display: contents;
  }
`;T.p`
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
`;const sn=T.div`
  display: grid;
  grid-template: 1fr / 220px 62px 116px 61px 49px;
`,De=T.svg`
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
`,it=T.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: fit-content;
  width: fit-content;
`,nn=T(it)`
  text-align: right;
  @media (min-width: 325px) {
    align-items: flex-start;
    text-align: initial;
  }
`,on=T.div`
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
`,Se=d.jsx("path",{d:"M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z",fillRule:"nonzero",className:"deleteIconPath",tabIndex:0}),rn=T.button`
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
`,En=T.svg`
  width: 11px;
  height: 11px;
`,an=T.p`
  color: ${({theme:t})=>t.newItemText};
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  text-align: center;
  letter-spacing: -0.25px;
  margin-left: 0.25rem;
`;function ln({items:t,append:e}){const{clearErrors:i}=W(),{formState:{submitCount:s}}=pi(),a=()=>{e({id:"",name:"",quantity:"",price:"",total:""}),i("itemsError")};return d.jsx(rn,{onClick:a,type:"button",style:{border:s>0&&t.length===0?"1px solid red":"1px solid transparent"},children:d.jsx(an,{children:"+ Add New Item"})})}const cn=T.div`
  display: grid;
  width: 100%;
  border-radius: 8px;
  grid-template-rows: auto;
  background-color: ${({theme:t})=>t.formBackground};
`,dn=T.div`
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
`,q=T.label`
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
`,ft=T(q)`
  justify-self: start;

  @media (min-width: 600px) {
    &.mobile-only-label {
      display: none;
    }
  }
`,un=T.div`
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
`,hn=T.h1`
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
`;function ri({isDraft:t,invoice:e,isEditOpen:i}){const{formState:s,register:a,watch:m,clearErrors:n,setError:o,reset:r}=W(),{fields:l,remove:c,append:u}=Ie({name:"items",rules:{required:!0,minLength:1}}),{errors:h,isSubmitting:f}=s,y=m("items",[]),g=xt(),x=P.useRef(!0);P.useEffect(()=>{!l.length&&!x.current?o("myFieldArray",{type:"required",message:"At least one item is required"}):n("myFieldArray"),x.current&&(x.current=!1)},[l,f]),P.useEffect(()=>{e&&i?r({items:e.items.map(p=>({id:p.id,name:p.name,quantity:p.quantity,price:p.price,total:p.total}))}):i||r({items:[]})},[e,i,r]);const E=p=>{var v,C,j,b,D,R,G,H,X,Y,Z,K,Q,J;return d.jsxs(Ce,{children:[d.jsxs(it,{style:{width:"100%",marginBottom:"1.5rem"},children:[d.jsx(ft,{style:{marginBottom:"1rem"},children:"Item Name"}),d.jsx(Te,{...a(`items[${p}].name`,{required:!t}),placeholder:"Item name",defaultValue:e?(C=(v=e==null?void 0:e.items)==null?void 0:v[p])==null?void 0:C.name:"",type:"text",style:{border:Array.isArray(h.items)&&((b=(j=h==null?void 0:h.items)==null?void 0:j[p])!=null&&b.name)?"1px solid #EC5757":""}})]}),d.jsxs(on,{children:[d.jsxs(it,{children:[d.jsx(q,{style:{marginBottom:"0.625rem"},children:"Qty."}),d.jsx(Rt,{...a(`items[${p}].quantity`,{required:!t,max:100}),placeholder:"0",type:"text",style:{border:Array.isArray(h.items)&&((R=(D=h==null?void 0:h.items)==null?void 0:D[p])!=null&&R.quantity)?"1px solid #EC5757":""},defaultValue:e?(H=(G=e==null?void 0:e.items)==null?void 0:G[p])==null?void 0:H.quantity:""})]}),d.jsxs(it,{children:[d.jsx(q,{style:{marginBottom:"0.625rem"},children:"Price"}),d.jsx(Ee,{...a(`items[${p}].price`,{required:!t,max:1e5}),placeholder:"0.00",type:"text",defaultValue:e?(Y=(X=e==null?void 0:e.items)==null?void 0:X[p])==null?void 0:Y.price:"",style:{border:Array.isArray(h.items)&&((K=(Z=h==null?void 0:h.items)==null?void 0:Z[p])!=null&&K.price)?"1px solid #EC5757":""}})]}),d.jsxs(nn,{style:{width:"fit-content"},children:[d.jsx(q,{style:{marginBottom:"0.625rem"},children:"Total"}),d.jsx(we,{children:(Number((Q=y==null?void 0:y[p])==null?void 0:Q.quantity)*Number((J=y==null?void 0:y[p])==null?void 0:J.price)).toFixed(2)})]})]}),d.jsxs(it,{children:[d.jsx(q,{style:{marginBottom:"0.625rem"},children:"  "}),d.jsx(De,{name:"removeButton",onClick:()=>c(p),children:Se})]})]})},w=p=>{var v,C,j,b,D,R,G,H,X,Y,Z,K,Q,J;return d.jsx(Ce,{children:d.jsxs(sn,{children:[d.jsx(Te,{...a(`items[${p}].name`,{required:!t}),placeholder:"Item name",defaultValue:e?(C=(v=e==null?void 0:e.items)==null?void 0:v[p])==null?void 0:C.name:"",type:"text",style:{border:Array.isArray(h.items)&&((b=(j=h==null?void 0:h.items)==null?void 0:j[p])!=null&&b.name)?"1px solid #EC5757":""}}),d.jsx(Rt,{...a(`items[${p}].quantity`,{required:!t,max:100}),placeholder:"0",type:"text",style:{border:Array.isArray(h.items)&&((R=(D=h==null?void 0:h.items)==null?void 0:D[p])!=null&&R.quantity)?"1px solid #EC5757":""},defaultValue:e?(H=(G=e==null?void 0:e.items)==null?void 0:G[p])==null?void 0:H.quantity:0}),d.jsx(Ee,{...a(`items[${p}].price`,{required:!t,max:1e5}),placeholder:"0.00",type:"text",defaultValue:e?(Y=(X=e==null?void 0:e.items)==null?void 0:X[p])==null?void 0:Y.price:0,style:{border:Array.isArray(h.items)&&((K=(Z=h==null?void 0:h.items)==null?void 0:Z[p])!=null&&K.price)?"1px solid #EC5757":""}}),d.jsx(we,{children:(Number((Q=y==null?void 0:y[p])==null?void 0:Q.quantity)*Number((J=y==null?void 0:y[p])==null?void 0:J.price)).toFixed(2)}),d.jsx(De,{name:"removeButton",onClick:()=>c(p),children:Se})]})})};return d.jsxs(d.Fragment,{children:[d.jsx("ul",{style:{listStyle:"none",marginLeft:"0",paddingLeft:0},children:l.map((p,v)=>d.jsx("li",{"data-testid":"invoice-item",children:d.jsxs("div",{children:[g<600&&E(v),g>=600&&w(v)]})},p.id))}),d.jsx(ln,{append:u,items:e?e.items:[]})]})}ri.propTypes={isDraft:yt.bool.isRequired,isEditOpen:yt.bool};const mn=({className:t})=>d.jsxs(dn,{className:t,children:[d.jsx(ft,{children:"Item Name"}),d.jsx(ft,{children:"Qty."}),d.jsx(ft,{children:"Price"}),d.jsx(q,{children:"Total"})]});function wn({invoice:t,isEditOpen:e=!1}){const{isDraft:i}=at();return d.jsxs(cn,{"data-testid":"items-container",children:[d.jsx(hn,{children:"Item List"}),d.jsx(mn,{className:"desktop-only-label"}),d.jsx(un,{children:d.jsx(ri,{isDraft:i,invoice:t,isEditOpen:e})})]})}function fn({isEditOpen:t}){const{formState:{errors:e}}=W(),i=()=>Object.keys(e).find(s=>s!=="myFieldArray"&&s!=="items");return d.jsxs(Pi,{children:[d.jsx(It,{style:{display:(i()||e.items)&&t?"block":"none"},children:"- All fields must be added"}),d.jsx(It,{style:{display:e.myFieldArray&&t?"block":"none"},children:"- An item must be added"})]})}fn.propTypes={isEditOpen:yt.bool.isRequired};function Dn({invoice:t}){var n,o,r,l,c,u;const e=xt(),{formState:{errors:i},register:s}=W(),{isDraft:a}=at(),m=d.jsxs(N,{style:{width:e<768?"100%":""},className:"client-country",children:[d.jsx(M,{htmlFor:"clientCountry",style:{color:i.clientCountry?"#EC5757":""},children:"Country"}),d.jsx(ke,{$long:!1,style:{border:i!=null&&i.clientCountry?"1px solid #EC5757":"",width:e<768?"100%":""},type:"text",defaultValue:t?(n=t==null?void 0:t.clientAddress)==null?void 0:n.country:"",...s("clientCountry",{required:!a,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return d.jsxs(d.Fragment,{children:[d.jsxs(N,{className:"client-name",children:[d.jsx(M,{htmlFor:"clientName",style:{color:i.clientName?"#EC5757":""},children:"Client's Name"}),((o=i.clientName)==null?void 0:o.type)==="required"&&d.jsx(kt,{children:"can't be empty"}),d.jsx(St,{$long:!0,style:{border:i.clientName?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientName:"",...s("clientName",{required:!a})})]}),d.jsxs(N,{className:"client-email",children:[d.jsx(M,{htmlFor:"clientEmail",style:{color:i.clientEmail?"#EC5757":""},children:"Client's Email"}),((r=i.clientEmail)==null?void 0:r.type)==="pattern"&&d.jsx(kt,{style:{position:"absolute",top:"-8px"},children:"Invalid email"}),d.jsx(St,{$long:!0,style:{border:i.clientEmail?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientEmail:"",...s("clientEmail",{required:!a,pattern:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/})})]}),d.jsxs(N,{className:"client-street-address",children:[d.jsx(M,{htmlFor:"clientStreetAddress",style:{color:i.clientStreetAddress?"#EC5757":""},children:"Street Address"}),d.jsx(Me,{style:{border:i.clientStreetAddress?"1px solid #EC5757":""},defaultValue:t?(l=t==null?void 0:t.clientAddress)==null?void 0:l.street:"",...s("clientStreetAddress",{required:!a})})]}),d.jsxs(Vt,{children:[d.jsxs(_,{className:"client-city",children:[d.jsx(M,{htmlFor:"clientCity",style:{color:i.clientCity?"#EC5757":""},children:"City"}),d.jsx(gt,{style:{border:i.clientCity?"1px solid #EC5757":""},type:"text",defaultValue:t?(c=t==null?void 0:t.clientAddress)==null?void 0:c.city:"",...s("clientCity",{required:!a,pattern:/[\w ]*/i,maxLength:30})})]}),d.jsxs(_,{className:"client-postal-code",children:[d.jsx(M,{htmlFor:"clientPostalCode",style:{color:i.clientPostalCode?"#EC5757":""},children:"Post Code"}),d.jsx(gt,{style:{border:i.clientPostalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(u=t==null?void 0:t.clientAddress)==null?void 0:u.postCode:"",...s("clientPostalCode",{required:!a,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]}),e<768&&d.jsx(N,{className:"client-country",children:m}),e>=768&&d.jsx(_,{className:"client-country",children:m})]})]})}function Sn({invoice:t}){const{formState:{errors:e},register:i}=W(),{isDraft:s}=at();return d.jsx(d.Fragment,{children:d.jsxs(N,{className:"project-description",children:[d.jsx(M,{htmlFor:"projectDescription",style:{color:e.projectDescription?"#EC5757":""},children:"Project Description"}),d.jsx(St,{type:"text",defaultValue:t==null?void 0:t.description,...i("projectDescription",{required:!s}),style:{border:e.projectDescription?"1px solid #EC5757":""}})]})})}const An=()=>{const{id:t}=mi(),{startDate:e,setIsDraft:i,setIsNewInvoiceOpen:s,selectedPaymentOption:a,setSelectedPaymentOption:m,methods:n}=at(),{control:o,trigger:r,reset:l,watch:c,setError:u,clearErrors:h,getValues:f}=n,{replace:y}=Ie({control:o,name:"items"}),g=c(),[x]=Ft(gi,{refetchQueries:[{query:yi}],onError:j=>{console.error(j)}}),[E]=Ft(vi,{update:(j,{data:{editInvoice:b}})=>{j.writeQuery({query:xi,variables:{getInvoiceById:b.id},data:{getInvoiceById:b}})},onError:j=>{console.error(j)}}),w=()=>{m(1),l(),h(),s(!1)},p=async j=>{if(console.log("Submitting form"),fi.flushSync(()=>i(!1)),j=f(),!j.items){console.log("No items"),u("items",{type:"custom",message:"An item must be added"});return}if(await r()){const D=jt(j,e,a);D.items=D.items.map(R=>({...R,quantity:Number(R.quantity),price:Number(R.price)})),D.status="pending";try{await x({variables:{...D}}),w(),y([{id:Mt(),name:"",quantity:0,price:0,total:0}])}catch(R){console.error(R)}}},v=async()=>{console.log("Submitting draft"),h();const j=f();j.items||(j.items=[{id:"",name:"",quantity:0,price:0,total:0}]);const b=jt(j,e,a);b.status="draft";try{await x({variables:{...b}}),w(),y([{id:Mt(),name:"",quantity:0,price:0,total:0}])}catch(D){console.error(D)}},C=async j=>{if(console.log("Submitting update"),await r()){const D=jt(j,e,a);D.id=String(t),D.status="pending",console.log(t);try{await E({variables:{...D}}),s(!1)}catch(R){console.error(R)}}};return P.useEffect(()=>{g.items?h("items"):u("items",{type:"custom",message:"An item must be added"})},[g.items,u]),{methods:n,onSubmit:p,onSubmitDraft:v,onSubmitUpdate:C}},bn=({children:t})=>{const e=xt();let i=700;e<=616?i=e:e<=768?i=616:i=700;const s={hidden:{x:`${-i}px`},visible:{x:"0"},exit:{x:`${-i}px`}};return d.jsxs(d.Fragment,{children:[d.jsx(je.div,{initial:{opacity:0},animate:{opacity:.5},exit:{opacity:0},transition:{duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#000",zIndex:1e3,cursor:"pointer"}},"overlay"),d.jsx(je.div,{variants:s,initial:"hidden",animate:"visible",exit:"exit",transition:{type:"tween",duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:`${i}px`,height:"100%",color:"#ecf0f1",padding:"20px",zIndex:1001,boxShadow:"2px 0 5px rgba(0,0,0,0.3)"},children:t},"sidebar")]})};export{jn as A,Tn as C,Sn as D,wn as E,fn as F,bn as S,Dn as a,En as b,_ as c,An as u};
