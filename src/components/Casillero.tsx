import React from 'react';
import { interpolate, useCurrentFrame, Easing } from 'remotion';
import { C, FONT } from '../../config/brand';
import { rng } from '../lib/anim';
import { Cinta } from './Cinta';
import { Sfx } from './Sfx';
import { Mano } from './Utilero';

/** Casillero en coordenadas locales 640 × 1440 (§3.1). */
export const CASILLERO_W = 640;
export const CASILLERO_H = 1440;
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

/* ───────── Puerta ───────── */

export const Puerta: React.FC<{ numero: string; tema?: string; cintaDelay?: number }> = ({ numero, tema, cintaDelay }) => {
  const r = rng(42);
  const rayones = Array.from({ length: 14 }).map(() => {
    const x = 40 + r() * 520;
    const y = 40 + r() * 1300;
    const len = 30 + r() * 120;
    const ang = (r() - 0.5) * 1.2;
    return { x, y, x2: x + Math.cos(ang) * len, y2: y + Math.sin(ang) * len, w: 1 + r() * 2.2, claro: r() > 0.5 };
  });
  const oxido = Array.from({ length: 34 }).map(() => {
    const lado = r();
    const x = lado < 0.5 ? 6 + r() * 40 : lado < 0.8 ? 560 + r() * 34 : 30 + r() * 540;
    const y = lado < 0.8 ? 900 + r() * 480 : 1340 + r() * 50;
    return { x, y, r: 1 + r() * 5, o: 0.18 + r() * 0.3 };
  });
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width={DOOR.w} height={DOOR.h} viewBox={`0 0 ${DOOR.w} ${DOOR.h}`} style={{ position: 'absolute', inset: 0 }}>
        <rect width={DOOR.w} height={DOOR.h} fill={C.metal} />
        {/* panel estampado */}
        <rect x={14} y={14} width={DOOR.w - 28} height={DOOR.h - 28} fill="none" stroke={C.metalSombra} strokeWidth={7} />
        <path d={`M14 ${DOOR.h - 14} V14 H${DOOR.w - 14}`} fill="none" stroke={C.metalLuz} strokeWidth={4} />
        <rect x={0} y={0} width={DOOR.w} height={DOOR.h} fill="none" stroke={C.metalSombra} strokeWidth={6} />
        {/* 3 grupos de 6 ranuras de ventilación */}
        {[0, 1, 2].map((g) => (
          <g key={g} transform={`translate(${(DOOR.w - 340) / 2} ${58 + g * 128})`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <g key={i}>
                <rect x={0} y={i * 15} width={340} height={8} rx={2} fill={C.tinta} />
                <rect x={0} y={i * 15 + 8} width={340} height={2.5} fill={C.metalLuz} opacity={0.6} />
              </g>
            ))}
          </g>
        ))}
        {/* placa de número remachada */}
        <g transform={`translate(${DOOR.w / 2 - 120} 470)`}>
          <rect x={0} y={0} width={240} height={150} fill="#6B7468" stroke={C.tinta} strokeWidth={4} />
          <rect x={6} y={6} width={228} height={138} fill="none" stroke={C.tiza} strokeWidth={1.4} opacity={0.35} />
          {[[14, 14], [226, 14], [14, 136], [226, 136]].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={6.5} fill="#8D9486" stroke={C.tinta} strokeWidth={2} />
              <circle cx={cx - 1.5} cy={cy - 1.5} r={2} fill={C.tiza} opacity={0.6} />
            </g>
          ))}
          <text x={120} y={122} textAnchor="middle" fontFamily={FONT.grito} fontSize={128} fill={C.tiza} style={{ filter: 'url(#chalk)' }}>
            {numero}
          </text>
        </g>
        {/* manija de cerrojo + candado viejo */}
        <g transform="translate(470 770)">
          <rect x={0} y={0} width={64} height={250} rx={8} fill={C.metalSombra} stroke={C.tinta} strokeWidth={3} />
          <rect x={12} y={56} width={40} height={96} rx={10} fill="#8D9486" stroke={C.tinta} strokeWidth={3} />
          <rect x={20} y={64} width={14} height={80} rx={6} fill={C.tiza} opacity={0.35} />
          <g transform="translate(-6 160)">
            <path d="M18 8 V-14 C18 -44 66 -44 66 -14 V8" fill="none" stroke={C.grisArchivo} strokeWidth={10} strokeLinecap="round" />
            <rect x={6} y={6} width={72} height={70} rx={9} fill={C.kraftOscuro} stroke={C.tinta} strokeWidth={3.5} />
            <circle cx={42} cy={36} r={8} fill={C.tinta} />
            <path d="M42 40 L42 58" stroke={C.tinta} strokeWidth={6} />
            <path d="M12 12 H72" stroke={C.kraft} strokeWidth={4} opacity={0.7} />
          </g>
        </g>
        {/* desgaste */}
        {rayones.map((s, i) => (
          <line key={i} x1={s.x} y1={s.y} x2={s.x2} y2={s.y2} stroke={s.claro ? C.metalLuz : C.metalSombra} strokeWidth={s.w} opacity={0.55} strokeLinecap="round" />
        ))}
        {oxido.map((o, i) => (
          <circle key={i} cx={o.x} cy={o.y} r={o.r} fill={C.kraftOscuro} opacity={o.o} />
        ))}
        <rect x={0} y={DOOR.h - 70} width={DOOR.w} height={70} fill="url(#dots)" opacity={0.12} />
        {/* chorreado bajo las ranuras */}
        {[120, 300, 470].map((x, i) => (
          <rect key={i} x={x} y={430} width={3} height={50 + i * 20} fill={C.metalSombra} opacity={0.4} />
        ))}
      </svg>
      {tema && <Cinta texto={tema} x={DOOR.w / 2} y={452} rot={-4} size={50} delay={cintaDelay ?? -999} sonido={false} />}
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

/* ───────── Interior ───────── */

const Interior: React.FC<{ luz: number; children?: React.ReactNode }> = ({ luz, children }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 20) * 1.6;
  return (
    <div style={{ position: 'absolute', left: DOOR.x, top: DOOR.y, width: DOOR.w, height: DOOR.h, background: C.tinta, overflow: 'hidden' }}>
      {/* luz cálida desde arriba + borde lima por la rendija */}
      <div
        style={{
          position: 'absolute', inset: 0,
          opacity: luz,
          background: `radial-gradient(ellipse 70% 62% at 50% 22%, rgba(236,229,211,0.55) 0%, rgba(233,223,196,0.25) 38%, rgba(22,19,15,0) 78%)`,
        }}
      />
      <div style={{ position: 'absolute', inset: 0, opacity: luz * 0.9, background: `linear-gradient(90deg, rgba(200,255,46,0.0) 0%, rgba(200,255,46,0.38) 100%)` }} />
      <svg width={DOOR.w} height={DOOR.h} style={{ position: 'absolute', inset: 0 }}>
        {/* repisa */}
        <rect x={0} y={190} width={DOOR.w} height={10} fill={C.metalSombra} />
        {/* gancho + toalla */}
        <g transform={`translate(110 220) rotate(${sway} 0 0)`}>
          <path d="M0 -30 V10 C0 26 22 26 22 10" fill="none" stroke="#8D9486" strokeWidth={8} strokeLinecap="round" />
          <path d="M-34 20 H56 V300 C40 312 20 296 0 308 C-20 296 -40 312 -34 300 Z" fill={C.papel} stroke={C.tinta} strokeWidth={3.5} />
          <rect x={-34} y={90} width={90} height={14} fill={C.sello} opacity={0.0} />
          <path d="M-34 70 H56" stroke={C.sello} strokeWidth={9} opacity={0.9} />
          <path d="M-34 96 H56" stroke={C.tinta} strokeWidth={2} opacity={0.4} />
        </g>
        {/* piso */}
        <rect x={0} y={DOOR.h - 40} width={DOOR.w} height={40} fill={C.metalSombra} opacity={0.7} />
      </svg>
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
      width={CASILLERO_W + 400}
      height={CASILLERO_H}
      viewBox={`0 0 ${CASILLERO_W + 400} ${CASILLERO_H}`}
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

/* ───────── Casillero ───────── */

export const Casillero: React.FC<{
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
}> = ({ x = 0, y = 0, escala = 1, numero = '001', tema, angulo = 0, luz = 0, children, cintaDelay, perspectiva = 2600, sombra = true }) => {
  const mostrandoReverso = angulo > 90;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: CASILLERO_W,
        height: CASILLERO_H,
        transform: `scale(${escala})`,
        transformOrigin: '0 0',
        perspective: perspectiva,
        perspectiveOrigin: '50% 50%',
      }}
    >
      {sombra && (
        <div style={{ position: 'absolute', left: -20, top: 30, width: CASILLERO_W + 40, height: CASILLERO_H, background: 'rgba(22,19,15,0.35)', filter: 'blur(26px)' }} />
      )}
      {/* marco */}
      <div style={{ position: 'absolute', inset: 0, background: C.metalBase, boxShadow: `inset 0 0 0 5px ${C.metalSombra}` }}>
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
          <Puerta numero={numero} tema={tema} cintaDelay={cintaDelay} />
        </div>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', display: mostrandoReverso ? 'block' : 'none', transform: 'rotateY(180deg)' }}>
          <Reverso />
        </div>
      </div>
    </div>
  );
};
