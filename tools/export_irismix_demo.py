"""Export the existing IrisMix teaser layers for the static browser demo; CPU only.
Run from the homepage checkout. No model is loaded or invoked.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image

CACHE = Path('/ssd1/chingheng/FlashMakeUp/work/teaser_video/cache/FULL_lora_step3000_ema/faces')
OUT = Path(__file__).resolve().parents[1] / 'IrisMix/assets'
LOOKS = [('everyday', 'hero', 'Everyday', ['Soft Brown', 'Brick Red', 'Rosy Blush']),
         ('moon', 'rm', 'Sun & Moon', ['Rose & Pearl', 'Silver Moon', 'Sun & Moon']),
         ('rose', 'bl_rose', 'Rose Garden', ['Pink Bloom', 'Rose Satin', 'Painted Roses']),
         ('gold', 'bl_gold', 'Gilded', ['Golden Haze', 'Crimson', 'Gold Leaf'])]
PARTS = ['eyes', 'lips', 'face']
SIZE = (640, 640)

def save(rgb, path, alpha=None):
    im = Image.fromarray(rgb)
    if alpha is not None:
        im = im.convert('RGBA'); im.putalpha(Image.fromarray(alpha))
    im = im.resize(SIZE, Image.Resampling.LANCZOS)
    im.save(OUT / path, 'WEBP', quality=94, method=6)

OUT.mkdir(parents=True, exist_ok=True)
manifest = {'width': 640, 'height': 640, 'source': 'source.webp', 'looks': []}
first = None
for ident, name, label, names in LOOKS:
    z = np.load(CACHE / f'look_{name}.npz')
    # Use one shared spatial partition so references can be exchanged cleanly.
    # The everyday cache's derived partition has no eye seed; the rose layout
    # provides all three regions on this exact same source portrait.
    pm = np.load(CACHE / 'pm_bl_rose.npz')['pm'].astype(np.float32)
    if first is None:
        first = z['S']; save(first, 'source.webp')
    assert np.array_equal(first, z['S']), 'All selectable layers must share the same source portrait'
    F = np.clip(z['F'].astype(np.float32), 0, 1)
    alpha = z['at'].astype(np.float32)
    entry = {'id': ident, 'label': label, 'preview': f'{ident}-preview.webp', 'parts': {}}
    save(z['R'], entry['preview'])
    for k, part in enumerate(PARTS):
        fn = f'{ident}-{part}.webp'
        save((F * 255 + .5).astype(np.uint8), fn, (np.clip(alpha * pm[k], 0, 1) * 255 + .5).astype(np.uint8))
        refid = str(z['refs'][list(z['parts']).index(part)])
        ref = np.load(CACHE / f'ref_{refid}.npz')['I']
        thumb = Image.fromarray(ref).resize((128, 128), Image.Resampling.LANCZOS)
        thumb.save(OUT / f'{ident}-{part}-ref.webp', 'WEBP', quality=85, method=6)
        entry['parts'][part] = {'image': fn, 'reference': f'{ident}-{part}-ref.webp', 'label': names[k]}
    manifest['looks'].append(entry)
(OUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Exported {len(LOOKS)} looks; {sum(p.stat().st_size for p in OUT.iterdir()) / 1024:.0f} KiB total')
