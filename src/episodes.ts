import { parseEpisode, Episode } from './lib/episode';
import ep001 from '../episodes/001-pickles/episode.json';
import ep002 from '../episodes/002-copa-robada/episode.json';
import ep003 from '../episodes/003-149-a-0/episode.json';
import ep004 from '../episodes/004-mano-de-dios/episode.json';
import ep005 from '../episodes/005-principe-kuwait/episode.json';
import ep006 from '../episodes/006-india-descalzos/episode.json';
import ep007 from '../episodes/007-camiseta-blanca/episode.json';
import ep008 from '../episodes/008-servilleta-messi/episode.json';
import ep009 from '../episodes/009-chapecoense-nacional/episode.json';
import ep010 from '../episodes/010-secuestro-di-stefano/episode.json';
import ep011 from '../episodes/011-escorpion-higuita/episode.json';
import ep012 from '../episodes/012-libertadores-madrid/episode.json';
import epP99 from '../episodes/P99-pruebas-escenas/episode.json';
import ep013 from '../episodes/013-el-dorado/episode.json';
import ep014 from '../episodes/014-chivas-athletic/episode.json';
import ep015 from '../episodes/015-arbroath-36-0/episode.json';
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
  '004-mano-de-dios': parseEpisode(ep004),
  '005-principe-kuwait': parseEpisode(ep005),
  '006-india-descalzos': parseEpisode(ep006),
  '007-camiseta-blanca': parseEpisode(ep007),
  '008-servilleta-messi': parseEpisode(ep008),
  '009-chapecoense-nacional': parseEpisode(ep009),
  '010-secuestro-di-stefano': parseEpisode(ep010),
  '011-escorpion-higuita': parseEpisode(ep011),
  '012-libertadores-madrid': parseEpisode(ep012),
  '013-el-dorado': parseEpisode(ep013),
  '014-chivas-athletic': parseEpisode(ep014),
  '015-arbroath-36-0': parseEpisode(ep015),
  'P01-quien-es': parseEpisode(epP01),
  'P99-pruebas-escenas': parseEpisode(epP99),
  'P02-que-hay': parseEpisode(epP02),
  'P03-como-funciona': parseEpisode(epP03),
};

export const SLUG_POR_DEFECTO = '001-pickles';
