import React from 'react';
import { Palabras } from '../../components/Palabras';
import { L } from '../../lib/largo';
import type { EscenaProps } from '../Escenario';

/** Subtítulos del video largo: banda inferior, más chicos que en el Short. */
export const SubtitulosL: React.FC<Pick<EscenaProps, 'esc' | 'timing'> & { off: number; tono?: 'papel' | 'pizarra' | 'lima' }> = ({ esc, timing, off, tono = 'papel' }) => (
  <Palabras words={timing.words} offsetFrames={off} tono={tono} claves={esc.claves} y={L.subY} size={L.subSize} x0={L.subX0} ancho={L.subW} />
);
