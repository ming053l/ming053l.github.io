"""Export curated, provenance-checked Stage II results and CPU brush correspondence.
No generative model, diffusion pipeline or GPU is loaded by this exporter.
Run with the existing flashmakeup Python environment from this website checkout.
"""
from pathlib import Path
import json, sys
import numpy as np
import cv2
from PIL import Image

ROOT = Path('/ssd1/chingheng/FlashMakeUp')
RENDERS = Path('/ssd5/ming/oneface_cache/FULL_lora_step3000_ema_s065n1r2')
ITEMS = ROOT / 'LayerBeauty-Creative/items'
OUT = Path(__file__).resolve().parents[1] / 'IrisMix/assets/v2'
OUT.mkdir(parents=True, exist_ok=True)
sys.path.insert(0, str(ROOT / 'work/stage1_data'))
import make_composites as MC

LOOKS = [('satin', 'Bare Satin', 'Soft liner · warm satin lips', 'krelite5g1_ke045_ref0'),
         ('merlot', 'Merlot', 'Burgundy eyes · deep berry lips', 'jpol6g1_jo016_ref0'),
         ('mint', 'Mint Breeze', 'Mint eyes · soft rose lips', 'jpol5g1_jo050_ref0'),
         ('lily', 'Water Lily', 'Green shadow · floral face art', 'eufairy6g1_ef032_ref1')]
N, M = 640, 512
S = np.asarray(Image.open(ITEMS/'dailyjpb8g0_djp009_ref0/bare.webp').convert('RGB'))
P = MC.landmarks(S)
assert P is not None
P = MC.extend(P, S.shape) if hasattr(MC, 'extend') else P

def webp(a, filename, size=(N,N), quality=95):
    Image.fromarray(a).resize(size, Image.Resampling.LANCZOS).save(OUT/filename, 'WEBP', quality=quality, method=6)
webp(S, 'source.webp')
manifest = {'version': 2, 'width': N, 'height': N, 'maskSize': M, 'source': 'source.webp', 'looks': []}
for ident, name, description, refid in LOOKS:
    stamp=json.loads((RENDERS/f'{ident}.ckpt.json').read_text())
    assert stamp['stage2'].endswith('/FULL/lora_step3000_ema.pt')
    R=np.asarray(Image.open(RENDERS/f'{ident}.png').convert('RGB'))
    assert R.shape == S.shape
    ref=np.asarray(Image.open(ITEMS/refid/'madeup.webp').convert('RGB'))
    bare=np.asarray(Image.open(ITEMS/refid/'bare.webp').convert('RGB'))
    q=MC.landmarks(bare);assert q is not None, refid
    # A face-centred reference crop makes the brush editor substantially larger.
    lo=q.min(0);hi=q.max(0);mid=(lo+hi)/2
    side=int(min(max(hi-lo)*1.55,*ref.shape[:2]));xy=np.clip(mid-side/2,0,np.array(ref.shape[:2][::-1])-side).astype(int)
    x,y=xy;refcrop=ref[y:y+side,x:x+side]
    webp(refcrop, f'{ident}-reference.webp',(768,768))
    webp(R, f'{ident}-render.webp');webp(np.asarray(Image.open(RENDERS/f'{ident}_paste.png').convert('RGB')),f'{ident}-warp.webp')
    webp(R,f'{ident}-thumb.webp',(160,160),90)
    # Recover a layer from the actual Stage II output, never from the warp.
    B=S.astype(np.float32)/255;I=R.astype(np.float32)/255;d=I-B
    a=np.clip(np.maximum(np.max(d/np.maximum(1-B,1e-6),2),np.max(-d/np.maximum(B,1e-6),2)),0,1)
    F=np.clip(B+d/np.maximum(a[...,None],1e-6),0,1)
    rgba=np.dstack([(F*255+.5).astype(np.uint8),(a*255+.5).astype(np.uint8)])
    webp(rgba,f'{ident}-layer.webp')
    # For every target pixel, encode its corresponding pixel in the REF editor.
    # RGB is a lossless 24-bit index; alpha must stay opaque to avoid premultiplication.
    pd=P*(N/S.shape[0]);ps=MC.extend(q,ref.shape)
    MC.pwarp(np.zeros(ref.shape[:2],np.float32),ps,pd,(N,N))
    mx,my,inside=MC.pwarp.last_map
    rx=np.rint((mx-x)/side*(M-1)).astype(int);ry=np.rint((my-y)/side*(M-1)).astype(int)
    valid=inside&(rx>=0)&(rx<M)&(ry>=0)&(ry<M)
    index=np.where(valid,ry*M+rx,0xffffff).astype(np.uint32)
    packed=np.stack([(index>>16)&255,(index>>8)&255,index&255],2).astype(np.uint8)
    Image.fromarray(packed).save(OUT/f'{ident}-map.png',optimize=True)
    # Quick selections are optional conveniences; freehand masks use this same REF frame.
    qs=(q-xy)/side*M
    eye=np.zeros((M,M),np.uint8)
    for a_,b_ in [(33,133),(362,263)]:
        center=(qs[a_]+qs[b_])/2;w=np.linalg.norm(qs[a_]-qs[b_])
        cv2.ellipse(eye,tuple(center.astype(int)),(int(w*.95),int(w*.65)),0,0,360,255,-1)
    lip=np.zeros_like(eye);lipids=[61,146,91,181,84,17,314,405,321,375,291,409,270,269,267,0,37,39,40,185]
    cv2.fillPoly(lip,[qs[lipids].astype(np.int32)],255);lip=cv2.dilate(lip,np.ones((9,9),np.uint8))
    face=np.zeros_like(eye);cv2.fillConvexPoly(face,cv2.convexHull(qs[:468].astype(np.int32)),255)
    face=cv2.subtract(face,cv2.max(eye,lip))
    for key,mask in [('eyes',eye),('lips',lip),('face',face)]:
        mask=cv2.GaussianBlur(mask,(0,0),2.5);Image.fromarray(mask).convert('RGB').save(OUT/f'{ident}-{key}-mask.png',optimize=True)
    manifest['looks'].append({'id':ident,'label':name,'description':description,'reference':f'{ident}-reference.webp',
      'render':f'{ident}-render.webp','warp':f'{ident}-warp.webp','thumbnail':f'{ident}-thumb.webp','layer':f'{ident}-layer.webp','map':f'{ident}-map.png',
      'masks':{key:f'{ident}-{key}-mask.png' for key in ['eyes','lips','face']},
      'provenance':{'reference':refid,'stage2':'FULL/lora_step3000_ema','sampler':'sigma=0.65, 1 step','source':'dailyjpb8g0_djp009_ref0','rendered':True}})
    print('Exported',name,flush=True)
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Total KiB:',sum(p.stat().st_size for p in OUT.iterdir())//1024)
if MC.LM is not None:
    MC.LM.close()
    MC.LM = None
