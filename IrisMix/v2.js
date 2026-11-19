(()=>{'use strict';
const D=window.IRIS,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],V='assets/v2/';
const I18=(en,zh)=>{const t=(window.IRIS_I18N||{})[en]||{};return `<span class="en">${en}</span><span class="sc">${t.sc||zh}</span><span class="zh">${zh}</span><span class="ja">${t.ja||en}</span><span class="ko">${t.ko||en}</span>`};
const qs=new URLSearchParams(location.search);
const LANGS={en:'en',sc:'zh-Hans',zh:'zh-Hant',ja:'ja',ko:'ko'};
function lang(l){if(!LANGS[l])l='en';document.documentElement.dataset.lang=l;document.documentElement.lang=LANGS[l];$$('.lang button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.l===l));try{localStorage.setItem('iris-lang',l)}catch(e){}}
let saved=null;try{saved=localStorage.getItem('iris-lang')}catch(e){}
lang(qs.get('lang')||saved||'en');$$('.lang button').forEach(b=>b.onclick=()=>lang(b.dataset.l));
function press(list,on){list.forEach(b=>b.setAttribute('aria-pressed',b===on))}
function bindCv(c){const i=$('input',c);const f=()=>c.style.setProperty('--p',i.value+'%');i.addEventListener('input',f);f()}
$$('.cv').forEach(bindCv);
const preload=u=>{const m=new Image();m.src=u};
/* results */
let face=0,look=0,mode='cmp';
const fs=$('#faces'),ls=$('#looks'),rb=$('#res-before'),ra=$('#res-after'),sb=$('#str-before'),sa=$('#str-after'),rr=$('#res-ref');
const lookU=(f,l)=>`${V}looks/${f}__${l}.webp`;
function drawLooks(){const f=D.faces[face];ls.innerHTML='';f.looks.forEach((l,i)=>{const b=document.createElement('button');b.className='th';b.type='button';b.setAttribute('aria-label','Reference '+(i+1));b.setAttribute('aria-pressed',i===look);b.innerHTML=`<img src="${V}refs/${l}.webp" alt="" loading="lazy">`;b.onclick=()=>{look=i;press($$('.th',ls),b);show()};ls.append(b)})}
function show(){const f=D.faces[face],l=f.looks[look],bare=lookU(f.id,'bare');rb.src=sb.src=bare;ra.src=sa.src=lookU(f.id,l);rr.src=`${V}refs/${l}.webp`;f.looks.forEach(x=>preload(lookU(f.id,x)))}
D.faces.forEach((f,i)=>{const b=document.createElement('button');b.className='th';b.type='button';b.setAttribute('aria-label','Source '+(i+1));b.setAttribute('aria-pressed',i===0);b.innerHTML=`<img src="${lookU(f.id,'bare')}" alt="" loading="lazy">`;b.onclick=()=>{face=i;look=0;press($$('.th',fs),b);drawLooks();show()};fs.append(b)});
drawLooks();show();
const seg=$$('#mode button');seg.forEach(b=>b.onclick=()=>{mode=b.dataset.m;press(seg,b);$('#view-cmp').hidden=mode!=='cmp';$('#view-str').hidden=mode!=='str';$('#str-ctl').hidden=mode!=='str'});
const si=$('#str'),so=$('#str-out');const st=()=>{sa.style.opacity=si.value/100;so.textContent=(si.value/100).toFixed(2)};si.oninput=st;st();
/* wall */
const w=$('#wall');const pick=(()=>{const by={};D.wall.forEach(x=>{const f=x.split('__')[0];(by[f]=by[f]||[]).push(x)});const fs=Object.keys(by),o=[];for(let r=0;o.length<18&&r<4;r++)fs.forEach(f=>{if(o.length<18&&by[f][r])o.push(by[f][r])});return o})();(w?pick:[]).forEach(x=>{const d=document.createElement('div');d.innerHTML=`<img src="${V}wall/${x}.webp" alt="" loading="lazy"><img class="b" src="${V}wall/${x.split('__')[0]}__bare.webp" alt="" loading="lazy">`;w.append(d)});
/* comparisons */
let cs=0,mk='mm_chain';const cc=$('#cases'),cm=$('#cmethods');
function drawCmp(){const c=D.cmp[cs],h=c.id;$('#c-src').src=`${V}cmp/${h}_src.webp`;[0,1,2].forEach(i=>$('#c-ref'+i).src=`${V}cmp/${h}_ref${i}.webp`);$('#c-a').src=$('#c-a2').src=`${V}cmp/${h}_${mk}.webp`;$('#c-b').src=`${V}cmp/${h}_ours.webp`;$('#c-s').src=`${V}cmp/${h}_src.webp`;$$('.mname').forEach(e=>e.textContent=D.methodNames[mk])}
D.cmp.forEach((c,i)=>{const b=document.createElement('button');b.className='th';b.type='button';b.setAttribute('aria-label','Look '+(i+1));b.setAttribute('aria-pressed',i===0);b.innerHTML=`<img src="${V}cmp/${c.id}_ours.webp" alt="" loading="lazy">`;b.onclick=()=>{cs=i;press($$('.th',cc),b);drawCmp()};cc.append(b)});
D.cmp[0].methods.forEach(k=>{const b=document.createElement('button');b.type='button';b.textContent=D.methodNames[k];b.setAttribute('aria-pressed',k===mk);b.onclick=()=>{mk=k;press($$('button',cm),b);drawCmp()};cm.append(b)});
drawCmp();
/* tables */
const tb=$$('#tabs button');tb.forEach(b=>b.onclick=()=>{press(tb,b);$$('[data-table]').forEach(t=>t.hidden=t.dataset.table!==b.dataset.t)});
/* lightbox */
const dl=$('dialog');$$('.fig').forEach(b=>b.onclick=()=>{$('img',dl).src=$('img',b).src;dl.showModal()});$('button',dl).onclick=()=>dl.close();dl.onclick=e=>{if(e.target===dl)dl.close()};
/* copy */
$('#copy').onclick=async e=>{try{await navigator.clipboard.writeText($('#bib').textContent);$('#copied').hidden=false}catch(x){}};
/* hero video only when visible */
const hv=$('#hero-video');if(hv&&!matchMedia('(prefers-reduced-motion:reduce)').matches){hv.play().catch(()=>{})}

/* hero: lite file on slow links or small screens, pause button */
(()=>{const v=$('#hero-video'),b=$('#hero-play');if(!v)return;const c=navigator.connection||{};
if(c.saveData||/2g/.test(c.effectiveType||'')||innerWidth<700){$('source',v).src=V+'hero/hero-lite.mp4';v.load()}
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;if(rm){v.removeAttribute('autoplay');v.pause()}
const sync=()=>{const p=v.paused;b.querySelector('span').innerHTML=p?I18('Play','播放'):I18('Pause','暫停');b.setAttribute('aria-label',(p?'Play':'Pause')+' the background video');b.querySelector('path').setAttribute('d',p?'M3 1l8 5-8 5z':'M2 1h3v10H2zM7 1h3v10H7z')};
b.onclick=()=>{v.paused?v.play().catch(()=>{}):v.pause();sync()};v.addEventListener('play',sync);v.addEventListener('pause',sync);sync();
const CAP=[['Transfer a whole look','整組妝容轉移','left: source photo · right: IrisMix render','左：原圖 · 右：IrisMix 渲染結果'],['Transfer a whole look','整組妝容轉移','left: source photo · right: IrisMix render','左：原圖 · 右：IrisMix 渲染結果'],['Transfer a whole look','整組妝容轉移','left: source photo · right: IrisMix render','左：原圖 · 右：IrisMix 渲染結果'],['Transfer a whole look','整組妝容轉移','left: source photo · right: IrisMix render','左：原圖 · 右：IrisMix 渲染結果'],['Glasses off, then a new look','拿掉眼鏡，再換新妝','left: photo with glasses · right: glasses removed, berry look rendered by IrisMix','左：戴眼鏡的照片 · 右：移除眼鏡後，以 IrisMix 渲染莓果色妝容'],['Decompose a reference once','參考只需分解一次','left: reference · right: bare face recovered by the decomposer','左：參考 · 右：分解得到的素顏'],['Apply it to a new face','套用到新的人臉','left: source photo · right: IrisMix render','左：原圖 · 右：IrisMix 渲染結果'],['Compose several references','組合多張參考','left: source photo · right: eyes, face paint and lips from three references','左：原圖 · 右：眼妝、彩繪與唇妝各取自一張參考']],SEG=4.2,ct=$('#hero-cap-text');let lastK=-1;
v.addEventListener('timeupdate',()=>{const k=Math.floor((v.currentTime+.3)/SEG)%CAP.length;if(k===lastK)return;lastK=k;const c=CAP[k];ct.innerHTML=`<b>${I18(c[0],c[1])}</b> · ${I18(c[2],c[3])}`})})();
/* schematic: three ways to revise a look */
(()=>{const root=$('#schem');if(!root)return;const M=V+'mr/';
const R=[{en:'Transfer',zh:'轉移'},{en:'Remove paint',zh:'移除彩繪'},{en:'Restore paint',zh:'還原彩繪'},{en:'Swap eyes',zh:'更換眼妝'}];
const ID={a:[.833,.897,.879,.535],b:[.782,.706,.577,.545],c:[.833,.849,.837,.828]};
const IMG={a:'klein',b:'mad',c:'irismix'};
const PROMPT=[{en:'“Apply the three looks”',zh:'「套用三張參考」'},{en:'“Remove the face paint”',zh:'「移除臉部彩繪」'},{en:'“Restore the face paint”',zh:'「還原臉部彩繪」'},{en:'“Use these eyes”',zh:'「改用這組眼妝」'}];
const L=o=>I18(o.en,o.zh);
const img=(f,a='')=>`<img src="${M}${f}.webp" alt="${a}">`;
const OP={a:{en:'Regenerate the whole image',zh:'整張圖重新生成'},b:{en:'Run the transfer again',zh:'再跑一次轉移'},c:{en:'Recompose + one render',zh:'重新合成 + 一次渲染'}};
['a','b','c'].forEach(k=>{$(`[data-op="${k}"]`,root).innerHTML=L(OP[k]);const t=$(`[data-track="${k}"]`,root);
 R.forEach((r,i)=>{const li=document.createElement('li');li.innerHTML=`${img(IMG[k]+'_'+i)}<i><b style="width:${Math.round(ID[k][i]*100)}%"></b></i>${L(r)}`;li.onclick=()=>{stop();show(i)};t.append(li)})});
function input(k,r){const prev=r?img(IMG[k]+'_'+(r-1),'previous output'):img('source','source');
 if(k==='a')return `${prev}<span class="sc-bubble">${L(PROMPT[r])}</span>`+(r===0||r===3?img(r===3?'ref3':'ref2'):'');
 if(k==='b'){const ref=['ref2','ref0','ref0','ref3'][r];return `${prev}<span class="sc-bubble">${L({en:'+ reference',zh:'+ 參考'})}</span>${img(ref)}`}
 const eyes=r===3?'ref3':'ref2';const chip=(f,en,zh,cls='')=>`<span class="sc-chip ${cls}">${img(f)}${L({en,zh})}</span>`;
 return img('source','source')+chip(eyes,'eyes','眼妝',r===3?'new':'')+chip('ref1','lips','唇妝')+chip('ref0','face paint','彩繪',r===1?'off':(r===2?'new':''));}
let cur=-1,timer=null,vis=false;
function show(r){cur=r;['a','b','c'].forEach(k=>{$(`[data-in="${k}"]`,root).innerHTML=input(k,r);const o=$(`[data-out="${k}"]`,root);o.classList.add('fade');
 setTimeout(()=>{o.src=`${M}${IMG[k]}_${r}.webp`;o.classList.remove('fade')},260);
 $(`[data-rl="${k}"]`,root).innerHTML=`${r+1}/4 · ${L(R[r])}`;const id=$(`[data-id="${k}"]`,root);id.textContent='Face-ID '+ID[k][r].toFixed(2);id.classList.toggle('low',ID[k][r]<.7);
 $$(`[data-track="${k}"] li`,root).forEach((li,i)=>{li.classList.toggle('on',i===r);li.classList.toggle('done',i<r)});
 $$(`.sc-col[data-col="${k}"] .sc-arrow, .sc-col[data-col="${k}"] .sc-op`,root).forEach(e=>{e.classList.remove('go');void e.offsetWidth;e.classList.add('go');setTimeout(()=>e.classList.remove('go'),900)})})}
function stop(){clearInterval(timer);timer=null}
function play(){stop();show(0);timer=setInterval(()=>{if(cur>=3){stop();setTimeout(()=>{if(!timer&&vis)play()},2600);return}show(cur+1)},1900)}
const io=new IntersectionObserver(es=>es.forEach(e=>{vis=e.isIntersecting;if(vis&&!timer&&cur<=0)play()}),{threshold:.3});
$('#sc-replay').onclick=()=>play();
const sb=$$('#sc-seg button');sb.forEach(b=>b.onclick=()=>{press(sb,b);const v=b.dataset.v;$$('.sc-col',root).forEach(c=>c.hidden=v!=='all'&&c.dataset.col!==v);$('.sc-grid',root).classList.toggle('one',v!=='all')});
if(matchMedia('(prefers-reduced-motion:reduce)').matches){show(3)}else{show(0);io.observe(root)}})();


/* makeup workspace: rendered layers stay editable (recolor, opacity, move, reorder, hide, separate); auto demo */
(()=>{const root=$('#ws');if(!root)return;const W=V+'ws/',st=$('#ws-stage'),list=$('#ws-list'),op=$('#ws-op'),sep=$('#ws-sep'),sepv=$('#ws-sepv');
const LY=[{id:'blush',en:'Blush',zh:'腮紅',c:'#c47fcb',pc:'#2E9E62'},{id:'shadow',en:'Eyeshadow',zh:'眼影',c:'#9b6fd6',pc:'#3E7CC9'},{id:'liner',en:'Eyeliner',zh:'眼線',c:'#1a1a1a',pc:'#8A5CC7'},{id:'lips',en:'Lips',zh:'唇妝',c:'#8e4a6a',pc:'#D9455F'}];
const D0=()=>({order:LY.map(l=>l.id),h:{},o:{},x:{},y:{},hide:{},sel:'lips'});let S=D0();
const L2=(en,zh)=>I18(en,zh);
const base=document.createElement('div');base.className='ws-plane base';base.style.setProperty('--z',0);base.innerHTML=`<img src="${W}src.webp" alt="Source face"><span class="ws-tag" style="--pc:#8C8C8C">source T</span>`;st.append(base);
const P={};LY.forEach(l=>{const d=document.createElement('div');d.className='ws-plane';d.style.setProperty('--pc',l.pc);d.innerHTML=`<img src="${W}${l.id}.webp" alt=""><span class="ws-tag">${l.en.toLowerCase()}</span>`;st.append(d);P[l.id]=d});
function draw(){S.order.forEach((id,i)=>{const d=P[id];d.style.setProperty('--z',i+1);d.style.zIndex=i+1;const im=d.querySelector('img');
  im.style.setProperty('--h',(S.h[id]||0)+'deg');im.style.setProperty('--o',(S.o[id]==null?1:S.o[id]));im.style.setProperty('--x',(S.x[id]||0)+'px');im.style.setProperty('--y',(S.y[id]||0)+'px');
  d.classList.toggle('hide',!!S.hide[id]);d.classList.toggle('sel',S.sel===id)});
 list.innerHTML='';[...S.order].reverse().forEach((id,ri)=>{const l=LY.find(q=>q.id===id),n=S.order.length-ri;const li=document.createElement('li');li.dataset.id=id;li.className=S.sel===id?'sel':'';
  li.innerHTML=`<span class="ix">0${n+1}</span><span class="nm"><b>${L2(l.en,l.zh)}</b><small>${L2('rendered layer','渲染後圖層')}</small></span><span class="ct"><span class="sw" style="background:${l.c};filter:hue-rotate(${S.h[id]||0}deg)" title="Recolor"></span><input type="range" min="0" max="100" value="${Math.round(((S.o[id]==null?1:S.o[id]))*100)}" aria-label="Opacity"><button type="button" class="${S.hide[id]?'off':''}" aria-label="Show or hide">◉</button><button type="button" aria-label="Move up">↑</button><button type="button" aria-label="Move down">↓</button></span>`;
  li.onclick=e=>{user();S.sel=id;draw()};const [eye,up,dn]=li.querySelectorAll('button');
  li.querySelector('.sw').onclick=e=>{e.stopPropagation();user();S.sel=id;S.h[id]=((S.h[id]||0)+60)%360;draw()};
  li.querySelector('input').oninput=e=>{user();S.o[id]=e.target.value/100;draw()};li.querySelector('input').onclick=e=>e.stopPropagation();
  eye.onclick=e=>{e.stopPropagation();user();S.hide[id]=!S.hide[id];draw()};
  up.onclick=e=>{e.stopPropagation();user();mv(id,1)};dn.onclick=e=>{e.stopPropagation();user();mv(id,-1)};list.append(li)});
 const lb=document.createElement('li');lb.innerHTML=`<span class="ix">01</span><span class="nm"><b>${L2('Source face','原圖人臉')}</b><small>${L2('locked','鎖定')}</small></span><span class="ct">🔒</span>`;lb.style.cursor='default';list.append(lb)}
function mv(id,d){const i=S.order.indexOf(id),j=i+d;if(j<0||j>=S.order.length)return;[S.order[i],S.order[j]]=[S.order[j],S.order[i]];draw();const li=list.querySelector(`li[data-id="${id}"]`);li&&(li.classList.add('flash'),setTimeout(()=>li.classList.remove('flash'),500))}
function setSep(v){root.style.setProperty('--sep',v);st.style.setProperty('--sep',v);$$('.ws-plane',st).forEach(p=>p.style.setProperty('--sep',v));sep.value=Math.round(v*100);sepv.textContent=Math.round(v*100)+'%'}
sep.oninput=()=>{user();setSep(sep.value/100)};
/* drag the selected layer on the canvas */
let drag=null;st.addEventListener('pointerdown',e=>{if(+sep.value>5)return;user();drag={x:e.clientX,y:e.clientY,x0:S.x[S.sel]||0,y0:S.y[S.sel]||0};st.setPointerCapture(e.pointerId)});
st.addEventListener('pointermove',e=>{if(!drag)return;const k=600/340*.55;S.x[S.sel]=Math.max(-60,Math.min(60,drag.x0+(e.clientX-drag.x)*k));S.y[S.sel]=Math.max(-60,Math.min(60,drag.y0+(e.clientY-drag.y)*k));draw()});
st.addEventListener('pointerup',()=>drag=null);
/* auto demo */
const say=(en,zh)=>{op.innerHTML=L2(en,zh);op.classList.add('on')};
const STEPS=[[0,()=>{S=D0();setSep(0);draw();op.classList.remove('on')}],
 [900,()=>{S.sel='lips';S.h.lips=140;draw();say('Recolor the lips','唇色改色')}],
 [2600,()=>{S.sel='blush';S.o.blush=.35;draw();say('Lower the blush opacity','降低腮紅透明度')}],
 [4300,()=>{S.sel='blush';S.y.blush=-14;S.x.blush=6;draw();say('Move the blush up','把腮紅往上移')}],
 [6000,()=>{S.sel='liner';mv('liner',-1);say('Put the eyeliner under the eyeshadow','眼線移到眼影下面')}],
 [7700,()=>{S.sel='lips';S.hide.lips=true;draw();say('Hide the lips','隱藏唇妝')}],
 [9300,()=>{say('Separate the layers','分離圖層');let t0=performance.now();const f=n=>{const p=Math.min((n-t0)/900,1);setSep(p);if(p<1&&demo)requestAnimationFrame(f)};requestAnimationFrame(f)}],
 [12300,()=>{say('Reassemble, nothing was re-rendered','重新組合，全程沒有重新渲染');let t0=performance.now();const f=n=>{const p=Math.min((n-t0)/900,1);setSep(1-p);if(p<1&&demo)requestAnimationFrame(f)};requestAnimationFrame(f)}],
 [14600,()=>{S=D0();draw();op.classList.remove('on')}]];
let demo=false,timers=[],touched=false;
function run(){stop();if(touched)return;demo=true;STEPS.forEach(([t,f])=>timers.push(setTimeout(()=>{if(demo)f()},t)))}
function stop(){demo=false;timers.forEach(clearTimeout);timers=[]}
function user(){if(!touched){touched=true;stop();op.classList.remove('on');window.dispatchEvent(new CustomEvent('ws-user'))}}
window.wsDemo={run,stop};draw();setSep(0)})();

/* method walkthrough: auto-advance while visible, step buttons, pause */
(()=>{const root=$('#manim');if(!root)return;const sc=$$('.mscene',root),bt=$$('.msteps button',root),pg=$('#m-prog'),pb=$('#m-play');
const DUR=5200,dur=()=>+(sc[k].dataset.dur||DUR);let k=0,t0=0,raf=0,playing=true,vis=false;
function go(i){k=(i+sc.length)%sc.length;sc.forEach((s,j)=>{s.classList.toggle('on',j===k)});press(bt,bt[k]);t0=performance.now();if(window.wsDemo){sc[k].querySelector('#ws')?window.wsDemo.run():window.wsDemo.stop()}}
function tick(now){if(playing&&vis){const p=Math.min((now-t0)/dur(),1);pg.style.width=(p*100)+'%';if(p>=1)go(k+1)}raf=requestAnimationFrame(tick)}
function setPlay(p){playing=p;pb.querySelector('span').innerHTML=p?I18('Pause','暫停'):I18('Play','播放');pb.querySelector('path').setAttribute('d',p?'M2 1h3v10H2zM7 1h3v10H7z':'M3 1l8 5-8 5z');if(p)t0=performance.now()-(parseFloat(pg.style.width)||0)/100*dur()}
bt.forEach((b,i)=>b.onclick=()=>{go(i);setPlay(false);pg.style.width='0%'});window.addEventListener('ws-user',()=>setPlay(false));pb.onclick=()=>setPlay(!playing);
if(matchMedia('(prefers-reduced-motion:reduce)').matches){setPlay(false)}
new IntersectionObserver(es=>es.forEach(e=>{const was=vis;vis=e.isIntersecting;if(vis&&!was&&playing){go(k)}}),{threshold:.35}).observe(root);
go(0);raf=requestAnimationFrame(tick)})();

/* interactive hero (FlashReFocus style): before/after stage, pointer wipe, mode pills, caption card, auto tour */
(()=>{const hs=$('#hstage');if(!hs)return;const M=window.IRIS_STAGE,inner=$('.hs-in',hs),A=$('#hsA'),B=$('#hsB'),line=$('#hsLine'),pills=$('#hsPills'),card=$('#hsCard'),pb=$('#hs-play');
const L5=o=>`<span class="en">${o.en}</span><span class="sc">${o.sc}</span><span class="zh">${o.zh}</span><span class="ja">${o.ja}</span><span class="ko">${o.ko}</span>`;
const SRC=k=>[`${V}stage/${k}_a.webp`,`${V}stage/${k}_b.webp`];
M.modes.forEach((m,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML=L5(m.pill);b.setAttribute('aria-pressed',i===0);b.onclick=()=>{hold=true;setPlay(false);show(i)};pills.append(b)});
function fit(){const r=hs.getBoundingClientRect(),ar=16/9;let w=r.width,h=w/ar;if(h<r.height){h=r.height;w=h*ar}inner.style.width=w+'px';inner.style.height=h+'px'}
addEventListener('resize',fit);fit();
let k=0,pos=.5,auto=true,hold=false,playing=true,t0=performance.now(),inside=false;
function setWipe(p){pos=Math.max(0,Math.min(1,p));const bx=M.box[M.modes[k].k],x=(bx.x0+bx.w*pos)*100;B.style.clipPath=`inset(0 0 0 ${x}%)`;line.style.left=x+'%';line.style.top=(bx.y0*100)+'%';line.style.height=(bx.h*100)+'%'}
function show(i){k=(i+M.modes.length)%M.modes.length;const m=M.modes[k],[a,b]=SRC(m.k);A.src=a;B.src=b;
 $$('button',pills).forEach((x,j)=>x.setAttribute('aria-pressed',j===k));
 card.classList.remove('in');void card.offsetWidth;card.innerHTML=`<div class="k">${L5(m.kick)}</div><div class="t">${L5(m.title)}</div><div class="d">${L5(m.desc)}</div><div class="lr">${L5(m.lr)}</div>`;card.classList.add('in');
 t0=performance.now();setWipe(.82);const n=M.modes[(k+1)%M.modes.length];SRC(n.k).forEach(u=>{const im=new Image();im.src=u})}
const DUR=5600;
function tick(now){if(playing&&!inside){const ph=Math.min((now-t0)/DUR,1);setWipe(.5+.34*Math.cos(Math.PI*1.5*Math.min(ph/.8,1)));if(ph>=1)show(k+1)}requestAnimationFrame(tick)}
hs.addEventListener('pointermove',e=>{const r=inner.getBoundingClientRect(),bx=M.box[M.modes[k].k];const fx=(e.clientX-r.left)/r.width;if(fx<bx.x0-.04){inside=false;return}inside=true;setWipe((fx-bx.x0)/bx.w)});
hs.addEventListener('pointerleave',()=>{inside=false;t0=performance.now()-DUR*.25});
hs.addEventListener('touchmove',e=>{const t=e.touches[0];const r=inner.getBoundingClientRect(),bx=M.box[M.modes[k].k];inside=true;setWipe(((t.clientX-r.left)/r.width-bx.x0)/bx.w)},{passive:true});
function setPlay(p){playing=p;pb.querySelector('svg path').setAttribute('d',p?'M2 1h3v10H2zM7 1h3v10H7z':'M3 1l8 5-8 5z');pb.setAttribute('aria-label',p?'Pause the tour':'Play the tour');if(p)t0=performance.now()}
pb.onclick=()=>setPlay(!playing);
if(matchMedia('(prefers-reduced-motion:reduce)').matches)setPlay(false);
show(0);requestAnimationFrame(tick)})();

/* hero layer playground v3: models carousel; drag layers in/out; recolor, opacity, order, move; brush (erase / restore);
   mirror / symmetric; history (undo / redo, pin A for A/B); before / after; step replay timeline; download layers (zip of PNGs);
   scripted cursor demo with an edit-mode badge. All edits are closed-form operations on the rendered layers. */
(()=>{const root=$('#pg');if(!root)return;const A=V+'play/',META=window.IRIS_PLAY;
const T={
 paint:{en:'Face paint',sc:'彩绘',zh:'彩繪',ja:'フェイスペイント',ko:'페이스 페인팅'},eyes:{en:'Eyes',sc:'眼妆',zh:'眼妝',ja:'アイメイク',ko:'아이 메이크업'},lips:{en:'Lips',sc:'唇妆',zh:'唇妝',ja:'リップ',ko:'립'},
 tray:{en:'Layers',sc:'图层',zh:'圖層',ja:'レイヤー',ko:'레이어'},models:{en:'Models',sc:'模特',zh:'模特兒',ja:'モデル',ko:'모델'},
 hint:{en:'Drag a layer onto the face, or pull one out',sc:'把图层拖到脸上，或拖出来',zh:'把圖層拖到臉上，或拖出來',ja:'レイヤーを顔にドラッグ、または外へ',ko:'레이어를 얼굴로 끌어오거나 밖으로 빼세요'},
 color:{en:'Color',sc:'颜色',zh:'顏色',ja:'カラー',ko:'컬러'},op:{en:'Opacity',sc:'透明度',zh:'透明度',ja:'不透明度',ko:'불투명도'},order:{en:'Order',sc:'顺序',zh:'順序',ja:'重なり順',ko:'순서'},
 mirror:{en:'Mirror',sc:'镜像',zh:'鏡像',ja:'ミラー',ko:'미러'},flip:{en:'Flip',sc:'翻转',zh:'翻轉',ja:'反転',ko:'반전'},sym:{en:'Symmetric',sc:'对称',zh:'對稱',ja:'左右対称',ko:'대칭'},
 brush:{en:'Brush',sc:'笔刷',zh:'筆刷',ja:'ブラシ',ko:'브러시'},erase:{en:'Erase',sc:'擦除',zh:'擦除',ja:'消す',ko:'지우기'},restore:{en:'Restore',sc:'恢复',zh:'補回',ja:'戻す',ko:'복원'},off:{en:'Off',sc:'关闭',zh:'關閉',ja:'オフ',ko:'끄기'},
 reset:{en:'Reset',sc:'恢复默认',zh:'回到預設',ja:'リセット',ko:'초기화'},cmp:{en:'Before / after',sc:'前后对比',zh:'前後對比',ja:'ビフォー / アフター',ko:'전후 비교'},
 ab:{en:'A/B',sc:'A/B',zh:'A/B',ja:'A/B',ko:'A/B'},pin:{en:'Pin A',sc:'设为 A',zh:'設為 A',ja:'A に固定',ko:'A로 고정'},replay:{en:'Replay steps',sc:'步骤回放',zh:'步驟回放',ja:'手順を再生',ko:'단계 재생'},
 dl:{en:'Download layers',sc:'下载图层',zh:'下載圖層',ja:'レイヤーを保存',ko:'레이어 다운로드'},
 before:{en:'Before',sc:'之前',zh:'之前',ja:'ビフォー',ko:'전'},after:{en:'After',sc:'之后',zh:'之後',ja:'アフター',ko:'후'},verA:{en:'Version A',sc:'版本 A',zh:'版本 A',ja:'バージョン A',ko:'버전 A'},now:{en:'Current',sc:'当前',zh:'目前',ja:'現在',ko:'현재'},
 bare:{en:'Bare face',sc:'素颜',zh:'素顏',ja:'すっぴん',ko:'민낯'},
 pinned:{en:'Saved as version A; keep editing, then press A/B',sc:'已存为版本 A，继续编辑后按 A/B',zh:'已存為版本 A，繼續編輯後按 A/B',ja:'バージョン A として保存しました。編集を続けて A/B を押してください',ko:'버전 A로 저장했습니다. 계속 편집한 뒤 A/B를 누르세요'},
 auto:{en:'Auto demo · click to edit',sc:'自动演示中 · 点击即可编辑',zh:'自動示範中 · 點一下即可編輯',ja:'自動デモ中 · クリックで編集',ko:'자동 데모 중 · 클릭하면 편집'},
 edit:{en:'Edit mode · paused',sc:'编辑模式 · 已暂停',zh:'編輯模式 · 已暫停',ja:'編集モード · 一時停止中',ko:'편집 모드 · 일시정지됨'},play:{en:'Play',sc:'播放',zh:'播放',ja:'再生',ko:'재생'},
 s1:{en:'Drag the face paint onto the face',sc:'把彩绘拖到脸上',zh:'把彩繪拖到臉上',ja:'フェイスペイントを顔にドラッグ',ko:'페이스 페인팅을 얼굴로 드래그'},
 s2:{en:'Recolor it',sc:'换个颜色',zh:'換個顏色',ja:'色を変える',ko:'색 바꾸기'},
 s3:{en:'Erase part of it with the brush',sc:'用笔刷擦掉一部分',zh:'用筆刷擦掉一部分',ja:'ブラシで一部を消す',ko:'브러시로 일부 지우기'},
 s4:{en:'Make it symmetric',sc:'做成左右对称',zh:'做成左右對稱',ja:'左右対称にする',ko:'좌우 대칭으로 만들기'},
 s5:{en:'Recolor the lips',sc:'唇色改色',zh:'唇色改色',ja:'リップの色を変える',ko:'립 컬러 변경'},
 s6:{en:'Pull the eye makeup out and put it back',sc:'把眼妆拖出来再放回去',zh:'把眼妝拖出來再放回去',ja:'アイメイクを外して戻す',ko:'아이 메이크업을 빼고 다시 넣기'},
 s7:{en:'Undo the last edit',sc:'撤销上一步',zh:'復原上一步',ja:'直前の編集を取り消す',ko:'마지막 편집 취소'},
 s8:{en:'Compare before and after',sc:'前后对比',zh:'前後對比',ja:'ビフォー・アフターを比較',ko:'전후 비교하기'},
 s9:{en:'Replay the look step by step',sc:'逐步回放这组妆容',zh:'逐步回放這組妝容',ja:'メイクを手順ごとに再生',ko:'메이크업을 단계별로 재생'},
 s10:{en:'Next model',sc:'下一位模特',zh:'下一位模特兒',ja:'次のモデル',ko:'다음 모델'}};
const L5=o=>`<span class="en">${o.en}</span><span class="sc">${o.sc}</span><span class="zh">${o.zh}</span><span class="ja">${o.ja}</span><span class="ko">${o.ko}</span>`;
const HUES=[0,-35,40,140,210];
const hueM=deg=>{const r=deg*Math.PI/180,c=Math.cos(r),s=Math.sin(r);return[.213+c*.787-s*.213,.715-c*.715-s*.715,.072-c*.072+s*.928,.213-c*.213+s*.143,.715+c*.285+s*.140,.072-c*.072-s*.283,.213-c*.213-s*.787,.715-c*.715+s*.715,.072+c*.928+s*.072]};
const swatch=(p,h)=>{const m=hueM(h),c=p.rgb||[150,60,70],b=p.base||[0,0,0],f=v=>Math.max(0,Math.min(255,Math.round(v)));return `rgb(${f(m[0]*c[0]+m[1]*c[1]+m[2]*c[2]+b[0])},${f(m[3]*c[0]+m[4]*c[1]+m[5]*c[2]+b[1])},${f(m[6]*c[0]+m[7]*c[1]+m[8]*c[2]+b[2])})`};
const photo=$('.pg-photo',root),tray=$('.pg-tray',root),tool=$('.pg-tool',root),cur=$('.pg-cursor',root),toast=$('.pg-toast',root),av=$('.pg-models',root),bar=$('.pg-bar',root);
const MW=192,MH=256;
let M=META.order[0],IDS=[],S,CARD={},hist=[],hi=-1,PINA=null,CMP=0,SX=.5,BR=0,BRS=.06,mc={};
/* layer stacks: current (LY) and version A (LA) */
const LA=document.createElement('div');LA.className='pg-layers pg-la';photo.append(LA);
const LY=document.createElement('div');LY.className='pg-layers';photo.append(LY);
const SL=document.createElement('div');SL.className='pg-split';photo.append(SL);
const RP=document.createElement('div');RP.className='pg-replay';photo.append(RP);
const MODE=document.createElement('div');MODE.className='pg-mode';root.append(MODE);
const mid=()=>{const p=META.parts[M];return(p.lips||p.eyes||p.paint).cx};
const D0=()=>({on:Object.fromEntries(IDS.map(i=>[i,true])),x:{},y:{},h:{},o:{},flip:{},sym:{},m:{},order:[...IDS],sel:IDS.includes('lips')?'lips':IDS[0]});
const clone=s=>JSON.parse(JSON.stringify(s));
function build(box){box.innerHTML='';const G={};IDS.forEach(id=>{const g=document.createElement('div');g.className='pg-g';g.innerHTML=`<img src="${A}${M}/${id}.webp" alt=""><img class="mir" src="${A}${M}/${id}.webp" alt="">`;box.append(g);G[id]=g});box._G=G}
function apply(box,st){if(!box._G)return;st.order.forEach((id,i)=>{const g=box._G[id];if(!g)return;g.style.zIndex=2+i;g.style.opacity=st.on[id]?(st.o[id]==null?1:st.o[id]):0;g.style.filter=`hue-rotate(${st.h[id]||0}deg)`;
 const [a,b]=g.children,dx=(st.x[id]||0)*100,dy=(st.y[id]||0)*100,mm=(2*mid()-1)*100,f=!!st.flip[id];
 a.style.transform=f?`translate(${dx+mm}%,${dy}%) scaleX(-1)`:`translate(${dx}%,${dy}%)`;b.style.transform=f?`translate(${dx}%,${dy}%)`:`translate(${dx+mm}%,${dy}%) scaleX(-1)`;
 b.style.display=st.sym[id]?'':'none';const mk=st.m[id]?`url(${st.m[id]})`:'none';[a,b].forEach(e=>{e.style.webkitMaskImage=mk;e.style.maskImage=mk})})}
function draw(){apply(LY,S);IDS.forEach(id=>{CARD[id].classList.toggle('on',!!S.on[id]);CARD[id].classList.toggle('sel',S.sel===id)});tools();bars();split()}
function commit(){hist=hist.slice(0,hi+1);hist.push(clone(S));if(hist.length>40)hist.shift();hi=hist.length-1;bars()}
function restore(st){S=clone(st);Object.keys(mc).forEach(id=>{const c=mc[id].getContext('2d');c.clearRect(0,0,MW,MH);if(S.m[id]){const im=new Image();im.onload=()=>c.drawImage(im,0,0);im.src=S.m[id]}else{c.fillStyle='#fff';c.fillRect(0,0,MW,MH)}});draw()}
function load(m){M=m;IDS=['paint','eyes','lips'].filter(n=>META.parts[m][n]);S=D0();CMP=0;BR=0;PINA=null;mc={};
 IDS.forEach(id=>{const c=document.createElement('canvas');c.width=MW;c.height=MH;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,MW,MH);mc[id]=c});
 $('.pg-src',photo).src=`${A}${m}/src.webp`;build(LY);build(LA);
 $$('.pg-card',tray).forEach(e=>e.remove());CARD={};
 IDS.forEach(id=>{const c=document.createElement('div');c.className='pg-card';c.dataset.id=id;c.innerHTML=`<img src="${A}${m}/${id}_th.webp" alt=""><span>${L5(T[id])}</span><i></i>`;tray.append(c);CARD[id]=c});
 $$('button',av).forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===m));hist=[];hi=-1;commit();draw();
 const n=META.order[(META.order.indexOf(m)+1)%META.order.length];['src','paint','eyes','lips'].forEach(p=>{if(p==='src'||META.parts[n][p]){const i=new Image();i.src=`${A}${n}/${p}.webp`}})}
function split(){const on=CMP>0;LY.style.clipPath=on?`inset(0 0 0 ${SX*100}%)`:'none';LA.style.display=CMP===2?'':'none';LA.style.clipPath=`inset(0 ${100-SX*100}% 0 0)`;
 SL.style.left=(SX*100)+'%';SL.classList.toggle('on',on);SL.innerHTML=`<i></i><em class="l">${L5(CMP===2?T.verA:T.before)}</em><em class="r">${L5(CMP===2?T.now:T.after)}</em>`}
function bars(){bar.innerHTML=`<button data-a="undo" title="Undo" ${hi>0?'':'disabled'}>↶</button><button data-a="redo" title="Redo" ${hi<hist.length-1?'':'disabled'}>↷</button><span class="pg-ver">v${hi+1}/${hist.length}</span>
 <button data-a="cmp" aria-pressed="${CMP===1}">◐ ${L5(T.cmp)}</button><button data-a="ab" aria-pressed="${CMP===2}">${PINA?L5(T.ab):'📌 '+L5(T.pin)}</button>
 <button data-a="replay">▶ ${L5(T.replay)}</button><button data-a="dl">⤓ ${L5(T.dl)}</button><button data-a="reset">↺ ${L5(T.reset)}</button>`;
 $$('button',bar).forEach(b=>b.onclick=()=>{user();act(b.dataset.a)})}
function act(a){if(a==='undo'&&hi>0){hi--;restore(hist[hi])}else if(a==='redo'&&hi<hist.length-1){hi++;restore(hist[hi])}
 else if(a==='cmp'){CMP=CMP===1?0:1;SX=.5;split();bars()}
 else if(a==='ab'){if(!PINA){PINA=clone(S);apply(LA,PINA);say(T.pinned);bars()}else{CMP=CMP===2?0:2;SX=.5;apply(LA,PINA);split();bars()}}
 else if(a==='replay')replay();else if(a==='dl')download();
 else if(a==='reset'){S=D0();IDS.forEach(id=>{const x=mc[id].getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,MW,MH)});CMP=0;BR=0;PINA=null;commit();draw()}}
function tools(){const id=S.sel,o=S.o[id]==null?1:S.o[id],p=META.parts[M][id];
 tool.innerHTML=`<div class="pg-th"><img src="${A}${M}/${id}_th.webp" alt=""><b>${L5(T[id])}</b></div>
 <div class="pg-row"><span>${L5(T.color)}</span>${HUES.map(h=>`<button class="pg-sw${(S.h[id]||0)===h?' on':''}" data-h="${h}" style="background:${swatch(p,h)}" aria-label="color"></button>`).join('')}</div>
 <div class="pg-row"><span>${L5(T.op)}</span><input type="range" min="0" max="100" value="${Math.round(o*100)}" aria-label="Opacity"></div>
 <div class="pg-row"><span>${L5(T.mirror)}</span><button class="pg-tg" data-t="flip" aria-pressed="${!!S.flip[id]}">${L5(T.flip)}</button><button class="pg-tg" data-t="sym" aria-pressed="${!!S.sym[id]}">${L5(T.sym)}</button></div>
 <div class="pg-row"><span>${L5(T.brush)}</span><button class="pg-tg" data-b="0" aria-pressed="${BR===0}">${L5(T.off)}</button><button class="pg-tg" data-b="1" aria-pressed="${BR===1}">${L5(T.erase)}</button><button class="pg-tg" data-b="2" aria-pressed="${BR===2}">${L5(T.restore)}</button></div>
 <div class="pg-row"><span>${L5(T.order)}</span><button class="pg-ob" data-d="1" aria-label="Move up">↑</button><button class="pg-ob" data-d="-1" aria-label="Move down">↓</button></div>`;
 $$('.pg-sw',tool).forEach(b=>b.onclick=()=>{user();S.h[id]=+b.dataset.h;commit();draw()});
 const r=$('input',tool);r.oninput=e=>{user();S.o[id]=e.target.value/100;apply(LY,S)};r.onchange=()=>commit();
 $$('.pg-tg[data-t]',tool).forEach(b=>b.onclick=()=>{user();const k=b.dataset.t;S[k][id]=!S[k][id];commit();draw()});
 $$('.pg-tg[data-b]',tool).forEach(b=>b.onclick=()=>{user();BR=+b.dataset.b;root.classList.toggle('pg-brushing',BR>0);tools()});
 $$('.pg-ob',tool).forEach(b=>b.onclick=()=>{user();mv(id,+b.dataset.d);commit()})}
function mv(id,d){const i=S.order.indexOf(id),j=i+d;if(j<0||j>=S.order.length)return;[S.order[i],S.order[j]]=[S.order[j],S.order[i]];draw()}
/* geometry */
const rel=el=>{const a=el.getBoundingClientRect(),b=root.getBoundingClientRect();return{x:a.left-b.left,y:a.top-b.top,w:a.width,h:a.height}};
const P=id=>META.parts[M][id];
const ptOn=id=>{const r=rel(photo),f=S.flip[id]?2*mid()-P(id).cx-P(id).cx:0;return{x:r.x+(P(id).cx+f+(S.x[id]||0))*r.w,y:r.y+(P(id).cy+(S.y[id]||0))*r.h}};
const ptCard=id=>{const r=rel(CARD[id]);return{x:r.x+r.w*.3,y:r.y+r.h*.5}};
const inPhoto=(x,y)=>{const r=rel(photo);return x>r.x&&x<r.x+r.w&&y>r.y&&y<r.y+r.h};
function pick(x,y){const r=rel(photo);let best=null,bd=.08;S.order.slice().reverse().forEach(id=>{if(!S.on[id])return;const p=ptOn(id),d=Math.hypot((x-p.x)/r.w,(y-p.y)/r.h);if(d<bd){bd=d;best=id}});return best}
/* brush: paint into the selected layer's mask, in the layer's own coordinates (undo the move and the flip) */
function stroke(x,y){const id=S.sel,r=rel(photo);let u=(x-r.x)/r.w-(S.x[id]||0),v=(y-r.y)/r.h-(S.y[id]||0);if(S.flip[id])u=2*mid()-u;
 const c=mc[id].getContext('2d'),R=BRS*MW,g=c.createRadialGradient(u*MW,v*MH,0,u*MW,v*MH,R);
 c.globalCompositeOperation=BR===1?'destination-out':'source-over';g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.beginPath();c.arc(u*MW,v*MH,R,0,7);c.fill();c.globalCompositeOperation='source-over';
 S.m[id]=mc[id].toDataURL();apply(LY,S)}
function place(){const a=photo.getBoundingClientRect(),b=root.getBoundingClientRect();if(innerWidth>1100){const r=(b.right-a.left-tray.offsetWidth-10)+'px';tray.style.right=r;av.style.right=r}else{tray.style.right='';av.style.right=''}}addEventListener('resize',place);
const ghost=document.createElement('div');ghost.className='pg-ghost';root.append(ghost);
function ghostAt(id,x,y,show){ghost.innerHTML=id?`<img src="${A}${M}/${id}_th.webp" alt="">`:'';ghost.style.transform=`translate(${x-30}px,${y-30}px)`;ghost.classList.toggle('on',!!show)}
function flash(id){const g=LY._G[id];g.classList.remove('pop');void g.offsetWidth;g.classList.add('pop')}
let drag=null;
root.addEventListener('pointerdown',e=>{if(e.target.closest('.pg-mode'))return;if(e.target.closest('.pg-tool,.pg-models,.pg-bar')){user();return}user();
 const b=root.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;const card=e.target.closest('.pg-card');
 if(CMP&&!card&&inPhoto(x,y)){const r=rel(photo);if(Math.abs(x-(r.x+SX*r.w))<26){drag={kind:'split',r};root.setPointerCapture(e.pointerId);e.preventDefault();return}}
 if(card){const id=card.dataset.id;S.sel=id;draw();drag={kind:'card',id};ghostAt(id,x,y,true);root.setPointerCapture(e.pointerId);e.preventDefault();return}
 if(inPhoto(x,y)&&BR>0&&S.on[S.sel]){drag={kind:'brush'};stroke(x,y);root.setPointerCapture(e.pointerId);e.preventDefault();return}
 if(inPhoto(x,y)){const id=pick(x,y);if(id){S.sel=id;draw();drag={kind:'layer',id,x0:x,y0:y,ox:S.x[id]||0,oy:S.y[id]||0,r:rel(photo)};root.setPointerCapture(e.pointerId);e.preventDefault()}}});
root.addEventListener('pointermove',e=>{if(!drag)return;const b=root.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;
 if(drag.kind==='split'){SX=Math.max(0,Math.min(1,(x-drag.r.x)/drag.r.w));split();return}
 if(drag.kind==='brush'){stroke(x,y);return}
 if(drag.kind==='card')ghostAt(drag.id,x,y,true);else{S.x[drag.id]=drag.ox+(x-drag.x0)/drag.r.w;S.y[drag.id]=drag.oy+(y-drag.y0)/drag.r.h;apply(LY,S);root.classList.toggle('pg-out',!inPhoto(x,y))}});
root.addEventListener('pointerup',e=>{if(!drag)return;const b=root.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top,k=drag.kind;
 if(k==='split'){drag=null;return}
 if(k==='card'){ghostAt(null,0,0,false);if(inPhoto(x,y)){S.on[drag.id]=true;flash(drag.id)}}
 else if(k==='layer'&&!inPhoto(x,y)){S.on[drag.id]=false;S.x[drag.id]=0;S.y[drag.id]=0}
 root.classList.remove('pg-out');drag=null;commit();draw()});
/* step replay: bare face, then each layer in stacking order */
let rpT=[];function replay(){rpT.forEach(clearTimeout);rpT=[];const keep=clone(S),ord=S.order.filter(id=>keep.on[id]);const n=ord.length;
 const show=k=>{ord.forEach((id,i)=>{S.on[id]=i<k});apply(LY,S);RP.innerHTML=`<div class="pg-steps">${[T.bare,...ord.map(i=>T[i])].map((t,i)=>`<span class="${i===k?'on':i<k?'done':''}">${i}. ${L5(t)}</span>`).join('<i>→</i>')}</div>`;RP.classList.add('on')};
 show(0);for(let k=1;k<=n;k++)rpT.push(setTimeout(()=>show(k),k*1100));rpT.push(setTimeout(()=>{S=keep;apply(LY,S);RP.classList.remove('on')},n*1100+1500));return n*1100+1500}
/* download: each layer as a full-size transparent PNG with its current edits, plus the source and the composite, in one zip */
function loadImg(u){return new Promise(r=>{const i=new Image();i.crossOrigin='anonymous';i.onload=()=>r(i);i.src=u})}
async function layerCanvas(id,W,H){const im=await loadImg(`${A}${M}/${id}.webp`),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
 const one=(fl)=>{x.save();const dx=(S.x[id]||0)*W,dy=(S.y[id]||0)*H;if(fl){x.translate(dx+2*mid()*W,dy);x.scale(-1,1)}else x.translate(dx,dy);x.drawImage(im,0,0,W,H);
  if(S.m[id]){x.globalCompositeOperation='destination-in';x.drawImage(mc[id],0,0,W,H)}x.restore()};
 const t=document.createElement('canvas');t.width=W;t.height=H;const tx=t.getContext('2d');
 for(const fl of S.sym[id]?[!!S.flip[id],!S.flip[id]]:[!!S.flip[id]]){x.clearRect(0,0,W,H);one(fl);tx.drawImage(c,0,0)}
 const d=tx.getImageData(0,0,W,H),m=hueM(S.h[id]||0),o=S.o[id]==null?1:S.o[id],p=d.data;
 for(let i=0;i<p.length;i+=4){const r=p[i],g=p[i+1],b=p[i+2];p[i]=m[0]*r+m[1]*g+m[2]*b;p[i+1]=m[3]*r+m[4]*g+m[5]*b;p[i+2]=m[6]*r+m[7]*g+m[8]*b;p[i+3]*=o}
 tx.putImageData(d,0,0);return t}
async function download(){say(T.dl);if(!window.JSZip)await new Promise(r=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';s.onload=r;document.head.append(s)});
 const src=await loadImg(`${A}${M}/src.webp`),W=src.naturalWidth,H=src.naturalHeight,z=new JSZip(),comp=document.createElement('canvas');comp.width=W;comp.height=H;const cx=comp.getContext('2d');cx.drawImage(src,0,0);
 const blob=c=>new Promise(r=>c.toBlob(r,'image/png'));const sc=document.createElement('canvas');sc.width=W;sc.height=H;sc.getContext('2d').drawImage(src,0,0);z.file('00_source.png',await blob(sc));
 let k=1;for(const id of S.order){if(!S.on[id])continue;const c=await layerCanvas(id,W,H);z.file(`${String(k++).padStart(2,'0')}_${id}_layer.png`,await blob(c));cx.drawImage(c,0,0)}
 z.file('99_composite.png',await blob(comp));const out=await z.generateAsync({type:'blob'}),a=document.createElement('a');a.href=URL.createObjectURL(out);a.download=`irismix_layers_${M}.zip`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
/* toast, mode badge, demo */
let tt=null;const say=o=>{toast.innerHTML=L5(o);toast.classList.add('on');clearTimeout(tt);if(touched)tt=setTimeout(()=>toast.classList.remove('on'),2600)};
function mode(auto){MODE.classList.toggle('auto',auto);MODE.innerHTML=auto?`<span class="dot"></span>${L5(T.auto)}`:`<span>✎ ${L5(T.edit)}</span><button type="button" class="pg-play">▶ ${L5(T.play)}</button>`;const p=$('.pg-play',MODE);p&&(p.onclick=e=>{e.stopPropagation();start()})}
MODE.addEventListener('pointerdown',e=>e.stopPropagation());
av.innerHTML=`<b>${L5(T.models)}</b><div>${META.order.map(m=>`<button type="button" data-m="${m}" aria-label="model"><img src="${A}${m}/avatar.webp" alt=""></button>`).join('')}</div>`;
$$('button',av).forEach(b=>b.onclick=()=>{user();load(b.dataset.m)});
$('.pg-tray-h',root).innerHTML=`<b>${L5(T.tray)}</b><small>${L5(T.hint)}</small>`;
let touched=false,tid=[],gen=0,bot=false;const wait=ms=>new Promise(r=>tid.push(setTimeout(r,ms)));
function cursorTo(p,ms){cur.style.transition=`transform ${ms}ms cubic-bezier(.45,0,.2,1)`;cur.style.transform=`translate(${p.x}px,${p.y}px)`;return wait(ms)}
async function path(g,pts,ms,step){cur.classList.add('down');const n=Math.max(8,ms/30|0);for(let i=1;i<=n;i++){if(g!==gen)return;const t=i/n,seg=t*(pts.length-1),k=Math.min(pts.length-2,seg|0),f=seg-k,p={x:pts[k].x+(pts[k+1].x-pts[k].x)*f,y:pts[k].y+(pts[k+1].y-pts[k].y)*f};cur.style.transition='none';cur.style.transform=`translate(${p.x}px,${p.y}px)`;step&&step(p,t);await wait(ms/n)}cur.classList.remove('down')}
async function click(el){if(!el)return;const r=rel(el);await cursorTo({x:r.x+r.w/2,y:r.y+r.h/2},550);cur.classList.add('down');await wait(130);bot=true;el.click();bot=false;cur.classList.remove('down');await wait(200)}
async function run(g){cur.classList.add('on');while(g===gen){
 S=D0();if(IDS.includes('paint'))S.on.paint=false;hist=[];hi=-1;commit();draw();await wait(500);if(g!==gen)return;
 if(IDS.includes('paint')){say(T.s1);let a=ptCard('paint');await cursorTo(a,750);S.sel='paint';draw();await path(g,[a,ptOn('paint')],1000,p=>ghostAt('paint',p.x,p.y,true));ghostAt(null,0,0,false);if(g!==gen)return;S.on.paint=true;commit();draw();flash('paint');await wait(600);
  say(T.s2);await click($$('.pg-sw',tool)[3]);await wait(500);if(g!==gen)return;
  say(T.s3);await click($('.pg-tg[data-b="1"]',tool));const c=ptOn('paint'),r=rel(photo),w=r.w*.07,pts=[{x:c.x+w,y:c.y-w*.6},{x:c.x+w*1.6,y:c.y},{x:c.x+w,y:c.y+w*.6},{x:c.x+w*1.7,y:c.y+w*.9}];
  await cursorTo(pts[0],500);bot=true;await path(g,pts,1200,p=>stroke(p.x,p.y));bot=false;if(g!==gen)return;commit();await click($('.pg-tg[data-b="0"]',tool));await wait(300);
  say(T.s4);await click($('.pg-tg[data-t="sym"]',tool));await wait(900);if(g!==gen)return}
 if(IDS.includes('lips')){say(T.s5);S.sel='lips';draw();await wait(200);await click($$('.pg-sw',tool)[1]);await wait(600);if(g!==gen)return}
 if(IDS.includes('eyes')){say(T.s6);let a=ptOn('eyes');await cursorTo(a,600);S.sel='eyes';draw();const b=ptCard('eyes'),r2=rel(photo);await path(g,[a,b],900,p=>{S.x.eyes=(p.x-a.x)/r2.w;S.y.eyes=(p.y-a.y)/r2.h;apply(LY,S)});if(g!==gen)return;S.on.eyes=false;S.x.eyes=0;S.y.eyes=0;commit();draw();await wait(400);
  await path(g,[ptCard('eyes'),ptOn('eyes')],900,p=>ghostAt('eyes',p.x,p.y,true));ghostAt(null,0,0,false);if(g!==gen)return;S.on.eyes=true;commit();draw();flash('eyes');await wait(600)}
 say(T.s7);await click($('[data-a="undo"]',bar));await wait(500);await click($('[data-a="redo"]',bar));await wait(400);if(g!==gen)return;
 say(T.s8);await click($('[data-a="cmp"]',bar));{const r=rel(photo);for(const t of [.85,.2,.55]){const y=r.y+r.h*.42,s0={x:r.x+SX*r.w,y};await cursorTo(s0,250);await path(g,[s0,{x:r.x+t*r.w,y}],800,q=>{SX=(q.x-r.x)/r.w;split()});if(g!==gen)return}}await click($('[data-a="cmp"]',bar));if(g!==gen)return;
 say(T.s9);await click($('[data-a="replay"]',bar));await wait(1100*(S.order.length)+1600);if(g!==gen)return;
 say(T.s10);const nm=META.order[(META.order.indexOf(M)+1)%META.order.length];await click($(`button[data-m="${nm}"]`,av));load(nm);await wait(600)}}
function start(){gen++;touched=false;tid.forEach(clearTimeout);tid=[];mode(true);run(gen)}
function user(){if(bot)return;if(touched)return;touched=true;gen++;tid.forEach(clearTimeout);tid=[];mode(false);cur.classList.remove('on','down');toast.classList.remove('on');ghostAt(null,0,0,false)}
load(M);place();mode(true);
if(!matchMedia('(prefers-reduced-motion:reduce)').matches){let st=false;new IntersectionObserver(es=>{if(es[0].isIntersecting&&!st){st=true;start()}},{threshold:.3}).observe(root)}
})();


/* zone mixing: two rendered looks on one face, split by a minimum-cost coverage seam (dynamic programming, as in the paper) */
(()=>{const root=$('#zone');if(!root)return;const Z=V+'zone/',ZM=window.IRIS_ZONE;
const T={a:{en:'Look A',sc:'妆容 A',zh:'妝容 A',ja:'メイク A',ko:'메이크업 A'},b:{en:'Look B',sc:'妆容 B',zh:'妝容 B',ja:'メイク B',ko:'메이크업 B'},
 lr:{en:'Left / right',sc:'左右分区',zh:'左右分區',ja:'左右で分ける',ko:'좌우 분할'},tb:{en:'Upper / lower',sc:'上下分区',zh:'上下分區',ja:'上下で分ける',ko:'상하 분할'},
 face:{en:'Model',sc:'模特',zh:'模特兒',ja:'モデル',ko:'모델'},
 hint:{en:'Drag the seam. It follows the path of least makeup coverage, so it does not cut through a design.',sc:'拖动接缝。接缝会沿着妆容覆盖最少的路径走，不会从图案中间切断。',zh:'拖動接縫。接縫會沿著妝容覆蓋最少的路徑走，不會從圖案中間切斷。',ja:'境界線をドラッグしてください。境界線はメイクの被覆が最も少ない経路をたどるため、デザインの途中で切れません。',ko:'경계선을 드래그하세요. 경계선은 메이크업 커버리지가 가장 적은 경로를 따라가므로 디자인 중간을 자르지 않습니다.'},
 auto:{en:'Auto demo · click to edit',sc:'自动演示中 · 点击即可编辑',zh:'自動示範中 · 點一下即可編輯',ja:'自動デモ中 · クリックで編集',ko:'자동 데모 중 · 클릭하면 편집'},
 edit:{en:'Edit mode · paused',sc:'编辑模式 · 已暂停',zh:'編輯模式 · 已暫停',ja:'編集モード · 一時停止中',ko:'편집 모드 · 일시정지됨'},play:{en:'Play',sc:'播放',zh:'播放',ja:'再生',ko:'재생'}};
const L5=o=>`<span class="en">${o.en}</span><span class="sc">${o.sc}</span><span class="zh">${o.zh}</span><span class="ja">${o.ja}</span><span class="ko">${o.ko}</span>`;
const N=640,G=160,cv=$('canvas.zn-cv',root),ov=$('canvas.zn-ov',root),cx=cv.getContext('2d'),ox=ov.getContext('2d');cv.width=cv.height=ov.width=ov.height=N;
let face=Object.keys(ZM)[0],ia=0,ib=1,mode='lr',p=.5,seam=null,D={},busy=false,touched=false,timer=null,t0=0;
const load=u=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src=u});
async function data(u){if(D[u])return D[u];const im=await load(u),c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');x.drawImage(im,0,0,N,N);return D[u]=x.getImageData(0,0,N,N).data}
function cov(a){const c=new Float32Array(G*G),s=N/G;for(let y=0;y<G;y++)for(let x=0;x<G;x++){let m=0;for(let j=0;j<s;j++)for(let i=0;i<s;i++){const v=a[((y*s+j)*N+x*s+i)*4+3];if(v>m)m=v}c[y*G+x]=m/255}
 const b=new Float32Array(G*G);for(let y=0;y<G;y++)for(let x=0;x<G;x++){let t=0,n=0;for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++){const yy=y+j,xx=x+i;if(yy>=0&&yy<G&&xx>=0&&xx<G){t+=c[yy*G+xx];n++}}b[y*G+x]=t/n}return b}
let CA=null,CB=null;
function dp(){const band=22,c0=Math.round(p*(G-1)),C=(i,j)=>mode==='lr'?(CA[i*G+j]+CB[i*G+j]):(CA[j*G+i]+CB[j*G+i]);
 const lo=Math.max(0,c0-band),hi=Math.min(G-1,c0+band),W=hi-lo+1,E=new Float32Array(G*W),B=new Int8Array(G*W);
 for(let i=0;i<G;i++)for(let k=0;k<W;k++){const j=lo+k,base=C(i,j)+.004*Math.abs(j-c0);if(i===0){E[k]=base;continue}let best=1e9,bk=0;for(let d=-1;d<=1;d++){const kk=k+d;if(kk<0||kk>=W)continue;const v=E[(i-1)*W+kk];if(v<best){best=v;bk=d}}E[i*W+k]=base+best;B[i*W+k]=bk}
 let k=0,m=1e9;for(let kk=0;kk<W;kk++)if(E[(G-1)*W+kk]<m){m=E[(G-1)*W+kk];k=kk}const s=new Float32Array(G);for(let i=G-1;i>=0;i--){s[i]=lo+k;k+=B[i*W+k]}return s}
let BA,BB,BT;
async function prep(){const r=ZM[face];[BT,BA,BB]=await Promise.all([data(`${Z}${face}_bare.webp`),data(`${Z}${face}_${r[ia]}.webp`),data(`${Z}${face}_${r[ib]}.webp`)]);CA=cov(BA);CB=cov(BB)}
function render(){if(!BT)return;seam=dp();const out=cx.createImageData(N,N),o=out.data,s=N/G;
 for(let y=0;y<N;y++){for(let x=0;x<N;x++){const q=(y*N+x)*4;let u;if(mode==='lr'){const sx=(seam[Math.min(G-1,y/s|0)]+.5)*s;u=Math.max(0,Math.min(1,(x-sx)/3+.5))}else{const sy=(seam[Math.min(G-1,x/s|0)]+.5)*s;u=Math.max(0,Math.min(1,(y-sy)/3+.5))}
  const aA=BA[q+3]/255*(1-u),aB=BB[q+3]/255*u;for(let c=0;c<3;c++){let v=BT[q+c];v=aA*BA[q+c]+(1-aA)*v;v=aB*BB[q+c]+(1-aB)*v;o[q+c]=v}o[q+3]=255}}
 cx.putImageData(out,0,0);ox.clearRect(0,0,N,N);ox.setLineDash([7,6]);ox.lineWidth=2.5;ox.strokeStyle='rgba(255,255,255,.95)';ox.shadowColor='rgba(0,0,0,.35)';ox.shadowBlur=3;ox.beginPath();
 for(let i=0;i<G;i++){const a=(i+.5)*s,b=(seam[i]+.5)*s;mode==='lr'?(i?ox.lineTo(b,a):ox.moveTo(b,a)):(i?ox.lineTo(a,b):ox.moveTo(a,b))}ox.stroke();ox.setLineDash([]);
 const m=(seam[G/2|0]+.5)*s,hx=mode==='lr'?m:N/2,hy=mode==='lr'?N/2:m;ox.shadowBlur=6;ox.fillStyle='#fff';ox.beginPath();ox.arc(hx,hy,15,0,7);ox.fill();ox.shadowBlur=0;ox.fillStyle='#4a4248';ox.font='bold 14px sans-serif';ox.textAlign='center';ox.textBaseline='middle';ox.fillText(mode==='lr'?'‹ ›':'︿﹀',hx,hy+1);
 const tag=(t,x,y,col)=>{ox.font='bold 15px sans-serif';const w=ox.measureText(t).width+18;ox.fillStyle=col;ox.beginPath();ox.roundRect(x-w/2,y-13,w,26,13);ox.fill();ox.fillStyle='#fff';ox.fillText(t,x,y+1)};
 if(mode==='lr'){tag('A',Math.max(30,m/2),30,'#3E7CC9');tag('B',Math.min(N-30,(m+N)/2),30,'#c4567a')}else{tag('A',30,Math.max(24,m/2),'#3E7CC9');tag('B',30,Math.min(N-24,(m+N)/2),'#c4567a')}}
let raf=0;const req=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;render()})};
function ui(){const r=ZM[face];
 $('.zn-faces',root).innerHTML=`<span>${L5(T.face)}</span>`+Object.keys(ZM).map(f=>`<button data-f="${f}" aria-pressed="${f===face}"><img src="${Z}${f}_bare.webp" alt=""></button>`).join('');
 $('.zn-a',root).innerHTML=`<span>${L5(T.a)}</span>`+r.map((x,i)=>`<button data-i="${i}" aria-pressed="${i===ia}" ${i===ib?'disabled':''}><img src="${Z}ref_${x}.webp" alt=""></button>`).join('');
 $('.zn-b',root).innerHTML=`<span>${L5(T.b)}</span>`+r.map((x,i)=>`<button data-i="${i}" aria-pressed="${i===ib}" ${i===ia?'disabled':''}><img src="${Z}ref_${x}.webp" alt=""></button>`).join('');
 $('.zn-mode',root).innerHTML=`<button data-m="lr" aria-pressed="${mode==='lr'}">${L5(T.lr)}</button><button data-m="tb" aria-pressed="${mode==='tb'}">${L5(T.tb)}</button>`;
 $$('.zn-faces button',root).forEach(b=>b.onclick=async()=>{user();face=b.dataset.f;ia=0;ib=1;ui();await prep();req()});
 $$('.zn-a button',root).forEach(b=>b.onclick=async()=>{user();ia=+b.dataset.i;ui();await prep();req()});
 $$('.zn-b button',root).forEach(b=>b.onclick=async()=>{user();ib=+b.dataset.i;ui();await prep();req()});
 $$('.zn-mode button',root).forEach(b=>b.onclick=()=>{user();mode=b.dataset.m;p=.5;ui();req()})}
$('.zn-hint',root).innerHTML=L5(T.hint);
let drag=false;const pos=e=>{const r=ov.getBoundingClientRect();return mode==='lr'?(e.clientX-r.left)/r.width:(e.clientY-r.top)/r.height};
ov.addEventListener('pointerdown',e=>{user();drag=true;ov.setPointerCapture(e.pointerId);p=Math.max(.08,Math.min(.92,pos(e)));req()});
ov.addEventListener('pointermove',e=>{if(!drag)return;p=Math.max(.08,Math.min(.92,pos(e)));req()});ov.addEventListener('pointerup',()=>drag=false);
const MB=$('.zn-mode-badge',root);function badge(auto){MB.innerHTML=auto?`<span class="dot"></span>${L5(T.auto)}`:`<span>✎ ${L5(T.edit)}</span><button type="button" class="pg-play">▶ ${L5(T.play)}</button>`;MB.classList.toggle('auto',auto);const b=$('.pg-play',MB);b&&(b.onclick=()=>{touched=false;badge(true);demo()})}
function user(){if(touched)return;touched=true;clearInterval(timer);badge(false)}
let step=0;function demo(){clearInterval(timer);t0=performance.now();timer=setInterval(async()=>{if(touched){clearInterval(timer);return}const t=(performance.now()-t0)/1000;p=.5+.22*Math.sin(t*.9);req();
 if(t>7*(step+1)){step++;if(step%3===1){mode=mode==='lr'?'tb':'lr';p=.5;ui()}else if(step%3===2){ib=(ib+1)%ZM[face].length;if(ib===ia)ib=(ib+1)%ZM[face].length;ui();await prep()}else{face=Object.keys(ZM)[(Object.keys(ZM).indexOf(face)+1)%Object.keys(ZM).length];ia=0;ib=1;ui();await prep()}}},60)}
ui();prep().then(()=>{render();badge(true);if(!matchMedia('(prefers-reduced-motion:reduce)').matches){let st=false;new IntersectionObserver(es=>{if(es[0].isIntersecting&&!st){st=true;demo()}},{threshold:.3}).observe(root)}})})();

/* skin-tone slider: one decomposed look rendered on five faces ordered by measured skin tone (ITA) */
(()=>{const root=$('#tone');if(!root)return;const TD=V+'tone/',TM=window.IRIS_TONE,F=TM.faces,n=F.length;
const T={made:{en:'Made up',sc:'上妆',zh:'上妝',ja:'メイク後',ko:'메이크업 후'},bare:{en:'Bare face',sc:'素颜',zh:'素顏',ja:'すっぴん',ko:'민낯'},
 track:{en:'Skin tone, measured on the bare cheeks (ITA°)',sc:'肤色（在素颜脸颊上测得的 ITA°）',zh:'膚色（在素顏臉頰上測得的 ITA°）',ja:'肌の色（すっぴんの頬で測った ITA°）',ko:'피부 톤 (민낯 볼에서 측정한 ITA°)'},
 light:{en:'lighter',sc:'较浅',zh:'較淺',ja:'明るい',ko:'밝은'},deep:{en:'deeper',sc:'较深',zh:'較深',ja:'深い',ko:'깊은'},ref:{en:'Reference, decomposed once',sc:'参考图，只分解一次',zh:'參考圖，只分解一次',ja:'参照画像（分解は1回）',ko:'참조 이미지(한 번만 분해)'},
 auto:{en:'Auto demo · click to edit',sc:'自动演示中 · 点击即可编辑',zh:'自動示範中 · 點一下即可編輯',ja:'自動デモ中 · クリックで編集',ko:'자동 데모 중 · 클릭하면 편집'},
 edit:{en:'Edit mode · paused',sc:'编辑模式 · 已暂停',zh:'編輯模式 · 已暫停',ja:'編集モード · 一時停止中',ko:'편집 모드 · 일시정지됨'},play:{en:'Play',sc:'播放',zh:'播放',ja:'再生',ko:'재생'}};
const L5=o=>`<span class="en">${o.en}</span><span class="sc">${o.sc}</span><span class="zh">${o.zh}</span><span class="ja">${o.ja}</span><span class="ko">${o.ko}</span>`;
const st=$('.tn-stage',root),rg=$('.tn-range',root),tr=$('.tn-track',root);let v=0,made=true,touched=false,raf=0,t0=0;
const imgs=F.map(f=>{const a=document.createElement('img');a.src=`${TD}src${f.k}.webp`;a.className='b';a.alt='';const b=document.createElement('img');b.src=`${TD}out${f.k}.webp`;b.className='m';b.alt='';const d=document.createElement('div');d.className='tn-f';d.append(a,b);st.append(d);return d});
const rgb=c=>`rgb(${c[0]},${c[1]},${c[2]})`;
tr.style.background=`linear-gradient(90deg,${F.map((f,i)=>rgb(f.skin)+' '+(i/(n-1)*100)+'%').join(',')})`;
$('.tn-ticks',root).innerHTML=F.map((f,i)=>`<span style="left:${i/(n-1)*100}%"><i style="background:${rgb(f.skin)}"></i>${f.ita}°</span>`).join('');
$('.tn-lab',root).innerHTML=`<span>${L5(T.light)}</span><b>${L5(T.track)}</b><span>${L5(T.deep)}</span>`;
$('.tn-ref',root).innerHTML=`<img src="${TD}ref.webp" alt=""><small>${L5(T.ref)}</small>`;
const seg=$('.tn-seg',root);function segUI(){seg.innerHTML=`<button data-m="0" aria-pressed="${!made}">${L5(T.bare)}</button><button data-m="1" aria-pressed="${made}">${L5(T.made)}</button>`;$$('button',seg).forEach(b=>b.onclick=()=>{user();made=b.dataset.m==='1';show()})}
function show(){const i0=Math.floor(Math.min(v,n-1-1e-6)),fr=v-i0;imgs.forEach((d,i)=>{d.style.opacity=i===i0?1:(i===i0+1?fr:0);d.style.zIndex=i===i0+1?2:1;d.classList.toggle('made',made)});rg.value=v*100/(n-1);segUI()}
rg.oninput=()=>{user();v=rg.value/100*(n-1);show()};
const MB=$('.tn-badge',root);function badge(a){MB.innerHTML=a?`<span class="dot"></span>${L5(T.auto)}`:`<span>✎ ${L5(T.edit)}</span><button type="button" class="pg-play">▶ ${L5(T.play)}</button>`;MB.classList.toggle('auto',a);const b=$('.pg-play',MB);b&&(b.onclick=()=>{touched=false;badge(true);demo()})}
function user(){if(touched)return;touched=true;clearInterval(raf);badge(false)}
function demo(){clearInterval(raf);t0=performance.now();raf=setInterval(()=>{if(touched){clearInterval(raf);return}const t=(performance.now()-t0)/1000,per=2.4,seq=2*(n-1),c=(t/per)%seq,k=Math.floor(c),f=c-k,e=f<.65?0:(f-.65)/.35,s=e*e*(3-2*e);const a0=k<n-1?k:seq-k,a1=k<n-1?k+1:seq-k-1;v=a0+(a1-a0)*s;made=!((t%(per*2))>per*2-.9);show()},50)}
st.addEventListener('pointerdown',()=>{user();made=!made;show()});
show();badge(true);
if(!matchMedia('(prefers-reduced-motion:reduce)').matches){let s=false;new IntersectionObserver(es=>{if(es[0].isIntersecting&&!s){s=true;demo()}},{threshold:.3}).observe(root)}})();

/* lip mood board: four rendered lip layers blended linearly in closed form (weights normalized) */
(()=>{const root=$('#mood');if(!root)return;const MD=V+'mood/',N=560;
const T={names:[{en:'Red',sc:'正红',zh:'正紅',ja:'レッド',ko:'레드'},{en:'Wine',sc:'酒红',zh:'酒紅',ja:'ワイン',ko:'와인'},{en:'Soft rose',sc:'柔和豆沙',zh:'柔和豆沙',ja:'ソフトローズ',ko:'소프트 로즈'},{en:'Violet',sc:'紫色',zh:'紫色',ja:'バイオレット',ko:'바이올렛'}],
 mix:{en:'Mixed color',sc:'混合后的颜色',zh:'混合後的顏色',ja:'混ぜた色',ko:'혼합된 색'},bare:{en:'Bare lips',sc:'素颜唇',zh:'素顏唇',ja:'素の唇',ko:'민낯 입술'},
 auto:{en:'Auto demo · click to edit',sc:'自动演示中 · 点击即可编辑',zh:'自動示範中 · 點一下即可編輯',ja:'自動デモ中 · クリックで編集',ko:'자동 데모 중 · 클릭하면 편집'},
 edit:{en:'Edit mode · paused',sc:'编辑模式 · 已暂停',zh:'編輯模式 · 已暫停',ja:'編集モード · 一時停止中',ko:'편집 모드 · 일시정지됨'},play:{en:'Play',sc:'播放',zh:'播放',ja:'再生',ko:'재생'}};
const L5=o=>`<span class="en">${o.en}</span><span class="sc">${o.sc}</span><span class="zh">${o.zh}</span><span class="ja">${o.ja}</span><span class="ko">${o.ko}</span>`;
const cv=$('canvas',root),cx=cv.getContext('2d');cv.width=cv.height=N;let w=[1,0,1,0],src=null,lips=[],touched=false,tm=null,t0=0;
const load=u=>new Promise(r=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');x.drawImage(i,0,0,N,N);r(x.getImageData(0,0,N,N).data)};i.src=u});
const sl=$('.md-sliders',root);
sl.innerHTML=T.names.map((nm,k)=>`<label class="md-row"><img src="${MD}ref${k}.webp" alt=""><span>${L5(nm)}</span><input type="range" min="0" max="100" value="${w[k]*100}" data-k="${k}" aria-label="weight"><b>0%</b></label>`).join('');
const ins=$$('input',sl),pct=$$('b',sl),sw=$('.md-sw',root);
function render(){if(!src)return;const s=w.reduce((a,b)=>a+b,0),out=cx.createImageData(N,N),o=out.data;let r=0,g=0,b=0,n=0;
 for(let q=0;q<o.length;q+=4){let aa=0,K0=0,K1=0,K2=0;if(s>0)for(let k=0;k<4;k++){if(!w[k])continue;const L=lips[k],a=L[q+3]/255*w[k]/s;aa+=a;K0+=a*L[q];K1+=a*L[q+1];K2+=a*L[q+2]}
  o[q]=K0+(1-aa)*src[q];o[q+1]=K1+(1-aa)*src[q+1];o[q+2]=K2+(1-aa)*src[q+2];o[q+3]=255;if(aa>.35){r+=o[q];g+=o[q+1];b+=o[q+2];n++}}
 cx.putImageData(out,0,0);ins.forEach((e,k)=>{e.value=w[k]*100;pct[k].textContent=s?Math.round(w[k]/s*100)+'%':'0%'});
 sw.innerHTML=n?`<i style="background:rgb(${r/n|0},${g/n|0},${b/n|0})"></i>${L5(T.mix)}`:`<i></i>${L5(T.bare)}`}
let raf=0;const req=()=>{if(raf)return;raf=setTimeout(()=>{raf=0;render()},16)};
ins.forEach(e=>e.oninput=()=>{user();w[+e.dataset.k]=e.value/100;req()});
const MB=$('.md-badge',root);function badge(a){MB.innerHTML=a?`<span class="dot"></span>${L5(T.auto)}`:`<span>✎ ${L5(T.edit)}</span><button type="button" class="pg-play">▶ ${L5(T.play)}</button>`;MB.classList.toggle('auto',a);const b=$('.pg-play',MB);b&&(b.onclick=()=>{touched=false;badge(true);demo()})}
function user(){if(touched)return;touched=true;clearInterval(tm);badge(false)}
const P=[[1,0,0,0],[1,0,1,0],[0,1,1,0],[0,1,0,1],[0,0,1,1],[1,1,1,1],[0,0,1,0]];
function demo(){clearInterval(tm);t0=performance.now();tm=setInterval(()=>{if(touched){clearInterval(tm);return}const t=(performance.now()-t0)/1000,per=2.6,k=Math.floor(t/per)%P.length,f=(t/per)%1,e=f<.6?0:(f-.6)/.4,s=e*e*(3-2*e),a=P[k],b=P[(k+1)%P.length];w=a.map((x,i)=>x+(b[i]-x)*s);req()},60)}
cv.addEventListener('pointerdown',user);
Promise.all([load(MD+'src.webp'),...[0,1,2,3].map(k=>load(`${MD}lip${k}.webp`))]).then(([s,...l])=>{src=s;lips=l;render();badge(true);
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches){let st=false;new IntersectionObserver(es=>{if(es[0].isIntersecting&&!st){st=true;demo()}},{threshold:.3}).observe(root)}})})();

/* group photo: before / after wipe, auto sweep until touched */
(()=>{const root=$('#group');if(!root)return;const st=$('.gp-stage',root),b=$('img.b',st),ln=$('.gp-line',st);let p=.5,touched=false,tm=null,t0=0;
function set(x){p=Math.max(0,Math.min(1,x));b.style.clipPath=`inset(0 0 0 ${p*100}%)`;ln.style.left=p*100+'%'}
const pos=e=>{const r=st.getBoundingClientRect();return((e.touches?e.touches[0].clientX:e.clientX)-r.left)/r.width};
let drag=false;st.addEventListener('pointerdown',e=>{touched=true;clearInterval(tm);drag=true;st.setPointerCapture(e.pointerId);set(pos(e))});
st.addEventListener('pointermove',e=>{if(drag)set(pos(e))});st.addEventListener('pointerup',()=>drag=false);
set(.5);if(!matchMedia('(prefers-reduced-motion:reduce)').matches){let s=false;new IntersectionObserver(es=>{if(es[0].isIntersecting&&!s){s=true;t0=performance.now();tm=setInterval(()=>{if(touched)return clearInterval(tm);const t=(performance.now()-t0)/1000;set(.5+.42*Math.sin(t*.8))},40)}},{threshold:.3}).observe(root)}})();

/* layer lab: random mix by part, recipe card (color, coverage, location, copy hex), compare two looks with a difference map */
(()=>{const root=$('#lab');if(!root)return;const Z=V+'zone/',ZM=window.IRIS_ZONE,N=640;
const T={rand:{en:'Random mix',sc:'随机混搭',zh:'隨機混搭',ja:'ランダムに組み合わせ',ko:'무작위 조합'},
 recipe:{en:'Recipe',sc:'配方',zh:'配方',ja:'レシピ',ko:'레시피'},pin:{en:'Pin as A',sc:'设为 A',zh:'設為 A',ja:'A に固定',ko:'A로 고정'},
 cmp:{en:'Compare with A',sc:'与 A 比较',zh:'與 A 比較',ja:'A と比較',ko:'A와 비교'},face:{en:'Model',sc:'模特',zh:'模特兒',ja:'モデル',ko:'모델'},
 eyes:{en:'Eyes',sc:'眼妆',zh:'眼妝',ja:'アイメイク',ko:'아이 메이크업'},lips:{en:'Lips',sc:'唇妆',zh:'唇妝',ja:'リップ',ko:'립'},other:{en:'Face paint and cheeks',sc:'彩绘与脸颊',zh:'彩繪與臉頰',ja:'フェイスペイントと頬',ko:'페이스 페인팅과 볼'},
 from:{en:'from look',sc:'取自妆容',zh:'取自妝容',ja:'使用メイク',ko:'가져온 메이크업'},color:{en:'Color',sc:'颜色',zh:'顏色',ja:'カラー',ko:'컬러'},area:{en:'Coverage',sc:'覆盖面积',zh:'覆蓋面積',ja:'被覆面積',ko:'커버리지'},
 ofFace:{en:'of the face',sc:'占脸部',zh:'占臉部',ja:'顔に対して',ko:'얼굴 대비'},copy:{en:'Copy',sc:'复制',zh:'複製',ja:'コピー',ko:'복사'},copied:{en:'Copied',sc:'已复制',zh:'已複製',ja:'コピーしました',ko:'복사됨'},
 none:{en:'none',sc:'无',zh:'無',ja:'なし',ko:'없음'},diff:{en:'Where the two looks differ (color difference ΔE)',sc:'两组妆容不同之处（色差 ΔE）',zh:'兩組妝容不同之處（色差 ΔE）',ja:'2つのメイクの違い（色差 ΔE）',ko:'두 메이크업의 차이(색차 ΔE)'},
 same:{en:'nearly the same',sc:'几乎相同',zh:'幾乎相同',ja:'ほぼ同じ',ko:'거의 같음'},cur:{en:'Current',sc:'当前',zh:'目前',ja:'現在',ko:'현재'},
 hint:{en:'Pin a mix as A, change it, then compare: the map marks where the colors changed and the list gives the difference for each part.',sc:'把一组混搭设为 A，修改后再比较：差异图会标出颜色改变的位置，列表给出每个部位的色差。',zh:'把一組混搭設為 A，修改後再比較：差異圖會標出顏色改變的位置，列表會列出每個部位的色差。',ja:'組み合わせを A に固定して変更してから比較すると、色が変わった場所がマップに示され、パーツごとの差が一覧に表示されます。',ko:'조합을 A로 고정하고 바꾼 뒤 비교하면, 지도에 색이 바뀐 위치가 표시되고 목록에 부위별 차이가 나옵니다.'}};
const L5=o=>`<span class="en">${o.en}</span><span class="sc">${o.sc}</span><span class="zh">${o.zh}</span><span class="ja">${o.ja}</span><span class="ko">${o.ko}</span>`;
const PARTS=['eyes','lips','other'];
const cv=$('.lb-cv',root),cx=cv.getContext('2d'),ca=$('.lb-a',root),cax=ca.getContext('2d'),cd=$('.lb-d',root),cdx=cd.getContext('2d');[cv,ca,cd].forEach(c=>c.width=c.height=N);
let face=Object.keys(ZM)[0],pick={eyes:0,lips:1,other:2},bare=null,masks=null,lay={},A=null,view='mix',touched=false,tm=null;
const data=u=>new Promise(r=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');x.drawImage(i,0,0,N,N);r(x.getImageData(0,0,N,N).data)};i.src=u});
async function prep(){[bare,masks]=await Promise.all([data(`${Z}${face}_bare.webp`),data(`${Z}${face}_parts.png`)]);lay={};await Promise.all(ZM[face].map(async(r,i)=>{lay[i]=await data(`${Z}${face}_${r}.webp`)}))}
function compose(p){const o=new Uint8ClampedArray(N*N*4);for(let q=0;q<o.length;q+=4){const m=[masks[q]/255,masks[q+1]/255,masks[q+2]/255];let r=bare[q],g=bare[q+1],b=bare[q+2];
  for(let k=0;k<3;k++){if(!m[k]||p[PARTS[k]]<0)continue;const L=lay[p[PARTS[k]]],a=L[q+3]/255*m[k];r=a*L[q]+(1-a)*r;g=a*L[q+1]+(1-a)*g;b=a*L[q+2]+(1-a)*b}o[q]=r;o[q+1]=g;o[q+2]=b;o[q+3]=255}return o}
const lab=(r,g,b)=>{const f=v=>{v/=255;return v>.04045?Math.pow((v+.055)/1.055,2.4):v/12.92};const R=f(r),G=f(g),B=f(b);let X=(R*.4124+G*.3576+B*.1805)/.95047,Y=R*.2126+G*.7152+B*.0722,Zz=(R*.0193+G*.1192+B*.9505)/1.08883;const h=t=>t>.008856?Math.cbrt(t):7.787*t+16/116;X=h(X);Y=h(Y);Zz=h(Zz);return[116*Y-16,500*(X-Y),200*(Y-Zz)]};
const hex=(r,g,b)=>'#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('').toUpperCase();
function stats(p){const out={},fa=(()=>{let n=0;for(let q=3;q<masks.length;q+=4)if(masks[q]>127)n++;return n})();
 PARTS.forEach((k,ki)=>{const i=p[k];if(i<0){out[k]=null;return}const L=lay[i];let n=0,r=0,g=0,b=0,w=0;for(let q=0;q<L.length;q+=4){const m=masks[q+ki]/255,a=L[q+3]/255*m;if(a>.15){n++;const c=a;r+=c*(a*L[q]+(1-a)*bare[q]);g+=c*(a*L[q+1]+(1-a)*bare[q+1]);b+=c*(a*L[q+2]+(1-a)*bare[q+2]);w+=c}}
  out[k]=n?{hex:hex(r/w,g/w,b/w),area:Math.round(n/fa*1000)/10,look:i}:null});return out}
function draw(){const o=compose(pick);cx.putImageData(new ImageData(o,N,N),0,0);const st=stats(pick);
 $('.lb-recipe',root).innerHTML=`<h4>📋 ${L5(T.recipe)}</h4>`+PARTS.map(k=>{const s=st[k],ref=s?`<img src="${Z}ref_${ZM[face][s.look]}.webp" alt="">`:'';return `<div class="lb-r"><b>${L5(T[k])}</b>${s?`${ref}<i style="background:${s.hex}"></i><code>${s.hex}</code><span>${L5(T.area)} ${s.area}% ${L5(T.ofFace)}</span><button data-h="${s.hex}">${L5(T.copy)}</button>`:`<span>${L5(T.none)}</span>`}</div>`}).join('');
 $$('.lb-recipe button',root).forEach(b=>b.onclick=()=>{user();navigator.clipboard&&navigator.clipboard.writeText(b.dataset.h);b.innerHTML=L5(T.copied);setTimeout(()=>b.innerHTML=L5(T.copy),1200)});
 $('.lb-picks',root).innerHTML=PARTS.map(k=>`<div class="lb-p"><b>${L5(T[k])}</b>${ZM[face].map((r,i)=>`<button data-k="${k}" data-i="${i}" aria-pressed="${pick[k]===i}"><img src="${Z}ref_${r}.webp" alt=""></button>`).join('')}</div>`).join('');
 $$('.lb-p button',root).forEach(b=>b.onclick=()=>{user();pick[b.dataset.k]=+b.dataset.i;draw()});
 const cmp=view==='cmp'&&A;root.classList.toggle('lb-cmpmode',!!cmp);
 if(cmp){const a=compose(A.p);cax.putImageData(new ImageData(a,N,N),0,0);const d=cdx.createImageData(N,N),dd=d.data,acc={eyes:[0,0],lips:[0,0],other:[0,0]};
  for(let q=0;q<a.length;q+=4){const x=lab(o[q],o[q+1],o[q+2]),y=lab(a[q],a[q+1],a[q+2]),e=Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2]),t=Math.min(1,e/30);
   dd[q]=o[q]*(1-t*.85)+255*t*.85;dd[q+1]=o[q+1]*(1-t*.85)+40*t*.85;dd[q+2]=o[q+2]*(1-t*.85)+120*t*.85;dd[q+3]=255;
   for(let k=0;k<3;k++){const m=masks[q+k]/255;if(m>.5&&masks[q+3]>127){acc[PARTS[k]][0]+=e;acc[PARTS[k]][1]++}}}
  cdx.putImageData(d,0,0);$('.lb-dlist',root).innerHTML=`<h4>${L5(T.diff)}</h4>`+PARTS.map(k=>{const v=acc[k][1]?acc[k][0]/acc[k][1]:0;return `<div class="lb-r"><b>${L5(T[k])}</b><span class="bar"><i style="width:${Math.min(100,v*4)}%"></i></span><code>ΔE ${v.toFixed(1)}</code>${v<2?`<span>${L5(T.same)}</span>`:''}</div>`}).join('')}
 bar()}
function bar(){$('.lb-bar',root).innerHTML=`<div class="lb-faces"><span>${L5(T.face)}</span>${Object.keys(ZM).map(f=>`<button data-f="${f}" aria-pressed="${f===face}"><img src="${Z}${f}_bare.webp" alt=""></button>`).join('')}</div>
 <button class="lb-btn" data-a="rand">🎲 ${L5(T.rand)}</button><button class="lb-btn" data-a="pin">📌 ${L5(T.pin)}</button><button class="lb-btn" data-a="cmp" aria-pressed="${view==='cmp'}" ${A?'':'disabled'}>⇄ ${L5(T.cmp)}</button>`;
 $$('.lb-faces button',root).forEach(b=>b.onclick=async()=>{user();face=b.dataset.f;A=null;view='mix';await prep();draw()});
 $$('.lb-btn',root).forEach(b=>b.onclick=()=>{user();act(b.dataset.a)})}
function rnd(){const n=ZM[face].length;PARTS.forEach(k=>pick[k]=Math.random()<.12?-1:Math.floor(Math.random()*n));if(PARTS.every(k=>pick[k]<0))pick.eyes=0}
function act(a){if(a==='rand'){rnd();root.classList.remove('roll');void root.offsetWidth;root.classList.add('roll');draw()}else if(a==='pin'){A={p:{...pick}};draw()}else if(a==='cmp'&&A){view=view==='cmp'?'mix':'cmp';draw()}}
$('.lb-hint',root).innerHTML=L5(T.hint);
const MB=$('.lb-badge',root);function badge(au){MB.innerHTML=au?`<span class="dot"></span>${L5({en:'Auto demo · click to edit',sc:'自动演示中 · 点击即可编辑',zh:'自動示範中 · 點一下即可編輯',ja:'自動デモ中 · クリックで編集',ko:'자동 데모 중 · 클릭하면 편집'})}`:`<span>✎ ${L5({en:'Edit mode · paused',sc:'编辑模式 · 已暂停',zh:'編輯模式 · 已暫停',ja:'編集モード · 一時停止中',ko:'편집 모드 · 일시정지됨'})}</span><button type="button" class="pg-play">▶ ${L5({en:'Play',sc:'播放',zh:'播放',ja:'再生',ko:'재생'})}</button>`;MB.classList.toggle('auto',au);const b=$('.pg-play',MB);b&&(b.onclick=()=>{touched=false;badge(true);demo()})}
function user(){if(touched)return;touched=true;clearInterval(tm);badge(false)}
function demo(){clearInterval(tm);let s=0;tm=setInterval(async()=>{if(touched)return clearInterval(tm);s++;
 if(s%6===1){act('rand')}else if(s%6===2){act('pin')}else if(s%6===3){act('rand')}else if(s%6===4){view='cmp';draw()}else if(s%6===5){view='mix';draw()}else{face=Object.keys(ZM)[(Object.keys(ZM).indexOf(face)+1)%Object.keys(ZM).length];A=null;await prep();draw()}},2600)}
cv.addEventListener('pointerdown',user);
prep().then(()=>{draw();badge(true);if(!matchMedia('(prefers-reduced-motion:reduce)').matches){let st=false;new IntersectionObserver(es=>{if(es[0].isIntersecting&&!st){st=true;demo()}},{threshold:.3}).observe(root)}})})();

/* lighting / pose card and selfie decomposition card */
(()=>{const root=$('#cond');if(!root)return;const C=V+'cond/';const L5=o=>`<span class="en">${o.en}</span><span class="sc">${o.sc}</span><span class="zh">${o.zh}</span><span class="ja">${o.ja}</span><span class="ko">${o.ko}</span>`;
const G={light:{t:{en:'Lighting',sc:'光线',zh:'光線',ja:'光',ko:'조명'},k:[['original',{en:'Daylight',sc:'日光',zh:'日光',ja:'日中',ko:'낮'}],['golden',{en:'Golden hour',sc:'黄金时刻',zh:'黃金時刻',ja:'ゴールデンアワー',ko:'골든 아워'}],['neon',{en:'Neon night',sc:'霓虹夜景',zh:'霓虹夜景',ja:'ネオンの夜',ko:'네온 밤'}],['lamp',{en:'Warm lamp',sc:'暖色灯光',zh:'暖色燈光',ja:'暖かいランプ',ko:'따뜻한 램프'}],['overcast',{en:'Overcast',sc:'阴天',zh:'陰天',ja:'曇り',ko:'흐린 날'}]]},
 pose:{t:{en:'Expression and angle',sc:'表情与角度',zh:'表情與角度',ja:'表情と向き',ko:'표정과 각도'},k:[['original',{en:'Front',sc:'正脸',zh:'正臉',ja:'正面',ko:'정면'}],['turn',{en:'Turned',sc:'转头',zh:'轉頭',ja:'横向き',ko:'고개 돌림'}],['laugh',{en:'Laughing',sc:'大笑',zh:'大笑',ja:'笑顔',ko:'웃음'}],['closed',{en:'Eyes closed',sc:'闭眼',zh:'閉眼',ja:'目を閉じる',ko:'눈 감음'}],['up',{en:'Looking up',sc:'抬头',zh:'抬頭',ja:'見上げる',ko:'올려다봄'}]]}};
let g='light',k='original',p=.5,touched=false,tm=null;const st=$('.cd-stage',root),a=$('img.a',st),b=$('img.b',st),ln=$('.gp-line',st);
function set(x){p=Math.max(0,Math.min(1,x));b.style.clipPath=`inset(0 0 0 ${p*100}%)`;ln.style.left=p*100+'%'}
function ui(){$('.cd-tabs',root).innerHTML=Object.entries(G).map(([id,v])=>`<button data-g="${id}" aria-pressed="${id===g}">${L5(v.t)}</button>`).join('');
 $('.cd-pills',root).innerHTML=G[g].k.map(([id,v])=>`<button data-k="${id}" aria-pressed="${id===k}">${L5(v)}</button>`).join('');
 $$('.cd-tabs button',root).forEach(x=>x.onclick=()=>{user();g=x.dataset.g;k='original';ui();img()});$$('.cd-pills button',root).forEach(x=>x.onclick=()=>{user();k=x.dataset.k;ui();img()})}
function img(){a.src=`${C}${g}_${k}_a.webp`;b.src=`${C}${g}_${k}_b.webp`}
let drag=false;st.addEventListener('pointerdown',e=>{user();drag=true;st.setPointerCapture(e.pointerId);const r=st.getBoundingClientRect();set((e.clientX-r.left)/r.width)});
st.addEventListener('pointermove',e=>{if(!drag)return;const r=st.getBoundingClientRect();set((e.clientX-r.left)/r.width)});st.addEventListener('pointerup',()=>drag=false);
const MB=$('.cd-badge',root);function badge(au){MB.innerHTML=au?`<span class="dot"></span>${L5({en:'Auto demo · click to edit',sc:'自动演示中 · 点击即可编辑',zh:'自動示範中 · 點一下即可編輯',ja:'自動デモ中 · クリックで編集',ko:'자동 데모 중 · 클릭하면 편집'})}`:`<span>✎ ${L5({en:'Edit mode · paused',sc:'编辑模式 · 已暂停',zh:'編輯模式 · 已暫停',ja:'編集モード · 一時停止中',ko:'편집 모드 · 일시정지됨'})}</span><button type="button" class="pg-play">▶ ${L5({en:'Play',sc:'播放',zh:'播放',ja:'再生',ko:'재생'})}</button>`;MB.classList.toggle('auto',au);const x=$('.pg-play',MB);x&&(x.onclick=e=>{e.stopPropagation();touched=false;badge(true);demo()})}
MB.addEventListener('pointerdown',e=>e.stopPropagation());
function user(){if(touched)return;touched=true;clearInterval(tm);badge(false)}
function demo(){clearInterval(tm);const t0=performance.now();let last=-1;tm=setInterval(()=>{if(touched)return clearInterval(tm);const t=(performance.now()-t0)/1000,i=Math.floor(t/3.2),seq=[...G.light.k.map(x=>['light',x[0]]),...G.pose.k.map(x=>['pose',x[0]])],c=seq[i%seq.length];
 if(i!==last){last=i;g=c[0];k=c[1];ui();img()}set(.5+.38*Math.sin(t*1.9))},40)}
ui();img();set(.5);badge(true);if(!matchMedia('(prefers-reduced-motion:reduce)').matches){let s=false;new IntersectionObserver(es=>{if(es[0].isIntersecting&&!s){s=true;demo()}},{threshold:.3}).observe(root)}})();
(()=>{const root=$('#igc');if(!root)return;const I=V+'ig/';const L5=o=>`<span class="en">${o.en}</span><span class="sc">${o.sc}</span><span class="zh">${o.zh}</span><span class="ja">${o.ja}</span><span class="ko">${o.ko}</span>`;
const K=[['color',{en:'Colorful eyeshadow',sc:'彩色眼影',zh:'彩色眼影',ja:'カラフルなアイシャドウ',ko:'컬러풀한 아이섀도'},'Chalo Garcia','photosbychalo','kwoAigKnlfo'],['pink',{en:'Pink eyeshadow',sc:'粉色眼影',zh:'粉色眼影',ja:'ピンクのアイシャドウ',ko:'핑크 아이섀도'},'Vince Mariel Conlu','vimarco','ajDUxve6clA']];
let k='color',touched=false,tm=null;
function ui(){$('.ig-pills',root).innerHTML=K.map(([id,v])=>`<button data-k="${id}" aria-pressed="${id===k}">${L5(v)}</button>`).join('');$$('.ig-pills button',root).forEach(x=>x.onclick=()=>{touched=true;clearInterval(tm);k=x.dataset.k;ui();img()})}
function img(){const e=K.find(x=>x[0]===k);$('.ig-credit',root).innerHTML=`<span class="en">Photo by</span><span class="sc">摄影：</span><span class="zh">攝影：</span><span class="ja">撮影：</span><span class="ko">사진:</span> <a href="https://unsplash.com/@${e[3]}" target="_blank" rel="noopener">${e[2]}</a> · <a href="https://unsplash.com/photos/${e[4]}" target="_blank" rel="noopener">Unsplash</a>`;$('.ig-in',root).src=`${I}${k}_in.webp`;$('.ig-bare',root).src=`${I}${k}_bare.webp`;$('.ig-layer',root).src=`${I}${k}_layer.webp`}
ui();img();if(!matchMedia('(prefers-reduced-motion:reduce)').matches){let s=false;new IntersectionObserver(es=>{if(es[0].isIntersecting&&!s){s=true;let i=0;tm=setInterval(()=>{if(touched)return clearInterval(tm);i++;k=K[i%K.length][0];ui();img()},3200)}},{threshold:.3}).observe(root)}})();
})();
