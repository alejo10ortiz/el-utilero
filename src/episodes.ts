import { parseEpisode, Episode } from './lib/episode';
import ep001 from '../episodes/001-pickles/episode.json';
import ep002 from '../episodes/002-copa-robada/episode.json';
import ep003 from '../episodes/003-149-a-0/episode.json';
import epP01 from '../episodes/P01-quien-es/episode.json';
import epP02 from '../episodes/P02-que-hay/episode.json';
import epP03 from '../episodes/P03-como-funciona/episode.json';

/**
 * Registro de episodios. La clave es el nombre de la carpeta en episodes/.
 * Para sumar un episodio: crear episodes/NNN-slug/episode.json e importarlo aquí.
 * Las presentaciones de la cuenta usan ids P01, P02… (formato: "presentacion").
 */
export const EPISODIOS: Record<string, Episode> = {
  '001-pickles': parseEpisode(ep001),
  '002-copa-robada': parseEpisode(ep002),
  '003-149-a-0': parseEpisode(ep003),
  'P01-quien-es': parseEpisode(epP01),
  'P02-que-hay': parseEpisode(epP02),
  'P03-como-funciona': parseEpisode(epP03),
};

export const SLUG_POR_DEFECTO = '001-pickles';
