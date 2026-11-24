/**
 * Render de un video LARGO (16:9) por TRAMOS, reanudable.
 *   npm run render-largo -- L01              máster (CRF 18) en tramos de ~50 s → out/<slug>/largo.mp4 + miniatura.png
 *   npm run render-largo -- L01 --draft      media resolución, CRF 28 (revisión rápida)
 *   npm run render-largo -- L01 --solo=3     renderiza solo el tramo 3 (pruebas)
 *   npm run render-largo -- L01 --stills     solo la miniatura
 * Cada tramo se guarda aparte (out/<slug>/partes/parte-NN.mp4): si el contenedor se reinicia, al relanzar se saltan los que ya están.
 * El audio (voz + música) se renderiza completo una sola vez y se mezcla al final con -14 LUFS (normalize-audio.sh).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { FPS } from '../config/brand';
import type { Timeline } from '../src/lib/timeline';
import { ROOT, episodeMediaDir, flag, positional, resolveSlug } from './lib';
import { verificar } from './verify-episode';

const OBJETIVO_TRAMO = Number(process.env.TRAMO_FRAMES ?? 1500);
const dur = (f: string) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim());

async function main() {
  const slug = resolveSlug(positional()[0]);
  const draft = !!flag('draft');
  const solo = flag('solo') ? Number(flag('solo')) : 0;
  const outDir = path.join(ROOT, 'out', slug);
  const partesDir = path.join(outDir, draft ? 'partes-draft' : 'partes');
  fs.mkdirSync(partesDir, { recursive: true });

  if (!flag('skip-verify')) {
    const res = await verificar(slug);
    for (const h of res.filter((x) => x.nivel !== 'OK')) console.log(` ${h.nivel === 'ERROR' ? '✗' : '!'} ${h.msg}`);
    if (res.some((h) => h.nivel === 'ERROR')) {
      console.error('\n✗ El episodio no pasa la verificación editorial.');
      process.exit(1);
    }
  }
  const wj = path.join(episodeMediaDir(slug), 'words.json');
  if (!fs.existsSync(wj)) throw new Error('Falta words.json: genera la voz primero (npm run voice -- ' + slug.slice(0, 3) + ')');
  const tl = JSON.parse(fs.readFileSync(wj, 'utf8')) as Timeline;
  const total = Math.round(tl.totalSeconds * FPS);

  // tramos: se agrupan escenas completas hasta ~OBJETIVO_TRAMO fotogramas
  const tramos: [number, number][] = [];
  let ini = 0;
  for (const sc of tl.scenes) {
    const fin = Math.round(sc.end * FPS);
    if (fin - ini >= OBJETIVO_TRAMO) {
      tramos.push([ini, fin]);
      ini = fin;
    }
  }
  if (ini < total) tramos.push([ini, total]);
  console.log(`${slug}: ${total} fotogramas (${(total / FPS).toFixed(1)} s) en ${tramos.length} tramos`);

  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
  const chromeMode = browserExecutable ? ('chrome-for-testing' as const) : undefined;
  console.log('Empaquetando…');
  const serveUrl = await bundle({ entryPoint: path.join(ROOT, 'src/index.ts'), publicDir: path.join(ROOT, 'assets') });
  const inputProps = { slug };

  if (!flag('stills')) {
    const composition = await selectComposition({ serveUrl, id: 'Largo', inputProps, browserExecutable, chromeMode });
    for (let i = 0; i < tramos.length; i++) {
      if (solo && i + 1 !== solo) continue;
      const [a, b] = tramos[i];
      const f = path.join(partesDir, `parte-${String(i + 1).padStart(2, '0')}.mp4`);
      const esperado = (b - a) / FPS;
      if (fs.existsSync(f) && Math.abs(dur(f) - esperado) < 0.2) {
        console.log(` · tramo ${i + 1}/${tramos.length}: ya está`);
        continue;
      }
      console.log(` ▶ tramo ${i + 1}/${tramos.length}: fotogramas ${a}–${b - 1}`);
      const tmp = f + '.tmp.mp4';
      let last = -1;
      await renderMedia({
        serveUrl, composition, inputProps, codec: 'h264', crf: draft ? 28 : 18, scale: draft ? 0.5 : 1, muted: true, frameRange: [a, b - 1], outputLocation: tmp, browserExecutable, chromeMode,
        concurrency: Number(process.env.CONCURRENCY ?? 4),
        onProgress: ({ progress }) => {
          const p = Math.floor(progress * 10);
          if (p !== last) {
            last = p;
            process.stdout.write(`\r   ${'█'.repeat(p)}${'░'.repeat(10 - p)} ${Math.round(progress * 100)}%`);
          }
        },
      });
      process.stdout.write('\n');
      fs.renameSync(tmp, f);
    }
    if (solo) return;

    // audio completo (voz + música) una sola vez
    const audio = path.join(outDir, draft ? 'audio-draft.aac' : 'audio.aac');
    if (!fs.existsSync(audio)) {
      console.log(' ♪ audio completo…');
      await renderMedia({ serveUrl, composition, inputProps, codec: 'aac', outputLocation: audio + '.tmp.aac', browserExecutable, chromeMode });
      fs.renameSync(audio + '.tmp.aac', audio);
    }

    // unión de tramos + audio normalizado
    const lista = path.join(partesDir, 'concat.txt');
    fs.writeFileSync(lista, tramos.map((_, i) => `file '${path.join(partesDir, `parte-${String(i + 1).padStart(2, '0')}.mp4`)}'`).join('\n'));
    const video = path.join(outDir, draft ? 'largo-draft.video.mp4' : 'largo.video.mp4');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', video]);
    const crudo = path.join(outDir, draft ? 'largo-draft.raw.mp4' : 'largo.raw.mp4');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', crudo]);
    const fin = path.join(outDir, draft ? 'largo-draft.mp4' : 'largo.mp4');
    execFileSync('bash', [path.join(ROOT, 'scripts/normalize-audio.sh'), crudo, fin], { stdio: 'inherit' });
    fs.unlinkSync(crudo);
    fs.unlinkSync(video);
    console.log(`✓ ${fin}  (${(dur(fin) / 60).toFixed(2)} min)`);
  }

  const miniatura = await selectComposition({ serveUrl, id: 'MiniaturaLargo', inputProps, browserExecutable, chromeMode });
  await renderStill({ serveUrl, composition: miniatura, inputProps, output: path.join(outDir, 'miniatura.png'), browserExecutable, chromeMode });
  console.log('✓ miniatura.png');
}

main().catch((e) => {
  console.error('✗', e.message ?? e);
  process.exit(1);
});
