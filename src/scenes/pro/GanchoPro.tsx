import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import { C, FONT, FPS, SAFE_BOX } from '../../../config/brand';
import { Chispas, Destello, Impacto, Particulas, PizarraTactica } from '../../components/Fx';
import { TituloImpacto, LineaTitulo } from '../../components/Cinetica';
import { partirTitular } from '../../components/PalabraGigante';
import { Sfx } from '../../components/Sfx';
import { E, boil, hash, pop, slam, tw } from '../../lib/ease';
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

  // ── fase A: las palabras previas al kicker, agrupadas por el ritmo de la voz en frases cortas
  //    que se REEMPLAZAN a tamaño gigante (contraste extremo de tamaños). La última queda como "lead-in" del kicker.
  type Palabra = { texto: string; at: number };
  const previas = kIdx >= 0 ? pal.slice(0, kIdx) : [];
  const chunks: { palabras: Palabra[]; ini: number; fin: number }[] = [];
  previas.forEach((p, i) => {
    const t = p.t.toUpperCase().replace(/[.,;:¡!¿?…]+$/u, '');
    const ult = chunks[chunks.length - 1];
    const largo = ult ? ult.palabras.reduce((a, w) => a + w.texto.length + 1, 0) : 0;
    const ultimaPrevia = i === previas.length - 1;
    if (ult && p.ini - ult.fin < 4 && largo + t.length <= 16 && !ultimaPrevia) {
      ult.palabras.push({ texto: t, at: p.ini });
      ult.fin = p.fin;
    } else chunks.push({ palabras: [{ texto: t, at: p.ini }], ini: p.ini, fin: p.fin });
  });
  const chunkInfo = chunks.map((c, i) => {
    const texto = c.palabras.map((w) => w.texto).join(' ');
    const { fontSize } = fitText({ text: texto, withinWidth: 900, fontFamily: 'League Gothic', fontWeight: '400' });
    const siguiente = chunks[i + 1];
    return { ...c, texto, size: Math.min(440, fontSize), sale: siguiente ? siguiente.ini - 2 : -1, entra: Math.max(1, c.ini - 2) };
  });

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
  const kY = 1080 + (200 - 1080) * kSale + kSlam.y;
  const kb = boil(f, 7, 2.2);

  const impactosCam = [
    { frame: 1, amp: 9 },
    ...(tK >= 0 ? [{ frame: tK + 1, amp: 16 }] : []),
    ...lineasB.slice(0, -1).map((l) => ({ frame: l.at + 2, amp: 8 })),
    { frame: tClimax + 2, amp: 15 },
  ];
  const z =
    tw(f, [0, 14], [1.22, 1], E.outExpo) * empuje(f, frames, 0.05, 14) * golpes(f, [tK, ...lineasB.map((l) => l.at), ...chunkInfo.map((c) => c.entra)].filter((x) => x >= 0), 0.035) *
    tw(f, [frames - 24, frames], [1, 1.45], E.inExpo); // empuje hacia el corte: la cámara se "traga" el clímax

  return (
    <Escenario fondo="pizarra" impactos={impactosCam} deriva={0.5} zoom={z}>
      <PizarraTactica delay={0} opacidad={0.5} />
      <Particulas tipo="polvo" n={42} semilla={3} colores={[C.tiza, C.lima]} opacidad={0.55} velocidad={0.45} />

      {/* fase A: frases gigantes que se reemplazan al ritmo de la voz */}
      {chunkInfo.map((c, ci) => {
        const ultima = ci === chunkInfo.length - 1;
        const sale = c.sale >= 0 ? tw(f, [c.sale, c.sale + 4], [0, 1], E.inExpo) : 0;
        const sube = ultima && tK >= 0 ? tw(f, [tK, tK + 9], [0, 1], E.outExpo) : 0; // "DESDE" cede el centro al kicker
        const salidaA = tw(f, [tSalidaA, tSalidaA + 5], [0, 1], E.inExpo);
        if (f < c.entra || sale >= 1 || salidaA >= 1) return null;
        const yC = 700 + (470 - 700) * sube;
        const k = 1 - 0.45 * sube;
        const multi = c.palabras.length > 1;
        const sl = slam(f, c.entra, 1.9);
        return (
          <div
            key={ci}
            style={{
              position: 'absolute', left: SAFE_BOX.cx - 450, top: yC - c.size * 0.45, width: 900, textAlign: 'center', whiteSpace: 'nowrap',
              fontFamily: FONT.grito, fontSize: c.size, lineHeight: 0.9, color: C.tiza, filter: 'url(#chalk)',
              transform: `translateY(${-(sale + salidaA) * 120}px) scale(${(multi ? 1 : sl.scale) * k * (1 + sale * 0.1)})`, opacity: (multi ? 1 : sl.opacity) * (1 - Math.max(sale, salidaA)),
              textShadow: `${c.size * 0.04}px ${c.size * 0.03}px 0 ${C.lima}`,
            }}
          >
            {c.palabras.map((w, wi) => {
              const kk = pop(f, w.at - 1, 8);
              return (
                <span
                  key={wi}
                  style={{
                    display: 'inline-block', marginRight: wi < c.palabras.length - 1 ? c.size * 0.2 : 0,
                    visibility: multi && f < w.at - 1 ? 'hidden' : 'visible',
                    transform: multi ? `translateY(${(1 - kk) * 50}px) scale(${0.4 + 0.6 * kk}) rotate(${(hash(wi + 3) - 0.5) * 8 * (1 - kk)}deg)` : undefined,
                    opacity: multi ? Math.min(1, kk * 3) : 1,
                  }}
                >
                  {w.texto}
                </span>
              );
            })}
          </div>
        );
      })}
      {chunkInfo.map((c) => (
        <React.Fragment key={`fx${c.ini}`}>
          <Chispas at={c.entra} x={540} y={700} n={9} dist={190} colores={[C.tiza, C.lima]} dur={10} semilla={c.ini} />
          <Sfx name="pop" at={c.entra + 1} volume={0.45} />
        </React.Fragment>
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
      <Destello at={0} max={0.95} dur={5} />
      {tK >= 0 && <Impacto at={tK} y={1080} />}
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
