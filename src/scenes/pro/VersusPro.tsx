import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import { C, FONT, FPS, SAFE_BOX } from '../../../config/brand';
import { Destello, Impacto, Particulas } from '../../components/Fx';
import { Palabras } from '../../components/Palabras';
import { Sello } from '../../components/Sello';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { E, boil, slam, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';

/**
 * VERSUS — dos hojas enfrentadas (arriba lima, abajo kraft), cada una con su título y sus líneas, que entran cuando
 * se nombran; el sello rojo «VS» cae en el medio. Para duelos: Chivas / Athletic, Messi / Maradona, 1950 / 2014…
 */
export const VersusPro: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const lados = (esc.lados ?? []).slice(0, 2);
  const tA = 11;
  const tB = 11 + 16;
  const tVS = tB + 14;
  const base = [tA, tB];
  const hojas = [
    { x: 70, y: 200, w: 880, h: 540, rot: -2.2, fondo: C.lima, desde: -1 },
    { x: 130, y: 790, w: 880, h: 540, rot: 2.2, fondo: C.kraft, desde: 1 },
  ];
  const tLineas = lados.map((l, i) =>
    l.lineas.map((_, j) => Math.max(base[i] + 22 + j * 20, cuando(timing, off, l.palabras?.[j] ?? '', 0, base[i] + 30 + j * 34) - 2)),
  );
  const z = empuje(f, frames, 0.05, 8) * golpes(f, [tA, tB, tVS, ...tLineas.flat()], 0.03);
  const impactos = [{ frame: tA + 3, amp: 10 }, { frame: tB + 3, amp: 10 }, { frame: tVS + 3, amp: 14 }];

  return (
    <Escenario fondo="papel" impactos={impactos} deriva={0.4} zoom={z}>
      <Particulas tipo="polvo" n={18} semilla={37} colores={[C.tinta, C.grisArchivo]} opacidad={0.22} velocidad={0.3} />
      {lados.map((l, i) => {
        const h = hojas[i];
        const s = slam(f, base[i], 1.5);
        if (!s.visible) return null;
        const k = Math.min(1, (f - base[i]) / 8);
        const { fontSize } = fitText({ text: l.titulo.toUpperCase(), withinWidth: h.w - 90, fontFamily: 'League Gothic', fontWeight: '400' });
        const bo = boil(f, 11 + i * 5, 1.4);
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: h.x, top: h.y, width: h.w, height: h.h, background: h.fondo, opacity: s.opacity,
              transform: `translate(${(1 - k) * h.desde * 420 + bo.x}px, ${s.y + bo.y}px) rotate(${h.rot + (1 - k) * h.desde * 6}deg) scale(${s.scale})`,
              boxShadow: '14px 18px 0 rgba(22,19,15,0.28)', border: `5px solid ${C.tinta}`,
            }}
          >
            <div style={{ position: 'absolute', left: 44, top: 22, fontFamily: FONT.grito, fontSize: Math.min(230, fontSize), lineHeight: 0.95, color: C.tinta, textShadow: `7px 5px 0 ${i === 0 ? C.papel : C.lima}` }}>
              {l.titulo.toUpperCase()}
            </div>
            <div style={{ position: 'absolute', left: 44, top: Math.min(230, fontSize) * 0.95 + 56, width: h.w - 90 }}>
              {l.lineas.map((txt, j) => {
                const t = tLineas[i][j];
                const k2 = tw(f, [t, t + 10], [0, 1], E.outCubic);
                if (f < t) return null;
                return (
                  <div key={j} style={{ fontFamily: FONT.maquina, fontSize: 46, lineHeight: 1.18, color: C.tinta, marginBottom: 14, opacity: k2, transform: `translateX(${(1 - k2) * 60}px)` }}>
                    <span style={{ background: i === 0 ? C.papel : C.ficha, padding: '2px 10px' }}>{txt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {lados.length === 2 && <Sello texto="VS" x={SAFE_BOX.cx + 10} y={770} size={170} rot={-9} delay={tVS} mezcla="normal" />}
      {lados.map((_, i) => (
        <React.Fragment key={`fx${i}`}>
          <Impacto at={base[i]} x={540} y={hojas[i].y + hojas[i].h / 2} flash={0.08} semilla={i + 1} />
          <Sfx name="slam" at={base[i] + 1} volume={0.7} />
        </React.Fragment>
      ))}
      <Destello at={tVS} color={C.lima} max={0.3} dur={5} />
      <Sfx name="impact" at={tVS} volume={0.8} />
      {tLineas.flat().map((t, i) => (
        <Sfx key={`l${i}`} name="tape" at={t} volume={0.3} />
      ))}
      <Palabras words={timing.words} offsetFrames={off} tono="papel" claves={esc.claves} y={1385} size={84} />
    </Escenario>
  );
};
