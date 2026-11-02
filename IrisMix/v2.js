(()=>{'use strict';
const D=window.IRIS,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],V='assets/v2/';
const qs=new URLSearchParams(location.search);
function lang(l){document.documentElement.dataset.lang=l;document.documentElement.lang=l==='zh'?'zh-Hant':'en';$$('.lang button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.l===l));try{localStorage.setItem('iris-lang',l)}catch(e){}}
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
const w=$('#wall');D.wall.forEach(x=>{const d=document.createElement('div');d.innerHTML=`<img src="${V}wall/${x}.webp" alt="" loading="lazy"><img class="b" src="${V}wall/${x.split('__')[0]}__bare.webp" alt="" loading="lazy">`;w.append(d)});
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
$('#copy').onclick=async e=>{try{await navigator.clipboard.writeText($('#bib').textContent);e.target.dataset.ok=1;$('#copied').hidden=false}catch(x){}};
/* hero video only when visible */
const hv=$('#hero-video');if(hv&&!matchMedia('(prefers-reduced-motion:reduce)').matches){hv.play().catch(()=>{})}
})();
