import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FONT } from '../../config/brand';
import { ConFuentes } from '../components/ConFuentes';
import { Defs } from '../components/Defs';
import { Fondo } from '../components/Fondo';
import { Grano } from '../components/Grano';
import { Avatar, Escudo, Logotipo } from '../components/Logo';
import { PalabraGigante } from '../components/PalabraGigante';
import { Cinta } from '../components/Cinta';
import { Utilero } from '../components/Utilero';
import { Objeto } from '../components/Objeto';
import { EPISODIOS } from '../episodes';
import { TemaProvider } from '../lib/tema';

export type StillProps = { slug: string };

/** Miniatura 1280×720: una palabra gigante + el utilero guiñando + número de camerino. */
export const Miniatura: React.FC<StillProps> = ({ slug }) => {
  const ep = EPISODIOS[slug];
  const gancho = ep.escenas.find((e) => e.tipo === 'gancho');
  const palabra = (gancho?.resaltar ?? ep.titulo).toUpperCase().replace(/[.,;:!?]+$/, '');
  const pres = ep.formato === 'presentacion';
  return (
    <ConFuentes>
      <AbsoluteFill>
        <Defs />
        <Fondo tipo="papel" width={1280} height={720} />
        <PalabraGigante texto={palabra} x={40} y={50} ancho={720} maxSize={470} delay={-99} sonido={false} />
        <Utilero expresion="E2" size={640} x={660} y={150} vivo={false} />
        <Cinta texto={pres ? 'EL UTILERO' : `CAMERINO #${ep.id}`} x={330} y={610} rot={-4} size={58} delay={-99} sonido={false} />
        <Grano width={1280} height={720} />
      </AbsoluteFill>
    </ConFuentes>
  );
};

/** Post 1080×1350: objeto del día + número de camerino. */
export const Post: React.FC<StillProps> = ({ slug }) => {
  const ep = EPISODIOS[slug];
  if (ep.formato === 'presentacion') {
    return (
      <ConFuentes>
        <AbsoluteFill>
          <Defs />
          <Fondo tipo="papel" width={1080} height={1350} />
          <Logotipo size={250} x={170} y={90} />
          <Utilero expresion="E2" size={760} x={160} y={400} vivo={false} />
          <Cinta texto={ep.titulo} x={540} y={1230} rot={-3} size={50} delay={-99} sonido={false} />
          <Grano width={1080} height={1350} />
        </AbsoluteFill>
      </ConFuentes>
    );
  }
  return (
    <ConFuentes>
      <AbsoluteFill>
        <Defs />
        <Fondo tipo="papel" width={1080} height={1350} />
        <PalabraGigante texto={`#${ep.id}`} x={90} y={90} ancho={900} maxSize={400} delay={-99} sonido={false} />
        <Objeto tipo={ep.objetoTipo} etiqueta={ep.etiqueta} size={760} x={160} y={420} rot={-3} />
        <Cinta texto={ep.titulo} x={540} y={1230} rot={-3} size={56} delay={-99} sonido={false} />
        <Grano width={1080} height={1350} />
      </AbsoluteFill>
    </ConFuentes>
  );
};

/** Avatar 800×800 (circular). */
export const AvatarStill: React.FC = () => (
  <ConFuentes>
    <AbsoluteFill style={{ background: 'transparent' }}>
      <Defs />
      <Avatar size={800} />
      <Grano width={800} height={800} opacity={0.25} />
    </AbsoluteFill>
  </ConFuentes>
);

/** Miniatura 1280×720 de un video LARGO: la pregunta en dos palabras, el Utilero serio y el lugar/año. Estática (sin animaciones). */
export const MiniaturaLargo: React.FC<StillProps & { linea1?: string; linea2?: string; cinta?: string }> = ({ linea1 = 'CUELLO', linea2 = 'ROTO', cinta = 'WEMBLEY · 1956' }) => (
  <ConFuentes>
    <AbsoluteFill>
      <Defs />
      <TemaProvider id="plano">
        <Fondo tipo="papel" width={1280} height={720} />
      </TemaProvider>
      {[linea1, linea2].map((t, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: 50, top: 28 + i * 282, fontFamily: FONT.grito, fontSize: 300, lineHeight: 0.92, color: C.tinta,
            textShadow: i === 0 ? `12px 10px 0 ${C.lima}` : 'none', transform: `rotate(${i === 0 ? -2 : 1.5}deg)`, filter: 'url(#ink)',
          }}
        >
          {i === 1 ? <span style={{ background: C.lima, padding: '0 22px' }}>{t}</span> : t}
        </div>
      ))}
      <Utilero expresion="E7" size={600} x={690} y={140} vivo={false} sobre="papel" />
      <Cinta texto={cinta} x={400} y={655} rot={-3} size={60} delay={-99} sonido={false} />
      <Grano width={1280} height={720} />
    </AbsoluteFill>
  </ConFuentes>
);
