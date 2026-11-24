import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, FPS } from '../../../config/brand';
import { CintaImpacto } from '../../components/Cinetica';
import { Destello, Impacto, Particulas } from '../../components/Fx';
import { Sello } from '../../components/Sello';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { E, boil, slam, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';
import { SubtitulosL } from './comun';

/**
 * VEREDICTO — el sello VERIFICADO* cae cuando la voz lo dice y, a la derecha, una hoja «Lo que las fuentes no dicen igual»
 * muestra una fila por cada discrepancia (cada una entra cuando se nombra). Contar las diferencias es parte de la marca.
 */
export const VeredictoL: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const filas = esc.filas ?? [];
  const tSello = Math.max(10, cuando(timing, off, 'verificado', 0, 16) - 1);
  const tAst = Math.max(tSello + 14, cuando(timing, off, 'asteriscos', tSello, tSello + 36) - 2);
  const tHoja = tSello + 22;
  const tFila: number[] = [];
  filas.forEach((r, i) => {
    const prev = i === 0 ? tHoja + 14 : tFila[i - 1] + 14;
    tFila.push(Math.max(prev, cuando(timing, off, r.palabra ?? r.dato, prev, prev + 40) - 2));
  });
  const tAfirmo = Math.max((tFila[tFila.length - 1] ?? 0) + 30, cuando(timing, off, 'afirmo', 0, frames - 60) - 4);
  const sHoja = slam(f, tHoja, 1.4);
  const bo = boil(f, 12, 1.2);
  const z = empuje(f, frames, 0.04, 8) * golpes(f, [tSello, ...tFila], 0.025);

  return (
    <Escenario fondo="papel" impactos={[{ frame: tSello + 3, amp: 16 }, ...tFila.map((t) => ({ frame: t + 2, amp: 7 }))]} deriva={0.4} zoom={z}>
      <Particulas tipo="polvo" n={22} semilla={79} colores={[C.tinta, C.grisArchivo]} opacidad={0.22} velocidad={0.3} />
      {esc.sello && <Sello texto={esc.sello} x={460} y={400} size={132} rot={-9} delay={tSello} mezcla="multiply" />}
      <CintaImpacto texto="CON ASTERISCOS" x={470} y={640} at={tAst} rot={-3} size={64} color={C.lima} />
      {sHoja.visible && (
        <div
          style={{
            position: 'absolute', left: 910, top: 80, width: 900, height: 740, opacity: sHoja.opacity, background: `${C.ficha} repeating-linear-gradient(180deg, transparent 0 87px, ${C.lineaFicha} 87px 88px)`,
            backgroundPosition: '0 150px', boxShadow: '16px 20px 0 rgba(22,19,15,0.26), 0 2px 0 rgba(22,19,15,0.06)', border: `4px solid ${C.tinta}`,
            transform: `translate(${bo.x}px, ${(1 - Math.min(1, (f - tHoja) / 9)) * 500 + bo.y}px) rotate(${1.4 + (1 - Math.min(1, (f - tHoja) / 9)) * 5}deg)`,
          }}
        >
          <div style={{ position: 'absolute', left: 40, top: 26, fontFamily: FONT.maquina, fontSize: 38, letterSpacing: '0.12em', color: C.tinta }}>LO QUE LAS FUENTES</div>
          <div style={{ position: 'absolute', left: 40, top: 70, fontFamily: FONT.grito, fontSize: 92, lineHeight: 1, color: C.tinta, textShadow: `6px 5px 0 ${C.lima}` }}>NO DICEN IGUAL</div>
          {filas.map((r, i) => {
            const t = tFila[i];
            if (f < t) return null;
            const k = tw(f, [t, t + 9], [0, 1], E.outBack);
            return (
              <div key={i} style={{ position: 'absolute', left: 40, right: 40, top: 200 + i * 130, height: 110, opacity: Math.min(1, k * 3), transform: `translateX(${(1 - k) * 80}px)` }}>
                <div style={{ fontFamily: FONT.maquina, fontSize: 38, color: C.grisArchivo }}>{r.dato}</div>
                <div style={{ marginTop: 2, fontFamily: FONT.grito, fontSize: r.valores.length > 14 ? 54 : 84, lineHeight: 1, color: C.tinta }}>
                  <span style={{ background: C.lima, padding: '0 14px' }}>{r.valores}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <CintaImpacto texto="SI NO SE PUEDE PROBAR, NO LO AFIRMO" x={960} y={850} at={tAfirmo} rot={-1.5} size={54} color={C.cinta} />
      <Destello at={tSello} color={C.lima} max={0.3} dur={5} />
      <Impacto at={tSello} x={470} y={400} flash={0.1} color={C.tinta} semilla={5} />
      <Sfx name="whoosh" at={tHoja - 2} volume={0.45} />
      {tFila.map((t, i) => (
        <React.Fragment key={i}>
          <Sfx name="tape" at={t} volume={0.4} />
          <Sfx name="marker" at={t + 4} volume={0.35} />
        </React.Fragment>
      ))}
      <Sfx name="slap" at={tAfirmo} volume={0.5} />
      <SubtitulosL esc={esc} timing={timing} off={off} />
    </Escenario>
  );
};
