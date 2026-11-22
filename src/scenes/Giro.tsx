import React from 'react';
import { interpolate, useCurrentFrame, Easing } from 'remotion';
import { C, FPS, SAFE_BOX } from '../../config/brand';
import { Casillero, apertura } from '../components/Casillero';
import { PalabraGigante } from '../components/PalabraGigante';
import { Objeto } from '../components/Objeto';
import { Sfx } from '../components/Sfx';
import { Subtitulos } from '../components/Subtitulos';
import { Mano, Utilero } from '../components/Utilero';
import { hit } from '../lib/anim';
import { numeroCasillero } from '../lib/episode';
import { Escenario, EscenaProps } from './Escenario';

/** GIRO (15–28 s): el casillero está abierto; el objeto del día sale a las manos del utilero (P5 + E4); la palabra gigante revela el dato. */
export const Giro: React.FC<EscenaProps> = ({ esc, ep, timing }) => {
  const frame = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const ap = apertura(frame, -30, 'abierto'); // ya abierto: A08 terminó antes
  const sale = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const pop = hit(frame, 28, 6);
  // el objeto viaja del interior del casillero (izq.) a las manos (centro-der.) en arco
  const o0 = { x: -40, y: 800, s: 0.5 };
  const o1 = { x: 320, y: 895, s: 1 };
  const ox = o0.x + (o1.x - o0.x) * sale;
  const oy = o0.y + (o1.y - o0.y) * sale - Math.sin(Math.PI * sale) * 180;
  const os = (o0.s + (o1.s - o0.s) * sale) * (frame >= 28 ? 1 + 0.04 * Math.sin(Math.min(1, (frame - 28) / 8) * Math.PI) : 1);
  const tamObjeto = 380 * os;
  return (
    <Escenario fondo="papel">
      <PalabraGigante texto={esc.palabraGigante ?? ''} x={SAFE_BOX.cx - 390} y={150} ancho={780} maxSize={460} delay={8} />
      <Casillero
        x={30}
        y={470}
        escala={0.5}
        numero={numeroCasillero(ep)}
        angulo={Math.min(ap.angulo, 100)}
        luz={1}
        perspectiva={2200}
      >
        {/* interior: el bulto antes de salir */}
        {frame < 30 && (
          <div style={{ position: 'absolute', left: 90, top: 900, opacity: 1 - sale }}>
            <Objeto tipo={ep.objetoTipo} size={400} />
          </div>
        )}
      </Casillero>
      <Utilero
        expresion={esc.expresion ?? 'E4'}
        words={timing.words}
        offsetFrames={off}
        size={700}
        x={300}
        y={470}
        seed={5}
        pose="P1"
      />
      {/* objeto en vuelo / en manos */}
      {frame >= 10 && (
        <Objeto tipo={ep.objetoTipo} etiqueta={ep.etiqueta} size={tamObjeto} x={ox + 140} y={oy - 20} rot={-4 + sale * 3} />
      )}
      {frame >= 30 && (
        <svg viewBox="0 0 400 400" width={700} height={700} style={{ position: 'absolute', left: 300, top: 470, transform: `scale(${Math.max(0.01, pop)})`, transformOrigin: '50% 80%', overflow: 'visible' }}>
          <Mano x={95} y={338} rot={72} escala={1.3} />
          <Mano x={305} y={338} rot={-72} escala={1.3} />
        </svg>
      )}
      <Subtitulos words={timing.words} offsetFrames={off} claves={esc.claves} />
      <Sfx name="thump" at={28} volume={0.6} />
    </Escenario>
  );
};
