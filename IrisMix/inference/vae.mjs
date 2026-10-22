/** Actual exported IrisMix VAE (including learned skips), executed locally by ORT. */
import {fetchModelBytes,mapConcurrent} from './model-cache.mjs';
export class IrisMixVAE {
  static async create(manifestURL,{ort,device,signal,onProgress=()=>{},executionProvider='webgpu'}={}) {
    if(!ort) throw Error('ONNX Runtime WebGPU is required');
    // Keep ORT's backend device separate from the transformer's owned runtime.
    // CPU tensors form the explicit bridge between the two devices.
    const url=new URL(manifestURL,location.href),r=await fetch(url,{signal});if(!r.ok)throw Error('Cannot load VAE manifest');
    const manifest=await r.json();if(manifest.format!=='irismix-vae-v1')throw Error('Wrong VAE export format');
    return new IrisMixVAE(url,manifest,ort,signal,onProgress,executionProvider);
  }
  constructor(url,manifest,ort,signal,onProgress,executionProvider='webgpu'){Object.assign(this,{url,manifest,ort,signal,onProgress,executionProvider});this.sessions=new Map();this.loading=new Map();}
  async session(key){
    const signal=this.signal;
    if(signal?.aborted)throw new DOMException('已取消模型載入','AbortError');
    if(this.sessions.has(key))return this.sessions.get(key);
    if(this.loading.has(key))return this.loading.get(key);
    const model=this.manifest.models[key];if(!model)throw Error(`Missing VAE model: ${key}`);
    const loading=(async()=>{
      this.onProgress(`載入 VAE ${key}`);
      const graph=new Uint8Array(await fetchModelBytes(new URL(model.file,this.url),model,signal));
      const externalData=await mapConcurrent(model.externalData,4,async spec=>({path:spec.path,data:new Uint8Array(await fetchModelBytes(new URL(spec.data,this.url),spec,signal))}));
      const session=await this.ort.InferenceSession.create(graph,{executionProviders:[this.executionProvider],graphOptimizationLevel:'all',externalData});
      if(signal?.aborted){await session.release();throw new DOMException('已取消模型載入','AbortError');}
      this.sessions.set(key,session);return session;
    })();
    this.loading.set(key,loading);try{return await loading;}finally{this.loading.delete(key);}
  }
  async encode(data,size,{features=false}={}) {
    if(data.length!==3*size*size)throw Error('VAE encoder expects CHW Float32 [-1,1]');
    const session=await this.session('encoder'+size),feeds={image:new this.ort.Tensor('float32',data,[1,3,size,size])};
    try{return await session.run(feeds,features?['latents','f0','f1','f2']:['latents']);}
    finally{feeds.image.dispose?.();}
  }
  async decode(latents,features,{stage='stage2'}={}) {
    const session=await this.session('decoder_'+stage),width=stage==='stage1'?96:32;
    const ownsLatents=!(latents instanceof this.ort.Tensor),tensor=ownsLatents?new this.ort.Tensor('float32',latents,[1,128,32,width]):latents;
    try{const out=await session.run({latents:tensor,f0:features.f0,f1:features.f1,f2:features.f2});return out.image;}
    finally{if(ownsLatents)tensor.dispose?.();}
  }
  async releaseSession(key){
    // Default ORT outputs live on CPU. Callers materialize any retained skip
    // features before releasing the encoder, so model weights and its cached
    // intermediates need not survive the transformer or a later decoder.
    if(this.loading.has(key))await this.loading.get(key);
    const session=this.sessions.get(key);if(!session)return;
    this.sessions.delete(key);await session.release();
  }
  async release(){await Promise.allSettled(this.loading.values());const keys=[...this.sessions.keys()];await Promise.all(keys.map(key=>this.releaseSession(key)));}
}
export function packLatents(chw,height,width){const out=new Float32Array(chw.length);for(let y=0;y<height;y++)for(let x=0;x<width;x++)for(let c=0;c<128;c++)out[(y*width+x)*128+c]=chw[c*height*width+y*width+x];return out;}
export function unpackLatents(tokens,height,width){const out=new Float32Array(tokens.length);for(let y=0;y<height;y++)for(let x=0;x<width;x++)for(let c=0;c<128;c++)out[c*height*width+y*width+x]=tokens[(y*width+x)*128+c];return out;}
