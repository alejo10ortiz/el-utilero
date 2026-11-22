import { Easing, interpolate } from 'remotion';

/** Easings de motion design (curvas Bézier). Nada de lineal. */
export const E = {
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  outBack: Easing.bezier(0.34, 1.56, 0.64, 1),
  outBack2: Easing.bezier(0.22, 1.9, 0.5, 1), // rebote más marcado
  inExpo: Easing.bezier(0.7, 0, 0.84, 0),
  inOutCubic: Easing.bezier(0.65, 0, 0.35, 1),
  inOutExpo: Easing.bezier(0.87, 0, 0.13, 1),
  outCubic: Easing.bezier(0.33, 1, 0.68, 1),
};

type Ease = (t: number) => number;

/** Interpolación con easing entre frames: tw(f, [a,b], [from,to], E.outExpo). Sujeta fuera de rango. */
export const tw = (f: number, rango: [number, number], valores: [number, number], ease: Ease = E.outExpo) =>
  interpolate(f, rango, valores, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

/**
 * SLAM: entrada de impacto con anticipación → el elemento llega grande y desenfocado, se clava con rebote.
 * t=frame−inicio. Devuelve escala, opacidad, blur(px), desplazamiento y.
 */
export const slam = (f: number, inicio: number, grande = 2.4) => {
  const t = f - inicio;
  if (t < 0) return { visible: false, scale: 0, opacity: 0, blur: 0, y: 0, rot: 0 };
  const fase1 = tw(t, [0, 4], [grande, 0.92], E.outExpo);
  const fase2 = t < 4 ? 0 : tw(t, [4, 10], [0, 1], E.outBack);
  const scale = t < 4 ? fase1 : 0.92 + 0.08 * fase2;
  return {
    visible: true,
    scale,
    opacity: tw(t, [0, 2], [0, 1], E.outCubic),
    blur: tw(t, [0, 5], [16, 0], E.outCubic),
    y: tw(t, [0, 5], [-30, 0], E.outExpo),
    rot: 0,
  };
};

/** POP con rebote elástico (palabras, sellos, iconos). */
export const pop = (f: number, inicio: number, dur = 9) => {
  const t = f - inicio;
  if (t < 0) return 0;
  return tw(t, [0, dur], [0, 1], E.outBack2);
};

/** Aleatorio determinista por entero. */
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Temblor "line boil": cambia a 12 fps, da vida de dibujo a mano a elementos quietos. */
export const boil = (f: number, semilla = 1, amp = 1.2, fps = 12) => {
  const k = Math.floor((f * fps) / 30);
  return { x: (hash(k * 3 + semilla) - 0.5) * 2 * amp, y: (hash(k * 5 + semilla + 9) - 0.5) * 2 * amp, r: (hash(k * 7 + semilla + 3) - 0.5) * amp * 0.5 };
};

/** Respiración lenta (1 ± amp) para que nada quede congelado. */
export const respira = (f: number, amp = 0.012, periodo = 90, fase = 0) => 1 + amp * Math.sin(((f + fase) / periodo) * Math.PI * 2);
