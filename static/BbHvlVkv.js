import{V as Y,a as K,T as B,_ as Z}from"./QSJnIYoz.js";import{V as S,a as A,_ as m,b as N,c as ee,d as ae,e as te}from"./BtlvYZ4j.js";import{u as le}from"./BjMouKnO.js";import{i as E,s as oe,a as se,l as ne,v as j,r as F}from"./8IUFWRbi.js";import{d as re,t as ie,i as d,r as R,D as ue,E as de,v as p,F as G,B as n,A as l,G as t,H as v,y as x,C as T,I as L,x as y,J as U,K as w,z as b,L as $,M as me,N as M}from"./CMvFBe2R.js";import{V as pe}from"./DBNvI86b.js";import{V as ce}from"./Dlx4sKT5.js";import{V as fe,a as ve,b as xe}from"./DvzFIM9K.js";import{V as be,a as ge,b as Ve}from"./C2M0lhmr.js";import"./m0QeiIMv.js";const Ue=re({__name:"discrete-distribution",setup(ye){ie({title:"Probability Calculator - Discrete Probability Distribution"});const o=le(),H=d(()=>{const s=o.distribution,{min:a,max:r}=o.varDomain,e=E(a)?"(-∞":s.isInDomain(o.args,a)?`[${a}`:`(${a}`,i=E(r)?"∞)":s.isInDomain(o.args,r)?`${r}]`:`${r})`;return`Domain: ${e}, ${i}`}),z=[{name:"P(X=L)",value:"left"},{name:"P(X=R)",value:"right"},{name:"P(X≤L)",value:"below"},{name:"P(X≥R)",value:"above"},{name:"P(X<L)",value:"belowExcl"},{name:"P(X>R)",value:"aboveExcl"},{name:"P(L≤X≤R)",value:"between"},{name:"P(X≤L or X≥R)",value:"outside"}],u=d(()=>oe(o.vars)),J=d(()=>o.calcProb(t(u))),O=d(()=>o.calc_.toPercentage_?"%":void 0),W=d(()=>{const{chart_:{points_:s,extended_:a}}=o,[r,e]=u.value,i=a/200,f=Math.ceil((e-r)*i),X=e-r+1+2*f<=s||s===0?se(r-f,e+f,1,F):ne(r-f,e+f,s,F),h=Array(e-r+1+2*f);for(let _=0;_<h.length;_++)h[_]=o.pdf(X[_]);return{labels:X,datasets:[{data:h,backgroundColor:"#0c03"}]}}),g=R(!1),k=[{text:"圖表",value:"chart"},{text:"計算",value:"calc"}],V=R(k[0].value),D=d({get(){return o.chart_.extended_},set(s){isNaN(s)||(o.chart_.extended_=s)}}),q=j(1,5,D,{min:0,max:100}),C=d({get(){return o.chart_.points_},set(s){isNaN(s)||(o.chart_.points_=s)}}),Q=j(50,100,C,{min:50,max:2e3}),I=d({get(){return o.calc_.place_},set(s){!isNaN(s)&&Number.isInteger(s)&&(o.calc_.place_=s)}}),c=R(!0),P=ue({plugins:{legend:{display:!1},tooltip:{callbacks:{label:function(s){const a=s.parsed.x,r=[];return a<=u.value[0]&&r.push("below"),u.value[0]<=a&&a<=u.value[1]&&r.push("between"),a>=u.value[1]&&r.push("above"),`${s.parsed.y} (${r.join(",")})`}}}},scales:{x:{grid:{display:c.value}},y:{min:0,grid:{display:c.value}}}});return de(c,s=>{P.scales.x.grid.display=s,P.scales.y.grid.display=s}),(s,a)=>{const r=Z;return p(),G(pe,{class:"d-flex flex-column h-100 pa-0 bg-white","max-width":"950"},{default:n(()=>[l(te,{noGutters:""},{default:n(()=>[l(S,{class:"elevation-3 px-2 py-4 d-flex flex-wrap justify-space-evenly align-content-start"},{default:n(()=>[l(r,{type:"bar",data:t(W),options:t(P)},{title:n(()=>[a[0]||(v(-1,!0),(a[0]=x("div",{class:"text-center"},[a[13]||(a[13]=T(" Partical Mass Function ")),l(ce,{class:"float-right cursor-pointer",icon:"mdi-cog",onClick:e=>g.value=!0},null,8,["onClick"])])).cacheIndex=0,v(1),a[0])]),_:1},8,["data","options"]),l(Y,{modelValue:t(g),"onUpdate:modelValue":a[8]||(a[8]=e=>L(g)?g.value=e:null),"max-width":"300","min-height":"400"},{default:n(()=>[l(fe,null,{default:n(()=>[l(ve,{tag:"h2",class:"font-weight-bold bg-primary d-flex align-center justify-space-between"},{default:n(()=>[a[14]||(a[14]=T(" 設定 ")),l(be,{icon:"mdi-close",density:"compact",variant:"text",onClick:a[1]||(a[1]=e=>g.value=!1)})]),_:1}),l(ge,{modelValue:t(V),"onUpdate:modelValue":a[2]||(a[2]=e=>L(V)?V.value=e:null),class:"flex-0-0-100",items:k,"bg-color":"blue-grey-darken-2",color:"white",grow:"","hide-slider":""},{default:n(()=>[(p(),y(w,null,U(k,e=>l(Ve,{key:e.value,class:"text-body-1",value:e.value,"base-color":"blue-grey-lighten-3",variant:"tonal",ripple:!1},{default:n(()=>[T(b(e.text),1)]),_:2},1032,["value"])),64))]),_:1},8,["modelValue"]),l(xe,{class:"overflow-y-auto overflow-x-hidden pt-2"},{default:n(()=>[t(V)==="chart"?(p(),y(w,{key:0},[l(K,{modelValue:t(c),"onUpdate:modelValue":a[3]||(a[3]=e=>L(c)?c.value=e:null)},{prepend:n(({id:e})=>[l(A,{for:e.value,class:"ps-0 opacity-100 text-black",style:{width:"100px"},text:"格線"},null,8,["for"])]),_:1},8,["modelValue"]),l(m,{label:"延伸範圍",min:"0",max:"100",suffix:"%","model-value":t(D),"onUpdate:modelValue":a[4]||(a[4]=e=>D.value=+e),onKeydown:t(q)},{prepend:n(({props:e,text:i})=>[x("div",$(e,{class:"text-left"}),b(i),17)]),_:1},8,["model-value","onKeydown"]),l(m,{label:"數量",min:"50",max:"2000",step:"50","model-value":t(C),"onUpdate:modelValue":a[5]||(a[5]=e=>C.value=+e),onKeydown:t(Q)},{prepend:n(({props:e,text:i})=>[x("div",$(e,{class:"text-left"}),b(i),17)]),_:1},8,["model-value","onKeydown"])],64)):t(V)==="calc"?(p(),y(w,{key:1},[l(K,{modelValue:t(o).calc_.toPercentage_,"onUpdate:modelValue":a[6]||(a[6]=e=>t(o).calc_.toPercentage_=e)},{prepend:n(({id:e})=>[l(A,{for:e.value,class:"ps-0 opacity-100 text-black",style:{width:"100px"},text:"百分比"},null,8,["for"])]),_:1},8,["modelValue"]),l(m,{label:"小數位數",min:"0",max:"10",step:"1","model-value":t(I),"onUpdate:modelValue":a[7]||(a[7]=e=>I.value=+e)},{prepend:n(({props:e,text:i})=>[x("div",$(e,{class:"text-left"}),b(i),17)]),_:1},8,["model-value"])],64)):me("",!0)]),_:1})]),_:1})]),_:1},8,["modelValue"]),a[9]||(v(-1,!0),(a[9]=l(N,{class:"w-100 font-weight-bold",label:"計算結果",icon:"information-outline"},{default:n(()=>[l(ee,{activator:"parent",location:"bottom"},{default:n(()=>[x("div",null," L=min(p1,p2)="+b(t(u)[0]),1),x("div",null," R=max(p1,p2)="+b(t(u)[1]),1)]),_:1})]),_:1})).cacheIndex=9,v(1),a[9]),(p(),y(w,null,U(z,e=>l(m,{key:e.name,class:"flex-0-0",param:e,readonly:"",variant:"solo",flat:"",suffix:t(O),"model-value":t(J)[e.value]},null,8,["param","suffix","model-value"])),64))]),_:1}),l(S,{class:"border rounded-md px-2 py-4",cols:"4"},{default:n(()=>[a[10]||(v(-1,!0),(a[10]=M(l(N,{class:"font-weight-bold",label:"參數",icon:"information-outline"},null,512),[[B,"最大、最小值將自動調整","bottom"]])).cacheIndex=10,v(1),a[10]),(p(!0),y(w,null,U(t(o).paramRanges,e=>(p(),G(m,{key:e.name,param:e,"model-value":t(o).args[e.name],"onUpdate:modelValue":i=>t(o).setArg(e.name,+i)},null,8,["param","model-value","onUpdate:modelValue"]))),128)),l(ae,{class:"my-3"}),M(l(N,{class:"font-weight-bold",label:"變數",icon:"information-outline"},null,512),[[B,t(H),"bottom"]]),l(m,{label:"p1=",param:t(o).varDomain,"model-value":t(o).vars[0],"onUpdate:modelValue":a[11]||(a[11]=e=>t(o).setVars(0,e))},null,8,["param","model-value"]),l(m,{label:"p2=",param:t(o).varDomain,"model-value":t(o).vars[1],"onUpdate:modelValue":a[12]||(a[12]=e=>t(o).setVars(1,e))},null,8,["param","model-value"])]),_:1})]),_:1})]),_:1})}}});export{Ue as default};
