#!/usr/bin/env bash
# Genera efectos de sonido PLACEHOLDER con ffmpeg (síntesis pura, sin derechos).
# Sirven para probar el montaje con sonido. Reemplazar por los definitivos (BRAND.md §5.6):
#   npm run sfx   → ElevenLabs Sound Effects (requiere ELEVENLABS_API_KEY)
# Uso: bash scripts/synth-placeholder-sfx.sh [carpeta_salida]
set -euo pipefail
OUT="${1:-assets/sfx}"
mkdir -p "$OUT"
SR=44100

# gen <nombre> <duración_s> <expresión aevalsrc> [filtros de audio]
gen() {
  local name="$1" dur="$2" expr="$3" af="${4:-anull}"
  ffmpeg -y -loglevel error -f lavfi -i "aevalsrc='${expr}':d=${dur}:s=${SR}" \
    -af "${af},alimiter=limit=0.85:level=disabled" -ac 1 -ar ${SR} -c:a pcm_s16le "${OUT}/${name}.wav"
  echo "  ✓ ${name}.wav (${dur}s)"
}
N='(random(0)*2-1)'

echo "Sintetizando placeholders en ${OUT}/"

gen sfx_keys 0.9 "0.3*(sin(2*PI*3100*t)*exp(-14*t)+0.8*gt(t,0.09)*sin(2*PI*4300*(t-0.09))*exp(-12*(t-0.09))+0.7*gt(t,0.19)*sin(2*PI*5200*(t-0.19))*exp(-11*(t-0.19))+0.6*gt(t,0.31)*sin(2*PI*3700*(t-0.31))*exp(-10*(t-0.31))+0.5*gt(t,0.46)*sin(2*PI*4700*(t-0.46))*exp(-9*(t-0.46)))+0.04*${N}*exp(-30*t)"
gen sfx_lock 0.25 "0.7*${N}*exp(-140*t)+0.5*sin(2*PI*950*t)*exp(-70*t)+gt(t,0.1)*(0.8*${N}*exp(-160*(t-0.1))+0.6*sin(2*PI*1500*(t-0.1))*exp(-80*(t-0.1)))" "highpass=f=300"
gen sfx_creak 1.0 "0.45*sin(2*PI*(310*t+55*t*t)+2.6*sin(2*PI*7*t))*min(1,t*12)*exp(-1.6*t)+0.12*${N}*min(1,t*12)*exp(-2*t)" "lowpass=f=2600,highpass=f=120"
gen sfx_slam 0.7 "0.95*sin(2*PI*62*t)*exp(-9*t)+0.5*${N}*exp(-38*t)+0.25*sin(2*PI*410*t)*exp(-11*t)+0.18*sin(2*PI*790*t)*exp(-14*t)"
gen sfx_whistle 0.5 "0.38*sin(2*PI*2900*t+7*sin(2*PI*38*t))*min(1,t*60)*min(1,(0.5-t)*25)+0.05*${N}*min(1,t*60)*min(1,(0.5-t)*25)" "highpass=f=1200"
gen sfx_stamp 0.35 "0.95*sin(2*PI*105*t)*exp(-26*t)+0.45*${N}*exp(-85*t)+0.2*sin(2*PI*320*t)*exp(-30*t)"
gen sfx_tape 0.6 "0.5*${N}*(0.55+0.45*sin(2*PI*95*t))*min(1,t*25)*exp(-3.5*t)+gt(t,0.42)*0.4*${N}*exp(-60*(t-0.42))" "highpass=f=1800,lowpass=f=9000"
gen sfx_type_loop 1.0 "0.5*${N}*exp(-210*mod(t,0.11))+0.35*sin(2*PI*1500*t)*exp(-160*mod(t,0.11))+0.4*${N}*exp(-230*mod(t+0.04,0.173))" "highpass=f=400"
gen sfx_ding 0.9 "0.42*sin(2*PI*2400*t)*exp(-5.5*t)+0.2*sin(2*PI*4820*t)*exp(-8*t)+0.1*sin(2*PI*7200*t)*exp(-12*t)"
gen sfx_chalk 0.6 "0.5*${N}*(0.5+0.5*sin(2*PI*38*t))*min(1,t*30)*min(1,(0.6-t)*15)" "highpass=f=2500,lowpass=f=8000"
gen sfx_marker 0.5 "0.5*${N}*sin(PI*t/0.5)*(0.7+0.3*sin(2*PI*22*t))" "highpass=f=900,lowpass=f=5500"
gen sfx_paper_slide 0.45 "0.55*${N}*sin(PI*t/0.45)*sin(PI*t/0.45)" "highpass=f=1200,lowpass=f=7000"
gen sfx_thump 0.35 "0.95*sin(2*PI*55*t)*exp(-13*t)+0.25*${N}*exp(-55*t)"
gen sfx_wink 0.45 "0.32*sin(2*PI*(1800*t+2600*t*t))*exp(-8*t)+0.2*gt(t,0.08)*sin(2*PI*(2900*(t-0.08)+2600*(t-0.08)*(t-0.08)))*exp(-9*(t-0.08))"
gen sfx_key_drop 0.4 "0.4*sin(2*PI*4100*t)*exp(-24*t)+0.3*sin(2*PI*2700*t)*exp(-17*t)+0.35*${N}*exp(-170*t)+0.2*gt(t,0.07)*sin(2*PI*3600*(t-0.07))*exp(-22*(t-0.07))"

# Ambiente de camerino: rumor bajo + goteo lejano (loop de 12 s)
ffmpeg -y -loglevel error \
  -f lavfi -i "anoisesrc=color=brown:amplitude=0.5:d=12:sample_rate=${SR}" \
  -f lavfi -i "aevalsrc='0.35*(gt(mod(t,12),3.1)*lt(mod(t,12),3.6)*sin(2*PI*2200*t)*exp(-30*(mod(t,12)-3.1))+gt(mod(t,12),8.4)*lt(mod(t,12),8.9)*sin(2*PI*1900*t)*exp(-26*(mod(t,12)-8.4)))':d=12:s=${SR}" \
  -filter_complex "[0:a]lowpass=f=420,volume=0.35[a];[1:a]aecho=0.7:0.6:180:0.5[b];[a][b]amix=inputs=2:normalize=0,alimiter=limit=0.8:level=disabled" \
  -ac 1 -ar ${SR} -c:a pcm_s16le "${OUT}/amb_locker_room.wav"
echo "  ✓ amb_locker_room.wav (12s)"
echo "Listo. (placeholders — reemplazar antes de publicar)"
