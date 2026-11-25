import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, FPS } from '../../../config/brand';
import { Particulas } from '../../components/Fx';
import { Picto } from '../../components/Pictos';
import { Sfx } from '../../components/Sfx';
import { empuje } from '../../lib/camara';
import { E, boil, pop, tw } from '../../lib/ease';
import { useAbs } from '../../lib/ritmo';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';
import { SubtitulosL } from './comun';

/**
 * PASILLO DE HONOR — la grada se pone de pie (fila de figuras que se levanta), las palmas saltan y dos filas de jugadores
 * rivales forman un pasillo por el que camina el portero (guantes). Todo con pictogramas, sin caras ni equipaciones reales.
 */
export const PasilloL: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const abs = useAbs();
  const off = Math.round(timing.start * FPS);
  const tGrada = 6; // la grada entra de inmediato (nunca pantalla vacía tras el corte)
  const tPalmas = Math.max(tGrada + 14, cuando(timing, off, 'aplaudió', tGrada, 44) - 4);
  const tFilas = Math.max(tPalmas + 8, cuando(timing, off, 'jugadores', tPalmas, 80) - 3);
  const tPasillo = Math.max(tFilas + 18, cuando(timing, off, 'pasillo', tFilas, 120) - 3);
  const z = empuje(f, frames, 0.04, 8);
  const bo = boil(f, 18, 1);
  const N = 11;
  const xs = (i: number, n: number, x0: number, x1: number) => x0 + (i * (x1 - x0)) / (n - 1);
  const kGK = tw(f, [tPasillo, tPasillo + 44], [0, 1], E.inOutCubic);

  return (
    <Escenario fondo="papel" impactos={[{ frame: tPalmas + 3, amp: 8 }]} deriva={0.4} zoom={z}>
      <Particulas tipo="polvo" n={22} semilla={97} colores={[C.tinta, C.grisArchivo]} opacidad={0.22} velocidad={0.3} />
      {/* grada: se levanta */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 }}>
        {Array.from({ length: N }).map((_, i) => {
          const t0 = tGrada + i * 2;
          const k = pop(f, t0, 9);
          if (f < t0) return null;
          const sentado = 70;
          const y = 120 + sentado * (1 - Math.min(1, k)) + Math.sin((abs + i * 9) / 14) * 4;
          return (
            <div key={i} style={{ position: 'absolute', left: xs(i, N, 190, 1730) - 70, top: y, width: 140, height: 140, transform: `scaleY(${0.75 + 0.25 * Math.min(1, k)})`, transformOrigin: '50% 100%' }}>
              <Picto nombre="persona" size={140} acento={i % 3 === 0 ? C.cinta : i % 3 === 1 ? C.kraft : C.ficha} />
            </div>
          );
        })}
      </div>
      {/* palmas */}
      {[0, 1, 2].map((i) => {
        const t0 = tPalmas + i * 5;
        const k = pop(f, t0, 9);
        if (f < t0) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: 520 + i * 440, top: 300 + (i % 2) * 34, width: 220, height: 220, transform: `scale(${k * (1 + 0.06 * Math.sin((abs + i * 7) / 5))}) rotate(${(i - 1) * 8}deg)`, filter: 'drop-shadow(6px 8px 0 rgba(22,19,15,0.22))' }}>
            <Picto nombre="palmas" size={220} acento={C.lima} />
          </div>
        );
      })}
      {/* dos filas de jugadores */}
      {[0, 1].map((fila) =>
        Array.from({ length: 6 }).map((_, i) => {
          const t0 = tFilas + i * 3 + fila * 2;
          const k = tw(f, [t0, t0 + 10], [0, 1], E.outBack);
          if (f < t0) return null;
          const x = xs(i, 6, 420, 1500);
          return (
            <div key={`${fila}${i}`} style={{ position: 'absolute', left: x - 70, top: fila === 0 ? 520 : 760, width: 140, height: 140, opacity: k, transform: `translateY(${(1 - k) * (fila === 0 ? -80 : 80)}px) scaleX(${fila === 0 ? 1 : -1})`, transformOrigin: '50% 50%' }}>
              <Picto nombre="persona" size={140} acento={C.lima} />
            </div>
          );
        }),
      )}
      {/* el pasillo: línea central y el portero que camina */}
      {kGK > 0 && (
        <>
          <div style={{ position: 'absolute', left: 360, top: 700, width: 1200 * Math.min(1, kGK * 1.1), height: 0, borderTop: `6px dashed ${C.tinta}`, opacity: 0.55 }} />
          <div style={{ position: 'absolute', left: 360 + kGK * 1120 - 90 + bo.x, top: 612 + bo.y + Math.sin(abs / 4) * 5, width: 180, height: 180 }}>
            <Picto nombre="guantes" size={180} acento={C.lima} />
          </div>
        </>
      )}
      {f >= tPasillo - 4 && (
        <div style={{ position: 'absolute', left: 1490, top: 480, transform: `rotate(-3deg) scale(${tw(f, [tPasillo - 4, tPasillo + 4], [0, 1], E.outBack)})` }}>
          <span style={{ display: 'inline-block', background: C.cinta, color: C.tinta, fontFamily: FONT.maquina, fontSize: 30, padding: '6px 18px', clipPath: 'polygon(0 8%,2% 0,50% 4%,98% 0,100% 10%,99% 92%,100% 100%,50% 95%,2% 100%,0 92%)' }}>PASILLO DE HONOR</span>
        </div>
      )}
      <Sfx name="hinchada" at={tPalmas} volume={0.35} />
      <Sfx name="clap" at={tPalmas} volume={0.5} />
      <Sfx name="whoosh" at={tPasillo} volume={0.35} />
      <SubtitulosL esc={esc} timing={timing} off={off} />
    </Escenario>
  );
};
