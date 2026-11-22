# EL UTILERO — instrucciones para Claude Code

Videos cortos de fútbol (Shorts/Reels/TikTok 1080×1920). Narrador ficticio (un utilero viejo), **datos reales con fuente**.
La fuente de verdad de marca es **`BRAND.md`** — léelo antes de tocar diseño, personaje, sonido o guion.

## Reglas que no se negocian
1. **Regla de oro:** ningún dato sale sin 2 fuentes de dominios distintos en `episodes/*/episode.json`. `estado: "verificado"` solo tras contrastar. `npm run verify -- NNN`.
2. **Sin imágenes con derechos**: nada de fotos de partidos/personas, logos de FIFA/federaciones/clubes. Todo se dibuja (objetos genéricos, 2 tintas).
3. **No inventar datos.** Si un dato falta o es dudoso → no entra al guion; se pregunta.
4. **Look "Archivo del camerino"** (BRAND.md §2): nada de tarjetas redondeadas ni degradados de UI; papel, cinta, sellos, tiza. Rojo solo en sellos. Nunca texto sobre texto. Grano siempre. Todo color/fuente sale de `config/brand.ts`.
5. Zonas seguras 1080×1920: arriba 150 px, abajo 420 px, derecha 140 px libres de texto importante (`SAFE_BOX`).

## Comandos
```bash
npm run dev                          # Remotion Studio (composiciones: Short, F1/F2/F3, Hoja-*, Miniatura, Post)
npm run verify -- 001 [--online]     # verificador editorial
npm run voice -- 001 [--dry|--force] # ElevenLabs → assets/episodes/<slug>/voice.mp3 + words.json  (necesita .env)
npm run sfx -- --force               # reemplaza SFX placeholder por ElevenLabs (necesita .env)
npm run render -- 001 [--draft|--web] # video final (máster CRF 18; --web añade short-web.mp4 CRF 23, ~la mitad de peso) + miniatura + post → out/001-pickles/ (igual con P01, P02, P03)
npm run timeline -- P01              # tiempos por escena (voz real o estimados)
npx tsx scripts/stills.ts Short 100,300 001-pickles   # cuadros sueltos para revisar → out/stills/Short-<slug>-<frame>.png
npm run typecheck
```
En este entorno cloud: `export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium` antes de renderizar.
La clave de ElevenLabs no está en `.env`: la inyecta el proxy del entorno `el-utilero` (host permitido: `api.elevenlabs.io`). Para correr los scripts: `NODE_USE_ENV_PROXY=1 ELEVENLABS_API_KEY=proxy-injected npm run voice -- P01` (Node no usa el proxy sin esa variable). La clave es restringida (solo los permisos que se le dieron); si un script falla con `missing_permissions`, falta ese permiso en la clave.

## Arquitectura
- `config/brand.ts` paleta, fuentes, zonas seguras, duraciones de animación (A01–A11). `config/voice.json` voz de ElevenLabs.
- `episodes/NNN-slug/episode.json` guion estructurado + fuentes (esquema zod en `src/lib/episode.ts`). Registrar en `src/episodes.ts`.
- **Presentaciones de la cuenta**: `episodes/P01…/episode.json` con `"formato": "presentacion"` (sin datos deportivos → sin fuentes; el verificador exige que cualquier año nombrado se declare como cuento del personaje: «dicen…», «mito», «personaje»). Escenas extra: `casilleros`, `serie` (carpeta kraft), `secreto`; `apertura` admite `logo: true`. Placa del casillero = `casilleroNumero` ("000"). El @usuario sale de `textoFinal` (`handleDe()`).
- `assets/` es el `publicDir` de Remotion (`staticFile()`): `fonts/`, `sfx/`, `episodes/<slug>/{voice.mp3,words.json}` (generados), más `textures/ character/ objects/ locker/ logo/` para arte real.
- `src/lib/timeline.ts`: tiempos por escena y por palabra. Con `words.json` (voz real) manda el audio; sin él, estimación (~2.3 palabras/s) para previsualizar.
- `src/components/`: Cinta, Sello, Ficha, PalabraGigante, Trazo (Tiza/Marcador), NivelSecreto, Subtitulos, Casillero, Objeto, Utilero (rig SVG: 8 expresiones, 8 visemas, parpadeo, respiración), Portazo, Carpeta, Logo (Logotipo/Escudo/Avatar/LlaveBalon), Grano, Fondo, CamaraMesa, Defs (filtros SVG), Sfx.
- `src/scenes/`: Gancho, Sting, Apertura, Contexto, Giro, Remate, Cierre (+ Casilleros, Serie, Secreto para presentaciones) → ensambladas por `src/compositions/Short.tsx` desde `episode.json`.
- Cada componente animado reproduce su propio SFX (`<Sfx name=… at=…/>`, archivos `assets/sfx/sfx_*.wav`).

## Estado (ver BRAND.md §11)
Fases 0–3 hechas en código (SVG base). SFX actuales = **placeholders sintetizados** (`scripts/synth-placeholder-sfx.sh`).
Voz definida (`config/voice.json`: «El Utilero») y usuario @elutilerofutbol (`HANDLE` en `config/brand.ts`). Pendiente humano: permiso Text to Speech en la clave de ElevenLabs, ilustrador (hoja de modelo §4.8 → reemplazar capas del rig), texturas reales (§2.5), usuarios @elutilero, verificar historias #003–#009.

## Convenciones
- Código y comentarios en español (el proyecto y su audiencia lo son); nombres de componentes en español como en BRAND.md.
- Un componente nuevo = una animación de §5.2 + su sonido. No hay fundidos genéricos: las transiciones son objetos.
- Antes de dar algo por hecho visualmente, renderiza cuadros con `scripts/stills.ts` y míralos.
