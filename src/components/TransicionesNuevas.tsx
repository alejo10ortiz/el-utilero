import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT } from '../../config/brand';
import { E, hash, tw } from '../lib/ease';

/**
 * TRANSICIONES-OBJETO (2.ª tanda). Igual que las originales: overlay de `dur` frames; en t = dur/2 la pantalla
 * está tapada del todo (ahí cae el corte) y en la segunda mitad se destapa. Cada una es un objeto del camerino.
 */

const Contenedor: React.FC<{ children: React.ReactNode; perspectiva?: number }> = ({ children, perspectiva }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', perspective: perspectiva }}>{children}</div>
);

/* ───────────── persiana: listones que giran (kraft / tinta) ───────────── */
export const TransPersiana: React.FC<{ dur: number; color?: string; borde?: string }> = ({ dur, color = C.kraft, borde = C.kraftClaro }) => {
  const t = useCurrentFrame();
  const mitad = dur / 2;
  const n = 8;
  const alto = 1920 / n;
  return (
    <Contenedor perspectiva={2600}>
      {Array.from({ length: n }).map((_, i) => {
        const d = i * 0.9;
        // 90° = de canto (invisible); 0° = plano (tapa)
        const ang = t < mitad ? tw(t, [d, d + mitad - 3], [90, 0], E.outCubic) : tw(t, [mitad + d - 1, mitad + d + mitad - 3], [0, -90], E.inOutCubic);
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: -20, width: 1120, top: i * alto - 1, height: alto + 2,
              transform: `rotateX(${ang}deg)`, transformOrigin: '50% 50%', backfaceVisibility: 'hidden',
              background: color, boxShadow: `inset 0 14px 0 ${borde}, inset 0 -12px 0 rgba(22,19,15,0.35)`,
            }}
          >
            <div style={{ position: 'absolute', left: 140, top: 0, bottom: 0, width: 6, background: 'rgba(22,19,15,0.35)' }} />
            <div style={{ position: 'absolute', left: 930, top: 0, bottom: 0, width: 6, background: 'rgba(22,19,15,0.35)' }} />
          </div>
        );
      })}
    </Contenedor>
  );
};

/* ───────────── balón: remate a cámara ───────────── */
const Balon: React.FC<{ r: number }> = ({ r }) => {
  const p = (k: number, rad: number) => `${Math.cos(-Math.PI / 2 + (k * 2 * Math.PI) / 5) * rad},${Math.sin(-Math.PI / 2 + (k * 2 * Math.PI) / 5) * rad}`;
  const centro = [0, 1, 2, 3, 4].map((k) => p(k, r * 0.34)).join(' ');
  return (
    <svg width={r * 2} height={r * 2} viewBox={`${-r} ${-r} ${r * 2} ${r * 2}`} style={{ overflow: 'visible' }}>
      <circle r={r} fill={C.papel} stroke={C.tinta} strokeWidth={r * 0.045} />
      <polygon points={centro} fill={C.tinta} />
      {[0, 1, 2, 3, 4].map((k) => {
        const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
        return (
          <g key={k}>
            <path d={`M${Math.cos(a) * r * 0.34} ${Math.sin(a) * r * 0.34} L${Math.cos(a) * r * 0.62} ${Math.sin(a) * r * 0.62}`} stroke={C.tinta} strokeWidth={r * 0.04} />
            <polygon
              points={[-0.5, -0.25, 0, 0.25, 0.5].map((q) => `${Math.cos(a + q * 0.8) * r * (Math.abs(q) > 0.3 ? 0.98 : 0.78)},${Math.sin(a + q * 0.8) * r * (Math.abs(q) > 0.3 ? 0.98 : 0.78)}`).join(' ')}
              fill={C.tinta}
              opacity={0.92}
            />
          </g>
        );
      })}
    </svg>
  );
};

export const TransBalon: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useCurrentFrame();
  const mitad = dur / 2;
  // primera mitad: sale de abajo a la derecha y se te viene encima; segunda: rebota hacia arriba y se va
  const esc = t < mitad ? tw(t, [0, mitad - 1], [0.18, 13], E.inExpo) : 13;
  const cx = t < mitad ? tw(t, [0, mitad - 1], [860, 540], E.outCubic) : 540;
  const cy = t < mitad ? tw(t, [0, mitad - 1], [1700, 960], E.outCubic) : tw(t, [mitad, dur], [960, -2700], E.inExpo);
  const rot = t < mitad ? tw(t, [0, mitad], [-60, 140], E.outCubic) : tw(t, [mitad, dur], [140, 260], E.inExpo);
  const sombra = t < mitad ? tw(t, [0, mitad], [0, 0.35], E.outCubic) : 0;
  return (
    <Contenedor>
      <div style={{ position: 'absolute', inset: 0, background: C.tinta, opacity: sombra }} />
      <div style={{ position: 'absolute', left: cx, top: cy, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${esc})`, transformOrigin: '50% 50%' }}>
        <Balon r={100} />
      </div>
    </Contenedor>
  );
};

/* ───────────── tinta: derrame que sube y deja goteras ───────────── */
export const TransTinta: React.FC<{ dur: number; color?: string; salpicadura?: string }> = ({ dur, color = C.tinta, salpicadura = C.lima }) => {
  const t = useCurrentFrame();
  const mitad = dur / 2;
  const manchas = Array.from({ length: 9 }).map((_, i) => ({
    x: 120 + hash(i * 3 + 1) * 840, y: 280 + hash(i * 5 + 2) * 1360, max: 520 + hash(i + 7) * 520, d: hash(i + 4) * 2.4,
  }));
  const sube = t < mitad ? 0 : tw(t, [mitad, dur], [0, -2350], E.inOutCubic);
  const gotas = Array.from({ length: 13 }).map((_, i) => ({ x: 30 + i * 85 + hash(i) * 30, l: 90 + hash(i * 9) * 230, w: 34 + hash(i * 7) * 34 }));
  return (
    <Contenedor>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <filter id="tr-tinta" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed={5} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={90} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g transform={`translate(0 ${sube})`}>
          {t < mitad + 1 ? (
            <g filter="url(#tr-tinta)" fill={color}>
              {manchas.map((m, i) => (
                <circle key={i} cx={m.x} cy={m.y} r={tw(t, [m.d, mitad - 1], [0, m.max], E.outExpo)} />
              ))}
            </g>
          ) : null}
          {t >= mitad - 1 && (
            <g fill={color}>
              <rect x={-60} y={-200} width={1200} height={2200} />
              {gotas.map((g, i) => (
                <g key={i}>
                  <rect x={g.x} y={1960} width={g.w} height={g.l} />
                  <circle cx={g.x + g.w / 2} cy={1960 + g.l} r={g.w / 2} />
                </g>
              ))}
            </g>
          )}
          {/* salpicaduras */}
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx={hash(i * 4 + 3) * 1080} cy={hash(i * 6 + 8) * 1920} r={6 + hash(i) * 16} fill={salpicadura} opacity={t >= mitad - 3 && t < mitad + 4 ? 0.95 : 0} />
          ))}
        </g>
      </svg>
    </Contenedor>
  );
};

/* ───────────── arranque: hoja de cuaderno que cae encima y se arranca ───────────── */
export const TransArranque: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useCurrentFrame();
  const mitad = dur / 2;
  const rot = t < mitad ? tw(t, [0, mitad - 1], [-102, 0], E.outBack) : tw(t, [mitad, dur], [0, 38], E.inExpo);
  const caer = t < mitad ? 0 : tw(t, [mitad, dur], [0, 2500], E.inExpo);
  const agujeros = Array.from({ length: 12 }).map((_, i) => 60 + i * 90);
  return (
    <Contenedor perspectiva={3000}>
      <div
        style={{
          position: 'absolute', left: -30, top: -30, width: 1140, height: 1980, background: C.cuaderno,
          transformOrigin: '0 0', transform: `translateY(${caer}px) rotate(${rot}deg)`,
          boxShadow: '0 30px 60px rgba(22,19,15,0.5)',
          backgroundImage: `repeating-linear-gradient(0deg, transparent 0 55px, ${C.lineaCuaderno} 55px 57px), repeating-linear-gradient(90deg, transparent 0 55px, ${C.lineaCuaderno} 55px 57px)`,
          backgroundPosition: '0 30px',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: C.cuaderno, opacity: 0.22 }} />
        {/* perforación del arranque */}
        {agujeros.map((x, i) => (
          <div key={i} style={{ position: 'absolute', left: x, top: 22, width: 30, height: 30, borderRadius: 30, background: C.tinta, opacity: 0.55 }} />
        ))}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 78, background: `repeating-linear-gradient(90deg, rgba(22,19,15,0.07) 0 12px, transparent 12px 24px)` }} />
        <div style={{ position: 'absolute', left: 170, top: 0, bottom: 0, width: 4, background: C.lineaCuaderno, opacity: 0.8 }} />
      </div>
    </Contenedor>
  );
};

/* ───────────── rotativa: la plancha gira y se clava con «EXTRA» ───────────── */
export const TransRotativa: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useCurrentFrame();
  const mitad = dur / 2;
  const esc = t < mitad ? tw(t, [0, mitad - 1], [0.02, 1.45], E.outCubic) : tw(t, [mitad, dur], [1.45, 0.02], E.inExpo);
  const rot = t < mitad ? tw(t, [0, mitad - 1], [-720, -6], E.outCubic) : tw(t, [mitad, dur], [-6, 540], E.inExpo);
  const stamp = tw(t, [mitad - 4, mitad], [1.8, 1], E.outBack);
  return (
    <Contenedor>
      <div style={{ position: 'absolute', left: 540, top: 960, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${esc})`, transformOrigin: '50% 50%' }}>
        <div style={{ width: 1180, height: 1700, background: C.diario, boxShadow: '0 0 60px rgba(22,19,15,0.55)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${C.tintaDiario} 1.6px, transparent 1.9px)`, backgroundSize: '14px 14px', opacity: 0.22 }} />
          {/* titular de portada: barras, no texto */}
          <div style={{ position: 'absolute', left: 60, right: 60, top: 70, height: 16, background: C.tintaDiario, opacity: 0.7 }} />
          <div style={{ position: 'absolute', left: 60, right: 60, top: 100, height: 6, background: C.tintaDiario, opacity: 0.6 }} />
          {[0, 1, 2, 3].map((c) => (
            <div key={c} style={{ position: 'absolute', left: 60 + c * 275, top: 760, width: 255, height: 840, backgroundImage: `repeating-linear-gradient(180deg, ${C.tintaDiario} 0 8px, transparent 8px 24px)`, opacity: 0.32 }} />
          ))}
          <div style={{ position: 'absolute', left: 60, right: 60, top: 330, height: 280, background: C.tintaDiario, opacity: 0.2 }} />
          <div
            style={{
              position: 'absolute', left: 330, top: 640, transform: `rotate(-9deg) scale(${stamp})`, opacity: t > mitad - 5 ? 0.92 : 0,
              fontFamily: FONT.grito, fontSize: 210, letterSpacing: '0.06em', color: C.sello, border: `13px solid ${C.sello}`, padding: '0 34px', lineHeight: 1.05, whiteSpace: 'nowrap',
            }}
          >
            EXTRA
          </div>
        </div>
      </div>
    </Contenedor>
  );
};

/* ───────────── borrador: el borrador barre la pizarra en franjas ───────────── */
export const TransBorrador: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useCurrentFrame();
  const mitad = dur / 2;
  const n = 5;
  const alto = 1920 / n;
  return (
    <Contenedor>
      {Array.from({ length: n }).map((_, i) => {
        const dir = i % 2 ? -1 : 1;
        const d = i * 0.8;
        // x del borde de ataque (cubre) y del borde de salida (descubre), medidos desde el lado de entrada
        const lead = tw(t, [d, d + mitad - 2], [-120, 1260], E.outCubic);
        const trail = t < mitad ? -120 : tw(t, [mitad + d - 1, mitad + d + mitad - 3], [-120, 1260], E.inOutCubic);
        const x0 = dir > 0 ? trail : 1080 - lead;
        const ancho = Math.max(0, lead - trail);
        const bordeX = dir > 0 ? lead : 1080 - lead;
        const enBarrido = t < mitad + d - 1;
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: x0, width: ancho, top: i * alto - 1, height: alto + 2, background: C.pizarra }}>
              {[0.2, 0.46, 0.7].map((q, k) => (
                <div key={k} style={{ position: 'absolute', left: 0, right: 0, top: alto * q, height: 6 + k * 2, background: C.tiza, opacity: 0.07 }} />
              ))}
            </div>
            {enBarrido && lead > -100 && lead < 1250 && (
              <>
                <div
                  style={{
                    position: 'absolute', left: bordeX - (dir > 0 ? 300 : 0), top: i * alto + alto * 0.32, width: 300, height: alto * 0.36,
                    transform: `rotate(${dir * -2.5}deg)`, background: C.kraftOscuro, borderTop: `${alto * 0.1}px solid ${C.tinta}`, boxShadow: '0 10px 18px rgba(0,0,0,0.5)',
                  }}
                />
                {[0, 1, 2, 3, 4].map((k) => (
                  <div key={k} style={{ position: 'absolute', left: bordeX + dir * (40 + k * 30) + hash(i * 9 + k) * 40, top: i * alto + alto * (0.15 + hash(i + k) * 0.6), width: 70 + k * 10, height: 70 + k * 10, borderRadius: 90, background: C.tiza, opacity: 0.18 }} />
                ))}
              </>
            )}
          </React.Fragment>
        );
      })}
    </Contenedor>
  );
};
