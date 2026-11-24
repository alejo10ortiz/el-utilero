import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { FPS } from '../../config/brand';
import type { WordTiming } from '../lib/timeline';

export type SegmentoMusica = { desde: number; hasta: number; archivo: string };

const FUNDIDO = 24; // frames de solape entre camas (0,8 s)

/**
 * Música de los videos largos: varias camas de 60 s (100 BPM, compás exacto) que se REPITEN en bucle dentro de cada
 * tramo y se funden entre sí al cambiar de capítulo. Baja bajo la voz y sube en los silencios, igual que `Musica`.
 */
export const MusicaLarga: React.FC<{ segmentos: SegmentoMusica[]; palabras: WordTiming[]; totalFrames: number; bajoVoz?: number; huecos?: number }> = ({
  segmentos, palabras, totalFrames, bajoVoz = 0.2, huecos = 0.5,
}) => {
  const base = (f: number) => {
    const t = f / FPS;
    let d = 9;
    for (const w of palabras) {
      const dd = t < w.start ? w.start - t : t > w.end ? t - w.end : 0;
      if (dd < d) d = dd;
      if (d === 0) break;
    }
    const abierto = Math.min(1, Math.max(0, (d - 0.12) / 0.5));
    let v = bajoVoz + (huecos - bajoVoz) * abierto * abierto;
    if (t < 1.4) v = Math.max(v, bajoVoz + (0.85 - bajoVoz) * Math.max(0, 1 - t / 1.4)); // arranque
    const resta = (totalFrames - f) / FPS;
    if (resta < 1.2) v *= Math.max(0, resta / 1.2); // cierre
    return v;
  };
  return (
    <>
      {segmentos.map((s, i) => {
        const dur = s.hasta - s.desde + (i < segmentos.length - 1 ? FUNDIDO : 0);
        return (
          <Sequence key={i} from={s.desde} durationInFrames={dur} name={`música ${s.archivo}`}>
            <Audio
              src={staticFile(`music/${s.archivo}`)}
              loop
              volume={(fl) => {
                const entra = i === 0 ? 1 : Math.min(1, fl / FUNDIDO);
                const sale = i === segmentos.length - 1 ? 1 : Math.min(1, Math.max(0, (dur - fl) / FUNDIDO));
                return base(s.desde + fl) * entra * sale;
              }}
            />
          </Sequence>
        );
      })}
    </>
  );
};
