import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { FPS } from '../../config/brand';
import tiempos from '../../assets/sfx/_timing.json';

export type SfxName =
  | 'keys' | 'lock' | 'creak' | 'slam' | 'whistle' | 'stamp' | 'tape' | 'type_loop' | 'ding'
  | 'chalk' | 'marker' | 'paper_slide' | 'thump' | 'wink' | 'key_drop'
  | 'whoosh' | 'whoosh_long' | 'impact' | 'hit' | 'riser' | 'pop' | 'static' | 'slap' | 'clap' | 'swish'
  | 'patada' | 'hinchada' | 'sello';

const T = tiempos as Record<string, { dur: number; pico: number }>;

/**
 * Efecto de sonido anclado a un fotograma (relativo a la escena/secuencia padre).
 * Por defecto el GOLPE del sonido (su pico) cae en `at`, no el inicio del archivo: así un riser de 2.4 s
 * "llega" al fotograma indicado y una cinta que se pega suena justo cuando se ve pegar.
 * `alinear="inicio"` lo ancla al principio del archivo.
 */
export const Sfx: React.FC<{
  name: SfxName;
  at?: number;
  volume?: number;
  loopFor?: number;
  alinear?: 'pico' | 'inicio';
  rate?: number;
}> = ({ name, at = 0, volume = 0.9, loopFor, alinear = 'pico', rate = 1 }) => {
  const pico = alinear === 'pico' && loopFor === undefined ? Math.round(((T[name]?.pico ?? 0) * FPS) / rate) : 0;
  const inicio = at - pico;
  const desde = Math.max(0, inicio);
  const recorte = Math.max(0, -inicio); // si el sonido tendría que haber empezado antes de la escena
  const dur = Math.ceil(((T[name]?.dur ?? 1) * FPS) / rate) + 2;
  return (
    <Sequence from={desde} durationInFrames={loopFor ?? Math.max(1, dur - recorte)} layout="none">
      <Audio src={staticFile(`sfx/sfx_${name}.wav`)} volume={volume * 0.8} loop={loopFor !== undefined} startFrom={recorte} playbackRate={rate} />
    </Sequence>
  );
};
