import{a as v,T as ti,j as h,U as ve,V as Pe,W as ei,X as Ce,Y as L,Z as I,a0 as Z,a1 as je,a2 as Q,a3 as ot,a4 as z,a5 as we,a6 as ii,a7 as si,a8 as Te,a9 as ni,aa as ct,ab as dt,ac as wt,ad as oi,d as C,b as lt,ae as Pt,l as ri,af as ai,G as li,ag as ci,g as di,ah as hi}from"./index-BWbkvAE2.js";import{P as rt,e as $,c as K,f as ui,g as Ee}from"./InvoiceStatus-CWJt63NW.js";import{L as k,C as De,S as Se,A as at,a as mi,b as Tt,c as Et,I as gt}from"./editPageStyles-DNCNkdgu.js";import{c as ht,v as Dt}from"./utilityFunctions-tWiID03q.js";import{u as St}from"./useMutation-_I7cgxcJ.js";import{i as F,b as Ct,d as pi,e as fi,f as Ae,p as yi,s as gi,m as xi,h as D,j as xt,k as E,l as vi,n as Pi,o as Ci,q as At,r as be,F as Re,t as bt,u as ji,v as Le,w as Ve,x as Be,y as wi,z as Rt,S as Ti,A as Ei,B as O,C as J,D as tt,E as Lt,G as Di,H as Si,I as Ai,J as U,K as bi,c as Ri,g as Li,a as Vi}from"./create-visual-element-BIsVhxay.js";class Bi extends v.Component{getSnapshotBeforeUpdate(e){const i=this.props.childRef.current;if(i&&e.isPresent&&!this.props.isPresent){const s=i.offsetParent,o=s instanceof HTMLElement&&s.offsetWidth||0,u=this.props.sizeRef.current;u.height=i.offsetHeight||0,u.width=i.offsetWidth||0,u.top=i.offsetTop,u.left=i.offsetLeft,u.right=o-u.width-u.left}return null}componentDidUpdate(){}render(){return this.props.children}}function Ii({children:t,isPresent:e,anchorX:i}){const s=v.useId(),o=v.useRef(null),u=v.useRef({width:0,height:0,top:0,left:0,right:0}),{nonce:n}=v.useContext(ti);return v.useInsertionEffect(()=>{const{width:r,height:a,top:l,left:d,right:c}=u.current;if(e||!o.current||!r||!a)return;const m=i==="left"?`left: ${d}`:`right: ${c}`;o.current.dataset.motionPopId=s;const p=document.createElement("style");return n&&(p.nonce=n),document.head.appendChild(p),p.sheet&&p.sheet.insertRule(`
          [data-motion-pop-id="${s}"] {
            position: absolute !important;
            width: ${r}px !important;
            height: ${a}px !important;
            ${m}px !important;
            top: ${l}px !important;
          }
        `),()=>{document.head.removeChild(p)}},[e]),h.jsx(Bi,{isPresent:e,childRef:o,sizeRef:u,children:v.cloneElement(t,{ref:o})})}const ki=({children:t,initial:e,isPresent:i,onExitComplete:s,custom:o,presenceAffectsLayout:u,mode:n,anchorX:r})=>{const a=ve(Mi),l=v.useId(),d=v.useCallback(m=>{a.set(m,!0);for(const p of a.values())if(!p)return;s&&s()},[a,s]),c=v.useMemo(()=>({id:l,initial:e,isPresent:i,custom:o,onExitComplete:d,register:m=>(a.set(m,!1),()=>a.delete(m))}),u?[Math.random(),d]:[i,d]);return v.useMemo(()=>{a.forEach((m,p)=>a.set(p,!1))},[i]),v.useEffect(()=>{!i&&!a.size&&s&&s()},[i]),n==="popLayout"&&(t=h.jsx(Ii,{isPresent:i,anchorX:r,children:t})),h.jsx(Pe.Provider,{value:c,children:t})};function Mi(){return new Map}function Ie(t=!0){const e=v.useContext(Pe);if(e===null)return[!0,null];const{isPresent:i,onExitComplete:s,register:o}=e,u=v.useId();v.useEffect(()=>{t&&o(u)},[t]);const n=v.useCallback(()=>t&&s&&s(u),[u,s,t]);return!i&&s?[!1,n]:[!0]}const et=t=>t.key||"";function Vt(t){const e=[];return v.Children.forEach(t,i=>{v.isValidElement(i)&&e.push(i)}),e}const yn=({children:t,custom:e,initial:i=!0,onExitComplete:s,presenceAffectsLayout:o=!0,mode:u="sync",propagate:n=!1,anchorX:r="left"})=>{const[a,l]=Ie(n),d=v.useMemo(()=>Vt(t),[t]),c=n&&!a?[]:d.map(et),m=v.useRef(!0),p=v.useRef(d),y=ve(()=>new Map),[g,f]=v.useState(d),[x,w]=v.useState(d);ei(()=>{m.current=!1,p.current=d;for(let j=0;j<x.length;j++){const P=et(x[j]);c.includes(P)?y.delete(P):y.get(P)!==!0&&y.set(P,!1)}},[x,c.length,c.join("-")]);const T=[];if(d!==g){let j=[...d];for(let P=0;P<x.length;P++){const b=x[P],R=et(b);c.includes(R)||(j.splice(P,0,b),T.push(b))}return u==="wait"&&T.length&&(j=T),w(Vt(j)),f(d),null}const{forceRender:A}=v.useContext(Ce);return h.jsx(h.Fragment,{children:x.map(j=>{const P=et(j),b=n&&!a?!1:d===x||c.includes(P),R=()=>{if(y.has(P))y.set(P,!0);else return;let M=!0;y.forEach(Je=>{Je||(M=!1)}),M&&(A==null||A(),w(p.current),n&&(l==null||l()),s&&s())};return h.jsx(ki,{isPresent:b,initial:!m.current||i?void 0:!1,custom:e,presenceAffectsLayout:o,mode:u,onExitComplete:b?void 0:R,anchorX:r,children:j},P)})})};function Fi(t){if(typeof Proxy>"u")return t;const e=new Map,i=(...s)=>t(...s);return new Proxy(i,{get:(s,o)=>o==="create"?t:(e.has(o)||e.set(o,t(o)),e.get(o))})}function Ni(t){return t==="x"||t==="y"?F[t]?null:(F[t]=!0,()=>{F[t]=!1}):F.x||F.y?null:(F.x=F.y=!0,()=>{F.x=F.y=!1})}function H(t,e,i,s){return Ct(t,e,pi(i),s)}const Bt=(t,e)=>Math.abs(t-e);function $i(t,e){const i=Bt(t.x,e.x),s=Bt(t.y,e.y);return Math.sqrt(i**2+s**2)}class ke{constructor(e,i,{transformPagePoint:s,contextWindow:o,dragSnapToOrigin:u=!1}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const c=mt(this.lastMoveEventInfo,this.history),m=this.startEvent!==null,p=$i(c.offset,{x:0,y:0})>=3;if(!m&&!p)return;const{point:y}=c,{timestamp:g}=L;this.history.push({...y,timestamp:g});const{onStart:f,onMove:x}=this.handlers;m||(f&&f(this.lastMoveEvent,c),this.startEvent=this.lastMoveEvent),x&&x(this.lastMoveEvent,c)},this.handlePointerMove=(c,m)=>{this.lastMoveEvent=c,this.lastMoveEventInfo=ut(m,this.transformPagePoint),I.update(this.updatePoint,!0)},this.handlePointerUp=(c,m)=>{this.end();const{onEnd:p,onSessionEnd:y,resumeAnimation:g}=this.handlers;if(this.dragSnapToOrigin&&g&&g(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const f=mt(c.type==="pointercancel"?this.lastMoveEventInfo:ut(m,this.transformPagePoint),this.history);this.startEvent&&p&&p(c,f),y&&y(c,f)},!fi(e))return;this.dragSnapToOrigin=u,this.handlers=i,this.transformPagePoint=s,this.contextWindow=o||window;const n=Ae(e),r=ut(n,this.transformPagePoint),{point:a}=r,{timestamp:l}=L;this.history=[{...a,timestamp:l}];const{onSessionStart:d}=i;d&&d(e,mt(r,this.history)),this.removeListeners=yi(H(this.contextWindow,"pointermove",this.handlePointerMove),H(this.contextWindow,"pointerup",this.handlePointerUp),H(this.contextWindow,"pointercancel",this.handlePointerUp))}updateHandlers(e){this.handlers=e}end(){this.removeListeners&&this.removeListeners(),Z(this.updatePoint)}}function ut(t,e){return e?{point:e(t.point)}:t}function It(t,e){return{x:t.x-e.x,y:t.y-e.y}}function mt({point:t},e){return{point:t,delta:It(t,Me(e)),offset:It(t,Oi(e)),velocity:Ui(e,.1)}}function Oi(t){return t[0]}function Me(t){return t[t.length-1]}function Ui(t,e){if(t.length<2)return{x:0,y:0};let i=t.length-1,s=null;const o=Me(t);for(;i>=0&&(s=t[i],!(o.timestamp-s.timestamp>gi(e)));)i--;if(!s)return{x:0,y:0};const u=xi(o.timestamp-s.timestamp);if(u===0)return{x:0,y:0};const n={x:(o.x-s.x)/u,y:(o.y-s.y)/u};return n.x===1/0&&(n.x=0),n.y===1/0&&(n.y=0),n}const Fe=1e-4,qi=1-Fe,zi=1+Fe,Ne=.01,Wi=0-Ne,_i=0+Ne;function S(t){return t.max-t.min}function Gi(t,e,i){return Math.abs(t-e)<=i}function kt(t,e,i,s=.5){t.origin=s,t.originPoint=D(e.min,e.max,t.origin),t.scale=S(i)/S(e),t.translate=D(i.min,i.max,t.origin)-t.originPoint,(t.scale>=qi&&t.scale<=zi||isNaN(t.scale))&&(t.scale=1),(t.translate>=Wi&&t.translate<=_i||isNaN(t.translate))&&(t.translate=0)}function X(t,e,i,s){kt(t.x,e.x,i.x,s?s.originX:void 0),kt(t.y,e.y,i.y,s?s.originY:void 0)}function Mt(t,e,i){t.min=i.min+e.min,t.max=t.min+S(e)}function Hi(t,e,i){Mt(t.x,e.x,i.x),Mt(t.y,e.y,i.y)}function Ft(t,e,i){t.min=e.min-i.min,t.max=t.min+S(e)}function Y(t,e,i){Ft(t.x,e.x,i.x),Ft(t.y,e.y,i.y)}function Xi(t,{min:e,max:i},s){return e!==void 0&&t<e?t=s?D(e,t,s.min):Math.max(t,e):i!==void 0&&t>i&&(t=s?D(i,t,s.max):Math.min(t,i)),t}function Nt(t,e,i){return{min:e!==void 0?t.min+e:void 0,max:i!==void 0?t.max+i-(t.max-t.min):void 0}}function Yi(t,{top:e,left:i,bottom:s,right:o}){return{x:Nt(t.x,i,o),y:Nt(t.y,e,s)}}function $t(t,e){let i=e.min-t.min,s=e.max-t.max;return e.max-e.min<t.max-t.min&&([i,s]=[s,i]),{min:i,max:s}}function Zi(t,e){return{x:$t(t.x,e.x),y:$t(t.y,e.y)}}function Ki(t,e){let i=.5;const s=S(t),o=S(e);return o>s?i=xt(e.min,e.max-s,t.min):s>o&&(i=xt(t.min,t.max-o,e.min)),je(0,1,i)}function Qi(t,e){const i={};return e.min!==void 0&&(i.min=e.min-t.min),e.max!==void 0&&(i.max=e.max-t.min),i}const vt=.35;function Ji(t=vt){return t===!1?t=0:t===!0&&(t=vt),{x:Ot(t,"left","right"),y:Ot(t,"top","bottom")}}function Ot(t,e,i){return{min:Ut(t,e),max:Ut(t,i)}}function Ut(t,e){return typeof t=="number"?t:t[e]||0}function B(t){return[t("x"),t("y")]}const $e=({current:t})=>t?t.ownerDocument.defaultView:null,ts=new WeakMap;class es{constructor(e){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=E(),this.visualElement=e}start(e,{snapToCursor:i=!1}={}){const{presenceContext:s}=this.visualElement;if(s&&s.isPresent===!1)return;const o=d=>{const{dragSnapToOrigin:c}=this.getProps();c?this.pauseAnimation():this.stopAnimation(),i&&this.snapToCursor(Ae(d).point)},u=(d,c)=>{const{drag:m,dragPropagation:p,onDragStart:y}=this.getProps();if(m&&!p&&(this.openDragLock&&this.openDragLock(),this.openDragLock=Ni(m),!this.openDragLock))return;this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),B(f=>{let x=this.getAxisMotionValue(f).get()||0;if(ot.test(x)){const{projection:w}=this.visualElement;if(w&&w.layout){const T=w.layout.layoutBox[f];T&&(x=S(T)*(parseFloat(x)/100))}}this.originPoint[f]=x}),y&&I.postRender(()=>y(d,c)),At(this.visualElement,"transform");const{animationState:g}=this.visualElement;g&&g.setActive("whileDrag",!0)},n=(d,c)=>{const{dragPropagation:m,dragDirectionLock:p,onDirectionLock:y,onDrag:g}=this.getProps();if(!m&&!this.openDragLock)return;const{offset:f}=c;if(p&&this.currentDirection===null){this.currentDirection=is(f),this.currentDirection!==null&&y&&y(this.currentDirection);return}this.updateAxis("x",c.point,f),this.updateAxis("y",c.point,f),this.visualElement.render(),g&&g(d,c)},r=(d,c)=>this.stop(d,c),a=()=>B(d=>{var c;return this.getAnimationState(d)==="paused"&&((c=this.getAxisMotionValue(d).animation)===null||c===void 0?void 0:c.play())}),{dragSnapToOrigin:l}=this.getProps();this.panSession=new ke(e,{onSessionStart:o,onStart:u,onMove:n,onSessionEnd:r,resumeAnimation:a},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:l,contextWindow:$e(this.visualElement)})}stop(e,i){const s=this.isDragging;if(this.cancel(),!s)return;const{velocity:o}=i;this.startAnimation(o);const{onDragEnd:u}=this.getProps();u&&I.postRender(()=>u(e,i))}cancel(){this.isDragging=!1;const{projection:e,animationState:i}=this.visualElement;e&&(e.isAnimationBlocked=!1),this.panSession&&this.panSession.end(),this.panSession=void 0;const{dragPropagation:s}=this.getProps();!s&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),i&&i.setActive("whileDrag",!1)}updateAxis(e,i,s){const{drag:o}=this.getProps();if(!s||!it(e,o,this.currentDirection))return;const u=this.getAxisMotionValue(e);let n=this.originPoint[e]+s[e];this.constraints&&this.constraints[e]&&(n=Xi(n,this.constraints[e],this.elastic[e])),u.set(n)}resolveConstraints(){var e;const{dragConstraints:i,dragElastic:s}=this.getProps(),o=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(e=this.visualElement.projection)===null||e===void 0?void 0:e.layout,u=this.constraints;i&&Q(i)?this.constraints||(this.constraints=this.resolveRefConstraints()):i&&o?this.constraints=Yi(o.layoutBox,i):this.constraints=!1,this.elastic=Ji(s),u!==this.constraints&&o&&this.constraints&&!this.hasMutatedConstraints&&B(n=>{this.constraints!==!1&&this.getAxisMotionValue(n)&&(this.constraints[n]=Qi(o.layoutBox[n],this.constraints[n]))})}resolveRefConstraints(){const{dragConstraints:e,onMeasureDragConstraints:i}=this.getProps();if(!e||!Q(e))return!1;const s=e.current,{projection:o}=this.visualElement;if(!o||!o.layout)return!1;const u=vi(s,o.root,this.visualElement.getTransformPagePoint());let n=Zi(o.layout.layoutBox,u);if(i){const r=i(Pi(n));this.hasMutatedConstraints=!!r,r&&(n=Ci(r))}return n}startAnimation(e){const{drag:i,dragMomentum:s,dragElastic:o,dragTransition:u,dragSnapToOrigin:n,onDragTransitionEnd:r}=this.getProps(),a=this.constraints||{},l=B(d=>{if(!it(d,i,this.currentDirection))return;let c=a&&a[d]||{};n&&(c={min:0,max:0});const m=o?200:1e6,p=o?40:1e7,y={type:"inertia",velocity:s?e[d]:0,bounceStiffness:m,bounceDamping:p,timeConstant:750,restDelta:1,restSpeed:10,...u,...c};return this.startAxisValueAnimation(d,y)});return Promise.all(l).then(r)}startAxisValueAnimation(e,i){const s=this.getAxisMotionValue(e);return At(this.visualElement,e),s.start(be(e,s,0,i,this.visualElement,!1))}stopAnimation(){B(e=>this.getAxisMotionValue(e).stop())}pauseAnimation(){B(e=>{var i;return(i=this.getAxisMotionValue(e).animation)===null||i===void 0?void 0:i.pause()})}getAnimationState(e){var i;return(i=this.getAxisMotionValue(e).animation)===null||i===void 0?void 0:i.state}getAxisMotionValue(e){const i=`_drag${e.toUpperCase()}`,s=this.visualElement.getProps(),o=s[i];return o||this.visualElement.getValue(e,(s.initial?s.initial[e]:void 0)||0)}snapToCursor(e){B(i=>{const{drag:s}=this.getProps();if(!it(i,s,this.currentDirection))return;const{projection:o}=this.visualElement,u=this.getAxisMotionValue(i);if(o&&o.layout){const{min:n,max:r}=o.layout.layoutBox[i];u.set(e[i]-D(n,r,.5))}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:e,dragConstraints:i}=this.getProps(),{projection:s}=this.visualElement;if(!Q(i)||!s||!this.constraints)return;this.stopAnimation();const o={x:0,y:0};B(n=>{const r=this.getAxisMotionValue(n);if(r&&this.constraints!==!1){const a=r.get();o[n]=Ki({min:a,max:a},this.constraints[n])}});const{transformTemplate:u}=this.visualElement.getProps();this.visualElement.current.style.transform=u?u({},""):"none",s.root&&s.root.updateScroll(),s.updateLayout(),this.resolveConstraints(),B(n=>{if(!it(n,e,null))return;const r=this.getAxisMotionValue(n),{min:a,max:l}=this.constraints[n];r.set(D(a,l,o[n]))})}addListeners(){if(!this.visualElement.current)return;ts.set(this.visualElement,this);const e=this.visualElement.current,i=H(e,"pointerdown",a=>{const{drag:l,dragListener:d=!0}=this.getProps();l&&d&&this.start(a)}),s=()=>{const{dragConstraints:a}=this.getProps();Q(a)&&a.current&&(this.constraints=this.resolveRefConstraints())},{projection:o}=this.visualElement,u=o.addEventListener("measure",s);o&&!o.layout&&(o.root&&o.root.updateScroll(),o.updateLayout()),I.read(s);const n=Ct(window,"resize",()=>this.scalePositionWithinConstraints()),r=o.addEventListener("didUpdate",({delta:a,hasLayoutChanged:l})=>{this.isDragging&&l&&(B(d=>{const c=this.getAxisMotionValue(d);c&&(this.originPoint[d]+=a[d].translate,c.set(c.get()+a[d].translate))}),this.visualElement.render())});return()=>{n(),i(),u(),r&&r()}}getProps(){const e=this.visualElement.getProps(),{drag:i=!1,dragDirectionLock:s=!1,dragPropagation:o=!1,dragConstraints:u=!1,dragElastic:n=vt,dragMomentum:r=!0}=e;return{...e,drag:i,dragDirectionLock:s,dragPropagation:o,dragConstraints:u,dragElastic:n,dragMomentum:r}}}function it(t,e,i){return(e===!0||e===t)&&(i===null||i===t)}function is(t,e=10){let i=null;return Math.abs(t.y)>e?i="y":Math.abs(t.x)>e&&(i="x"),i}class ss extends Re{constructor(e){super(e),this.removeGroupControls=z,this.removeListeners=z,this.controls=new es(e)}mount(){const{dragControls:e}=this.node.getProps();e&&(this.removeGroupControls=e.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||z}unmount(){this.removeGroupControls(),this.removeListeners()}}const qt=t=>(e,i)=>{t&&I.postRender(()=>t(e,i))};class ns extends Re{constructor(){super(...arguments),this.removePointerDownListener=z}onPointerDown(e){this.session=new ke(e,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:$e(this.node)})}createPanHandlers(){const{onPanSessionStart:e,onPanStart:i,onPan:s,onPanEnd:o}=this.node.getProps();return{onSessionStart:qt(e),onStart:qt(i),onMove:s,onEnd:(u,n)=>{delete this.session,o&&I.postRender(()=>o(u,n))}}}mount(){this.removePointerDownListener=H(this.node.current,"pointerdown",e=>this.onPointerDown(e))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}const st={hasAnimatedSinceResize:!0,hasEverUpdated:!1};function zt(t,e){return e.max===e.min?0:t/(e.max-e.min)*100}const _={correct:(t,e)=>{if(!e.target)return t;if(typeof t=="string")if(we.test(t))t=parseFloat(t);else return t;const i=zt(t,e.target.x),s=zt(t,e.target.y);return`${i}% ${s}%`}},os={correct:(t,{treeScale:e,projectionDelta:i})=>{const s=t,o=bt.parse(t);if(o.length>5)return s;const u=bt.createTransformer(t),n=typeof o[0]!="number"?1:0,r=i.x.scale*e.x,a=i.y.scale*e.y;o[0+n]/=r,o[1+n]/=a;const l=D(r,a,.5);return typeof o[2+n]=="number"&&(o[2+n]/=l),typeof o[3+n]=="number"&&(o[3+n]/=l),u(o)}};class rs extends v.Component{componentDidMount(){const{visualElement:e,layoutGroup:i,switchLayoutGroup:s,layoutId:o}=this.props,{projection:u}=e;si(as),u&&(i.group&&i.group.add(u),s&&s.register&&o&&s.register(u),u.root.didUpdate(),u.addEventListener("animationComplete",()=>{this.safeToRemove()}),u.setOptions({...u.options,onExitComplete:()=>this.safeToRemove()})),st.hasEverUpdated=!0}getSnapshotBeforeUpdate(e){const{layoutDependency:i,visualElement:s,drag:o,isPresent:u}=this.props,n=s.projection;return n&&(n.isPresent=u,o||e.layoutDependency!==i||i===void 0?n.willUpdate():this.safeToRemove(),e.isPresent!==u&&(u?n.promote():n.relegate()||I.postRender(()=>{const r=n.getStack();(!r||!r.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{projection:e}=this.props.visualElement;e&&(e.root.didUpdate(),Te.postRender(()=>{!e.currentAnimation&&e.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:e,layoutGroup:i,switchLayoutGroup:s}=this.props,{projection:o}=e;o&&(o.scheduleCheckAfterUnmount(),i&&i.group&&i.group.remove(o),s&&s.deregister&&s.deregister(o))}safeToRemove(){const{safeToRemove:e}=this.props;e&&e()}render(){return null}}function Oe(t){const[e,i]=Ie(),s=v.useContext(Ce);return h.jsx(rs,{...t,layoutGroup:s,switchLayoutGroup:v.useContext(ii),isPresent:e,safeToRemove:i})}const as={borderRadius:{..._,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:_,borderTopRightRadius:_,borderBottomLeftRadius:_,borderBottomRightRadius:_,boxShadow:os};function ls(t,e,i){const s=ni(t)?t:ji(t);return s.start(be("",s,e,i)),s.animation}function cs(t){return t instanceof SVGElement&&t.tagName!=="svg"}const ds=(t,e)=>t.depth-e.depth;class hs{constructor(){this.children=[],this.isDirty=!1}add(e){Le(this.children,e),this.isDirty=!0}remove(e){Ve(this.children,e),this.isDirty=!0}forEach(e){this.isDirty&&this.children.sort(ds),this.isDirty=!1,this.children.forEach(e)}}function us(t,e){const i=Be.now(),s=({timestamp:o})=>{const u=o-i;u>=e&&(Z(s),t(u-e))};return I.read(s,!0),()=>Z(s)}const Ue=["TopLeft","TopRight","BottomLeft","BottomRight"],ms=Ue.length,Wt=t=>typeof t=="string"?parseFloat(t):t,_t=t=>typeof t=="number"||we.test(t);function ps(t,e,i,s,o,u){o?(t.opacity=D(0,i.opacity!==void 0?i.opacity:1,fs(s)),t.opacityExit=D(e.opacity!==void 0?e.opacity:1,0,ys(s))):u&&(t.opacity=D(e.opacity!==void 0?e.opacity:1,i.opacity!==void 0?i.opacity:1,s));for(let n=0;n<ms;n++){const r=`border${Ue[n]}Radius`;let a=Gt(e,r),l=Gt(i,r);if(a===void 0&&l===void 0)continue;a||(a=0),l||(l=0),a===0||l===0||_t(a)===_t(l)?(t[r]=Math.max(D(Wt(a),Wt(l),s),0),(ot.test(l)||ot.test(a))&&(t[r]+="%")):t[r]=l}(e.rotate||i.rotate)&&(t.rotate=D(e.rotate||0,i.rotate||0,s))}function Gt(t,e){return t[e]!==void 0?t[e]:t.borderRadius}const fs=qe(0,.5,wi),ys=qe(.5,.95,z);function qe(t,e,i){return s=>s<t?0:s>e?1:i(xt(t,e,s))}function Ht(t,e){t.min=e.min,t.max=e.max}function V(t,e){Ht(t.x,e.x),Ht(t.y,e.y)}function Xt(t,e){t.translate=e.translate,t.scale=e.scale,t.originPoint=e.originPoint,t.origin=e.origin}function Yt(t,e,i,s,o){return t-=e,t=Rt(t,1/i,s),o!==void 0&&(t=Rt(t,1/o,s)),t}function gs(t,e=0,i=1,s=.5,o,u=t,n=t){if(ot.test(e)&&(e=parseFloat(e),e=D(n.min,n.max,e/100)-n.min),typeof e!="number")return;let r=D(u.min,u.max,s);t===u&&(r-=e),t.min=Yt(t.min,e,i,r,o),t.max=Yt(t.max,e,i,r,o)}function Zt(t,e,[i,s,o],u,n){gs(t,e[i],e[s],e[o],e.scale,u,n)}const xs=["x","scaleX","originX"],vs=["y","scaleY","originY"];function Kt(t,e,i,s){Zt(t.x,e,xs,i?i.x:void 0,s?s.x:void 0),Zt(t.y,e,vs,i?i.y:void 0,s?s.y:void 0)}function Qt(t){return t.translate===0&&t.scale===1}function ze(t){return Qt(t.x)&&Qt(t.y)}function Jt(t,e){return t.min===e.min&&t.max===e.max}function Ps(t,e){return Jt(t.x,e.x)&&Jt(t.y,e.y)}function te(t,e){return Math.round(t.min)===Math.round(e.min)&&Math.round(t.max)===Math.round(e.max)}function We(t,e){return te(t.x,e.x)&&te(t.y,e.y)}function ee(t){return S(t.x)/S(t.y)}function ie(t,e){return t.translate===e.translate&&t.scale===e.scale&&t.originPoint===e.originPoint}class Cs{constructor(){this.members=[]}add(e){Le(this.members,e),e.scheduleRender()}remove(e){if(Ve(this.members,e),e===this.prevLead&&(this.prevLead=void 0),e===this.lead){const i=this.members[this.members.length-1];i&&this.promote(i)}}relegate(e){const i=this.members.findIndex(o=>e===o);if(i===0)return!1;let s;for(let o=i;o>=0;o--){const u=this.members[o];if(u.isPresent!==!1){s=u;break}}return s?(this.promote(s),!0):!1}promote(e,i){const s=this.lead;if(e!==s&&(this.prevLead=s,this.lead=e,e.show(),s)){s.instance&&s.scheduleRender(),e.scheduleRender(),e.resumeFrom=s,i&&(e.resumeFrom.preserveOpacity=!0),s.snapshot&&(e.snapshot=s.snapshot,e.snapshot.latestValues=s.animationValues||s.latestValues),e.root&&e.root.isUpdating&&(e.isLayoutDirty=!0);const{crossfade:o}=e.options;o===!1&&s.hide()}}exitAnimationComplete(){this.members.forEach(e=>{const{options:i,resumingFrom:s}=e;i.onExitComplete&&i.onExitComplete(),s&&s.options.onExitComplete&&s.options.onExitComplete()})}scheduleRender(){this.members.forEach(e=>{e.instance&&e.scheduleRender(!1)})}removeLeadSnapshot(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)}}function js(t,e,i){let s="";const o=t.x.translate/e.x,u=t.y.translate/e.y,n=(i==null?void 0:i.z)||0;if((o||u||n)&&(s=`translate3d(${o}px, ${u}px, ${n}px) `),(e.x!==1||e.y!==1)&&(s+=`scale(${1/e.x}, ${1/e.y}) `),i){const{transformPerspective:l,rotate:d,rotateX:c,rotateY:m,skewX:p,skewY:y}=i;l&&(s=`perspective(${l}px) ${s}`),d&&(s+=`rotate(${d}deg) `),c&&(s+=`rotateX(${c}deg) `),m&&(s+=`rotateY(${m}deg) `),p&&(s+=`skewX(${p}deg) `),y&&(s+=`skewY(${y}deg) `)}const r=t.x.scale*e.x,a=t.y.scale*e.y;return(r!==1||a!==1)&&(s+=`scale(${r}, ${a})`),s||"none"}const pt=["","X","Y","Z"],ws={visibility:"hidden"},se=1e3;let Ts=0;function ft(t,e,i,s){const{latestValues:o}=e;o[t]&&(i[t]=o[t],e.setStaticValue(t,0),s&&(s[t]=0))}function _e(t){if(t.hasCheckedOptimisedAppear=!0,t.root===t)return;const{visualElement:e}=t.options;if(!e)return;const i=bi(e);if(window.MotionHasOptimisedAnimation(i,"transform")){const{layout:o,layoutId:u}=t.options;window.MotionCancelOptimisedAnimation(i,"transform",I,!(o||u))}const{parent:s}=t;s&&!s.hasCheckedOptimisedAppear&&_e(s)}function Ge({attachResizeListener:t,defaultParent:e,measureScroll:i,checkIsScrollRoot:s,resetTransform:o}){return class{constructor(n={},r=e==null?void 0:e()){this.id=Ts++,this.animationId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(Ss),this.nodes.forEach(Vs),this.nodes.forEach(Bs),this.nodes.forEach(As)},this.resolvedRelativeTargetAt=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=n,this.root=r?r.root||r:this,this.path=r?[...r.path,r]:[],this.parent=r,this.depth=r?r.depth+1:0;for(let a=0;a<this.path.length;a++)this.path[a].shouldResetTransform=!0;this.root===this&&(this.nodes=new hs)}addEventListener(n,r){return this.eventHandlers.has(n)||this.eventHandlers.set(n,new Ti),this.eventHandlers.get(n).add(r)}notifyListeners(n,...r){const a=this.eventHandlers.get(n);a&&a.notify(...r)}hasListeners(n){return this.eventHandlers.has(n)}mount(n,r=this.root.hasTreeAnimated){if(this.instance)return;this.isSVG=cs(n),this.instance=n;const{layoutId:a,layout:l,visualElement:d}=this.options;if(d&&!d.current&&d.mount(n),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),r&&(l||a)&&(this.isLayoutDirty=!0),t){let c;const m=()=>this.root.updateBlockedByResize=!1;t(n,()=>{this.root.updateBlockedByResize=!0,c&&c(),c=us(m,250),st.hasAnimatedSinceResize&&(st.hasAnimatedSinceResize=!1,this.nodes.forEach(oe))})}a&&this.root.registerSharedNode(a,this),this.options.animate!==!1&&d&&(a||l)&&this.addEventListener("didUpdate",({delta:c,hasLayoutChanged:m,hasRelativeLayoutChanged:p,layout:y})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const g=this.options.transition||d.getDefaultTransition()||Ns,{onLayoutAnimationStart:f,onLayoutAnimationComplete:x}=d.getProps(),w=!this.targetLayout||!We(this.targetLayout,y),T=!m&&p;if(this.options.layoutRoot||this.resumeFrom||T||m&&(w||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0),this.setAnimationOrigin(c,T);const A={...Ei(g,"layout"),onPlay:f,onComplete:x};(d.shouldReduceMotion||this.options.layoutRoot)&&(A.delay=0,A.type=!1),this.startAnimation(A)}else m||oe(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=y})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const n=this.getStack();n&&n.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,Z(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(Is),this.animationId++)}getTransformTemplate(){const{visualElement:n}=this.options;return n&&n.getProps().transformTemplate}willUpdate(n=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&_e(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let d=0;d<this.path.length;d++){const c=this.path[d];c.shouldResetTransform=!0,c.updateScroll("snapshot"),c.options.layoutRoot&&c.willUpdate(!1)}const{layoutId:r,layout:a}=this.options;if(r===void 0&&!a)return;const l=this.getTransformTemplate();this.prevTransformTemplateValue=l?l(this.latestValues,""):void 0,this.updateSnapshot(),n&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(ne);return}this.isUpdating||this.nodes.forEach(Rs),this.isUpdating=!1,this.nodes.forEach(Ls),this.nodes.forEach(Es),this.nodes.forEach(Ds),this.clearAllSnapshots();const r=Be.now();L.delta=je(0,1e3/60,r-L.timestamp),L.timestamp=r,L.isProcessing=!0,ct.update.process(L),ct.preRender.process(L),ct.render.process(L),L.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,Te.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(bs),this.sharedNodes.forEach(ks)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,I.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){I.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!S(this.snapshot.measuredBox.x)&&!S(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let a=0;a<this.path.length;a++)this.path[a].updateScroll();const n=this.layout;this.layout=this.measure(!1),this.layoutCorrected=E(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:r}=this.options;r&&r.notify("LayoutMeasure",this.layout.layoutBox,n?n.layoutBox:void 0)}updateScroll(n="measure"){let r=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===n&&(r=!1),r){const a=s(this.instance);this.scroll={animationId:this.root.animationId,phase:n,isRoot:a,offset:i(this.instance),wasRoot:this.scroll?this.scroll.isRoot:a}}}resetTransform(){if(!o)return;const n=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,r=this.projectionDelta&&!ze(this.projectionDelta),a=this.getTransformTemplate(),l=a?a(this.latestValues,""):void 0,d=l!==this.prevTransformTemplateValue;n&&(r||O(this.latestValues)||d)&&(o(this.instance,l),this.shouldResetTransform=!1,this.scheduleRender())}measure(n=!0){const r=this.measurePageBox();let a=this.removeElementScroll(r);return n&&(a=this.removeTransform(a)),$s(a),{animationId:this.root.animationId,measuredBox:r,layoutBox:a,latestValues:{},source:this.id}}measurePageBox(){var n;const{visualElement:r}=this.options;if(!r)return E();const a=r.measureViewportBox();if(!(((n=this.scroll)===null||n===void 0?void 0:n.wasRoot)||this.path.some(Os))){const{scroll:d}=this.root;d&&(J(a.x,d.offset.x),J(a.y,d.offset.y))}return a}removeElementScroll(n){var r;const a=E();if(V(a,n),!((r=this.scroll)===null||r===void 0)&&r.wasRoot)return a;for(let l=0;l<this.path.length;l++){const d=this.path[l],{scroll:c,options:m}=d;d!==this.root&&c&&m.layoutScroll&&(c.wasRoot&&V(a,n),J(a.x,c.offset.x),J(a.y,c.offset.y))}return a}applyTransform(n,r=!1){const a=E();V(a,n);for(let l=0;l<this.path.length;l++){const d=this.path[l];!r&&d.options.layoutScroll&&d.scroll&&d!==d.root&&tt(a,{x:-d.scroll.offset.x,y:-d.scroll.offset.y}),O(d.latestValues)&&tt(a,d.latestValues)}return O(this.latestValues)&&tt(a,this.latestValues),a}removeTransform(n){const r=E();V(r,n);for(let a=0;a<this.path.length;a++){const l=this.path[a];if(!l.instance||!O(l.latestValues))continue;Lt(l.latestValues)&&l.updateSnapshot();const d=E(),c=l.measurePageBox();V(d,c),Kt(r,l.latestValues,l.snapshot?l.snapshot.layoutBox:void 0,d)}return O(this.latestValues)&&Kt(r,this.latestValues),r}setTargetDelta(n){this.targetDelta=n,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(n){this.options={...this.options,...n,crossfade:n.crossfade!==void 0?n.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==L.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(n=!1){var r;const a=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=a.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=a.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=a.isSharedProjectionDirty);const l=!!this.resumingFrom||this!==a;if(!(n||l&&this.isSharedProjectionDirty||this.isProjectionDirty||!((r=this.parent)===null||r===void 0)&&r.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:c,layoutId:m}=this.options;if(!(!this.layout||!(c||m))){if(this.resolvedRelativeTargetAt=L.timestamp,!this.targetDelta&&!this.relativeTarget){const p=this.getClosestProjectingParent();p&&p.layout&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=E(),this.relativeTargetOrigin=E(),Y(this.relativeTargetOrigin,this.layout.layoutBox,p.layout.layoutBox),V(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}if(!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=E(),this.targetWithTransforms=E()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),Hi(this.target,this.relativeTarget,this.relativeParent.target)):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.layoutBox):V(this.target,this.layout.layoutBox),Di(this.target,this.targetDelta)):V(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget)){this.attemptToResolveRelativeTarget=!1;const p=this.getClosestProjectingParent();p&&!!p.resumingFrom==!!this.resumingFrom&&!p.options.layoutScroll&&p.target&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=E(),this.relativeTargetOrigin=E(),Y(this.relativeTargetOrigin,this.target,p.target),V(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}}}getClosestProjectingParent(){if(!(!this.parent||Lt(this.parent.latestValues)||Si(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}calcProjection(){var n;const r=this.getLead(),a=!!this.resumingFrom||this!==r;let l=!0;if((this.isProjectionDirty||!((n=this.parent)===null||n===void 0)&&n.isProjectionDirty)&&(l=!1),a&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(l=!1),this.resolvedRelativeTargetAt===L.timestamp&&(l=!1),l)return;const{layout:d,layoutId:c}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(d||c))return;V(this.layoutCorrected,this.layout.layoutBox);const m=this.treeScale.x,p=this.treeScale.y;Ai(this.layoutCorrected,this.treeScale,this.path,a),r.layout&&!r.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(r.target=r.layout.layoutBox,r.targetWithTransforms=E());const{target:y}=r;if(!y){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(Xt(this.prevProjectionDelta.x,this.projectionDelta.x),Xt(this.prevProjectionDelta.y,this.projectionDelta.y)),X(this.projectionDelta,this.layoutCorrected,y,this.latestValues),(this.treeScale.x!==m||this.treeScale.y!==p||!ie(this.projectionDelta.x,this.prevProjectionDelta.x)||!ie(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",y))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(n=!0){var r;if((r=this.options.visualElement)===null||r===void 0||r.scheduleRender(),n){const a=this.getStack();a&&a.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=U(),this.projectionDelta=U(),this.projectionDeltaWithTransform=U()}setAnimationOrigin(n,r=!1){const a=this.snapshot,l=a?a.latestValues:{},d={...this.latestValues},c=U();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!r;const m=E(),p=a?a.source:void 0,y=this.layout?this.layout.source:void 0,g=p!==y,f=this.getStack(),x=!f||f.members.length<=1,w=!!(g&&!x&&this.options.crossfade===!0&&!this.path.some(Fs));this.animationProgress=0;let T;this.mixTargetDelta=A=>{const j=A/1e3;re(c.x,n.x,j),re(c.y,n.y,j),this.setTargetDelta(c),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(Y(m,this.layout.layoutBox,this.relativeParent.layout.layoutBox),Ms(this.relativeTarget,this.relativeTargetOrigin,m,j),T&&Ps(this.relativeTarget,T)&&(this.isProjectionDirty=!1),T||(T=E()),V(T,this.relativeTarget)),g&&(this.animationValues=d,ps(d,l,this.latestValues,j,w,x)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=j},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(n){this.notifyListeners("animationStart"),this.currentAnimation&&this.currentAnimation.stop(),this.resumingFrom&&this.resumingFrom.currentAnimation&&this.resumingFrom.currentAnimation.stop(),this.pendingAnimation&&(Z(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=I.update(()=>{st.hasAnimatedSinceResize=!0,this.currentAnimation=ls(0,se,{...n,onUpdate:r=>{this.mixTargetDelta(r),n.onUpdate&&n.onUpdate(r)},onStop:()=>{},onComplete:()=>{n.onComplete&&n.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const n=this.getStack();n&&n.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(se),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const n=this.getLead();let{targetWithTransforms:r,target:a,layout:l,latestValues:d}=n;if(!(!r||!a||!l)){if(this!==n&&this.layout&&l&&He(this.options.animationType,this.layout.layoutBox,l.layoutBox)){a=this.target||E();const c=S(this.layout.layoutBox.x);a.x.min=n.target.x.min,a.x.max=a.x.min+c;const m=S(this.layout.layoutBox.y);a.y.min=n.target.y.min,a.y.max=a.y.min+m}V(r,a),tt(r,d),X(this.projectionDeltaWithTransform,this.layoutCorrected,r,d)}}registerSharedNode(n,r){this.sharedNodes.has(n)||this.sharedNodes.set(n,new Cs),this.sharedNodes.get(n).add(r);const l=r.options.initialPromotionConfig;r.promote({transition:l?l.transition:void 0,preserveFollowOpacity:l&&l.shouldPreserveFollowOpacity?l.shouldPreserveFollowOpacity(r):void 0})}isLead(){const n=this.getStack();return n?n.lead===this:!0}getLead(){var n;const{layoutId:r}=this.options;return r?((n=this.getStack())===null||n===void 0?void 0:n.lead)||this:this}getPrevLead(){var n;const{layoutId:r}=this.options;return r?(n=this.getStack())===null||n===void 0?void 0:n.prevLead:void 0}getStack(){const{layoutId:n}=this.options;if(n)return this.root.sharedNodes.get(n)}promote({needsReset:n,transition:r,preserveFollowOpacity:a}={}){const l=this.getStack();l&&l.promote(this,a),n&&(this.projectionDelta=void 0,this.needsReset=!0),r&&this.setOptions({transition:r})}relegate(){const n=this.getStack();return n?n.relegate(this):!1}resetSkewAndRotation(){const{visualElement:n}=this.options;if(!n)return;let r=!1;const{latestValues:a}=n;if((a.z||a.rotate||a.rotateX||a.rotateY||a.rotateZ||a.skewX||a.skewY)&&(r=!0),!r)return;const l={};a.z&&ft("z",n,l,this.animationValues);for(let d=0;d<pt.length;d++)ft(`rotate${pt[d]}`,n,l,this.animationValues),ft(`skew${pt[d]}`,n,l,this.animationValues);n.render();for(const d in l)n.setStaticValue(d,l[d]),this.animationValues&&(this.animationValues[d]=l[d]);n.scheduleRender()}getProjectionStyles(n){var r,a;if(!this.instance||this.isSVG)return;if(!this.isVisible)return ws;const l={visibility:""},d=this.getTransformTemplate();if(this.needsReset)return this.needsReset=!1,l.opacity="",l.pointerEvents=dt(n==null?void 0:n.pointerEvents)||"",l.transform=d?d(this.latestValues,""):"none",l;const c=this.getLead();if(!this.projectionDelta||!this.layout||!c.target){const g={};return this.options.layoutId&&(g.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,g.pointerEvents=dt(n==null?void 0:n.pointerEvents)||""),this.hasProjected&&!O(this.latestValues)&&(g.transform=d?d({},""):"none",this.hasProjected=!1),g}const m=c.animationValues||c.latestValues;this.applyTransformsToTarget(),l.transform=js(this.projectionDeltaWithTransform,this.treeScale,m),d&&(l.transform=d(m,l.transform));const{x:p,y}=this.projectionDelta;l.transformOrigin=`${p.origin*100}% ${y.origin*100}% 0`,c.animationValues?l.opacity=c===this?(a=(r=m.opacity)!==null&&r!==void 0?r:this.latestValues.opacity)!==null&&a!==void 0?a:1:this.preserveOpacity?this.latestValues.opacity:m.opacityExit:l.opacity=c===this?m.opacity!==void 0?m.opacity:"":m.opacityExit!==void 0?m.opacityExit:0;for(const g in wt){if(m[g]===void 0)continue;const{correct:f,applyTo:x,isCSSVariable:w}=wt[g],T=l.transform==="none"?m[g]:f(m[g],c);if(x){const A=x.length;for(let j=0;j<A;j++)l[x[j]]=T}else w?this.options.visualElement.renderState.vars[g]=T:l[g]=T}return this.options.layoutId&&(l.pointerEvents=c===this?dt(n==null?void 0:n.pointerEvents)||"":"none"),l}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(n=>{var r;return(r=n.currentAnimation)===null||r===void 0?void 0:r.stop()}),this.root.nodes.forEach(ne),this.root.sharedNodes.clear()}}}function Es(t){t.updateLayout()}function Ds(t){var e;const i=((e=t.resumeFrom)===null||e===void 0?void 0:e.snapshot)||t.snapshot;if(t.isLead()&&t.layout&&i&&t.hasListeners("didUpdate")){const{layoutBox:s,measuredBox:o}=t.layout,{animationType:u}=t.options,n=i.source!==t.layout.source;u==="size"?B(c=>{const m=n?i.measuredBox[c]:i.layoutBox[c],p=S(m);m.min=s[c].min,m.max=m.min+p}):He(u,i.layoutBox,s)&&B(c=>{const m=n?i.measuredBox[c]:i.layoutBox[c],p=S(s[c]);m.max=m.min+p,t.relativeTarget&&!t.currentAnimation&&(t.isProjectionDirty=!0,t.relativeTarget[c].max=t.relativeTarget[c].min+p)});const r=U();X(r,s,i.layoutBox);const a=U();n?X(a,t.applyTransform(o,!0),i.measuredBox):X(a,s,i.layoutBox);const l=!ze(r);let d=!1;if(!t.resumeFrom){const c=t.getClosestProjectingParent();if(c&&!c.resumeFrom){const{snapshot:m,layout:p}=c;if(m&&p){const y=E();Y(y,i.layoutBox,m.layoutBox);const g=E();Y(g,s,p.layoutBox),We(y,g)||(d=!0),c.options.layoutRoot&&(t.relativeTarget=g,t.relativeTargetOrigin=y,t.relativeParent=c)}}}t.notifyListeners("didUpdate",{layout:s,snapshot:i,delta:a,layoutDelta:r,hasLayoutChanged:l,hasRelativeLayoutChanged:d})}else if(t.isLead()){const{onExitComplete:s}=t.options;s&&s()}t.options.transition=void 0}function Ss(t){t.parent&&(t.isProjecting()||(t.isProjectionDirty=t.parent.isProjectionDirty),t.isSharedProjectionDirty||(t.isSharedProjectionDirty=!!(t.isProjectionDirty||t.parent.isProjectionDirty||t.parent.isSharedProjectionDirty)),t.isTransformDirty||(t.isTransformDirty=t.parent.isTransformDirty))}function As(t){t.isProjectionDirty=t.isSharedProjectionDirty=t.isTransformDirty=!1}function bs(t){t.clearSnapshot()}function ne(t){t.clearMeasurements()}function Rs(t){t.isLayoutDirty=!1}function Ls(t){const{visualElement:e}=t.options;e&&e.getProps().onBeforeLayoutMeasure&&e.notify("BeforeLayoutMeasure"),t.resetTransform()}function oe(t){t.finishAnimation(),t.targetDelta=t.relativeTarget=t.target=void 0,t.isProjectionDirty=!0}function Vs(t){t.resolveTargetDelta()}function Bs(t){t.calcProjection()}function Is(t){t.resetSkewAndRotation()}function ks(t){t.removeLeadSnapshot()}function re(t,e,i){t.translate=D(e.translate,0,i),t.scale=D(e.scale,1,i),t.origin=e.origin,t.originPoint=e.originPoint}function ae(t,e,i,s){t.min=D(e.min,i.min,s),t.max=D(e.max,i.max,s)}function Ms(t,e,i,s){ae(t.x,e.x,i.x,s),ae(t.y,e.y,i.y,s)}function Fs(t){return t.animationValues&&t.animationValues.opacityExit!==void 0}const Ns={duration:.45,ease:[.4,0,.1,1]},le=t=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(t),ce=le("applewebkit/")&&!le("chrome/")?Math.round:z;function de(t){t.min=ce(t.min),t.max=ce(t.max)}function $s(t){de(t.x),de(t.y)}function He(t,e,i){return t==="position"||t==="preserve-aspect"&&!Gi(ee(e),ee(i),.2)}function Os(t){var e;return t!==t.root&&((e=t.scroll)===null||e===void 0?void 0:e.wasRoot)}const Us=Ge({attachResizeListener:(t,e)=>Ct(t,"resize",e),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}),checkIsScrollRoot:()=>!0}),yt={current:void 0},Xe=Ge({measureScroll:t=>({x:t.scrollLeft,y:t.scrollTop}),defaultParent:()=>{if(!yt.current){const t=new Us({});t.mount(window),t.setOptions({layoutScroll:!0}),yt.current=t}return yt.current},resetTransform:(t,e)=>{t.style.transform=e!==void 0?e:"none"},checkIsScrollRoot:t=>window.getComputedStyle(t).position==="fixed"}),qs={pan:{Feature:ns},drag:{Feature:ss,ProjectionNode:Xe,MeasureLayout:Oe}},zs={layout:{ProjectionNode:Xe,MeasureLayout:Oe}},Ws=oi({...Vi,...Li,...qs,...zs},Ri),he=Fi(Ws),_s=C.div`
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
`,Gs=C(_s)`
  width: 100%;

  @media (min-width: 768px) {
    width: 45%;
    max-width: fit-content;
  }
`,Ye=C.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  font-style: ${({theme:t})=>t.font};
  width: 100%;
  z-index: 12;
`;function N({className:t,children:e,style:i}){const s=()=>{};return h.jsx(Ye,{onChange:s,className:t,style:i,children:e})}function W({className:t,isLongOnMobile:e,children:i,style:s}){return e?h.jsx(Gs,{className:t,style:{...s},children:i}):h.jsx(Ye,{className:t,children:i})}const Hs=C.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  max-width: 100vw;

  @media (min-width: 768px) {
    flex-wrap: nowrap;
    max-width: 100%;
  }
`;function jt({children:t}){return h.jsx(Hs,{className:"address-box",children:t})}jt.propTypes={children:rt.node.isRequired};const Xs=C.div`
  display: contents;
  width: 100%;
  justify-content: space-between;

  @media (min-width: 350px) {
    display: flex;
  }
  @media (min-width: 600px) {
    display: contents;
  }
`;function xn({invoice:t}){var n,r,a,l;const e=lt(),{formState:{errors:i},register:s}=$(),{isDraft:o}=K(),u=h.jsxs(N,{style:{width:e<768?"100%":""},className:"company-country",children:[h.jsx(k,{htmlFor:"CompanyCountry",style:{color:i!=null&&i.country?"#EC5757":""},children:"Country"}),h.jsx(De,{id:"CompanyCountry",type:"text",style:{border:i!=null&&i.country?"1px solid #EC5757":"",width:e<768?"100%":""},defaultValue:t?(n=t==null?void 0:t.senderAddress)==null?void 0:n.country:"",...s("country",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return h.jsxs(h.Fragment,{children:[h.jsxs(N,{className:"company-street-address",children:[h.jsx(k,{htmlFor:"streetAddress",style:{color:i!=null&&i.streetAddress?"#EC5757":""},children:"Street Address"}),h.jsx(Se,{id:"streetAddress",style:{border:i!=null&&i.streetAddress?"1px solid #EC5757":""},defaultValue:t?(r=t==null?void 0:t.senderAddress)==null?void 0:r.street:"",...s("streetAddress",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:50})})]}),h.jsxs(jt,{children:[h.jsxs(Xs,{children:[h.jsxs(W,{className:"company-city",children:[h.jsx(k,{htmlFor:"companyCity",style:{color:i!=null&&i.city?"#EC5757":""},children:"City"}),h.jsx(at,{id:"companyCity",style:{border:i!=null&&i.city?"1px solid #EC5757":""},defaultValue:t?(a=t==null?void 0:t.senderAddress)==null?void 0:a.city:"",type:"text",...s("city",{required:!o,pattern:/[\w ]*/i,maxLength:30})})]}),h.jsxs(W,{style:{justifySelf:"flex-end"},className:"company-postal-code",children:[h.jsx(k,{htmlFor:"CompanyPostalCode",style:{color:i!=null&&i.postalCode?"#EC5757":""},children:"Post Code"}),h.jsx(at,{id:"CompanyPostalCode",style:{border:i!=null&&i.postalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(l=t==null?void 0:t.senderAddress)==null?void 0:l.postCode:"",...s("postalCode",{required:!o,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]})]}),e<768&&h.jsx(N,{className:"company-country-container",children:u}),e>=768&&h.jsx(W,{className:"company-country-container",children:u})]})]})}const ue=C.div`
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
`,Ze=C.input`
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
`,Ys=C(Ze)`
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
`,Ke=C(Ze).attrs({pattern:"\\d+"})`
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
`,Zs=C(Ke).attrs({pattern:"[0-9.]*"})`
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
`,me=C.p`
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
`;C.div`
  display: none;

  @media (min-width: 600px) {
    display: contents;
  }
`;C.p`
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
`;const Ks=C.div`
  display: grid;
  grid-template: 1fr / 220px 62px 116px 61px 49px;
`,pe=C.svg`
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
`,G=C.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: fit-content;
  width: fit-content;
`,Qs=C(G)`
  text-align: right;

  @media (min-width: 325px) {
    align-items: flex-start;
    text-align: initial;
  }
`,Js=C.div`
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
`,fe=h.jsx("path",{d:"M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z",fillRule:"nonzero",className:"deleteIconPath",tabIndex:0}),tn=C.button`
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
`,vn=C.svg`
  width: 11px;
  height: 11px;
`,en=C.p`
  color: ${({theme:t})=>t.newItemText};
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  text-align: center;
  letter-spacing: -0.25px;
  margin-left: 0.25rem;
`;function sn({items:t,append:e}){const{clearErrors:i}=$(),{formState:{submitCount:s}}=ui(),o=()=>{e({id:"",name:"",quantity:"",price:"",total:""}),i("itemsError")};return h.jsx(tn,{onClick:o,type:"button",style:{border:s>0&&t.length===0?"1px solid red":"1px solid transparent"},children:h.jsx(en,{children:"+ Add New Item"})})}const nn=C.div`
  display: grid;
  width: 100%;
  border-radius: 8px;
  grid-template-rows: auto;
  background-color: ${({theme:t})=>t.formBackground};
`,on=C.div`
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
`,q=C.label`
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
`,nt=C(q)`
  justify-self: start;

  @media (min-width: 600px) {
    &.mobile-only-label {
      display: none;
    }
  }
`,rn=C.div`
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
`,an=C.h1`
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
`;function ye({index:t,invoice:e}){var u,n,r,a,l,d,c,m,p;const{register:i,formState:s}=$(),{errors:o}=s;return h.jsxs("div",{style:{position:"relative"},children:[h.jsx(Ke,{...i(`items[${t}].quantity`,{required:!Pt,max:1e3,pattern:{value:/^[0-9]+$/,message:"Only numbers are allowed"}}),placeholder:"0",inputMode:"numeric",type:"text",style:{border:Array.isArray(o.items)&&((n=(u=o==null?void 0:o.items)==null?void 0:u[t])!=null&&n.quantity)?"1px solid #EC5757":""},defaultValue:e?(a=(r=e==null?void 0:e.items)==null?void 0:r[t])==null?void 0:a.quantity:0}),Array.isArray(o.items)&&((d=(l=o==null?void 0:o.items)==null?void 0:l[t])==null?void 0:d.quantity)&&h.jsx("span",{style:{position:"absolute",top:"100%",left:"0",marginTop:"4px",padding:"6px 8px",backgroundColor:"#f8d7da",color:"#721c24",border:"1px solid #f5c6cb",borderRadius:"4px",whiteSpace:"pre-line",textWrap:"nowrap"},children:(p=(m=(c=o==null?void 0:o.items)==null?void 0:c[t])==null?void 0:m.quantity)==null?void 0:p.message})]})}function ge({index:t,invoice:e}){var u,n,r,a,l,d,c,m,p;const{register:i,formState:s}=$(),{errors:o}=s;return h.jsxs("div",{style:{position:"relative"},children:[h.jsx(Zs,{...i(`items[${t}].price`,{required:!Pt,max:1e5,pattern:{value:/^\$?\d+(,\d{3})*\.?[0-9]?[0-9]?$/,message:"Only numbers are allowed - max 2 decimal places"}}),placeholder:"0.00",inputMode:"numeric",type:"text",defaultValue:e?(n=(u=e==null?void 0:e.items)==null?void 0:u[t])==null?void 0:n.price:0,style:{border:Array.isArray(o.items)&&((a=(r=o==null?void 0:o.items)==null?void 0:r[t])!=null&&a.price)?"1px solid #EC5757":""}}),Array.isArray(o.items)&&((d=(l=o==null?void 0:o.items)==null?void 0:l[t])==null?void 0:d.price)&&h.jsx("div",{style:{position:"absolute",top:"100%",left:"0",marginTop:"4px",padding:"6px 8px",backgroundColor:"#f8d7da",color:"#721c24",border:"1px solid #f5c6cb",borderRadius:"4px",textWrap:"balance"},children:(p=(m=(c=o==null?void 0:o.items)==null?void 0:c[t])==null?void 0:m.price)==null?void 0:p.message})]})}function xe({index:t,invoice:e}){var u,n,r,a;const{register:i,formState:s}=$(),{errors:o}=s;return h.jsx(Ys,{...i(`items[${t}].name`,{required:!Pt}),placeholder:"Item name",defaultValue:e?(n=(u=e==null?void 0:e.items)==null?void 0:u[t])==null?void 0:n.name:"",type:"text",style:{border:Array.isArray(o.items)&&((a=(r=o==null?void 0:o.items)==null?void 0:r[t])!=null&&a.name)?"1px solid #EC5757":""}})}function Qe({invoice:t,isEditOpen:e}){const{formState:i,watch:s,clearErrors:o,setError:u,reset:n}=$(),{fields:r,remove:a,append:l}=Ee({name:"items",rules:{required:!0,minLength:1}}),{isSubmitting:d}=i,c=s("items",[]),m=lt(),p=v.useRef(!0);v.useEffect(()=>{!r.length&&!p.current?u("myFieldArray",{type:"required",message:"At least one item is required"}):o("myFieldArray"),p.current&&(p.current=!1)},[r,d]),v.useEffect(()=>{t&&e?n({items:t.items.map(f=>({id:f.id,name:f.name,quantity:f.quantity,price:f.price,total:f.total}))}):e||n({items:[{name:"",price:0,quantity:0,total:0}]})},[t,e,n]);const y=f=>{var x,w;return h.jsxs(ue,{children:[h.jsxs(G,{style:{width:"100%",marginBottom:"1.5rem"},children:[h.jsx(nt,{style:{marginBottom:"1rem"},children:"Item Name"}),h.jsx(xe,{index:f,invoice:t})]}),h.jsxs(Js,{children:[h.jsxs(G,{children:[h.jsx(q,{style:{marginBottom:"0.625rem"},children:"Qty."}),h.jsx(ye,{index:f,invoice:t})]}),h.jsxs(G,{children:[h.jsx(q,{style:{marginBottom:"0.625rem"},children:"Price"}),h.jsx(ge,{index:f,invoice:t})]}),h.jsxs(Qs,{style:{width:"fit-content"},children:[h.jsx(q,{style:{marginBottom:"0.625rem"},children:"Total"}),h.jsx(me,{children:(Number((x=c==null?void 0:c[f])==null?void 0:x.quantity)*Number((w=c==null?void 0:c[f])==null?void 0:w.price)).toFixed(2)})]})]}),h.jsxs(G,{children:[h.jsx(q,{style:{marginBottom:"0.625rem"},children:"  "}),h.jsx(pe,{name:"removeButton",onClick:()=>a(f),children:fe})]})]})},g=f=>{var x,w;return h.jsx(ue,{children:h.jsxs(Ks,{children:[h.jsx(xe,{index:f,invoice:t}),h.jsx(ye,{index:f,invoice:t}),h.jsx(ge,{index:f,invoice:t}),h.jsx(me,{children:(Number((x=c==null?void 0:c[f])==null?void 0:x.quantity)*Number((w=c==null?void 0:c[f])==null?void 0:w.price)).toFixed(2)}),h.jsx(pe,{name:"removeButton",onClick:()=>a(f),children:fe})]})})};return h.jsxs(h.Fragment,{children:[h.jsx("ul",{style:{listStyle:"none",marginLeft:"0",paddingLeft:0},children:r.map((f,x)=>h.jsx("li",{"data-testid":"invoice-item",children:h.jsxs("div",{children:[m<600&&y(x),m>=600&&g(x)]})},f.id))}),h.jsx(sn,{append:l,items:t?t.items:[]})]})}Qe.propTypes={isDraft:rt.bool.isRequired,isEditOpen:rt.bool};const ln=({className:t})=>h.jsxs(on,{className:t,children:[h.jsx(nt,{children:"Item Name"}),h.jsx(nt,{children:"Qty."}),h.jsx(nt,{children:"Price"}),h.jsx(q,{children:"Total"})]});function Pn({invoice:t,isEditOpen:e=!1}){const{isDraft:i}=K();return h.jsxs(nn,{"data-testid":"items-container",children:[h.jsx(an,{children:"Item List"}),h.jsx(ln,{className:"desktop-only-label"}),h.jsx(rn,{children:h.jsx(Qe,{isDraft:i,invoice:t,isEditOpen:e})})]})}function cn({isEditOpen:t}){const{formState:{errors:e}}=$(),i=()=>Object.keys(e).find(s=>s!=="myFieldArray"&&s!=="items");return h.jsxs(mi,{children:[h.jsx(Tt,{style:{visibility:(i()||e.items)&&t?"visible":"hidden"},children:"- All fields must be added"}),h.jsx(Tt,{style:{visibility:e.myFieldArray&&t?"visible":"hidden"},children:"- An item must be added"})]})}cn.propTypes={isEditOpen:rt.bool.isRequired};function Cn({invoice:t}){var n,r,a,l,d,c;const e=lt(),{formState:{errors:i},register:s}=$(),{isDraft:o}=K(),u=h.jsxs(N,{style:{width:e<768?"100%":""},className:"client-country",children:[h.jsx(k,{htmlFor:"clientCountry",style:{color:i.clientCountry?"#EC5757":""},children:"Country"}),h.jsx(De,{id:"clientCountry",$long:!1,style:{border:i!=null&&i.clientCountry?"1px solid #EC5757":"",width:e<768?"100%":""},type:"text",defaultValue:t?(n=t==null?void 0:t.clientAddress)==null?void 0:n.country:"",...s("clientCountry",{required:!o,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return h.jsxs(h.Fragment,{children:[h.jsxs(N,{className:"client-name",children:[h.jsx(k,{htmlFor:"clientName",style:{color:i.clientName?"#EC5757":""},children:"Client's Name"}),((r=i.clientName)==null?void 0:r.type)==="required"&&h.jsx(Et,{children:"can't be empty"}),h.jsx(gt,{id:"clientName",$long:!0,style:{border:i.clientName?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientName:"",...s("clientName",{required:!o})})]}),h.jsxs(N,{className:"client-email",children:[h.jsx(k,{htmlFor:"clientEmail",style:{color:i.clientEmail?"#EC5757":""},children:"Client's Email"}),((a=i.clientEmail)==null?void 0:a.type)==="pattern"&&h.jsx(Et,{style:{position:"absolute",top:"-8px"},children:"Invalid email"}),h.jsx(gt,{id:"clientEmail",$long:!0,style:{border:i.clientEmail?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientEmail:"",...s("clientEmail",{required:!o,pattern:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/})})]}),h.jsxs(N,{className:"client-street-address",children:[h.jsx(k,{htmlFor:"clientStreetAddress",style:{color:i.clientStreetAddress?"#EC5757":""},children:"Street Address"}),h.jsx(Se,{id:"clientStreetAddress",style:{border:i.clientStreetAddress?"1px solid #EC5757":""},defaultValue:t?(l=t==null?void 0:t.clientAddress)==null?void 0:l.street:"",...s("clientStreetAddress",{required:!o})})]}),h.jsxs(jt,{children:[h.jsxs(W,{className:"clientCity",children:[h.jsx(k,{htmlFor:"clientCity",style:{color:i.clientCity?"#EC5757":""},children:"City"}),h.jsx(at,{id:"clientCity",style:{border:i.clientCity?"1px solid #EC5757":""},type:"text",defaultValue:t?(d=t==null?void 0:t.clientAddress)==null?void 0:d.city:"",...s("clientCity",{required:!o,pattern:/[\w ]*/i,maxLength:30})})]}),h.jsxs(W,{className:"clientPostalCode",children:[h.jsx(k,{htmlFor:"clientPostalCode",style:{color:i.clientPostalCode?"#EC5757":""},children:"Post Code"}),h.jsx(at,{id:"clientPostalCode",style:{border:i.clientPostalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(c=t==null?void 0:t.clientAddress)==null?void 0:c.postCode:"",...s("clientPostalCode",{required:!o,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]}),e<768&&h.jsx(N,{className:"client-country",children:u}),e>=768&&h.jsx(W,{className:"client-country",children:u})]})]})}function jn({invoice:t}){const{formState:{errors:e},register:i}=$(),{isDraft:s}=K();return h.jsx(h.Fragment,{children:h.jsxs(N,{className:"project-description",children:[h.jsx(k,{htmlFor:"projectDescription",style:{color:e.projectDescription?"#EC5757":""},children:"Project Description"}),h.jsx(gt,{id:"projectDescription",type:"text",defaultValue:t==null?void 0:t.description,...i("projectDescription",{required:!s}),style:{border:e.projectDescription?"1px solid #EC5757":""}})]})})}const wn=()=>{const{id:t}=ri(),{startDate:e,setIsDraft:i,setIsNewInvoiceOpen:s,selectedPaymentOption:o,setSelectedPaymentOption:u,methods:n}=K(),{control:r,trigger:a,reset:l,watch:d,setError:c,clearErrors:m,getValues:p}=n,{replace:y}=Ee({control:r,name:"items"}),g=d(),[f]=St(hi,{refetchQueries:[{query:di}],onError:P=>{console.error(P)}}),[x]=St(ci,{update:(P,{data:{editInvoice:b}})=>{P.writeQuery({query:li,variables:{getInvoiceById:b.id},data:{getInvoiceById:b}})},onError:P=>{console.error(P)}}),w=()=>{u(1),l(),m(),s(!1)},T=async P=>{if(ai.flushSync(()=>i(!1)),P=p(),!P.items){c("items",{type:"custom",message:"An item must be added"});return}if(await a()){const R=ht(P,e,o);R.items=R.items.map(M=>({...M,quantity:Number(M.quantity),price:Number(M.price)})),R.status="pending";try{await f({variables:{...R}}),w(),y([{id:Dt(),name:"",quantity:0,price:0,total:0}])}catch(M){console.error(M)}}},A=async()=>{m();const P=p();P.items||(P.items=[{id:"",name:"",quantity:0,price:0,total:0}]);const b=ht(P,e,o);b.status="draft";try{await f({variables:{...b}}),w(),y([{id:Dt(),name:"",quantity:0,price:0,total:0}])}catch(R){console.error(R)}},j=async P=>{if(await a()){const R=ht(P,e,o);R.id=String(t),R.status="pending";try{await x({variables:{...R}}),s(!1)}catch(M){console.error(M)}}};return v.useEffect(()=>{g.items?m("items"):c("items",{type:"custom",message:"An item must be added"})},[g.items,c]),{methods:n,onSubmit:T,onSubmitDraft:A,onSubmitUpdate:j}},Tn=({children:t})=>{const e=lt();let i=700;e<=616?i=e:e<=768?i=616:i=700;const s={hidden:{x:`${-i}px`},visible:{x:"0"},exit:{x:`${-i}px`}};return h.jsxs(h.Fragment,{children:[h.jsx(he.div,{initial:{opacity:0},animate:{opacity:.5},exit:{opacity:0},transition:{duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#000",zIndex:1e3,cursor:"pointer"}},"overlay"),h.jsx(he.div,{variants:s,initial:"hidden",animate:"visible",exit:"exit",transition:{type:"tween",duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:`${i}px`,height:"100%",minHeight:"100vh",color:"#ecf0f1",padding:"20px",zIndex:1001,boxShadow:"2px 0 5px rgba(0,0,0,0.3)"},children:t},"sidebar")]})};export{yn as A,xn as C,jn as D,Pn as E,cn as F,Tn as S,Cn as a,W as b,vn as c,wn as u};
