import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import { C, FONT, FPS, SAFE_BOX } from '../../../config/brand';
import { Destello, Impacto, Particulas, PizarraTactica } from '../../components/Fx';
import { LineaPalabras, TituloImpacto, LineaTitulo } from '../../components/Cinetica';
import { partirTitular } from '../../components/PalabraGigante';
import { Sfx } from '../../components/Sfx';
import { E, boil, slam, tw } from '../../lib/ease';
import { empuje, golpes } from '../../lib/camara';
import { snap, useAbs, BEAT } from '../../lib/ritmo';
import { Escenario, EscenaProps } from '../Escenario';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();

/**
 * GANCHO PRO — pensado para que no se haga swipe:
 *  · arranca con golpe (flash + zoom-out + bombo), nunca con negro
 *  · fase A: las palabras de la voz saltan en pantalla cuando se dicen, mientras sube un riser
 *  · el "kicker" (p. ej. 1930) se CLAVA justo antes de que se diga, con onda de choque
 *  · fase B: el titular se clava línea a línea a tiempo con la voz; la última, con el golpe grande
 *  · pizarra táctica dibujándose sola, polvo de tiza, empuje de cámara continuo
 */
export const GanchoPro: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const abs = useAbs();
  const off = Math.round(timing.start * FPS);
  const pal = timing.words.map((w) => ({ t: w.text, ini: Math.round(w.start * FPS) - off, fin: Math.round(w.end * FPS) - off }));

  // ── kicker
  const kIdx = esc.kicker ? pal.findIndex((p) => norm(p.t).includes(norm(esc.kicker!))) : -1;
  const tK = kIdx >= 0 ? snap(pal[kIdx].ini - 3, 9, 4) : -1;
  const tSalidaA = kIdx >= 0 ? pal[kIdx].fin - 6 : 0;

  // ── fase A: palabras previas al kicker, en líneas
  const previas = kIdx >= 0 ? pal.slice(0, kIdx) : [];
  const lineasA: { texto: string; at: number }[][] = [];
  let acc: { texto: string; at: number }[] = [];
  let len = 0;
  for (const p of previas) {
    const t = p.t.toUpperCase().replace(/[.,;:¡!¿?…]+$/u, '');
    if (acc.length && len + t.length + 1 > 16) {
      lineasA.push(acc);
      acc = [];
      len = 0;
    }
    acc.push({ texto: t, at: p.ini });
    len += t.length + 1;
  }
  if (acc.length) lineasA.push(acc);

  // ── fase B: líneas del titular sincronizadas con la voz
  const lineasTexto = partirTitular(esc.texto ?? '', 9);
  const desde = kIdx >= 0 ? kIdx + 1 : 0;
  let cursor = desde - 1;
  let prev = Math.max(8, tSalidaA);
  const lineasB: LineaTitulo[] = lineasTexto.map((l, i) => {
    const primera = norm(l.split(' ')[0]);
    let hit = -1;
    for (let j = cursor + 1; j < pal.length; j++) {
      if (norm(pal[j].t) === primera) {
        hit = j;
        break;
      }
    }
    let at: number;
    if (hit >= 0) {
      cursor = hit;
      at = snap(pal[hit].ini - 1, 9, 2);
    } else at = prev + 12;
    prev = at;
    return { texto: l, at, resaltar: esc.resaltar };
  });
  const tClimax = lineasB.length ? lineasB[lineasB.length - 1].at : 0;
  const ancho = 880;
  const xT = SAFE_BOX.cx - ancho / 2;

  // ── kicker gigante
  const kSize = esc.kicker ? Math.min(560, fitText({ text: esc.kicker, withinWidth: ancho, fontFamily: 'League Gothic', fontWeight: '400' }).fontSize) : 0;
  const kSlam = slam(f, tK, 2.8);
  const kSale = tw(f, [tSalidaA + 2, tSalidaA + 12], [0, 1], E.inOutExpo);
  const kScale = (kSlam.scale || 0) * (1 - 0.6 * kSale);
  const kY = 1130 + (200 - 1130) * kSale + kSlam.y;
  const kb = boil(f, 7, 2.2);

  const impactosCam = [
    { frame: 1, amp: 9 },
    ...(tK >= 0 ? [{ frame: tK + 1, amp: 16 }] : []),
    ...lineasB.slice(0, -1).map((l) => ({ frame: l.at + 2, amp: 8 })),
    { frame: tClimax + 2, amp: 15 },
  ];
  const z =
    tw(f, [0, 14], [1.22, 1], E.outExpo) * empuje(f, frames, 0.05, 14) * golpes(f, [tK, ...lineasB.map((l) => l.at)].filter((x) => x >= 0), 0.04) *
    tw(f, [frames - 24, frames], [1, 1.45], E.inExpo); // empuje hacia el corte: la cámara se "traga" el clímax

  return (
    <Escenario fondo="pizarra" impactos={impactosCam} deriva={0.5} zoom={z}>
      <PizarraTactica delay={0} opacidad={0.3} />
      <Particulas tipo="polvo" n={42} semilla={3} colores={[C.tiza, C.lima]} opacidad={0.55} velocidad={0.45} />

      {/* fase A: las palabras saltan con la voz */}
      {lineasA.map((l, i) => (
        <LineaPalabras key={i} palabras={l} x={SAFE_BOX.cx - 450} y={290 + i * 142} ancho={900} size={146} salida={tSalidaA} />
      ))}

      {/* kicker gigante (1930) */}
      {kSlam.visible && (
        <div
          style={{
            position: 'absolute', left: SAFE_BOX.cx - 450, top: kY - kSize * 0.45, width: 900, textAlign: 'center',
            fontFamily: FONT.grito, fontSize: kSize, lineHeight: 0.9, color: C.tiza, filter: `${kSlam.blur > 0.3 ? `blur(${kSlam.blur}px) ` : ''}url(#chalk)`,
            transform: `translate(${kb.x}px, ${kb.y}px) scale(${kScale}) rotate(${kb.r - 1.5 * (1 - kSale)}deg)`, opacity: kSlam.opacity,
            textShadow: `${12}px ${9}px 0 ${C.lima}`,
          }}
        >
          {esc.kicker}
        </div>
      )}

      {/* fase B: el titular se clava línea a línea */}
      <TituloImpacto lineas={lineasB} x={xT} y={300} ancho={ancho} tono="tiza" maxSize={410} />

      {/* golpes de luz y ondas de choque */}
      <Destello at={1} max={0.9} dur={5} />
      {tK >= 0 && <Impacto at={tK} y={1130} />}
      {lineasB.slice(0, -1).map((l, i) => (
        <Impacto key={i} at={l.at} y={560 + i * 260} flash={0.12} semilla={i + 2} />
      ))}
      {lineasB.length > 0 && <Impacto at={tClimax} y={1250} flash={0.55} semilla={9} />}

      {/* sonido: golpe inicial, riser que llega al kicker, un impacto por línea y el grande al final */}
      <Sfx name="hit" at={0} volume={0.8} />
      {tK >= 0 && <Sfx name="riser" at={tK} volume={0.55} />}
      {tK >= 0 && <Sfx name="impact" at={tK} volume={0.85} />}
      {lineasB.slice(0, -1).map((l, i) => (
        <Sfx key={i} name="hit" at={l.at} volume={0.55} />
      ))}
      {lineasB.length > 0 && <Sfx name="impact" at={tClimax} volume={1} />}
    </Escenario>
  );
};
