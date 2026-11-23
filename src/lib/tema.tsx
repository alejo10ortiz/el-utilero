import React, { createContext, useContext } from 'react';

/**
 * TEMAS VISUALES (BRAND.md §2.6): la identidad (Utilero, llaves, cinta @usuario, sello sonoro, portazo, grano) no cambia;
 * lo que rota es la SUPERFICIE donde ocurre cada historia: textura de mesa, ficha, subtítulos, polvo, transiciones.
 *
 * Regla de luminosidad: un tema solo cambia la textura DENTRO de su familia clara/oscura. Las escenas eligen el color
 * de su texto según el fondo que piden (papel → tinta, pizarra → tiza), así que `papel` siempre sigue siendo claro,
 * `pizarra` siempre oscuro y `lima` siempre lima.
 */
export type TemaId = 'clasico' | 'cuaderno' | 'kraft' | 'plano' | 'periodico';

/** Texturas de mesa disponibles (cada una resuelve a un componente en FondoTema). */
export type TexturaPapel = 'archivo' | 'cuadriculado' | 'kraft' | 'milimetrado' | 'diario';
export type TexturaOscura = 'pizarra' | 'verde' | 'carton' | 'rejilla' | 'plancha';
export type TexturaLima = 'plana' | 'cuadros' | 'corrugado' | 'cancha' | 'trama';

export type EstiloSubtitulos = 'clasico' | 'marcador' | 'etiqueta' | 'recorte' | 'maquina';
export type EstiloFicha = 'indice' | 'cuaderno' | 'etiqueta' | 'planilla' | 'recorte';
export type FormaPolvo = 'polvo' | 'virutas' | 'fibras' | 'cruces' | 'trama';

export type Tema = {
  id: TemaId;
  nombre: string;
  /** Una línea para el planificador y la documentación. */
  idea: string;
  papel: TexturaPapel;
  oscuro: TexturaOscura;
  lima: TexturaLima;
  subtitulos: EstiloSubtitulos;
  ficha: EstiloFicha;
  polvo: FormaPolvo;
  /** Amplitud (px) del temblor de dibujo a 12 fps sobre toda la escena. 0 = cámara limpia. */
  temblor: number;
  /** Transiciones-objeto que le van (se usan cuando el episodio pone «auto»). */
  transiciones: ('cinta' | 'hoja' | 'flash' | 'puerta' | 'persiana' | 'balon' | 'tinta' | 'arranque' | 'rotativa' | 'borrador')[];
};

export const TEMAS: Record<TemaId, Tema> = {
  clasico: {
    id: 'clasico', nombre: 'Archivo clásico', idea: 'mesa de papel periódico, ficha de índice, cámara limpia (el look de #001–#015)',
    papel: 'archivo', oscuro: 'pizarra', lima: 'plana', subtitulos: 'clasico', ficha: 'indice', polvo: 'polvo', temblor: 0,
    transiciones: ['cinta', 'hoja', 'flash'],
  },
  cuaderno: {
    id: 'cuaderno', nombre: 'Cuaderno de la banca', idea: 'hoja cuadriculada con espiral, ficha arrancada del cuaderno, subrayador y virutas de lápiz',
    papel: 'cuadriculado', oscuro: 'verde', lima: 'cuadros', subtitulos: 'marcador', ficha: 'cuaderno', polvo: 'virutas', temblor: 1.6,
    transiciones: ['arranque', 'tinta', 'hoja', 'flash'],
  },
  kraft: {
    id: 'kraft', nombre: 'Paquete del camerino', idea: 'papel de estraza con dobleces y cinta de embalar, etiqueta con cordel, subtítulos de rotuladora',
    papel: 'kraft', oscuro: 'carton', lima: 'corrugado', subtitulos: 'etiqueta', ficha: 'etiqueta', polvo: 'fibras', temblor: 1.2,
    transiciones: ['persiana', 'cinta', 'puerta', 'flash'],
  },
  plano: {
    id: 'plano', nombre: 'Plano de la jugada', idea: 'papel milimetrado con cancha en marca de agua, rejilla de tablero, planilla técnica y subtítulos a máquina',
    papel: 'milimetrado', oscuro: 'rejilla', lima: 'cancha', subtitulos: 'maquina', ficha: 'planilla', polvo: 'cruces', temblor: 0,
    transiciones: ['balon', 'borrador', 'flash', 'persiana'],
  },
  periodico: {
    id: 'periodico', nombre: 'Rotativa', idea: 'papel prensa con trama y columnas, recortes y subtítulos de letras recortadas',
    papel: 'diario', oscuro: 'plancha', lima: 'trama', subtitulos: 'recorte', ficha: 'recorte', polvo: 'trama', temblor: 1.0,
    transiciones: ['rotativa', 'hoja', 'tinta', 'cinta'],
  },
};

export const TEMA_IDS = Object.keys(TEMAS) as TemaId[];

const TemaCtx = createContext<Tema>(TEMAS.clasico);

/** Envuelve una escena para que todos sus componentes (Fondo, Palabras, Ficha, Particulas…) lean el mismo tema. */
export const TemaProvider: React.FC<{ id?: TemaId; children: React.ReactNode }> = ({ id = 'clasico', children }) => (
  <TemaCtx.Provider value={TEMAS[id] ?? TEMAS.clasico}>{children}</TemaCtx.Provider>
);

export const useTema = () => useContext(TemaCtx);
