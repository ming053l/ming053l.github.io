#!/usr/bin/env bash
# Homepage preview encodes: each video is shown ~380 px wide (460 px on mobile), so 854 px covers 2x screens.
# Writes images/web/<name>.mp4 (H.264, 2 s GOP, faststart so it streams while downloading) and images/web/<name>.webp (poster).
# Usage: tools/web_media.sh images/foo.mp4 images/foo.webp NAME
set -euo pipefail
src=$1; poster=$2; name=$3; out=images/web
ffmpeg -v error -y -i "$src" -vf "scale=854:-2:flags=lanczos" -c:v libx264 -preset veryslow -crf 31 -profile:v high -pix_fmt yuv420p \
  -g 60 -an -movflags +faststart "$out/$name.mp4"
ffmpeg -v error -y -i "$poster" -vf "scale=854:-2:flags=lanczos" -quality 80 "$out/$name.webp"
