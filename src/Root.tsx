import React from 'react';
import { Composition, Still } from 'remotion';
import { FORMATS, FPS } from '../config/brand';
import { Short, calcularShort, ShortProps } from './compositions/Short';
import {
  HojaExpresiones, HojaLogo, PruebaCasillero, PruebaComponentes, PruebaUtilero, LINEA_PRUEBA,
} from './compositions/Pruebas';
import { Miniatura, Post, AvatarStill, StillProps } from './compositions/Stills';
import { SLUG_POR_DEFECTO } from './episodes';
import { estimateWords } from './lib/timeline';

const { short, miniatura, post } = FORMATS;
const lineaPrueba = estimateWords(LINEA_PRUEBA, 0.3);

export const Root: React.FC = () => (
  <>
    {/* ── Producción ── */}
    <Composition
      id="Short"
      component={Short}
      width={short.width}
      height={short.height}
      fps={FPS}
      durationInFrames={FPS * 45}
      defaultProps={{ slug: SLUG_POR_DEFECTO } satisfies ShortProps}
      calculateMetadata={calcularShort}
    />
    <Still id="Miniatura" component={Miniatura} width={miniatura.width} height={miniatura.height} defaultProps={{ slug: SLUG_POR_DEFECTO } satisfies StillProps} />
    <Still id="Post" component={Post} width={post.width} height={post.height} defaultProps={{ slug: SLUG_POR_DEFECTO } satisfies StillProps} />
    <Still id="Avatar" component={AvatarStill} width={800} height={800} />

    {/* ── Fases de trabajo (BRAND.md §11) ── */}
    <Composition id="F1-Componentes" component={PruebaComponentes} width={short.width} height={short.height} fps={FPS} durationInFrames={FPS * 8} />
    <Composition id="F2-Casillero" component={PruebaCasillero} width={short.width} height={short.height} fps={FPS} durationInFrames={FPS * 4} />
    <Composition id="F3-UtileroHabla" component={PruebaUtilero} width={short.width} height={short.height} fps={FPS} durationInFrames={Math.ceil((lineaPrueba.end + 1) * FPS)} />

    {/* ── Referencias para el ilustrador ── */}
    <Still id="Hoja-Expresiones" component={HojaExpresiones} width={1600} height={1500} />
    <Still id="Hoja-Logo" component={HojaLogo} width={1600} height={1200} />
  </>
);
