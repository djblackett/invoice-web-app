import{a as v,$ as oi,j as h,a0 as De,a1 as Se,a2 as ri,a3 as Ae,a4 as V,a5 as k,a6 as nt,a7 as be,a8 as rt,a9 as mt,aa as z,ab as Re,ac as ai,ad as li,ae as Le,af as ci,ag as gt,ah as xt,ai as Lt,aj as hi,d as T,b as yt,h as di,ak as ui}from"./index-H3f1CZrW.js";import{P as pt,f as _,c as ot,g as mi,h as Ve,G as pi,E as fi,A as yi,i as gi}from"./invoice.queries-CxURgLSS.js";import{L as M,C as Be,S as Ie,A as ft,a as xi,b as Vt,c as Bt,I as wt}from"./editPageStyles-DIIcDdHg.js";import{c as vt,v as It}from"./utilityFunctions-Y1C971lf.js";import{u as kt}from"./useMutation-DxR9-0Si.js";import{i as F,b as bt,d as vi,e as Pi,f as ke,p as ji,s as Ci,m as Ti,h as A,j as Dt,k as S,l as Ei,n as wi,o as Di,q as Mt,r as Me,F as Fe,t as Ft,u as Si,v as Ne,w as $e,x as Oe,y as Ai,z as Nt,S as bi,A as Ri,B as O,C as at,D as lt,E as $t,G as Li,H as Vi,I as Bi,J as U,K as Ii,c as ki,g as Mi,a as Fi}from"./create-visual-element-CVJDquhu.js";class Ni extends v.Component{getSnapshotBeforeUpdate(e){const i=this.props.childRef.current;if(i&&e.isPresent&&!this.props.isPresent){const s=i.offsetParent,a=s instanceof HTMLElement&&s.offsetWidth||0,u=this.props.sizeRef.current;u.height=i.offsetHeight||0,u.width=i.offsetWidth||0,u.top=i.offsetTop,u.left=i.offsetLeft,u.right=a-u.width-u.left}return null}componentDidUpdate(){}render(){return this.props.children}}function $i({children:t,isPresent:e,anchorX:i}){const s=v.useId(),a=v.useRef(null),u=v.useRef({width:0,height:0,top:0,left:0,right:0}),{nonce:n}=v.useContext(oi);return v.useInsertionEffect(()=>{const{width:r,height:o,top:l,left:c,right:d}=u.current;if(e||!a.current||!r||!o)return;const m=i==="left"?`left: ${c}`:`right: ${d}`;a.current.dataset.motionPopId=s;const p=document.createElement("style");return n&&(p.nonce=n),document.head.appendChild(p),p.sheet&&p.sheet.insertRule(`
          [data-motion-pop-id="${s}"] {
            position: absolute !important;
            width: ${r}px !important;
            height: ${o}px !important;
            ${m}px !important;
            top: ${l}px !important;
          }
        `),()=>{document.head.removeChild(p)}},[e]),h.jsx(Ni,{isPresent:e,childRef:a,sizeRef:u,children:v.cloneElement(t,{ref:a})})}const Oi=({children:t,initial:e,isPresent:i,onExitComplete:s,custom:a,presenceAffectsLayout:u,mode:n,anchorX:r})=>{const o=De(Ui),l=v.useId(),c=v.useCallback(m=>{o.set(m,!0);for(const p of o.values())if(!p)return;s&&s()},[o,s]),d=v.useMemo(()=>({id:l,initial:e,isPresent:i,custom:a,onExitComplete:c,register:m=>(o.set(m,!1),()=>o.delete(m))}),u?[Math.random(),c]:[i,c]);return v.useMemo(()=>{o.forEach((m,p)=>o.set(p,!1))},[i]),v.useEffect(()=>{!i&&!o.size&&s&&s()},[i]),n==="popLayout"&&(t=h.jsx($i,{isPresent:i,anchorX:r,children:t})),h.jsx(Se.Provider,{value:d,children:t})};function Ui(){return new Map}function Ue(t=!0){const e=v.useContext(Se);if(e===null)return[!0,null];const{isPresent:i,onExitComplete:s,register:a}=e,u=v.useId();v.useEffect(()=>{t&&a(u)},[t]);const n=v.useCallback(()=>t&&s&&s(u),[u,s,t]);return!i&&s?[!1,n]:[!0]}const ct=t=>t.key||"";function Ot(t){const e=[];return v.Children.forEach(t,i=>{v.isValidElement(i)&&e.push(i)}),e}const vn=({children:t,custom:e,initial:i=!0,onExitComplete:s,presenceAffectsLayout:a=!0,mode:u="sync",propagate:n=!1,anchorX:r="left"})=>{const[o,l]=Ue(n),c=v.useMemo(()=>Ot(t),[t]),d=n&&!o?[]:c.map(ct),m=v.useRef(!0),p=v.useRef(c),y=De(()=>new Map),[g,P]=v.useState(c),[j,b]=v.useState(c);ri(()=>{m.current=!1,p.current=c;for(let C=0;C<j.length;C++){const x=ct(j[C]);d.includes(x)?y.delete(x):y.get(x)!==!0&&y.set(x,!1)}},[j,d.length,d.join("-")]);const f=[];if(c!==g){let C=[...c];for(let x=0;x<j.length;x++){const w=j[x],D=ct(w);d.includes(D)||(C.splice(x,0,w),f.push(w))}return u==="wait"&&f.length&&(C=f),b(Ot(C)),P(c),null}const{forceRender:E}=v.useContext(Ae);return h.jsx(h.Fragment,{children:j.map(C=>{const x=ct(C),w=n&&!o?!1:c===j||d.includes(x),D=()=>{if(y.has(x))y.set(x,!0);else return;let R=!0;y.forEach($=>{$||(R=!1)}),R&&(E==null||E(),b(p.current),n&&(l==null||l()),s&&s())};return h.jsx(Oi,{isPresent:w,initial:!m.current||i?void 0:!1,custom:e,presenceAffectsLayout:a,mode:u,onExitComplete:w?void 0:D,anchorX:r,children:C},x)})})};function qi(t){if(typeof Proxy>"u")return t;const e=new Map,i=(...s)=>t(...s);return new Proxy(i,{get:(s,a)=>a==="create"?t:(e.has(a)||e.set(a,t(a)),e.get(a))})}function zi(t){return t==="x"||t==="y"?F[t]?null:(F[t]=!0,()=>{F[t]=!1}):F.x||F.y?null:(F.x=F.y=!0,()=>{F.x=F.y=!1})}function et(t,e,i,s){return bt(t,e,vi(i),s)}const Ut=(t,e)=>Math.abs(t-e);function Wi(t,e){const i=Ut(t.x,e.x),s=Ut(t.y,e.y);return Math.sqrt(i**2+s**2)}class qe{constructor(e,i,{transformPagePoint:s,contextWindow:a,dragSnapToOrigin:u=!1}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const d=jt(this.lastMoveEventInfo,this.history),m=this.startEvent!==null,p=Wi(d.offset,{x:0,y:0})>=3;if(!m&&!p)return;const{point:y}=d,{timestamp:g}=V;this.history.push({...y,timestamp:g});const{onStart:P,onMove:j}=this.handlers;m||(P&&P(this.lastMoveEvent,d),this.startEvent=this.lastMoveEvent),j&&j(this.lastMoveEvent,d)},this.handlePointerMove=(d,m)=>{this.lastMoveEvent=d,this.lastMoveEventInfo=Pt(m,this.transformPagePoint),k.update(this.updatePoint,!0)},this.handlePointerUp=(d,m)=>{this.end();const{onEnd:p,onSessionEnd:y,resumeAnimation:g}=this.handlers;if(this.dragSnapToOrigin&&g&&g(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const P=jt(d.type==="pointercancel"?this.lastMoveEventInfo:Pt(m,this.transformPagePoint),this.history);this.startEvent&&p&&p(d,P),y&&y(d,P)},!Pi(e))return;this.dragSnapToOrigin=u,this.handlers=i,this.transformPagePoint=s,this.contextWindow=a||window;const n=ke(e),r=Pt(n,this.transformPagePoint),{point:o}=r,{timestamp:l}=V;this.history=[{...o,timestamp:l}];const{onSessionStart:c}=i;c&&c(e,jt(r,this.history)),this.removeListeners=ji(et(this.contextWindow,"pointermove",this.handlePointerMove),et(this.contextWindow,"pointerup",this.handlePointerUp),et(this.contextWindow,"pointercancel",this.handlePointerUp))}updateHandlers(e){this.handlers=e}end(){this.removeListeners&&this.removeListeners(),nt(this.updatePoint)}}function Pt(t,e){return e?{point:e(t.point)}:t}function qt(t,e){return{x:t.x-e.x,y:t.y-e.y}}function jt({point:t},e){return{point:t,delta:qt(t,ze(e)),offset:qt(t,_i(e)),velocity:Gi(e,.1)}}function _i(t){return t[0]}function ze(t){return t[t.length-1]}function Gi(t,e){if(t.length<2)return{x:0,y:0};let i=t.length-1,s=null;const a=ze(t);for(;i>=0&&(s=t[i],!(a.timestamp-s.timestamp>Ci(e)));)i--;if(!s)return{x:0,y:0};const u=Ti(a.timestamp-s.timestamp);if(u===0)return{x:0,y:0};const n={x:(a.x-s.x)/u,y:(a.y-s.y)/u};return n.x===1/0&&(n.x=0),n.y===1/0&&(n.y=0),n}const We=1e-4,Hi=1-We,Xi=1+We,_e=.01,Yi=0-_e,Zi=0+_e;function L(t){return t.max-t.min}function Ki(t,e,i){return Math.abs(t-e)<=i}function zt(t,e,i,s=.5){t.origin=s,t.originPoint=A(e.min,e.max,t.origin),t.scale=L(i)/L(e),t.translate=A(i.min,i.max,t.origin)-t.originPoint,(t.scale>=Hi&&t.scale<=Xi||isNaN(t.scale))&&(t.scale=1),(t.translate>=Yi&&t.translate<=Zi||isNaN(t.translate))&&(t.translate=0)}function it(t,e,i,s){zt(t.x,e.x,i.x,s?s.originX:void 0),zt(t.y,e.y,i.y,s?s.originY:void 0)}function Wt(t,e,i){t.min=i.min+e.min,t.max=t.min+L(e)}function Qi(t,e,i){Wt(t.x,e.x,i.x),Wt(t.y,e.y,i.y)}function _t(t,e,i){t.min=e.min-i.min,t.max=t.min+L(e)}function st(t,e,i){_t(t.x,e.x,i.x),_t(t.y,e.y,i.y)}function Ji(t,{min:e,max:i},s){return e!==void 0&&t<e?t=s?A(e,t,s.min):Math.max(t,e):i!==void 0&&t>i&&(t=s?A(i,t,s.max):Math.min(t,i)),t}function Gt(t,e,i){return{min:e!==void 0?t.min+e:void 0,max:i!==void 0?t.max+i-(t.max-t.min):void 0}}function ts(t,{top:e,left:i,bottom:s,right:a}){return{x:Gt(t.x,i,a),y:Gt(t.y,e,s)}}function Ht(t,e){let i=e.min-t.min,s=e.max-t.max;return e.max-e.min<t.max-t.min&&([i,s]=[s,i]),{min:i,max:s}}function es(t,e){return{x:Ht(t.x,e.x),y:Ht(t.y,e.y)}}function is(t,e){let i=.5;const s=L(t),a=L(e);return a>s?i=Dt(e.min,e.max-s,t.min):s>a&&(i=Dt(t.min,t.max-a,e.min)),be(0,1,i)}function ss(t,e){const i={};return e.min!==void 0&&(i.min=e.min-t.min),e.max!==void 0&&(i.max=e.max-t.min),i}const St=.35;function ns(t=St){return t===!1?t=0:t===!0&&(t=St),{x:Xt(t,"left","right"),y:Xt(t,"top","bottom")}}function Xt(t,e,i){return{min:Yt(t,e),max:Yt(t,i)}}function Yt(t,e){return typeof t=="number"?t:t[e]||0}function I(t){return[t("x"),t("y")]}const Ge=({current:t})=>t?t.ownerDocument.defaultView:null,os=new WeakMap;class rs{constructor(e){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=S(),this.visualElement=e}start(e,{snapToCursor:i=!1}={}){const{presenceContext:s}=this.visualElement;if(s&&s.isPresent===!1)return;const a=c=>{const{dragSnapToOrigin:d}=this.getProps();d?this.pauseAnimation():this.stopAnimation(),i&&this.snapToCursor(ke(c).point)},u=(c,d)=>{const{drag:m,dragPropagation:p,onDragStart:y}=this.getProps();if(m&&!p&&(this.openDragLock&&this.openDragLock(),this.openDragLock=zi(m),!this.openDragLock))return;this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),I(P=>{let j=this.getAxisMotionValue(P).get()||0;if(mt.test(j)){const{projection:b}=this.visualElement;if(b&&b.layout){const f=b.layout.layoutBox[P];f&&(j=L(f)*(parseFloat(j)/100))}}this.originPoint[P]=j}),y&&k.postRender(()=>y(c,d)),Mt(this.visualElement,"transform");const{animationState:g}=this.visualElement;g&&g.setActive("whileDrag",!0)},n=(c,d)=>{const{dragPropagation:m,dragDirectionLock:p,onDirectionLock:y,onDrag:g}=this.getProps();if(!m&&!this.openDragLock)return;const{offset:P}=d;if(p&&this.currentDirection===null){this.currentDirection=as(P),this.currentDirection!==null&&y&&y(this.currentDirection);return}this.updateAxis("x",d.point,P),this.updateAxis("y",d.point,P),this.visualElement.render(),g&&g(c,d)},r=(c,d)=>this.stop(c,d),o=()=>I(c=>{var d;return this.getAnimationState(c)==="paused"&&((d=this.getAxisMotionValue(c).animation)===null||d===void 0?void 0:d.play())}),{dragSnapToOrigin:l}=this.getProps();this.panSession=new qe(e,{onSessionStart:a,onStart:u,onMove:n,onSessionEnd:r,resumeAnimation:o},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:l,contextWindow:Ge(this.visualElement)})}stop(e,i){const s=this.isDragging;if(this.cancel(),!s)return;const{velocity:a}=i;this.startAnimation(a);const{onDragEnd:u}=this.getProps();u&&k.postRender(()=>u(e,i))}cancel(){this.isDragging=!1;const{projection:e,animationState:i}=this.visualElement;e&&(e.isAnimationBlocked=!1),this.panSession&&this.panSession.end(),this.panSession=void 0;const{dragPropagation:s}=this.getProps();!s&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),i&&i.setActive("whileDrag",!1)}updateAxis(e,i,s){const{drag:a}=this.getProps();if(!s||!ht(e,a,this.currentDirection))return;const u=this.getAxisMotionValue(e);let n=this.originPoint[e]+s[e];this.constraints&&this.constraints[e]&&(n=Ji(n,this.constraints[e],this.elastic[e])),u.set(n)}resolveConstraints(){var e;const{dragConstraints:i,dragElastic:s}=this.getProps(),a=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(e=this.visualElement.projection)===null||e===void 0?void 0:e.layout,u=this.constraints;i&&rt(i)?this.constraints||(this.constraints=this.resolveRefConstraints()):i&&a?this.constraints=ts(a.layoutBox,i):this.constraints=!1,this.elastic=ns(s),u!==this.constraints&&a&&this.constraints&&!this.hasMutatedConstraints&&I(n=>{this.constraints!==!1&&this.getAxisMotionValue(n)&&(this.constraints[n]=ss(a.layoutBox[n],this.constraints[n]))})}resolveRefConstraints(){const{dragConstraints:e,onMeasureDragConstraints:i}=this.getProps();if(!e||!rt(e))return!1;const s=e.current,{projection:a}=this.visualElement;if(!a||!a.layout)return!1;const u=Ei(s,a.root,this.visualElement.getTransformPagePoint());let n=es(a.layout.layoutBox,u);if(i){const r=i(wi(n));this.hasMutatedConstraints=!!r,r&&(n=Di(r))}return n}startAnimation(e){const{drag:i,dragMomentum:s,dragElastic:a,dragTransition:u,dragSnapToOrigin:n,onDragTransitionEnd:r}=this.getProps(),o=this.constraints||{},l=I(c=>{if(!ht(c,i,this.currentDirection))return;let d=o&&o[c]||{};n&&(d={min:0,max:0});const m=a?200:1e6,p=a?40:1e7,y={type:"inertia",velocity:s?e[c]:0,bounceStiffness:m,bounceDamping:p,timeConstant:750,restDelta:1,restSpeed:10,...u,...d};return this.startAxisValueAnimation(c,y)});return Promise.all(l).then(r)}startAxisValueAnimation(e,i){const s=this.getAxisMotionValue(e);return Mt(this.visualElement,e),s.start(Me(e,s,0,i,this.visualElement,!1))}stopAnimation(){I(e=>this.getAxisMotionValue(e).stop())}pauseAnimation(){I(e=>{var i;return(i=this.getAxisMotionValue(e).animation)===null||i===void 0?void 0:i.pause()})}getAnimationState(e){var i;return(i=this.getAxisMotionValue(e).animation)===null||i===void 0?void 0:i.state}getAxisMotionValue(e){const i=`_drag${e.toUpperCase()}`,s=this.visualElement.getProps(),a=s[i];return a||this.visualElement.getValue(e,(s.initial?s.initial[e]:void 0)||0)}snapToCursor(e){I(i=>{const{drag:s}=this.getProps();if(!ht(i,s,this.currentDirection))return;const{projection:a}=this.visualElement,u=this.getAxisMotionValue(i);if(a&&a.layout){const{min:n,max:r}=a.layout.layoutBox[i];u.set(e[i]-A(n,r,.5))}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:e,dragConstraints:i}=this.getProps(),{projection:s}=this.visualElement;if(!rt(i)||!s||!this.constraints)return;this.stopAnimation();const a={x:0,y:0};I(n=>{const r=this.getAxisMotionValue(n);if(r&&this.constraints!==!1){const o=r.get();a[n]=is({min:o,max:o},this.constraints[n])}});const{transformTemplate:u}=this.visualElement.getProps();this.visualElement.current.style.transform=u?u({},""):"none",s.root&&s.root.updateScroll(),s.updateLayout(),this.resolveConstraints(),I(n=>{if(!ht(n,e,null))return;const r=this.getAxisMotionValue(n),{min:o,max:l}=this.constraints[n];r.set(A(o,l,a[n]))})}addListeners(){if(!this.visualElement.current)return;os.set(this.visualElement,this);const e=this.visualElement.current,i=et(e,"pointerdown",o=>{const{drag:l,dragListener:c=!0}=this.getProps();l&&c&&this.start(o)}),s=()=>{const{dragConstraints:o}=this.getProps();rt(o)&&o.current&&(this.constraints=this.resolveRefConstraints())},{projection:a}=this.visualElement,u=a.addEventListener("measure",s);a&&!a.layout&&(a.root&&a.root.updateScroll(),a.updateLayout()),k.read(s);const n=bt(window,"resize",()=>this.scalePositionWithinConstraints()),r=a.addEventListener("didUpdate",({delta:o,hasLayoutChanged:l})=>{this.isDragging&&l&&(I(c=>{const d=this.getAxisMotionValue(c);d&&(this.originPoint[c]+=o[c].translate,d.set(d.get()+o[c].translate))}),this.visualElement.render())});return()=>{n(),i(),u(),r&&r()}}getProps(){const e=this.visualElement.getProps(),{drag:i=!1,dragDirectionLock:s=!1,dragPropagation:a=!1,dragConstraints:u=!1,dragElastic:n=St,dragMomentum:r=!0}=e;return{...e,drag:i,dragDirectionLock:s,dragPropagation:a,dragConstraints:u,dragElastic:n,dragMomentum:r}}}function ht(t,e,i){return(e===!0||e===t)&&(i===null||i===t)}function as(t,e=10){let i=null;return Math.abs(t.y)>e?i="y":Math.abs(t.x)>e&&(i="x"),i}class ls extends Fe{constructor(e){super(e),this.removeGroupControls=z,this.removeListeners=z,this.controls=new rs(e)}mount(){const{dragControls:e}=this.node.getProps();e&&(this.removeGroupControls=e.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||z}unmount(){this.removeGroupControls(),this.removeListeners()}}const Zt=t=>(e,i)=>{t&&k.postRender(()=>t(e,i))};class cs extends Fe{constructor(){super(...arguments),this.removePointerDownListener=z}onPointerDown(e){this.session=new qe(e,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:Ge(this.node)})}createPanHandlers(){const{onPanSessionStart:e,onPanStart:i,onPan:s,onPanEnd:a}=this.node.getProps();return{onSessionStart:Zt(e),onStart:Zt(i),onMove:s,onEnd:(u,n)=>{delete this.session,a&&k.postRender(()=>a(u,n))}}}mount(){this.removePointerDownListener=et(this.node.current,"pointerdown",e=>this.onPointerDown(e))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}const dt={hasAnimatedSinceResize:!0,hasEverUpdated:!1};function Kt(t,e){return e.max===e.min?0:t/(e.max-e.min)*100}const J={correct:(t,e)=>{if(!e.target)return t;if(typeof t=="string")if(Re.test(t))t=parseFloat(t);else return t;const i=Kt(t,e.target.x),s=Kt(t,e.target.y);return`${i}% ${s}%`}},hs={correct:(t,{treeScale:e,projectionDelta:i})=>{const s=t,a=Ft.parse(t);if(a.length>5)return s;const u=Ft.createTransformer(t),n=typeof a[0]!="number"?1:0,r=i.x.scale*e.x,o=i.y.scale*e.y;a[0+n]/=r,a[1+n]/=o;const l=A(r,o,.5);return typeof a[2+n]=="number"&&(a[2+n]/=l),typeof a[3+n]=="number"&&(a[3+n]/=l),u(a)}};class ds extends v.Component{componentDidMount(){const{visualElement:e,layoutGroup:i,switchLayoutGroup:s,layoutId:a}=this.props,{projection:u}=e;li(us),u&&(i.group&&i.group.add(u),s&&s.register&&a&&s.register(u),u.root.didUpdate(),u.addEventListener("animationComplete",()=>{this.safeToRemove()}),u.setOptions({...u.options,onExitComplete:()=>this.safeToRemove()})),dt.hasEverUpdated=!0}getSnapshotBeforeUpdate(e){const{layoutDependency:i,visualElement:s,drag:a,isPresent:u}=this.props,n=s.projection;return n&&(n.isPresent=u,a||e.layoutDependency!==i||i===void 0?n.willUpdate():this.safeToRemove(),e.isPresent!==u&&(u?n.promote():n.relegate()||k.postRender(()=>{const r=n.getStack();(!r||!r.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{projection:e}=this.props.visualElement;e&&(e.root.didUpdate(),Le.postRender(()=>{!e.currentAnimation&&e.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:e,layoutGroup:i,switchLayoutGroup:s}=this.props,{projection:a}=e;a&&(a.scheduleCheckAfterUnmount(),i&&i.group&&i.group.remove(a),s&&s.deregister&&s.deregister(a))}safeToRemove(){const{safeToRemove:e}=this.props;e&&e()}render(){return null}}function He(t){const[e,i]=Ue(),s=v.useContext(Ae);return h.jsx(ds,{...t,layoutGroup:s,switchLayoutGroup:v.useContext(ai),isPresent:e,safeToRemove:i})}const us={borderRadius:{...J,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:J,borderTopRightRadius:J,borderBottomLeftRadius:J,borderBottomRightRadius:J,boxShadow:hs};function ms(t,e,i){const s=ci(t)?t:Si(t);return s.start(Me("",s,e,i)),s.animation}function ps(t){return t instanceof SVGElement&&t.tagName!=="svg"}const fs=(t,e)=>t.depth-e.depth;class ys{constructor(){this.children=[],this.isDirty=!1}add(e){Ne(this.children,e),this.isDirty=!0}remove(e){$e(this.children,e),this.isDirty=!0}forEach(e){this.isDirty&&this.children.sort(fs),this.isDirty=!1,this.children.forEach(e)}}function gs(t,e){const i=Oe.now(),s=({timestamp:a})=>{const u=a-i;u>=e&&(nt(s),t(u-e))};return k.read(s,!0),()=>nt(s)}const Xe=["TopLeft","TopRight","BottomLeft","BottomRight"],xs=Xe.length,Qt=t=>typeof t=="string"?parseFloat(t):t,Jt=t=>typeof t=="number"||Re.test(t);function vs(t,e,i,s,a,u){a?(t.opacity=A(0,i.opacity!==void 0?i.opacity:1,Ps(s)),t.opacityExit=A(e.opacity!==void 0?e.opacity:1,0,js(s))):u&&(t.opacity=A(e.opacity!==void 0?e.opacity:1,i.opacity!==void 0?i.opacity:1,s));for(let n=0;n<xs;n++){const r=`border${Xe[n]}Radius`;let o=te(e,r),l=te(i,r);if(o===void 0&&l===void 0)continue;o||(o=0),l||(l=0),o===0||l===0||Jt(o)===Jt(l)?(t[r]=Math.max(A(Qt(o),Qt(l),s),0),(mt.test(l)||mt.test(o))&&(t[r]+="%")):t[r]=l}(e.rotate||i.rotate)&&(t.rotate=A(e.rotate||0,i.rotate||0,s))}function te(t,e){return t[e]!==void 0?t[e]:t.borderRadius}const Ps=Ye(0,.5,Ai),js=Ye(.5,.95,z);function Ye(t,e,i){return s=>s<t?0:s>e?1:i(Dt(t,e,s))}function ee(t,e){t.min=e.min,t.max=e.max}function B(t,e){ee(t.x,e.x),ee(t.y,e.y)}function ie(t,e){t.translate=e.translate,t.scale=e.scale,t.originPoint=e.originPoint,t.origin=e.origin}function se(t,e,i,s,a){return t-=e,t=Nt(t,1/i,s),a!==void 0&&(t=Nt(t,1/a,s)),t}function Cs(t,e=0,i=1,s=.5,a,u=t,n=t){if(mt.test(e)&&(e=parseFloat(e),e=A(n.min,n.max,e/100)-n.min),typeof e!="number")return;let r=A(u.min,u.max,s);t===u&&(r-=e),t.min=se(t.min,e,i,r,a),t.max=se(t.max,e,i,r,a)}function ne(t,e,[i,s,a],u,n){Cs(t,e[i],e[s],e[a],e.scale,u,n)}const Ts=["x","scaleX","originX"],Es=["y","scaleY","originY"];function oe(t,e,i,s){ne(t.x,e,Ts,i?i.x:void 0,s?s.x:void 0),ne(t.y,e,Es,i?i.y:void 0,s?s.y:void 0)}function re(t){return t.translate===0&&t.scale===1}function Ze(t){return re(t.x)&&re(t.y)}function ae(t,e){return t.min===e.min&&t.max===e.max}function ws(t,e){return ae(t.x,e.x)&&ae(t.y,e.y)}function le(t,e){return Math.round(t.min)===Math.round(e.min)&&Math.round(t.max)===Math.round(e.max)}function Ke(t,e){return le(t.x,e.x)&&le(t.y,e.y)}function ce(t){return L(t.x)/L(t.y)}function he(t,e){return t.translate===e.translate&&t.scale===e.scale&&t.originPoint===e.originPoint}class Ds{constructor(){this.members=[]}add(e){Ne(this.members,e),e.scheduleRender()}remove(e){if($e(this.members,e),e===this.prevLead&&(this.prevLead=void 0),e===this.lead){const i=this.members[this.members.length-1];i&&this.promote(i)}}relegate(e){const i=this.members.findIndex(a=>e===a);if(i===0)return!1;let s;for(let a=i;a>=0;a--){const u=this.members[a];if(u.isPresent!==!1){s=u;break}}return s?(this.promote(s),!0):!1}promote(e,i){const s=this.lead;if(e!==s&&(this.prevLead=s,this.lead=e,e.show(),s)){s.instance&&s.scheduleRender(),e.scheduleRender(),e.resumeFrom=s,i&&(e.resumeFrom.preserveOpacity=!0),s.snapshot&&(e.snapshot=s.snapshot,e.snapshot.latestValues=s.animationValues||s.latestValues),e.root&&e.root.isUpdating&&(e.isLayoutDirty=!0);const{crossfade:a}=e.options;a===!1&&s.hide()}}exitAnimationComplete(){this.members.forEach(e=>{const{options:i,resumingFrom:s}=e;i.onExitComplete&&i.onExitComplete(),s&&s.options.onExitComplete&&s.options.onExitComplete()})}scheduleRender(){this.members.forEach(e=>{e.instance&&e.scheduleRender(!1)})}removeLeadSnapshot(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)}}function Ss(t,e,i){let s="";const a=t.x.translate/e.x,u=t.y.translate/e.y,n=(i==null?void 0:i.z)||0;if((a||u||n)&&(s=`translate3d(${a}px, ${u}px, ${n}px) `),(e.x!==1||e.y!==1)&&(s+=`scale(${1/e.x}, ${1/e.y}) `),i){const{transformPerspective:l,rotate:c,rotateX:d,rotateY:m,skewX:p,skewY:y}=i;l&&(s=`perspective(${l}px) ${s}`),c&&(s+=`rotate(${c}deg) `),d&&(s+=`rotateX(${d}deg) `),m&&(s+=`rotateY(${m}deg) `),p&&(s+=`skewX(${p}deg) `),y&&(s+=`skewY(${y}deg) `)}const r=t.x.scale*e.x,o=t.y.scale*e.y;return(r!==1||o!==1)&&(s+=`scale(${r}, ${o})`),s||"none"}const Ct=["","X","Y","Z"],As={visibility:"hidden"},de=1e3;let bs=0;function Tt(t,e,i,s){const{latestValues:a}=e;a[t]&&(i[t]=a[t],e.setStaticValue(t,0),s&&(s[t]=0))}function Qe(t){if(t.hasCheckedOptimisedAppear=!0,t.root===t)return;const{visualElement:e}=t.options;if(!e)return;const i=Ii(e);if(window.MotionHasOptimisedAnimation(i,"transform")){const{layout:a,layoutId:u}=t.options;window.MotionCancelOptimisedAnimation(i,"transform",k,!(a||u))}const{parent:s}=t;s&&!s.hasCheckedOptimisedAppear&&Qe(s)}function Je({attachResizeListener:t,defaultParent:e,measureScroll:i,checkIsScrollRoot:s,resetTransform:a}){return class{constructor(n={},r=e==null?void 0:e()){this.id=bs++,this.animationId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(Vs),this.nodes.forEach(Fs),this.nodes.forEach(Ns),this.nodes.forEach(Bs)},this.resolvedRelativeTargetAt=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=n,this.root=r?r.root||r:this,this.path=r?[...r.path,r]:[],this.parent=r,this.depth=r?r.depth+1:0;for(let o=0;o<this.path.length;o++)this.path[o].shouldResetTransform=!0;this.root===this&&(this.nodes=new ys)}addEventListener(n,r){return this.eventHandlers.has(n)||this.eventHandlers.set(n,new bi),this.eventHandlers.get(n).add(r)}notifyListeners(n,...r){const o=this.eventHandlers.get(n);o&&o.notify(...r)}hasListeners(n){return this.eventHandlers.has(n)}mount(n,r=this.root.hasTreeAnimated){if(this.instance)return;this.isSVG=ps(n),this.instance=n;const{layoutId:o,layout:l,visualElement:c}=this.options;if(c&&!c.current&&c.mount(n),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),r&&(l||o)&&(this.isLayoutDirty=!0),t){let d;const m=()=>this.root.updateBlockedByResize=!1;t(n,()=>{this.root.updateBlockedByResize=!0,d&&d(),d=gs(m,250),dt.hasAnimatedSinceResize&&(dt.hasAnimatedSinceResize=!1,this.nodes.forEach(me))})}o&&this.root.registerSharedNode(o,this),this.options.animate!==!1&&c&&(o||l)&&this.addEventListener("didUpdate",({delta:d,hasLayoutChanged:m,hasRelativeLayoutChanged:p,layout:y})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const g=this.options.transition||c.getDefaultTransition()||zs,{onLayoutAnimationStart:P,onLayoutAnimationComplete:j}=c.getProps(),b=!this.targetLayout||!Ke(this.targetLayout,y),f=!m&&p;if(this.options.layoutRoot||this.resumeFrom||f||m&&(b||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0),this.setAnimationOrigin(d,f);const E={...Ri(g,"layout"),onPlay:P,onComplete:j};(c.shouldReduceMotion||this.options.layoutRoot)&&(E.delay=0,E.type=!1),this.startAnimation(E)}else m||me(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=y})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const n=this.getStack();n&&n.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,nt(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach($s),this.animationId++)}getTransformTemplate(){const{visualElement:n}=this.options;return n&&n.getProps().transformTemplate}willUpdate(n=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&Qe(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let c=0;c<this.path.length;c++){const d=this.path[c];d.shouldResetTransform=!0,d.updateScroll("snapshot"),d.options.layoutRoot&&d.willUpdate(!1)}const{layoutId:r,layout:o}=this.options;if(r===void 0&&!o)return;const l=this.getTransformTemplate();this.prevTransformTemplateValue=l?l(this.latestValues,""):void 0,this.updateSnapshot(),n&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(ue);return}this.isUpdating||this.nodes.forEach(ks),this.isUpdating=!1,this.nodes.forEach(Ms),this.nodes.forEach(Rs),this.nodes.forEach(Ls),this.clearAllSnapshots();const r=Oe.now();V.delta=be(0,1e3/60,r-V.timestamp),V.timestamp=r,V.isProcessing=!0,gt.update.process(V),gt.preRender.process(V),gt.render.process(V),V.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,Le.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(Is),this.sharedNodes.forEach(Os)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,k.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){k.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!L(this.snapshot.measuredBox.x)&&!L(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let o=0;o<this.path.length;o++)this.path[o].updateScroll();const n=this.layout;this.layout=this.measure(!1),this.layoutCorrected=S(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:r}=this.options;r&&r.notify("LayoutMeasure",this.layout.layoutBox,n?n.layoutBox:void 0)}updateScroll(n="measure"){let r=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===n&&(r=!1),r){const o=s(this.instance);this.scroll={animationId:this.root.animationId,phase:n,isRoot:o,offset:i(this.instance),wasRoot:this.scroll?this.scroll.isRoot:o}}}resetTransform(){if(!a)return;const n=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,r=this.projectionDelta&&!Ze(this.projectionDelta),o=this.getTransformTemplate(),l=o?o(this.latestValues,""):void 0,c=l!==this.prevTransformTemplateValue;n&&(r||O(this.latestValues)||c)&&(a(this.instance,l),this.shouldResetTransform=!1,this.scheduleRender())}measure(n=!0){const r=this.measurePageBox();let o=this.removeElementScroll(r);return n&&(o=this.removeTransform(o)),Ws(o),{animationId:this.root.animationId,measuredBox:r,layoutBox:o,latestValues:{},source:this.id}}measurePageBox(){var n;const{visualElement:r}=this.options;if(!r)return S();const o=r.measureViewportBox();if(!(((n=this.scroll)===null||n===void 0?void 0:n.wasRoot)||this.path.some(_s))){const{scroll:c}=this.root;c&&(at(o.x,c.offset.x),at(o.y,c.offset.y))}return o}removeElementScroll(n){var r;const o=S();if(B(o,n),!((r=this.scroll)===null||r===void 0)&&r.wasRoot)return o;for(let l=0;l<this.path.length;l++){const c=this.path[l],{scroll:d,options:m}=c;c!==this.root&&d&&m.layoutScroll&&(d.wasRoot&&B(o,n),at(o.x,d.offset.x),at(o.y,d.offset.y))}return o}applyTransform(n,r=!1){const o=S();B(o,n);for(let l=0;l<this.path.length;l++){const c=this.path[l];!r&&c.options.layoutScroll&&c.scroll&&c!==c.root&&lt(o,{x:-c.scroll.offset.x,y:-c.scroll.offset.y}),O(c.latestValues)&&lt(o,c.latestValues)}return O(this.latestValues)&&lt(o,this.latestValues),o}removeTransform(n){const r=S();B(r,n);for(let o=0;o<this.path.length;o++){const l=this.path[o];if(!l.instance||!O(l.latestValues))continue;$t(l.latestValues)&&l.updateSnapshot();const c=S(),d=l.measurePageBox();B(c,d),oe(r,l.latestValues,l.snapshot?l.snapshot.layoutBox:void 0,c)}return O(this.latestValues)&&oe(r,this.latestValues),r}setTargetDelta(n){this.targetDelta=n,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(n){this.options={...this.options,...n,crossfade:n.crossfade!==void 0?n.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==V.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(n=!1){var r;const o=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=o.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=o.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=o.isSharedProjectionDirty);const l=!!this.resumingFrom||this!==o;if(!(n||l&&this.isSharedProjectionDirty||this.isProjectionDirty||!((r=this.parent)===null||r===void 0)&&r.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:d,layoutId:m}=this.options;if(!(!this.layout||!(d||m))){if(this.resolvedRelativeTargetAt=V.timestamp,!this.targetDelta&&!this.relativeTarget){const p=this.getClosestProjectingParent();p&&p.layout&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=S(),this.relativeTargetOrigin=S(),st(this.relativeTargetOrigin,this.layout.layoutBox,p.layout.layoutBox),B(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}if(!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=S(),this.targetWithTransforms=S()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),Qi(this.target,this.relativeTarget,this.relativeParent.target)):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.layoutBox):B(this.target,this.layout.layoutBox),Li(this.target,this.targetDelta)):B(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget)){this.attemptToResolveRelativeTarget=!1;const p=this.getClosestProjectingParent();p&&!!p.resumingFrom==!!this.resumingFrom&&!p.options.layoutScroll&&p.target&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=S(),this.relativeTargetOrigin=S(),st(this.relativeTargetOrigin,this.target,p.target),B(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}}}getClosestProjectingParent(){if(!(!this.parent||$t(this.parent.latestValues)||Vi(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}calcProjection(){var n;const r=this.getLead(),o=!!this.resumingFrom||this!==r;let l=!0;if((this.isProjectionDirty||!((n=this.parent)===null||n===void 0)&&n.isProjectionDirty)&&(l=!1),o&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(l=!1),this.resolvedRelativeTargetAt===V.timestamp&&(l=!1),l)return;const{layout:c,layoutId:d}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(c||d))return;B(this.layoutCorrected,this.layout.layoutBox);const m=this.treeScale.x,p=this.treeScale.y;Bi(this.layoutCorrected,this.treeScale,this.path,o),r.layout&&!r.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(r.target=r.layout.layoutBox,r.targetWithTransforms=S());const{target:y}=r;if(!y){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(ie(this.prevProjectionDelta.x,this.projectionDelta.x),ie(this.prevProjectionDelta.y,this.projectionDelta.y)),it(this.projectionDelta,this.layoutCorrected,y,this.latestValues),(this.treeScale.x!==m||this.treeScale.y!==p||!he(this.projectionDelta.x,this.prevProjectionDelta.x)||!he(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",y))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(n=!0){var r;if((r=this.options.visualElement)===null||r===void 0||r.scheduleRender(),n){const o=this.getStack();o&&o.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=U(),this.projectionDelta=U(),this.projectionDeltaWithTransform=U()}setAnimationOrigin(n,r=!1){const o=this.snapshot,l=o?o.latestValues:{},c={...this.latestValues},d=U();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!r;const m=S(),p=o?o.source:void 0,y=this.layout?this.layout.source:void 0,g=p!==y,P=this.getStack(),j=!P||P.members.length<=1,b=!!(g&&!j&&this.options.crossfade===!0&&!this.path.some(qs));this.animationProgress=0;let f;this.mixTargetDelta=E=>{const C=E/1e3;pe(d.x,n.x,C),pe(d.y,n.y,C),this.setTargetDelta(d),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(st(m,this.layout.layoutBox,this.relativeParent.layout.layoutBox),Us(this.relativeTarget,this.relativeTargetOrigin,m,C),f&&ws(this.relativeTarget,f)&&(this.isProjectionDirty=!1),f||(f=S()),B(f,this.relativeTarget)),g&&(this.animationValues=c,vs(c,l,this.latestValues,C,b,j)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=C},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(n){this.notifyListeners("animationStart"),this.currentAnimation&&this.currentAnimation.stop(),this.resumingFrom&&this.resumingFrom.currentAnimation&&this.resumingFrom.currentAnimation.stop(),this.pendingAnimation&&(nt(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=k.update(()=>{dt.hasAnimatedSinceResize=!0,this.currentAnimation=ms(0,de,{...n,onUpdate:r=>{this.mixTargetDelta(r),n.onUpdate&&n.onUpdate(r)},onStop:()=>{},onComplete:()=>{n.onComplete&&n.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const n=this.getStack();n&&n.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(de),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const n=this.getLead();let{targetWithTransforms:r,target:o,layout:l,latestValues:c}=n;if(!(!r||!o||!l)){if(this!==n&&this.layout&&l&&ti(this.options.animationType,this.layout.layoutBox,l.layoutBox)){o=this.target||S();const d=L(this.layout.layoutBox.x);o.x.min=n.target.x.min,o.x.max=o.x.min+d;const m=L(this.layout.layoutBox.y);o.y.min=n.target.y.min,o.y.max=o.y.min+m}B(r,o),lt(r,c),it(this.projectionDeltaWithTransform,this.layoutCorrected,r,c)}}registerSharedNode(n,r){this.sharedNodes.has(n)||this.sharedNodes.set(n,new Ds),this.sharedNodes.get(n).add(r);const l=r.options.initialPromotionConfig;r.promote({transition:l?l.transition:void 0,preserveFollowOpacity:l&&l.shouldPreserveFollowOpacity?l.shouldPreserveFollowOpacity(r):void 0})}isLead(){const n=this.getStack();return n?n.lead===this:!0}getLead(){var n;const{layoutId:r}=this.options;return r?((n=this.getStack())===null||n===void 0?void 0:n.lead)||this:this}getPrevLead(){var n;const{layoutId:r}=this.options;return r?(n=this.getStack())===null||n===void 0?void 0:n.prevLead:void 0}getStack(){const{layoutId:n}=this.options;if(n)return this.root.sharedNodes.get(n)}promote({needsReset:n,transition:r,preserveFollowOpacity:o}={}){const l=this.getStack();l&&l.promote(this,o),n&&(this.projectionDelta=void 0,this.needsReset=!0),r&&this.setOptions({transition:r})}relegate(){const n=this.getStack();return n?n.relegate(this):!1}resetSkewAndRotation(){const{visualElement:n}=this.options;if(!n)return;let r=!1;const{latestValues:o}=n;if((o.z||o.rotate||o.rotateX||o.rotateY||o.rotateZ||o.skewX||o.skewY)&&(r=!0),!r)return;const l={};o.z&&Tt("z",n,l,this.animationValues);for(let c=0;c<Ct.length;c++)Tt(`rotate${Ct[c]}`,n,l,this.animationValues),Tt(`skew${Ct[c]}`,n,l,this.animationValues);n.render();for(const c in l)n.setStaticValue(c,l[c]),this.animationValues&&(this.animationValues[c]=l[c]);n.scheduleRender()}getProjectionStyles(n){var r,o;if(!this.instance||this.isSVG)return;if(!this.isVisible)return As;const l={visibility:""},c=this.getTransformTemplate();if(this.needsReset)return this.needsReset=!1,l.opacity="",l.pointerEvents=xt(n==null?void 0:n.pointerEvents)||"",l.transform=c?c(this.latestValues,""):"none",l;const d=this.getLead();if(!this.projectionDelta||!this.layout||!d.target){const g={};return this.options.layoutId&&(g.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,g.pointerEvents=xt(n==null?void 0:n.pointerEvents)||""),this.hasProjected&&!O(this.latestValues)&&(g.transform=c?c({},""):"none",this.hasProjected=!1),g}const m=d.animationValues||d.latestValues;this.applyTransformsToTarget(),l.transform=Ss(this.projectionDeltaWithTransform,this.treeScale,m),c&&(l.transform=c(m,l.transform));const{x:p,y}=this.projectionDelta;l.transformOrigin=`${p.origin*100}% ${y.origin*100}% 0`,d.animationValues?l.opacity=d===this?(o=(r=m.opacity)!==null&&r!==void 0?r:this.latestValues.opacity)!==null&&o!==void 0?o:1:this.preserveOpacity?this.latestValues.opacity:m.opacityExit:l.opacity=d===this?m.opacity!==void 0?m.opacity:"":m.opacityExit!==void 0?m.opacityExit:0;for(const g in Lt){if(m[g]===void 0)continue;const{correct:P,applyTo:j,isCSSVariable:b}=Lt[g],f=l.transform==="none"?m[g]:P(m[g],d);if(j){const E=j.length;for(let C=0;C<E;C++)l[j[C]]=f}else b?this.options.visualElement.renderState.vars[g]=f:l[g]=f}return this.options.layoutId&&(l.pointerEvents=d===this?xt(n==null?void 0:n.pointerEvents)||"":"none"),l}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(n=>{var r;return(r=n.currentAnimation)===null||r===void 0?void 0:r.stop()}),this.root.nodes.forEach(ue),this.root.sharedNodes.clear()}}}function Rs(t){t.updateLayout()}function Ls(t){var e;const i=((e=t.resumeFrom)===null||e===void 0?void 0:e.snapshot)||t.snapshot;if(t.isLead()&&t.layout&&i&&t.hasListeners("didUpdate")){const{layoutBox:s,measuredBox:a}=t.layout,{animationType:u}=t.options,n=i.source!==t.layout.source;u==="size"?I(d=>{const m=n?i.measuredBox[d]:i.layoutBox[d],p=L(m);m.min=s[d].min,m.max=m.min+p}):ti(u,i.layoutBox,s)&&I(d=>{const m=n?i.measuredBox[d]:i.layoutBox[d],p=L(s[d]);m.max=m.min+p,t.relativeTarget&&!t.currentAnimation&&(t.isProjectionDirty=!0,t.relativeTarget[d].max=t.relativeTarget[d].min+p)});const r=U();it(r,s,i.layoutBox);const o=U();n?it(o,t.applyTransform(a,!0),i.measuredBox):it(o,s,i.layoutBox);const l=!Ze(r);let c=!1;if(!t.resumeFrom){const d=t.getClosestProjectingParent();if(d&&!d.resumeFrom){const{snapshot:m,layout:p}=d;if(m&&p){const y=S();st(y,i.layoutBox,m.layoutBox);const g=S();st(g,s,p.layoutBox),Ke(y,g)||(c=!0),d.options.layoutRoot&&(t.relativeTarget=g,t.relativeTargetOrigin=y,t.relativeParent=d)}}}t.notifyListeners("didUpdate",{layout:s,snapshot:i,delta:o,layoutDelta:r,hasLayoutChanged:l,hasRelativeLayoutChanged:c})}else if(t.isLead()){const{onExitComplete:s}=t.options;s&&s()}t.options.transition=void 0}function Vs(t){t.parent&&(t.isProjecting()||(t.isProjectionDirty=t.parent.isProjectionDirty),t.isSharedProjectionDirty||(t.isSharedProjectionDirty=!!(t.isProjectionDirty||t.parent.isProjectionDirty||t.parent.isSharedProjectionDirty)),t.isTransformDirty||(t.isTransformDirty=t.parent.isTransformDirty))}function Bs(t){t.isProjectionDirty=t.isSharedProjectionDirty=t.isTransformDirty=!1}function Is(t){t.clearSnapshot()}function ue(t){t.clearMeasurements()}function ks(t){t.isLayoutDirty=!1}function Ms(t){const{visualElement:e}=t.options;e&&e.getProps().onBeforeLayoutMeasure&&e.notify("BeforeLayoutMeasure"),t.resetTransform()}function me(t){t.finishAnimation(),t.targetDelta=t.relativeTarget=t.target=void 0,t.isProjectionDirty=!0}function Fs(t){t.resolveTargetDelta()}function Ns(t){t.calcProjection()}function $s(t){t.resetSkewAndRotation()}function Os(t){t.removeLeadSnapshot()}function pe(t,e,i){t.translate=A(e.translate,0,i),t.scale=A(e.scale,1,i),t.origin=e.origin,t.originPoint=e.originPoint}function fe(t,e,i,s){t.min=A(e.min,i.min,s),t.max=A(e.max,i.max,s)}function Us(t,e,i,s){fe(t.x,e.x,i.x,s),fe(t.y,e.y,i.y,s)}function qs(t){return t.animationValues&&t.animationValues.opacityExit!==void 0}const zs={duration:.45,ease:[.4,0,.1,1]},ye=t=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(t),ge=ye("applewebkit/")&&!ye("chrome/")?Math.round:z;function xe(t){t.min=ge(t.min),t.max=ge(t.max)}function Ws(t){xe(t.x),xe(t.y)}function ti(t,e,i){return t==="position"||t==="preserve-aspect"&&!Ki(ce(e),ce(i),.2)}function _s(t){var e;return t!==t.root&&((e=t.scroll)===null||e===void 0?void 0:e.wasRoot)}const Gs=Je({attachResizeListener:(t,e)=>bt(t,"resize",e),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}),checkIsScrollRoot:()=>!0}),Et={current:void 0},ei=Je({measureScroll:t=>({x:t.scrollLeft,y:t.scrollTop}),defaultParent:()=>{if(!Et.current){const t=new Gs({});t.mount(window),t.setOptions({layoutScroll:!0}),Et.current=t}return Et.current},resetTransform:(t,e)=>{t.style.transform=e!==void 0?e:"none"},checkIsScrollRoot:t=>window.getComputedStyle(t).position==="fixed"}),Hs={pan:{Feature:cs},drag:{Feature:ls,ProjectionNode:ei,MeasureLayout:He}},Xs={layout:{ProjectionNode:ei,MeasureLayout:He}},Ys=hi({...Fi,...Mi,...Hs,...Xs},ki),ve=qi(Ys),Zs=T.div`
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
`,Ks=T(Zs)`
  width: 100%;

  @media (min-width: 768px) {
    width: 45%;
    max-width: fit-content;
  }
`,ii=T.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  font-style: ${({theme:t})=>t.font};
  width: 100%;
  z-index: 12;
`;function N({className:t,children:e,style:i}){const s=()=>{};return h.jsx(ii,{onChange:s,className:t,style:i,children:e})}function W({className:t,isLongOnMobile:e,children:i,style:s}){return e?h.jsx(Ks,{className:t,style:{...s},children:i}):h.jsx(ii,{className:t,children:i})}const Qs=T.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  max-width: 100vw;

  @media (min-width: 768px) {
    flex-wrap: nowrap;
    max-width: 100%;
  }
`;function Rt({children:t}){return h.jsx(Qs,{className:"address-box",children:t})}Rt.propTypes={children:pt.node.isRequired};const Js=T.div`
  display: contents;
  width: 100%;
  justify-content: space-between;

  @media (min-width: 350px) {
    display: flex;
  }
  @media (min-width: 600px) {
    display: contents;
  }
`;function jn({invoice:t}){var n,r,o,l;const e=yt(),{formState:{errors:i},register:s}=_(),{isDraft:a}=ot(),u=h.jsxs(N,{style:{width:e<768?"100%":""},className:"company-country",children:[h.jsx(M,{htmlFor:"country",style:{color:i!=null&&i.country?"#EC5757":""},children:"Country"}),h.jsx(Be,{type:"text",style:{border:i!=null&&i.country?"1px solid #EC5757":"",width:e<768?"100%":""},defaultValue:t?(n=t==null?void 0:t.senderAddress)==null?void 0:n.country:"",...s("country",{required:!a,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return h.jsxs(h.Fragment,{children:[h.jsxs(N,{className:"company-street-address",children:[h.jsx(M,{htmlFor:"streetAddress",style:{color:i!=null&&i.streetAddress?"#EC5757":""},children:"Street Address"}),h.jsx(Ie,{style:{border:i!=null&&i.streetAddress?"1px solid #EC5757":""},defaultValue:t?(r=t==null?void 0:t.senderAddress)==null?void 0:r.street:"",...s("streetAddress",{required:!a,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:50})})]}),h.jsxs(Rt,{children:[h.jsxs(Js,{children:[h.jsxs(W,{className:"company-city",children:[h.jsx(M,{htmlFor:"city",style:{color:i!=null&&i.city?"#EC5757":""},children:"City"}),h.jsx(ft,{style:{border:i!=null&&i.city?"1px solid #EC5757":""},defaultValue:t?(o=t==null?void 0:t.senderAddress)==null?void 0:o.city:"",type:"text",...s("city",{required:!a,pattern:/[\w ]*/i,maxLength:30})})]}),h.jsxs(W,{style:{justifySelf:"flex-end"},className:"company-postal-code",children:[h.jsx(M,{htmlFor:"postalCode",style:{color:i!=null&&i.postalCode?"#EC5757":""},children:"Post Code"}),h.jsx(ft,{style:{border:i!=null&&i.postalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(l=t==null?void 0:t.senderAddress)==null?void 0:l.postCode:"",...s("postalCode",{required:!a,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]})]}),e<768&&h.jsx(N,{className:"company-country-container",children:u}),e>=768&&h.jsx(W,{className:"company-country-container",children:u})]})]})}const Pe=T.div`
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
`,si=T.input`
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
`,je=T(si)`
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
`,At=T(si).attrs({pattern:"\\d+"})`
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
`,Ce=T(At).attrs({pattern:"[0-9.]*"})`
  width: 80px;
  padding-left: 1.25rem;
  text-align: left;

  @media (min-width: 325px) {
    width: 100px;
    padding-left: 1.25rem;
    text-align: left;
  }
`,Te=T.p`
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
`;const tn=T.div`
  display: grid;
  grid-template: 1fr / 220px 62px 116px 61px 49px;
`,Ee=T.svg`
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
`,tt=T.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: fit-content;
  width: fit-content;
`,en=T(tt)`
  text-align: right;
  @media (min-width: 325px) {
    align-items: flex-start;
    text-align: initial;
  }
`,sn=T.div`
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
`,we=h.jsx("path",{d:"M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z",fillRule:"nonzero",className:"deleteIconPath",tabIndex:0}),nn=T.button`
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
`,Cn=T.svg`
  width: 11px;
  height: 11px;
`,on=T.p`
  color: ${({theme:t})=>t.newItemText};
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  text-align: center;
  letter-spacing: -0.25px;
  margin-left: 0.25rem;
`;function rn({items:t,append:e}){const{clearErrors:i}=_(),{formState:{submitCount:s}}=mi(),a=()=>{e({id:"",name:"",quantity:"",price:"",total:""}),i("itemsError")};return h.jsx(nn,{onClick:a,type:"button",style:{border:s>0&&t.length===0?"1px solid red":"1px solid transparent"},children:h.jsx(on,{children:"+ Add New Item"})})}const an=T.div`
  display: grid;
  width: 100%;
  border-radius: 8px;
  grid-template-rows: auto;
  background-color: ${({theme:t})=>t.formBackground};
`,ln=T.div`
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
`,ut=T(q)`
  justify-self: start;

  @media (min-width: 600px) {
    &.mobile-only-label {
      display: none;
    }
  }
`,cn=T.div`
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
`;function ni({isDraft:t,invoice:e,isEditOpen:i}){const{formState:s,register:a,watch:u,clearErrors:n,setError:r,reset:o}=_(),{fields:l,remove:c,append:d}=Ve({name:"items",rules:{required:!0,minLength:1}}),{errors:m,isSubmitting:p}=s,y=u("items",[]),g=yt(),P=v.useRef(!0);v.useEffect(()=>{!l.length&&!P.current?r("myFieldArray",{type:"required",message:"At least one item is required"}):n("myFieldArray"),P.current&&(P.current=!1)},[l,p]),v.useEffect(()=>{e&&i?o({items:e.items.map(f=>({id:f.id,name:f.name,quantity:f.quantity,price:f.price,total:f.total}))}):i||o({items:[]})},[e,i,o]);const j=f=>{var E,C,x,w,D,R,$,G,H,X,Y,Z,K,Q;return h.jsxs(Pe,{children:[h.jsxs(tt,{style:{width:"100%",marginBottom:"1.5rem"},children:[h.jsx(ut,{style:{marginBottom:"1rem"},children:"Item Name"}),h.jsx(je,{...a(`items[${f}].name`,{required:!t}),placeholder:"Item name",defaultValue:e?(C=(E=e==null?void 0:e.items)==null?void 0:E[f])==null?void 0:C.name:"",type:"text",style:{border:Array.isArray(m.items)&&((w=(x=m==null?void 0:m.items)==null?void 0:x[f])!=null&&w.name)?"1px solid #EC5757":""}})]}),h.jsxs(sn,{children:[h.jsxs(tt,{children:[h.jsx(q,{style:{marginBottom:"0.625rem"},children:"Qty."}),h.jsx(At,{...a(`items[${f}].quantity`,{required:!t,max:100}),placeholder:"0",type:"text",style:{border:Array.isArray(m.items)&&((R=(D=m==null?void 0:m.items)==null?void 0:D[f])!=null&&R.quantity)?"1px solid #EC5757":""},defaultValue:e?(G=($=e==null?void 0:e.items)==null?void 0:$[f])==null?void 0:G.quantity:""})]}),h.jsxs(tt,{children:[h.jsx(q,{style:{marginBottom:"0.625rem"},children:"Price"}),h.jsx(Ce,{...a(`items[${f}].price`,{required:!t,max:1e5}),placeholder:"0.00",type:"text",defaultValue:e?(X=(H=e==null?void 0:e.items)==null?void 0:H[f])==null?void 0:X.price:"",style:{border:Array.isArray(m.items)&&((Z=(Y=m==null?void 0:m.items)==null?void 0:Y[f])!=null&&Z.price)?"1px solid #EC5757":""}})]}),h.jsxs(en,{style:{width:"fit-content"},children:[h.jsx(q,{style:{marginBottom:"0.625rem"},children:"Total"}),h.jsx(Te,{children:(Number((K=y==null?void 0:y[f])==null?void 0:K.quantity)*Number((Q=y==null?void 0:y[f])==null?void 0:Q.price)).toFixed(2)})]})]}),h.jsxs(tt,{children:[h.jsx(q,{style:{marginBottom:"0.625rem"},children:"  "}),h.jsx(Ee,{name:"removeButton",onClick:()=>c(f),children:we})]})]})},b=f=>{var E,C,x,w,D,R,$,G,H,X,Y,Z,K,Q;return h.jsx(Pe,{children:h.jsxs(tn,{children:[h.jsx(je,{...a(`items[${f}].name`,{required:!t}),placeholder:"Item name",defaultValue:e?(C=(E=e==null?void 0:e.items)==null?void 0:E[f])==null?void 0:C.name:"",type:"text",style:{border:Array.isArray(m.items)&&((w=(x=m==null?void 0:m.items)==null?void 0:x[f])!=null&&w.name)?"1px solid #EC5757":""}}),h.jsx(At,{...a(`items[${f}].quantity`,{required:!t,max:100}),placeholder:"0",type:"text",style:{border:Array.isArray(m.items)&&((R=(D=m==null?void 0:m.items)==null?void 0:D[f])!=null&&R.quantity)?"1px solid #EC5757":""},defaultValue:e?(G=($=e==null?void 0:e.items)==null?void 0:$[f])==null?void 0:G.quantity:0}),h.jsx(Ce,{...a(`items[${f}].price`,{required:!t,max:1e5}),placeholder:"0.00",type:"text",defaultValue:e?(X=(H=e==null?void 0:e.items)==null?void 0:H[f])==null?void 0:X.price:0,style:{border:Array.isArray(m.items)&&((Z=(Y=m==null?void 0:m.items)==null?void 0:Y[f])!=null&&Z.price)?"1px solid #EC5757":""}}),h.jsx(Te,{children:(Number((K=y==null?void 0:y[f])==null?void 0:K.quantity)*Number((Q=y==null?void 0:y[f])==null?void 0:Q.price)).toFixed(2)}),h.jsx(Ee,{name:"removeButton",onClick:()=>c(f),children:we})]})})};return h.jsxs(h.Fragment,{children:[h.jsx("ul",{style:{listStyle:"none",marginLeft:"0",paddingLeft:0},children:l.map((f,E)=>h.jsx("li",{"data-testid":"invoice-item",children:h.jsxs("div",{children:[g<600&&j(E),g>=600&&b(E)]})},f.id))}),h.jsx(rn,{append:d,items:e?e.items:[]})]})}ni.propTypes={isDraft:pt.bool.isRequired,isEditOpen:pt.bool};const dn=({className:t})=>h.jsxs(ln,{className:t,children:[h.jsx(ut,{children:"Item Name"}),h.jsx(ut,{children:"Qty."}),h.jsx(ut,{children:"Price"}),h.jsx(q,{children:"Total"})]});function Tn({invoice:t,isEditOpen:e=!1}){const{isDraft:i}=ot();return h.jsxs(an,{"data-testid":"items-container",children:[h.jsx(hn,{children:"Item List"}),h.jsx(dn,{className:"desktop-only-label"}),h.jsx(cn,{children:h.jsx(ni,{isDraft:i,invoice:t,isEditOpen:e})})]})}function un({isEditOpen:t}){const{formState:{errors:e}}=_(),i=()=>Object.keys(e).find(s=>s!=="myFieldArray"&&s!=="items");return h.jsxs(xi,{children:[h.jsx(Vt,{style:{visibility:(i()||e.items)&&t?"visible":"hidden"},children:"- All fields must be added"}),h.jsx(Vt,{style:{visibility:e.myFieldArray&&t?"visible":"hidden"},children:"- An item must be added"})]})}un.propTypes={isEditOpen:pt.bool.isRequired};function En({invoice:t}){var n,r,o,l,c,d;const e=yt(),{formState:{errors:i},register:s}=_(),{isDraft:a}=ot(),u=h.jsxs(N,{style:{width:e<768?"100%":""},className:"client-country",children:[h.jsx(M,{htmlFor:"clientCountry",style:{color:i.clientCountry?"#EC5757":""},children:"Country"}),h.jsx(Be,{$long:!1,style:{border:i!=null&&i.clientCountry?"1px solid #EC5757":"",width:e<768?"100%":""},type:"text",defaultValue:t?(n=t==null?void 0:t.clientAddress)==null?void 0:n.country:"",...s("clientCountry",{required:!a,pattern:/^[A-Za-z0-9 ]+$/i,maxLength:30})})]});return h.jsxs(h.Fragment,{children:[h.jsxs(N,{className:"client-name",children:[h.jsx(M,{htmlFor:"clientName",style:{color:i.clientName?"#EC5757":""},children:"Client's Name"}),((r=i.clientName)==null?void 0:r.type)==="required"&&h.jsx(Bt,{children:"can't be empty"}),h.jsx(wt,{$long:!0,style:{border:i.clientName?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientName:"",...s("clientName",{required:!a})})]}),h.jsxs(N,{className:"client-email",children:[h.jsx(M,{htmlFor:"clientEmail",style:{color:i.clientEmail?"#EC5757":""},children:"Client's Email"}),((o=i.clientEmail)==null?void 0:o.type)==="pattern"&&h.jsx(Bt,{style:{position:"absolute",top:"-8px"},children:"Invalid email"}),h.jsx(wt,{$long:!0,style:{border:i.clientEmail?"1px solid #EC5757":""},type:"text",defaultValue:t?t.clientEmail:"",...s("clientEmail",{required:!a,pattern:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/})})]}),h.jsxs(N,{className:"client-street-address",children:[h.jsx(M,{htmlFor:"clientStreetAddress",style:{color:i.clientStreetAddress?"#EC5757":""},children:"Street Address"}),h.jsx(Ie,{className:"client-street-address",style:{border:i.clientStreetAddress?"1px solid #EC5757":""},defaultValue:t?(l=t==null?void 0:t.clientAddress)==null?void 0:l.street:"",...s("clientStreetAddress",{required:!a})})]}),h.jsxs(Rt,{children:[h.jsxs(W,{className:"client-city",children:[h.jsx(M,{htmlFor:"clientCity",style:{color:i.clientCity?"#EC5757":""},children:"City"}),h.jsx(ft,{style:{border:i.clientCity?"1px solid #EC5757":""},type:"text",defaultValue:t?(c=t==null?void 0:t.clientAddress)==null?void 0:c.city:"",...s("clientCity",{required:!a,pattern:/[\w ]*/i,maxLength:30})})]}),h.jsxs(W,{className:"client-postal-code",children:[h.jsx(M,{htmlFor:"clientPostalCode",style:{color:i.clientPostalCode?"#EC5757":""},children:"Post Code"}),h.jsx(ft,{style:{border:i.clientPostalCode?"1px solid #EC5757":""},type:"text",defaultValue:t?(d=t==null?void 0:t.clientAddress)==null?void 0:d.postCode:"",...s("clientPostalCode",{required:!a,pattern:/^\w+[\w ]+$/i,maxLength:10,minLength:5})})]}),e<768&&h.jsx(N,{className:"client-country",children:u}),e>=768&&h.jsx(W,{className:"client-country",children:u})]})]})}function wn({invoice:t}){const{formState:{errors:e},register:i}=_(),{isDraft:s}=ot();return h.jsx(h.Fragment,{children:h.jsxs(N,{className:"project-description",children:[h.jsx(M,{htmlFor:"projectDescription",style:{color:e.projectDescription?"#EC5757":""},children:"Project Description"}),h.jsx(wt,{type:"text",defaultValue:t==null?void 0:t.description,...i("projectDescription",{required:!s}),style:{border:e.projectDescription?"1px solid #EC5757":""}})]})})}const Dn=()=>{const{id:t}=di(),{startDate:e,setIsDraft:i,setIsNewInvoiceOpen:s,selectedPaymentOption:a,setSelectedPaymentOption:u,methods:n}=ot(),{control:r,trigger:o,reset:l,watch:c,setError:d,clearErrors:m,getValues:p}=n,{replace:y}=Ve({control:r,name:"items"}),g=c(),[P]=kt(gi,{refetchQueries:[{query:yi}],onError:x=>{console.error(x)}}),[j]=kt(fi,{update:(x,{data:{editInvoice:w}})=>{x.writeQuery({query:pi,variables:{getInvoiceById:w.id},data:{getInvoiceById:w}})},onError:x=>{console.error(x)}}),b=()=>{u(1),l(),m(),s(!1)},f=async x=>{if(console.log("Submitting form"),ui.flushSync(()=>i(!1)),x=p(),!x.items){console.log("No items"),d("items",{type:"custom",message:"An item must be added"});return}if(await o()){const D=vt(x,e,a);D.items=D.items.map(R=>({...R,quantity:Number(R.quantity),price:Number(R.price)})),D.status="pending";try{await P({variables:{...D}}),b(),y([{id:It(),name:"",quantity:0,price:0,total:0}])}catch(R){console.error(R)}}},E=async()=>{console.log("Submitting draft"),m();const x=p();x.items||(x.items=[{id:"",name:"",quantity:0,price:0,total:0}]);const w=vt(x,e,a);w.status="draft";try{await P({variables:{...w}}),b(),y([{id:It(),name:"",quantity:0,price:0,total:0}])}catch(D){console.error(D)}},C=async x=>{if(console.log("Submitting update"),await o()){const D=vt(x,e,a);D.id=String(t),D.status="pending";try{await j({variables:{...D}}),s(!1)}catch(R){console.error(R)}}};return v.useEffect(()=>{g.items?m("items"):d("items",{type:"custom",message:"An item must be added"})},[g.items,d]),{methods:n,onSubmit:f,onSubmitDraft:E,onSubmitUpdate:C}},Sn=({children:t})=>{const e=yt();let i=700;e<=616?i=e:e<=768?i=616:i=700;const s={hidden:{x:`${-i}px`},visible:{x:"0"},exit:{x:`${-i}px`}};return h.jsxs(h.Fragment,{children:[h.jsx(ve.div,{initial:{opacity:0},animate:{opacity:.5},exit:{opacity:0},transition:{duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#000",zIndex:1e3,cursor:"pointer"}},"overlay"),h.jsx(ve.div,{variants:s,initial:"hidden",animate:"visible",exit:"exit",transition:{type:"tween",duration:.3,ease:"easeInOut"},style:{position:"fixed",top:0,left:0,width:`${i}px`,height:"100%",color:"#ecf0f1",padding:"20px",zIndex:1001,boxShadow:"2px 0 5px rgba(0,0,0,0.3)"},children:t},"sidebar")]})};export{vn as A,jn as C,wn as D,Tn as E,un as F,Sn as S,En as a,Cn as b,W as c,Dn as u};
