#!/usr/bin/env python3
"""Mide duración y pico de cada efecto en assets/sfx → assets/sfx/_timing.json (Sfx alinea el PICO al frame indicado)."""
import subprocess, numpy as np, glob, os, json
out = {}
for f in sorted(glob.glob('assets/sfx/sfx_*.wav')):
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', f, '-ac', '1', '-ar', '22050', '-f', 'f32le', '-'])
    x = np.frombuffer(raw, dtype=np.float32); sr = 22050
    win = int(0.01 * sr); env = np.sqrt(np.convolve(x ** 2, np.ones(win) / win, 'same'))
    out[os.path.basename(f)[4:-4]] = {'dur': round(len(x) / sr, 2), 'pico': round(env.argmax() / sr, 2), 'onset50': round(np.argmax(env > 0.5 * env.max()) / sr, 2)}
json.dump(out, open('assets/sfx/_timing.json', 'w'), indent=1)
print(len(out), 'efectos medidos')
