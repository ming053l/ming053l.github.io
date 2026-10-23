/** Local pigment simulation for the IrisMix makeup station. No model inference.
 *
 * Coordinates, size and directionalSpread use source-canvas pixels. Angles use
 * degrees; opacity/flow/softness/pressure use [0,1]. Guides provide allowed face
 * polygons and per-part exclusions, not a hair segmentation model.
 *
 * Root owns history: remember painter.snapshot() before beginStroke(), then
 * call endStroke() on pointerup. Snapshots are immutable, opaque command refs;
 * they contain committed strokes only, and are valid for their owning painter.
 */
const PARTS=['eyes','lips','blush'];
const SNAPSHOTS=new WeakMap();
const clamp=(value,low=0,high=1)=>Math.max(low,Math.min(high,value));
const number=(value,fallback)=>Number.isFinite(Number(value))?Number(value):fallback;
const smooth=(low,high,value)=>{const t=clamp((value-low)/Math.max(1e-6,high-low));return t*t*(3-2*t);};
const blank=()=>Object.freeze([]);

function makeCanvas(size){
 const c=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(size,size):document.createElement('canvas');
 c.width=c.height=size;return c;
}
function rgb(color){
 const value=String(color||'#915a80').trim(),hex=/^#([0-9a-f]{6})$/i.exec(value),short=/^#([0-9a-f]{3})$/i.exec(value);
 if(hex)return Object.freeze([0,2,4].map(i=>parseInt(hex[1].slice(i,i+2),16)/255));
 if(short)return Object.freeze([...short[1]].map(c=>parseInt(c+c,16)/255));
 throw new TypeError('Brush color must be #RRGGBB or #RGB');
}
function options(input={}){
 const choice=(key,values,fallback)=>values.includes(input[key])?input[key]:fallback;
 return Object.freeze({
  tool:choice('tool',['paint','erase','blend'],'paint'),brush:choice('brush',['soft','flat','angled'],'soft'),
  color:rgb(input.color),size:clamp(number(input.size,36),6,100),opacity:clamp(number(input.opacity,.65)),
  flow:clamp(number(input.flow,.22)),softness:clamp(number(input.softness,.8)),
  angle:clamp(number(input.angle,0),-180,180),directionalSpread:clamp(number(input.directionalSpread,0),0,80),
  direction:choice('direction',['stroke','outward','horizontal','vertical','custom'],'stroke'),
 });
}
function point(input,size){
 if(!input||!Number.isFinite(input.x)||!Number.isFinite(input.y))throw new TypeError('Brush point needs finite x and y');
 return{x:Math.fround(clamp(input.x,0,size-1)),y:Math.fround(clamp(input.y,0,size-1)),pressure:Math.fround(clamp(number(input.pressure,1)))};
}
function polygonList(value){
 if(!Array.isArray(value))return[];
 if(value.length&&Array.isArray(value[0])&&typeof value[0][0]==='number')return[value];
 return value.filter(p=>Array.isArray(p)&&p.length>=3);
}
function pathPolygons(ctx,polygons,scale){
 ctx.beginPath();for(const polygon of polygons){
  if(polygon.length<3)continue;
  polygon.forEach((p,i)=>{const x=p[0]*scale,y=p[1]*scale;if(!Number.isFinite(x)||!Number.isFinite(y))throw new TypeError('Invalid face-guide polygon');i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();
 }ctx.fill();
}
function prepareGuides(data,size){
 if(!data?.parts)throw new TypeError('Face guides need parts polygons');
 const coordinateSize=number(data.coordinateSize,size),scale=size/coordinateSize;
 if(coordinateSize<=0)throw new TypeError('Invalid guide coordinateSize');
 const masks={},centers={},face=polygonList(data.faceClip||data.faceOval);
 for(const part of PARTS){
  const c=makeCanvas(size),ctx=c.getContext('2d',{willReadFrequently:true});
  ctx.fillStyle='#fff';pathPolygons(ctx,polygonList(data.parts[part]?.polygons),scale);
  if(face.length&&data.parts[part]?.clipFace!==false){ctx.globalCompositeOperation='destination-in';pathPolygons(ctx,face,scale);}
  ctx.globalCompositeOperation='destination-out';
  pathPolygons(ctx,[...polygonList(data.exclude?.[part]),...polygonList(data.excludePolygons)],scale);
  const rgba=ctx.getImageData(0,0,size,size).data,mask=new Uint8Array(size*size),distance=new Float32Array(size*size);
  let left=size,right=0,top=size,bottom=0;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const i=y*size+x,alpha=rgba[4*i+3];mask[i]=alpha;
   distance[i]=alpha<128||x===0||y===0||x===size-1||y===size-1?0:1e6;
   if(alpha){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  }
  // Feather inward only. Excluded pixels stay exactly zero; blur never leaks
  // pigment onto eyeballs, the mouth interior, or beyond the supplied outline.
  for(let y=1;y<size;y++)for(let x=1;x<size;x++){
   const i=y*size+x;distance[i]=Math.min(distance[i],distance[i-1]+1,distance[i-size]+1,distance[i-size-1]+1.4143);
  }
  for(let y=size-2;y>=0;y--)for(let x=size-2;x>=0;x--){
   const i=y*size+x;distance[i]=Math.min(distance[i],distance[i+1]+1,distance[i+size]+1,distance[i+size+1]+1.4143);
  }
  for(let i=0;i<mask.length;i++)mask[i]=Math.round(mask[i]*clamp(distance[i]/2.5));
  masks[part]=mask;centers[part]={x:(left+right)/2,y:(top+bottom)/2};
 }
 return{masks,centers};
}
function orientation(part,config,p,previous,center){
 let angle=0;
 if(config.direction==='vertical')angle=Math.PI/2;
 else if(config.direction==='stroke'){
  const dx=p.x-previous.x,dy=p.y-previous.y;if(Math.hypot(dx,dy)>.01)angle=Math.atan2(dy,dx);
 }else if(config.direction==='outward'){
  const dx=p.x-center.x,dy=part==='eyes'?-Math.abs(dx)*.25:p.y-center.y;
  if(Math.hypot(dx,dy)>.01)angle=Math.atan2(dy,dx);
 }
 return angle+config.angle*Math.PI/180;
}
function stampShape(config,p,angle){
 const radius=config.size*.5*(.45+.55*p.pressure),spread=config.directionalSpread;
 const rx=radius+spread*.65,ry=radius*(config.brush==='soft'?1:config.brush==='flat'?.32:.46);
 return{rx,ry,shift:spread*.35,cos:Math.cos(angle),sin:Math.sin(angle),bound:rx+ry+spread*.35+2};
}
function weight(config,shape,dx,dy){
 const u=(shape.cos*dx+shape.sin*dy-shape.shift)/shape.rx,v=(-shape.sin*dx+shape.cos*dy)/shape.ry;
 const d=config.brush==='soft'?Math.hypot(u,v):config.brush==='flat'?Math.max(Math.abs(u),Math.abs(v)):Math.max(Math.abs(u+.38*v),Math.abs(v));
 if(d>=1)return 0;
 let value=1-smooth(1-config.softness,1,d);
 if(config.brush==='soft')value*=Math.exp(-d*d*config.softness*1.8);
 if(config.brush==='angled')value*=clamp(.82+.18*u,.55,1);
 return value;
}
function clipColor(r,g,b,light){
 let low=Math.min(r,g,b),high=Math.max(r,g,b);
 if(low<0){const factor=light/Math.max(1e-6,light-low);r=light+(r-light)*factor;g=light+(g-light)*factor;b=light+(b-light)*factor;}
 high=Math.max(r,g,b);
 if(high>1){const factor=(1-light)/Math.max(1e-6,high-light);r=light+(r-light)*factor;g=light+(g-light)*factor;b=light+(b-light)*factor;}
 return[r,g,b];
}
function softLight(base,color){
 if(color<=.5)return base-(1-2*color)*base*(1-base);
 const d=base<=.25?((16*base-12)*base+4)*base:Math.sqrt(base);
 return base+(2*color-1)*(d-base);
}
function targetColor(base,color,part){
 const light=.3*base[0]+.59*base[1]+.11*base[2],delta=light-(.3*color[0]+.59*color[1]+.11*color[2]);
 const chroma=clipColor(color[0]+delta,color[1]+delta,color[2]+delta,light);
 const colorMix=part==='lips'?.72:part==='blush'?.65:.55,multiplyMix=part==='eyes'?.12:part==='lips'?.04:0,softMix=1-colorMix-multiplyMix;
 return base.map((b,k)=>clamp(colorMix*chroma[k]+softMix*softLight(b,color[k])+multiplyMix*b*color[k]));
}

const EMPTY_SOURCE=Object.freeze({layers:blank(),commands:blank(),activeLayerId:null});
const PART_NAMES={eyes:'眼妝',lips:'唇妝',blush:'腮紅'};
function hueColor(color,degrees){
 if(!degrees)return color;
 const high=Math.max(...color),low=Math.min(...color),delta=high-low,light=(high+low)/2;if(delta<1e-6)return color;
 let h=high===color[0]?(color[1]-color[2])/delta+(color[1]<color[2]?6:0):high===color[1]?(color[2]-color[0])/delta+2:(color[0]-color[1])/delta+4;
 h=((h/6+degrees/360)%1+1)%1;const saturation=delta/(1-Math.abs(2*light-1)),c=(1-Math.abs(2*light-1))*saturation,t=h*6,x=c*(1-Math.abs(t%2-1)),m=light-c/2;
 return(t<1?[c,x,0]:t<2?[x,c,0]:t<3?[0,c,x]:t<4?[0,x,c]:t<5?[x,0,c]:[c,0,x]).map(v=>v+m);
}

export class CosmeticBrushPainter{
 constructor({size=640,onChange=()=>{},maxStrokes=256,maxTotalPoints=32768,maxPointsPerStroke=2048,maxLayers=24}={}){
  if(!Number.isInteger(size)||size<32||size>1024)throw new RangeError('Unsupported pigment canvas size');
  this.size=size;this.onChange=onChange;
  this.limits=Object.freeze({maxStrokes:clamp(Math.floor(number(maxStrokes,256)),1,256),maxTotalPoints:clamp(Math.floor(number(maxTotalPoints,32768)),1,32768),maxPointsPerStroke:clamp(Math.floor(number(maxPointsPerStroke,2048)),1,2048),maxLayers:clamp(Math.floor(number(maxLayers,24)),1,24)});
  this.sourceId=null;this._project=new Map();this._guides=new Map();this._guideInputs=new Map();this._buffers=new Map();this._active=null;this._nextLayerId=1;
 }
 _emit(type,extra={}){this.onChange({type,sourceId:this.sourceId,layerId:this.activeLayerId,...extra});}
 _state(){return this._project.get(this.sourceId)||EMPTY_SOURCE;}
 _commands(){return this._state().commands;}
 _store(state){const project=new Map(this._project);project.set(this.sourceId,Object.freeze({...state,layers:Object.freeze(state.layers),commands:Object.freeze(state.commands)}));this._project=project;}
 _counts(){let strokes=0,points=0,layers=0;for(const state of this._project.values()){layers+=state.layers.length;for(const command of state.commands){strokes++;points+=command.points.length/3;}}return{strokes,points,layers};}
 get activeLayerId(){return this._active?.layer.id||this._state().activeLayerId;}
 _layer(id){return this._state().layers.find(layer=>layer.id===id)||(this._active?.layer.id===id?this._active.layer:null);}
 _renderLayers(){return this._active?.provisional?[...this._state().layers,this._active.layer]:this._state().layers;}
 _newLayer(part,name){
  if(this._counts().layers>=this.limits.maxLayers)return null;
  const index=this._nextLayerId++,label=typeof name==='string'?name:name?.name;
  return Object.freeze({id:'pigment-'+index,part,name:(typeof label==='string'?label:PART_NAMES[part]+' '+index).trim().slice(0,60)||PART_NAMES[part],visible:true,opacity:1,hue:0});
 }
 createLayer(part,name){
  if(this._active||!PARTS.includes(part)||!this.sourceId||!this._guides.has(this.sourceId))return null;
  const layer=this._newLayer(part,name);if(!layer)return null;const state=this._state();this._store({...state,layers:[...state.layers,layer],activeLayerId:layer.id});this._emit('layers',{action:'create',layerId:layer.id});return layer.id;
 }
 selectLayer(id){
  if(this._active||!this._layer(id))return false;if(this._state().activeLayerId===id)return true;
  this._store({...this._state(),activeLayerId:id});this._emit('selection',{layerId:id});return true;
 }
 getLayers(){
  return Object.freeze(this._state().layers.map(layer=>{
   const commands=this._commands().filter(c=>c.layerId===layer.id),last=[...commands].reverse().find(c=>c.options.tool==='paint');
   const color=last?'#'+last.options.color.map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join(''):null;
   return Object.freeze({...layer,selected:layer.id===this.activeLayerId,strokeCount:commands.length,color});
  }));
 }
 moveLayer(id,delta){
  if(this._active)return false;const state=this._state(),index=state.layers.findIndex(layer=>layer.id===id);if(index<0)return false;
  const next=clamp(index+Math.trunc(number(delta,0)),0,state.layers.length-1);if(next===index)return false;
  const layers=[...state.layers],[layer]=layers.splice(index,1);layers.splice(next,0,layer);this._store({...state,layers});this._emit('layers',{action:'move',layerId:id});return true;
 }
 setLayerProps(id,props={}){
  if(this._active)return false;const state=this._state(),layer=this._layer(id);if(!layer)return false;const next={...layer};
  if(typeof props.visible==='boolean')next.visible=props.visible;
  if(props.opacity!==undefined)next.opacity=clamp(number(props.opacity,layer.opacity));
  if(props.hue!==undefined)next.hue=clamp(number(props.hue,layer.hue),-180,180);
  if(typeof props.name==='string'&&props.name.trim())next.name=props.name.trim().slice(0,60);
  if(['name','visible','opacity','hue'].every(key=>next[key]===layer[key]))return false;
  this._store({...state,layers:state.layers.map(l=>l.id===id?Object.freeze(next):l)});this._emit('layers',{action:'update',layerId:id});return true;
 }
 removeLayer(id){
  if(this._active)return false;const state=this._state(),index=state.layers.findIndex(layer=>layer.id===id);if(index<0)return false;
  const layers=state.layers.filter(layer=>layer.id!==id),activeLayerId=state.activeLayerId===id?(layers[Math.min(index,layers.length-1)]?.id||null):state.activeLayerId;
  this._store({...state,layers,commands:state.commands.filter(c=>c.layerId!==id),activeLayerId});this._buffers.delete(id);this._emit('layers',{action:'remove',layerId:id});return true;
 }
 setSource(sourceId,data){
  if(typeof sourceId!=='string'||!sourceId)throw new TypeError('sourceId is required');
  if(this.sourceId===sourceId&&this._guideInputs.get(sourceId)===data)return;
  if(this._guideInputs.get(sourceId)!==data){this._guides.set(sourceId,prepareGuides(data,this.size));this._guideInputs.set(sourceId,data);}
  this._active=null;this.sourceId=sourceId;this._buffers.clear();this._emit('source');
 }
 _buffer(layerId){
  if(this._buffers.has(layerId)){const buffer=this._buffers.get(layerId);this._buffers.delete(layerId);this._buffers.set(layerId,buffer);return buffer;}
  const layer=this._layer(layerId);if(!layer)throw new TypeError('Unknown pigment layer');
  const buffer={rgba:new Float32Array(this.size*this.size*4),sum:0,bounds:null};this._buffers.set(layerId,buffer);
  // Four 640px FP32 pigment rasters use about26MiB. Commands remain compact;
  // an evicted layer is reconstructed deterministically when it is next used.
  while(this._buffers.size>4){const oldest=[...this._buffers.keys()].find(id=>id!==this._active?.layer.id);this._buffers.delete(oldest);}
  for(const command of this._commands())if(command.layerId===layerId){
   const active=this._makeActive(layer,command.options),points=command.points;
   for(let i=0;i<points.length;i+=3)this._append(active,{x:points[i],y:points[i+1],pressure:points[i+2]},buffer);
  }return buffer;
 }
 _makeActive(layer,config,provisional=false){return{part:layer.part,layer,provisional,options:config,points:[],coverage:new Float32Array(this.size*this.size),lastInput:null,lastStamp:null,carry:0,changed:false,limited:false};}
 beginStroke(part,input,start){
  if(this._active)return{ok:false,reason:'stroke-active'};
  if(!PARTS.includes(part))return{ok:false,reason:'unsupported-part'};
  if(!this.sourceId||!this._guides.has(this.sourceId))return{ok:false,reason:'source-guides-required'};
  const count=this._counts();if(count.strokes>=this.limits.maxStrokes)return{ok:false,reason:'stroke-limit'};
  if(count.points>=this.limits.maxTotalPoints)return{ok:false,reason:'point-limit'};
  const config=options(input),p=point(start,this.size);let layer=this._layer(this._state().activeLayerId),provisional=false;
  if(layer&&!layer.visible)return{ok:false,reason:'layer-hidden'};
  if(layer?.part!==part){
   if(config.tool!=='paint')return{ok:false,reason:'select-layer'};
   layer=this._newLayer(part);if(!layer)return{ok:false,reason:'layer-limit'};provisional=true;
  }
  if(!layer.visible)return{ok:false,reason:'layer-hidden'};
  this._active=this._makeActive(layer,config,provisional);const buffer=this._buffer(layer.id);this._append(this._active,p,buffer);this._emit('preview',{part,layerId:layer.id});
  return{ok:true,changed:this._active.changed,layerId:layer.id};
 }
 updateStroke(input){
  const active=this._active;if(!active)return{ok:false,reason:'no-active-stroke'};
  const count=this._counts();if(active.points.length/3>=this.limits.maxPointsPerStroke||count.points+active.points.length/3>=this.limits.maxTotalPoints){active.limited=true;return{ok:false,reason:'point-limit'};}
  const changed=this._append(active,point(input,this.size),this._buffer(active.layer.id));if(changed)this._emit('preview',{part:active.part,layerId:active.layer.id});return{ok:true,changed};
 }
 _append(active,p,buffer){
  active.points.push(p.x,p.y,p.pressure);const previous=active.lastInput;active.lastInput=p;
  if(!previous){active.lastStamp=p;return this._stamp(active,p,p,buffer);}
  const length=Math.hypot(p.x-previous.x,p.y-previous.y);if(length<.001)return false;
  const spacing=Math.max(.75,active.options.size*.12),before=active.changed;let distance=spacing-active.carry;
  while(distance<=length){const t=distance/length,q={x:previous.x+(p.x-previous.x)*t,y:previous.y+(p.y-previous.y)*t,pressure:previous.pressure+(p.pressure-previous.pressure)*t};this._stamp(active,q,active.lastStamp,buffer);active.lastStamp=q;distance+=spacing;}
  active.carry=(active.carry+length)%spacing;
  // changed is cumulative; a long-running live stroke still needs repainting.
  return active.changed||before;
 }
 _stamp(active,p,previous,buffer){
  const config=active.options;if(!p.pressure||!config.opacity||!config.flow)return false;
  const guide=this._guides.get(this.sourceId),mask=guide.masks[active.part],angle=orientation(active.part,config,p,previous,guide.centers[active.part]),shape=stampShape(config,p,angle),size=this.size;
  const left=Math.max(0,Math.floor(p.x-shape.bound)),right=Math.min(size-1,Math.ceil(p.x+shape.bound)),top=Math.max(0,Math.floor(p.y-shape.bound)),bottom=Math.min(size-1,Math.ceil(p.y+shape.bound));
  if(config.tool==='blend')return this._blend(active,p,shape,buffer,mask,left,right,top,bottom);
  const pixels=buffer.rgba;let changed=false;
  for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++){
   const i=y*size+x;if(!mask[i])continue;
   const deposit=weight(config,shape,x+.5-p.x,y+.5-p.y)*config.flow*p.pressure*mask[i]/255;if(!deposit)continue;
   const oldCoverage=active.coverage[i],coverage=oldCoverage+(1-oldCoverage)*deposit;active.coverage[i]=coverage;
   const oldStrokeAlpha=oldCoverage*config.opacity,newStrokeAlpha=coverage*config.opacity,amount=clamp((newStrokeAlpha-oldStrokeAlpha)/Math.max(1e-6,1-oldStrokeAlpha));
   if(amount<1e-7)continue;const at=4*i,oldAlpha=pixels[at+3];
   if(config.tool==='erase'){for(let k=0;k<4;k++)pixels[at+k]*=1-amount;}
   else{for(let k=0;k<3;k++)pixels[at+k]=config.color[k]*amount+pixels[at+k]*(1-amount);pixels[at+3]=amount+oldAlpha*(1-amount);}
   if(pixels[at+3]<.00002){for(let k=0;k<4;k++)pixels[at+k]=0;}
   const difference=pixels[at+3]-oldAlpha;buffer.sum+=difference;
   if(Math.abs(difference)>1e-7||config.tool==='paint')changed=true;
  }
  if(changed){this._extendBounds(buffer,left,right,top,bottom);active.changed=true;}return changed;
 }
 _extendBounds(buffer,left,right,top,bottom){
  const b=buffer.bounds;buffer.bounds=b?{left:Math.min(b.left,left),right:Math.max(b.right,right),top:Math.min(b.top,top),bottom:Math.max(b.bottom,bottom)}:{left,right,top,bottom};
 }
 _blend(active,p,shape,buffer,mask,left,right,top,bottom){
  if(buffer.sum<.0001)return false;const config=active.options,size=this.size,pixels=buffer.rgba;
  const distance=Math.min(36,config.size*.23+config.directionalSpread*.25),side=config.size*.13,margin=Math.ceil(distance+side+2);
  const sx=Math.max(0,left-margin),sy=Math.max(0,top-margin),ex=Math.min(size-1,right+margin),ey=Math.min(size-1,bottom+margin),width=ex-sx+1,height=ey-sy+1;
  const copy=new Float32Array(width*height*4);
  for(let y=sy;y<=ey;y++)copy.set(pixels.subarray(4*(y*size+sx),4*(y*size+ex+1)),4*(y-sy)*width);
  const sample=(x,y,k)=>{
   x=clamp(x,sx,ex)-sx;y=clamp(y,sy,ey)-sy;const x0=Math.floor(x),y0=Math.floor(y),x1=Math.min(width-1,x0+1),y1=Math.min(height-1,y0+1),fx=x-x0,fy=y-y0;
   return(copy[4*(y0*width+x0)+k]*(1-fx)+copy[4*(y0*width+x1)+k]*fx)*(1-fy)+(copy[4*(y1*width+x0)+k]*(1-fx)+copy[4*(y1*width+x1)+k]*fx)*fy;
  };
  let changed=false;
  for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++){
   const i=y*size+x;if(!mask[i])continue;const amount=weight(config,shape,x+.5-p.x,y+.5-p.y)*config.flow*config.opacity*p.pressure*mask[i]/255;if(amount<1e-6)continue;
   const at=4*i,oldAlpha=pixels[at+3];let pixelDifference=0;
   for(let k=0;k<4;k++){
    const target=.3*sample(x,y,k)+.4*sample(x-shape.cos*distance,y-shape.sin*distance,k)+.15*sample(x+shape.cos*distance*.5,y+shape.sin*distance*.5,k)+.075*sample(x-shape.sin*side,y+shape.cos*side,k)+.075*sample(x+shape.sin*side,y-shape.cos*side,k);
    const next=pixels[at+k]+(target-pixels[at+k])*amount;pixelDifference+=Math.abs(next-pixels[at+k]);pixels[at+k]=next;
   }
   buffer.sum+=pixels[at+3]-oldAlpha;if(pixelDifference>1e-7)changed=true;
  }
  if(changed){this._extendBounds(buffer,left,right,top,bottom);active.changed=true;}return changed;
 }
 endStroke(){
  const active=this._active;if(!active)return{ok:false,changed:false,reason:'no-active-stroke'};
  if(active.changed){
   const command=Object.freeze({part:active.part,layerId:active.layer.id,options:active.options,points:new Float32Array(active.points)}),state=this._state();
   this._store({...state,layers:active.provisional?[...state.layers,active.layer]:state.layers,commands:[...state.commands,command],activeLayerId:active.layer.id});
  }else if(active.provisional)this._buffers.delete(active.layer.id);
  this._active=null;this._emit('commit',{part:active.part,layerId:active.layer.id,changed:active.changed});return{ok:true,changed:active.changed,layerId:active.layer.id,...(active.limited?{reason:'point-limit'}:{})};
 }
 cancelStroke(){if(!this._active)return;this._active=null;this._buffers.clear();this._emit('cancel');}
 snapshot(){
  const token=Object.freeze({format:'irismix-pigment-snapshot-v2',sourceId:this.sourceId});SNAPSHOTS.set(token,{owner:this,project:this._project,sourceId:this.sourceId,nextLayerId:this._nextLayerId});return token;
 }
 restore(token){
  const state=SNAPSHOTS.get(token);if(!state||state.owner!==this)throw new TypeError('Snapshot belongs to another painter');
  this._active=null;this._project=state.project;this.sourceId=state.sourceId;this._nextLayerId=state.nextLayerId;this._buffers.clear();this._emit('restore');
 }
 clearLayer(id=this.activeLayerId){
  if(this._active||!this._layer(id))return false;const state=this._state(),commands=state.commands.filter(command=>command.layerId!==id);if(commands.length===state.commands.length)return false;
  this._store({...state,commands});this._buffers.delete(id);this._emit('clear',{layerId:id,part:this._layer(id).part});return true;
 }
 clear(part){
  if(part!==undefined&&!PARTS.includes(part))throw new TypeError('Unknown cosmetic part');
  this._active=null;const state=this._state(),commands=part?state.commands.filter(command=>command.part!==part):blank();
  this._store({...state,commands});this._buffers.clear();this._emit('clear',{part:part||'all'});
 }
 clearAll(){this._active=null;this._project=new Map();this._buffers.clear();this._nextLayerId=1;this._emit('clear-all');}
 layerHasPaint(id){
  if(!this._layer(id))return false;const pending=this._active?.layer.id===id;
  return(pending||this._buffers.has(id)||this._commands().some(command=>command.layerId===id))&&this._buffer(id).sum>.01;
 }
 hasPaint(part){
  if(!this.sourceId||!this._guides.has(this.sourceId)||(part!==undefined&&!PARTS.includes(part)))return false;
  return this._renderLayers().some(layer=>(!part||layer.part===part)&&layer.visible&&layer.opacity>0&&this.layerHasPaint(layer.id));
 }
 footprint(part,input,position,previousPosition=position){
  if(!PARTS.includes(part)||!this._guides.has(this.sourceId))return null;
  const config=options(input),p=point(position,this.size),previous=point(previousPosition,this.size),angle=orientation(part,config,p,previous,this._guides.get(this.sourceId).centers[part]),shape=stampShape(config,p,angle);
  // Draw after translate(x,y), rotate(angle): offsetX is the forward extension.
  // flat is a rectangle; angled is the same rectangle sheared by x -= .38*y.
  return Object.freeze({x:p.x,y:p.y,angle,radiusX:shape.rx,radiusY:shape.ry,offsetX:shape.shift,brush:config.brush,shear:config.brush==='angled'?.38:0});
 }
 stats(){return Object.freeze({...this._counts(),currentLayers:this._state().layers.length,cachedLayers:this._buffers.size,bufferBytes:this._buffers.size*this.size*this.size*16,sourceId:this.sourceId,active:!!this._active,limits:this.limits});}
 render(ctx,baseCanvas){
  if(!ctx?.canvas||!baseCanvas)throw new TypeError('Render needs a Canvas2D context and base canvas');
  if(ctx.canvas.width!==this.size||ctx.canvas.height!==this.size||baseCanvas.width!==this.size||baseCanvas.height!==this.size)throw new RangeError('Pigment render requires matching source-canvas dimensions');
  if(!this.hasPaint()){if(ctx.canvas!==baseCanvas)ctx.drawImage(baseCanvas,0,0);return{painted:false};}
  // Read the base before writing: rendering onto the same canvas is supported.
  const baseContext=ctx.canvas===baseCanvas?ctx:baseCanvas.getContext('2d',{willReadFrequently:true}),image=baseContext.getImageData(0,0,this.size,this.size),out=image.data;
  // This is actual bottom-to-top pigment compositing: same-part layers keep
  // separate deposition buffers, so changing their order changes overlap color.
  for(const layer of this._renderLayers()){
   if(!layer.visible||layer.opacity<=0||!this.layerHasPaint(layer.id))continue;
   const part=layer.part,buffer=this._buffer(layer.id);if(!buffer.bounds)continue;
   const pixels=buffer.rgba,mask=this._guides.get(this.sourceId).masks[part],bounds=buffer.bounds;
   for(let y=bounds.top;y<=bounds.bottom;y++)for(let x=bounds.left;x<=bounds.right;x++){
    const i=y*this.size+x,at=4*i,alpha=pixels[at+3];if(!mask[i]||alpha<.00002)continue;
    const pigment=[clamp(pixels[at]/alpha),clamp(pixels[at+1]/alpha),clamp(pixels[at+2]/alpha)],color=hueColor(pigment,layer.hue),base=[out[at]/255,out[at+1]/255,out[at+2]/255],target=targetColor(base,color,part),amount=clamp(alpha)*layer.opacity*(part==='blush'?.62:.92);
    for(let k=0;k<3;k++)out[at+k]=(base[k]+(target[k]-base[k])*amount)*255;
   }
  }
  ctx.putImageData(image,0,0);return{painted:true};
 }
}

export function createCosmeticBrush(options){return new CosmeticBrushPainter(options);}
