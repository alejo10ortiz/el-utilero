import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import { C, FONT, FPS } from '../../../config/brand';
import { Impacto, Particulas } from '../../components/Fx';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { E, boil, pop, slam, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';
import { SubtitulosL } from './comun';

const XA = 260;
const XB = 1660;
const YR = 600;
const fmt = (n: number) => n.toLocaleString('es-ES').replace(/,/g, '.');

/**
 * REGLA — una discrepancia entre fuentes hecha visible: una regla con escala y DOS marcas (cada fuente la suya) que caen
 * cuando la voz dice cada valor; entre ambas se dibuja la diferencia. `linea` = tercera versión que queda fuera de la regla.
 */
export const ReglaL: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const [min, max] = esc.escala ?? [0, 100];
  const marcas = esc.marcas ?? [];
  const unidad = esc.unidad ?? '';
  const pos = (v: number) => XA + ((v - min) / (max - min)) * (XB - XA);
  const titulo = (esc.texto ?? '').toUpperCase();
  const tam = Math.min(170, fitText({ text: titulo, withinWidth: 1500, fontFamily: 'League Gothic', fontWeight: '400' }).fontSize);
  const sT = slam(f, 4, 1.6);
  const tM: number[] = [];
  marcas.forEach((_, i) => {
    const ancla = esc.claves?.[i];
    const prev = i === 0 ? 0 : tM[i - 1] + 4;
    tM.push(Math.max(i === 0 ? 14 : prev + 10, ancla ? cuando(timing, off, ancla, prev, 30 + i * 40) - 3 : 30 + i * 40));
  });
  const tExtra = esc.linea ? Math.max((tM[tM.length - 1] ?? 30) + 16, cuando(timing, off, 'decenas', tM[tM.length - 1] ?? 0, frames - 40) - 3) : -1;
  const bo = boil(f, 24, 1);
  const z = empuje(f, frames, 0.04, 8) * golpes(f, tM, 0.025);
  const marcasOrd = [...marcas].sort((a, b) => a - b);
  const kReg = tw(f, [8, 22], [0, 1], E.outCubic);
  const paso = (max - min) / 10;

  return (
    <Escenario fondo="papel" impactos={tM.map((t) => ({ frame: t + 4, amp: 10 }))} deriva={0.4} zoom={z}>
      <Particulas tipo="polvo" n={22} semilla={101} colores={[C.tinta, C.grisArchivo]} opacidad={0.22} velocidad={0.3} />
      {sT.visible && (
        <div style={{ position: 'absolute', left: 180, top: 80, width: 1560, textAlign: 'center', fontFamily: FONT.grito, fontSize: tam, lineHeight: 0.95, color: C.tinta, opacity: sT.opacity, textShadow: `9px 7px 0 ${C.lima}`, transform: `translate(${bo.x}px, ${sT.y + bo.y}px) scale(${sT.scale})` }}>
          {titulo}
        </div>
      )}
      <div style={{ position: 'absolute', left: 180, top: 80 + tam * 0.95 + 16, width: 1560, textAlign: 'center', fontFamily: FONT.maquina, fontSize: 36, letterSpacing: '0.14em', color: C.grisArchivo, opacity: tw(f, [12, 22], [0, 1]) }}>
        LAS FUENTES NO COINCIDEN
      </div>
      {/* regla */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', filter: 'url(#ink)' }}>
        <path d={`M${XA} ${YR} H${XA + (XB - XA) * kReg}`} stroke={C.tinta} strokeWidth={10} strokeLinecap="round" />
        {Array.from({ length: 11 }).map((_, i) => {
          const x = XA + (i * (XB - XA)) / 10;
          return (
            <g key={i} opacity={kReg > i / 10 ? 1 : 0}>
              <path d={`M${x} ${YR - 18} V${YR + 18}`} stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
              <text x={x} y={YR + 62} textAnchor="middle" fontFamily={FONT.maquina} fontSize={30} fill={C.grisArchivo}>
                {fmt(Math.round(min + i * paso))}
                {i === 10 ? unidad : ''}
              </text>
            </g>
          );
        })}
        {/* diferencia entre las dos marcas */}
        {marcasOrd.length === 2 && f >= tM[1] + 6 && (
          <path d={`M${pos(marcasOrd[0])} ${YR - 120} V${YR - 150} H${pos(marcasOrd[1])} V${YR - 120}`} fill="none" stroke={C.tinta} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={tw(f, [tM[1] + 6, tM[1] + 14], [0, 1])} />
        )}
        {/* tercera versión fuera de escala */}
        {tExtra > 0 && f >= tExtra && (
          <g opacity={tw(f, [tExtra, tExtra + 10], [0, 1])}>
            <path d={`M${XB - 20} ${YR - 70} H${XB + 130}`} stroke={C.tinta} strokeWidth={8} strokeDasharray="14 12" strokeLinecap="round" />
            <path d={`M${XB + 100} ${YR - 98} L${XB + 140} ${YR - 70} L${XB + 100} ${YR - 42}`} fill="none" stroke={C.tinta} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </svg>
      {/* marcas */}
      {marcas.map((v, i) => {
        const k = pop(f, tM[i], 10);
        if (f < tM[i]) return null;
        const x = pos(v);
        const arriba = i % 2 === 0;
        return (
          <React.Fragment key={i}>
            <svg width={120} height={170} viewBox="0 0 100 140" style={{ position: 'absolute', left: x - 60, top: YR - 140 - (1 - Math.min(1, k)) * 200, transformOrigin: '50% 100%', transform: `scale(${Math.min(1.1, k)})`, overflow: 'visible', filter: 'drop-shadow(5px 6px 0 rgba(22,19,15,0.25))' }}>
              <path d="M50 130 L50 24" stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
              <path d="M50 24 H92 L78 42 L92 60 H50" fill={i === 0 ? C.lima : C.kraft} stroke={C.tinta} strokeWidth={5} strokeLinejoin="round" />
              <circle cx={50} cy={132} r={7} fill={C.tinta} />
            </svg>
            <div style={{ position: 'absolute', left: x - 200, top: YR + (arriba ? 100 : 170), width: 400, textAlign: 'center', transform: `scale(${Math.min(1, k)})`, opacity: Math.min(1, k * 2) }}>
              <span style={{ fontFamily: FONT.grito, fontSize: 120, lineHeight: 1, color: C.tinta, background: i === 0 ? C.lima : C.kraft, padding: '0 16px' }}>
                {fmt(v)}
                {unidad}
              </span>
            </div>
            <Impacto at={tM[i] + 3} x={x} y={YR} flash={0.06} color={C.tinta} semilla={i + 4} />
            <Sfx name="stamp" at={tM[i] + 3} volume={0.55} />
          </React.Fragment>
        );
      })}
      {tExtra > 0 && f >= tExtra && (
        <div style={{ position: 'absolute', left: XB - 330, top: YR - 190, transform: `rotate(-3deg) scale(${pop(f, tExtra, 10)})`, transformOrigin: '100% 100%' }}>
          <span style={{ display: 'inline-block', background: C.cinta, color: C.tinta, fontFamily: FONT.marcador, fontSize: 50, padding: '6px 24px', clipPath: 'polygon(0 10%,3% 0,50% 4%,97% 0,100% 12%,99% 90%,100% 100%,52% 95%,2% 100%,0 88%)' }}>{esc.linea}</span>
        </div>
      )}
      <SubtitulosL esc={esc} timing={timing} off={off} />
    </Escenario>
  );
};
