import { E, tw } from './ease';

/** Empuje lento de cámara durante toda la escena (nada queda congelado). */
export const empuje = (f: number, total: number, cantidad = 0.07, desde = 0) =>
  1 + cantidad * tw(f, [desde, total], [0, 1], E.outCubic);

/** Golpe de zoom en los impactos: salta y vuelve (suma sobre el zoom base). */
export const golpes = (f: number, frames: number[], amp = 0.045, dur = 9) => {
  let z = 0;
  for (const a of frames) {
    const t = f - a;
    if (t >= 0 && t < dur * 3) z += amp * Math.exp(-t / (dur / 2.5));
  }
  return 1 + z;
};
