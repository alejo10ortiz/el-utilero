/**
 * Cuadros de un video largo (revisión visual de cada escena).
 *   npx tsx scripts/stills-largo.ts <slug> <frame,frame,...> [tema]
 * Salida: out/stills-largo/<slug>-<frame>.png
 */
import path from 'node:path';
import fs from 'node:fs';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const [slug, framesArg, tema] = process.argv.slice(2);
if (!slug || !framesArg) {
  console.error('Uso: tsx scripts/stills-largo.ts <slug> <frame,frame,...> [tema]');
  process.exit(1);
}
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'out', 'stills-largo');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
  const chromeMode = browserExecutable ? ('chrome-for-testing' as const) : undefined;
  const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'assets') });
  const inputProps: Record<string, unknown> = { slug };
  if (tema) inputProps.tema = tema;
  const comp = await selectComposition({ serveUrl, id: 'Largo', inputProps, browserExecutable, chromeMode });
  console.log(`Largo: ${comp.width}×${comp.height}, ${comp.durationInFrames} frames (${(comp.durationInFrames / comp.fps).toFixed(1)} s)`);
  for (const f of framesArg.split(',').map(Number)) {
    const output = path.join(outDir, `${slug}-${String(f).padStart(5, '0')}.png`);
    await renderStill({ serveUrl, composition: comp, inputProps, frame: Math.min(f, comp.durationInFrames - 1), output, browserExecutable, chromeMode });
    console.log('→', path.basename(output));
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
