import React from 'react';
import { useCurrentFrame } from 'remotion';
import { A, C, FPS, SAFE_BOX } from '../../../config/brand';
import { CintaImpacto, TituloImpacto } from '../../components/Cinetica';
import { CintaPrecaucion, Impacto, Particulas } from '../../components/Fx';
import { NivelSecreto } from '../../components/NivelSecreto';
import { Palabras } from '../../components/Palabras';
import { Sello } from '../../components/Sello';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';

/**
 * SECRETO PRO — «SECRETO» se clava al decirlo, las llaves caen una a una (A11) y suenan, el sello CONFIDENCIAL
 * golpea y la cinta de marcador «de una a cinco llaves» se pega; cintas de precaución recorren arriba y abajo.
 */
export const SecretoPro: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const nivel = esc.nivel ?? 5;
  const tSec = 11; // entra de inmediato; la palabra dicha lo refuerza (tEnf)
  const tEnf = Math.max(tSec + 8, cuando(timing, off, 'secreto', 0, tSec + 30) - 1);
  const tLlaves = Math.max(tSec + 10, cuando(timing, off, 'nivel', tSec, tSec + 24) - 2); // las llaves caen al decir «nivel»
  const tSello = tLlaves + nivel * A.llaveFrames + 10;
  const tCinta = tSello + 14;
  const z = empuje(f, frames, 0.06, 8) * golpes(f, [tSec, tEnf, tSello, tCinta], 0.045);
  return (
    <Escenario fondo="papel" impactos={[{ frame: tSec + 2, amp: 12 }, { frame: tEnf + 1, amp: 8 }, { frame: tSello + 2, amp: 10 }, { frame: tCinta + 2, amp: 8 }]} deriva={0.5} zoom={z}>
      <Particulas tipo="polvo" n={22} semilla={14} colores={[C.tinta, C.grisArchivo]} opacidad={0.22} velocidad={0.3} />
      <CintaPrecaucion y={96} dir={1} rot={-1.5} />
      <CintaPrecaucion y={1530} dir={-1} rot={1.2} />
      <TituloImpacto lineas={[{ texto: esc.palabraGigante ?? 'SECRETO', at: tSec }]} x={SAFE_BOX.cx - 440} y={190} ancho={880} tono="tinta" maxSize={340} />
      <NivelSecreto nivel={nivel} x={SAFE_BOX.cx} y={560} size={230} delay={tLlaves} />
      {esc.sello && <Sello texto={esc.sello} x={SAFE_BOX.cx + 10} y={950} size={110} rot={-6} delay={tSello} />}
      {esc.cinta && <CintaImpacto texto={esc.cinta} x={SAFE_BOX.cx - 30} y={1100} at={tCinta} rot={-3} size={66} />}
      <Impacto at={tSec} x={540} y={340} flash={0} />
      <Impacto at={tEnf} x={540} y={340} flash={0.14} semilla={2} />
      {esc.sello && <Impacto at={tSello} x={540} y={960} flash={0.14} color={C.sello} semilla={5} />}
      <Impacto at={tCinta} x={510} y={1100} flash={0} color={C.tinta} semilla={7} />
      <Palabras words={timing.words} offsetFrames={off} claves={esc.claves} y={1385} size={84} />
      <Sfx name="impact" at={tSec} volume={0.8} />
      <Sfx name="whoosh" at={tSec - 4} volume={0.4} />
      <Sfx name="hit" at={tCinta} volume={0.5} />
      <Sfx name="hit" at={tEnf} volume={0.55} />
    </Escenario>
  );
};
