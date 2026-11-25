import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import { C, FONT, FPS } from '../../../config/brand';
import { Destello, Impacto, Particulas } from '../../components/Fx';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { E, boil, pop, slam, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';
import { SubtitulosL } from './comun';

/**
 * MARCADOR — un tablero de estadio a dos tintas: los nombres de los equipos y los goles (cifras que giran como tarjetas
 * cuando la voz las dice). `lados[i].titulo` = equipo, `lados[i].lineas[0]` = goles; `palabras[0]` = palabra que gira la cifra.
 */
export const MarcadorL: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const lados = (esc.lados ?? []).slice(0, 2);
  const tTab = 5;
  const tG = lados.map((l, i) => Math.max(tTab + 16 + i * 10, cuando(timing, off, l.palabras?.[0] ?? '', 0, tTab + 30 + i * 30) - 3));
  const sT = slam(f, tTab, 1.4);
  const bo = boil(f, 26, 1);
  const z = empuje(f, frames, 0.04, 8) * golpes(f, tG, 0.03);
  const kicker = esc.kicker ?? '';

  return (
    <Escenario fondo="pizarra" impactos={tG.map((t) => ({ frame: t + 3, amp: 12 }))} deriva={0.4} zoom={z}>
      <Particulas tipo="polvo" n={26} semilla={103} colores={[C.tiza, C.lima]} opacidad={0.4} velocidad={0.3} />
      <div style={{ position: 'absolute', left: 0, top: 90, width: 1920, textAlign: 'center', fontFamily: FONT.maquina, fontSize: 46, letterSpacing: '0.2em', color: C.lima, opacity: tw(f, [2, 12], [0, 1]) }}>{kicker}</div>
      {sT.visible && (
        <div
          style={{
            position: 'absolute', left: 170, top: 190, width: 1580, height: 560, background: C.tinta, border: `8px solid ${C.tiza}`, opacity: sT.opacity, boxShadow: '18px 20px 0 rgba(0,0,0,0.4)',
            transform: `translate(${bo.x}px, ${sT.y + bo.y}px) scale(${sT.scale})`, clipPath: 'polygon(0 0, 96% 0, 100% 8%, 100% 100%, 4% 100%, 0 92%)',
          }}
        >
          {/* bombillas */}
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} style={{ position: 'absolute', left: 36 + i * 64, top: 14, width: 14, height: 14, borderRadius: 14, background: (Math.floor(f / 6) + i) % 3 === 0 ? C.lima : C.tiza, opacity: 0.8 }} />
          ))}
          {lados.map((l, i) => {
            const nombre = l.titulo.toUpperCase();
            const tam = Math.min(120, fitText({ text: nombre, withinWidth: 520, fontFamily: 'League Gothic', fontWeight: '400' }).fontSize);
            const gol = l.lineas[0] ?? '0';
            const t0 = tG[i];
            const gira = tw(f, [t0, t0 + 10], [90, 0], E.outBack);
            const antes = f < t0;
            return (
              <React.Fragment key={i}>
                <div style={{ position: 'absolute', left: i === 0 ? 40 : 800, top: 70, width: 740, textAlign: 'center', fontFamily: FONT.grito, fontSize: tam, color: C.tiza, filter: 'url(#chalk)', lineHeight: 1 }}>{nombre}</div>
                <div
                  style={{
                    position: 'absolute', left: i === 0 ? 160 : 920, top: 200, width: 500, height: 330, background: C.lima, border: `6px solid ${C.tiza}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: FONT.grito, fontSize: 330, lineHeight: 1, color: C.tinta, transform: `perspective(900px) rotateX(${antes ? 90 : gira}deg)`, transformOrigin: '50% 0%', opacity: antes ? 0 : 1,
                  }}
                >
                  {gol}
                </div>
              </React.Fragment>
            );
          })}
          <div style={{ position: 'absolute', left: 740, top: 270, width: 100, height: 28, background: C.tiza }} />
        </div>
      )}
      {esc.linea && (
        <div style={{ position: 'absolute', left: 0, top: 790, width: 1920, textAlign: 'center', opacity: tw(f, [tG[1] + 10, tG[1] + 20], [0, 1]) }}>
          <span style={{ display: 'inline-block', background: C.cinta, color: C.tinta, fontFamily: FONT.maquina, fontSize: 44, padding: '6px 28px', transform: 'rotate(-1deg)', clipPath: 'polygon(0 8%,2% 0,50% 4%,98% 0,100% 10%,99% 92%,100% 100%,50% 95%,2% 100%,0 92%)' }}>{esc.linea}</span>
        </div>
      )}
      {tG.map((t, i) => (
        <React.Fragment key={i}>
          <Impacto at={t + 3} x={i === 0 ? 660 : 1420} y={560} flash={0.1} color={C.lima} semilla={i + 7} />
          <Sfx name="slam" at={t + 3} volume={0.7} />
        </React.Fragment>
      ))}
      <Destello at={tG[tG.length - 1] + 3} color={C.lima} max={0.22} dur={5} />
      <Sfx name="hinchada" at={tTab + 4} volume={0.3} />
      <SubtitulosL esc={esc} timing={timing} off={off} tono="pizarra" />
    </Escenario>
  );
};
