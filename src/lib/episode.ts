import { z } from 'zod';

export const EXPRESIONES = ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'] as const;
export const POSES = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'] as const;
export const VISEMAS = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7'] as const;
export type Expresion = (typeof EXPRESIONES)[number];
export type Pose = (typeof POSES)[number];
export type Visema = (typeof VISEMAS)[number];

export const ESTADOS_PUERTA = ['cerrado', 'llave', 'entreabierto', 'abierto', 'objeto-fuera', 'cerrando'] as const;
export type EstadoPuerta = (typeof ESTADOS_PUERTA)[number];

export const OBJETOS = [
  'bulto', 'botin', 'balones', 'llave-rota', 'radio', 'silbato', 'boleta', 'camiseta', 'brujula', 'llavero',
  'calendario', 'vitrina', 'balon',
] as const;
export type ObjetoTipo = (typeof OBJETOS)[number];

export const EscenaSchema = z.object({
  tipo: z.enum(['gancho', 'sting', 'apertura', 'contexto', 'giro', 'remate', 'cierre', 'camerinos', 'serie', 'secreto']),
  fondo: z.enum(['pizarra', 'papel', 'camerino', 'lima']).optional(),
  texto: z.string().optional(),
  resaltar: z.string().optional(),
  expresion: z.enum(EXPRESIONES).optional(),
  pose: z.enum(POSES).optional(),
  ficha: z.string().optional(),
  sello: z.string().optional(),
  marcador: z.string().optional(),
  cinta: z.string().optional(),
  camerino: z.enum(ESTADOS_PUERTA).optional(),
  palabraGigante: z.string().optional(),
  /** Palabras que se resaltan en lima en los subtítulos. */
  claves: z.array(z.string()).optional(),
  voz: z.string().optional(),

  /** gancho pro: palabra/cifra gigante que se clava cuando se dice (p. ej. "1930"). */
  kicker: z.string().optional(),

  // ── solo presentaciones ──
  /** apertura: muestra el logotipo en lugar de la palabra gigante. */
  logo: z.boolean().optional(),
  /** serie: nombre de la serie (palabra gigante) y su número en el archivo ("1" … "4"). */
  titulo: z.string().optional(),
  numero: z.string().optional(),
  /** serie / cierre: frase en Instrument Serif. */
  cita: z.string().optional(),
  sellos: z.array(z.string()).optional(),
  objetoTipo: z.enum(OBJETOS).optional(),
  /** camerinos: objetos que salen y cintas de cada camerino. */
  objetos: z.array(z.enum(OBJETOS)).optional(),
  cintas: z.array(z.string()).optional(),
  /** camerinos: rótulo de cada puerta del túnel (LOCAL · VISITANTE · ÁRBITROS). */
  rotulos: z.array(z.string()).optional(),
  /** giro: palabra de la voz que lanza el objeto (por defecto «paquete») y palabra que dispara el estallido («copa»). */
  gatillo: z.string().optional(),
  clave: z.string().optional(),
  /** giro: «misterio» cambia el estallido de hinchada por un golpe seco (robos, desapariciones). */
  tono: z.enum(['festivo', 'misterio']).optional(),
  /** secreto: cuántas llaves se muestran (1–5). */
  nivel: z.number().int().min(1).max(5).optional(),
});
export type Escena = z.infer<typeof EscenaSchema>;

export const EpisodeSchema = z
  .object({
    /** "episodio" = historia con datos (necesita fuentes). "presentacion" = video de la cuenta (sin datos nuevos). */
    formato: z.enum(['episodio', 'presentacion']).default('episodio'),
    id: z.string().regex(/^(\d{3}|P\d{2})$/, 'id de 3 dígitos ("001") o de presentación ("P01")'),
    slug: z.string(),
    serie: z.enum(['El Camerino', 'La llave de', '¿Mito o verdad?', 'Hoy hace X años', 'Presentación']),
    titulo: z.string(),
    pais: z.string().optional(),
    anio: z.number().int().optional(),
    objeto: z.string().optional(),
    /** Qué dibujo del catálogo (§3.3) representa al objeto. */
    objetoTipo: z.enum(OBJETOS).default('bulto'),
    /** Número en la placa del camerino si no es el id ("000" para las presentaciones). */
    camerinoNumero: z.string().optional(),
    /** Rótulo de la puerta del camerino (LOCAL · VISITANTE · ÁRBITROS). */
    rotulo: z.enum(['LOCAL', 'VISITANTE', 'ÁRBITROS']).default('LOCAL'),
    /** Texto de la cinta sobre la placa del camerino (§3.1). */
    cintaCamerino: z.string().optional(),
    /** Etiqueta colgante del objeto (§3.3). */
    etiqueta: z.string().optional(),
    nivelSecreto: z.number().int().min(1).max(5).optional(),
    /** 'pro' = montaje dinámico al ritmo (escenas en src/scenes/pro); 'clasico' = el primer estilo. */
    estilo: z.enum(['clasico', 'pro']).default('clasico'),
    /** Pista de assets/music/ (100 BPM). Sin ella, el video va sin música. */
    musica: z.string().optional(),
    /** Transición entre la escena i y la i+1 (objeto que tapa el cuadro). 'ninguna' = corte seco. */
    transiciones: z.array(z.enum(['cinta', 'hoja', 'flash', 'puerta', 'ninguna'])).optional(),
    escenas: z.array(EscenaSchema).min(3),
    textoFinal: z.string(),
    /** Regla de oro (§10): mínimo dos fuentes por dato, de dominios distintos. */
    fuentes: z.array(z.string().url()).default([]),
    /** pendiente | verificado — el verificador no deja renderizar un episodio "pendiente". */
    estado: z.enum(['pendiente', 'verificado']).default('pendiente'),
  })
  .superRefine((ep, ctx) => {
    if (ep.formato !== 'episodio') return;
    if (ep.fuentes.length < 2)
      ctx.addIssue({ code: 'custom', path: ['fuentes'], message: 'Regla de oro: mínimo 2 fuentes verificables' });
    for (const k of ['pais', 'anio', 'objeto', 'nivelSecreto'] as const)
      if (ep[k] === undefined) ctx.addIssue({ code: 'custom', path: [k], message: `un episodio necesita "${k}"` });
  });
export type Episode = z.infer<typeof EpisodeSchema>;

export const parseEpisode = (raw: unknown): Episode => EpisodeSchema.parse(raw);

/** Número que se pinta en la placa del camerino. */
export const numeroCamerino = (ep: Episode) => ep.camerinoNumero ?? ep.id;
/** @usuario de la marca: sale de textoFinal ("@elutilerofutbol · …"), una sola fuente de verdad. */
export const handleDe = (ep: Episode) => ep.textoFinal.split(' · ')[0];
