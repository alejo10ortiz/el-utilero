import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C } from '../../../config/brand';
import { CASILLERO_W, Casillero, ManoLlave } from '../../components/Casillero';
import { CintaImpacto } from '../../components/Cinetica';
import { Destello, Impacto, Particulas, Reflector, Chispas } from '../../components/Fx';
import { Avatar } from '../../components/Logo';
import { Sfx } from '../../components/Sfx';
import { golpes } from '../../lib/camara';
import { E, pop, tw } from '../../lib/ease';
import { numeroCasillero } from '../../lib/episode';
import { Escenario, EscenaProps } from '../Escenario';

/**
 * STING PRO (1 compás = 72 f): mano con llavero → llave gira → CLIC → rendija con luz lima y polvo →
 * la cinta «EL UTILERO» se clava en el beat → el avatar guiña con salto → latigazo de cinta hacia la siguiente escena.
 */
export const StingPro: React.FC<EscenaProps> = ({ ep, frames }) => {
  const f = useCurrentFrame();
  const entrada = tw(f, [0, 11], [0, 1], E.outBack);
  const giro = tw(f, [10, 28], [0, 1], E.inOutCubic);
  const angulo = tw(f, [28, 47], [0, 17], E.outCubic);
  const luz = tw(f, [28, 46], [0, 1], E.outCubic);
  const salida = tw(f, [30, 40], [1, 0], E.inExpo);
  const x = (1080 - CASILLERO_W) / 2;
  const tema = ep.cintaCasillero ?? '';
  const avatar = pop(f, 52, 10);
  const tTapa = 45;
  // cámara: arranca encima de la cerradura (plano cerrado, la mano llena el cuadro) y abre plano justo
  // cuando se abre la puerta; el golpe de la cinta la sacude.
  const foco = tw(f, [26, 47], [1, 0], E.inOutCubic);
  const z = (1 + 0.62 * foco) * (1 + 0.05 * tw(f, [47, frames], [0, 1], E.outCubic)) * golpes(f, [tTapa, 28], 0.05);
  const panX = -(690 - 540) * z * foco;
  const panY = -(1030 - 960) * z * foco;
  return (
    <Escenario fondo="tinta" impactos={[{ frame: 28, amp: 5 }, { frame: tTapa + 1, amp: 14 }]} deriva={0.6} zoom={z} panX={panX} panY={panY}>
      {/* luz que se derrama desde la rendija */}
      <div style={{ position: 'absolute', left: x + CASILLERO_W - 150, top: 300, width: 520, height: 1100, background: C.lima, opacity: luz * 0.55, filter: 'blur(90px)', borderRadius: '50%' }} />
      <Reflector x={x + CASILLERO_W - 40} opacidad={0.5 * luz} ancho={760} />
      <Casillero x={x} y={150} numero={numeroCasillero(ep)} tema={tema} angulo={angulo} luz={luz * 0.95} cintaDelay={-999} sombra={false} />
      <Particulas tipo="polvo" n={26} semilla={5} colores={[C.lima, C.papel]} opacidad={0.8 * luz} velocidad={0.35} dir={-1} />
      {f < 42 && (
        <div style={{ position: 'absolute', left: x, top: 150, opacity: salida }}>
          <ManoLlave entrada={entrada} giro={giro} />
        </div>
      )}

      <CintaImpacto texto="EL UTILERO" x={540} y={1010} at={tTapa} rot={-4} size={100} />
      <Impacto at={tTapa} x={540} y={1010} flash={0.5} />
      <Chispas at={28} x={x + 470} y={150 + 880} n={10} dist={140} dur={10} semilla={4} />

      {f >= 52 && (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${Math.max(0.01, avatar)}) rotate(${(1 - Math.min(1, avatar)) * -25}deg)`, transformOrigin: '260px 1380px' }}>
          <Avatar x={110} y={1180} size={300} />
        </div>
      )}
      <Destello at={tTapa} color="#fff" max={0.45} dur={5} />

      <Sfx name="keys" at={4} volume={0.7} />
      <Sfx name="lock" at={28} volume={0.9} />
      <Sfx name="creak" at={30} volume={0.55} />
      <Sfx name="impact" at={tTapa} volume={0.9} />
      <Sfx name="slap" at={tTapa} volume={0.8} />
      <Sfx name="whistle" at={52} volume={0.6} />
      <Sfx name="wink" at={54} volume={0.6} />
    </Escenario>
  );
};
