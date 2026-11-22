import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { A, C, FONT, FPS } from '../../config/brand';
import { Camerino, apertura, SonidosApertura } from '../components/Camerino';
import { Cinta } from '../components/Cinta';
import { ConFuentes } from '../components/ConFuentes';
import { Defs } from '../components/Defs';
import { Ficha } from '../components/Ficha';
import { Fondo } from '../components/Fondo';
import { Grano } from '../components/Grano';
import { Objeto } from '../components/Objeto';
import { Escudo, LlaveBalon, Logotipo, Avatar } from '../components/Logo';
import { NivelSecreto } from '../components/NivelSecreto';
import { PalabraGigante } from '../components/PalabraGigante';
import { Sello } from '../components/Sello';
import { Subtitulos } from '../components/Subtitulos';
import { MarcadorTrazo, TizaTrazo, ellipsePoints, linePoints, arrowPoints } from '../components/Trazo';
import { Utilero } from '../components/Utilero';
import { CamaraMesa } from '../components/CamaraMesa';
import { EXPRESIONES, VISEMAS } from '../lib/episode';
import { estimateWords } from '../lib/timeline';

const NOMBRES = {
  E1: 'neutro', E2: 'guiño', E3: 'susurro', E4: 'sorpresa', E5: 'escéptico', E6: 'risa', E7: 'nostalgia', E8: 'indignado',
} as const;

const Base: React.FC<{ children: React.ReactNode; fondo?: 'papel' | 'pizarra' | 'lima' | 'tinta'; w?: number; h?: number; grano?: boolean }> = ({
  children, fondo = 'papel', w = 1080, h = 1920, grano = true,
}) => (
  <ConFuentes>
    <AbsoluteFill style={{ background: C.tinta, width: w, height: h }}>
      <Defs />
      <Fondo tipo={fondo} width={w} height={h} />
      {children}
      {grano && <Grano width={w} height={h} />}
    </AbsoluteFill>
  </ConFuentes>
);

/** FASE 1 — escena de prueba con todos los componentes animados (A01–A07, A11) y sonido. 8 s. */
export const PruebaComponentes: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Base>
      <CamaraMesa impactos={[{ frame: 64, amp: 3 }]}>
        <PalabraGigante texto="COMPONENTES" x={90} y={120} ancho={900} maxSize={420} delay={4} resaltar="COMPONENTES" />
        <Ficha lineas={['LONDRES · 20.03.1966']} x={110} y={560} ancho={820} size={54} altoMin={360} delay={18} marcar="1966" />
        <Sello texto="ROBADA" x={760} y={800} size={130} delay={64} />
        <Cinta texto="¡apareció!" x={380} y={1010} rot={-5} size={72} delay={84} />
        <TizaTrazo points={arrowPoints(150, 1180, 460, 1120)} delay={100} />
        <MarcadorTrazo points={ellipsePoints(690, 1130, 190, 70)} delay={112} />
        <NivelSecreto nivel={5} x={540} y={1300} size={130} delay={130} />
      </CamaraMesa>
    </Base>
  );
};

/** FASE 2 — hoja de estados del camerino (apertura A08 completa). 4 s. */
export const PruebaCamerino: React.FC = () => {
  const frame = useCurrentFrame();
  const ap = apertura(frame, 20, 'abierto');
  return (
    <Base fondo="tinta">
      <Camerino x={220} y={150} numero="001" tema="Inglaterra 66" rotulo="LOCAL" angulo={ap.angulo} luz={ap.luz} cintaDelay={-999}>
        <div style={{ position: 'absolute', left: 135, top: 600 }}><Objeto tipo="bulto" size={330} /></div>
      </Camerino>
      <SonidosApertura delay={20} />
    </Base>
  );
};

/** FASE 3 — el utilero dice la línea de prueba, sincronizado (visemas + parpadeo + guiño). */
export const LINEA_PRUEBA = 'Cierren la puerta, que les cuento… Esto no salió en la tele.';
export const PruebaUtilero: React.FC = () => {
  const frame = useCurrentFrame();
  const { words } = React.useMemo(() => estimateWords(LINEA_PRUEBA, 0.3), []);
  const t = frame / FPS;
  const fin = words[words.length - 1].end;
  const expr = t < 1.6 ? 'E3' : t < fin - 0.2 ? 'E2' : 'E1';
  return (
    <Base>
      <Utilero expresion={expr} pose={t < 1.6 ? 'P3' : 'P1'} words={words} size={900} x={90} y={420} />
      <Subtitulos words={words} offsetFrames={0} y={1330} />
    </Base>
  );
};

/** Hoja de modelo: 8 expresiones + 8 visemas — referencia para el ilustrador (§4.8). */
export const HojaExpresiones: React.FC = () => (
  <Base w={1600} h={1500} grano>
    <div style={{ position: 'absolute', left: 60, top: 36, fontFamily: FONT.grito, fontSize: 96, color: C.tinta, textShadow: `7px 5px 0 ${C.lima}` }}>
      EL UTILERO — HOJA DE MODELO
    </div>
    {EXPRESIONES.map((e, i) => (
      <div key={e}>
        <Utilero expresion={e} size={340} x={60 + (i % 4) * 380} y={150 + Math.floor(i / 4) * 420} vivo={false} />
        <div style={{ position: 'absolute', left: 60 + (i % 4) * 380 + 120, top: 150 + Math.floor(i / 4) * 420 + 352, fontFamily: FONT.maquina, fontSize: 28, color: C.grisArchivo }}>{e} · {NOMBRES[e]}</div>
      </div>
    ))}
    {VISEMAS.map((m, i) => (
      <div key={m}>
        <Utilero expresion="E1" visema={m} size={300} x={26 + i * 190} y={990} vivo={false} recorte="cabeza" />
        <div style={{ position: 'absolute', left: 100 + i * 190, top: 1240, fontFamily: FONT.maquina, fontSize: 28, color: C.grisArchivo }}>{m}</div>
      </div>
    ))}
  </Base>
);

/** Sistema de logo (§6.1): logotipo, escudo, avatar, marca mínima — prueba de legibilidad a 48/100/200 px. */
export const HojaLogo: React.FC = () => (
  <Base w={1600} h={1200} grano>
    <Logotipo size={360} x={80} y={90} />
    <div style={{ position: 'absolute', left: 840, top: 80 }}><Escudo size={380} /></div>
    <LlaveBalon size={330} x={1250} y={90} />
    <Avatar x={80} y={620} size={400} />
    <Avatar x={540} y={760} size={200} />
    <Avatar x={790} y={850} size={100} />
    <Avatar x={940} y={890} size={48} />
    <div style={{ position: 'absolute', left: 1100, top: 620, width: 420, height: 200, background: C.pizarra }}>
      <Logotipo size={110} variante="invertida" x={40} y={36} />
    </div>
    <div style={{ position: 'absolute', left: 1100, top: 840, width: 420, height: 200, background: C.lima }}>
      <Logotipo size={110} variante="sobreLima" x={40} y={36} />
    </div>
    <div style={{ position: 'absolute', left: 1100, top: 1060 }}>
      <Logotipo size={80} variante="mono" />
    </div>
  </Base>
);
