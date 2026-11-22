/**
 * Render de producción de un episodio (BRAND.md §9.4).
 *   npm run render -- 001                 Short 1080×1920 30fps, H.264 CRF 18, AAC 192k, −14 LUFS + miniatura + post
 *   npm run render -- 001 --draft         media resolución, CRF 28 (revisión rápida)
 *   npm run render -- 001 --web           además de short.mp4 (máster, CRF 18) escribe short-web.mp4 (CRF 23, ~la mitad de peso)
 *   npm run render -- 001 --stills        solo miniatura, post y avatar
 *   npm run render -- 001 --skip-verify   salta el verificador editorial (NO recomendado)
 * Salida: out/<slug>/short.mp4 · miniatura.png · post.png · avatar.png
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { ROOT, episodeMediaDir, flag, positional, resolveSlug } from './lib';
import { verificar } from './verify-episode';

async function main() {
  const slug = resolveSlug(positional()[0]);
  const draft = !!flag('draft');
  const soloStills = !!flag('stills');
  const outDir = path.join(ROOT, 'out', slug);
  fs.mkdirSync(outDir, { recursive: true });

  // ── Regla de oro antes de gastar CPU
  if (!flag('skip-verify')) {
    const res = await verificar(slug);
    for (const h of res.filter((x) => x.nivel !== 'OK')) console.log(` ${h.nivel === 'ERROR' ? '✗' : '!'} ${h.msg}`);
    if (res.some((h) => h.nivel === 'ERROR')) {
      console.error('\n✗ El episodio no pasa la verificación editorial. Corrige o usa --skip-verify (solo para pruebas).');
      process.exit(1);
    }
  }
  const tieneVoz = fs.existsSync(path.join(episodeMediaDir(slug), 'voice.mp3'));
  if (!tieneVoz) console.log('! Sin voice.mp3: se renderiza con tiempos ESTIMADOS y sin narración (npm run voice -- ' + slug.slice(0, 3) + ').');

  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
  const chromeMode = browserExecutable ? ('chrome-for-testing' as const) : undefined;
  console.log('Empaquetando…');
  const serveUrl = await bundle({ entryPoint: path.join(ROOT, 'src/index.ts'), publicDir: path.join(ROOT, 'assets') });
  const inputProps = { slug };

  if (!soloStills) {
    const comp = await selectComposition({ serveUrl, id: 'Short', inputProps, browserExecutable, chromeMode });
    console.log(`Short: ${comp.width}×${comp.height} @${comp.fps}fps · ${comp.durationInFrames} frames (${(comp.durationInFrames / comp.fps).toFixed(1)} s)${draft ? ' · BORRADOR' : ''}`);
    const raw = path.join(outDir, draft ? 'short-draft.raw.mp4' : 'short.raw.mp4');
    let last = -1;
    await renderMedia({
      serveUrl, composition: comp, inputProps, codec: 'h264', crf: draft ? 28 : 18, audioBitrate: '192k',
      scale: draft ? 0.5 : 1, outputLocation: raw, browserExecutable, chromeMode, concurrency: Number(process.env.CONCURRENCY ?? 4),
      onProgress: ({ progress }) => {
        const p = Math.floor(progress * 20);
        if (p !== last) {
          last = p;
          process.stdout.write(`\r  ${'█'.repeat(p)}${'░'.repeat(20 - p)} ${Math.round(progress * 100)}%`);
        }
      },
    });
    process.stdout.write('\n');
    const fin = path.join(outDir, draft ? 'short-draft.mp4' : 'short.mp4');
    execFileSync('bash', [path.join(ROOT, 'scripts/normalize-audio.sh'), raw, fin], { stdio: 'inherit' });
    fs.unlinkSync(raw);
    if (flag('web') && !draft) {
      const web = path.join(outDir, 'short-web.mp4');
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', fin, '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-c:a', 'copy', web], { stdio: 'inherit' });
      console.log(`✓ ${web}  (versión ligera para subir)`);
    }
  }

  for (const [id, file] of [['Miniatura', 'miniatura.png'], ['Post', 'post.png'], ['Avatar', 'avatar.png']] as const) {
    const composition = await selectComposition({ serveUrl, id, inputProps, browserExecutable, chromeMode });
    await renderStill({ serveUrl, composition, inputProps, output: path.join(outDir, file), browserExecutable, chromeMode });
    console.log(`✓ ${file}`);
  }
  console.log(`\nListo → out/${slug}/`);
}

main().catch((e) => {
  console.error('✗', e.message ?? e);
  process.exit(1);
});
