"""Build fixed source-frame ownership masks from approved IrisMix demo pairs.

This CPU-only export reads existing PNG masks and RGB24 coordinate maps. It does
not infer, retouch portraits, or modify assets/v3. Default is a read-only plan;
--write writes only assets/guided. Re-running with the same inputs is byte exact.
"""
import argparse
import hashlib
import io
import json
from pathlib import Path

import numpy as np
from PIL import Image

REPO = Path(__file__).resolve().parents[1]
PARTS = ('eyes', 'lips', 'face')


def digest(data):
    return hashlib.sha256(data).hexdigest()


def png(mask):
    stream = io.BytesIO()
    Image.fromarray(mask.astype(np.uint8)).save(stream, 'PNG', optimize=True)
    return stream.getvalue()


def bounds(mask):
    y, x = np.where(mask > 127)
    return [int(x.min()), int(y.min()), int(x.max()) + 1, int(y.max()) + 1] if x.size else None


def build(assets):
    inputs = {}

    def read(name):
        if Path(name).name != name:
            raise ValueError('Expected a simple asset filename')
        data = (assets / name).read_bytes()
        inputs[name] = {'bytes': len(data), 'sha256': digest(data)}
        return data

    manifest = json.loads(read('manifest.json'))
    size, mask_size = manifest['width'], manifest['maskSize']
    if size != manifest['height'] or size != 640 or mask_size != 512:
        raise ValueError('Expected the existing 640px source / 512px REF protocol')
    refs = {}
    for look in manifest['looks']:
        refs[look['id']] = {}
        for part in PARTS:
            image = Image.open(io.BytesIO(read(look['masks'][part]))).convert('L')
            if image.size != (mask_size, mask_size):
                raise ValueError('Unexpected reference mask size')
            refs[look['id']][part] = np.asarray(image, np.uint32).ravel()

    files, source_paths, source_refs, stats = {}, {}, {}, {}
    for source in manifest['sources']:
        sid = source['id']
        if not sid or any(c not in 'abcdefghijklmnopqrstuvwxyz0123456789_-' for c in sid):
            raise ValueError('Unsafe source ID')
        union = {part: np.zeros((size, size), np.uint32) for part in PARTS}
        included = []
        for look in manifest['looks']:
            pair = look['pairs'].get(sid)
            if pair is None:
                continue
            if any(r['source'] == sid and r['reference'] == look['id'] for r in manifest.get('rejected', [])):
                raise ValueError('Pair is simultaneously approved and rejected')
            image = Image.open(io.BytesIO(read(pair['map']))).convert('RGB')
            if image.size != (size, size):
                raise ValueError('Unexpected source coordinate map size')
            rgb = np.asarray(image, np.uint32)
            index = (rgb[..., 0] << 16) | (rgb[..., 1] << 8) | rgb[..., 2]
            valid = index < mask_size * mask_size
            safe_index = np.minimum(index, mask_size * mask_size - 1)
            for part in PARTS:
                mapped = np.where(valid, refs[look['id']][part][safe_index], 0)
                union[part] = np.maximum(union[part], mapped)
            included.append(look['id'])
        if not included:
            raise ValueError('Source has no approved pairs')

        # L gets priority, E receives the remaining L coverage, and F receives
        # the remaining E/L coverage. Integer rounding cannot exceed255 total.
        lips = union['lips']
        eyes = (union['eyes'] * (255 - lips) + 127) // 255
        remaining = 255 - lips - eyes
        face = (union['face'] * remaining + 127) // 255
        masks = {'eyes': eyes, 'lips': lips, 'face': face}
        summed = sum(masks.values())
        if int(summed.max()) > 255:
            raise ValueError('Ownership mask sum exceeds255')
        source_paths[sid] = {}
        source_refs[sid] = included
        stats[sid] = {'approvedPairs': len(included), 'maxSum': int(summed.max()), 'parts': {}}
        for part, mask in masks.items():
            name = f'{sid}-{part}.png'
            files[name] = png(mask)
            source_paths[sid][part] = name
            stats[sid]['parts'][part] = {
                'pixelsAboveHalf': int((mask > 127).sum()),
                'boundsAboveHalfXYXY': bounds(mask),
                'weightedAreaPixels': round(float(mask.sum()) / 255, 6),
            }

    metadata = {
        'version': 1,
        'format': 'irismix-guided-regions-v1',
        'size': size,
        'sources': source_paths,
        'sourceReferenceIds': source_refs,
        'encoding': '8-bit grayscale PNG; read red channel /255; source display coordinates',
        'construction': {
            'referenceToSource': 'existing lossless RGB24 map; invalid indices contribute zero',
            'union': 'pixelwise maximum across every approved pair for that source',
            'priority': ['lips', 'eyes', 'face'],
            'lips': 'L=max(mapped lips)',
            'eyes': 'round(E*(255-L)/255), where E=max(mapped eyes)',
            'face': 'round(F*(255-L-eyes)/255), where F=max(mapped face)',
            'invariant': 'eyes+lips+face<=255 at every source pixel; remainder belongs to whole-look base/source',
            'meaning': 'fixed spatial ownership for UI compositing; these are geometric regions, not model-predicted cosmetic layers',
        },
        'guideOptions': {
            'eyes': ['satin', 'merlot', 'mint', 'cobalt'],
            'lips': ['satin', 'merlot', 'poppy'],
            'face': ['lily'],
            'availability': 'intersect each list with the current source approved pairs',
        },
        'limitations': [
            'Poppy artwork crosses the eye/face boundary and is omitted from separate eye/face choices. Use the whole look for the complete artwork.',
            'Natural/subtle lip looks mint/lily/cobalt are omitted from the direct lip-color list; source restore remains available.',
            'Changing regions or mixing references composites cached Stage II results and does not run a new model inference.',
        ],
        'metrics': stats,
        'files': {name: {'bytes': len(data), 'sha256': digest(data)} for name, data in sorted(files.items())},
        'inputs': {'base': '../v3/', 'files': dict(sorted(inputs.items()))},
    }
    files['regions.json'] = (json.dumps(metadata, ensure_ascii=False, indent=2) + '\n').encode()
    return files, metadata


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--assets-dir', type=Path, default=REPO / 'IrisMix-demo/assets/v3')
    parser.add_argument('--output-dir', type=Path, default=REPO / 'IrisMix-demo/assets/guided')
    parser.add_argument('--write', action='store_true')
    args = parser.parse_args()
    if args.assets_dir.resolve() == args.output_dir.resolve():
        parser.error('Output must be separate from the original assets')
    files, metadata = build(args.assets_dir)
    if args.write:
        args.output_dir.mkdir(parents=True, exist_ok=True)
        for name, data in files.items():
            target = args.output_dir / name
            if target.exists() and target.read_bytes() == data:
                continue
            temporary = target.with_name('.' + name + '.tmp')
            temporary.write_bytes(data)
            temporary.replace(target)
    print(json.dumps({'mode': 'WRITE' if args.write else 'READ-ONLY PLAN', 'sources': list(metadata['sources']),
                      'sourcePairs': {sid: len(refs) for sid, refs in metadata['sourceReferenceIds'].items()},
                      'maskFiles': len(files) - 1, 'totalBytes': sum(map(len, files.values())),
                      'maxSum': max(m['maxSum'] for m in metadata['metrics'].values()),
                      'files': {name: digest(data) for name, data in files.items()}}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
