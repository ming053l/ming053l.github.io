"""Export local CPU face geometry for the four IrisMix cosmetic-painting portraits.

Default is read-only. --write writes assets/cosmetics/face-guides.json only.
The existing 640px display WebPs and bundled Face Landmarker task are the inputs;
no photo, model, original manifest or inference-publication setting is modified.
"""
import argparse
import hashlib
import json
import math
import os
from pathlib import Path

import numpy as np
from PIL import Image

REPO = Path(__file__).resolve().parents[1]
SIZE = 640
EYES = {
    'subjectRight': {
        'upper': [33, 246, 161, 160, 159, 158, 157, 173, 133],
        'lower': [33, 7, 163, 144, 145, 153, 154, 155, 133],
        'browLower': [46, 53, 52, 65, 55],
        'browUpper': [70, 63, 105, 66, 107],
        'iris': [469, 470, 471, 472], 'irisCenter': 468,
        'outerEnd': 0,
    },
    'subjectLeft': {
        'upper': [362, 398, 384, 385, 386, 387, 388, 466, 263],
        'lower': [362, 382, 381, 380, 374, 373, 390, 249, 263],
        'browLower': [276, 283, 282, 295, 285],
        'browUpper': [300, 293, 334, 296, 336],
        'iris': [474, 475, 476, 477], 'irisCenter': 473,
        'outerEnd': -1,
    },
}
LIP_UPPER = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291]
LIP_LOWER = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291]
MOUTH_UPPER = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308]
MOUTH_LOWER = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308]
FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
             397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
             172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def xy(points):
    return np.round(np.asarray(points)[:, :2], 4).tolist()


def ring(upper, lower):
    return np.concatenate([upper, lower[-2:0:-1]])


def expand(points, margin):
    center = points.mean(0)
    direction = points - center
    length = np.linalg.norm(direction, axis=1, keepdims=True)
    return points + margin * direction / np.maximum(length, .01)


def ellipse(center, u, radii, count=32):
    v = np.array([-u[1], u[0]])
    angles = np.arange(count) / count * (2 * math.pi)
    return center + np.cos(angles)[:, None] * radii[0] * u + np.sin(angles)[:, None] * radii[1] * v


def bbox(polygons):
    points = np.concatenate(polygons)
    return np.round(np.r_[points.min(0), points.max(0)], 3).tolist()


def convex_hull(points):
    """Projected nose/lips can extend beyond the anatomical3D face-oval ring."""
    ordered = sorted(set(map(tuple, points)))
    def cross(a, b, c):
        return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
    def half(sequence):
        hull = []
        for point in sequence:
            while len(hull) >= 2 and cross(hull[-2], hull[-1], point) <= 0:
                hull.pop()
            hull.append(point)
        return hull
    return np.asarray(half(ordered)[:-1] + half(ordered[::-1])[:-1])


def geometry(points):
    p = points[:, :2] * SIZE
    eyes, upper_shadow, eye_exclusion, brows = {}, [], [], []
    for side, indices in EYES.items():
        upper, lower = p[indices['upper']], p[indices['lower']]
        brow = p[indices['browLower']]
        direction = upper[-1] - upper[0]
        width = np.linalg.norm(direction)
        u = direction / width
        up = np.array([u[1], -u[0]])
        # Interpolate the lower eyebrow in eye-local coordinates. Stop72% of
        # the way toward it, retaining a gap rather than tinting the eyebrow.
        bt = brow @ u
        order = np.argsort(bt)
        brow_height = np.interp(upper @ u, bt[order], (brow @ up)[order])
        distance = np.clip(brow_height - upper @ up, width * .08, width * .4)
        top = upper + up * (distance * .72)[:, None]
        bottom = upper.copy()
        outer = indices['outerEnd']
        outward = -1 if outer == 0 else 1
        bottom[outer] += u * outward * width * .06 + up * width * .015
        top[outer] += u * outward * width * .08
        shadow = np.concatenate([bottom, top[::-1]])
        eyeball = ring(upper, lower)
        eye_guard = expand(eyeball, 1.1)
        iris = p[indices['iris']]
        iris_center = p[indices['irisCenter']]
        radius = float(np.max(np.linalg.norm(iris - iris_center, axis=1)))
        iris_guard = ellipse(iris_center, np.array([1., 0.]), [radius + .8, radius + .8])
        lower_shadow = np.concatenate([lower, (lower - up * width * .11)[::-1]])
        brow_polygon = ring(p[indices['browUpper']], p[indices['browLower']])
        eyes[side] = {
            'upperLid': xy(upper), 'lowerLid': xy(lower), 'eyeball': xy(eyeball),
            'eyeballGuard': xy(eye_guard), 'upperShadow': xy(shadow),
            'lowerShadowOptional': xy(lower_shadow),
            'iris': {'center': np.round(iris_center, 4).tolist(), 'radius': round(radius, 4),
                     'boundary': xy(iris), 'fullCircle': xy(iris_guard),
                     'paintProtection': 'Use the visible eyeball guard, not the full iris circle, which continues behind the upper lid.'},
            'browLower': xy(brow), 'browPolygon': xy(brow_polygon),
            'eyeWidth': round(float(width), 4),
            'basis': {'horizontal': np.round(u, 6).tolist(), 'up': np.round(up, 6).tolist()},
        }
        upper_shadow.append(shadow)
        eye_exclusion.append(eye_guard)
        brows.append(brow_polygon)

    outer_lip = ring(p[LIP_UPPER], p[LIP_LOWER])
    inner_lip = ring(p[MOUTH_UPPER], p[MOUTH_LOWER])
    mouth_guard = expand(inner_lip, .8)
    cheeks = {}
    for side, group in [('subjectRight', [50, 101, 205, 187, 123]),
                        ('subjectLeft', [280, 330, 425, 411, 352])]:
        apple, inner, lower, outside_lower, outer = p[group]
        center = (apple + inner + lower + outside_lower) / 4
        axis = outer - inner
        width = float(np.linalg.norm(axis))
        u = axis / width
        radii = [max(12., width * .75), max(12., float(np.linalg.norm(lower - inner)) * .70)]
        polygon = ellipse(center, u, radii)
        cheeks[side] = {'center': np.round(center, 4).tolist(), 'radii': np.round(radii, 4).tolist(),
                        'angleRadians': round(math.atan2(u[1], u[0]), 6), 'polygon': xy(polygon)}

    face_oval = p[FACE_OVAL]
    face_clip = convex_hull(p[:468])
    return {
        'coordinateSize': SIZE,
        'landmarksNormalized': np.round(points, 8).tolist(),
        'faceOval': xy(face_oval),
        'faceClip': xy(face_clip),
        'parts': {
            'eyes': {'polygons': [xy(poly) for poly in upper_shadow], 'clipFace': True},
            'lips': {'polygons': [xy(outer_lip)], 'clipFace': True},
            'blush': {'polygons': [item['polygon'] for item in cheeks.values()], 'clipFace': True},
        },
        'exclude': {
            'eyes': [xy(poly) for poly in eye_exclusion + brows + [mouth_guard]],
            'lips': [xy(mouth_guard)],
            'blush': [xy(poly) for poly in eye_exclusion + [outer_lip]],
        },
        'excludePolygons': [xy(poly) for poly in eye_exclusion + [mouth_guard]],
        'eyes': eyes,
        'mouth': {'upperLip': xy(p[LIP_UPPER]), 'lowerLip': xy(p[LIP_LOWER]),
                  'outerLip': xy(outer_lip), 'innerLip': xy(inner_lip),
                  'mouthGuard': xy(mouth_guard),
                  'openingHeight': round(float(np.linalg.norm(p[13] - p[14])), 4)},
        'cheeks': cheeks,
        'bounds': {'eyes': bbox(upper_shadow), 'lips': bbox([outer_lip]),
                   'blush': bbox([np.asarray(item['polygon']) for item in cheeks.values()]),
                   'face': bbox([face_clip])},
    }


def build(assets, model):
    # Explicit CPU delegate: this offline tool never initializes a CUDA model.
    os.environ.setdefault('MPLCONFIGDIR', '/tmp/irismix-cosmetics-mpl')
    import mediapipe as mp
    manifest = json.loads((assets / 'manifest.json').read_text())
    expected = ['studio', 'night', 'smile', 'warm']
    if [s['id'] for s in manifest['sources']] != expected:
        raise ValueError('Expected only the four retained public demo sources')
    options = mp.tasks.vision.FaceLandmarkerOptions(
        base_options=mp.tasks.BaseOptions(model_asset_path=str(model), delegate=mp.tasks.BaseOptions.Delegate.CPU),
        num_faces=1, min_face_detection_confidence=.6, min_face_presence_confidence=.6)
    sources = {}
    with mp.tasks.vision.FaceLandmarker.create_from_options(options) as detector:
        for source in manifest['sources']:
            filename = source['image']
            if Path(filename).name != filename:
                raise ValueError('Expected a simple source asset filename')
            data = (assets / filename).read_bytes()
            image = np.asarray(Image.open(assets / filename).convert('RGB'))
            if image.shape != (SIZE, SIZE, 3):
                raise ValueError('Expected the exact640px displayed source image')
            faces = detector.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=image)).face_landmarks
            if len(faces) != 1 or len(faces[0]) != 478:
                raise ValueError('Expected one478-point face: ' + source['id'])
            points = np.array([[p.x, p.y, p.z] for p in faces[0]], np.float64)
            guide = geometry(points)
            guide['image'] = '../v3/' + filename
            guide['sourceSHA256'] = sha(data)
            sources[source['id']] = guide
    return {
        'version': 1, 'format': 'irismix-cosmetic-face-guides-v1', 'coordinateSize': SIZE,
        'coordinates': 'All polygons/centers/bounds are source pixels at640x640; landmarksNormalized contains478 normalizedXYZ points. No mirroring.',
        'sideNaming': 'subjectRight is the person right, normally viewer left; subjectLeft is normally viewer right.',
        'detector': {'name': 'MediaPipe Face Landmarker', 'runtime': 'Python CPU/XNNPACK',
                     'runtimeVersion': mp.__version__, 'taskSHA256': sha(model.read_bytes()),
                     'taskFile': '../../vendor/mediapipe/face_landmarker.task'},
        'maskContract': 'Rasterize allowed polygons; intersect faceClip for clipFace; subtract per-part exclude polygons. faceOval is the raw anatomical contour, faceClip includes all projected facial landmarks. Apply final protection clipping after softness/blur and color blending.',
        'limitations': [
            'Landmark geometry is not hair/occlusion segmentation. Upper-eye paint is limited below the eyebrow and cheek paint to the face; hair over skin may still require manual erasing.',
            'Teeth and mouth cavity are protected by the inner-lip contour, including the smile portrait.',
            'The default eye region is the upper eyelid toward72% of the lower-brow gap; lowerShadowOptional is available for an explicit lower-lid mode.',
        ],
        'sources': sources,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--assets-dir', type=Path, default=REPO / 'IrisMix/assets/v3')
    parser.add_argument('--model', type=Path, default=REPO / 'IrisMix/vendor/mediapipe/face_landmarker.task')
    parser.add_argument('--output', type=Path, default=REPO / 'IrisMix/assets/cosmetics/face-guides.json')
    parser.add_argument('--write', action='store_true')
    args = parser.parse_args()
    result = build(args.assets_dir, args.model)
    encoded = (json.dumps(result, ensure_ascii=False, separators=(',', ':')) + '\n').encode()
    if args.write:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        temporary = args.output.with_name('.' + args.output.name + '.tmp')
        temporary.write_bytes(encoded)
        temporary.replace(args.output)
    print(json.dumps({'mode': 'WRITE' if args.write else 'READ-ONLY PLAN', 'bytes': len(encoded),
                      'sha256': sha(encoded), 'sources': {sid: guide['bounds'] for sid, guide in result['sources'].items()}}, indent=2))


if __name__ == '__main__':
    main()
