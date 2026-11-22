import React from 'react';
import { useCurrentFrame } from 'remotion';

export type Impacto = { frame: number; amp: number };

/** Cámara de mesa (§5.1-4): deriva ±6px / ±0.4° + temblor en impactos (sello 3px, portazo 6px). */
export const CamaraMesa: React.FC<{
  children: React.ReactNode;
  impactos?: Impacto[];
  deriva?: number;
  /** Zoom de cámara multiplicador (1 = sin zoom) y paneo en px: para empujes, golpes de zoom y seguimientos. */
  zoom?: number;
  panX?: number;
  panY?: number;
}> = ({ children, impactos = [], deriva = 1, zoom = 1, panX = 0, panY = 0 }) => {
  const f = useCurrentFrame();
  let dx = deriva * 6 * (0.6 * Math.sin(f * 0.045) + 0.4 * Math.sin(f * 0.113 + 1.3));
  let dy = deriva * 6 * (0.55 * Math.sin(f * 0.037 + 0.7) + 0.45 * Math.sin(f * 0.097 + 2.1));
  let rot = deriva * 0.4 * (0.6 * Math.sin(f * 0.031 + 0.2) + 0.4 * Math.sin(f * 0.083));
  for (const i of impactos) {
    const t = f - i.frame;
    if (t < 0 || t > 14) continue;
    const decay = Math.exp(-t / 3.5);
    dx += i.amp * decay * Math.cos(t * 2.6);
    dy += i.amp * decay * Math.sin(t * 3.1 + 0.8);
    rot += (i.amp / 14) * decay * Math.cos(t * 2.2);
  }
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translate(${dx + panX}px, ${dy + panY}px) rotate(${rot}deg) scale(${1.02 * zoom})`,
        transformOrigin: '50% 50%',
      }}
    >
      {children}
    </div>
  );
};
