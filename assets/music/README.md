# Música

`base-100bpm-a.mp3` — pista instrumental original generada con ElevenLabs Music (sin voces ni samples de canciones
existentes), a **100 BPM** exactos (1 beat = 18 frames a 30 fps, 1 compás = 72 f), primer golpe en el fotograma 0.
Procesada con `scripts/make-music-bed.sh` (recorte de graves/mediograves para dejar espacio a la voz).

Prompt: ver `scripts/generate-music.ts` (clave `a`). Tempo verificado con `scripts/analyze-beats.py` (≈ 99.9–100 BPM,
deriva < 10 ms en 30 s). Mantener aquí la proveniencia de cada pista.
Nada de música con derechos de autor ni himnos oficiales (BRAND.md §5.6).

`base-100bpm-b.mp3` — misma receta que la «a» pero de **60 s** (para los videos de 30–50 s). Compás fuerte en el fotograma 0
(offset recortado 0.029 s), tempo medido 100.0 BPM con deriva ≤ 12 ms. Prompt: `scripts/generate-music.ts` (clave `b`).

## Camas por ánimo (22-nov-2026) — todas a 100 BPM, 60 s, sin voces
Generadas con ElevenLabs Music (`npm run music -- c|d|e`), recortadas al primer golpe y procesadas con `scripts/make-music-bed.sh`.
Tempo medido con `scripts/analyze-beats.py` ≈ 99.9 BPM (deriva < 12 ms).

- `base-100bpm-c.mp3` — **tensión / misterio** (robos, desapariciones, secuestros, giros oscuros): bajo sintético pulsante, hi-hat, cuerdas pulsadas en re menor, piano seco.
- `base-100bpm-d.mp3` — **sobria / emotiva** (tragedias, homenajes): piano de fieltro en arpegios, colchón de cuerdas, bombo suave en 1 y 3; sin aplausos ni caídas.
- `base-100bpm-e.mp3` — **ligera / curiosa** (datos absurdos, anécdotas, humor): pizzicato, marimba en do mayor, chasquidos en 2 y 4, contrabajo caminando.
- `base-100bpm-b.mp3` sigue siendo la cama base (estomp + palmas). **Pendiente: que el dueño las escuche y apruebe** (no se pueden oír desde la nube).
