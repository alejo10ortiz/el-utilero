import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { A, C, FONT } from '../../config/brand';
import { prog } from '../lib/anim';
import { Sfx } from './Sfx';

/**
 * Carpeta kraft de archivo con pestaña (BRAND.md §2.2: Kraft / Kraft oscuro).
 * Atrás sobresale una hoja con la frase del utilero (Instrument Serif, "lo que susurra");
 * adelante, la solapa con la etiqueta a máquina. Entra deslizándose (A06).
 * Los hijos se dibujan encima de la solapa (objeto del día, sellos) en coordenadas locales de la carpeta.
 */
export const Carpeta: React.FC<{
  x: number;
  y: number;
  ancho?: number;
  alto?: number;
  rot?: number;
  delay?: number;
  /** Etiqueta a máquina de la solapa, p. ej. "ARCHIVO 1/4". */
  etiqueta?: string;
  /** Frase del utilero. */
  cita?: string;
  sonido?: boolean;
  children?: React.ReactNode;
}> = ({ x, y, ancho = 820, alto = 560, rot = -1.6, delay = 0, etiqueta, cita, sonido = true, children }) => {
  const frame = useCurrentFrame();
  if (frame < delay) return null;
  const p = prog(frame, delay, A.ficha + 2, Easing.out(Easing.poly(4)));
  const ty = (1 - p) * 1100;
  const rotacion = rot + (1 - p) * 7;
  const citaOp = interpolate(frame, [delay + 12, delay + 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flapY = 262;
  const back = `M0 44 Q0 10 34 10 H236 L268 52 H${ancho - 22} Q${ancho} 52 ${ancho} 76 V${alto} H0 Z`;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: ancho,
          height: alto,
          transform: `translateY(${ty}px) rotate(${rotacion}deg)`,
          transformOrigin: '50% 60%',
          filter: 'drop-shadow(0 24px 26px rgba(22,19,15,0.38))',
        }}
      >
        {/* atrás + pestaña */}
        <svg width={ancho} height={alto} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <path d={back} fill={C.kraftOscuro} stroke={C.tinta} strokeWidth={4} strokeLinejoin="round" />
        </svg>
        {/* hoja que sobresale con la frase */}
        <div
          style={{
            position: 'absolute',
            left: 46,
            top: 70,
            width: ancho - 110,
            height: alto - 120,
            background: C.ficha,
            transform: 'rotate(1.2deg)',
            boxShadow: '0 2px 0 rgba(22,19,15,0.12)',
            padding: '22px 34px 0',
            boxSizing: 'border-box',
          }}
        >
          {cita && (
            <div
              style={{
                fontFamily: FONT.susurro,
                fontStyle: 'italic',
                fontSize: cita.length > 36 ? 50 : 60,
                lineHeight: 1.04,
                letterSpacing: '-0.015em',
                color: C.tinta,
                opacity: citaOp,
              }}
            >
              {cita}
            </div>
          )}
        </div>
        {/* solapa frontal */}
        <svg width={ancho} height={alto} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <path
            d={`M0 ${flapY + 8} L${ancho * 0.3} ${flapY} L${ancho * 0.62} ${flapY + 10} L${ancho} ${flapY + 2} V${alto} H0 Z`}
            fill={C.kraft}
            stroke={C.tinta}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <path d={`M14 ${flapY + 26} H${ancho - 14}`} stroke={C.kraftOscuro} strokeWidth={3} opacity={0.6} />
          <rect x={0} y={flapY} width={ancho} height={alto - flapY} fill="url(#dots)" opacity={0.08} />
        </svg>
        {/* etiqueta pegada en la pestaña */}
        {etiqueta && (
          <div
            style={{
              position: 'absolute',
              left: 26,
              top: 12,
              padding: '4px 18px 2px',
              background: C.ficha,
              fontFamily: FONT.maquina,
              fontSize: 30,
              letterSpacing: '0.12em',
              color: C.tinta,
              transform: 'rotate(-1.5deg)',
              boxShadow: '0 3px 6px -4px rgba(22,19,15,0.5)',
            }}
          >
            {etiqueta}
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
      </div>
      {sonido && <Sfx name="paper_slide" at={delay} volume={0.7} />}
    </>
  );
};
