import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

/** Fuentes autoalojadas en assets/fonts (render determinista, sin red). */
const faces = [
  { family: 'League Gothic', url: 'fonts/LeagueGothic-Regular.ttf', weight: '400', style: 'normal' },
  { family: 'Instrument Serif', url: 'fonts/InstrumentSerif-Italic.ttf', weight: '400', style: 'italic' },
  { family: 'Instrument Serif', url: 'fonts/InstrumentSerif-Regular.ttf', weight: '400', style: 'normal' },
  { family: 'Special Elite', url: 'fonts/SpecialElite-Regular.ttf', weight: '400', style: 'normal' },
  { family: 'Permanent Marker', url: 'fonts/PermanentMarker-Regular.ttf', weight: '400', style: 'normal' },
  { family: 'Archivo', url: 'fonts/Archivo-500.ttf', weight: '500', style: 'normal' },
  { family: 'Archivo', url: 'fonts/Archivo-700.ttf', weight: '700', style: 'normal' },
  { family: 'Archivo', url: 'fonts/Archivo-800.ttf', weight: '800', style: 'normal' },
] as const;

export const fontsReady = Promise.all(
  faces.map((f) =>
    loadFont({
      family: f.family,
      url: staticFile(f.url),
      weight: f.weight,
      style: f.style,
    }),
  ),
);
