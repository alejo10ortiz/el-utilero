import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { boil } from '../lib/ease';
import { useTema } from '../lib/tema';
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
  zoom?: number;
  panX?: number;
  panY?: number;
  children: React.ReactNode;
}> = ({ fondo, impactos, deriva = 1, zoom, panX, panY, children }) => {
  const tema = useTema();
  const f = useCurrentFrame();
  // «Temblor de dibujo»: toda la mesa se mueve a 12 fps (hecho a mano) en los temas que lo piden.
  const b = tema.temblor ? boil(f, 3, tema.temblor) : null;
  return (
    <AbsoluteFill>
      <CamaraMesa impactos={impactos} deriva={deriva} zoom={zoom} panX={panX} panY={panY}>
        <div style={{ position: 'absolute', inset: 0, transform: b ? `translate(${b.x}px, ${b.y}px) rotate(${b.r * 0.12}deg)` : undefined }}>
          <Fondo tipo={fondo} />
          {children}
        </div>
      </CamaraMesa>
    </AbsoluteFill>
  );
};
