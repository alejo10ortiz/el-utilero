import React from 'react';
import { C } from '../../config/brand';
import { useTema } from '../lib/tema';
import { FondoTema } from './FondoTema';

type Tipo = 'papel' | 'pizarra' | 'lima' | 'tinta';

const BASE: Record<Tipo, string> = {
  papel: C.papel,
  pizarra: C.pizarra,
  lima: C.lima,
  tinta: C.tinta,
};

/**
 * Fondos de mesa: papel periódico, pizarra, lima (cierre).
 * Nunca color plano: viñeta + manchas de baja frecuencia + (en pizarra) borrones de tiza.
 */
export const Fondo: React.FC<{ tipo: Tipo; width?: number; height?: number }> = ({
  tipo,
  width = 1080,
  height = 1920,
}) => {
  const tema = useTema();
  if (tema.id !== 'clasico' && tipo !== 'tinta') return <FondoTema tipo={tipo} tema={tema} width={width} height={height} />;
  const id = `fondo-${tipo}`;
  const stains = tipo === 'pizarra';
  return (
    <div style={{ position: 'absolute', inset: -240, background: BASE[tipo] }}>
      <svg
        width={width + 480}
        height={height + 480}
        style={{ position: 'absolute', inset: 0, mixBlendMode: stains ? 'screen' : 'multiply' }}
      >
        <filter id={`${id}-blot`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.006" numOctaves={4} seed={7} />
          <feColorMatrix
            type="matrix"
            values={
              stains
                ? '0 0 0 0 0.93  0 0 0 0 0.92  0 0 0 0 0.89  0 0 0 -1.6 0.78'
                : '0 0 0 0 0.35  0 0 0 0 0.30  0 0 0 0 0.22  0 0 0 1.5 -0.62'
            }
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id}-blot)`} opacity={stains ? 0.34 : 0.5} />
        {/* fibras de papel / arrastre de borrador */}
        <filter id={`${id}-fiber`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.16" numOctaves={3} seed={11} />
          <feColorMatrix
            type="matrix"
            values={
              stains
                ? '0 0 0 0 0.93  0 0 0 0 0.92  0 0 0 0 0.89  0 0 0 -2.2 1.1'
                : '0 0 0 0 0.35  0 0 0 0 0.30  0 0 0 0 0.22  0 0 0 2.0 -0.95'
            }
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id}-fiber)`} opacity={stains ? 0.16 : 0.13} />
      </svg>
      {/* viñeta */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            tipo === 'lima'
              ? 'radial-gradient(ellipse at 50% 40%, rgba(22,19,15,0) 55%, rgba(22,19,15,0.14) 100%)'
              : 'radial-gradient(ellipse at 50% 42%, rgba(22,19,15,0) 50%, rgba(22,19,15,0.26) 100%)',
        }}
      />
    </div>
  );
};
