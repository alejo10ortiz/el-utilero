/**
 * Cuadros de un episodio con cada tema visual (revisión de la rotación visual).
 *   npx tsx scripts/stills-temas.ts <slug> <frame,frame,...> [tema,tema,...]
 * Salida: out/stills-temas/<slug>-<tema>-<frame>.png
 */
import path from 'node:path';
import fs from 'node:fs';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { TEMA_IDS } from '../src/lib/tema';

const [slug, framesArg, temasArg] = process.argv.slice(2);
if (!slug || !framesArg) {
  console.error('Uso: tsx scripts/stills-temas.ts <slug> <frame,frame,...> [tema,tema,...]');
  process.exit(1);
}
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'out', 'stills-temas');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
  const chromeMode = browserExecutable ? ('chrome-for-testing' as const) : undefined;
  const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'assets') });
  const temas = temasArg ? temasArg.split(',') : TEMA_IDS;
  for (const tema of temas) {
    const inputProps = { slug, tema };
    const comp = await selectComposition({ serveUrl, id: 'Short', inputProps, browserExecutable, chromeMode });
    for (const f of framesArg.split(',').map(Number)) {
      const output = path.join(outDir, `${slug}-${tema}-${String(f).padStart(5, '0')}.png`);
      await renderStill({ serveUrl, composition: comp, inputProps, frame: Math.min(f, comp.durationInFrames - 1), output, browserExecutable, chromeMode });
      console.log('→', path.relative(root, output));
    }
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
