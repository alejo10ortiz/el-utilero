import React from 'react';
import { interpolate, useCurrentFrame, Easing } from 'remotion';
import { C, FONT } from '../../config/brand';
import { rng } from '../lib/anim';
import { Cinta } from './Cinta';
import { Sfx } from './Sfx';
import { Mano } from './Utilero';

/** Puerta + camerino en coordenadas locales 640 × 1440 (§3.1). */
export const CAMERINO_W = 640;
export const CAMERINO_H = 1440;
const DOOR = { x: 20, y: 20, w: 600, h: 1400 };

/* ───────── Línea de tiempo A08 (§5.2): llave 6 f → clic → 15° 6 f → pausa 4 f → 100° 8 f ───────── */

export type Apertura = {
  angulo: number; // grados
  llave: number; // 0..1 giro de la llave
  luz: number; // 0..1
  clic: boolean;
};

export const apertura = (frame: number, delay = 0, hasta: 'entreabierto' | 'abierto' = 'abierto'): Apertura => {
  const f = frame - delay;
  const llave = interpolate(f, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const a15 = interpolate(f, [6, 12], [0, 15], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const a100 =
    hasta === 'abierto'
      ? interpolate(f, [16, 24], [0, 85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
      : 0;
  const angulo = a15 + a100;
  const luz = interpolate(angulo, [0, 15, 100], [0, 0.55, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return { angulo, llave, luz, clic: f >= 6 };
};

/** Sonidos de A08 para colgar en cualquier escena. */
export const SonidosApertura: React.FC<{ delay?: number; hasta?: 'entreabierto' | 'abierto' }> = ({ delay = 0, hasta = 'abierto' }) => (
  <>
    <Sfx name="keys" at={delay} volume={0.7} />
    <Sfx name="lock" at={delay + 6} volume={0.9} />
    <Sfx name="creak" at={delay + 6} volume={0.7} />
    {hasta === 'abierto' && <Sfx name="creak" at={delay + 16} volume={0.6} />}
  </>
);

/* ───────── Puerta de camerino (BRAND.md §3.1) ───────── */

/** Panel realzado de puerta: marco oscuro, relieve con luz arriba-izquierda y sombra abajo-derecha. */
const PanelRealzado: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={C.metalSombra} />
    <rect x={x + 12} y={y + 12} width={w - 24} height={h - 24} fill={C.metal} />
    <path d={`M${x + 12} ${y + h - 12} V${y + 12} H${x + w - 12}`} fill="none" stroke={C.metalLuz} strokeWidth={5} />
    <path d={`M${x + w - 12} ${y + 12} V${y + h - 12} H${x + 12}`} fill="none" stroke={C.tinta} strokeWidth={5} opacity={0.4} />
  </g>
);

export const Puerta: React.FC<{ numero: string; tema?: string; cintaDelay?: number; rotulo?: string }> = ({ numero, tema, cintaDelay, rotulo = 'LOCAL' }) => {
  const r = rng(42);
  const veta = Array.from({ length: 22 }).map(() => ({ x: 20 + r() * 560, y1: r() * 300, y2: 700 + r() * 700, w: 1 + r() * 2 }));
  const rayones = Array.from({ length: 14 }).map(() => {
    const x = 40 + r() * 520;
    const y = 40 + r() * 1300;
    const len = 30 + r() * 120;
    const ang = (r() - 0.5) * 1.2;
    return { x, y, x2: x + Math.cos(ang) * len, y2: y + Math.sin(ang) * len, w: 1 + r() * 2.2, claro: r() > 0.5 };
  });
  // pintura descascarada: parches donde asoma la madera
  const pelados = Array.from({ length: 11 }).map(() => {
    const lado = r();
    const x = lado < 0.4 ? 6 + r() * 60 : lado < 0.7 ? 520 + r() * 70 : 30 + r() * 540;
    const y = lado < 0.7 ? 300 + r() * 1000 : 1180 + r() * 40;
    return { x, y, w: 10 + r() * 34, h: 6 + r() * 20, rot: r() * 60 - 30 };
  });
  const oxido = Array.from({ length: 30 }).map(() => ({ x: 6 + r() * 580, y: 900 + r() * 480, r: 1 + r() * 4, o: 0.15 + r() * 0.3 }));
  const rotuloSize = Math.min(150, 405 / (rotulo.length * 0.37));
  const filas = Array.from({ length: 11 }).map((_, i) => i + 1);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width={DOOR.w} height={DOOR.h} viewBox={`0 0 ${DOOR.w} ${DOOR.h}`} style={{ position: 'absolute', inset: 0 }}>
        <rect width={DOOR.w} height={DOOR.h} fill={C.metal} />
        {veta.map((v, i) => <line key={i} x1={v.x} y1={v.y1} x2={v.x + 6} y2={v.y2} stroke={C.metalSombra} strokeWidth={v.w} opacity={0.1} />)}
        {/* bastidor de la hoja */}
        <rect x={14} y={14} width={DOOR.w - 28} height={DOOR.h - 28} fill="none" stroke={C.metalSombra} strokeWidth={7} />
        <path d={`M14 ${DOOR.h - 14} V14 H${DOOR.w - 14}`} fill="none" stroke={C.metalLuz} strokeWidth={4} />
        <rect x={0} y={0} width={DOOR.w} height={DOOR.h} fill="none" stroke={C.metalSombra} strokeWidth={6} />

        {/* paneles realzados (a la izquierda); el herraje va en el larguero derecho */}
        <PanelRealzado x={64} y={462} w={350} h={440} />
        <PanelRealzado x={64} y={942} w={350} h={268} />

        {/* rótulo esmaltado */}
        <g transform="translate(80 52)">
          <rect width={440} height={206} rx={12} fill={C.tinta} />
          <rect x={8} y={8} width={424} height={190} rx={7} fill={C.papel} />
          <rect x={8} y={8} width={424} height={16} fill={C.lima} />
          <text x={220} y={44 + rotuloSize * 0.735} textAnchor="middle" fontFamily={FONT.grito} fontSize={rotuloSize} fill={C.tinta}>{rotulo}</text>
          <text x={220} y={184} textAnchor="middle" fontFamily={FONT.maquina} fontSize={22} letterSpacing={9} fill={C.grisArchivo}>VESTUARIO</text>
          {[[22, 38], [418, 38], [22, 182], [418, 182]].map(([cx, cy], i) => (
            <g key={i}><circle cx={cx} cy={cy} r={6.5} fill="#8D9486" stroke={C.tinta} strokeWidth={2} /><line x1={cx - 3.5} y1={cy - 2} x2={cx + 3.5} y2={cy + 2} stroke={C.tinta} strokeWidth={1.6} /></g>
          ))}
        </g>

        {/* placa de número, como las de habitación */}
        <g transform="translate(210 350)">
          <rect width={180} height={84} rx={7} fill={C.tinta} stroke={C.metalSombra} strokeWidth={3} />
          <rect x={6} y={6} width={168} height={72} rx={4} fill="none" stroke={C.tiza} strokeWidth={1.5} opacity={0.5} />
          <text x={90} y={66} textAnchor="middle" fontFamily={FONT.grito} fontSize={72} fill={C.tiza} letterSpacing={4} style={{ filter: 'url(#chalk)' }}>{numero}</text>
        </g>

        {/* hoja de alineación pegada con cinta: solo números, sin nombres ni escudos */}
        <g transform="translate(96 500) rotate(-2.4)">
          <rect width={258} height={376} fill={C.ficha} stroke={C.tinta} strokeWidth={1.5} />
          <text x={129} y={38} textAnchor="middle" fontFamily={FONT.maquina} fontSize={24} letterSpacing={5} fill={C.tinta}>ALINEACIÓN</text>
          <line x1={16} y1={52} x2={242} y2={52} stroke={C.tinta} strokeWidth={2} />
          {filas.map((n) => (
            <g key={n}>
              <text x={22} y={62 + n * 27} fontFamily={FONT.maquina} fontSize={21} fill={C.tinta}>{String(n).padStart(2, ' ')}</text>
              <line x1={64} y1={62 + n * 27 - 4} x2={238} y2={62 + n * 27 - 4} stroke={C.tinta} strokeWidth={1} strokeDasharray="2 5" opacity={0.55} />
            </g>
          ))}
          <rect x={-18} y={-10} width={92} height={30} fill={C.cinta} opacity={0.92} transform="rotate(-8 28 5)" />
          <rect x={196} y={-8} width={92} height={30} fill={C.cinta} opacity={0.92} transform="rotate(7 242 7)" />
        </g>

        {/* herraje: escudo de cerradura (aquí entra la llave) + manija de palanca */}
        <g>
          <rect x={420} y={770} width={60} height={190} rx={14} fill={C.kraftOscuro} stroke={C.tinta} strokeWidth={3.5} />
          <rect x={428} y={778} width={12} height={174} rx={6} fill={C.kraft} opacity={0.7} />
          <circle cx={450} cy={860} r={10} fill={C.tinta} />
          <rect x={447} y={862} width={6} height={24} rx={2} fill={C.tinta} />
          <rect x={344} y={788} width={118} height={26} rx={13} fill="#8D9486" stroke={C.tinta} strokeWidth={3.5} />
          <rect x={352} y={793} width={96} height={6} rx={3} fill={C.tiza} opacity={0.45} />
          <circle cx={450} cy={801} r={16} fill="#8D9486" stroke={C.tinta} strokeWidth={3.5} />
          {[790, 940].map((cy) => <circle key={cy} cx={450} cy={cy} r={5} fill={C.tinta} />)}
        </g>

        {/* zócalo de acero remachado */}
        <rect x={0} y={1236} width={DOOR.w} height={164} fill="#6B7468" stroke={C.tinta} strokeWidth={4} />
        <rect x={0} y={1236} width={DOOR.w} height={10} fill={C.tiza} opacity={0.25} />
        {[0, 1].flatMap((fila) => Array.from({ length: 10 }).map((_, i) => (
          <circle key={`${fila}-${i}`} cx={30 + i * 60} cy={fila ? 1380 : 1262} r={6} fill="#8D9486" stroke={C.tinta} strokeWidth={2} />
        )))}
        {[110, 330, 470].map((x, i) => <line key={i} x1={x} y1={1290 + i * 18} x2={x + 90} y2={1284 + i * 22} stroke={C.tiza} strokeWidth={2} opacity={0.3} />)}

        {/* desgaste */}
        {pelados.map((p, i) => <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} fill={C.kraft} opacity={0.75} transform={`rotate(${p.rot} ${p.x} ${p.y})`} />)}
        {rayones.map((s, i) => (
          <line key={i} x1={s.x} y1={s.y} x2={s.x2} y2={s.y2} stroke={s.claro ? C.metalLuz : C.metalSombra} strokeWidth={s.w} opacity={0.55} strokeLinecap="round" />
        ))}
        {oxido.map((o, i) => <circle key={i} cx={o.x} cy={o.y} r={o.r} fill={C.kraftOscuro} opacity={o.o} />)}
        <rect x={0} y={DOOR.h - 70} width={DOOR.w} height={70} fill="url(#dots)" opacity={0.12} />
      </svg>
      {tema && <Cinta texto={tema} x={DOOR.w / 2} y={300} rot={-4} size={50} delay={cintaDelay ?? -999} sonido={false} />}
    </div>
  );
};

const Reverso: React.FC = () => (
  <div style={{ position: 'absolute', inset: 0, background: C.metalBase }}>
    <svg width={DOOR.w} height={DOOR.h} style={{ position: 'absolute', inset: 0 }}>
      <rect x={20} y={20} width={DOOR.w - 40} height={DOOR.h - 40} fill="none" stroke={C.metalSombra} strokeWidth={10} />
      <rect x={60} y={120} width={DOOR.w - 120} height={60} fill={C.metalSombra} />
      <rect x={60} y={DOOR.h - 220} width={DOOR.w - 120} height={60} fill={C.metalSombra} />
      <rect x={0} y={0} width={DOOR.w} height={DOOR.h} fill="url(#dots)" opacity={0.18} />
    </svg>
  </div>
);

/* ───────── Interior: el camerino (BRAND.md §3.1) ───────── */

const Camiseta: React.FC<{ x: number; y: number; fondo: string; trazo: string; num: string; rot?: number }> = ({ x, y, fondo, trazo, num, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot} 70 0)`}>
    <circle cx={70} cy={-18} r={7} fill="#8D9486" stroke={C.tinta} strokeWidth={3} />
    <path d="M70 -12 V4" stroke={C.tinta} strokeWidth={4} />
    <path d="M32 6 L108 6 L146 40 L122 72 L108 60 L108 170 L32 170 L32 60 L18 72 L-6 40 Z" fill={fondo} stroke={C.tinta} strokeWidth={4} strokeLinejoin="round" transform="translate(0 0)" />
    <path d="M52 6 Q70 26 88 6" fill="none" stroke={C.tinta} strokeWidth={4} />
    <path d="M-6 40 L18 72 M146 40 L122 72" stroke={trazo} strokeWidth={9} />
    <text x={70} y={138} textAnchor="middle" fontFamily={FONT.grito} fontSize={92} fill={trazo}>{num}</text>
  </g>
);

const Guayo: React.FC<{ x: number; y: number; flip?: boolean; esc?: number }> = ({ x, y, flip = false, esc = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -esc : esc} ${esc})`}>
    <path d="M0 0 C0 -38 18 -64 48 -70 C68 -73 84 -56 88 -42 C108 -38 130 -28 134 -4 C136 12 124 20 112 20 L10 20 C3 20 0 12 0 0 Z" fill={C.papel} stroke={C.tinta} strokeWidth={4} strokeLinejoin="round" />
    <path d="M6 -4 C8 -34 22 -56 46 -62 C28 -40 24 -18 26 4 Z" fill="url(#dots)" opacity={0.7} />
    <path d="M62 -54 l18 -6 M72 -44 l18 -6 M82 -34 l18 -6" stroke={C.tinta} strokeWidth={4} strokeLinecap="round" />
    <rect x={0} y={20} width={114} height={11} fill={C.tinta} />
    {[16, 46, 78, 104].map((cx) => <path key={cx} d={`M${cx - 6} 31 l-5 17 h22 l-5 -17 Z`} fill={C.tinta} />)}
  </g>
);

const Interior: React.FC<{ luz: number; children?: React.ReactNode }> = ({ luz, children }) => {
  const frame = useCurrentFrame();
  const bombilla = Math.sin(frame / 20) * 1.6;
  return (
    <div style={{ position: 'absolute', left: DOOR.x, top: DOOR.y, width: DOOR.w, height: DOOR.h, background: C.tinta, overflow: 'hidden' }}>
      <svg width={DOOR.w} height={DOOR.h} style={{ position: 'absolute', inset: 0 }}>
        {/* pared: pintura crema gastada arriba, azulejo blanco abajo */}
        <rect x={0} y={0} width={DOOR.w} height={760} fill={C.cinta} />
        {[70, 180, 330, 470, 560].map((x, i) => <rect key={x} x={x} y={0} width={2 + (i % 2)} height={760} fill={C.kraftOscuro} opacity={0.08} />)}
        <rect x={0} y={0} width={DOOR.w} height={56} fill={C.tinta} />
        <rect x={0} y={760} width={DOOR.w} height={206} fill={C.ficha} />
        {Array.from({ length: 16 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={766} x2={i * 40} y2={966} stroke={C.lineaFicha} strokeWidth={2} />)}
        {[806, 846, 886, 926].map((y) => <line key={y} x1={0} y1={y} x2={DOOR.w} y2={y} stroke={C.lineaFicha} strokeWidth={2} />)}
        <rect x={0} y={752} width={DOOR.w} height={14} fill={C.kraftOscuro} stroke={C.tinta} strokeWidth={3} />

        {/* lámpara colgante */}
        <g transform={`translate(300 56) rotate(${bombilla} 0 0)`}>
          <line x1={0} y1={0} x2={0} y2={62} stroke={C.tinta} strokeWidth={4} />
          <path d="M-58 112 L-18 62 H18 L58 112 Z" fill={C.kraftOscuro} stroke={C.tinta} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={0} cy={116} r={17} fill={C.lima} opacity={0.5 + 0.5 * luz} />
        </g>

        {/* pizarra táctica de pared */}
        <g transform="translate(78 150)">
          <rect width={444} height={296} fill={C.kraft} stroke={C.tinta} strokeWidth={4} />
          <rect x={12} y={12} width={420} height={270} fill={C.pizarra} />
          <g stroke={C.tiza} strokeWidth={3} fill="none" opacity={0.92}>
            <rect x={34} y={34} width={376} height={226} />
            <line x1={222} y1={34} x2={222} y2={260} />
            <circle cx={222} cy={147} r={38} />
            <rect x={34} y={96} width={62} height={102} />
            <rect x={348} y={96} width={62} height={102} />
            {[[88, 70], [150, 120], [150, 190], [220, 90], [284, 150], [330, 110]].map(([cx, cy], i) => (
              i % 2 ? <circle key={i} cx={cx} cy={cy} r={12} stroke={C.lima} strokeWidth={5} /> : <path key={i} d={`M${cx - 10} ${cy - 10} L${cx + 10} ${cy + 10} M${cx + 10} ${cy - 10} L${cx - 10} ${cy + 10}`} strokeWidth={5} />
            ))}
            <path d="M150 124 C190 100 230 96 262 92" strokeDasharray="6 7" />
            <path d="M284 138 C310 124 330 118 330 118" strokeDasharray="6 7" stroke={C.lima} />
          </g>
          <rect x={12} y={284} width={420} height={10} fill={C.kraftOscuro} stroke={C.tinta} strokeWidth={2} />
          <rect x={64} y={277} width={34} height={7} rx={2} fill={C.tiza} />
        </g>

        {/* perchas con camisetas numeradas (genéricas: sin escudos ni marcas) */}
        <rect x={20} y={492} width={560} height={10} fill={C.kraftOscuro} stroke={C.tinta} strokeWidth={2.5} />
        <Camiseta x={34} y={500} fondo={C.tinta} trazo={C.lima} num="1" rot={-1.5} />
        <Camiseta x={172} y={500} fondo={C.lima} trazo={C.tinta} num="9" rot={1} />
        <Camiseta x={310} y={500} fondo={C.papel} trazo={C.tinta} num="10" rot={-1} />
        <Camiseta x={448} y={500} fondo={C.tinta} trazo={C.tiza} num="4" rot={1.5} />

        {/* banca de madera */}
        <rect x={22} y={934} width={556} height={36} fill={C.kraft} stroke={C.tinta} strokeWidth={4} />
        <rect x={22} y={934} width={556} height={9} fill={C.kraftOscuro} opacity={0.55} />
        <rect x={64} y={970} width={22} height={256} fill={C.kraftOscuro} stroke={C.tinta} strokeWidth={4} />
        <rect x={514} y={970} width={22} height={256} fill={C.kraftOscuro} stroke={C.tinta} strokeWidth={4} />
        <rect x={64} y={1090} width={472} height={14} fill={C.kraftOscuro} stroke={C.tinta} strokeWidth={3} />

        {/* sobre la banca: balón y toalla (el objeto del día va al centro) */}
        <g transform="translate(96 894)">
          <circle r={40} fill={C.papel} stroke={C.tinta} strokeWidth={4.5} />
          <polygon points="0,-17 16,-5 10,14 -10,14 -16,-5" fill={C.tinta} />
          <path d="M0 -17 V-40 M16 -5 L38 -12 M10 14 L24 33 M-10 14 L-24 33 M-16 -5 L-38 -12" stroke={C.tinta} strokeWidth={4} fill="none" />
        </g>
        <g transform="translate(470 904)">
          <rect x={-20} y={-34} width={118} height={34} rx={14} fill={C.papel} stroke={C.tinta} strokeWidth={4} />
          <rect x={-20} y={-20} width={118} height={8} fill={C.lima} />
        </g>

        {/* debajo de la banca: guayos, canilleras y bolso */}
        <Guayo x={120} y={1176} esc={0.95} />
        <Guayo x={300} y={1186} flip esc={0.9} />
        <g transform="translate(206 1090) rotate(8)"><rect width={34} height={96} rx={12} fill={C.lima} stroke={C.tinta} strokeWidth={4} /></g>
        <g transform="translate(250 1096) rotate(-6)"><rect width={34} height={96} rx={12} fill={C.papel} stroke={C.tinta} strokeWidth={4} /></g>
        <g transform="translate(388 1128)">
          <path d="M0 22 C0 0 24 -6 60 -6 H120 C150 -6 166 6 166 28 V98 H0 Z" fill={C.tinta} />
          <rect x={0} y={44} width={166} height={14} fill={C.lima} />
          <path d="M26 -4 C34 -46 132 -46 140 -4" fill="none" stroke={C.tinta} strokeWidth={9} />
        </g>

        {/* piso */}
        <rect x={0} y={1250} width={DOOR.w} height={150} fill={C.tinta} />
        <path d="M0 1262 H600" stroke={C.metalSombra} strokeWidth={4} />
        <rect x={0} y={1250} width={DOOR.w} height={150} fill="url(#dotsLima)" opacity={0.1} />
      </svg>
      {/* luz cálida de la lámpara + derrame lima por la rendija */}
      <div style={{ position: 'absolute', inset: 0, opacity: luz, background: 'radial-gradient(ellipse 72% 62% at 50% 12%, rgba(255,247,214,0.55) 0%, rgba(233,223,196,0.22) 40%, rgba(22,19,15,0) 80%)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: luz * 0.9, background: 'linear-gradient(90deg, rgba(200,255,46,0) 0%, rgba(200,255,46,0.3) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 48%, rgba(22,19,15,0) 55%, rgba(22,19,15,0.55) 100%)', opacity: 0.9 - 0.4 * luz }} />
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
    </div>
  );
};

/* ───────── Llavero y mano (estado `llave`) ───────── */

export const ManoLlave: React.FC<{ entrada: number; giro: number; x?: number; y?: number }> = ({ entrada, giro, x = 470, y = 880 }) => {
  const frame = useCurrentFrame();
  const dx = (1 - entrada) * 520;
  const swing = Math.sin(frame * 0.8) * 10 * (1 - giro * 0.6);
  const rot = giro * 90;
  return (
    <svg
      width={CAMERINO_W + 400}
      height={CAMERINO_H}
      viewBox={`0 0 ${CAMERINO_W + 400} ${CAMERINO_H}`}
      style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}
    >
      <g transform={`translate(${x + dx} ${y})`}>
        {/* antebrazo */}
        <path d="M120 -60 L520 -110 L520 120 L120 70 Z" fill={C.tinta} />
        <path d="M200 -50 L200 60" stroke={C.lima} strokeWidth={16} />
        <path d="M250 -56 L250 66" stroke={C.lima} strokeWidth={16} />
        {/* llaves colgando del anillo */}
        <g transform={`translate(70 40) rotate(${swing})`}>
          <circle cx={0} cy={0} r={22} fill="none" stroke={C.tinta} strokeWidth={6} />
          {[-1, 1].map((s, i) => (
            <g key={i} transform={`rotate(${s * 12 + swing * 0.5})`}>
              <rect x={-5} y={20} width={10} height={70} fill={C.tinta} />
              <circle cx={0} cy={96} r={10} fill="none" stroke={C.tinta} strokeWidth={4} />
            </g>
          ))}
        </g>
        {/* llave en la cerradura */}
        <g transform={`translate(0 0) rotate(${rot})`}>
          <rect x={-80} y={-7} width={110} height={14} fill={C.tinta} />
          <rect x={-80} y={7} width={14} height={20} fill={C.tinta} />
          <rect x={-54} y={7} width={11} height={14} fill={C.tinta} />
          <circle cx={46} cy={0} r={26} fill={C.tinta} />
          <polygon points="46,-12 57,-4 53,9 39,9 35,-4" fill={C.lima} />
        </g>
        <Mano x={100} y={6} rot={90} escala={1.7} />
      </g>
    </svg>
  );
};

/* ───────── Camerino ───────── */

export const Camerino: React.FC<{
  x?: number;
  y?: number;
  escala?: number;
  numero?: string;
  tema?: string;
  angulo?: number;
  luz?: number;
  /** Si es true, muestra el objeto en el interior (children). */
  children?: React.ReactNode;
  cintaDelay?: number;
  perspectiva?: number;
  sombra?: boolean;
  /** Rótulo esmaltado de la puerta: LOCAL · VISITANTE · ÁRBITROS. */
  rotulo?: string;
}> = ({ x = 0, y = 0, escala = 1, numero = '001', tema, angulo = 0, luz = 0, children, cintaDelay, perspectiva = 2600, sombra = true, rotulo = 'LOCAL' }) => {
  const mostrandoReverso = angulo > 90;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: CAMERINO_W,
        height: CAMERINO_H,
        transform: `scale(${escala})`,
        transformOrigin: '0 0',
        perspective: perspectiva,
        perspectiveOrigin: '50% 50%',
      }}
    >
      {sombra && (
        <div style={{ position: 'absolute', left: -20, top: 30, width: CAMERINO_W + 40, height: CAMERINO_H, background: 'rgba(22,19,15,0.35)', filter: 'blur(26px)' }} />
      )}
      {/* marco */}
      <div style={{ position: 'absolute', inset: 0, background: C.kraftOscuro, boxShadow: `inset 0 0 0 5px ${C.tinta}` }}>
        {/* bisagras */}
        {[230, 1100].map((yy) => (
          <div key={yy} style={{ position: 'absolute', left: 0, top: yy, width: 26, height: 120, background: C.metalSombra, boxShadow: `inset 0 0 0 3px ${C.tinta}` }}>
            {[18, 90].map((ry) => (
              <div key={ry} style={{ position: 'absolute', left: 8, top: ry, width: 10, height: 10, borderRadius: 5, background: '#8D9486' }} />
            ))}
          </div>
        ))}
      </div>
      <Interior luz={luz}>{children}</Interior>
      {/* puerta: bisagra a la izquierda, gira hacia el espectador */}
      <div
        style={{
          position: 'absolute',
          left: DOOR.x,
          top: DOOR.y,
          width: DOOR.w,
          height: DOOR.h,
          transformOrigin: '0 50%',
          transform: `rotateY(${-angulo}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', display: mostrandoReverso ? 'none' : 'block' }}>
          <Puerta numero={numero} tema={tema} cintaDelay={cintaDelay} rotulo={rotulo} />
        </div>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', display: mostrandoReverso ? 'block' : 'none', transform: 'rotateY(180deg)' }}>
          <Reverso />
        </div>
      </div>
    </div>
  );
};
