import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, FPS } from '../../../config/brand';
import { Impacto, Particulas } from '../../components/Fx';
import { Picto } from '../../components/Pictos';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { E, boil, pop, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';
import { SubtitulosL } from './comun';

const trazo = (k: number) => ({ pathLength: 1, strokeDasharray: `${k} 2`, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

/**
 * JUGADA — pizarra táctica vista desde arriba que REPRODUCE lo que dice la voz: el balón llega, el portero (lima) se lanza,
 * el delantero (papel) corre al mismo punto y el choque estalla; después el portero queda tendido. Todo en tiza.
 */
export const JugadaL: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const tBalon = Math.max(8, cuando(timing, off, 'balón', 0, 14) - 2);
  const tPort = Math.max(tBalon + 6, cuando(timing, off, 'lanza', tBalon, 40) - 4);
  const tDel = Math.max(tPort + 4, cuando(timing, off, 'Murphy', tPort, 70) - 6);
  const tGolpe = Math.max(tDel + 10, cuando(timing, off, 'rodilla', tDel, 100) - 2);
  const tCaido = Math.max(tGolpe + 8, cuando(timing, off, 'inconsciente', tGolpe, 140) - 2);
  const bo = boil(f, 14, 1.1);
  const z = empuje(f, frames, 0.04, 8) * golpes(f, [tGolpe], 0.04);
  const kBalon = tw(f, [tBalon, tBalon + 16], [0, 1], E.outCubic);
  const kPort = tw(f, [tPort, tPort + 12], [0, 1], E.outBack);
  const kDel = tw(f, [tDel, tDel + 18], [0, 1], E.inOutCubic);
  const kGolpe = pop(f, tGolpe, 9);
  const kCaido = tw(f, [tCaido, tCaido + 10], [0, 1], E.outBack);
  // posiciones (cuadro 1920×1080): el área grande está a la izquierda; a la derecha, la lupa del golpe
  const P = { ball0: [980, 760], ball1: [700, 330], gk0: [690, 250], gk1: [676, 410], fw0: [400, 760], fw1: [666, 440], golpe: [672, 424] } as const;
  const lerp = (a: readonly number[], b: readonly number[], k: number) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const gk = lerp(P.gk0, P.gk1, kPort);
  const fw = lerp(P.fw0, P.fw1, kDel);
  const bl = lerp(P.ball0, P.ball1, kBalon);

  return (
    <Escenario fondo="pizarra" impactos={[{ frame: tGolpe + 2, amp: 14 }]} deriva={0.4} zoom={z}>
      <Particulas tipo="polvo" n={26} semilla={91} colores={[C.tiza, C.lima]} opacidad={0.4} velocidad={0.3} />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <g transform={`translate(${bo.x} ${bo.y})`}>
          <g filter="url(#chalk)" stroke={C.tiza} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* área grande, área chica y portería */}
            <path d="M230 120 H1130 V820 H230 Z" opacity={0.9} />
            <path d="M440 120 V310 H920 V120" opacity={0.9} />
            <path d="M560 120 V70 H800 V120" strokeWidth={10} />
            <path d="M530 820 A150 150 0 0 1 830 820" opacity={0.7} />
            <circle cx={680} cy={560} r={7} fill={C.tiza} />
          </g>
          {/* trayectorias */}
          <path d={`M${P.ball0[0]} ${P.ball0[1]} L${P.ball1[0]} ${P.ball1[1]}`} {...trazo(kBalon)} stroke={C.tiza} strokeWidth={6} strokeDasharray={`${kBalon * 0.5} 0.05`} />
          <path d={`M${P.gk0[0]} ${P.gk0[1]} Q${P.gk0[0] + 70} ${(P.gk0[1] + P.gk1[1]) / 2} ${P.gk1[0]} ${P.gk1[1]}`} {...trazo(kPort)} stroke={C.lima} strokeWidth={8} />
          <path d={`M${P.fw0[0]} ${P.fw0[1]} Q${P.fw0[0] + 120} ${P.fw0[1] - 220} ${P.fw1[0]} ${P.fw1[1]}`} {...trazo(kDel)} stroke={C.tiza} strokeWidth={8} />
          {/* balón */}
          {kBalon > 0 && (
            <g transform={`translate(${bl[0]} ${bl[1]}) rotate(${kBalon * 540})`}>
              <circle r={22} fill={C.papel} stroke={C.tinta} strokeWidth={5} />
              <polygon points="0,-10 9.5,-3 6,8 -6,8 -9.5,-3" fill={C.tinta} />
            </g>
          )}
          {/* portero (lima) y delantero (papel) */}
          {kPort > 0 && (
            <g transform={`translate(${gk[0]} ${gk[1]}) rotate(${kCaido > 0 ? 70 * kCaido : 0})`}>
              <circle r={36} fill={C.lima} stroke={C.tinta} strokeWidth={6} />
              <text y={14} textAnchor="middle" fontFamily={FONT.grito} fontSize={44} fill={C.tinta}>T</text>
            </g>
          )}
          {kDel > 0 && (
            <g transform={`translate(${fw[0]} ${fw[1]})`}>
              <circle r={36} fill={C.papel} stroke={C.tinta} strokeWidth={6} />
              <text y={14} textAnchor="middle" fontFamily={FONT.grito} fontSize={44} fill={C.tinta}>M</text>
            </g>
          )}
        </g>
      </svg>
      {/* etiquetas */}
      {kPort > 0 && <Etiqueta x={P.gk0[0] + 70} y={P.gk0[1] - 64} texto="TRAUTMANN · CITY" k={kPort} color={C.lima} />}
      {kDel > 0 && <Etiqueta x={P.fw0[0] + 10} y={P.fw0[1] + 58} texto="MURPHY · BIRMINGHAM" k={kDel} color={C.cinta} />}
      {/* choque */}
      {kGolpe > 0 && (
        <div style={{ position: 'absolute', left: P.golpe[0] - 120, top: P.golpe[1] - 120, width: 240, height: 240, transform: `scale(${kGolpe})`, filter: 'drop-shadow(6px 8px 0 rgba(0,0,0,0.4))' }}>
          <Picto nombre="estallido" size={240} acento={C.lima} />
        </div>
      )}
      {/* lupa del golpe: rodilla → cuello */}
      {kGolpe > 0 && (
        <div style={{ position: 'absolute', left: 1240, top: 170, width: 560, opacity: Math.min(1, kGolpe * 2), transform: `translateX(${(1 - Math.min(1, kGolpe)) * 120}px)` }}>
          <div style={{ background: C.tinta, border: `5px solid ${C.tiza}`, padding: '26px 28px 24px', boxShadow: '14px 16px 0 rgba(0,0,0,0.35)' }}>
            <div style={{ fontFamily: FONT.maquina, fontSize: 34, letterSpacing: '0.12em', color: C.lima, marginBottom: 8 }}>EL GOLPE</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center' }}>
                <Picto nombre="persona" size={150} acento={C.ficha} />
                <div style={{ fontFamily: FONT.grito, fontSize: 56, color: C.tiza, marginTop: 4 }}>RODILLA</div>
              </div>
              <div style={{ transform: 'scale(0.9)' }}><Picto nombre="flecha" size={120} color={C.lima} /></div>
              <div style={{ textAlign: 'center' }}>
                <Picto nombre="cabeza" size={150} acento={C.lima} />
                <div style={{ fontFamily: FONT.grito, fontSize: 56, color: C.tiza, marginTop: 4 }}>CUELLO</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {kCaido > 0 && (
        <div style={{ position: 'absolute', left: 1240, top: 690, opacity: kCaido, transform: `scale(${0.8 + 0.2 * kCaido}) rotate(-3deg)` }}>
          <span style={{ display: 'inline-block', background: C.cinta, color: C.tinta, fontFamily: FONT.maquina, fontSize: 40, padding: '6px 22px', clipPath: 'polygon(0 8%,2% 0,50% 4%,98% 0,100% 10%,99% 92%,100% 100%,50% 95%,2% 100%,0 92%)' }}>
            QUEDA INCONSCIENTE
          </span>
        </div>
      )}
      <Impacto at={tGolpe} x={P.golpe[0]} y={P.golpe[1]} flash={0.2} color={C.lima} semilla={6} />
      <Sfx name="whoosh" at={tBalon} volume={0.4} />
      <Sfx name="swish" at={tPort} volume={0.4} />
      <Sfx name="swish" at={tDel} volume={0.35} />
      <Sfx name="impact" at={tGolpe} volume={0.85} />
      <Sfx name="thump" at={tCaido} volume={0.5} />
      <SubtitulosL esc={esc} timing={timing} off={off} tono="pizarra" />
    </Escenario>
  );
};

const Etiqueta: React.FC<{ x: number; y: number; texto: string; k: number; color: string }> = ({ x, y, texto, k, color }) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, transform: `translate(-50%, 0) scale(${Math.min(1, k)})`, opacity: Math.min(1, k * 2), whiteSpace: 'nowrap',
      fontFamily: FONT.maquina, fontSize: 34, color: C.tinta, background: color, padding: '4px 18px',
      clipPath: 'polygon(0 10%,2% 0,50% 4%,98% 0,100% 12%,99% 90%,100% 100%,52% 95%,2% 100%,0 88%)',
    }}
  >
    {texto}
  </div>
);
