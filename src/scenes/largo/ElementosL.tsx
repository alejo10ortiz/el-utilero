import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, FPS } from '../../../config/brand';
import { Picto, NombrePicto } from '../../components/Pictos';
import { Sfx } from '../../components/Sfx';
import { E, hash, pop, tw } from '../../lib/ease';
import { useAbs } from '../../lib/ritmo';
import { cuando } from '../../lib/voz';
import type { EscenaProps } from '../Escenario';

const ACENTOS = { lima: C.lima, papel: C.ficha, sello: C.sello, cinta: C.cinta, kraft: C.kraft } as const;

/**
 * ELEMENTOS — la «carne» visual de las escenas del video largo: pictogramas y flechas que entran cuando la voz dice su
 * palabra (`palabra`), con entrada propia (pop, cae, desliza, vuela, pulso) y vida continua (flotan, respiran al beat).
 * Se declaran en episode.json (`elementos`, `flechas`) sin escribir código nuevo por escena.
 */
export const ElementosL: React.FC<Pick<EscenaProps, 'esc' | 'timing' | 'frames'>> = ({ esc, timing }) => {
  const f = useCurrentFrame();
  const abs = useAbs();
  const off = Math.round(timing.start * FPS);
  const els = esc.elementos ?? [];
  const flechas = esc.flechas ?? [];

  // instante de entrada: la voz manda; si no se nombra, se escalona
  const t: number[] = [];
  els.forEach((e, i) => {
    const prev = i === 0 ? 0 : Math.max(0, t[i - 1] - 6);
    const def = 16 + i * 14;
    t.push(e.palabra ? Math.max(3, cuando(timing, off, e.palabra, prev, def) - 2) : def);
  });
  const tf = flechas.map((a, i) => (a.palabra ? Math.max(6, cuando(timing, off, a.palabra, 0, 24 + i * 20) - 2) : 24 + i * 20));

  return (
    <>
      {flechas.map((a, i) => {
        const k = tw(f, [tf[i], tf[i] + 14], [0, 1], E.outCubic);
        if (k <= 0) return null;
        const mx = (a.x1 + a.x2) / 2 + (a.curva ?? 0) * Math.sin(Math.atan2(a.y2 - a.y1, a.x2 - a.x1));
        const my = (a.y1 + a.y2) / 2 - (a.curva ?? 0) * Math.cos(Math.atan2(a.y2 - a.y1, a.x2 - a.x1));
        const ang = (Math.atan2(a.y2 - my, a.x2 - mx) * 180) / Math.PI;
        const col = a.color === 'lima' ? C.lima : a.color === 'sello' ? C.sello : C.tinta;
        return (
          <React.Fragment key={`f${i}`}>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', filter: 'url(#ink)' }}>
              <path d={`M${a.x1} ${a.y1} Q${mx} ${my} ${a.x2} ${a.y2}`} fill="none" stroke={col} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 2`} />
              {k > 0.92 && (
                <g transform={`translate(${a.x2} ${a.y2}) rotate(${ang})`}>
                  <path d="M-26 -18 L0 0 L-26 18" fill="none" stroke={col} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}
            </svg>
            <Sfx name="swish" at={tf[i]} volume={0.3} />
          </React.Fragment>
        );
      })}
      {els.map((e, i) => {
        const tam = e.tam ?? 220;
        const anim = e.anim ?? 'pop';
        const ini = t[i];
        const dt = f - ini;
        if (dt < 0) return null;
        const desde = e.desde ?? (anim === 'cae' ? 'arr' : 'izq');
        const dx = desde === 'izq' ? -1 : desde === 'der' ? 1 : 0;
        const dy = desde === 'arr' ? -1 : desde === 'abj' ? 1 : 0;
        let tx = 0, ty = 0, sc = 1, rt = e.rot ?? 0;
        if (anim === 'pop' || anim === 'pulso') {
          sc = pop(f, ini, 10);
          rt += (1 - Math.min(1, sc)) * (i % 2 ? 14 : -14);
        } else if (anim === 'cae') {
          ty = tw(dt, [0, 12], [-900, 0], E.outBack2);
          sc = 1;
        } else if (anim === 'desliza') {
          const k = tw(dt, [0, 12], [1, 0], E.outExpo);
          tx = dx * 900 * k;
          ty = dy * 700 * k;
        } else if (anim === 'vuela') {
          const k = tw(dt, [0, 16], [1, 0], E.outExpo);
          tx = (dx || 1) * 1300 * k;
          ty = (dy || -0.4) * 800 * k;
          rt += k * 380;
          sc = 0.5 + 0.5 * (1 - k);
        }
        // vida continua: flota y respira
        const flota = Math.sin((abs + i * 11) / 24) * 7;
        const beat = anim === 'pulso' ? 1 + 0.05 * Math.exp(-(abs % 18) / 4.5) : 1;
        const bo = (hash(Math.floor((abs * 12) / 30) + i * 7) - 0.5) * 1.2;
        const color = e.acento ? ACENTOS[e.acento] : C.lima;
        const kEt = tw(dt, [8, 16], [0, 1], E.outBack);
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute', left: e.x - tam / 2, top: e.y - tam / 2, width: tam, height: tam,
                transform: `translate(${tx}px, ${ty + flota}px) rotate(${rt + bo}deg) scale(${Math.max(0, sc) * beat})`, opacity: Math.min(1, dt / 3), pointerEvents: 'none',
                filter: 'drop-shadow(6px 8px 0 rgba(22,19,15,0.22))',
              }}
            >
              <Picto nombre={e.p as NombrePicto} size={tam} acento={color} texto={e.texto} />
            </div>
            {e.etiqueta && (
              <div
                style={{
                  position: 'absolute', left: e.x, top: e.y + tam * 0.52, transform: `translate(-50%, 0) rotate(${i % 2 ? 2 : -2}deg) scale(${kEt})`, opacity: kEt, whiteSpace: 'nowrap',
                  fontFamily: FONT.maquina, fontSize: 36, color: C.tinta, background: C.cinta, padding: '4px 18px',
                  clipPath: 'polygon(0 10%,2% 0,50% 4%,98% 0,100% 12%,99% 90%,100% 100%,52% 95%,2% 100%,0 88%)',
                }}
              >
                {e.etiqueta}
              </div>
            )}
            <Sfx name={anim === 'cae' ? 'thump' : anim === 'vuela' || anim === 'desliza' ? 'swish' : 'pop'} at={ini} volume={0.38} />
          </React.Fragment>
        );
      })}
    </>
  );
};
