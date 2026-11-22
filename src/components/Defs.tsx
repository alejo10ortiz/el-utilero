import React from 'react';
import { C } from '../../config/brand';

/**
 * Filtros y patrones SVG compartidos (BRAND.md §2.4).
 * Se monta UNA vez por composición. Los demás componentes los referencian por id:
 *   #rough  borde irregular (sellos, tinta gastada)
 *   #chalk  tiza sobre pizarra
 *   #dots   trama de puntos del personaje
 *   #ink    tinta corrida: borde levemente irregular para tipografía impresa
 */
export const Defs: React.FC = () => (
  <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden>
    <defs>
      <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={2} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={5} xChannelSelector="R" yChannelSelector="G" />
      </filter>

      <filter id="chalk" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves={2} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.0 1.95" result="m" />
        <feComposite in="SourceGraphic" in2="m" operator="in" result="c" />
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} result="w" />
        <feDisplacementMap in="c" in2="w" scale={4} xChannelSelector="R" yChannelSelector="G" />
      </filter>

      <filter id="ink" x="-3%" y="-3%" width="106%" height="106%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={2.2} xChannelSelector="R" yChannelSelector="G" />
      </filter>

      <pattern id="dots" width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
        <circle cx={4.5} cy={4.5} r={2.3} fill={C.tinta} />
      </pattern>
      <pattern id="dotsLima" width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
        <circle cx={4.5} cy={4.5} r={2.3} fill={C.lima} />
      </pattern>
    </defs>
  </svg>
);
