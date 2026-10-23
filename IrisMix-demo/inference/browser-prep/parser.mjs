/* Actual native IrisMix SegFormer parser; call only after showing model terms.
 * Weight license: non-commercial research and educational purposes.
 * Browser RGB resizing must follow the model's 512-square bilinear contract.
 */
import {fetchModelBytes,mapConcurrent} from '../model-cache.mjs';

const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

/** PIL's bilinear antialiasing filter for RGB uint8 images, including its
 * separable 22-bit integer rounding. Canvas drawImage is not an equivalent
 * downsampler, especially when a face occupies a small part of the photo.
 */
export function resizeParserRGB(rgb,width,height,size=512) {
  if(rgb.length!==width*height*3)throw new RangeError('Expected original RGB bytes');
  const precision=2**22;
  const coefficients=(from,to)=>{
    const scale=from/to,filterScale=Math.max(1,scale),support=filterScale,rows=[];
    for(let p=0;p<to;p++){
      const center=(p+.5)*scale;
      const first=Math.max(0,Math.trunc(center-support+.5)),last=Math.min(from,Math.trunc(center+support+.5));
      const values=[];let sum=0;
      for(let i=first;i<last;i++){const weight=Math.max(0,1-Math.abs((i-center+.5)/filterScale));values.push(weight);sum+=weight;}
      rows.push({first,weights:values.map(v=>Math.trunc(v/sum*precision+.5))});
    }
    return rows;
  };
  const horizontal=coefficients(width,size),vertical=coefficients(height,size);
  const tmp=new Uint8Array(size*height*3),out=new Uint8Array(size*size*3);
  for(let y=0;y<height;y++)for(let x=0;x<size;x++)for(let c=0;c<3;c++){
    const row=horizontal[x];let sum=precision/2;
    for(let k=0;k<row.weights.length;k++)sum+=rgb[(y*width+row.first+k)*3+c]*row.weights[k];
    tmp[(y*size+x)*3+c]=Math.max(0,Math.min(255,Math.floor(sum/precision)));
  }
  for(let y=0;y<size;y++)for(let x=0;x<size;x++)for(let c=0;c<3;c++){
    const row=vertical[y];let sum=precision/2;
    for(let k=0;k<row.weights.length;k++)sum+=tmp[((row.first+k)*size+x)*3+c]*row.weights[k];
    out[(y*size+x)*3+c]=Math.max(0,Math.min(255,Math.floor(sum/precision)));
  }
  return out;
}

export function normalizeParserRGB(rgb) {
  if (rgb.length !== 512 * 512 * 3) throw new RangeError('Expected 512 × 512 RGB bytes');
  const pixels = new Float32Array(rgb.length);
  for (let i = 0; i < 512 * 512; i++) {
    for (let c = 0; c < 3; c++) pixels[c * 512 * 512 + i] = (rgb[3 * i + c] / 255 - MEAN[c]) / STD[c];
  }
  return pixels;
}

/** Match torch.interpolate(logits, align_corners=false).softmax(1).
 * Kept in float32 CHW layout, the native MC.parse return layout.
 */
export function parserProbabilities(logits, width, height, inputWidth = 128, inputHeight = 128, classes = 19) {
  if (logits.length !== classes * inputWidth * inputHeight) throw new RangeError('Invalid parser logits');
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) throw new RangeError('Invalid frame');
  const n = width * height, plane = inputWidth * inputHeight;
  const out = new Float32Array(n * classes), labels = new Uint8Array(n);
  const xs = new Array(width);
  for (let x = 0; x < width; x++) {
    const sx = Math.max(0, (x + 0.5) * inputWidth / width - 0.5), x0 = Math.floor(sx);
    xs[x] = [Math.min(x0, inputWidth - 1), Math.min(x0 + 1, inputWidth - 1), sx - x0];
  }
  for (let y = 0; y < height; y++) {
    const sy = Math.max(0, (y + 0.5) * inputHeight / height - 0.5), y0 = Math.floor(sy);
    const y1 = Math.min(y0 + 1, inputHeight - 1), fy = sy - y0;
    for (let x = 0; x < width; x++) {
      const [x0, x1, fx] = xs[x], i = y * width + x;
      let max = -Infinity, best = 0;
      for (let c = 0; c < classes; c++) {
        const b = c * plane;
        const top = logits[b + y0 * inputWidth + x0] * (1 - fx) + logits[b + y0 * inputWidth + x1] * fx;
        const bottom = logits[b + y1 * inputWidth + x0] * (1 - fx) + logits[b + y1 * inputWidth + x1] * fx;
        const value = Math.fround(top * (1 - fy) + bottom * fy);
        out[c * n + i] = value;
        if (value > max) { max = value; best = c; }
      }
      labels[i] = best;
      let sum = 0;
      for (let c = 0; c < classes; c++) { const e = Math.exp(out[c * n + i] - max); out[c * n + i] = e; sum += e; }
      for (let c = 0; c < classes; c++) out[c * n + i] /= sum;
    }
  }
  return {width, height, classes, probabilities: out, labels};
}

/** ort is injected so a hosting page chooses its exact pinned local runtime.
 * Native parsing keeps soft probabilities: an argmax mask alone is inadequate.
 */
export async function createFaceParser({ort, baseURL, executionProvider = 'webgpu', onProgress = () => {},signal,lazy=false}) {
  if (!ort?.InferenceSession || !ort?.Tensor) throw new TypeError('An ONNX Runtime instance is required');
  const root = new URL('./', baseURL);
  const response = await fetch(new URL('manifest.json', root),{signal});
  if (!response.ok) throw new Error(`Parser manifest failed (${response.status})`);
  const manifest = await response.json(),files=new Map(manifest.files.map(spec=>[spec.name,spec]));
  let disposed=false,session,loading;const runs=new Set();
  const check=currentSignal=>{
    if(currentSignal?.aborted)throw new DOMException('已取消模型載入','AbortError');
    if(disposed)throw new Error('Parser has been disposed');
  };
  const getSession=async()=>{
    const currentSignal=api.signal;check(currentSignal);
    if(session)return session;if(loading)return loading;
    loading=(async()=>{
      onProgress({stage:'loading-parser',bytes:manifest.files.reduce((n,f)=>n+f.bytes,0)});
      // Verified browser storage supplies the same graph/weights after unload.
      // Do not retain a second 340 MB copy in a long-lived closure.
      const graph=new Uint8Array(await fetchModelBytes(new URL(manifest.modelFile,root),files.get(manifest.modelFile),currentSignal));
      const externalData=await mapConcurrent(manifest.externalData,4,async path=>({path,data:new Uint8Array(await fetchModelBytes(new URL(path,root),files.get(path),currentSignal))}));
      const created=await ort.InferenceSession.create(graph,{executionProviders:[executionProvider],graphOptimizationLevel:'all',externalData});
      // Native construction cannot be interrupted; release its completed
      // session when cancellation/disposal arrives during that await.
      try{check(currentSignal);}catch(error){await created.release();throw error;}
      session=created;return created;
    })();
    try{return await loading;}finally{loading=undefined;}
  };
  const api={
    manifest,signal,
    async runNormalized(pixels,width,height){
      const currentSignal=this.signal;check(currentSignal);
      if(!(pixels instanceof Float32Array)||pixels.length!==3*512*512)throw new TypeError('Invalid normalized parser input');
      const run=(async()=>{
        const active=await getSession();check(currentSignal);onProgress({stage:'parsing-face'});
        const feeds={[manifest.input.name]:new ort.Tensor('float32',pixels,[1,3,512,512])};let outputs;
        try{
          outputs=await active.run(feeds);check(currentSignal);
          const logits=await outputs[manifest.output.name].getData();check(currentSignal);
          return parserProbabilities(logits,width,height);
        }finally{
          for(const value of Object.values(outputs||{}))value.dispose?.();
          feeds[manifest.input.name].dispose?.();
        }
      })();
      runs.add(run);try{return await run;}finally{runs.delete(run);}
    },
    async runResizedRGB(rgb,width,height){return this.runNormalized(normalizeParserRGB(rgb),width,height);},
    async runRGB(rgb,width,height){return this.runResizedRGB(resizeParserRGB(rgb,width,height),width,height);},
    async unload(){
      // A native ORT context owns its buffer cache across sessions. Releasing
      // the last parser/VAE session drains that cache between model phases.
      if(loading)await Promise.allSettled([loading]);
      await Promise.allSettled([...runs]);
      const old=session;session=undefined;if(old)await old.release();
    },
    async dispose(){if(!disposed){disposed=true;await this.unload();}},
  };
  if(!lazy)await getSession();
  return api;
}
