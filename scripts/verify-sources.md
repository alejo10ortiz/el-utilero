# Checklist de verificación de datos (regla de oro — BRAND.md §10)

Ningún dato sale al aire sin **dos fuentes verificables**, de **dominios distintos**, anotadas en `episode.json → fuentes`.
Solo entonces se cambia `"estado": "pendiente"` → `"verificado"` (el render lo exige).

## Por cada dato (fecha, lugar, cifra, nombre, "primero/único/récord")
- [ ] Lo encontré en **fuente primaria o institucional** (federación, organismo, archivo, prensa de la época) → fuente 1
- [ ] Lo confirmé en una **segunda fuente independiente** (no una copia de la primera) → fuente 2
- [ ] Fechas y cifras **coinciden exactamente** entre ambas (si difieren, el dato se reformula con "según…" o no sale)
- [ ] Los nombres propios están bien escritos (tildes, grafía original)
- [ ] La frase del guion **no afirma más** de lo que dicen las fuentes (cuidado con "el primero", "el único", "nunca")
- [ ] Hay una sola versión; si hay controversia real, el guion lo dice o el dato se descarta

## Por cada episodio
- [ ] El **objeto del día** es genérico (dibujado por nosotros), sin logos oficiales ni fotos con derechos
- [ ] No hay fotos de personas reales ni imágenes de partidos/transmisiones
- [ ] El narrador sigue siendo ficción declarada (bio: "El Utilero es un personaje. Los datos son reales y con fuente.")
- [ ] Investigación, guion y edición son **propios** de este episodio (YouTube no monetiza contenido repetitivo/en masa)
- [ ] `npm run verify -- NNN --online` sin errores
- [ ] Revisado en un celular real antes de publicar

## Qué hace el verificador automático (`npm run verify`)
Comprueba: esquema, ≥ 2 fuentes de ≥ 2 dominios, estado "verificado", estructura de escenas, duración estimada y términos de marca.
**No puede** comprobar que el contenido de la fuente respalde la frase: eso es trabajo humano (este checklist).
