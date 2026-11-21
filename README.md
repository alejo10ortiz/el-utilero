# EL UTILERO

> «Cierren la puerta, que les cuento.» — Videos cortos de fútbol: datos reales, contados como secreto.

Biblia de marca y producción: [`BRAND.md`](./BRAND.md). Guía para Claude Code: [`CLAUDE.md`](./CLAUDE.md).

## Inicio rápido

```bash
npm install
cp .env.example .env            # añade ELEVENLABS_API_KEY cuando la tengas
npm run dev                     # Remotion Studio → composición "Short"
npm run verify -- 001           # regla de oro: 2 fuentes por dato
npm run render -- 001 --draft   # borrador rápido (sin voz real usa tiempos estimados)
```

Producir un episodio real:

1. Escribir `episodes/NNN-slug/episode.json` (copiar el 001) y registrarlo en `src/episodes.ts`.
2. Verificar datos con 2 fuentes de dominios distintos → `"estado": "verificado"` (`scripts/verify-sources.md`).
3. `npm run voice -- NNN` → `voice.mp3` + `words.json` (la duración de cada escena sale del audio).
4. `npm run render -- NNN` → `out/NNN-slug/short.mp4` (−14 LUFS) + miniatura + post.
5. Revisar en un celular real. Publicar.

## Qué hay hecho

| Fase | Estado |
|---|---|
| 0 · Base (Remotion, `brand.ts`, fuentes, grano) | ✅ |
| 1 · Componentes A01–A07, A11 con sonido | ✅ (SFX placeholder) |
| 2 · Casillero 3D + A08/A09 + sting de 2 s | ✅ |
| 3 · Personaje: rig SVG, 8 expresiones, 8 visemas, sincronía labial | ✅ (arte base; reemplazar por el del ilustrador) |
| 4 · Voz ElevenLabs + tiempos por palabra | 🟡 script listo, falta `voice_id` y API key |
| 5 · Episodio #001 completo | 🟡 renderiza con voz estimada; falta voz real y revisión en celular |
| 6 · Escala #002–#010 | ⬜ verificar fuentes primero |

Composiciones de referencia en el Studio: `F1-Componentes`, `F2-Casillero`, `F3-UtileroHabla`, `Hoja-Expresiones`, `Hoja-Logo`.

## Licencias
Remotion tiene términos de licencia propios para uso comercial según el tamaño de la empresa: revisar antes de monetizar. Fuentes: Google Fonts (OFL). Efectos actuales: sintetizados localmente (sin derechos).
