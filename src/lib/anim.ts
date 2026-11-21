import { spring, interpolate, Easing } from 'remotion';
import { FPS } from '../../config/brand';

/** Entrada con golpe: rebote corto (overshoot ~6-10 %) — §5.1-2. Devuelve 0 → ~1.08 → 1. */
export const hit = (frame: number, delay: number, dur = 6) =>
  spring({
    frame: frame - delay,
    fps: FPS,
    durationInFrames: dur + 6,
    config: { damping: 11, stiffness: 240, mass: 0.55, overshootClamping: false },
  });

/** Progreso lineal 0..1 con easing de salida. */
export const prog = (frame: number, delay: number, dur: number, ease = Easing.out(Easing.cubic)) =>
  interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

/** Aleatorio determinista (mulberry32) para trazos "a mano" repetibles. */
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export type Pt = { x: number; y: number };

export const pointsToPath = (pts: Pt[]) =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

/** Elipse dibujada a mano: termina pasada del inicio (A07). */
export const ellipsePoints = (
  cx: number, cy: number, rx: number, ry: number,
  opts: { seed?: number; overshoot?: number; wobble?: number; start?: number; n?: number } = {},
): Pt[] => {
  const { seed = 5, overshoot = 0.12, wobble = 0.05, start = -2.4, n = 90 } = opts;
  const r = rng(seed);
  const turns = 1 + overshoot;
  const out: Pt[] = [];
  const phase = r() * 6;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = start + t * Math.PI * 2 * turns;
    // la segunda vuelta se abre un poco hacia afuera, como un trazo real
    const drift = 1 + wobble * Math.sin(a * 2 + phase) + (t > 1 / turns ? 0.05 * (t - 1 / turns) * 8 : 0) - 0.04 * (1 - t);
    out.push({ x: cx + Math.cos(a) * rx * drift, y: cy + Math.sin(a) * ry * drift });
  }
  return out;
};

/** Línea con temblor leve. */
export const linePoints = (x1: number, y1: number, x2: number, y2: number, opts: { seed?: number; wobble?: number; n?: number } = {}): Pt[] => {
  const { seed = 3, wobble = 4, n = 24 } = opts;
  const r = rng(seed);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const w = (r() - 0.5) * wobble * Math.sin(Math.PI * t);
    out.push({ x: x1 + dx * t + nx * w, y: y1 + dy * t + ny * w });
  }
  return out;
};

/** Flecha: cuerpo curvo + cabeza en dos trazos continuos. */
export const arrowPoints = (x1: number, y1: number, x2: number, y2: number, bend = 0.18, head = 38): Pt[] => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  const body: Pt[] = [];
  const n = 28;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = (1 - t) * (1 - t);
    const b = 2 * (1 - t) * t;
    const c = t * t;
    body.push({ x: a * x1 + b * cx + c * x2, y: a * y1 + b * cy + c * y2 });
  }
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const h1 = { x: x2 - Math.cos(ang - 0.5) * head, y: y2 - Math.sin(ang - 0.5) * head };
  const h2 = { x: x2 - Math.cos(ang + 0.5) * head, y: y2 - Math.sin(ang + 0.5) * head };
  return [...body, h1, { x: x2, y: y2 }, h2];
};
