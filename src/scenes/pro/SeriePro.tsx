import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FPS, SAFE_BOX } from '../../../config/brand';
import { Carpeta } from '../../components/Carpeta';
import { TituloImpacto } from '../../components/Cinetica';
import { Impacto, Particulas } from '../../components/Fx';
import { Objeto } from '../../components/Objeto';
import { medirTitular, partirTitular } from '../../components/PalabraGigante';
import { Palabras } from '../../components/Palabras';
import { Sello } from '../../components/Sello';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { pop } from '../../lib/ease';
import { BEAT, useAbs } from '../../lib/ritmo';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';

/**
 * SERIE PRO — cada serie de la cuenta es una carpeta de archivo:
 * el nombre se CLAVA cuando se dice, la carpeta entra con rebote y aterriza con onda de choque,
 * el objeto sale de la carpeta girando en la palabra clave y los sellos (MITO / VERDAD) golpean cuando se nombran.
 */
export const SeriePro: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const abs = useAbs();
  const off = Math.round(timing.start * FPS);
  const ancho = 880;
  const x = SAFE_BOX.cx - ancho / 2;
  const titulo = esc.titulo ?? '';
  const lineas = partirTitular(titulo, 14);
  const { alto: altoTitulo } = medirTitular(titulo, ancho, 300, 14);
  const altoCarpeta = 570;
  const gap = 36;
  const total = altoTitulo + gap + altoCarpeta;
  const y0 = 150 + Math.max(0, (1130 - total) / 2);
  const yCarpeta = y0 + altoTitulo + gap;

  // — tiempos anclados a la voz (siempre después de que la transición destape, f≥10)
  const tTit = Math.max(11, cuando(timing, off, lineas[0]?.split(' ')[0] ?? '', 0, 11) - 2);
  const tNum = 11; // el número gigante entra de inmediato (la voz dice «Uno/Dos/Tres/Cuatro»): nada de pantalla vacía
  const conNumero = !!esc.numero && tTit - tNum >= 8;
  const carpetaDelay = tTit + 9;
  const tLand = carpetaDelay + 10;
  const sellos = esc.sellos ?? (esc.sello ? [esc.sello] : []);
  const tSello = sellos.map((s, i) => Math.max(tLand + 6, cuando(timing, off, s, 0, tLand + 28 + i * 14) - 1));
  const tObj = Math.max(tLand + 4, cuando(timing, off, esc.claves?.[0] ?? 'objeto', 0, tLand + 16) - 2);
  const dosSellos = sellos.length > 1;
  const ro = Number(esc.numero ?? 1);
  const pulso = 1 + 0.012 * Math.exp(-(abs % BEAT) / 4.5);
  const z = empuje(f, frames, 0.06, 8) * golpes(f, [...(conNumero ? [tNum] : []), tTit, tLand, ...tSello], 0.04);
  const kObj = pop(f, tObj, 11);

  return (
    <Escenario fondo="papel" impactos={[...(conNumero ? [{ frame: tNum + 2, amp: 9 }] : []), { frame: tTit + 2, amp: 10 }, { frame: tLand, amp: 9 }, ...tSello.map((t) => ({ frame: t + 2, amp: 8 }))]} deriva={0.5} zoom={z}>
      <Particulas tipo="polvo" n={20} semilla={ro + 4} colores={[C.tinta, C.grisArchivo]} opacidad={0.22} velocidad={0.3} />
      {conNumero && <TituloImpacto lineas={[{ texto: esc.numero!, at: tNum }]} x={SAFE_BOX.cx - 260} y={y0 - 10} ancho={520} tono="tinta" maxSize={560} salida={tTit - 4} />}
      <TituloImpacto lineas={lineas.map((t, i) => ({ texto: t, at: tTit + i * 3 }))} x={x} y={y0} ancho={ancho} tono="tinta" maxSize={300} />
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${pulso})`, transformOrigin: '50% 55%' }}>
        <Carpeta x={x} y={yCarpeta} ancho={ancho} alto={altoCarpeta} delay={carpetaDelay} etiqueta={esc.numero ? `ARCHIVO ${esc.numero}/4` : 'ARCHIVO'} cita={esc.cita} rot={ro % 2 === 0 ? 1.4 : -1.6}>
          {esc.objetoTipo && f >= tObj && (
            <div style={{ position: 'absolute', left: ancho - 370, top: 215, transform: `scale(${Math.max(0.01, kObj)}) rotate(${(1 - Math.min(1, kObj)) * -34 + 4}deg)`, transformOrigin: '50% 85%', opacity: Math.min(1, kObj * 3) }}>
              <Objeto tipo={esc.objetoTipo} size={340} />
            </div>
          )}
          {sellos.map((s, i) => (
            <Sello key={s} texto={s} x={dosSellos ? (i === 0 ? 230 : ancho - 250) : 220} y={dosSellos ? 435 + (i === 0 ? 0 : 30) : 440} size={dosSellos ? 118 : 100} rot={dosSellos ? (i === 0 ? -12 : 8) : -9} delay={tSello[i]} mezcla="normal" />
          ))}
        </Carpeta>
      </div>

      {conNumero && <Impacto at={tNum} x={540} y={y0 + 200} flash={0.1} semilla={ro} />}
      <Impacto at={tTit} x={540} y={y0 + altoTitulo / 2} flash={0} />
      <Impacto at={tLand} x={540} y={yCarpeta + 320} flash={0.1} color={C.tinta} semilla={ro} />
      {f >= tObj && <Impacto at={tObj} x={760} y={yCarpeta + 360} flash={0} semilla={ro + 3} />}
      {tSello.map((t, i) => <Impacto key={i} at={t} x={i === 0 && dosSellos ? 280 : dosSellos ? 800 : 270} y={yCarpeta + 450} flash={0.12} color={C.sello} semilla={i + 9} />)}

      <Palabras words={timing.words} offsetFrames={off} claves={esc.claves} y={1385} size={84} />

      {conNumero && <Sfx name="hit" at={tNum} volume={0.7} />}
      <Sfx name="impact" at={tTit} volume={0.7} />
      <Sfx name="thump" at={tLand} volume={0.6} />
      <Sfx name="pop" at={tObj} volume={0.6} />
      <Sfx name="whoosh" at={carpetaDelay} volume={0.45} />
    </Escenario>
  );
};
