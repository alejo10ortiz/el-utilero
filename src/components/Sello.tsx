import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { A, C, FONT } from '../../config/brand';
import { Sfx } from './Sfx';

/**
 * A02 — Sello (8 f): escala 1.6 → 0.95 → 1.0, opacidad 0 → 0.88.
 * El rojo es SOLO para sellos (regla 5). El temblor de cámara lo aplica CamaraMesa
 * con un impacto en `delay + 3`.
 */
export const Sello: React.FC<{
  texto: string;
  x: number;
  y: number;
  rot?: number;
  size?: number;
  delay?: number;
  sonido?: boolean;
  /** 'multiply' sobre papel; 'normal' sobre superficies oscuras o kraft. */
  mezcla?: 'multiply' | 'normal';
}> = ({ texto, x, y, rot = -10, size = 120, delay = 0, sonido = true, mezcla = 'multiply' }) => {
  const frame = useCurrentFrame();
  if (frame < delay) return null;
  const f = frame - delay;
  const scale = interpolate(f, [0, 3, 5, A.sello], [1.6, 0.95, 1.03, 1], { extrapolateRight: 'clamp' });
  const opacity = interpolate(f, [0, 2], [0, 0.88], { extrapolateRight: 'clamp' });
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
          fontFamily: FONT.grito,
          fontSize: size,
          lineHeight: 0.95,
          letterSpacing: '0.08em',
          color: C.sello,
          border: `${Math.max(4, size * 0.045)}px solid ${C.sello}`,
          padding: `${size * 0.03}px ${size * 0.14}px 0`,
          whiteSpace: 'nowrap',
          opacity,
          mixBlendMode: mezcla,
          filter: 'url(#rough)',
        }}
      >
        {texto}
      </div>
      {sonido && <Sfx name="stamp" at={delay} volume={0.9} />}
    </>
  );
};
