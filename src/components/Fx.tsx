import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C } from '../../config/brand';
import { E, hash, tw } from '../lib/ease';
import { useAbs, BEAT } from '../lib/ritmo';
import { useTema } from '../lib/tema';
import { polvoForma } from './PolvoTema';

/* ───────────── Impactos: destello + onda + chispas ───────────── */

/** Pantalla completa en un color que cae rápido (golpe de luz). */
export const Destello: React.FC<{ at: number; color?: string; dur?: number; max?: number }> = ({ at, color = C.lima, dur = 6, max = 0.55 }) => {
  const t = useCurrentFrame() - at;
  if (t < 0 || t > dur) return null;
  return <div style={{ position: 'absolute', inset: 0, background: color, opacity: Math.min(1, max * 1.25 * Math.exp((-t * 3.4) / dur)), mixBlendMode: 'screen', pointerEvents: 'none' }} />;
};

/** Onda de choque: anillo que se expande y se afina. */
export const Onda: React.FC<{ at: number; x: number; y: number; color?: string; r?: number; dur?: number; grosor?: number }> = ({
  at, x, y, color = C.lima, r = 560, dur = 16, grosor = 16,
}) => {
  const t = useCurrentFrame() - at;
  if (t < 0 || t > dur) return null;
  const k = E.outExpo(t / dur);
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
      <circle cx={x} cy={y} r={r * k} fill="none" stroke={color} strokeWidth={Math.max(1, grosor * (1 - t / dur))} opacity={1 - t / dur} />
      <circle cx={x} cy={y} r={r * 0.62 * k} fill="none" stroke={C.tinta} strokeWidth={Math.max(1, grosor * 0.4 * (1 - t / dur))} opacity={0.7 * (1 - t / dur)} />
    </svg>
  );
};

/** Estallido de chispas (rayas) que salen del punto de impacto. */
export const Chispas: React.FC<{ at: number; x: number; y: number; n?: number; dist?: number; colores?: string[]; dur?: number; semilla?: number }> = ({
  at, x, y, n = 16, dist = 300, colores = [C.lima, C.tinta, C.tiza], dur = 14, semilla = 1,
}) => {
  const t = useCurrentFrame() - at;
  if (t < 0 || t > dur) return null;
  const k = E.outExpo(t / dur);
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + (hash(i + semilla) - 0.5) * 0.5;
        const d = dist * (0.55 + 0.45 * hash(i * 3 + semilla));
        const r0 = 30 + d * k * 0.35;
        const r1 = 30 + d * k;
        const largo = (1 - t / dur) * 0.6 + 0.1;
        return (
          <line
            key={i}
            x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0}
            x2={x + Math.cos(a) * (r0 + (r1 - r0) * largo + 6)} y2={y + Math.sin(a) * (r0 + (r1 - r0) * largo + 6)}
            stroke={colores[i % colores.length]} strokeWidth={5 + 6 * hash(i + 9)} strokeLinecap="round" opacity={1 - t / dur}
          />
        );
      })}
    </svg>
  );
};

/** Paquete completo de impacto (el temblor de cámara lo pone CamaraMesa con el mismo frame). */
export const Impacto: React.FC<{ at: number; x?: number; y?: number; color?: string; flash?: number; semilla?: number }> = ({
  at, x = 540, y = 900, color = C.lima, flash = 0.4, semilla = 1,
}) => (
  <>
    <Destello at={at} color={color} max={flash} />
    <Onda at={at} x={x} y={y} color={color} />
    <Chispas at={at} x={x} y={y} semilla={semilla} />
  </>
);

/* ───────────── Ambiente vivo ───────────── */

/**
 * Partículas con parallax (polvo de tiza / confeti de papel). Usa el frame ABSOLUTO: no se reinician al cortar de escena.
 * `dir` -1 sube (polvo), +1 cae (confeti).
 */
export const Particulas: React.FC<{
  tipo?: 'polvo' | 'confeti';
  n?: number;
  semilla?: number;
  colores?: string[];
  dir?: -1 | 1;
  velocidad?: number;
  tam?: number;
  opacidad?: number;
}> = ({ tipo = 'polvo', n = 36, semilla = 1, colores = [C.tiza], dir = -1, velocidad = 0.6, tam = 1, opacidad = 0.5 }) => {
  const abs = useAbs();
  const forma = useTema().polvo; // el tema cambia la forma de la mota (virutas, fibras, cruces…)
  const H = 1920 + 200;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
      {Array.from({ length: n }).map((_, i) => {
        const z = 0.35 + 0.65 * hash(i + semilla * 17); // profundidad
        const x0 = hash(i * 2 + semilla) * 1200 - 60;
        const v = velocidad * (0.4 + 1.1 * z) * 3;
        const yy = ((hash(i * 5 + semilla * 3) * H + dir * abs * v) % H + H) % H - 100;
        const xx = x0 + Math.sin(abs / (28 + 40 * hash(i + 4)) + i) * (18 + 30 * z);
        const c = colores[i % colores.length];
        const s = (tipo === 'polvo' ? 3 : 14) * tam * (0.5 + z);
        if (tipo === 'polvo') {
          const otra = forma !== 'polvo' ? polvoForma(forma, { i, x: xx, y: yy, s, c, o: opacidad * (0.3 + 0.7 * z) * 1.4, rot: abs * (1 + 3 * hash(i + 21)) * (i % 2 ? 1 : -1) }) : null;
          return otra ?? <circle key={i} cx={xx} cy={yy} r={s} fill={c} opacity={opacidad * (0.3 + 0.7 * z)} />;
        }
        const rot = abs * (2 + 6 * hash(i + 11)) * (i % 2 ? 1 : -1);
        if (i % 3 === 0) {
          // parche de balón (pentágono)
          const pts = [0, 1, 2, 3, 4].map((q) => `${Math.cos(-Math.PI / 2 + (q * 2 * Math.PI) / 5) * s * 1.1},${Math.sin(-Math.PI / 2 + (q * 2 * Math.PI) / 5) * s * 1.1}`).join(' ');
          return <polygon key={i} points={pts} fill={c} opacity={opacidad * (0.5 + 0.5 * z)} transform={`translate(${xx} ${yy}) rotate(${rot}) scale(1 ${Math.cos(abs / 9 + i)})`} />;
        }
        return (
          <rect key={i} x={-s} y={-s * 0.6} width={s * 2} height={s * 1.2} fill={c} opacity={opacidad * (0.5 + 0.5 * z)} transform={`translate(${xx} ${yy}) rotate(${rot}) scale(1 ${Math.cos(abs / 9 + i)})`} />
        );
      })}
    </svg>
  );
};

/** Rayos giratorios tipo sunburst en dos tintas, con pulso al beat (fondo de cierre/apertura). */
export const Rayos: React.FC<{ c1?: string; c2?: string; cx?: number; cy?: number; n?: number; vel?: number; opacidad?: number }> = ({
  c1 = C.lima, c2 = 'rgba(22,19,15,0.10)', cx = 540, cy = 760, n = 20, vel = 0.22, opacidad = 1,
}) => {
  const abs = useAbs();
  const ang = (360 / n) * 0.5;
  const pulso = 1 + 0.025 * Math.exp(-(abs % BEAT) / 5);
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: opacidad }}>
      <g transform={`translate(${cx} ${cy}) rotate(${abs * vel}) scale(${pulso})`}>
        {Array.from({ length: n }).map((_, i) => {
          const a0 = (i * 360) / n;
          const R = 2600;
          const p = (a: number) => `${Math.cos((a * Math.PI) / 180) * R},${Math.sin((a * Math.PI) / 180) * R}`;
          return <polygon key={i} points={`0,0 ${p(a0)} ${p(a0 + ang)}`} fill={i % 2 ? c2 : 'transparent'} />;
        })}
      </g>
      <rect width={1080} height={1920} fill={c1} opacity={0} />
    </svg>
  );
};

/** Estática de TV (glitch) — corte breve para el chiste de "la tele". */
export const Estatica: React.FC<{ at: number; dur?: number }> = ({ at, dur = 8 }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t >= dur) return null;
  const fade = t > dur - 3 ? (dur - t) / 3 : 1;
  const barraY = hash(f * 3) * 1700;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.92 * fade, pointerEvents: 'none', background: '#777' }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <filter id={`tv-${f}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.95 0.7" numOctaves={2} seed={f * 7} />
          <feColorMatrix type="matrix" values="0.6 0.6 0.6 0 -0.2  0.6 0.6 0.6 0 -0.2  0.6 0.6 0.6 0 -0.2  0 0 0 0 1" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#tv-${f})`} />
        <rect y={barraY} width="100%" height={60 + 80 * hash(f)} fill="#fff" opacity={0.55} />
        <rect y={barraY + 200} width="100%" height={14} fill="#000" opacity={0.5} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(180deg, rgba(0,0,0,0.28) 0 3px, transparent 3px 7px)' }} />
    </div>
  );
};

/** Líneas de velocidad radiales (manga) para golpes y latigazos. */
export const LineasVelocidad: React.FC<{ at: number; dur?: number; cx?: number; cy?: number; color?: string; n?: number }> = ({
  at, dur = 10, cx = 540, cy = 900, color = C.tinta, n = 34,
}) => {
  const t = useCurrentFrame() - at;
  if (t < 0 || t > dur) return null;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + hash(i) * 0.15;
        const r0 = 420 + 280 * hash(i + 5) - t * 30;
        const r1 = r0 + 520 + 300 * hash(i + 8);
        return <line key={i} x1={cx + Math.cos(a) * r0} y1={cy + Math.sin(a) * r0} x2={cx + Math.cos(a) * r1} y2={cy + Math.sin(a) * r1} stroke={color} strokeWidth={3 + 5 * hash(i + 2)} opacity={0.7 * (1 - t / dur)} strokeLinecap="round" />;
      })}
    </svg>
  );
};

/** Cono de luz de estadio que oscila suavemente desde arriba. */
export const Reflector: React.FC<{ x?: number; color?: string; opacidad?: number; ancho?: number }> = ({ x = 540, color = C.lima, opacidad = 0.22, ancho = 900 }) => {
  const abs = useAbs();
  const sway = Math.sin(abs / 55) * 5;
  return (
    <div
      style={{
        position: 'absolute', left: x - ancho / 2, top: -80, width: ancho, height: 1500,
        transformOrigin: '50% 0%', transform: `rotate(${sway}deg)`,
        background: `linear-gradient(180deg, ${color} 0%, rgba(255,255,255,0) 100%)`,
        clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0 100%)',
        opacity: opacidad * (0.85 + 0.15 * Math.sin(abs / 9)),
        mixBlendMode: 'screen', pointerEvents: 'none',
      }}
    />
  );
};

/* ───────────── Pizarra táctica que se dibuja sola ───────────── */

const trazo = (dash: number) => ({ pathLength: 1, strokeDasharray: `${dash} 2`, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

export const PizarraTactica: React.FC<{ delay?: number; opacidad?: number }> = ({ delay = 0, opacidad = 0.34 }) => {
  const abs = useAbs();
  const f = useCurrentFrame() - delay;
  if (f < 0) return null;
  const p = (a: number, b: number) => tw(f, [a, b], [0, 1], E.outCubic);
  const marcas: { x: number; y: number; t: 'X' | 'O'; a: number }[] = [
    { x: 300, y: 430, t: 'O', a: 14 }, { x: 760, y: 470, t: 'X', a: 18 }, { x: 540, y: 640, t: 'O', a: 22 },
    { x: 360, y: 800, t: 'X', a: 26 }, { x: 700, y: 880, t: 'O', a: 30 }, { x: 520, y: 1200, t: 'X', a: 34 },
    { x: 280, y: 1330, t: 'O', a: 38 }, { x: 800, y: 1380, t: 'X', a: 42 },
  ];
  const deriva = { x: Math.sin(abs / 120) * 14, y: -abs * 0.12, s: 1 + abs * 0.00045 };
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: opacidad, pointerEvents: 'none', overflow: 'visible' }}>
      <g filter="url(#chalk)" stroke={C.tiza} strokeWidth={8} transform={`translate(${deriva.x} ${deriva.y}) rotate(-3 540 960) scale(${deriva.s})`} style={{ transformOrigin: '540px 960px' }}>
        <path d="M120 300 H960 V1640 H120 Z" {...trazo(p(0, 22))} />
        <path d="M120 970 H960" {...trazo(p(6, 22))} />
        <circle cx={540} cy={970} r={170} {...trazo(p(10, 30))} />
        <path d="M330 300 V560 H750 V300" {...trazo(p(12, 30))} />
        <path d="M330 1640 V1380 H750 V1640" {...trazo(p(14, 32))} />
        {marcas.map((m, i) => {
          const k = tw(f, [m.a, m.a + 6], [0, 1], E.outBack2);
          return m.t === 'X' ? (
            <path key={i} d={`M${m.x - 28} ${m.y - 28} L${m.x + 28} ${m.y + 28} M${m.x + 28} ${m.y - 28} L${m.x - 28} ${m.y + 28}`} transform={`translate(${m.x} ${m.y}) scale(${k}) translate(${-m.x} ${-m.y})`} strokeWidth={9} fill="none" strokeLinecap="round" />
          ) : (
            <circle key={i} cx={m.x} cy={m.y} r={30 * k} fill="none" stroke={C.lima} strokeWidth={9} />
          );
        })}
        <path d="M300 460 C380 560 470 590 520 630" {...trazo(p(40, 60))} strokeDasharray={`${p(40, 60) * 0.5} 0.04`} />
        <path d="M760 500 C720 600 640 780 700 860" {...trazo(p(46, 68))} stroke={C.lima} />
        <path d="M520 1180 C540 1100 560 1040 540 980" {...trazo(p(52, 70))} />
      </g>
    </svg>
  );
};

/** Cinta de precaución (franjas lima/tinta) que corre sin parar: para "CONFIDENCIAL", "SECRETO", alertas. */
export const CintaPrecaucion: React.FC<{ y: number; alto?: number; dir?: 1 | -1; vel?: number; rot?: number }> = ({ y, alto = 64, dir = 1, vel = 1.6, rot = -2 }) => {
  const abs = useAbs();
  return (
    <div
      style={{
        position: 'absolute', left: -120, top: y, width: 1320, height: alto, transform: `rotate(${rot}deg)`,
        background: `repeating-linear-gradient(135deg, ${C.lima} 0 34px, ${C.tinta} 34px 68px)`,
        backgroundPosition: `${dir * abs * vel * 3}px 0`, boxShadow: '0 8px 14px -6px rgba(22,19,15,0.5)', pointerEvents: 'none',
      }}
    />
  );
};
