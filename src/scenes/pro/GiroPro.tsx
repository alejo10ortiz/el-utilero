import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FPS, SAFE_BOX } from '../../../config/brand';
import { Camerino, SonidosApertura, apertura } from '../../components/Camerino';
import { CintaImpacto, TituloImpacto } from '../../components/Cinetica';
import { Chispas, Destello, Impacto, Particulas } from '../../components/Fx';
import { Objeto } from '../../components/Objeto';
import { Palabras } from '../../components/Palabras';
import { Sfx } from '../../components/Sfx';
import { UtileroActor } from '../../components/UtileroActor';
import { Mano } from '../../components/Utilero';
import { empuje, golpes } from '../../lib/camara';
import { E, pop, tw } from '../../lib/ease';
import { numeroCamerino } from '../../lib/episode';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';

/**
 * GIRO PRO — la fecha se clava al empezar; el camerino se abre y el objeto del día sale volando en arco
 * (justo cuando se dice `gatillo`, por defecto «paquete») hasta las manos del Utilero; al decir `clave` («copa») se arma el
 * estallido de la hinchada (o un golpe seco si `tono: "misterio"`).
 */
export const GiroPro: React.FC<EscenaProps> = ({ esc, ep, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const tFecha = 11; // la fecha entra de inmediato
  const tPaquete = cuando(timing, off, esc.gatillo ?? 'paquete', 0, 100);
  const tVuela = Math.max(46, tPaquete - 8);
  const tLand = tVuela + 22;
  const tCopa = cuando(timing, off, esc.clave ?? 'copa', tPaquete, tLand + 40);
  const misterio = esc.tono === 'misterio';
  const dOpen = 26; // la puerta se abre pronto: el interior ya se ve mientras se cuenta la historia
  const ap = apertura(f, dOpen, 'abierto');
  const k = tw(f, [tVuela, tLand], [0, 1], E.inOutCubic);
  const sale = tw(f, [tVuela, tVuela + 4], [0, 1], E.outCubic);
  const px = 100 + (460 - 100) * k;
  const py = 840 + (875 - 840) * k - Math.sin(Math.PI * k) * 220;
  const tam = 165 + (380 - 165) * E.outBack(k);
  const manos = pop(f, tLand + 2, 8);
  // etiquetas de marcador que se clavan cuando se NOMBRA algo (Pickles…, la Copa)
  const nombres = (esc.claves ?? []).slice(0, 2).map((c) => ({ texto: c.toUpperCase(), at: cuando(timing, off, c, 0, -1) - 2 })).filter((n) => n.at > 12);
  const tagPickles = nombres[0];
  const z = empuje(f, frames, 0.06, 8) * golpes(f, [tFecha, tLand, tCopa], 0.045);

  return (
    <Escenario fondo="papel" impactos={[{ frame: tFecha + 2, amp: 12 }, { frame: tLand + 1, amp: 11 }, { frame: tCopa + 2, amp: 13 }]} deriva={0.5} zoom={z}>
      <Particulas tipo="polvo" n={20} semilla={31} colores={[C.tinta, C.grisArchivo]} opacidad={0.22} velocidad={0.3} />
      <TituloImpacto lineas={[{ texto: esc.palabraGigante ?? '', at: tFecha }]} x={SAFE_BOX.cx - 390} y={150} ancho={780} tono="tinta" maxSize={460} />

      <Camerino x={30} y={470} escala={0.5} numero={numeroCamerino(ep)} rotulo={ep.rotulo} angulo={Math.min(ap.angulo, 100)} luz={1} perspectiva={2200}>
        {f < tVuela + 4 && (
          <div style={{ position: 'absolute', left: 135, top: 600, opacity: 1 - sale }}>
            <Objeto tipo={ep.objetoTipo} size={330} />
          </div>
        )}
      </Camerino>

      <UtileroActor entrada={12} desde="derecha" expresion={f < tCopa - 2 ? 'E1' : (esc.expresion ?? 'E4')} words={timing.words} offsetFrames={off} size={700} x={300} y={470} seed={5} />

      {f >= tVuela && <Objeto tipo={ep.objetoTipo} etiqueta={ep.etiqueta} size={tam} x={px} y={py} rot={-30 * (1 - k) + 3} />}
      {f >= tLand && (
        <svg viewBox="0 0 400 400" width={700} height={700} style={{ position: 'absolute', left: 300, top: 470, transform: `scale(${Math.max(0.01, manos)})`, transformOrigin: '50% 80%', overflow: 'visible' }}>
          <Mano x={95} y={338} rot={72} escala={1.3} />
          <Mano x={305} y={338} rot={-72} escala={1.3} />
        </svg>
      )}

      <Impacto at={tFecha} x={540} y={330} flash={0} />
      <Impacto at={tLand} x={640} y={1130} flash={0.15} color={C.tinta} semilla={3} />
      <Impacto at={tCopa} x={640} y={900} flash={0.35} semilla={8} />
      <Chispas at={dOpen + 8} x={190} y={760} n={8} dist={130} dur={10} semilla={2} />
      <Destello at={tCopa} color={misterio ? C.tinta : C.lima} max={misterio ? 0.28 : 0.35} dur={5} />
      {tagPickles && f < tCopa - 2 && <CintaImpacto texto={tagPickles.texto} x={760} y={1255} at={tagPickles.at} rot={-4} size={74} color={C.lima} />}
      {tagPickles && <Impacto at={tagPickles.at} x={760} y={1255} flash={0} color={C.tinta} semilla={4} />}
      {tagPickles && <Sfx name="slap" at={tagPickles.at} volume={0.7} />}
      <Palabras words={timing.words} offsetFrames={off} claves={esc.claves} y={1385} size={84} />

      <SonidosApertura delay={dOpen} hasta="abierto" />
      <Sfx name="impact" at={tFecha} volume={0.8} />
      <Sfx name="whoosh_long" at={tVuela + 4} volume={0.6} />
      <Sfx name="hit" at={tLand} volume={0.75} />
      {misterio ? <Sfx name="thump" at={tCopa + 1} volume={0.8} /> : <Sfx name="hinchada" at={tCopa + 2} volume={0.55} />}
    </Escenario>
  );
};
