const $=id=>document.getElementById(id),N=512;
export function createReferenceEditor(){
 const dialog=$('reference-edit-dialog'),ref=$('reference-edit-canvas'),preview=$('reference-edit-preview'),context=ref.getContext('2d');
 const mask=document.createElement('canvas');mask.width=mask.height=N;const mc=mask.getContext('2d',{willReadFrequently:true});
 const overlay=document.createElement('canvas');overlay.width=overlay.height=N;const oc=overlay.getContext('2d');
 let state=null,tool='keep',pointer=null,last=null,before=null,scheduled=false,undo=[],redo=[],touched=false;const touches=new Set();let multi=false;
 const values=()=>{const rgba=mc.getImageData(0,0,N,N).data,out=new Uint8ClampedArray(N*N);for(let i=0;i<out.length;i++)out[i]=rgba[4*i+3];return out;};
 function put(data){const image=mc.createImageData(N,N);for(let i=0;i<data.length;i++){image.data[4*i]=255;image.data[4*i+1]=255;image.data[4*i+2]=255;image.data[4*i+3]=data[i];}mc.putImageData(image,0,0);}
 function history(){undo.push(values());if(undo.length>24)undo.shift();redo=[];touched=true;}
 function draw(){scheduled=false;if(!state)return;const selected=values();context.clearRect(0,0,N,N);context.drawImage(state.image,0,0,N,N);const image=oc.createImageData(N,N);let count=0;for(let i=0;i<selected.length;i++){image.data[4*i]=128;image.data[4*i+1]=61;image.data[4*i+2]=82;image.data[4*i+3]=selected[i]*.48;if(selected[i]>20)count++;}oc.putImageData(image,0,0);context.drawImage(overlay,0,0);
  const isolated=$('reference-edit-isolate').checked,coverage=state.render(preview,selected,isolated);$('reference-edit-status').textContent=count?(Math.round(count/selected.length*100)+'% 參考區域已選取'+(coverage<12?'；這裡沒有可取用的妝容，請選其他位置。':'。')):state.editing?'此層將不顯示妝容；可塗選補回。':'先在參考圖塗選想取用的花朵或局部。';
  $('reference-edit-preview-note').textContent=isolated?'單獨顯示此層，預覽強度為 100%。儲存後保留原本順序、顯示狀態與強度。':'顯示目前搭配，包括其他參考圖層與自由上妝。';
  $('reference-edit-apply').disabled=(!state.editing&&coverage<12)||pointer!==null;$('reference-edit-undo').disabled=!undo.length;$('reference-edit-redo').disabled=!redo.length;dialog.dataset.dirty=String(touched);
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(draw);}}
 function setTool(next){tool=next;document.querySelectorAll('[data-ref-edit-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.refEditTool===tool)));ref.dataset.tool=tool;}
 function locate(event){const r=ref.getBoundingClientRect();return{x:Math.max(0,Math.min(N,(event.clientX-r.left)/r.width*N)),y:Math.max(0,Math.min(N,(event.clientY-r.top)/r.height*N))};}
 function dab(p){const radius=Number($('reference-edit-size').value)/2,soft=Number($('reference-edit-softness').value)/100;mc.save();mc.globalCompositeOperation=tool==='erase'?'destination-out':'source-over';const fill=mc.createRadialGradient(p.x,p.y,0,p.x,p.y,radius);fill.addColorStop(0,'#fff');fill.addColorStop(Math.max(.02,1-soft),'#fff');fill.addColorStop(1,'#ffffff00');mc.fillStyle=fill;mc.beginPath();mc.arc(p.x,p.y,radius,0,Math.PI*2);mc.fill();mc.restore();}
 function stroke(a,b){const d=Math.hypot(b.x-a.x,b.y-a.y),n=Math.max(1,Math.ceil(d/Math.max(1,Number($('reference-edit-size').value)/9)));for(let i=1;i<=n;i++)dab({x:a.x+(b.x-a.x)*i/n,y:a.y+(b.y-a.y)*i/n});schedule();}
 function stop(cancelled=false){if(pointer===null)return;pointer=null;if(cancelled){put(before);touched=undo.length>0;}else{undo.push(before);if(undo.length>24)undo.shift();redo=[];touched=true;}before=null;last=null;schedule();}
 ref.addEventListener('pointerdown',event=>{if(!state||event.button!==0)return;if(event.pointerType==='touch'){touches.add(event.pointerId);if(touches.size>1){multi=true;stop(true);return;}}if(multi||pointer!==null)return;event.preventDefault();before=values();pointer=event.pointerId;last=locate(event);ref.setPointerCapture(event.pointerId);dab(last);schedule();});
 ref.addEventListener('pointermove',event=>{if(pointer!==event.pointerId||multi)return;event.preventDefault();const p=locate(event);stroke(last,p);last=p;});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])ref.addEventListener(name,event=>{if(event.pointerType==='touch'){touches.delete(event.pointerId);if(!touches.size)multi=false;}if(pointer===event.pointerId)stop(name!=='pointerup');});
 document.querySelectorAll('[data-ref-edit-tool]').forEach(b=>b.onclick=()=>setTool(b.dataset.refEditTool));
 for(const id of ['size','softness'])$('reference-edit-'+id).oninput=()=>$('reference-edit-'+id+'-value').value=$('reference-edit-'+id).value+(id==='softness'?'%':'');
 $('reference-edit-undo').onclick=()=>{if(!undo.length||pointer!==null)return;redo.push(values());put(undo.pop());touched=true;schedule();};$('reference-edit-redo').onclick=()=>{if(!redo.length||pointer!==null)return;undo.push(values());put(redo.pop());touched=true;schedule();};
 for(const action of ['part','all','clear','reset'])$('reference-edit-'+action).onclick=()=>{if(!state||pointer!==null)return;history();put(action==='part'?state.partMask:action==='all'?new Uint8ClampedArray(N*N).fill(255):action==='reset'?state.initial:new Uint8ClampedArray(N*N));schedule();};
 $('reference-edit-isolate').onchange=schedule;document.querySelectorAll('[data-ref-edit-view]').forEach(button=>button.onclick=()=>{dialog.dataset.mobileView=button.dataset.refEditView;document.querySelectorAll('[data-ref-edit-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));});
 function close(){if(pointer!==null)stop(true);dialog.close();}
 $('reference-edit-cancel').onclick=close;$('close-reference-edit').onclick=close;
 dialog.addEventListener('close',()=>{const previous=state;state=null;pointer=null;before=null;undo=[];redo=[];touches.clear();multi=false;previous?.afterClose?.();});
 dialog.addEventListener('cancel',()=>{if(pointer!==null)stop(true);});
 dialog.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'&&!event.target.matches('input')){event.preventDefault();event.stopPropagation();$(event.shiftKey?'reference-edit-redo':'reference-edit-undo').click();}});
 $('reference-edit-apply').onclick=()=>{if(!state||pointer!==null)return;const current=state,selected=values();current.commit(selected);dialog.close();};
 return{open(options){state={...options,initial:options.mask.slice()};undo=[];redo=[];touched=false;pointer=null;before=null;touches.clear();multi=false;put(state.initial);setTool('keep');$('reference-edit-title').textContent=(state.editing?'編輯圖層：':'選取局部：')+state.label;$('reference-edit-apply').textContent=state.editing?'儲存此圖層':'加入局部圖層';$('reference-edit-isolate').checked=true;$('reference-edit-size').value=64;$('reference-edit-size-value').value='64';$('reference-edit-softness').value=55;$('reference-edit-softness-value').value='55%';dialog.dataset.mobileView='reference';document.querySelectorAll('[data-ref-edit-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.refEditView==='reference')));dialog.showModal();draw();}};
}
