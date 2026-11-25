import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import { C, FONT, FPS } from '../../../config/brand';
import { TituloImpacto } from '../../components/Cinetica';
import { Impacto, Particulas } from '../../components/Fx';
import { Sfx } from '../../components/Sfx';
import { UtileroActor } from '../../components/UtileroActor';
import { empuje, golpes } from '../../lib/camara';
import { E, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';
import { SubtitulosL } from './comun';

/**
 * TITULAR — frases gigantes que se clavan una a una en el instante en que se dicen (`claves[i]` = palabra de la voz que
 * lanza la línea i). Una línea mecanografiada (`linea`) cierra la idea. Con `expresion`/`pose` el Utilero acompaña a la derecha.
 */
export const TitularL: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const lineas = (esc.titular ?? '').split('|').map((s) => s.trim()).filter(Boolean);
  const conUtilero = !!esc.expresion;
  const oscuro = esc.fondo === 'pizarra';
  const conElementos = !!(esc.elementos?.length || esc.flechas?.length);
  const ancho = conUtilero ? 1100 : conElementos ? 1060 : 1600;
  const x = conUtilero ? 130 : conElementos ? 90 : 160;

  // instante de cada línea: la voz manda; si no se nombra, se reparte
  const at: number[] = [];
  lineas.forEach((_, i) => {
    const prev = i === 0 ? 0 : at[i - 1] + 10;
    const ancla = esc.claves?.[i];
    const def = 4 + i * Math.max(28, Math.floor((frames - 40) / Math.max(1, lineas.length)));
    const t = ancla ? cuando(timing, off, ancla, prev > 0 ? prev : 0, def) - 2 : def;
    // nunca pantalla vacía tras un corte: la primera línea entra en los primeros fotogramas (la palabra dicha solo la refuerza)
    at.push(i === 0 ? Math.min(Math.max(3, t), 8) : Math.max(prev, t));
  });

  // alto del bloque para centrarlo verticalmente
  const medidas = lineas.map((l) => Math.min(250, fitText({ text: l, withinWidth: ancho, fontFamily: 'League Gothic', fontWeight: '400' }).fontSize));
  const total = medidas.reduce((a, m) => a + m * 0.84, 0);
  const tieneLinea = !!esc.linea;
  const zona = tieneLinea ? 700 : 780;
  const y = Math.max(70, 60 + (zona - total) / 2);
  const tLinea = (at[at.length - 1] ?? 12) + 16;
  const kLinea = tw(f, [tLinea, tLinea + 8], [0, 1], E.outBack);
  const z = empuje(f, frames, 0.04, 8) * golpes(f, at, 0.025);

  return (
    <Escenario fondo={oscuro ? 'pizarra' : 'papel'} impactos={at.map((t) => ({ frame: t + 3, amp: 9 }))} deriva={0.4} zoom={z}>
      <Particulas tipo="polvo" n={26} semilla={61} colores={oscuro ? [C.tiza, C.lima] : [C.tinta, C.grisArchivo]} opacidad={oscuro ? 0.4 : 0.24} velocidad={0.3} />
      <TituloImpacto lineas={lineas.map((texto, i) => ({ texto, at: at[i], resaltar: esc.resaltar, max: 250 }))} x={x} y={y} ancho={ancho} tono={oscuro ? 'tiza' : 'tinta'} maxSize={250} />
      {tieneLinea && f >= tLinea && (
        <div
          style={{
            position: 'absolute', left: x + (ancho - 1180) / 2, top: y + total + 36, width: 1180, textAlign: 'center', opacity: kLinea,
            transform: `scale(${0.85 + 0.15 * kLinea}) rotate(-1deg)`,
          }}
        >
          <span style={{ display: 'inline-block', background: C.cinta, color: C.tinta, fontFamily: FONT.maquina, fontSize: 46, padding: '8px 26px', clipPath: 'polygon(0 8%,2% 0,50% 4%,98% 0,100% 10%,99% 92%,100% 100%,50% 95%,2% 100%,0 92%)' }}>
            {esc.linea}
          </span>
        </div>
      )}
      {conUtilero && (
        <UtileroActor entrada={12} desde="derecha" expresion={esc.expresion} pose={esc.pose} sobre="papel" words={timing.words} offsetFrames={off} size={620} x={1250} y={260} seed={5} />
      )}
      {at.map((t, i) => (
        <React.Fragment key={i}>
          <Impacto at={t} x={x + ancho / 2} y={y + medidas.slice(0, i).reduce((a, m) => a + m * 0.84, 0) + medidas[i] * 0.42} flash={0.06} color={oscuro ? C.lima : C.tinta} semilla={i + 2} />
          <Sfx name="slam" at={t + 1} volume={0.55} />
        </React.Fragment>
      ))}
      {tieneLinea && <Sfx name="tape" at={tLinea} volume={0.45} />}
      <SubtitulosL esc={esc} timing={timing} off={off} tono={oscuro ? 'pizarra' : 'papel'} />
    </Escenario>
  );
};
