import React from 'react';
import { FPS, SAFE_BOX } from '../../config/brand';
import { PalabraGigante } from '../components/PalabraGigante';
import { Logotipo } from '../components/Logo';
import { hit } from '../lib/anim';
import { useCurrentFrame } from 'remotion';
import { Subtitulos } from '../components/Subtitulos';
import { Utilero } from '../components/Utilero';
import { Escenario, EscenaProps } from './Escenario';

/** APERTURA (5–7 s): el utilero susurra con la mano en la boca (E3 + P3). «Cierren la puerta, que les cuento.» */
export const Apertura: React.FC<EscenaProps> = ({ esc, timing }) => {
  const frame = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const pop = Math.max(0.001, hit(frame, 4, 6));
  return (
    <Escenario fondo="papel">
      {esc.logo ? (
        <div style={{ position: 'absolute', left: SAFE_BOX.cx - 342, top: 170, transform: `scale(${pop})`, transformOrigin: '50% 60%' }}>
          <Logotipo size={265} />
        </div>
      ) : (
        <PalabraGigante texto={esc.palabraGigante ?? 'SHH'} x={SAFE_BOX.cx - 400} y={170} ancho={800} maxSize={560} delay={4} />
      )}
      <Utilero
        expresion={esc.expresion ?? 'E3'}
        pose={esc.pose ?? 'P3'}
        words={timing.words}
        offsetFrames={off}
        size={esc.logo ? 760 : 800}
        x={SAFE_BOX.cx - (esc.logo ? 380 : 400)}
        y={esc.logo ? 520 : 470}
      />
      <Subtitulos words={timing.words} offsetFrames={off} claves={esc.claves} />
    </Escenario>
  );
};
