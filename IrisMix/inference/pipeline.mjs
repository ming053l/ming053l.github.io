import {packLatents,unpackLatents} from './vae.mjs';
const ALIGNED=['C','K','A'],SMALL=['S1','S2','S3','G1','G2','lip','eyeL','eyeR'];
/** Full learned Stage II execution. Conditions must come from actual prep. */
export class IrisMixStageII {
 constructor({vae,transformer,onProgress=()=>{}}){Object.assign(this,{vae,transformer,onProgress});}
 async run({conditions,pe,imgIds,txtIds,noise,sigma=.65,signal}){
  if(Math.abs(sigma-this.transformer.manifest.timestep)>1e-6)throw Error('Transformer modulation does not match sampler timestep');
  const check=()=>{if(signal?.aborted)throw new DOMException('已取消','AbortError');};
  const encoded=[],sizeFor=k=>ALIGNED.includes(k)?512:256,owned=new Set();let features;
  try{
   for(const [index,key]of [...ALIGNED,...SMALL].entries()){
    check();this.onProgress({stage:'encode',index:index+1,total:11,name:key});
    const size=sizeFor(key),out=await this.vae.encode(conditions[key],size,{features:key==='C'});
    for(const tensor of Object.values(out))owned.add(tensor);check();
    const z=await out.latents.getData();check();encoded.push(packLatents(z,size/16,size/16));
    if(key==='C'){
     features={f0:out.f0,f1:out.f1,f2:out.f2};
     // Materialize the learned skips on CPU before releasing encoder resources.
     for(const tensor of Object.values(features)){await tensor.getData(true);check();}
    }
    owned.delete(out.latents);out.latents.dispose?.();
    if(key==='A')await this.vae.releaseSession?.('encoder512');
    if(key==='eyeR')await this.vae.releaseSession?.('encoder256');
   }
   if(noise.length!==128*32*32)throw Error('Invalid target noise');
   const packedNoise=packLatents(noise,32,32),x=new Float32Array(packedNoise.length);
   for(let i=0;i<x.length;i++)x[i]=Math.fround((1-sigma)*encoded[0][i]+sigma*packedNoise[i]);
   const image=new Float32Array(x.length+encoded.reduce((n,a)=>n+a.length,0));image.set(x);let offset=x.length;
   for(const z of encoded){image.set(z,offset);offset+=z.length;}
   check();this.onProgress({stage:'transformer'});const velocity=await this.transformer.run({image,pe,imgIds,txtIds,targetTokens:1024});
   const x0=new Float32Array(x.length);for(let i=0;i<x.length;i++)x0[i]=x[i]-sigma*velocity[i];
   check();this.onProgress({stage:'decode'});const output=await this.vae.decode(unpackLatents(x0,32,32),features);owned.add(output);check();
   const data=(await output.getData()).slice();check();
   this.onProgress({stage:'complete'});return{image:data,width:512,height:512,velocity,x0};
  }finally{
   for(const tensor of owned)tensor.dispose?.();
   await Promise.all(['encoder512','encoder256','decoder_stage2'].map(key=>this.vae.releaseSession?.(key)));
  }
 }
}
export async function loadFixture(url){
 const base=new URL(url,location.href),r=await fetch(base);if(!r.ok)throw Error('Native validation fixture missing');
 const manifest=await r.json(),tensors={};for(const[name,spec]of Object.entries(manifest.tensors)){const response=await fetch(new URL(spec.file,base));if(!response.ok)throw Error('Missing fixture '+name);tensors[name]=new Float32Array(await response.arrayBuffer());}
 return{manifest,tensors};
}
export function showCHW(canvas,data,width,height){canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d'),out=ctx.createImageData(width,height);for(let i=0;i<width*height;i++){for(let c=0;c<3;c++)out.data[i*4+c]=(data[c*width*height+i]+1)*127.5;out.data[i*4+3]=255;}ctx.putImageData(out,0,0);}
/** Complete learned Stage I: 512 REF -> 1536-wide B/W/K, not a colour filter. */
export class IrisMixStageI {
 constructor({vae,transformer,onProgress=()=>{}}){Object.assign(this,{vae,transformer,onProgress});}
 async run({reference,pe,txtIds,noise,signal}){
  if(this.transformer.manifest.stage!=='stage1'||this.transformer.manifest.timestep!==1)throw Error('Stage I C2 weights at timestep 1 are required');
  const check=()=>{if(signal?.aborted)throw new DOMException('已取消','AbortError');};check();this.onProgress({stage:'encode-reference'});
  let out;
  try{
   out=await this.vae.encode(reference,512,{features:true});
   check();
   const z=await out.latents.getData(),ctok=packLatents(z,32,32),target=packLatents(noise,32,96),image=new Float32Array(target.length+ctok.length);image.set(target);image.set(ctok,target.length);
   for(const key of ['f0','f1','f2']){await out[key].getData(true);check();}
   out.latents.dispose?.();delete out.latents;
   await this.vae.releaseSession?.('encoder512');check();
   const imgIds=new Float32Array(4096*4);let at=0;for(const[height,width,time]of[[32,96,0],[32,32,10]])for(let y=0;y<height;y++)for(let x=0;x<width;x++){imgIds.set([time,y,x,0],at);at+=4;}
   check();this.onProgress({stage:'decompose'});const velocity=await this.transformer.run({image,pe,imgIds,txtIds,targetTokens:3072});
   const x0=new Float32Array(target.length);for(let i=0;i<target.length;i++)x0[i]=target[i]-velocity[i];
   check();this.onProgress({stage:'decode-layer'});const decoded=await this.vae.decode(unpackLatents(x0,32,96),out,{stage:'stage1'});let canvas;
   try{check();canvas=(await decoded.getData()).slice();check();}finally{decoded.dispose?.();}
   this.onProgress({stage:'complete'});return{canvas,width:1536,height:512,velocity,x0};
  }finally{
   for(const tensor of Object.values(out||{}))tensor.dispose?.();
   await Promise.all(['encoder512','decoder_stage1'].map(key=>this.vae.releaseSession?.(key)));
  }
 }
}
/** Deterministic standard-normal noise; not a saved image or latent prediction. */
export function normalNoise(length,seed=0){let state=(seed>>>0)||0x9e3779b9;const uniform=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return((state>>>0)+.5)/4294967296;};const out=new Float32Array(length);for(let i=0;i<length;i+=2){const r=Math.sqrt(-2*Math.log(uniform())),theta=2*Math.PI*uniform();out[i]=r*Math.cos(theta);if(i+1<length)out[i+1]=r*Math.sin(theta);}return out;}
