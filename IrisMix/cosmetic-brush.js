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

export class CosmeticBrushPainter{
 constructor({size=640,onChange=()=>{},maxStrokes=256,maxTotalPoints=32768,maxPointsPerStroke=2048}={}){
  if(!Number.isInteger(size)||size<32||size>1024)throw new RangeError('Unsupported pigment canvas size');
  this.size=size;this.onChange=onChange;
  this.limits=Object.freeze({maxStrokes:clamp(Math.floor(number(maxStrokes,256)),1,256),maxTotalPoints:clamp(Math.floor(number(maxTotalPoints,32768)),1,32768),maxPointsPerStroke:clamp(Math.floor(number(maxPointsPerStroke,2048)),1,2048)});
  this.sourceId=null;this._project=new Map();this._guides=new Map();this._guideInputs=new Map();this._buffers=new Map();this._active=null;
 }
 _emit(type,extra={}){this.onChange({type,sourceId:this.sourceId,...extra});}
 _commands(){return this._project.get(this.sourceId)||blank();}
 _counts(){let strokes=0,points=0;for(const commands of this._project.values())for(const command of commands){strokes++;points+=command.points.length/3;}return{strokes,points};}
 setSource(sourceId,data){
  if(typeof sourceId!=='string'||!sourceId)throw new TypeError('sourceId is required');
  if(this.sourceId===sourceId&&this._guideInputs.get(sourceId)===data)return;
  if(this._guideInputs.get(sourceId)!==data){this._guides.set(sourceId,prepareGuides(data,this.size));this._guideInputs.set(sourceId,data);}
  this._active=null;this.sourceId=sourceId;this._buffers.clear();this._emit('source');
 }
 _buffer(part){
  if(this._buffers.has(part))return this._buffers.get(part);
  const buffer={rgba:new Float32Array(this.size*this.size*4),sum:0,bounds:null};this._buffers.set(part,buffer);
  for(const command of this._commands())if(command.part===part){
   const active=this._makeActive(part,command.options),points=command.points;
   for(let i=0;i<points.length;i+=3)this._append(active,{x:points[i],y:points[i+1],pressure:points[i+2]},buffer);
  }return buffer;
 }
 _makeActive(part,config){return{part,options:config,points:[],coverage:new Float32Array(this.size*this.size),lastInput:null,lastStamp:null,carry:0,changed:false,limited:false};}
 beginStroke(part,input,start){
  if(this._active)return{ok:false,reason:'stroke-active'};
  if(!PARTS.includes(part))return{ok:false,reason:'unsupported-part'};
  if(!this.sourceId||!this._guides.has(this.sourceId))return{ok:false,reason:'source-guides-required'};
  const count=this._counts();if(count.strokes>=this.limits.maxStrokes)return{ok:false,reason:'stroke-limit'};
  if(count.points>=this.limits.maxTotalPoints)return{ok:false,reason:'point-limit'};
  const config=options(input),p=point(start,this.size),buffer=this._buffer(part);
  this._active=this._makeActive(part,config);this._append(this._active,p,buffer);this._emit('preview',{part});
  return{ok:true,changed:this._active.changed};
 }
 updateStroke(input){
  const active=this._active;if(!active)return{ok:false,reason:'no-active-stroke'};
  const count=this._counts();if(active.points.length/3>=this.limits.maxPointsPerStroke||count.points+active.points.length/3>=this.limits.maxTotalPoints){active.limited=true;return{ok:false,reason:'point-limit'};}
  const changed=this._append(active,point(input,this.size),this._buffer(active.part));if(changed)this._emit('preview',{part:active.part});return{ok:true,changed};
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
  const active=this._active;if(!active)return{ok:false,changed:false,reason:'no-active-stroke'};this._active=null;
  if(active.changed){
   const command=Object.freeze({part:active.part,options:active.options,points:new Float32Array(active.points)});
   const project=new Map(this._project);project.set(this.sourceId,Object.freeze([...this._commands(),command]));this._project=project;
  }
  this._emit('commit',{part:active.part,changed:active.changed});return{ok:true,changed:active.changed,...(active.limited?{reason:'point-limit'}:{})};
 }
 cancelStroke(){if(!this._active)return;this._active=null;this._buffers.clear();this._emit('cancel');}
 snapshot(){
  const token=Object.freeze({format:'irismix-pigment-snapshot-v1',sourceId:this.sourceId});SNAPSHOTS.set(token,{owner:this,project:this._project,sourceId:this.sourceId});return token;
 }
 restore(token){
  const state=SNAPSHOTS.get(token);if(!state||state.owner!==this)throw new TypeError('Snapshot belongs to another painter');
  this._active=null;this._project=state.project;this.sourceId=state.sourceId;this._buffers.clear();this._emit('restore');
 }
 clear(part){
  if(part!==undefined&&!PARTS.includes(part))throw new TypeError('Unknown cosmetic part');
  this._active=null;const commands=part?this._commands().filter(command=>command.part!==part):blank(),project=new Map(this._project);
  project.set(this.sourceId,Object.freeze(commands));this._project=project;this._buffers.clear();this._emit('clear',{part:part||'all'});
 }
 clearAll(){this._active=null;this._project=new Map();this._buffers.clear();this._emit('clear-all');}
 hasPaint(part){
  if(!this.sourceId||!this._guides.has(this.sourceId))return false;
  const parts=part?[part]:PARTS;if(parts.some(p=>!PARTS.includes(p)))return false;
  return parts.some(p=>(this._active?.part===p||this._buffers.has(p)||this._commands().some(command=>command.part===p))&&this._buffer(p).sum>.01);
 }
 footprint(part,input,position,previousPosition=position){
  if(!PARTS.includes(part)||!this._guides.has(this.sourceId))return null;
  const config=options(input),p=point(position,this.size),previous=point(previousPosition,this.size),angle=orientation(part,config,p,previous,this._guides.get(this.sourceId).centers[part]),shape=stampShape(config,p,angle);
  // Draw after translate(x,y), rotate(angle): offsetX is the forward extension.
  // flat is a rectangle; angled is the same rectangle sheared by x -= .38*y.
  return Object.freeze({x:p.x,y:p.y,angle,radiusX:shape.rx,radiusY:shape.ry,offsetX:shape.shift,brush:config.brush,shear:config.brush==='angled'?.38:0});
 }
 stats(){return Object.freeze({...this._counts(),sourceId:this.sourceId,active:!!this._active,limits:this.limits});}
 render(ctx,baseCanvas){
  if(!ctx?.canvas||!baseCanvas)throw new TypeError('Render needs a Canvas2D context and base canvas');
  if(ctx.canvas.width!==this.size||ctx.canvas.height!==this.size||baseCanvas.width!==this.size||baseCanvas.height!==this.size)throw new RangeError('Pigment render requires matching source-canvas dimensions');
  if(!this.hasPaint()){if(ctx.canvas!==baseCanvas)ctx.drawImage(baseCanvas,0,0);return{painted:false};}
  // Read the base before writing: rendering onto the same canvas is supported.
  const baseContext=ctx.canvas===baseCanvas?ctx:baseCanvas.getContext('2d',{willReadFrequently:true}),image=baseContext.getImageData(0,0,this.size,this.size),out=image.data;
  for(const part of PARTS){
   if(!this._buffers.has(part)&&!this._commands().some(command=>command.part===part))continue;
   const buffer=this._buffer(part);if(buffer.sum<=.01||!buffer.bounds)continue;
   const pixels=buffer.rgba,mask=this._guides.get(this.sourceId).masks[part],bounds=buffer.bounds;
   for(let y=bounds.top;y<=bounds.bottom;y++)for(let x=bounds.left;x<=bounds.right;x++){
    const i=y*this.size+x,at=4*i,alpha=pixels[at+3];if(!mask[i]||alpha<.00002)continue;
    const color=[clamp(pixels[at]/alpha),clamp(pixels[at+1]/alpha),clamp(pixels[at+2]/alpha)],base=[out[at]/255,out[at+1]/255,out[at+2]/255],target=targetColor(base,color,part),amount=clamp(alpha)*(part==='blush'?.62:.92);
    for(let k=0;k<3;k++)out[at+k]=(base[k]+(target[k]-base[k])*amount)*255;
   }
  }
  ctx.putImageData(image,0,0);return{painted:true};
 }
}

export function createCosmeticBrush(options){return new CosmeticBrushPainter(options);}
