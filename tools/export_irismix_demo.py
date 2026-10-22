"""CPU export of independently rendered source/reference pairs for the browser studio.
The inputs are genuine Stage II samples from work/webdemo_prepared/render_samples.py.
"""
from pathlib import Path
import json,sys
import numpy as np,cv2
from PIL import Image
ROOT=Path('/ssd1/chingheng/FlashMakeUp');PREP=ROOT/'work/webdemo_prepared';ITEMS=ROOT/'LayerBeauty-Creative/items'
OUT=Path(__file__).resolve().parents[1]/'IrisMix/assets/v3';OUT.mkdir(parents=True,exist_ok=True)
sys.path.insert(0,str(ROOT/'work/stage1_data'));import make_composites as MC
N,M=640,512
info=json.loads((PREP/'manifest.json').read_text());info['references']=[{'id':'poppy','label':'緋紅罌粟','reference':'redhood6g1_rh024_ref0'} if r['id']=='line' else r for r in info['references']];rejected={('warm','lily'):'此角度的花卉圖案不完整，未收錄此組合。',('night','poppy'):'此角度會遮住花形，未收錄此組合。',('smile','poppy'):'此組合的花形與花梗不完整，未收錄此組合。'}
def save(a,name,size=(N,N),q=95):Image.fromarray(a).resize(size,Image.Resampling.LANCZOS).save(OUT/name,'WEBP',quality=q,method=6)
manifest={'version':3,'width':N,'height':N,'maskSize':M,'defaultSource':'studio','source':'source-studio.webp','sources':[],'looks':[],'rejected':[]}
points={}
for src in info['sources']:
 sid=src['id'];S=np.asarray(Image.open(PREP/f'source-{sid}.png').convert('RGB'));p=MC.landmarks(S);assert p is not None;points[sid]=MC.extend(p,S.shape)
 save(S,f'source-{sid}.webp');save(S,f'source-{sid}-thumb.webp',(144,144),90)
 manifest['sources'].append({**src,'image':f'source-{sid}.webp','thumbnail':f'source-{sid}-thumb.webp'})
for index,r in enumerate(info['references']):
 rid,refid=r['id'],r['reference'];ref=np.asarray(Image.open(ITEMS/refid/'madeup.webp').convert('RGB'));bare=np.asarray(Image.open(ITEMS/refid/'bare.webp').convert('RGB'))
 q=np.asarray(json.loads((PREP/'poppy-browser-stage1.json').read_text())['points'],np.float32)[:,:2] if rid=='poppy' else MC.landmarks(bare);assert q is not None;lo,hi=q.min(0),q.max(0);side=int(min(max(hi-lo)*1.55,*ref.shape[:2]));xy=np.clip((lo+hi)/2-side/2,0,np.array(ref.shape[:2][::-1])-side).astype(int);x,y=xy
 save(ref[y:y+side,x:x+side],f'{rid}-reference.webp',(768,768));save(ref[y:y+side,x:x+side],f'{rid}-thumb.webp',(180,180),91)
 look={'id':rid,'label':r['label'],'category':'daily' if index<3 else 'art','reference':f'{rid}-reference.webp','thumbnail':f'{rid}-thumb.webp','description':['細緻眼線、暖色唇妝','酒紅眼影、莓果唇色','綠色眼影、自然唇色','綠色眼妝、花卉圖案','飽和藍色舞台眼妝','紅色罌粟與細緻綠色花梗'][index],'pairs':{},'masks':{},'provenance':{'reference':refid,'stage2':'FULL/lora_step3000_ema','sampler':'sigma=0.65, 1 step','rendered':True,**({'stage1':'C2/lora_step2000','execution':'browser WebGPU, shared Q4 base and FP32 LoRA','referenceGeometry':'actual Stage I bare-face landmarks'} if rid=='poppy' else {})}}
 qs=(q-xy)/side*M;eye=np.zeros((M,M),np.uint8)
 for a,b in [(33,133),(362,263)]:
  c=(qs[a]+qs[b])/2;w=np.linalg.norm(qs[a]-qs[b]);cv2.ellipse(eye,tuple(c.astype(int)),(int(w*.95),int(w*.65)),0,0,360,255,-1)
 lip=np.zeros_like(eye);idx=[61,146,91,181,84,17,314,405,321,375,291,409,270,269,267,0,37,39,40,185];cv2.fillPoly(lip,[qs[idx].astype(np.int32)],255);lip=cv2.dilate(lip,np.ones((9,9),np.uint8));face=np.zeros_like(eye);cv2.fillConvexPoly(face,cv2.convexHull(qs[:468].astype(np.int32)),255);face=cv2.subtract(face,cv2.max(eye,lip))
 for key,mask in [('eyes',eye),('lips',lip),('face',face)]:
  fn=f'{rid}-{key}-mask.png';Image.fromarray(cv2.GaussianBlur(mask,(0,0),2.5)).convert('RGB').save(OUT/fn,optimize=True);look['masks'][key]=fn
 for src in info['sources']:
  sid=src['id'];key=f'{sid}-{rid}'
  if (sid,rid) in rejected:manifest['rejected'].append({'source':sid,'reference':rid,'reason':rejected[sid,rid]});continue
  z=np.load(PREP/f'{key}.npz');S,R=z['S'],z['R'];assert S.shape==R.shape
  save(R,f'{key}-render.webp');save(z['C'],f'{key}-warp.webp')
  B=S.astype(np.float32)/255;I=R.astype(np.float32)/255;d=I-B;a=np.clip(np.maximum(np.max(d/np.maximum(1-B,1e-6),2),np.max(-d/np.maximum(B,1e-6),2)),0,1);F=np.clip(B+d/np.maximum(a[...,None],1e-6),0,1);save(np.dstack([(F*255+.5).astype(np.uint8),(a*255+.5).astype(np.uint8)]),f'{key}-layer.webp')
  MC.pwarp(np.zeros(ref.shape[:2],np.float32),MC.extend(q,ref.shape),points[sid]*(N/S.shape[0]),(N,N));mx,my,inside=MC.pwarp.last_map;rx=np.rint((mx-x)/side*(M-1)).astype(int);ry=np.rint((my-y)/side*(M-1)).astype(int);valid=inside&(rx>=0)&(rx<M)&(ry>=0)&(ry<M);ix=np.where(valid,ry*M+rx,0xffffff).astype(np.uint32);packed=np.stack([(ix>>16)&255,(ix>>8)&255,ix&255],2).astype(np.uint8);Image.fromarray(packed).save(OUT/f'{key}-map.png',optimize=True)
  look['pairs'][sid]={'layer':f'{key}-layer.webp','map':f'{key}-map.png','render':f'{key}-render.webp','warp':f'{key}-warp.webp'}
 manifest['looks'].append(look);print('Exported',rid,flush=True)
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
MC.LM.close();MC.LM=None
print('Total MiB:',round(sum(p.stat().st_size for p in OUT.iterdir())/1024/1024,1))
