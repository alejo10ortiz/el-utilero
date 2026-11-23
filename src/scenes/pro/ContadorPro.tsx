import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import { C, FONT, FPS, SAFE_BOX } from '../../../config/brand';
import { CintaImpacto } from '../../components/Cinetica';
import { Destello, Impacto, Particulas } from '../../components/Fx';
import { Palabras } from '../../components/Palabras';
import { Sello } from '../../components/Sello';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { E, boil, hash, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';

const fmt = (n: number) => (Math.abs(n) >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(n));

/** Marcas de conteo a tiza (palitos en grupos de 5, el quinto tacha los cuatro). */
const Marcas: React.FC<{ n: number; flash: boolean }> = ({ n, flash }) => {
  const x0 = 96;
  const y0 = 215;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
      <g filter="url(#chalk)" strokeLinecap="round" fill="none">
        {Array.from({ length: n }).map((_, i) => {
          const g = Math.floor(i / 5);
          const k = i % 5;
          const gx = x0 + (g % 6) * 148;
          const gy = y0 + Math.floor(g / 6) * 122;
          const ultima = i === n - 1;
          const color = ultima && flash ? C.lima : C.tiza;
          const tilt = (hash(i + 4) - 0.5) * 10;
          return k < 4 ? (
            <line key={i} x1={gx + k * 30} y1={gy + (hash(i) - 0.5) * 6} x2={gx + k * 30 + tilt} y2={gy + 96 + (hash(i + 9) - 0.5) * 6} stroke={color} strokeWidth={9} />
          ) : (
            <line key={i} x1={gx - 12} y1={gy + 78} x2={gx + 3 * 30 + 16} y2={gy + 14} stroke={color} strokeWidth={9} />
          );
        })}
      </g>
    </svg>
  );
};

/**
 * CONTADOR — una cifra que SUBE de golpe (en lugar de una ficha con el número escrito).
 * `estilo: "tiza"` → pizarra con marcas de conteo que se llenan mientras corre la cuenta (ideal para goles, partidos…);
 * `estilo: "marcador"` → cifra gigante sobre papel. La cuenta termina en la palabra `clave` de la voz; ahí cae el impacto.
 */
export const ContadorPro: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const cifra = esc.cifra ?? 0;
  const desde = esc.desde ?? 0;
  const tiza = (esc.estilo ?? 'tiza') === 'tiza';
  const t0 = 11;
  const tFin = Math.min(frames - 18, Math.max(t0 + 34, esc.clave ? cuando(timing, off, esc.clave, 0, t0 + 76) : t0 + 76));
  const p = tw(f, [t0, tFin], [0, 1], E.inOutCubic);
  const valor = Math.round(desde + (cifra - desde) * p);
  const fin = f >= tFin;
  const despues = f - tFin;
  const rango = cifra - desde || 1;
  const marcas = tiza ? Math.round(Math.min(cifra, 150) * ((valor - desde) / rango)) : 0;
  const { fontSize } = fitText({ text: fmt(cifra), withinWidth: 880, fontFamily: 'League Gothic', fontWeight: '400' });
  const size = Math.min(tiza ? 340 : 560, fontSize);
  const b = boil(f, 3, fin ? 0.8 : 0.8 + 3.4 * p);
  const escala = fin ? 1 + 0.07 * Math.exp(-despues / 5) : 0.9 + 0.1 * p;
  const yNum = tiza ? 850 : 330;
  const entra = tw(f, [t0 - 2, t0 + 6], [0, 1], E.outCubic);
  const z = empuje(f, frames, 0.05, 8) * golpes(f, [tFin], 0.06);

  return (
    <Escenario fondo={tiza ? 'pizarra' : 'papel'} impactos={[{ frame: tFin + 1, amp: 15 }]} deriva={0.5} zoom={z}>
      <Particulas tipo="polvo" n={26} semilla={17} colores={tiza ? [C.tiza, C.lima] : [C.tinta, C.grisArchivo]} opacidad={0.3} velocidad={0.35} />
      {tiza && f >= t0 && <Marcas n={marcas} flash={!fin} />}
      <div
        style={{
          position: 'absolute', left: SAFE_BOX.cx - 470, top: yNum, width: 940, textAlign: 'center', opacity: entra,
          fontFamily: FONT.grito, fontSize: size, lineHeight: 0.92, color: tiza ? C.tiza : C.tinta, filter: tiza ? 'url(#chalk)' : undefined,
          textShadow: `${size * 0.03}px ${size * 0.024}px 0 ${C.lima}`, transform: `translate(${b.x}px, ${b.y}px) rotate(${b.r}deg) scale(${escala})`,
        }}
      >
        {fmt(valor)}
      </div>
      {esc.unidad && f >= t0 + 12 && <CintaImpacto texto={esc.unidad} x={SAFE_BOX.cx} y={yNum + size * 0.92 + 70} at={t0 + 12} rot={-3} size={tiza ? 70 : 80} />}
      {esc.sello && fin && <Sello texto={esc.sello} x={tiza ? 700 : 690} y={tiza ? 1010 : 840} size={tiza ? 100 : 130} rot={-9} delay={tFin + 5} mezcla={tiza ? 'normal' : 'multiply'} />}
      <Impacto at={tFin} x={540} y={yNum + size * 0.4} flash={0.3} />
      <Destello at={tFin} color={C.lima} max={0.35} dur={5} />
      <Palabras words={timing.words} offsetFrames={off} tono={tiza ? 'pizarra' : 'papel'} claves={esc.claves} y={1385} size={84} />

      <Sfx name="whoosh" at={t0 - 2} volume={0.45} />
      <Sfx name="riser" at={tFin} volume={0.5} />
      <Sfx name="impact" at={tFin} volume={0.85} />
      {esc.sello && <Sfx name="stamp" at={tFin + 5} volume={0.5} />}
    </Escenario>
  );
};
