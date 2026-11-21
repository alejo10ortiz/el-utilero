import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CamaraMesa, Impacto } from '../components/CamaraMesa';
import { Fondo } from '../components/Fondo';
import type { Episode, Escena } from '../lib/episode';
import type { SceneTiming } from '../lib/timeline';

export type EscenaProps = {
  esc: Escena;
  ep: Episode;
  timing: SceneTiming;
  /** Duración de la escena en frames. */
  frames: number;
  width?: number;
  height?: number;
};

/** Mesa de trabajo: fondo + cámara con deriva e impactos. El grano va por encima, a nivel del Short. */
export const Escenario: React.FC<{
  fondo: 'papel' | 'pizarra' | 'lima' | 'tinta';
  impactos?: Impacto[];
  deriva?: number;
  children: React.ReactNode;
}> = ({ fondo, impactos, deriva = 1, children }) => (
  <AbsoluteFill>
    <CamaraMesa impactos={impactos} deriva={deriva}>
      <Fondo tipo={fondo} />
      {children}
    </CamaraMesa>
  </AbsoluteFill>
);
