import React from 'react';
import { FPS, SAFE_BOX } from '../../config/brand';
import { PalabraGigante } from '../components/PalabraGigante';
import { Subtitulos } from '../components/Subtitulos';
import { Utilero } from '../components/Utilero';
import { Escenario, EscenaProps } from './Escenario';

/** APERTURA (5–7 s): el utilero susurra con la mano en la boca (E3 + P3). «Cierren la puerta, que les cuento.» */
export const Apertura: React.FC<EscenaProps> = ({ esc, timing }) => {
  const off = Math.round(timing.start * FPS);
  return (
    <Escenario fondo="papel">
      <PalabraGigante texto={esc.palabraGigante ?? 'SHH'} x={SAFE_BOX.cx - 400} y={170} ancho={800} maxSize={560} delay={4} />
      <Utilero
        expresion={esc.expresion ?? 'E3'}
        pose={esc.pose ?? 'P3'}
        words={timing.words}
        offsetFrames={off}
        size={800}
        x={SAFE_BOX.cx - 400}
        y={470}
      />
      <Subtitulos words={timing.words} offsetFrames={off} claves={esc.claves} />
    </Escenario>
  );
};
