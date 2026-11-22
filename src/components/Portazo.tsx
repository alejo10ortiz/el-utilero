import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { A, C } from '../../config/brand';
import { Puerta } from './Camerino';
import { Sfx } from './Sfx';

/**
 * A09 — Portazo (8 f): la puerta pasa de 100° a 0° con rebote y tapa todo el cuadro.
 * El temblor de cámara de 6 px lo pone CamaraMesa en `delay + A.portazo`.
 */
export const Portazo: React.FC<{ delay: number; numero?: string; sonido?: boolean; ancho?: number; alto?: number }> = ({
  delay, numero = '001', sonido = true, ancho = 1080, alto = 1920,
}) => {
  const frame = useCurrentFrame();
  const f = frame - delay;
  if (f < -1) return null;
  const ang = interpolate(f, [0, A.portazo - 1, A.portazo + 1, A.portazo + 4, A.portazo + 7], [100, 0, -4, 1.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const s = Math.max(ancho / 600, alto / 1400);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, perspective: 2400, overflow: 'hidden', pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: ancho,
            height: alto,
            transformOrigin: '0 50%',
            transform: `rotateY(${-ang}deg)`,
            background: C.metal,
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', left: 0, top: (alto - 1400 * s) / 2, width: 600, height: 1400, transform: `scale(${s})`, transformOrigin: '0 0' }}>
            <Puerta numero={numero} />
          </div>
        </div>
      </div>
      {sonido && (
        <>
          <Sfx name="slam" at={delay + A.portazo - 1} volume={1} />
          <Sfx name="whistle" at={delay + A.portazo + 2} volume={0.8} />
        </>
      )}
    </>
  );
};
