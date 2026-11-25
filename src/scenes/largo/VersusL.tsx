import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import { C, FONT, FPS } from '../../../config/brand';
import { Destello, Impacto, Particulas } from '../../components/Fx';
import { Sello } from '../../components/Sello';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { E, boil, slam, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';
import { SubtitulosL } from './comun';

/** VERSUS horizontal — dos hojas enfrentadas (lima a la izquierda, kraft a la derecha) con el sello rojo «VS» en medio. */
export const VersusL: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const lados = (esc.lados ?? []).slice(0, 2);
  const base = [4, 20];
  const tVS = 20 + 14;
  const hojas = [
    { x: 120, y: 110, w: 790, h: 660, rot: -2.2, fondo: C.lima, desde: -1 },
    { x: 1010, y: 170, w: 790, h: 660, rot: 2.2, fondo: C.kraft, desde: 1 },
  ];
  const tLineas = lados.map((l, i) => l.lineas.map((_, j) => Math.max(base[i] + 22 + j * 20, cuando(timing, off, l.palabras?.[j] ?? '', 0, base[i] + 30 + j * 34) - 2)));
  const z = empuje(f, frames, 0.05, 8) * golpes(f, [base[0], base[1], tVS, ...tLineas.flat()], 0.03);

  return (
    <Escenario fondo="papel" impactos={[{ frame: base[0] + 3, amp: 10 }, { frame: base[1] + 3, amp: 10 }, { frame: tVS + 3, amp: 14 }]} deriva={0.4} zoom={z}>
      <Particulas tipo="polvo" n={22} semilla={37} colores={[C.tinta, C.grisArchivo]} opacidad={0.22} velocidad={0.3} />
      {lados.map((l, i) => {
        const h = hojas[i];
        const s = slam(f, base[i], 1.5);
        if (!s.visible) return null;
        const k = Math.min(1, (f - base[i]) / 8);
        const titulo = l.titulo.toUpperCase();
        const tam = Math.min(200, fitText({ text: titulo, withinWidth: h.w - 90, fontFamily: 'League Gothic', fontWeight: '400' }).fontSize);
        const bo = boil(f, 11 + i * 5, 1.4);
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: h.x, top: h.y, width: h.w, height: h.h, background: h.fondo, opacity: s.opacity,
              transform: `translate(${(1 - k) * h.desde * 520 + bo.x}px, ${s.y + bo.y}px) rotate(${h.rot + (1 - k) * h.desde * 6}deg) scale(${s.scale})`,
              boxShadow: '14px 18px 0 rgba(22,19,15,0.28)', border: `5px solid ${C.tinta}`,
            }}
          >
            <div style={{ position: 'absolute', left: 44, top: 22, fontFamily: FONT.grito, fontSize: tam, lineHeight: 0.95, color: C.tinta, textShadow: `7px 5px 0 ${i === 0 ? C.papel : C.lima}` }}>{titulo}</div>
            <div style={{ position: 'absolute', left: 44, top: tam * 0.95 + 56, width: h.w - 90 }}>
              {l.lineas.map((txt, j) => {
                const t = tLineas[i][j];
                const k2 = tw(f, [t, t + 10], [0, 1], E.outCubic);
                if (f < t) return null;
                return (
                  <div key={j} style={{ fontFamily: FONT.maquina, fontSize: 44, lineHeight: 1.2, color: C.tinta, marginBottom: 14, opacity: k2, transform: `translateX(${(1 - k2) * 60}px)` }}>
                    <span style={{ background: i === 0 ? C.papel : C.ficha, padding: '2px 10px' }}>{txt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {lados.length === 2 && <Sello texto="VS" x={960} y={470} size={160} rot={-9} delay={tVS} mezcla="normal" />}
      {lados.map((_, i) => (
        <React.Fragment key={`fx${i}`}>
          <Impacto at={base[i]} x={hojas[i].x + hojas[i].w / 2} y={hojas[i].y + hojas[i].h / 2} flash={0.08} semilla={i + 1} />
          <Sfx name="slam" at={base[i] + 1} volume={0.7} />
        </React.Fragment>
      ))}
      <Destello at={tVS} color={C.lima} max={0.3} dur={5} />
      <Sfx name="impact" at={tVS} volume={0.8} />
      {tLineas.flat().map((t, i) => (
        <Sfx key={`l${i}`} name="tape" at={t} volume={0.3} />
      ))}
      <SubtitulosL esc={esc} timing={timing} off={off} />
    </Escenario>
  );
};
