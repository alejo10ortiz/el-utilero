import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import { A, C, FONT } from '../../config/brand';
import { prog } from '../lib/anim';
import { Sfx } from './Sfx';

export type Linea = { texto: string; resaltada?: boolean };

/** Parte un titular en líneas cortas (≤ `max` caracteres) para contraste extremo de tamaños (regla 2). */
export const partirTitular = (texto: string, max = 9): string[] => {
  const words = texto.trim().split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (!cur) cur = w;
    else if ((cur + ' ' + w).length <= max) cur += ' ' + w;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
};

/** Mide un titular partido en líneas ajustadas al ancho: tamaños y alto total (interlineado 0.84). */
export const medirTitular = (texto: string, ancho: number, maxSize = 520, maxChars = 9) => {
  const lineas = partirTitular(texto, maxChars);
  const items = lineas.map((l) => {
    const { fontSize } = fitText({ text: l, withinWidth: ancho, fontFamily: 'League Gothic', fontWeight: '400' });
    return { l, size: Math.min(maxSize, fontSize) };
  });
  const alto = items.reduce((a, it) => a + it.size * 0.84, 0);
  return { items, alto };
};

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * A05 — Palabra gigante (5 f): cae desde y −40 px; el desregistro lima crece de 0 a 10 px en 3 f.
 * Una palabra gigante por pieza (regla 2), League Gothic, interlineado 0.84.
 * tono: 'tinta' (papel/lima) | 'tiza' (pizarra, filtro de tiza).
 */
export const PalabraGigante: React.FC<{
  texto: string;
  /** Caja donde debe encajar (px). Las líneas se ajustan al ancho. */
  x: number;
  y: number;
  ancho: number;
  maxSize?: number;
  tono?: 'tinta' | 'tiza';
  resaltar?: string;
  rot?: number;
  delay?: number;
  /** Fotogramas entre línea y línea (la voz va marcando el golpe). */
  escalon?: number;
  align?: 'left' | 'center' | 'right';
  maxCharsLinea?: number;
  sonido?: boolean;
  /** Registro lima (desregistro). */
  registro?: boolean;
}> = ({
  texto, x, y, ancho, maxSize = 520, tono = 'tinta', resaltar, rot = 0, delay = 0, escalon = 5,
  align = 'center', maxCharsLinea = 9, sonido = true, registro = true,
}) => {
  const frame = useCurrentFrame();
  const tiza = tono === 'tiza';
  const color = tiza ? C.tiza : C.tinta;
  const { items } = medirTitular(texto, ancho, maxSize, maxCharsLinea);

  const justify = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: ancho,
          transform: `rotate(${rot}deg)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: justify,
          filter: tiza ? 'url(#chalk)' : 'url(#ink)',
        }}
      >
        {items.map((it, i) => {
          const d = delay + i * escalon;
          if (frame < d) return <div key={i} style={{ height: it.size * 0.84 }} />;
          const fall = prog(frame, d, A.palabra);
          const reg = interpolate(frame, [d, d + 3], [0, 10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const dy = -40 * (1 - fall);
          const opacity = interpolate(frame, [d, d + 2], [0, 1], { extrapolateRight: 'clamp' });
          const words = it.l.split(' ');
          return (
            <div
              key={i}
              style={{
                fontFamily: FONT.grito,
                fontSize: it.size,
                lineHeight: 0.84,
                whiteSpace: 'nowrap',
                color,
                transform: `translateY(${dy}px)`,
                opacity,
                textShadow: registro ? `${reg}px ${reg * 0.8}px 0 ${C.lima}` : undefined,
                letterSpacing: '0.005em',
              }}
            >
              {words.map((w, j) => {
                const hl = resaltar && norm(w) === norm(resaltar);
                return (
                  <React.Fragment key={j}>
                    {j > 0 && ' '}
                    <span
                      style={
                        hl
                          ? {
                              background: C.lima,
                              color: C.tinta,
                              padding: `${it.size * 0.02}px ${it.size * 0.06}px 0`,
                              textShadow: 'none',
                              display: 'inline-block',
                              transform: `rotate(-1.5deg) scaleX(${prog(frame, d + 4, 5)})`,
                              transformOrigin: 'left center',
                            }
                          : undefined
                      }
                    >
                      {w}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
      {sonido && items.map((_, i) => <Sfx key={i} name="thump" at={delay + i * escalon} volume={i === 0 ? 0.85 : 0.5} />)}
    </>
  );
};
