#!/usr/bin/env bash
# Normaliza el audio de un MP4 a -14 LUFS (doble pasada, sin recomprimir el video).
# Uso: bash scripts/normalize-audio.sh entrada.mp4 salida.mp4
set -euo pipefail
IN="$1"; OUT="$2"
STATS=$(ffmpeg -hide_banner -i "$IN" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -vn -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$STATS" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -y -hide_banner -loglevel error -i "$IN" \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" \
  -c:v copy -c:a aac -b:a 192k -ar 48000 "$OUT"
echo "✓ $OUT  (-14 LUFS)"
