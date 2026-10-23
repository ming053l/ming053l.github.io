import {createMakeupStation} from './makeup-station.js?v=3';
(() => {
'use strict';
const $=id=>document.getElementById(id),SIZE=640,MASK=512,PARTS=['eyes','lips','face'];
const STEPS=['source','look','eyes','lips','face','finish'];
const LABELS={source:'選人像',look:'整體妝感',eyes:'眼妝',lips:'唇色',face:'臉部彩繪',finish:'完成'};
const TITLES={source:'先選一位模特',look:'挑選整體妝感',eyes:'接著搭配眼妝',lips:'換上喜歡的唇色',face:'加上一點臉部彩繪',finish:'看看你的完整搭配'};
const DESCRIPTIONS={source:'選擇人像後，下一步就可以開始試妝。',look:'點選妝容，立即套用。換一款會重置參考局部與細修；自由筆刷會保留。',eyes:'點選眼妝取代目前眼妝，也可以沿用整體妝感或讓這個部位回到原圖。',lips:'點選唇色立即試色，再調整強度與色調。沒有喜歡的，也可以繼續下一步。',face:'選擇適合這位模特的彩繪。髮絲遮擋與臉型會影響圖案，可隨時清除。',finish:'這是你目前的搭配。點選部位回去修改，或下載完成的妝容。'};
const GUIDE_OPTIONS={eyes:['satin','merlot','mint','cobalt'],lips:['satin','merlot','poppy'],face:['lily']};
const asset=name=>'assets/v3/'+name,canvas=()=>{const c=document.createElement('canvas');c.width=c.height=SIZE;return c;};
const result=$('result'),rc=result.getContext('2d'),ref=$('reference'),fc=ref.getContext('2d');
const brush=document.createElement('canvas');brush.width=brush.height=MASK;const bc=brush.getContext('2d',{willReadFrequently:true});
const overlay=document.createElement('canvas');overlay.width=overlay.height=MASK;const oc=overlay.getContext('2d');
const guidedCanvas=canvas(),gc=guidedCanvas.getContext('2d'),working=canvas(),wc=working.getContext('2d');
const images=new Map(),maps=new Map(),layerPixels=new Map(),regionMasks=new Map(),sourcePixels=new Map(),ownership=new Map(),guidedTint=new Map();
let makeupStation=null;
let manifest,regionManifest,sourceId='studio',selected='satin',guideStep='source',category='all';
let guided={look:null,eyes:null,lips:null,face:null},layers=[],activeId=null,nextId=1,wholeHue=0;
let selection=new Uint8ClampedArray(MASK*MASK),selectionCount=0,history=[],future=[],busy=false;
let tool='brush',drawing=false,last,pendingStroke=false,scheduled=false,previewCache=null,guidedDirty=true,original=false,reveal=0;
const look=id=>manifest.looks.find(l=>l.id===id),current=()=>look(selected),available=id=>!!look(id)?.pairs[sourceId];
const announce=text=>{$('status').textContent=text;};
function imageURL(url){
 if(images.has(url))return Promise.resolve(images.get(url));
 return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>{images.set(url,i);resolve(i);};i.onerror=()=>reject(Error('Unable to load '+url));i.src=url;});
}
const image=name=>imageURL(asset(name));
function pixels(i,size){const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(i,0,0,size,size);return x.getImageData(0,0,size,size).data;}
async function ensureSource(id){
 const source=manifest.sources.find(s=>s.id===id),photo=await image(source.image);
 if(!sourcePixels.has(id))sourcePixels.set(id,pixels(photo,SIZE));
 if(ownership.has(id))return;
 const specs=regionManifest.sources[id];if(!specs)throw Error('Missing source makeup regions');
 const entries=await Promise.all(PARTS.map(async part=>{
  const rgba=pixels(await imageURL('assets/guided/'+specs[part]),SIZE),mask=new Float32Array(SIZE*SIZE);
  for(let i=0;i<mask.length;i++)mask[i]=rgba[4*i]/255;
  return[part,mask];
 }));ownership.set(id,Object.fromEntries(entries));
}
async function ensureLook(id,source=sourceId){
 const item=look(id),pair=item.pairs[source];await image(item.reference);
 await Promise.all(Object.entries(item.masks).map(async([part,name])=>{
  const key=id+':'+part;if(regionMasks.has(key))return;
  const rgba=pixels(await image(name),MASK),mask=new Uint8ClampedArray(MASK*MASK);
  for(let i=0;i<mask.length;i++)mask[i]=rgba[4*i];regionMasks.set(key,mask);
 }));
 const key=source+':'+id;if(!pair||maps.has(key))return;
 const[li,mi]=await Promise.all([image(pair.layer),image(pair.map)]);layerPixels.set(key,pixels(li,SIZE));
 const rgba=pixels(mi,SIZE),map=new Uint32Array(SIZE*SIZE);
 for(let i=0;i<map.length;i++)map[i]=(rgba[4*i]<<16)|(rgba[4*i+1]<<8)|rgba[4*i+2];maps.set(key,map);
}
function tintPixels(input,angle){
 if(!angle)return input;const out=input.slice();
 for(let i=0;i<out.length;i+=4){
  if(!out[i+3])continue;const r=out[i]/255,g=out[i+1]/255,b=out[i+2]/255,hi=Math.max(r,g,b),lo=Math.min(r,g,b),v=hi-lo,light=(hi+lo)/2;if(!v)continue;
  let h=hi===r?(g-b)/v+(g<b?6:0):hi===g?(b-r)/v+2:(r-g)/v+4;h=((h/6+angle/360)%1+1)%1;
  const sat=v/(1-Math.abs(2*light-1)),ch=(1-Math.abs(2*light-1))*sat,t=h*6,z=ch*(1-Math.abs(t%2-1)),m=light-ch/2;
  const rgb=t<1?[ch,z,0]:t<2?[z,ch,0]:t<3?[0,ch,z]:t<4?[0,z,ch]:t<5?[z,0,ch]:[ch,0,z];
  for(let k=0;k<3;k++)out[i+k]=(rgb[k]+m)*255;
 }return out;
}
function guidedPixels(part,slot){
 if(!slot?.refId||!available(slot.refId))return null;
 const key=sourceId+':'+slot.refId+':'+(slot.hue+wholeHue),cached=guidedTint.get(part);
 if(cached?.key===key)return cached.pixels;
 const input=layerPixels.get(sourceId+':'+slot.refId);if(!input)return null;
 const value=tintPixels(input,slot.hue+wholeHue);guidedTint.set(part,{key,pixels:value});return value;
}
function renderGuided(){
 if(!guidedDirty)return;const source=sourcePixels.get(sourceId),regions=ownership.get(sourceId);if(!source||!regions)return;
 const output=gc.createImageData(SIZE,SIZE),base=guidedPixels('look',guided.look),baseOpacity=(guided.look?.opacity||0)/100;
 const overrides=PARTS.filter(p=>guided[p]&&(guided[p].clear||available(guided[p].refId))).map(p=>({mask:regions[p],pixels:guidedPixels(p,guided[p]),opacity:(guided[p].opacity||0)/100}));
 // Fixed source regions partition the contribution, not the final alpha-over
 // operation. A cleared/0% override retains ownership and shows source pixels.
 for(let i=0;i<SIZE*SIZE;i++){
  const at=4*i;let sum=0;for(const slot of overrides)sum+=slot.mask[i];
  let a=base?Math.max(0,1-sum)*base[at+3]/255*baseOpacity:0;
  let r=base?base[at]*a:0,g=base?base[at+1]*a:0,b=base?base[at+2]*a:0;
  for(const slot of overrides){if(!slot.pixels)continue;const alpha=slot.mask[i]*slot.pixels[at+3]/255*slot.opacity;a+=alpha;r+=slot.pixels[at]*alpha;g+=slot.pixels[at+1]*alpha;b+=slot.pixels[at+2]*alpha;}
  output.data[at]=r+(1-a)*source[at];output.data[at+1]=g+(1-a)*source[at+1];output.data[at+2]=b+(1-a)*source[at+2];output.data[at+3]=255;
 }gc.putImageData(output,0,0);guidedDirty=false;
}
function makeLayer(refId,mask){
 const key=sourceId+':'+refId,base=layerPixels.get(key),map=maps.get(key),c=canvas();if(!base||!map)return c;
 const x=c.getContext('2d'),data=x.createImageData(SIZE,SIZE);data.data.set(base);
 for(let i=0;i<map.length;i++)data.data[4*i+3]=map[i]<mask.length?base[4*i+3]*mask[map[i]]/255:0;x.putImageData(data,0,0);return c;
}
function tint(layer){
 const angle=layer.hue+wholeHue;if(!angle)return layer.canvas;
 if(layer.tintAngle===angle&&layer.tintSource===layer.canvas)return layer.tintCanvas;
 const c=canvas(),x=c.getContext('2d'),data=layer.canvas.getContext('2d').getImageData(0,0,SIZE,SIZE);data.data.set(tintPixels(data.data,angle));x.putImageData(data,0,0);
 layer.tintAngle=angle;layer.tintSource=layer.canvas;layer.tintCanvas=c;return c;
}
function hasChoices(){return Object.values(guided).some(s=>s?.refId&&available(s.refId))||layers.some(layer=>layer.available)||!!makeupStation?.hasContent();}
function hasMakeup(){return Object.values(guided).some(s=>s?.refId&&available(s.refId)&&s.opacity>0)||layers.some(l=>l.available&&l.visible&&l.opacity>0)||!!makeupStation?.hasPaint();}
function draft(){if(!previewCache)previewCache=makeLayer(selected,selection);return previewCache;}
function showDraft(){return $('advanced').open&&$('live-preview').checked&&!$('add-layer').disabled;}
function paint(x,includeDraft){
 renderGuided();x.clearRect(0,0,SIZE,SIZE);x.globalAlpha=1;x.drawImage(guidedCanvas,0,0);
 for(const layer of layers){if(!layer.available||!layer.visible)continue;x.globalAlpha=layer.opacity/100;x.drawImage(tint(layer),0,0);}x.globalAlpha=1;
 if(includeDraft&&showDraft())x.drawImage(draft(),0,0);
 if(makeupStation)makeupStation.render(x,x.canvas);
}
function drawResult(){
 if(!manifest||!sourcePixels.has(sourceId))return;paint(wc,true);rc.clearRect(0,0,SIZE,SIZE);rc.drawImage(working,0,0);
 const amount=original?100:reveal;if(amount){rc.save();rc.beginPath();rc.rect(0,0,SIZE*amount/100,SIZE);rc.clip();rc.drawImage(images.get(asset(manifest.source)),0,0,SIZE,SIZE);rc.restore();}
 makeupStation?.setComparing(amount>0);
 $('view-label').textContent=original?'原圖':showDraft()?'細修預覽':hasMakeup()?'目前搭配':hasChoices()?'目前顯示原圖':'原圖・還沒上妝';
}
function drawReference(){
 if(!manifest||!images.has(asset(current().reference)))return;fc.clearRect(0,0,MASK,MASK);fc.drawImage(images.get(asset(current().reference)),0,0,MASK,MASK);
 const data=oc.createImageData(MASK,MASK);for(let i=0;i<selection.length;i++){data.data[4*i]=45;data.data[4*i+1]=139;data.data[4*i+2]=222;data.data[4*i+3]=selection[i]*.46;}oc.putImageData(data,0,0);fc.drawImage(overlay,0,0);
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;drawReference();drawResult();});}
function resetComparison(){original=false;reveal=0;$('compare').setAttribute('aria-pressed','false');$('compare').textContent='◐ 比較原圖';$('reveal').value=0;$('reveal-value').value='0%';}
function changed(){guidedDirty=true;previewCache=null;resetComparison();schedule();}
function cloneGuided(){return Object.fromEntries(Object.entries(guided).map(([key,value])=>[key,value?{...value}:null]));}
function snapshot(){return{sourceId,selected,guideStep,guided:cloneGuided(),layers:layers.map(l=>({...l})),activeId,nextId,wholeHue,selection:selection.slice(),original,reveal,makeup:makeupStation?.snapshot()};}
function remember(){history.push(snapshot());if(history.length>30)history.shift();future=[];updateHistory();}
function updateHistory(){for(const id of ['undo','guide-undo'])if($(id))$(id).disabled=busy||!history.length;for(const id of ['redo','guide-redo'])if($(id))$(id).disabled=busy||!future.length;}
function restore(state){
 ({sourceId,selected,guideStep,activeId,nextId,wholeHue,original,reveal}=state);guided=Object.fromEntries(Object.entries(state.guided).map(([k,v])=>[k,v?{...v}:null]));layers=state.layers.map(l=>({...l}));selection=state.selection.slice();if(makeupStation)makeupStation.restore(state.makeup);
 manifest.source=manifest.sources.find(s=>s.id===sourceId).image;$('whole-hue').value=wholeHue;$('whole-hue-value').value=wholeHue+'°';$('reveal').value=reveal;$('reveal-value').value=reveal+'%';$('compare').setAttribute('aria-pressed',String(original));$('compare').textContent=original?'◐ 返回妝容':'◐ 比較原圖';
 category='all';guidedDirty=true;loadBrush();refreshLayers();refreshAll();schedule();
}
function undo(){if(busy||!history.length)return;future.push(snapshot());restore(history.pop());announce('已復原上一筆操作。');}
function redo(){if(busy||!future.length)return;history.push(snapshot());restore(future.pop());announce('已重做這筆操作。');}
function slotDescription(part){
 const slot=guided[part];if(slot?.clear)return'已改回原圖';
 if(slot?.refId)return look(slot.refId).label+(available(slot.refId)?`・${slot.opacity}%`:'・此人像暫不適用');
 if(part!=='look'&&guided.look?.refId)return available(guided.look.refId)?'沿用'+look(guided.look.refId).label:'整體妝感在此人像暫不適用';
 return part==='look'?'未選擇整體妝感':'保留原圖';
}
function refreshSummary(){
 const note=$('finish-stage').querySelector('.finish-note');if(note)note.textContent=hasMakeup()?'這是你目前的搭配。點選部位回去修改，或下載完成妝容。':hasChoices()?'目前妝感已調為原圖效果，可回到各部位調整，或下載目前畫面。':'還沒開始試妝。先選一款整體妝感，或返回眼妝、唇色搭配。';
 const container=$('finish-summary');container.replaceChildren();
 for(const part of ['look',...PARTS]){
  const row=document.createElement('div');row.className='finish-item';row.dataset.summaryStep=part;
  const text=document.createElement('div'),label=document.createElement('strong'),value=document.createElement('span');label.className='finish-item-label';label.textContent=LABELS[part];value.className='finish-item-value';value.textContent=slotDescription(part);text.append(label,value);
  const edit=document.createElement('button');edit.type='button';edit.dataset.editStep=part;edit.textContent=part==='look'&&!hasChoices()?'開始試妝':'調整';edit.disabled=busy;edit.onclick=()=>setStep(part);row.append(text,edit);container.append(row);
 }
 if(makeupStation?.hasPaint()){const note=document.createElement('p');note.className='hint';note.textContent='另外保留自由筆刷上妝，可回「自由上妝」繼續細畫。';container.append(note);}
 if(layers.length){const note=document.createElement('p');note.className='hint';note.textContent=`另外保留${layers.length}個細修圖層。`;container.append(note);}
}
function guidePreview(){const slot=guided[guideStep];return look(slot?.refId||selected);}
function refreshGuide(){
 const partStep=PARTS.includes(guideStep),makeupStep=guideStep==='look'||partStep,slot=guided[guideStep],index=STEPS.indexOf(guideStep);
 $('guide-title').textContent=TITLES[guideStep];$('guide-description').textContent=guideStep==='source'?'已選'+manifest.sources.find(s=>s.id===sourceId).label+'，可直接按「下一步：整體妝感」。':guideStep==='finish'&&hasChoices()&&!hasMakeup()?'目前妝感已調為原圖效果，可回到各部位調整，或下載目前畫面。':DESCRIPTIONS[guideStep]+(partStep?' 不用更換，就直接按下一步。':'');
 $('source-stage').hidden=false;$('makeup-stage').hidden=!makeupStep;$('finish-stage').hidden=guideStep!=='finish';
 document.querySelectorAll('#guide-steps [data-step]').forEach(button=>{
  const step=button.dataset.step,active=step===guideStep,state=button.querySelector('[data-step-state]');button.disabled=busy||(step==='finish'&&!hasChoices());button.classList.toggle('is-active',active);if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
  const chosen=step==='source'||(step==='finish'?hasChoices():!!guided[step]);button.classList.toggle('is-complete',chosen);
  if(state)state.textContent=step==='source'?manifest.sources.find(s=>s.id===sourceId).label:step==='finish'?(hasChoices()?'可下載':'尚未上妝'):guided[step]?.clear?'已清除':guided[step]?.refId?(available(guided[step].refId)?'已選擇':'此人像不適用'):step==='look'?'待選擇':guided.look?'沿用整體':'可略過';
 });
 let optionCount=0;document.querySelectorAll('[data-reference]').forEach(button=>{
  const item=look(button.dataset.reference),eligible=makeupStep&&(guideStep==='look'||GUIDE_OPTIONS[guideStep].includes(item.id))&&available(item.id)&&(category==='all'||item.category===category);button.hidden=!eligible;button.disabled=busy;const applied=!!slot?.refId&&slot.refId===item.id;button.setAttribute('aria-pressed',String(applied));button.querySelector('.applied-check').hidden=!applied;if(eligible)optionCount++;
 });
 $('empty-options').hidden=!makeupStep||optionCount>0;
 document.querySelectorAll('[data-category]').forEach(b=>{b.disabled=busy;b.setAttribute('aria-pressed',String(b.dataset.category===category));});
 const preview=guidePreview();$('selected-reference-image').src=asset(preview.reference);$('selected-reference-image').alt=preview.label+'參考原圖';$('selected-reference-name').textContent=preview.label;$('selected-reference-description').textContent=preview.description;
 $('step-adjustments').hidden=!makeupStep||!slot?.refId;
 $('step-current').textContent=makeupStep?(slot?.refId&&!available(slot.refId)?'已保留選擇，此人像暫不適用：':'✓ 已套用：')+slotDescription(guideStep):'';
 $('step-opacity').value=slot?.opacity??100;$('step-opacity-value').value=(slot?.opacity??100)+'%';$('step-hue').value=slot?.hue??0;$('step-hue-value').value=(slot?.hue??0)+'°';$('step-opacity').disabled=$('step-hue').disabled=busy||!slot?.refId;
 $('inherit-part').hidden=!partStep;$('inherit-part').disabled=busy||!slot;
 $('clear-part').hidden=!makeupStep;$('clear-part').disabled=busy||(partStep?!!slot?.clear:!guided.look);$('clear-part').textContent=guideStep==='look'?'移除整體妝感':'這個部位改回原圖';
 $('guide-prev').disabled=busy||index===0;$('guide-prev').textContent=index>0?'← '+LABELS[STEPS[index-1]]:'← 上一步';
 $('guide-next').hidden=index===STEPS.length-1;$('guide-next').disabled=busy||(guideStep==='look'&&(!guided.look||!available(guided.look.refId)))||(guideStep==='face'&&!hasChoices());
 if(index<STEPS.length-1)$('guide-next').textContent=guideStep==='look'&&!guided.look?'先點選一款妝感':guideStep==='look'&&!available(guided.look.refId)?'換一款適用的妝感':guideStep==='face'&&!hasChoices()?'先選擇想使用的妝容':(makeupStep&&!slot?'保留目前，下一步：':'下一步：')+LABELS[STEPS[index+1]]+' →';
 $('guide-finish').hidden=guideStep==='finish'||!hasChoices();$('guide-finish').disabled=busy;refreshSummary();
}
function refreshManual(){
 $('manual-reference').value=selected;$('manual-reference').disabled=busy;$('reference-label').textContent=current().label;$('source-label').textContent=manifest.sources.find(s=>s.id===sourceId).label;
 for(const option of $('manual-reference').options)option.textContent=look(option.value).label+(available(option.value)?'':'（此模特暫不提供）');
 const unavailable=!available(selected);$('pair-notice').hidden=!unavailable;$('pair-notice').textContent=unavailable?(manifest.rejected.find(r=>r.source===sourceId&&r.reference===selected)?.reason||'這個組合暫不提供，請換一款參考圖。'):'';$('proof').disabled=busy||unavailable;
 document.querySelectorAll('[data-source]').forEach(b=>{b.disabled=busy;b.setAttribute('aria-pressed',String(b.dataset.source===sourceId));});updateSelection();
}
function refreshAll(){refreshGuide();refreshManual();updateHistory();const enabled=hasChoices()&&!busy;$('download').disabled=$('finish-download').disabled=!enabled;$('reset').disabled=busy;makeupStation?.refresh();}
function setStep(step,{scroll=true}={}){
 if(busy||!STEPS.includes(step))return;if(step==='finish'&&!hasChoices()){announce('先選一款妝感，再查看完成搭配。');return;}guideStep=step;category='all';refreshGuide();schedule();
 if(scroll){
  const title=$('guide-title');title.focus({preventScroll:true});
  requestAnimationFrame(()=>{
   const bounds=title.getBoundingClientRect(),mobile=matchMedia('(max-width:720px)').matches;
   const visibleTop=mobile&&innerHeight>600?$('result-panel').getBoundingClientRect().height+8:0;
   if(bounds.top<visibleTop||bounds.top>innerHeight-100)window.scrollTo({top:Math.max(0,scrollY+bounds.top-visibleTop-12),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
  });
 }
}
function setBusy(value){busy=value;$('studio').setAttribute('aria-busy',String(value));refreshAll();}
async function chooseGuided(id){
 if(busy||!(guideStep==='look'||PARTS.includes(guideStep))||!available(id))return;
 const part=guideStep;if(part!=='look'&&!GUIDE_OPTIONS[part].includes(id))return;
 const same=guided[part]?.refId===id;
 if(same){announce('目前已使用這款'+LABELS[part]+'。');return;}
 setBusy(true);
 try{
  await ensureLook(id);remember();selected=id;selection.fill(0);loadBrush();
  if(part==='look'){guided={look:{refId:id,hue:0,opacity:100},eyes:null,lips:null,face:null};layers=[];activeId=null;refreshLayers();}
  else guided[part]={refId:id,hue:0,opacity:100};
  changed();announce('已換上'+look(id).label+'的'+LABELS[part]+'，可調整強度與色調。');
 }catch(error){announce('素材載入失敗，已保留原本搭配。');console.error(error);}
 finally{setBusy(false);refreshAll();schedule();}
}
async function chooseManual(id){
 if(busy||id===selected)return;setBusy(true);
 try{await ensureLook(id);remember();selected=id;selection.fill(0);loadBrush();announce('已切換細修參考圖，逐步搭配保持不變。');}
 catch(error){announce('參考圖載入失敗，請再試一次。');console.error(error);}finally{setBusy(false);schedule();}
}
async function changeSource(id){
 if(busy||id===sourceId)return;setBusy(true);
 try{
  const refs=[...new Set([selected,...Object.values(guided).filter(s=>s?.refId).map(s=>s.refId),...layers.map(l=>l.refId)])];
  await Promise.all([ensureSource(id),...refs.map(ref=>ensureLook(ref,id))]);remember();sourceId=id;manifest.source=manifest.sources.find(s=>s.id===id).image;makeupStation?.setSource(id);
  layers=layers.map(l=>({...l,available:available(l.refId),canvas:makeLayer(l.refId,l.mask)}));changed();refreshLayers();announce('已換人像；自由筆刷依人像分開保留，參考妝容沿用適用的配對。');
 }catch(error){announce('人像載入失敗，已保留原本搭配。');console.error(error);}finally{setBusy(false);schedule();}
}
function clearStep(inherit=false){
 if(busy||!(guideStep==='look'||PARTS.includes(guideStep)))return;
 const part=guideStep,next=part==='look'||inherit?null:{clear:true};if((next===null&&guided[part]===null)||(next?.clear&&guided[part]?.clear))return;
 remember();guided[part]=next;changed();refreshAll();announce(inherit?'已沿用整體妝感。':part==='look'?'已移除整體妝感，保留局部搭配。':'這個部位已改回原圖。');
}
function bindRange(element,callback){
 let tracked=false;element.addEventListener('pointerdown',()=>{if(busy)return;remember();tracked=true;});element.addEventListener('input',()=>{if(busy)return;if(!tracked){remember();tracked=true;}callback(Number(element.value));changed();refreshAll();});
 element.addEventListener('change',()=>{tracked=false;});element.addEventListener('blur',()=>{tracked=false;});
}
function loadBrush(){const data=bc.createImageData(MASK,MASK);for(let i=0;i<selection.length;i++){data.data[4*i]=255;data.data[4*i+1]=255;data.data[4*i+2]=255;data.data[4*i+3]=selection[i];}bc.putImageData(data,0,0);previewCache=null;updateSelection();}
function captureBrush(){const data=bc.getImageData(0,0,MASK,MASK).data;selection=new Uint8ClampedArray(MASK*MASK);for(let i=0;i<selection.length;i++)selection[i]=data[4*i+3];previewCache=null;updateSelection();}
function updateSelection(){let count=0;for(const value of selection)if(value>20)count++;selectionCount=count;$('selection-label').textContent=count?'已選 '+Math.round(count/selection.length*100)+'%':'尚未選取';$('add-layer').disabled=busy||!count||!available(selected)||layers.length>=12;$('clear-selection').disabled=busy||!count;}
function setSelection(values,label){if(busy)return;remember();selection=values.slice();loadBrush();schedule();announce(label);}
function point(event){const bounds=ref.getBoundingClientRect();return{x:Math.max(0,Math.min(MASK,(event.clientX-bounds.left)/bounds.width*MASK)),y:Math.max(0,Math.min(MASK,(event.clientY-bounds.top)/bounds.height*MASK))};}
function stroke(from,to){bc.save();bc.globalCompositeOperation=tool==='eraser'?'destination-out':'source-over';bc.strokeStyle='white';bc.fillStyle='white';bc.lineCap=bc.lineJoin='round';bc.lineWidth=Number($('brush-size').value);bc.beginPath();bc.moveTo(from.x,from.y);bc.lineTo(to.x,to.y);bc.stroke();bc.beginPath();bc.arc(to.x,to.y,bc.lineWidth/2,0,2*Math.PI);bc.fill();bc.restore();if(!pendingStroke){pendingStroke=true;requestAnimationFrame(()=>{if(pendingStroke){pendingStroke=false;captureBrush();schedule();}});}}
function wireBrush(){
 ref.addEventListener('pointerdown',event=>{if(event.button!==0||busy)return;event.preventDefault();remember();drawing=true;ref.setPointerCapture(event.pointerId);last=point(event);stroke(last,last);});
 ref.addEventListener('pointermove',event=>{const p=point(event),bounds=ref.getBoundingClientRect(),cursor=$('brush-cursor');cursor.hidden=event.pointerType==='touch';cursor.style.left=p.x/MASK*bounds.width+'px';cursor.style.top=p.y/MASK*bounds.height+'px';cursor.style.width=cursor.style.height=Number($('brush-size').value)/MASK*bounds.width+'px';if(drawing){stroke(last,p);last=p;}});
 const finish=()=>{if(!drawing)return;drawing=false;pendingStroke=false;captureBrush();schedule();announce('已選好這塊區域，可加入細修。');};for(const event of ['pointerup','pointercancel','lostpointercapture'])ref.addEventListener(event,finish);ref.addEventListener('pointerleave',()=>{$('brush-cursor').hidden=true;});
}
function syncOpacity(layer){const row=document.querySelector(`[data-layer-id="${layer.id}"]`);if(row){row.querySelector('input').value=layer.opacity;row.querySelector('output').value=layer.opacity+'%';}if(activeId===layer.id){$('layer-opacity').value=layer.opacity;$('layer-opacity-value').value=layer.opacity+'%';}}
function refreshEditor(){const layer=layers.find(l=>l.id===activeId);$('layer-editor').hidden=!layer;if(!layer)return;$('layer-editor-title').textContent=look(layer.refId).label+'・細修調整';$('layer-hue').value=layer.hue;$('layer-hue-value').value=layer.hue+'°';syncOpacity(layer);}
function refreshLayers(){
 const container=$('layers');container.replaceChildren();$('layer-count').textContent=layers.length;$('empty-layers').hidden=!!layers.length;
 [...layers].reverse().forEach(layer=>{
  const item=look(layer.refId),row=document.createElement('div');row.className='layer'+(layer.id===activeId?' is-selected':'')+(!layer.visible?' is-hidden':'');row.dataset.layerId=layer.id;
  row.innerHTML=`<button class="layer-select" aria-label="選取${item.label}細修" aria-pressed="${layer.id===activeId}"><img src="${asset(item.thumbnail)}" alt=""></button><div class="layer-meta"><button class="layer-name">${item.label}${layer.available?'':'（此模特不適用）'}</button><div><input type="range" min="0" max="100" value="${layer.opacity}" aria-label="${item.label}細修強度"><output>${layer.opacity}%</output></div></div><div class="layer-tools"><button data-action="visibility" aria-label="${layer.visible?'隱藏':'顯示'}細修">${layer.visible?'◉':'○'}</button><button data-action="up" aria-label="提高細修順序">↑</button><button data-action="down" aria-label="降低細修順序">↓</button><button data-action="remove" aria-label="刪除細修">×</button></div>`;
  for(const b of row.querySelectorAll('.layer-select,.layer-name'))b.onclick=()=>{if(busy)return;activeId=layer.id;refreshLayers();};
  const index=layers.indexOf(layer);row.querySelector('[data-action="up"]').disabled=index===layers.length-1;row.querySelector('[data-action="down"]').disabled=index===0;
  bindRange(row.querySelector('input'),value=>{layer.opacity=value;syncOpacity(layer);});
  row.querySelectorAll('[data-action]').forEach(button=>button.onclick=()=>{if(busy)return;remember();const at=layers.indexOf(layer);switch(button.dataset.action){case'visibility':layer.visible=!layer.visible;break;case'remove':layers.splice(at,1);if(activeId===layer.id)activeId=layers.at(-1)?.id??null;break;case'up':[layers[at],layers[at+1]]=[layers[at+1],layers[at]];break;case'down':[layers[at],layers[at-1]]=[layers[at-1],layers[at]];break;}changed();refreshLayers();refreshAll();announce('細修已更新。');});container.append(row);
 });refreshEditor();updateSelection();
}
function addSelection(){
 if($('add-layer').disabled)return;const mask=selection.slice(),c=makeLayer(selected,mask),data=c.getContext('2d').getImageData(0,0,SIZE,SIZE).data;let count=0;for(let i=3;i<data.length;i+=4)if(data[i]>12)count++;
 if(count<12){announce('這塊選區沒有足夠妝容，請擴大選區。');return;}remember();const layer={id:nextId++,refId:selected,opacity:100,visible:true,available:true,mask,canvas:c,hue:0};layers.push(layer);activeId=layer.id;selection.fill(0);loadBrush();changed();refreshLayers();refreshAll();announce('已加入額外細修，可調整強度與色調。');
}
function buildLibraries(){
 for(const source of manifest.sources){const button=document.createElement('button');button.type='button';button.className='source-card';button.dataset.source=source.id;button.innerHTML=`<img src="${asset(source.image)}" alt="${source.label}" width="96" height="96"><span>${source.label}</span>`;button.onclick=()=>changeSource(source.id);$('sources').append(button);}
 for(const item of manifest.looks){const button=document.createElement('button');button.type='button';button.className='reference-card';button.dataset.reference=item.id;button.dataset.kind=item.category;button.innerHTML=`<img src="${asset(item.reference)}" alt="${item.label}參考圖" width="88" height="88"><span><strong>${item.label}</strong><small>${item.description}</small><small class="applied-check" hidden>✓ 已套用</small></span>`;button.onclick=()=>chooseGuided(item.id);$('references').append(button);const option=document.createElement('option');option.value=item.id;option.textContent=item.label;$('manual-reference').append(option);}
}
function reset(){if(busy)return;remember();makeupStation?.clearAll();guided={look:null,eyes:null,lips:null,face:null};layers=[];activeId=null;wholeHue=0;guideStep='source';category='all';selection.fill(0);$('whole-hue').value=0;$('whole-hue-value').value='0°';loadBrush();changed();refreshLayers();refreshAll();announce('已清除所有模特的手繪與目前參考妝容；可按「復原」還原。');}
function download(){if(!hasChoices()||busy)return;const c=canvas();paint(c.getContext('2d'),false);c.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='irismix-makeup.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);announce('已下載完成搭配與已加入的細修，不含尚未加入的預覽。');},'image/png');}
function wireUpload(){let url=null,revision=0;const clear=()=>{revision++;if(url)URL.revokeObjectURL(url);url=null;$('photo-file').value='';$('uploaded-image').removeAttribute('src');$('upload-preview').hidden=true;$('clear-upload').hidden=true;};document.querySelectorAll('[data-upload]').forEach(b=>{b.disabled=false;b.onclick=()=>{$('upload-title').textContent=b.dataset.upload==='source'?'檢查自己的人像':'檢查自己的 REF';$('upload-dialog').showModal();};});$('close-upload').onclick=()=>{$('upload-dialog').close();clear();};$('upload-dialog').addEventListener('cancel',clear);$('clear-upload').onclick=clear;$('photo-file').onchange=async()=>{const file=$('photo-file').files[0];if(!file)return;clear();const token=revision;$('upload-preview').hidden=false;$('clear-upload').hidden=false;$('upload-report').textContent='正在本機檢查照片，首次使用需載入人臉檢查元件…';if(['image/jpeg','image/png','image/webp'].includes(file.type)&&file.size<=12*1024*1024){url=URL.createObjectURL(file);$('uploaded-image').src=url;}try{const {checkPhoto}=await import('./quality.js?v=mp0.10.21');const report=await checkPhoto(file);if(token!==revision)return;$('upload-report').replaceChildren();const title=document.createElement('strong');title.textContent=report.ok?'通過初步檢查':'這張照片不適合，請更換';$('upload-report').append(title);for(const text of [...report.issues,...report.warnings]){const p=document.createElement('p');p.textContent=text;$('upload-report').append(p);}const note=document.createElement('p');note.textContent='照片檢查完成；自訂照片推論目前暫停開放。';$('upload-report').append(note);}catch(e){if(token===revision)$('upload-report').textContent='照片檢查元件無法載入或檔案無法解碼，請換一張照片或稍後重試。';console.error(e);}};}async function start(){try{
 const responses=await Promise.all([fetch(asset('manifest.json'),{cache:'no-cache'}),fetch('assets/guided/regions.json',{cache:'no-cache'})]);if(responses.some(r=>!r.ok))throw Error('Unable to load makeup library');
 [manifest,regionManifest]=await Promise.all(responses.map(r=>r.json()));if(regionManifest.size!==SIZE)throw Error('Wrong source region size');sourceId=manifest.defaultSource;manifest.source=manifest.sources.find(s=>s.id===sourceId).image;
 await Promise.all([ensureSource(sourceId),ensureLook(selected)]);buildLibraries();wireBrush();wireUpload();
 makeupStation=await createMakeupStation({
  getSource:()=>sourceId,isBusy:()=>busy,announce,
  onLive:()=>{resetComparison();schedule();},captureHistory:snapshot,
  commitHistory:state=>{if(!state)return;history.push(state);if(history.length>30)history.shift();future=[];updateHistory();},
  onCommit:()=>{refreshAll();schedule();},
  onMode:mode=>{if(mode==='reference'&&guideStep==='source'){guideStep='look';category='all';}refreshAll();schedule();}
 });makeupStation.setSource(sourceId);

 for(const id of ['brush','eraser','brush-size','live-preview','compare','reveal','reset','whole-hue'])$(id).disabled=false;
 document.querySelectorAll('#guide-steps [data-step]').forEach(b=>b.onclick=()=>setStep(b.dataset.step));$('guide-prev').onclick=()=>setStep(STEPS[STEPS.indexOf(guideStep)-1]);$('guide-next').onclick=()=>setStep(STEPS[STEPS.indexOf(guideStep)+1]);$('guide-finish').onclick=()=>setStep('finish');
 document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{if(busy)return;category=b.dataset.category;refreshGuide();});
 $('inherit-part').onclick=()=>clearStep(true);$('clear-part').onclick=()=>clearStep(false);$('manual-reference').onchange=()=>chooseManual($('manual-reference').value);
 bindRange($('step-opacity'),value=>{const slot=guided[guideStep];if(slot?.refId)slot.opacity=value;});bindRange($('step-hue'),value=>{const slot=guided[guideStep];if(slot?.refId)slot.hue=value;});
 for(const id of ['undo','guide-undo'])if($(id))$(id).onclick=undo;for(const id of ['redo','guide-redo'])if($(id))$(id).onclick=redo;
 $('selected-reference').onclick=()=>{const preview=guidePreview();$('reference-large-title').textContent=preview.label+'・參考原圖';$('reference-large').src=asset(preview.reference);$('reference-dialog').showModal();};$('close-reference').onclick=()=>$('reference-dialog').close();
 document.querySelectorAll('[data-region]').forEach(b=>{b.disabled=false;b.onclick=()=>setSelection(b.dataset.region==='all'?new Uint8ClampedArray(MASK*MASK).fill(255):regionMasks.get(selected+':'+b.dataset.region),'已選好區域，可用筆刷修整。');});
 for(const id of ['brush','eraser'])$(id).onclick=()=>{tool=id;$('brush').setAttribute('aria-pressed',String(id==='brush'));$('eraser').setAttribute('aria-pressed',String(id==='eraser'));};$('brush-size').oninput=()=>{$('brush-size-value').value=$('brush-size').value;};$('clear-selection').onclick=()=>setSelection(new Uint8ClampedArray(MASK*MASK),'已清除細修選區。');$('add-layer').onclick=addSelection;$('live-preview').onchange=()=>{updateSelection();schedule();};$('advanced').addEventListener('toggle',schedule);
 bindRange($('whole-hue'),value=>{wholeHue=value;$('whole-hue-value').value=value+'°';});bindRange($('layer-hue'),value=>{const layer=layers.find(l=>l.id===activeId);if(layer){layer.hue=value;$('layer-hue-value').value=value+'°';}});bindRange($('layer-opacity'),value=>{const layer=layers.find(l=>l.id===activeId);if(layer){layer.opacity=value;syncOpacity(layer);}});$('reset-layer').onclick=()=>{const layer=layers.find(l=>l.id===activeId);if(!layer||busy)return;remember();Object.assign(layer,{hue:0,opacity:100});changed();refreshLayers();refreshAll();};
 $('compare').onclick=()=>{original=!original;$('compare').setAttribute('aria-pressed',String(original));$('compare').textContent=original?'◐ 返回妝容':'◐ 比較原圖';schedule();};$('reveal').oninput=()=>{reveal=Number($('reveal').value);$('reveal-value').value=reveal+'%';original=false;$('compare').setAttribute('aria-pressed','false');$('compare').textContent='◐ 比較原圖';schedule();};$('download').onclick=$('finish-download').onclick=download;$('reset').onclick=reset;
 $('proof').onclick=()=>{const pair=current().pairs[sourceId];if(!pair||busy)return;$('proof-title').textContent=current().label+'・渲染前後';$('proof-warp').src=asset(pair.warp);$('proof-render').src=asset(pair.render);$('proof-dialog').showModal();};$('close-proof').onclick=()=>$('proof-dialog').close();$('help-toggle').onclick=()=>{const open=$('usage-help').hidden;$('usage-help').hidden=!open;$('help-toggle').setAttribute('aria-expanded',String(open));};
 document.addEventListener('keydown',event=>{if(event.target.matches('input,textarea,select')||document.querySelector('dialog[open]'))return;if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();event.shiftKey?redo():undo();}if($('advanced').open){if(event.key==='b')$('brush').click();if(event.key==='e')$('eraser').click();}});
 result.hidden=false;$('fallback').hidden=true;busy=false;$('studio').setAttribute('aria-busy','false');loadBrush();refreshLayers();refreshAll();schedule();$('experience-note').textContent='眼影畫筆已準備好，也可以切換唇色或腮紅。';announce('畫筆已準備好，在標示的上眼皮拖曳，就能畫第一筆。');
 }catch(error){busy=false;$('studio').setAttribute('aria-busy','false');$('error').hidden=false;announce('素材載入失敗，請重新整理。');console.error(error);}}
start();
})();
