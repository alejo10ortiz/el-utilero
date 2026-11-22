import React, { createContext, useContext } from 'react';
import { useCurrentFrame } from 'remotion';

/**
 * REJILLA DE RITMO — la música está a 100 BPM exactos: 1 beat = 0.6 s = 18 frames (30 fps), 1 compás = 72 f.
 * Los cortes caen en beats, los golpes en beats/corcheas (9 f), los pulsos siguen el bombo.
 */
export const BPM = 100;
export const BEAT = 18;
export const MEDIO = 9;
export const COMPAS = 72;

/** Frame absoluto del video (los Sequence reinician useCurrentFrame): se provee desde Short. */
const AbsCtx = createContext(0);
export const AbsProvider: React.FC<{ inicio: number; children: React.ReactNode }> = ({ inicio, children }) => (
  <AbsCtx.Provider value={inicio}>{children}</AbsCtx.Provider>
);
export const useInicioEscena = () => useContext(AbsCtx);
export const useAbs = () => useCurrentFrame() + useContext(AbsCtx);

/** Ajusta un frame a la rejilla si queda a ≤ tol frames; si no, lo deja (la voz manda en lo sincrónico). */
export const snap = (frame: number, grid = MEDIO, tol = 4) => {
  const g = Math.round(frame / grid) * grid;
  return Math.abs(g - frame) <= tol ? g : frame;
};

/** 1 justo en el beat y cae rápido: sirve para pulsos de escala/brillo. `fuerte` solo en el 1 y el 3 del compás. */
export const pulsoBeat = (abs: number, decay = 4.5, fuerte = false) => {
  const f = abs % BEAT;
  const beatIdx = Math.floor(abs / BEAT) % 4;
  const base = Math.exp(-f / decay);
  if (!fuerte) return base;
  return beatIdx === 0 ? base : beatIdx === 2 ? base * 0.6 : base * 0.25;
};
