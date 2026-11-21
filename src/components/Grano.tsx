import React from 'react';
import { useCurrentFrame } from 'remotion';

/**
 * Grano de papel — regla 7: "Ninguna superficie es un color plano limpio".
 * Capa superior, no interactiva. La semilla cambia cada 3 fotogramas (grano "vivo").
 */
export const Grano: React.FC<{ opacity?: number; width?: number; height?: number }> = ({
  opacity = 0.45,
  width = 1080,
  height = 1920,
}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 3) % 24;
  return (
    <svg
      width={width}
      height={height}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity, mixBlendMode: 'multiply' }}
    >
      <filter id={`grain-${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={seed} stitchTiles="stitch" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.09  0 0 0 0 0.07  0 0 0 0 0.06  1.3 0 0 0 -0.55"
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
    </svg>
  );
};
