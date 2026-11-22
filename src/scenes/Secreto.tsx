import React from 'react';
import { A, FPS, SAFE_BOX } from '../../config/brand';
import type { Impacto } from '../components/CamaraMesa';
import { Cinta } from '../components/Cinta';
import { NivelSecreto } from '../components/NivelSecreto';
import { PalabraGigante } from '../components/PalabraGigante';
import { Sello } from '../components/Sello';
import { Subtitulos } from '../components/Subtitulos';
import { Escenario, EscenaProps } from './Escenario';

/** SECRETO (presentación): explica el nivel de secreto de 1 a 5 llaves (A11) con la cinta de marcador y un sello. */
export const Secreto: React.FC<EscenaProps> = ({ esc, timing }) => {
  const off = Math.round(timing.start * FPS);
  const nivel = esc.nivel ?? 5;
  const llavesDelay = 24;
  const selloDelay = llavesDelay + nivel * A.llaveFrames + 16;
  const impactos: Impacto[] = esc.sello ? [{ frame: selloDelay + 3, amp: 3 }] : [];
  return (
    <Escenario fondo="papel" impactos={impactos}>
      <PalabraGigante texto={esc.palabraGigante ?? 'SECRETO'} x={SAFE_BOX.cx - 410} y={170} ancho={820} maxSize={340} delay={4} />
      <NivelSecreto nivel={nivel} x={SAFE_BOX.cx} y={520} size={230} delay={llavesDelay} />
      {esc.sello && <Sello texto={esc.sello} x={SAFE_BOX.cx + 10} y={930} size={104} rot={-6} delay={selloDelay} />}
      {esc.cinta && <Cinta texto={esc.cinta} x={SAFE_BOX.cx - 30} y={1090} rot={-3} size={66} delay={selloDelay + 14} />}
      <Subtitulos words={timing.words} offsetFrames={off} claves={esc.claves} />
    </Escenario>
  );
};
