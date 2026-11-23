import React from 'react';
import { useCurrentFrame } from 'remotion';
import { geoGraticule10, geoInterpolate, geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import paises from 'world-atlas/countries-50m.json';
import { C, FPS, SAFE_BOX } from '../../../config/brand';
import { CintaImpacto, TituloImpacto } from '../../components/Cinetica';
import { Impacto, Particulas } from '../../components/Fx';
import { Palabras } from '../../components/Palabras';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { E, boil, pop, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';

const TIERRA: any = feature(paises, paises.objects.countries);
const GRATICULA = geoGraticule10();

const trazo = (p: number) => ({ pathLength: 1, strokeDasharray: `${p} 2`, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

/**
 * MAPA — los lugares de la historia aparecen sobre un mapa REAL (Natural Earth, dominio público) en el instante en que
 * se nombran; la ruta se dibuja y un balón viaja de punto a punto. `fondo: "pizarra"` → mapa a tiza; por defecto, papel + lima.
 */
export const MapaPro: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const puntos = esc.puntos ?? [];
  const oscuro = esc.fondo === 'pizarra';

  const { proy, dTierra, dGrat } = React.useMemo(() => {
    const pts = puntos.map((p) => [p.lon, p.lat] as [number, number]);
    const pr = geoMercator();
    if (pts.length >= 2) {
      pr.fitExtent([[120, 430], [960, 1120]], { type: 'MultiPoint', coordinates: pts } as any);
      if (pr.scale() > 3600) {
        const cx = pts.reduce((a, q) => a + q[0], 0) / pts.length;
        const cy = pts.reduce((a, q) => a + q[1], 0) / pts.length;
        pr.scale(3600).center([cx, cy]).translate([540, 775]);
      }
    } else if (pts.length === 1) pr.center(pts[0]).scale(1700).translate([540, 775]);
    const gp = geoPath(pr);
    return { proy: pr, dTierra: gp(TIERRA) ?? '', dGrat: gp(GRATICULA) ?? '' };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(puntos)]);

  // instante en que se nombra cada lugar (la voz manda); si no se nombra, se reparte en el tiempo
  const tPunto: number[] = [];
  puntos.forEach((p, i) => {
    const prev = i === 0 ? 0 : tPunto[i - 1] + 6;
    tPunto.push(Math.max(i === 0 ? 20 : prev, cuando(timing, off, p.palabra ?? p.nombre, i === 0 ? 0 : prev, 34 + i * 52) - 2));
  });
  const ruta = esc.ruta ?? puntos.map((_, i) => i);
  const piernas = ruta.slice(0, -1).map((a, j) => {
    const b = ruta[j + 1];
    const ini = tPunto[a] + 5;
    const fin = Math.max(ini + 16, tPunto[b] + 2);
    return { a, b, ini, fin };
  });
  const xy = (i: number) => proy([puntos[i].lon, puntos[i].lat]) as [number, number];
  const gp = geoPath(proy);
  const entra = tw(f, [0, 12], [0, 1], E.outCubic);
  const bo = boil(f, 6, 1.1);
  const z = empuje(f, frames, 0.05, 6) * golpes(f, tPunto, 0.03);

  return (
    <Escenario fondo={oscuro ? 'pizarra' : 'papel'} impactos={tPunto.map((t) => ({ frame: t + 2, amp: 7 }))} deriva={0.4} zoom={z}>
      <Particulas tipo="polvo" n={16} semilla={29} colores={oscuro ? [C.tiza] : [C.tinta, C.grisArchivo]} opacidad={0.22} velocidad={0.3} />

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: entra }}>
        <g transform={`translate(${bo.x} ${bo.y}) scale(${1.05 - 0.05 * entra})`} style={{ transformOrigin: '540px 775px' }}>
          <g filter={oscuro ? 'url(#chalk)' : undefined}>
            <path d={dGrat} fill="none" stroke={oscuro ? C.tiza : C.tinta} strokeWidth={1.4} strokeDasharray="4 7" opacity={0.18} />
            <path d={dTierra} fill={oscuro ? 'rgba(237,235,228,0.10)' : C.lima} stroke={oscuro ? C.tiza : C.tinta} strokeWidth={oscuro ? 2.6 : 2.2} strokeLinejoin="round" />
          </g>
          {/* ruta: tramos de gran círculo que se dibujan al ritmo de la voz */}
          {piernas.map((l, j) => {
            const k = tw(f, [l.ini, l.fin], [0, 1], E.inOutCubic);
            if (k <= 0) return null;
            const d = gp({ type: 'LineString', coordinates: [[puntos[l.a].lon, puntos[l.a].lat], [puntos[l.b].lon, puntos[l.b].lat]] } as any) ?? '';
            return <path key={j} d={d} {...trazo(k)} stroke={oscuro ? C.lima : C.tinta} strokeWidth={7} strokeDasharray={`${k} 2`} />;
          })}
          {/* el balón que viaja */}
          {piernas.map((l, j) => {
            const k = tw(f, [l.ini, l.fin], [0, 1], E.inOutCubic);
            if (k <= 0 || k >= 1) return null;
            const q = proy(geoInterpolate([puntos[l.a].lon, puntos[l.a].lat], [puntos[l.b].lon, puntos[l.b].lat])(k)) as [number, number];
            return (
              <g key={`b${j}`} transform={`translate(${q[0]} ${q[1]}) rotate(${k * 720})`}>
                <circle r={20} fill={C.papel} stroke={C.tinta} strokeWidth={5} />
                <polygon points="0,-9 8.5,-3 5,7 -5,7 -8.5,-3" fill={C.tinta} />
              </g>
            );
          })}
          {puntos.map((p, i) => {
            const [x, y] = xy(i);
            const k = pop(f, tPunto[i], 9);
            if (k <= 0) return null;
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(${k})`}>
                <circle r={30} fill="none" stroke={oscuro ? C.lima : C.tinta} strokeWidth={5} opacity={0.5} />
                <circle r={17} fill={C.tinta} stroke={C.lima} strokeWidth={6} />
              </g>
            );
          })}
        </g>
      </svg>

      {esc.palabraGigante && <TituloImpacto lineas={[{ texto: esc.palabraGigante, at: 11 }]} x={SAFE_BOX.cx - 410} y={150} ancho={820} tono={oscuro ? 'tiza' : 'tinta'} maxSize={300} />}

      {puntos.map((p, i) => {
        const [x, y] = xy(i);
        const arriba = i % 2 === 0;
        const lx = Math.min(840, Math.max(240, x));
        return (
          <React.Fragment key={`t${i}`}>
            <CintaImpacto texto={p.nombre.toUpperCase()} x={lx} y={y + (arriba ? -92 : 92)} at={tPunto[i] + 2} rot={arriba ? -4 : 3} size={56} color={i % 2 === 0 ? C.cinta : C.lima} />
            <Impacto at={tPunto[i]} x={x} y={y} flash={0} color={oscuro ? C.lima : C.tinta} semilla={i + 3} />
            <Sfx name="pop" at={tPunto[i]} volume={0.55} />
            <Sfx name="tape" at={tPunto[i] + 2} volume={0.4} />
          </React.Fragment>
        );
      })}
      {piernas.map((l, j) => (
        <Sfx key={`w${j}`} name="whoosh" at={l.ini + 2} volume={0.4} />
      ))}
      <Palabras words={timing.words} offsetFrames={off} tono={oscuro ? 'pizarra' : 'papel'} claves={esc.claves} y={1385} size={84} />
    </Escenario>
  );
};
