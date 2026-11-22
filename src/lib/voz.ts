import { FPS } from '../../config/brand';
import type { SceneTiming } from './timeline';

export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();

/**
 * Frame (relativo a la escena) de la primera palabra de la voz que coincide con `patron`, desde el frame `desde`.
 * Si `patron` es texto, coincide cuando la palabra empieza igual (sin tildes ni puntuación; ≥ 3 letras).
 * Así los golpes visuales caen en la palabra que se dice, no en un fotograma fijo. `def` = frame por defecto si no aparece.
 */
export const cuando = (timing: SceneTiming, off: number, patron: RegExp | string, desde = 0, def = -1): number => {
  const w = timing.words.find((x) => {
    const ini = Math.round(x.start * FPS) - off;
    if (ini < desde) return false;
    if (patron instanceof RegExp) return patron.test(x.text);
    const p = norm(patron).slice(0, 3); // 3 letras: «ROBADA» encuentra «robó», «ÚNICO» encuentra «único»
    return p.length >= 3 && norm(x.text).startsWith(p);
  });
  return w ? Math.round(w.start * FPS) - off : def;
};
