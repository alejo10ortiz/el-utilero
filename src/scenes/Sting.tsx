import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { A, C } from '../../config/brand';
import { Camerino, ManoLlave, SonidosApertura, apertura, CAMERINO_W } from '../components/Camerino';
import { Cinta } from '../components/Cinta';
import { Avatar } from '../components/Logo';
import { Sfx } from '../components/Sfx';
import { hit, prog } from '../lib/anim';
import { numeroCamerino } from '../lib/episode';
import { Escenario, EscenaProps } from './Escenario';

/**
 * STING de marca (§5.3), 2 s = 60 f. Se usa como transición del gancho al cuerpo.
 *  0–12   negro; la mano entra con el llavero (tintineo)
 *  12–24  llave en la cerradura, gira → clic
 *  24–42  la puerta se entreabre (15°); luz lima por la rendija
 *  42–60  golpe de cinta «EL UTILERO» + guiño + pitazo corto
 */
export const Sting: React.FC<EscenaProps> = ({ ep }) => {
  const frame = useCurrentFrame();
  const ap = apertura(frame, 12, 'entreabierto');
  const entrada = prog(frame, 0, 12);
  const salida = interpolate(frame, [26, 34], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const x = (1080 - CAMERINO_W) / 2;
  const tema = ep.cintaCamerino ?? (ep.pais && ep.anio ? `${ep.pais} ${String(ep.anio).slice(2)}` : '');
  const avatar = hit(frame, 46, 6);
  return (
    <Escenario fondo="tinta" impactos={[{ frame: 42, amp: 5 }]} deriva={0.6}>
      <Camerino rotulo={ep.rotulo} x={x} y={150} numero={numeroCamerino(ep)} tema={tema} angulo={ap.angulo} luz={ap.luz * 0.9} cintaDelay={-999} sombra={false} />
      {frame < 40 && (
        <div style={{ position: 'absolute', left: x, top: 150, opacity: salida }}>
          <ManoLlave entrada={entrada} giro={ap.llave} />
        </div>
      )}
      {/* la cinta de marca pega encima del camerino */}
      <Cinta texto="EL UTILERO" x={540} y={1010} rot={-4} size={96} delay={42} />
      {frame >= 46 && (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${Math.max(0.01, avatar)})`, transformOrigin: '260px 1380px' }}>
          <Avatar x={110} y={1180} size={300} />
        </div>
      )}
      <SonidosApertura delay={12} hasta="entreabierto" />
      <Sfx name="whistle" at={A.cinta + 42} volume={0.7} />
      <Sfx name="wink" at={50} volume={0.6} />
    </Escenario>
  );
};
