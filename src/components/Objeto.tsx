import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT } from '../../config/brand';
import type { ObjetoTipo } from '../lib/episode';

/**
 * Objetos del día (§3.3): genéricos, dibujados por nosotros, dos tintas (tinta + lima) con trama de puntos.
 * NUNCA fotos con derechos ni logos. Cada uno lleva su etiqueta colgante escrita a máquina.
 * viewBox 400×440; el centro del objeto queda hacia (200, 230).
 */

const Etiqueta: React.FC<{ texto: string; sway: number }> = ({ texto, sway }) => (
  <g transform={`translate(300 118) rotate(${sway} 0 0)`}>
    <path d="M0 0 C-8 20 -14 40 -10 60" fill="none" stroke={C.tinta} strokeWidth={2.2} />
    <g transform="translate(-10 58) rotate(6)">
      <rect x={-8} y={0} width={128} height={150} fill={C.kraft} stroke={C.tinta} strokeWidth={3} />
      <path d="M-8 0 L6 0 L-8 14 Z" fill={C.papel} stroke={C.tinta} strokeWidth={2} />
      <circle cx={8} cy={14} r={5} fill={C.papel} stroke={C.tinta} strokeWidth={2.5} />
      {texto.split(' · ').map((t, i) => (
        <text key={i} x={4} y={44 + i * 22} fontFamily={FONT.maquina} fontSize={14} fill={C.tinta}>
          {t}
        </text>
      ))}
    </g>
  </g>
);

const Bulto: React.FC = () => {
  // bulto envuelto en periódico: dos tintas con desregistro lima
  const forma = 'M70 150 C60 110 120 84 200 90 C280 84 338 112 334 160 C348 220 340 300 318 346 C290 392 120 396 90 340 C64 292 82 210 70 150 Z';
  const renglones = Array.from({ length: 11 }).map((_, i) => 118 + i * 24);
  return (
    <g>
      <path d={forma} transform="translate(9 7)" fill={C.lima} />
      <path d={forma} fill={C.ficha} stroke={C.tinta} strokeWidth={4} strokeLinejoin="round" />
      <clipPath id="clip-bulto"><path d={forma} /></clipPath>
      <g clipPath="url(#clip-bulto)">
        {/* titular del periódico */}
        <rect x={96} y={118} width={210} height={22} fill={C.tinta} transform="rotate(-3 200 130)" />
        <rect x={110} y={148} width={150} height={9} fill={C.tinta} opacity={0.85} transform="rotate(-3 200 130)" />
        {renglones.map((y, i) => (
          <g key={i} transform="rotate(-3 200 230)" opacity={0.78}>
            <rect x={96} y={y + 52} width={92 - (i % 3) * 8} height={5} fill={C.tinta} />
            <rect x={204} y={y + 52} width={96 - ((i + 1) % 4) * 9} height={5} fill={C.tinta} />
          </g>
        ))}
        {/* foto de periódico con trama */}
        <rect x={104} y={196} width={86} height={64} fill="url(#dots)" stroke={C.tinta} strokeWidth={2} transform="rotate(-3 200 230)" />
        {/* sombra de pliegue */}
        <path d="M70 170 C120 210 120 300 96 360 L128 372 C150 300 140 214 98 160 Z" fill="url(#dots)" opacity={0.5} />
      </g>
      {/* pliegues */}
      <path d="M200 90 C214 170 206 280 196 394" fill="none" stroke={C.tinta} strokeWidth={2.4} strokeDasharray="10 8" opacity={0.55} />
      <path d="M68 250 C150 262 270 262 340 244" fill="none" stroke={C.tinta} strokeWidth={2.4} strokeDasharray="10 8" opacity={0.55} />
      {/* cordel y moño */}
      <path d="M66 214 C150 230 270 230 338 212" fill="none" stroke={C.tinta} strokeWidth={5} />
      <path d="M200 90 C204 150 202 300 200 396" fill="none" stroke={C.tinta} strokeWidth={5} />
      <g transform="translate(200 224)">
        <path d="M0 0 C-30 -30 -54 -14 -44 6 C-36 20 -12 10 0 0 Z" fill={C.lima} stroke={C.tinta} strokeWidth={4} />
        <path d="M0 0 C30 -30 54 -14 44 6 C36 20 12 10 0 0 Z" fill={C.lima} stroke={C.tinta} strokeWidth={4} />
        <circle cx={0} cy={0} r={9} fill={C.tinta} />
      </g>
    </g>
  );
};

const Botin: React.FC = () => {
  const bota = 'M60 250 C60 200 80 120 130 100 C170 90 200 110 214 150 C250 160 330 190 350 250 C360 290 340 320 300 322 L92 322 C70 322 60 300 60 250 Z';
  return (
    <g>
      <path d={bota} transform="translate(9 7)" fill={C.lima} />
      <path d={bota} fill={C.papel} stroke={C.tinta} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M60 250 C60 200 80 120 130 100 C170 90 200 110 214 150 C170 140 130 170 120 250 Z" fill="url(#dots)" opacity={0.7} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <path d={`M${150 + i * 18} ${112 + i * 14} l46 -10`} stroke={C.tinta} strokeWidth={5} strokeLinecap="round" />
          <path d={`M${160 + i * 18} ${126 + i * 14} l46 -10`} stroke={C.tinta} strokeWidth={5} strokeLinecap="round" />
        </g>
      ))}
      <rect x={60} y={322} width={290} height={18} fill={C.tinta} />
      {[96, 150, 228, 290].map((x) => (
        <path key={x} d={`M${x} 340 l-8 30 h30 l-8 -30 Z`} fill={C.tinta} />
      ))}
    </g>
  );
};


/** Llave a medida (cabeza-balón) apuntando hacia abajo, origen en el centro de la cabeza. */
const LlaveDibujo: React.FC<{ largo?: number; fill?: string }> = ({ largo = 150, fill = C.tinta }) => (
  <g>
    <circle cx={0} cy={0} r={24} fill={fill} />
    <polygon points="0,-13 12,-4 7,10 -7,10 -12,-4" fill={C.lima} />
    <rect x={-8} y={20} width={16} height={largo} rx={3} fill={fill} />
    <rect x={8} y={largo - 20} width={24} height={12} fill={fill} />
    <rect x={8} y={largo + 2} width={17} height={12} fill={fill} />
  </g>
);

/** Llavero: aro con tres llaves y etiqueta de cartón. */
const Llavero: React.FC = () => (
  <g>
    <g transform="translate(208 130)">
      <circle cx={0} cy={0} r={52} fill="none" stroke={C.lima} strokeWidth={11} transform="translate(8 6)" />
      <circle cx={0} cy={0} r={52} fill="none" stroke={C.tinta} strokeWidth={9} />
    </g>
    {[{ a: -26, d: 190 }, { a: 4, d: 220 }, { a: 28, d: 180 }].map((k, i) => (
      <g key={i} transform={`translate(208 150) rotate(${k.a}) translate(0 52)`}>
        <g transform="translate(7 5)" opacity={1}><LlaveDibujo largo={k.d - 90} fill={C.lima} /></g>
        <LlaveDibujo largo={k.d - 90} />
      </g>
    ))}
    <g transform="translate(150 330) rotate(-8)">
      <path d="M0 0 L-6 -24" stroke={C.tinta} strokeWidth={2.4} />
      <rect x={-34} y={0} width={74} height={50} fill={C.kraft} stroke={C.tinta} strokeWidth={3} />
      <text x={-28} y={30} fontFamily={FONT.maquina} fontSize={15} fill={C.tinta}>CAMERINO</text>
    </g>
  </g>
);

/** Hoja de calendario de taco: "HOY HACE X AÑOS". Sin fechas reales: es un recurso gráfico. */
const Calendario: React.FC = () => (
  <g>
    <rect x={78} y={96} width={250} height={300} transform="translate(9 7)" fill={C.lima} />
    <rect x={78} y={96} width={250} height={300} fill={C.ficha} stroke={C.tinta} strokeWidth={4.5} />
    <rect x={78} y={96} width={250} height={70} fill={C.tinta} />
    <text x={203} y={148} textAnchor="middle" fontFamily={FONT.grito} fontSize={56} fill={C.ficha} letterSpacing={4}>HOY HACE</text>
    <text x={203} y={318} textAnchor="middle" fontFamily={FONT.grito} fontSize={190} fill={C.tinta}>X</text>
    <text x={203} y={370} textAnchor="middle" fontFamily={FONT.maquina} fontSize={30} fill={C.grisArchivo} letterSpacing={6}>AÑOS</text>
    {[130, 203, 276].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy={92} r={11} fill={C.papel} stroke={C.tinta} strokeWidth={3.5} />
        <rect x={cx - 3} y={72} width={6} height={30} rx={3} fill={C.tinta} />
      </g>
    ))}
    <path d="M78 396 q125 24 250 0" fill="none" stroke={C.tinta} strokeWidth={3} strokeDasharray="8 6" opacity={0.5} />
  </g>
);

const Generico: React.FC<{ tipo: ObjetoTipo }> = ({ tipo }) => (
  <g>
    <rect x={80} y={120} width={240} height={240} rx={8} transform="translate(9 7)" fill={C.lima} />
    <rect x={80} y={120} width={240} height={240} rx={8} fill={C.papel} stroke={C.tinta} strokeWidth={4.5} />
    <path d="M80 120 L320 360 M320 120 L80 360" stroke={C.tinta} strokeWidth={3} opacity={0.35} />
    <text x={200} y={252} textAnchor="middle" fontFamily={FONT.grito} fontSize={86} fill={C.tinta}>
      {tipo.toUpperCase()}
    </text>
  </g>
);

export const Objeto: React.FC<{
  tipo?: ObjetoTipo;
  etiqueta?: string;
  size?: number;
  x?: number;
  y?: number;
  rot?: number;
}> = ({ tipo = 'bulto', etiqueta, size = 520, x = 0, y = 0, rot = 0 }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 12) * 4 * Math.exp(-((frame % 400) / 90));
  return (
    <svg
      viewBox="0 0 400 440"
      width={size}
      height={size * 1.1}
      style={{ position: 'absolute', left: x, top: y, overflow: 'visible', transform: `rotate(${rot}deg)`, filter: 'url(#ink)' }}
    >
      {tipo === 'bulto' ? <Bulto /> : tipo === 'botin' ? <Botin /> : tipo === 'llavero' ? <Llavero /> : tipo === 'calendario' ? <Calendario /> : <Generico tipo={tipo} />}
      {etiqueta && <Etiqueta texto={etiqueta} sway={sway} />}
    </svg>
  );
};
