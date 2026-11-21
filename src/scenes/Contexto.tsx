import React from 'react';
import { A, C, FPS, SAFE_BOX } from '../../config/brand';
import { Ficha } from '../components/Ficha';
import { PalabraGigante } from '../components/PalabraGigante';
import { Sello } from '../components/Sello';
import { Subtitulos } from '../components/Subtitulos';
import { Utilero } from '../components/Utilero';
import { Escenario, EscenaProps } from './Escenario';
import type { Impacto } from '../components/CamaraMesa';

/**
 * CONTEXTO (7–15 s): ficha a máquina con fecha y lugar; sello de la situación (A02) o círculo de marcador (A07).
 * Con palabra gigante: gigante arriba + ficha abajo. Sin ella: el utilero asoma por detrás de la ficha.
 */
export const Contexto: React.FC<EscenaProps> = ({ esc, timing }) => {
  const off = Math.round(timing.start * FPS);
  const conGigante = !!esc.palabraGigante;
  const ficha = esc.ficha ?? '';
  const fichaDelay = conGigante ? 20 : 6;
  const typingFrames = Math.ceil(ficha.length * A.maquinaFramesPorLetra);
  const selloDelay = fichaDelay + A.ficha + typingFrames + 8;
  const impactos: Impacto[] = esc.sello ? [{ frame: selloDelay + 3, amp: 3 }] : [];

  const ancho = conGigante ? 820 : 860;
  const x = SAFE_BOX.cx - ancho / 2;
  const y = conGigante ? 640 : 660;
  const size = conGigante ? 54 : 70;
  const altoMin = conGigante ? 470 : 520;

  return (
    <Escenario fondo="papel" impactos={impactos}>
      {conGigante && (
        <PalabraGigante texto={esc.palabraGigante!} x={SAFE_BOX.cx - 410} y={150} ancho={820} maxSize={560} delay={4} />
      )}
      {!conGigante && (
        <Utilero
          expresion={esc.expresion ?? 'E5'}
          words={timing.words}
          offsetFrames={off}
          size={700}
          x={SAFE_BOX.cx - 270}
          y={90}
          seed={3}
        />
      )}
      {/* ficha de fondo (pila de archivo) */}
      <div
        style={{
          position: 'absolute', left: x + 16, top: y + 20, width: ancho, height: altoMin,
          background: C.ficha, transform: 'rotate(2.6deg)', boxShadow: '0 18px 26px -20px rgba(22,19,15,0.5)',
          opacity: 0.9,
        }}
      />
      <Ficha
        lineas={[ficha]}
        x={x}
        y={y}
        ancho={ancho}
        size={size}
        altoMin={altoMin}
        rot={conGigante ? -2.5 : 1.2}
        delay={fichaDelay}
        marcar={esc.marcador}
        encabezado="ARCHIVO DEL CAMERINO"
      />
      {esc.sello && <Sello texto={esc.sello} x={x + ancho - 190} y={y + altoMin - 110} size={130} rot={-10} delay={selloDelay} />}
      <Subtitulos words={timing.words} offsetFrames={off} claves={esc.claves} />
    </Escenario>
  );
};
