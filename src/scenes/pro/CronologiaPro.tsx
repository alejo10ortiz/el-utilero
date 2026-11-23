import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, FPS } from '../../../config/brand';
import { Destello, Impacto, Particulas } from '../../components/Fx';
import { Palabras } from '../../components/Palabras';
import { Sfx } from '../../components/Sfx';
import { empuje } from '../../lib/camara';
import { E, boil, pop, slam, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';

const PASO = 400; // separación vertical entre hitos
const Y0 = 400;

/**
 * CRONOLOGÍA — un hilo vertical con hitos (año gigante + línea mecanografiada). La cámara DESCIENDE por el hilo al ritmo
 * en que la voz nombra cada año; cada hito se clava con su impacto. Para sagas y procesos (El Dorado, 1949 → 1954).
 */
export const CronologiaPro: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const hitos = (esc.hitos ?? []).slice(0, 5);
  const t: number[] = [];
  hitos.forEach((h, i) => {
    const prev = i === 0 ? 0 : t[i - 1] + 8;
    t.push(Math.max(i === 0 ? 14 : prev, cuando(timing, off, h.palabra ?? h.anio, i === 0 ? 0 : prev, 28 + i * 60) - 3));
  });
  // cámara: sigue al último hito que ya entró (suave)
  let camY = 0;
  hitos.forEach((_, i) => {
    const objetivo = Math.max(0, Y0 + i * PASO - 760);
    const k = tw(f, [t[i] - 2, t[i] + 22], [0, 1], E.inOutCubic);
    camY = camY + (objetivo - camY) * k;
  });
  const largoHilo = tw(f, [8, (t[hitos.length - 1] ?? 60) + 10], [0, 1], E.outCubic);
  const z = empuje(f, frames, 0.04, 8);

  return (
    <Escenario fondo="papel" impactos={t.map((x) => ({ frame: x + 3, amp: 11 }))} deriva={0.3} zoom={z}>
      <Particulas tipo="polvo" n={18} semilla={43} colores={[C.tinta, C.grisArchivo]} opacidad={0.22} velocidad={0.3} />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-camY}px)` }}>
        {/* el hilo */}
        <svg width={1080} height={Y0 + PASO * hitos.length + 600} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <path d={`M196 ${Y0 - 160} V${Y0 - 160 + (hitos.length * PASO + 160) * largoHilo}`} stroke={C.tinta} strokeWidth={7} strokeDasharray="22 12" strokeLinecap="round" fill="none" />
        </svg>
        {hitos.map((h, i) => {
          const y = Y0 + i * PASO;
          const s = slam(f, t[i], 1.7);
          if (!s.visible) return null;
          const k = pop(f, t[i] + 2, 9);
          const bo = boil(f, 5 + i, 1.4);
          return (
            <div key={i} style={{ position: 'absolute', left: 0, top: y, width: 1080 }}>
              <div style={{ position: 'absolute', left: 196 - 24, top: 62, width: 48, height: 48, borderRadius: '50%', background: C.lima, border: `7px solid ${C.tinta}`, transform: `scale(${k})` }} />
              <div
                style={{
                  position: 'absolute', left: 262, top: -10, fontFamily: FONT.grito, fontSize: 250, lineHeight: 0.95, color: C.tinta, opacity: s.opacity,
                  textShadow: `9px 7px 0 ${C.lima}`, transform: `translate(${bo.x}px, ${s.y + bo.y}px) scale(${s.scale})`, transformOrigin: '0% 50%',
                  filter: s.blur > 0.3 ? `blur(${s.blur}px)` : undefined,
                }}
              >
                {h.anio}
              </div>
              <div
                style={{
                  position: 'absolute', left: 262, top: 214, width: 640, padding: '8px 18px', background: C.cinta, color: C.tinta, fontFamily: FONT.maquina, fontSize: 44, lineHeight: 1.2,
                  transform: `rotate(${i % 2 === 0 ? -1.6 : 1.4}deg) scaleX(${tw(f, [t[i] + 6, t[i] + 16], [0.2, 1], E.outCubic)})`, transformOrigin: '0% 50%',
                  opacity: tw(f, [t[i] + 6, t[i] + 9], [0, 1]), clipPath: 'polygon(0 6%,2% 0,50% 3%,98% 0,100% 8%,99% 92%,100% 100%,52% 96%,3% 100%,0 94%)',
                }}
              >
                {h.texto}
              </div>
            </div>
          );
        })}
      </div>
      {t.map((x, i) => (
        <React.Fragment key={i}>
          <Impacto at={x} x={540} y={Math.min(700, Y0 + i * PASO - camY + 120)} flash={0.12} semilla={i + 2} />
          <Sfx name="slam" at={x + 1} volume={0.6} />
          <Sfx name="tape" at={x + 7} volume={0.4} />
        </React.Fragment>
      ))}
      <Destello at={t[hitos.length - 1] ?? 0} color={C.lima} max={0.25} dur={5} />
      <Palabras words={timing.words} offsetFrames={off} tono="papel" claves={esc.claves} y={1385} size={84} />
    </Escenario>
  );
};
