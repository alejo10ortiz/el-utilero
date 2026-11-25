import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, FPS } from '../../../config/brand';
import { CintaImpacto } from '../../components/Cinetica';
import { Destello, Impacto, Particulas } from '../../components/Fx';
import { Sello } from '../../components/Sello';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { E, boil, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';
import { SubtitulosL } from './comun';

const X0 = 560; // eje de la columna
const VERT = 7;
const vert = (i: number) => {
  const y = 250 + i * 78; // cada vértebra 66 de alto + 12 de hueco
  const curva = Math.sin((i / (VERT - 1)) * Math.PI) * -26; // la columna cervical se curva suavemente
  return { y, cx: X0 + curva, w: 150 + i * 12 };
};

/**
 * RADIOGRAFÍA — una placa a dos tintas: un barrido de luz revela la columna cervical (7 vértebras); cuando la voz dice
 * «desplazadas» varias se corren de su sitio y cuando dice «rota» una se parte. NO se señala cuál ni cuántas (las fuentes
 * discrepan: «varias desplazadas, una rota»). El sello FRACTURA cae al final.
 */
export const RadiografiaL: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const tPlaca = 6;
  const tScan = Math.max(12, cuando(timing, off, 'radiografía', 0, 20) - 4);
  const tDesp = Math.max(tScan + 30, cuando(timing, off, 'desplazadas', tScan, tScan + 80) - 6);
  const tRota = Math.max(tDesp + 14, cuando(timing, off, 'rota', tDesp, tDesp + 60) - 4);
  const kPlaca = tw(f, [tPlaca, tPlaca + 12], [0, 1], E.outBack);
  const scan = tw(f, [tScan, tScan + 36], [0, 1], E.inOutCubic);
  const kDesp = tw(f, [tDesp, tDesp + 12], [0, 1], E.outBack2);
  const kRota = tw(f, [tRota, tRota + 8], [0, 1], E.outExpo);
  const bo = boil(f, 16, 0.9);
  const z = empuje(f, frames, 0.04, 8) * golpes(f, [tRota], 0.05);
  const desplazo = [0, 0, 34, 52, 30, 0, 0]; // vértebras corridas
  const yScan = 180 + scan * 600;

  return (
    <Escenario fondo="pizarra" impactos={[{ frame: tDesp + 2, amp: 8 }, { frame: tRota + 2, amp: 16 }]} deriva={0.3} zoom={z}>
      <Particulas tipo="polvo" n={20} semilla={95} colores={[C.tiza]} opacidad={0.3} velocidad={0.25} />
      {/* placa */}
      <div
        style={{
          position: 'absolute', left: 200, top: 70, width: 720, height: 800, background: '#0C100E', border: `6px solid ${C.tiza}`, boxShadow: '16px 18px 0 rgba(0,0,0,0.35)',
          transform: `translate(${bo.x}px, ${(1 - kPlaca) * 500 + bo.y}px) rotate(${-1.5 + (1 - kPlaca) * 4}deg)`, opacity: Math.min(1, kPlaca * 2),
          clipPath: 'polygon(0 0, 94% 0, 100% 6%, 100% 100%, 6% 100%, 0 94%)',
        }}
      >
        <div style={{ position: 'absolute', left: 28, top: 20, fontFamily: FONT.maquina, fontSize: 34, letterSpacing: '0.16em', color: C.lima }}>RADIOGRAFÍA · CUELLO</div>
        <svg width={720} height={800} viewBox="200 70 720 800" style={{ position: 'absolute', inset: 0 }}>
          {/* cráneo (base) y hombros */}
          <path d="M470 214 Q462 116 580 110 Q698 116 690 214 Q640 236 580 236 Q520 236 470 214 Z M500 224 Q560 264 640 226" fill="none" stroke={C.tiza} strokeWidth={4} opacity={0.5 * Math.min(1, scan * 3)} />
          <path d="M260 800 Q380 700 520 690 M900 800 Q780 700 640 690" fill="none" stroke={C.tiza} strokeWidth={4} opacity={0.4 * Math.min(1, scan * 2)} />
          {Array.from({ length: VERT }).map((_, i) => {
            const v = vert(i);
            const visible = yScan > v.y;
            if (!visible) return null;
            const dx = desplazo[i] * kDesp;
            const rota = i === 1;
            return (
              <g key={i} transform={`translate(${dx} 0)`}>
                <rect x={v.cx - v.w / 2} y={v.y + 6} width={v.w} height={54} rx={22} fill="rgba(237,235,228,0.16)" stroke={C.tiza} strokeWidth={5} />
                <path d={`M${v.cx - v.w / 2 + 22} ${v.y + 33} H${v.cx + v.w / 2 - 22}`} stroke={C.tiza} strokeWidth={3} opacity={0.5} strokeDasharray="2 10" strokeLinecap="round" />
                <path d={`M${v.cx + v.w / 2 - 6} ${v.y + 24} L${v.cx + v.w / 2 + 52} ${v.y + 16} L${v.cx + v.w / 2 + 52} ${v.y + 36} Z`} fill="rgba(237,235,228,0.4)" stroke={C.tiza} strokeWidth={3.4} strokeLinejoin="round" />
                {rota && kRota > 0 && (
                  <g>
                    <path d={`M${v.cx - v.w / 2 + 6} ${v.y + 14} L${v.cx - 20} ${v.y + 36} L${v.cx + 6} ${v.y + 22} L${v.cx + 30} ${v.y + 46} L${v.cx + v.w / 2 - 8} ${v.y + 30}`} fill="none" stroke={C.lima} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${kRota} 2`} pathLength={1} />
                  </g>
                )}
              </g>
            );
          })}
          {/* barrido de luz */}
          {scan > 0 && scan < 1 && <rect x={240} y={yScan} width={640} height={10} fill={C.lima} opacity={0.85} />}
        </svg>
      </div>
      {/* anotaciones */}
      {kDesp > 0.1 && <CintaImpacto texto="VARIAS DESPLAZADAS" x={1330} y={400} at={tDesp + 2} rot={-3} size={58} color={C.cinta} />}
      {kRota > 0.1 && <CintaImpacto texto="UNA, ROTA" x={1330} y={560} at={tRota + 2} rot={2} size={66} color={C.lima} />}
      {kRota > 0.3 && <Sello texto="FRACTURA" x={1330} y={760} size={130} rot={-8} delay={tRota + 14} mezcla="normal" />}
      {kDesp > 0.1 && (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
          <path d={`M1040 410 Q1100 400 1130 ${400}`} fill="none" stroke={C.lima} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={`${kDesp} 2`} />
        </svg>
      )}
      <Impacto at={tRota} x={X0 + 40} y={vert(1).y + 36} flash={0.12} color={C.lima} semilla={4} />
      <Destello at={tRota} color={C.lima} max={0.25} dur={5} />
      <Sfx name="riser" at={tScan} volume={0.3} />
      <Sfx name="thump" at={tDesp} volume={0.55} />
      <Sfx name="impact" at={tRota} volume={0.85} />
      <SubtitulosL esc={esc} timing={timing} off={off} tono="pizarra" />
    </Escenario>
  );
};
