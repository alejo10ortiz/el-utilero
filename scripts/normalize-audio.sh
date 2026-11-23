#!/usr/bin/env bash
# Normaliza el audio de un MP4 a -14 LUFS (doble pasada, sin recomprimir el video), limita el pico con un limitador
# sobremuestreado y VERIFICA el pico real del AAC resultante: el codec puede desbordar hasta ~3 dB sobre el techo del
# limitador (P03, #011, #012), así que si el pico final pasa de -1 dBFS se repite con un techo más bajo.
# Uso: bash scripts/normalize-audio.sh entrada.mp4 salida.mp4
set -euo pipefail
IN="$1"; OUT="$2"
STATS=$(ffmpeg -hide_banner -i "$IN" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -vn -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$STATS" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
LN="loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000,aresample=192000"
LIM=0.75
for intento in 1 2 3 4 5; do
  ffmpeg -y -hide_banner -loglevel error -i "$IN" \
    -af "${LN},alimiter=limit=${LIM}:level=disabled:attack=3:release=40,aresample=48000" \
    -c:v copy -c:a aac -b:a 256k -ar 48000 "$OUT"
  PICO=$(ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+Peak:" | tail -1 | awk '{print $2}')
  echo "  intento $intento: techo del limitador ${LIM} → pico real ${PICO} dBFS"
  if awk "BEGIN{exit !(${PICO} <= -1.0)}"; then break; fi
  LIM=$(awk "BEGIN{printf \"%.2f\", ${LIM} - 0.07}")
done
echo "✓ $OUT  (-14 LUFS, pico ${PICO} dBFS)"
