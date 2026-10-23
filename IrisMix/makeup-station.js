import {createCosmeticBrush} from './cosmetic-brush.js?v=2';
const $=id=>document.getElementById(id);
const NAMES={eyes:'眼影',lips:'唇色',blush:'腮紅'};
const TARGETS={eyes:'上眼皮',lips:'嘴唇表面',blush:'臉頰'};
const PALETTES={
 eyes:[['#a4636b','玫瑰棕'],['#986a4e','焦糖棕'],['#6e4c46','可可棕'],['#b78589','煙燻粉'],['#9a6477','莓果紫'],['#7d6076','霧紫'],['#556863','鼠尾草'],['#506f82','霧藍'],['#bca486','香檳米'],['#ca8b6c','蜜桃'],['#443c3d','深咖'],['#5a4f6d','灰紫']],
 lips:[['#b34c60','玫瑰'],['#a62f46','莓紅'],['#c33d32','番茄紅'],['#95404e','豆沙'],['#c26b62','珊瑚'],['#964232','磚紅'],['#824050','紅酒'],['#c4817e','乾燥玫瑰']],
 blush:[['#d78c88','雲朵粉'],['#cc8277','蜜桃'],['#c16870','莓果'],['#d8a48d','杏桃'],['#b96f7a','玫瑰'],['#c88d98','薔薇'],['#c27b65','暖杏'],['#b77983','煙燻粉']]
};
const DEFAULTS={
 eyes:{color:'#a4636b',colorName:'玫瑰棕',brush:'soft',size:36,opacity:.35,flow:.9,softness:.8,angle:0,directionalSpread:16,direction:'stroke',tool:'paint'},
 lips:{color:'#b34c60',colorName:'玫瑰',brush:'flat',size:18,opacity:.4,flow:.9,softness:.55,angle:0,directionalSpread:4,direction:'stroke',tool:'paint'},
 blush:{color:'#d78c88',colorName:'雲朵粉',brush:'soft',size:80,opacity:.22,flow:.85,softness:.95,angle:0,directionalSpread:20,direction:'stroke',tool:'paint'}
};
const BRUSH_NAMES={soft:'圓頭暈染刷',flat:'扁平刷',angled:'斜角刷'};
const DIR_NAMES={stroke:'跟著筆觸暈染',outward:'向外暈開',horizontal:'左右暈開',vertical:'上下暈開',custom:'自訂角度'};
export async function createMakeupStation(hooks){
 const response=await fetch('assets/cosmetics/face-guides.json',{cache:'no-cache'});if(!response.ok)throw Error('無法載入試妝部位');
 const guides=await response.json();
 const settings=Object.fromEntries(Object.entries(DEFAULTS).map(([p,v])=>[p,{...v}]));
 const painter=createCosmeticBrush({size:640,onChange:()=>hooks.onLive?.()});
 const canvas=$('result'),frame=$('cosmetic-frame'),cursor=$('cosmetic-cursor');
 let sourceId=null,part=null,panelOpen=false,pane='palette',mode='paint',view='full',activePointer=null,historyToken=null,multiTouch=false;
 const lastLayerByPart=new Map();let adjustmentToken=null,adjustmentChanged=false;
 const touches=new Set();let cursorLastPoint=null;
 const opts=()=>settings[part||'eyes'];
 const strokeOptions=()=>{const o=opts();return {...o,angle:o.direction==='custom'?o.angle:0};};
 const selectedLayer=()=>painter.getLayers().find(layer=>layer.selected);
 function syncSelectedPart(){const layer=selectedLayer();if(layer){part=layer.part;lastLayerByPart.set(sourceId+':'+part,layer.id);}}
 function mutateLayer(action,message){
  if(hooks.isBusy?.())return false;cancel();finishAdjustment();const token=hooks.captureHistory?.(),previous=part,changed=action();
  if(changed===false||changed==null)return false;syncSelectedPart();if(part!==previous)view=part==='blush'?'full':part;hooks.commitHistory?.(token);hooks.onCommit?.();renderPanel();applyView();if(message)hooks.announce?.(message);return changed;
 }
 function addLayer(next=part||'eyes'){
  const existing=painter.getLayers().filter(layer=>layer.part===next),used=new Set(existing.map(layer=>layer.name));let n=1;while(used.has(NAMES[next]+' '+n))n++;
  const id=mutateLayer(()=>painter.createLayer(next,NAMES[next]+' '+n),'已新增'+NAMES[next]+'圖層，接下來的筆觸會畫在這一層。');
  if(!id)hooks.announce?.('圖層已達上限，請刪除不用的圖層後繼續。');return id;
 }
 function setPane(next,{focus=false}={}){
  pane=next==='layers'?'layers':'palette';renderPanel();if(focus)$(pane==='layers'?'pigment-layers-tab':'palette-tab').focus({preventScroll:true});
 }
 function renderLayers(){
  const layers=painter.getLayers(),selected=layers.find(layer=>layer.selected),busy=!!hooks.isBusy?.();
  const focused=document.activeElement,focusedRow=focused?.closest('.pigment-layer-row'),focusId=focusedRow?.dataset.pigmentLayerId,focusAction=focused?.dataset.layerAction||'select';
  $('pigment-layer-count').textContent=String(layers.length);
  for(const[id,name]of[['palette-tab','palette'],['pigment-layers-tab','layers']]){const tab=$(id);tab.setAttribute('aria-selected',String(pane===name));tab.tabIndex=pane===name?0:-1;}
  $('palette-pane').hidden=pane!=='palette';$('pigment-layers-panel').hidden=pane!=='layers';
  const active=$('active-pigment-layer');active.replaceChildren();active.append(selected?'正在編輯：'+selected.name:part?'畫第一筆會建立'+NAMES[part]+'圖層。':'點選彩妝工具，建立第一個圖層。');
  if(selected&&(!selected.visible||selected.opacity===0)){const warning=document.createElement('span');warning.className='active-layer-warning';warning.textContent=!selected.visible?'這層已隱藏，請先在圖層面板顯示後再畫。':'這層強度為 0%，調高圖層強度才會顯示。';active.append(warning);}
  const list=$('pigment-layers');list.replaceChildren();
  for(const layer of [...layers].reverse()){
   const index=layers.indexOf(layer),row=document.createElement('div');row.className='pigment-layer-row';row.dataset.pigmentLayerId=layer.id;row.dataset.selected=String(layer.selected);row.dataset.visible=String(layer.visible);
   const choose=document.createElement('button');choose.type='button';choose.className='pigment-layer-select';choose.setAttribute('aria-pressed',String(layer.selected));choose.disabled=busy;choose.setAttribute('aria-label','編輯'+layer.name);
   const dot=document.createElement('span');dot.className='pigment-layer-dot';dot.style.setProperty('--layer-color',layer.color||DEFAULTS[layer.part].color);dot.setAttribute('aria-hidden','true');
   const text=document.createElement('span');text.className='pigment-layer-text';const name=document.createElement('span');name.className='pigment-layer-name';name.textContent=layer.name;const meta=document.createElement('span');meta.className='pigment-layer-meta';meta.textContent=NAMES[layer.part]+' · '+(layer.strokeCount?layer.strokeCount+' 筆':'空白圖層')+' · '+Math.round(layer.opacity*100)+'%';text.append(name,meta);choose.append(dot,text);
   choose.onclick=()=>{cancel();finishAdjustment();const oldPart=part;painter.selectLayer(layer.id);syncSelectedPart();panelOpen=true;if(oldPart!==part)view=part==='blush'?'full':part;renderPanel();applyView();hooks.announce?.('正在編輯'+layer.name+'。');};
   const visibility=document.createElement('button');visibility.type='button';visibility.className='pigment-layer-visibility';visibility.dataset.layerAction='visibility';visibility.disabled=busy;visibility.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12Q12-1 22 12Q12 25 2 12Z"/><circle cx="12" cy="12" r="3"/>'+(layer.visible?'':'<path d="M3 3 21 21"/>')+'</svg>';visibility.setAttribute('aria-label',(layer.visible?'隱藏':'顯示')+layer.name);visibility.setAttribute('aria-pressed',String(layer.visible));visibility.title=visibility.getAttribute('aria-label');visibility.onclick=()=>mutateLayer(()=>painter.setLayerProps(layer.id,{visible:!layer.visible}),layer.name+(layer.visible?'已隱藏。':'已顯示。'));
   row.append(choose,visibility);
   if(layer.selected){const controls=document.createElement('div');controls.className='pigment-layer-controls';for(const[action,label,disabled,run]of[['up','↑ 往前',index===layers.length-1,()=>painter.moveLayer(layer.id,1)],['down','↓ 往後',index===0,()=>painter.moveLayer(layer.id,-1)],['delete','刪除',false,()=>painter.removeLayer(layer.id)]]){const button=document.createElement('button');button.type='button';button.dataset.layerAction=action;button.textContent=label;button.disabled=disabled||busy;button.setAttribute('aria-label',label.replace(/[↑↓] /,'')+layer.name);button.onclick=()=>mutateLayer(run,action==='delete'?'已刪除'+layer.name+'，可按復原還原。':layer.name+(action==='up'?'已往前一層。':'已往後一層。'));controls.append(button);}row.append(controls);}
   list.append(row);
  }
  $('empty-pigment-layers').hidden=layers.length>0;$('add-pigment-layer').textContent='＋ 新增'+(part?NAMES[part]:'')+'圖層';$('add-pigment-layer').disabled=busy;
  $('pigment-layer-adjustments').hidden=!selected;
  if(selected){$('pigment-layer-editor-title').textContent=selected.name+'調整';for(const[key,mul,suffix]of[['opacity',100,'%'],['hue',1,'°']]){const value=Math.round(selected[key]*mul);$('pigment-layer-'+key).value=value;$('pigment-layer-'+key).disabled=busy;$('pigment-layer-'+key+'-value').value=value+suffix;}}
  if(focusId){const row=[...list.children].find(row=>row.dataset.pigmentLayerId===focusId)||list.querySelector('[data-selected=true]'),button=row?.querySelector(focusAction==='select'?'.pigment-layer-select':`[data-layer-action="${focusAction}"]`);(button&&!button.disabled?button:row?.querySelector('.pigment-layer-select')||$('add-pigment-layer')).focus({preventScroll:true});}
 }
 function finishAdjustment(){const changed=adjustmentChanged,token=adjustmentToken;adjustmentToken=null;adjustmentChanged=false;if(changed){hooks.commitHistory?.(token);hooks.onCommit?.();}}
 function applyView(){
  const source=guides.sources[sourceId];let scale=1,cx=320,cy=320;
  if(mode==='paint'&&source&&view!=='full'){
   const box=source.bounds[view];if(box){cx=(box[0]+box[2])/2;cy=(box[1]+box[3])/2;scale=view==='eyes'?2.45:2.65;}
  }
  canvas.style.transform=scale===1?'none':`translate(${(0.5-cx/640*scale)*100}%,${(0.5-cy/640*scale)*100}%) scale(${scale})`;
  canvas.dataset.viewScale=String(scale);frame.classList.toggle('is-zoomed',scale!==1);
  document.querySelectorAll('[data-cosmetic-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cosmeticView===view)));
 }
 function updateTip(){
  const o=opts(),c=$('cosmetic-tip'),x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);
  const angle=o.direction==='vertical'?-90:o.direction==='outward'?-28:o.direction==='custom'?o.angle:0;
  const rx=Math.min(70,o.size*.55+o.directionalSpread*.45),ry=Math.max(5,o.size*(o.brush==='flat'?.18:o.brush==='angled'?.27:.45));
  x.save();x.translate(91,36);x.rotate(angle*Math.PI/180);x.scale(rx,Math.min(27,ry));
  const gradient=x.createRadialGradient(0,0,0,0,0,1);gradient.addColorStop(0,o.color+'d0');gradient.addColorStop(Math.max(.1,1-o.softness),o.color+'90');gradient.addColorStop(1,o.color+'00');x.fillStyle=gradient;x.beginPath();x.arc(0,0,1,0,Math.PI*2);x.fill();x.restore();
  x.save();x.translate(91,36);x.rotate(angle*Math.PI/180);x.strokeStyle='#7b3548';x.lineWidth=1.5;x.beginPath();x.moveTo(-17,0);x.lineTo(25,0);x.lineTo(19,-5);x.moveTo(25,0);x.lineTo(19,5);x.stroke();x.restore();
  $('cosmetic-tip-label').textContent=DIR_NAMES[o.direction];
 }
 function renderPanel(){
  renderLayers();
  document.querySelectorAll('[data-cosmetic-tool]').forEach(b=>{b.setAttribute('aria-expanded',String(pane==='palette'&&panelOpen&&part===b.dataset.cosmeticTool));b.setAttribute('aria-pressed',String(part===b.dataset.cosmeticTool));});
  $('cosmetic-panel').hidden=!panelOpen;$('station-welcome').hidden=panelOpen;
  canvas.dataset.painting=String(mode==='paint'&&!!part);
  if(!part)return;
  const o=opts();$('cosmetic-panel-title').textContent=NAMES[part]+'調色盤';
  const swatches=$('cosmetic-swatches'),focusedColor=document.activeElement?.closest('.cosmetic-swatch')?.dataset.color;swatches.replaceChildren();
  for(const[color,name]of PALETTES[part]){const b=document.createElement('button');b.type='button';b.className='cosmetic-swatch';b.dataset.color=color;b.style.setProperty('--swatch',color);b.setAttribute('aria-label',name+' '+color);b.setAttribute('aria-pressed',String(color===o.color));b.title=name;b.onclick=()=>{o.color=color;o.colorName=name;renderPanel();};swatches.append(b);}
  if(focusedColor)swatches.querySelector(`[data-color="${focusedColor}"]`)?.focus({preventScroll:true});
  $('cosmetic-color').value=o.color;$('cosmetic-color-name').textContent=o.colorName;
  for(const[id,key,suffix,mul]of[['size','size','',1],['opacity','opacity','%',100],['softness','softness','%',100],['spread','directionalSpread','',1],['angle','angle','°',1]]){
   const value=Math.round(o[key]*mul);$('cosmetic-'+id).value=value;$('cosmetic-'+id+'-value').value=value+suffix;
  }
  $('cosmetic-direction').value=o.direction;$('cosmetic-angle-field').hidden=o.direction!=='custom';
  document.querySelectorAll('[data-cosmetic-brush]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cosmeticBrush===o.brush)));
  document.querySelectorAll('[data-cosmetic-action]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cosmeticAction===o.tool)));
  $('cosmetic-instruction').textContent=o.tool==='paint'?'已選'+o.colorName+'，在'+TARGETS[part]+'拖曳上色。':o.tool==='blend'?'在目前圖層的顏色邊緣拖曳，順著筆觸暈開。':'只擦除目前圖層的顏色，保留其他層。';
  $('station-welcome').querySelector('p').textContent='已選'+NAMES[part]+'・'+o.colorName+'。直接在人臉拖曳；要換色時再打開工具。';
  const layer=selectedLayer();$('clear-cosmetic-part').textContent='清除'+(layer?.name||'目前圖層');$('clear-cosmetic-part').disabled=!layer||!painter.layerHasPaint(layer.id)||hooks.isBusy?.();
  updateTip();
 }
 function selectPart(next,{zoom=true}={}){
  if(!NAMES[next]||hooks.isBusy?.())return;cancel();finishAdjustment();part=next;panelOpen=true;pane='palette';
  const layers=painter.getLayers(),remembered=lastLayerByPart.get(sourceId+':'+next),matching=layers.find(layer=>layer.id===remembered&&layer.part===next)||[...layers].reverse().find(layer=>layer.part===next);
  if(matching){painter.selectLayer(matching.id);lastLayerByPart.set(sourceId+':'+next,matching.id);}else addLayer(next);
  if(zoom)view=next==='blush'?'full':next;renderPanel();applyView();
  hooks.announce?.('已打開'+NAMES[next]+'調色盤；選色後直接在人臉拖曳。');
 }
 function setMode(next){
  cancel();finishAdjustment();mode=next==='reference'?'reference':'paint';$('studio').dataset.experience=mode;
  document.querySelectorAll('.experience-switch [data-experience]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.experience===mode)));
  $('experience-note').textContent=mode==='paint'?'挑一種彩妝，打開調色盤與刷具。':'搭配已完成的 IrisMix 參考妝容，也可回來自由細畫。';
  applyView();cursor.hidden=true;renderPanel();hooks.onMode?.(mode);
 }
 function locate(event){const r=canvas.getBoundingClientRect();return{x:(event.clientX-r.left)/r.width*640,y:(event.clientY-r.top)/r.height*640,pressure:event.pointerType==='pen'?Math.max(.1,event.pressure||.5):1};}
 function pickPart(p){
  const b=guides.sources[sourceId]?.bounds;if(!b)return null;
  for(const key of ['eyes','lips','blush']){const r=b[key],pad=key==='eyes'?18:5;if(p.x>=r[0]-pad&&p.x<=r[2]+pad&&p.y>=r[1]-pad&&p.y<=r[3]+pad)return key;}return null;
 }
 function drawCursor(event){
  if(!part||mode!=='paint'||event.pointerType==='touch'){cursor.hidden=true;return;}
  const r=frame.getBoundingClientRect(),c=canvas.getBoundingClientRect(),o=opts(),point=locate(event),unit=c.width/640;
  const tip=painter.footprint(part,strokeOptions(),point,cursorLastPoint||point);cursorLastPoint=point;if(!tip)return;
  const x=tip.x+Math.cos(tip.angle)*tip.offsetX,y=tip.y+Math.sin(tip.angle)*tip.offsetX;
  cursor.hidden=false;cursor.style.left=(c.left+x*unit-r.left)+'px';cursor.style.top=(c.top+y*unit-r.top)+'px';
  cursor.style.width=2*tip.radiusX*unit+'px';cursor.style.height=2*tip.radiusY*unit+'px';cursor.style.borderRadius=tip.brush==='soft'?'50%':'3px';
  cursor.style.transform=`translate(-50%,-50%) rotate(${tip.angle}rad) skewX(${-Math.atan(tip.shear)}rad)`;
 }

 function cancel(){cursorLastPoint=null;if(activePointer!==null)painter.cancelStroke();activePointer=null;historyToken=null;cursor.hidden=true;}
 canvas.addEventListener('pointerdown',event=>{
  if(mode!=='paint'||hooks.isBusy?.()||event.button!==0)return;
  if(event.pointerType==='touch'){touches.add(event.pointerId);if(touches.size>1){multiTouch=true;cancel();return;}}
  if(multiTouch)return;
  if(!part){const picked=pickPart(locate(event));if(picked){event.preventDefault();selectPart(picked);}return;}
  event.preventDefault();historyToken=hooks.captureHistory?.();const started=painter.beginStroke(part,strokeOptions(),locate(event));
  if(!started.ok){historyToken=null;hooks.announce?.(started.reason==='layer-hidden'?'目前圖層已隱藏，請在「妝容圖層」按顯示後再畫。':String(started.reason).includes('limit')?'筆畫已達上限，請清除不用的手繪內容後繼續。':'請先選彩妝，再在對應的臉部區域上色。');return;}
  activePointer=event.pointerId;canvas.setPointerCapture(event.pointerId);drawCursor(event);
 });
 canvas.addEventListener('pointermove',event=>{
  drawCursor(event);if(activePointer!==event.pointerId||multiTouch)return;event.preventDefault();
  const coalesced=event.getCoalescedEvents?.();for(const point of coalesced?.length?coalesced.slice(-10):[event]){const result=painter.updateStroke(locate(point));if(!result.ok){hooks.announce?.('這筆已達長度上限，放開後可繼續畫下一筆。');break;}}
 });
 function finish(event,cancelled=false){
  if(event.pointerType==='touch'){touches.delete(event.pointerId);if(!touches.size)multiTouch=false;}
  if(activePointer!==event.pointerId)return;
  if(cancelled){cancel();return;}const token=historyToken;activePointer=null;historyToken=null;const ended=painter.endStroke();
  if(ended.changed){hooks.commitHistory?.(token);hooks.onCommit?.();hooks.announce?.(opts().tool==='erase'?'已擦除這筆顏色。':opts().tool==='blend'?'已暈開這筆顏色。':'已畫上'+opts().colorName+'，可繼續疊色或暈染。');}
  else hooks.announce?.(opts().tool==='paint'?'這筆沒有畫到可上色區域，請在'+TARGETS[part]+'試畫。':opts().tool==='erase'?'這裡還沒有可擦除的手繪顏色。':'請從已有顏色往邊緣拖曳暈染。');
  renderPanel();
 }
 canvas.addEventListener('pointerup',e=>finish(e));canvas.addEventListener('pointercancel',e=>finish(e,true));canvas.addEventListener('lostpointercapture',e=>finish(e,true));canvas.addEventListener('pointerleave',()=>cursor.hidden=true);
 document.querySelectorAll('[data-cosmetic-tool]').forEach(b=>b.onclick=()=>selectPart(b.dataset.cosmeticTool));
 $('palette-tab').onclick=()=>setPane('palette');$('pigment-layers-tab').onclick=()=>setPane('layers');
 for(const id of ['palette-tab','pigment-layers-tab'])$(id).onkeydown=event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();setPane(event.key==='Home'?'palette':event.key==='End'?'layers':pane==='palette'?'layers':'palette',{focus:true});}};
 $('add-pigment-layer').onclick=()=>{const previous=part;if(addLayer()){panelOpen=true;if(!previous)view=part==='blush'?'full':part;renderPanel();applyView();}};
 for(const[key,mul]of[['opacity',.01],['hue',1]]){const input=$('pigment-layer-'+key);input.oninput=()=>{if(hooks.isBusy?.()||!selectedLayer())return;cancel();if(!adjustmentChanged)adjustmentToken=hooks.captureHistory?.();const changed=painter.setLayerProps(painter.activeLayerId,{[key]:Number(input.value)*mul});adjustmentChanged=adjustmentChanged||changed;renderLayers();};input.onchange=finishAdjustment;input.onblur=finishAdjustment;}
 document.querySelectorAll('.experience-switch [data-experience]').forEach(b=>b.onclick=()=>setMode(b.dataset.experience));
 document.querySelectorAll('[data-cosmetic-view]').forEach(b=>b.onclick=()=>{cancel();view=b.dataset.cosmeticView;applyView();});
 document.querySelectorAll('[data-cosmetic-brush]').forEach(b=>b.onclick=()=>{opts().brush=b.dataset.cosmeticBrush;renderPanel();});
 document.querySelectorAll('[data-cosmetic-action]').forEach(b=>b.onclick=()=>{opts().tool=b.dataset.cosmeticAction;renderPanel();});
 for(const[id,key,mul]of[['size','size',1],['opacity','opacity',.01],['softness','softness',.01],['spread','directionalSpread',1],['angle','angle',1]])$('cosmetic-'+id).oninput=()=>{opts()[key]=Number($('cosmetic-'+id).value)*mul;renderPanel();};
 $('cosmetic-direction').onchange=()=>{opts().direction=$('cosmetic-direction').value;renderPanel();};
 $('cosmetic-color').oninput=()=>{opts().color=$('cosmetic-color').value;opts().colorName='自訂色';renderPanel();};
 $('close-cosmetic-panel').onclick=()=>{panelOpen=false;renderPanel();$('makeup-station').querySelector(`[data-cosmetic-tool=${part}]`).focus({preventScroll:true});};
 $('clear-cosmetic-part').onclick=()=>{const layer=selectedLayer();if(layer&&painter.layerHasPaint(layer.id))mutateLayer(()=>painter.clearLayer(layer.id),'已清除'+layer.name+'的筆觸，保留其他圖層。');};
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&panelOpen&&!document.querySelector('dialog[open]')){cancel();panelOpen=false;renderPanel();}});
 return{
  get mode(){return mode;},get activePart(){return part;},setMode,
  setSource(id){if(!guides.sources[id])throw Error('找不到人像部位');cancel();finishAdjustment();sourceId=id;painter.setSource(id,guides.sources[id]);syncSelectedPart();applyView();renderPanel();},
  render(context,base){painter.render(context,base);},hasPaint(){return painter.hasPaint();},hasContent(){return painter.getLayers().some(layer=>layer.strokeCount>0);},snapshot(){return painter.snapshot();},
  restore(state){cancel();adjustmentToken=null;adjustmentChanged=false;if(state)painter.restore(state);else painter.clearAll();if(sourceId)painter.setSource(hooks.getSource(),guides.sources[hooks.getSource()]);sourceId=hooks.getSource();syncSelectedPart();applyView();renderPanel();},
  clearAll(){cancel();adjustmentToken=null;adjustmentChanged=false;painter.clearAll();lastLayerByPart.clear();part=null;panelOpen=false;pane='palette';view='full';renderPanel();applyView();},
  refresh(){renderPanel();},guides
 };
}
