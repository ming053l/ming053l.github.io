/* Actual IrisMix FLUX.2 transformer inference.
 * Copyright 2026 Chia-Ming Lee. Original code: all rights reserved.
 * Third-party architecture/model notices are preserved in MODELS.md.
 * Independent WGSL implementation. No image warping, effect filter, or cached
 * output is used here. Learned matrices are streamed one block at a time.
 * Attention queries are chunked; every query still attends to every key.
 */
import {fetchModelBytes as fetchBytes} from './model-cache.mjs';
const RW = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;
const PREFIX = (bindings) => bindings.map((mode, i) => `@group(0) @binding(${i}) var<storage, ${mode}> b${i}: array<${mode === 'read-u32' ? 'u32' : 'f32'}>;`.replace('read-u32', 'read')).join('\n');

export class GPUOps {
  constructor(device) { this.device = device; this.pipelines = new Map(); }
  static async create() {
    if (!navigator.gpu) throw new Error('此瀏覽器未提供 WebGPU。');
    const adapter = await navigator.gpu.requestAdapter({powerPreference: 'high-performance'});
    if (!adapter) throw new Error('無法取得 WebGPU 顯示卡。');
    const device = await adapter.requestDevice({requiredLimits: {
      maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
      maxBufferSize: adapter.limits.maxBufferSize,
      maxStorageBuffersPerShaderStage: 8,
    }});
    device.lost.then(info => { if(info.reason !== 'destroyed') console.error('WebGPU device lost', info); });
    const ops = new GPUOps(device); ops.adapter = adapter; return ops;
  }
  alloc(bytes, label='tensor') {
    if (!bytes || bytes > this.device.limits.maxStorageBufferBindingSize) throw new Error(`Buffer ${label} requires ${bytes} bytes; supported binding limit is ${this.device.limits.maxStorageBufferBindingSize}.`);
    return this.device.createBuffer({size: Math.ceil(bytes/4)*4, usage: RW, label});
  }
  upload(data,label) {
    const a = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
    const b = this.alloc(a.byteLength,label); this.device.queue.writeBuffer(b,0,a); return b;
  }
  async read(buffer, length=buffer.size/4) {
    const out = this.device.createBuffer({size:length*4, usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});
    const enc = this.device.createCommandEncoder(); enc.copyBufferToBuffer(buffer,0,out,0,length*4); this.device.queue.submit([enc.finish()]);
    await out.mapAsync(GPUMapMode.READ);const data=new Float32Array(out.getMappedRange()).slice();out.unmap();out.destroy();return data;
  }
  async run(code,buffers,dispatch,label='kernel') {
    let pipeline = this.pipelines.get(code);
    if (!pipeline) {
      const module = this.device.createShaderModule({code,label});
      const errors = (await module.getCompilationInfo()).messages.filter(m=>m.type==='error');
      if (errors.length) throw new Error(label+': '+errors.map(e=>e.message+' @'+e.lineNum).join('\n'));
      pipeline = await this.device.createComputePipelineAsync({layout:'auto',compute:{module,entryPoint:'main'},label});
      this.pipelines.set(code,pipeline);
    }
    const bg=this.device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:buffers.map((buffer,binding)=>({binding,resource:{buffer}}))});
    const encoder=this.device.createCommandEncoder();const pass=encoder.beginComputePass();pass.setPipeline(pipeline);pass.setBindGroup(0,bg);pass.dispatchWorkgroups(...dispatch);pass.end();
    this.device.queue.submit([encoder.finish()]);await this.device.queue.onSubmittedWorkDone();
  }
  async copy(buffer,offsetBytes,lengthBytes) {
    const out=this.alloc(lengthBytes);const enc=this.device.createCommandEncoder();enc.copyBufferToBuffer(buffer,offsetBytes,out,0,lengthBytes);this.device.queue.submit([enc.finish()]);await this.device.queue.onSubmittedWorkDone();return out;
  }
  async concatRows(buffers) {
    const out=this.alloc(buffers.reduce((n,b)=>n+b.size,0));const enc=this.device.createCommandEncoder();let offset=0;
    for(const b of buffers){enc.copyBufferToBuffer(b,0,out,offset,b.size);offset+=b.size;}
    this.device.queue.submit([enc.finish()]);await this.device.queue.onSubmittedWorkDone();return out;
  }
  async concatColumns(a,b,M,A,B) {
    const out=this.alloc(M*(A+B)*4);await this.run(PREFIX(['read','read','read_write'])+`
    @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid:vec3<u32>){let i=gid.x;if(i>=${M*(A+B)}u){return;}let row=i/${A+B}u;let col=i%${A+B}u;if(col<${A}u){b2[i]=b0[row*${A}u+col];}else{b2[i]=b1[row*${B}u+col-${A}u];}}`,[a,b,out],[Math.ceil(M*(A+B)/256)],'concat-columns');return out;
  }
  async matmul(x,M,K,N,w,rowOffset=0) {
    const out=this.alloc(M*N*4,'matmul output');const quant=w.kind==='q4';
    const bindings=quant?['read','read-u32','read','read_write']:['read','read','read_write'];
    const output=quant?'b3':'b2';
    const loadWeight=quant?`let packed=b1[wc*${K/8}u+wk/8u];let qi=i32((packed>>((wk%8u)*4u))&15u)-8;bv=f32(qi)*b2[wc*${K/32}u+wk/32u];`:`bv=b1[wc*${K}u+wk];`;
    const code=PREFIX(bindings)+`
    var<workgroup> aa:array<f32,512>;var<workgroup> bb:array<f32,512>;
    @compute @workgroup_size(16,16) fn main(@builtin(workgroup_id) group:vec3<u32>,@builtin(local_invocation_id) lid:vec3<u32>){
      let row=group.y*16u+lid.y;let col=group.x*16u+lid.x;let li=lid.y*16u+lid.x;var acc=0.0;
      for(var base=0u;base<${K}u;base+=32u){
        for(var tileHalf=0u;tileHalf<2u;tileHalf++){let ix=li+tileHalf*256u;let ar=group.y*16u+ix/32u;let ak=base+ix%32u;var av=0.0;if(ar<${M}u&&ak<${K}u){av=b0[ar*${K}u+ak];}aa[ix]=av;
          let wk=base+ix/16u;let wc=group.x*16u+ix%16u+${rowOffset}u;var bv=0.0;if(wc<${N+rowOffset}u&&wk<${K}u){${loadWeight}}bb[ix]=bv;}
        workgroupBarrier();for(var kk=0u;kk<32u;kk++){acc=fma(aa[lid.y*32u+kk],bb[kk*16u+lid.x],acc);}workgroupBarrier();
      }if(row<${M}u&&col<${N}u){${output}[row*${N}u+col]=acc;}
    }`;
    await this.run(code,quant?[x,w.q,w.scales,out]:[x,w.data,out],[Math.ceil(N/16),Math.ceil(M/16)],'tiled-matmul');
    if(w.lora){
      // Shared-base format: preserve the learned adapter in FP32. A is [rank,K]
      // and B is [fullN,rank]; B's row slice follows the fused base projection.
      const low=await this.matmul(x,M,K,w.lora.rank,{kind:'f32',data:w.lora.A});
      const delta=await this.matmul(low,M,w.lora.rank,N,{kind:'f32',data:w.lora.B},rowOffset);low.destroy();
      await this.addScaled(out,delta,M*N,w.lora.scale);delta.destroy();
    }
    return out;
  }
  async addScaled(x,delta,length,scale=1) {
    const groups=Math.ceil(length/256);await this.run(PREFIX(['read_write','read'])+`
      @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid:vec3<u32>){let i=gid.x+gid.y*16776960u;if(i<${length}u){b0[i]+=b1[i]*${Number(scale).toExponential(9)};}}
    `,[x,delta],[Math.min(groups,65535),Math.ceil(groups/65535)],'add-scaled');
  }
  async normMod(x,rows,cols,mod,shiftOffset,scaleOffset) {
    const out=this.alloc(rows*cols*4);await this.run(PREFIX(['read','read','read_write'])+`
      var<workgroup> scratch:array<f32,256>;var<workgroup> mean:f32;var<workgroup> inv:f32;
      @compute @workgroup_size(256) fn main(@builtin(workgroup_id) group:vec3<u32>,@builtin(local_invocation_index) li:u32){let row=group.x;var sum=0.0;for(var c=li;c<${cols}u;c+=256u){sum+=b0[row*${cols}u+c];}scratch[li]=sum;workgroupBarrier();
      for(var s=128u;s>0u;s/=2u){if(li<s){scratch[li]+=scratch[li+s];}workgroupBarrier();}if(li==0u){mean=scratch[0]/${cols}.0;}workgroupBarrier();
      var sq=0.0;for(var c=li;c<${cols}u;c+=256u){let v=b0[row*${cols}u+c]-mean;sq+=v*v;}scratch[li]=sq;workgroupBarrier();for(var s=128u;s>0u;s/=2u){if(li<s){scratch[li]+=scratch[li+s];}workgroupBarrier();}if(li==0u){inv=inverseSqrt(scratch[0]/${cols}.0+0.000001);}workgroupBarrier();
      for(var c=li;c<${cols}u;c+=256u){b2[row*${cols}u+c]=(b0[row*${cols}u+c]-mean)*inv*(1.0+b1[${scaleOffset}u+c])+b1[${shiftOffset}u+c];}}
    `,[x,mod,out],[rows],'layernorm-modulation');return out;
  }
  async addGate(x,delta,rows,cols,mod,gateOffset,rowOffset=0) {
    await this.run(PREFIX(['read_write','read','read'])+`
      @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid:vec3<u32>){let i=gid.x+gid.y*16776960u;if(i<${rows*cols}u){b0[${rowOffset*cols}u+i]+=b1[i]*b2[${gateOffset}u+i%${cols}u];}}
    `,[x,delta,mod],[Math.min(65535,Math.ceil(rows*cols/256)),Math.ceil(rows*cols/256/65535)],'gated-residual');
  }
  async swiglu(x,rows,width) {
    const out=this.alloc(rows*width*4);await this.run(PREFIX(['read','read_write'])+`
      @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid:vec3<u32>){let i=gid.x;if(i<${rows*width}u){let row=i/${width}u;let c=i%${width}u;let a=b0[row*${2*width}u+c];b1[i]=(a/(1.0+exp(-a)))*b0[row*${2*width}u+c+${width}u];}}
    `,[x,out],[Math.ceil(rows*width/256)],'swiglu');return out;
  }
  async qkNormRoPE(x,rows,weight,rope,ropeOffset=0) {
    const heads=24,dim=128;const out=this.alloc(rows*heads*dim*4);
    const groups=rows*heads;await this.run(PREFIX(['read','read','read','read','read_write'])+`
      var<workgroup> vals:array<f32,128>;var<workgroup> sum:array<f32,128>;
      @compute @workgroup_size(128) fn main(@builtin(workgroup_id) group:vec3<u32>,@builtin(local_invocation_index) d:u32){let id=group.x+group.y*65535u;if(id>=${groups}u){return;}let row=id/24u;let v=b0[id*128u+d];vals[d]=v;sum[d]=v*v;workgroupBarrier();for(var s=64u;s>0u;s/=2u){if(d<s){sum[d]+=sum[d+s];}workgroupBarrier();}let iv=inverseSqrt(sum[0]/128.0+0.000001);let n=vals[d]*iv*b1[d];let other=select(d+1u,d-1u,d%2u==1u);let rotated=select(-vals[other],vals[other],d%2u==1u)*iv*b1[other];let ri=(row+${ropeOffset}u)*128u+d;b4[id*128u+d]=n*b2[ri]+rotated*b3[ri];}
    `,[x,weight,rope.cos,rope.sin,out],[Math.min(groups,65535),Math.ceil(groups/65535)],'qk-rmsnorm-rope');return out;
  }
  async attention(q,k,v,rows,onProgress) {
    const heads=24,dim=128,chunk=128,s=gpuScope();const out=s.own(this.alloc(rows*heads*dim*4,'attention'));
    try{for(let offset=0;offset<rows;offset+=chunk){const count=Math.min(chunk,rows-offset);const scores=s.own(this.alloc(heads*count*rows*4,'attention scores'));
      await this.run(PREFIX(['read','read','read_write'])+`
        var<workgroup> aa:array<f32,512>;var<workgroup> bb:array<f32,512>;
        @compute @workgroup_size(16,16) fn main(@builtin(workgroup_id) g:vec3<u32>,@builtin(local_invocation_id) l:vec3<u32>){let qr=g.y*16u+l.y;let kr=g.x*16u+l.x;let head=g.z;let li=l.y*16u+l.x;var acc=0.0;
        for(var base=0u;base<128u;base+=32u){for(var tileHalf=0u;tileHalf<2u;tileHalf++){let ix=li+tileHalf*256u;let ar=g.y*16u+ix/32u;let d=base+ix%32u;var av=0.0;if(ar<${count}u){av=b0[((${offset}u+ar)*24u+head)*128u+d];}aa[ix]=av;let key=g.x*16u+ix%16u;var bv=0.0;if(key<${rows}u){bv=b1[(key*24u+head)*128u+base+ix/16u];}bb[ix]=bv;}workgroupBarrier();for(var d=0u;d<32u;d++){acc=fma(aa[l.y*32u+d],bb[d*16u+l.x],acc);}workgroupBarrier();}if(qr<${count}u&&kr<${rows}u){b2[(head*${count}u+qr)*${rows}u+kr]=acc*0.08838834764831845;}}
      `,[q,k,scores],[Math.ceil(rows/16),Math.ceil(count/16),heads],'attention-qk');
      await this.run(PREFIX(['read_write'])+`
        var<workgroup> scratch:array<f32,256>;var<workgroup> mx:f32;var<workgroup> denom:f32;
        @compute @workgroup_size(256) fn main(@builtin(workgroup_id) g:vec3<u32>,@builtin(local_invocation_index) li:u32){let base=g.x*${rows}u;var m=-3.402823466e+38;for(var c=li;c<${rows}u;c+=256u){m=max(m,b0[base+c]);}scratch[li]=m;workgroupBarrier();for(var s=128u;s>0u;s/=2u){if(li<s){scratch[li]=max(scratch[li],scratch[li+s]);}workgroupBarrier();}if(li==0u){mx=scratch[0];}workgroupBarrier();var sum=0.0;for(var c=li;c<${rows}u;c+=256u){sum+=exp(b0[base+c]-mx);}scratch[li]=sum;workgroupBarrier();for(var s=128u;s>0u;s/=2u){if(li<s){scratch[li]+=scratch[li+s];}workgroupBarrier();}if(li==0u){denom=scratch[0];}workgroupBarrier();for(var c=li;c<${rows}u;c+=256u){b0[base+c]=exp(b0[base+c]-mx)/denom;}}
      `,[scores],[heads*count],'attention-softmax');
      await this.run(PREFIX(['read','read','read_write'])+`
        var<workgroup> aa:array<f32,512>;var<workgroup> bb:array<f32,512>;
        @compute @workgroup_size(16,16) fn main(@builtin(workgroup_id) g:vec3<u32>,@builtin(local_invocation_id) l:vec3<u32>){let qr=g.y*16u+l.y;let d=g.x*16u+l.x;let head=g.z;let li=l.y*16u+l.x;var acc=0.0;
        for(var base=0u;base<${rows}u;base+=32u){for(var tileHalf=0u;tileHalf<2u;tileHalf++){let ix=li+tileHalf*256u;let ar=g.y*16u+ix/32u;let key=base+ix%32u;var av=0.0;if(ar<${count}u&&key<${rows}u){av=b0[(head*${count}u+ar)*${rows}u+key];}aa[ix]=av;let vk=base+ix/16u;let vd=g.x*16u+ix%16u;var bv=0.0;if(vk<${rows}u&&vd<128u){bv=b1[(vk*24u+head)*128u+vd];}bb[ix]=bv;}workgroupBarrier();for(var j=0u;j<32u;j++){acc=fma(aa[l.y*32u+j],bb[j*16u+l.x],acc);}workgroupBarrier();}if(qr<${count}u&&d<128u){b2[((${offset}u+qr)*24u+head)*128u+d]=acc;}}
      `,[scores,v,out],[8,Math.ceil(count/16),heads],'attention-av');s.drop(scores);
      if(onProgress)onProgress((offset+count)/rows);
    }return s.detach(out);}finally{s.clear();}
  }
}

const free=(...bs)=>bs.flat().forEach(b=>b?.destroy());
function gpuScope(){const buffers=new Set();return{own(buffer){buffers.add(buffer);return buffer;},detach(buffer){buffers.delete(buffer);return buffer;},drop(...values){for(const b of values.flat())if(b&&buffers.delete(b))b.destroy();},clear(){for(const b of buffers)b.destroy();buffers.clear();}};}
export class IrisMixTransformer {
  constructor(ops,manifest,baseURL,{onProgress=()=>{},signal}={}){this.ops=ops;this.manifest=manifest;this.baseURL=baseURL;this.onProgress=onProgress;this.signal=signal;this.constants={};}
  static async create(manifestURL,options={}){
    const absolute=new URL(manifestURL,location.href);const r=await fetch(absolute,{signal:options.signal});if(!r.ok)throw new Error(`模型清單下載失敗 (${r.status})`);const manifest=await r.json();if(manifest.format!=='irismix-webgpu-transformer-v1')throw new Error('不支援的模型格式。');
    const ops=options.ops||await GPUOps.create();const self=new IrisMixTransformer(ops,manifest,new URL('.',absolute),options);
    try{for(const[key,t]of Object.entries(manifest.constants)){self.check();self.constants[key]=ops.upload(await fetchBytes(new URL(t.file,self.baseURL),t,options.signal),key);}self.check();return self;}
    catch(error){self.dispose();if(!options.ops)ops.device?.destroy();throw error;}
  }
  check(){if(this.signal?.aborted)throw new DOMException('已取消推論','AbortError');}
  async load(keys){const out={};try{for(const key of keys){this.check();const t=this.manifest.tensors[key];if(!t)throw new Error(`Missing model tensor ${key}`);const weight=out[key]={kind:t.kind,shape:t.shape};
      if(t.kind==='q4'){weight.q=this.ops.upload(await fetchBytes(new URL(t.q.file,this.baseURL),t.q,this.signal),key);weight.scales=this.ops.upload(await fetchBytes(new URL(t.scales.file,this.baseURL),t.scales,this.signal),key+' scales');}
      else weight.data=this.ops.upload(await fetchBytes(new URL(t.file,this.baseURL),t,this.signal),key);
      if(t.lora){const l=weight.lora={rank:t.lora.rank,scale:t.lora.scale??1};l.A=this.ops.upload(await fetchBytes(new URL(t.lora.A.file,this.baseURL),t.lora.A,this.signal),key+' LoRA A');l.B=this.ops.upload(await fetchBytes(new URL(t.lora.B.file,this.baseURL),t.lora.B,this.signal),key+' LoRA B');}
    }return out;}catch(e){this.release(out);throw e;}}
  release(weights){for(const t of Object.values(weights))free(t.q,t.scales,t.data,t.lora?.A,t.lora?.B);}
  rope(txtIds,imgIds){const ids=new Float32Array(txtIds.length+imgIds.length);ids.set(txtIds);ids.set(imgIds,txtIds.length);const n=ids.length/4;const cos=new Float32Array(n*128),sin=new Float32Array(n*128);for(let r=0;r<n;r++)for(let axis=0;axis<4;axis++)for(let j=0;j<16;j++){const angle=ids[r*4+axis]*Math.pow(2000,-j/16),at=r*128+axis*32+j*2;cos[at]=cos[at+1]=Math.cos(angle);sin[at]=sin[at+1]=Math.sin(angle);}return{cos:this.ops.upload(cos),sin:this.ops.upload(sin)};}
  async feedForward(x,rows,prefix,weights,mod,shiftOffset,scaleOffset,gateOffset){const o=this.ops,s=gpuScope(),own=s.own;try{const norm=own(await o.normMod(x,rows,3072,mod,shiftOffset,scaleOffset));for(let at=0;at<rows;at+=512){this.check();const n=Math.min(512,rows-at),part=own(await o.copy(norm,at*3072*4,n*3072*4));const wide=own(await o.matmul(part,n,3072,18432,weights[prefix+'.linear_in.weight']));s.drop(part);const act=own(await o.swiglu(wide,n,9216));s.drop(wide);const delta=own(await o.matmul(act,n,9216,3072,weights[prefix+'.linear_out.weight']));s.drop(act);await o.addGate(x,delta,n,3072,mod,gateOffset,at);s.drop(delta);}}finally{s.clear();}}
  async dual(x,context,ni,nt,index,rope){const o=this.ops,p=`transformer_blocks.${index}`,get=s=>p+'.'+s;const keys=Object.keys(this.manifest.tensors).filter(k=>k.startsWith(p+'.'));const w=await this.load(keys);const modI=this.constants.mod_img,modT=this.constants.mod_txt,s=gpuScope(),own=s.own;
    try{
      const xn=own(await o.normMod(x,ni,3072,modI,0,3072)),cn=own(await o.normMod(context,nt,3072,modT,0,3072));
      const q=[],k=[],v=[];
      for(const [norm,rows,isText,offset]of [[cn,nt,true,0],[xn,ni,false,nt]]){
        const a=isText?'add_':'';const q0=own(await o.matmul(norm,rows,3072,3072,w[get('attn.'+a+'q_proj.weight').replace('attn.q_proj','attn.to_q')]));
        const k0=own(await o.matmul(norm,rows,3072,3072,w[get('attn.'+a+'k_proj.weight').replace('attn.k_proj','attn.to_k')]));
        const v0=own(await o.matmul(norm,rows,3072,3072,w[get('attn.'+a+'v_proj.weight').replace('attn.v_proj','attn.to_v')]));
        q.push(own(await o.qkNormRoPE(q0,rows,w[get(isText?'attn.norm_added_q.weight':'attn.norm_q.weight')].data,rope,offset)));
        k.push(own(await o.qkNormRoPE(k0,rows,w[get(isText?'attn.norm_added_k.weight':'attn.norm_k.weight')].data,rope,offset)));v.push(v0);s.drop(q0,k0);
      }s.drop(xn,cn);
      const qq=own(await o.concatRows(q)),kk=own(await o.concatRows(k)),vv=own(await o.concatRows(v));s.drop(q,k,v);
      const attention=own(await o.attention(qq,kk,vv,ni+nt,f=>{this.check();this.onProgress({stage:'attention',block:index+1,total:25,fraction:f});}));s.drop(qq,kk,vv);
      const ai=own(await o.copy(attention,nt*3072*4,ni*3072*4)),ac=own(await o.copy(attention,0,nt*3072*4));s.drop(attention);
      const di=own(await o.matmul(ai,ni,3072,3072,w[get('attn.to_out.0.weight')]));s.drop(ai);await o.addGate(x,di,ni,3072,modI,6144);s.drop(di);
      const dc=own(await o.matmul(ac,nt,3072,3072,w[get('attn.to_add_out.weight')]));s.drop(ac);await o.addGate(context,dc,nt,3072,modT,6144);s.drop(dc);
      await this.feedForward(x,ni,get('ff'),w,modI,9216,12288,15360);await this.feedForward(context,nt,get('ff_context'),w,modT,9216,12288,15360);
      return{x,context};
    }finally{s.clear();this.release(w);}
  }
  async single(x,rows,index,rope){const o=this.ops,p=`single_transformer_blocks.${index}`,mod=this.constants.mod_single;const w=await this.load(Object.keys(this.manifest.tensors).filter(k=>k.startsWith(p+'.'))),s=gpuScope(),own=s.own;
    try{const norm=own(await o.normMod(x,rows,3072,mod,0,3072)),linear=w[p+'.attn.to_qkv_mlp_proj.weight'];const q0=own(await o.matmul(norm,rows,3072,3072,linear,0)),k0=own(await o.matmul(norm,rows,3072,3072,linear,3072)),v=own(await o.matmul(norm,rows,3072,3072,linear,6144));
      const q=own(await o.qkNormRoPE(q0,rows,w[p+'.attn.norm_q.weight'].data,rope)),k=own(await o.qkNormRoPE(k0,rows,w[p+'.attn.norm_k.weight'].data,rope));s.drop(q0,k0);
      const attn=own(await o.attention(q,k,v,rows,f=>{this.check();this.onProgress({stage:'attention',block:index+6,total:25,fraction:f});}));s.drop(q,k,v);
      for(let at=0;at<rows;at+=512){this.check();const n=Math.min(512,rows-at);const part=own(await o.copy(norm,at*3072*4,n*3072*4));const wide=own(await o.matmul(part,n,3072,18432,linear,9216));s.drop(part);const mlp=own(await o.swiglu(wide,n,9216));s.drop(wide);const ap=own(await o.copy(attn,at*3072*4,n*3072*4));const joint=own(await o.concatColumns(ap,mlp,n,3072,9216));s.drop(ap,mlp);const delta=own(await o.matmul(joint,n,12288,3072,w[p+'.attn.to_out.weight']));s.drop(joint);await o.addGate(x,delta,n,3072,mod,6144,at);s.drop(delta);}
      return x;
    }finally{s.clear();this.release(w);}
  }
  /** image=[target x_sigma | C K A S1 S2 S3 G1 G2 lip eyeL eyeR], all packed. */
  async run({image,pe,imgIds,txtIds,targetTokens=1024,onBlock}){
    const o=this.ops,ni=image.length/128,nt=pe.length/7680;this.check();if(!Number.isInteger(ni)||!Number.isInteger(nt))throw new Error('Invalid tensor shapes.');
    const s=gpuScope(),own=s.own;let rope,x,context,joined,pre,post;
    try{
      rope=this.rope(txtIds,imgIds);own(rope.cos);own(rope.sin);pre=await this.load(['x_embedder.weight','context_embedder.weight']);
      const a=own(o.upload(image)),b=own(o.upload(pe));x=own(await o.matmul(a,ni,128,3072,pre['x_embedder.weight']));context=own(await o.matmul(b,nt,7680,3072,pre['context_embedder.weight']));s.drop(a,b);this.release(pre);pre=null;
      for(let i=0;i<5;i++){this.check();this.onProgress({stage:'block',block:i+1,total:25});({x,context}=await this.dual(x,context,ni,nt,i,rope));if(onBlock)await onBlock({index:i,image:x,context,ops:o});}
      joined=own(await o.concatRows([context,x]));s.drop(context,x);context=x=null;
      for(let i=0;i<20;i++){this.check();this.onProgress({stage:'block',block:i+6,total:25});joined=await this.single(joined,ni+nt,i,rope);if(onBlock)await onBlock({index:i+5,joined,ops:o});}
      const target=own(await o.copy(joined,nt*3072*4,targetTokens*3072*4));s.drop(joined);joined=null;const norm=own(await o.normMod(target,targetTokens,3072,this.constants.mod_out,3072,0));s.drop(target);post=await this.load(['proj_out.weight']);
      const output=own(await o.matmul(norm,targetTokens,3072,128,post['proj_out.weight']));s.drop(norm);this.release(post);post=null;const result=await o.read(output);s.drop(output);this.onProgress({stage:'complete',block:25,total:25});return result;
    }finally{s.clear();if(pre)this.release(pre);if(post)this.release(post);}
  }
  dispose(){free(Object.values(this.constants));this.constants={};}
}
