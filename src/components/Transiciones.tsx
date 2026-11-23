import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT } from '../../config/brand';
import { E, hash, tw } from '../lib/ease';
import { Destello, LineasVelocidad } from './Fx';
import { Puerta } from './Camerino';
import { Sfx } from './Sfx';
import { TransArranque, TransBalon, TransBorrador, TransPersiana, TransRotativa, TransTinta } from './TransicionesNuevas';
import type { TemaId } from '../lib/tema';

/**
 * TRANSICIONES COMO OBJETOS (BRAND.md §5.1-5: "ningún fundido genérico").
 * Cada una es un overlay de `dur` frames que se monta con <Sequence from={corte − dur/2}>:
 * en t = dur/2 la pantalla está tapada del todo (ahí cae el corte) y al segundo tiempo se destapa.
 */
export type TipoTransicion = 'cinta' | 'hoja' | 'flash' | 'puerta' | 'persiana' | 'balon' | 'tinta' | 'arranque' | 'rotativa' | 'borrador';

const RASGADO = 'polygon(0 8%,2% 0,12% 5%,25% 0,40% 6%,55% 0,70% 5%,85% 0,100% 7%,98% 30%,100% 55%,97% 80%,100% 95%,88% 100%,70% 94%,52% 100%,35% 95%,18% 100%,4% 96%,0 88%,2% 60%,0 35%)';

const TransCinta: React.FC<{ dur: number; textos?: string[] }> = ({ dur, textos = ['EL UTILERO', '→', 'CAMERINO', '★', 'ARCHIVO', '→', 'EL UTILERO', '★', 'CAMERINO'] }) => {
  const t = useCurrentFrame();
  const mitad = dur / 2;
  const n = 9;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, transform: 'rotate(-8deg) scale(1.25)' }}>
        {Array.from({ length: n }).map((_, i) => {
          const dir = i % 2 ? 1 : -1; // viene de un lado y sale por el otro
          const entra = tw(t, [i * 0.9, i * 0.9 + 6], [dir * 2100, 0], E.outExpo);
          const sale = tw(t, [mitad + i * 0.9, mitad + i * 0.9 + 6], [0, -dir * 2100], E.inExpo);
          const x = t < mitad ? entra : sale;
          return (
            <div
              key={i}
              style={{
                position: 'absolute', left: -420, top: -240 + i * 258, width: 1920, height: 300,
                transform: `translateX(${x}px)`,
                background: i % 3 === 1 ? C.lima : C.cinta,
                clipPath: RASGADO, filter: 'drop-shadow(0 10px 14px rgba(22,19,15,0.4))',
                display: 'flex', alignItems: 'center', justifyContent: i % 2 ? 'flex-start' : 'flex-end', padding: '0 220px',
                fontFamily: FONT.marcador, fontSize: 150, color: C.tinta, whiteSpace: 'nowrap',
              }}
            >
              {textos[i % textos.length]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TransHoja: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useCurrentFrame();
  const mitad = dur / 2;
  const entra = (k: number) => tw(t, [0, mitad - 1], [k, 0], E.outExpo);
  const sale = (k: number) => tw(t, [mitad, dur], [0, k], E.inOutCubic);
  const x = t < mitad ? entra(-1700) : sale(1700);
  const y = t < mitad ? entra(2100) : sale(-2100);
  const stamp = tw(t, [mitad - 4, mitad], [1.7, 1], E.outBack);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute', left: -460, top: -700, width: 2000, height: 3300, background: C.papel,
          transform: `translate(${x}px, ${y}px) rotate(-11deg)`, clipPath: RASGADO,
          boxShadow: '0 0 60px rgba(22,19,15,0.55)', filter: 'drop-shadow(0 20px 30px rgba(22,19,15,0.45))',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${C.tinta} 1.6px, transparent 1.8px)`, backgroundSize: '18px 18px', opacity: 0.1 }} />
        <div
          style={{
            position: 'absolute', left: 560, top: 1380, transform: `rotate(-8deg) scale(${stamp})`, opacity: t > mitad - 5 ? 0.9 : 0,
            fontFamily: FONT.grito, fontSize: 330, letterSpacing: '0.08em', color: C.sello, border: `18px solid ${C.sello}`, padding: '0 50px',
          }}
        >
          ARCHIVO
        </div>
      </div>
    </div>
  );
};

const TransFlash: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useCurrentFrame();
  const mitad = dur / 2;
  const a = t < mitad - 2 ? tw(t, [0, mitad - 2], [0, 1], E.inExpo) : t < mitad + 1 ? 1 : tw(t, [mitad + 1, dur], [1, 0], E.outCubic);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: C.lima, opacity: a }} />
      <LineasVelocidad at={Math.max(0, mitad - 4)} dur={9} color={C.tinta} />
      <Destello at={Math.floor(mitad)} color="#fff" max={0.6} dur={4} />
    </div>
  );
};

const TransPuerta: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useCurrentFrame();
  const mitad = dur / 2;
  const ang = tw(t, [0, mitad - 1], [100, 0], E.outExpo);
  const sube = t > mitad + 1 ? tw(t, [mitad + 1, dur], [0, -2100], E.inExpo) : 0;
  const s = Math.max(1080 / 600, 1920 / 1400);
  return (
    <div style={{ position: 'absolute', inset: 0, perspective: 2400, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 50%', transform: `translateY(${sube}px) rotateY(${-ang}deg)`, background: C.metal, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: (1920 - 1400 * s) / 2, width: 600, height: 1400, transform: `scale(${s})`, transformOrigin: '0 0' }}>
          <Puerta numero="000" />
        </div>
      </div>
    </div>
  );
};

/** Overlay de transición con su sonido (whoosh en el corte). Montar en <Sequence from={corte - dur/2} durationInFrames={dur}>. */
export const Transicion: React.FC<{ tipo: TipoTransicion; dur?: number; volumen?: number; tema?: TemaId }> = ({ tipo, dur = 16, volumen = 0.7, tema = 'clasico' }) => {
  const mitad = Math.round(dur / 2);
  return (
    <>
      {tipo === 'persiana' && (tema === 'plano' ? <TransPersiana dur={dur} color={C.tinta} borde={C.lima} /> : <TransPersiana dur={dur} />)}
      {tipo === 'balon' && <TransBalon dur={dur} />}
      {tipo === 'tinta' && <TransTinta dur={dur} />}
      {tipo === 'arranque' && <TransArranque dur={dur} />}
      {tipo === 'rotativa' && <TransRotativa dur={dur} />}
      {tipo === 'borrador' && <TransBorrador dur={dur} />}
      {tipo === 'cinta' && <TransCinta dur={dur} />}
      {tipo === 'hoja' && <TransHoja dur={dur} />}
      {tipo === 'flash' && <TransFlash dur={dur} />}
      {tipo === 'puerta' && <TransPuerta dur={dur} />}
      <Sfx name={tipo === 'flash' || tipo === 'rotativa' ? 'whoosh_long' : 'whoosh'} at={mitad - 1} volume={volumen} />
      {tipo === 'persiana' && <Sfx name="slap" at={mitad + 1} volume={volumen * 0.7} />}
      {tipo === 'balon' && <Sfx name="patada" at={2} volume={volumen * 0.9} />}
      {tipo === 'balon' && <Sfx name="slap" at={mitad} volume={volumen * 0.9} />}
      {tipo === 'tinta' && <Sfx name="thump" at={mitad} volume={volumen * 0.8} />}
      {tipo === 'arranque' && <Sfx name="paper_slide" at={mitad - 4} volume={volumen * 0.9} />}
      {tipo === 'arranque' && <Sfx name="slap" at={mitad} volume={volumen * 0.8} />}
      {tipo === 'rotativa' && <Sfx name="stamp" at={mitad} volume={volumen * 0.9} />}
      {tipo === 'borrador' && <Sfx name="chalk" at={2} volume={volumen * 0.7} />}
      {tipo === 'borrador' && <Sfx name="swish" at={mitad - 3} volume={volumen * 0.8} />}
      {tipo === 'cinta' && <Sfx name="slap" at={mitad} volume={volumen * 0.7} />}
      {tipo === 'hoja' && <Sfx name="swish" at={mitad - 3} volume={volumen * 0.8} />}
      {tipo === 'flash' && <Sfx name="hit" at={mitad} volume={volumen * 0.8} />}
      {tipo === 'puerta' && <Sfx name="slam" at={mitad} volume={volumen} />}
    </>
  );
};

export const DUR_TRANSICION: Record<TipoTransicion, number> = { cinta: 16, hoja: 12, flash: 12, puerta: 14, persiana: 14, balon: 14, tinta: 14, arranque: 14, rotativa: 16, borrador: 14 };
export { hash };
