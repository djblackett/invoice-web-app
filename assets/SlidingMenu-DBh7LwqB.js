import{r as v,Z as li,j as d,$ as be,a0 as Re,a1 as ci,a2 as Le,a3 as k,a4 as at,a5 as L,a6 as Ve,a7 as ct,a8 as yt,a9 as z,aa as Be,ab as di,ac as ui,ad as Ie,ae as hi,af as Pt,ag as jt,ah as It,ai as mi,d as T,a as vt,e as fi,aj as pi}from"./index-CztSajze.js";import{P as gt,c as W,u as lt,d as yi,e as ke,A as gi,f as xi,G as vi,E as Pi}from"./invoice.queries-B80zaW6I.js";import{L as M,C as Me,S as Fe,A as xt,a as ji,b as kt,c as Mt,I as At}from"./editPageStyles-BqFVsHQ1.js";import{c as Tt,v as Ft}from"./utilityFunctions-Dz7gQRQ5.js";import{u as Nt}from"./useMutation-DPJ_wiCu.js";import{i as F,b as Vt,d as Ti,e as Ci,f as Ne,p as Ei,s as wi,m as Di,h as A,j as bt,k as S,l as Si,n as Ai,o as $t,q as $e,r as bi,F as Oe,t as Ot,u as Ri,v as Ue,w as qe,x as ze,y as Li,z as Ut,S as Vi,A as Bi,B as O,C as dt,D as ut,E as qt,G as Ii,H as ki,I as Mi,J as U,K as Fi,c as Ni,a as $i,g as Oi}from"./create-visual-element-BTtSyCqp.js";class Ui extends v.Component{getSnapshotBeforeUpdate(e){const i=this.props.childRef.current;if(i&&e.isPresent&&!this.props.isPresent){const s=this.props.sizeRef.current;s.height=i.offsetHeight||0,s.width=i.offsetWidth||0,s.top=i.offsetTop,s.left=i.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function qi({children:t,isPresent:e}){const i=v.useId(),s=v.useRef(null),a=v.useRef({width:0,height:0,top:0,left:0}),{nonce:h}=v.useContext(li);return v.useInsertionEffect(()=>{const{width:n,height:o,top:r,left:l}=a.current;if(e||!s.current||!n||!o)return;s.current.dataset.motionPopId=i;const c=document.createElement("style");return h&&(c.nonce=h),document.head.appendChild(c),c.sheet&&c.sheet.insertRule(`
          [data-motion-pop-id="${i}"] {
            position: absolute !important;
            width: ${n}px !important;
            height: ${o}px !important;
            top: ${r}px !important;
            left: ${l}px !important;
          }
        `),()=>{document.head.removeChild(c)}},[e]),d.jsx(Ui,{isPresent:e,childRef:s,sizeRef:a,children:v.cloneElement(t,{ref:s})})}const zi=({children:t,initial:e,isPresent:i,onExitComplete:s,custom:a,presenceAffectsLayout:h,mode:n})=>{const o=be(_i),r=v.useId(),l=v.useCallback(u=>{o.set(u,!0);for(const f of o.values())if(!f)return;s&&s()},[o,s]),c=v.useMemo(()=>({id:r,initial:e,isPresent:i,custom:a,onExitComplete:l,register:u=>(o.set(u,!1),()=>o.delete(u))}),h?[Math.random(),l]:[i,l]);return v.useMemo(()=>{o.forEach((u,f)=>o.set(f,!1))},[i]),v.useEffect(()=>{!i&&!o.size&&s&&s()},[i]),n==="popLayout"&&(t=d.jsx(qi,{isPresent:i,children:t})),d.jsx(Re.Provider,{value:c,children:t})};function _i(){return new Map}function _e(t=!0){const e=v.useContext(Re);if(e===null)return[!0,null];const{isPresent:i,onExitComplete:s,register:a}=e,h=v.useId();v.useEffect(()=>{t&&a(h)},[t]);const n=v.useCallback(()=>t&&s&&s(h),[h,s,t]);return!i&&s?[!1,n]:[!0]}const ht=t=>t.key||"";function zt(t){const e=[];return v.Children.forEach(t,i=>{v.isValidElement(i)&&e.push(i)}),e}const Tn=({children:t,custom:e,initial:i=!0,onExitComplete:s,presenceAffectsLayout:a=!0,mode:h="sync",propagate:n=!1})=>{const[o,r]=_e(n),l=v.useMemo(()=>zt(t),[t]),c=n&&!o?[]:l.map(ht),u=v.useRef(!0),f=v.useRef(l),m=be(()=>new Map),[g,y]=v.useState(l),[x,C]=v.useState(l);ci(()=>{u.current=!1,f.current=l;for(let p=0;p<x.length;p++){const P=ht(x[p]);c.includes(P)?m.delete(P):m.get(P)!==!0&&m.set(P,!1)}},[x,c.length,c.join("-")]);const w=[];if(l!==g){let p=[...l];for(let P=0;P<x.length;P++){const j=x[P],b=ht(j);c.includes(b)||(p.splice(P,0,j),w.push(j))}h==="wait"&&w.length&&(p=w),C(zt(p)),y(l);return}const{forceRender:E}=v.useContext(Le);return d.jsx(d.Fragment,{children:x.map(p=>{const P=ht(p),j=n&&!o?!1:l===x||c.includes(P),b=()=>{if(m.has(P))m.set(P,!0);else return;let D=!0;m.forEach(R=>{R||(D=!1)}),D&&(E==null||E(),C(f.current),n&&(r==null||r()),s&&s())};return d.jsx(zi,{isPresent:j,initial:!u.current||i?void 0:!1,custom:j?void 0:e,presenceAffectsLayout:a,mode:h,onExitComplete:j?void 0:b,children:p},P)})})};function Wi(t){if(typeof Proxy>"u")return t;const e=new Map,i=(...s)=>t(...s);return new Proxy(i,{get:(s,a)=>a==="create"?t:(e.has(a)||e.set(a,t(a)),e.get(a))})}function Gi(t){return t==="x"||t==="y"?F[t]?null:(F[t]=!0,()=>{F[t]=!1}):F.x||F.y?null:(F.x=F.y=!0,()=>{F.x=F.y=!1})}function nt(t,e,i,s){return Vt(t,e,Ti(i),s)}const _t=(t,e)=>Math.abs(t-e);function Hi(t,e){const i=_t(t.x,e.x),s=_t(t.y,e.y);return Math.sqrt(i**2+s**2)}class We{constructor(e,i,{transformPagePoint:s,contextWindow:a,dragSnapToOrigin:h=!1}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const u=Et(this.lastMoveEventInfo,this.history),f=this.startEvent!==null,m=Hi(u.offset,{x:0,y:0})>=3;if(!f&&!m)return;const{point:g}=u,{timestamp:y}=L;this.history.push({...g,timestamp:y});const{onStart:x,onMove:C}=this.handlers;f||(x&&x(this.lastMoveEvent,u),this.startEvent=this.lastMoveEvent),C&&C(this.lastMoveEvent,u)},this.handlePointerMove=(u,f)=>{this.lastMoveEvent=u,this.lastMoveEventInfo=Ct(f,this.transformPagePoint),k.update(this.updatePoint,!0)},this.handlePointerUp=(u,f)=>{this.end();const{onEnd:m,onSessionEnd:g,resumeAnimation:y}=this.handlers;if(this.dragSnapToOrigin&&y&&y(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const x=Et(u.type==="pointercancel"?this.lastMoveEventInfo:Ct(f,this.transformPagePoint),this.history);this.startEvent&&m&&m(u,x),g&&g(u,x)},!Ci(e))return;this.dragSnapToOrigin=h,this.handlers=i,this.transformPagePoint=s,this.contextWindow=a||window;const n=Ne(e),o=Ct(n,this.transformPagePoint),{point:r}=o,{timestamp:l}=L;this.history=[{...r,timestamp:l}];const{onSessionStart:c}=i;c&&c(e,Et(o,this.history)),this.removeListeners=Ei(nt(this.contextWindow,"pointermove",this.handlePointerMove),nt(this.contextWindow,"pointerup",this.handlePointerUp),nt(this.contextWindow,"pointercancel",this.handlePointerUp))}updateHandlers(e){this.handlers=e}end(){this.removeListeners&&this.removeListeners(),at(this.updatePoint)}}function Ct(t,e){return e?{point:e(t.point)}:t}function Wt(t,e){return{x:t.x-e.x,y:t.y-e.y}}function Et({point:t},e){return{point:t,delta:Wt(t,Ge(e)),offset:Wt(t,Xi(e)),velocity:Yi(e,.1)}}function Xi(t){return t[0]}function Ge(t){return t[t.length-1]}function Yi(t,e){if(t.length<2)return{x:0,y:0};let i=t.length-1,s=null;const a=Ge(t);for(;i>=0&&(s=t[i],!(a.timestamp-s.timestamp>wi(e)));)i--;if(!s)return{x:0,y:0};const h=Di(a.timestamp-s.timestamp);if(h===0)return{x:0,y:0};const n={x:(a.x-s.x)/h,y:(a.y-s.y)/h};return n.x===1/0&&(n.x=0),n.y===1/0&&(n.y=0),n}const He=1e-4,Zi=1-He,Ki=1+He,Xe=.01,Qi=0-Xe,Ji=0+Xe;function V(t){return t.max-t.min}function ts(t,e,i){return Math.abs(t-e)<=i}function Gt(t,e,i,s=.5){t.origin=s,t.originPoint=A(e.min,e.max,t.origin),t.scale=V(i)/V(e),t.translate=A(i.min,i.max,t.origin)-t.originPoint,(t.scale>=Zi&&t.scale<=Ki||isNaN(t.scale))&&(t.scale=1),(t.translate>=Qi&&t.translate<=Ji||isNaN(t.translate))&&(t.translate=0)}function ot(t,e,i,s){Gt(t.x,e.x,i.x,s?s.originX:void 0),Gt(t.y,e.y,i.y,s?s.originY:void 0)}function Ht(t,e,i){t.min=i.min+e.min,t.max=t.min+V(e)}function es(t,e,i){Ht(t.x,e.x,i.x),Ht(t.y,e.y,i.y)}function Xt(t,e,i){t.min=e.min-i.min,t.max=t.min+V(e)}function rt(t,e,i){Xt(t.x,e.x,i.x),Xt(t.y,e.y,i.y)}function is(t,{min:e,max:i},s){return e!==void 0&&t<e?t=s?A(e,t,s.min):Math.max(t,e):i!==void 0&&t>i&&(t=s?A(i,t,s.max):Math.min(t,i)),t}function Yt(t,e,i){return{min:e!==void 0?t.min+e:void 0,max:i!==void 0?t.max+i-(t.max-t.min):void 0}}function ss(t,{top:e,left:i,bottom:s,right:a}){return{x:Yt(t.x,i,a),y:Yt(t.y,e,s)}}function Zt(t,e){let i=e.min-t.min,s=e.max-t.max;return e.max-e.min<t.max-t.min&&([i,s]=[s,i]),{min:i,max:s}}function ns(t,e){return{x:Zt(t.x,e.x),y:Zt(t.y,e.y)}}function os(t,e){let i=.5;const s=V(t),a=V(e);return a>s?i=bt(e.min,e.max-s,t.min):s>a&&(i=bt(t.min,t.max-a,e.min)),Ve(0,1,i)}function rs(t,e){const i={};return e.min!==void 0&&(i.min=e.min-t.min),e.max!==void 0&&(i.max=e.max-t.min),i}const Rt=.35;function as(t=Rt){return t===!1?t=0:t===!0&&(t=Rt),{x:Kt(t,"left","right"),y:Kt(t,"top","bottom")}}function Kt(t,e,i){return{min:Qt(t,e),max:Qt(t,i)}}function Qt(t,e){return typeof t=="number"?t:t[e]||0}function I(t){return[t("x"),t("y")]}const Ye=({current:t})=>t?t.ownerDocument.defaultView:null,ls=new WeakMap;class cs{constructor(e){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=S(),this.visualElement=e}start(e,{snapToCursor:i=!1}={}){const{presenceContext:s}=this.visualElement;if(s&&s.isPresent===!1)return;const a=c=>{const{dragSnapToOrigin:u}=this.getProps();u?this.pauseAnimation():this.stopAnimation(),i&&this.snapToCursor(Ne(c).point)},h=(c,u)=>{const{drag:f,dragPropagation:m,onDragStart:g}=this.getProps();if(f&&!m&&(this.openDragLock&&this.openDragLock(),this.openDragLock=Gi(f),!this.openDragLock))return;this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),I(x=>{let C=this.getAxisMotionValue(x).get()||0;if(yt.test(C)){const{projection:w}=this.visualElement;if(w&&w.layout){const E=w.layout.layoutBox[x];E&&(C=V(E)*(parseFloat(C)/100))}}this.originPoint[x]=C}),g&&k.postRender(()=>g(c,u)),$t(this.visualElement,"transform");const{animationState:y}=this.visualElement;y&&y.setActive("whileDrag",!0)},n=(c,u)=>{const{dragPropagation:f,dragDirectionLock:m,onDirectionLock:g,onDrag:y}=this.getProps();if(!f&&!this.openDragLock)return;const{offset:x}=u;if(m&&this.currentDirection===null){this.currentDirection=ds(x),this.currentDirection!==null&&g&&g(this.currentDirection);return}this.updateAxis("x",u.point,x),this.updateAxis("y",u.point,x),this.visualElement.render(),y&&y(c,u)},o=(c,u)=>this.stop(c,u),r=()=>I(c=>{var u;return this.getAnimationState(c)==="paused"&&((u=this.getAxisMotionValue(c).animation)===null||u===void 0?void 0:u.play())}),{dragSnapToOrigin:l}=this.getProps();this.panSession=new We(e,{onSessionStart:a,onStart:h,onMove:n,onSessionEnd:o,resumeAnimation:r},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:l,contextWindow:Ye(this.visualElement)})}stop(e,i){const s=this.isDragging;if(this.cancel(),!s)return;const{velocity:a}=i;this.startAnimation(a);const{onDragEnd:h}=this.getProps();h&&k.postRender(()=>h(e,i))}cancel(){this.isDragging=!1;const{projection:e,animationState:i}=this.visualElement;e&&(e.isAnimationBlocked=!1),this.panSession&&this.panSession.end(),this.panSession=void 0;const{dragPropagation:s}=this.getProps();!s&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),i&&i.setActive("whileDrag",!1)}updateAxis(e,i,s){const{drag:a}=this.getProps();if(!s||!mt(e,a,this.currentDirection))return;const h=this.getAxisMotionValue(e);let n=this.originPoint[e]+s[e];this.constraints&&this.constraints[e]&&(n=is(n,this.constraints[e],this.elastic[e])),h.set(n)}resolveConstraints(){var e;const{dragConstraints:i,dragElastic:s}=this.getProps(),a=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(e=this.visualElement.projection)===null||e===void 0?void 0:e.layout,h=this.constraints;i&&ct(i)?this.constraints||(this.constraints=this.resolveRefConstraints()):i&&a?this.constraints=ss(a.layoutBox,i):this.constraints=!1,this.elastic=as(s),h!==this.constraints&&a&&this.constraints&&!this.hasMutatedConstraints&&I(n=>{this.constraints!==!1&&this.getAxisMotionValue(n)&&(this.constraints[n]=rs(a.layoutBox[n],this.constraints[n]))})}resolveRefConstraints(){const{dragConstraints:e,onMeasureDragConstraints:i}=this.getProps();if(!e||!ct(e))return!1;const s=e.current,{projection:a}=this.visualElement;if(!a||!a.layout)return!1;const h=Si(s,a.root,this.visualElement.getTransformPagePoint());let n=ns(a.layout.layoutBox,h);if(i){const o=i(Ai(n));this.hasMutatedConstraints=!!o,o&&(n=bi(o))}return n}startAnimation(e){const{drag:i,dragMomentum:s,dragElastic:a,dragTransition:h,dragSnapToOrigin:n,onDragTransitionEnd:o}=this.getProps(),r=this.constraints||{},l=I(c=>{if(!mt(c,i,this.currentDirection))return;let u=r[c]||{};n&&(u={min:0,max:0});const f=a?200:1e6,m=a?40:1e7,g={type:"inertia",velocity:s?e[c]:0,bounceStiffness:f,bounceDamping:m,timeConstant:750,restDelta:1,restSpeed:10,...h,...u};return this.startAxisValueAnimation(c,g)});return Promise.all(l).then(o)}startAxisValueAnimation(e,i){const s=this.getAxisMotionValue(e);return $t(this.visualElement,e),s.start($e(e,s,0,i,this.visualElement,!1))}stopAnimation(){I(e=>this.getAxisMotionValue(e).stop())}pauseAnimation(){I(e=>{var i;return(i=this.getAxisMotionValue(e).animation)===null||i===void 0?void 0:i.pause()})}getAnimationState(e){var i;return(i=this.getAxisMotionValue(e).animation)===null||i===void 0?void 0:i.state}getAxisMotionValue(e){const i=`_drag${e.toUpperCase()}`,s=this.visualElement.getProps(),a=s[i];return a||this.visualElement.getValue(e,(s.initial?s.initial[e]:void 0)||0)}snapToCursor(e){I(i=>{const{drag:s}=this.getProps();if(!mt(i,s,this.currentDirection))return;const{projection:a}=this.visualElement,h=this.getAxisMotionValue(i);if(a&&a.layout){const{min:n,max:o}=a.layout.layoutBox[i];h.set(e[i]-A(n,o,.5))}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:e,dragConstraints:i}=this.getProps(),{projection:s}=this.visualElement;if(!ct(i)||!s||!this.constraints)return;this.stopAnimation();const a={x:0,y:0};I(n=>{const o=this.getAxisMotionValue(n);if(o&&this.constraints!==!1){const r=o.get();a[n]=os({min:r,max:r},this.constraints[n])}});const{transformTemplate:h}=this.visualElement.getProps();this.visualElement.current.style.transform=h?h({},""):"none",s.root&&s.root.updateScroll(),s.updateLayout(),this.resolveConstraints(),I(n=>{if(!mt(n,e,null))return;const o=this.getAxisMotionValue(n),{min:r,max:l}=this.constraints[n];o.set(A(r,l,a[n]))})}addListeners(){if(!this.visualElement.current)return;ls.set(this.visualElement,this);const e=this.visualElement.current,i=nt(e,"pointerdown",r=>{const{drag:l,dragListener:c=!0}=this.getProps();l&&c&&this.start(r)}),s=()=>{const{dragConstraints:r}=this.getProps();ct(r)&&r.current&&(this.constraints=this.resolveRefConstraints())},{projection:a}=this.visualElement,h=a.addEventListener("measure",s);a&&!a.layout&&(a.root&&a.root.updateScroll(),a.updateLayout()),k.read(s);const n=Vt(window,"resize",()=>this.scalePositionWithinConstraints()),o=a.addEventListener("didUpdate",({delta:r,hasLayoutChanged:l})=>{this.isDragging&&l&&(I(c=>{const u=this.getAxisMotionValue(c);u&&(this.originPoint[c]+=r[c].translate,u.set(u.get()+r[c].translate))}),this.visualElement.render())});return()=>{n(),i(),h(),o&&o()}}getProps(){const e=this.visualElement.getProps(),{drag:i=!1,dragDirectionLock:s=!1,dragPropagation:a=!1,dragConstraints:h=!1,dragElastic:n=Rt,dragMomentum:o=!0}=e;return{...e,drag:i,dragDirectionLock:s,dragPropagation:a,dragConstraints:h,dragElastic:n,dragMomentum:o}}}function mt(t,e,i){return(e===!0||e===t)&&(i===null||i===t)}function ds(t,e=10){let i=null;return Math.abs(t.y)>e?i="y":Math.abs(t.x)>e&&(i="x"),i}class us extends Oe{constructor(e){super(e),this.removeGroupControls=z,this.removeListeners=z,this.controls=new cs(e)}mount(){const{dragControls:e}=this.node.getProps();e&&(this.removeGroupControls=e.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||z}unmount(){this.removeGroupControls(),this.removeListeners()}}const Jt=t=>(e,i)=>{t&&k.postRender(()=>t(e,i))};class hs extends Oe{constructor(){super(...arguments),this.removePointerDownListener=z}onPointerDown(e){this.session=new We(e,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:Ye(this.node)})}createPanHandlers(){const{onPanSessionStart:e,onPanStart:i,onPan:s,onPanEnd:a}=this.node.getProps();return{onSessionStart:Jt(e),onStart:Jt(i),onMove:s,onEnd:(h,n)=>{delete this.session,a&&k.postRender(()=>a(h,n))}}}mount(){this.removePointerDownListener=nt(this.node.current,"pointerdown",e=>this.onPointerDown(e))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}const ft={hasAnimatedSinceResize:!0,hasEverUpdated:!1};function te(t,e){return e.max===e.min?0:t/(e.max-e.min)*100}const et={correct:(t,e)=>{if(!e.target)return t;if(typeof t=="string")if(Be.test(t))t=parseFloat(t);else return t;const i=te(t,e.target.x),s=te(t,e.target.y);return`${i}% ${s}%`}},ms={correct:(t,{treeScale:e,projectionDelta:i})=>{const s=t,a=Ot.parse(t);if(a.length>5)return s;const h=Ot.createTransformer(t),n=typeof a[0]!="number"?1:0,o=i.x.scale*e.x,r=i.y.scale*e.y;a[0+n]/=o,a[1+n]/=r;const l=A(o,r,.5);return typeof a[2+n]=="number"&&(a[2+n]/=l),typeof a[3+n]=="number"&&(a[3+n]/=l),h(a)}};class fs extends v.Component{componentDidMount(){const{visualElement:e,layoutGroup:i,switchLayoutGroup:s,layoutId:a}=this.props,{projection:h}=e;ui(ps),h&&(i.group&&i.group.add(h),s&&s.register&&a&&s.register(h),h.root.didUpdate(),h.addEventListener("animationComplete",()=>{this.safeToRemove()}),h.setOptions({...h.options,onExitComplete:()=>this.safeToRemove()})),ft.hasEverUpdated=!0}getSnapshotBeforeUpdate(e){const{layoutDependency:i,visualElement:s,drag:a,isPresent:h}=this.props,n=s.projection;return n&&(n.isPresent=h,a||e.layoutDependency!==i||i===void 0?n.willUpdate():this.safeToRemove(),e.isPresent!==h&&(h?n.promote():n.relegate()||k.postRender(()=>{const o=n.getStack();(!o||!o.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{projection:e}=this.props.visualElement;e&&(e.root.didUpdate(),Ie.postRender(()=>{!e.currentAnimation&&e.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:e,layoutGroup:i,switchLayoutGroup:s}=this.props,{projection:a}=e;a&&(a.scheduleCheckAfterUnmount(),i&&i.group&&i.group.remove(a),s&&s.deregister&&s.deregister(a))}safeToRemove(){const{safeToRemove:e}=this.props;e&&e()}render(){return null}}function Ze(t){const[e,i]=_e(),s=v.useContext(Le);return d.jsx(fs,{...t,layoutGroup:s,switchLayoutGroup:v.useContext(di),isPresent:e,safeToRemove:i})}const ps={borderRadius:{...et,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:et,borderTopRightRadius:et,borderBottomLeftRadius:et,borderBottomRightRadius:et,boxShadow:ms};function ys(t,e,i){const s=hi(t)?t:Ri(t);return s.start($e("",s,e,i)),s.animation}function gs(t){return t instanceof SVGElement&&t.tagName!=="svg"}const xs=(t,e)=>t.depth-e.depth;class vs{constructor(){this.children=[],this.isDirty=!1}add(e){Ue(this.children,e),this.isDirty=!0}remove(e){qe(this.children,e),this.isDirty=!0}forEach(e){this.isDirty&&this.children.sort(xs),this.isDirty=!1,this.children.forEach(e)}}function Ps(t,e){const i=ze.now(),s=({timestamp:a})=>{const h=a-i;h>=e&&(at(s),t(h-e))};return k.read(s,!0),()=>at(s)}const Ke=["TopLeft","TopRight","BottomLeft","BottomRight"],js=Ke.length,ee=t=>typeof t=="string"?parseFloat(t):t,ie=t=>typeof t=="number"||Be.test(t);function Ts(t,e,i,s,a,h){a?(t.opacity=A(0,i.opacity!==void 0?i.opacity:1,Cs(s)),t.opacityExit=A(e.opacity!==void 0?e.opacity:1,0,Es(s))):h&&(t.opacity=A(e.opacity!==void 0?e.opacity:1,i.opacity!==void 0?i.opacity:1,s));for(let n=0;n<js;n++){const o=`border${Ke[n]}Radius`;let r=se(e,o),l=se(i,o);if(r===void 0&&l===void 0)continue;r||(r=0),l||(l=0),r===0||l===0||ie(r)===ie(l)?(t[o]=Math.max(A(ee(r),ee(l),s),0),(yt.test(l)||yt.test(r))&&(t[o]+="%")):t[o]=l}(e.rotate||i.rotate)&&(t.rotate=A(e.rotate||0,i.rotate||0,s))}function se(t,e){return t[e]!==void 0?t[e]:t.borderRadius}const Cs=Qe(0,.5,Li),Es=Qe(.5,.95,z);function Qe(t,e,i){return s=>s<t?0:s>e?1:i(bt(t,e,s))}function ne(t,e){t.min=e.min,t.max=e.max}function B(t,e){ne(t.x,e.x),ne(t.y,e.y)}function oe(t,e){t.translate=e.translate,t.scale=e.scale,t.originPoint=e.originPoint,t.origin=e.origin}function re(t,e,i,s,a){return t-=e,t=Ut(t,1/i,s),a!==void 0&&(t=Ut(t,1/a,s)),t}function ws(t,e=0,i=1,s=.5,a,h=t,n=t){if(yt.test(e)&&(e=parseFloat(e),e=A(n.min,n.max,e/100)-n.min),typeof e!="number")return;let o=A(h.min,h.max,s);t===h&&(o-=e),t.min=re(t.min,e,i,o,a),t.max=re(t.max,e,i,o,a)}function ae(t,e,[i,s,a],h,n){ws(t,e[i],e[s],e[a],e.scale,h,n)}const Ds=["x","scaleX","originX"],Ss=["y","scaleY","originY"];function le(t,e,i,s){ae(t.x,e,Ds,i?i.x:void 0,s?s.x:void 0),ae(t.y,e,Ss,i?i.y:void 0,s?s.y:void 0)}function ce(t){return t.translate===0&&t.scale===1}function Je(t){return ce(t.x)&&ce(t.y)}function de(t,e){return t.min===e.min&&t.max===e.max}function As(t,e){return de(t.x,e.x)&&de(t.y,e.y)}function ue(t,e){return Math.round(t.min)===Math.round(e.min)&&Math.round(t.max)===Math.round(e.max)}function ti(t,e){return ue(t.x,e.x)&&ue(t.y,e.y)}function he(t){return V(t.x)/V(t.y)}function me(t,e){return t.translate===e.translate&&t.scale===e.scale&&t.originPoint===e.originPoint}class bs{constructor(){this.members=[]}add(e){Ue(this.members,e),e.scheduleRender()}remove(e){if(qe(this.members,e),e===this.prevLead&&(this.prevLead=void 0),e===this.lead){const i=this.members[this.members.length-1];i&&this.promote(i)}}relegate(e){const i=this.members.findIndex(a=>e===a);if(i===0)return!1;let s;for(let a=i;a>=0;a--){const h=this.members[a];if(h.isPresent!==!1){s=h;break}}return s?(this.promote(s),!0):!1}promote(e,i){const s=this.lead;if(e!==s&&(this.prevLead=s,this.lead=e,e.show(),s)){s.instance&&s.scheduleRender(),e.scheduleRender(),e.resumeFrom=s,i&&(e.resumeFrom.preserveOpacity=!0),s.snapshot&&(e.snapshot=s.snapshot,e.snapshot.latestValues=s.animationValues||s.latestValues),e.root&&e.root.isUpdating&&(e.isLayoutDirty=!0);const{crossfade:a}=e.options;a===!1&&s.hide()}}exitAnimationComplete(){this.members.forEach(e=>{const{options:i,resumingFrom:s}=e;i.onExitComplete&&i.onExitComplete(),s&&s.options.onExitComplete&&s.options.onExitComplete()})}scheduleRender(){this.members.forEach(e=>{e.instance&&e.scheduleRender(!1)})}removeLeadSnapshot(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)}}function Rs(t,e,i){let s="";const a=t.x.translate/e.x,h=t.y.translate/e.y,n=(i==null?void 0:i.z)||0;if((a||h||n)&&(s=`translate3d(${a}px, ${h}px, ${n}px) `),(e.x!==1||e.y!==1)&&(s+=`scale(${1/e.x}, ${1/e.y}) `),i){const{transformPerspective:l,rotate:c,rotateX:u,rotateY:f,skewX:m,skewY:g}=i;l&&(s=`perspective(${l}px) ${s}`),c&&(s+=`rotate(${c}deg) `),u&&(s+=`rotateX(${u}deg) `),f&&(s+=`rotateY(${f}deg) `),m&&(s+=`skewX(${m}deg) `),g&&(s+=`skewY(${g}deg) `)}const o=t.x.scale*e.x,r=t.y.scale*e.y;return(o!==1||r!==1)&&(s+=`scale(${o}, ${r})`),s||"none"}const $={type:"projectionFrame",totalNodes:0,resolvedTargetDeltas:0,recalculatedProjection:0},it=typeof window<"u"&&window.MotionDebug!==void 0,wt=["","X","Y","Z"],Ls={visibility:"hidden"},fe=1e3;let Vs=0;function Dt(t,e,i,s){const{latestValues:a}=e;a[t]&&(i[t]=a[t],e.setStaticValue(t,0),s&&(s[t]=0))}function ei(t){if(t.hasCheckedOptimisedAppear=!0,t.root===t)return;const{visualElement:e}=t.options;if(!e)return;const i=Fi(e);if(window.MotionHasOptimisedAnimation(i,"transform")){const{layout:a,layoutId:h}=t.options;window.MotionCancelOptimisedAnimation(i,"transform",k,!(a||h))}const{parent:s}=t;s&&!s.hasCheckedOptimisedAppear&&ei(s)}function ii({attachResizeListener:t,defaultParent:e,measureScroll:i,checkIsScrollRoot:s,resetTransform:a}){return class{constructor(n={},o=e==null?void 0:e()){this.id=Vs++,this.animationId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,it&&($.totalNodes=$.resolvedTargetDeltas=$.recalculatedProjection=0),this.nodes.forEach(ks),this.nodes.forEach(Os),this.nodes.forEach(Us),this.nodes.forEach(Ms),it&&window.MotionDebug.record($)},this.resolvedRelativeTargetAt=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=n,this.root=o?o.root||o:this,this.path=o?[...o.path,o]:[],this.parent=o,this.depth=o?o.depth+1:0;for(let r=0;r<this.path.length;r++)this.path[r].shouldResetTransform=!0;this.root===this&&(this.nodes=new vs)}addEventListener(n,o){return this.eventHandlers.has(n)||this.eventHandlers.set(n,new Vi),this.eventHandlers.get(n).add(o)}notifyListeners(n,...o){const r=this.eventHandlers.get(n);r&&r.notify(...o)}hasListeners(n){return this.eventHandlers.has(n)}mount(n,o=this.root.hasTreeAnimated){if(this.instance)return;this.isSVG=gs(n),this.instance=n;const{layoutId:r,layout:l,visualElement:c}=this.options;if(c&&!c.current&&c.mount(n),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),o&&(l||r)&&(this.isLayoutDirty=!0),t){let u;const f=()=>this.root.updateBlockedByResize=!1;t(n,()=>{this.root.updateBlockedByResize=!0,u&&u(),u=Ps(f,250),ft.hasAnimatedSinceResize&&(ft.hasAnimatedSinceResize=!1,this.nodes.forEach(ye))})}r&&this.root.registerSharedNode(r,this),this.options.animate!==!1&&c&&(r||l)&&this.addEventListener("didUpdate",({delta:u,hasLayoutChanged:f,hasRelativeLayoutChanged:m,layout:g})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const y=this.options.transition||c.getDefaultTransition()||Gs,{onLayoutAnimationStart:x,onLayoutAnimationComplete:C}=c.getProps(),w=!this.targetLayout||!ti(this.targetLayout,g),E=!f&&m;if(this.options.layoutRoot||this.resumeFrom&&this.resumeFrom.instance||E||f&&(w||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0),this.setAnimationOrigin(u,E);const p={...Bi(y,"layout"),onPlay:x,onComplete:C};(c.shouldReduceMotion||this.options.layoutRoot)&&(p.delay=0,p.type=!1),this.startAnimation(p)}else f||ye(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=g})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const n=this.getStack();n&&n.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,at(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(qs),this.animationId++)}getTransformTemplate(){const{visualElement:n}=this.options;return n&&n.getProps().transformTemplate}willUpdate(n=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&ei(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let c=0;c<this.path.length;c++){const u=this.path[c];u.shouldResetTransform=!0,u.updateScroll("snapshot"),u.options.layoutRoot&&u.willUpdate(!1)}const{layoutId:o,layout:r}=this.options;if(o===void 0&&!r)return;const l=this.getTransformTemplate();this.prevTransformTemplateValue=l?l(this.latestValues,""):void 0,this.updateSnapshot(),n&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(pe);return}this.isUpdating||this.nodes.forEach(Ns),this.isUpdating=!1,this.nodes.forEach($s),this.nodes.forEach(Bs),this.nodes.forEach(Is),this.clearAllSnapshots();const o=ze.now();L.delta=Ve(0,1e3/60,o-L.timestamp),L.timestamp=o,L.isProcessing=!0,Pt.update.process(L),Pt.preRender.process(L),Pt.render.process(L),L.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,Ie.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(Fs),this.sharedNodes.forEach(zs)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,k.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){k.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure())}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let r=0;r<this.path.length;r++)this.path[r].updateScroll();const n=this.layout;this.layout=this.measure(!1),this.layoutCorrected=S(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:o}=this.options;o&&o.notify("LayoutMeasure",this.layout.layoutBox,n?n.layoutBox:void 0)}updateScroll(n="measure"){let o=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===n&&(o=!1),o){const r=s(this.instance);this.scroll={animationId:this.root.animationId,phase:n,isRoot:r,offset:i(this.instance),wasRoot:this.scroll?this.scroll.isRoot:r}}}resetTransform(){if(!a)return;const n=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,o=this.projectionDelta&&!Je(this.projectionDelta),r=this.getTransformTemplate(),l=r?r(this.latestValues,""):void 0,c=l!==this.prevTransformTemplateValue;n&&(o||O(this.latestValues)||c)&&(a(this.instance,l),this.shouldResetTransform=!1,this.scheduleRender())}measure(n=!0){const o=this.measurePageBox();let r=this.removeElementScroll(o);return n&&(r=this.removeTransform(r)),Hs(r),{animationId:this.root.animationId,measuredBox:o,layoutBox:r,latestValues:{},source:this.id}}measurePageBox(){var n;const{visualElement:o}=this.options;if(!o)return S();const r=o.measureViewportBox();if(!(((n=this.scroll)===null||n===void 0?void 0:n.wasRoot)||this.path.some(Xs))){const{scroll:c}=this.root;c&&(dt(r.x,c.offset.x),dt(r.y,c.offset.y))}return r}removeElementScroll(n){var o;const r=S();if(B(r,n),!((o=this.scroll)===null||o===void 0)&&o.wasRoot)return r;for(let l=0;l<this.path.length;l++){const c=this.path[l],{scroll:u,options:f}=c;c!==this.root&&u&&f.layoutScroll&&(u.wasRoot&&B(r,n),dt(r.x,u.offset.x),dt(r.y,u.offset.y))}return r}applyTransform(n,o=!1){const r=S();B(r,n);for(let l=0;l<this.path.length;l++){const c=this.path[l];!o&&c.options.layoutScroll&&c.scroll&&c!==c.root&&ut(r,{x:-c.scroll.offset.x,y:-c.scroll.offset.y}),O(c.latestValues)&&ut(r,c.latestValues)}return O(this.latestValues)&&ut(r,this.latestValues),r}removeTransform(n){const o=S();B(o,n);for(let r=0;r<this.path.length;r++){const l=this.path[r];if(!l.instance||!O(l.latestValues))continue;qt(l.latestValues)&&l.updateSnapshot();const c=S(),u=l.measurePageBox();B(c,u),le(o,l.latestValues,l.snapshot?l.snapshot.layoutBox:void 0,c)}return O(this.latestValues)&&le(o,this.latestValues),o}setTargetDelta(n){this.targetDelta=n,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(n){this.options={...this.options,...n,crossfade:n.crossfade!==void 0?n.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==L.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(n=!1){var o;const r=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=r.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=r.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=r.isSharedProjectionDirty);const l=!!this.resumingFrom||this!==r;if(!(n||l&&this.isSharedProjectionDirty||this.isProjectionDirty||!((o=this.parent)===null||o===void 0)&&o.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:u,layoutId:f}=this.options;if(!(!this.layout||!(u||f))){if(this.resolvedRelativeTargetAt=L.timestamp,!this.targetDelta&&!this.relativeTarget){const m=this.getClosestProjectingParent();m&&m.layout&&this.animationProgress!==1?(this.relativeParent=m,this.forceRelativeParentToResolveTarget(),this.relativeTarget=S(),this.relativeTargetOrigin=S(),rt(this.relativeTargetOrigin,this.layout.layoutBox,m.layout.layoutBox),B(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}if(!(!this.relativeTarget&&!this.targetDelta)){if(this.target||(this.target=S(),this.targetWithTransforms=S()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),es(this.target,this.relativeTarget,this.relativeParent.target)):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.layoutBox):B(this.target,this.layout.layoutBox),Ii(this.target,this.targetDelta)):B(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget){this.attemptToResolveRelativeTarget=!1;const m=this.getClosestProjectingParent();m&&!!m.resumingFrom==!!this.resumingFrom&&!m.options.layoutScroll&&m.target&&this.animationProgress!==1?(this.relativeParent=m,this.forceRelativeParentToResolveTarget(),this.relativeTarget=S(),this.relativeTargetOrigin=S(),rt(this.relativeTargetOrigin,this.target,m.target),B(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}it&&$.resolvedTargetDeltas++}}}getClosestProjectingParent(){if(!(!this.parent||qt(this.parent.latestValues)||ki(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}calcProjection(){var n;const o=this.getLead(),r=!!this.resumingFrom||this!==o;let l=!0;if((this.isProjectionDirty||!((n=this.parent)===null||n===void 0)&&n.isProjectionDirty)&&(l=!1),r&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(l=!1),this.resolvedRelativeTargetAt===L.timestamp&&(l=!1),l)return;const{layout:c,layoutId:u}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(c||u))return;B(this.layoutCorrected,this.layout.layoutBox);const f=this.treeScale.x,m=this.treeScale.y;Mi(this.layoutCorrected,this.treeScale,this.path,r),o.layout&&!o.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(o.target=o.layout.layoutBox,o.targetWithTransforms=S());const{target:g}=o;if(!g){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(oe(this.prevProjectionDelta.x,this.projectionDelta.x),oe(this.prevProjectionDelta.y,this.projectionDelta.y)),ot(this.projectionDelta,this.layoutCorrected,g,this.latestValues),(this.treeScale.x!==f||this.treeScale.y!==m||!me(this.projectionDelta.x,this.prevProjectionDelta.x)||!me(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",g)),it&&$.recalculatedProjection++}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(n=!0){var o;if((o=this.options.visualElement)===null||o===void 0||o.scheduleRender(),n){const r=this.getStack();r&&r.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=U(),this.projectionDelta=U(),this.projectionDeltaWithTransform=U()}setAnimationOrigin(n,o=!1){const r=this.snapshot,l=r?r.latestValues:{},c={...this.latestValues},u=U();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!o;const f=S(),m=r?r.source:void 0,g=this.layout?this.layout.source:void 0,y=m!==g,x=this.getStack(),C=!x||x.members.length<=1,w=!!(y&&!C&&this.options.crossfade===!0&&!this.path.some(Ws));this.animationProgress=0;let E;this.mixTargetDelta=p=>{const P=p/1e3;ge(u.x,n.x,P),ge(u.y,n.y,P),this.setTargetDelta(u),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(rt(f,this.layout.layoutBox,this.relativeParent.layout.layoutBox),_s(this.relativeTarget,this.relativeTargetOrigin,f,P),E&&As(this.relativeTarget,E)&&(this.isProjectionDirty=!1),E||(E=S()),B(E,this.relativeTarget)),y&&(this.animationValues=c,Ts(c,l,this.latestValues,P,w,C)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=P},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(n){this.notifyListeners("animationStart"),this.currentAnimation&&this.currentAnimation.stop(),this.resumingFrom&&this.resumingFrom.currentAnimation&&this.resumingFrom.currentAnimation.stop(),this.pendingAnimation&&(at(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=k.update(()=>{ft.hasAnimatedSinceResize=!0,this.currentAnimation=ys(0,fe,{...n,onUpdate:o=>{this.mixTargetDelta(o),n.onUpdate&&n.onUpdate(o)},onComplete:()=>{n.onComplete&&n.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const n=this.getStack();n&&n.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(fe),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const n=this.getLead();let{targetWithTransforms:o,target:r,layout:l,latestValues:c}=n;if(!(!o||!r||!l)){if(this!==n&&this.layout&&l&&si(this.options.animationType,this.layout.layoutBox,l.layoutBox)){r=this.target||S();const u=V(this.layout.layoutBox.x);r.x.min=n.target.x.min,r.x.max=r.x.min+u;const f=V(this.layout.layoutBox.y);r.y.min=n.target.y.min,r.y.max=r.y.min+f}B(o,r),ut(o,c),ot(this.projectionDeltaWithTransform,this.layoutCorrected,o,c)}}registerSharedNode(n,o){this.sharedNodes.has(n)||this.sharedNodes.set(n,new bs),this.sharedNodes.get(n).add(o);const l=o.options.initialPromotionConfig;o.promote({transition:l?l.transition:void 0,preserveFollowOpacity:l&&l.shouldPreserveFollowOpacity?l.shouldPreserveFollowOpacity(o):void 0})}isLead(){const n=this.getStack();return n?n.lead===this:!0}getLead(){var n;const{layoutId:o}=this.options;return o?((n=this.getStack())===null||n===void 0?void 0:n.lead)||this:this}getPrevLead(){var n;const{layoutId:o}=this.options;return o?(n=this.getStack())===null||n===void 0?void 0:n.prevLead:void 0}getStack(){const{layoutId:n}=this.options;if(n)return this.root.sharedNodes.get(n)}promote({needsReset:n,transition:o,preserveFollowOpacity:r}={}){const l=this.getStack();l&&l.promote(this,r),n&&(this.projectionDelta=void 0,this.needsReset=!0),o&&this.setOptions({transition:o})}relegate(){const n=this.getStack();return n?n.relegate(this):!1}resetSkewAndRotation(){const{visualElement:n}=this.options;if(!n)return;let o=!1;const{latestValues:r}=n;if((r.z||r.rotate||r.rotateX||r.rotateY||r.rotateZ||r.skewX||r.skewY)&&(o=!0),!o)return;const l={};r.z&&Dt("z",n,l,this.animationValues);for(let c=0;c<wt.length;c++)Dt(`rotate${wt[c]}`,n,l,this.animationValues),Dt(`skew${wt[c]}`,n,l,this.animationValues);n.render();for(const c in l)n.setStaticValue(c,l[c]),this.animationValues&&(this.animationValues[c]=l[c]);n.scheduleRender()}getProjectionStyles(n){var o,r;if(!this.instance||this.isSVG)return;if(!this.isVisible)return Ls;const l={visibility:""},c=this.getTransformTemplate();if(this.needsReset)return this.needsReset=!1,l.opacity="",l.pointerEvents=jt(n==null?void 0:n.pointerEvents)||"",l.transform=c?c(this.latestValues,""):"none",l;const u=this.getLead();if(!this.projectionDelta||!this.layout||!u.target){const y={};return this.options.layoutId&&(y.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,y.pointerEvents=jt(n==null?void 0:n.pointerEvents)||""),this.hasProjected&&!O(this.latestValues)&&(y.transform=c?c({},""):"none",this.hasProjected=!1),y}const f=u.animationValues||u.latestValues;this.applyTransformsToTarget(),l.transform=Rs(this.projectionDeltaWithTransform,this.treeScale,f),c&&(l.transform=c(f,l.transform));const{x:m,y:g}=this.projectionDelta;l.transformOrigin=`${m.origin*100}% ${g.origin*100}% 0`,u.animationValues?l.opacity=u===this?(r=(o=f.opacity)!==null&&o!==void 0?o:this.latestValues.opacity)!==null&&r!==void 0?r:1:this.preserveOpacity?this.latestValues.opacity:f.opacityExit:l.opacity=u===this?f.opacity!==void 0?f.opacity:"":f.opacityExit!==void 0?f.opacityExit:0;for(const y in It){if(f[y]===void 0)continue;const{correct:x,applyTo:C}=It[y],w=l.transform==="none"?f[y]:x(f[y],u);if(C){const E=C.length;for(let p=0;p<E;p++)l[C[p]]=w}else l[y]=w}return this.options.layoutId&&(l.pointerEvents=u===this?jt(n==null?void 0:n.pointerEvents)||"":"none"),l}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(n=>{var o;return(o=n.currentAnimation)===null||o===void 0?void 0:o.stop()}),this.root.nodes.forEach(pe),this.root.sharedNodes.clear()}}}function Bs(t){t.updateLayout()}function Is(t){var e;const i=((e=t.resumeFrom)===null||e===void 0?void 0:e.snapshot)||t.snapshot;if(t.isLead()&&t.layout&&i&&t.hasListeners("didUpdate")){const{layoutBox:s,measuredBox:a}=t.layout,{animationType:h}=t.options,n=i.source!==t.layout.source;h==="size"?I(u=>{const f=n?i.measuredBox[u]:i.layoutBox[u],m=V(f);f.min=s[u].min,f.max=f.min+m}):si(h,i.layoutBox,s)&&I(u=>{const f=n?i.measuredBox[u]:i.layoutBox[u],m=V(s[u]);f.max=f.min+m,t.relativeTarget&&!t.currentAnimation&&(t.isProjectionDirty=!0,t.relativeTarget[u].max=t.relativeTarget[u].min+m)});const o=U();ot(o,s,i.layoutBox);const r=U();n?ot(r,t.applyTransform(a,!0),i.measuredBox):ot(r,s,i.layoutBox);const l=!Je(o);let c=!1;if(!t.resumeFrom){const u=t.getClosestProjectingParent();if(u&&!u.resumeFrom){const{snapshot:f,layout:m}=u;if(f&&m){const g=S();rt(g,i.layoutBox,f.layoutBox);const y=S();rt(y,s,m.layoutBox),ti(g,y)||(c=!0),u.options.layoutRoot&&(t.relativeTarget=y,t.relativeTargetOrigin=g,t.relativeParent=u)}}}t.notifyListeners("didUpdate",{layout:s,snapshot:i,delta:r,layoutDelta:o,hasLayoutChanged:l,hasRelativeLayoutChanged:c})}else if(t.isLead()){const{onExitComplete:s}=t.options;s&&s()}t.options.transition=void 0}function ks(t){it&&$.totalNodes++,t.parent&&(t.isProjecting()||(t.isProjectionDirty=t.parent.isProjectionDirty),t.isSharedProjectionDirty||(t.isSharedProjectionDirty=!!(t.isProjectionDirty||t.parent.isProjectionDirty||t.parent.isSharedProjectionDirty)),t.isTransformDirty||(t.isTransformDirty=t.parent.isTransformDirty))}function Ms(t){t.isProjectionDirty=t.isSharedProjectionDirty=t.isTransformDirty=!1}function Fs(t){t.clearSnapshot()}function pe(t){t.clearMeasurements()}function Ns(t){t.isLayoutDirty=!1}function $s(t){const{visualElement:e}=t.options;e&&e.getProps().onBeforeLayoutMeasure&&e.notify("BeforeLayoutMeasure"),t.resetTransform()}function ye(t){t.finishAnimation(),t.targetDelta=t.relativeTarget=t.target=void 0,t.isProjectionDirty=!0}function Os(t){t.resolveTargetDelta()}function Us(t){t.calcProjection()}function qs(t){t.resetSkewAndRotation()}function zs(t){t.removeLeadSnapshot()}function ge(t,e,i){t.translate=A(e.translate,0,i),t.scale=A(e.scale,1,i),t.origin=e.origin,t.originPoint=e.originPoint}function xe(t,e,i,s){t.min=A(e.min,i.min,s),t.max=A(e.max,i.max,s)}function _s(t,e,i,s){xe(t.x,e.x,i.x,s),xe(t.y,e.y,i.y,s)}function Ws(t){return t.animationValues&&t.animationValues.opacityExit!==void 0}const Gs={duration:.45,ease:[.4,0,.1,1]},ve=t=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(t),Pe=ve("applewebkit/")&&!ve("chrome/")?Math.round:z;function je(t){t.min=Pe(t.min),t.max=Pe(t.max)}function Hs(t){je(t.x),je(t.y)}function si(t,e,i){return t==="position"||t==="preserve-aspect"&&!ts(he(e),he(i),.2)}function Xs(t){var e;return t!==t.root&&((e=t.scroll)===null||e===void 0?void 0:e.wasRoot)}const Ys=ii({attachResizeListener:(t,e)=>Vt(t,"resize",e),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}),checkIsScrollRoot:()=>!0}),St={current:void 0},ni=ii({measureScroll:t=>({x:t.scrollLeft,y:t.scrollTop}),defaultParent:()=>{if(!St.current){const t=new Ys({});t.mount(window),t.setOptions({layoutScroll:!0}),St.current=t}return St.current},resetTransform:(t,e)=>{t.style.transform=e!==void 0?e:"none"},checkIsScrollRoot:t=>window.getComputedStyle(t).position==="fixed"}),Zs={pan:{Feature:hs},drag:{Feature:us,ProjectionNode:ni,MeasureLayout:Ze}},Ks={layout:{ProjectionNode:ni,MeasureLayout:Ze}},Qs=mi({...$i,...Oi,...Zs,...Ks},Ni),Te=Wi(Qs),Js=T.div`
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
`,tn=T(Js)`
  width: 100%;

  @media (min-width: 768px) {
    width: 45%;
    max-width: fit-content;
  }
`,oi=T.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  font-style: ${({theme:t})=>t.font};
  width: 100%;
`;function N({className:t,children:e,style:i}){const s=()=>{};return d.jsx(oi,{onChange:s,className:t,style:i,children:e})}function _({className:t,isLongOnMobile:e,children:i,style:s}){return e?d.jsx(tn,{className:t,style:{...s},children:i}):d.jsx(oi,{className:t,children:i})}const en=T.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  max-width: 100vw;

  @media (min-width: 768px) {
    flex-wrap: nowrap;
    max-width: 100%;
  }
`;function Bt({children:t}){return d.jsx(en,{className:"address-box",children:t})}Bt.propTypes={children:gt.node.isRequired};const sn=T.div`
  display: contents;
  width: 100%;
  justify-content: space-between;

  @media (min-width: 350px) {
    display: flex;
  }
  @media (min-width: 600px) {
    display: contents;
  }
`;function En({invoice:t}){var n,o,r,l;const e=vt(),{formState:{errors:i},register:s}=W(),{isDraft:a}=lt(),h=d.jsxs(N,{style:{width:e<768?"100%":""},className:"company-country",children:[d.jsx(M,{htmlFor:"country",style:{color:i!=null&&i.country?"#EC5757":""},children:"Country"}),d.jsx(Me,{type:"text",style:{border:i!=null&&i.country?"1px solid #EC5757":"",width:e<768?"100%":""},defaultValue:t?(n=t==null?void 0:t.senderAddress)==null?void 0:n.country:"",...s("country",{required:!a,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return d.jsxs(d.Fragment,{children:[d.jsxs(N,{className:"company-street-address",children:[d.jsx(M,{htmlFor:"streetAddress",style:{color:i!=null&&i.streetAddress?"#EC5757":""},children:"Street Address"}),d.jsx(Fe,{style:{border:i!=null&&i.streetAddress?"1px solid #EC5757":""},defaultValue:t?(o=t==null?void 0:t.senderAddress)==null?void 0:o.street:"",...s("streetAddress",{required:!a,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:50})})]}),d.jsxs(Bt,{children:[d.jsxs(sn,{children:[d.jsxs(_,{className:"company-city",children:[d.jsx(M,{htmlFor:"city",style:{color:i!=null&&i.city?"#EC5757":""},children:"City"}),d.jsx(xt,{style:{border:i!=null&&i.city?"1px solid #EC5757":""},defaultValue:t?(r=t==null?void 0:t.senderAddress)==null?void 0:r.city:"",type:"text",...s("city",{required:!a,pattern:/[\w ]*/i,maxLength:30})})]}),d.jsxs(_,{style:{justifySelf:"flex-end"},className:"company-postal-code",children:[d.jsx(M,{htmlFor:"postalCode",style:{color:i!=null&&i.postalCode?"#EC5757":""},children:"Post Code"}),d.jsx(xt,{style:{border:i!=null&&i.postalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(l=t==null?void 0:t.senderAddress)==null?void 0:l.postCode:"",...s("postalCode",{required:!a,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]})]}),e<768&&d.jsx(N,{className:"company-country-container",children:h}),e>=768&&d.jsx(_,{className:"company-country-container",children:h})]})]})}const Ce=T.div`
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
`,ri=T.input`
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
`,Ee=T(ri)`
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
`,Lt=T(ri).attrs({pattern:"\\d+"})`
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
`,we=T(Lt).attrs({pattern:"[0-9.]*"})`
  width: 80px;
  padding-left: 1.25rem;
  text-align: left;

  @media (min-width: 325px) {
    width: 100px;
    padding-left: 1.25rem;
    text-align: left;
  }
`,De=T.p`
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
`;const nn=T.div`
  display: grid;
  grid-template: 1fr / 220px 62px 116px 61px 49px;
`,Se=T.svg`
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
`,st=T.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: fit-content;
  width: fit-content;
`,on=T(st)`
  text-align: right;
  @media (min-width: 325px) {
    align-items: flex-start;
    text-align: initial;
  }
`,rn=T.div`
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
`,Ae=d.jsx("path",{d:"M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z",fillRule:"nonzero",className:"deleteIconPath",tabIndex:0}),an=T.button`
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
`,wn=T.svg`
  width: 11px;
  height: 11px;
`,ln=T.p`
  color: ${({theme:t})=>t.newItemText};
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  text-align: center;
  letter-spacing: -0.25px;
  margin-left: 0.25rem;
`;function cn({items:t,append:e}){const{clearErrors:i}=W(),{formState:{submitCount:s}}=yi(),a=()=>{e({id:"",name:"",quantity:"",price:"",total:""}),i("itemsError")};return d.jsx(an,{onClick:a,type:"button",style:{border:s>0&&t.length===0?"1px solid red":"1px solid transparent"},children:d.jsx(ln,{children:"+ Add New Item"})})}const dn=T.div`
  display: grid;
  width: 100%;
  border-radius: 8px;
  grid-template-rows: auto;
  background-color: ${({theme:t})=>t.formBackground};
`,un=T.div`
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
`,pt=T(q)`
  justify-self: start;

  @media (min-width: 600px) {
    &.mobile-only-label {
      display: none;
    }
  }
`,hn=T.div`
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
`,mn=T.h1`
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
`;function ai({isDraft:t,invoice:e,isEditOpen:i}){const{formState:s,register:a,watch:h,clearErrors:n,setError:o,resetField:r,reset:l}=W(),{fields:c,remove:u,append:f}=ke({name:"items",rules:{required:!0,minLength:1}}),{errors:m,isSubmitting:g}=s,y=h("items",[]),x=vt(),C=v.useRef(!0);v.useEffect(()=>{!c.length&&!C.current?o("myFieldArray",{type:"required",message:"At least one item is required"}):n("myFieldArray"),C.current&&(C.current=!1)},[c,g]),v.useEffect(()=>{e&&i?l({items:e.items.map(p=>({id:p.id,name:p.name,quantity:p.quantity,price:p.price,total:p.total}))}):i||l({items:[]})},[e,i,l]),v.useEffect(()=>{i||setTimeout(()=>{r("items")},200)},[i]);const w=p=>{var P,j,b,D,R,G,H,X,Y,Z,K,Q,J,tt;return d.jsxs(Ce,{children:[d.jsxs(st,{style:{width:"100%",marginBottom:"1.5rem"},children:[d.jsx(pt,{style:{marginBottom:"1rem"},children:"Item Name"}),d.jsx(Ee,{...a(`items[${p}].name`,{required:!t}),placeholder:"Item name",defaultValue:e?(j=(P=e==null?void 0:e.items)==null?void 0:P[p])==null?void 0:j.name:"",type:"text",style:{border:Array.isArray(m.items)&&((D=(b=m==null?void 0:m.items)==null?void 0:b[p])!=null&&D.name)?"1px solid #EC5757":""}})]}),d.jsxs(rn,{children:[d.jsxs(st,{children:[d.jsx(q,{style:{marginBottom:"0.625rem"},children:"Qty."}),d.jsx(Lt,{...a(`items[${p}].quantity`,{required:!t,max:100}),placeholder:"0",type:"text",style:{border:Array.isArray(m.items)&&((G=(R=m==null?void 0:m.items)==null?void 0:R[p])!=null&&G.quantity)?"1px solid #EC5757":""},defaultValue:e?(X=(H=e==null?void 0:e.items)==null?void 0:H[p])==null?void 0:X.quantity:""})]}),d.jsxs(st,{children:[d.jsx(q,{style:{marginBottom:"0.625rem"},children:"Price"}),d.jsx(we,{...a(`items[${p}].price`,{required:!t,max:1e5}),placeholder:"0.00",type:"text",defaultValue:e?(Z=(Y=e==null?void 0:e.items)==null?void 0:Y[p])==null?void 0:Z.price:"",style:{border:Array.isArray(m.items)&&((Q=(K=m==null?void 0:m.items)==null?void 0:K[p])!=null&&Q.price)?"1px solid #EC5757":""}})]}),d.jsxs(on,{style:{width:"fit-content"},children:[d.jsx(q,{style:{marginBottom:"0.625rem"},children:"Total"}),d.jsx(De,{children:(Number((J=y==null?void 0:y[p])==null?void 0:J.quantity)*Number((tt=y==null?void 0:y[p])==null?void 0:tt.price)).toFixed(2)})]})]}),d.jsxs(st,{children:[d.jsx(q,{style:{marginBottom:"0.625rem"},children:"  "}),d.jsx(Se,{name:"removeButton",onClick:()=>u(p),children:Ae})]})]})},E=p=>{var P,j,b,D,R,G,H,X,Y,Z,K,Q,J,tt;return d.jsx(Ce,{children:d.jsxs(nn,{children:[d.jsx(Ee,{...a(`items[${p}].name`,{required:!t}),placeholder:"Item name",defaultValue:e?(j=(P=e==null?void 0:e.items)==null?void 0:P[p])==null?void 0:j.name:"",type:"text",style:{border:Array.isArray(m.items)&&((D=(b=m==null?void 0:m.items)==null?void 0:b[p])!=null&&D.name)?"1px solid #EC5757":""}}),d.jsx(Lt,{...a(`items[${p}].quantity`,{required:!t,max:100}),placeholder:"0",type:"text",style:{border:Array.isArray(m.items)&&((G=(R=m==null?void 0:m.items)==null?void 0:R[p])!=null&&G.quantity)?"1px solid #EC5757":""},defaultValue:e?(X=(H=e==null?void 0:e.items)==null?void 0:H[p])==null?void 0:X.quantity:0}),d.jsx(we,{...a(`items[${p}].price`,{required:!t,max:1e5}),placeholder:"0.00",type:"text",defaultValue:e?(Z=(Y=e==null?void 0:e.items)==null?void 0:Y[p])==null?void 0:Z.price:0,style:{border:Array.isArray(m.items)&&((Q=(K=m==null?void 0:m.items)==null?void 0:K[p])!=null&&Q.price)?"1px solid #EC5757":""}}),d.jsx(De,{children:(Number((J=y==null?void 0:y[p])==null?void 0:J.quantity)*Number((tt=y==null?void 0:y[p])==null?void 0:tt.price)).toFixed(2)}),d.jsx(Se,{name:"removeButton",onClick:()=>u(p),children:Ae})]})})};return d.jsxs(d.Fragment,{children:[d.jsx("ul",{style:{listStyle:"none",marginLeft:"0",paddingLeft:0},children:c.map((p,P)=>d.jsx("li",{"data-testid":"invoice-item",children:d.jsxs("div",{children:[x<600&&w(P),x>=600&&E(P)]})},p.id))}),d.jsx(cn,{append:f,items:e?e.items:[]})]})}ai.propTypes={isDraft:gt.bool.isRequired,isEditOpen:gt.bool};const fn=({className:t})=>d.jsxs(un,{className:t,children:[d.jsx(pt,{children:"Item Name"}),d.jsx(pt,{children:"Qty."}),d.jsx(pt,{children:"Price"}),d.jsx(q,{children:"Total"})]});function Dn({invoice:t,isEditOpen:e=!1}){const{isDraft:i}=lt();return d.jsxs(dn,{"data-testid":"items-container",children:[d.jsx(mn,{children:"Item List"}),d.jsx(fn,{className:"desktop-only-label"}),d.jsx(hn,{children:d.jsx(ai,{isDraft:i,invoice:t,isEditOpen:e})})]})}function pn({isEditOpen:t}){const{formState:{errors:e}}=W(),i=()=>Object.keys(e).find(s=>s!=="myFieldArray"&&s!=="items");return d.jsxs(ji,{children:[d.jsx(kt,{style:{display:(i()||e.items)&&t?"block":"none"},children:"- All fields must be added"}),d.jsx(kt,{style:{display:e.myFieldArray&&t?"block":"none"},children:"- An item must be added"})]})}pn.propTypes={isEditOpen:gt.bool.isRequired};function Sn({invoice:t}){var n,o,r,l,c,u;const e=vt(),{formState:{errors:i},register:s}=W(),{isDraft:a}=lt(),h=d.jsxs(N,{style:{width:e<768?"100%":""},className:"client-country",children:[d.jsx(M,{htmlFor:"clientCountry",style:{color:i.clientCountry?"#EC5757":""},children:"Country"}),d.jsx(Me,{$long:!1,style:{border:i!=null&&i.clientCountry?"1px solid #EC5757":"",width:e<768?"100%":""},type:"text",defaultValue:t?(n=t==null?void 0:t.clientAddress)==null?void 0:n.country:"",...s("clientCountry",{required:!a,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return d.jsxs(d.Fragment,{children:[d.jsxs(N,{className:"client-name",children:[d.jsx(M,{htmlFor:"clientName",style:{color:i.clientName?"#EC5757":""},children:"Client's Name"}),((o=i.clientName)==null?void 0:o.type)==="required"&&d.jsx(Mt,{children:"can't be empty"}),d.jsx(At,{$long:!0,style:{border:i.clientName?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientName:"",...s("clientName",{required:!a})})]}),d.jsxs(N,{className:"client-email",children:[d.jsx(M,{htmlFor:"clientEmail",style:{color:i.clientEmail?"#EC5757":""},children:"Client's Email"}),((r=i.clientEmail)==null?void 0:r.type)==="pattern"&&d.jsx(Mt,{style:{position:"absolute",top:"-8px"},children:"Invalid email"}),d.jsx(At,{$long:!0,style:{border:i.clientEmail?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientEmail:"",...s("clientEmail",{required:!a,pattern:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/})})]}),d.jsxs(N,{className:"client-street-address",children:[d.jsx(M,{htmlFor:"clientStreetAddress",style:{color:i.clientStreetAddress?"#EC5757":""},children:"Street Address"}),d.jsx(Fe,{style:{border:i.clientStreetAddress?"1px solid #EC5757":""},defaultValue:t?(l=t==null?void 0:t.clientAddress)==null?void 0:l.street:"",...s("clientStreetAddress",{required:!a})})]}),d.jsxs(Bt,{children:[d.jsxs(_,{className:"client-city",children:[d.jsx(M,{htmlFor:"clientCity",style:{color:i.clientCity?"#EC5757":""},children:"City"}),d.jsx(xt,{style:{border:i.clientCity?"1px solid #EC5757":""},type:"text",defaultValue:t?(c=t==null?void 0:t.clientAddress)==null?void 0:c.city:"",...s("clientCity",{required:!a,pattern:/[\w ]*/i,maxLength:30})})]}),d.jsxs(_,{className:"client-postal-code",children:[d.jsx(M,{htmlFor:"clientPostalCode",style:{color:i.clientPostalCode?"#EC5757":""},children:"Post Code"}),d.jsx(xt,{style:{border:i.clientPostalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(u=t==null?void 0:t.clientAddress)==null?void 0:u.postCode:"",...s("clientPostalCode",{required:!a,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]}),e<768&&d.jsx(N,{className:"client-country",children:h}),e>=768&&d.jsx(_,{className:"client-country",children:h})]})]})}function An({invoice:t}){const{formState:{errors:e},register:i}=W(),{isDraft:s}=lt();return d.jsx(d.Fragment,{children:d.jsxs(N,{className:"project-description",children:[d.jsx(M,{htmlFor:"projectDescription",style:{color:e.projectDescription?"#EC5757":""},children:"Project Description"}),d.jsx(At,{type:"text",defaultValue:t==null?void 0:t.description,...i("projectDescription",{required:!s}),style:{border:e.projectDescription?"1px solid #EC5757":""}})]})})}const bn=()=>{const{id:t}=fi(),{startDate:e,setIsDraft:i,setIsNewInvoiceOpen:s,selectedPaymentOption:a,setSelectedPaymentOption:h,methods:n}=lt(),{control:o,trigger:r,reset:l,watch:c,setError:u,clearErrors:f,getValues:m}=n,{replace:g}=ke({control:o,name:"items"}),y=c(),[x]=Nt(xi,{refetchQueries:[{query:gi}],onError:j=>{console.error(j)}}),[C]=Nt(Pi,{update:(j,{data:{editInvoice:b}})=>{j.writeQuery({query:vi,variables:{getInvoiceById:b.id},data:{getInvoiceById:b}})},onError:j=>{console.error(j)}}),w=()=>{h(1),l(),f(),s(!1)},E=async j=>{if(console.log("Submitting form"),pi.flushSync(()=>i(!1)),j=m(),!j.items){console.log("No items"),u("items",{type:"custom",message:"An item must be added"});return}if(await r()){const D=Tt(j,e,a);D.items=D.items.map(R=>({...R,quantity:Number(R.quantity),price:Number(R.price)})),D.status="pending";try{await x({variables:{...D}}),w(),g([{id:Ft(),name:"",quantity:0,price:0,total:0}])}catch(R){console.error(R)}}},p=async()=>{console.log("Submitting draft"),f();const j=m();j.items||(j.items=[{id:"",name:"",quantity:0,price:0,total:0}]);const b=Tt(j,e,a);b.status="draft";try{await x({variables:{...b}}),w(),g([{id:Ft(),name:"",quantity:0,price:0,total:0}])}catch(D){console.error(D)}},P=async j=>{if(console.log("Submitting update"),await r()){const D=Tt(j,e,a);D.id=String(t),D.status="pending",console.log(t);try{await C({variables:{...D}}),s(!1)}catch(R){console.error(R)}}};return v.useEffect(()=>{y.items?f("items"):u("items",{type:"custom",message:"An item must be added"})},[y.items,u]),{methods:n,onSubmit:E,onSubmitDraft:p,onSubmitUpdate:P}},Rn=({children:t})=>{const e=vt();let i=700;e<=616?i=e:e<=768?i=616:i=700;const s={hidden:{x:`${-i}px`},visible:{x:"0"},exit:{x:`${-i}px`}};return d.jsxs(d.Fragment,{children:[d.jsx(Te.div,{initial:{opacity:0},animate:{opacity:.5},exit:{opacity:0},transition:{duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#000",zIndex:1e3,cursor:"pointer"}},"overlay"),d.jsx(Te.div,{variants:s,initial:"hidden",animate:"visible",exit:"exit",transition:{type:"tween",duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:`${i}px`,height:"100%",color:"#ecf0f1",padding:"20px",zIndex:1001,boxShadow:"2px 0 5px rgba(0,0,0,0.3)"},children:t},"sidebar")]})};export{Tn as A,En as C,An as D,Dn as E,pn as F,Rn as S,Sn as a,wn as b,_ as c,bn as u};
