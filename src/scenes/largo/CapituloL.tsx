import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import { C, FONT } from '../../../config/brand';
import { Impacto } from '../../components/Fx';
import { Sfx } from '../../components/Sfx';
import { E, boil, slam, tw } from '../../lib/ease';
import { Escenario, EscenaProps } from '../Escenario';

/**
 * CAPÍTULO — tarjeta sin voz de ~2,4 s sobre fondo lima: el número gigante a la izquierda, el título a la derecha y un
 * trazo de marcador que lo subraya. Marca el pulso de los videos largos (cada capítulo abre una pregunta).
 */
export const CapituloL: React.FC<EscenaProps> = ({ esc }) => {
  const f = useCurrentFrame();
  const titulo = (esc.titulo ?? '').toUpperCase();
  const { fontSize } = fitText({ text: titulo, withinWidth: 980, fontFamily: 'League Gothic', fontWeight: '400' });
  const tam = Math.min(300, fontSize);
  const sN = slam(f, 4, 2.2);
  const sT = slam(f, 11, 1.8);
  const bo = boil(f, 8, 1.4);
  const trazo = tw(f, [20, 34], [0, 1], E.outExpo);
  const kicker = tw(f, [8, 20], [0, 1], E.outCubic);
  return (
    <Escenario fondo="lima" impactos={[{ frame: 6, amp: 14 }, { frame: 13, amp: 10 }]} deriva={0.5}>
      {sN.visible && (
        <div
          style={{
            position: 'absolute', left: 130, top: 40, fontFamily: FONT.grito, fontSize: 880, lineHeight: 0.9, color: C.tinta, opacity: sN.opacity,
            textShadow: `22px 18px 0 ${C.papel}`, transform: `translate(${bo.x}px, ${sN.y + bo.y}px) scale(${sN.scale})`, transformOrigin: '30% 70%',
            filter: sN.blur > 0.3 ? `blur(${sN.blur}px)` : undefined,
          }}
        >
          {esc.numero}
        </div>
      )}
      <div style={{ position: 'absolute', left: 800, top: 290, opacity: kicker, fontFamily: FONT.maquina, fontSize: 52, letterSpacing: '0.3em', color: C.tinta, transform: `translateX(${(1 - kicker) * -40}px)` }}>
        CAPÍTULO
      </div>
      {sT.visible && (
        <div
          style={{
            position: 'absolute', left: 790, top: 360, whiteSpace: 'nowrap', fontFamily: FONT.grito, fontSize: tam, lineHeight: 0.95, color: C.tinta, opacity: sT.opacity,
            transform: `translate(${bo.x}px, ${sT.y + bo.y}px) scale(${sT.scale})`, transformOrigin: '0% 60%', filter: sT.blur > 0.3 ? `blur(${sT.blur}px)` : undefined,
          }}
        >
          {titulo}
        </div>
      )}
      <svg width={980} height={60} viewBox="0 0 1100 60" style={{ position: 'absolute', left: 800, top: 360 + tam * 0.98, overflow: 'visible' }}>
        <path d="M6 34 C200 8 420 52 640 24 S980 40 1090 18" fill="none" stroke={C.tinta} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${trazo} 2`} />
      </svg>
      <Impacto at={6} x={600} y={520} flash={0.1} color={C.tinta} semilla={3} />
      <Sfx name="slam" at={6} volume={0.8} />
      <Sfx name="stamp" at={13} volume={0.6} />
      <Sfx name="marker" at={21} volume={0.5} />
    </Escenario>
  );
};
