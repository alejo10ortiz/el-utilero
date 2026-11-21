import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';

export type SfxName =
  | 'keys' | 'lock' | 'creak' | 'slam' | 'whistle' | 'stamp' | 'tape' | 'type_loop' | 'ding'
  | 'chalk' | 'marker' | 'paper_slide' | 'thump' | 'wink' | 'key_drop';

/**
 * Efecto de sonido anclado a un fotograma (relativo a la escena/secuencia padre).
 * Archivos en assets/sfx/sfx_<name>.wav (§5.6).
 */
export const Sfx: React.FC<{
  name: SfxName;
  at?: number;
  volume?: number;
  loopFor?: number;
}> = ({ name, at = 0, volume = 0.9, loopFor }) => (
  <Sequence from={at} durationInFrames={loopFor ?? 90} layout="none">
    <Audio src={staticFile(`sfx/sfx_${name}.wav`)} volume={volume} loop={loopFor !== undefined} />
  </Sequence>
);
