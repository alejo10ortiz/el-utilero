import React from 'react';
import { useCurrentFrame } from 'remotion';
import { A, C, FONT } from '../../config/brand';
import { hit } from '../lib/anim';
import { Sfx } from './Sfx';

/**
 * A01 — Cinta pegada (6 f): entra rotada −15° y escala 1.3 → 1.0 con rebote;
 * la sombra crece de 0 a su valor final. Marcador rotado siempre (regla 4).
 */
export const Cinta: React.FC<{
  texto: string;
  x: number; // centro
  y: number; // centro
  rot?: number;
  size?: number;
  delay?: number;
  sonido?: boolean;
  color?: string;
}> = ({ texto, x, y, rot = -4, size = 58, delay = 0, sonido = true, color = C.cinta }) => {
  const frame = useCurrentFrame();
  const t = hit(frame, delay, A.cinta);
  if (frame < delay) return null;
  const k = Math.min(t, 1);
  const scale = 1 + 0.3 * (1 - t);
  const rotation = rot - 15 * (1 - t);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
          fontFamily: FONT.marcador,
          fontSize: size,
          lineHeight: 1,
          color: C.tinta,
          background: color,
          padding: `${size * 0.26}px ${size * 0.55}px ${size * 0.16}px`,
          whiteSpace: 'nowrap',
          clipPath:
            'polygon(0 10%,3% 0,50% 4%,97% 0,100% 12%,98% 50%,100% 90%,96% 100%,50% 95%,4% 100%,0 88%,2% 50%)',
          filter: `drop-shadow(0 ${6 * k}px ${10 * k}px rgba(22,19,15,0.35))`,
        }}
      >
        {texto}
      </div>
      {sonido && <Sfx name="tape" at={delay} volume={0.8} />}
    </>
  );
};
