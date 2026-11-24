import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import { C, FONT, FPS } from '../../../config/brand';
import { Destello, Impacto, Particulas } from '../../components/Fx';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { E, boil, slam, tw } from '../../lib/ease';
import { BEAT, useAbs } from '../../lib/ritmo';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';
import { SubtitulosL } from './comun';

const CX = 520;
const CY = 470;
const R = 310;
const ang = (min: number) => ((min / 90) * 360 - 90) * (Math.PI / 180);
const pt = (min: number, r = R) => [CX + Math.cos(ang(min)) * r, CY + Math.sin(ang(min)) * r] as const;

/**
 * CRONÓMETRO — un reloj de partido (90′) con la cifra en el centro. Los 90 minutos se dibujan como marcas y el tramo que
 * importa (los últimos minutos) se ilumina en lima. Si `cifra ≠ desde`, la cuenta sube sincronizada con la voz
 * (`inicio` = palabra donde arranca, `clave` = palabra donde termina). El prefijo «≈» deja claro que es una cifra aproximada.
 */
export const CronoL: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const abs = useAbs();
  const off = Math.round(timing.start * FPS);
  const desde = esc.desde ?? 0;
  const hasta = esc.cifra ?? 0;
  const cuenta = hasta !== desde;
  const tIni = cuenta && esc.inicio ? Math.max(14, cuando(timing, off, esc.inicio, 0, 24)) : 14;
  const tFin = cuenta && esc.clave ? cuando(timing, off, esc.clave, tIni, frames - 50) + 10 : frames - 40;
  const p = cuenta ? tw(f, [tIni, tFin], [0, 1], E.inOutCubic) : 1;
  const valor = desde + (hasta - desde) * p;
  const largo = cuenta ? valor : hasta; // minutos iluminados
  const m0 = 90 - hasta; // el tramo iluminado termina siempre en el pitazo final
  const m1 = m0 + largo;
  const [x0, y0] = pt(m0);
  const [x1, y1] = pt(m1);
  const arco = `M${x0} ${y0} A${R} ${R} 0 ${largo / 90 > 0.5 ? 1 : 0} 1 ${x1} ${y1}`;
  const pulso = 1 + 0.025 * Math.exp(-(abs % BEAT) / 4.5);
  const sR = slam(f, 6, 1.6);
  const sT = slam(f, 12, 1.7);
  const bo = boil(f, 9, 1.3);
  const texto = (esc.texto ?? '').toUpperCase();
  const tam = Math.min(250, fitText({ text: texto, withinWidth: 820, fontFamily: 'League Gothic', fontWeight: '400' }).fontSize);
  const z = empuje(f, frames, 0.04, 8) * golpes(f, [tIni, tFin].filter((t) => t > 0), 0.03);
  const kLinea = tw(f, [26, 36], [0, 1], E.outCubic);

  return (
    <Escenario fondo="pizarra" impactos={[{ frame: 8, amp: 10 }, ...(cuenta ? [{ frame: tFin + 2, amp: 12 }] : [])]} deriva={0.4} zoom={z}>
      <Particulas tipo="polvo" n={30} semilla={73} colores={[C.tiza, C.lima]} opacidad={0.4} velocidad={0.35} />
      {sR.visible && (
        <svg width={1040} height={940} viewBox="0 0 1040 940" style={{ position: 'absolute', left: 0, top: 0, opacity: sR.opacity, transform: `scale(${sR.scale})`, transformOrigin: `${CX}px ${CY}px` }}>
          <g filter="url(#chalk)">
            <circle cx={CX} cy={CY} r={R + 34} fill="none" stroke={C.tiza} strokeWidth={5} opacity={0.55} />
            {Array.from({ length: 90 }).map((_, m) => {
              const [a, b] = pt(m, R + 10);
              const [c, d] = pt(m, R - (m % 15 === 0 ? 42 : m % 5 === 0 ? 26 : 12));
              return <line key={m} x1={a} y1={b} x2={c} y2={d} stroke={C.tiza} strokeWidth={m % 15 === 0 ? 7 : 3.4} opacity={m % 15 === 0 ? 0.9 : 0.5} strokeLinecap="round" />;
            })}
          </g>
          {largo > 0.2 && <path d={arco} fill="none" stroke={C.lima} strokeWidth={26} strokeLinecap="butt" opacity={0.95} />}
          {largo > 0.2 && <circle cx={x1} cy={y1} r={20 * pulso} fill={C.lima} stroke={C.tinta} strokeWidth={6} />}
        </svg>
      )}
      {/* cifra central */}
      <div
        style={{
          position: 'absolute', left: CX - 280, top: CY - 165, width: 560, textAlign: 'center', fontFamily: FONT.grito, fontSize: 320, lineHeight: 1, color: C.tiza,
          textShadow: `12px 10px 0 ${C.lima}`, opacity: sR.opacity, transform: `translate(${bo.x}px, ${bo.y}px) scale(${pulso})`, filter: 'url(#chalk)',
        }}
      >
        {esc.prefijo ?? ''}
        {Math.round(valor)}
        {esc.unidad ?? ''}
      </div>
      {/* texto de la derecha */}
      <div style={{ position: 'absolute', left: 990, top: 170, fontFamily: FONT.maquina, fontSize: 50, letterSpacing: '0.18em', color: C.lima, opacity: tw(f, [8, 18], [0, 1], E.outCubic) }}>{esc.kicker}</div>
      {sT.visible && (
        <div
          style={{
            position: 'absolute', left: 980, top: 250, width: 840, fontFamily: FONT.grito, fontSize: tam, lineHeight: 0.92, color: C.tiza, opacity: sT.opacity, filter: 'url(#chalk)',
            textShadow: `9px 8px 0 ${C.lima}`, transform: `translate(${bo.x}px, ${sT.y + bo.y}px) scale(${sT.scale})`, transformOrigin: '0% 60%',
          }}
        >
          {texto}
        </div>
      )}
      {esc.linea && (
        <div style={{ position: 'absolute', left: 990, top: 250 + tam * 0.95 + 36, opacity: kLinea, transform: `translateY(${(1 - kLinea) * 20}px)` }}>
          <span style={{ display: 'inline-block', background: C.cinta, color: C.tinta, fontFamily: FONT.maquina, fontSize: 40, padding: '6px 22px', clipPath: 'polygon(0 8%,2% 0,50% 4%,98% 0,100% 10%,99% 92%,100% 100%,50% 95%,2% 100%,0 92%)' }}>{esc.linea}</span>
        </div>
      )}
      <Impacto at={8} x={CX} y={CY} flash={0.08} color={C.lima} semilla={4} />
      {cuenta && <Impacto at={tFin} x={x1} y={y1} flash={0.2} color={C.lima} semilla={9} />}
      {cuenta && <Destello at={tFin} color={C.lima} max={0.3} dur={5} />}
      <Sfx name="thump" at={8} volume={0.7} />
      {cuenta && <Sfx name="riser" at={tIni} volume={0.35} />}
      {cuenta && <Sfx name="impact" at={tFin} volume={0.8} />}
      <SubtitulosL esc={esc} timing={timing} off={off} tono="pizarra" />
    </Escenario>
  );
};
