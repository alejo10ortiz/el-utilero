import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { A, C, FONT } from '../../config/brand';
import { Sfx } from './Sfx';

/** Llave a medida: anillo-balón + fuste + dientes (marca mínima, §6). Pinta con `color`. */
export const Llave: React.FC<{ size?: number; color?: string; relleno?: boolean; rot?: number; hueco?: string }> = ({
  size = 120, color = C.tinta, relleno = true, rot = 0, hueco = C.lima,
}) => (
  <svg width={size * 0.5} height={size} viewBox="0 0 60 120" style={{ transform: `rotate(${rot}deg)`, overflow: 'visible' }}>
    <circle cx={30} cy={24} r={20} fill={relleno ? color : 'none'} stroke={color} strokeWidth={relleno ? 0 : 5} />
    {/* pentágono central: el anillo es un balón */}
    <polygon points="30,12 41.5,20.5 37,34 23,34 18.5,20.5" fill={relleno ? hueco : color} opacity={relleno ? 1 : 0.5} />
    <rect x={24} y={42} width={12} height={72} rx={2} fill={relleno ? color : 'none'} stroke={color} strokeWidth={relleno ? 0 : 4} />
    <rect x={36} y={84} width={16} height={9} fill={relleno ? color : 'none'} stroke={color} strokeWidth={relleno ? 0 : 3} />
    <rect x={36} y={100} width={11} height={9} fill={relleno ? color : 'none'} stroke={color} strokeWidth={relleno ? 0 : 3} />
  </svg>
);

/**
 * A11 — Nivel de secreto (4 f por llave): cada llave cae y tintinea.
 * 1 a 5 llaves; las no ganadas quedan como contorno.
 */
export const NivelSecreto: React.FC<{
  nivel: number;
  x: number; // centro
  y: number;
  size?: number;
  delay?: number;
}> = ({ nivel, x, y, size = 150, delay = 0 }) => {
  const frame = useCurrentFrame();
  const gap = size * 0.58;
  const total = 5;
  return (
    <>
      <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, 0)', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: FONT.maquina,
            fontSize: size * 0.22,
            letterSpacing: '0.22em',
            color: C.tinta,
            marginBottom: size * 0.1,
            opacity: interpolate(frame, [delay - 4, delay + 2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          NIVEL DE SECRETO
        </div>
        <div style={{ display: 'flex', gap: gap - size * 0.5, justifyContent: 'center', height: size * 1.25 }}>
          {Array.from({ length: total }).map((_, i) => {
            const on = i < nivel;
            const d = delay + i * A.llaveFrames;
            const t = frame - d;
            const drop = on ? interpolate(t, [0, 3, 4, 6, 8], [-260, 8, -10, 0, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
            const swing = on && t > 0 ? Math.sin(t * 0.9) * 9 * Math.exp(-t / 9) : 0;
            const visible = on ? t >= 0 : true;
            return (
              <div key={i} style={{ opacity: visible ? (on ? 1 : 0.22) : 0, transform: `translateY(${drop}px) rotate(${swing}deg)`, transformOrigin: '50% 0%' }}>
                <Llave size={size} relleno={on} />
              </div>
            );
          })}
        </div>
      </div>
      {Array.from({ length: nivel }).map((_, i) => (
        <Sfx key={i} name="key_drop" at={delay + i * A.llaveFrames + 3} volume={0.55} />
      ))}
    </>
  );
};
