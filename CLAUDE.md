# EL UTILERO — instrucciones para Claude Code

Videos cortos de fútbol (Shorts/Reels/TikTok 1080×1920). Narrador ficticio (un utilero viejo), **datos reales con fuente**.
La fuente de verdad de marca es **`BRAND.md`** — léelo antes de tocar diseño, personaje, sonido o guion.
**Concepto central: «El Camerino»** — cada video abre la puerta de un vestuario concreto (con rótulo LOCAL · VISITANTE · ÁRBITROS) con la llave del Utilero; numeración «Camerino #001». Todo lo visual debe leerse como **fútbol** a primera vista (pizarra táctica, camisetas numeradas, banca, guayos, balón, alineación); nada que se lea como deporte estadounidense (casilleros de gimnasio, etc.).

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
- **Presentaciones de la cuenta**: `episodes/P01…/episode.json` con `"formato": "presentacion"` (sin datos deportivos → sin fuentes; el verificador exige que cualquier año nombrado se declare como cuento del personaje: «dicen…», «mito», «personaje»). Escenas extra: `camerinos` (pasillo del túnel con las puertas LOCAL · VISITANTE · ÁRBITROS), `serie` (carpeta kraft), `secreto`; `apertura` admite `logo: true`. Número de la placa de la puerta = `camerinoNumero` ("000"). El @usuario sale de `textoFinal` (`handleDe()`).
- `assets/` es el `publicDir` de Remotion (`staticFile()`): `fonts/`, `sfx/`, `episodes/<slug>/{voice.mp3,words.json}` (generados), más `textures/ character/ objects/ locker/ logo/` para arte real.
- `src/lib/timeline.ts`: tiempos por escena y por palabra. Con `words.json` (voz real) manda el audio; sin él, estimación (~2.3 palabras/s) para previsualizar.
- `src/components/`: Cinta, Sello, Ficha, PalabraGigante, Trazo (Tiza/Marcador), NivelSecreto, Subtitulos, Camerino (puerta de vestuario 3D + interior: banca, camisetas, pizarra, guayos), Objeto, Utilero (rig SVG: 8 expresiones, 8 visemas, parpadeo, respiración), Portazo, Carpeta, Logo (Logotipo/Escudo/Avatar/LlaveBalon), Grano, Fondo, CamaraMesa, Defs (filtros SVG), Sfx.
- `src/scenes/`: Gancho, Sting, Apertura, Contexto, Giro, Remate, Cierre (+ Camerinos, Serie, Secreto para presentaciones) → ensambladas por `src/compositions/Short.tsx` desde `episode.json`.
- Cada componente animado reproduce su propio SFX (`<Sfx name=… at=…/>`, archivos `assets/sfx/sfx_*.wav`).

## Estado (ver BRAND.md §11)
P01, P02, P03 y #001 están en estilo **pro** (montaje al ritmo, música, SFX reales de ElevenLabs, transiciones-objeto) y con voz real («El Utilero»).
Usuario oficial @elutilerofutbol (`HANDLE` en `config/brand.ts`). Música: `base-100bpm-a` (30 s, P01) y `base-100bpm-b` (60 s, el resto).
Pendiente humano: ilustrador (hoja de modelo §4.8 → reemplazar capas del rig; el Utilero actual es el arte base en código), texturas reales (§2.5),
escuchar y aprobar música/SFX, verificar historias #003–#009, textos de publicación. #001 dura 48.6 s con la voz real (objetivo 30–45 s): decidir recorte.
Camerinos #002 (Copa robada dos veces, objeto `vitrina`), #003 (149–0 Madagascar, `balon`), #004 (mano de Dios, `bandera`), #005 (príncipe de Kuwait, `silbato`), #006 (¿mito? India 1950, `botin`), #007 (Maracanazo, `camiseta`), #008 (servilleta de Messi), #009 (Chapecoense/Nacional, tono sobrio), #010 (secuestro de Di Stéfano), #011 (escorpión de Higuita) y #012 (Libertadores 2018 en Madrid) producidos y subidos al repo privado alejo10ortiz/el-utilero-videos (buena calidad, <100 MB/archivo: `-crf 19 -maxrate 14M`); el catálogo de las 10 historias aprobadas (#002–#011, con orden de lanzamiento y estado de fuentes) está en BRAND.md §3.3. `giro` admite `gatillo`/`clave`/`tono: "misterio"` para historias que no son «aparece el objeto».
Cierre: **sin la frase «Esto no salió en la tele» en pantalla** (solo en la voz; el dueño la quitó): Utilero grande + cinta @usuario + «SÍGANME»; `cita` en un cierre es opcional.
GanchoPro: sin `kicker`, la primera línea del titular entra en f≈9 (antes esperaba a la voz); #001–#004 se renderizaron antes de ese arreglo. Titulares de gancho: máx. 2–3 líneas (si no, invaden la zona segura inferior).
Público: **todo el mundo hispanohablante** (BRAND.md §3.4): máx. 1 de cada 3 videos de Mundial, alternar países, lenguaje neutro («ustedes»; sin regionalismos), «vestuario» en textos para España; historias delicadas con `tono: "misterio"` (giro/remate/cierre sobrios, `expresion: "E7"`).
Regla de ritmo aprendida: **nunca pantalla vacía** — lo gigante entra en f≈11 y la palabra dicha solo lo refuerza (`cuando()` en `src/lib/voz.ts`).

## Estilo "pro" (montaje dinámico al ritmo) — `"estilo": "pro"` en episode.json
Un episodio en estilo pro **no es un cartel con elementos que aparecen**: cada escena está coreografiada sobre la rejilla musical.
- **Ritmo**: la música está a **100 BPM exactos** → 1 beat = 18 frames, 1 compás = 72 f (`src/lib/ritmo.tsx`). Toda escena dura un número entero de beats (el timeline lo cuantiza en `generate-voice`/`estimateTimeline`), así los cortes caen en tiempo. Los golpes se anclan a beats/corcheas (`snap`) o a la palabra dicha (la voz manda en lo sincrónico).
- **Regla de movimiento**: nada queda quieto más de ~1 s. Entradas con `slam`/`pop` (easing Bézier, anticipación, rebote, blur) → después vida continua: respiración, `boil` (12 fps), pulso al bombo, empuje de cámara (`empuje`), golpes de zoom (`golpes`), partículas con parallax.
- **Texto**: nunca estático. `Palabras` (subtítulos que saltan en el instante en que se dice cada palabra), `TituloImpacto` (titular que se clava por líneas), `LineaPalabras`, `LogotipoAnimado`, `CintaImpacto`.
- **Impactos**: `Impacto` = destello + onda de choque + chispas, junto con `impactos` de `CamaraMesa` (temblor) y un SFX alineado al golpe. `Sfx` alinea el *pico* del sonido (ver `assets/sfx/_timing.json`) al frame indicado.
- **Transiciones = objetos** (`transiciones: [...]` en episode.json, una por corte): `cinta`, `hoja`, `flash`, `puerta`. Tapan ~9 frames a cada lado del corte: la primera animación de la escena que entra debe caer **después de f≈9**.
- **Música**: `"musica": "base-100bpm-a.mp3"` (`assets/music/`, ver README allí). `Musica` baja bajo la voz y sube en los huecos. Pistas nuevas: `npm run music`, `scripts/make-music-bed.sh`, comprobar tempo con `scripts/analyze-beats.py`.
- **SFX reales** (ElevenLabs): `npm run sfx -- --only=… --force` (recorta silencio inicial y deja el pico a −2 dBFS). Mín. 0.5 s por la API.
- Escenas pro: `src/scenes/pro/` (GanchoPro, StingPro, AperturaPro, CamerinosPro, CierrePro). Las que no existen en pro caen al estilo clásico. Antes de dar un video por bueno: renderizar cuadros y mirar el filmstrip (entradas, impactos, solapes de texto).

## Escenas explicativas (anti-plantilla, estilo pro) — `src/scenes/pro/`
Cada historia puede componerse con cualquier secuencia de escenas; ya no todo pasa por fichas de texto. Tipos nuevos en `episode.json`:
- `contador` — cifra que sube (`cifra`, `desde`, `unidad`, `estilo: "tiza"|"marcador"`, `clave` = palabra donde termina la cuenta, `sello`): 149 goles, 173.850 personas, 3 balones de oro…
- `mapa` — mapa REAL (Natural Earth vía `world-atlas`, dominio público) con `puntos: [{nombre, lat, lon, palabra}]` que aparecen al nombrarse y `ruta` (balón viajando). `fondo: "pizarra"` = mapa a tiza.
- `versus` — dos hojas enfrentadas (`lados: [{titulo, lineas, palabras}]`) con sello «VS»: duelos y comparaciones.
- `cronologia` — hilo vertical con `hitos: [{anio, texto, palabra}]`; la cámara baja al nombrarse cada año (máx. 5).
- `recorte` — recorte de periódico inventado «Archivo del Camerino» (`titular`, `linea`, `resaltar`): documentos y titulares históricos.
Prueba visual de todas: episodio interno `P99-pruebas-escenas` (no se publica). Formatos narrativos sugeridos: *cifra/récord* (gancho → contador → giro → remate), *viaje* (mapa → cronología), *duelo* (versus → giro), *documento* (recorte → giro), *misterio* (tono sobrio + cama `c`).

## Ritmo (decisión del dueño: que no parezca plantilla y que no se haga largo)
- Omitir la escena `sting` en episodios nuevos (2,4 s de puerta sin información); el sello sonoro de marca (`sello`: llave + cerrojo + golpe) va en la apertura.
- Gancho ≤ 3,5 s; cierre corto (variar: con y sin «Yo estaba ahí. Bueno… casi.»). Meta: 30–35 s por video.
- Velocidad de voz: `config/voice.json` (hoy 0,95; el dueño elige entre 0,95 / 1,05 / v3 de oído).
- Música por ánimo (`assets/music/`, todas 100 BPM): `b` base estomp, `c` tensión/misterio, `d` sobria/emotiva, `e` ligera/humor. Pendiente de aprobación del dueño.

## Convenciones
- Código y comentarios en español (el proyecto y su audiencia lo son); nombres de componentes en español como en BRAND.md.
- Un componente nuevo = una animación de §5.2 + su sonido. No hay fundidos genéricos: las transiciones son objetos.
- Antes de dar algo por hecho visualmente, renderiza cuadros con `scripts/stills.ts` y míralos.
