import React from 'react';
import type { FormaPolvo } from '../lib/tema';

/** Forma de cada mota de «polvo» según el tema: virutas de lápiz, fibras de estraza, cruces de registro, anillos de trama. */
export const polvoForma = (forma: FormaPolvo, k: { i: number; x: number; y: number; s: number; c: string; o: number; rot: number }): React.ReactElement | null => {
  const { i, x, y, s, c, o, rot } = k;
  switch (forma) {
    case 'virutas':
      return (
        <path
          key={i}
          d={`M0 0 C${s} ${-s * 1.3} ${s * 2.3} ${-s * 0.7} ${s * 2.7} ${s * 0.5} C${s * 1.9} ${s * 0.1} ${s * 0.9} ${s * 0.4} 0 0 Z`}
          fill={c}
          opacity={o}
          transform={`translate(${x} ${y}) rotate(${rot * 0.4}) scale(1.6)`}
        />
      );
    case 'fibras':
      return <path key={i} d={`M${-s * 2.4} 0 Q0 ${-s * 0.7} ${s * 2.4} ${s * 0.4}`} fill="none" stroke={c} strokeWidth={Math.max(1.4, s * 0.3)} strokeLinecap="round" opacity={o} transform={`translate(${x} ${y}) rotate(${rot * 0.25})`} />;
    case 'cruces':
      return <path key={i} d={`M${-s * 1.5} 0 H${s * 1.5} M0 ${-s * 1.5} V${s * 1.5}`} fill="none" stroke={c} strokeWidth={2.6} strokeLinecap="round" opacity={o} transform={`translate(${x} ${y}) rotate(${45 + rot * 0.15})`} />;
    case 'trama':
      return <circle key={i} cx={x} cy={y} r={s * 0.9} fill="none" stroke={c} strokeWidth={2.4} opacity={o} />;
    default:
      return null;
  }
};
