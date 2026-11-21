import React from 'react';
import { C, SAFE_BOX } from '../../config/brand';
import { PalabraGigante, medirTitular } from '../components/PalabraGigante';
import { TizaTrazo, linePoints } from '../components/Trazo';
import { Escenario, EscenaProps } from './Escenario';

/** GANCHO (0–3 s): palabra gigante en tiza sobre pizarra; el dato más loco en una frase. Sin subtítulos: el titular ES el subtítulo. */
export const Gancho: React.FC<EscenaProps> = ({ esc }) => {
  const texto = esc.texto ?? '';
  const ancho = 840;
  const x = SAFE_BOX.cx - ancho / 2;
  const { items, alto } = medirTitular(texto, ancho, 430, 9);
  const top = 190 + Math.max(0, (1190 - alto) / 2);
  const delay = 4;
  const escalon = 7;
  const fin = delay + (items.length - 1) * escalon + 9;
  const subY = top + alto + 6;
  return (
    <Escenario fondo="pizarra">
      <PalabraGigante
        texto={texto}
        x={x}
        y={top}
        ancho={ancho}
        maxSize={430}
        tono="tiza"
        resaltar={esc.resaltar}
        delay={delay}
        escalon={escalon}
        rot={-1.2}
      />
      <TizaTrazo points={linePoints(x + 110, subY + 4, x + ancho - 70, subY - 6, { seed: 4, wobble: 8 })} delay={fin + 2} width={10} />
      <TizaTrazo points={linePoints(x + 240, subY + 36, x + ancho - 210, subY + 30, { seed: 8, wobble: 6 })} delay={fin + 10} width={8} color={C.lima} />
    </Escenario>
  );
};
