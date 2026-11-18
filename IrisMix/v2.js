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
const w=$('#wall');const pick=(()=>{const by={};D.wall.forEach(x=>{const f=x.split('__')[0];(by[f]=by[f]||[]).push(x)});const fs=Object.keys(by),o=[];for(let r=0;o.length<18&&r<4;r++)fs.forEach(f=>{if(o.length<18&&by[f][r])o.push(by[f][r])});return o})();pick.forEach(x=>{const d=document.createElement('div');d.innerHTML=`<img src="${V}wall/${x}.webp" alt="" loading="lazy"><img class="b" src="${V}wall/${x.split('__')[0]}__bare.webp" alt="" loading="lazy">`;w.append(d)});
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

/* hero layer playground: drag layer cards onto the face or pull them out, recolor, move, stack, matte / glossy; scripted cursor demo */
(()=>{const root=$('#pg');if(!root)return;const A=V+'play/';
const T={
 blush:{en:'Blush',sc:'腮红',zh:'腮紅',ja:'チーク',ko:'블러셔'},liner:{en:'Lashes & liner',sc:'睫毛与眼线',zh:'睫毛與眼線',ja:'まつげ・ライナー',ko:'속눈썹·라이너'},
 lips:{en:'Lips',sc:'唇妆',zh:'唇妝',ja:'リップ',ko:'립'},sheer:{en:'Sheer gloss',sc:'透明唇蜜',zh:'透明唇蜜',ja:'シアーグロス',ko:'시어 글로스'},
 tray:{en:'Layers',sc:'图层',zh:'圖層',ja:'レイヤー',ko:'레이어'},hint:{en:'Drag a layer onto the face, or pull one out',sc:'把图层拖到脸上，或拖出来',zh:'把圖層拖到臉上，或拖出來',ja:'レイヤーを顔にドラッグ、または外へ',ko:'레이어를 얼굴로 끌어오거나 밖으로 빼세요'},
 matte:{en:'Matte',sc:'雾面',zh:'霧面',ja:'マット',ko:'매트'},glossy:{en:'Glossy',sc:'水光',zh:'水光',ja:'ツヤ',ko:'글로시'},
 color:{en:'Color',sc:'颜色',zh:'顏色',ja:'カラー',ko:'컬러'},op:{en:'Opacity',sc:'透明度',zh:'透明度',ja:'不透明度',ko:'불투명도'},order:{en:'Order',sc:'顺序',zh:'順序',ja:'重なり順',ko:'순서'},
 finish:{en:'Finish',sc:'质地',zh:'質地',ja:'仕上がり',ko:'피니시'},
 s1:{en:'Stack a sheer gloss over the lips',sc:'在唇上叠一层透明唇蜜',zh:'在唇上疊一層透明唇蜜',ja:'リップにシアーグロスを重ねる',ko:'립 위에 시어 글로스 겹치기'},
 s2:{en:'Matte → glossy',sc:'雾面 → 水光',zh:'霧面 → 水光',ja:'マット → ツヤ',ko:'매트 → 글로시'},
 s3:{en:'Recolor the lips',sc:'唇色改色',zh:'唇色改色',ja:'リップの色を変える',ko:'립 컬러 변경'},
 s4:{en:'Move the blush',sc:'移动腮红',zh:'移動腮紅',ja:'チークを動かす',ko:'블러셔 이동'},
 s5:{en:'Pull the eyeliner out',sc:'把眼线拖出来',zh:'把眼線拖出來',ja:'アイライナーを外す',ko:'아이라이너 빼기'},
 s6:{en:'Put it back, no re-rendering',sc:'放回去，无需重新渲染',zh:'放回去，不必重新渲染',ja:'元に戻す（再レンダリング不要）',ko:'다시 넣기, 재렌더링 없음'},
 cap:{en:'Every edit is a closed-form operation on rendered IrisMix layers',sc:'每次编辑都是对 IrisMix 渲染后图层的封闭解操作',zh:'每次編輯都是對 IrisMix 渲染後圖層的封閉解操作',ja:'すべての編集は IrisMix のレンダリング済みレイヤーへの閉形式の操作です',ko:'모든 편집은 IrisMix 렌더링 레이어에 대한 닫힌 형식 연산입니다'}};
const L5=o=>`<span class="en">${o.en}</span><span class="sc">${o.sc}</span><span class="zh">${o.zh}</span><span class="ja">${o.ja}</span><span class="ko">${o.ko}</span>`;
const IDS=['blush','liner','lips','sheer'],HUES=[0,-25,30,150,200],SW=['#c9566f','#b8475f','#d97a62','#7f6fb8','#5b8fbf'];
const photo=$('.pg-photo',root),tray=$('.pg-tray',root),tool=$('.pg-tool',root),cur=$('.pg-cursor',root),toast=$('.pg-toast',root);
const D0=()=>({on:{blush:true,liner:true,lips:true,sheer:false},x:{},y:{},h:{},o:{},order:[...IDS],gloss:false,sel:'lips'});let S=D0();
const IM={};IDS.concat(['gloss']).forEach(id=>{const im=document.createElement('img');im.src=A+id+'.webp';im.alt='';im.className='pg-ly';im.dataset.id=id;photo.append(im);IM[id]=im});
$('.pg-cap',root).innerHTML=L5(T.cap);$('.pg-tray-h',root).innerHTML=`<b>${L5(T.tray)}</b><small>${L5(T.hint)}</small>`;
const CARD={};IDS.forEach(id=>{const c=document.createElement('div');c.className='pg-card';c.dataset.id=id;c.innerHTML=`<img src="${A}${id}_th.webp" alt=""><span>${L5(T[id])}</span><i></i>`;tray.append(c);CARD[id]=c});
function place(){const a=photo.getBoundingClientRect(),b=root.getBoundingClientRect();if(innerWidth>1100){tray.style.right=(b.right-a.left-tray.offsetWidth-10)+'px'}else tray.style.right=''}addEventListener('resize',place);
function draw(){S.order.forEach((id,i)=>{const im=IM[id];im.style.zIndex=2+i;im.style.opacity=S.on[id]?(S.o[id]==null?1:S.o[id]):0;
  im.style.transform=`translate(${(S.x[id]||0)*100}%,${(S.y[id]||0)*100}%)`;let f=`hue-rotate(${S.h[id]||0}deg)`;if(id==='lips'&&!S.gloss)f+=' saturate(.86) brightness(.97)';im.style.filter=f;im.classList.toggle('pop',false)});
 IM.gloss.style.zIndex=2+S.order.indexOf('lips')+(S.on.sheer?2:1);IM.gloss.style.opacity=S.on.lips&&S.gloss?1:0;IM.gloss.style.transform=IM.lips.style.transform;
 IDS.forEach(id=>{CARD[id].classList.toggle('on',!!S.on[id]);CARD[id].classList.toggle('sel',S.sel===id)});tools()}
function tools(){const id=S.sel,o=S.o[id]==null?1:S.o[id];
 tool.innerHTML=`<div class="pg-th"><img src="${A}${id}_th.webp" alt=""><b>${L5(T[id])}</b></div>
 <div class="pg-row"><span>${L5(T.color)}</span>${HUES.map((h,i)=>`<button class="pg-sw${(S.h[id]||0)===h?' on':''}" data-h="${h}" style="background:${SW[i]}" aria-label="color"></button>`).join('')}</div>
 <div class="pg-row"><span>${L5(T.op)}</span><input type="range" min="0" max="100" value="${Math.round(o*100)}" aria-label="Opacity"></div>
 ${id==='lips'?`<div class="pg-row"><span>${L5(T.finish)}</span><div class="pg-seg"><button data-f="0" aria-pressed="${!S.gloss}">${L5(T.matte)}</button><button data-f="1" aria-pressed="${S.gloss}">${L5(T.glossy)}</button></div></div>`:''}
 <div class="pg-row"><span>${L5(T.order)}</span><button class="pg-ob" data-d="1" aria-label="Move up">↑</button><button class="pg-ob" data-d="-1" aria-label="Move down">↓</button></div>`;
 $$('.pg-sw',tool).forEach(b=>b.onclick=()=>{user();S.h[id]=+b.dataset.h;draw()});
 $('input',tool).oninput=e=>{user();S.o[id]=e.target.value/100;draw()};
 $$('.pg-seg button',tool).forEach(b=>b.onclick=()=>{user();S.gloss=b.dataset.f==='1';draw()});
 $$('.pg-ob',tool).forEach(b=>b.onclick=()=>{user();mv(id,+b.dataset.d)})}
function mv(id,d){const i=S.order.indexOf(id),j=i+d;if(j<0||j>=S.order.length)return;[S.order[i],S.order[j]]=[S.order[j],S.order[i]];draw()}
/* geometry */
const P=window.IRIS_PLAY.parts,rel=(el)=>{const a=el.getBoundingClientRect(),b=root.getBoundingClientRect();return{x:a.left-b.left,y:a.top-b.top,w:a.width,h:a.height}};
const ptOn=(id)=>{const r=rel(photo);return{x:r.x+(P[id].cx+(S.x[id]||0))*r.w,y:r.y+(P[id].cy+(S.y[id]||0))*r.h}};
const ptCard=(id)=>{const r=rel(CARD[id]);return{x:r.x+r.w*.32,y:r.y+r.h*.5}};
const inPhoto=(x,y)=>{const r=rel(photo);return x>r.x&&x<r.x+r.w&&y>r.y&&y<r.y+r.h};
function pick(x,y){const r=rel(photo);let best=null,bd=.07;S.order.slice().reverse().forEach(id=>{if(!S.on[id])return;const p=ptOn(id),d=Math.hypot((x-p.x)/r.w,(y-p.y)/r.h);if(d<bd){bd=d;best=id}});return best}
/* ghost while dragging a card */
const ghost=document.createElement('div');ghost.className='pg-ghost';root.append(ghost);
function ghostAt(id,x,y,show){ghost.innerHTML=id?`<img src="${A}${id}_th.webp" alt="">`:'';ghost.style.transform=`translate(${x-30}px,${y-30}px)`;ghost.classList.toggle('on',!!show)}
/* user input */
let drag=null;
root.addEventListener('pointerdown',e=>{const b=root.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;const card=e.target.closest('.pg-card');
 if(card){user();const id=card.dataset.id;S.sel=id;draw();drag={kind:'card',id};ghostAt(id,x,y,true);root.setPointerCapture(e.pointerId);e.preventDefault();return}
 if(inPhoto(x,y)&&!e.target.closest('.pg-tool')){const id=pick(x,y);if(id){user();S.sel=id;draw();const r=rel(photo);drag={kind:'layer',id,x0:x,y0:y,ox:S.x[id]||0,oy:S.y[id]||0,r};root.setPointerCapture(e.pointerId);e.preventDefault()}}});
root.addEventListener('pointermove',e=>{if(!drag)return;const b=root.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;
 if(drag.kind==='card')ghostAt(drag.id,x,y,true);else{S.x[drag.id]=drag.ox+(x-drag.x0)/drag.r.w;S.y[drag.id]=drag.oy+(y-drag.y0)/drag.r.h;draw();root.classList.toggle('pg-out',!inPhoto(x,y))}});
root.addEventListener('pointerup',e=>{if(!drag)return;const b=root.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;
 if(drag.kind==='card'){ghostAt(null,0,0,false);if(inPhoto(x,y)){S.on[drag.id]=true;flash(drag.id)}}
 else if(!inPhoto(x,y)){S.on[drag.id]=false;S.x[drag.id]=0;S.y[drag.id]=0}
 root.classList.remove('pg-out');drag=null;draw()});
function flash(id){const im=IM[id];im.classList.remove('pop');void im.offsetWidth;im.classList.add('pop')}
/* scripted cursor demo */
let demo=true,touched=false,tid=[];const wait=ms=>new Promise(r=>tid.push(setTimeout(r,ms)));
const say=o=>{toast.innerHTML=L5(o);toast.classList.add('on')};
function cursorTo(p,ms){cur.style.transition=`transform ${ms}ms cubic-bezier(.45,0,.2,1)`;cur.style.transform=`translate(${p.x}px,${p.y}px)`;return wait(ms)}
async function dragPath(from,to,ms,step){cur.classList.add('down');const n=Math.max(8,ms/30|0);for(let i=1;i<=n&&demo;i++){const t=i/n,e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,p={x:from.x+(to.x-from.x)*e,y:from.y+(to.y-from.y)*e};cur.style.transition='none';cur.style.transform=`translate(${p.x}px,${p.y}px)`;step&&step(p,e);await wait(ms/n)}cur.classList.remove('down')}
async function click(el){const r=rel(el);await cursorTo({x:r.x+r.w/2,y:r.y+r.h/2},650);cur.classList.add('down');await wait(140);bot=true;el.click();bot=false;cur.classList.remove('down');await wait(250)}
async function run(){while(demo){S=D0();draw();toast.classList.remove('on');cur.classList.add('on');await cursorTo({x:rel(photo).x+rel(photo).w*.7,y:rel(photo).y+rel(photo).h*.75},10);await wait(700);if(!demo)return;
 say(T.s1);let a=ptCard('sheer');await cursorTo(a,800);S.sel='sheer';draw();let b=ptOn('lips');await dragPath(a,b,1100,p=>ghostAt('sheer',p.x,p.y,true));ghostAt(null,0,0,false);S.on.sheer=true;draw();flash('sheer');await wait(900);if(!demo)return;
 say(T.s2);S.sel='lips';draw();await wait(300);await click($('.pg-seg button[data-f="1"]',tool));demoGloss();await wait(900);if(!demo)return;
 say(T.s3);await click($$('.pg-sw',tool)[1]);await wait(500);await click($$('.pg-sw',tool)[2]);await wait(800);if(!demo)return;
 say(T.s4);a=ptOn('blush');await cursorTo(a,800);S.sel='blush';draw();const ox=S.x.blush||0,oy=S.y.blush||0,r=rel(photo);
 await dragPath(a,{x:a.x+r.w*.02,y:a.y-r.h*.025},900,(p,e)=>{S.x.blush=ox+e*.02;S.y.blush=oy-e*.025;draw()});await wait(700);if(!demo)return;
 say(T.s5);a=ptOn('liner');await cursorTo(a,800);S.sel='liner';draw();b=ptCard('liner');const r2=rel(photo);
 await dragPath(a,b,1100,(p,e)=>{S.x.liner=(p.x-a.x)/r2.w;S.y.liner=(p.y-a.y)/r2.h;draw()});S.on.liner=false;S.x.liner=0;S.y.liner=0;draw();await wait(800);if(!demo)return;
 say(T.s6);a=ptCard('liner');b={x:ptOn('liner').x,y:ptOn('liner').y};await dragPath(a,b,1100,p=>ghostAt('liner',p.x,p.y,true));ghostAt(null,0,0,false);S.on.liner=true;draw();flash('liner');await wait(1600)}}
function demoGloss(){}
let bot=false;function user(){if(bot||touched)return;touched=true;demo=false;tid.forEach(clearTimeout);cur.classList.remove('on','down');toast.classList.remove('on');ghostAt(null,0,0,false)}
draw();place();
if(matchMedia('(prefers-reduced-motion:reduce)').matches){demo=false}else{const io=new IntersectionObserver(es=>{if(es[0].isIntersecting&&demo&&!run.started){run.started=true;run()}},{threshold:.3});io.observe(root)}
})();
})();
