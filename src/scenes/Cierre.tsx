import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { measureText } from '@remotion/layout-utils';
import { A, C, FONT, FPS, SAFE_BOX } from '../../config/brand';
import { Cinta } from '../components/Cinta';
import { NivelSecreto } from '../components/NivelSecreto';
import { Portazo } from '../components/Portazo';
import { Subtitulos } from '../components/Subtitulos';
import { Utilero } from '../components/Utilero';
import { Sfx } from '../components/Sfx';
import { handleDe, numeroCasillero } from '../lib/episode';
import { Escenario, EscenaProps } from './Escenario';

/**
 * CIERRE (35–40 s): fondo lima → nivel de secreto (A11) → utilero guiñando (E2) → cita en Instrument Serif →
 * cinta @elutilero (A01) → portazo (A09) + pitazo.
 */
export const Cierre: React.FC<EscenaProps> = ({ esc, ep, timing, frames }) => {
  const frame = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const vozFin = timing.words.length ? Math.round(timing.words[timing.words.length - 1].end * FPS) - off : frames - 45;
  const cintaAt = vozFin + 4;
  const portazoAt = Math.max(vozFin + 22, frames - 22);
  const cita = interpolate(frame, [14, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const finalAt = vozFin + 10;
  // La cinta del @usuario se ajusta al ancho seguro, sea cual sea el nombre (handle más largo → letra más chica).
  const handle = handleDe(ep);
  const anchoHandle = measureText({ text: handle, fontFamily: 'Permanent Marker', fontSize: 84 }).width + 84 * 1.1;
  const tamHandle = Math.min(84, (84 * (SAFE_BOX.w - 190)) / anchoHandle);
  // Sin nivel de secreto (presentaciones) la frase sube y el utilero crece.
  const conNivel = ep.nivelSecreto !== undefined;
  return (
    <Escenario fondo="lima" impactos={[{ frame: portazoAt + A.portazo - 1, amp: 6 }]}>
      {conNivel && <NivelSecreto nivel={ep.nivelSecreto!} x={SAFE_BOX.cx} y={160} size={190} delay={6} />}
      <div
        style={{
          position: 'absolute', left: SAFE_BOX.x0, width: SAFE_BOX.w, top: conNivel ? 500 : 230, textAlign: 'center',
          fontFamily: FONT.susurro, fontStyle: 'italic', fontSize: 118, lineHeight: 0.98, letterSpacing: '-0.015em',
          color: C.tinta, opacity: cita, transform: `translateY(${(1 - cita) * 16}px)`,
        }}
      >
        «{esc.cita ?? 'Esto no salió en la tele.'}»
      </div>
      <Utilero
        expresion={esc.expresion ?? 'E2'}
        sobre="lima"
        words={timing.words}
        offsetFrames={off}
        size={conNivel ? 620 : 700}
        x={SAFE_BOX.cx - (conNivel ? 310 : 350)}
        y={conNivel ? 600 : 520}
        seed={9}
      />
      <Subtitulos words={timing.words} offsetFrames={off} tono="lima" claves={esc.claves} y={1335} />
      <Cinta texto={handle} x={SAFE_BOX.cx} y={1185} rot={-3} size={tamHandle} delay={cintaAt} />
      {frame >= finalAt && (
        <div
          style={{
            position: 'absolute', left: SAFE_BOX.x0, width: SAFE_BOX.w, top: 1360, textAlign: 'center',
            fontFamily: FONT.maquina, fontSize: 40, color: C.tinta, letterSpacing: '0.04em',
            opacity: interpolate(frame, [finalAt, finalAt + 6], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          {ep.textoFinal.split(' · ').slice(1).join(' · ')}
        </div>
      )}
      <Portazo delay={portazoAt} numero={numeroCasillero(ep)} />
    </Escenario>
  );
};
