/* Native MC.transfer_layer default whole-reference path, design_only=true,
 * check_glasses=false, min_design=false, lip_mode='recolour'. These are the
 * actual frozen rules used by IrisMix paper/demo inference.
 */
import {image,restoreReferenceWeights,extendLandmarks,warpPremultipliedLayer,assembleStageII,selectReferenceLayer} from './preprocess.mjs';
import {sourceConditions,referenceCrops,ruleParts,targetMask,browRegion,parsingContext,LIP_IN} from './source-conditions.mjs';
const f=Math.fround,clip=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const round=v=>{const a=Math.floor(v);return v-a===.5?(a%2===0?a:a+1):Math.round(v);};
const LIP_PTS=[61,146,91,181,84,17,314,405,321,375,291,409,270,269,267,0,37,39,40,185,78,191,80,81,82,13,312,311,310,415,308,324,318,402,317,14,87,178,88,95];
const NOSE=[64,98,97,2,326,327,294,278,344,440,275,4,45,220,115,48];
const scalar=(width,height,fn)=>{const out=image(width,height,1);for(let i=0;i<out.data.length;i++)out.data[i]=fn(i);return out;};
const meanRGB=input=>scalar(input.width,input.height,i=>f(f(f(input.data[3*i]+input.data[3*i+1])+input.data[3*i+2])/3));
const percentile=(values,p)=>{if(!values.length)throw new RangeError('Percentile of empty set');values.sort((a,b)=>a-b);const pos=(values.length-1)*p/100,lo=Math.floor(pos);return values[lo]+(values[Math.min(lo+1,values.length-1)]-values[lo])*(pos-lo);};
const average=values=>values.reduce((a,b)=>a+b,0)/values.length;
const selected=(data,mask,threshold)=>{const out=[];for(let i=0;i<data.length;i++)if(mask[i]>threshold)out.push(data[i]);return out;};
const factor=(input,mask)=>{const out=image(input.width,input.height,1);for(let i=0;i<out.data.length;i++)out.data[i]=input.data[i]*mask.data[i];return out;};

export function nostrils(photo,points,ops){
  const support=ops.convexPolygon(ops.convex(NOSE.map(i=>points[i].map(round))),photo.width,photo.height),L=meanRGB(photo),values=selected(L.data,support.data,0);
  if(values.length<50)return image(photo.width,photo.height,1);
  const skin=percentile(values,70),mask=scalar(photo.width,photo.height,i=>L.data[i]<.62*skin&&support.data[i]>0?1:0),opened=ops.dilate(ops.erode(mask,1),1),radius=Math.max(3,round(photo.height/256));
  return ops.gaussian(ops.dilate(opened,radius),radius/2);
}

export function referenceContext(bare,madeup,points,parsed,ops){
  const {support,hair}=targetMask(parsed,ops),radius=Math.max(3,round(bare.height/128)),refSupport=ops.erode(support,radius),mouth=ops.gaussian(ops.polygon(LIP_IN.map(i=>points[i]),bare.width,bare.height),1),nos=nostrils(bare,points,ops),sigma=Math.max(2,bare.height/256),blurMade=ops.gaussian(madeup,1.5*sigma),blurBare=ops.gaussian(bare,1.5*sigma),labI=ops.lab(blurMade),labB=ops.lab(blurBare);
  const wash=scalar(bare.width,bare.height,i=>clip((Math.hypot(labI.data[3*i+1]-labB.data[3*i+1],labI.data[3*i+2]-labB.data[3*i+2])-5)/5)),smoothWash=ops.gaussian(ops.dilate(wash,2),sigma);
  return{refSupport,oneMinusHair:scalar(bare.width,bare.height,i=>1-hair.data[i]),oneMinusMouth:scalar(bare.width,bare.height,i=>1-mouth.data[i]),oneMinusNostrils:scalar(bare.width,bare.height,i=>1-nos.data[i]),wash:smoothWash,lightness:meanRGB(bare),labBare:ops.lab(bare)};
}

export function targetContext(source,points,parsed,ops){
  const {support,hair,context}=targetMask(parsed,ops),brow=browRegion(points,source.width,source.height,ops),hb=context.mask([13,14]),cc=ops.components(hb),keep=new Uint8Array(cc.count);
  for(let i=0;i<hb.data.length;i++)if(hb.data[i]&&brow.data[i]<.05)keep[cc.labels[i]]=1;keep[0]=0;
  for(let i=0;i<hair.data.length;i++){hair.data[i]=f(f(hair.data[i]*f(1-brow.data[i]))+f(f(hair.data[i]*brow.data[i])*keep[cc.labels[i]]));support.data[i]=Math.max(support.data[i],brow.data[i]);}
  const lip=context.sum([11,12]);for(let i=0;i<lip.data.length;i++)lip.data[i]=clip(lip.data[i]);
  const lipMask=ops.gaussian(ops.dilate(lip,1),1),L=meanRGB(source),lipValues=selected(L.data,lipMask.data,.5),meanLip=lipValues.length?average(lipValues):.5,shade=scalar(source.width,source.height,i=>1+.75*(clip(L.data[i]/Math.max(meanLip,1e-3),.3,2)-1));
  const mouth=ops.gaussian(ops.polygon(LIP_IN.map(i=>points[i]),source.width,source.height),1),nos=nostrils(source,points,ops);
  for(let i=0;i<support.data.length;i++)support.data[i]=f(f(support.data[i]*f(1-mouth.data[i]))*f(1-nos.data[i]));
  const browBinary=scalar(source.width,source.height,i=>brow.data[i]>.3?1:0),grown=ops.dilate(browBinary,7),ring=[];
  for(let i=0;i<grown.data.length;i++)if(grown.data[i]>0&&brow.data[i]<.1&&parsed.probabilities[source.width*source.height+i]>.5)ring.push(L.data[i]);
  const browValues=selected(L.data,brow.data,.3),skin=ring.length>20?percentile(ring,50):browValues.length?percentile(browValues,90):.5,meanBrow=browValues.length?average(browValues):.5;
  const strand=scalar(source.width,source.height,i=>.25+.75*clip((skin-L.data[i])/Math.max(.45*skin,1e-3))),browFactor=scalar(source.width,source.height,i=>1+.3*(clip(L.data[i]/Math.max(meanBrow,1e-3),.3,2)-1));
  return{support,hair,brow,lip:lipMask,shade,strand,browFactor};
}

function fillHoles(mask){
  const {width,height,data}=mask,out=image(width,height,1),seen=new Uint8Array(data.length),queue=new Int32Array(data.length);let head=0,tail=1;queue[0]=0;seen[0]=1;const value=data[0];
  while(head<tail){const i=queue[head++],x=i%width,y=Math.floor(i/width);for(const [xx,yy]of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){const j=yy*width+xx;if(xx>=0&&xx<width&&yy>=0&&yy<height&&!seen[j]&&data[j]===value){seen[j]=1;queue[tail++]=j;}}}
  // Native floodFill(ff,(0,0),1); holes=1-ff, not generic all-border fill.
  for(let i=0;i<data.length;i++)out.data[i]=seen[i]?0:1-data[i];return out;
}

export function cleanReferenceAlpha(layer,bare,madeup,points,parsed,ops,context=null){
  const {alpha,F,weights}=layer,rc=context||referenceContext(bare,madeup,points,parsed,ops),sigma=Math.max(2,bare.height/256),a=scalar(bare.width,bare.height,i=>f(f(f(alpha.data[i]*rc.refSupport.data[i])*rc.oneMinusHair.data[i])*rc.oneMinusMouth.data[i]));
  for(let i=0;i<a.data.length;i++)a.data[i]*=rc.oneMinusNostrils.data[i];
  let low=ops.gaussian(a,2*sigma);const opaque=scalar(bare.width,bare.height,i=>clip((a.data[i]-.3)/.15)),foregroundLight=meanRGB(F),labF=ops.lab(F);
  for(let i=0;i<a.data.length;i++)a.data[i]=f(f(a.data[i]*opaque.data[i])+f(Math.min(a.data[i],low.data[i])*f(1-opaque.data[i])));
  for(let i=0;i<a.data.length;i++){
    const dark=clip((rc.lightness.data[i]-foregroundLight.data[i]-.04)/.08),dch=Math.hypot(labF.data[3*i+1]-rc.labBare.data[3*i+1],labF.data[3*i+2]-rc.labBare.data[3*i+2]),light=clip((foregroundLight.data[i]-rc.lightness.data[i]-.03)/.06)*clip(1-(dch-8)/8);
    a.data[i]*=f(1-f(f(dark*f(1-opaque.data[i]))*f(1-rc.wash.data[i])));a.data[i]*=f(1-f(f(light*f(1-opaque.data[i]))*f(1-rc.wash.data[i])));
  }
  const blurred=ops.gaussian(a,sigma),design=scalar(bare.width,bare.height,i=>clip((blurred.data[i]-.35)/.15)),keep=scalar(bare.width,bare.height,i=>Math.max(design.data[i],rc.wash.data[i])),holes=fillHoles(scalar(bare.width,bare.height,i=>keep.data[i]>.5?1:0));
  for(let i=0;i<keep.data.length;i++)keep.data[i]=Math.max(keep.data[i],holes.data[i]);
  const keepSmooth=ops.gaussian(ops.dilate(keep,1),.75*sigma);low=ops.gaussian(a,sigma);const lips=weights[0].data;
  for(let i=0;i<a.data.length;i++)a.data[i]=f(f(Math.max(f(a.data[i]*design.data[i]),f(Math.min(a.data[i],low.data[i])*keepSmooth.data[i]))*f(1-lips[i]))+f(a.data[i]*lips[i]));
  const smoothed=ops.gaussian(a,1.5*sigma),lowBinary=scalar(bare.width,bare.height,i=>smoothed.data[i]>=.1?1:0),cc=ops.components(lowBinary),keepCC=new Uint8Array(cc.count);
  for(let i=0;i<a.data.length;i++)if(smoothed.data[i]>=.3&&lowBinary.data[i]>0)keepCC[cc.labels[i]]=1;keepCC[0]=0;
  for(let c=0;c<cc.count;c++)if(cc.stats[c*5+4]<.0005*a.data.length)keepCC[c]=0;
  const coherent=ops.gaussian(ops.dilate(scalar(bare.width,bare.height,i=>keepCC[cc.labels[i]]),2),sigma);
  for(let i=0;i<a.data.length;i++){a.data[i]*=Math.max(coherent.data[i],rc.wash.data[i]);a.data[i]*=clip((a.data[i]-.08)/.12);}
  return{alpha:a,context:rc};
}

function premultiplied(alpha,F){const out=image(alpha.width,alpha.height,3);for(let i=0;i<alpha.data.length;i++)for(let c=0;c<3;c++)out.data[3*i+c]=alpha.data[i]*F.data[3*i+c];return out;}
function warp(alpha,F,pr,pt,width,height,quantized=false){return warpPremultipliedLayer({alpha,premultiplied:premultiplied(alpha,F)},pr,pt,width,height,undefined,quantized);}

export function stretchMask(warped,ops){
  const {width,height}=warped.alpha,mx=warped.mapX,my=warped.mapY,inside=warped.inside,J=image(width,height,1);
  const gradient=(data,x,y,axis)=>{const p=axis===0?y:x,n=axis===0?height:width,step=axis===0?width:1,i=y*width+x;if(p===0)return f(data[i+step]-data[i]);if(p===n-1)return f(data[i]-data[i-step]);return f(f(data[i+step]-data[i-step])/2);};
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){const dxX=gradient(mx,x,y,1),dyY=gradient(my,x,y,0),dyX=gradient(mx,x,y,0),dxY=gradient(my,x,y,1);J.data[y*width+x]=f(f(dxX*dyY)-f(dyX*dxY));}
  const median=ops.median(J,5),values=[];for(let i=0;i<inside.length;i++)if(inside[i])values.push(median.data[i]);const center=values.length?percentile(values,50):1;
  const mask=scalar(width,height,i=>inside[i]&&median.data[i]/Math.max(center,1e-6)>.2&&median.data[i]/Math.max(center,1e-6)<5?1:0);
  return ops.gaussian(ops.erode(mask,2),2);
}

/** Exact default transfer rules, using actual parsed masks on both people. */
export function transferLayer({layer,referenceBare,referencePhoto,source,referencePoints,sourcePoints,referenceParsing,sourceParsing,ops,debug=false}){
  // Native main warp packs alpha + RGB-premultiplied + LE (five channels).
  // OpenCV 5 uses its legacy 1/32-pixel table for this channel count. Raw A/K,
  // lips and brows use C4/C1 exact floating remap, so only this call quantizes.
  const {F,weights}=layer,{alpha:a}=cleanReferenceAlpha(layer,referenceBare,referencePhoto,referencePoints,referenceParsing,ops),pr=extendLandmarks(referencePoints,referenceBare.width,referenceBare.height),pt=extendLandmarks(sourcePoints,source.width,source.height),nonLip=scalar(a.width,a.height,i=>a.data[i]*f(1-weights[0].data[i])),placed=warp(nonLip,F,pr,pt,source.width,source.height,true),stretch=stretchMask(placed,ops),a2=placed.alpha,P2=placed.premultiplied;
  for(let i=0;i<a2.data.length;i++){a2.data[i]*=stretch.data[i];for(let c=0;c<3;c++)P2.data[3*i+c]*=stretch.data[i];}
  const diagnostics=debug?{main_a:a2.data.slice(),stretch:stretch.data.slice()}:null;
  const referenceLip=factor(a,weights[0]),lipPlaced=warp(referenceLip,F,LIP_PTS.map(i=>pr[i]),LIP_PTS.map(i=>pt[i]),source.width,source.height),tc=targetContext(source,sourcePoints,sourceParsing,ops),al=lipPlaced.alpha,Pl=lipPlaced.premultiplied;
  let lipSum=0;const pigment=[0,0,0];for(let i=0;i<a.data.length;i++){lipSum+=referenceLip.data[i];for(let c=0;c<3;c++)pigment[c]+=F.data[3*i+c]*referenceLip.data[i];}
  if(lipSum>50){for(let c=0;c<3;c++)pigment[c]/=lipSum;const values=selected(a.data,weights[0].data,.5),coverage=values.length?percentile(values,60):0;for(let i=0;i<al.data.length;i++){al.data[i]=coverage;for(let c=0;c<3;c++)Pl.data[3*i+c]=coverage*clip(pigment[c]*tc.shade.data[i]);}}
  for(let i=0;i<al.data.length;i++){al.data[i]*=tc.lip.data[i];for(let c=0;c<3;c++){Pl.data[3*i+c]*=tc.lip.data[i];P2.data[3*i+c]=f(Pl.data[3*i+c]+f(f(1-al.data[i])*P2.data[3*i+c]));}a2.data[i]=f(al.data[i]+f(f(1-al.data[i])*a2.data[i]));}
  if(debug)diagnostics.lip_a=a2.data.slice();
  const browWeight=scalar(a.width,a.height,i=>weights[2].data[i]*f(1-clip((a.data[i]-.85)/.1))),referenceBrow=factor(a,browWeight),zero=image(a.width,a.height,3),targetBrow=warpPremultipliedLayer({alpha:browWeight,premultiplied:zero},pr,pt,source.width,source.height).alpha;
  for(let i=0;i<a2.data.length;i++){a2.data[i]*=f(1-targetBrow.data[i]);for(let c=0;c<3;c++)P2.data[3*i+c]*=f(1-targetBrow.data[i]);}
  let browSum=0;const browPigment=[0,0,0];for(let i=0;i<a.data.length;i++){browSum+=referenceBrow.data[i];for(let c=0;c<3;c++)browPigment[c]+=F.data[3*i+c]*referenceBrow.data[i];}
  if(browSum>50){for(let c=0;c<3;c++)browPigment[c]/=browSum;const values=selected(a.data,browWeight.data,.5),coverage=values.length?percentile(values,75):0;
    for(let i=0;i<a2.data.length;i++){const tint=f(f(coverage*tc.brow.data[i])*tc.strand.data[i]),rest=f(1-a2.data[i]);for(let c=0;c<3;c++)P2.data[3*i+c]+=f(f(rest*tint)*clip(browPigment[c]*tc.browFactor.data[i]));a2.data[i]+=f(rest*tint);}
  }
  if(debug)diagnostics.brow_a=a2.data.slice();
  const foreground=image(source.width,source.height,3),visible=image(source.width,source.height,1),C=image(source.width,source.height,3);
  for(let i=0;i<a2.data.length;i++){for(let c=0;c<3;c++)foreground.data[3*i+c]=P2.data[3*i+c]/Math.max(a2.data[i],1e-4);a2.data[i]*=tc.support.data[i];visible.data[i]=a2.data[i]*f(1-tc.hair.data[i]);for(let c=0;c<3;c++)C.data[3*i+c]=f(f(visible.data[i]*foreground.data[3*i+c])+f(f(1-visible.data[i])*source.data[3*i+c]));}
  return{alpha:a2,F:foreground,visible,C,hair:tc.hair,diagnostics};
}

/** Source/reference images in full original frames; refLayer is actual Stage I
 * output restored by restoreReferenceFrame. Cropping does not select a cached
 * render: every condition below is rebuilt before the genuine Stage II call.
 */
export function preparePair({source,sourcePoints,sourceParsing,referencePhoto,referenceLayer,referencePoints,referenceParsing,referenceCropPoints=null,selection=null,ops}){
  let layer=referenceLayer;
  if(!layer.weights){
    if(!referenceCropPoints||!layer.box)throw new Error('Actual generated B512 landmarks / part weights are required');
    layer={...layer,weights:restoreReferenceWeights(ruleParts(referenceCropPoints,ops),layer.box,referencePhoto.width,referencePhoto.height)};
  }
  if(selection)layer=selectReferenceLayer(layer,selection);
  const sourceCond=sourceConditions(source,sourcePoints,sourceParsing,ops),crops=referenceCrops(layer,referencePoints,referenceParsing,ops,layer.weights),placed=transferLayer({layer,referenceBare:layer.bare,referencePhoto,source,referencePoints,sourcePoints,referenceParsing,sourceParsing,ops}),raw=warpPremultipliedLayer({alpha:layer.alpha,premultiplied:premultiplied(layer.alpha,layer.F)},extendLandmarks(referencePoints,referencePhoto.width,referencePhoto.height),extendLandmarks(sourcePoints,source.width,source.height),source.width,source.height);
  return assembleStageII({source,C:placed.C,A:raw.alpha,K:raw.premultiplied,visible:placed.visible,sourceConditions:sourceCond,crops,protection:sourceCond.protection});
}
