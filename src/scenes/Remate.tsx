import React from 'react';
import { A, FPS, SAFE_BOX } from '../../config/brand';
import { Cinta } from '../components/Cinta';
import { Ficha } from '../components/Ficha';
import { PalabraGigante } from '../components/PalabraGigante';
import { Subtitulos } from '../components/Subtitulos';
import { Escenario, EscenaProps } from './Escenario';

/** REMATE (28–35 s): consecuencia o cifra final con palabra gigante; ficha + cinta con la nota a mano. */
export const Remate: React.FC<EscenaProps> = ({ esc, timing }) => {
  const off = Math.round(timing.start * FPS);
  const ficha = esc.ficha ?? '';
  const fichaDelay = 20;
  const typing = Math.ceil(ficha.length * A.maquinaFramesPorLetra);
  const cintaDelay = fichaDelay + A.ficha + typing + 10;
  return (
    <Escenario fondo="papel">
      <PalabraGigante texto={esc.palabraGigante ?? ''} x={SAFE_BOX.cx - 410} y={160} ancho={820} maxSize={560} delay={4} />
      <Ficha lineas={[ficha]} x={SAFE_BOX.cx - 410} y={690} ancho={820} size={54} altoMin={420} rot={1.8} delay={fichaDelay} desde="izquierda" />
      {esc.cinta && <Cinta texto={esc.cinta} x={SAFE_BOX.cx + 40} y={1010} rot={-5} size={62} delay={cintaDelay} />}
      <Subtitulos words={timing.words} offsetFrames={off} claves={esc.claves} />
    </Escenario>
  );
};
