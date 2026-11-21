import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C } from '../../config/brand';
import { rng } from '../lib/anim';
import type { Expresion, Pose, Visema } from '../lib/episode';
import type { WordTiming } from '../lib/timeline';

/* ───────────────────────── Expresiones (§4.4) ───────────────────────── */

type Ojo = 'abierto' | 'ancho' | 'entrecerrado' | 'arco' | 'cerrado' | 'guino';
type BocaReposo = 'sonrisa' | 'sonrisaLado' | 'plana' | 'fruncida' | 'chica' | 'suave' | 'O' | 'risa';
type Ceja = { dy: number; rot: number };

type Expr = {
  cejaIzq: Ceja;
  cejaDer: Ceja;
  ojoIzq: Ojo;
  ojoDer: Ojo;
  pupila: { dx: number; dy: number };
  boca: BocaReposo;
  bigote: { dy: number; rot: number };
  inclinacion: number;
};

const EXPR: Record<Expresion, Expr> = {
  E1: { cejaIzq: { dy: 0, rot: 0 }, cejaDer: { dy: 0, rot: 0 }, ojoIzq: 'abierto', ojoDer: 'abierto', pupila: { dx: 0, dy: 0 }, boca: 'sonrisa', bigote: { dy: 0, rot: 0 }, inclinacion: 0 },
  E2: { cejaIzq: { dy: -8, rot: -4 }, cejaDer: { dy: 2, rot: 3 }, ojoIzq: 'abierto', ojoDer: 'guino', pupila: { dx: 0, dy: 0 }, boca: 'sonrisaLado', bigote: { dy: 0, rot: -2 }, inclinacion: 3 },
  E3: { cejaIzq: { dy: 3, rot: 7 }, cejaDer: { dy: 3, rot: -7 }, ojoIzq: 'entrecerrado', ojoDer: 'entrecerrado', pupila: { dx: 0, dy: 0 }, boca: 'chica', bigote: { dy: 0, rot: 0 }, inclinacion: -2 },
  E4: { cejaIzq: { dy: -15, rot: -3 }, cejaDer: { dy: -15, rot: 3 }, ojoIzq: 'ancho', ojoDer: 'ancho', pupila: { dx: 0, dy: 0 }, boca: 'O', bigote: { dy: -4, rot: 0 }, inclinacion: 0 },
  E5: { cejaIzq: { dy: -13, rot: -6 }, cejaDer: { dy: 4, rot: -9 }, ojoIzq: 'abierto', ojoDer: 'abierto', pupila: { dx: 5, dy: 0 }, boca: 'plana', bigote: { dy: 0, rot: -4 }, inclinacion: -3 },
  E6: { cejaIzq: { dy: -7, rot: -4 }, cejaDer: { dy: -7, rot: 4 }, ojoIzq: 'arco', ojoDer: 'arco', pupila: { dx: 0, dy: 0 }, boca: 'risa', bigote: { dy: -3, rot: 0 }, inclinacion: 0 },
  E7: { cejaIzq: { dy: -2, rot: -10 }, cejaDer: { dy: -2, rot: 10 }, ojoIzq: 'abierto', ojoDer: 'abierto', pupila: { dx: 0, dy: -4 }, boca: 'suave', bigote: { dy: 0, rot: 0 }, inclinacion: 2 },
  E8: { cejaIzq: { dy: 4, rot: 14 }, cejaDer: { dy: 4, rot: -14 }, ojoIzq: 'abierto', ojoDer: 'abierto', pupila: { dx: 0, dy: 0 }, boca: 'fruncida', bigote: { dy: 3, rot: 0 }, inclinacion: 0 },
};

const BOCA_REPOSO: Record<BocaReposo, React.ReactNode> = {
  sonrisa: <path d="M184 266 C192 272 208 272 216 266" fill="none" stroke={C.tinta} strokeWidth={4} strokeLinecap="round" />,
  sonrisaLado: <path d="M184 267 C194 272 208 274 219 261" fill="none" stroke={C.tinta} strokeWidth={4} strokeLinecap="round" />,
  plana: <path d="M187 268 L213 268" fill="none" stroke={C.tinta} strokeWidth={4} strokeLinecap="round" />,
  fruncida: <path d="M185 273 C193 265 207 265 215 273" fill="none" stroke={C.tinta} strokeWidth={4} strokeLinecap="round" />,
  chica: <path d="M193 268 C197 270 203 270 207 268" fill="none" stroke={C.tinta} strokeWidth={4} strokeLinecap="round" />,
  suave: <path d="M186 266 C193 270 207 270 214 266" fill="none" stroke={C.tinta} strokeWidth={3.5} strokeLinecap="round" />,
  O: <ellipse cx={200} cy={271} rx={9} ry={11} fill={C.tinta} />,
  risa: (
    <g>
      <path d="M178 262 C182 291 218 291 222 262 Z" fill={C.tinta} />
      <ellipse cx={200} cy={279} rx={9} ry={4.5} fill={C.lima} />
    </g>
  ),
};

/* ───────────────────────── Visemas (§4.6) ───────────────────────── */

const VISEMA_SHAPE = (v: Visema, papel: string): { el: React.ReactNode; bigoteDy: number } => {
  switch (v) {
    case 'M1': // A — abierta grande, bigote sube
      return { el: <ellipse cx={200} cy={273} rx={14} ry={12} fill={C.tinta} />, bigoteDy: -6 };
    case 'M2': // E / I — ancha y baja
      return { el: <ellipse cx={200} cy={270} rx={19} ry={5.5} fill={C.tinta} />, bigoteDy: -1 };
    case 'M3': // O / U — redonda pequeña
      return { el: <ellipse cx={200} cy={270} rx={7} ry={8.5} fill={C.tinta} />, bigoteDy: -2 };
    case 'M4': // M / B / P — labios apretados, bigote baja
      return { el: <path d="M187 266 L213 266" stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />, bigoteDy: 2 };
    case 'M5': // F / V — labio inferior bajo los dientes
      return {
        el: (
          <g>
            <ellipse cx={200} cy={270} rx={13} ry={6} fill={C.tinta} />
            <rect x={189} y={263} width={22} height={5} rx={1.5} fill={papel} />
          </g>
        ),
        bigoteDy: -1,
      };
    case 'M6': // L / D / T / N — semiabierta, punta de lengua
      return {
        el: (
          <g>
            <ellipse cx={200} cy={270} rx={12} ry={7} fill={C.tinta} />
            <ellipse cx={200} cy={274} rx={5.5} ry={2.8} fill={C.lima} />
          </g>
        ),
        bigoteDy: -2,
      };
    case 'M7': // S / Z / CH — dientes juntos visibles
      return {
        el: (
          <g>
            <rect x={185} y={263} width={30} height={9} rx={3} fill={papel} stroke={C.tinta} strokeWidth={2.5} />
            <path d="M193 263 V272 M200 263 V272 M207 263 V272" stroke={C.tinta} strokeWidth={1.4} />
          </g>
        ),
        bigoteDy: -1,
      };
    default:
      return { el: null, bigoteDy: 0 };
  }
};

const CHAR_VISEMA = (ch: string): Visema | null => {
  const c = ch.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  if ('a'.includes(c)) return 'M1';
  if ('ei'.includes(c)) return 'M2';
  if ('ou'.includes(c)) return 'M3';
  if ('mbp'.includes(c)) return 'M4';
  if ('fv'.includes(c)) return 'M5';
  if ('ldtn'.includes(c)) return 'M6';
  if ('szc'.includes(c)) return 'M7';
  if ('rgjkqxhyñw'.includes(c)) return 'M6';
  return null;
};

/** Visema para un fotograma, dadas las palabras con tiempo absoluto (s). */
export const visemaEn = (t: number, words: WordTiming[]): Visema => {
  const w = words.find((x) => t >= x.start && t < x.end);
  if (!w) return 'M0';
  const letras = [...w.text].filter((c) => /\p{L}/u.test(c));
  if (!letras.length) return 'M0';
  // secuencia silábica: vocales mandan; las consonantes se colapsan a la primera de cada grupo
  const seq: Visema[] = [];
  let prevCons = false;
  for (const ch of letras) {
    const v = CHAR_VISEMA(ch);
    if (!v) continue;
    const esVocal = v === 'M1' || v === 'M2' || v === 'M3';
    if (esVocal) {
      seq.push(v);
      prevCons = false;
    } else if (!prevCons) {
      seq.push(v);
      prevCons = true;
    }
  }
  if (!seq.length) return 'M0';
  const p = (t - w.start) / Math.max(0.001, w.end - w.start);
  const i = Math.min(seq.length - 1, Math.floor(p * seq.length));
  // cierra al final de la palabra
  if (p > 0.93) return 'M0';
  return seq[i];
};

/* ───────────────────────── Manos ───────────────────────── */

export const Mano: React.FC<{ x: number; y: number; rot?: number; escala?: number; sobre?: 'papel' | 'lima'; punta?: boolean }> = ({
  x, y, rot = 0, escala = 1, sobre = 'papel', punta = false,
}) => {
  const piel = sobre === 'lima' ? C.papel : C.lima;
  // [x, ancho, alto] de cada dedo; el borde inferior es y = -8
  const dedos: [number, number, number][] = punta
    ? [[-22, 11, 10], [-10, 11, 10], [2, 11, 10], [-6, 12, 54]]
    : [[-23, 11, 27], [-11, 11, 34], [1, 11, 35], [13, 11, 28]];
  if (punta) dedos.splice(3, 1, [14, 11, 10]);
  const partes = (
    <>
      <rect x={-24} y={-8} width={48} height={42} rx={14} />
      {dedos.map(([dx, w, h], i) => (
        <rect key={i} x={dx} y={-8 - h + 3} width={w} height={h} rx={w / 2} />
      ))}
      {punta && <rect x={-6} y={-8 - 54 + 3} width={12} height={54} rx={6} />}
      <rect x={-37} y={4} width={15} height={30} rx={7.5} transform="rotate(-28 -30 18)" />
    </>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`}>
      <g transform="translate(5 4)" fill={piel}>{partes}</g>
      <g fill={piel} stroke={C.tinta} strokeWidth={3.2} strokeLinejoin="round">{partes}</g>
      <path d="M-12 22 H12" stroke={C.tinta} strokeWidth={2} fill="none" strokeLinecap="round" />
    </g>
  );
};

/* ───────────────────────── El Utilero ───────────────────────── */

const parpadea = (frame: number, seed: number) => {
  const periodo = 112;
  const ciclo = Math.floor(frame / periodo);
  const off = 24 + Math.floor(rng(ciclo * 7 + seed)() * 60);
  const f = frame - ciclo * periodo;
  return f >= off && f < off + 4;
};

export type UtileroProps = {
  expresion?: Expresion;
  pose?: Pose;
  /** Si se pasan palabras, el rig hace la sincronía labial. */
  words?: WordTiming[];
  /** Frame del video donde empieza este componente (para convertir a tiempo absoluto). */
  offsetFrames?: number;
  /** Fuerza un visema (útil para hojas de modelo). */
  visema?: Visema;
  sobre?: 'papel' | 'lima';
  /** Ancho en px; el alto es igual (viewBox cuadrado). */
  size?: number;
  x?: number;
  y?: number;
  flip?: boolean;
  /** Parpadeo/respiración activos. */
  vivo?: boolean;
  /** Ver silueta (solo tinta) — prueba de reconocimiento. */
  silueta?: boolean;
  seed?: number;
  /** 'cabeza' recorta el busto (hojas de modelo, avatares). */
  recorte?: 'busto' | 'cabeza';
  children?: React.ReactNode;
};

export const Utilero: React.FC<UtileroProps> = ({
  expresion = 'E1', pose = 'P1', words, offsetFrames = 0, visema, sobre = 'papel',
  size = 600, x = 0, y = 0, flip = false, vivo = true, silueta = false, seed = 1, recorte = 'busto', children,
}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const ex = EXPR[expresion];
  const t = (frame + offsetFrames) / fps;

  const v: Visema = visema ?? (words ? visemaEn(t, words) : 'M0');
  const hablando = v !== 'M0';
  const forma = hablando ? VISEMA_SHAPE(v, C.papel) : { el: null, bigoteDy: 0 };

  const resp = vivo ? 1 + 0.006 * (1 - Math.cos((2 * Math.PI * frame) / 90)) : 1;
  const parpadeo = vivo && parpadea(frame, seed);
  const sway = vivo ? Math.sin(frame / 38 + seed) * 0.7 : 0;
  const rebote = expresion === 'E6' ? Math.abs(Math.sin(frame * 0.55)) * -4 : 0;
  // bigote: ±2 px con cada sílaba acentuada (cuando habla, sigue el visema)
  const bigoteDy = ex.bigote.dy + forma.bigoteDy + (hablando ? Math.sin(frame * 1.7) * 0.8 : 0);

  const cLima = silueta ? C.tinta : sobre === 'lima' ? C.papel : C.lima;
  const cTinta = C.tinta;
  const bigoteRelleno = silueta ? C.tinta : C.papel;

  const ojoDe = (lado: 'izq' | 'der') => {
    const tipo = lado === 'izq' ? ex.ojoIzq : ex.ojoDer;
    const cx = lado === 'izq' ? 172 : 228;
    const px = cx + ex.pupila.dx;
    const py = 208 + ex.pupila.dy;
    const cerrar = parpadeo && (tipo === 'abierto' || tipo === 'ancho');
    if (cerrar || tipo === 'cerrado')
      return <path d={`M${cx - 8} 209 L${cx + 9} 209`} stroke={cTinta} strokeWidth={5} strokeLinecap="round" fill="none" />;
    switch (tipo) {
      case 'abierto':
        return <circle cx={px} cy={py} r={6.5} fill={cTinta} />;
      case 'ancho':
        return (
          <g>
            <circle cx={px} cy={py} r={10} fill="none" stroke={cTinta} strokeWidth={3} />
            <circle cx={px} cy={py} r={4.6} fill={cTinta} />
          </g>
        );
      case 'entrecerrado':
        return <ellipse cx={px} cy={209} rx={7} ry={3} fill={cTinta} />;
      case 'arco':
        return <path d={`M${cx - 9} 211 C${cx - 3} 201 ${cx + 3} 201 ${cx + 9} 211`} stroke={cTinta} strokeWidth={5} strokeLinecap="round" fill="none" />;
      case 'guino':
        return <path d={`M${cx - 12} 209 C${cx - 6} 202 ${cx + 6} 202 ${cx + 12} 209`} stroke={cTinta} strokeWidth={5.5} strokeLinecap="round" fill="none" />;
    }
  };

  const ceja = (lado: 'izq' | 'der') => {
    const c = lado === 'izq' ? ex.cejaIzq : ex.cejaDer;
    const d =
      lado === 'izq'
        ? 'M150 188 C160 177 178 177 188 185 L186 194 C176 188 162 188 152 196 Z'
        : 'M250 188 C240 177 222 177 212 185 L214 194 C224 188 238 188 248 196 Z';
    const pivote = lado === 'izq' ? '169 187' : '231 187';
    return (
      <path
        d={d}
        fill={bigoteRelleno}
        stroke={cTinta}
        strokeWidth={2.5}
        strokeLinejoin="round"
        transform={`translate(0 ${c.dy}) rotate(${c.rot} ${pivote})`}
      />
    );
  };

  const bocaNode = hablando ? forma.el : BOCA_REPOSO[ex.boca];

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: recorte === 'cabeza' ? size * 0.78 : size,
        overflow: recorte === 'cabeza' ? 'hidden' : undefined,
        transform: flip ? 'scaleX(-1)' : undefined,
        pointerEvents: 'none',
      }}
    >
      <svg viewBox="0 0 400 400" width={size} height={size} style={{ overflow: 'visible' }}>
        {/* TORSO + TOALLA + LLAVERO (respiran) */}
        <g transform={`translate(0 400) scale(1 ${resp}) translate(0 -400)`}>
          <path d="M40 400 C48 318 110 286 200 286 C290 286 352 318 360 400 Z" fill={cTinta} />
          <path d="M82 330 C72 352 64 376 60 400" fill="none" stroke={cLima} strokeWidth={12} />
          <path d="M318 330 C328 352 336 376 340 400" fill="none" stroke={cLima} strokeWidth={12} />
          <path d="M170 288 L200 326 L230 288" fill="none" stroke={C.papel} strokeWidth={5} strokeLinejoin="round" />
          <line x1={200} y1={326} x2={200} y2={400} stroke={C.papel} strokeWidth={3} />
          <g>
            <path d="M250 290 C282 286 314 300 328 322 L304 344 C292 324 272 312 244 310 Z" fill={bigoteRelleno} stroke={cTinta} strokeWidth={3} />
            <line x1={266} y1={294} x2={256} y2={312} stroke={silueta ? cTinta : C.sello} strokeWidth={4} />
          </g>
          <g transform={`rotate(${Math.sin(frame / 14 + seed) * (vivo ? 3 : 0)} 150 331)`}>
            <circle cx={150} cy={346} r={15} fill="none" stroke={C.papel} strokeWidth={4} />
            <rect x={140} y={358} width={6} height={30} rx={2} fill={C.papel} />
            <rect x={146} y={378} width={8} height={4} fill={C.papel} />
            <rect x={156} y={358} width={6} height={26} rx={2} fill={C.papel} />
            <rect x={162} y={374} width={7} height={4} fill={C.papel} />
          </g>
        </g>

        {/* CABEZA (placa lima corrida + placa tinta) */}
        <g transform={`translate(${sway} ${rebote}) rotate(${ex.inclinacion + sway * 0.4} 200 290)`}>
          <g transform="translate(8 6)" fill={cLima}>
            <ellipse cx={128} cy={198} rx={14} ry={20} />
            <ellipse cx={272} cy={198} rx={14} ry={20} />
            <rect x={176} y={248} width={48} height={46} rx={10} />
            <ellipse cx={200} cy={190} rx={72} ry={84} />
          </g>
          <ellipse cx={128} cy={198} rx={14} ry={20} fill="none" stroke={cTinta} strokeWidth={3.5} />
          <ellipse cx={272} cy={198} rx={14} ry={20} fill="none" stroke={cTinta} strokeWidth={3.5} />
          <path d="M178 266 L178 290 M222 266 L222 290" stroke={cTinta} strokeWidth={3.5} />
          <ellipse cx={200} cy={190} rx={72} ry={84} fill="none" stroke={cTinta} strokeWidth={3.5} />
          {!silueta && (
            <>
              <path d="M232 116 C268 136 280 192 262 238 C252 262 232 272 214 274 C246 250 258 204 250 164 C246 142 240 128 232 116 Z" fill="url(#dots)" />
              <path d="M130 168 C126 196 132 214 140 224 L148 174 Z" fill="url(#dots)" />
              <path d="M270 168 C274 196 268 214 260 224 L252 174 Z" fill="url(#dots)" />
            </>
          )}
          {/* gorra */}
          <path d="M126 160 C126 104 162 82 200 82 C238 82 274 104 274 160 Z" fill={cTinta} />
          <path d="M116 158 C150 144 250 144 284 158 C286 170 276 177 262 175 C230 166 170 166 138 175 C124 177 114 170 116 158 Z" fill={cTinta} />
          <circle cx={200} cy={120} r={13} fill={silueta ? cTinta : sobre === 'lima' ? C.papel : C.lima} />
          {ceja('izq')}
          {ceja('der')}
          {ojoDe('izq')}
          {ojoDe('der')}
          <path d="M198 212 C190 226 190 236 204 236" fill="none" stroke={cTinta} strokeWidth={3.5} strokeLinecap="round" />
          {/* boca DETRÁS del bigote: solo se asoma por abajo */}
          {bocaNode}
          <g transform={`translate(0 ${bigoteDy}) rotate(${ex.bigote.rot} 200 250)`}>
            <path
              d="M146 252 C160 232 186 234 200 244 C214 234 240 232 254 252 C240 260 222 260 200 252 C178 260 160 260 146 252 Z"
              fill={bigoteRelleno}
              stroke={cTinta}
              strokeWidth={3.5}
              strokeLinejoin="round"
            />
            {sobre === 'lima' && !silueta && (
              <path
                d="M146 252 C160 232 186 234 200 244 C214 234 240 232 254 252 C240 260 222 260 200 252 C178 260 160 260 146 252 Z"
                fill="url(#dots)"
                opacity={0.55}
              />
            )}
          </g>
        </g>

        {/* MANOS / POSE */}
        {pose === 'P3' && <Mano x={262} y={262} rot={-18} escala={1.25} sobre={sobre} />}
        {pose === 'P2' && <Mano x={318} y={300} rot={-8} escala={1.9} sobre={sobre} punta />}
        {pose === 'P6' && (
          <g>
            <Mano x={120} y={352} rot={80} escala={1.4} sobre={sobre} />
            <Mano x={280} y={352} rot={-80} escala={1.4} sobre={sobre} />
          </g>
        )}
        {children}
      </svg>
    </div>
  );
};
