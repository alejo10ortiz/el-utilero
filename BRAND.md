# EL UTILERO — Biblia de marca y producción

> Documento maestro para continuar en **Claude Code**: identidad, dirección de arte, personaje, camerino, logo, movimiento, sonido y flujo de producción de videos cortos de fútbol.
>
> Lienzo de diseño de referencia (privado): https://claude.ai/artifact/XaTJLv2vSnZ2seui4TXzMo
> Versión 1.0 · noviembre 2026

---

## 0. Cómo usar este documento en Claude Code

1. Crea una carpeta de proyecto (`el-utilero/`) y guarda este archivo como `BRAND.md` en la raíz.
2. Pídele a Claude Code: *"Lee BRAND.md y monta el proyecto de la sección 9 (Remotion)"*.
3. Trabaja por fases (sección 11). Cada fase termina con algo que se puede ver o escuchar.
4. **Regla de oro:** ningún dato sale al aire sin dos fuentes verificables anotadas en el episodio (sección 10).

---

## 1. La marca en una página

| | |
|---|---|
| **Nombre** | EL UTILERO |
| **Usuario** | @elutilerofutbol *(confirmado en las 4 redes; @elutilero no estaba disponible)* |
| **Qué es** | Videos cortos de fútbol: Mundiales, todos los países, curiosidades, datos históricos y datos locos. |
| **Concepto** | Un utilero viejo que dice haber estado en todos los camerinos desde 1930. Nadie le cree, pero todos le preguntan. Cada video abre **un camerino**: la puerta de un vestuario concreto (un estadio, un partido, un día) que él abre con su llave para sacar un **objeto** y contar la historia que no salió en la tele. |
| **Promesa** | Datos reales, contados como secreto. |
| **Tono** | Cómplice, pausado, con picardía. Humor sin burla. Nunca inventa. |
| **Frase de apertura** | «Cierren la puerta, que les cuento.» |
| **Frase de cierre** | «Esto no salió en la tele.» — **solo dicha (voz), nunca en pantalla**: el cierre visual es el Utilero + la cinta del @usuario. (variante: «Yo estaba ahí. Bueno… casi.») |
| **Numeración** | Cada video es un camerino: **Camerino #001, #002…** (coleccionable). Cada puerta lleva su rótulo: **LOCAL · VISITANTE · ÁRBITROS**. |
| **Nivel de secreto** | De 1 a 5 llaves (reemplaza cualquier "locurómetro"). |
| **Comunidad** | Los seguidores comentan su país → "mañana abro su camerino". |

### Series (formatos repetibles)

| Serie | Qué es | Gancho tipo |
|---|---|---|
| **El Camerino** (principal) | Un objeto → una historia. | "Este guayo tiene un secreto." |
| **La llave de [país]** | El dato más loco de un país. Una entrega por selección. | "La llave de Uruguay abre esto…" |
| **¿Mito o verdad?** | El utilero plantea, la gente comenta, él revela. Usa el rojo "Sello". | "¿Es verdad que…? Comenten antes de que lo diga." |
| **Hoy hace X años** | Efeméride del día (se puede automatizar con calendario). | "Un día como hoy, en 1950…" |

---

## 2. Dirección de arte: "Archivo del camerino"

La marca **no se ve como pantalla**: se ve como una mesa de trabajo del utilero fotografiada desde arriba. Papel, cinta, sellos, tiza, carpetas de cartón, fichas a máquina.

### 2.1 Las reglas del camerino (obligatorias)

1. **Nada de tarjetas ni cajitas redondeadas.** Todo es un objeto: papel, cinta, sello, tiza, metal.
2. **Una palabra gigante por pieza**, aunque se salga del borde. Contraste extremo de tamaños.
3. **Dos tintas:** negro + lima, siempre un poco corridas (desregistro de impresión riso).
4. **La mano del utilero:** círculos, flechas, subrayados y notas en marcador. Nada queda perfectamente derecho (rotaciones entre −6° y +6°).
5. **El rojo es solo para sellos** ("ROBADA", "CONFIDENCIAL", "ARCHIVO", "MITO").
6. **Nunca texto encima de texto.** Los objetos se superponen, las palabras no.
7. **Grano siempre.** Ninguna superficie es un color plano limpio.

### 2.2 Paleta

| Nombre | Hex | Uso |
|---|---|---|
| Lima | `#C8FF2E` | La firma. Resaltador, desregistro, fondo del cierre. Nunca texto lima sobre papel. |
| Tinta | `#16130F` | Texto, personaje, líneas. Negro cálido, no puro. |
| Papel | `#ECE5D3` | Fondo base (papel periódico). |
| Ficha | `#F8F4EA` | Fichas a máquina, hojas, carné. |
| Cinta | `#E9DFC4` | Cinta de enmascarar con marcador. |
| Kraft | `#B98B52` | Carpetas de archivo. |
| Kraft oscuro | `#A87B45` | Pestaña de carpeta. |
| Pizarra | `#1D211E` | Fondos de gancho (tablero táctico). |
| Tiza | `#EDEBE4` | Texto y trazos sobre pizarra. |
| Sello | `#E0412B` | Solo sellos y círculos de marcador rojo. |
| Gris archivo | `#5A5247` | Fuentes y notas pequeñas sobre papel. |
| Verde puerta | `#2F4A3F` / `#3B5A4D` / `#22362E` | Puerta del camerino (sección 3). |

### 2.3 Tipografía (Google Fonts)

| Fuente | Rol | Reglas |
|---|---|---|
| **League Gothic** | Lo que grita: palabras gigantes, fechas, sellos. | Interlineado 0.82–0.86. Mayúsculas. Puede salirse del borde. |
| **Instrument Serif** *(cursiva)* | Lo que susurra: citas y frases del utilero. | Grande (90–180 px). Tracking −0.015em. |
| **Special Elite** | Máquina de escribir: fichas, fechas, fuentes, datos. | 20–38 px. Nunca para titulares. |
| **Permanent Marker** | Lo que escribe a mano: cintas, notas, "¡apareció!". | Siempre rotado. Pocas palabras. |
| **Archivo** (700/800) | Subtítulos de video (legibilidad). | Palabra clave resaltada en lima. |

```html
<link href="https://fonts.googleapis.com/css2?family=League+Gothic&family=Instrument+Serif:ital@0;1&family=Special+Elite&family=Permanent+Marker&family=Archivo:wght@500;700;800&display=swap" rel="stylesheet">
```

### 2.4 Texturas y efectos (SVG listos para usar)

**Grano de papel** (capa superior, `pointer-events: none`, opacidad 0.4–0.5):

```html
<svg width="1080" height="1920" style="position:absolute;inset:0;pointer-events:none;opacity:.45">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.09  0 0 0 0 0.07  0 0 0 0 0.06  1.3 0 0 0 -0.55"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#grain)"/>
</svg>
```

**Borde irregular** (sellos, tinta gastada):

```html
<filter id="rough">
  <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/>
</filter>
```

**Tiza** (texto y trazos sobre pizarra):

```html
<filter id="chalk">
  <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75" result="m"/>
  <feComposite in="SourceGraphic" in2="m" operator="in" result="c"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="w"/>
  <feDisplacementMap in="c" in2="w" scale="4" xChannelSelector="R" yChannelSelector="G"/>
</filter>
```

**Desregistro riso** (titulares gigantes): `text-shadow: 10px 8px 0 #C8FF2E;`

**Trama de puntos** (sombras del personaje):

```html
<pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
  <circle cx="4.5" cy="4.5" r="2.3" fill="#16130F"/>
</pattern>
```

**Cinta de enmascarar** (CSS):

```css
.cinta {
  font-family: 'Permanent Marker', cursive;
  background: #E9DFC4; color: #16130F;
  padding: 14px 28px 8px; transform: rotate(-4deg);
  clip-path: polygon(0 10%,3% 0,50% 4%,97% 0,100% 12%,98% 50%,100% 90%,96% 100%,50% 95%,4% 100%,0 88%,2% 50%);
  box-shadow: 0 6px 12px -8px rgba(22,19,15,.5);
}
```

**Sello rojo** (CSS + filtro `rough`):

```css
.sello {
  font-family: 'League Gothic', sans-serif; letter-spacing: .08em;
  color: #E0412B; border: 5px solid #E0412B; padding: 4px 16px 0;
  transform: rotate(-10deg); opacity: .88; mix-blend-mode: multiply; filter: url(#rough);
}
```

**Ficha a máquina:** fondo `#F8F4EA`, líneas `repeating-linear-gradient(180deg, transparent 0 37px, #C9D6E2 37px 38px)`, sombra `0 22px 30px -20px rgba(22,19,15,.55)`, rotación −2.5° a +1.5°.

### 2.5 Texturas reales (prioridad alta, hacer a mano)

Lo que más aleja la marca del "look IA". Fabricar, escanear a 600 dpi o fotografiar cenital con luz suave:

- [ ] Sello de caucho real del escudo + sellos de texto: ROBADA, CONFIDENCIAL, ARCHIVO, MITO, VERDAD.
- [ ] 10 tiras de cinta de enmascarar (bordes rasgados reales), sobre fondo blanco.
- [ ] Una pizarra real con borrones de tiza; trazos de tiza sueltos (círculos, X, flechas).
- [ ] Hojas de papel periódico y fichas bibliográficas reales (texturas de fondo).
- [ ] Carpeta kraft con pestaña.
- [ ] Puerta de vestuario real pintada de verde (madera/acero descascarado) para la textura de la puerta; azulejo blanco viejo para el interior.
- [ ] Opcional: máquina de escribir real para fichas clave.

Guardar en `assets/textures/` como PNG con transparencia donde aplique.

### 2.6 Temas visuales (rotación de superficie, decisión del dueño)

Auditoría de #001–#012 (139 escenas): 73 % de las escenas sobre el mismo papel, una sola textura, 3 transiciones, la misma ficha, el mismo sello, la misma curva de entrada, el mismo polvo. Se ve plantilla aunque el guion rote. **Identidad fija** (Utilero, llaves, cinta @usuario, sello sonoro, portazo, grano, rojo solo en sellos, paleta de `config/brand.ts`) y **superficie que rota por episodio** con `"tema"` en `episode.json` (o por escena con `esc.tema`). Por defecto `clasico` = el look de #001–#012 (no cambia nada). Pilotos: #013 `kraft`, #014 `cuaderno`, #015 `periodico`; el `plano` queda para el próximo duelo/táctica.

| Tema | Idea | Papel (claro) | Oscuro | Lima | Subtítulos | Ficha | Polvo | Temblor | Transiciones |
|---|---|---|---|---|---|---|---|---|---|
| `clasico` | mesa de archivo | periódico | pizarra | plana | clásico | índice | motas | — | cinta · hoja · flash |
| `cuaderno` | cuaderno de la banca | cuadriculado + espiral | pizarra verde + bandeja | cuadros | subrayador | hoja arrancada | virutas de lápiz | 1,6 px | arranque · tinta · hoja |
| `kraft` | paquete del camerino | estraza con dobleces y cinta de embalar | cartón oscuro | corrugado | rotuladora (etiqueta) | etiqueta con cordel | fibras | 1,2 px | persiana · cinta · puerta |
| `plano` | plano de la jugada | milimetrado + cancha de agua | rejilla lima sobre tinta | franjas de césped | máquina | planilla | cruces de registro | — | balón · borrador · persiana |
| `periodico` | rotativa | papel prensa con trama y columnas | plancha de imprenta | trama | letras recortadas | recorte | anillos de trama | 1,0 px | rotativa · hoja · tinta |

Reglas: (1) un tema solo cambia la textura **dentro de su familia de luminosidad** (las escenas eligen el color del texto según el fondo que piden: papel → tinta, pizarra → tiza), así que `papel` sigue siendo claro y `pizarra` oscuro; (2) nada de degradados de UI ni tarjetas redondeadas: todo es papel, cartón, cinta, tiza o tinta; (3) el temblor es «línea que hierve» a 12 fps sobre toda la mesa (hecho a mano), nunca sobre los subtítulos de la voz; (4) `"transiciones": ["auto", …]` deja que el tema de la escena que entra elija su transición (rota por índice); (5) rotar temas entre episodios consecutivos igual que se rotan ganchos y cierres (`npm run rotacion` lo sugiere).

Transiciones nuevas (objetos): `persiana` (listones de estraza o tinta que giran), `balon` (remate a cámara), `tinta` (derrame que sube y deja goteras), `arranque` (hoja de cuaderno que cae y se arranca), `rotativa` (plancha de diario que gira y se clava con EXTRA), `borrador` (el borrador barre la pizarra en franjas).

---

## 3. PUNTO 1 — El camerino y el objeto del día

*(Decisión del 22-nov-2026: el dispositivo central pasa de "casillero" a "camerino". Un casillero metálico con candado se lee como deporte estadounidense; la puerta y el vestuario de un estadio son fútbol puro, y casan con la frase de apertura «Cierren la puerta…» y con «llevo en todos los camerinos desde 1930».)*

El camerino es el **dispositivo central**: convierte el concepto en algo visible y coleccionable. Todo episodio pasa por él: el Utilero abre la puerta con su llave, entra la luz y aparece el objeto del día sobre la banca.

### 3.1 Anatomía de la puerta y del camerino

**La puerta (exterior)**
- **Formato en video:** ocupa el 70–85 % del alto en el momento de apertura (vertical 1080×1920).
- **Puerta de vestuario de estadio:** madera pesada pintada de verde (`#3B5A4D`, sombras `#22362E`, luces `#4E7464`), paneles realzados, pintura descascarada y rayones.
- **Rótulo esmaltado** arriba: `LOCAL`, `VISITANTE` o `ÁRBITROS` en League Gothic sobre papel, con filete lima; debajo, "VESTUARIO" en máquina de escribir.
- **Placa de número** (tipo habitación) con el número del episodio → `001`.
- **Cinta encima** con el tema en marcador (ej. "Inglaterra 66").
- **Hoja de alineación** pegada con cinta: solo los números 1–11 a máquina (sin nombres, sin escudos).
- **Zócalo de acero** remachado abajo, **manija de palanca** y **escudo de cerradura**: ahí entra la llave del llavero del Utilero.
- **Bisagras:** 2, lado izquierdo, que se ven al abrir.

**El camerino (interior)** — se ve al abrir la puerta
- Pared de **azulejo blanco** hasta media altura; arriba, pintura crema gastada.
- **Pizarra táctica** montada en la pared, con X, O y flechas en tiza.
- **Banca de madera** con **ganchos y camisetas colgadas con número** (genéricas, sin escudos ni marcas); **guayos** bajo la banca, **canilleras**, **balón**, **toallas** y el **bolso del utilero**.
- **Lámpara colgante** con luz cálida; el **objeto del día** sobre la banca, iluminado.
- **El túnel:** cuando se presenta el concepto se muestra el pasillo con las tres puertas seguidas (LOCAL · VISITANTE · ÁRBITROS).

### 3.2 Estados (para animación)

| Estado | Descripción |
|---|---|
| `cerrado` | Puerta frontal, cinta con el tema, número visible. |
| `llave` | La mano del utilero entra al cuadro con el llavero; la llave gira. |
| `entreabierto` | Puerta abierta 15°, sale luz cálida por la rendija (genera suspenso). |
| `abierto` | Puerta abierta 100° (perspectiva), el objeto se ve completo. |
| `objeto-fuera` | El utilero sostiene el objeto frente a cámara. |
| `cerrando` | Portazo al final (cierre del episodio). |

### 3.3 El objeto del día

Cada episodio tiene **un objeto** que dispara la historia. Reglas:

- Es un objeto **genérico**, dibujado por nosotros, nunca una foto con derechos ni un logo oficial (FIFA, federaciones o clubes).
- Estilo: impreso a dos tintas (tinta + lima) con trama de puntos, como el personaje.
- Lleva una **etiqueta colgante** (cartón con cordel) escrita a máquina: `CAMERINO #001 · LONDRES · 1966`.

**Catálogo inicial de objetos** (objeto → historia). Las historias marcadas *verificar* necesitan 2 fuentes antes de producirse:

| # | Objeto | Historia | Estado |
|---|---|---|---|
| 001 | Bulto envuelto en papel periódico | Pickles, el perro que encontró la Copa robada (1966) | Verificado (sección 10) |
| 002 | Vitrina vacía (`vitrina`) | La Copa Jules Rimet, robada dos veces: Londres 1966 (Pickles) y Río 1983 (nunca apareció; «fundida» solo como teoría) | **En producción** · 2+ fuentes |
| 003 | Balón (`balon`) | 149–0 en Madagascar (2002): un equipo se metió 149 autogoles en protesta por decisiones arbitrales (Guinness: más autogoles en un partido de liga) | **En producción** · 2+ fuentes (Guinness, Seattle Times/Reuters, New Vision). Sin: sede (se discute), «tras cada saque» (una sola fuente) ni sanciones (no confirmadas) |
| 004 | Bandera de juez de línea (`bandera`) | La mano de Dios (1986) con el ángulo poco contado: el árbitro dijo que esperaba una señal del juez de línea; el juez de línea admitió después que sí la vio y su bandera nunca subió; el árbitro guardó el balón más de 35 años y lo puso en subasta. **Idea del dueño.** | **En producción** · 2+ fuentes (SBS, Sky Sports, Irish Examiner, ESPN, Goal, Khaleej Times, NBC). Sin: precio de venta del balón (las fuentes no coinciden) ni la secuencia exacta de miradas; lo que cuentan Nasser y Dochev va como «dijo»/«admitió» |
| 005 | Silbato (`silbato`) | El príncipe de Kuwait baja de la tribuna y le anulan un gol a Francia (1982). Sin los detalles discutidos (qué gol, origen del silbato, sanción al árbitro) | **Producido** · 3+ fuentes (Fox Sports, Arab News, GB News) |
| 006 | Botín (`botin`) | ¿Mito o verdad? India no jugó el Mundial 1950 por no poder jugar descalza → **mito** (costos, preparación, selección, prioridad olímpica) | 2 fuentes (SI, Scroll.in) · **Producido** (¿Mito o verdad?; sin FIFA en pantalla) |
| 007 | Camiseta blanca (`camiseta`) | Maracanazo (1950): a Brasil le bastaba empatar; Uruguay ganó 2–1 ante más de 170 mil personas; tres años después el Correio da Manhã convoca el concurso de la camiseta nueva y gana una amarilla | **Producido** · 6 fuentes (Correio da Manhã, Google Arts & Culture, MercoPress, Sportskeeda, History, DFB). Sin: asistencia exacta (173.850 vs 173.830 vs ~200 mil), edad del ganador (18 o 19) ni «maldita» |
| 008 | Servilleta (`servilleta`) | El contrato de Messi en una servilleta (Barcelona, 14-dic-2000): Carles Rexach la escribió, tres firmas, Messi con 13 años; esa noche hubo contrato formal; la servilleta salió a subasta | **Producido** · 5 fuentes (Fox Sports, ESPN, NPR, NBC Sports, The National). Sin: texto exacto de la servilleta, lugar del almuerzo, precio de la subasta |
| 009 | Trofeo (`trofeo`) | Atlético Nacional pidió que el título de la Sudamericana 2016 fuera para el Chapecoense; la Conmebol se lo dio el 5-dic-2016 (su primer título internacional) y premió a Nacional con el Fair Play. **Tono sobrio** (sin confeti ni hinchada, cierre sin guiño) | **Producido** · 4 fuentes (FIFA, FourFourTwo, La FM, Wikipedia). Sin cifras de víctimas |
| 010 | Llave de hotel (`llavehotel`) | Di Stéfano secuestrado en Caracas (agosto de 1963) por un grupo guerrillero que buscaba publicidad; lo soltaron sano y salvo y apareció en la embajada de España | **Producido** · 4 fuentes (These Football Times, Semana, El Observador, Papers Past 1963). Duración del cautiverio: 2–3 días según la fuente → «unos días» |
| 011 | Botín (`botin`) | El escorpión de Higuita en Wembley (6-sept-1995, amistoso Inglaterra 0–0 Colombia, balón por alto de Jamie Redknapp) | **Producido** · 4 fuentes (FIFA, Wikipedia, City AM, AOL). Sin: que lo «inventó» (solo «reportadamente») ni lo del offside que dice Higuita |
| 012 | Boleta (`boleta`) | La final de la Libertadores 2018 se jugó en Madrid tras el ataque al bus de Boca (24-nov-2018); River ganó 3–1 en el alargue (9-dic-2018); primera final fuera de América | **Producido** · 4 fuentes (FourFourTwo, Al Jazeera, Wikipedia, Bleacher Report) |
| 013 | Mapa y camiseta (El Dorado) | La liga colombiana sin la FIFA (1949–1954): Millonarios ficha a Di Stéfano y se forma «El Dorado»; escenas `mapa` + `cronologia`. **Tema `kraft`** | **Producido** · 6 fuentes (Wikipedia, Goal, WSC, Cancillería de Colombia, ESPN Deportes, Britannica) |
| 014 | Dos camisetas (Chivas / Athletic) | Dos clubes que solo juegan con los suyos: Chivas (solo mexicanos por nacimiento) vs Athletic (formados en el País Vasco y Navarra); escenas `mapa` + `versus`. **Tema `cuaderno`** | **Producido** · 4 fuentes (TUDN, 90min, BBVA, Yahoo). Sin cifras de plantilla |
| 015 | Marcador | Arbroath 36–0 Bon Accord (1885); ese día Dundee Harp ganó 35–0; escenas `recorte` + `contador` + `versus`. **Tema `periodico`** | **Producido** · 5 fuentes (Arbroath FC, The Scotsman, The Courier, Wikipedia, WSC) |
| 016 | Guante de portero | Rogério Ceni: 129 goles oficiales (Guinness); muchas fuentes dicen 131 | 2 fuentes (Guinness, CONMEBOL) |
| 017 | Tarjetas / semáforo | Ken Aston y el semáforo: nacen las tarjetas (1966 → Mundial 1970), «según contó él» | 2 fuentes (FIFA, Smithsonian) |
| 018 | Dos balones (`balones`) | Final de 1930: un balón por tiempo; luego la FIFA impone un balón único | 2 fuentes (WSC, Google Arts & Culture); **falta 3.ª para el 2–1 del descanso** |
| 019 | Radio vieja | ¿Mito o verdad? La Guerra del Fútbol (1969): el partido fue el detonante, no la causa. Tema sensible: sin cifra de muertos hasta tenerla | 2 fuentes (UK National Archives, SI) |
| 020 | Gafas protectoras | Las gafas de Edgar Davids: glaucoma tras una lesión en el nervio óptico y cirugía (1999 según la mayoría; una fuente dice 2000–01). **Idea del dueño.** Gancho más flojo, objeto muy bueno | 2 fuentes (Vice, Football Italia); **falta fecha firme y fuente médica**. Sin nombrar la marca de las gafas |

**Banca nueva, pan-hispánica** (ya contrastadas, a elegir): saga **Di Stéfano** (El Dorado de Colombia 1949–54 · el Madrid y el Barça se lo reparten, 1953 · ya está el secuestro #010) · **Chivas vs Athletic** (solo con los suyos) · **Jorge Campos** (portero con uniformes propios) · **la final de las botellas** (1968) · **Bonmatí**, primera con tres Balones de Oro femeninos · **Copa América 2001** (Colombia, sin recibir un gol) · **Pelé «tesoro nacional»** (1961) · **Dick, Kerr Ladies** (1920) · **Juventus rosa** → rayas de Notts County · **Wrexham** (tres ascensos seguidos) · **Chile 1973, «el partido contra nadie»** (muy delicado) · **Mbappé, récord histórico de goles** · **Cristiano en seis Mundiales y el récord de Milla** · **Cabo Verde** (por verificar su torneo) · **la Copa en una caja de zapatos** (Barassi) · **Luis Monti** · **Trautmann** · **el penal lo inventó un portero**.

**Banca anterior** (buenas, para después): Lucien Laurent, primer gol de un Mundial (viaje de 15 días en barco, permiso sin sueldo de Peugeot; **sin** el dato de 1998, no se pudo verificar) · Uruguay 1934 y Escocia 1950, los campeones y clasificados que no fueron (serie *La llave de Uruguay*).

**Orden de lanzamiento** (tras Pickles #001): 002 → 003 → 004 (Maradona, pedido del dueño) → 005 → 006 → 007 → 008 → 009 → 010 → 011 → 012 → 013 (Davids). Alterna *shock* (003, 004, 007) con *comentarios* (006, 011) y deja lo sensible para el final de la tanda.


### 3.4 Público: todo el mundo hispanohablante (decisión del dueño)

- **Mezcla:** como máximo 1 de cada 3 videos de Mundial; el resto rota entre club, copa continental, fútbol femenino, objeto/regla del juego y actualidad. Alternar países (España, México, Argentina, Colombia, Chile…); nunca dos seguidos del mismo.
- **Lenguaje neutro:** «ustedes» (no «vosotros»); sin regionalismos (guayo, chuzo, taco): «botín», «portería», «hinchas», «cancha» se entienden en todas partes.
- **«Camerino» vs «vestuario»:** según la RAE (DPD), «camerino» significa vestuario deportivo *en América*; en España lo habitual es «vestuario» y «camerino» suena a teatro. Se mantiene la marca «El Camerino»; en textos para España (descripciones, comentarios) usar «vestuario». Revisar el nombre si hay fricción medible.
- **Historias delicadas** (tragedias, política): `tono: "misterio"` en giro, remate y cierre (sin confeti, sin hinchada, sin guiño; expresión `E7`) y cierre sin «Yo estaba ahí. Bueno… casi.».

---

## 4. PUNTO 2 — El personaje: hoja de modelo

### 4.1 Ficha

- **Nombre:** nadie lo sabe. Es "El Utilero".
- **Edad:** no la dice. Dice que lleva en los camerinos "desde 1930".
- **Rasgos fijos (nunca cambian):** gorra negra con botón lima · bigote canoso grande · patillas grises · nariz redonda · buzo oscuro con dos rayas lima en los hombros · toalla blanca al hombro derecho con raya roja · llavero en el pecho.
- **Gesto firma:** el **guiño** (ojo derecho cerrado) = viene el secreto.
- **Silueta:** debe reconocerse solo por la sombra: gorra + bigote + toalla.

### 4.2 Estilo de render

- **Dos tintas**, como impresión riso: placa **tinta** (contornos, gorra, buzo, ojos, trama) y placa **lima** (cara, orejas, cuello, rayas, botón).
- **La placa lima va corrida +8 px / +6 px** (a escala de 400 px) respecto a la de tinta → desregistro.
- Cejas, bigote y toalla en **papel** (`#ECE5D3`) con contorno tinta.
- Sombra en la mejilla derecha con **trama de puntos** rotada 28°.
- Versión sobre fondo lima: la placa de color pasa a papel y el bigote se tramea.

### 4.3 Geometría base (SVG de referencia, viewBox 400×400)

Retrato actual del lienzo. Sirve como guía de proporciones para el ilustrador y como rig inicial:

```html
<svg viewBox="0 0 400 400">
  <defs><pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><circle cx="4.5" cy="4.5" r="2.3" fill="#16130F"/></pattern></defs>
  <!-- PLACA LIMA (corrida) -->
  <g id="placa-lima" transform="translate(8 6)" fill="#C8FF2E">
    <ellipse cx="128" cy="198" rx="14" ry="20"/><ellipse cx="272" cy="198" rx="14" ry="20"/>
    <rect x="176" y="248" width="48" height="46" rx="10"/><ellipse cx="200" cy="190" rx="72" ry="84"/>
  </g>
  <!-- TORSO -->
  <g id="torso">
    <path d="M40 400 C48 318 110 286 200 286 C290 286 352 318 360 400 Z" fill="#16130F"/>
    <path d="M82 330 C72 352 64 376 60 400" fill="none" stroke="#C8FF2E" stroke-width="12"/>
    <path d="M318 330 C328 352 336 376 340 400" fill="none" stroke="#C8FF2E" stroke-width="12"/>
    <path d="M170 288 L200 326 L230 288" fill="none" stroke="#ECE5D3" stroke-width="5" stroke-linejoin="round"/>
    <line x1="200" y1="326" x2="200" y2="400" stroke="#ECE5D3" stroke-width="3"/>
  </g>
  <g id="toalla">
    <path d="M250 290 C282 286 314 300 328 322 L304 344 C292 324 272 312 244 310 Z" fill="#ECE5D3" stroke="#16130F" stroke-width="3"/>
    <line x1="266" y1="294" x2="256" y2="312" stroke="#E0412B" stroke-width="4"/>
  </g>
  <!-- CABEZA (placa tinta) -->
  <g id="cabeza">
    <ellipse cx="128" cy="198" rx="14" ry="20" fill="none" stroke="#16130F" stroke-width="3.5"/>
    <ellipse cx="272" cy="198" rx="14" ry="20" fill="none" stroke="#16130F" stroke-width="3.5"/>
    <path d="M178 266 L178 290 M222 266 L222 290" stroke="#16130F" stroke-width="3.5"/>
    <ellipse cx="200" cy="190" rx="72" ry="84" fill="none" stroke="#16130F" stroke-width="3.5"/>
    <path id="sombra" d="M232 116 C268 136 280 192 262 238 C252 262 232 272 214 274 C246 250 258 204 250 164 C246 142 240 128 232 116 Z" fill="url(#dots)"/>
    <path id="patilla-izq" d="M130 168 C126 196 132 214 140 224 L148 174 Z" fill="url(#dots)"/>
    <path id="patilla-der" d="M270 168 C274 196 268 214 260 224 L252 174 Z" fill="url(#dots)"/>
    <g id="gorra">
      <path d="M126 160 C126 104 162 82 200 82 C238 82 274 104 274 160 Z" fill="#16130F"/>
      <path d="M116 158 C150 144 250 144 284 158 C286 170 276 177 262 175 C230 166 170 166 138 175 C124 177 114 170 116 158 Z" fill="#16130F"/>
      <circle cx="200" cy="120" r="13" fill="#C8FF2E"/>
    </g>
    <path id="ceja-izq" d="M150 188 C160 177 178 177 188 185 L186 194 C176 188 162 188 152 196 Z" fill="#ECE5D3" stroke="#16130F" stroke-width="2.5" stroke-linejoin="round"/>
    <path id="ceja-der" d="M250 188 C240 177 222 177 212 185 L214 194 C224 188 238 188 248 196 Z" fill="#ECE5D3" stroke="#16130F" stroke-width="2.5" stroke-linejoin="round"/>
    <circle id="ojo-izq" cx="172" cy="208" r="6.5" fill="#16130F"/>
    <path id="ojo-der-guino" d="M216 209 C222 202 234 202 240 209" fill="none" stroke="#16130F" stroke-width="5" stroke-linecap="round"/>
    <path id="nariz" d="M198 212 C190 226 190 236 204 236" fill="none" stroke="#16130F" stroke-width="3.5" stroke-linecap="round"/>
    <path id="bigote" d="M146 252 C160 232 186 234 200 244 C214 234 240 232 254 252 C240 260 222 260 200 252 C178 260 160 260 146 252 Z" fill="#ECE5D3" stroke="#16130F" stroke-width="3.5" stroke-linejoin="round"/>
    <path id="boca" d="M184 266 C192 272 208 272 216 266" fill="none" stroke="#16130F" stroke-width="4" stroke-linecap="round"/>
  </g>
  <g id="llavero">
    <circle cx="150" cy="346" r="15" fill="none" stroke="#ECE5D3" stroke-width="4"/>
    <rect x="140" y="358" width="6" height="30" rx="2" fill="#ECE5D3"/><rect x="146" y="378" width="8" height="4" fill="#ECE5D3"/>
    <rect x="156" y="358" width="6" height="26" rx="2" fill="#ECE5D3"/><rect x="162" y="374" width="7" height="4" fill="#ECE5D3"/>
  </g>
</svg>
```

### 4.4 Expresiones (8): cabeza de frente, mismo encuadre

| ID | Expresión | Cejas | Ojos | Boca / bigote | Cuándo |
|---|---|---|---|---|---|
| `E1` | Neutro cómplice | Relajadas | Abiertos | Sonrisa leve | Narración base |
| `E2` | **Guiño** (firma) | Izq. alzada | Der. cerrado | Sonrisa de lado | "Viene el secreto" |
| `E3` | Susurro | Juntas | Entrecerrados | Mano junto a la boca | «Cierren la puerta…» |
| `E4` | Sorpresa | Muy alzadas | Muy abiertos | Bigote levantado, boca en O | Revelación del dato |
| `E5` | Escéptico | Una alzada | Mirada de lado | Bigote torcido | "¿Mito o verdad?" |
| `E6` | Risa | Arqueadas | Cerrados (arcos) | Boca abierta, hombros arriba | Remates de humor |
| `E7` | Nostalgia | Caídas | Mirada arriba | Sonrisa suave | Historias emotivas |
| `E8` | Indignado | Fruncidas | Abiertos | Bigote hacia abajo | Robos, injusticias |

### 4.5 Poses (8): cuerpo hasta la cintura

| ID | Pose | Uso |
|---|---|---|
| `P1` | De frente, manos atrás | Presentación |
| `P2` | Señalando a cámara | "Tú, sí, tú…" / llamado a comentar |
| `P3` | Mano en la boca (susurro) | Apertura |
| `P4` | Girando la llave en la puerta del camerino (de espaldas ¾) | Apertura del camerino |
| `P5` | Sosteniendo el objeto con las dos manos | Momento central |
| `P6` | Brazos cruzados, escéptico | ¿Mito o verdad? |
| `P7` | Cerrando la puerta de un empujón | Cierre |
| `P8` | Apoyado en el marco de la puerta, una mano en la cadera | Transiciones |

### 4.6 Bocas para sincronizar con la voz (visemas)

Siempre detrás del bigote: la boca se asoma solo por abajo.

| ID | Sonidos | Forma |
|---|---|---|
| `M0` | Silencio | Línea cerrada (`boca` base) |
| `M1` | A | Abierta grande, bigote sube 6 px |
| `M2` | E / I | Abierta ancha y baja |
| `M3` | O / U | Redonda pequeña |
| `M4` | M / B / P | Labios apretados, bigote baja 2 px |
| `M5` | F / V | Labio inferior bajo los dientes |
| `M6` | L / D / T / N | Semiabierta, punta de lengua |
| `M7` | S / Z / CH | Dientes juntos visibles |

### 4.7 Rig para animación (capas SVG separadas)

`cuerpo` → `brazo-izq`, `brazo-der` (con `mano-*` intercambiables: abierta, puño, señalar, sostener) → `cuello` → `cabeza` → (`gorra`, `cejas-izq/der`, `ojos-izq/der` [abierto, cerrado, guiño, sorpresa], `nariz`, `bigote`, `boca` [M0–M7]) → `toalla` → `llavero`.

Animaciones básicas del rig:
- **Respiración:** torso `scaleY` 1 → 1.012, ciclo de 3 s.
- **Parpadeo:** cada 3–5 s al azar, 4 fotogramas.
- **Bigote:** se mueve ±2 px con cada sílaba acentuada.
- **Llavero:** balanceo con retardo (sigue el movimiento del torso).

### 4.8 Brief para el ilustrador (copiar y enviar)

> Personaje: "El Utilero", utilero de fútbol mayor y cómplice, para una marca de videos cortos de historia del fútbol. Estilo: ilustración impresa en dos tintas (negro cálido #16130F + lima fluorescente #C8FF2E), tipo riso, con desregistro leve y trama de puntos; nada de degradados ni 3D. Rasgos fijos: gorra negra con botón lima, bigote canoso grande, patillas grises, nariz redonda, buzo oscuro con rayas lima en los hombros, toalla blanca con raya roja al hombro derecho, llavero en el pecho. Entregables: hoja de modelo (frente, ¾, perfil, espalda), 8 expresiones, 8 poses, 8 bocas (visemas), manos intercambiables, todo en capas separadas (SVG o AI editable) y listo para animar. Referencia de proporciones: SVG adjunto.

---

## 5. PUNTO 3 — Movimiento y sonido

### 5.1 Principios de movimiento

1. **Todo tiene peso físico.** La cinta se pega, el sello golpea, la puerta rechina. Nada "flota".
2. **Entradas con golpe, salidas rápidas.** Rebote corto al llegar (overshoot 6–10 %) y salida en 4–6 fotogramas.
3. **Ritmo de máquina de escribir:** el texto informativo aparece letra por letra; los titulares gigantes caen de una.
4. **Cámara de mesa:** movimientos sutiles de "cámara en mano" sobre la mesa (deriva de ±6 px y ±0.4°).
5. **Ningún fundido genérico.** Las transiciones son objetos: una hoja que pasa, la puerta que se cierra, un sello que tapa el cuadro.

### 5.2 Biblioteca de micro-animaciones (a 30 fps)

| ID | Animación | Duración | Detalle técnico | Sonido |
|---|---|---|---|---|
| `A01` | **Cinta pegada** | 6 f | Entra rotada −15° y escala 1.3 → 1.0 con rebote; sombra de 0 a su valor final. | `sfx_tape.wav` |
| `A02` | **Sello** | 8 f | Escala 1.6 → 0.95 → 1.0; opacidad 0 → 0.88; temblor de cámara de 3 px en el impacto. | `sfx_stamp.wav` |
| `A03` | **Máquina de escribir** | 1 letra cada 1–2 f | Revela carácter por carácter; el cursor "▌" titila. | `sfx_type_loop.wav` + `ding` al final |
| `A04` | **Tiza dibujada** | 12–20 f | `stroke-dasharray` + `stroke-dashoffset` animado; polvo de tiza (partículas). | `sfx_chalk.wav` |
| `A05` | **Palabra gigante** | 5 f | Cae de y −40 px, desregistro lima de 0 a 10 px en 3 f. | `sfx_thump.wav` |
| `A06` | **Ficha que se desliza** | 10 f | Entra desde fuera del cuadro con rotación −8° → −2°, frena con fricción. | `sfx_paper_slide.wav` |
| `A07` | **Círculo de marcador** | 10 f | Trazo a mano que rodea la palabra; termina pasado del inicio. | `sfx_marker.wav` |
| `A08` | **Apertura del camerino** | 24 f | Llave gira (6 f) → clic → puerta a 15° (6 f, rechinido) → pausa (4 f) → puerta a 100° (8 f) con luz cálida. | `sfx_keys` + `sfx_lock` + `sfx_creak` |
| `A09` | **Portazo** | 8 f | Puerta de 100° a 0° con rebote; temblor de cámara de 6 px. | `sfx_slam.wav` |
| `A10` | **Guiño** | 6 f | Ojo der. a guiño + ceja izq. +6 px + inclinación de cabeza 3°. | `sfx_wink.wav` (brillo suave) |
| `A11` | **Nivel de secreto** | 4 f por llave | Cada llave cae y tintinea. | `sfx_key_drop` ×N |

### 5.3 Intro de marca (sting de 2 s, abre todos los videos)

| Tiempo | Imagen | Sonido |
|---|---|---|
| 0.00–0.40 | Negro. Mano entra con el llavero. | Tintineo de llaves |
| 0.40–0.80 | Llave en la cerradura de la puerta de un camerino, gira. | Clic metálico |
| 0.80–1.40 | Puerta se entreabre; luz lima por la rendija. | Rechinido corto |
| 1.40–2.00 | Golpe a la cinta "EL UTILERO" + guiño del personaje en la rendija. | Cinta + pitazo corto |

> Nota: en Shorts, el gancho va **antes** del sting (0–3 s). El sting se usa como transición del gancho al cuerpo.

### 5.4 Cierre de marca (outro de 3 s)

Fondo lima → el utilero con `E2` (guiño), **grande y sin texto compitiendo** → cinta `@elutilerofutbol` (A01) → portazo (A09) + pitazo. La frase de marca («Esto no salió en la tele.») se dice en la voz pero **no se pone en pantalla** (decisión del dueño: estorbaba a los subtítulos y le quitaba espacio al personaje). Una cita en Instrument Serif solo aparece si el episodio la trae explícita en `cita`.

### 5.5 Subtítulos

- Fuente: **Archivo 800**, 64–72 px, color tinta sobre papel o tiza sobre pizarra.
- Palabra por palabra (grupos de 1–3 palabras), palabra clave en **lima** con resaltador.
- Posición: tercio medio-inferior, **por encima de la zona segura inferior**.
- Generarlos desde la transcripción con marcas de tiempo (ElevenLabs devuelve tiempos por palabra).

### 5.6 Diseño sonoro

| Archivo | Descripción |
|---|---|
| `sfx_keys.wav` | Manojo de llaves viejas, tintineo corto (firma sonora #1) |
| `sfx_lock.wav` | Clic de cerrojo metálico |
| `sfx_creak.wav` | Rechinido de puerta de camerino (bisagras viejas) |
| `sfx_slam.wav` | Portazo metálico seco |
| `sfx_whistle.wav` | Pitazo corto de árbitro (firma sonora #2, cierre) |
| `sfx_stamp.wav` | Golpe de sello de caucho sobre mesa de madera |
| `sfx_tape.wav` | Cinta de enmascarar despegándose y pegándose |
| `sfx_type_loop.wav` | Máquina de escribir mecánica (loop) + `sfx_ding.wav` |
| `sfx_chalk.wav` | Tiza sobre pizarra |
| `sfx_marker.wav` | Marcador sobre papel |
| `sfx_paper_slide.wav` | Hoja deslizándose |
| `amb_locker_room.wav` | Ambiente de camerino: eco, goteo lejano, murmullo de estadio muy bajo |

**Música:** una base corta de bajo y percusión "de vestuario" (palmas, bombo apagado), tempo 90–100 BPM, con licencia libre o generada; volumen −18 dB bajo la voz. Fuentes sugeridas: bibliotecas con licencia comercial o efectos generados (ElevenLabs Sound Effects). Nada de música con derechos de autor ni himnos oficiales.

### 5.7 La voz (ElevenLabs)

**Prompt para diseñar la voz (Voice Design):**

> Hombre latinoamericano de unos 70 años, voz grave y un poco rasposa, cálida y cómplice. Habla pausado, casi en susurro, como quien cuenta un secreto en un camerino vacío; sonríe al hablar y tiene picardía. Acento neutro latinoamericano, buena dicción.

**Línea de prueba:** «Cierren la puerta, que les cuento… Esto no salió en la tele.»

Ajustes iniciales sugeridos: estabilidad media-baja (más expresiva), similitud alta y estilo medio. Guardar el `voice_id` elegido en `config/voice.json`.

---

## 6. PUNTO 4 — Logo definitivo

### 6.1 Sistema de logo (4 piezas)

| Pieza | Qué es | Uso |
|---|---|---|
| **Logotipo** | "EL UTILERO" dibujado a medida | Banners, portadas, intro |
| **Escudo / sello** | Escudo con llave cuya cabeza es un balón | Sello rojo, merch, marca de agua |
| **Avatar** | Retrato del utilero guiñando, sobre círculo lima | Foto de perfil en todas las redes |
| **Marca mínima** | Llave-balón sola | Marca de agua en videos, favicon |

### 6.2 Logotipo: construcción

- Base: **League Gothic**, redibujada (no tipeada) para que sea propia.
- **La "I" de UTILERO es una llave:** el fuste de la I es el cuerpo de la llave, con dos dientes saliendo a la derecha en la parte baja; la cabeza de la llave (un anillo con forma de balón, con pentágono central) sobresale por encima de la altura de las mayúsculas.
- **"EL"** va escrito en marcador sobre un trozo de cinta, pegado arriba a la izquierda de la U y rotado −6°.
- Desregistro lima de +10 / +8 px en la versión principal (sobre papel).
- Versiones: principal (tinta + lima sobre papel), invertida (tiza sobre pizarra), monocroma (solo tinta), sobre lima (tinta).

### 6.3 Escudo / sello (geometría actual, viewBox 200×240)

```html
<svg viewBox="0 0 200 240">
  <path d="M100 10 L186 32 V118 C186 174 150 212 100 230 C50 212 14 174 14 118 V32 Z" fill="none" stroke="#E0412B" stroke-width="9" stroke-linejoin="round"/>
  <circle cx="100" cy="76" r="27" fill="#E0412B"/>
  <rect x="86" y="104" width="28" height="9" rx="2" fill="#E0412B"/>
  <rect x="94" y="110" width="12" height="90" rx="2" fill="#E0412B"/>
  <rect x="104" y="166" width="20" height="10" fill="#E0412B"/>
  <rect x="104" y="184" width="14" height="10" fill="#E0412B"/>
</svg>
```

Para la versión final: fabricar el sello de caucho real y escanear la impresión (textura auténtica).

### 6.4 Avatar

- Encuadre: cabeza y hombros, gorra rozando el borde superior del círculo, expresión **E2 (guiño)**.
- Fondo: círculo lima `#C8FF2E`. Personaje a dos tintas.
- **Prueba obligatoria de legibilidad** a 48, 100 y 200 px. A 48 px se usa una versión simplificada: sin trama, sin cejas contorneadas, guiño más grueso.

### 6.5 Reglas de uso

- Margen de respeto: la altura de la cabeza de la llave alrededor de todo el logo.
- Tamaño mínimo del logotipo: 120 px de ancho en pantalla.
- **No:** degradados, sombras paralelas, contornos de neón, cambiar los colores fuera de la paleta, rotar el logotipo (la cinta "EL" sí va rotada; el resto no), estirar.

---

## 7. Anatomía de un Short

Duración objetivo: **30–45 s**, formato 1080×1920 a 30 fps.

| Bloque | Tiempo | Qué pasa | Fondo |
|---|---|---|---|
| **GANCHO** | 0–3 s | Palabra gigante con tiza: el dato más loco en una frase. | Pizarra |
| **STING** | 3–5 s | Llaves → la puerta del camerino se abre (A08). | Puerta / camerino |
| **APERTURA** | 5–7 s | Utilero E3 susurrando: «Cierren la puerta, que les cuento.» | Papel |
| **CONTEXTO** | 7–15 s | Ficha a máquina con fecha y lugar; sello de la situación. | Papel |
| **GIRO** | 15–28 s | Aparece el objeto del día (P5 + E4); el dato se revela. | Papel / camerino |
| **REMATE** | 28–35 s | Consecuencia o cifra final con palabra gigante. | Papel |
| **CIERRE** | 35–40 s | Nivel de secreto (A11) + outro de marca (5.4) + llamado a comentar el país. | Lima |

### 7.1 Zonas seguras (aprox., verificar en cada plataforma)

- Superior: dejar ~150 px libres (barra y botones de la app).
- Inferior: dejar ~420 px libres (descripción, nombre, música).
- Derecha: dejar ~140 px libres (botones de me gusta, comentar, compartir).

### 7.2 Plantilla de guion (formato por bloques)

```
CAMERINO #000 — [Tema] · [País] · [Año]
Rótulo de la puerta: LOCAL | VISITANTE | ÁRBITROS
Objeto: [objeto del día]
Nivel de secreto: [1–5]

GANCHO (0–3 s)
(toma) …
🎙 …

APERTURA (3–7 s)
(toma) …
🎙 …

CUERPO (7–35 s)
(toma) …
🎙 …

CIERRE (35–40 s)
(toma) …
🎙 …

TEXTO EN PANTALLA (final): @elutilerofutbol · Mañana: camerino #00X
FUENTES: [1] … [2] …
```

---

## 7b. Banco de guion y rotación (identidad fija + piezas que rotan)

**Por qué:** una auditoría de los primeros 15 episodios mostró que 12 de 15 tenían exactamente la misma secuencia de escenas, 15 de 15 abrían con «Cierren la puerta, que les cuento.», 11 de 15 cerraban con «Yo estaba ahí. Bueno… casi.» y 13 de 15 pedían «su país». La identidad se mantiene; el esqueleto debe rotar.

**Identidad (siempre):** el Utilero y su look «Archivo del camerino» · las llaves de nivel de secreto · la cinta con @usuario al final · el sello sonoro (llave + cerrojo + golpe) · datos reales con 2 fuentes · el portazo final.

**Piezas que rotan** (se anotan en `guion` dentro de `episode.json`: `gancho`, `apertura`, `cierre`, `formato`):

| Pieza | Variantes (código → fórmula y ejemplo) |
|---|---|
| **Gancho** | `afirmacion` hecho insólito en afirmativa («Un portero despejó con los talones…») · `paradoja` dos datos que chocan («La Copa se robó dos veces. La primera la encontró un perro.») · `cifra` empieza por el número («36 a 0.») · `pregunta` («¿India no fue a un Mundial por jugar descalza?») · `mito` «¿Mito o verdad?» · `escena` en mitad de la acción («Minuto 51. Maradona salta…») · `direccion` le habla a la gente («¿Sabían que una liga entera se salió de la FIFA?») · `promesa` («En 30 segundos van a saber quién…») · `objeto` el objeto va primero («Esta servilleta vale…») |
| **Apertura** | `firma` «Cierren la puerta, que les cuento.» · `corta` «Cierren la puerta.» · `intima` «Esto es entre nosotros.» · `directa` sin frase: el sello sonoro y al relato · `invita` «Pasen, pero cierren la puerta.» |
| **Formato** (cuerpo) | `objeto` (contexto → giro con objeto → remate) · `cifra` (contador) · `viaje` (mapa + cronología) · `duelo` (versus) · `documento` (recorte) · `misterio` (3 actos, cama `c`) · `mito` (¿mito o verdad?, sello rojo) · `cuenta_atras` (3-2-1) |
| **Cierre** | `pais` «Comenten su país y abro su camerino.» · `pregunta` pregunta específica de la historia («¿Cuál es el marcador más raro que han visto?») · `ab` elegir entre A y B · `siguiente` gancho al próximo («Mañana: …») · `dato` «Y hay más: …» · `reto` adivinar el próximo · `firma` «Yo estaba ahí. Bueno… casi.» · `seco` solo cinta + «Síganme» · `sobrio` historias delicadas (sin chiste ni confeti) |

**Reglas de rotación** (las revisa `npm run verify`, avisos no bloqueantes):
1. Un mismo tipo de **gancho** no se repite en 2 videos seguidos ni más de 1 de cada 3.
2. La frase firma de **apertura** en como máximo 1 de cada 2 videos; alternar con `corta`, `intima`, `directa`.
3. «Yo estaba ahí. Bueno… casi.» en como máximo 1 de cada 3, y nunca en historias sobrias.
4. «Comenten su país» en como máximo 1 de cada 2: el resto, una pregunta propia de la historia (genera más comentarios que una petición genérica).
5. La **secuencia de escenas** y la **cama de música** deben ser distintas a las de los dos videos anteriores.
6. Cada 5 videos, uno de serie (¿Mito o verdad?, La llave de…, Hoy hace X años).
7. Antes de escribir un guion: `npm run rotacion` muestra lo usado en los últimos episodios y sugiere el siguiente gancho, apertura, formato, cierre y música.

## 8. Guion completo — Camerino #001: "El perro que salvó la Copa"

**Objeto:** bulto envuelto en papel periódico · **País:** Inglaterra · **Año:** 1966 · **Nivel de secreto:** 5/5

**GANCHO (0–3 s)**
(toma) Pizarra. Cae "UN PERRO SALVÓ LA COPA DEL MUNDO" en tiza (A05 + A04); "PERRO" en caja lima.
🎙 «Un perro salvó la Copa del Mundo. Y no es un chiste.»

**STING (3–5 s)**
(toma) Llavero, puerta del camerino #001 con rótulo LOCAL y cinta "Inglaterra 66"; la puerta se entreabre (A08).

**APERTURA (5–7 s)**
(toma) Utilero E3, mano en la boca.
🎙 «Cierren la puerta, que les cuento.»

**CUERPO (7–32 s)**
(toma) Ficha a máquina "LONDRES · 20.03.1966" se desliza (A06); sello "ROBADA" (A02).
🎙 «Marzo de 1966. Faltaban cuatro meses para el Mundial de Inglaterra… y alguien se robó el trofeo de una exhibición en Londres.»

(toma) Ficha: "Piden rescate". Círculo de marcador rojo (A07).
🎙 «La policía no encontraba nada. Hasta llegó una petición de rescate.»

(toma) Camerino abierto: el bulto envuelto en periódico sobre la banca, iluminado. Utilero P5 + E4. Palabra gigante "27.03".
🎙 «Siete días después, un perro llamado Pickles salió a pasear con su dueño, olfateó un paquete envuelto en periódico… y adentro estaba la Copa.»

(toma) Ficha: "30.07.1966 — Inglaterra campeón". Cinta: "¡su único Mundial!".
🎙 «Ese julio, Inglaterra ganó el Mundial. El único que tiene.»

**CIERRE (32–40 s)**
(toma) Nivel de secreto: 5 llaves (A11). Fondo lima, utilero E2 (guiño).
🎙 «Al perro lo trataron como un héroe. Yo estaba ahí. Bueno… casi. Comenten su país y mañana abro su camerino.»
(toma) Portazo (A09) + pitazo.

**TEXTO EN PANTALLA (final):** @elutilerofutbol · Mañana: camerino #002

**FUENTES (verificadas):**
1. The FA: Pickles encontró el trofeo Jules Rimet siete días después de que fuera robado de una exhibición en Westminster, en marzo de 1966. https://www.thefa.com/news/2016/jul/27/guide-dogs-service-name-puppies-280716
2. FIFA: el trofeo fue robado el domingo 20 de marzo de 1966; hubo engaños y una nota de rescate. https://www.fifa.com/news/pickles-and-the-stolen-world-cup-2771152
3. Wikipedia: Pickles era un collie; lo halló en Beulah Hill, Upper Norwood (sur de Londres). https://en.wikipedia.org/wiki/Pickles_(dog)
4. Channel 4 / ITN: petición de rescate falsa de £15.000 durante la semana en que estuvo perdido. https://channel4.com/news/world-cup-england-1966-pickles-the-dog-archive-itn

---

## 9. Montaje técnico en Claude Code

### 9.1 Stack recomendado

- **Remotion** (React → video): animación por código, ideal para plantillas que se repiten. *(Revisar los términos de licencia de Remotion para uso comercial según el tamaño de la empresa.)*
- **Node 18+**, **TypeScript**.
- **ElevenLabs API**: voz (TTS con marcas de tiempo por palabra) y efectos de sonido.
- **ffmpeg**: normalización de audio (−14 LUFS), conversión y miniaturas.
- **Metricool** (opcional): programación de publicaciones.

### 9.2 Estructura del proyecto

```
el-utilero/
├─ BRAND.md                      ← este documento
├─ config/
│  ├─ brand.ts                   ← paleta, fuentes y tiempos (secciones 2 y 5)
│  └─ voice.json                 ← voice_id y ajustes de ElevenLabs
├─ assets/
│  ├─ textures/                  ← escaneos reales (2.5)
│  ├─ character/                 ← SVG por capas (4.7): expresiones, poses, bocas
│  ├─ objects/                   ← objetos del día (3.3)
│  ├─ locker/                    ← puerta, interior y estados (3.2)
│  ├─ logo/                      ← logotipo, escudo, avatar, marca mínima (6)
│  └─ sfx/                       ← efectos (5.6)
├─ episodes/
│  └─ 001-pickles/
│     ├─ episode.json            ← guion estructurado + fuentes (9.3)
│     ├─ voice.mp3               ← generado
│     └─ words.json              ← tiempos por palabra (subtítulos)
├─ src/
│  ├─ components/                ← Cinta, Sello, Ficha, PalabraGigante, Tiza, Marcador,
│  │                                Camerino, Utilero, NivelSecreto, Subtitulos, Grano
│  ├─ scenes/                    ← Gancho, Sting, Apertura, Contexto, Giro, Remate, Cierre
│  └─ compositions/              ← Short (1080×1920), Miniatura (1280×720), Post (1080×1350)
└─ scripts/
   ├─ generate-voice.ts          ← episode.json → voice.mp3 + words.json
   ├─ render.ts                  ← render del episodio
   └─ verify-sources.md          ← checklist de verificación
```

### 9.3 Esquema de episodio (`episode.json`)

```json
{
  "id": "001",
  "slug": "pickles",
  "serie": "El Camerino",
  "titulo": "El perro que salvó la Copa",
  "pais": "Inglaterra",
  "anio": 1966,
  "objeto": "bulto envuelto en papel periódico",
  "nivelSecreto": 5,
  "escenas": [
    { "tipo": "gancho", "fondo": "pizarra", "texto": "UN PERRO SALVÓ LA COPA DEL MUNDO", "resaltar": "PERRO", "voz": "Un perro salvó la Copa del Mundo. Y no es un chiste." },
    { "tipo": "sting" },
    { "tipo": "apertura", "expresion": "E3", "voz": "Cierren la puerta, que les cuento." },
    { "tipo": "contexto", "ficha": "LONDRES · 20.03.1966", "sello": "ROBADA", "voz": "Marzo de 1966. Faltaban cuatro meses para el Mundial de Inglaterra… y alguien se robó el trofeo de una exhibición en Londres." },
    { "tipo": "contexto", "ficha": "Piden rescate", "marcador": "rescate", "voz": "La policía no encontraba nada. Hasta llegó una petición de rescate." },
    { "tipo": "giro", "camerino": "abierto", "pose": "P5", "expresion": "E4", "palabraGigante": "27.03", "voz": "Siete días después, un perro llamado Pickles salió a pasear con su dueño, olfateó un paquete envuelto en periódico… y adentro estaba la Copa." },
    { "tipo": "remate", "ficha": "30.07.1966 — Inglaterra campeón", "cinta": "¡su único Mundial!", "voz": "Ese julio, Inglaterra ganó el Mundial. El único que tiene." },
    { "tipo": "cierre", "expresion": "E2", "voz": "Al perro lo trataron como un héroe. Yo estaba ahí. Bueno… casi. Comenten su país y mañana abro su camerino." }
  ],
  "textoFinal": "@elutilerofutbol · Mañana: camerino #002",
  "fuentes": [
    "https://www.thefa.com/news/2016/jul/27/guide-dogs-service-name-puppies-280716",
    "https://www.fifa.com/news/pickles-and-the-stolen-world-cup-2771152",
    "https://en.wikipedia.org/wiki/Pickles_(dog)",
    "https://channel4.com/news/world-cup-england-1966-pickles-the-dog-archive-itn"
  ]
}
```

La duración de cada escena sale de la duración real del audio (`words.json`), no de un número fijo.

### 9.4 Especificaciones de salida

| Pieza | Tamaño | Formato |
|---|---|---|
| Short / Reel / TikTok | 1080×1920, 30 fps | MP4 H.264, CRF 18, AAC 192 kbps, −14 LUFS |
| Miniatura YouTube | 1280×720 | PNG / JPG |
| Post Instagram | 1080×1350 | PNG |
| Avatar | 800×800 (circular) | PNG |

---

## 10. Reglas editoriales y de plataforma

1. **Dos fuentes por dato**, anotadas en `episode.json`. Si no hay dos fuentes, el dato no sale.
2. **El narrador es ficción, los datos no.** Decirlo en la bio: *"El Utilero es un personaje. Los datos son reales y con fuente."*
3. **Cero imágenes de partidos, transmisiones ni fotos con derechos.** Todo se dibuja o se fotografía por nosotros.
4. **Sin logos oficiales** (FIFA, federaciones, clubes) ni el nombre "Mundial / World Cup" en la marca.
5. **Nada de contenido en serie sin criterio:** YouTube no monetiza el "contenido no auténtico" (videos repetitivos o producidos en masa). Cada episodio debe tener investigación, guion y edición propios; la plantilla acelera, no reemplaza.
6. No usar fotos de personas reales en las piezas; los protagonistas se cuentan con objetos, fechas y tipografía.

---

## 11. Plan de trabajo por fases

| Fase | Entregable | Hecho cuando… |
|---|---|---|
| **0. Base** | Usuarios apartados, proyecto Remotion creado, `brand.ts` con paleta y fuentes. | Renderiza un cuadro vacío con el grano y las fuentes cargadas. |
| **1. Componentes** | Cinta, Sello, Ficha, PalabraGigante, Tiza, Marcador, Grano, NivelSecreto (A01–A07, A11). | Una escena de prueba con todos animados y sonido. |
| **2. Camerino** | Puerta + interior en capas + estados + A08/A09 + sting de 2 s. | Sting renderizado con sonido. |
| **3. Personaje** | Rig con el SVG base (4.3): parpadeo, respiración, guiño, bocas simples. Luego se reemplaza por las capas del ilustrador. | El utilero dice la línea de prueba sincronizado. |
| **4. Voz** | Voz diseñada en ElevenLabs + `generate-voice.ts` con tiempos por palabra. | `voice.mp3` y `words.json` del #001. |
| **5. Episodio #001** | Short completo de Pickles + miniatura + post. | Video final revisado en un celular real. |
| **6. Escala** | Episodios #002–#010 (verificar fuentes primero), calendario de publicación. | 10 episodios listos antes de lanzar. |

---

## 12. Pendientes y decisiones abiertas

- [x] **Concepto central: "El Camerino"** (22-nov-2026). El casillero metálico leía como deporte estadounidense; la puerta del vestuario es fútbol puro. Serie principal = *El Camerino*; numeración = *Camerino #001*.

- [x] Usuario definido: **@elutilerofutbol** (el nombre original no estaba disponible).
- [x] **Cierre sin frase en pantalla** (22-nov-2026). «Esto no salió en la tele» queda solo en la voz; en pantalla estorbaba a los subtítulos y le quitaba espacio al Utilero.
- [ ] Contratar ilustrador para la hoja de modelo (4.8).
- [ ] Fabricar y escanear texturas reales (2.5).
- [x] Voz diseñada y guardada en ElevenLabs: «El Utilero» (`config/voice.json`).
- [ ] Verificar las historias #003–#009 con dos fuentes cada una.
- [ ] Definir frecuencia de publicación (sugerido: 1 Short diario, 1 recopilación larga semanal para YouTube).
