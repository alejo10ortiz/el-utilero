import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, FPS, SAFE_BOX } from '../../../config/brand';
import { measureText } from '@remotion/layout-utils';
import { CintaImpacto } from '../../components/Cinetica';
import { Destello, Impacto, Particulas, Rayos } from '../../components/Fx';
import { Palabras } from '../../components/Palabras';
import { Portazo } from '../../components/Portazo';
import { Sfx } from '../../components/Sfx';
import { UtileroActor } from '../../components/UtileroActor';
import { empuje, golpes } from '../../lib/camara';
import { E, hash, pop, tw } from '../../lib/ease';
import { handleDe, numeroCasillero } from '../../lib/episode';
import { BEAT, useAbs } from '../../lib/ritmo';
import { Escenario, EscenaProps } from '../Escenario';

/**
 * CIERRE PRO: lima con rayos girando y confeti; el Utilero salta guiñando; la frase de marca salta palabra a palabra;
 * la cinta con el @usuario se clava en «casillero»; el portazo cae en el beat final.
 */
export const CierrePro: React.FC<EscenaProps> = ({ esc, ep, timing, frames }) => {
  const f = useCurrentFrame();
  const abs = useAbs();
  const off = Math.round(timing.start * FPS);
  const ultima = timing.words[timing.words.length - 1];
  const vozFin = ultima ? Math.round(ultima.end * FPS) - off : frames - 50;
  const casi = timing.words.find((w) => /casillero/i.test(w.text));
  const tHandle = casi ? Math.round(casi.start * FPS) - off - 3 : vozFin - 25;
  const tPortazo = frames - 25; // el golpe de la puerta cae 7 frames después = justo en el beat final
  const handle = handleDe(ep);
  const anchoH = measureText({ text: handle, fontFamily: 'Permanent Marker', fontSize: 84 }).width + 84 * 1.1;
  const tamH = Math.min(84, (84 * (SAFE_BOX.w - 190)) / anchoH);
  const cita = (esc.cita ?? 'Esto no salió en la tele.').split(' ');
  const pulso = 1 + 0.016 * Math.exp(-(abs % BEAT) / 4.5);
  const z = empuje(f, frames, 0.05, 6) * golpes(f, [tHandle], 0.05);
  const finalTxt = ep.textoFinal.split(' · ').slice(1).join(' · ');
  const tFinal = vozFin + 8;

  return (
    <Escenario fondo="lima" impactos={[{ frame: tHandle + 2, amp: 12 }, { frame: tPortazo + 7, amp: 14 }]} deriva={0.5} zoom={z}>
      <Rayos c2="rgba(22,19,15,0.10)" cx={540} cy={900} vel={-0.22} />
      <Particulas tipo="confeti" n={34} semilla={11} colores={[C.tinta, C.papel, C.sello, '#fff']} dir={1} velocidad={0.5} opacidad={0.85} />

      {/* frase de marca: las palabras saltan una tras otra */}
      <div
        style={{
          position: 'absolute', left: SAFE_BOX.x0, width: SAFE_BOX.w, top: 220, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 26px',
          fontFamily: FONT.susurro, fontStyle: 'italic', fontSize: 124, lineHeight: 1, letterSpacing: '-0.015em', color: C.tinta,
        }}
      >
        {cita.map((p, i) => {
          const k = pop(f, 16 + i * 4, 10);
          return (
            <span key={i} style={{ display: 'inline-block', transform: `translateY(${(1 - k) * 50}px) scale(${0.5 + 0.5 * k}) rotate(${(hash(i + 2) - 0.5) * 8 * (1 - k)}deg)`, opacity: Math.min(1, k * 3), visibility: f >= 15 + i * 4 ? 'visible' : 'hidden' }}>
              {i === 0 ? '«' : ''}
              {p}
              {i === cita.length - 1 ? '»' : ''}
            </span>
          );
        })}
      </div>

      <div style={{ transform: `scale(${pulso})`, transformOrigin: '50% 100%', position: 'absolute', inset: 0 }}>
        <UtileroActor entrada={8} desde="abajo" expresion="E2" sobre="lima" words={timing.words} offsetFrames={off} size={900} x={SAFE_BOX.cx - 450} y={440} seed={9} />
      </div>

      <Palabras words={timing.words} offsetFrames={off} tono="lima" claves={esc.claves} y={1390} size={84} />
      <CintaImpacto texto={handle} x={SAFE_BOX.cx} y={1255} at={tHandle} rot={-3} size={tamH} />
      <Impacto at={tHandle} x={SAFE_BOX.cx} y={1255} color="#fff" flash={0.3} />
      <Destello at={tHandle} color="#fff" max={0.4} dur={5} />
      {f >= tFinal && (
        <div
          style={{
            position: 'absolute', left: SAFE_BOX.x0, width: SAFE_BOX.w, top: 1395, textAlign: 'center',
            fontFamily: FONT.marcador, fontSize: 110, lineHeight: 1, color: C.tinta, textTransform: 'uppercase',
            transform: `translateY(${tw(f, [tFinal, tFinal + 9], [60, 0], E.outBack2)}px) scale(${tw(f, [tFinal, tFinal + 9], [0.5, 1], E.outBack2)}) rotate(-2deg)`,
            opacity: tw(f, [tFinal, tFinal + 4], [0, 1]),
          }}
        >
          {finalTxt}
          <svg width={SAFE_BOX.w} height={40} viewBox={`0 0 ${SAFE_BOX.w} 40`} style={{ display: 'block', margin: '-6px auto 0', overflow: 'visible' }}>
            <path d={`M${SAFE_BOX.w * 0.18} 22 C${SAFE_BOX.w * 0.35} 6 ${SAFE_BOX.w * 0.6} 34 ${SAFE_BOX.w * 0.82} 14`} fill="none" stroke={C.tinta} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${tw(f, [tFinal + 6, tFinal + 18], [0, 1], E.outExpo)} 2`} />
          </svg>
        </div>
      )}
      <Portazo delay={tPortazo} numero={numeroCasillero(ep)} />

      <Sfx name="whoosh" at={7} volume={0.5} />
      <Sfx name="pop" at={9} volume={0.5} />
      <Sfx name="wink" at={22} volume={0.5} />
      <Sfx name="impact" at={tHandle} volume={0.85} />
      <Sfx name="slap" at={tHandle} volume={0.8} />
    </Escenario>
  );
};
