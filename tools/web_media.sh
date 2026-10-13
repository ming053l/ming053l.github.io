#!/usr/bin/env bash
# Homepage preview encodes: each video is shown ~380 px wide (460 px on mobile), so 854 px covers 2x screens.
# Writes, under images/web/:
#   <name>.mp4       854 px H.264 crf 31, capped at 1.2 Mbit/s (2.4 Mbit VBV buffer) so bursts never stall a slow link
#   <name>-lite.mp4  640 px H.264 crf 33, capped at 600 kbit/s; previews.js picks it on Save-Data / 2g / 3g / downlink < 3 Mbit/s
#   <name>.webp      854 px poster (WebP q80, universal fallback)
#   <name>.avif      854 px poster (AVIF, ~half the bytes), served first through <picture>
# All videos: 2 s GOP, no audio, faststart (moov first) so they stream while downloading.
# AVIF needs Pillow >= 11.3 built with libavif. Install it into a private folder, never a shared env, e.g.
#   python3 -m pip install --target ~/.cache/pyavif "pillow>=11.3" && export PYTHONPATH=~/.cache/pyavif
# Usage: tools/web_media.sh images/foo.mp4 images/foo.webp NAME
#   all at once: printf '%s\n' name1 name2 ... | xargs -P 8 -I{} tools/web_media.sh images/{}.mp4 images/{}.webp {}
# After re-encoding, bump the ?v= query on the matching URLs in _pages/about.md.
set -euo pipefail
src=$1; poster=$2; name=$3; out=images/web
x264="-c:v libx264 -preset veryslow -profile:v high -pix_fmt yuv420p -g 60 -an -movflags +faststart"
ffmpeg -v error -y -i "$src" -vf "scale=854:-2:flags=lanczos" $x264 -crf 31 -maxrate 1200k -bufsize 2400k "$out/$name.mp4"
ffmpeg -v error -y -i "$src" -vf "scale=640:-2:flags=lanczos" $x264 -crf 33 -maxrate 600k -bufsize 1200k "$out/$name-lite.mp4"
ffmpeg -v error -y -i "$poster" -vf "scale=854:-2:flags=lanczos" -quality 80 "$out/$name.webp"
${PYTHON:-python3} - "$poster" "$out/$name.avif" <<'EOF'
import sys
from PIL import Image, features
if not features.check("avif"):
    sys.exit("web_media.sh: this Pillow has no AVIF support (see the header of this script)")
im = Image.open(sys.argv[1]).convert("RGB")
w = 854; h = round(im.height * w / im.width / 2) * 2
im.resize((w, h), Image.LANCZOS).save(sys.argv[2], quality=60, speed=2)
EOF
