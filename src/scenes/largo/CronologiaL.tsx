import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import { C, FONT, FPS } from '../../../config/brand';
import { Destello, Impacto, Particulas } from '../../components/Fx';
import { Sfx } from '../../components/Sfx';
import { empuje } from '../../lib/camara';
import { E, boil, pop, slam, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';
import { SubtitulosL } from './comun';

const YLINEA = 500;

/**
 * CRONOLOGÍA horizontal — un hilo discontinuo con hitos (año gigante arriba, línea mecanografiada abajo). Cada hito se
 * clava cuando la voz lo nombra; el hilo se alarga a medida que avanza la historia.
 */
export const CronologiaL: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const hitos = (esc.hitos ?? []).slice(0, 4);
  const n = hitos.length;
  const t: number[] = [];
  hitos.forEach((h, i) => {
    const prev = i === 0 ? 0 : t[i - 1] + 8;
    t.push(i === 0 ? 12 : Math.max(prev, cuando(timing, off, h.palabra ?? h.anio, prev, 28 + i * 60) - 3));
  });
  const anchoHito = n >= 4 ? 400 : n === 3 ? 480 : 640;
  const margen = anchoHito / 2 + 110; // el primer y el último hito quedan dentro del cuadro
  const xs = hitos.map((_, i) => (n === 1 ? 960 : margen + (i * (1920 - 2 * margen)) / (n - 1)));
  const largoHilo = tw(f, [8, (t[n - 1] ?? 60) + 10], [0, 1], E.outCubic);
  const z = empuje(f, frames, 0.04, 8);

  return (
    <Escenario fondo="papel" impactos={t.map((x) => ({ frame: x + 3, amp: 10 }))} deriva={0.3} zoom={z}>
      <Particulas tipo="polvo" n={20} semilla={43} colores={[C.tinta, C.grisArchivo]} opacidad={0.22} velocidad={0.3} />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <path d={`M${xs[0] - 120} ${YLINEA} H${xs[0] - 120 + (xs[n - 1] - xs[0] + 240) * largoHilo}`} stroke={C.tinta} strokeWidth={8} strokeDasharray="24 14" strokeLinecap="round" fill="none" />
      </svg>
      {hitos.map((h, i) => {
        const s = slam(f, t[i], 1.7);
        if (!s.visible) return null;
        const k = pop(f, t[i] + 2, 9);
        const bo = boil(f, 5 + i, 1.4);
        const anio = h.anio.toUpperCase();
        const tam = Math.min(250, fitText({ text: anio, withinWidth: anchoHito, fontFamily: 'League Gothic', fontWeight: '400' }).fontSize);
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: xs[i] - 26, top: YLINEA - 26, width: 52, height: 52, borderRadius: '50%', background: C.lima, border: `8px solid ${C.tinta}`, transform: `scale(${k})` }} />
            <div
              style={{
                position: 'absolute', left: xs[i] - anchoHito / 2, top: YLINEA - 70 - tam, width: anchoHito, textAlign: 'center', fontFamily: FONT.grito, fontSize: tam, lineHeight: 0.95, color: C.tinta,
                opacity: s.opacity, textShadow: `9px 7px 0 ${C.lima}`, transform: `translate(${bo.x}px, ${s.y + bo.y}px) scale(${s.scale})`, transformOrigin: '50% 80%',
                filter: s.blur > 0.3 ? `blur(${s.blur}px)` : undefined,
              }}
            >
              {anio}
            </div>
            <div
              style={{
                position: 'absolute', left: xs[i] - anchoHito / 2, top: YLINEA + 60, width: anchoHito, padding: '10px 20px', background: C.cinta, color: C.tinta, fontFamily: FONT.maquina, fontSize: 42, lineHeight: 1.2, textAlign: 'center',
                transform: `rotate(${i % 2 === 0 ? -1.6 : 1.4}deg) scaleX(${tw(f, [t[i] + 6, t[i] + 16], [0.2, 1], E.outCubic)})`, opacity: tw(f, [t[i] + 6, t[i] + 9], [0, 1]),
                clipPath: 'polygon(0 6%,2% 0,50% 3%,98% 0,100% 8%,99% 92%,100% 100%,52% 96%,3% 100%,0 94%)',
              }}
            >
              {h.texto}
            </div>
            <Impacto at={t[i]} x={xs[i]} y={YLINEA} flash={0.1} semilla={i + 2} />
            <Sfx name="slam" at={t[i] + 1} volume={0.6} />
            <Sfx name="tape" at={t[i] + 7} volume={0.4} />
          </React.Fragment>
        );
      })}
      <Destello at={t[n - 1] ?? 0} color={C.lima} max={0.22} dur={5} />
      <SubtitulosL esc={esc} timing={timing} off={off} />
    </Escenario>
  );
};
