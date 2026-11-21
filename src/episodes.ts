import { parseEpisode, Episode } from './lib/episode';
import ep001 from '../episodes/001-pickles/episode.json';

/**
 * Registro de episodios. La clave es el nombre de la carpeta en episodes/.
 * Para sumar un episodio: crear episodes/NNN-slug/episode.json e importarlo aquí.
 */
export const EPISODIOS: Record<string, Episode> = {
  '001-pickles': parseEpisode(ep001),
};

export const SLUG_POR_DEFECTO = '001-pickles';
