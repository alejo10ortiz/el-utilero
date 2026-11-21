import React from 'react';
import { useCurrentFrame } from 'remotion';
import { A, C } from '../../config/brand';
import { Pt, pointsToPath, prog, rng, ellipsePoints, linePoints, arrowPoints } from '../lib/anim';
import { Sfx } from './Sfx';

/** Un trazo dibujado progresivamente (base de Tiza y Marcador). Coordenadas absolutas del lienzo. */
const Trazo: React.FC<{
  points: Pt[];
  color: string;
  width: number;
  delay: number;
  dur: number;
  filter?: string;
  particulas?: boolean;
  sfx: 'chalk' | 'marker' | null;
  opacity?: number;
  canvas?: { w: number; h: number };
}> = ({ points, color, width, delay, dur, filter, particulas, sfx, opacity = 1, canvas = { w: 1080, h: 1920 } }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, delay, dur);
  const d = pointsToPath(points);
  const head = points[Math.min(points.length - 1, Math.floor(p * (points.length - 1)))];
  const dust: { x: number; y: number; r: number; o: number }[] = [];
  if (particulas && p > 0 && p < 1) {
    const r = rng(frame * 13 + 7);
    for (let i = 0; i < 7; i++) {
      const age = r() * 8;
      dust.push({
        x: head.x + (r() - 0.5) * 26,
        y: head.y + age * 3 + r() * 10,
        r: 1 + r() * 2.4,
        o: Math.max(0, 0.7 - age / 10),
      });
    }
  }
  return (
    <>
      <svg width={canvas.w} height={canvas.h} style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <g filter={filter ? `url(#${filter})` : undefined} opacity={opacity}>
          {p > 0.002 && (
            <path
              d={d}
              pathLength={1}
              fill="none"
              stroke={color}
              strokeWidth={width}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${p} 2`}
            />
          )}
        </g>
        {dust.map((q, i) => (
          <circle key={i} cx={q.x} cy={q.y} r={q.r} fill={C.tiza} opacity={q.o} />
        ))}
      </svg>
      {sfx && <Sfx name={sfx} at={delay} volume={0.5} />}
    </>
  );
};

/** A04 — Tiza dibujada (12–20 f, polvo de tiza). */
export const TizaTrazo: React.FC<{ points: Pt[]; delay?: number; dur?: number; width?: number; color?: string }> = ({
  points, delay = 0, dur = A.tiza, width = 9, color = C.tiza,
}) => <Trazo points={points} color={color} width={width} delay={delay} dur={dur} filter="chalk" particulas sfx="chalk" />;

/** A07 — Marcador (10 f). Círculo / subrayado / flecha, color sello o tinta. */
export const MarcadorTrazo: React.FC<{ points: Pt[]; delay?: number; dur?: number; width?: number; color?: string }> = ({
  points, delay = 0, dur = A.marcador, width = 8, color = C.sello,
}) => <Trazo points={points} color={color} width={width} delay={delay} dur={dur} filter="rough" sfx="marker" />;

export { ellipsePoints, linePoints, arrowPoints };
