import fs from 'node:fs';
import path from 'node:path';
import { parseEpisode, Episode } from '../src/lib/episode';

export const ROOT = path.resolve(__dirname, '..');

/** Carga .env sin dependencias (KEY=VALUE por línea). */
export function loadEnv() {
  const f = path.join(ROOT, '.env');
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

/** Resuelve "001", "pickles" o "001-pickles" a la carpeta del episodio. */
export function resolveSlug(arg: string | undefined): string {
  const dirs = fs.readdirSync(path.join(ROOT, 'episodes')).filter((d) => /^(\d{3}|P\d{2}|L\d{2})-/.test(d));
  if (!arg) {
    if (dirs.length === 1) return dirs[0];
    throw new Error(`Indica el episodio. Disponibles: ${dirs.join(', ')}`);
  }
  const hit = dirs.find((d) => d === arg || d.startsWith(arg + '-') || d.endsWith('-' + arg));
  if (!hit) throw new Error(`Episodio "${arg}" no encontrado. Disponibles: ${dirs.join(', ')}`);
  return hit;
}

export function loadEpisode(slug: string): Episode {
  const f = path.join(ROOT, 'episodes', slug, 'episode.json');
  return parseEpisode(JSON.parse(fs.readFileSync(f, 'utf8')));
}

export const episodeMediaDir = (slug: string) => path.join(ROOT, 'assets', 'episodes', slug);

export function flag(name: string): string | boolean | undefined {
  const a = process.argv.find((x) => x === `--${name}` || x.startsWith(`--${name}=`));
  if (!a) return undefined;
  return a.includes('=') ? a.split('=').slice(1).join('=') : true;
}
export const positional = () => process.argv.slice(2).filter((a) => !a.startsWith('--'));
