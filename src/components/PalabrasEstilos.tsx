import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, FPS, SAFE_BOX } from '../../config/brand';
import { E, hash, pop, tw } from '../lib/ease';
import type { EstiloSubtitulos } from '../lib/tema';
import type { WordTiming } from '../lib/timeline';
import { agrupar } from './Subtitulos';

const limpia = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
const sinPunto = (s: string) => s.replace(/[.,;:¡!¿?…]+$/u, '');

type Tono = 'papel' | 'pizarra' | 'lima';

export type PalabrasEstiloProps = {
  estilo: Exclude<EstiloSubtitulos, 'clasico'>;
  words: WordTiming[];
  offsetFrames: number;
  tono?: Tono;
  claves?: string[];
  y?: number;
  size?: number;
};

/**
 * Subtítulos de TEMA: misma temporización que <Palabras> (la palabra salta en el instante en que se dice),
 * distinta materia: subrayador de cuaderno, rotulado de etiquetadora, letras de recorte, línea a máquina.
 */
export const PalabrasEstilo: React.FC<PalabrasEstiloProps> = ({ estilo, words, offsetFrames, tono = 'papel', claves = [], y = 1230, size = 86 }) => {
  const frame = useCurrentFrame();
  const t = (frame + offsetFrames) / FPS;
  const grupos = React.useMemo(() => agrupar(words), [words]);
  const idx = grupos.findIndex((g, i) => {
    const next = grupos[i + 1];
    const hasta = next ? Math.min(next.start, g.end + 0.4) : g.end + 0.3;
    return t >= g.start - 0.04 && t < hasta;
  });
  if (idx < 0) return null;
  const g = grupos[idx];
  const next = grupos[idx + 1];
  const finGrupo = next ? Math.min(next.start, g.end + 0.4) : g.end + 0.3;
  const salida = tw((finGrupo - t) * FPS, [0, 3], [0, 1], E.outCubic);

  const claveSet = new Set(claves.map(limpia));
  let clavePropia = -1;
  if (!g.palabras.some((p) => claveSet.has(limpia(p.text)))) {
    let best = 4;
    g.palabras.forEach((p, i) => {
      const l = limpia(p.text);
      if (/\d/.test(l)) clavePropia = i;
      else if (l.length > best) {
        best = l.length;
        clavePropia = i;
      }
    });
  }
  const semilla = Math.round(g.start * 10);
  const inicioGrupo = g.palabras[0].start * FPS - offsetFrames - 1;

  const caja: React.CSSProperties = {
    position: 'absolute', left: SAFE_BOX.x0, width: SAFE_BOX.w, top: y,
    display: 'flex', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center',
    textAlign: 'center', textTransform: 'uppercase',
    transform: `scale(${0.9 + 0.1 * salida})`, opacity: salida,
  };

  const esClave = (p: WordTiming, i: number) => claveSet.has(limpia(p.text)) || i === clavePropia;

  /* ───────── marcador: subrayador de cuaderno ───────── */
  if (estilo === 'marcador') {
    const texto = tono === 'pizarra' ? C.tiza : C.tinta;
    return (
      <div style={{ ...caja, gap: `${size * 0.04}px ${size * 0.3}px`, fontFamily: FONT.subtitulo, fontWeight: 800, fontSize: size, lineHeight: 1.12, letterSpacing: '-0.01em' }}>
        {g.palabras.map((p, i) => {
          const ini = p.start * FPS - offsetFrames - 1;
          if (frame < ini) return <span key={i} style={{ visibility: 'hidden' }}>{sinPunto(p.text)}</span>;
          const clave = esClave(p, i);
          const k = pop(frame, ini, 7);
          const barrido = tw(frame, [ini, ini + 6], [0, 1], E.outExpo);
          const inv = tono === 'lima'; // sobre lima el subrayador es tinta y el texto papel
          const banda = inv ? C.tinta : C.lima;
          const colorTxt = clave ? (inv ? C.lima : C.tinta) : inv ? C.tinta : texto;
          const rot = (hash(i * 7 + semilla) - 0.5) * 2.4;
          return (
            <span key={i} style={{ position: 'relative', display: 'inline-block', padding: `0 ${size * 0.1}px`, color: colorTxt, transform: `translateY(${(1 - Math.min(1, k)) * 14}px) rotate(${rot}deg) scale(${activaEscala(t, p)})`, opacity: Math.min(1, k * 3) }}>
              <span
                style={{
                  position: 'absolute', left: -size * 0.04, right: -size * 0.04, zIndex: -1,
                  top: clave ? size * 0.14 : size * 0.44, bottom: clave ? size * 0.02 : size * 0.1,
                  background: clave ? banda : inv ? 'rgba(22,19,15,0.35)' : 'rgba(200,255,46,0.62)',
                  transform: `scaleX(${barrido}) skewX(-6deg)`, transformOrigin: 'left center', filter: 'url(#rough)',
                }}
              />
              {clave && (
                <svg width={size * 3} height={size * 0.3} viewBox="0 0 300 30" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, bottom: -size * 0.14, width: '100%', height: size * 0.3, overflow: 'visible' }}>
                  <path d="M6 20 C60 6 120 28 180 14 S270 20 294 10" fill="none" stroke={inv ? C.papel : C.tinta} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${tw(frame, [ini + 3, ini + 12], [0, 1], E.outCubic)} 2`} />
                </svg>
              )}
              {sinPunto(p.text)}
            </span>
          );
        })}
      </div>
    );
  }

  /* ───────── etiqueta: rotuladora (cinta en relieve) ───────── */
  if (estilo === 'etiqueta') {
    const s = size * 0.8;
    const fondoBase = tono === 'pizarra' ? C.papel : C.tinta;
    const letraBase = tono === 'pizarra' ? C.tinta : C.papel;
    return (
      <div style={{ ...caja, gap: `${s * 0.12}px ${s * 0.2}px`, fontFamily: FONT.subtitulo, fontWeight: 800, fontSize: s, lineHeight: 1.1, letterSpacing: '0.1em' }}>
        {g.palabras.map((p, i) => {
          const ini = p.start * FPS - offsetFrames - 1;
          if (frame < ini) return <span key={i} style={{ visibility: 'hidden' }}>{sinPunto(p.text)}</span>;
          const clave = esClave(p, i);
          const imprime = tw(frame, [ini, ini + 5], [100, 0], E.outExpo);
          const baja = tw(frame, [ini, ini + 7], [-22, 0], E.outBack2);
          const rot = (hash(i * 5 + semilla) - 0.5) * 4;
          const n = s * 0.1;
          return (
            <span
              key={i}
              style={{
                display: 'inline-block', padding: `${s * 0.06}px ${s * 0.26}px ${s * 0.02}px`,
                background: clave ? C.lima : fondoBase, color: clave ? C.tinta : letraBase,
                clipPath: `inset(0 ${imprime}% 0 0)`,
                transform: `translateY(${baja}px) rotate(${rot}deg) scale(${activaEscala(t, p)})`,
                textShadow: clave ? `0 2px 0 rgba(255,255,255,0.45)` : tono === 'pizarra' ? 'none' : `1.5px 1.5px 0 rgba(255,255,255,0.22), -1px -1px 0 rgba(0,0,0,0.5)`,
                boxShadow: 'none',
                filter: `drop-shadow(0 ${n * 0.5}px 0 rgba(22,19,15,0.35))`,
              }}
            >
              {sinPunto(p.text)}
            </span>
          );
        })}
      </div>
    );
  }

  /* ───────── recorte: letras recortadas de periódico ───────── */
  if (estilo === 'recorte') {
    type Pieza = { fam: string; peso: number; ital: boolean; fondo: string; letra: string; k: number };
    const PIEZAS: Pieza[] = [
      { fam: FONT.grito, peso: 400, ital: false, fondo: C.ficha, letra: C.tinta, k: 1.18 },
      { fam: FONT.susurro, peso: 400, ital: true, fondo: C.tinta, letra: C.papel, k: 1.12 },
      { fam: FONT.subtitulo, peso: 800, ital: false, fondo: C.cinta, letra: C.tinta, k: 0.92 },
      { fam: FONT.maquina, peso: 400, ital: false, fondo: C.ficha, letra: C.tinta, k: 0.86 },
      { fam: FONT.marcador, peso: 400, ital: false, fondo: C.diario, letra: C.tinta, k: 0.9 },
    ];
    return (
      <div style={{ ...caja, gap: `${size * 0.12}px ${size * 0.14}px`, lineHeight: 1 }}>
        {g.palabras.map((p, i) => {
          const ini = p.start * FPS - offsetFrames - 1;
          if (frame < ini) return <span key={i} style={{ visibility: 'hidden', fontSize: size }}>{sinPunto(p.text)}</span>;
          const clave = esClave(p, i);
          const base = PIEZAS[Math.floor(hash(i * 11 + semilla * 3) * PIEZAS.length)];
          const pz: Pieza = clave ? { fam: FONT.grito, peso: 400, ital: false, fondo: C.lima, letra: C.tinta, k: 1.28 } : base;
          const k = pop(frame, ini, 8);
          const cae = (1 - Math.min(1, k)) * -60;
          const rot = (hash(i * 3 + semilla) - 0.5) * 9;
          const dy = (hash(i * 13 + semilla) - 0.5) * 12;
          const pts = Array.from({ length: 4 }).map((_, q) => hash(i * 17 + q + semilla) * 5);
          const fs = size * pz.k;
          return (
            <span
              key={i}
              style={{
                display: 'inline-block', fontFamily: pz.fam, fontWeight: pz.peso, fontStyle: pz.ital ? 'italic' : 'normal', fontSize: fs,
                padding: `${fs * 0.06}px ${fs * 0.2}px ${fs * 0.02}px`, background: pz.fondo, color: pz.letra,
                clipPath: `polygon(${pts[0]}% ${pts[1]}%, 100% ${pts[2]}%, ${100 - pts[3]}% 100%, 0 ${100 - pts[0]}%)`,
                transform: `translateY(${cae + dy}px) rotate(${rot * (0.4 + 0.6 * Math.min(1, k))}deg) scale(${(0.7 + 0.3 * Math.min(1.1, k)) * activaEscala(t, p)})`,
                opacity: Math.min(1, k * 3),
                filter: 'drop-shadow(3px 4px 0 rgba(22,19,15,0.38))',
              }}
            >
              {sinPunto(p.text)}
            </span>
          );
        })}
      </div>
    );
  }

  /* ───────── máquina: línea tecleada sobre tira de papel ───────── */
  const s = size * 0.92;
  const tira = tono === 'pizarra' ? C.tiza : tono === 'lima' ? C.tinta : C.ficha;
  const tinta = tono === 'lima' ? C.lima : C.tinta;
  const sube = tw(frame, [inicioGrupo, inicioGrupo + 6], [26, 0], E.outBack);
  return (
    <div style={{ ...caja, transform: `translateY(${sube}px) scale(${0.9 + 0.1 * salida})` }}>
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${s * 0.34}px`, padding: `${s * 0.16}px ${s * 0.5}px ${s * 0.08}px`,
          background: tira, color: tinta, fontFamily: FONT.maquina, fontSize: s, lineHeight: 1.18, letterSpacing: '0.02em',
          border: `3px dashed ${tono === 'lima' ? C.lima : C.tinta}`, outline: `${s * 0.07}px solid ${tira}`, outlineOffset: 0,
          boxShadow: '0 12px 0 -6px rgba(22,19,15,0.3)', transform: `rotate(${(hash(semilla) - 0.5) * 2}deg)`,
        }}
      >
        {g.palabras.map((p, i) => {
          const ini = p.start * FPS - offsetFrames - 1;
          const txt = sinPunto(p.text);
          const dur = Math.max(4, Math.round((p.end - p.start) * FPS) * 0.8);
          const n = Math.min(txt.length, Math.max(0, Math.floor(((frame - ini) / dur) * txt.length) + (frame >= ini ? 1 : 0)));
          const clave = esClave(p, i);
          const cursor = frame >= ini && n < txt.length ? true : frame >= ini && i === g.palabras.length - 1 && Math.floor(frame / 8) % 2 === 0;
          return (
            <span key={i} style={{ position: 'relative', display: 'inline-block', whiteSpace: 'pre' }}>
              {clave && frame >= ini && (
                <span style={{ position: 'absolute', left: -s * 0.1, right: -s * 0.1, top: s * 0.12, bottom: 0, zIndex: 0, background: tono === 'lima' ? 'rgba(200,255,46,0.28)' : C.lima, transform: `scaleX(${tw(frame, [ini, ini + 6], [0, 1], E.outExpo)})`, transformOrigin: 'left center' }} />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>
                {txt.slice(0, n)}
                <span style={{ visibility: 'hidden' }}>{txt.slice(n)}</span>
              </span>
              {cursor && <span style={{ position: 'absolute', left: `${(n / Math.max(1, txt.length)) * 100}%`, top: s * 0.14, width: s * 0.5, height: s * 0.9, background: tinta, opacity: 0.85, zIndex: 2 }} />}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** La palabra que se está diciendo crece un poco (igual que en el estilo clásico). */
const activaEscala = (t: number, p: WordTiming) => (t >= p.start && t <= p.end ? 1.06 : 1);
