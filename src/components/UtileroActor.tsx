import React from 'react';
import { useCurrentFrame } from 'remotion';
import { FPS } from '../../config/brand';
import { E, hash, tw } from '../lib/ease';
import { BEAT, useAbs } from '../lib/ritmo';
import type { WordTiming } from '../lib/timeline';
import { Utilero, UtileroProps } from './Utilero';

/** Energía 0..1 del habla: salta en cada palabra (más en las largas) y decae rápido. */
export const energiaHabla = (t: number, words: WordTiming[]) => {
  let e = 0;
  words.forEach((w, i) => {
    const d = t - w.start;
    if (d >= 0 && d < 0.5) e += Math.exp(-d / 0.11) * (0.55 + Math.min(0.45, (w.end - w.start) * 1.4)) * (i % 2 ? 0.9 : 1);
  });
  return Math.min(1, e);
};

/**
 * El Utilero ACTUADO: entra con salto (squash & stretch + rebote), respira con la música,
 * y con cada palabra hace un golpe de cabeza/cuerpo. Nada de busto de cartón.
 * `entrada` = frame (de la escena) en que salta a cuadro; antes de eso no se ve.
 */
export const UtileroActor: React.FC<
  UtileroProps & { entrada?: number; desde?: 'abajo' | 'izquierda' | 'derecha' | 'zoom'; intensidad?: number }
> = ({ entrada = 0, desde = 'abajo', intensidad = 1, words, offsetFrames = 0, size = 600, x = 0, y = 0, ...resto }) => {
  const frame = useCurrentFrame();
  const abs = useAbs();
  const t = (frame + offsetFrames) / FPS;
  const f = frame - entrada;
  if (f < 0) return null;

  // — entrada: sube con estiramiento, aterriza aplastado, rebota y se asienta
  const subida = tw(f, [0, 8], [1, 0], E.outExpo);
  const squash = f < 8 ? 1 + 0.22 * subida : f < 14 ? 1 - 0.14 * Math.sin(((f - 8) / 6) * Math.PI) : 1 + 0.025 * Math.exp(-(f - 14) / 6) * Math.sin((f - 14) * 0.9);
  const sx = 1 / Math.sqrt(squash);
  const dyEntrada = desde === 'abajo' ? subida * size * 0.9 : 0;
  const dxEntrada = desde === 'izquierda' ? -subida * size * 1.1 : desde === 'derecha' ? subida * size * 1.1 : 0;
  const zoom = desde === 'zoom' ? 1 + subida * 0.7 : 1;

  // — vida: golpe por palabra + pulso del bombo + vaivén
  const e = words ? energiaHabla(t, words) * intensidad : 0;
  const beat = Math.exp(-(abs % BEAT) / 5) * 0.012 * intensidad;
  const kY = 1 + 0.045 * e + beat;
  const kX = 1 - 0.022 * e - beat * 0.5;
  const bob = -9 * e;
  const rot = Math.sin(abs / 17) * 0.7 + (hash(Math.floor(t * 4)) - 0.5) * 2.4 * e;

  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: size, height: size,
        transformOrigin: '50% 100%',
        transform: `translate(${dxEntrada}px, ${dyEntrada + bob}px) scale(${sx * kX * zoom}, ${squash * kY * zoom}) rotate(${rot}deg)`,
        filter: f < 6 ? `blur(${(6 - f) * 1.4}px)` : undefined,
      }}
    >
      <Utilero {...resto} words={words} offsetFrames={offsetFrames} size={size} x={0} y={0} />
    </div>
  );
};
