import React from 'react';
import { interpolate, useCurrentFrame, Easing } from 'remotion';
import { measureText } from '@remotion/layout-utils';
import { A, C, FONT } from '../../config/brand';
import { prog } from '../lib/anim';
import { useTema } from '../lib/tema';
import { materiaFicha } from './FichaEstilos';
import { Sfx } from './Sfx';
import { MarcadorTrazo, ellipsePoints } from './Trazo';

/**
 * A06 + A03 — Ficha a máquina que se desliza (10 f) y se teclea letra por letra.
 * Fondo #F8F4EA, líneas azules de cuaderno, sombra larga, rotación −2.5° a +1.5°.
 * `marcar`: subcadena que se rodea con marcador rojo (A07) al terminar de teclear.
 */
export const Ficha: React.FC<{
  lineas: string[];
  x: number; // esquina sup. izq. (antes de rotar)
  y: number;
  ancho?: number;
  size?: number;
  rot?: number;
  delay?: number;
  desde?: 'derecha' | 'izquierda' | 'abajo';
  marcar?: string;
  sonido?: boolean;
  /** Etiqueta mecanografiada pequeña arriba ("CAMERINO #001"). */
  encabezado?: string;
  /** Alto mínimo: una ficha es una ficha, no una tira. */
  altoMin?: number;
  children?: React.ReactNode;
}> = ({
  lineas: lineasEntrada, x, y, ancho = 800, size = 56, rot = -2.5, delay = 0, desde = 'derecha', marcar, sonido = true,
  encabezado, altoMin = 0, children,
}) => {
  const frame = useCurrentFrame();
  const tema = useTema();
  if (frame < delay) return null;

  // Se mide el texto real (las mayúsculas de Special Elite son más anchas que las minúsculas).
  const medir = (t: string) => measureText({ text: t, fontFamily: 'Special Elite', fontSize: size }).width;
  const anchoUtil = ancho - size * 2.2;
  const lineas = lineasEntrada.flatMap((l) => {
    const out: string[] = [];
    let cur = '';
    for (const w of l.split(' ')) {
      if (!cur) cur = w;
      else if (medir(cur + ' ' + w) <= anchoUtil) cur += ' ' + w;
      else {
        out.push(cur);
        cur = w;
      }
    }
    if (cur) out.push(cur);
    return out;
  });

  const slide = Easing.out(Easing.poly(4));
  const p = prog(frame, delay, A.ficha, slide);
  const off = desde === 'derecha' ? 1300 : desde === 'izquierda' ? -1300 : 0;
  const offY = desde === 'abajo' ? 1000 : 0;
  const tx = off * (1 - p);
  const ty = offY * (1 - p);
  const rotacion = rot + -8 * (1 - p) * (desde === 'izquierda' ? -1 : 1);

  const typeStart = delay + A.ficha;
  const total = lineas.reduce((a, l) => a + l.length, 0);
  const typed = Math.max(0, Math.floor((frame - typeStart) / A.maquinaFramesPorLetra));
  const typingFrames = Math.ceil(total * A.maquinaFramesPorLetra);
  const typingDone = typed >= total;
  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  const lineH = size * 1.42;
  const padTop = encabezado ? size * 1.5 : size * 0.9;
  const alto = Math.max(altoMin, padTop + lineas.length * lineH + size * 0.7);
  const materia = materiaFicha(tema.ficha, { lineH, padTop, size, ancho, alto, semilla: Math.round(x + y) % 50 });

  let consumed = 0;
  const rendered = lineas.map((linea, li) => {
    const base = consumed;
    consumed += linea.length;
    const idx = marcar ? linea.toLowerCase().indexOf(marcar.toLowerCase()) : -1;
    const chars = [...linea];
    const spans = chars.map((ch, ci) => {
      const visible = base + ci < typed;
      return (
        <span key={ci} style={{ visibility: visible ? 'visible' : 'hidden' }}>
          {ch}
        </span>
      );
    });
    const showCursor =
      !typingDone && typed >= base && typed <= base + linea.length && frame >= typeStart
        ? true
        : typingDone && li === lineas.length - 1 && cursorOn;
    let content: React.ReactNode = spans;
    if (idx >= 0) {
      const mLen = marcar!.length;
      content = (
        <>
          {spans.slice(0, idx)}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            {spans.slice(idx, idx + mLen)}
          </span>
          {spans.slice(idx + mLen)}
        </>
      );
    }
    return (
      <div key={li} style={{ height: lineH, whiteSpace: 'pre', position: 'relative' }}>
        {content}
        {showCursor && (
          <span style={{ color: C.tinta, opacity: 0.85 }}>▌</span>
        )}
      </div>
    );
  });

  // Posición aproximada del texto marcado para trazar el círculo en coordenadas de la ficha.
  let marca: React.ReactNode = null;
  if (marcar) {
    const li = lineas.findIndex((l) => l.toLowerCase().includes(marcar.toLowerCase()));
    if (li >= 0) {
      const idx = lineas[li].toLowerCase().indexOf(marcar.toLowerCase());
      const pre = idx > 0 ? medir(lineas[li].slice(0, idx)) : 0;
      const mw = medir(marcar);
      const mx = size * 1.1 + pre + mw / 2;
      const my = padTop + li * lineH + lineH * 0.5;
      marca = (
        <MarcadorTrazo
          points={ellipsePoints(mx, my, mw / 2 + size * 0.34, lineH * 0.74, { seed: 9 })}
          delay={typeStart + typingFrames + 6}
          dur={A.marcador + 4}
          width={Math.max(7, size * 0.14)}
          color={C.sello}
        />
      );
    }
  }

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: ancho,
          height: alto,
          transform: `translate(${tx}px, ${ty}px) rotate(${rotacion}deg)`,
          transformOrigin: '50% 50%',
          boxShadow: materia.clipPath ? 'none' : materia.sombra,
          filter: materia.clipPath ? materia.sombra : undefined,
          fontFamily: FONT.maquina,
          fontSize: size,
          color: C.tinta,
          padding: `${padTop}px ${size * 1.1}px 0`,
          boxSizing: 'border-box',
        }}
      >
        {/* papel de la ficha (según el tema): fondo + recorte del borde + adornos */}
        <div style={{ position: 'absolute', inset: 0, ...materia.fondo, clipPath: materia.clipPath }}>{materia.dentro}</div>
        {/* margen de cuaderno */}
        {materia.margen && <div style={{ position: 'absolute', left: size * 0.75, top: 0, bottom: 0, width: materia.margen.ancho, background: materia.margen.color }} />}
        {materia.fuera}
        {encabezado && (
          <div
            style={{
              position: 'absolute',
              left: size * 1.1,
              top: size * 0.38,
              fontSize: size * 0.42,
              letterSpacing: '0.18em',
              color: C.grisArchivo,
            }}
          >
            {encabezado}
          </div>
        )}
        {rendered}
        {children}
      </div>
      {marca && (
        <div style={{ position: 'absolute', left: x, top: y, width: ancho, height: alto, transform: `translate(${tx}px, ${ty}px) rotate(${rotacion}deg)` }}>
          {marca}
        </div>
      )}
      {sonido && (
        <>
          <Sfx name="paper_slide" at={delay} volume={0.7} />
          {total > 0 && <Sfx name="type_loop" at={typeStart} loopFor={typingFrames} volume={0.45} />}
          {total > 0 && <Sfx name="ding" at={typeStart + typingFrames} volume={0.5} />}
        </>
      )}
    </>
  );
};
