import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, FPS, SAFE_BOX } from '../../config/brand';
import type { WordTiming } from '../lib/timeline';

type Grupo = { palabras: WordTiming[]; start: number; end: number };

const limpia = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();

/** Grupos de 1–3 palabras; corta en puntuación fuerte o cuando la línea se pone larga. */
export const agrupar = (words: WordTiming[]): Grupo[] => {
  const grupos: Grupo[] = [];
  let cur: WordTiming[] = [];
  const flush = () => {
    if (cur.length) grupos.push({ palabras: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  for (const w of words) {
    const chars = cur.reduce((a, c) => a + c.text.length + 1, 0) + w.text.length;
    if (cur.length >= 3 || (cur.length > 0 && chars > 20)) flush();
    cur.push(w);
    if (/[.!?…]$|[,;:]$/.test(w.text)) flush();
  }
  flush();
  return grupos;
};

/**
 * §5.5 — Archivo 800, 64–72 px, grupos de 1–3 palabras, palabra clave en lima con resaltador.
 * Se ubican en el tercio medio-inferior, por encima de la zona segura inferior.
 * `words` en SEGUNDOS ABSOLUTOS; `offsetFrames` es el inicio de la escena en frames.
 */
export const Subtitulos: React.FC<{
  words: WordTiming[];
  offsetFrames: number;
  tono?: 'papel' | 'pizarra' | 'lima';
  claves?: string[];
  y?: number;
  size?: number;
}> = ({ words, offsetFrames, tono = 'papel', claves = [], y = 1300, size = 68 }) => {
  const frame = useCurrentFrame();
  const t = (frame + offsetFrames) / FPS;
  const grupos = React.useMemo(() => agrupar(words), [words]);
  const idx = grupos.findIndex((g, i) => {
    const next = grupos[i + 1];
    const hasta = next ? Math.min(next.start, g.end + 0.35) : g.end + 0.25;
    return t >= g.start - 0.02 && t < hasta;
  });
  if (idx < 0) return null;
  const g = grupos[idx];
  const color = tono === 'pizarra' ? C.tiza : C.tinta;
  const claveSet = new Set(claves.map(limpia));
  // si no hay claves explícitas: la palabra más larga (≥5 letras) o un número
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
  const tonoSombra = tono === 'pizarra' ? 'rgba(0,0,0,0.5)' : 'rgba(236,229,211,0.0)';
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE_BOX.x0,
        width: SAFE_BOX.w,
        top: y,
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: `0 ${size * 0.28}px`,
        fontFamily: FONT.subtitulo,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.12,
        color,
        textAlign: 'center',
        textTransform: 'none',
        textShadow: `0 3px 0 ${tonoSombra}`,
      }}
    >
      {g.palabras.map((p, i) => {
        const clave = claveSet.has(limpia(p.text)) || i === clavePropia;
        return (
          <span
            key={i}
            style={{
              position: 'relative',
              display: 'inline-block',
              padding: clave ? `0 ${size * 0.12}px` : 0,
              color: clave && tono !== 'pizarra' ? (tono === 'lima' ? C.lima : C.tinta) : color,
              background: clave ? (tono === 'lima' ? C.tinta : C.lima) : undefined,
              transform: clave ? `rotate(${i % 2 ? 1.2 : -1.2}deg)` : undefined,
              ...(clave && tono === 'pizarra' ? { color: C.tinta } : {}),
            }}
          >
            {p.text.replace(/[.,;:¡!¿?…]+$/u, '')}
          </span>
        );
      })}
    </div>
  );
};
