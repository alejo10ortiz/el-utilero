import React from 'react';
import { C, FONT } from '../../config/brand';

/**
 * PICTOGRAMAS — dibujos genéricos a dos tintas (tinta + un acento) para ilustrar lo que dice la voz: paracaídas, sobres,
 * abonos, megáfono, balanza, calendario, trofeo, torres de estadio, guantes… Sin logos ni escudos reales (regla 2).
 * Cada uno vive en un viewBox 100×100; `acento` pinta el relleno principal.
 */
export type NombrePicto =
  | 'paracaidas' | 'flecha' | 'medalla' | 'alambrada' | 'maleta' | 'granero' | 'guantes' | 'sobre' | 'abono' | 'megafono'
  | 'balanza' | 'calendario' | 'lupa' | 'documento' | 'trofeo' | 'pasaporte' | 'estadio' | 'palmas' | 'cabeza' | 'pluma'
  | 'reloj' | 'balon' | 'persona' | 'pin' | 'estallido' | 'interrogacion' | 'pitazo' | 'tick' | 'cruz' | 'ojo';

type Props = { nombre: NombrePicto; size?: number; color?: string; acento?: string; texto?: string; rot?: number };

const T = { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };

export const Picto: React.FC<Props> = ({ nombre, size = 200, color = C.tinta, acento = C.lima, texto, rot = 0 }) => {
  const s = { stroke: color, strokeWidth: 4.6, ...T };
  const rel = { stroke: color, strokeWidth: 4.6, fill: acento, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const papel = { stroke: color, strokeWidth: 4.6, fill: C.ficha, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  let g: React.ReactNode = null;
  switch (nombre) {
    case 'paracaidas':
      g = (
        <>
          <path d="M8 46 A42 40 0 0 1 92 46 Q80 40 70 46 Q60 40 50 46 Q40 40 30 46 Q20 40 8 46 Z" {...rel} />
          <path d="M8 46 L50 82 M30 44 L50 82 M70 44 L50 82 M92 46 L50 82" {...s} strokeWidth={2.6} />
          <circle cx={50} cy={84} r={5} {...papel} />
          <path d="M50 89 V96 M44 92 L56 92" {...s} strokeWidth={3.4} />
        </>
      );
      break;
    case 'flecha':
      g = <path d="M8 50 H78 M58 28 L84 50 L58 72" {...s} strokeWidth={9} />;
      break;
    case 'medalla':
      g = (
        <>
          <path d="M34 6 L50 40 L66 6 Z" {...rel} fill={C.cinta} />
          <circle cx={50} cy={64} r={26} {...rel} />
          <polygon points="50,46 56,60 71,60 59,69 63,83 50,74 37,83 41,69 29,60 44,60" {...papel} strokeWidth={3} />
        </>
      );
      break;
    case 'alambrada':
      g = (
        <>
          <path d="M18 14 V92 M82 14 V92" {...s} strokeWidth={6} />
          {[30, 52, 74].map((y) => (
            <path key={y} d={`M18 ${y} Q34 ${y - 6} 50 ${y} T82 ${y}`} {...s} strokeWidth={3} />
          ))}
          {[[36, 28], [64, 26], [36, 50], [64, 48], [36, 72], [64, 70]].map(([x, y], i) => (
            <path key={i} d={`M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x - 5} ${y + 5} L${x + 5} ${y - 5}`} {...s} strokeWidth={3} />
          ))}
        </>
      );
      break;
    case 'maleta':
      g = (
        <>
          <path d="M36 32 V22 Q36 16 42 16 H58 Q64 16 64 22 V32" {...s} />
          <rect x={12} y={32} width={76} height={54} rx={5} {...rel} />
          <path d="M12 56 H88 M44 52 V62 M56 52 V62" {...s} strokeWidth={3.4} />
        </>
      );
      break;
    case 'granero':
      g = (
        <>
          <path d="M10 48 L50 14 L90 48 V88 H10 Z" {...rel} />
          <path d="M34 88 V58 H66 V88 M34 58 L66 88 M66 58 L34 88" {...s} strokeWidth={3.4} />
          <path d="M42 36 H58" {...s} strokeWidth={3.4} />
        </>
      );
      break;
    case 'guantes':
      g = (
        <>
          <path d="M26 92 V54 Q26 46 33 46 H35 V22 Q35 15 41 15 Q47 15 47 22 V40 V16 Q47 9 53 9 Q59 9 59 16 V40 V20 Q59 13 65 13 Q71 13 71 20 V44 V30 Q71 24 77 24 Q83 24 83 30 V62 Q83 78 70 86 L68 92 Z" {...rel} />
          <path d="M26 66 Q14 60 14 50 Q14 42 22 46 L28 56" {...rel} />
          <path d="M30 82 H70" {...s} strokeWidth={3.4} />
        </>
      );
      break;
    case 'sobre':
      g = (
        <>
          <rect x={8} y={24} width={84} height={56} rx={4} {...papel} />
          <path d="M8 28 L50 58 L92 28" {...s} />
          <path d="M8 76 L38 50 M92 76 L62 50" {...s} strokeWidth={3} />
        </>
      );
      break;
    case 'abono':
      g = (
        <>
          <path d="M8 26 H92 V42 Q84 50 92 58 V74 H8 V58 Q16 50 8 42 Z" {...rel} />
          <path d="M70 26 V74" {...s} strokeWidth={3} strokeDasharray="4 5" />
          <text x={34} y={56} textAnchor="middle" fontFamily={FONT.maquina} fontSize={14} fill={color}>{texto ?? 'ABONO'}</text>
        </>
      );
      break;
    case 'megafono':
      g = (
        <>
          <path d="M14 38 H32 L74 16 V84 L32 62 H14 Z" {...rel} />
          <path d="M32 62 L38 86 H50 L46 66" {...papel} />
          <path d="M82 34 Q92 50 82 66 M88 24 Q104 50 88 76" {...s} strokeWidth={3.6} />
        </>
      );
      break;
    case 'balanza':
      g = (
        <>
          <path d="M50 10 V88 M30 88 H70" {...s} strokeWidth={6} />
          <path d="M14 26 H86" {...s} strokeWidth={6} />
          <path d="M14 26 L4 58 H30 Z M86 26 L70 58 H96 Z" {...rel} />
          <circle cx={50} cy={14} r={5} {...papel} />
        </>
      );
      break;
    case 'calendario':
      g = (
        <>
          <rect x={10} y={16} width={80} height={74} rx={5} {...papel} />
          <path d="M10 38 H90" {...s} strokeWidth={5} />
          <rect x={10} y={16} width={80} height={22} {...rel} />
          <path d="M30 8 V22 M70 8 V22" {...s} strokeWidth={6} />
          <text x={50} y={78} textAnchor="middle" fontFamily={FONT.grito} fontSize={36} fill={color}>{texto ?? ''}</text>
        </>
      );
      break;
    case 'lupa':
      g = (
        <>
          <circle cx={42} cy={42} r={28} {...papel} />
          <path d="M62 62 L90 90" {...s} strokeWidth={10} />
          <path d="M30 40 Q42 28 54 40" {...s} strokeWidth={3} />
        </>
      );
      break;
    case 'documento':
      g = (
        <>
          <path d="M20 8 H64 L82 26 V92 H20 Z" {...papel} />
          <path d="M64 8 V26 H82" {...s} strokeWidth={3.4} />
          <path d="M30 42 H70 M30 54 H70 M30 66 H56" {...s} strokeWidth={3.4} />
          <path d="M56 80 L64 88 L80 70" {...s} strokeWidth={7} />
        </>
      );
      break;
    case 'trofeo':
      g = (
        <>
          <path d="M26 12 H74 V36 Q74 58 50 62 Q26 58 26 36 Z" {...rel} />
          <path d="M26 20 Q8 20 12 36 Q16 46 28 46 M74 20 Q92 20 88 36 Q84 46 72 46" {...s} />
          <path d="M50 62 V76 M32 88 H68 L64 76 H36 Z" {...rel} />
        </>
      );
      break;
    case 'pasaporte':
      g = (
        <>
          <rect x={22} y={8} width={56} height={84} rx={4} {...rel} fill={C.metal} />
          <circle cx={50} cy={42} r={14} {...s} stroke={C.ficha} strokeWidth={3.6} />
          <path d="M36 42 H64 M50 28 V56 M40 33 Q50 42 40 51 M60 33 Q50 42 60 51" {...s} stroke={C.ficha} strokeWidth={2.4} />
          <path d="M34 72 H66" {...s} stroke={C.ficha} strokeWidth={3.6} />
        </>
      );
      break;
    case 'estadio':
      g = (
        <>
          <path d="M6 88 V46 H94 V88 Z" {...rel} />
          <path d="M18 88 V30 H30 V88 M70 88 V30 H82 V88" {...papel} />
          <path d="M18 30 Q24 18 30 30 M70 30 Q76 18 82 30" {...s} />
          <path d="M34 88 V62 Q50 48 66 62 V88" {...papel} strokeWidth={3.4} />
        </>
      );
      break;
    case 'palmas':
      g = (
        <>
          <path d="M30 80 Q16 60 28 40 L34 28 Q38 22 43 28 L46 38 L50 18 Q53 12 58 16 L58 44 Z" {...rel} />
          <path d="M70 80 Q84 60 72 40 L66 28 Q62 22 57 28 L54 38 L50 18" {...rel} />
          <path d="M12 22 L22 30 M8 42 L20 44 M88 22 L78 30 M92 42 L80 44 M50 4 V10" {...s} strokeWidth={4} />
        </>
      );
      break;
    case 'cabeza':
      g = (
        <>
          <path d="M6 99 Q12 64 50 72 Q88 64 94 99 Z" {...rel} fill={color} />
          <g transform="rotate(-24 50 72)">
            <rect x={38} y={46} width={24} height={30} {...rel} />
            <circle cx={50} cy={30} r={25} {...rel} />
            <circle cx={25} cy={32} r={6} {...papel} strokeWidth={3.4} />
            <path d="M40 26 H44 M56 26 H60 M41 40 Q50 47 59 40" {...s} strokeWidth={3.6} />
            <path d="M44 12 Q50 6 58 12" {...s} strokeWidth={3.4} />
          </g>
          {texto === 'roto' && <path d="M22 58 L34 70 L28 78 L42 88" {...s} strokeWidth={5} />}
        </>
      );
      break;
    case 'pluma':
      g = (
        <>
          <path d="M84 8 Q60 16 40 48 L32 70 L54 62 Q82 40 84 8 Z" {...rel} />
          <path d="M32 70 L14 90 M40 48 L60 62" {...s} strokeWidth={3.4} />
        </>
      );
      break;
    case 'reloj':
      g = (
        <>
          <circle cx={50} cy={52} r={36} {...papel} />
          <path d="M50 52 V28 M50 52 L66 62" {...s} strokeWidth={5.4} />
          <path d="M42 10 H58" {...s} strokeWidth={6} />
        </>
      );
      break;
    case 'balon':
      g = (
        <>
          <circle cx={50} cy={50} r={38} {...papel} />
          <polygon points="50,33 65,44 59,62 41,62 35,44" fill={color} />
          <path d="M50 33 V14 M65 44 L83 38 M59 62 L72 78 M41 62 L28 78 M35 44 L17 38" {...s} strokeWidth={3.6} />
        </>
      );
      break;
    case 'persona':
      g = (
        <>
          <circle cx={50} cy={22} r={13} {...rel} />
          <path d="M26 92 Q26 46 50 46 Q74 46 74 92 Z" {...rel} />
        </>
      );
      break;
    case 'pin':
      g = (
        <>
          <path d="M50 94 Q18 56 18 36 A32 32 0 0 1 82 36 Q82 56 50 94 Z" {...rel} />
          <circle cx={50} cy={36} r={11} {...papel} />
        </>
      );
      break;
    case 'estallido':
      g = <polygon points="50,4 58,30 84,16 70,40 96,50 70,60 84,84 58,70 50,96 42,70 16,84 30,60 4,50 30,40 16,16 42,30" {...rel} fill={acento} />;
      break;
    case 'interrogacion':
      g = (
        <>
          <path d="M14 14 H86 V64 H56 L40 84 V64 H14 Z" {...papel} />
          <text x={50} y={54} textAnchor="middle" fontFamily={FONT.grito} fontSize={46} fill={color}>?</text>
        </>
      );
      break;
    case 'pitazo':
      g = (
        <>
          <path d="M10 44 H56 Q76 44 76 64 Q76 84 56 84 Q36 84 36 64" {...rel} />
          <circle cx={56} cy={64} r={6} {...papel} strokeWidth={3} />
          <path d="M76 56 H92 M82 44 L92 36 M82 72 L92 80" {...s} strokeWidth={4} />
        </>
      );
      break;
    case 'tick':
      g = <path d="M14 54 L38 78 L88 22" {...s} strokeWidth={13} stroke={acento === C.lima ? color : acento} />;
      break;
    case 'cruz':
      g = <path d="M18 18 L82 82 M82 18 L18 82" {...s} strokeWidth={13} />;
      break;
    case 'ojo':
      g = (
        <>
          <path d="M6 50 Q50 8 94 50 Q50 92 6 50 Z" {...papel} />
          <circle cx={50} cy={50} r={15} {...rel} />
          <circle cx={50} cy={50} r={6} fill={color} />
        </>
      );
      break;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible', transform: `rotate(${rot}deg)`, filter: 'url(#ink)' }}>
      {g}
    </svg>
  );
};
