#!/usr/bin/env python3
"""Analiza tempo y fase de beats de una pista (para alinearla a la rejilla del montaje).
Uso: python3 scripts/analyze-beats.py pista.mp3 [bpm_objetivo]
Imprime: tempo estimado, offset del primer beat (s), fuerza por posición del compás (¿dónde está el 1?)."""
import subprocess, sys, numpy as np
from scipy.signal import stft, find_peaks

def load(path, sr=22050):
    raw = subprocess.check_output(['ffmpeg','-loglevel','error','-i',path,'-ac','1','-ar',str(sr),'-f','f32le','-'])
    return np.frombuffer(raw, dtype=np.float32), sr

def onset_env(x, sr, hop=256, lo=None, hi=None):
    f, t, Z = stft(x, sr, nperseg=1024, noverlap=1024-hop)
    M = np.log1p(np.abs(Z) * 30)
    if lo is not None:
        idx = (f >= lo) & (f < hi); M = M[idx]
    flux = np.maximum(0, np.diff(M, axis=1)).sum(axis=0)
    flux = np.concatenate([[0], flux])
    flux = (flux - flux.mean()) / (flux.std() + 1e-9)
    return flux, hop / sr

def tempo(env, dt, lo=70, hi=140):
    n = len(env)
    ac = np.correlate(env - env.mean(), env - env.mean(), 'full')[n-1:]
    lags = np.arange(len(ac)) * dt
    best, bv = None, -1e9
    for bpm in np.arange(lo, hi, 0.05):
        L = 60.0 / bpm
        v = 0
        for k in (1, 2, 4):
            idx = int(round(L * k / dt)); 
            if idx < len(ac): v += ac[idx] / k
        if v > bv: best, bv = bpm, v
    return best

def phase(env, dt, bpm):
    L = 60.0 / bpm
    best, bv = 0, -1e9
    for off in np.arange(0, L, dt / 2):
        ts = np.arange(off, len(env) * dt, L)
        v = sum(env[min(int(t / dt), len(env)-1)] for t in ts)
        if v > bv: best, bv = off, v
    return best

if __name__ == '__main__':
    path = sys.argv[1]
    x, sr = load(path)
    env, dt = onset_env(x, sr)
    bpm = tempo(env, dt)
    off = phase(env, dt, bpm)
    print(f'duración {len(x)/sr:.2f}s · tempo ≈ {bpm:.2f} BPM · primer beat en {off:.3f}s')
    # ¿cuál de los 4 tiempos es el "1"? el que tiene más energía grave
    low, dtl = onset_env(x, sr, lo=30, hi=160)
    L = 60.0 / bpm
    score = np.zeros(4)
    for k, t in enumerate(np.arange(off, len(x)/sr - L, L)):
        score[k % 4] += low[min(int(t/dtl), len(low)-1)]
    print('energía grave por tiempo del compás (1..4):', np.round(score / score.sum(), 2))
    print('beats en 0–6 s:', [round(float(t),3) for t in np.arange(off, 6, L)])
