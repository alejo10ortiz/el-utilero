import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import { C, FONT } from '../../config/brand';
import { E, boil, hash, pop, slam, tw } from '../lib/ease';
import { useAbs, BEAT } from '../lib/ritmo';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();

/** Una línea de palabras que van saltando cuando se dicen (fase "dicen que llevo en los camerinos desde…"). */
export const LineaPalabras: React.FC<{
  palabras: { texto: string; at: number; hl?: boolean }[];
  x: number;
  y: number;
  ancho: number;
  size?: number;
  salida?: number; // frame en que la línea se va
  color?: string;
  align?: 'center' | 'left';
}> = ({ palabras, x, y, ancho, size = 150, salida, color = C.tiza, align = 'center' }) => {
  const f = useCurrentFrame();
  const sal = salida !== undefined ? tw(f, [salida, salida + 5], [0, 1], E.inExpo) : 0;
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: ancho, display: 'flex', flexWrap: 'nowrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start', gap: `0 ${size * 0.22}px`,
        fontFamily: FONT.grito, fontSize: size, lineHeight: 0.9, color, whiteSpace: 'nowrap',
        transform: `translateY(${-sal * 140}px)`, opacity: 1 - sal,
      }}
    >
      {palabras.map((p, i) => {
        const k = pop(f, p.at - 1, 8);
        const b = boil(f, i + 3, 1.4);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block', visibility: f >= p.at - 1 ? 'visible' : 'hidden',
              transform: `translate(${b.x}px, ${(1 - k) * 60 + b.y}px) scale(${0.4 + 0.6 * k}) rotate(${(hash(i + 5) - 0.5) * 8 * (1 - k) + b.r}deg)`,
              opacity: Math.min(1, k * 3),
              textShadow: `${size * 0.045}px ${size * 0.035}px 0 ${C.lima}`,
              ...(p.hl ? { background: C.lima, color: C.tinta, padding: `0 ${size * 0.08}px`, textShadow: 'none' } : {}),
            }}
          >
            {p.texto}
          </span>
        );
      })}
    </div>
  );
};

export type LineaTitulo = { texto: string; at: number; resaltar?: string; max?: number };

/**
 * Titular que se CLAVA línea a línea: llega grande y desenfocado, se aplasta, rebota; después respira,
 * pulsa con el bombo y "hierve" (line boil a 12 fps). El filtro de tiza se aplica una sola vez al conjunto.
 */
export const TituloImpacto: React.FC<{
  lineas: LineaTitulo[];
  x: number;
  y: number;
  ancho: number;
  tono?: 'tiza' | 'tinta';
  maxSize?: number;
  salida?: number;
}> = ({ lineas, x, y, ancho, tono = 'tiza', maxSize = 440, salida }) => {
  const f = useCurrentFrame();
  const abs = useAbs();
  const color = tono === 'tiza' ? C.tiza : C.tinta;
  const medidas = lineas.map((l) => {
    const { fontSize } = fitText({ text: l.texto, withinWidth: ancho, fontFamily: 'League Gothic', fontWeight: '400' });
    return Math.min(l.max ?? maxSize, fontSize);
  });
  const tops: number[] = [];
  let acc = 0;
  medidas.forEach((m, i) => {
    tops.push(acc);
    acc += m * 0.84 + (/[ÁÉÍÓÚÑ]/.test(lineas[i + 1]?.texto ?? '') ? m * 0.2 : 0);
  });
  const sal = salida !== undefined ? tw(f, [salida, salida + 8], [0, 1], E.inExpo) : 0;
  const pulso = 1 + 0.022 * Math.exp(-(abs % BEAT) / 4.5);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: ancho, opacity: 1 - sal, transform: `translateY(${-sal * 200}px)`, filter: tono === 'tiza' ? 'url(#chalk)' : 'url(#ink)' }}>
      {lineas.map((l, i) => {
        const s = slam(f, l.at);
        if (!s.visible) return null;
        const b = boil(f, i * 5 + 2, 1.6);
        const palabras = l.texto.split(' ');
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: 0, top: tops[i], width: ancho, textAlign: 'center', whiteSpace: 'nowrap',
              fontFamily: FONT.grito, fontSize: medidas[i], lineHeight: 0.84, color,
              transform: `translate(${b.x}px, ${s.y + b.y}px) scale(${s.scale * pulso}) rotate(${b.r + (i % 2 ? 0.6 : -0.6)}deg)`,
              transformOrigin: '50% 60%', opacity: s.opacity, filter: s.blur > 0.3 ? `blur(${s.blur}px)` : undefined,
              textShadow: `${tw(f, [l.at, l.at + 3], [0, 10])}px ${tw(f, [l.at, l.at + 3], [0, 8])}px 0 ${C.lima}`,
            }}
          >
            {palabras.map((w, j) => {
              const hl = l.resaltar && norm(w) === norm(l.resaltar);
              return (
                <React.Fragment key={j}>
                  {j > 0 && ' '}
                  {hl ? (
                    <span
                      style={{
                        position: 'relative', display: 'inline-block', color: C.tinta, textShadow: 'none',
                        boxShadow: /[ÁÉÍÓÚÑ]/.test(w) ? `0 -${medidas[i] * 0.22}px 0 0 ${C.lima}` : undefined,
                        padding: `${medidas[i] * 0.02}px ${medidas[i] * 0.06}px 0`,
                      }}
                    >
                      <span style={{ position: 'absolute', inset: 0, background: C.lima, transform: `scaleX(${tw(f, [l.at + 3, l.at + 10], [0, 1], E.outExpo)}) rotate(-1.2deg)`, transformOrigin: 'left center', zIndex: -1 }} />
                      {w}
                    </span>
                  ) : (
                    w
                  )}
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/* ───────────── Logotipo animado: letra por letra, la I-llave gira y "ping" del balón ───────────── */

export const LogotipoAnimado: React.FC<{ size?: number; inicio?: number; x?: number; y?: number; tinta?: string }> = ({ size = 265, inicio = 0, x = 0, y = 0, tinta = C.tinta }) => {
  const f = useCurrentFrame();
  const ADV = { U: 736, T: 664, I: 376, L: 590, E: 654, R: 714, O: 716 } as const;
  const CAP = 1470 / 2000;
  const STEM_X = 80 / 2000;
  const STEM_W = 216 / 2000;
  const s = size;
  const order: (keyof typeof ADV)[] = ['U', 'T', 'I', 'L', 'E', 'R', 'O'];
  const pos: Record<string, number> = {};
  let cursor = 0;
  for (const l of order) {
    pos[l] = cursor;
    cursor += (ADV[l] / 2000) * s;
    if (l === 'I') cursor += s * 0.055;
  }
  const W = cursor;
  const topPad = s * 0.62;
  const H = topPad + s * CAP + s * 0.12;
  const baseY = topPad + s * CAP;
  const ix = pos.I + STEM_X * s;
  const ring = s * 0.19;
  const letraAnim = (i: number) => {
    const a = slam(f, inicio + i * 2, 2.2);
    return a;
  };
  const tapa = slam(f, inicio + 16, 2.4);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: W + s * 0.3, height: H + s * 0.4 }}>
      <svg width={W + s * 0.3} height={H + s * 0.4} viewBox={`${-s * 0.05} 0 ${W + s * 0.3} ${H + s * 0.4}`} style={{ overflow: 'visible' }}>
        {order.map((l, i) => {
          const a = letraAnim(i);
          if (!a.visible) return null;
          const cx = pos[l] + (ADV[l] / 2000) * s * 0.5;
          const cy = baseY - (s * CAP) / 2;
          const tr = `translate(${cx} ${cy + a.y}) scale(${a.scale}) rotate(${l === 'I' ? tw(f, [inicio + i * 2, inicio + i * 2 + 10], [-200, 0], E.outBack) : 0}) translate(${-cx} ${-cy})`;
          const filtro = a.blur > 0.3 ? `blur(${a.blur}px)` : undefined;
          if (l !== 'I') {
            return (
              <g key={l} transform={tr} opacity={a.opacity} style={{ filter: filtro }}>
                <text x={pos[l] + s * 0.034} y={baseY + s * 0.027} fill={C.lima} fontFamily={FONT.grito} fontSize={s}>{l}</text>
                <text x={pos[l]} y={baseY} fill={tinta} fontFamily={FONT.grito} fontSize={s}>{l}</text>
              </g>
            );
          }
          const ping = tw(f, [inicio + i * 2 + 9, inicio + i * 2 + 16], [1.5, 1], E.outBack2);
          return (
            <g key={l} transform={tr} opacity={a.opacity} style={{ filter: filtro }}>
              {[[s * 0.034, s * 0.027, C.lima], [0, 0, tinta]].map(([dx, dy, fill], k) => (
                <g key={k} transform={`translate(${dx} ${dy})`}>
                  <rect x={ix} y={baseY - s * CAP} width={STEM_W * s} height={s * CAP} fill={fill as string} />
                  <rect x={ix + STEM_W * s} y={baseY - s * 0.3} width={s * 0.085} height={s * 0.05} fill={fill as string} />
                  <rect x={ix + STEM_W * s} y={baseY - s * 0.17} width={s * 0.06} height={s * 0.05} fill={fill as string} />
                  <g transform={`translate(${ix + (STEM_W * s) / 2} ${baseY - s * CAP - ring * 0.92}) scale(${ping})`}>
                    <circle r={ring} fill={fill as string} />
                    {k === 1 && (
                      <polygon
                        points={[0, 1, 2, 3, 4].map((q) => `${Math.cos(-Math.PI / 2 + (q * 2 * Math.PI) / 5) * ring * 0.55},${Math.sin(-Math.PI / 2 + (q * 2 * Math.PI) / 5) * ring * 0.55}`).join(' ')}
                        fill={C.papel}
                      />
                    )}
                  </g>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
      {tapa.visible && (
        <div
          style={{
            position: 'absolute', left: -s * 0.1, top: topPad - s * 0.12,
            transform: `translateY(${tapa.y}px) scale(${tapa.scale}) rotate(-6deg)`, transformOrigin: '30% 60%', opacity: tapa.opacity,
            fontFamily: FONT.marcador, fontSize: s * 0.24, lineHeight: 1, color: C.tinta, background: C.cinta,
            padding: `${s * 0.05}px ${s * 0.1}px ${s * 0.02}px`,
            clipPath: 'polygon(0 10%,3% 0,50% 4%,97% 0,100% 12%,98% 50%,100% 90%,96% 100%,50% 95%,4% 100%,0 88%,2% 50%)',
            filter: tapa.blur > 0.3 ? `blur(${tapa.blur}px)` : undefined,
          }}
        >
          EL
        </div>
      )}
    </div>
  );
};

/** Cinta que se CLAVA (llega grande y desenfocada, rebota) — para "EL UTILERO", @usuario, etc. */
export const CintaImpacto: React.FC<{ texto: string; x: number; y: number; at: number; rot?: number; size?: number; color?: string }> = ({
  texto, x, y, at, rot = -4, size = 90, color = C.cinta,
}) => {
  const f = useCurrentFrame();
  const s = slam(f, at, 2.1);
  if (!s.visible) return null;
  const k = Math.min(1, (f - at) / 8);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, opacity: s.opacity,
        transform: `translate(-50%, -50%) translateY(${s.y}px) rotate(${rot - (1 - k) * 9}deg) scale(${s.scale})`,
        fontFamily: FONT.marcador, fontSize: size, lineHeight: 1, color: C.tinta, background: color,
        padding: `${size * 0.26}px ${size * 0.55}px ${size * 0.16}px`, whiteSpace: 'nowrap',
        clipPath: 'polygon(0 10%,3% 0,50% 4%,97% 0,100% 12%,98% 50%,100% 90%,96% 100%,50% 95%,4% 100%,0 88%,2% 50%)',
        filter: `${s.blur > 0.3 ? `blur(${s.blur}px) ` : ''}drop-shadow(0 ${8 * k}px ${12 * k}px rgba(22,19,15,0.4))`,
      }}
    >
      {texto}
    </div>
  );
};
