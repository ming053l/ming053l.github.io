"""Incrementally add one QA-approved, genuinely rendered portrait to IrisMix.

Default: read-only input validation and plan. Only --write creates new source
assets and updates assets/v3/manifest.json. Existing images/maps/masks are never
overwritten. No inference, model publication, or remote requests are performed.

After running the legacy full exporter, reapply this command for each additional
user portrait, using its reviewed --approved list and --rejected reasons.
"""
import argparse
import copy
import hashlib
import io
import json
import os
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT=Path('/ssd1/chingheng/FlashMakeUp')
DEFAULT_ASSETS=Path(__file__).resolve().parents[1]/'IrisMix-demo/assets/v3'
N,M=640,512
PRIVATE_MARKERS=('/ssd1/','/ssd5/','/home/','/tmp/','/raid/')

def sha(path):
    h=hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda:stream.read(4*1024*1024),b''):h.update(block)
    return h.hexdigest()

def local_file(root,name):
    if not isinstance(name,str) or Path(name).name!=name or name in {'.','..'}:
        raise ValueError('Expected a simple relative prepared filename')
    path=root/name
    if not path.is_file() or path.is_symlink():raise ValueError('Missing prepared file: '+name)
    return path

def public_only(value):
    text=json.dumps(value,ensure_ascii=False)
    if any(marker in text for marker in PRIVATE_MARKERS):raise ValueError('Private path in public provenance')
    return value

def encode(array,*,size=(N,N),quality=95,format='WEBP'):
    image=Image.fromarray(array)
    if size is not None:image=image.resize(size,Image.Resampling.LANCZOS)
    output=io.BytesIO()
    if format=='WEBP':image.save(output,format,quality=quality,method=6)
    else:image.save(output,format,optimize=True)
    return output.getvalue()

def reference_geometry(MC,look,assets):
    """Replay the legacy display crop; reuse, never rewrite its shared assets."""
    import cv2
    rid=look['id'];item=ROOT/'LayerBeauty-Creative/items'/look['provenance']['reference']
    reference=np.asarray(Image.open(item/'madeup.webp').convert('RGB'))
    if rid=='poppy':
        q=np.asarray(json.loads((ROOT/'work/webdemo_prepared/poppy-browser-stage1.json').read_text())['points'],np.float32)[:,:2]
    else:q=MC.landmarks(np.asarray(Image.open(item/'bare.webp').convert('RGB')))
    if q is None:raise ValueError('No frozen reference landmarks: '+rid)
    lo,hi=q.min(0),q.max(0);side=int(min(max(hi-lo)*1.55,*reference.shape[:2]))
    xy=np.clip((lo+hi)/2-side/2,0,np.array(reference.shape[:2][::-1])-side).astype(int)
    # Exact decoded mask agreement validates the frozen display coordinate
    # frame without depending on WebP/PNG encoder container versions.
    qs=(q-xy)/side*M;eye=np.zeros((M,M),np.uint8)
    for a,b in [(33,133),(362,263)]:
        c=(qs[a]+qs[b])/2;w=np.linalg.norm(qs[a]-qs[b]);cv2.ellipse(eye,tuple(c.astype(int)),(int(w*.95),int(w*.65)),0,0,360,255,-1)
    lip=np.zeros_like(eye);idx=[61,146,91,181,84,17,314,405,321,375,291,409,270,269,267,0,37,39,40,185]
    cv2.fillPoly(lip,[qs[idx].astype(np.int32)],255);lip=cv2.dilate(lip,np.ones((9,9),np.uint8))
    face=np.zeros_like(eye);cv2.fillConvexPoly(face,cv2.convexHull(qs[:468].astype(np.int32)),255);face=cv2.subtract(face,cv2.max(eye,lip))
    for key,mask in [('eyes',eye),('lips',lip),('face',face)]:
        expected=cv2.GaussianBlur(mask,(0,0),2.5)
        actual=np.asarray(Image.open(assets/look['masks'][key]).convert('RGB'))[...,0]
        if not np.array_equal(actual,expected):raise ValueError('Frozen REF geometry does not match existing mask: '+rid+'/'+key)
    return reference,xy,side

def prepare(args):
    sid=args.source_id
    if not re.fullmatch(r'[a-z0-9][a-z0-9_-]{0,39}',sid):raise ValueError('Invalid source ID')
    approved=list(dict.fromkeys(x.strip() for x in args.approved.split(',') if x.strip()))
    if not approved:raise ValueError('An explicit nonempty QA-approved list is required')
    rejected={}
    if args.rejected:
        rejected_text=args.rejected if args.rejected.lstrip().startswith('{') else Path(args.rejected).read_text()
        rejected=json.loads(rejected_text)
    if not isinstance(rejected,dict) or any(not isinstance(k,str) or not isinstance(v,str) or not v.strip() for k,v in rejected.items()):raise ValueError('Rejected must be a JSON mapping look ID to reason')
    public_only([args.label,rejected])
    assets=args.assets_dir.resolve();prepared=args.prepared_dir.resolve()
    manifest_path=assets/'manifest.json';manifest=json.loads(manifest_path.read_text())
    if (manifest.get('width'),manifest.get('height'),manifest.get('maskSize'))!=(N,N,M):raise ValueError('Expected current640/512 browser protocol')
    looks={look['id']:look for look in manifest['looks']}
    if set(approved)-looks.keys() or set(rejected)-looks.keys():raise ValueError('Unknown look ID')
    if set(approved)&set(rejected):raise ValueError('A look cannot be both approved and rejected')
    info=json.loads(local_file(prepared,'manifest.json').read_text());source=info['source']
    if source['id']!=sid:raise ValueError('Prepared source ID does not match')
    if 'user-provided' not in source.get('provenance',''):raise ValueError('Prepared portrait must identify its user-provided provenance')
    source_file=local_file(prepared,source['sourceFile']);S=np.asarray(Image.open(source_file).convert('RGB'))
    if S.shape[0]!=S.shape[1] or list(S.shape[:2][::-1])!=source['size']:raise ValueError('Prepared source must be the declared square crop')
    old_source=next((s for s in manifest['sources'] if s['id']==sid),None)
    if old_source and old_source.get('provenance',{}).get('kind')!='user-provided portrait':raise ValueError('Refusing to replace an existing original source ID')
    if old_source and old_source['provenance']['preparedSHA256']!=sha(source_file):raise ValueError('Source ID already belongs to different portrait bytes')
    references={r['id']:r for r in info['references']};pairs={(p['source'],p['reference']):p for p in info['pairs']}
    source_alignment=local_file(prepared,f'source-{sid}-alignment.npz')
    for rid in approved:
        row=pairs.get((sid,rid))
        if not row or row.get('finite') is not True or row.get('outsideOmegaUnchanged') is not True:raise ValueError('Missing finite, genuine rendered pair: '+rid)
        if references[rid]['reference']!=looks[rid]['provenance']['reference']:raise ValueError('Reference identity changed: '+rid)
        local_file(prepared,references[rid]['alignment'])
        with np.load(local_file(prepared,row['file']),allow_pickle=False) as data:
            for key in ['S','R','C']:
                if data[key].shape!=S.shape or data[key].dtype!=np.uint8:raise ValueError('Pair frame mismatch: '+rid+'/'+key)
            if not np.array_equal(data['S'],S):raise ValueError('Pair source pixels changed: '+rid)
            if any(not np.isfinite(data[key]).all() for key in data.files):raise ValueError('Nonfinite pair data: '+rid)
        if row.get('sourceSHA256')!=sha(source_file):raise ValueError('Pair source provenance SHA mismatch: '+rid)
    provenance=public_only(dict(kind='user-provided portrait',originalSHA256=source['originalSHA256'],originalSize=source['originalSize'],
                               cropBoxPIL=source['cropBoxPIL'],preparedSize=source['size'],preparedSHA256=sha(source_file),
                               resampling=source['resampling'],retouch=source['retouch'],qualityNotes=source.get('qualityNotes',[])))
    entry=dict(id=sid,label=args.label,image=f'source-{sid}.webp',thumbnail=f'source-{sid}-thumb.webp',provenance=provenance)
    result=copy.deepcopy(manifest);result['sources']=[s for s in result['sources'] if s['id']!=sid]
    result['sources'].insert(0 if args.make_default else len(result['sources']),entry)
    if args.make_default:result['defaultSource']=sid;result['source']=entry['image']
    result['rejected']=[row for row in result.get('rejected',[]) if row['source']!=sid]
    for look in result['looks']:
        rid=look['id'];look['pairs'].pop(sid,None)
        if rid not in approved:
            result['rejected'].append(dict(source=sid,reference=rid,reason=rejected.get(rid,'此人像與參考妝容的效果未達收錄標準，未收錄此組合。')))
    before={p.name:sha(p) for p in assets.iterdir() if p.is_file() and p.name!='manifest.json'}
    return dict(assets=assets,prepared=prepared,manifestPath=manifest_path,manifestSHA=sha(manifest_path),before=before,
                manifest=result,info=info,source=S,sourceAlignment=source_alignment,approved=approved,references=references,pairs=pairs)

def bake(plan,args):
    sys.path.insert(0,str(ROOT/'work/stage1_data'));import make_composites as MC
    sid=args.source_id;S=plan['source'];assets=plan['assets'];prepared=plan['prepared'];payload={}
    try:
        payload[f'source-{sid}.webp']=encode(S)
        payload[f'source-{sid}-thumb.webp']=encode(S,size=(144,144),quality=90)
        with np.load(plan['sourceAlignment'],allow_pickle=False) as alignment:destination=alignment['extended']*(N/S.shape[0])
        for look in plan['manifest']['looks']:
            rid=look['id']
            if rid not in plan['approved']:continue
            row=plan['pairs'][(sid,rid)];refinfo=plan['references'][rid]
            with np.load(local_file(prepared,row['file']),allow_pickle=False) as data:R=data['R'].copy();C=data['C'].copy()
            reference,xy,side=reference_geometry(MC,look,assets)
            with np.load(local_file(prepared,refinfo['alignment']),allow_pickle=False) as alignment:
                source_points=alignment['extended'].copy()
                if tuple(alignment['reference_shape'][:2])!=reference.shape[:2]:raise ValueError('Reference alignment frame mismatch: '+rid)
            key=f'{sid}-{rid}';payload[key+'-render.webp']=encode(R);payload[key+'-warp.webp']=encode(C)
            B=S.astype(np.float32)/255;I=R.astype(np.float32)/255;d=I-B
            alpha=np.clip(np.maximum(np.max(d/np.maximum(1-B,1e-6),2),np.max(-d/np.maximum(B,1e-6),2)),0,1)
            color=np.clip(B+d/np.maximum(alpha[...,None],1e-6),0,1)
            payload[key+'-layer.webp']=encode(np.dstack([(color*255+.5).astype(np.uint8),(alpha*255+.5).astype(np.uint8)]))
            MC.pwarp(np.zeros(reference.shape[:2],np.float32),source_points,destination,(N,N))
            mx,my,inside=MC.pwarp.last_map;x,y=xy
            rx=np.rint((mx-x)/side*(M-1)).astype(int);ry=np.rint((my-y)/side*(M-1)).astype(int)
            valid=inside&(rx>=0)&(rx<M)&(ry>=0)&(ry<M);index=np.where(valid,ry*M+rx,0xffffff).astype(np.uint32)
            packed=np.stack([(index>>16)&255,(index>>8)&255,index&255],2).astype(np.uint8)
            payload[key+'-map.png']=encode(packed,size=None,format='PNG')
            stage2=plan['info']['stage2'];checkpoint=Path(stage2['checkpoint'])
            provenance=public_only(dict(execution='actual native PyTorch Stage II; static browser layer compositing',
                stage2=checkpoint.parent.name+'/'+checkpoint.stem,checkpointSHA256=stage2['sha256'],arithmetic=stage2['arithmetic'],sampler=stage2['sampler'],
                stage1=refinfo['stage1'],stage1Execution=refinfo['stage1Execution'],stage1CacheSHA256=refinfo['stage1CacheSHA256'],
                sourceKind='user-provided portrait',sourcePreparedFileSHA256=row['sourceSHA256'],sourcePixelsSHA256=hashlib.sha256(S.tobytes()).hexdigest(),nativePairSHA256=sha(prepared/row['file']),
                referenceDisplay=dict(cropXY=[int(x),int(y)],cropSide=int(side),image=look['reference'],sha256=sha(assets/look['reference'])),
                referenceGeometry='actual cached Stage I bare-face landmarks mapped into the unchanged displayed REF crop'))
            # A shared look may now contain both browser and native executions.
            previous_execution=look['provenance'].get('execution')
            if previous_execution and previous_execution!='per-pair; see pair provenance':
                for old in look['pairs'].values():old.setdefault('provenance',dict(execution=previous_execution,stage1=look['provenance'].get('stage1'),stage2=look['provenance']['stage2']))
                look['provenance']['execution']='per-pair; see pair provenance'
            look['pairs'][sid]=dict(layer=key+'-layer.webp',map=key+'-map.png',render=key+'-render.webp',warp=key+'-warp.webp',provenance=provenance)
        public_only(plan['manifest'])
        return payload
    finally:
        if MC.LM is not None:MC.LM.close();MC.LM=None

def write(plan,payload):
    assets=plan['assets'];created=[];committed=False
    if sha(plan['manifestPath'])!=plan['manifestSHA']:raise ValueError('Live manifest changed during export; retry')
    for name,data in payload.items():
        target=assets/name
        if target.exists() and target.read_bytes()!=data:raise ValueError('Refusing to overwrite existing asset: '+name)
    try:
        for name,data in payload.items():
            target=assets/name
            if target.exists():continue
            with target.open('xb') as stream:
                created.append(target);stream.write(data)
        for name,digest in plan['before'].items():
            if sha(assets/name)!=digest:raise ValueError('Existing asset changed: '+name)
        if sha(plan['manifestPath'])!=plan['manifestSHA']:raise ValueError('Live manifest changed during export; retry')
        temporary=assets/'.manifest-source-export.tmp'
        temporary.write_text(json.dumps(plan['manifest'],ensure_ascii=False,indent=2)+'\n');os.replace(temporary,plan['manifestPath']);committed=True
        return len(created)
    finally:
        if not committed:
            for path in created:path.unlink(missing_ok=True)
            (assets/'.manifest-source-export.tmp').unlink(missing_ok=True)

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--prepared-dir',type=Path,required=True);parser.add_argument('--source-id',required=True)
    parser.add_argument('--label',required=True);parser.add_argument('--approved',required=True,help='Comma-separated reviewed look IDs')
    parser.add_argument('--rejected',help='JSON object or JSON file path mapping rejected look IDs to public reasons')
    parser.add_argument('--make-default',action='store_true');parser.add_argument('--write',action='store_true')
    parser.add_argument('--assets-dir',type=Path,default=DEFAULT_ASSETS)
    args=parser.parse_args()
    try:
        plan=prepare(args)
        created=write(plan,bake(plan,args)) if args.write else 0
        print(json.dumps(dict(mode='WRITE' if args.write else 'READ-ONLY PLAN',source=args.source_id,approved=plan['approved'],
                             rejected=[r for r in plan['manifest']['rejected'] if r['source']==args.source_id],
                             makeDefault=args.make_default,plannedAssets=2+4*len(plan['approved']),createdAssets=created,
                             protectedExistingAssetFiles=len(plan['before']),publicInference='unchanged/paused'),ensure_ascii=False,indent=2))
    except (ValueError,KeyError,OSError) as error:parser.exit(2,str(error)+'\n')

if __name__=='__main__':main()
