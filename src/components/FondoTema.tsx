import React from 'react';
import { C } from '../../config/brand';
import { hash } from '../lib/ease';
import type { Tema } from '../lib/tema';

/**
 * Superficies de mesa de los TEMAS (BRAND.md §2.6). Se usan desde <Fondo> cuando el tema no es el clásico.
 * Cada textura vive en coordenadas de PANTALLA (0–1080 × 0–1920) dentro de un grupo desplazado 240 px,
 * porque el fondo sobra 240 px por lado para que la cámara pueda moverse sin enseñar bordes.
 * Nunca color plano: mancha de baja frecuencia + fibra/trama propia + viñeta.
 */

type Rgb = [number, number, number];

/** Ruido fractal teñido (multiplica sobre claros, aclara sobre oscuros). */
const Ruido: React.FC<{
  id: string; w: number; h: number; freq: string; seed: number; rgb: Rgb; a: number; b: number; opacity: number; oct?: number;
}> = ({ id, w, h, freq, seed, rgb, a, b, opacity, oct = 3 }) => (
  <>
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={oct} seed={seed} />
      <feColorMatrix type="matrix" values={`0 0 0 0 ${rgb[0]}  0 0 0 0 ${rgb[1]}  0 0 0 0 ${rgb[2]}  0 0 0 ${a} ${b}`} />
    </filter>
    <rect width={w} height={h} filter={`url(#${id})`} opacity={opacity} />
  </>
);

/* ───────────── papel claro ───────────── */

/** Cuaderno cuadriculado con espiral a la izquierda y margen doble. */
const Cuadriculado: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const agujeros = Array.from({ length: 30 }).map((_, i) => 30 + i * 70);
  return (
    <>
      <rect width={w} height={h} fill={C.cuaderno} />
      <Ruido id="ft-cu-blot" w={w} h={h} freq="0.0045 0.006" seed={4} rgb={[0.35, 0.3, 0.22]} a={1.4} b={-0.6} opacity={0.4} oct={4} />
      <defs>
        <pattern id="ft-cu-grid" width={56} height={56} patternUnits="userSpaceOnUse" x={240 + 4} y={240 + 10}>
          <path d="M0 0.5 H56 M0.5 0 V56" stroke={C.lineaCuaderno} strokeWidth={2.2} fill="none" opacity={0.5} />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#ft-cu-grid)" />
      <g transform="translate(240 240)">
        {/* margen doble de cuaderno (azul: el rojo es solo de sellos) */}
        <rect x={142} y={-240} width={3.2} height={2400} fill={C.lineaCuaderno} opacity={0.75} />
        <rect x={152} y={-240} width={2.2} height={2400} fill={C.lineaCuaderno} opacity={0.55} />
        {/* espiral metálico: agujero + vuelta de alambre que lo cruza */}
        {agujeros.map((y, i) => (
          <g key={i}>
            <ellipse cx={46} cy={y} rx={9} ry={7} fill={C.tinta} opacity={0.72} />
            <path d={`M-14 ${y + 12} C8 ${y - 16} 36 ${y - 16} 60 ${y + 4}`} fill="none" stroke="#3E3A34" strokeWidth={9} strokeLinecap="round" />
            <path d={`M-10 ${y + 8} C10 ${y - 12} 34 ${y - 13} 54 ${y + 1}`} fill="none" stroke="#C9C2B2" strokeWidth={2.4} strokeLinecap="round" opacity={0.8} />
          </g>
        ))}
      </g>
    </>
  );
};

/** Papel de estraza: fibras largas, dobleces, cinta de embalar en las esquinas, motas. */
const Kraft: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const sw = w - 480, sh = h - 480; // pantalla visible (el fondo sobra 240 px por lado)
  const motas = Array.from({ length: Math.round((140 * sw * sh) / (1080 * 1920)) }).map((_, i) => ({
    x: hash(i * 3 + 1) * sw, y: hash(i * 5 + 2) * sh, r: 0.8 + hash(i + 9) * 2.2, o: 0.12 + hash(i + 4) * 0.25,
  }));
  return (
    <>
      <rect width={w} height={h} fill={C.kraftClaro} />
      <Ruido id="ft-kr-blot" w={w} h={h} freq="0.007 0.009" seed={12} rgb={[0.45, 0.3, 0.15]} a={2.2} b={-0.95} opacity={0.5} oct={5} />
      <Ruido id="ft-kr-fib" w={w} h={h} freq="0.05 0.07" seed={3} rgb={[0.4, 0.26, 0.11]} a={2.4} b={-1.05} opacity={0.22} oct={4} />
      <g transform="translate(240 240)">
        {motas.map((m, i) => (
          <circle key={i} cx={m.x} cy={m.y} r={m.r} fill={C.tinta} opacity={m.o} />
        ))}
        {/* fibras cortas sueltas del papel de estraza */}
        {Array.from({ length: Math.round((260 * sw * sh) / (1080 * 1920)) }).map((_, i) => {
          const x = hash(i * 7 + 3) * sw, y = hash(i * 11 + 5) * sh, l = 14 + hash(i + 2) * 38, a = hash(i * 3 + 8) * Math.PI;
          return <path key={`f${i}`} d={`M${x} ${y} q${Math.cos(a) * l * 0.5 + 6} ${Math.sin(a) * l * 0.5 - 6} ${Math.cos(a) * l} ${Math.sin(a) * l}`} fill="none" stroke={C.kraftOscuro} strokeWidth={1.5 + hash(i) * 1.5} opacity={0.22 + hash(i + 6) * 0.25} strokeLinecap="round" />;
        })}
        {/* dobleces del papel de envolver (cresta clara + sombra) */}
        {[sh / 3, (sh * 2) / 3].map((y, i) => (
          <g key={i} transform={`rotate(${i ? 0.25 : -0.3} 540 ${y})`}>
            <rect x={-240} y={y} width={1560} height={3} fill={C.cinta} opacity={0.3} />
            <rect x={-240} y={y + 3} width={1560} height={4} fill={C.tinta} opacity={0.09} />
          </g>
        ))}
        <g transform={`rotate(-0.2 ${sw / 2} ${sh / 2})`}>
          <rect x={sw / 2} y={-240} width={3} height={2400} fill={C.cinta} opacity={0.26} />
          <rect x={sw / 2 + 3} y={-240} width={4} height={2400} fill={C.tinta} opacity={0.08} />
        </g>
        {/* cinta de embalar: arriba a la izquierda y abajo a la derecha */}
        {[{ x: 70, y: 70, r: -34, w: 420 }, { x: sw - 120, y: sh - 70, r: -30, w: 440 }].map((t, i) => (
          <g key={i} transform={`translate(${t.x} ${t.y}) rotate(${t.r})`}>
            <rect x={-t.w / 2} y={-44} width={t.w} height={88} fill={C.cinta} opacity={0.62} />
            <rect x={-t.w / 2} y={-44} width={t.w} height={10} fill="#fff" opacity={0.28} />
            <rect x={-t.w / 2} y={34} width={t.w} height={10} fill={C.tinta} opacity={0.12} />
            <path d={`M${-t.w / 2} -44 l10 14 l-12 14 l10 14 l-8 14 l8 14 M${t.w / 2} -44 l-10 14 l12 14 l-10 14 l8 14 l-8 14`} fill="none" stroke={C.kraftOscuro} strokeWidth={3} opacity={0.5} />
          </g>
        ))}
      </g>
    </>
  );
};

/** Papel milimetrado con la cancha como marca de agua y marcas de registro en las esquinas. */
const Milimetrado: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const sw = w - 480, sh = h - 480;
  const horizontal = sw > sh;
  const escala = Math.min((sh * 0.85) / 860, (sw * 0.8) / 1380);
  return (
  <>
    <rect width={w} height={h} fill={C.papel} />
    <Ruido id="ft-mi-blot" w={w} h={h} freq="0.0045 0.006" seed={9} rgb={[0.35, 0.3, 0.22]} a={1.4} b={-0.62} opacity={0.38} oct={4} />
    <defs>
      <pattern id="ft-mi-fino" width={20} height={20} patternUnits="userSpaceOnUse" x={240} y={240}>
        <path d="M0 0.5 H20 M0.5 0 V20" stroke={C.lineaCuaderno} strokeWidth={1} fill="none" opacity={0.42} />
      </pattern>
      <pattern id="ft-mi-grueso" width={100} height={100} patternUnits="userSpaceOnUse" x={240} y={240}>
        <path d="M0 0.5 H100 M0.5 0 V100" stroke={C.lineaCuaderno} strokeWidth={1.8} fill="none" opacity={0.7} />
      </pattern>
    </defs>
    <rect width={w} height={h} fill="url(#ft-mi-fino)" />
    <rect width={w} height={h} fill="url(#ft-mi-grueso)" />
    <g transform="translate(240 240)">
      {/* cancha en marca de agua */}
      <g fill="none" stroke={C.tinta} strokeWidth={horizontal ? 4 : 6} opacity={horizontal ? 0.055 : 0.085} strokeLinecap="round" strokeLinejoin="round" transform={horizontal ? `translate(${sw / 2} ${sh / 2}) rotate(-2) scale(${escala}) translate(-540 -970) rotate(90 540 970)` : 'rotate(-4 540 960)'}>
        <path d="M110 280 H970 V1660 H110 Z" />
        <path d="M110 970 H970" />
        <circle cx={540} cy={970} r={176} />
        <path d="M330 280 V560 H750 V280 M330 1660 V1380 H750 V1660" />
        <path d="M440 280 V400 H640 V280 M440 1660 V1540 H640 V1660" />
        <path d="M430 560 A130 130 0 0 0 650 560 M430 1380 A130 130 0 0 1 650 1380" />
      </g>
      {/* marcas de registro */}
      <g stroke={C.tinta} strokeWidth={3} fill="none" opacity={0.5}>
        {[[40, 40, 1, 1], [sw - 40, 40, -1, 1], [40, sh - 40, 1, -1], [sw - 40, sh - 40, -1, -1]].map(([x, y, sx, sy], i) => (
          <path key={i} d={`M${x} ${y + 46 * sy} V${y} H${x + 46 * sx}`} />
        ))}
        <circle cx={sw / 2} cy={40} r={14} />
        <path d={`M${sw / 2 - 20} 40 H${sw / 2 + 20} M${sw / 2} 20 V60`} />
        <circle cx={sw / 2} cy={sh - 40} r={14} />
        <path d={`M${sw / 2 - 20} ${sh - 40} H${sw / 2 + 20} M${sw / 2} ${sh - 60} V${sh - 20}`} />
      </g>
    </g>
  </>
  );
};

/** Papel prensa: trama de puntos, filetes de columna y bloques de texto gris que no se leen. */
const Diario: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const sw = w - 480, sh = h - 480;
  const cols = Array.from({ length: Math.ceil((sw - 60) / 240) + 1 }).map((_, k) => 60 + k * 240);
  const filas = Math.ceil((sh - 300) / 235);
  const bloques = cols.slice(0, -1).flatMap((x, ci) =>
    Array.from({ length: filas }).map((_, bi) => ({ x: x + 14, y: 230 + bi * 235 + hash(ci * 9 + bi) * 30, n: 4 + Math.floor(hash(ci * 5 + bi * 3) * 6), ci, bi })),
  );
  return (
    <>
      <rect width={w} height={h} fill={C.diario} />
      <Ruido id="ft-di-blot" w={w} h={h} freq="0.005 0.007" seed={21} rgb={[0.38, 0.33, 0.24]} a={1.5} b={-0.6} opacity={0.45} oct={4} />
      <defs>
        <pattern id="ft-di-trama" width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
          <circle cx={4.5} cy={4.5} r={1.35} fill={C.tintaDiario} />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#ft-di-trama)" opacity={0.17} />
      <g transform="translate(240 240)">
        {/* filetes de columna */}
        {cols.map((x, i) => (
          <rect key={i} x={x - 1} y={-240} width={2} height={2400} fill={C.tintaDiario} opacity={0.2} />
        ))}
        <rect x={-240} y={150} width={1560} height={7} fill={C.tintaDiario} opacity={0.3} />
        <rect x={-240} y={164} width={1560} height={2.5} fill={C.tintaDiario} opacity={0.3} />
        <rect x={-240} y={sh - 210} width={w} height={2.5} fill={C.tintaDiario} opacity={0.26} />
        {/* «texto» gris ilegible (solo textura) */}
        {bloques.map((b, i) =>
          Array.from({ length: b.n }).map((_, k) => (
            <rect key={`${i}-${k}`} x={b.x} y={b.y + k * 17} width={(220 - 16) * (k === b.n - 1 ? 0.55 : 0.78 + hash(i * 13 + k) * 0.22)} height={7} fill={C.tintaDiario} opacity={0.085} />
          )),
        )}
      </g>
    </>
  );
};

/* ───────────── superficies oscuras (mismo papel de «pizarra») ───────────── */

/** Pizarra verde de escuela con borrones de borrador y bandeja con tiza y borrador. */
const Verde: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const sw = w - 480, sh = h - 480;
  const by = sh - 82; // bandeja pegada al borde inferior
  return (
  <>
    <rect width={w} height={h} fill={C.metalSombra} />
    <g style={{ mixBlendMode: 'screen' }}>
      <Ruido id="ft-ve-blot" w={w} h={h} freq="0.0045 0.006" seed={7} rgb={[0.93, 0.92, 0.89]} a={-1.6} b={0.8} opacity={0.3} oct={4} />
      <Ruido id="ft-ve-fib" w={w} h={h} freq="0.03 0.14" seed={11} rgb={[0.93, 0.92, 0.89]} a={-2.2} b={1.1} opacity={0.13} />
    </g>
    <g transform="translate(240 240)" fill="none" stroke={C.tiza} strokeLinecap="round">
      {/* barridos de borrador */}
      {[[120, 520, 700], [220, 980, 820], [90, 1380, 640], [300, 1700, 560]].map(([x, y, l], i) => (
        <path key={i} d={`M${(x * sw) / 1080} ${(y * sh) / 1920} q${(l * sw) / 2160} ${-60 + i * 22} ${(l * sw) / 1080} ${12 - i * 8}`} strokeWidth={70 - i * 8} opacity={0.045} />
      ))}
      {/* bandeja de tiza */}
      <rect x={-240} y={by} width={w} height={110} fill={C.kraftOscuro} stroke="none" />
      <rect x={-240} y={by} width={w} height={9} fill={C.kraft} stroke="none" opacity={0.9} />
      <rect x={-240} y={by + 98} width={w} height={12} fill={C.tinta} stroke="none" opacity={0.35} />
      <rect x={110} y={by - 20} width={86} height={20} fill={C.tiza} stroke="none" transform={`rotate(-6 150 ${by - 10})`} />
      <rect x={220} y={by - 14} width={54} height={14} fill={C.lima} stroke="none" transform={`rotate(4 240 ${by - 8})`} />
      <rect x={sw - 320} y={by - 32} width={150} height={32} fill={C.kraftOscuro} stroke="none" />
      <rect x={sw - 320} y={by - 12} width={150} height={12} fill={C.tinta} stroke="none" opacity={0.85} />
    </g>
  </>
  );
};

/** Cartón oscuro: fibras de estraza sobre tinta y ondulado vertical muy tenue. */
const Carton: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <>
    <rect width={w} height={h} fill={C.tinta} />
    <rect width={w} height={h} fill={C.kraftOscuro} opacity={0.16} />
    <defs>
      <pattern id="ft-ca-ond" width={30} height={30} patternUnits="userSpaceOnUse">
        <rect width={11} height={30} fill={C.kraft} opacity={0.045} />
      </pattern>
    </defs>
    <rect width={w} height={h} fill="url(#ft-ca-ond)" />
    <g style={{ mixBlendMode: 'screen' }}>
      <Ruido id="ft-ca-blot" w={w} h={h} freq="0.0045 0.007" seed={5} rgb={[0.72, 0.55, 0.32]} a={-1.4} b={0.7} opacity={0.2} oct={4} />
      <Ruido id="ft-ca-fib" w={w} h={h} freq="0.05 0.07" seed={8} rgb={[0.72, 0.55, 0.32]} a={-2.4} b={1.1} opacity={0.12} oct={4} />
    </g>
  </>
);

/** Rejilla de tablero táctico: tinta con cuadrícula lima muy tenue y miras de cruz. */
const Rejilla: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <>
    <rect width={w} height={h} fill={C.tinta} />
    <defs>
      <pattern id="ft-re-fino" width={40} height={40} patternUnits="userSpaceOnUse" x={240} y={240}>
        <path d="M0 0.5 H40 M0.5 0 V40" stroke={C.lima} strokeWidth={1} fill="none" opacity={0.1} />
      </pattern>
      <pattern id="ft-re-grueso" width={200} height={200} patternUnits="userSpaceOnUse" x={240} y={240}>
        <path d="M0 0.5 H200 M0.5 0 V200" stroke={C.lima} strokeWidth={1.8} fill="none" opacity={0.2} />
        <path d="M-12 0.5 H12 M0.5 -12 V12" stroke={C.lima} strokeWidth={3} fill="none" opacity={0.55} />
      </pattern>
    </defs>
    <rect width={w} height={h} fill="url(#ft-re-fino)" />
    <rect width={w} height={h} fill="url(#ft-re-grueso)" />
    <g style={{ mixBlendMode: 'screen' }}>
      <Ruido id="ft-re-blot" w={w} h={h} freq="0.005 0.007" seed={14} rgb={[0.93, 0.92, 0.89]} a={-1.5} b={0.7} opacity={0.14} oct={4} />
    </g>
  </>
);

/** Plancha de imprenta: tinta con trama de papel y filetes de columna. */
const Plancha: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const sw = w - 480;
  return (
  <>
    <rect width={w} height={h} fill={C.tinta} />
    <defs>
      <pattern id="ft-pl-trama" width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
        <circle cx={4.5} cy={4.5} r={1.9} fill={C.papel} />
      </pattern>
    </defs>
    <rect width={w} height={h} fill="url(#ft-pl-trama)" opacity={0.17} />
    <g transform="translate(240 240)">
      {Array.from({ length: Math.ceil((sw - 60) / 240) + 1 }).map((_, k) => (
        <rect key={k} x={60 + k * 240 - 1} y={-240} width={2} height={2400} fill={C.papel} opacity={0.13} />
      ))}
      <rect x={-240} y={150} width={w} height={6} fill={C.papel} opacity={0.2} />
    </g>
    <g style={{ mixBlendMode: 'screen' }}>
      <Ruido id="ft-pl-blot" w={w} h={h} freq="0.005 0.007" seed={19} rgb={[0.93, 0.92, 0.89]} a={-1.5} b={0.7} opacity={0.16} oct={4} />
    </g>
  </>
  );
};

/* ───────────── lima (cierres, remates) ───────────── */

const LimaBase: React.FC<{ w: number; h: number; children?: React.ReactNode }> = ({ w, h, children }) => (
  <>
    <rect width={w} height={h} fill={C.lima} />
    {children}
    <Ruido id="ft-li-blot" w={w} h={h} freq="0.0045 0.006" seed={7} rgb={[0.3, 0.35, 0.1]} a={1.4} b={-0.62} opacity={0.34} oct={4} />
  </>
);

const LimaCuadros: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <LimaBase w={w} h={h}>
    <defs>
      <pattern id="ft-lc" width={56} height={56} patternUnits="userSpaceOnUse" x={244} y={250}>
        <path d="M0 0.5 H56 M0.5 0 V56" stroke={C.tinta} strokeWidth={2} fill="none" opacity={0.13} />
      </pattern>
    </defs>
    <rect width={w} height={h} fill="url(#ft-lc)" />
  </LimaBase>
);

const LimaCorrugado: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <LimaBase w={w} h={h}>
    <defs>
      <pattern id="ft-lo" width={18} height={18} patternUnits="userSpaceOnUse">
        <rect width={8} height={18} fill={C.tinta} opacity={0.075} />
      </pattern>
    </defs>
    <rect width={w} height={h} fill="url(#ft-lo)" />
  </LimaBase>
);

/** Franjas de césped recién cortado + círculo central y línea de cal. */
const LimaCancha: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const sw = w - 480, sh = h - 480;
  const horizontal = sw > sh;
  const cx = sw / 2, cy = horizontal ? sh / 2 : 980;
  const r = Math.min(250, sh * 0.26);
  return (
  <LimaBase w={w} h={h}>
    {Array.from({ length: Math.ceil(w / 130) }).map((_, i) => (
      <rect key={i} x={i * 130 + 12} y={0} width={130} height={h} fill={C.tinta} opacity={i % 2 ? 0.065 : 0} />
    ))}
    <g transform="translate(240 240)" fill="none" stroke={C.papel} strokeWidth={9} opacity={0.5}>
      <circle cx={cx} cy={cy} r={r} />
      <path d={horizontal ? `M${cx} -240 V${sh + 240}` : `M-240 ${cy} H${sw + 240}`} />
      <circle cx={cx} cy={cy} r={14} fill={C.papel} />
    </g>
  </LimaBase>
  );
};

const LimaTrama: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <LimaBase w={w} h={h}>
    <defs>
      <pattern id="ft-lt" width={18} height={18} patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
        <circle cx={9} cy={9} r={3.4} fill={C.tinta} />
      </pattern>
    </defs>
    <rect width={w} height={h} fill="url(#ft-lt)" opacity={0.11} />
  </LimaBase>
);

/* ───────────── ensamblado ───────────── */

export const FondoTema: React.FC<{ tipo: 'papel' | 'pizarra' | 'lima'; tema: Tema; width?: number; height?: number }> = ({ tipo, tema, width = 1080, height = 1920 }) => {
  const w = width + 480;
  const h = height + 480;
  const oscuro = tipo === 'pizarra';
  const textura = tipo === 'papel' ? tema.papel : tipo === 'pizarra' ? tema.oscuro : tema.lima;
  let cuerpo: React.ReactNode = null;
  switch (textura) {
    case 'cuadriculado': cuerpo = <Cuadriculado w={w} h={h} />; break;
    case 'kraft': cuerpo = <Kraft w={w} h={h} />; break;
    case 'milimetrado': cuerpo = <Milimetrado w={w} h={h} />; break;
    case 'diario': cuerpo = <Diario w={w} h={h} />; break;
    case 'verde': cuerpo = <Verde w={w} h={h} />; break;
    case 'carton': cuerpo = <Carton w={w} h={h} />; break;
    case 'rejilla': cuerpo = <Rejilla w={w} h={h} />; break;
    case 'plancha': cuerpo = <Plancha w={w} h={h} />; break;
    case 'cuadros': cuerpo = <LimaCuadros w={w} h={h} />; break;
    case 'corrugado': cuerpo = <LimaCorrugado w={w} h={h} />; break;
    case 'cancha': cuerpo = <LimaCancha w={w} h={h} />; break;
    case 'trama': cuerpo = <LimaTrama w={w} h={h} />; break;
    default: cuerpo = <rect width={w} height={h} fill={C.papel} />;
  }
  return (
    <div style={{ position: 'absolute', inset: -240 }}>
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        {cuerpo}
      </svg>
      {/* viñeta */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: tipo === 'lima'
            ? 'radial-gradient(ellipse at 50% 40%, rgba(22,19,15,0) 55%, rgba(22,19,15,0.14) 100%)'
            : `radial-gradient(ellipse at 50% 42%, rgba(22,19,15,0) 50%, rgba(22,19,15,${oscuro ? 0.3 : 0.26}) 100%)`,
        }}
      />
    </div>
  );
};
