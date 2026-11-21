import React from 'react';
import { C, FONT } from '../../config/brand';
import { Utilero } from './Utilero';

/** Marca mínima (§6.1): llave cuya cabeza es un balón (anillo + pentágono). */
export const LlaveBalon: React.FC<{
  size?: number; color?: string; fondo?: string; x?: number; y?: number; rot?: number; registro?: string | null;
}> = ({ size = 220, color = C.tinta, fondo = C.papel, x, y, rot = 0, registro = C.lima }) => {
  const key = (dx: number, dy: number, c: string, bg: string, withBall: boolean) => (
    <g transform={`translate(${dx} ${dy})`}>
      <circle cx={60} cy={52} r={40} fill={c} />
      {withBall && (
        <>
          <polygon points="60,26 84,43 75,71 45,71 36,43" fill={bg} />
          <path d="M60 26 V13 M84 43 L97 38 M75 71 L83 83 M45 71 L37 83 M36 43 L23 38" stroke={bg} strokeWidth={3.5} fill="none" />
        </>
      )}
      <rect x={50} y={90} width={20} height={118} rx={3} fill={c} />
      <rect x={70} y={150} width={30} height={15} fill={c} />
      <rect x={70} y={178} width={22} height={15} fill={c} />
    </g>
  );
  return (
    <svg
      viewBox="0 0 130 220"
      width={size * 0.59}
      height={size}
      style={{
        position: x !== undefined ? 'absolute' : 'relative',
        left: x, top: y, transform: `rotate(${rot}deg)`, overflow: 'visible',
      }}
    >
      {registro && key(8, 6, registro, registro, false)}
      {key(0, 0, color, fondo, true)}
    </svg>
  );
};

/** Escudo / sello (§6.3): escudo con llave-balón. Para sello de caucho: color = C.sello. */
export const Escudo: React.FC<{ size?: number; color?: string; x?: number; y?: number; rot?: number }> = ({
  size = 260, color = C.sello, x, y, rot = 0,
}) => (
  <svg
    viewBox="0 0 200 240"
    width={size * (200 / 240)}
    height={size}
    style={{ position: x !== undefined ? 'absolute' : 'relative', left: x, top: y, transform: `rotate(${rot}deg)`, filter: 'url(#rough)' }}
  >
    <path d="M100 10 L186 32 V118 C186 174 150 212 100 230 C50 212 14 174 14 118 V32 Z" fill="none" stroke={color} strokeWidth={9} strokeLinejoin="round" />
    <circle cx={100} cy={76} r={27} fill={color} />
    <polygon points="100,59 116,70 110,89 90,89 84,70" fill={C.papel} />
    <rect x={86} y={104} width={28} height={9} rx={2} fill={color} />
    <rect x={94} y={110} width={12} height={90} rx={2} fill={color} />
    <rect x={104} y={166} width={20} height={10} fill={color} />
    <rect x={104} y={184} width={14} height={10} fill={color} />
  </svg>
);

/** Avatar (§6.4): retrato guiñando sobre círculo lima. A tamaños chicos usa versión simplificada. */
export const Avatar: React.FC<{ size?: number; x?: number; y?: number }> = ({ size = 400, x = 0, y = 0 }) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%',
      background: C.lima, overflow: 'hidden',
    }}
  >
    <Utilero expresion="E2" sobre="lima" size={size * 1.5} x={-size * 0.25} y={-size * 0.2} vivo={false} />
  </div>
);

type Variante = 'principal' | 'invertida' | 'mono' | 'sobreLima';

/**
 * Logotipo (§6.2): "EL UTILERO" sobre League Gothic con la I convertida en llave
 * (fuste = cuerpo de la llave, dos dientes a la derecha, cabeza-balón sobre la altura de mayúsculas).
 * "EL" en marcador sobre cinta, arriba a la izquierda de la U, rotado −6°.
 * NOTA: para la versión final, redibujar las letras a medida (el brief del ilustrador lo cubre).
 */
export const Logotipo: React.FC<{ size?: number; variante?: Variante; x?: number; y?: number }> = ({
  size = 300, variante = 'principal', x, y,
}) => {
  // métricas de League Gothic (unidades por 2000/em)
  const ADV = { U: 736, T: 664, I: 376, L: 590, E: 654, R: 714, O: 716 } as const;
  const CAP = 1470 / 2000;
  const STEM_X = 80 / 2000;
  const STEM_W = 216 / 2000;
  const s = size;
  const order: (keyof typeof ADV)[] = ['U', 'T', 'I', 'L', 'E', 'R', 'O'];
  let cursor = 0;
  const pos: Record<string, number> = {};
  for (const l of order) {
    pos[l] = cursor;
    cursor += (ADV[l] / 2000) * s;
    if (l === 'I') cursor += s * 0.055; // aire para los dientes de la llave
  }
  const W = cursor;
  const base = s * 1.1; // baseline dentro del viewBox
  const topPad = s * 0.62; // espacio para cabeza de llave
  const H = topPad + s * CAP + s * 0.12;
  const tinta = variante === 'invertida' ? C.tiza : C.tinta;
  const reg = variante === 'mono' || variante === 'sobreLima' ? null : C.lima;
  const bg = variante === 'invertida' ? C.pizarra : variante === 'sobreLima' ? C.lima : C.papel;
  const baseY = topPad + s * CAP;
  const ix = pos.I + STEM_X * s;
  const ring = s * 0.19;
  const keyEl = (dx: number, dy: number, fill: string, ball: boolean) => (
    <g transform={`translate(${dx} ${dy})`}>
      <rect x={ix} y={baseY - s * CAP} width={STEM_W * s} height={s * CAP} fill={fill} />
      <rect x={ix + STEM_W * s} y={baseY - s * 0.3} width={s * 0.085} height={s * 0.05} fill={fill} />
      <rect x={ix + STEM_W * s} y={baseY - s * 0.17} width={s * 0.06} height={s * 0.05} fill={fill} />
      <circle cx={ix + (STEM_W * s) / 2} cy={baseY - s * CAP - ring * 0.92} r={ring} fill={fill} />
      {ball && (
        <polygon
          points={[0, 1, 2, 3, 4]
            .map((k) => {
              const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
              return `${ix + (STEM_W * s) / 2 + Math.cos(a) * ring * 0.55},${baseY - s * CAP - ring * 0.92 + Math.sin(a) * ring * 0.55}`;
            })
            .join(' ')}
          fill={bg}
        />
      )}
    </g>
  );
  return (
    <div style={{ position: x !== undefined ? 'absolute' : 'relative', left: x, top: y, width: W + s * 0.3, height: H + s * 0.4 }}>
      <svg width={W + s * 0.3} height={H + s * 0.4} viewBox={`${-s * 0.05} 0 ${W + s * 0.3} ${H + s * 0.4}`} style={{ overflow: 'visible' }}>
        {/* placa de registro lima corrida */}
        {reg && (
          <g transform={`translate(${s * 0.034} ${s * 0.027})`} fill={reg} fontFamily={FONT.grito} fontSize={s}>
            {(['U', 'T', 'L', 'E', 'R', 'O'] as const).map((l) => (
              <text key={l} x={pos[l]} y={baseY} style={{ fontFamily: FONT.grito }}>{l}</text>
            ))}
            {keyEl(0, 0, reg, false)}
          </g>
        )}
        <g fill={tinta} fontFamily={FONT.grito} fontSize={s}>
          {(['U', 'T', 'L', 'E', 'R', 'O'] as const).map((l) => (
            <text key={l} x={pos[l]} y={baseY} style={{ fontFamily: FONT.grito }}>{l}</text>
          ))}
          {keyEl(0, 0, tinta, true)}
        </g>
      </svg>
      {/* EL: marcador sobre cinta, rotado −6° */}
      <div
        style={{
          position: 'absolute',
          left: -s * 0.1,
          top: topPad - s * 0.12,
          transform: 'rotate(-6deg)',
          fontFamily: FONT.marcador,
          fontSize: s * 0.24,
          lineHeight: 1,
          color: C.tinta,
          background: C.cinta,
          padding: `${s * 0.05}px ${s * 0.1}px ${s * 0.02}px`,
          clipPath: 'polygon(0 10%,3% 0,50% 4%,97% 0,100% 12%,98% 50%,100% 90%,96% 100%,50% 95%,4% 100%,0 88%,2% 50%)',
        }}
      >
        EL
      </div>
    </div>
  );
};
