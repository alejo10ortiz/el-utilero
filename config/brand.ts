/**
 * EL UTILERO — constantes de marca (BRAND.md §2, §5).
 * Todo valor visual sale de aquí. Nada de hex sueltos en componentes.
 */

/** @usuario oficial en las 4 redes (confirmado). Los episodios lo llevan en textoFinal. */
export const HANDLE = '@elutilerofutbol';

export const FPS = 30;

export const FORMATS = {
  short: { width: 1080, height: 1920 },
  miniatura: { width: 1280, height: 720 },
  post: { width: 1080, height: 1350 },
} as const;

export const C = {
  lima: '#C8FF2E',
  tinta: '#16130F',
  papel: '#ECE5D3',
  ficha: '#F8F4EA',
  cinta: '#E9DFC4',
  kraft: '#B98B52',
  kraftOscuro: '#A87B45',
  pizarra: '#1D211E',
  tiza: '#EDEBE4',
  sello: '#E0412B',
  grisArchivo: '#5A5247',
  metal: '#3B5A4D',
  metalSombra: '#22362E',
  metalLuz: '#4E7464',
  metalBase: '#2F4A3F',
  lineaFicha: '#C9D6E2',
} as const;

export const FONT = {
  grito: "'League Gothic', 'Impact', sans-serif",
  susurro: "'Instrument Serif', 'Georgia', serif",
  maquina: "'Special Elite', 'Courier New', monospace",
  marcador: "'Permanent Marker', cursive",
  subtitulo: "'Archivo', 'Helvetica Neue', sans-serif",
} as const;

/** Zonas seguras (px) para 1080×1920 — §7.1. Verificar en cada plataforma. */
export const SAFE = { top: 150, bottom: 420, right: 140, left: 60 } as const;

export const SAFE_BOX = {
  x0: SAFE.left,
  x1: 1080 - SAFE.right, // 940
  y0: SAFE.top,
  y1: 1920 - SAFE.bottom, // 1500
  get w() {
    return this.x1 - this.x0;
  },
  get cx() {
    return (this.x0 + this.x1) / 2;
  },
} as const;

/** Duración (frames @30fps) de las micro-animaciones — §5.2. */
export const A = {
  cinta: 6,
  sello: 8,
  maquinaFramesPorLetra: 1.5,
  tiza: 16,
  palabra: 5,
  ficha: 10,
  marcador: 10,
  apertura: 24,
  portazo: 8,
  guino: 6,
  llaveFrames: 4,
} as const;

export const sec = (s: number) => Math.round(s * FPS);

export const MUSICA_DB = -18;
export const dbToGain = (db: number) => Math.pow(10, db / 20);
