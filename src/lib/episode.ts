import { z } from 'zod';

export const EXPRESIONES = ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'] as const;
export const POSES = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'] as const;
export const VISEMAS = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7'] as const;
export type Expresion = (typeof EXPRESIONES)[number];
export type Pose = (typeof POSES)[number];
export type Visema = (typeof VISEMAS)[number];

export const ESTADOS_CASILLERO = ['cerrado', 'llave', 'entreabierto', 'abierto', 'objeto-fuera', 'cerrando'] as const;
export type EstadoCasillero = (typeof ESTADOS_CASILLERO)[number];

export const OBJETOS = [
  'bulto', 'botin', 'balones', 'llave-rota', 'radio', 'silbato', 'boleta', 'camiseta', 'brujula', 'llavero',
] as const;
export type ObjetoTipo = (typeof OBJETOS)[number];

export const EscenaSchema = z.object({
  tipo: z.enum(['gancho', 'sting', 'apertura', 'contexto', 'giro', 'remate', 'cierre']),
  fondo: z.enum(['pizarra', 'papel', 'casillero', 'lima']).optional(),
  texto: z.string().optional(),
  resaltar: z.string().optional(),
  expresion: z.enum(EXPRESIONES).optional(),
  pose: z.enum(POSES).optional(),
  ficha: z.string().optional(),
  sello: z.string().optional(),
  marcador: z.string().optional(),
  cinta: z.string().optional(),
  casillero: z.enum(ESTADOS_CASILLERO).optional(),
  palabraGigante: z.string().optional(),
  /** Palabras que se resaltan en lima en los subtítulos. */
  claves: z.array(z.string()).optional(),
  voz: z.string().optional(),
});
export type Escena = z.infer<typeof EscenaSchema>;

export const EpisodeSchema = z.object({
  id: z.string().regex(/^\d{3}$/, 'id de 3 dígitos, ej. "001"'),
  slug: z.string(),
  serie: z.enum(['El Casillero', 'La llave de', '¿Mito o verdad?', 'Hoy hace X años']),
  titulo: z.string(),
  pais: z.string(),
  anio: z.number().int(),
  objeto: z.string(),
  /** Qué dibujo del catálogo (§3.3) representa al objeto. */
  objetoTipo: z.enum(OBJETOS).default('bulto'),
  /** Texto de la cinta sobre la placa del casillero (§3.1). */
  cintaCasillero: z.string().optional(),
  /** Etiqueta colgante del objeto (§3.3). */
  etiqueta: z.string().optional(),
  nivelSecreto: z.number().int().min(1).max(5),
  escenas: z.array(EscenaSchema).min(3),
  textoFinal: z.string(),
  /** Regla de oro (§10): mínimo dos fuentes por dato, de dominios distintos. */
  fuentes: z.array(z.string().url()).min(2, 'Regla de oro: mínimo 2 fuentes verificables'),
  /** pendiente | verificado — el verificador no deja renderizar "pendiente". */
  estado: z.enum(['pendiente', 'verificado']).default('pendiente'),
});
export type Episode = z.infer<typeof EpisodeSchema>;

export const parseEpisode = (raw: unknown): Episode => EpisodeSchema.parse(raw);
