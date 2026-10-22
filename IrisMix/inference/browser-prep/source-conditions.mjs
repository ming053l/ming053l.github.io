/* Native IrisMix geometry / source-map port. OpenCV.js is injected and used for
 * the same polygon rasterization, morphology and 5x5 distance transform.
 * SegFormer probabilities and MediaPipe xyz must be actual model predictions.
 */
import {image,faceBox,cropResize,resize,delaunay,designMask} from './preprocess.mjs';
const clip=v=>Math.max(0,Math.min(1,v));
const f=Math.fround;
const round=v=>{const a=Math.floor(v);return v-a===.5?(a%2===0?a:a+1):Math.round(v);};
export const PARTS=Object.freeze(['lips','eyes','brows','face','forehead']);
export const LIP_OUT=[61,146,91,181,84,17,314,405,321,375,291,409,270,269,267,0,37,39,40,185];
export const LIP_IN=[78,95,88,178,87,14,317,402,318,324,308,415,310,311,312,13,82,81,80,191];
export const EYE_L=[33,246,161,160,159,158,157,173,133,155,154,153,145,144,163,7];
export const EYE_R=[263,466,388,387,386,385,384,398,362,382,381,380,374,373,390,249];
const BROW_L=[70,63,105,66,107,55,65,52,53,46],BROW_R=[300,293,334,296,336,285,295,282,283,276];
const BROWLINE_L=[[70,63,105,66,107],[46,53,52,65,55]],BROWLINE_R=[[300,293,334,296,336],[276,283,282,295,285]];
const FACE_OVAL=[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];
const UPPER_OVAL=[10,338,297,332,284,251,389,162,21,54,103,67,109];
const CREASE_L=[113,225,224,223,222,221,189],CREASE_R=[342,445,444,443,442,441,413];

/** Small allocating wrapper; every OpenCV heap Mat is deleted before return. */
export function cvOperations(cv){
  if(!cv?.Mat||!cv.distanceTransform||!cv.connectedComponentsWithStats)throw new TypeError('Initialized official OpenCV.js required');
  const mat=input=>cv.matFromArray(input.height,input.width,cv.CV_32F+((input.channels-1)<<3),input.data);
  const mat8=input=>cv.matFromArray(input.height,input.width,cv.CV_8UC1,Uint8Array.from(input.data));
  const output=m=>image(m.cols,m.rows,m.channels(),m.depth()===cv.CV_32F?m.data32F.slice():Float32Array.from(m.data));
  const run=(input,operation,binary=false)=>{const src=binary?mat8(input):mat(input),dst=new cv.Mat();try{operation(src,dst);return output(dst);}finally{src.delete();dst.delete();}};
  const gaussian=(input,sigma)=>run(input,(src,dst)=>cv.GaussianBlur(src,dst,new cv.Size(0,0),sigma,sigma,cv.BORDER_DEFAULT));
  const morphology=(input,radius,erode=false)=>run(input,(src,dst)=>{const kernel=cv.Mat.ones(2*radius+1,2*radius+1,cv.CV_8U);try{if(erode)cv.erode(src,dst,kernel);else cv.dilate(src,dst,kernel);}finally{kernel.delete();}});
  const polygon=(points,width=512,height=width,amount=0,blur=0)=>{
    const out=cv.Mat.zeros(height,width,cv.CV_8UC1),contour=cv.matFromArray(points.length,1,cv.CV_32SC2,points.flatMap(p=>[round(p[0]),round(p[1])])),contours=new cv.MatVector();
    let result;try{contours.push_back(contour);cv.fillPoly(out,contours,new cv.Scalar(1));result=output(out);}finally{out.delete();contour.delete();contours.delete();}
    if(amount)result=morphology(result,amount);return blur?gaussian(result,blur):result;
  };
  const convexPolygon=(points,width,height)=>{
    const dst=cv.Mat.zeros(height,width,cv.CV_8UC1),contour=cv.matFromArray(points.length,1,cv.CV_32SC2,points.flatMap(p=>[round(p[0]),round(p[1])]));
    try{cv.fillConvexPoly(dst,contour,new cv.Scalar(1));return output(dst);}finally{dst.delete();contour.delete();}
  };
  const convex=points=>{const input=cv.matFromArray(points.length,1,cv.CV_32FC2,points.flatMap(p=>[p[0],p[1]])),out=new cv.Mat();try{cv.convexHull(input,out,false,true);const data=out.data32F,result=[];for(let i=0;i<data.length;i+=2)result.push([data[i],data[i+1]]);return result;}finally{input.delete();out.delete();}};
  const polylines=(groups,width=512,height=width)=>{
    const dst=new cv.Mat(height,width,cv.CV_8UC1,new cv.Scalar(255));
    try{for(const points of groups){const contour=cv.matFromArray(points.length,1,cv.CV_32SC2,points.flatMap(p=>[round(p[0]),round(p[1])])),v=new cv.MatVector();try{v.push_back(contour);cv.polylines(dst,v,false,new cv.Scalar(0),1);}finally{contour.delete();v.delete();}}return output(dst);}finally{dst.delete();}
  };
  const circles=(points,radius,width=512,height=width)=>{
    const dst=cv.Mat.zeros(height,width,cv.CV_32FC1);try{for(const p of points)cv.circle(dst,new cv.Point(round(p[0]),round(p[1])),radius,new cv.Scalar(1),-1);return output(dst);}finally{dst.delete();}
  };
  const distance=input=>run(input,(src,dst)=>cv.distanceTransform(src,dst,cv.DIST_L2,5),true);
  const lab=input=>run(input,(src,dst)=>cv.cvtColor(src,dst,cv.COLOR_RGB2Lab));
  const median=(input,size)=>run(input,(src,dst)=>cv.medianBlur(src,dst,size));
  const components=input=>{
    const src=mat8(input),labels=new cv.Mat(),stats=new cv.Mat(),centroids=new cv.Mat();
    try{const count=cv.connectedComponentsWithStats(src,labels,stats,centroids,8,cv.CV_32S);return{count,labels:labels.data32S.slice(),stats:stats.data32S.slice()};}finally{src.delete();labels.delete();stats.delete();centroids.delete();}
  };
  return{cv,gaussian,dilate:(x,r)=>morphology(x,r),erode:(x,r)=>morphology(x,r,true),polygon,convexPolygon,convex,polylines,circles,distance,components,lab,median};
}

const pointsMean=points=>{const out=[0,0];for(const p of points){out[0]=f(out[0]+p[0]);out[1]=f(out[1]+p[1]);}return out.map(v=>f(v/points.length));};
const scalePoints=(points,s)=>{const c=pointsMean(points);return points.map(p=>[f(c[0]+f(s[0]*f(p[0]-c[0]))),f(c[1]+f(s[1]*f(p[1]-c[1])))]);};
const merge=(masks,fn)=>{const out=image(masks[0].width,masks[0].height,1);for(let i=0;i<out.data.length;i++)out.data[i]=fn(...masks.map(m=>m.data[i]));return out;};
const channel=(input,c)=>{const out=image(input.width,input.height,1);for(let i=0;i<out.data.length;i++)out.data[i]=input.data[i*input.channels+c];return out;};
const stack=planes=>{const out=image(planes[0].width,planes[0].height,planes.length);for(let i=0;i<planes[0].data.length;i++)for(let c=0;c<planes.length;c++)out.data[i*planes.length+c]=planes[c].data[i];return out;};

export function ruleParts(points,ops){
  const p=points,lips=ops.polygon(LIP_OUT.map(i=>p[i]),512,512,3,2);
  let eyes=image(512,512,1),brows=image(512,512,1);
  for(const [eye,bl,br]of [[EYE_L,BROWLINE_L,BROW_L],[EYE_R,BROWLINE_R,BROW_R]]){
    const reg=scalePoints(eye.map(i=>p[i]),[1.45,1.9]).concat(bl[1].map(i=>p[i]));
    eyes=merge([eyes,ops.polygon(ops.convex(reg),512,512,4,4)],Math.max);
    brows=merge([brows,ops.polygon(ops.convex(br.map(i=>p[i])),512,512,3,2)],Math.max);
  }
  const center=pointsMean(FACE_OVAL.map(i=>p[i])),ext=FACE_OVAL.map(i=>p[i]).concat(UPPER_OVAL.map(i=>[f(center[0]+f(1.75*f(p[i][0]-center[0]))),f(center[1]+f(1.75*f(p[i][1]-center[1])))]));
  const face=ops.polygon(ops.convex(ext),512,512,0,3),fore=image(512,512,1);
  const browY=Math.min(...BROW_L.concat(BROW_R).map(i=>p[i][1]));
  for(let y=0;y<512;y++)for(let x=0;x<512;x++)fore.data[y*512+x]=face.data[y*512+x]*clip(f(f(f(browY-y)/12)+.5));
  const rest=image(512,512,1,new Float32Array(512*512).fill(1)),weights={};
  for(const [name,mask]of [['lips',lips],['eyes',eyes],['brows',brows],['forehead',fore]]){const part=image(512,512,1);for(let i=0;i<part.data.length;i++){part.data[i]=mask.data[i]*rest.data[i];rest.data[i]*=f(1-mask.data[i]);}weights[name]=part;}
  weights.face=rest;return PARTS.map(k=>weights[k]);
}

export function signedS1(points,ops){
  const signed=ids=>{const inside=ops.polygon(ids.map(i=>points[i])),outside=image(512,512,1,Float32Array.from(inside.data,v=>1-v)),di=ops.distance(inside),do_=ops.distance(outside),out=image(512,512,1);for(let i=0;i<out.data.length;i++)out.data[i]=Math.max(-1,Math.min(1,f(do_.data[i]-di.data[i])/32));return out;};
  const eyes=merge([signed(EYE_L),signed(EYE_R)],Math.min),lips=signed(LIP_OUT),mouth=ops.polygon(LIP_IN.map(i=>points[i]));
  for(let i=0;i<lips.data.length;i++)if(mouth.data[i]>0)lips.data[i]=-1;
  const brow=ops.distance(ops.polylines(BROWLINE_L.concat(BROWLINE_R).map(g=>g.map(i=>points[i]))));
  const maps=[eyes,lips,brow];for(let i=0;i<eyes.data.length;i++){eyes.data[i]=f(.5+f(.5*eyes.data[i]));lips.data[i]=f(.5+f(.5*lips.data[i]));brow.data[i]=f(.5+f(.5*f(f(Math.min(brow.data[i],63.75)/63.75)*2-1)));}
  return resize(stack(maps),256,256,'area');
}

export function parsingContext(parsed){
  const {width,height,classes,probabilities}=parsed,n=width*height;
  if(classes!==19||probabilities.length!==n*19)throw new RangeError('Actual 19-class face-parser probabilities required');
  const labels=parsed.labels||new Uint8Array(n);
  if(!parsed.labels)for(let i=0;i<n;i++){let best=-Infinity;for(let c=0;c<19;c++){const v=probabilities[c*n+i];if(v>best){best=v;labels[i]=c;}}}
  const sum=indices=>{const out=image(width,height,1);for(let i=0;i<n;i++){let value=0;for(const c of indices)value=f(value+probabilities[c*n+i]);out.data[i]=value;}return out;};
  const mask=indices=>image(width,height,1,Float32Array.from(labels,v=>indices.includes(v)?1:0));
  return{width,height,labels,sum,mask};
}

export function targetMask(parsed,ops){
  const context=parsingContext(parsed),ok=context.sum([1,2,6,7,11,12,13,14]),eye=context.mask([4,5]),eroded=ops.erode(eye,Math.max(3,round(context.height/256)));
  for(let i=0;i<ok.data.length;i++)ok.data[i]=clip(f(ok.data[i]+f(eye.data[i]-eroded.data[i])));
  const support=ops.gaussian(ok,1),feat=context.sum([6,7,4,5]);for(let i=0;i<feat.data.length;i++)feat.data[i]=clip(feat.data[i]);
  const grown=ops.dilate(feat,3),hair=context.sum([13,14]);
  for(let i=0;i<hair.data.length;i++){support.data[i]=clip(support.data[i]);hair.data[i]=f(clip(hair.data[i])*f(1-grown.data[i]));}
  return{support,hair,context};
}

export function browRegion(points,width,height,ops){
  const a=ops.convexPolygon(ops.convex(BROW_L.map(i=>points[i])),width,height),b=ops.convexPolygon(ops.convex(BROW_R.map(i=>points[i])),width,height),mask=merge([a,b],Math.max),radius=Math.max(3,round(height/170));
  return ops.gaussian(ops.dilate(mask,radius),radius/2);
}

export function hairRule(parsed,points,ops){
  const {support,hair,context}=targetMask(parsed,ops),breg=browRegion(points,context.width,context.height,ops),hb=context.mask([13,14]),cc=ops.components(hb),keep=new Uint8Array(cc.count);
  for(let i=0;i<hb.data.length;i++)if(hb.data[i]&&breg.data[i]<.05)keep[cc.labels[i]]=1;keep[0]=0;
  for(let i=0;i<hair.data.length;i++){hair.data[i]=clip(f(f(hair.data[i]*f(1-breg.data[i]))+f(f(hair.data[i]*breg.data[i])*keep[cc.labels[i]])));support.data[i]=clip(Math.max(support.data[i],breg.data[i]));}
  return{support,hair,context,brow:breg};
}

function meshNormals(points,n=512){
  const triangles=delaunay(points),vn=points.map(()=>[0,0,0]);
  for(const tri of triangles){const [a,b,c]=tri.map(i=>points[i]),u=b.map((v,k)=>v-a[k]),v=c.map((v,k)=>v-a[k]),normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const length=Math.max(Math.hypot(...normal),1e-6),sign=normal[2]>0?-1:1;for(let k=0;k<3;k++)normal[k]=normal[k]/length*sign;for(const i of tri)for(let k=0;k<3;k++)vn[i][k]+=normal[k];}
  for(const v of vn){const length=Math.max(Math.hypot(...v),1e-6);for(let k=0;k<3;k++)v[k]/=length;}
  const out=image(n,n,3),inside=new Uint8Array(n*n);
  for(const tri of triangles){const [a,b,c]=tri.map(i=>points[i]),area=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);if(Math.abs(area)<1e-10)continue;
    const minX=Math.max(0,Math.ceil(Math.min(a[0],b[0],c[0])-.5)),maxX=Math.min(n-1,Math.floor(Math.max(a[0],b[0],c[0])-.5)),minY=Math.max(0,Math.ceil(Math.min(a[1],b[1],c[1])-.5)),maxY=Math.min(n-1,Math.floor(Math.max(a[1],b[1],c[1])-.5));
    for(let iy=minY;iy<=maxY;iy++)for(let ix=minX;ix<=maxX;ix++){const x=ix+.5,y=iy+.5,u=((b[0]-x)*(c[1]-y)-(b[1]-y)*(c[0]-x))/area,v=((c[0]-x)*(a[1]-y)-(c[1]-y)*(a[0]-x))/area,w=1-u-v;if(Math.min(u,v,w)<-1e-9)continue;const normal=[0,1,2].map(k=>u*vn[tri[0]][k]+v*vn[tri[1]][k]+w*vn[tri[2]][k]),length=Math.max(Math.hypot(...normal),1e-6),i=iy*n+ix;inside[i]=1;for(let k=0;k<3;k++)out.data[3*i+k]=f(.5+.5*normal[k]/length);out.data[3*i+1]=f(1-out.data[3*i+1]);}
  }
  return out;
}

/** Native common.source_conditions, maps S1/S2/S3/G1/G2 at 256 square. */
export function sourceConditions(source,points3D,parsed,ops){
  if(source.width!==parsed.width||source.height!==parsed.height)throw new RangeError('Parser frame mismatch');
  if(points3D.length!==478||points3D.some(p=>p.length<3))throw new RangeError('478 actual MediaPipe xyz landmarks required');
  const box=faceBox(points3D,source.width,source.height),scale=f(512/box[2]),p=points3D.map(q=>[f(f(q[0]-box[0])*scale),f(f(q[1]-box[1])*scale)]),{support,hair,context}=hairRule(parsed,points3D,ops),weights=ruleParts(p,ops);
  const center=pointsMean(FACE_OVAL.map(i=>p[i])),extended=FACE_OVAL.map(i=>p[i]).concat(UPPER_OVAL.map(i=>[f(center[0]+f(1.75*f(p[i][0]-center[0]))),f(center[1]+f(1.75*f(p[i][1]-center[1])))])),face=ops.polygon(ops.convex(extended),512,512,0,2),codes=[1,.8,.6,.2,.4],pid=image(512,512,1);
  for(let i=0;i<pid.data.length;i++){let index=0;for(let k=1;k<5;k++)if(weights[k].data[i]>weights[index].data[i])index=k;pid.data[i]=f(f(codes[index])*face.data[i]);}
  const openness=[];for(const [u,l,c0,c1]of [[159,145,33,133],[386,374,362,263]])openness.push(Math.hypot(points3D[u][0]-points3D[l][0],points3D[u][1]-points3D[l][1])/Math.max(Math.hypot(points3D[c0][0]-points3D[c1][0],points3D[c0][1]-points3D[c1][1]),1e-3));
  let opm=image(512,512,1);for(let k=0;k<2;k++){const reg=ops.polygon(ops.convex(scalePoints((k?EYE_R:EYE_L).map(i=>p[i]),[1.6,2.4])),512,512,0,3);for(let i=0;i<reg.data.length;i++)reg.data[i]*=clip(openness[k]*2);opm=merge([opm,reg],Math.max);}
  const crease=ops.distance(ops.polylines([CREASE_L,CREASE_R].map(g=>g.map(i=>p[i]))));for(let i=0;i<crease.data.length;i++)crease.data[i]=Math.min(crease.data[i],63.75)/63.75;
  const corners=ops.gaussian(ops.circles([33,133,362,263].map(i=>p[i]),3),3);for(let i=0;i<corners.data.length;i++)corners.data[i]=clip(corners.data[i]*3);
  const cr=x=>cropResize(x,box,512),eye=cr(context.mask([4,5])),glasses=cr(context.mask([3])),normals=meshNormals(p.map((q,i)=>[q[0],q[1],f(points3D[i][2]*scale)])),dn=x=>resize(x,256,256,'area');
  const mouth=ops.polygon(LIP_IN.map(i=>p[i]));
  return{box,p,p3:points3D,open:openness,support,hair,weights,
    S1:signedS1(p,ops),S2:dn(stack([pid,opm,image(512,512,1)])),S3:dn(stack([crease,corners,eye])),G1:dn(normals),G2:dn(stack([cr(hair),glasses,cr(support)])),
    protection:{eyeball:eye,mouth,hair:cr(hair),glasses},
  };
}

/** Identity-safe neutral-gray layer crops; no reference skin/photo enters. */
export function layerCrop({alpha,F,points,i0,i1,kind,design=null,region=null,eyeball=null,mouth=null},ops,n=256){
  const a=alpha.data.slice();for(let i=0;i<a.length;i++){if(design)a[i]*=design.data[i];if(region)a[i]*=region.data[i];if(eyeball&&eyeball.data[i]>.5)a[i]=0;if(mouth&&mouth.data[i]>.5)a[i]=0;}
  let x=points[i0],y=points[i1];if(x[0]>y[0])[x,y]=[y,x];
  const dx=y[0]-x[0],dy=y[1]-x[1],d2=dx*dx+dy*dy;if(d2<1e-8)return image(n,n,3,new Float32Array(n*n*3).fill(.5));
  const da=(kind==='lips'?[.2*n,.5*n]:[.22*n,.58*n]).map(f),db=(kind==='lips'?[.8*n,.5*n]:[.78*n,.58*n]).map(f),factor=(db[0]-da[0])/d2,aa=factor*dx,bb=factor*dy,tx=da[0]-aa*x[0]-bb*x[1],ty=da[1]+bb*x[0]-aa*x[1];
  const packed=image(alpha.width,alpha.height,4);for(let i=0;i<a.length;i++){packed.data[4*i]=a[i];for(let c=0;c<3;c++)packed.data[4*i+c+1]=a[i]*F.data[3*i+c];}
  const cubic=Math.hypot(dx,dy)<=.6*n,det=aa*aa+bb*bb,out=image(n,n,3);
  const weight=v=>{v=Math.abs(v);return v<=1?1.25*v*v*v-2.25*v*v+1:v<2?-.75*v*v*v+3.75*v*v-6*v+3:0;};
  const get=(x,y,c)=>x<0||y<0||x>=packed.width||y>=packed.height?0:packed.data[(y*packed.width+x)*4+c];
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const sx=f((aa*(x-tx)-bb*(y-ty))/det),sy=f((bb*(x-tx)+aa*(y-ty))/det),ix=Math.floor(sx),iy=Math.floor(sy),pm=[0,0,0,0];
    if(cubic){for(let yy=iy-1;yy<=iy+2;yy++)for(let xx=ix-1;xx<=ix+2;xx++){const w=weight(sx-xx)*weight(sy-yy);for(let c=0;c<4;c++)pm[c]+=get(xx,yy,c)*w;}}
    else {const fx=sx-ix,fy=sy-iy;for(let c=0;c<4;c++)pm[c]=get(ix,iy,c)*(1-fx)*(1-fy)+get(ix+1,iy,c)*fx*(1-fy)+get(ix,iy+1,c)*(1-fx)*fy+get(ix+1,iy+1,c)*fx*fy;}
    const i=y*n+x;for(let c=0;c<3;c++)out.data[3*i+c]=clip(f(pm[c+1])+f(f(1-clip(f(pm[0])))*.5));
  }
  return out;
}

export function referenceCrops(layer,points,parsed,ops,weights=null){
  const {alpha,F}=layer,context=parsingContext(parsed),eye=context.mask([4,5]),mouth=ops.polygon(LIP_IN.map(i=>points[i]),alpha.width,alpha.height),box=faceBox(points,alpha.width,alpha.height),scale=box[2]/512,design=designMask(alpha,null,{scale}),mouthWidth=Math.hypot(points[61][0]-points[291][0],points[61][1]-points[291][1]),radius=Math.max(1,round(.12*mouthWidth)),lip=ops.dilate(ops.polygon(LIP_OUT.map(i=>points[i]),alpha.width,alpha.height),radius);
  if(!weights){const local=points.map(p=>[f((p[0]-box[0])*512/box[2]),f((p[1]-box[1])*512/box[2])]),w=ruleParts(local,ops);weights=w.map(map=>{const up=resize(map,box[2],box[2],'linear'),out=image(alpha.width,alpha.height,1);for(let y=0;y<box[2];y++)out.data.set(up.data.subarray(y*box[2],(y+1)*box[2]),(box[1]+y)*alpha.width+box[0]);return out;});}
  const eyes=image(alpha.width,alpha.height,1);for(let i=0;i<eyes.data.length;i++)eyes.data[i]=weights[1].data[i]>.3||(weights[2].data[i]>.3&&design.data[i])?1:0;
  const options={alpha,F,points,design,eyeball:eye,mouth};
  return{lip:layerCrop({...options,i0:61,i1:291,kind:'lips',region:lip},ops),eyeL:layerCrop({...options,i0:33,i1:133,kind:'eye',region:eyes},ops),eyeR:layerCrop({...options,i0:362,i1:263,kind:'eye',region:eyes},ops)};
}
