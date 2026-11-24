import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, FPS, SAFE_BOX } from '../../config/brand';
import { E, hash, pop, tw } from '../lib/ease';
import type { WordTiming } from '../lib/timeline';
import { useTema } from '../lib/tema';
import { PalabrasEstilo } from './PalabrasEstilos';
import { agrupar } from './Subtitulos';

const limpia = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();

/**
 * Subtítulos CINÉTICOS: cada palabra entra con rebote EN EL INSTANTE en que se dice (no antes),
 * la palabra clave lleva caja lima que se barre, la palabra activa crece un poco.
 * Mayúsculas Archivo 800, sombra de registro riso. Grupos de 1–3 palabras.
 */
const PalabrasClasico: React.FC<{
  words: WordTiming[];
  offsetFrames: number;
  tono?: 'papel' | 'pizarra' | 'lima';
  claves?: string[];
  y?: number;
  size?: number;
  /** Margen izquierdo y ancho útil (por defecto la zona segura del Short vertical). */
  x0?: number;
  ancho?: number;
}> = ({ words, offsetFrames, tono = 'papel', claves = [], y = 1230, size = 86, x0 = SAFE_BOX.x0, ancho = SAFE_BOX.w }) => {
  const frame = useCurrentFrame();
  const t = (frame + offsetFrames) / FPS;
  const grupos = React.useMemo(() => agrupar(words), [words]);
  const idx = grupos.findIndex((g, i) => {
    const next = grupos[i + 1];
    const hasta = next ? Math.min(next.start, g.end + 0.4) : g.end + 0.3;
    return t >= g.start - 0.04 && t < hasta;
  });
  if (idx < 0) return null;
  const g = grupos[idx];
  const next = grupos[idx + 1];
  const finGrupo = next ? Math.min(next.start, g.end + 0.4) : g.end + 0.3;
  const salida = tw((finGrupo - t) * FPS, [0, 3], [0, 1], E.outCubic); // últimos 3 frames: se achica y se va
  const claveSet = new Set(claves.map(limpia));
  let clavePropia = -1;
  if (!g.palabras.some((p) => claveSet.has(limpia(p.text)))) {
    let best = 4;
    g.palabras.forEach((p, i) => {
      const l = limpia(p.text);
      if (/\d/.test(l)) clavePropia = i;
      else if (l.length > best) {
        best = l.length;
        clavePropia = i;
      }
    });
  }
  const color = tono === 'pizarra' ? C.tiza : C.tinta;
  const sombra = tono === 'papel' ? `${size * 0.05}px ${size * 0.05}px 0 ${C.lima}` : tono === 'pizarra' ? `0 4px 0 rgba(0,0,0,0.5)` : `${size * 0.05}px ${size * 0.05}px 0 rgba(255,255,255,0.55)`;
  return (
    <div
      style={{
        position: 'absolute', left: x0, width: ancho, top: y,
        display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: `0 ${size * 0.26}px`,
        fontFamily: FONT.subtitulo, fontWeight: 800, fontSize: size, lineHeight: 1.08, letterSpacing: '-0.01em',
        textTransform: 'uppercase', textAlign: 'center', color,
        transform: `scale(${0.88 + 0.12 * salida})`, opacity: salida,
      }}
    >
      {g.palabras.map((p, i) => {
        const inicio = p.start * FPS - offsetFrames - 1;
        const k = pop(frame, inicio, 9);
        const visible = frame >= inicio;
        const clave = claveSet.has(limpia(p.text)) || i === clavePropia;
        const activa = t >= p.start && t <= p.end;
        const rot = (hash(i * 7 + Math.round(g.start * 10)) - 0.5) * 7 * (1 - Math.min(1, k));
        return (
          <span
            key={i}
            style={{
              position: 'relative', display: 'inline-block',
              visibility: visible ? 'visible' : 'hidden',
              transform: `translateY(${(1 - k) * 46}px) scale(${(0.5 + 0.5 * k) * (activa ? 1.07 : 1)}) rotate(${rot + (clave ? (i % 2 ? 1.5 : -1.5) : 0)}deg)`,
              opacity: Math.min(1, k * 3),
              padding: clave ? `0 ${size * 0.13}px` : 0,
              color: clave ? (tono === 'lima' ? C.lima : C.tinta) : color,
              textShadow: clave ? 'none' : sombra,
            }}
          >
            {clave && (
              <span
                style={{
                  position: 'absolute', inset: `${size * 0.02}px 0 ${size * 0.0}px 0`, zIndex: -1,
                  background: tono === 'lima' ? C.tinta : C.lima,
                  transform: `scaleX(${tw(frame, [inicio, inicio + 7], [0, 1], E.outExpo)})`, transformOrigin: 'left center',
                }}
              />
            )}
            {p.text.replace(/[.,;:¡!¿?…]+$/u, '')}
          </span>
        );
      })}
    </div>
  );
};

/** Subtítulos cinéticos: el estilo (clásico, subrayador, etiqueta, recorte, máquina) lo decide el tema de la escena. */
export const Palabras: React.FC<{
  words: WordTiming[];
  offsetFrames: number;
  tono?: 'papel' | 'pizarra' | 'lima';
  claves?: string[];
  y?: number;
  size?: number;
  /** Margen izquierdo y ancho útil (por defecto la zona segura del Short vertical). */
  x0?: number;
  ancho?: number;
}> = (props) => {
  const tema = useTema();
  if (tema.subtitulos === 'clasico') return <PalabrasClasico {...props} />;
  return <PalabrasEstilo estilo={tema.subtitulos} {...props} />;
};
