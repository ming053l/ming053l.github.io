/** Binary model assets only. Visitor photos are never stored by this module. */
let cachePromise;
const inFlight=new Map();
const enabled=()=>globalThis.isSecureContext&&globalThis.caches&&!['localhost','127.0.0.1','[::1]'].includes(location.hostname);
async function modelCache(){if(!enabled())return null;if(!cachePromise)cachePromise=caches.open('irismix-model-sha256-v1').catch(()=>null);return cachePromise;}
async function digest(bytes){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');}
function aborted(signal){if(signal?.aborted)throw new DOMException('已取消模型載入','AbortError');}

async function fetchOne(url,spec,signal){
  aborted(signal);const cache=spec?.sha256?await modelCache():null;
  const key=cache?new URL('/__irismix_model_cache__/'+spec.sha256,location.origin).href:null;
  if(cache){try{const hit=await cache.match(key);if(hit){const bytes=await hit.arrayBuffer();aborted(signal);if(bytes.byteLength===spec.bytes&&await digest(bytes)===spec.sha256)return bytes;await cache.delete(key);}}catch(e){if(e.name==='AbortError')throw e;}}
  const response=await fetch(url,{signal});if(!response.ok)throw new Error(`${response.status}: ${url}`);const bytes=await response.arrayBuffer();
  if(spec?.bytes!==undefined&&bytes.byteLength!==spec.bytes)throw new Error(`模型檔案大小不符：${url}`);
  if(cache){if(await digest(bytes)!==spec.sha256)throw new Error(`模型檔案驗證失敗：${url}`);try{await cache.put(key,new Response(bytes,{headers:{'Content-Type':'application/octet-stream'}}));}catch{/* A full or disabled cache leaves inference operational. */}}
  aborted(signal);return bytes;
}

/** Returns an ArrayBuffer; a SHA identifies identical data across model paths. */
export async function fetchModelBytes(url,spec,signal){
  aborted(signal);const key=spec?.sha256;
  if(!key)return fetchOne(url,spec,signal);
  let pending=inFlight.get(key);
  if(!pending){pending=fetchOne(url,spec,signal);inFlight.set(key,pending);pending.finally(()=>{if(inFlight.get(key)===pending)inFlight.delete(key);}).catch(()=>{});}
  const bytes=await pending;aborted(signal);return bytes;
}

/** Bounded model loading keeps network concurrency and transient copies modest. */
export async function mapConcurrent(items,limit,mapper){
  if(!Number.isInteger(limit)||limit<1)throw new RangeError('Invalid loading concurrency');
  const result=new Array(items.length);let next=0,failed=false;
  await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{
    while(!failed&&next<items.length){const index=next++;try{result[index]=await mapper(items[index],index);}catch(error){failed=true;throw error;}}
  }));return result;
}
