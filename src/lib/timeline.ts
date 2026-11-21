import { FPS } from '../../config/brand';
import type { Episode } from './episode';

/** Segundos absolutos desde el inicio del video. */
export type WordTiming = { text: string; start: number; end: number };

export type SceneTiming = {
  index: number;
  tipo: string;
  start: number;
  end: number;
  /** Palabras con tiempo absoluto. Vacío si la escena no tiene voz. */
  words: WordTiming[];
};

export type Timeline = {
  source: 'estimado' | 'elevenlabs';
  totalSeconds: number;
  scenes: SceneTiming[];
};

/** Reglas de ritmo: pausado, casi susurro (§1). */
const PRE_LEAD = 0.15;
const TAIL_DEFAULT = 0.4;
const TAIL_CIERRE = 1.5; // portazo + pitazo
const STING_SECONDS = 2.0; // §5.3
const MIN_SCENE = 1.2;

const pauseAfter = (w: string) => {
  if (/[…]|\.{3}$/.test(w)) return 0.45;
  if (/[.!?¡¿]$/.test(w)) return 0.35;
  if (/[,;:]$/.test(w)) return 0.18;
  return 0;
};

export const tokenize = (voz: string) => voz.trim().split(/\s+/).filter(Boolean);

/** Estimación de voz de utilero viejo: ~2.3 palabras/seg + pausas. */
export function estimateWords(voz: string, startAt: number): { words: WordTiming[]; end: number } {
  let t = startAt;
  const words: WordTiming[] = [];
  for (const raw of tokenize(voz)) {
    const letters = raw.replace(/[^\p{L}\p{N}]/gu, '').length;
    const dur = 0.13 + letters * 0.046;
    words.push({ text: raw, start: t, end: t + dur });
    t += dur + 0.02 + pauseAfter(raw);
  }
  return { words, end: t };
}

export function estimateTimeline(ep: Episode): Timeline {
  let cursor = 0;
  const scenes: SceneTiming[] = [];
  ep.escenas.forEach((esc, index) => {
    const start = cursor;
    let end: number;
    let words: WordTiming[] = [];
    if (esc.voz) {
      const est = estimateWords(esc.voz, start + PRE_LEAD);
      words = est.words;
      end = est.end + (esc.tipo === 'cierre' ? TAIL_CIERRE : TAIL_DEFAULT);
    } else {
      end = start + (esc.tipo === 'sting' ? STING_SECONDS : MIN_SCENE);
    }
    end = Math.max(end, start + MIN_SCENE);
    scenes.push({ index, tipo: esc.tipo, start, end, words });
    cursor = end;
  });
  return { source: 'estimado', totalSeconds: cursor, scenes };
}

export const toFrames = (seconds: number) => Math.round(seconds * FPS);

export const timelineFrames = (tl: Timeline) => Math.max(1, toFrames(tl.totalSeconds));

export { PRE_LEAD, TAIL_DEFAULT, TAIL_CIERRE, STING_SECONDS, MIN_SCENE };
