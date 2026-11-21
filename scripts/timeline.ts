/**
 * Muestra la línea de tiempo de un episodio (voz real si existe words.json; si no, estimada).
 *   npm run timeline -- 001
 */
import fs from 'node:fs';
import path from 'node:path';
import { FPS } from '../config/brand';
import { estimateTimeline, Timeline } from '../src/lib/timeline';
import { episodeMediaDir, loadEpisode, positional, resolveSlug } from './lib';

const slug = resolveSlug(positional()[0]);
const wj = path.join(episodeMediaDir(slug), 'words.json');
const tl: Timeline = fs.existsSync(wj) ? JSON.parse(fs.readFileSync(wj, 'utf8')) : estimateTimeline(loadEpisode(slug));
console.log(`${slug} — línea de tiempo ${tl.source.toUpperCase()}`);
for (const s of tl.scenes) {
  console.log(`  ${String(s.index).padStart(2)} ${s.tipo.padEnd(9)} ${s.start.toFixed(2).padStart(6)}s → ${s.end.toFixed(2).padStart(6)}s   frames ${Math.round(s.start * FPS)}–${Math.round(s.end * FPS)}`);
}
console.log(`  total ${tl.totalSeconds.toFixed(1)} s (${Math.round(tl.totalSeconds * FPS)} frames)${tl.totalSeconds > 45 ? '  ⚠ pasa de 45 s' : ''}`);
