import React from 'react';
import { FPS, SAFE_BOX } from '../../config/brand';
import { Carpeta } from '../components/Carpeta';
import type { Impacto } from '../components/CamaraMesa';
import { Objeto } from '../components/Objeto';
import { PalabraGigante, medirTitular } from '../components/PalabraGigante';
import { Sello } from '../components/Sello';
import { Subtitulos } from '../components/Subtitulos';
import { Escenario, EscenaProps } from './Escenario';

/**
 * SERIE (presentaciones): cada serie de la cuenta es una carpeta de archivo.
 * Nombre de la serie en palabra gigante; la carpeta trae la frase-gancho del utilero,
 * el objeto que la representa y, si aplica, sus sellos (p. ej. MITO / VERDAD).
 */
export const Serie: React.FC<EscenaProps> = ({ esc, timing }) => {
  const off = Math.round(timing.start * FPS);
  const ancho = 820;
  const x = SAFE_BOX.cx - ancho / 2;
  const { alto: altoTitulo } = medirTitular(esc.titulo ?? '', ancho, 300, 14);
  const altoCarpeta = 570;
  const gap = 36;
  const total = altoTitulo + gap + altoCarpeta;
  const y0 = 150 + Math.max(0, (1130 - total) / 2);
  const yCarpeta = y0 + altoTitulo + gap;
  const carpetaDelay = 16;
  const sellos = esc.sellos ?? (esc.sello ? [esc.sello] : []);
  const dosSellos = sellos.length > 1;
  const selloDelay = (i: number) => carpetaDelay + 40 + i * 16;
  const impactos: Impacto[] = sellos.map((_, i) => ({ frame: selloDelay(i) + 3, amp: 3 }));

  return (
    <Escenario fondo="papel" impactos={impactos}>
      <PalabraGigante texto={esc.titulo ?? ''} x={x} y={y0} ancho={ancho} maxSize={300} maxCharsLinea={14} delay={4} rot={-0.8} />
      <Carpeta
        x={x}
        y={yCarpeta}
        ancho={ancho}
        alto={altoCarpeta}
        delay={carpetaDelay}
        etiqueta={esc.numero ? `ARCHIVO ${esc.numero}/4` : 'ARCHIVO'}
        cita={esc.cita}
        rot={esc.numero && Number(esc.numero) % 2 === 0 ? 1.4 : -1.6}
      >
        {esc.objetoTipo && (
          <Objeto tipo={esc.objetoTipo} size={340} x={ancho - 370} y={215} rot={4} />
        )}
        {sellos.map((s, i) => (
          <Sello
            key={s}
            texto={s}
            x={dosSellos ? (i === 0 ? 230 : ancho - 250) : 220}
            y={dosSellos ? 435 + (i === 0 ? 0 : 30) : 440}
            size={dosSellos ? 118 : 100}
            rot={dosSellos ? (i === 0 ? -12 : 8) : -9}
            delay={selloDelay(i)}
            mezcla="normal"
          />
        ))}
      </Carpeta>
      <Subtitulos words={timing.words} offsetFrames={off} claves={esc.claves} y={1345} />
    </Escenario>
  );
};
