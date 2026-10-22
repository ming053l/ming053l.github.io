# IrisMix playground

Static, browser-only demonstration linked from the homepage at `/IrisMix/`.
Serve the homepage repository with a static HTTP server to preview; no build,
backend, API keys or model dependencies are required.

The four looks use the same synthetic adult source portrait and prepared outputs
from the existing IrisMix teaser. The browser composites transparent eye, lip and
face layers and adjusts opacity and lip hue. Mixed combinations are browser layer
composites; they do not trigger a new Stage II render. The interface explains this
and does not accept uploads. All examples come from LayerBeauty, not restricted
external evaluation datasets.

Assets are exported on CPU by `tools/export_irismix_demo.py` from the existing
teaser cache. Exported files are checked in so GitHub Pages needs only static
files. The shared part partition keeps selectable regions consistent across the
four looks; assets are 640 × 640 WebP with alpha. Reference thumbnails are 128 ×
128. The complete palette is about 741 KiB.

Controls: four presets, independent part selection/removal, per-part strength,
lip hue, original comparison, reset, shuffle and PNG download. Download always
exports the current mix, including when the original is temporarily shown.
