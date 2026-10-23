/* IrisMix CPU preprocessing primitives for a browser or Node.
 * These functions prepare model inputs; warpPremultipliedLayer is placement,
 * never a substitute for the Stage I / Stage II neural model evaluations.
 * Images are interleaved HWC float32 in [0,1], unless documented otherwise.
 */

export const CONDITION_NAMES = Object.freeze(['C', 'K', 'A', 'S1', 'S2', 'S3', 'G1', 'G2', 'lip', 'eyeL', 'eyeR']);
const FACE_OVAL = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];
const UPPER_OVAL = [10,338,297,332,284,251,389,162,21,54,103,67,109];
const clip = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

export function image(width, height, channels, data = new Float32Array(width * height * channels)) {
  if (![width,height,channels].every(n => Number.isInteger(n) && n > 0) || data.length !== width * height * channels) throw new RangeError('Invalid image');
  return {width, height, channels, data};
}

export function rgb8(data, width, height, channels = 3) {
  if (![3,4].includes(channels) || data.length !== width * height * channels) throw new RangeError('Expected RGB or RGBA');
  const out = image(width,height,3);
  for (let i = 0; i < width * height; i++) for (let c = 0; c < 3; c++) out.data[i*3+c] = data[i*channels+c] / 255;
  return out;
}

/** MediaPipe normalized coordinates -> native pixel-scaled xyz. z scales by width. */
export function landmarksPixels(landmarks, width, height) {
  if (!landmarks || landmarks.length < 468) throw new RangeError('FaceLandmarker points required');
  return landmarks.map(q => [Math.fround(q.x * width), Math.fround(q.y * height), Math.fround((q.z || 0) * width)]);
}

export function faceBox(points, width, height, k = 1.9) {
  if (!points?.length) throw new RangeError('Face landmarks required');
  let minX=Infinity, minY=Infinity, maxX=-Infinity, maxY=-Infinity;
  for (const p of points) { minX=Math.min(minX,p[0]); minY=Math.min(minY,p[1]); maxX=Math.max(maxX,p[0]); maxY=Math.max(maxY,p[1]); }
  const side=Math.trunc(Math.min(k*Math.max(maxX-minX,maxY-minY),width,height));
  if (side < 1) throw new RangeError('Invalid face extent');
  return [Math.trunc(clip((minX+maxX-side)/2,0,width-side)),Math.trunc(clip((minY+maxY-side)/2,0,height-side)),side];
}

export function crop(input, box) {
  const [x,y,size]=box;
  if (![x,y,size].every(Number.isInteger) || x<0 || y<0 || size<1 || x+size>input.width || y+size>input.height) throw new RangeError('Crop outside image');
  const out=image(size,size,input.channels);
  for(let row=0;row<size;row++) out.data.set(input.data.subarray(((row+y)*input.width+x)*input.channels,((row+y)*input.width+x+size)*input.channels),row*size*input.channels);
  return out;
}

function cubicWeight(x) {
  x=Math.abs(x); const a=-0.75;
  if(x<=1)return (a+2)*x*x*x-(a+3)*x*x+1;
  if(x<2)return a*x*x*x-5*a*x*x+8*a*x-4*a;
  return 0;
}

function resizeContributors(from,to,mode) {
  const scale=from/to, rows=[];
  for(let p=0;p<to;p++) {
    const row=[];
    if(mode==='area') {
      const left=p*scale,right=(p+1)*scale;
      for(let s=Math.floor(left);s<Math.ceil(right);s++) row.push([clip(s,0,from-1),Math.max(0,Math.min(s+1,right)-Math.max(s,left))/scale]);
    } else {
      const center=(p+0.5)*scale-0.5, base=Math.floor(center);
      if(mode==='cubic')for(let s=base-1;s<=base+2;s++)row.push([clip(s,0,from-1),cubicWeight(center-s)]);
      else { const t=center-base;row.push([clip(base,0,from-1),1-t],[clip(base+1,0,from-1),t]); }
    }
    rows.push(row);
  }
  return rows;
}

/** OpenCV half-pixel resize; float cubic uses A=-0.75. Downsampling area is exact box integration. */
export function resize(input,width,height=width,mode='linear') {
  if(input.width===width && input.height===height)return image(width,height,input.channels,input.data.slice());
  const xs=resizeContributors(input.width,width,mode),ys=resizeContributors(input.height,height,mode);
  const tmp=image(width,input.height,input.channels),out=image(width,height,input.channels);
  for(let y=0;y<input.height;y++)for(let x=0;x<width;x++)for(let c=0;c<input.channels;c++) {
    let sum=0;for(const [sx,w]of xs[x])sum+=input.data[(y*input.width+sx)*input.channels+c]*w;
    tmp.data[(y*width+x)*input.channels+c]=sum;
  }
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)for(let c=0;c<input.channels;c++) {
    let sum=0;for(const [sy,w]of ys[y])sum+=tmp.data[(sy*width+x)*input.channels+c]*w;
    out.data[(y*width+x)*input.channels+c]=sum;
  }
  return out;
}

export function cropResize(input,box,n=512) {return resize(crop(input,box),n,n,box[2]>n?'area':'cubic');}

/** Actual Stage I contract: decode [-1,1] wide canvas to [B | W | K]. */
export function stageICanvasFromNCHW(values,side=512) {
  if(values.length!==3*side*side*3)throw new RangeError('Expected NCHW 1×3×512×1536 Stage I canvas');
  const panels=[image(side,side,3),image(side,side,3),image(side,side,3)],plane=side*side*3;
  for(let y=0;y<side;y++)for(let x=0;x<side;x++)for(let c=0;c<3;c++)for(let k=0;k<3;k++)panels[k].data[(y*side+x)*3+c]=clip((values[c*plane+y*side*3+k*side+x]+1)/2);
  return {B:panels[0],W:panels[1],K:panels[2]};
}

/** Closed form used by transfer.predict_layer; no alpha threshold or color guess. */
export function recoverStageILayer({B,W,K}) {
  if(![B,W,K].every(v=>v.channels===3&&v.width===B.width&&v.height===B.height))throw new RangeError('Mismatched B/W/K canvas');
  const alpha=image(B.width,B.height,1),F=image(B.width,B.height,3);
  for(let i=0;i<alpha.data.length;i++) {
    // native sum and mean are float32; round each intermediate to match that path.
    const d0=Math.fround(W.data[3*i]-K.data[3*i]),d1=Math.fround(W.data[3*i+1]-K.data[3*i+1]),d2=Math.fround(W.data[3*i+2]-K.data[3*i+2]);
    alpha.data[i]=clip(Math.fround(1-Math.fround(Math.fround(Math.fround(d0+d1)+d2)/3)));
    for(let c=0;c<3;c++)F.data[3*i+c]=clip(K.data[3*i+c]/Math.max(alpha.data[i],1e-3));
  }
  return {B,alpha,F,premultiplied:K};
}

/** Embed the Stage I face crop in the original reference frame. */
export function restoreReferenceFrame(reference,box,panels) {
  const {B,alpha,premultiplied}=recoverStageILayer(panels),size=box[2];
  const mode=size>B.width?'linear':'area',upA=resize(alpha,size,size,mode),upP=resize(premultiplied,size,size,mode),upB=resize(B,size,size,mode);
  const a=image(reference.width,reference.height,1),P=image(reference.width,reference.height,3),bare=image(reference.width,reference.height,3,reference.data.slice()),F=image(reference.width,reference.height,3);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++) {
    const dst=(y+box[1])*reference.width+x+box[0],src=y*size+x;
    a.data[dst]=clip(upA.data[src]);
    for(let c=0;c<3;c++){P.data[3*dst+c]=upP.data[3*src+c];bare.data[3*dst+c]=Math.floor(clip(upB.data[3*src+c])*255+0.5)/255;}
  }
  for(let i=0;i<a.data.length;i++)for(let c=0;c<3;c++)F.data[3*i+c]=clip(P.data[3*i+c]/Math.max(a.data[i],1e-3));
  return {alpha:a,premultiplied:P,F,bare,box};
}

/** The native Stage I part detector runs on the generated B crop itself. Pass
 * ruleParts(B512Landmarks, ops) here before landmark detection on the full bare.
 */
export function restoreReferenceWeights(weights,box,width,height){
  if(weights.length!==5||weights.some(w=>w.width!==512||w.height!==512||w.channels!==1))throw new RangeError('Five native 512 part maps required');
  const side=box[2],result=weights.map((map,k)=>{const out=image(width,height,1);if(k===3)out.data.fill(1);const up=resize(map,side,side,side>512?'linear':'area');for(let y=0;y<side;y++)out.data.set(up.data.subarray(y*side,(y+1)*side),(y+box[1])*width+box[0]);return out;});
  for(let i=0;i<width*height;i++){let sum=0;for(let k=0;k<5;k++)sum=Math.fround(sum+result[k].data[i]);for(let k=0;k<5;k++)result[k].data[i]/=Math.max(sum,1e-6);}
  return result;
}

/** A freehand selection lives in REF coordinates and cuts a and aF together. */
export function selectReferenceLayer(layer,selection) {
  if(selection.width!==layer.alpha.width||selection.height!==layer.alpha.height||selection.channels!==1)throw new RangeError('Selection must be in the original reference frame');
  const alpha=image(selection.width,selection.height,1),P=image(selection.width,selection.height,3);
  for(let i=0;i<selection.data.length;i++){const m=clip(selection.data[i]);alpha.data[i]=layer.alpha.data[i]*m;for(let c=0;c<3;c++)P.data[3*i+c]=layer.F?alpha.data[i]*layer.F.data[3*i+c]:layer.premultiplied.data[3*i+c]*m;}
  return {...layer,alpha,premultiplied:P};
}

export function extendLandmarks(points,width,height) {
  if(points.length<468)throw new RangeError('Expected full face mesh');
  const center=[0,0];for(const i of FACE_OVAL){center[0]=Math.fround(center[0]+points[i][0]);center[1]=Math.fround(center[1]+points[i][1]);}center[0]=Math.fround(center[0]/FACE_OVAL.length);center[1]=Math.fround(center[1]/FACE_OVAL.length);
  const out=points.map(p=>[p[0],p[1]]);
  for(const scale of [1.35,1.75])for(const i of UPPER_OVAL)out.push([Math.fround(center[0]+Math.fround(Math.fround(scale)*Math.fround(points[i][0]-center[0]))),Math.fround(center[1]+Math.fround(Math.fround(scale)*Math.fround(points[i][1]-center[1])))]);
  return out.map(p=>[Math.fround(clip(p[0],0,width-1)),Math.fround(clip(p[1],0,height-1))]);
}

function circumcircle(a,b,c) {
  const d=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]));
  if(Math.abs(d)<1e-12)return null;
  const aa=a[0]*a[0]+a[1]*a[1],bb=b[0]*b[0]+b[1]*b[1],cc=c[0]*c[0]+c[1]*c[1];
  const x=(aa*(b[1]-c[1])+bb*(c[1]-a[1])+cc*(a[1]-b[1]))/d,y=(aa*(c[0]-b[0])+bb*(a[0]-c[0])+cc*(b[0]-a[0]))/d;
  return [x,y,(x-a[0])**2+(y-a[1])**2];
}

/** Destination Delaunay. Duplicate boundary points preserve their first mesh index.
 * For reproducibility fixtures may supply native SciPy triangles explicitly.
 */
export function delaunay(points) {
  const work=[],original=[],seen=new Set();
  for(let i=0;i<points.length;i++){const p=points[i],key=p[0]+','+p[1];if(!seen.has(key)){seen.add(key);work.push(p);original.push(i);}}
  const n=work.length;if(n<3)throw new RangeError('Insufficient unique warp points');
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;for(const p of work){minX=Math.min(minX,p[0]);minY=Math.min(minY,p[1]);maxX=Math.max(maxX,p[0]);maxY=Math.max(maxY,p[1]);}
  const d=Math.max(maxX-minX,maxY-minY)||1,cx=(minX+maxX)/2,cy=(minY+maxY)/2;
  // Face meshes contain almost collinear temple landmarks. A small enclosing
  // triangle can suppress a valid, very large-circumradius hull triangle.
  work.push([cx-4096*d,cy-256*d],[cx,cy+4096*d],[cx+4096*d,cy-256*d]);
  let triangles=[[n,n+1,n+2]];
  for(let index=0;index<n;index++) {
    const p=work[index],edges=new Map(),kept=[];
    for(const tri of triangles){const circle=circumcircle(...tri.map(i=>work[i]));if(circle&&(p[0]-circle[0])**2+(p[1]-circle[1])**2<=circle[2]+1e-8){for(let k=0;k<3;k++){const a=tri[k],b=tri[(k+1)%3],key=Math.min(a,b)+':'+Math.max(a,b);if(edges.has(key))edges.delete(key);else edges.set(key,[a,b]);}}else kept.push(tri);}
    for(const edge of edges.values())kept.push([edge[0],edge[1],index]);triangles=kept;
  }
  return triangles.filter(t=>t.every(i=>i<n)).map(t=>t.map(i=>original[i]));
}

function sample(input,x,y,channel,quantize=false,border=0) {
  // Legacy OpenCV 4 remap used a 1/32-pixel table. The native IrisMix
  // environment has OpenCV 5.0, whose float32 remap uses exact linear weights.
  const cvRound=v=>{const low=Math.floor(v),fraction=v-low;return fraction===.5?(low%2===0?low:low+1):Math.round(v);};
  if(quantize){x=cvRound(x*32)/32;y=cvRound(y*32)/32;}
  const x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0;
  const get=(xx,yy)=>xx<0||yy<0||xx>=input.width||yy>=input.height?border:input.data[(yy*input.width+xx)*input.channels+channel];
  return get(x0,y0)*(1-fx)*(1-fy)+get(x0+1,y0)*fx*(1-fy)+get(x0,y0+1)*(1-fx)*fy+get(x0+1,y0+1)*fx*fy;
}

/** Premultiplied landmark warp; integer destination sample centers match MC.pwarp. */
export function warpPremultipliedLayer(layer,referencePoints,sourcePoints,width,height,triangles=delaunay(sourcePoints),quantized=false) {
  if(referencePoints.length!==sourcePoints.length)throw new RangeError('Mesh correspondence mismatch');
  const alpha=image(width,height,1),P=image(width,height,3),mapX=new Float32Array(width*height).fill(-1e4),mapY=new Float32Array(width*height).fill(-1e4),inside=new Uint8Array(width*height);
  for(const indices of triangles) {
    const [a,b,c]=indices.map(i=>sourcePoints[i]),[ra,rb,rc]=indices.map(i=>referencePoints[i]);
    const area=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);if(Math.abs(area)<=1e-3)continue;
    const minX=Math.max(0,Math.ceil(Math.min(a[0],b[0],c[0]))),maxX=Math.min(width-1,Math.floor(Math.max(a[0],b[0],c[0]))),minY=Math.max(0,Math.ceil(Math.min(a[1],b[1],c[1]))),maxY=Math.min(height-1,Math.floor(Math.max(a[1],b[1],c[1])));
    for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++) {
      const u=((b[0]-x)*(c[1]-y)-(b[1]-y)*(c[0]-x))/area,v=((c[0]-x)*(a[1]-y)-(c[1]-y)*(a[0]-x))/area,w=1-u-v;
      if(u < -1e-8||v < -1e-8||w < -1e-8)continue;
      const i=y*width+x,sx=Math.fround(u*ra[0]+v*rb[0]+w*rc[0]),sy=Math.fround(u*ra[1]+v*rb[1]+w*rc[1]);
      mapX[i]=sx;mapY[i]=sy;inside[i]=1;alpha.data[i]=clip(sample(layer.alpha,sx,sy,0,quantized));for(let ch=0;ch<3;ch++)P.data[3*i+ch]=clip(sample(layer.premultiplied,sx,sy,ch,quantized));
    }
  }
  return {alpha,premultiplied:P,mapX,mapY,inside,triangles};
}

function reflect101(x,n){if(n===1)return 0;while(x<0||x>=n)x=x<0?-x:2*n-x-2;return x;}

export function gaussian(input,sigma=1) {
  const radius=Math.round(sigma*4),kernel=new Float32Array(radius*2+1);let sum=0;
  for(let i=-radius;i<=radius;i++){kernel[i+radius]=Math.exp(-0.5*i*i/(sigma*sigma));sum+=kernel[i+radius];}for(let i=0;i<kernel.length;i++)kernel[i]/=sum;
  const tmp=image(input.width,input.height,input.channels),out=image(input.width,input.height,input.channels);
  for(let y=0;y<input.height;y++)for(let x=0;x<input.width;x++)for(let c=0;c<input.channels;c++){let s=0;for(let k=-radius;k<=radius;k++)s+=input.data[(y*input.width+reflect101(x+k,input.width))*input.channels+c]*kernel[k+radius];tmp.data[(y*input.width+x)*input.channels+c]=s;}
  for(let y=0;y<input.height;y++)for(let x=0;x<input.width;x++)for(let c=0;c<input.channels;c++){let s=0;for(let k=-radius;k<=radius;k++)s+=tmp.data[(reflect101(y+k,input.height)*input.width+x)*input.channels+c]*kernel[k+radius];out.data[(y*input.width+x)*input.channels+c]=s;}
  return out;
}

export function morph(input,radius,operation='dilate',ellipse=false) {
  if(input.channels!==1)throw new RangeError('Mask required');
  const out=image(input.width,input.height,1),isMax=operation==='dilate';
  for(let y=0;y<input.height;y++)for(let x=0;x<input.width;x++){
    let result=isMax?0:1;
    for(let dy=-radius;dy<=radius;dy++){
      const rx=ellipse&&radius?Math.round(radius*Math.sqrt(Math.max(0,1-dy*dy/(radius*radius)))):radius;
      for(let dx=-rx;dx<=rx;dx++){
        const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=input.width||yy>=input.height)continue;
        const value=input.data[yy*input.width+xx];result=isMax?Math.max(result,value):Math.min(result,value);
      }
    }
    out.data[y*input.width+x]=result;
  }
  return out;
}

function removeSmallComponents(mask,minSize) {
  const {width,height,data}=mask,seen=new Uint8Array(data.length),queue=new Int32Array(data.length);
  for(let i=0;i<data.length;i++)if(data[i]&&!seen[i]){
    let head=0,tail=1;queue[0]=i;seen[i]=1;
    while(head<tail){const n=queue[head++],x=n%width,y=Math.floor(n/width);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy,j=yy*width+xx;if(xx>=0&&yy>=0&&xx<width&&yy<height&&data[j]&&!seen[j]){seen[j]=1;queue[tail++]=j;}}}
    if(tail<minSize)for(let k=0;k<tail;k++)data[queue[k]]=0;
  }
}

export function designMask(alpha,visible=null,{reach=8,hi=.20,lo=.06,scale=1}={}) {
  const blurred=gaussian(alpha,scale),seed=image(alpha.width,alpha.height,1);
  for(let i=0;i<seed.data.length;i++)seed.data[i]=blurred.data[i]>=hi?1:0;
  removeSmallComponents(seed,6*scale*scale);
  let out=seed;
  for(let k=0;k<Math.round(reach*scale);k++){out=morph(out,1);for(let i=0;i<out.data.length;i++)out.data[i]*=blurred.data[i]>=lo?1:0;}
  if(visible)for(let i=0;i<out.data.length;i++)if(visible.data[i]>.02)out.data[i]=1;
  return out;
}

export function protectMask({eyeball,mouth,hair,glasses,unrequested,design}) {
  const out=image(design.width,design.height,1);
  for(const [input,erode]of [[eyeball,true],[mouth,false],[hair,false],[glasses,false]])if(input){if(input.width!==design.width||input.height!==design.height)throw new RangeError('Protection must be in the 512 crop');let m=image(input.width,input.height,1,Float32Array.from(input.data,v=>v>.5?1:0));if(erode)m=morph(m,1,'erode');for(let i=0;i<out.data.length;i++)out.data[i]=Math.max(out.data[i],m.data[i]);}
  if(unrequested){const grown=morph(design,1);for(let i=0;i<out.data.length;i++)out.data[i]=Math.max(out.data[i],unrequested.data[i]>.5?1-grown.data[i]:0);}
  return out;
}

export function omega(design,protect=null,{radius=2,feather=2,scale=1}={}) {
  const grown=morph(design,Math.max(1,Math.round(radius*scale)),'dilate',true);
  if(protect)for(let i=0;i<grown.data.length;i++)grown.data[i]*=1-protect.data[i];
  const out=gaussian(grown,feather*scale);for(let i=0;i<out.data.length;i++)out.data[i]=clip(out.data[i]);return out;
}

/** Stage II inputs use [-1,1] NCHW; scalar A is repeated to three channels. */
export function modelTensor(input) {
  if(![1,3].includes(input.channels))throw new RangeError('One or three channels required');
  const n=input.width*input.height,data=new Float32Array(3*n);
  for(let c=0;c<3;c++)for(let i=0;i<n;i++)data[c*n+i]=input.data[i*input.channels+(input.channels===1?0:c)]*2-1;
  return {data,dims:[1,3,input.height,input.width]};
}

/** Strict assembly: source maps and reference crops must come from actual native
 * algorithms. Missing semantic parsing or maps are errors; never zero-filled.
 */
export function assembleStageII({source,C,A,K,visible,sourceConditions,crops,protection}) {
  const box=sourceConditions.box,cr=x=>cropResize(x,box,512);
  for(const key of ['S1','S2','S3','G1','G2'])if(!sourceConditions[key])throw new Error('Missing actual source condition '+key);
  for(const key of ['lip','eyeL','eyeR'])if(!crops[key])throw new Error('Missing actual reference crop '+key);
  if(!protection)throw new Error('Explicit actual parser protection maps required');
  const alpha=cr(A),av=cr(visible),premult=cr(K),C5=cr(C),initialD=designMask(alpha),K5=image(512,512,3);
  for(let i=0;i<alpha.data.length;i++){alpha.data[i]=clip(alpha.data[i])*initialD.data[i];for(let c=0;c<3;c++)K5.data[3*i+c]=clip(premult.data[3*i+c]*initialD.data[i]+(1-alpha.data[i])*.5);}
  const removed=image(512,512,1);for(let i=0;i<removed.data.length;i++)removed.data[i]=clip(alpha.data[i]-av.data[i]);
  const removedSmall=resize(removed,256,256,'area'),S2=image(256,256,3,sourceConditions.S2.data.slice());
  for(let i=0;i<removedSmall.data.length;i++)S2.data[3*i+2]=removedSmall.data[i];
  const D=designMask(alpha,av),pm=protectMask({...protection,design:D}),om=omega(D,pm);
  const arrays={C:C5,K:K5,A:alpha,...Object.fromEntries(['S1','S3','G1','G2'].map(k=>[k,sourceConditions[k]])),S2,...crops};
  for(const key of CONDITION_NAMES){const input=arrays[key],size=['C','K','A'].includes(key)?512:256;if(input.width!==size||input.height!==size)throw new RangeError(`Wrong ${key} resolution`);}
  return {arrays,tensors:Object.fromEntries(CONDITION_NAMES.map(k=>[k,modelTensor(arrays[k])])),info:{box,C5,D,om},source,C,visible};
}

/** Render residual compositing matches infer_render.compose_full. Model H5 must
 * be a real Stage II decoded sample, never an affine-warp image.
 */
export function composeStageIIRender(prepared,H5) {
  const {source,C,visible,info}=prepared,[x0,y0,side]=info.box;
  if(H5.width!==512||H5.height!==512||H5.channels!==3)throw new RangeError('Actual Stage II 512 RGB output required');
  const residual=image(512,512,3);for(let i=0;i<residual.data.length;i++)residual.data[i]=H5.data[i]-info.C5.data[i];
  const mode=side>512?'cubic':'area',upR=resize(residual,side,side,mode),upM=resize(info.om,side,side,mode),out=image(source.width,source.height,3,source.data.slice()),mask=image(source.width,source.height,1);
  for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++){
    const i=y*source.width+x,inside=x>=x0&&x<x0+side&&y>=y0&&y<y0+side,j=(y-y0)*side+x-x0;
    let m=inside?clip(upM.data[j]):visible.data[i]>.02?1:0;if(m<1/512)m=0;mask.data[i]=m;
    for(let c=0;c<3;c++){const value=clip(C.data[3*i+c]+(inside?upR.data[3*j+c]:0));out.data[3*i+c]=clip((1-m)*source.data[3*i+c]+m*value);}
  }
  return {image:out,mask};
}
