import React from 'react';
import { interpolate, useCurrentFrame, Easing } from 'remotion';
import { FPS, SAFE_BOX } from '../../config/brand';
import { CASILLERO_W, Casillero, SonidosApertura, apertura } from '../components/Casillero';
import { Objeto } from '../components/Objeto';
import { PalabraGigante } from '../components/PalabraGigante';
import { Sfx } from '../components/Sfx';
import { Subtitulos } from '../components/Subtitulos';
import { hit } from '../lib/anim';
import { Escenario, EscenaProps } from './Escenario';

/**
 * CASILLEROS (presentación del concepto): un pasillo de camerino con tres casilleros numerados.
 * Se abren de a uno y de cada uno sale un objeto → "cada video es un casillero".
 */
export const Casilleros: React.FC<EscenaProps> = ({ esc, timing }) => {
  const frame = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const escala = 0.4;
  const w = CASILLERO_W * escala; // 256
  const gap = 40;
  const x0 = SAFE_BOX.cx - (3 * w + 2 * gap) / 2;
  const y = 500;
  const numeros = ['001', '002', '003'];
  const cintas = esc.cintas ?? [];
  const objetos = esc.objetos ?? ['bulto', 'botin'];
  const aperturas = [16, 92];
  const reposo = [{ x: 40, y: 850 }, { x: 540, y: 850 }];

  return (
    <Escenario fondo="papel">
      <PalabraGigante texto={esc.palabraGigante ?? 'CASILLERO'} x={SAFE_BOX.cx - 410} y={150} ancho={820} maxSize={330} delay={4} />
      {numeros.map((n, i) => {
        const d = aperturas[i];
        const ap = d !== undefined ? apertura(frame, d, 'abierto') : { angulo: 0, luz: 0 };
        const sale = d !== undefined ? interpolate(frame, [d + 26, d + 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
        return (
          <Casillero
            key={n}
            x={x0 + i * (w + gap)}
            y={y}
            escala={escala}
            numero={n}
            tema={cintas[i]}
            cintaDelay={6 + i * 4}
            angulo={Math.min(ap.angulo, 72)}
            luz={ap.luz}
            perspectiva={2000}
            sombra={false}
          >
            {d !== undefined && objetos[i] && (
              <div style={{ position: 'absolute', left: 110, top: 780, opacity: 1 - sale }}>
                <Objeto tipo={objetos[i]} size={400} />
              </div>
            )}
          </Casillero>
        );
      })}
      {aperturas.map((d, i) => {
        const tipo = objetos[i];
        if (!tipo) return null;
        const sale = interpolate(frame, [d + 26, d + 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
        if (sale <= 0) return null;
        const desde = { x: x0 + i * (w + gap) - 20, y: y + 330 };
        const hasta = reposo[i];
        const px = desde.x + (hasta.x - desde.x) * sale;
        const py = desde.y + (hasta.y - desde.y) * sale - Math.sin(Math.PI * sale) * 170;
        const tam = 150 + (380 - 150) * sale;
        const pop = frame > d + 48 ? 1 + 0.05 * Math.max(0, 1 - (frame - d - 48) / 8) : 1;
        return (
          <React.Fragment key={i}>
            <Objeto tipo={tipo} size={tam * pop} x={px} y={py} rot={(i === 0 ? -5 : 5) * sale} />
            <Sfx name="thump" at={d + 46} volume={0.5} />
          </React.Fragment>
        );
      })}
      {aperturas.map((d, i) => (
        <SonidosApertura key={i} delay={d} hasta="abierto" />
      ))}
      <Subtitulos words={timing.words} offsetFrames={off} claves={esc.claves} />
    </Escenario>
  );
};
