# Música

`base-100bpm-a.mp3` — pista instrumental original generada con ElevenLabs Music (sin voces ni samples de canciones
existentes), a **100 BPM** exactos (1 beat = 18 frames a 30 fps, 1 compás = 72 f), primer golpe en el fotograma 0.
Procesada con `scripts/make-music-bed.sh` (recorte de graves/mediograves para dejar espacio a la voz).

Prompt: ver `scripts/generate-music.ts` (clave `a`). Tempo verificado con `scripts/analyze-beats.py` (≈ 99.9–100 BPM,
deriva < 10 ms en 30 s). Mantener aquí la proveniencia de cada pista.
Nada de música con derechos de autor ni himnos oficiales (BRAND.md §5.6).

`base-100bpm-b.mp3` — misma receta que la «a» pero de **60 s** (para los videos de 30–50 s). Compás fuerte en el fotograma 0
(offset recortado 0.029 s), tempo medido 100.0 BPM con deriva ≤ 12 ms. Prompt: `scripts/generate-music.ts` (clave `b`).
