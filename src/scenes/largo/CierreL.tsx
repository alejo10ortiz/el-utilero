import React from 'react';
import { useCurrentFrame } from 'remotion';
import { measureText } from '@remotion/layout-utils';
import { C, FPS } from '../../../config/brand';
import { CintaImpacto, TituloImpacto } from '../../components/Cinetica';
import { Destello, Impacto, Particulas, Rayos } from '../../components/Fx';
import { Portazo } from '../../components/Portazo';
import { Sfx } from '../../components/Sfx';
import { UtileroActor } from '../../components/UtileroActor';
import { empuje, golpes } from '../../lib/camara';
import { handleDe, numeroCamerino } from '../../lib/episode';
import { BEAT, useAbs } from '../../lib/ritmo';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';
import { SubtitulosL } from './comun';

/**
 * CIERRE del video largo — lima con rayos; el Utilero (serio, E7) a la izquierda, la pregunta para comentarios a la derecha,
 * la cinta con el @usuario que se clava al decir «camerino» y el portazo en el último beat.
 */
export const CierreL: React.FC<EscenaProps> = ({ esc, ep, timing, frames }) => {
  const f = useCurrentFrame();
  const abs = useAbs();
  const off = Math.round(timing.start * FPS);
  const tPregunta = 12;
  const tPais = Math.max(tPregunta + 40, cuando(timing, off, 'comentarios', 0, 120) - 4);
  const tHandle = Math.max(tPais + 20, cuando(timing, off, 'camerino', tPais, frames - 90) - 3);
  const tPortazo = frames - 25;
  const handle = handleDe(ep);
  const ancho = measureText({ text: handle, fontFamily: 'Permanent Marker', fontSize: 84 }).width + 84 * 1.1;
  const tam = Math.min(84, (84 * 780) / ancho);
  const pulso = 1 + 0.016 * Math.exp(-(abs % BEAT) / 4.5);
  const z = empuje(f, frames, 0.04, 6) * golpes(f, [tHandle], 0.04);

  return (
    <Escenario fondo="lima" impactos={[{ frame: tHandle + 2, amp: 12 }, { frame: tPortazo + 7, amp: 14 }]} deriva={0.5} zoom={z}>
      <Rayos c2="rgba(22,19,15,0.10)" cx={560} cy={560} vel={-0.2} />
      <Particulas tipo="polvo" n={18} semilla={83} colores={[C.tinta, C.papel]} opacidad={0.3} velocidad={0.3} />
      <div style={{ transform: `scale(${pulso})`, transformOrigin: '20% 85%', position: 'absolute', inset: 0 }}>
        <UtileroActor entrada={8} desde="izquierda" expresion={esc.expresion ?? 'E7'} pose={esc.pose} sobre="lima" words={timing.words} offsetFrames={off} size={660} x={110} y={235} seed={9} />
      </div>
      <TituloImpacto lineas={[{ texto: '¿CONOCEN OTRA', at: tPregunta, max: 150 }, { texto: 'HISTORIA ASÍ?', at: tPregunta + 8, resaltar: 'ASÍ?', max: 150 }]} x={1000} y={130} ancho={790} tono="tinta" maxSize={150} />
      <CintaImpacto texto="CUÉNTENMELA CON SU PAÍS" x={1400} y={470} at={tPais} rot={-2} size={50} color={C.papel} />
      <CintaImpacto texto={handle} x={1400} y={680} at={tHandle} rot={-3} size={tam} />
      <Impacto at={tHandle} x={1400} y={680} color="#fff" flash={0.25} />
      <Destello at={tHandle} color="#fff" max={0.35} dur={5} />
      <Portazo delay={tPortazo} numero={numeroCamerino(ep)} ancho={1920} alto={1080} />
      <Sfx name="whoosh" at={7} volume={0.45} />
      <Sfx name="pop" at={9} volume={0.45} />
      <Sfx name="impact" at={tHandle} volume={0.8} />
      <Sfx name="slap" at={tHandle} volume={0.7} />
      <SubtitulosL esc={esc} timing={timing} off={off} tono="lima" />
    </Escenario>
  );
};
