import React from 'react';
import { C } from '../../config/brand';
import { hash } from '../lib/ease';
import type { EstiloFicha } from '../lib/tema';

/**
 * Materia de la FICHA según el tema (BRAND.md §2.6). <Ficha> sigue haciendo lo suyo (entra, se teclea, se marca);
 * esto solo decide el papel: fondo, recorte del borde, sombra y adornos (dentro y fuera del recorte).
 */
export type MateriaFicha = {
  /** background + backgroundPosition de la tarjeta. */
  fondo: React.CSSProperties;
  /** Recorte del borde (hoja arrancada, esquinas cortadas…). Con recorte la sombra va en `filter`. */
  clipPath?: string;
  sombra: string;
  /** Línea vertical de margen (null = sin margen). */
  margen: { color: string; ancho: number } | null;
  /** Adornos dentro de la tarjeta (coordenadas locales). */
  dentro: React.ReactNode;
  /** Adornos fuera del recorte (cordel, clip…): se pintan sobre la tarjeta sin recortar. */
  fuera: React.ReactNode;
};

const rasgado = (semilla: number) => {
  // borde de papel rasgado: pequeños dientes arriba y abajo, laterales casi rectos
  const pts: string[] = [];
  const n = 14;
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${hash(semilla + i) * 1.6}%`);
  pts.push(`100% 100%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${100 - hash(semilla + 40 + i) * 1.4}%`);
  return `polygon(${pts.join(',')})`;
};

export const materiaFicha = (estilo: EstiloFicha, o: { lineH: number; padTop: number; size: number; ancho: number; alto: number; semilla?: number }): MateriaFicha => {
  const { lineH, padTop, size, ancho, alto, semilla = 3 } = o;
  const sombraSimple = '0 22px 30px -20px rgba(22,19,15,0.55), 0 2px 0 rgba(22,19,15,0.06)';
  const sombraRecorte = 'drop-shadow(0 18px 18px rgba(22,19,15,0.35))';
  switch (estilo) {
    case 'cuaderno':
      return {
        fondo: {
          background: `${C.cuaderno} repeating-linear-gradient(180deg, transparent 0 ${lineH - 1.6}px, ${C.lineaCuaderno} ${lineH - 1.6}px ${lineH}px)`,
          backgroundPosition: `0 ${padTop - lineH * 0.18}px`,
        },
        clipPath: `polygon(0 1.2%, 4% 0, 9% 1.6%, 15% 0.2%, 22% 1.4%, 30% 0, 38% 1.5%, 47% 0.1%, 55% 1.6%, 64% 0, 72% 1.3%, 81% 0.2%, 90% 1.5%, 96% 0, 100% 1%, 100% 100%, 0 100%)`,
        sombra: sombraRecorte,
        margen: { color: C.lineaCuaderno, ancho: 3 },
        dentro: (
          <>
            {[0.18, 0.5, 0.82].map((q, i) => (
              <div key={i} style={{ position: 'absolute', left: size * 0.22, top: alto * q, width: size * 0.34, height: size * 0.34, borderRadius: size, background: C.tinta, opacity: 0.55 }} />
            ))}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: size * 0.5, backgroundImage: `repeating-linear-gradient(90deg, rgba(22,19,15,0.08) 0 10px, transparent 10px 20px)` }} />
          </>
        ),
        fuera: null,
      };
    case 'etiqueta': {
      const ox = ancho / 2;
      return {
        fondo: { background: `${C.ficha}`, backgroundPosition: '0 0' },
        clipPath: 'polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%, 0 40px)',
        sombra: sombraRecorte,
        margen: null,
        dentro: (
          <>
            <div style={{ position: 'absolute', inset: 12, border: `3px dashed ${C.kraftOscuro}`, opacity: 0.7 }} />
            <div style={{ position: 'absolute', left: ox - 24, top: 18, width: 48, height: 48, borderRadius: 48, background: C.kraftClaro, border: `4px solid ${C.kraftOscuro}`, boxSizing: 'border-box' }} />
            <div style={{ position: 'absolute', left: ox - 11, top: 31, width: 22, height: 22, borderRadius: 22, background: C.tinta, opacity: 0.78 }} />
          </>
        ),
        fuera: (
          <svg width={ancho} height={alto} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
            <path d={`M${ox} 42 C${ox - 70} -20 ${ox + 90} -90 ${ox + 20} -190`} fill="none" stroke={C.kraftOscuro} strokeWidth={7} strokeLinecap="round" />
            <path d={`M${ox} 42 C${ox + 40} -10 ${ox - 50} -80 ${ox - 30} -170`} fill="none" stroke={C.kraft} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
          </svg>
        ),
      };
    }
    case 'planilla':
      return {
        fondo: {
          background: `${C.ficha} repeating-linear-gradient(0deg, transparent 0 23px, ${C.lineaFicha} 23px 24px), repeating-linear-gradient(90deg, transparent 0 23px, ${C.lineaFicha} 23px 24px)`,
          backgroundPosition: '0 0',
        },
        sombra: sombraSimple,
        margen: null,
        dentro: (
          <>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: size * 0.2, background: C.tinta }} />
            <div style={{ position: 'absolute', left: 14, right: 14, top: size * 0.2, bottom: 14, borderLeft: `3px dashed ${C.tinta}`, borderRight: `3px dashed ${C.tinta}`, borderBottom: `3px dashed ${C.tinta}`, opacity: 0.4 }} />
            {[[14, size * 0.2 + 12, 1, 1], [ancho - 14, size * 0.2 + 12, -1, 1], [14, alto - 14, 1, -1], [ancho - 14, alto - 14, -1, -1]].map(([x, y, sx, sy], i) => (
              <div key={i} style={{ position: 'absolute', left: Math.min(x, x + sx * 36), top: Math.min(y, y + sy * 36), width: 36, height: 36, borderTop: sy > 0 ? `5px solid ${C.tinta}` : 'none', borderBottom: sy < 0 ? `5px solid ${C.tinta}` : 'none', borderLeft: sx > 0 ? `5px solid ${C.tinta}` : 'none', borderRight: sx < 0 ? `5px solid ${C.tinta}` : 'none', opacity: 0.85, boxSizing: 'border-box' }} />
            ))}
          </>
        ),
        fuera: null,
      };
    case 'recorte':
      return {
        fondo: {
          background: `${C.diario} radial-gradient(${C.tintaDiario} 1.2px, transparent 1.5px) 0 0 / 9px 9px`,
          backgroundBlendMode: 'multiply',
        },
        clipPath: rasgado(semilla),
        sombra: sombraRecorte,
        margen: null,
        dentro: (
          <>
            <div style={{ position: 'absolute', left: size * 0.5, right: size * 0.5, top: size * 0.28, height: 3, background: C.tintaDiario, opacity: 0.55 }} />
            <div style={{ position: 'absolute', left: size * 0.5, right: size * 0.5, top: size * 0.28 + 8, height: 1.5, background: C.tintaDiario, opacity: 0.55 }} />
            <div style={{ position: 'absolute', inset: 0, background: C.diario, opacity: 0.55, mixBlendMode: 'screen' }} />
          </>
        ),
        fuera: null,
      };
    default:
      return {
        fondo: {
          background: `${C.ficha} repeating-linear-gradient(180deg, transparent 0 ${lineH - 1}px, ${C.lineaFicha} ${lineH - 1}px ${lineH}px)`,
          backgroundPosition: `0 ${padTop - lineH * 0.18}px`,
        },
        sombra: sombraSimple,
        margen: { color: 'rgba(224,65,43,0.35)', ancho: 2 },
        dentro: null,
        fuera: null,
      };
  }
};
