import React from 'react';
import { Audio, staticFile } from 'remotion';
import { FPS } from '../../config/brand';
import type { WordTiming } from '../lib/timeline';

/**
 * Cama musical con ducking: baja cuando habla el Utilero, sube en los huecos y en el arranque/cierre.
 * `palabras` en segundos absolutos del video. La pista está alineada a 100 BPM desde el fotograma 0.
 */
export const Musica: React.FC<{
  archivo: string;
  palabras: WordTiming[];
  totalFrames: number;
  /** Volumen bajo la voz / en los huecos / al arrancar. */
  bajoVoz?: number;
  huecos?: number;
  arranque?: number;
}> = ({ archivo, palabras, totalFrames, bajoVoz = 0.2, huecos = 0.5, arranque = 0.85 }) => {
  const volumen = (f: number) => {
    const t = f / FPS;
    // distancia al habla más cercana
    let d = 9;
    for (const w of palabras) {
      const dd = t < w.start ? w.start - t : t > w.end ? t - w.end : 0;
      if (dd < d) d = dd;
      if (d === 0) break;
    }
    const abierto = Math.min(1, Math.max(0, (d - 0.12) / 0.5)); // 0 hablando → 1 en silencio largo
    let v = bajoVoz + (huecos - bajoVoz) * abierto * abierto;
    // arranque: la pista entra a toda para el golpe inicial y se acomoda bajo la voz en ~1.2 s
    if (t < 1.4) v = Math.max(v, bajoVoz + (arranque - bajoVoz) * Math.max(0, 1 - t / 1.4));
    // cierre: sube un poco y se apaga en los últimos 0.6 s
    const resta = (totalFrames - f) / FPS;
    if (resta < 0.6) v *= Math.max(0, resta / 0.6);
    return v;
  };
  return <Audio src={staticFile(`music/${archivo}`)} volume={volumen} />;
};
