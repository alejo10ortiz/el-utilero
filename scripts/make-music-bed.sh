#!/usr/bin/env bash
# Prepara una pista como "cama" bajo la voz: alinea el primer golpe al fotograma 0, recorta graves
# y mediograves donde vive la voz del Utilero, y deja el pico en −3 dBFS.
# Uso: bash scripts/make-music-bed.sh pista_cruda.mp3 salida.mp3 [offset_s=0.025]
set -euo pipefail
IN="$1"; OUT="$2"; OFF="${3:-0.025}"
ffmpeg -y -loglevel error -ss "$OFF" -i "$IN" \
  -af "highpass=f=45,equalizer=f=280:t=q:w=0.9:g=-5,equalizer=f=900:t=q:w=1:g=-2,equalizer=f=3500:t=q:w=1:g=2,volume=-3dB,alimiter=limit=0.7:level=disabled" \
  -c:a libmp3lame -b:a 192k "$OUT"
echo "✓ $OUT"
