import {GPUOps,IrisMixTransformer} from './transformer.mjs';
import {IrisMixVAE} from './vae.mjs';
import {IrisMixStageI,IrisMixStageII,normalNoise} from './pipeline.mjs';
import {createFaceParser} from './browser-prep/parser.mjs';
import {image,rgb8,landmarksPixels,faceBox,cropResize,stageICanvasFromNCHW,restoreReferenceFrame,modelTensor,resize,composeStageIIRender} from './browser-prep/preprocess.mjs';
import {cvOperations,ruleParts} from './browser-prep/source-conditions.mjs';
import {preparePair} from './browser-prep/transfer.mjs';
const bytes=frame=>Uint8Array.from(frame.data,x=>Math.round(Math.max(0,Math.min(1,x))*255));
const MEDIAPIPE_VERSION='0.10.21';
export function frameCanvas(frame){const c=document.createElement('canvas');c.width=frame.width;c.height=frame.height;const x=c.getContext('2d'),p=x.createImageData(c.width,c.height);for(let i=0;i<c.width*c.height;i++){for(let k=0;k<3;k++)p.data[4*i+k]=Math.round(frame.data[3*i+k]*255);p.data[4*i+3]=255;}x.putImageData(p,0,0);return c;}
export async function fileFrame(file,{maxSide=1024}={}){if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12*1024*1024)throw Error('請使用 12 MB 以下的 JPG、PNG 或 WebP 照片。');const b=await createImageBitmap(file,{imageOrientation:'from-image'});try{if(Math.min(b.width,b.height)<512)throw Error('照片短邊須至少 512 像素。');const c=document.createElement('canvas'),scale=Math.min(1,maxSide/Math.max(b.width,b.height));c.width=Math.round(b.width*scale);c.height=Math.round(b.height*scale);const x=c.getContext('2d');x.drawImage(b,0,0,c.width,c.height);return rgb8(x.getImageData(0,0,c.width,c.height).data,c.width,c.height,4);}finally{b.close();}}
let openCVPromise;
async function loadOpenCV(url){
 // This historical OpenCV build publishes its Emscripten object as both cv and
 // global Module. MediaPipe explicitly inherits global Module and its async
 // factory then waits forever on OpenCV's self-resolving legacy `then` method.
 // Preserve the actual cv object, but remove only its accidental Module alias.
 const clearAlias=module=>{
  if(globalThis.Module===module){
   if(!Reflect.deleteProperty(globalThis,'Module'))globalThis.Module=undefined;
  }
 };
 if(globalThis.cv?.Mat){clearAlias(globalThis.cv);return {module:globalThis.cv};}
 if(!openCVPromise){
  const previousModule=Object.getOwnPropertyDescriptor(globalThis,'Module');
  // Do not let OpenCV inherit another Emscripten runtime's mutable settings.
  if(!Reflect.deleteProperty(globalThis,'Module'))globalThis.Module=undefined;
  openCVPromise=(async()=>{
   try{
    await new Promise((resolve,reject)=>{
     const script=document.createElement('script');script.src=url;
     script.onerror=()=>reject(Error('OpenCV 元件載入失敗'));
     script.onload=()=>resolve();document.head.append(script);
    });
    const start=performance.now();
    while(!globalThis.cv?.Mat){
     if(performance.now()-start>60000)throw Error('OpenCV 元件初始化逾時');
     await new Promise(r=>setTimeout(r,30));
    }
    const module=globalThis.cv;
    clearAlias(module);
    return {module}; // Never resolve the legacy thenable module itself.
   }finally{
    if(previousModule)Object.defineProperty(globalThis,'Module',previousModule);
   }
  })();
 }
 try{return await openCVPromise;}catch(error){openCVPromise=undefined;throw error;}
}
export class IrisMixPhotoEngine {
 static async create({ort,rootURL='./',landmarkerURL='./mediapipe/',onProgress=()=>{},signal}={}){
  if(!ort)throw Error('缺少 ONNX Runtime WebGPU');
  const check=()=>{if(signal?.aborted)throw new DOMException('已取消','AbortError');};check();
  const root=new URL(rootURL,location.href),setup=new AbortController(),abort=()=>setup.abort();
  signal?.addEventListener('abort',abort,{once:true});
  let ops,vaeTask,parserTask,landmarker;
  try{
   // ORT and the transformer keep independent devices. CPU tensors bridge the
   // runtimes, and disposing the transformer never destroys ORT's device.
   ops=await GPUOps.create();
  // The 1536-wide learned Stage I VAE contains a 256x512x1536 FP32 tensor.
  // Reject insufficient bindings before downloading the large model files.
  const largestVAETensor=256*512*1536*4;
  if(ops.device.limits.maxStorageBufferBindingSize<largestVAETensor||ops.device.limits.maxBufferSize<largestVAETensor){ops.device.destroy();throw Error('這個裝置目前無法執行完整模型，請改用快速體驗或另一台電腦。');}
  if(ort.env.webgpu)ort.env.webgpu.powerPreference='high-performance';check();
   // This option requires the reviewed local ORT 1.23.2 passthrough patch.
   // lazyRelease preserves pending commands safely, with a lower observed
   // physical peak than the stock bucket or exact-size simple cache.
   const executionProvider={name:'webgpu',storageBufferCacheMode:'lazyRelease'};
   vaeTask=IrisMixVAE.create(new URL('vae-shared/manifest.json',root).href,{ort,device:ops.device,onProgress,signal:setup.signal,executionProvider});
   parserTask=createFaceParser({ort,baseURL:new URL('browser-prep/parser/',root).href,onProgress,signal:setup.signal,executionProvider,lazy:true});
   const [vae,parser,cv,vision]=await Promise.all([
    vaeTask,parserTask,loadOpenCV(new URL('./browser-prep/opencv.js',import.meta.url).href),
    import(new URL('vision_bundle.mjs?v='+MEDIAPIPE_VERSION,new URL(landmarkerURL,location.href)).href),
   ]);check();
   const mpRoot=new URL(landmarkerURL,location.href),files=await vision.FilesetResolver.forVisionTasks(new URL('wasm',mpRoot).href);check();
   files.wasmLoaderPath+='?v='+MEDIAPIPE_VERSION;files.wasmBinaryPath+='?v='+MEDIAPIPE_VERSION;
   landmarker=await vision.FaceLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:new URL('face_landmarker.task',mpRoot).href,delegate:'CPU'},runningMode:'IMAGE',numFaces:2,minFaceDetectionConfidence:.6,minFacePresenceConfidence:.6});check();
   const r=await fetch(new URL('prompts/manifest.json',root),{signal:setup.signal});if(!r.ok)throw Error('固定任務文字條件載入失敗');const prompts=await r.json();check();
   return new IrisMixPhotoEngine({root,ops,vae,parser,landmarker,cv:cvOperations(cv.module),prompts,onProgress,signal});
  }catch(error){
   setup.abort();
   // Promise.all can reject before another resource finishes constructing.
   // Await only GPU-owned tasks and dispose their fulfilled results; OpenCV
   // and an ESM import have no GPU ownership and may finish independently.
   const [vaeResult,parserResult]=await Promise.allSettled([vaeTask,parserTask]);
   await Promise.allSettled([
    vaeResult.status==='fulfilled'?vaeResult.value?.release():undefined,
    parserResult.status==='fulfilled'?parserResult.value?.dispose():undefined,
   ]);
   try{landmarker?.close();}catch{/* Preserve the setup error after cleanup. */}finally{ops?.device.destroy();}
   if(signal?.aborted)throw new DOMException('已取消','AbortError');
   throw error;
  }finally{signal?.removeEventListener('abort',abort);}
 }
 constructor(options){Object.assign(this,options);this.referenceCache=null;}
 check(){if(this.signal?.aborted)throw new DOMException('已取消','AbortError');}
 detect(frame){const faces=this.landmarker.detect(frameCanvas(frame)).faceLandmarks;if(faces.length!==1)throw Error(faces.length?'請使用只有一張臉的照片。':'未偵測到清楚人臉，請更換正面、無遮擋照片。');return landmarksPixels(faces[0],frame.width,frame.height);}
 async parse(frame){this.parser.signal=this.signal;return this.parser.runRGB(bytes(frame),frame.width,frame.height);}
 async prompt(name){const spec=this.prompts.prompts[name];if(!spec)throw Error('缺少固定任務文字條件：'+name);const load=async file=>{const r=await fetch(new URL('prompts/'+file,this.root),{signal:this.signal});if(!r.ok)throw Error('文字條件載入失敗');return new Float32Array(await r.arrayBuffer());};const[pe,ids]=await Promise.all([load(spec.pe),load(spec.ids)]);return{pe,ids};}
 async transformer(stage){return IrisMixTransformer.create(new URL(stage==='stage1'?'stage1-shared/manifest.json':'stage2-shared/manifest.json',this.root).href,{ops:this.ops,onProgress:this.onProgress,signal:this.signal});}
 async decompose(reference,{seed=0,cacheKey=reference}={}){
  this.check();this.vae.signal=this.signal;if(this.referenceCache?.key===cacheKey)return this.referenceCache;await this.parser.unload();this.check();this.onProgress({stage:'reference-landmarks'});const refPoints=this.detect(reference),box=faceBox(refPoints,reference.width,reference.height),crop=cropResize(reference,box,512),prompt=await this.prompt('stage1'),model=await this.transformer('stage1');
  let out;try{out=await new IrisMixStageI({vae:this.vae,transformer:model,onProgress:this.onProgress}).run({reference:modelTensor(crop).data,pe:prompt.pe,txtIds:prompt.ids,noise:normalNoise(128*32*96,seed),signal:this.signal});}finally{model.dispose();}
  const panels=stageICanvasFromNCHW(out.canvas),layer=restoreReferenceFrame(reference,box,panels),pB=this.detect(panels.B),weights=ruleParts(pB,this.cv);
  layer.weights=weights.map((map,k)=>{const up=resize(map,box[2],box[2],box[2]>512?'linear':'area'),out=image(reference.width,reference.height,1);if(k===3)out.data.fill(1);for(let y=0;y<box[2];y++)out.data.set(up.data.subarray(y*box[2],(y+1)*box[2]),(y+box[1])*out.width+box[0]);return out;});
  for(let i=0;i<reference.width*reference.height;i++){let sum=0;for(const w of layer.weights)sum+=w.data[i];for(const w of layer.weights)w.data[i]/=Math.max(sum,1e-6);}
  this.check();const points=this.detect(layer.bare);let parsed;try{parsed=await this.parse(layer.bare);}finally{await this.parser.unload();}this.check();this.referenceCache={key:cacheKey,layer,points,parsed,panels};return this.referenceCache;
 }
 async run({source,reference,selection=null,prompt='stage2-generic',seed=0,referenceKey=reference}){
  this.check();this.vae.signal=this.signal;const ref=await this.decompose(reference,{seed,cacheKey:referenceKey});this.onProgress({stage:'source-landmarks'});const sourcePoints=this.detect(source);let sourceParsing;try{sourceParsing=await this.parse(source);}finally{await this.parser.unload();}this.check();this.onProgress({stage:'prepare-conditions'});
  const prepared=preparePair({source,sourcePoints,sourceParsing,referencePhoto:reference,referenceLayer:ref.layer,referencePoints:ref.points,referenceParsing:ref.parsed,selection,ops:this.cv}),conditions=Object.fromEntries(Object.entries(prepared.tensors).map(([k,t])=>[k,t.data])),text=await this.prompt(prompt),model=await this.transformer('stage2');
  const ids=new Float32Array(6144*4);let offset=0;for(const[size,time,crop]of[[32,0,false],[32,10,false],[32,20,false],[32,30,false],[16,40,false],[16,50,false],[16,60,false],[16,70,false],[16,80,false],[16,90,true],[16,100,true],[16,110,true]])for(let y=0;y<size;y++)for(let x=0;x<size;x++){const yy=crop?64+y:size===16?2*y+.5:y,xx=crop?64+x:size===16?2*x+.5:x;ids.set([time,yy,xx,0],offset);offset+=4;}
  let rendered;try{rendered=await new IrisMixStageII({vae:this.vae,transformer:model,onProgress:this.onProgress}).run({conditions,pe:text.pe,imgIds:ids,txtIds:text.ids,noise:normalNoise(128*32*32,seed),signal:this.signal});}finally{model.dispose();}
  const H5=image(512,512,3);for(let i=0;i<512*512;i++)for(let c=0;c<3;c++)H5.data[3*i+c]=(rendered.image[c*512*512+i]+1)/2;
  this.check();const composed=composeStageIIRender(prepared,H5);return{...composed,decomposition:ref.panels,prepared,stageII:rendered};
 }
 async dispose(){this.landmarker.close();await this.parser.dispose();await this.vae.release();this.ops.device.destroy();this.referenceCache=null;}
}
